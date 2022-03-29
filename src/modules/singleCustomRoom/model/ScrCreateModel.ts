
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
namespace ScrCreateModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForPlayerRule       = CommonProto.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom     = CommonProto.Structure.IDataForPlayerInRoom;

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
            presetWarRuleId : null,
            warRule         : null,
        },
        settingsForScw: {
            mapId           : 0,
        },

        playerInfoList  : [],
    };

    export function getMapId(): number {
        return Helpers.getExisted(getData().settingsForScw?.mapId);
    }
    function setMapId(mapId: number): void {
        Helpers.getExisted(getData().settingsForScw).mapId = mapId;
    }

    export async function getMapBriefData(): Promise<CommonProto.Map.IMapBriefData> {
        return Helpers.getExisted(await WarMapModel.getBriefData(getMapId()));
    }
    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
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
        await resetDataByWarRuleId(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleAvailability?.canScw)?.ruleId));
    }
    export function getData(): DataForCreateWar {
        return _dataForCreateWar;
    }
    export function getSettingsForCommon(): CommonProto.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    export function getWarRule(): CommonProto.WarRule.IWarRule {
        return Helpers.getExisted(getSettingsForCommon().warRule);
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    export function getConfigVersion(): string {
        return Helpers.getExisted(getSettingsForCommon().configVersion);
    }

    export async function resetDataByWarRuleId(ruleId: number | null): Promise<void> {
        if (ruleId == null) {
            await resetDataByCustomWarRuleId();
        } else {
            await resetDataByPresetWarRuleId(ruleId);
        }
    }
    async function resetDataByCustomWarRuleId(): Promise<void> {
        getSettingsForCommon().warRule = WarRuleHelpers.createDefaultWarRule(null, Helpers.getExisted((await getMapRawData()).playersCountUnneutral));
        setCustomWarRuleId();
        await resetPlayerInfoList();
    }
    async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
        getSettingsForCommon().warRule = Helpers.deepClone(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleId === ruleId)));
        setPresetWarRuleId(ruleId);
        await resetPlayerInfoList();
    }
    function setPresetWarRuleId(ruleId: number | null): void {
        getWarRule().ruleId                     = ruleId;
        getSettingsForCommon().presetWarRuleId  = ruleId;
        Notify.dispatch(NotifyType.ScrCreatePresetWarRuleIdChanged);
    }
    export function setCustomWarRuleId(): void {
        setPresetWarRuleId(null);
    }
    export function getPresetWarRuleId(): number | null {
        return getSettingsForCommon().presetWarRuleId ?? null;
    }
    export async function tickPresetWarRuleId(): Promise<void> {
        const currWarRuleId = getPresetWarRuleId();
        const warRuleArray  = Helpers.getExisted((await getMapRawData()).warRuleArray);
        if (currWarRuleId == null) {
            await resetDataByWarRuleId(Helpers.getExisted(warRuleArray.find(v => v.ruleAvailability?.canScw)?.ruleId));
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId)?.ruleAvailability?.canScw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    async function resetPlayerInfoList(): Promise<void> {
        const data              = getData();
        const oldPlayerInfoList = getPlayerInfoList();
        const settingsForCommon = Helpers.getExisted(data.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const configVersion     = Helpers.getExisted(settingsForCommon.configVersion);
        const playersCount      = Helpers.getExisted((await getMapRawData()).playersCountUnneutral);
        const newPlayerInfoList : IDataForPlayerInRoom[] = [];

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const oldInfo               = oldPlayerInfoList.find(v => v.playerIndex === playerIndex);
            const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer({ warRule, playerIndex, configVersion });
            const newCoId               = WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
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
        setPresetWarRuleId(null);

        const playerRule        = getPlayerRule(playerIndex);
        playerRule.teamIndex    = Helpers.getExisted(playerRule.teamIndex) % (WarRuleHelpers.getPlayersCountUnneutral(getWarRule())) + 1;

        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] | null {
        return WarRuleHelpers.getBannedCoIdArray(getWarRule(), playerIndex);
    }
    export function addBannedCoId(playerIndex: number, coId: number): void {
        WarRuleHelpers.addBannedCoId(getWarRule(), playerIndex, coId);
    }
    export function deleteBannedCoId(playerIndex: number, coId: number): void {
        WarRuleHelpers.deleteBannedCoId(getWarRule(), playerIndex, coId);
    }
    export function setBannedCoIdArray(playerIndex: number, coIdSet: Set<number>): void {
        WarRuleHelpers.setBannedCoIdArray(getWarRule(), playerIndex, coIdSet);
    }

    export function getCoId(playerIndex: number): number {
        return Helpers.getExisted(getPlayerInfo(playerIndex).coId);
    }
    export function setCoId(playerIndex: number, coId: number): void {
        getPlayerInfo(playerIndex).coId = coId;
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getHasFog(): boolean {
        return Helpers.getExisted(getWarRule().ruleForGlobalParams?.hasFogByDefault);
    }
    export function setHasFog(hasFog: boolean): void {
        setPresetWarRuleId(null);

        Helpers.getExisted(getWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function setPrevHasFog(): void {
        setHasFog(!getHasFog());
    }
    export function setNextHasFog(): void {
        setHasFog(!getHasFog());
    }

    export function tickDefaultWeatherType(): void {
        WarRuleHelpers.tickDefaultWeatherType(getWarRule(), getConfigVersion());
    }

    export function setInitialFund(playerIndex: number, initialFund: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).initialFund = initialFund;
    }
    export function getInitialFund(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).initialFund);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).incomeMultiplier = multiplier;
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).incomeMultiplier);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).energyAddPctOnLoadCo = percentage;
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyAddPctOnLoadCo);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).energyGrowthMultiplier = multiplier;
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).energyGrowthMultiplier);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).moveRangeModifier = modifier;
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).moveRangeModifier);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).attackPowerModifier = modifier;
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).attackPowerModifier);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).visionRangeModifier = modifier;
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).visionRangeModifier);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).luckLowerLimit = limit;
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(playerIndex).luckLowerLimit);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).luckUpperLimit = limit;
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

// export default ScrCreateModel;
