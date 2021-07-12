
import { TwnsClientErrorCode }          from "../../../utility/ClientErrorCode";
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

export namespace CcrCreateModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BootTimerType    = Types.BootTimerType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgCcrCreateRoom.IC;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForCommon       : {},
        settingsForCcw          : {},

        selfCoId                : null,
        selfPlayerIndex         : null,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
        aiSkinInfoArray         : [],
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

        const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleAvailability.canCcw);
        if (warRule == null) {
            Logger.error(`CcrModel.resetDataByMapId() empty warRule.`);
        } else {
            await resetDataByWarRuleId(warRule.ruleId);
        }
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule | null | undefined {
        return getData().settingsForCommon.warRule;
    }

    export function getMapId(): number {
        return getData().settingsForCcw.mapId;
    }
    function setMapId(mapId: number): void {
        getData().settingsForCcw.mapId = mapId;
    }

    function setConfigVersion(version: string): void {
        getData().settingsForCommon.configVersion = version;
    }

    export async function resetDataByWarRuleId(ruleId: number): Promise<ClientErrorCode> {
        if (ruleId == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_00;
        }

        const mapRawData        = await getMapRawData();
        const warRuleArray      = mapRawData ? mapRawData.warRuleArray : undefined;
        const warRule           = warRuleArray ? warRuleArray.find(r => r.ruleId === ruleId) : undefined;
        if (warRule == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_01;
        }

        const ruleForPlayers    = warRule ? warRule.ruleForPlayers : undefined;
        const playerRuleArray   = ruleForPlayers ? ruleForPlayers.playerRuleDataArray : null;
        if (playerRuleArray == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_02;
        }

        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of playerRuleArray) {
            const playerIndex = playerRule.playerIndex;
            if (playerIndex == null) {
                return ClientErrorCode.CcrModel_ResetDataByWarRuleId_03;
            }

            if (playerRule.fixedCoIdInCcw == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const settingsForCommon = getData().settingsForCommon;
        if (settingsForCommon == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_04;
        }

        const configVersion = settingsForCommon.configVersion;
        if (configVersion == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_05;
        }

        const selfPlayerIndex       = Math.min(...humanPlayerIndexArray);
        const availableCoIdArray    = BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(warRule, selfPlayerIndex, configVersion);
        if (availableCoIdArray == null) {
            return ClientErrorCode.CcrModel_ResetDataByWarRuleId_06;
        }

        settingsForCommon.warRule = Helpers.deepClone(warRule);
        setPresetWarRuleId(ruleId);
        setSelfPlayerIndex(selfPlayerIndex);
        setSelfUnitAndTileSkinId(selfPlayerIndex);
        resetAiSkinInfoArray(aiPlayerIndexArray);

        const selfCoId = getSelfCoId();
        if ((selfCoId == null) || (availableCoIdArray.indexOf(selfCoId) < 0)) {
            const coId = BwWarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray);
            if (coId == null) {
                return ClientErrorCode.CcrModel_ResetDataByWarRuleId_07;
            }
            setSelfCoId(coId);
        }

        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
        return ClientErrorCode.NoError;
    }
    function setPresetWarRuleId(ruleId: number | null | undefined): void {
        const settingsForCommon             = getData().settingsForCommon;
        settingsForCommon.warRule.ruleId    = ruleId;
        settingsForCommon.presetWarRuleId   = ruleId;
        Notify.dispatch(NotifyType.CcrCreatePresetWarRuleIdChanged);
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
            const warRule = warRuleArray.find(v => v.ruleAvailability.canCcw);
            if (warRule == null) {
                Logger.error(`CcrModel.tickPresetWarRuleId() empty warRule.`);
            } else {
                await resetDataByWarRuleId(warRule.ruleId);
            }
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId).ruleAvailability.canCcw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    export function setWarName(name: string): void {
        getData().settingsForCcw.warName = name;
    }
    export function getWarName(): string {
        return getData().settingsForCcw.warName;
    }

    export function setWarPassword(password: string): void {
        getData().settingsForCcw.warPassword = password;
    }
    export function getWarPassword(): string {
        return getData().settingsForCcw.warPassword;
    }

    export function setWarComment(comment: string): void {
        getData().settingsForCcw.warComment = comment;
    }
    export function getWarComment(): string {
        return getData().settingsForCcw.warComment;
    }

    export function setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== getSelfPlayerIndex()) {
            getData().selfPlayerIndex = playerIndex;
            Notify.dispatch(NotifyType.CcrCreateSelfPlayerIndexChanged);
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
            Notify.dispatch(NotifyType.CcrCreateSelfCoIdChanged);
        }
    }
    export function getSelfCoId(): number | null {
        return getData().selfCoId;
    }

    export function setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== getSelfUnitAndTileSkinId()) {
            getData().selfUnitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.CcrCreateSelfSkinIdChanged);
        }
    }
    export function getSelfUnitAndTileSkinId(): number {
        return getData().selfUnitAndTileSkinId;
    }
    export function tickUnitAndTileSkinId(playerIndex: number): void {
        if (playerIndex === getSelfPlayerIndex()) {
            setSelfUnitAndTileSkinId(getSelfUnitAndTileSkinId() % CommonConstants.UnitAndTileMaxSkinId + 1);
        } else {
            const aiSkinId = getAiSkinId(playerIndex);
            if (aiSkinId == null) {
                Logger.error(`CcrModel.tickUnitAndTileSkinId() empty aiSkinId.`);
                return;
            }

            setAiSkinId(playerIndex, aiSkinId % CommonConstants.UnitAndTileMaxSkinId + 1);
        }
    }

    function resetAiSkinInfoArray(aiPlayerIndexArray: number[]): void {
        const infoArray = getAiSkinInfoArray();
        if (infoArray == null) {
            Logger.error(`CcrModel.resetAiSkinInfoArray() empty infoArray.`);
            return;
        }

        infoArray.length = 0;
        for (const playerIndex of aiPlayerIndexArray) {
            infoArray.push({
                playerIndex,
                unitAndTileSkinId   : playerIndex,
            });
        }
    }
    function getAiSkinInfoArray(): ProtoTypes.NetMessage.MsgCcrCreateRoom.IAiSkinInfo[] {
        return getData().aiSkinInfoArray;
    }
    export function getAiSkinId(playerIndex: number): number | null | undefined {
        const infoArray = getAiSkinInfoArray();
        if (infoArray == null) {
            Logger.error(`CcrModel.getAiSkinId() empty infoArray.`);
            return undefined;
        }

        const info = infoArray.find(v => v.playerIndex === playerIndex);
        return info ? info.unitAndTileSkinId : undefined;
    }
    export function setAiSkinId(playerIndex: number, skinId: number): void {
        const infoArray = getAiSkinInfoArray();
        if (infoArray == null) {
            Logger.error(`CcrModel.setAiSkinId() empty infoArray.`);
            return;
        }

        const info = infoArray.find(v => v.playerIndex === playerIndex);
        if (info) {
            info.unitAndTileSkinId = skinId;
        } else {
            infoArray.push({
                playerIndex,
                unitAndTileSkinId   : skinId,
            });
        }
    }
    export function deleteAiSkinId(playerIndex: number): void {
        const infoArray = getAiSkinInfoArray();
        if (infoArray == null) {
            Logger.error(`CcrModel.deleteAiSkinId() empty infoArray.`);
            return;
        }

        infoArray.splice(infoArray.findIndex(v => v.playerIndex === playerIndex), 1);
        Notify.dispatch(NotifyType.CcrCreateAiCoIdChanged);
    }

    export function setAiCoId(playerIndex: number, coId: number | null | undefined): void {
        const warRule = getWarRule();
        if (warRule == null) {
            Logger.error(`CcrModel.setAiCoId() empty warRule.`);
            return;
        }

        BwWarRuleHelpers.setFixedCoIdInCcw(warRule, playerIndex, coId);
        Notify.dispatch(NotifyType.CcrCreateAiCoIdChanged);
    }
    export function getAiCoId(playerIndex: number): number | null | undefined {
        const warRule = getWarRule();
        if (warRule == null) {
            Logger.error(`CcrModel.getAiCoId() empty warRule.`);
            return undefined;
        }

        return BwWarRuleHelpers.getFixedCoIdInCcw(warRule, playerIndex);
    }

    export function setHasFog(hasFog: boolean): void {
        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }

    export function setBootTimerParams(params: number[]): void {
        getData().settingsForCcw.bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return getData().settingsForCcw.bootTimerParams;
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
        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
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
