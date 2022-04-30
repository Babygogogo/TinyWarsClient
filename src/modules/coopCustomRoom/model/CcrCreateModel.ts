
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
namespace Twns.CoopCustomRoom.CcrCreateModel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import BootTimerType            = Types.BootTimerType;
    import GameConfig               = Config.GameConfig;

    export type DataForCreateRoom   = CommonProto.NetMessage.MsgCcrCreateRoom.IC;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForCommon       : {
            turnsLimit          : CommonConstants.WarMaxTurnsLimit,
            instanceWarRule     : {
                templateRuleId          : null,
                templateModifiedTime    : null,
            },
        },
        settingsForCcw          : {},

        selfCoId                : CommonConstants.CoEmptyId,
        selfPlayerIndex         : CommonConstants.WarFirstPlayerIndex,
        selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
        aiSkinInfoArray         : [],
    };
    let _gameConfig: GameConfig | null = null;

    export async function getMapRawData(): Promise<CommonProto.Map.IMapRawData> {
        return Helpers.getExisted(await WarMap.WarMapModel.getRawData(getMapId()));
    }

    export async function resetDataByMapId(mapId: number): Promise<void> {
        setMapId(mapId);
        setConfigVersion(Helpers.getExisted(Config.ConfigManager.getLatestConfigVersion()));
        setGameConfig(await Config.ConfigManager.getLatestGameConfig());
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setTurnsLimit(CommonConstants.WarMaxTurnsLimit);
        setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);
        await resetDataByTemplateWarRuleId(Helpers.getExisted((await getMapRawData()).templateWarRuleArray?.find(v => v.ruleAvailability?.canCcw)?.ruleId));
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getSettingsForCommon(): CommonProto.WarSettings.ISettingsForCommon {
        return Helpers.getExisted(getData().settingsForCommon);
    }
    function getSettingsForCcw(): CommonProto.WarSettings.ISettingsForCcw {
        return Helpers.getExisted(getData().settingsForCcw);
    }
    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Helpers.getExisted(getSettingsForCommon().instanceWarRule);
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
    function setGameConfig(config: GameConfig): void {
        _gameConfig = config;
    }
    export function getGameConfig(): GameConfig {
        return Helpers.getExisted(_gameConfig);
    }

    export async function resetDataByTemplateWarRuleId(templateWarRuleId: number): Promise<void> {
        const mapRawData            = await getMapRawData();
        const templateWarRule       = Helpers.getExisted(mapRawData.templateWarRuleArray?.find(r => r.ruleId === templateWarRuleId));
        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of Helpers.getExisted(templateWarRule.ruleForPlayers?.playerRuleDataArray)) {
            const playerIndex = Helpers.getExisted(playerRule.playerIndex);
            if (playerRule.fixedCoIdInCcw == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const settingsForCommon     = getSettingsForCommon();
        const selfPlayerIndex       = Math.min(...humanPlayerIndexArray);
        const availableCoIdArray    = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayForPlayer({
            baseWarRule     : templateWarRule,
            playerIndex     : selfPlayerIndex,
            gameConfig      : getGameConfig(),
        });

        settingsForCommon.instanceWarRule = WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData);
        setSelfPlayerIndex(selfPlayerIndex);
        setSelfUnitAndTileSkinId(selfPlayerIndex);
        resetAiSkinInfoArray(aiPlayerIndexArray);

        const selfCoId = getSelfCoId();
        if ((selfCoId == null) || (availableCoIdArray.indexOf(selfCoId) < 0)) {
            setSelfCoId(WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
        }

        Notify.dispatch(NotifyType.CcrCreatePresetWarRuleIdChanged);
        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
    }
    export function setCustomWarRuleId(): void {
        const instanceWarRule                   = getInstanceWarRule();
        instanceWarRule.templateRuleId          = null;
        instanceWarRule.templateModifiedTime    = null;

        Notify.dispatch(NotifyType.CcrCreatePresetWarRuleIdChanged);
    }
    export function getTemplateWarRuleId(): number | null {
        return getInstanceWarRule().templateRuleId ?? null;
    }
    export async function tickTemplateWarRuleId(): Promise<void> {
        const currTemplateWarRuleId = getTemplateWarRuleId();
        const templateWarRuleArray  = Helpers.getExisted((await getMapRawData()).templateWarRuleArray);
        if (currTemplateWarRuleId == null) {
            await resetDataByTemplateWarRuleId(Helpers.getExisted(templateWarRuleArray.find(v => v.ruleAvailability?.canCcw)?.ruleId));
        } else {
            const warRuleIdList: number[] = [];
            for (let ruleId = currTemplateWarRuleId + 1; ruleId < templateWarRuleArray.length; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (let ruleId = 0; ruleId < currTemplateWarRuleId; ++ruleId) {
                warRuleIdList.push(ruleId);
            }
            for (const ruleId of warRuleIdList) {
                if (templateWarRuleArray.find(v => v.ruleId === ruleId)?.ruleAvailability?.canCcw) {
                    await resetDataByTemplateWarRuleId(ruleId);
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
    function getAiSkinInfoArray(): CommonProto.NetMessage.MsgCcrCreateRoom.IAiSkinInfo[] {
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
        WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(getInstanceWarRule(), playerIndex, coId);
        Notify.dispatch(NotifyType.CcrCreateAiCoIdChanged);
    }
    export function getAiCoId(playerIndex: number): number | null {
        return WarHelpers.WarRuleHelpers.getFixedCoIdInCcw(getInstanceWarRule(), playerIndex);
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
        getSettingsForCcw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return Helpers.getExisted(getSettingsForCcw().bootTimerParams);
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
        Notify.dispatch(NotifyType.CcrCreateTeamIndexChanged);
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

// export default CcrCreateModel;
