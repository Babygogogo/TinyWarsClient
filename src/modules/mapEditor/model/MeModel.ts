
namespace TinyWars.MapEditor.MeModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import Logger           = Utility.Logger;
    import Helpers          = Utility.Helpers;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import MapReviewStatus  = Types.MapReviewStatus;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import IMapEditorData   = ProtoTypes.Map.IMapEditorData;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import CommonConstants  = Utility.CommonConstants;

    const MAP_DICT  = new Map<number, IMapEditorData>();
    let _war        : MeWar;

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(mapRawData: ProtoTypes.Map.IMapRawData | null, slotIndex: number, isReview: boolean): Promise<MeWar> {
        if (_war) {
            Logger.warn(`MeManager.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        mapRawData = mapRawData || await MeUtility.createDefaultMapRawData(slotIndex);
        _war = new MeWar();
        await _war.initWithMapEditorData({
            mapRawData,
            slotIndex
        });
        _war.setIsMapModified(false);
        _war.setIsReviewingMap(isReview);
        _war.startRunning()
            .startRunningView();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): MeWar | undefined {
        return _war;
    }

    export namespace Sim {
        let _mapRawData : IMapRawData;
        let _warData    : ISerialWar;

        export function getMapRawData(): IMapRawData {
            return _mapRawData;
        }
        function setMapRawData(data: IMapRawData): void {
            _mapRawData = data;
        }

        export function getWarData(): ISerialWar {
            return _warData;
        }
        function setWarData(warData: ISerialWar): void {
            _warData = warData;
        }

        export async function resetData(mapRawData: IMapRawData, warData: ISerialWar): Promise<void> {
            setMapRawData(mapRawData);
            setWarData(Helpers.deepClone(warData));
        }

        export function checkIsValidWarData(): boolean {
            const teamIndexSet = new Set<number>();
            for (const player of _warData.settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray) {
                teamIndexSet.add(player.teamIndex);
            }
            return teamIndexSet.size > 1;
        }

        export function getWarRule(): ProtoTypes.WarRule.IWarRule {
            return getWarData().settingsForCommon.warRule;
        }

        function resetDataByPresetWarRuleId(ruleId: number | null): void {
            const settingsForCommon = getWarData().settingsForCommon;
            const mapRawData        = getMapRawData();
            const playersCount      = mapRawData.playersCountUnneutral;

            if (ruleId == null) {
                settingsForCommon.warRule = BwWarRuleHelper.createDefaultWarRule(ruleId, playersCount);
            } else {
                const warRule = mapRawData.warRuleArray.find(warRule => warRule.ruleId === ruleId);
                if (warRule == null) {
                    Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                    return undefined;
                }

                settingsForCommon.warRule = Helpers.deepClone(warRule);
            }

            setPresetWarRuleId(ruleId);
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
                setCoId(playerIndex, BwWarRuleHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, playerIndex));
            }
        }
        export function setPresetWarRuleId(ruleId: number | null | undefined): void {
            getWarRule().ruleId                             = ruleId;
            getWarData().settingsForCommon.presetWarRuleId  = ruleId;
        }
        export function getPresetWarRuleId(): number | undefined {
            return getWarData().settingsForCommon.presetWarRuleId;
        }
        export function tickPresetWarRuleId(): void {
            const currWarRuleId = getPresetWarRuleId();
            const warRuleArray  = getMapRawData().warRuleArray;
            if (currWarRuleId == null) {
                resetDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
            } else {
                resetDataByPresetWarRuleId((currWarRuleId + 1) % warRuleArray.length);
            }
        }

        function getPlayer(playerIndex: number): ProtoTypes.WarSerialization.ISerialPlayer {
            return getWarData().playerManager.players.find(v => v.playerIndex === playerIndex);
        }

        export function setCoId(playerIndex: number, coId: number): void {
            getPlayer(playerIndex).coId = coId;
        }
        export function getCoId(playerIndex: number): number {
            return getPlayer(playerIndex).coId;
        }

        function setUnitAndTileSkinId(playerIndex: number, skinId: number): void {
            getPlayer(playerIndex).unitAndTileSkinId = skinId;
        }
        export function tickUnitAndTileSkinId(playerIndex: number): void {
            const currSkinId        = getUnitAndTileSkinId(playerIndex);
            const newSkinId         = currSkinId % CommonConstants.UnitAndTileMaxSkinId + 1;
            const existingPlayer    = getWarData().playerManager.players.find(v => v.unitAndTileSkinId === newSkinId);
            if (existingPlayer) {
                setUnitAndTileSkinId(existingPlayer.playerIndex, currSkinId);
            }
            setUnitAndTileSkinId(playerIndex, newSkinId);
        }
        export function getUnitAndTileSkinId(playerIndex: number): number {
            return getPlayer(playerIndex).unitAndTileSkinId;
        }

        export function setIsControlledByPlayer(playerIndex: number, isByPlayer: boolean): void {
            getPlayer(playerIndex).userId = isByPlayer ? User.UserModel.getSelfUserId() : null;
        }
        export function getIsControlledByPlayer(playerIndex: number): boolean {
            return getPlayer(playerIndex).userId != null;
        }

        export function setHasFog(hasFog: boolean): void {
            getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
        }
        export function getHasFog(): boolean {
            return getWarRule().ruleForGlobalParams.hasFogByDefault;
        }

        export function tickTeamIndex(playerIndex: number): void {
            BwWarRuleHelper.tickTeamIndex(getWarRule(), playerIndex);
        }
        export function getTeamIndex(playerIndex: number): number {
            return BwWarRuleHelper.getTeamIndex(getWarRule(), playerIndex);
        }

        export function setInitialFund(playerIndex: number, fund: number): void {
            BwWarRuleHelper.setInitialFund(getWarRule(), playerIndex, fund);
        }
        export function getInitialFund(playerIndex: number): number {
            return BwWarRuleHelper.getInitialFund(getWarRule(), playerIndex);
        }

        export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
            BwWarRuleHelper.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
        }
        export function getIncomeMultiplier(playerIndex: number): number {
            return BwWarRuleHelper.getIncomeMultiplier(getWarRule(), playerIndex);
        }

        export function setInitialEnergyPercentage(playerIndex: number, percentage: number): void {
            BwWarRuleHelper.setInitialEnergyPercentage(getWarRule(), playerIndex, percentage);
        }
        export function getInitialEnergyPercentage(playerIndex: number): number {
            return BwWarRuleHelper.getInitialEnergyPercentage(getWarRule(), playerIndex);
        }

        export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
            BwWarRuleHelper.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
        }
        export function getEnergyGrowthMultiplier(playerIndex: number): number {
            return BwWarRuleHelper.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
        }

        export function getBannedCoIdArray(playerIndex: number): number[] {
            return BwWarRuleHelper.getBannedCoIdArray(getWarRule(), playerIndex);
        }
        export function addBannedCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.addBannedCoId(getWarRule(), playerIndex, coId);
        }
        export function deleteBannedCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.deleteBannedCoId(getWarRule(), playerIndex, coId);
        }

        export function setLuckLowerLimit(playerIndex: number, limit: number): void {
            BwWarRuleHelper.setLuckLowerLimit(getWarRule(), playerIndex, limit);
        }
        export function getLuckLowerLimit(playerIndex: number): number {
            return BwWarRuleHelper.getLuckLowerLimit(getWarRule(), playerIndex);
        }

        export function setLuckUpperLimit(playerIndex: number, limit: number): void {
            BwWarRuleHelper.setLuckUpperLimit(getWarRule(), playerIndex, limit);
        }
        export function getLuckUpperLimit(playerIndex: number): number {
            return BwWarRuleHelper.getLuckUpperLimit(getWarRule(), playerIndex);
        }

        export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
            BwWarRuleHelper.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
        }
        export function getMoveRangeModifier(playerIndex: number): number {
            return BwWarRuleHelper.getMoveRangeModifier(getWarRule(), playerIndex);
        }

        export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
            BwWarRuleHelper.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
        }
        export function getAttackPowerModifier(playerIndex: number): number {
            return BwWarRuleHelper.getAttackPowerModifier(getWarRule(), playerIndex);
        }

        export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
            BwWarRuleHelper.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
        }
        export function getVisionRangeModifier(playerIndex: number): number {
            return BwWarRuleHelper.getVisionRangeModifier(getWarRule(), playerIndex);
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
