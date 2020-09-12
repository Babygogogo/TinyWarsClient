
namespace TinyWars.BaseWar.BwSettingsHelper {
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSettings          = ProtoTypes.WarSettings;
    import ISettingsForCommon   = WarSettings.ISettingsForCommon;

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
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getIncomeMultiplier() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getIncomeMultiplier() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.incomeMultiplier;
    }

    export function getEnergyGrowthMultiplier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getEnergyGrowthMultiplier() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getEnergyGrowthMultiplier() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.energyGrowthMultiplier;
    }

    export function getAttackPowerModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getAttackPowerModifier() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getAttackPowerModifier() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.attackPowerModifier;
    }

    export function getMoveRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getMoveRangeModifier() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getMoveRangeModifier() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.moveRangeModifier;
    }

    export function getVisionRangeModifier(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getVisionRangeModifier() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getVisionRangeModifier() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.visionRangeModifier;
    }

    export function getInitialFund(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialFund() empty warRule.`);
            return undefined;
        }

        const playerRuleDataList = warRule.ruleForPlayers?.playerRuleDataList;
        if (playerRuleDataList == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialFund() empty playerRuleDataList.`);
            return undefined;
        }

        for (const rule of playerRuleDataList) {
            if (rule.playerIndex === playerIndex) {
                const fund = rule.initialFund;
                if (fund != null) {
                    return fund;
                }
            }
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialFund() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.initialEnergyPercentage;
    }

    export function getInitialEnergyPercentage(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialEnergyPercentage() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getInitialEnergyPercentage() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.initialEnergyPercentage;
    }

    export function getLuckLowerLimit(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckLowerLimit() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckLowerLimit() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.luckLowerLimit;
    }

    export function getLuckUpperLimit(settingsForCommon: ISettingsForCommon, playerIndex: number): number | null | undefined {
        const warRule = settingsForCommon.warRule;
        if (warRule == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckUpperLimit() empty warRule.`);
            return undefined;
        }

        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getLuckUpperLimit() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.luckUpperLimit;
    }
}
