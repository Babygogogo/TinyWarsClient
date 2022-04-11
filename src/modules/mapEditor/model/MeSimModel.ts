
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MeSimModel {
    import ISerialWar                       = CommonProto.WarSerialization.ISerialWar;
    import IMapRawData                      = CommonProto.Map.IMapRawData;

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
        for (const player of Helpers.getExisted(_warData.settingsForCommon?.warRule?.ruleForPlayers?.playerRuleDataArray)) {
            teamIndexSet.add(Helpers.getExisted(player.teamIndex));
        }
        return teamIndexSet.size > 1;
    }

    export function getWarRule(): CommonProto.WarRule.IWarRule {
        return Helpers.getExisted(getWarData().settingsForCommon?.warRule);
    }

    async function resetDataByPresetWarRuleId(ruleId: number | null): Promise<void> {
        const settingsForCommon = Helpers.getExisted(getWarData().settingsForCommon);
        const mapRawData        = getMapRawData();
        const playersCount      = Helpers.getExisted(mapRawData.playersCountUnneutral);

        if (ruleId == null) {
            settingsForCommon.warRule = WarRuleHelpers.createDefaultWarRule(ruleId, playersCount);
        } else {
            settingsForCommon.warRule = Helpers.deepClone(Helpers.getExisted(mapRawData.warRuleArray?.find(r => r.ruleId === ruleId)));
        }

        setPresetWarRuleId(ruleId);

        const gameConfig = await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
            setCoId(playerIndex, WarRuleHelpers.getRandomCoIdWithSettingsForCommon(settingsForCommon.warRule, playerIndex, gameConfig));
        }
    }
    export function setPresetWarRuleId(ruleId: number | null): void {
        getWarRule().ruleId                                                 = ruleId;
        Helpers.getExisted(getWarData().settingsForCommon).presetWarRuleId  = ruleId;
    }
    export function getPresetWarRuleId(): number | null {
        return Helpers.getExisted(getWarData().settingsForCommon).presetWarRuleId ?? null;
    }
    export async function tickPresetWarRuleId(): Promise<void> {
        const currWarRuleId = getPresetWarRuleId();
        if (currWarRuleId == null) {
            await resetDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
        } else {
            await resetDataByPresetWarRuleId((currWarRuleId + 1) % Helpers.getExisted(getMapRawData().warRuleArray).length);
        }
    }

    function getPlayer(playerIndex: number): CommonProto.WarSerialization.ISerialPlayer {
        return Helpers.getExisted(getWarData().playerManager?.players?.find(v => v.playerIndex === playerIndex));
    }

    export function setCoId(playerIndex: number, coId: number): void {
        getPlayer(playerIndex).coId = coId;
    }
    export function getCoId(playerIndex: number): number {
        return Helpers.getExisted(getPlayer(playerIndex).coId);
    }

    function setUnitAndTileSkinId(playerIndex: number, skinId: number): void {
        getPlayer(playerIndex).unitAndTileSkinId = skinId;
    }
    export function tickUnitAndTileSkinId(playerIndex: number): void {
        const currSkinId        = getUnitAndTileSkinId(playerIndex);
        const newSkinId         = currSkinId % CommonConstants.UnitAndTileMaxSkinId + 1;
        // const existingPlayer    = getWarData().playerManager?.players?.find(v => v.unitAndTileSkinId === newSkinId);
        // if (existingPlayer) {
        //     setUnitAndTileSkinId(Helpers.getExisted(existingPlayer.playerIndex), currSkinId);
        // }
        setUnitAndTileSkinId(playerIndex, newSkinId);
    }
    export function getUnitAndTileSkinId(playerIndex: number): number {
        return Helpers.getExisted(getPlayer(playerIndex).unitAndTileSkinId);
    }

    export function setIsControlledByPlayer(playerIndex: number, isByPlayer: boolean): void {
        getPlayer(playerIndex).userId = isByPlayer ? UserModel.getSelfUserId() : null;
    }
    export function getIsControlledByPlayer(playerIndex: number): boolean {
        return getPlayer(playerIndex).userId != null;
    }

    export function setHasFog(hasFog: boolean): void {
        Helpers.getExisted(getWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getWarRule().ruleForGlobalParams?.hasFogByDefault);
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

// export default MeSimModel;
