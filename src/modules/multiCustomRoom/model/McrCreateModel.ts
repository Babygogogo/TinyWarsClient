
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace McrCreateModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BootTimerType    = Types.BootTimerType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import GameConfig       = Twns.Config.GameConfig;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    export type DataForCreateRoom   = CommonProto.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = CommonProto.NetMessage.MsgMcrJoinRoom.IC;

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForCommon       : {
            turnsLimit          : CommonConstants.WarMaxTurnsLimit,
        },
        settingsForMcw          : {},

        selfCoId                : CommonConstants.CoEmptyId,
        selfPlayerIndex         : CommonConstants.WarFirstPlayerIndex,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
    };
    let _gameConfig: GameConfig | null = null;

    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
        return Helpers.getExisted(await WarMapModel.getRawData(getMapId()));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(Helpers.getExisted(Twns.Config.ConfigManager.getLatestConfigVersion()));
        setGameConfig(await Twns.Config.ConfigManager.getLatestGameConfig());
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setTurnsLimit(CommonConstants.WarMaxTurnsLimit);
        setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);
        await resetDataByWarRuleId(Helpers.getExisted((await getMapRawData()).warRuleArray?.find(v => v.ruleAvailability?.canMcw)?.ruleId));
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getSettingsForCommon(): CommonProto.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    export function getSettingsForMcw(): CommonProto.WarSettings.ISettingsForMcw {
        return Helpers.getExisted(getData().settingsForMcw);
    }

    export function getWarRule(): CommonProto.WarRule.ITemplateWarRule {
        return Helpers.getExisted(getSettingsForCommon().warRule);
    }
    function setWarRule(warRule: CommonProto.WarRule.ITemplateWarRule) {
        getSettingsForCommon().warRule = warRule;
    }

    export function getMapId(): number {
        return Helpers.getExisted(getSettingsForMcw().mapId);
    }
    function setMapId(mapId: number): void {
        getSettingsForMcw().mapId = mapId;
    }

    function setConfigVersion(version: string): void {
        getSettingsForCommon().configVersion = version;
    }
    export function getGameConfig(): GameConfig {
        return Helpers.getExisted(_gameConfig);
    }
    function setGameConfig(config: GameConfig): void {
        _gameConfig = config;
    }

    export async function resetDataByWarRuleId(ruleId: number | null): Promise<void> {
        if (ruleId == null) {
            await resetDataByCustomWarRuleId();
        } else {
            await resetDataByPresetWarRuleId(ruleId);
        }
    }
    async function resetDataByCustomWarRuleId(): Promise<void> {
        const warRule = WarRuleHelpers.createDefaultWarRule(null, Helpers.getExisted((await getMapRawData()).playersCountUnneutral));
        setWarRule(warRule);
        setCustomWarRuleId();

        const availableCoIdArray = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
            warRule,
            playerIndex     : getSelfPlayerIndex(),
            gameConfig      : getGameConfig(),
        });
        if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
            setSelfCoId(WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
        const warRule = Helpers.getExisted((await getMapRawData()).warRuleArray?.find(r => r.ruleId === ruleId));
        setWarRule(Helpers.deepClone(warRule));
        setPresetWarRuleId(ruleId);

        const availableCoIdArray = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
            warRule,
            playerIndex     : getSelfPlayerIndex(),
            gameConfig      : getGameConfig(),
        });
        if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
            setSelfCoId(WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    function setPresetWarRuleId(ruleId: number | null): void {
        getWarRule().ruleId                     = ruleId;
        getSettingsForCommon().presetWarRuleId  = ruleId;
        Notify.dispatch(NotifyType.McrCreatePresetWarRuleIdChanged);
    }
    export function setCustomWarRuleId(): void {
        setPresetWarRuleId(null);
    }
    export function getPresetWarRuleId(): number | null {
        return Helpers.getDefined(getSettingsForCommon().presetWarRuleId, ClientErrorCode.McrCreateModel_GetPresetWarRuleId_00);
    }
    export async function tickPresetWarRuleId(): Promise<void> {
        const currWarRuleId = getPresetWarRuleId();
        const warRuleArray  = Helpers.getExisted((await getMapRawData()).warRuleArray);
        if (currWarRuleId == null) {
            await resetDataByWarRuleId(Helpers.getExisted(warRuleArray.find(v => v.ruleAvailability?.canMcw)?.ruleId));
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (warRuleArray.find(v => v.ruleId === ruleId)?.ruleAvailability?.canMcw) {
                    await resetDataByWarRuleId(ruleId);
                    return;
                }
            }
        }
    }

    export function getTurnsLimit(): number {
        return Helpers.getExisted(getSettingsForCommon().turnsLimit);
    }
    export function setTurnsLimit(turnsLimit: number): void {
        getSettingsForCommon().turnsLimit = turnsLimit;
    }

    export function setWarName(name: string | null): void {
        getSettingsForMcw().warName = name;
    }
    export function getWarName(): string | null {
        return getSettingsForMcw().warName ?? null;
    }

    export function setWarPassword(password: string | null): void {
        getSettingsForMcw().warPassword = password;
    }
    export function getWarPassword(): string | null {
        return getSettingsForMcw().warPassword ?? null;
    }

    export function setWarComment(comment: string | null): void {
        getSettingsForMcw().warComment = comment;
    }
    export function getWarComment(): string | null {
        return getSettingsForMcw().warComment ?? null;
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
        return Helpers.getExisted(getData().selfPlayerIndex);
    }

    export function setSelfCoId(coId: number): void {
        if (getSelfCoId() !== coId) {
            getData().selfCoId = coId;
            Notify.dispatch(NotifyType.McrCreateSelfCoIdChanged);
        }
    }
    export function getSelfCoId(): number {
        return Helpers.getExisted(getData().selfCoId);
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
        return Helpers.getExisted(getData().selfUnitAndTileSkinId);
    }

    export function setHasFog(hasFog: boolean): void {
        Helpers.getExisted(getWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function tickDefaultWeatherType(): void {
        WarRuleHelpers.tickDefaultWeatherType(getWarRule(), getGameConfig());
    }

    export function setBootTimerParams(params: number[]): void {
        getSettingsForMcw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return Helpers.getExisted(getSettingsForMcw().bootTimerParams);
    }
    export function tickBootTimerType(): void {
        const params = getBootTimerParams();
        if ((params) && (params[0] === BootTimerType.Regular)) {
            setBootTimerParams([BootTimerType.Incremental, 60 * 15, 10]);
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
        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
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

// export default McrCreateModel;
