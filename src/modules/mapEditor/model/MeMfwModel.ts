

// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor.MeMfwModel {
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import IMapRawData      = CommonProto.Map.IMapRawData;

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
        for (const player of Helpers.getExisted(getInstanceWarRule().ruleForPlayers?.playerRuleDataArray)) {
            teamIndexSet.add(Helpers.getExisted(player.teamIndex));
        }
        return teamIndexSet.size > 1;
    }

    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Helpers.getExisted(getWarData().settingsForCommon?.instanceWarRule);
    }

    export function reviseInstanceWarRuleForAi(): void {
        setCustomWarRuleId();

        const playerRuleArray = Helpers.getExisted(getInstanceWarRule().ruleForPlayers?.playerRuleDataArray);
        for (const player of Helpers.getExisted(getWarData().playerManager?.players)) {
            const playerRule = playerRuleArray.find(v => v.playerIndex === player.playerIndex);
            if (playerRule == null) {
                continue;
            }

            const isAiPlayer            = player.userId == null;
            playerRule.fixedCoIdInCcw   = isAiPlayer ? player.coId : null;
        }
    }

    async function resetDataByTemplateWarRuleId(templateWarRuleId: number | null): Promise<void> {
        const settingsForCommon     = Helpers.getExisted(getWarData().settingsForCommon);
        const mapRawData            = getMapRawData();
        const playersCountUnneutral = Helpers.getExisted(mapRawData.playersCountUnneutral);
        const gameConfig            = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));

        if (templateWarRuleId == null) {
            settingsForCommon.instanceWarRule = WarHelpers.WarRuleHelpers.createDefaultInstanceWarRule(playersCountUnneutral, gameConfig);
        } else {
            const templateWarRule               = Helpers.getExisted(mapRawData.templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId));
            settingsForCommon.instanceWarRule   = WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData);
        }

        for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            setCoId(playerIndex, WarHelpers.WarRuleHelpers.getRandomCoIdWithSettingsForCommon(settingsForCommon.instanceWarRule, playerIndex, gameConfig));
        }
    }
    export function setCustomWarRuleId(): void {
        const instanceWarRule               = getInstanceWarRule();
        instanceWarRule.templateWarRuleId   = null;
    }
    export function getTemplateWarRuleId(): number | null {
        return getInstanceWarRule().templateWarRuleId ?? null;
    }
    export async function tickTemplateWarRuleId(): Promise<void> {
        const currTemplateWarRuleId = getTemplateWarRuleId();
        const templateWarRuleArray  = Helpers.getExisted(getMapRawData().templateWarRuleArray);
        if (currTemplateWarRuleId == null) {
            await resetDataByTemplateWarRuleId(Helpers.getExisted(templateWarRuleArray[0].ruleId));
        } else {
            const newTemplateWarRuleId = Helpers.getNonNullElements(templateWarRuleArray.map(v => v.ruleId)).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
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
        getPlayer(playerIndex).userId = isByPlayer ? User.UserModel.getSelfUserId() : null;
    }
    export function getIsControlledByHuman(playerIndex: number): boolean {
        return getPlayer(playerIndex).userId != null;
    }

    export function setHasFog(hasFog: boolean): void {
        Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function tickTeamIndex(playerIndex: number): void {
        WarHelpers.WarRuleHelpers.tickTeamIndex(getInstanceWarRule(), playerIndex);
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

// export default MeMfwModel;
