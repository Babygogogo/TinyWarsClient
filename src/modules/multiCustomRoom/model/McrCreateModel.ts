
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom.McrCreateModel {
    import NotifyType       = Notify.NotifyType;
    import BootTimerType    = Types.BootTimerType;
    import GameConfig       = Config.GameConfig;

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
            instanceWarRule     : {
                templateWarRuleId   : null,
            },
        },
        settingsForMcw          : {},

        selfCoId                : CommonConstants.CoId.Empty,
        selfPlayerIndex         : CommonConstants.PlayerIndex.First,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
    };
    let _gameConfig: GameConfig | null = null;

    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
        return Helpers.getExisted(await WarMap.WarMapModel.getRawData(getMapId()));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(await Config.ConfigManager.getLatestConfigVersion());
        setGameConfig(await Config.ConfigManager.getLatestGameConfig());
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setTurnsLimit(CommonConstants.WarMaxTurnsLimit);
        setSelfPlayerIndex(CommonConstants.PlayerIndex.First);
        await resetDataByTemplateWarRuleId(Helpers.getExisted((await getMapRawData()).templateWarRuleArray?.find(v => v.ruleAvailability?.canMcw)?.ruleId));
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

    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Helpers.getExisted(getSettingsForCommon().instanceWarRule);
    }
    function setInstanceWarRule(instanceWarRule: CommonProto.WarRule.IInstanceWarRule) {
        getSettingsForCommon().instanceWarRule = instanceWarRule;
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

    export async function resetDataByTemplateWarRuleId(templateWarRuleId: number | null): Promise<void> {
        const mapRawData = await getMapRawData();
        if (templateWarRuleId == null) {
            const instanceWarRule = WarHelpers.WarRuleHelpers.createDefaultInstanceWarRule(Helpers.getExisted(mapRawData.playersCountUnneutral), getGameConfig());
            setInstanceWarRule(instanceWarRule);
        } else {
            const templateWarRule = Helpers.getExisted(mapRawData.templateWarRuleArray?.find(r => r.ruleId === templateWarRuleId));
            setInstanceWarRule(WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData));
        }

        const availableCoIdArray = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayWithBaseWarRule({
            baseWarRule     : getInstanceWarRule(),
            playerIndex     : getSelfPlayerIndex(),
            gameConfig      : getGameConfig(),
        });
        if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
            setSelfCoId(WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.McrCreateTemplateWarRuleIdChanged);
        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    export function setCustomWarRuleId(): void {
        const instanceWarRule               = getInstanceWarRule();
        instanceWarRule.templateWarRuleId   = null;

        Notify.dispatch(NotifyType.McrCreateTemplateWarRuleIdChanged);
    }
    export function getTemplateWarRuleId(): number | null {
        return getInstanceWarRule().templateWarRuleId ?? null;
    }
    export async function tickTemplateWarRuleId(): Promise<void> {
        const currTemplateWarRuleId = getTemplateWarRuleId();
        const templateWarRuleArray  = Helpers.getExisted((await getMapRawData()).templateWarRuleArray);
        if (currTemplateWarRuleId == null) {
            await resetDataByTemplateWarRuleId(Helpers.getExisted(templateWarRuleArray.find(v => v.ruleAvailability?.canMcw)?.ruleId));
        } else {
            const newTemplateWarRuleId = Helpers.getNonNullElements(templateWarRuleArray.filter(v => v.ruleAvailability?.canMcw).map(v => v.ruleId)).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
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
        Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function tickDefaultWeatherType(): void {
        WarHelpers.WarRuleHelpers.tickDefaultWeatherType(getInstanceWarRule(), getGameConfig());
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
        WarHelpers.WarRuleHelpers.tickTeamIndex(getInstanceWarRule(), playerIndex);
        Notify.dispatch(NotifyType.McrCreateTeamIndexChanged);
    }
    export function getTeamIndex(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getTeamIndex(getInstanceWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        WarHelpers.WarRuleHelpers.setInitialFund(getInstanceWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getInitialFund(getInstanceWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        WarHelpers.WarRuleHelpers.setIncomeMultiplier(getInstanceWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getIncomeMultiplier(getInstanceWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        WarHelpers.WarRuleHelpers.setEnergyAddPctOnLoadCo(getInstanceWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getEnergyAddPctOnLoadCo(getInstanceWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        WarHelpers.WarRuleHelpers.setEnergyGrowthMultiplier(getInstanceWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getEnergyGrowthMultiplier(getInstanceWarRule(), playerIndex);
    }

    export function getBannedCoCategoryIdArray(playerIndex: number): number[] | null {
        return WarHelpers.WarRuleHelpers.getBannedCoCategoryIdArray(getInstanceWarRule(), playerIndex);
    }
    export function setBannedCoCategoryIdArray(playerIndex: number, coIdSet: Set<number>): void {
        WarHelpers.WarRuleHelpers.setBannedCoCategoryIdArray(getInstanceWarRule(), playerIndex, coIdSet);
    }

    export function getBannedUnitTypeArray(playerIndex: number): number[] | null {
        return WarHelpers.WarRuleHelpers.getBannedUnitTypeArray(getInstanceWarRule(), playerIndex);
    }
    export function setBannedUnitTypeArray(playerIndex: number, unitTypeArray: number[]): void {
        WarHelpers.WarRuleHelpers.setBannedUnitTypeArray(getInstanceWarRule(), playerIndex, unitTypeArray);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        WarHelpers.WarRuleHelpers.setLuckLowerLimit(getInstanceWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getLuckLowerLimit(getInstanceWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        WarHelpers.WarRuleHelpers.setLuckUpperLimit(getInstanceWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getLuckUpperLimit(getInstanceWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setMoveRangeModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getMoveRangeModifier(getInstanceWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setAttackPowerModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getAttackPowerModifier(getInstanceWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setVisionRangeModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getVisionRangeModifier(getInstanceWarRule(), playerIndex);
    }
}

// export default McrCreateModel;
