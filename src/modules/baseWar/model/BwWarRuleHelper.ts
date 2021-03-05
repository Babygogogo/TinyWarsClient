
namespace TinyWars.BaseWar.BwWarRuleHelper {
    import ConfigManager        = Utility.ConfigManager;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import Types                = Utility.Types;
    import ClientErrorCode      = Utility.ClientErrorCode;
    import LanguageType         = Types.LanguageType;
    import BootTimerType        = Types.BootTimerType;
    import WarSettings          = ProtoTypes.WarSettings;
    import WarRule              = ProtoTypes.WarRule;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import ISettingsForCommon   = WarSettings.ISettingsForCommon;
    import IRuleForGlobalParams = WarRule.IRuleForGlobalParams;
    import IRuleForPlayers      = WarRule.IRuleForPlayers;
    import IDataForPlayerRule   = WarRule.IDataForPlayerRule;
    import IWarRule             = WarRule.IWarRule;
    import CommonConstants      = Utility.CommonConstants;

    const DEFAULT_PLAYER_RULE: ProtoTypes.WarRule.IDataForPlayerRule = {
        playerIndex             : CommonConstants.WarNeutralPlayerIndex,
        teamIndex               : 0,
        attackPowerModifier     : 0,
        availableCoIdArray      : [0],
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
            Logger.error(`BwWarRuleHelper.getHasFogByDefault() empty ruleForGlobalParams.`);
            return undefined;
        }

        return ruleForGlobalParams.hasFogByDefault;
    }
    export function setHasFogByDefault(warRule: IWarRule, hasFog: boolean): void {
        const ruleForGlobalParams = warRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            Logger.error(`BwWarRuleHelper.setHasFogByDefault() empty ruleForGlobalParams.`);
            return undefined;
        }

        ruleForGlobalParams.hasFogByDefault = hasFog;
    }

    export function getIncomeMultiplier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getIncomeMultiplier() empty playerRule.`);
            return undefined;
        }

        const incomeMultiplier = playerRule.incomeMultiplier;
        if (incomeMultiplier == null) {
            Logger.error(`BwWarRuleHelper.getIncomeMultiplier() empty incomeMultiplier.`);
            return undefined;
        }

        return incomeMultiplier;
    }
    export function setIncomeMultiplier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setIncomeMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.incomeMultiplier = value;
    }

    export function getEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getEnergyGrowthMultiplier() empty playerRule.`);
            return undefined;
        }

        const energyGrowthMultiplier = playerRule.energyGrowthMultiplier;
        if (energyGrowthMultiplier == null) {
            Logger.error(`BwWarRuleHelper.getEnergyGrowthMultiplier() empty energyGrowthMultiplier.`);
            return undefined;
        }

        return energyGrowthMultiplier;
    }
    export function setEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setEnergyGrowthMultiplier() empty playerRule.`);
            return undefined;
        }

        playerRule.energyGrowthMultiplier = value;
    }

    export function getAttackPowerModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getAttackPowerModifier() empty playerRule.`);
            return undefined;
        }

        const attackPowerModifier = playerRule.attackPowerModifier;
        if (attackPowerModifier == null) {
            Logger.error(`BwWarRuleHelper.getAttackPowerModifier() empty attackPowerModifier.`);
            return undefined;
        }

        return attackPowerModifier;
    }
    export function setAttackPowerModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setAttackPowerModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.attackPowerModifier = value;
    }

    export function getMoveRangeModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getMoveRangeModifier() empty playerRule.`);
            return undefined;
        }

        const moveRangeModifier = playerRule.moveRangeModifier;
        if (moveRangeModifier == null) {
            Logger.error(`BwWarRuleHelper.getMoveRangeModifier() empty moveRangeModifier.`);
            return undefined;
        }

        return moveRangeModifier;
    }
    export function setMoveRangeModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setMoveRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.moveRangeModifier = value;
    }

    export function getVisionRangeModifier(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getVisionRangeModifier() empty playerRule.`);
            return undefined;
        }

        const visionRangeModifier = playerRule.visionRangeModifier;
        if (visionRangeModifier == null) {
            Logger.error(`BwWarRuleHelper.getVisionRangeModifier() empty visionRangeModifier.`);
            return undefined;
        }

        return visionRangeModifier;
    }
    export function setVisionRangeModifier(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setVisionRangeModifier() empty playerRule.`);
            return undefined;
        }

        playerRule.visionRangeModifier = value;
    }

    export function getInitialFund(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getInitialFund() empty playerRule.`);
            return undefined;
        }

        const initialFund = playerRule.initialFund;
        if (initialFund == null) {
            Logger.error(`BwWarRuleHelper.getInitialFund() empty initialFund.`);
            return undefined;
        }

        return initialFund;
    }
    export function setInitialFund(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setInitialFund() empty playerRule.`);
            return undefined;
        }

        playerRule.initialFund = value;
    }

    export function getInitialEnergyPercentage(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getInitialEnergyPercentage() empty playerRule.`);
            return undefined;
        }

        const initialEnergyPercentage = playerRule.initialEnergyPercentage;
        if (initialEnergyPercentage == null) {
            Logger.error(`BwWarRuleHelper.getInitialEnergyPercentage() empty initialEnergyPercentage.`);
            return undefined;
        }

        return initialEnergyPercentage;
    }
    export function setInitialEnergyPercentage(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setInitialEnergyPercentage() empty playerRule.`);
            return undefined;
        }

        playerRule.initialEnergyPercentage = value;
    }

    export function getLuckLowerLimit(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getLuckLowerLimit() empty playerRule.`);
            return undefined;
        }

        const luckLowerLimit = playerRule.luckLowerLimit;
        if (luckLowerLimit == null) {
            Logger.error(`BwWarRuleHelper.getLuckLowerLimit() empty luckLowerLimit.`);
            return undefined;
        }

        return luckLowerLimit;
    }
    export function setLuckLowerLimit(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setLuckLowerLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckLowerLimit = value;
    }

    export function getLuckUpperLimit(warRule: IWarRule, playerIndex: number): number | null | undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getLuckUpperLimit() empty playerRule.`);
            return undefined;
        }

        const luckUpperLimit = playerRule.luckUpperLimit;
        if (luckUpperLimit == null) {
            Logger.error(`BwWarRuleHelper.getLuckUpperLimit() empty luckUpperLimit.`);
            return undefined;
        }

        return luckUpperLimit;
    }
    export function setLuckUpperLimit(warRule: IWarRule, playerIndex: number, value: number): undefined {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.setLuckUpperLimit() empty playerRule.`);
            return undefined;
        }

        playerRule.luckUpperLimit = value;
    }

    export function getAvailableCoIdList(warRule: IWarRule, playerIndex: number): number[] {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getAvailableCoIdList() empty playerRule.`);
            return undefined;
        }

        const coIdArray = playerRule.availableCoIdArray;
        if ((coIdArray == null) || (!coIdArray.length)) {
            Logger.error(`BwWarRuleHelper.getAvailableCoIdList() empty coIdList.`);
            return undefined;
        }

        return coIdArray;
    }
    export function addAvailableCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(warRule, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwWarRuleHelper.addAvailableCoId() empty coIdList.`);
            return undefined;
        }

        if (coIdList.indexOf(coId) < 0) {
            coIdList.push(coId);
        }
    }
    export function removeAvailableCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const coIdList = getAvailableCoIdList(warRule, playerIndex);
        if (coIdList == null) {
            Logger.error(`BwWarRuleHelper.removeAvailableCoId() empty coIdList.`);
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
            Logger.error(`BwWarRuleHelper.setAvailableCoIdList() empty coIdList.`);
            return undefined;
        }

        coIdList.length = 0;
        for (const coId of coIdSet) {
            coIdList.push(coId);
        }
    }

    export function getTeamIndex(warRule: IWarRule, playerIndex: number): number {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return CommonConstants.WarNeutralTeamIndex;
        }

        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getTeamIndex() empty playerRule.`);
            return undefined;
        }

        const teamIndex = playerRule.teamIndex;
        if (teamIndex == null) {
            Logger.error(`BwWarRuleHelper.getTeamIndex() empty teamIndex.`);
            return undefined;
        }

        return teamIndex;
    }
    export function setTeamIndex(warRule: IWarRule, playerIndex: number, teamIndex: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`BwWarRuleHelper.getTeamIndex() empty playerRule.`);
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
            Logger.error(`BwWarRuleHelper.getPlayerRule() empty ruleForPlayers.`);
            return undefined;
        }

        const playerRuleDataArray = ruleForPlayers.playerRuleDataArray;
        if (playerRuleDataArray == null) {
            Logger.error(`BwWarRuleHelper.getPlayerRule() empty playerRuleDataArray.`);
            return undefined;
        }

        return playerRuleDataArray.find(v => v.playerIndex === playerIndex);
    }

    export function getPlayersCount(warRule: IWarRule): number {
        const ruleForPlayers = warRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            Logger.error(`BwWarRuleHelper.getPlayersCount() empty ruleForPlayers.`);
            return undefined;
        }

        const playerRuleDataArray = ruleForPlayers.playerRuleDataArray;
        if (playerRuleDataArray == null) {
            Logger.error(`BwWarRuleHelper.getPlayersCount() empty playerRuleDataArray.`);
            return undefined;
        }

        return playerRuleDataArray.length;
    }

    export function moveWarEventId(warRule: IWarRule, warEventId: number, deltaIndex: number): void {
        const warEventIdArray   = warRule.warEventIdArray;
        const currIndex         = warEventIdArray.findIndex(v => v === warEventId);
        if (currIndex < 0) {
            Logger.error(`BwWarRuleHelper.moveWarEventId() invalid currIndex.`);
            return;
        }

        const newIndex = Math.max(0, Math.min(warEventIdArray.length - 1, currIndex + deltaIndex));
        if (currIndex !== newIndex) {
            warEventIdArray.splice(currIndex, 1);
            warEventIdArray.splice(newIndex, 0, warEventId);
        }
    }
    export function deleteWarEventId(warRule: IWarRule, warEventId: number): void {
        const warEventIdArray   = warRule.warEventIdArray;
        const currIndex         = warEventIdArray.findIndex(v => v === warEventId);
        if (currIndex < 0) {
            Logger.error(`BwWarRuleHelper.deleteWarEventId() invalid currIndex.`);
            return;
        }

        warEventIdArray.splice(currIndex, 1);
    }
    export function addWarEventId(warRule: IWarRule, warEventId: number): void {
        if (warRule.warEventIdArray == null) {
            warRule.warEventIdArray = [];
        }

        const warEventIdArray = warRule.warEventIdArray;
        if (warEventIdArray.indexOf(warEventId) >= 0) {
            Logger.error(`BwWarRuleHelper.addWarEventId() the warEventId exists.`);
            return;
        }

        warEventIdArray.push(warEventId);
    }

    export function getRandomCoIdWithSettingsForCommon(settingsForCommon: ISettingsForCommon, playerIndex: number): number {
        const configVersion = settingsForCommon.configVersion;
        return getRandomCoIdWithCoIdList(getPlayerRule(settingsForCommon.warRule, playerIndex).availableCoIdArray.filter(coId => {
            const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
            return (cfg != null) && (cfg.isEnabled);
        }));
    }
    export function getRandomCoIdWithCoIdList(coIdList: number[]): number {
        if (coIdList == null) {
            return undefined;
        } else {
            if (coIdList.length <= 1) {
                return coIdList[0];
            } else {
                return Helpers.pickRandomElement(coIdList.filter(v => v !== CommonConstants.CoEmptyId));
            }
        }
    }

    export function createDefaultWarRule(ruleId: number, playersCount: number): IWarRule {
        return {
            ruleId,
            ruleNameArray   : [
                { languageType: LanguageType.Chinese, text: Lang.getText(Lang.Type.B0001, LanguageType.Chinese) },
                { languageType: LanguageType.English, text: Lang.getText(Lang.Type.B0001, LanguageType.English) },
            ],
            ruleAvailability: {
                canMcw  : true,
                canScw  : true,
                canMrw  : false,
            },
            ruleForGlobalParams : {
                hasFogByDefault : false,
            },
            ruleForPlayers: {
                playerRuleDataArray: createDefaultPlayerRuleList(playersCount),
            },
        }
    }
    export function createDefaultPlayerRuleList(playersCount: number): IDataForPlayerRule[] {
        const playerRuleDataList: IDataForPlayerRule[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            playerRuleDataList.push(createDefaultPlayerRule(playerIndex));
        }
        return playerRuleDataList;
    }
    export function createDefaultPlayerRule(playerIndex: number): IDataForPlayerRule {
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
            availableCoIdArray      : ConfigManager.getAvailableCoArray(ConfigManager.getLatestFormalVersion()).map(v => v.coId),
        }
    }
    export function reviseWarRule(warRule: IWarRule, playersCount: number): void {
        const ruleForPlayers = warRule.ruleForPlayers;
        if (!ruleForPlayers.playerRuleDataArray) {
            ruleForPlayers.playerRuleDataArray = [];
        }

        const playerRuleDataArray = ruleForPlayers.playerRuleDataArray;
        for (let index = 0; index < playerRuleDataArray.length; ++index) {
            const playerRule = playerRuleDataArray[index];
            if (playerRule.playerIndex > playersCount) {
                playerRuleDataArray.splice(index, 1);
                --index;
                continue;
            }
        }

        for (const playerRule of playerRuleDataArray) {
            playerRule.teamIndex = Math.min(playerRule.teamIndex, playersCount);
        }

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            if (playerRuleDataArray.find(v => v.playerIndex === playerIndex) == null) {
                playerRuleDataArray.push(createDefaultPlayerRule(playerIndex));
            }
        }
    }

    export function checkIsValidWarRule(rule: IWarRule, warEventData: IWarEventFullData): boolean {
        const ruleNameArray = rule.ruleNameArray;
        if ((!ruleNameArray)                             ||
            (!Helpers.checkIsValidLanguageTextArray({
                list            : ruleNameArray,
                minTextLength   : 1,
                maxTextLength   : CommonConstants.WarRuleNameMaxLength,
                minTextCount    : 1,
            }))
        ) {
            return false;
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

        const warEventArray = warEventData ? warEventData.eventArray || [] : [];
        for (const warEventId of rule.warEventIdArray || []) {
            if (!warEventArray.some(v => v.eventId === warEventId)) {
                return false;
            }
        }

        return true;
    }
    export function checkIsValidRuleForPlayers(ruleForPlayers: WarRule.IRuleForPlayers): boolean | undefined {
        const configVersion = ConfigManager.getLatestFormalVersion();
        if (configVersion == null) {
            Logger.error(`BwWarRuleHelper.checkIsValidRuleForPlayers() empty configVersion.`);
            return undefined;
        }

        const ruleArray = ruleForPlayers.playerRuleDataArray;
        if (!ruleArray) {
            return false;
        }

        const playersCount = ruleArray.length;
        if (playersCount < 2) {
            return false;
        }

        const playerIndexSet    = new Set<number>();
        const teamIndexSet      = new Set<number>();
        for (const data of ruleArray) {
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
                initialFund,        availableCoIdArray,     incomeMultiplier,       initialEnergyPercentage,    energyGrowthMultiplier,
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
                (availableCoIdArray          == null)                                                    ||
                (availableCoIdArray.every(v => v !== CommonConstants.CoEmptyId))                         ||
                (availableCoIdArray.some(coId => ConfigManager.getCoBasicCfg(configVersion, coId) == null))
            ) {
                return false;
            }

            playerIndexSet.add(playerIndex);
            teamIndexSet.add(teamIndex);
        }

        return (playerIndexSet.size === playersCount)
            && (teamIndexSet.size > 1);
    }
    function checkIsValidRuleForGlobalParams(rule: WarRule.IRuleForGlobalParams): boolean | undefined {
        const configVersion = ConfigManager.getLatestFormalVersion();
        if (configVersion == null) {
            Logger.error(`BwWarRuleHelper.checkIsValidRuleForGlobalParams() empty configVersion.`);
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Validators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorCodeForWarRule({ rule, allWarEventIdArray, configVersion, playersCountUnneutral }: {
        rule                    : IWarRule;
        allWarEventIdArray      : number[];
        configVersion           : string;
        playersCountUnneutral   : number;
    }): ClientErrorCode {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : rule.ruleNameArray,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarRuleNameMaxLength,
            minTextCount    : 1,
        })) {
            return ClientErrorCode.WarRuleValidation00;
        }

        const ruleForPlayers = rule.ruleForPlayers;
        if (ruleForPlayers == null) {
            return ClientErrorCode.WarRuleValidation01;
        }

        const errorCodeForRuleForPlayers = getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral });
        if (errorCodeForRuleForPlayers) {
            return errorCodeForRuleForPlayers;
        }

        const availability = rule.ruleAvailability;
        if ((!availability) || (!checkIsValidWarRuleAvailability(availability))) {
            return ClientErrorCode.WarRuleValidation02;
        }

        const ruleForGlobalParams = rule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            return ClientErrorCode.WarRuleValidation03;
        }

        const errorCodeForGlobalParams = getErrorCodeForRuleForGlobalParams(ruleForGlobalParams);
        if (errorCodeForGlobalParams) {
            return errorCodeForGlobalParams;
        }

        for (const warEventId of rule.warEventIdArray || []) {
            if (allWarEventIdArray.indexOf(warEventId) < 0) {
                return ClientErrorCode.WarRuleValidation04;
            }
        }

        return ClientErrorCode.NoError;
    }
    export function getErrorCodeForWarRuleArray({ ruleList, playersCountUnneutral, allWarEventIdArray, configVersion }: {
        ruleList                : IWarRule[] | undefined | null;
        playersCountUnneutral   : number;
        allWarEventIdArray      : number[];
        configVersion           : string;
    }): ClientErrorCode {
        const rulesCount = ruleList ? ruleList.length : 0;
        if ((!ruleList)                                     ||
            (rulesCount <= 0)                               ||
            (rulesCount > CommonConstants.WarRuleMaxCount)
        ) {
            return ClientErrorCode.WarRuleValidation05;
        }

        const ruleIdSet = new Set<number>();
        for (const rule of ruleList) {
            const ruleId = rule.ruleId;
            if ((ruleId == null) || (ruleId < 0) || (ruleId >= rulesCount) || (ruleIdSet.has(ruleId))) {
                return ClientErrorCode.WarRuleValidation06;
            }
            ruleIdSet.add(ruleId);

            const warRuleErrorCode = getErrorCodeForWarRule({ rule, allWarEventIdArray, configVersion, playersCountUnneutral });
            if (warRuleErrorCode) {
                return warRuleErrorCode;
            }
        }

        return ClientErrorCode.NoError;
    }

    export function getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral }: {
        ruleForPlayers          : IRuleForPlayers;
        configVersion           : string;
        playersCountUnneutral   : number;
    }): ClientErrorCode {
        const ruleArray = ruleForPlayers.playerRuleDataArray;
        if ((ruleArray == null) || (ruleArray.length !== playersCountUnneutral)) {
            return ClientErrorCode.PlayerRuleValidation00;
        }

        const playerIndexSet    = new Set<number>();
        const teamIndexSet      = new Set<number>();
        for (const data of ruleArray) {
            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex <  CommonConstants.WarFirstPlayerIndex)    ||
                (playerIndex >  playersCountUnneutral)                  ||
                (playerIndexSet.has(playerIndex))
            ) {
                return ClientErrorCode.PlayerRuleValidation01;
            }

            const teamIndex = data.teamIndex;
            if ((teamIndex == null)                                 ||
                (teamIndex <  CommonConstants.WarFirstTeamIndex)    ||
                (teamIndex >  playersCountUnneutral)
            ) {
                return ClientErrorCode.PlayerRuleValidation02;
            }

            playerIndexSet.add(playerIndex);
            teamIndexSet.add(teamIndex);

            const initialFund = data.initialFund;
            if ((initialFund == null)                                       ||
                (initialFund > CommonConstants.WarRuleInitialFundMaxLimit)  ||
                (initialFund < CommonConstants.WarRuleInitialFundMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation03;
            }

            const incomeMultiplier = data.incomeMultiplier;
            if ((incomeMultiplier == null)                                              ||
                (incomeMultiplier > CommonConstants.WarRuleIncomeMultiplierMaxLimit)    ||
                (incomeMultiplier < CommonConstants.WarRuleIncomeMultiplierMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation04;
            }

            const initialEnergyPercentage = data.initialEnergyPercentage;
            if ((initialEnergyPercentage == null)                                                   ||
                (initialEnergyPercentage > CommonConstants.WarRuleInitialEnergyPercentageMaxLimit)  ||
                (initialEnergyPercentage < CommonConstants.WarRuleInitialEnergyPercentageMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation05;
            }

            const energyGrowthMultiplier = data.energyGrowthMultiplier;
            if ((energyGrowthMultiplier == null)                                                    ||
                (energyGrowthMultiplier > CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit)    ||
                (energyGrowthMultiplier < CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation06;
            }

            const moveRangeModifier = data.moveRangeModifier;
            if ((moveRangeModifier == null)                                             ||
                (moveRangeModifier > CommonConstants.WarRuleMoveRangeModifierMaxLimit)  ||
                (moveRangeModifier < CommonConstants.WarRuleMoveRangeModifierMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation07;
            }

            const attackPowerModifier = data.attackPowerModifier;
            if ((attackPowerModifier == null)                                       ||
                (attackPowerModifier > CommonConstants.WarRuleOffenseBonusMaxLimit) ||
                (attackPowerModifier < CommonConstants.WarRuleOffenseBonusMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation08;
            }

            const visionRangeModifier = data.visionRangeModifier;
            if ((visionRangeModifier == null)                                               ||
                (visionRangeModifier > CommonConstants.WarRuleVisionRangeModifierMaxLimit)  ||
                (visionRangeModifier < CommonConstants.WarRuleVisionRangeModifierMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation09;
            }

            const luckLowerLimit = data.luckLowerLimit;
            if ((luckLowerLimit == null)                                ||
                (luckLowerLimit > CommonConstants.WarRuleLuckMaxLimit)  ||
                (luckLowerLimit < CommonConstants.WarRuleLuckMinLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation10;
            }

            const luckUpperLimit = data.luckUpperLimit;
            if ((luckUpperLimit == null)                                ||
                (luckUpperLimit > CommonConstants.WarRuleLuckMaxLimit)  ||
                (luckUpperLimit < CommonConstants.WarRuleLuckMinLimit)  ||
                (luckUpperLimit < luckLowerLimit)
            ) {
                return ClientErrorCode.PlayerRuleValidation11;
            }

            const availableCoIdArray = data.availableCoIdArray;
            if ((availableCoIdArray == null)                                                            ||
                (availableCoIdArray.every(v => v !== CommonConstants.CoEmptyId))                        ||
                (availableCoIdArray.some(coId => ConfigManager.getCoBasicCfg(configVersion, coId) == null))
            ) {
                return ClientErrorCode.PlayerRuleValidation12;
            }
        }

        if (playerIndexSet.size !== playersCountUnneutral) {
            return ClientErrorCode.PlayerRuleValidation13;
        }
        if (teamIndexSet.size <= 1) {
            return ClientErrorCode.PlayerRuleValidation14;
        }

        return ClientErrorCode.NoError;
    }

    function checkIsValidWarRuleAvailability(availability: WarRule.IDataForWarRuleAvailability): boolean {
        const {
            canMcw,     canScw,     canMrw,
        } = availability;
        return (!!canMcw)
            || (!!canScw)
            || (!!canMrw);
    }

    function getErrorCodeForRuleForGlobalParams(rule: IRuleForGlobalParams): ClientErrorCode {
        const hasFogByDefault = rule.hasFogByDefault;
        if (hasFogByDefault == null) {
            return ClientErrorCode.WarRuleGlobalParamsValidation00;
        }

        return ClientErrorCode.NoError;
    }

    export function checkIsValidBootTimerParams(params: number[]): boolean {
        const length = params.length;
        if (!length) {
            return false;
        } else {
            const type: BootTimerType = params[0];
            if (type === BootTimerType.Regular) {
                if (length !== 2) {
                    return false;
                } else {
                    const timeLimit = params[1];
                    return (timeLimit > 0) && (timeLimit <= CommonConstants.WarBootTimerRegularMaxLimit);
                }

            } else if (type === BootTimerType.Incremental) {
                if (length !== 3) {
                    return false;
                } else {
                    const initialTime           = params[1];
                    const incrementTimePerUnit  = params[2];
                    return (initialTime > 0)
                        && (initialTime <= CommonConstants.WarBootTimerIncrementalMaxLimit)
                        && (incrementTimePerUnit >= 0)
                        && (incrementTimePerUnit <= CommonConstants.WarBootTimerIncrementalMaxLimit);
                }

            } else {
                return false;
            }
        }
    }

    export function checkIsCoAvailable(configVersion: string, coId: number, playerIndex: number, warRule: IWarRule): boolean | undefined {
        const availableCoIdList = getAvailableCoIdListByWarRule(configVersion, warRule, playerIndex);
        if (availableCoIdList == null) {
            Logger.error(`BwHelpers.checkIsCoAvailable() empty availableCoIdList.`);
            return undefined;
        }
        return availableCoIdList.indexOf(coId) >= 0;
    }

    export function getAvailableCoIdListByWarRule(configVersion: string, warRule: IWarRule, playerIndex: number): number[] | null | undefined {
        const playersCount = getPlayersCount(warRule);
        if ((playersCount == null)                              ||
            (playerIndex < CommonConstants.WarFirstPlayerIndex) ||
            (playerIndex > playersCount)
        ) {
            return undefined;
        }

        const ruleForPlayers        = warRule.ruleForPlayers;
        const playerRuleDataArray   = ruleForPlayers ? ruleForPlayers.playerRuleDataArray : undefined;
        const playerRule            = (playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
        const coIdList              = playerRule ? playerRule.availableCoIdArray : undefined;
        if ((coIdList == null) || (!coIdList.length)) {
            Logger.error(`BwHelpers.getAvailableCoIdListByWarRule() empty coIdList.`);
            return undefined;
        }

        return coIdList.filter(coId => {
            const config = ConfigManager.getCoBasicCfg(configVersion, coId);
            return config ? (!!config.isEnabled) : false;
        });
    }
}
