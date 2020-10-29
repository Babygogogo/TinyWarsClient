
namespace TinyWars.MapEditor.MeModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import Logger           = Utility.Logger;
    import Helpers          = Utility.Helpers;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import MapReviewStatus  = Types.MapReviewStatus;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import IMapEditorData   = ProtoTypes.Map.IMapEditorData;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    const MAP_DICT = new Map<number, IMapEditorData>();

    export function init(): void {
    }

    export async function resetDataList(rawDataList: IMapEditorData[]): Promise<void> {
        MAP_DICT.clear();
        for (const data of rawDataList || []) {
            const slotIndex = data.slotIndex;
            MAP_DICT.set(slotIndex, {
                slotIndex,
                reviewStatus    : data.reviewStatus,
                mapRawData      : data.mapRawData,
                reviewComment   : data.reviewComment,
            });
        }

        const maxSlotsCount = await User.UserModel.getIsSelfMapCommittee()
            ? CommonConstants.MapEditorSlotMaxCountForCommittee
            : CommonConstants.MapEditorSlotMaxCountForNormal;
        for (let i = 0; i < maxSlotsCount; ++i) {
            if (!MAP_DICT.has(i)) {
                MAP_DICT.set(i, createEmptyData(i));
            }
        }
    }
    export function updateData(slotIndex: number, data: IMapEditorData): void {
        MAP_DICT.set(slotIndex, {
            slotIndex,
            reviewStatus: data.reviewStatus,
            mapRawData  : data.mapRawData,
        });
    }
    export function getDataDict(): Map<number, IMapEditorData> {
        return MAP_DICT;
    }
    export function getData(slotIndex: number): IMapEditorData {
        return MAP_DICT.get(slotIndex);
    }

    export function checkHasReviewingMap(): boolean {
        for (const [, data] of MAP_DICT) {
            if (data.reviewStatus === MapReviewStatus.Reviewing) {
                return true;
            }
        }
        return false;
    }

    export namespace Create {
        let _mapRawData : ProtoTypes.Map.IMapRawData;
        const _warData  : ISerialWar = {
            settingsForCommon       : {
                configVersion       : Utility.ConfigManager.getLatestConfigVersion(),
                mapId               : null,
                presetWarRuleId     : null,
                warRule             : null,
            },
            settingsForScw          : {
                isCheating          : true,
            },

            selfCoId                : null,
            selfPlayerIndex         : null,
            selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
        };

        export function getMapRawData(): ProtoTypes.Map.IMapRawData {
            return _mapRawData;
        }
        function setMapRawData(data: ProtoTypes.Map.IMapRawData): void {
            _mapRawData = data;
        }

        export async function resetDataByMapRawData(mapRawData: ProtoTypes.Map.IMapRawData): Promise<void> {
            setMapRawData(mapRawData);

            setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);

            const warRule = (await getMapRawData()).warRuleList.find(v => v.ruleAvailability.canMcw);
            await resetDataByPresetWarRuleId(warRule ? warRule.ruleId : null);
        }
        export function getData(): ISerialWar {
            return _warData;
        }
        export function getWarRule(): ProtoTypes.WarRule.IWarRule {
            return getData().settingsForCommon.warRule;
        }

        function setConfigVersion(version: string): void {
            getData().settingsForCommon.configVersion = version;
        }

        async function resetDataByPresetWarRuleId(ruleId: number | null): Promise<void> {
            const mapRawData        = await getMapRawData();
            const settingsForCommon = getData().settingsForCommon;
            if (ruleId == null) {
                settingsForCommon.warRule = BwSettingsHelper.createDefaultWarRule(ruleId, mapRawData.playersCount);
                setPresetWarRuleId(ruleId);
                setSelfCoId(BwSettingsHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, getSelfPlayerIndex()));

            } else {
                const warRule = mapRawData.warRuleList.find(warRule => warRule.ruleId === ruleId);
                if (warRule == null) {
                    Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                    return undefined;
                }

                settingsForCommon.warRule = Helpers.deepClone(warRule);
                setPresetWarRuleId(ruleId);
                setSelfCoId(BwSettingsHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, getSelfPlayerIndex()));
            }
        }
        export function setPresetWarRuleId(ruleId: number | null | undefined): void {
            const settingsForCommon             = getData().settingsForCommon;
            settingsForCommon.warRule.ruleId    = ruleId;
            settingsForCommon.presetWarRuleId   = ruleId;
        }
        export function getPresetWarRuleId(): number | undefined {
            return getData().settingsForCommon.presetWarRuleId;
        }
        export async function tickPresetWarRuleId(): Promise<void> {
            const currWarRuleId = getPresetWarRuleId();
            const warRuleList   = (await getMapRawData()).warRuleList;
            if (currWarRuleId == null) {
                const warRule = warRuleList.find(v => v.ruleAvailability.canMcw);
                await resetDataByPresetWarRuleId(warRule ? warRule.ruleId : null);
            } else {
                const warRuleIdList: number[] = [];
                for (let ruleId = currWarRuleId + 1; ruleId < warRuleList.length; ++ ruleId) {
                    warRuleIdList.push(ruleId);
                }
                for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                    warRuleIdList.push(ruleId);
                }
                for (const ruleId of warRuleIdList) {
                    if (warRuleList.find(v => v.ruleId === ruleId).ruleAvailability.canMcw) {
                        await resetDataByPresetWarRuleId(ruleId);
                        return;
                    }
                }
            }
        }

        function setSelfPlayerIndex(playerIndex: number): void {
            getData().selfPlayerIndex = playerIndex;
        }
        export async function tickSelfPlayerIndex(): Promise<void> {
            setSelfPlayerIndex(getSelfPlayerIndex() % BwSettingsHelper.getPlayersCount(getWarRule()) + 1);
        }
        export function getSelfPlayerIndex(): number {
            return getData().selfPlayerIndex;
        }

        export function setSelfCoId(coId: number): void {
            getData().selfCoId = coId;
        }
        export function getSelfCoId(): number | null {
            return getData().selfCoId;
        }

        function setSelfUnitAndTileSkinId(skinId: number): void {
            getData().selfUnitAndTileSkinId = skinId;
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

        export function tickTeamIndex(playerIndex: number): void {
            BwSettingsHelper.tickTeamIndex(getWarRule(), playerIndex);
        }
        export function getTeamIndex(playerIndex: number): number {
            return BwSettingsHelper.getTeamIndex(getWarRule(), playerIndex);
        }

        export function setInitialFund(playerIndex, fund: number): void {
            BwSettingsHelper.setInitialFund(getWarRule(), playerIndex, fund);
        }
        export function getInitialFund(playerIndex: number): number {
            return BwSettingsHelper.getInitialFund(getWarRule(), playerIndex);
        }

        export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
            BwSettingsHelper.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
        }
        export function getIncomeMultiplier(playerIndex: number): number {
            return BwSettingsHelper.getIncomeMultiplier(getWarRule(), playerIndex);
        }

        export function setInitialEnergyPercentage(playerIndex: number, percentage: number): void {
            BwSettingsHelper.setInitialEnergyPercentage(getWarRule(), playerIndex, percentage);
        }
        export function getInitialEnergyPercentage(playerIndex: number): number {
            return BwSettingsHelper.getInitialEnergyPercentage(getWarRule(), playerIndex);
        }

        export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
            BwSettingsHelper.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
        }
        export function getEnergyGrowthMultiplier(playerIndex: number): number {
            return BwSettingsHelper.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
        }

        export function getAvailableCoIdList(playerIndex: number): number[] {
            return BwSettingsHelper.getAvailableCoIdList(getWarRule(), playerIndex);
        }
        export function addAvailableCoId(playerIndex: number, coId: number): void {
            BwSettingsHelper.addAvailableCoId(getWarRule(), playerIndex, coId);
        }
        export function removeAvailableCoId(playerIndex: number, coId: number): void {
            BwSettingsHelper.removeAvailableCoId(getWarRule(), playerIndex, coId);
        }
        export function setAvailableCoIdList(playerIndex: number, coIdSet: Set<number>): void {
            BwSettingsHelper.setAvailableCoIdList(getWarRule(), playerIndex, coIdSet);
        }

        export function setLuckLowerLimit(playerIndex: number, limit: number): void {
            BwSettingsHelper.setLuckLowerLimit(getWarRule(), playerIndex, limit);
        }
        export function getLuckLowerLimit(playerIndex: number): number {
            return BwSettingsHelper.getLuckLowerLimit(getWarRule(), playerIndex);
        }

        export function setLuckUpperLimit(playerIndex: number, limit: number): void {
            BwSettingsHelper.setLuckUpperLimit(getWarRule(), playerIndex, limit);
        }
        export function getLuckUpperLimit(playerIndex: number): number {
            return BwSettingsHelper.getLuckUpperLimit(getWarRule(), playerIndex);
        }

        export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
            BwSettingsHelper.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
        }
        export function getMoveRangeModifier(playerIndex: number): number {
            return BwSettingsHelper.getMoveRangeModifier(getWarRule(), playerIndex);
        }

        export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
            BwSettingsHelper.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
        }
        export function getAttackPowerModifier(playerIndex: number): number {
            return BwSettingsHelper.getAttackPowerModifier(getWarRule(), playerIndex);
        }

        export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
            BwSettingsHelper.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
        }
        export function getVisionRangeModifier(playerIndex: number): number {
            return BwSettingsHelper.getVisionRangeModifier(getWarRule(), playerIndex);
        }
    }

    function createEmptyData(slotIndex: number): IMapEditorData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            mapRawData  : null,
        }
    }
}
