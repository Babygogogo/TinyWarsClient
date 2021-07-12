
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Helpers }                      from "../../../utility/Helpers";
import { Logger }                       from "../../../utility/Logger";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType }               from "../../../utility/notify/NotifyType";
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { BwWarRuleHelpers }              from "../../baseWar/model/BwWarRuleHelpers";

export namespace McrCreateModel {
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import BootTimerType                    = Types.BootTimerType;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMcrJoinRoom.IC;

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForCommon       : {},
        settingsForMcw          : {},

        selfCoId                : null,
        selfPlayerIndex         : null,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
    };

    export function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
        return WarMapModel.getRawData(getMapId());
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(ConfigManager.getLatestFormalVersion());
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);

        const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleAvailability.canMcw);
        await resetDataByWarRuleId(warRule ? warRule.ruleId : null);
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule {
        return getData().settingsForCommon.warRule;
    }

    export function getMapId(): number {
        return getData().settingsForMcw.mapId;
    }
    function setMapId(mapId: number): void {
        getData().settingsForMcw.mapId = mapId;
    }

    function setConfigVersion(version: string): void {
        getData().settingsForCommon.configVersion = version;
    }

    export async function resetDataByWarRuleId(ruleId: number | null): Promise<void> {
        if (ruleId == null) {
            await resetDataByCustomWarRuleId();
        } else {
            await resetDataByPresetWarRuleId(ruleId);
        }
    }
    async function resetDataByCustomWarRuleId(): Promise<void> {
        const settingsForCommon     = getData().settingsForCommon;
        const warRule               = BwWarRuleHelpers.createDefaultWarRule(null, (await getMapRawData()).playersCountUnneutral);
        settingsForCommon.warRule   = warRule;
        setCustomWarRuleId();

        const availableCoIdArray = BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(warRule, getSelfPlayerIndex(), settingsForCommon.configVersion);
        if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
            setSelfCoId(BwWarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
        if (ruleId == null) {
            Logger.error(`McwModel.resetDataByPresetWarRuleId() empty ruleId.`);
            return undefined;
        }

        const warRule = (await getMapRawData()).warRuleArray.find(r => r.ruleId === ruleId);
        if (warRule == null) {
            Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
            return undefined;
        }

        const settingsForCommon     = getData().settingsForCommon;
        settingsForCommon.warRule   = Helpers.deepClone(warRule);
        setPresetWarRuleId(ruleId);

        const availableCoIdArray = BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(warRule, getSelfPlayerIndex(), settingsForCommon.configVersion);
        if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
            setSelfCoId(BwWarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    function setPresetWarRuleId(ruleId: number | null | undefined): void {
        const settingsForCommon             = getData().settingsForCommon;
        settingsForCommon.warRule.ruleId    = ruleId;
        settingsForCommon.presetWarRuleId   = ruleId;
        Notify.dispatch(NotifyType.McrCreatePresetWarRuleIdChanged);
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
            const warRule = warRuleArray.find(v => v.ruleAvailability.canMcw);
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
                if (warRuleArray.find(v => v.ruleId === ruleId).ruleAvailability.canMcw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    export function setWarName(name: string): void {
        getData().settingsForMcw.warName = name;
    }
    export function getWarName(): string {
        return getData().settingsForMcw.warName;
    }

    export function setWarPassword(password: string): void {
        getData().settingsForMcw.warPassword = password;
    }
    export function getWarPassword(): string {
        return getData().settingsForMcw.warPassword;
    }

    export function setWarComment(comment: string): void {
        getData().settingsForMcw.warComment = comment;
    }
    export function getWarComment(): string {
        return getData().settingsForMcw.warComment;
    }

    export function setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== getSelfPlayerIndex()) {
            getData().selfPlayerIndex = playerIndex;
            Notify.dispatch(NotifyType.McrCreateSelfPlayerIndexChanged);
        }
    }
    // export async function tickSelfPlayerIndex(): Promise<void> {
    //     setSelfPlayerIndex(getSelfPlayerIndex() % BwWarRuleHelper.getPlayersCount(getWarRule()) + 1);
    // }
    export function getSelfPlayerIndex(): number {
        return getData().selfPlayerIndex;
    }

    export function setSelfCoId(coId: number): void {
        if (getSelfCoId() !== coId) {
            getData().selfCoId = coId;
            Notify.dispatch(NotifyType.McrCreateSelfCoIdChanged);
        }
    }
    export function getSelfCoId(): number | null {
        return getData().selfCoId;
    }

    export function setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== getSelfUnitAndTileSkinId()) {
            getData().selfUnitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.McrCreateSelfSkinIdChanged);
        }
    }
    export function tickSelfUnitAndTileSkinId(): void {
        setSelfUnitAndTileSkinId(getSelfUnitAndTileSkinId() % CommonConstants.UnitAndTileMaxSkinId + 1);
    }
    export function getSelfUnitAndTileSkinId(): number {
        return getData().selfUnitAndTileSkinId;
    }

    export function setHasFog(hasFog: boolean): void {
        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }

    export function setBootTimerParams(params: number[]): void {
        getData().settingsForMcw.bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return getData().settingsForMcw.bootTimerParams;
    }
    export function tickBootTimerType(): void {
        const params = getBootTimerParams();
        if ((params) && (params[0] === BootTimerType.Regular)) {
            setBootTimerParams([BootTimerType.Incremental, 60 * 15, 15]);
        } else {
            setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        }
    }
    export function tickTimerRegularTime(): void {
        const params = getBootTimerParams();
        if (params[0] !== BootTimerType.Regular) {
            tickBootTimerType();
        } else {
            const index = REGULAR_TIME_LIMITS.indexOf(params[1]);
            if (index < 0) {
                tickBootTimerType();
            } else {
                const newIndex  = index + 1;
                params[1]       = newIndex < REGULAR_TIME_LIMITS.length ? REGULAR_TIME_LIMITS[newIndex] : REGULAR_TIME_LIMITS[0];
            }
        }
    }
    export function setTimerIncrementalInitialTime(seconds: number): void {
        getBootTimerParams()[1] = seconds;
    }
    export function setTimerIncrementalIncrementalValue(seconds: number): void {
        getBootTimerParams()[2] = seconds;
    }

    export function tickTeamIndex(playerIndex: number): void {
        BwWarRuleHelpers.tickTeamIndex(getWarRule(), playerIndex);
        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    export function getTeamIndex(playerIndex: number): number {
        return BwWarRuleHelpers.getTeamIndex(getWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        BwWarRuleHelpers.setInitialFund(getWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return BwWarRuleHelpers.getInitialFund(getWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        BwWarRuleHelpers.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return BwWarRuleHelpers.getIncomeMultiplier(getWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        BwWarRuleHelpers.setEnergyAddPctOnLoadCo(getWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return BwWarRuleHelpers.getEnergyAddPctOnLoadCo(getWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        BwWarRuleHelpers.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return BwWarRuleHelpers.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
    }

    export function getBannedCoIdArray(playerIndex: number): number[] {
        return BwWarRuleHelpers.getBannedCoIdArray(getWarRule(), playerIndex);
    }
    export function addBannedCoId(playerIndex: number, coId: number): void {
        BwWarRuleHelpers.addBannedCoId(getWarRule(), playerIndex, coId);
    }
    export function deleteBannedCoId(playerIndex: number, coId: number): void {
        BwWarRuleHelpers.deleteBannedCoId(getWarRule(), playerIndex, coId);
    }
    export function setBannedCoIdArray(playerIndex: number, coIdSet: Set<number>): void {
        BwWarRuleHelpers.setBannedCoIdArray(getWarRule(), playerIndex, coIdSet);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        BwWarRuleHelpers.setLuckLowerLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return BwWarRuleHelpers.getLuckLowerLimit(getWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        BwWarRuleHelpers.setLuckUpperLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return BwWarRuleHelpers.getLuckUpperLimit(getWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelpers.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return BwWarRuleHelpers.getMoveRangeModifier(getWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelpers.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return BwWarRuleHelpers.getAttackPowerModifier(getWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelpers.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return BwWarRuleHelpers.getVisionRangeModifier(getWarRule(), playerIndex);
    }
}
