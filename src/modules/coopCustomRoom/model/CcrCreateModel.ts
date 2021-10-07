
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
import WarMapModel          from "../../warMap/model/WarMapModel";

namespace CcrCreateModel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import BootTimerType            = Types.BootTimerType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;

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

        selfCoId                : CommonConstants.CoEmptyId,
        selfPlayerIndex         : CommonConstants.WarFirstPlayerIndex,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
        aiSkinInfoArray         : [],
    };

    export async function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
        return Helpers.getExisted(await WarMapModel.getRawData(getMapId()));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(Helpers.getExisted(ConfigManager.getLatestConfigVersion()));
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);
        await resetDataByWarRuleId(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleAvailability?.canCcw)?.ruleId));
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getSettingsForCommon(): ProtoTypes.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    function getSettingsForCcw(): ProtoTypes.WarSettings.ISettingsForCcw {
        return Helpers.getExisted(getData().settingsForCcw);
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule {
        return Helpers.getExisted(getSettingsForCommon().warRule);
    }

    export function getMapId(): number {
        return Helpers.getExisted(getSettingsForCcw().mapId);
    }
    function setMapId(mapId: number): void {
        getSettingsForCcw().mapId = mapId;
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    function getConfigVersion(): string {
        return Helpers.getExisted(getSettingsForCommon().configVersion);
    }

    export async function resetDataByWarRuleId(ruleId: number): Promise<void> {
        const warRule               = Helpers.getExisted((await getMapRawData())?.warRuleArray?.find(r => r.ruleId === ruleId));
        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of Helpers.getExisted(warRule.ruleForPlayers?.playerRuleDataArray)) {
            const playerIndex = Helpers.getExisted(playerRule.playerIndex);
            if (playerRule.fixedCoIdInCcw == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const settingsForCommon     = getSettingsForCommon();
        const selfPlayerIndex       = Math.min(...humanPlayerIndexArray);
        const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
            warRule,
            playerIndex     : selfPlayerIndex,
            configVersion   : getConfigVersion(),
        });

        settingsForCommon.warRule = Helpers.deepClone(warRule);
        setPresetWarRuleId(ruleId);
        setSelfPlayerIndex(selfPlayerIndex);
        setSelfUnitAndTileSkinId(selfPlayerIndex);
        resetAiSkinInfoArray(aiPlayerIndexArray);

        const selfCoId = getSelfCoId();
        if ((selfCoId == null) || (availableCoIdArray.indexOf(selfCoId) < 0)) {
            setSelfCoId(WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
    }
    function setPresetWarRuleId(ruleId: number | null): void {
        const settingsForCommon                                 = getSettingsForCommon();
        Helpers.getExisted(settingsForCommon.warRule).ruleId    = ruleId;
        settingsForCommon.presetWarRuleId                       = ruleId;
        Notify.dispatch(NotifyType.CcrCreatePresetWarRuleIdChanged);
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
            await resetDataByWarRuleId(Helpers.getExisted(warRuleArray.find(v => v.ruleAvailability?.canCcw)?.ruleId));
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId)?.ruleAvailability?.canCcw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    export function setWarName(name: string | null): void {
        getSettingsForCcw().warName = name;
    }
    export function getWarName(): string | null {
        return getSettingsForCcw().warName ?? null;
    }

    export function setWarPassword(password: string | null): void {
        getSettingsForCcw().warPassword = password;
    }
    export function getWarPassword(): string | null {
        return getSettingsForCcw().warPassword ?? null;
    }

    export function setWarComment(comment: string | null): void {
        getSettingsForCcw().warComment = comment;
    }
    export function getWarComment(): string | null {
        return getSettingsForCcw().warComment ?? null;
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
        return Helpers.getExisted(getData().selfPlayerIndex);
    }

    export function setSelfCoId(coId: number): void {
        if (getSelfCoId() !== coId) {
            getData().selfCoId = coId;
            Notify.dispatch(NotifyType.CcrCreateSelfCoIdChanged);
        }
    }
    export function getSelfCoId(): number {
        return Helpers.getExisted(getData().selfCoId);
    }

    export function setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== getSelfUnitAndTileSkinId()) {
            getData().selfUnitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.CcrCreateSelfSkinIdChanged);
        }
    }
    export function getSelfUnitAndTileSkinId(): number {
        return Helpers.getExisted(getData().selfUnitAndTileSkinId);
    }
    export function tickUnitAndTileSkinId(playerIndex: number): void {
        if (playerIndex === getSelfPlayerIndex()) {
            setSelfUnitAndTileSkinId(getSelfUnitAndTileSkinId() % CommonConstants.UnitAndTileMaxSkinId + 1);
        } else {
            setAiSkinId(playerIndex, getAiSkinId(playerIndex) % CommonConstants.UnitAndTileMaxSkinId + 1);
        }
    }

    function resetAiSkinInfoArray(aiPlayerIndexArray: number[]): void {
        const infoArray     = getAiSkinInfoArray();
        infoArray.length    = 0;
        for (const playerIndex of aiPlayerIndexArray) {
            infoArray.push({
                playerIndex,
                unitAndTileSkinId   : playerIndex,
            });
        }
    }
    function getAiSkinInfoArray(): ProtoTypes.NetMessage.MsgCcrCreateRoom.IAiSkinInfo[] {
        return Helpers.getExisted(getData().aiSkinInfoArray);
    }
    export function getAiSkinId(playerIndex: number): number {
        return Helpers.getExisted(getAiSkinInfoArray().find(v => v.playerIndex === playerIndex)?.unitAndTileSkinId);
    }
    export function setAiSkinId(playerIndex: number, skinId: number): void {
        const infoArray = getAiSkinInfoArray();
        const info      = infoArray.find(v => v.playerIndex === playerIndex);
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
        infoArray.splice(infoArray.findIndex(v => v.playerIndex === playerIndex), 1);
        Notify.dispatch(NotifyType.CcrCreateAiCoIdChanged);
    }

    export function setAiCoId(playerIndex: number, coId: number | null): void {
        WarRuleHelpers.setFixedCoIdInCcw(getWarRule(), playerIndex, coId);
        Notify.dispatch(NotifyType.CcrCreateAiCoIdChanged);
    }
    export function getAiCoId(playerIndex: number): number | null {
        return WarRuleHelpers.getFixedCoIdInCcw(getWarRule(), playerIndex);
    }

    export function setHasFog(hasFog: boolean): void {
        Helpers.getExisted(getWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function setBootTimerParams(params: number[]): void {
        getSettingsForCcw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return Helpers.getExisted(getSettingsForCcw().bootTimerParams);
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
        WarRuleHelpers.tickTeamIndex(getWarRule(), playerIndex);
        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
    }
    export function getTeamIndex(playerIndex: number): number {
        return WarRuleHelpers.getTeamIndex(getWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        WarRuleHelpers.setInitialFund(getWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return WarRuleHelpers.getInitialFund(getWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        WarRuleHelpers.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return WarRuleHelpers.getIncomeMultiplier(getWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        WarRuleHelpers.setEnergyAddPctOnLoadCo(getWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return WarRuleHelpers.getEnergyAddPctOnLoadCo(getWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        WarRuleHelpers.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return WarRuleHelpers.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
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

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        WarRuleHelpers.setLuckLowerLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return WarRuleHelpers.getLuckLowerLimit(getWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        WarRuleHelpers.setLuckUpperLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return WarRuleHelpers.getLuckUpperLimit(getWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return WarRuleHelpers.getMoveRangeModifier(getWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return WarRuleHelpers.getAttackPowerModifier(getWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return WarRuleHelpers.getVisionRangeModifier(getWarRule(), playerIndex);
    }
}

export default CcrCreateModel;
