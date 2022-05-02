
// import SpmModel             from "../../singlePlayerMode/model/SpmModel";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import NotifyData           from "../../tools/notify/NotifyData";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel            from "../../user/model/UserModel";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleCustomRoom.ScrCreateModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForPlayerRule       = CommonProto.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom     = CommonProto.Structure.IDataForPlayerInRoom;
    import GameConfig               = Config.GameConfig;

    export type DataForCreateWar    = CommonProto.NetMessage.MsgSpmCreateScw.IC;

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
        settingsForScw: {
            mapId           : 0,
        },

        playerInfoList  : [],
    };
    let _gameConfig     : GameConfig | null = null;

    export function getMapId(): number {
        return Helpers.getExisted(getData().settingsForScw?.mapId);
    }
    function setMapId(mapId: number): void {
        Helpers.getExisted(getData().settingsForScw).mapId = mapId;
    }

    export async function getMapBriefData(): Promise<CommonProto.Map.IMapBriefData> {
        return Helpers.getExisted(await WarMap.WarMapModel.getBriefData(getMapId()));
    }
    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
        return Helpers.getExisted(await WarMap.WarMapModel.getRawData(getMapId()));
    }

    export function getPlayerRule(playerIndex: number): IDataForPlayerRule {
        return WarHelpers.WarRuleHelpers.getPlayerRule(getInstanceWarRule(), playerIndex);
    }
    export function getPlayerInfo(playerIndex: number): IDataForPlayerInRoom {
        return Helpers.getExisted(getData().playerInfoList?.find(v => v.playerIndex === playerIndex));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        const configVersion = Helpers.getExisted(Config.ConfigManager.getLatestConfigVersion());
        setMapId(mapId);
        setConfigVersion(configVersion);
        setGameConfig(await Config.ConfigManager.getGameConfig(configVersion));
        setSaveSlotIndex(await SinglePlayerMode.SpmModel.getAvailableIndex());
        setSlotComment(null);
        setPlayerInfoList([]);
        await resetDataByTemplateWarRuleId(Helpers.getExisted((await getMapRawData()).templateWarRuleArray?.find(v => v.ruleAvailability?.canScw)?.ruleId));
    }
    export function getData(): DataForCreateWar {
        return _dataForCreateWar;
    }
    export function getSettingsForCommon(): CommonProto.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Helpers.getExisted(getSettingsForCommon().instanceWarRule);
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    function setGameConfig(config: GameConfig): void {
        _gameConfig = config;
    }
    export function getGameConfig(): GameConfig {
        return Helpers.getExisted(_gameConfig);
    }

    export async function resetDataByTemplateWarRuleId(templateWarRuleId: number): Promise<void> {
        const mapRawData                        = await getMapRawData();
        const templateWarRule                   = Helpers.getExisted(mapRawData.templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId));
        getSettingsForCommon().instanceWarRule  = WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData);

        await resetPlayerInfoList();
        Notify.dispatch(NotifyType.ScrCreateTemplateWarRuleIdChanged);
    }
    export function setCustomWarRuleId(): void {
        const instanceWarRule               = getInstanceWarRule();
        instanceWarRule.templateWarRuleId   = null;
        Notify.dispatch(NotifyType.ScrCreateTemplateWarRuleIdChanged);
    }
    export function getTemplateWarRuleId(): number | null {
        return getInstanceWarRule().templateWarRuleId ?? null;
    }
    export async function tickTemplateWarRuleId(): Promise<void> {
        const currTemplateWarRuleId = getTemplateWarRuleId();
        const templateWarRuleArray  = Helpers.getExisted((await getMapRawData()).templateWarRuleArray);
        if (currTemplateWarRuleId == null) {
            await resetDataByTemplateWarRuleId(Helpers.getExisted(templateWarRuleArray.find(v => v.ruleAvailability?.canScw)?.ruleId));
        } else {
            const newTemplateWarRuleId = Helpers.getNonNullElements(templateWarRuleArray.filter(v => v.ruleAvailability?.canScw).map(v => v.ruleId)).sort((v1, v2) => {
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
        const data              = getData();
        const oldPlayerInfoList = getPlayerInfoList();
        const settingsForCommon = Helpers.getExisted(data.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const gameConfig        = getGameConfig();
        const playersCount      = Helpers.getExisted((await getMapRawData()).playersCountUnneutral);
        const newPlayerInfoList : IDataForPlayerInRoom[] = [];

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const oldInfo               = oldPlayerInfoList.find(v => v.playerIndex === playerIndex);
            const availableCoIdArray    = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayForPlayer({ baseWarRule: instanceWarRule, playerIndex, gameConfig });
            const newCoId               = WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
            if (oldInfo) {
                const coId = Helpers.getExisted(oldInfo.coId);
                newPlayerInfoList.push({
                    playerIndex,
                    isReady             : true,
                    userId              : oldInfo.userId,
                    unitAndTileSkinId   : oldInfo.unitAndTileSkinId,
                    coId                : availableCoIdArray.indexOf(coId) >= 0 ? coId : newCoId,
                });
            } else {
                newPlayerInfoList.push({
                    playerIndex,
                    isReady             : true,
                    userId              : playerIndex === 1 ? UserModel.getSelfUserId() : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : newCoId,
                });
            }
        }
        setPlayerInfoList(newPlayerInfoList);
    }
    export function getPlayerInfoList(): IDataForPlayerInRoom[] {
        return Helpers.getExisted(getData().playerInfoList);
    }
    function setPlayerInfoList(list: IDataForPlayerInRoom[]): void {
        getData().playerInfoList = list;
    }

    export function setSaveSlotIndex(slotIndex: number): void {
        const data = getData();
        if (data.slotIndex !== slotIndex) {
            data.slotIndex = slotIndex;
            Notify.dispatch(NotifyType.ScrCreateWarSaveSlotChanged);
        }
    }
    export function getSaveSlotIndex(): number {
        return Helpers.getExisted(getData().slotIndex);
    }

    export function setSlotComment(comment: string | null): void {
        Helpers.getExisted(getData().slotExtraData).slotComment = comment;
    }
    export function getSlotComment(): string | null {
        return getData().slotExtraData?.slotComment ?? null;
    }

    export function tickUserId(playerIndex: number): void {
        const playerInfo    = getPlayerInfo(playerIndex);
        playerInfo.userId   = playerInfo.userId ? null : UserModel.getSelfUserId();
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = getPlayerInfoList();
        const targetPlayerData      = Helpers.getExisted(playerInfoList.find(v => v.playerIndex === playerIndex));
        const oldSkinId             = Helpers.getExisted(targetPlayerData.unitAndTileSkinId);
        const newSkinId             = oldSkinId % CommonConstants.UnitAndTileMaxSkinId + 1;
        const existingPlayerData    = playerInfoList.find(v => v.unitAndTileSkinId === newSkinId);
        if (existingPlayerData) {
            existingPlayerData.unitAndTileSkinId = oldSkinId;
            Notify.dispatch(
                NotifyType.ScrCreatePlayerInfoChanged,
                { playerIndex: existingPlayerData.playerIndex } as NotifyData.ScrCreatePlayerInfoChanged
            );
        }

        targetPlayerData.unitAndTileSkinId = newSkinId;
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getTeamIndex(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).teamIndex);
    }
    export function tickTeamIndex(playerIndex: number): void {
        setCustomWarRuleId();

        const playerRule        = getPlayerRule(playerIndex);
        playerRule.teamIndex    = Helpers.getExisted(playerRule.teamIndex) % (WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(getInstanceWarRule())) + 1;

        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] | null {
        return WarHelpers.WarRuleHelpers.getBannedCoIdArray(getInstanceWarRule(), playerIndex);
    }
    export function addBannedCoId(playerIndex: number, coId: number): void {
        WarHelpers.WarRuleHelpers.addBannedCoId(getInstanceWarRule(), playerIndex, coId);
    }
    export function deleteBannedCoId(playerIndex: number, coId: number): void {
        WarHelpers.WarRuleHelpers.deleteBannedCoId(getInstanceWarRule(), playerIndex, coId);
    }
    export function setBannedCoIdArray(playerIndex: number, coIdSet: Set<number>): void {
        WarHelpers.WarRuleHelpers.setBannedCoIdArray(getInstanceWarRule(), playerIndex, coIdSet);
    }

    export function getCoId(playerIndex: number): number {
        return Helpers.getExisted(getPlayerInfo(playerIndex).coId);
    }
    export function setCoId(playerIndex: number, coId: number): void {
        getPlayerInfo(playerIndex).coId = coId;
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getHasFog(): boolean {
        return Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault);
    }
    export function setHasFog(hasFog: boolean): void {
        setCustomWarRuleId();

        Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function setPrevHasFog(): void {
        setHasFog(!getHasFog());
    }
    export function setNextHasFog(): void {
        setHasFog(!getHasFog());
    }

    export function tickDefaultWeatherType(): void {
        WarHelpers.WarRuleHelpers.tickDefaultWeatherType(getInstanceWarRule(), getGameConfig());
    }

    export function setInitialFund(playerIndex: number, initialFund: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).initialFund = initialFund;
    }
    export function getInitialFund(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).initialFund);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).incomeMultiplier = multiplier;
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).incomeMultiplier);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).energyAddPctOnLoadCo = percentage;
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyAddPctOnLoadCo);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).energyGrowthMultiplier = multiplier;
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyGrowthMultiplier);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).moveRangeModifier = modifier;
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).moveRangeModifier);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).attackPowerModifier = modifier;
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).attackPowerModifier);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).visionRangeModifier = modifier;
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).visionRangeModifier);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).luckLowerLimit = limit;
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).luckLowerLimit);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        setCustomWarRuleId();

        getPlayerRule(playerIndex).luckUpperLimit = limit;
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).luckUpperLimit);
    }

    export function getInvalidParamTips(): string | null{
        const teamSet = new Set<number>();
        for (const playerRule of Helpers.getExisted(getInstanceWarRule().ruleForPlayers?.playerRuleDataArray)) {
            teamSet.add(Helpers.getExisted(playerRule.teamIndex));
        }
        if (teamSet.size <= 1) {
            return Lang.getText(LangTextType.A0069);
        }

        return null;
    }
}

// export default ScrCreateModel;
