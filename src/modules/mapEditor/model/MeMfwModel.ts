

import Logger           from "../../tools/helpers/Logger";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Helpers          from "../../tools/helpers/Helpers";
import ProtoTypes       from "../../tools/proto/ProtoTypes";
import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";
import UserModel        from "../../user/model/UserModel";

namespace MeMfwModel {
    import ISerialWar                       = ProtoTypes.WarSerialization.ISerialWar;
    import IMapRawData                      = ProtoTypes.Map.IMapRawData;

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

    export function reviseWarRuleForAi(): void {
        setPresetWarRuleId(null);

        const warRule           = getWarRule();
        const playerRuleArray   = warRule.ruleForPlayers.playerRuleDataArray;
        let hasAiPlayer         = false;
        for (const player of getWarData().playerManager.players) {
            const playerRule = playerRuleArray.find(v => v.playerIndex === player.playerIndex);
            if (playerRule == null) {
                continue;
            }

            const isAiPlayer = player.userId == null;
            if (isAiPlayer) {
                hasAiPlayer = true;
            }

            playerRule.fixedCoIdInCcw = isAiPlayer ? player.coId : null;
        }

        const ruleAvailability  = warRule.ruleAvailability;
        ruleAvailability.canMrw = false;
        ruleAvailability.canScw = false;
        ruleAvailability.canScw = false;
        ruleAvailability.canCcw = hasAiPlayer;
        ruleAvailability.canMcw = !hasAiPlayer;
    }

    function resetDataByPresetWarRuleId(ruleId: number | null): void {
        const settingsForCommon = getWarData().settingsForCommon;
        const mapRawData        = getMapRawData();
        const playersCount      = mapRawData.playersCountUnneutral;

        if (ruleId == null) {
            settingsForCommon.warRule = WarRuleHelpers.createDefaultWarRule(ruleId, playersCount);
        } else {
            const warRule = mapRawData.warRuleArray.find(r => r.ruleId === ruleId);
            if (warRule == null) {
                Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                return undefined;
            }

            settingsForCommon.warRule = Helpers.deepClone(warRule);
        }

        setPresetWarRuleId(ruleId);
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
            setCoId(playerIndex, WarRuleHelpers.getRandomCoIdWithSettingsForCommon(settingsForCommon, playerIndex));
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
        getPlayer(playerIndex).userId = isByPlayer ? UserModel.getSelfUserId() : null;
    }
    export function getIsControlledByHuman(playerIndex: number): boolean {
        return getPlayer(playerIndex).userId != null;
    }

    export function setHasFog(hasFog: boolean): void {
        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }

    export function tickTeamIndex(playerIndex: number): void {
        WarRuleHelpers.tickTeamIndex(getWarRule(), playerIndex);
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

    export function getBannedCoIdArray(playerIndex: number): number[] {
        return WarRuleHelpers.getBannedCoIdArray(getWarRule(), playerIndex);
    }
    export function addBannedCoId(playerIndex: number, coId: number): void {
        WarRuleHelpers.addBannedCoId(getWarRule(), playerIndex, coId);
    }
    export function deleteBannedCoId(playerIndex: number, coId: number): void {
        WarRuleHelpers.deleteBannedCoId(getWarRule(), playerIndex, coId);
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

export default MeMfwModel;
