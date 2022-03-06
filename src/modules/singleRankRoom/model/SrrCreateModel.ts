
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
namespace SrrCreateModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForPlayerRule       = ProtoTypes.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom     = ProtoTypes.Structure.IDataForPlayerInRoom;

    export type DataForCreateWar    = ProtoTypes.NetMessage.MsgSpmCreateSrw.IC;

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
            presetWarRuleId : null,
            warRule         : null,
        },
        mapId               : 0,

        playerInfoList      : [],
    };

    export function getMapId(): number {
        return Helpers.getExisted(getData().mapId);
    }
    function setMapId(mapId: number): void {
        getData().mapId = mapId;
    }

    export async function getMapBriefData(): Promise<ProtoTypes.Map.IMapBriefData> {
        return Helpers.getExisted(await WarMapModel.getBriefData(getMapId()));
    }
    export async function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
        return Helpers.getExisted(await WarMapModel.getRawData(getMapId()));
    }

    export function getPlayerRule(playerIndex: number): IDataForPlayerRule {
        return WarRuleHelpers.getPlayerRule(getWarRule(), playerIndex);
    }
    export function getPlayerInfo(playerIndex: number): IDataForPlayerInRoom {
        return Helpers.getExisted(getData().playerInfoList?.find(v => v.playerIndex === playerIndex));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(Helpers.getExisted(ConfigManager.getLatestConfigVersion()));
        setSaveSlotIndex(SpmModel.getAvailableIndex());
        setSlotComment(null);
        setPlayerInfoList([]);
        await resetDataByWarRuleId(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleAvailability?.canSrw)?.ruleId));
    }
    export function getData(): DataForCreateWar {
        return _dataForCreateWar;
    }
    export function getSettingsForCommon(): ProtoTypes.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule {
        return Helpers.getExisted(getSettingsForCommon().warRule);
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    export function getConfigVersion(): string {
        return Helpers.getExisted(getSettingsForCommon().configVersion);
    }

    export async function resetDataByWarRuleId(ruleId: number): Promise<void> {
        await resetDataByPresetWarRuleId(ruleId);
    }
    async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
        getSettingsForCommon().warRule = Helpers.deepClone(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleId === ruleId)));
        setPresetWarRuleId(ruleId);
        await resetPlayerInfoList();
    }
    function setPresetWarRuleId(ruleId: number): void {
        getWarRule().ruleId                     = ruleId;
        getSettingsForCommon().presetWarRuleId  = ruleId;
        Notify.dispatch(NotifyType.SrrCreatePresetWarRuleIdChanged);
    }
    export function getPresetWarRuleId(): number | null {
        return getSettingsForCommon().presetWarRuleId ?? null;
    }
    export async function tickPresetWarRuleId(): Promise<void> {
        const currWarRuleId = getPresetWarRuleId();
        const warRuleArray  = Helpers.getExisted((await getMapRawData()).warRuleArray);
        if (currWarRuleId == null) {
            await resetDataByWarRuleId(Helpers.getExisted(warRuleArray.find(v => v.ruleAvailability?.canSrw)?.ruleId));
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId)?.ruleAvailability?.canSrw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    async function resetPlayerInfoList(): Promise<void> {
        const data                  = getData();
        const oldPlayerInfoList     = getPlayerInfoList();
        const settingsForCommon     = Helpers.getExisted(data.settingsForCommon);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule);
        const configVersion         = Helpers.getExisted(settingsForCommon.configVersion);
        const playersCount          = Helpers.getExisted((await getMapRawData()).playersCountUnneutral);
        const playerRuleDataArray   = Helpers.getExisted(warRule.ruleForPlayers?.playerRuleDataArray);
        const selfUserId            = UserModel.getSelfUserId();
        const newPlayerInfoList     : IDataForPlayerInRoom[] = [];

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const coIdForAi             = playerRuleDataArray.find(v => v.playerIndex === playerIndex)?.fixedCoIdInSrw;
            const oldInfo               = oldPlayerInfoList.find(v => v.playerIndex === playerIndex);
            const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer({ warRule, playerIndex, configVersion });
            const newCoId               = WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
            if (oldInfo) {
                const coId = Helpers.getExisted(oldInfo.coId);
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
        return Helpers.getExisted(getData().playerInfoList);
    }
    function setPlayerInfoList(list: IDataForPlayerInRoom[]): void {
        getData().playerInfoList = list;
    }

    export function setSaveSlotIndex(slotIndex: number): void {
        const data = getData();
        if (data.slotIndex !== slotIndex) {
            data.slotIndex = slotIndex;
            Notify.dispatch(NotifyType.SrrCreateWarSaveSlotChanged);
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

    export function tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = getPlayerInfoList();
        const targetPlayerData      = Helpers.getExisted(playerInfoList.find(v => v.playerIndex === playerIndex));
        const oldSkinId             = Helpers.getExisted(targetPlayerData.unitAndTileSkinId);
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
        Notify.dispatch(NotifyType.SrrCreatePlayerInfoChanged, { playerIndex } as NotifyData.SrrCreatePlayerInfoChanged);
    }

    export function getTeamIndex(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).teamIndex);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] | null {
        return WarRuleHelpers.getBannedCoIdArray(getWarRule(), playerIndex);
    }

    export function getCoId(playerIndex: number): number {
        return Helpers.getExisted(getPlayerInfo(playerIndex).coId);
    }
    export function setCoId(playerIndex: number, coId: number): void {
        getPlayerInfo(playerIndex).coId = coId;
        Notify.dispatch(NotifyType.SrrCreatePlayerInfoChanged, { playerIndex } as NotifyData.SrrCreatePlayerInfoChanged);
    }

    export function getHasFog(): boolean {
        return Helpers.getExisted(getWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function getInitialFund(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).initialFund);
    }

    export function getIncomeMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).incomeMultiplier);
    }

    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyAddPctOnLoadCo);
    }

    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyGrowthMultiplier);
    }

    export function getMoveRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).moveRangeModifier);
    }

    export function getAttackPowerModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).attackPowerModifier);
    }

    export function getVisionRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).visionRangeModifier);
    }

    export function getLuckLowerLimit(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).luckLowerLimit);
    }

    export function getLuckUpperLimit(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).luckUpperLimit);
    }

    export function getInvalidParamTips(): string | null{
        const teamSet = new Set<number>();
        for (const playerRule of Helpers.getExisted(getWarRule().ruleForPlayers?.playerRuleDataArray)) {
            teamSet.add(Helpers.getExisted(playerRule.teamIndex));
        }
        if (teamSet.size <= 1) {
            return Lang.getText(LangTextType.A0069);
        }

        return null;
    }
}

// export default SrrCreateModel;
