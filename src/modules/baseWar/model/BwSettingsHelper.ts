
namespace TinyWars.BaseWar.BwSettingsHelper {
    import ConfigManager        = Utility.ConfigManager;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSettings          = ProtoTypes.WarSettings;
    import ISettingsForCommon   = WarSettings.ISettingsForCommon;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;

    export function getHasFogByDefault(settingsForCommon: ISettingsForCommon): boolean | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getHasFogByDefault() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getHasFogByDefault() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.hasFogByDefault;
    }

    export function getIncomeMultiplier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getIncomeMultiplier() empty playerRule.`);
            return undefined;
        }

        const incomeMultiplier = playerRule.incomeMultiplier;
        if (incomeMultiplier == null) {
            Logger.error(`BwCommonSettingsHelper.getIncomeMultiplier() empty incomeMultiplier.`);
            return undefined;
        }

        return incomeMultiplier;
    }
    export function setIncomeMultiplier(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setIncomeMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.incomeMultiplier = value;
    }

    export function getEnergyGrowthMultiplier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getEnergyGrowthMultiplier() empty playerRule.`);
            return undefined;
        }

        const energyGrowthMultiplier = playerRule.energyGrowthMultiplier;
        if (energyGrowthMultiplier == null) {
            Logger.error(`BwCommonSettingsHelper.getEnergyGrowthMultiplier() empty energyGrowthMultiplier.`);
            return undefined;
        }

        return energyGrowthMultiplier;
    }
    export function setEnergyGrowthMultiplier(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setEnergyGrowthMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.energyGrowthMultiplier = value;
    }

    export function getAttackPowerModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getAttackPowerModifier() empty playerRule.`);
            return undefined;
        }

        const attackPowerModifier = playerRule.attackPowerModifier;
        if (attackPowerModifier == null) {
            Logger.error(`BwCommonSettingsHelper.getAttackPowerModifier() empty attackPowerModifier.`);
            return undefined;
        }

        return attackPowerModifier;
    }
    export function setAttackPowerModifier(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setAttackPowerModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.attackPowerModifier = value;
    }

    export function getMoveRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getMoveRangeModifier() empty playerRule.`);
            return undefined;
        }

        const moveRangeModifier = playerRule.moveRangeModifier;
        if (moveRangeModifier == null) {
            Logger.error(`BwCommonSettingsHelper.getMoveRangeModifier() empty moveRangeModifier.`);
            return undefined;
        }

        return moveRangeModifier;
    }
    export function setMoveRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setMoveRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.moveRangeModifier = value;
    }

    export function getVisionRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getVisionRangeModifier() empty playerRule.`);
            return undefined;
        }

        const visionRangeModifier = playerRule.visionRangeModifier;
        if (visionRangeModifier == null) {
            Logger.error(`BwCommonSettingsHelper.getVisionRangeModifier() empty visionRangeModifier.`);
            return undefined;
        }

        return visionRangeModifier;
    }
    export function setVisionRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setVisionRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.visionRangeModifier = value;
    }

    export function getInitialFund(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialFund() empty playerRule.`);
            return undefined;
        }

        const initialFund = playerRule.initialFund;
        if (initialFund == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialFund() empty initialFund.`);
            return undefined;
        }

        return initialFund;
    }
    export function setInitialFund(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setInitialFund() empty playerRule.`);
            return undefined;
        }

        playerRule.initialFund = value;
    }

    export function getInitialEnergyPercentage(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialEnergyPercentage() empty playerRule.`);
            return undefined;
        }

        const initialEnergyPercentage = playerRule.initialEnergyPercentage;
        if (initialEnergyPercentage == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialEnergyPercentage() empty initialEnergyPercentage.`);
            return undefined;
        }

        return initialEnergyPercentage;
    }
    export function setInitialEnergyPercentage(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setInitialEnergyPercentage() empty playerRule.`);
            return undefined;
        }

        playerRule.initialEnergyPercentage = value;
    }

    export function getLuckLowerLimit(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckLowerLimit() empty playerRule.`);
            return undefined;
        }

        const luckLowerLimit = playerRule.luckLowerLimit;
        if (luckLowerLimit == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckLowerLimit() empty luckLowerLimit.`);
            return undefined;
        }

        return luckLowerLimit;
    }
    export function setLuckLowerLimit(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setLuckLowerLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckLowerLimit = value;
    }

    export function getLuckUpperLimit(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckUpperLimit() empty playerRule.`);
            return undefined;
        }

        const luckUpperLimit = playerRule.luckUpperLimit;
        if (luckUpperLimit == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckUpperLimit() empty luckUpperLimit.`);
            return undefined;
        }

        return luckUpperLimit;
    }
    export function setLuckUpperLimit(settingsForCommon: ISettingsForCommon, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setLuckUpperLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckUpperLimit = value;
    }

    export function getAvailableCoIdList(settingsForCommon: ISettingsForCommon, playerIndex: number): number[] {
        const playerRule = getPlayerRule(settingsForCommon, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwSettingsHelper.getAvailableCoIdList() empty playerRule.`);
            return undefined;
        }

        const coIdList = playerRule.availableCoIdList;
        if ((coIdList == null) || (!coIdList.length)) {
            Logger.error(`BwSettingsHelper.getAvailableCoIdList() empty coIdList.`);
            return undefined;
        }

        return coIdList;
    }
    export function addAvailableCoId(settingsForCommon: ISettingsForCommon, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(settingsForCommon, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwSettingsHelper.addAvailableCoId() empty coIdList.`);
            return undefined;
        }

        if (coIdList.indexOf(coId) < 0) {
            coIdList.push(coId);
        }
    }
    export function removeAvailableCoId(settingsForCommon: ISettingsForCommon, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(settingsForCommon, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwSettingsHelper.removeAvailableCoId() empty coIdList.`);
            return undefined;
        }

        while (true) {
            const index = coIdList.indexOf(coId);
            if (index >= 0) {
                coIdList.splice(index, 1);
            } else {
                break;
            }
        }
    }

    export function getPlayerRule(settingsForCommon: ISettingsForCommon, playerIndex: number): IDataForPlayerRule | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getPlayerRule() empty warRule.`);
            return undefined;
        }

        const ruleForPlayers = warRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            Logger.error(`BwCommonSettingsHelper.getPlayerRule() empty ruleForPlayers.`);
            return undefined;
        }

        const playerRuleDataList = ruleForPlayers.playerRuleDataList;
        if (playerRuleDataList == null) {
            Logger.error(`BwCommonSettingsHelper.getPlayerRule() empty playerRuleDataList.`);
            return undefined;
        }

        return playerRuleDataList.find(v => v.playerIndex === playerIndex);
    }

    export function getRandomCoId(settingsForCommon: ISettingsForCommon, playerIndex: number): number {
        const configVersion = settingsForCommon.configVersion;
        return Helpers.pickRandomElement(getPlayerRule(settingsForCommon, playerIndex).availableCoIdList.filter(coId => {
            const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
            return (cfg != null) && (cfg.isEnabled);
        }));
    }
}
