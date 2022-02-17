
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import ConfigManager        from "../helpers/ConfigManager";
// import Helpers              from "../helpers/Helpers";
// import ProtoTypes           from "../proto/ProtoTypes";
// import Lang                 from "../lang/Lang";
// import TwnsLangTextType     from "../lang/LangTextType";
// import Types                from "../helpers/Types";
// import CommonConstants      from "../helpers/CommonConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarRuleHelpers {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
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

    const DEFAULT_PLAYER_RULE: ProtoTypes.WarRule.IDataForPlayerRule = {
        playerIndex             : CommonConstants.WarNeutralPlayerIndex,
        teamIndex               : 0,
        attackPowerModifier     : 0,
        bannedCoIdArray         : [],
        energyGrowthMultiplier  : 100,
        energyAddPctOnLoadCo    : 0,
        initialFund             : 0,
        incomeMultiplier        : 100,
        luckLowerLimit          : 0,
        luckUpperLimit          : 10,
        moveRangeModifier       : 0,
        visionRangeModifier     : 0,
    };

    export function getHasFogByDefault(warRule: IWarRule): boolean {
        return Helpers.getExisted(warRule.ruleForGlobalParams?.hasFogByDefault);
    }
    export function setHasFogByDefault(warRule: IWarRule, hasFog: boolean): void {
        Helpers.getExisted(warRule.ruleForGlobalParams).hasFogByDefault = hasFog;
    }

    export function getDefaultWeatherType(warRule: IWarRule): Types.WeatherType {
        return warRule.ruleForGlobalParams?.defaultWeatherType ?? Types.WeatherType.Clear;
    }
    export function setDefaultWeatherType(warRule: IWarRule, weatherType: Types.WeatherType): void {
        Helpers.getExisted(warRule.ruleForGlobalParams, ClientErrorCode.WarRuleHelpers_SetDefaultWeatherType_00).defaultWeatherType = weatherType;
    }
    export function tickDefaultWeatherType(warRule: IWarRule, configVersion: string): void {
        const typeArray     = ConfigManager.getAvailableWeatherTypes(configVersion);
        const weatherType   = getDefaultWeatherType(warRule);
        setDefaultWeatherType(warRule, typeArray[(typeArray.indexOf(weatherType) + 1) % typeArray.length]);
    }

    export function getIncomeMultiplier(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.incomeMultiplier);
    }
    export function setIncomeMultiplier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.incomeMultiplier = value;
    }

    export function getEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.energyGrowthMultiplier);
    }
    export function setEnergyGrowthMultiplier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.energyGrowthMultiplier = value;
    }

    export function getAttackPowerModifier(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.attackPowerModifier);
    }
    export function setAttackPowerModifier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.attackPowerModifier = value;
    }

    export function getMoveRangeModifier(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.moveRangeModifier);
    }
    export function setMoveRangeModifier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.moveRangeModifier = value;
    }

    export function getVisionRangeModifier(warRule: IWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.visionRangeModifier);
    }
    export function setVisionRangeModifier(warRule: IWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.visionRangeModifier = value;
    }

    export function getInitialFund(warRule: IWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(warRule, playerIndex).initialFund);
    }
    export function setInitialFund(warRule: IWarRule, playerIndex: number, value: number): void {
        getPlayerRule(warRule, playerIndex).initialFund = value;
    }

    export function getEnergyAddPctOnLoadCo(warRule: IWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(warRule, playerIndex).energyAddPctOnLoadCo);
    }
    export function setEnergyAddPctOnLoadCo(warRule: IWarRule, playerIndex: number, value: number): void {
        getPlayerRule(warRule, playerIndex).energyAddPctOnLoadCo = value;
    }

    export function getLuckLowerLimit(warRule: IWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(warRule, playerIndex).luckLowerLimit);
    }
    export function setLuckLowerLimit(warRule: IWarRule, playerIndex: number, value: number): void {
        getPlayerRule(warRule, playerIndex).luckLowerLimit = value;
    }

    export function getLuckUpperLimit(warRule: IWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(warRule, playerIndex).luckUpperLimit);
    }
    export function setLuckUpperLimit(warRule: IWarRule, playerIndex: number, value: number): void {
        getPlayerRule(warRule, playerIndex).luckUpperLimit = value;
    }

    export function getBannedCoIdArray(warRule: IWarRule, playerIndex: number): number[] | null {
        return getPlayerRule(warRule, playerIndex).bannedCoIdArray ?? null;
    }
    export function getAvailableCoIdArrayForPlayer({ warRule, playerIndex, configVersion }: {
        warRule         : IWarRule;
        playerIndex     : number;
        configVersion   : string;
    }): number[] {
        return getAvailableCoIdArray(configVersion, new Set<number>(getPlayerRule(warRule, playerIndex).bannedCoIdArray));
    }
    export function getAvailableCoIdArray(configVersion: string, bannedCoIdSet: Set<number>): number[] {
        return ConfigManager.getEnabledCoArray(configVersion)
            .map(v => v.coId)
            .filter(v => !bannedCoIdSet.has(v));
    }
    export function addBannedCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule.bannedCoIdArray == null) {
            playerRule.bannedCoIdArray = [coId];
        } else {
            const bannedCoIdArray = playerRule.bannedCoIdArray;
            if (bannedCoIdArray.indexOf(coId) < 0) {
                bannedCoIdArray.push(coId);
            }
        }
    }
    export function deleteBannedCoId(warRule: IWarRule, playerIndex: number, coId: number): void {
        const playerRule        = getPlayerRule(warRule, playerIndex);
        const bannedCoIdArray   = Helpers.getExisted(playerRule.bannedCoIdArray);
        Helpers.deleteElementFromArray(bannedCoIdArray, coId);
    }
    export function setBannedCoIdArray(warRule: IWarRule, playerIndex: number, coIdSet: Set<number>): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        if (playerRule.bannedCoIdArray == null) {
            playerRule.bannedCoIdArray = [...coIdSet];
        } else {
            const bannedCoIdArray   = playerRule.bannedCoIdArray;
            bannedCoIdArray.length  = 0;
            for (const coId of coIdSet) {
                bannedCoIdArray.push(coId);
            }
        }
    }

    export function setFixedCoIdInCcw(warRule: IWarRule, playerIndex: number, coId: number | null): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.fixedCoIdInCcw = coId;
    }
    export function getFixedCoIdInCcw(warRule: IWarRule, playerIndex: number): number | null {
        return getPlayerRule(warRule, playerIndex).fixedCoIdInCcw ?? null;
    }

    export function setFixedCoIdInSrw(warRule: IWarRule, playerIndex: number, coId: number | null): void {
        getPlayerRule(warRule, playerIndex).fixedCoIdInSrw = coId;
    }
    export function getFixedCoIdInSrw(warRule: IWarRule, playerIndex: number): number | null {
        return getPlayerRule(warRule, playerIndex).fixedCoIdInSrw ?? null;
    }

    export function getTeamIndex(warRule: IWarRule, playerIndex: number): number {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return CommonConstants.WarNeutralTeamIndex;
        }

        const playerRule = getPlayerRule(warRule, playerIndex);
        return Helpers.getExisted(playerRule.teamIndex);
    }
    export function setTeamIndex(warRule: IWarRule, playerIndex: number, teamIndex: number): void {
        const playerRule = getPlayerRule(warRule, playerIndex);
        playerRule.teamIndex = teamIndex;
    }
    export function tickTeamIndex(warRule: IWarRule, playerIndex: number): void {
        setTeamIndex(
            warRule,
            playerIndex,
            getTeamIndex(warRule, playerIndex) % getPlayersCountUnneutral(warRule) + 1
        );
    }

    export function getTeamIndexByRuleForPlayers(ruleForPlayers: IRuleForPlayers, playerIndex: number): number {
        return Helpers.getExisted(ruleForPlayers.playerRuleDataArray?.find(v => v.playerIndex === playerIndex)?.teamIndex);
    }

    export function getPlayerRule(warRule: IWarRule, playerIndex: number): IDataForPlayerRule {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return DEFAULT_PLAYER_RULE;
        }

        return Helpers.getExisted(warRule.ruleForPlayers?.playerRuleDataArray?.find(v => v.playerIndex === playerIndex));
    }

    export function getPlayersCountUnneutral(warRule: IWarRule): number {
        return Helpers.getExisted(warRule.ruleForPlayers?.playerRuleDataArray).length;
    }

    export function moveWarEventId(warRule: IWarRule, warEventId: number, deltaIndex: number): void {
        const warEventIdArray   = Helpers.getExisted(warRule.warEventIdArray);
        const currIndex         = warEventIdArray.findIndex(v => v === warEventId);
        if (currIndex < 0) {
            throw Helpers.newError(`Invalid currIndex: ${currIndex}`, ClientErrorCode.WarRuleHelpers_MoveWarEventId_00);
        }

        const newIndex = Math.max(0, Math.min(warEventIdArray.length - 1, currIndex + deltaIndex));
        if (currIndex !== newIndex) {
            warEventIdArray.splice(currIndex, 1);
            warEventIdArray.splice(newIndex, 0, warEventId);
        }
    }
    export function deleteWarEventId(warRule: IWarRule, warEventId: number): void {
        const warEventIdArray   = Helpers.getExisted(warRule.warEventIdArray);
        const currIndex         = warEventIdArray.findIndex(v => v === warEventId);
        if (currIndex < 0) {
            throw Helpers.newError(`Invalid currIndex: ${currIndex}`, ClientErrorCode.WarRuleHelpers_DeleteWarEventId_00);
        }

        warEventIdArray.splice(currIndex, 1);
    }
    export function addWarEventId(warRule: IWarRule, warEventId: number): void {
        if (warRule.warEventIdArray == null) {
            warRule.warEventIdArray = [];
        }

        const warEventIdArray = warRule.warEventIdArray;
        if (warEventIdArray.indexOf(warEventId) >= 0) {
            throw Helpers.newError(`The warEventId exists: ${warEventId}.`, ClientErrorCode.WarRuleHelpers_AddWarEventId_00);
        }

        warEventIdArray.push(warEventId);
    }

    export function getRandomCoIdWithSettingsForCommon(settingsForCommon: ISettingsForCommon, playerIndex: number): number {
        return getRandomCoIdWithCoIdList(getAvailableCoIdArrayForPlayer({
            warRule         : Helpers.getExisted(settingsForCommon.warRule),
            playerIndex,
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
        }));
    }
    export function getRandomCoIdWithCoIdList(coIdList: number[]): number {
        if ((coIdList == null) || (coIdList.length <= 0)) {
            throw Helpers.newError(`Empty coIdList.`, ClientErrorCode.WarRuleHelpers_GetRandomCoIdWithCoIdList_00);
        } else {
            if (coIdList.length <= 1) {
                return coIdList[0];
            } else {
                return Helpers.pickRandomElement(coIdList.filter(v => v !== CommonConstants.CoEmptyId));
            }
        }
    }

    export function createDefaultWarRule(ruleId: number | null, playersCount: number): IWarRule {
        return {
            ruleId,
            ruleNameArray   : [
                { languageType: LanguageType.Chinese, text: Lang.getText(LangTextType.B0001, LanguageType.Chinese) },
                { languageType: LanguageType.English, text: Lang.getText(LangTextType.B0001, LanguageType.English) },
            ],
            ruleAvailability: {
                canMcw  : false,
                canScw  : false,
                canMrw  : false,
                canSrw  : false,
                canCcw  : false,
            },
            ruleForGlobalParams : {
                hasFogByDefault     : false,
                defaultWeatherType  : Types.WeatherType.Clear,
            },
            ruleForPlayers: {
                playerRuleDataArray: createDefaultPlayerRuleList(playersCount),
            },
        };
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
            energyAddPctOnLoadCo    : CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault,
            energyGrowthMultiplier  : CommonConstants.WarRuleEnergyGrowthMultiplierDefault,
            moveRangeModifier       : CommonConstants.WarRuleMoveRangeModifierDefault,
            attackPowerModifier     : CommonConstants.WarRuleOffenseBonusDefault,
            visionRangeModifier     : CommonConstants.WarRuleVisionRangeModifierDefault,
            luckLowerLimit          : CommonConstants.WarRuleLuckDefaultLowerLimit,
            luckUpperLimit          : CommonConstants.WarRuleLuckDefaultUpperLimit,
            bannedCoIdArray         : [],
        };
    }
    export function reviseWarRule(warRule: IWarRule, playersCount: number): void {
        const ruleForPlayers = Helpers.getExisted(warRule.ruleForPlayers);
        if (!ruleForPlayers.playerRuleDataArray) {
            ruleForPlayers.playerRuleDataArray = [];
        }

        const playerRuleDataArray = ruleForPlayers.playerRuleDataArray;
        for (let index = 0; index < playerRuleDataArray.length; ++index) {
            const playerRule = playerRuleDataArray[index];
            if (Helpers.getExisted(playerRule.playerIndex) > playersCount) {
                playerRuleDataArray.splice(index, 1);
                --index;
                continue;
            }
        }

        for (const playerRule of playerRuleDataArray) {
            playerRule.teamIndex = Math.min(Helpers.getExisted(playerRule.teamIndex), playersCount);
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
    export function checkIsValidRuleForPlayers(ruleForPlayers: WarRule.IRuleForPlayers): boolean {
        const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
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
                initialFund,        bannedCoIdArray,        incomeMultiplier,       energyAddPctOnLoadCo,   energyGrowthMultiplier,
                moveRangeModifier,  attackPowerModifier,    visionRangeModifier,    luckUpperLimit,         luckLowerLimit,
            } = data;
            if ((initialFund                == null)                                                    ||
                (initialFund                > CommonConstants.WarRuleInitialFundMaxLimit)               ||
                (initialFund                < CommonConstants.WarRuleInitialFundMinLimit)               ||
                (incomeMultiplier           == null)                                                    ||
                (incomeMultiplier           > CommonConstants.WarRuleIncomeMultiplierMaxLimit)          ||
                (incomeMultiplier           < CommonConstants.WarRuleIncomeMultiplierMinLimit)          ||
                (energyAddPctOnLoadCo       == null)                                                    ||
                (energyAddPctOnLoadCo       > CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit)      ||
                (energyAddPctOnLoadCo       < CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit)      ||
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
                ((bannedCoIdArray || []).indexOf(CommonConstants.CoEmptyId) >= 0)                       ||
                (bannedCoIdArray?.some(coId => ConfigManager.getCoBasicCfg(configVersion, coId) == null))
            ) {
                return false;
            }

            playerIndexSet.add(playerIndex);
            teamIndexSet.add(teamIndex);
        }

        return (playerIndexSet.size === playersCount)
            && (teamIndexSet.size > 1);
    }
    function checkIsValidRuleForGlobalParams(rule: WarRule.IRuleForGlobalParams): boolean {
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

        const ruleAvailability = rule.ruleAvailability;
        if ((!ruleAvailability) || (!checkIsValidWarRuleAvailability(ruleAvailability))) {
            return ClientErrorCode.WarRuleValidation02;
        }

        const errorCodeForRuleForPlayers = getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral, ruleAvailability });
        if (errorCodeForRuleForPlayers) {
            return errorCodeForRuleForPlayers;
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
        ruleList                : Types.Undefinable<IWarRule[]>;
        playersCountUnneutral   : number;
        allWarEventIdArray      : number[];
        configVersion           : string;
    }): ClientErrorCode {
        const rulesCount = ruleList ? ruleList.length : 0;
        if ((!ruleList)                                     ||
            (rulesCount <= 0)                               ||
            (rulesCount > CommonConstants.WarRuleMaxCount)
        ) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_00;
        }

        const ruleIdSet         = new Set<number>();
        const trimmedRuleArray  : IWarRule[] = [];
        for (const rule of ruleList) {
            const ruleId = rule.ruleId;
            if ((ruleId == null) || (ruleId < 0) || (ruleId >= rulesCount) || (ruleIdSet.has(ruleId))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_01;
            }
            ruleIdSet.add(ruleId);

            const warRuleErrorCode = getErrorCodeForWarRule({ rule, allWarEventIdArray, configVersion, playersCountUnneutral });
            if (warRuleErrorCode) {
                return warRuleErrorCode;
            }

            const trimmedRule           = Helpers.deepClone(rule);
            trimmedRule.ruleId          = null;
            trimmedRule.ruleNameArray   = null;
            if (trimmedRuleArray.some(v => Helpers.checkIsSameValue(v, trimmedRule))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_02;
            }
            trimmedRuleArray.push(trimmedRule);
        }

        return ClientErrorCode.NoError;
    }

    export function getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral, ruleAvailability }: {
        ruleForPlayers          : IRuleForPlayers;
        configVersion           : string;
        playersCountUnneutral   : number;
        ruleAvailability        : WarRule.IRuleAvailability;
    }): ClientErrorCode {
        const ruleArray = ruleForPlayers.playerRuleDataArray;
        if ((ruleArray == null) || (ruleArray.length !== playersCountUnneutral)) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_00;
        }

        const { canSrw, canCcw }            = ruleAvailability;
        const allPlayerIndexSet             = new Set<number>();
        const allTeamIndexSet               = new Set<number>();
        const teamIndexSetForHumanInSrw     = new Set<number>();
        const teamIndexSetForAiInSrw        = new Set<number>();
        const playerIndexSetForHumanInCcw   = new Set<number>();
        const playerIndexSetForAiInCcw      = new Set<number>();

        for (const data of ruleArray) {
            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex <  CommonConstants.WarFirstPlayerIndex)    ||
                (playerIndex >  playersCountUnneutral)                  ||
                (allPlayerIndexSet.has(playerIndex))
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_01;
            }

            const teamIndex = data.teamIndex;
            if ((teamIndex == null)                                 ||
                (teamIndex <  CommonConstants.WarFirstTeamIndex)    ||
                (teamIndex >  playersCountUnneutral)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_02;
            }

            allPlayerIndexSet.add(playerIndex);
            allTeamIndexSet.add(teamIndex);

            const initialFund = data.initialFund;
            if ((initialFund == null)                                       ||
                (initialFund > CommonConstants.WarRuleInitialFundMaxLimit)  ||
                (initialFund < CommonConstants.WarRuleInitialFundMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_03;
            }

            const incomeMultiplier = data.incomeMultiplier;
            if ((incomeMultiplier == null)                                              ||
                (incomeMultiplier > CommonConstants.WarRuleIncomeMultiplierMaxLimit)    ||
                (incomeMultiplier < CommonConstants.WarRuleIncomeMultiplierMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_04;
            }

            const energyAddPctOnLoadCo = data.energyAddPctOnLoadCo;
            if ((energyAddPctOnLoadCo == null)                                                  ||
                (energyAddPctOnLoadCo > CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit)    ||
                (energyAddPctOnLoadCo < CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_05;
            }

            const energyGrowthMultiplier = data.energyGrowthMultiplier;
            if ((energyGrowthMultiplier == null)                                                    ||
                (energyGrowthMultiplier > CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit)    ||
                (energyGrowthMultiplier < CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_06;
            }

            const moveRangeModifier = data.moveRangeModifier;
            if ((moveRangeModifier == null)                                             ||
                (moveRangeModifier > CommonConstants.WarRuleMoveRangeModifierMaxLimit)  ||
                (moveRangeModifier < CommonConstants.WarRuleMoveRangeModifierMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_07;
            }

            const attackPowerModifier = data.attackPowerModifier;
            if ((attackPowerModifier == null)                                       ||
                (attackPowerModifier > CommonConstants.WarRuleOffenseBonusMaxLimit) ||
                (attackPowerModifier < CommonConstants.WarRuleOffenseBonusMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_08;
            }

            const visionRangeModifier = data.visionRangeModifier;
            if ((visionRangeModifier == null)                                               ||
                (visionRangeModifier > CommonConstants.WarRuleVisionRangeModifierMaxLimit)  ||
                (visionRangeModifier < CommonConstants.WarRuleVisionRangeModifierMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_09;
            }

            const luckLowerLimit = data.luckLowerLimit;
            if ((luckLowerLimit == null)                                ||
                (luckLowerLimit > CommonConstants.WarRuleLuckMaxLimit)  ||
                (luckLowerLimit < CommonConstants.WarRuleLuckMinLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_10;
            }

            const luckUpperLimit = data.luckUpperLimit;
            if ((luckUpperLimit == null)                                ||
                (luckUpperLimit > CommonConstants.WarRuleLuckMaxLimit)  ||
                (luckUpperLimit < CommonConstants.WarRuleLuckMinLimit)  ||
                (luckUpperLimit < luckLowerLimit)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_11;
            }

            const bannedCoIdArray = data.bannedCoIdArray || [];
            if (bannedCoIdArray.indexOf(CommonConstants.CoEmptyId) >= 0) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_12;
            }
            if (bannedCoIdArray.some(coId => !ConfigManager.checkHasCo(configVersion, coId))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_13;
            }

            {
                const fixedCoIdInSrw = data.fixedCoIdInSrw;
                if (fixedCoIdInSrw == null) {
                    if (canSrw) {
                        teamIndexSetForHumanInSrw.add(teamIndex);
                    }
                } else {
                    if (ConfigManager.getCoBasicCfg(configVersion, fixedCoIdInSrw) == null) {
                        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_15;
                    }
                    teamIndexSetForAiInSrw.add(teamIndex);
                }
            }

            {
                const fixedCoIdInCcw = data.fixedCoIdInCcw;
                if (fixedCoIdInCcw == null) {
                    if (canCcw) {
                        playerIndexSetForHumanInCcw.add(playerIndex);
                    }
                } else {
                    if (ConfigManager.getCoBasicCfg(configVersion, fixedCoIdInCcw) == null) {
                        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_17;
                    }
                    playerIndexSetForAiInCcw.add(playerIndex);
                }
            }
        }

        if (allPlayerIndexSet.size !== playersCountUnneutral) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_18;
        }
        if (allTeamIndexSet.size <= 1) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_19;
        }

        if (canSrw) {
            if (!teamIndexSetForAiInSrw.size) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_20;
            }
            if (teamIndexSetForHumanInSrw.size !== 1) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_21;
            }
        }

        if (canCcw) {
            if (!playerIndexSetForAiInCcw.size) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_22;
            }
            if (playerIndexSetForHumanInCcw.size <= 1) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_23;
            }
        }

        return ClientErrorCode.NoError;
    }

    function checkIsValidWarRuleAvailability(availability: WarRule.IRuleAvailability): boolean {
        // const {
        //     canMcw,     canScw,     canMrw,     canSrw,     canCcw
        // } = availability;
        // return (!!canMcw)
        //     || (!!canScw)
        //     || (!!canMrw)
        //     || (!!canSrw)
        //     || (!!canCcw);
        return availability != null;
    }

    function getErrorCodeForRuleForGlobalParams(rule: IRuleForGlobalParams): ClientErrorCode {
        {
            const hasFogByDefault = rule.hasFogByDefault;
            if (hasFogByDefault == null) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_00;
            }
        }

        {
            const defaultWeatherType = rule.defaultWeatherType;
            if ((defaultWeatherType != null)                            &&
                (defaultWeatherType !== Types.WeatherType.Clear)        &&
                (defaultWeatherType !== Types.WeatherType.Rainy)        &&
                (defaultWeatherType !== Types.WeatherType.Sandstorm)    &&
                (defaultWeatherType !== Types.WeatherType.Snowy)
            ) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_01;
            }
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
}

// export default WarRuleHelpers;
