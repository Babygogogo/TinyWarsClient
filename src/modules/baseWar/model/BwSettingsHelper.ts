
namespace TinyWars.BaseWar.BwSettingsHelper {
    import ConfigManager        = Utility.ConfigManager;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import Types                = Utility.Types;
    import LanguageType         = Types.LanguageType;
    import WarSettings          = ProtoTypes.WarSettings;
    import WarRule              = ProtoTypes.WarRule;
    import ISettingsForCommon   = WarSettings.ISettingsForCommon;
    import IDataForPlayerRule   = WarRule.IDataForPlayerRule;
    import IWarRule             = WarRule.IWarRule;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    const DEFAULT_PLAYER_RULE: ProtoTypes.WarRule.IDataForPlayerRule = {
        playerIndex             : CommonConstants.WarNeutralPlayerIndex,
        teamIndex               : 0,
        attackPowerModifier     : 0,
        availableCoIdList       : [0],
        energyGrowthMultiplier  : 100,
        initialEnergyPercentage : 0,
        initialFund             : 0,
        incomeMultiplier        : 100,
        luckLowerLimit          : 0,
        luckUpperLimit          : 10,
        moveRangeModifier       : 0,
        visionRangeModifier     : 0,
    };

    export function getHasFogByDefault(warRule: IWarRule): boolean | null | undefined {
        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.getHasFogByDefault() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.hasFogByDefault;
    }
    export function setHasFogByDefault(warRule: IWarRule, hasFog: boolean): void {
        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwCommonSettingsHelper.setHasFogByDefault() empty ruleForGlobalParams.`);
            return undefined;
        }

        ruleForGlobalParams.hasFogByDefault = hasFog;
    }

    export function getIncomeMultiplier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setIncomeMultiplier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setIncomeMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.incomeMultiplier = value;
    }

    export function getEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setEnergyGrowthMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.energyGrowthMultiplier = value;
    }

    export function getAttackPowerModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setAttackPowerModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setAttackPowerModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.attackPowerModifier = value;
    }

    export function getMoveRangeModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setMoveRangeModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setMoveRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.moveRangeModifier = value;
    }

    export function getVisionRangeModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setVisionRangeModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setVisionRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.visionRangeModifier = value;
    }

    export function getInitialFund(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setInitialFund(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setInitialFund() empty playerRule.`);
            return undefined;
        }

        playerRule.initialFund = value;
    }

    export function getInitialEnergyPercentage(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setInitialEnergyPercentage(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setInitialEnergyPercentage() empty playerRule.`);
            return undefined;
        }

        playerRule.initialEnergyPercentage = value;
    }

    export function getLuckLowerLimit(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setLuckLowerLimit(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setLuckLowerLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckLowerLimit = value;
    }

    export function getLuckUpperLimit(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function setLuckUpperLimit(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwCommonSettingsHelper.setLuckUpperLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckUpperLimit = value;
    }

    export function getAvailableCoIdList(warRule: IWarRule, playerIndex: number): number[] {
        const playerRule = getPlayerRule(warRule, playerIndex);
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
    export function addAvailableCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(warRule, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwSettingsHelper.addAvailableCoId() empty coIdList.`);
            return undefined;
        }

        if (coIdList.indexOf(coId) < 0) {
            coIdList.push(coId);
        }
    }
    export function removeAvailableCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(warRule, playerIndex);
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
    export function setAvailableCoIdList(warRule: IWarRule, playerIndex: number, coIdSet: Set<number>): void {
        const coIdList = getAvailableCoIdList(warRule, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwSettingsHelper.setAvailableCoIdList() empty coIdList.`);
            return undefined;
        }

        coIdList.length = 0;
        for (const coId of coIdSet) {
            coIdList.push(coId);
        }
    }

    export function getTeamIndex(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwSettingsHelper.getTeamIndex() empty playerRule.`);
            return undefined;
        }

        const teamIndex = playerRule.teamIndex;
        if (teamIndex == null) {
            Logger.error(`BwSettingsHelper.getTeamIndex() empty teamIndex.`);
            return undefined;
        }

        return teamIndex;
    }
    export function setTeamIndex(warRule: IWarRule, playerIndex: number, teamIndex: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwSettingsHelper.getTeamIndex() empty playerRule.`);
            return undefined;
        }

        playerRule.teamIndex = teamIndex;
    }
    export function tickTeamIndex(warRule: IWarRule, playerIndex: number): void {
        setTeamIndex(
            warRule,
            playerIndex,
            getTeamIndex(warRule, playerIndex) % getPlayersCount(warRule) + 1
        );
    }

    export function getPlayerRule(warRule: IWarRule, playerIndex: number): IDataForPlayerRule | undefined {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return DEFAULT_PLAYER_RULE;
        }

        const ruleForPlayers = warRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            Logger.error(`BwSettingsHelper.getPlayerRule() empty ruleForPlayers.`);
            return undefined;
        }

        const playerRuleDataList = ruleForPlayers.playerRuleDataList;
        if (playerRuleDataList == null) {
            Logger.error(`BwSettingsHelper.getPlayerRule() empty playerRuleDataList.`);
            return undefined;
        }

        return playerRuleDataList.find(v => v.playerIndex === playerIndex);
    }

    export function getPlayersCount(warRule: IWarRule): number {
        const ruleForPlayers = warRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            Logger.error(`BwSettingsHelper.getPlayersCount() empty ruleForPlayers.`);
            return undefined;
        }

        const playerRuleDataList = ruleForPlayers.playerRuleDataList;
        if (playerRuleDataList == null) {
            Logger.error(`BwSettingsHelper.getPlayersCount() empty playerRuleDataList.`);
            return undefined;
        }

        return playerRuleDataList.length;
    }

    export function getRandomCoId(settingsForCommon: ISettingsForCommon, playerIndex: number): number {
        const configVersion     = settingsForCommon.configVersion;
        const availableCoIdList = getPlayerRule(settingsForCommon.warRule, playerIndex).availableCoIdList.filter(coId => {
            const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
            return (cfg != null) && (cfg.isEnabled);
        });
        if (availableCoIdList.length <= 1) {
            return availableCoIdList[0];
        } else {
            return Helpers.pickRandomElement(availableCoIdList.filter(v => v !== CommonConstants.CoEmptyId));
        }
    }

    export function createDefaultWarRule(ruleId: number, playersCount: number): IWarRule {
        return {
            ruleId          : ruleId,
            ruleNameList    : [
                Lang.getTextWithLanguage(Lang.Type.B0001, LanguageType.Chinese),
                Lang.getTextWithLanguage(Lang.Type.B0001, LanguageType.English),
            ],
            ruleAvailability: {
                canMcw  : true,
                canScw  : true,
                canRank : false,
                canWr   : false,
            },
            ruleForGlobalParams : {
                hasFogByDefault : false,
            },
            ruleForPlayers: {
                playerRuleDataList: createDefaultPlayerRuleList(playersCount),
            },
        }
    }
    function createDefaultPlayerRuleList(playersCount: number): IDataForPlayerRule[] {
        const playerRuleDataList: IDataForPlayerRule[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            playerRuleDataList.push(createDefaultPlayerRule(playerIndex));
        }
        return playerRuleDataList;
    }
    function createDefaultPlayerRule(playerIndex: number): IDataForPlayerRule {
        return {
            playerIndex,
            teamIndex               : playerIndex,
            initialFund             : CommonConstants.WarRuleInitialFundDefault,
            incomeMultiplier        : CommonConstants.WarRuleIncomeMultiplierDefault,
            initialEnergyPercentage : CommonConstants.WarRuleInitialEnergyPercentageDefault,
            energyGrowthMultiplier  : CommonConstants.WarRuleEnergyGrowthMultiplierDefault,
            moveRangeModifier       : CommonConstants.WarRuleMoveRangeModifierDefault,
            attackPowerModifier     : CommonConstants.WarRuleOffenseBonusDefault,
            visionRangeModifier     : CommonConstants.WarRuleVisionRangeModifierDefault,
            luckLowerLimit          : CommonConstants.WarRuleLuckDefaultLowerLimit,
            luckUpperLimit          : CommonConstants.WarRuleLuckDefaultUpperLimit,
            availableCoIdList       : ConfigManager.getAvailableCoList(ConfigManager.getLatestConfigVersion()).map(v => v.coId),
        }
    }
    export function reviseWarRule(warRule: IWarRule, playersCount: number): void {
        const ruleForPlayers = warRule.ruleForPlayers;
        if (!ruleForPlayers.playerRuleDataList) {
            ruleForPlayers.playerRuleDataList = [];
        }

        const playerRuleDataList = ruleForPlayers.playerRuleDataList;
        for (let index = 0; index < playerRuleDataList.length; ++index) {
            const playerRule = playerRuleDataList[index];
            if (playerRule.playerIndex > playersCount) {
                playerRuleDataList.splice(index, 1);
                --index;
                continue;
            }
        }

        for (const playerRule of playerRuleDataList) {
            playerRule.teamIndex = Math.min(playerRule.teamIndex, playersCount);
        }

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            if (playerRuleDataList.find(v => v.playerIndex === playerIndex) == null) {
                playerRuleDataList.push(createDefaultPlayerRule(playerIndex));
            }
        }
    }

    export function checkIsValidWarRule(rule: IWarRule): boolean {
        const ruleNameList = rule.ruleNameList;
        if ((!ruleNameList) || (!ruleNameList.length)) {
            return false;
        }
        for (const ruleName of ruleNameList) {
            const length = ruleName.length;
            if ((length <= 0) || (length > CommonConstants.WarRuleNameMaxLength)) {
                return false;
            }
        }

        const ruleForPlayers = rule.ruleForPlayers;
        if ((!ruleForPlayers) || (!checkIsValidRuleForPlayers(ruleForPlayers))) {
            return false;
        }

        const availability = rule.ruleAvailability;
        if ((!availability) || (!checkIsValidWarRuleAvailability(availability))) {
            return false;
        }

        const ruleForGlobalParams = rule.ruleForGlobalParams;
        if ((!ruleForGlobalParams) || (!checkIsValidRuleForGlobalParams(ruleForGlobalParams))) {
            return false;
        }

        return true;
    }
    export function checkIsValidRuleForPlayers(ruleForPlayers: WarRule.IRuleForPlayers): boolean | undefined {
        const configVersion = ConfigManager.getLatestConfigVersion();
        if (configVersion == null) {
            Logger.error(`BwSettingsHelper.checkIsValidRuleForPlayers() empty configVersion.`);
            return undefined;
        }

        const ruleList = ruleForPlayers.playerRuleDataList;
        if (!ruleList) {
            return false;
        }

        const playersCount = ruleList.length;
        if (playersCount < 2) {
            return false;
        }

        const playerIndexSet    = new Set<number>();
        const teamIndexSet      = new Set<number>();
        for (const data of ruleList) {
            const playerIndex   = data.playerIndex;
            const teamIndex     = data.teamIndex;
            if ((playerIndex    ==  null)                                       ||
                (playerIndex    <   1)                                          ||
                (playerIndex    >   playersCount)                               ||
                (playerIndexSet.has(playerIndex))                               ||
                (teamIndex      ==  null)                                       ||
                (teamIndex      <   1)                                          ||
                (teamIndex      >   playersCount)
            ) {
                return false;
            }

            const {
                initialFund,        availableCoIdList,      incomeMultiplier,       initialEnergyPercentage,    energyGrowthMultiplier,
                moveRangeModifier,  attackPowerModifier,    visionRangeModifier,    luckUpperLimit,             luckLowerLimit,
            } = data;
            if ((initialFund                == null)                                                    ||
                (initialFund                > CommonConstants.WarRuleInitialFundMaxLimit)               ||
                (initialFund                < CommonConstants.WarRuleInitialFundMinLimit)               ||
                (incomeMultiplier           == null)                                                    ||
                (incomeMultiplier           > CommonConstants.WarRuleIncomeMultiplierMaxLimit)          ||
                (incomeMultiplier           < CommonConstants.WarRuleIncomeMultiplierMinLimit)          ||
                (initialEnergyPercentage    == null)                                                    ||
                (initialEnergyPercentage    > CommonConstants.WarRuleInitialEnergyPercentageMaxLimit)   ||
                (initialEnergyPercentage    < CommonConstants.WarRuleInitialEnergyPercentageMinLimit)   ||
                (energyGrowthMultiplier     == null)                                                    ||
                (energyGrowthMultiplier     > CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit)    ||
                (energyGrowthMultiplier     < CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)    ||
                (moveRangeModifier          == null)                                                    ||
                (moveRangeModifier          > CommonConstants.WarRuleMoveRangeModifierMaxLimit)         ||
                (moveRangeModifier          < CommonConstants.WarRuleMoveRangeModifierMinLimit)         ||
                (attackPowerModifier        == null)                                                    ||
                (attackPowerModifier        > CommonConstants.WarRuleOffenseBonusMaxLimit)              ||
                (attackPowerModifier        < CommonConstants.WarRuleOffenseBonusMinLimit)              ||
                (visionRangeModifier        == null)                                                    ||
                (visionRangeModifier        > CommonConstants.WarRuleVisionRangeModifierMaxLimit)       ||
                (visionRangeModifier        < CommonConstants.WarRuleVisionRangeModifierMinLimit)       ||
                (luckLowerLimit             == null)                                                    ||
                (luckLowerLimit             > CommonConstants.WarRuleLuckMaxLimit)                      ||
                (luckLowerLimit             < CommonConstants.WarRuleLuckMinLimit)                      ||
                (luckUpperLimit             == null)                                                    ||
                (luckUpperLimit             > CommonConstants.WarRuleLuckMaxLimit)                      ||
                (luckUpperLimit             < CommonConstants.WarRuleLuckMinLimit)                      ||
                (luckUpperLimit             < luckLowerLimit)                                           ||
                (availableCoIdList          == null)                                                    ||
                (availableCoIdList.every(v => v !== CommonConstants.CoEmptyId))                         ||
                (availableCoIdList.some(coId => ConfigManager.getCoBasicCfg(configVersion, coId) == null))
            ) {
                return false;
            }

            playerIndexSet.add(playerIndex);
            teamIndexSet.add(teamIndex);
        }

        return (playerIndexSet.size === playersCount)
            && (teamIndexSet.size > 1);
    }
    function checkIsValidWarRuleAvailability(availability: WarRule.IDataForWarRuleAvailability): boolean {
        const {
            canMcw,     canScw,     canRank,    canWr,
        } = availability;
        return (!!canMcw)
            || (!!canScw)
            || (!!canRank)
            || (!!canWr);
    }
    function checkIsValidRuleForGlobalParams(rule: WarRule.IRuleForGlobalParams): boolean | undefined {
        const configVersion = ConfigManager.getLatestConfigVersion();
        if (configVersion == null) {
            Logger.error(`BwSettingsHelper.checkIsValidRuleForGlobalParams() empty configVersion.`);
            return undefined;
        }

        const {
            hasFogByDefault,
        } = rule;
        if (hasFogByDefault == null) {
            return false;
        }

        return true;
    }
}
