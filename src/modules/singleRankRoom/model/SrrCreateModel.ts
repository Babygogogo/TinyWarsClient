
// import SpmModel             from "../../singlePlayerMode/model/SpmModel";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import NotifyData           from "../../tools/notify/NotifyData";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel            from "../../user/model/UserModel";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleRankRoom.SrrCreateModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import IDataForPlayerRule       = CommonProto.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom     = CommonProto.Structure.IDataForPlayerInRoom;
    import GameConfig               = Config.GameConfig;

    export type DataForCreateWar    = CommonProto.NetMessage.MsgSpmCreateSrw.IC;

    export function init(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for creating wars.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _dataForCreateWar: DataForCreateWar = {
        slotIndex           : 0,
        slotExtraData       : {
            slotComment     : null,
        },
        settingsForCommon   : {
            configVersion   : null,
            instanceWarRule : {
                templateWarRuleId   : null,
            },
        },
        mapId               : 0,

        playerInfoList      : [],
    };
    let _gameConfig: GameConfig | null = null;

    export function getMapId(): number {
        return Twns.Helpers.getExisted(getData().mapId);
    }
    function setMapId(mapId: number): void {
        getData().mapId = mapId;
    }

    export async function getMapBriefData(): Promise<CommonProto.Map.IMapBriefData> {
        return Twns.Helpers.getExisted(await WarMap.WarMapModel.getBriefData(getMapId()));
    }
    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
        return Twns.Helpers.getExisted(await WarMap.WarMapModel.getRawData(getMapId()));
    }

    export function getPlayerRule(playerIndex: number): IDataForPlayerRule {
        return WarHelpers.WarRuleHelpers.getPlayerRule(getInstanceWarRule(), playerIndex);
    }
    export function getPlayerInfo(playerIndex: number): IDataForPlayerInRoom {
        return Twns.Helpers.getExisted(getData().playerInfoList?.find(v => v.playerIndex === playerIndex));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(Twns.Helpers.getExisted(Config.ConfigManager.getLatestConfigVersion()));
        setGameConfig(await Config.ConfigManager.getLatestGameConfig());
        setSaveSlotIndex(await SinglePlayerMode.SpmModel.getAvailableIndex());
        setSlotComment(null);
        setPlayerInfoList([]);
        await resetDataByTemplateWarRuleId(Twns.Helpers.getExisted((await getMapRawData()).templateWarRuleArray?.find(v => v.ruleAvailability?.canSrw)?.ruleId));
    }
    export function getData(): DataForCreateWar {
        return _dataForCreateWar;
    }
    export function getSettingsForCommon(): CommonProto.WarSettings.ISettingsForCommon {
        return Twns.Helpers.getExisted(getData().settingsForCommon);
    }
    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Twns.Helpers.getExisted(getSettingsForCommon().instanceWarRule);
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    function setGameConfig(config: GameConfig): void {
        _gameConfig = config;
    }
    export function getGameConfig(): GameConfig {
        return Twns.Helpers.getExisted(_gameConfig);
    }

    export async function resetDataByTemplateWarRuleId(templateWarRuleId: number): Promise<void> {
        const mapRawData        = await getMapRawData();
        const templateWarRule   = Twns.Helpers.getExisted(mapRawData.templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId));
        getSettingsForCommon().instanceWarRule = WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData);
        await resetPlayerInfoList();

        Twns.Notify.dispatch(NotifyType.SrrCreateModelTemplateWarRuleIdChanged);
    }
    function getTemplateWarRuleId(): number | null {
        return getInstanceWarRule().templateWarRuleId ?? null;
    }
    export async function tickTemplateWarRuleId(): Promise<void> {
        const templateWarRuleArray  = Twns.Helpers.getExisted((await getMapRawData()).templateWarRuleArray);
        const currTemplateWarRuleId = getTemplateWarRuleId();
        if (currTemplateWarRuleId == null) {
            await resetDataByTemplateWarRuleId(Twns.Helpers.getExisted(templateWarRuleArray.find(v => v.ruleAvailability?.canSrw)?.ruleId));
        } else {
            const newTemplateWarRuleId = Twns.Helpers.getNonNullElements(templateWarRuleArray.filter(v => v.ruleAvailability?.canSrw).map(v => v.ruleId)).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
        }
    }

    async function resetPlayerInfoList(): Promise<void> {
        const data                  = getData();
        const oldPlayerInfoList     = getPlayerInfoList();
        const settingsForCommon     = Twns.Helpers.getExisted(data.settingsForCommon);
        const instanceWarRule       = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
        const gameConfig            = await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion));
        const playersCount          = Twns.Helpers.getExisted((await getMapRawData()).playersCountUnneutral);
        const playerRuleDataArray   = Twns.Helpers.getExisted(instanceWarRule.ruleForPlayers?.playerRuleDataArray);
        const selfUserId            = Twns.User.UserModel.getSelfUserId();
        const newPlayerInfoList     : IDataForPlayerInRoom[] = [];

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const coIdForAi             = playerRuleDataArray.find(v => v.playerIndex === playerIndex)?.fixedCoIdInSrw;
            const oldInfo               = oldPlayerInfoList.find(v => v.playerIndex === playerIndex);
            const availableCoIdArray    = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayForPlayer({ baseWarRule: instanceWarRule, playerIndex, gameConfig });
            const newCoId               = WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
            if (oldInfo) {
                const coId = Twns.Helpers.getExisted(oldInfo.coId);
                newPlayerInfoList.push({
                    playerIndex,
                    isReady             : true,
                    userId              : coIdForAi == null ? selfUserId : null,
                    unitAndTileSkinId   : oldInfo.unitAndTileSkinId,
                    coId                : coIdForAi ?? (availableCoIdArray.indexOf(coId) >= 0 ? coId : newCoId),
                });
            } else {
                newPlayerInfoList.push({
                    playerIndex,
                    isReady             : true,
                    userId              : coIdForAi == null ? selfUserId : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : coIdForAi ?? newCoId,
                });
            }
        }
        setPlayerInfoList(newPlayerInfoList);
    }
    export function getPlayerInfoList(): IDataForPlayerInRoom[] {
        return Twns.Helpers.getExisted(getData().playerInfoList);
    }
    function setPlayerInfoList(list: IDataForPlayerInRoom[]): void {
        getData().playerInfoList = list;
    }

    export function setSaveSlotIndex(slotIndex: number): void {
        const data = getData();
        if (data.slotIndex !== slotIndex) {
            data.slotIndex = slotIndex;
            Twns.Notify.dispatch(NotifyType.SrrCreateWarSaveSlotChanged);
        }
    }
    export function getSaveSlotIndex(): number {
        return Twns.Helpers.getExisted(getData().slotIndex);
    }

    export function setSlotComment(comment: string | null): void {
        Twns.Helpers.getExisted(getData().slotExtraData).slotComment = comment;
    }
    export function getSlotComment(): string | null {
        return getData().slotExtraData?.slotComment ?? null;
    }

    export function tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = getPlayerInfoList();
        const targetPlayerData      = Twns.Helpers.getExisted(playerInfoList.find(v => v.playerIndex === playerIndex));
        const oldSkinId             = Twns.Helpers.getExisted(targetPlayerData.unitAndTileSkinId);
        const newSkinId             = oldSkinId % CommonConstants.UnitAndTileMaxSkinId + 1;
        // const existingPlayerData    = playerInfoList.find(v => v.unitAndTileSkinId === newSkinId);
        // if (existingPlayerData) {
        //     existingPlayerData.unitAndTileSkinId = oldSkinId;
        //     Notify.dispatch(
        //         NotifyType.SrrCreatePlayerInfoChanged,
        //         { playerIndex: existingPlayerData.playerIndex } as NotifyData.SrrCreatePlayerInfoChanged
        //     );
        // }

        targetPlayerData.unitAndTileSkinId = newSkinId;
        Twns.Notify.dispatch(NotifyType.SrrCreatePlayerInfoChanged, { playerIndex } as Twns.Notify.NotifyData.SrrCreatePlayerInfoChanged);
    }

    export function getTeamIndex(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).teamIndex);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] | null {
        return WarHelpers.WarRuleHelpers.getBannedCoIdArray(getInstanceWarRule(), playerIndex);
    }

    export function getCoId(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerInfo(playerIndex).coId);
    }
    export function setCoId(playerIndex: number, coId: number): void {
        getPlayerInfo(playerIndex).coId = coId;
        Twns.Notify.dispatch(NotifyType.SrrCreatePlayerInfoChanged, { playerIndex } as Twns.Notify.NotifyData.SrrCreatePlayerInfoChanged);
    }

    export function getHasFog(): boolean {
        return Twns.Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function getInitialFund(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).initialFund);
    }

    export function getIncomeMultiplier(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).incomeMultiplier);
    }

    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).energyAddPctOnLoadCo);
    }

    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).energyGrowthMultiplier);
    }

    export function getMoveRangeModifier(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).moveRangeModifier);
    }

    export function getAttackPowerModifier(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).attackPowerModifier);
    }

    export function getVisionRangeModifier(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).visionRangeModifier);
    }

    export function getLuckLowerLimit(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).luckLowerLimit);
    }

    export function getLuckUpperLimit(playerIndex: number): number {
        return Twns.Helpers.getExisted(getPlayerRule(playerIndex).luckUpperLimit);
    }

    export function getInvalidParamTips(): string | null{
        const teamSet = new Set<number>();
        for (const playerRule of Twns.Helpers.getExisted(getInstanceWarRule().ruleForPlayers?.playerRuleDataArray)) {
            teamSet.add(Twns.Helpers.getExisted(playerRule.teamIndex));
        }
        if (teamSet.size <= 1) {
            return Lang.getText(LangTextType.A0069);
        }

        return null;
    }
}

// export default SrrCreateModel;
