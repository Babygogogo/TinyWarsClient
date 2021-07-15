
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Logger                       from "../../tools/helpers/Logger";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import NotifyData                   from "../../tools/notify/NotifyData";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Helpers                      from "../../tools/helpers/Helpers";
import Lang                         from "../../tools/lang/Lang";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarRuleHelpers              from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                    from "../../user/model/UserModel";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import SpmModel                     from "../../singlePlayerMode/model/SpmModel";

namespace ScrCreateModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForPlayerRule       = ProtoTypes.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom     = ProtoTypes.Structure.IDataForPlayerInRoom;

    export type DataForCreateWar    = ProtoTypes.NetMessage.MsgSpmCreateScw.IC;

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
            configVersion   : ConfigManager.getLatestFormalVersion(),
            presetWarRuleId : null,
            warRule         : null,
        },
        settingsForScw: {
            mapId           : undefined,
        },

        playerInfoList  : [],
    };

    function getMapId(): number | null | undefined {
        return getData().settingsForScw.mapId;
    }
    function setMapId(mapId: number): void {
        getData().settingsForScw.mapId = mapId;
    }

    export function getMapBriefData(): Promise<ProtoTypes.Map.IMapBriefData> {
        return WarMapModel.getBriefData(getMapId());
    }
    export function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
        return WarMapModel.getRawData(getMapId());
    }

    export function getPlayerRule(playerIndex: number): IDataForPlayerRule {
        return WarRuleHelpers.getPlayerRule(getWarRule(), playerIndex);
    }
    export function getPlayerInfo(playerIndex: number): IDataForPlayerInRoom {
        return getData().playerInfoList.find(v => v.playerIndex === playerIndex);
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(ConfigManager.getLatestFormalVersion());
        setSaveSlotIndex(SpmModel.getAvailableIndex());
        setSlotComment(null);
        setPlayerInfoList([]);

        const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleAvailability.canScw);
        await resetDataByWarRuleId(warRule ? warRule.ruleId : null);
    }
    export function getData(): DataForCreateWar {
        return _dataForCreateWar;
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule {
        return getData().settingsForCommon.warRule;
    }

    function setConfigVersion(version: string): void {
        getData().settingsForCommon.configVersion = version;
    }
    export function getConfigVersion(): string {
        return getData().settingsForCommon.configVersion;
    }

    export async function resetDataByWarRuleId(ruleId: number | null): Promise<void> {
        if (ruleId == null) {
            await resetDataByCustomWarRuleId();
        } else {
            await resetDataByPresetWarRuleId(ruleId);
        }
    }
    async function resetDataByCustomWarRuleId(): Promise<void> {
        getData().settingsForCommon.warRule = WarRuleHelpers.createDefaultWarRule(null, (await getMapRawData()).playersCountUnneutral);
        setCustomWarRuleId();
        await resetPlayerInfoList();
    }
    async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
        if (ruleId == null) {
            Logger.error(`ScrModel.Create.resetDataByPresetWarRuleId() empty ruleId.`);
            return undefined;
        }

        const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleId === ruleId);
        if (warRule == null) {
            Logger.error(`ScrModel.Create.resetDataByPresetWarRuleId() empty warRule.`);
            return undefined;
        }

        getData().settingsForCommon.warRule = Helpers.deepClone(warRule);
        setPresetWarRuleId(ruleId);
        await resetPlayerInfoList();
    }
    function setPresetWarRuleId(ruleId: number | null | undefined): void {
        const settingsForCommon             = getData().settingsForCommon;
        settingsForCommon.warRule.ruleId    = ruleId;
        settingsForCommon.presetWarRuleId   = ruleId;
        Notify.dispatch(NotifyType.ScrCreatePresetWarRuleIdChanged);
    }
    export function setCustomWarRuleId(): void {
        setPresetWarRuleId(null);
    }
    export function getPresetWarRuleId(): number | undefined {
        return getData().settingsForCommon.presetWarRuleId;
    }
    export async function tickPresetWarRuleId(): Promise<void> {
        const currWarRuleId = getPresetWarRuleId();
        const warRuleArray  = (await getMapRawData()).warRuleArray;
        if (currWarRuleId == null) {
            const warRule = warRuleArray.find(v => v.ruleAvailability.canScw);
            await resetDataByWarRuleId(warRule ? warRule.ruleId : null);
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId).ruleAvailability.canScw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    async function resetPlayerInfoList(): Promise<void> {
        const data              = getData();
        const oldPlayerInfoList = getPlayerInfoList();
        const settingsForCommon = data.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        const configVersion     = settingsForCommon.configVersion;
        const playersCount      = (await getMapRawData()).playersCountUnneutral;
        const newPlayerInfoList : IDataForPlayerInRoom[] = [];

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const oldInfo               = oldPlayerInfoList.find(v => v.playerIndex === playerIndex);
            const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer(warRule, playerIndex, configVersion);
            const newCoId               = WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
            if (oldInfo) {
                const coId = oldInfo.coId;
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
        return getData().playerInfoList;
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
        return getData().slotIndex;
    }

    export function setSlotComment(comment: string | null | undefined): void {
        getData().slotExtraData.slotComment = comment;
    }
    export function getSlotComment(): string | null | undefined {
        return getData().slotExtraData.slotComment;
    }

    export function tickUserId(playerIndex: number): void {
        const playerInfo    = getPlayerInfo(playerIndex);
        playerInfo.userId   = playerInfo.userId ? null : UserModel.getSelfUserId();
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = getPlayerInfoList();
        const targetPlayerData      = playerInfoList.find(v => v.playerIndex === playerIndex);
        const oldSkinId             = targetPlayerData.unitAndTileSkinId;
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
        return getPlayerRule(playerIndex).teamIndex;
    }
    export function tickTeamIndex(playerIndex: number): void {
        setPresetWarRuleId(null);

        const playerRule        = getPlayerRule(playerIndex);
        playerRule.teamIndex    = playerRule.teamIndex % (WarRuleHelpers.getPlayersCount(getWarRule())) + 1;

        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] {
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

    export function getCoId(playerIndex: number): number | undefined {
        return getPlayerInfo(playerIndex).coId;
    }
    export function setCoId(playerIndex: number, coId: number): void {
        getPlayerInfo(playerIndex).coId = coId;
        Notify.dispatch(NotifyType.ScrCreatePlayerInfoChanged, { playerIndex } as NotifyData.ScrCreatePlayerInfoChanged);
    }

    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }
    export function setHasFog(hasFog: boolean): void {
        setPresetWarRuleId(null);

        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function setPrevHasFog(): void {
        setHasFog(!getHasFog());
    }
    export function setNextHasFog(): void {
        setHasFog(!getHasFog());
    }

    export function setInitialFund(playerIndex: number, initialFund: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).initialFund = initialFund;
    }
    export function getInitialFund(playerIndex: number): number {
        return getPlayerRule(playerIndex).initialFund;
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).incomeMultiplier = multiplier;
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return getPlayerRule(playerIndex).incomeMultiplier;
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).energyAddPctOnLoadCo = percentage;
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return getPlayerRule(playerIndex).energyAddPctOnLoadCo;
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).energyGrowthMultiplier = multiplier;
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return getPlayerRule(playerIndex).energyGrowthMultiplier;
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).moveRangeModifier = modifier;
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return getPlayerRule(playerIndex).moveRangeModifier;
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).attackPowerModifier = modifier;
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return getPlayerRule(playerIndex).attackPowerModifier;
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).visionRangeModifier = modifier;
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return getPlayerRule(playerIndex).visionRangeModifier;
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).luckLowerLimit = limit;
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return getPlayerRule(playerIndex).luckLowerLimit;
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        setPresetWarRuleId(null);

        getPlayerRule(playerIndex).luckUpperLimit = limit;
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return getPlayerRule(playerIndex).luckUpperLimit;
    }

    export function getInvalidParamTips(): string | null{
        const teamSet = new Set<number>();
        for (const playerRule of getWarRule().ruleForPlayers.playerRuleDataArray) {
            teamSet.add(playerRule.teamIndex);
        }
        if (teamSet.size <= 1) {
            return Lang.getText(LangTextType.A0069);
        }

        return null;
    }
}

export default ScrCreateModel;
