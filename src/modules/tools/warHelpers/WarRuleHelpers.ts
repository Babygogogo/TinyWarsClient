
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import ConfigManager        from "../helpers/ConfigManager";
// import Helpers              from "../helpers/Helpers";
// import ProtoTypes           from "../proto/ProtoTypes";
// import Lang                 from "../lang/Lang";
// import TwnsLangTextType     from "../lang/LangTextType";
// import Types                from "../helpers/Types";
// import CommonConstants      from "../helpers/CommonConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarRuleHelpers {
    import LangTextType         = Lang.LangTextType;
    import LanguageType         = Types.LanguageType;
    import BootTimerType        = Types.BootTimerType;
    import BaseWarRule          = Types.BaseWarRule;
    import WarRule              = CommonProto.WarRule;
    import IRuleForGlobalParams = WarRule.IRuleForGlobalParams;
    import IRuleForPlayers      = WarRule.IRuleForPlayers;
    import IDataForPlayerRule   = WarRule.IDataForPlayerRule;
    import ITemplateWarRule     = WarRule.ITemplateWarRule;
    import IInstanceWarRule     = WarRule.IInstanceWarRule;
    import IRuleAvailability    = WarRule.IRuleAvailability;
    import GameConfig           = Config.GameConfig;

    const DEFAULT_PLAYER_RULE: WarRule.IDataForPlayerRule = {
        playerIndex             : CommonConstants.WarNeutralPlayerIndex,
        teamIndex               : 0,
        attackPowerModifier     : 0,
        bannedCoIdArray         : [],
        bannedUnitTypeArray     : [],
        canActivateCoSkill      : true,
        energyGrowthMultiplier  : 100,
        energyAddPctOnLoadCo    : 0,
        initialFund             : 0,
        incomeMultiplier        : 100,
        luckLowerLimit          : 0,
        luckUpperLimit          : 10,
        moveRangeModifier       : 0,
        visionRangeModifier     : 0,
    };

    export function getHasFogByDefault(baseWarRule: BaseWarRule): boolean {
        return Helpers.getExisted(baseWarRule.ruleForGlobalParams?.hasFogByDefault);
    }
    export function setHasFogByDefault(baseWarRule: BaseWarRule, hasFog: boolean): void {
        Helpers.getExisted(baseWarRule.ruleForGlobalParams).hasFogByDefault = hasFog;
    }

    export function getDefaultWeatherType(baseWarRule: BaseWarRule): Types.WeatherType {
        return baseWarRule.ruleForGlobalParams?.defaultWeatherType ?? Types.WeatherType.Clear;
    }
    export function setDefaultWeatherType(baseWarRule: BaseWarRule, weatherType: Types.WeatherType): void {
        Helpers.getExisted(baseWarRule.ruleForGlobalParams, ClientErrorCode.WarRuleHelpers_SetDefaultWeatherType_00).defaultWeatherType = weatherType;
    }
    export function tickDefaultWeatherType(baseWarRule: BaseWarRule, gameConfig: GameConfig): void {
        const typeArray     = gameConfig.getAvailableWeatherTypes();
        const weatherType   = getDefaultWeatherType(baseWarRule);
        setDefaultWeatherType(baseWarRule, typeArray[(typeArray.indexOf(weatherType) + 1) % typeArray.length]);
    }

    export function getIncomeMultiplier(baseWarRule: BaseWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.incomeMultiplier);
    }
    export function setIncomeMultiplier(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.incomeMultiplier = value;
    }

    export function getEnergyGrowthMultiplier(baseWarRule: BaseWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.energyGrowthMultiplier);
    }
    export function setEnergyGrowthMultiplier(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.energyGrowthMultiplier = value;
    }

    export function getAttackPowerModifier(baseWarRule: BaseWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.attackPowerModifier);
    }
    export function setAttackPowerModifier(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.attackPowerModifier = value;
    }

    export function getMoveRangeModifier(baseWarRule: BaseWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.moveRangeModifier);
    }
    export function setMoveRangeModifier(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.moveRangeModifier = value;
    }

    export function getVisionRangeModifier(baseWarRule: BaseWarRule, playerIndex: number): number {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.visionRangeModifier);
    }
    export function setVisionRangeModifier(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.visionRangeModifier = value;
    }

    export function getInitialFund(baseWarRule: BaseWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(baseWarRule, playerIndex).initialFund);
    }
    export function setInitialFund(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        getPlayerRule(baseWarRule, playerIndex).initialFund = value;
    }

    export function getEnergyAddPctOnLoadCo(baseWarRule: BaseWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(baseWarRule, playerIndex).energyAddPctOnLoadCo);
    }
    export function setEnergyAddPctOnLoadCo(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        getPlayerRule(baseWarRule, playerIndex).energyAddPctOnLoadCo = value;
    }

    export function getLuckLowerLimit(baseWarRule: BaseWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(baseWarRule, playerIndex).luckLowerLimit);
    }
    export function setLuckLowerLimit(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        getPlayerRule(baseWarRule, playerIndex).luckLowerLimit = value;
    }

    export function getLuckUpperLimit(baseWarRule: BaseWarRule, playerIndex: number): number {
        return Helpers.getExisted(getPlayerRule(baseWarRule, playerIndex).luckUpperLimit);
    }
    export function setLuckUpperLimit(baseWarRule: BaseWarRule, playerIndex: number, value: number): void {
        getPlayerRule(baseWarRule, playerIndex).luckUpperLimit = value;
    }

    export function getCanActivateCoSkill(baseWarRule: BaseWarRule, playerIndex: number): boolean {
        return getPlayerRule(baseWarRule, playerIndex).canActivateCoSkill !== false;
    }
    export function setCanActivateCoSkill(baseWarRule: BaseWarRule, playerIndex: number, value: boolean): void {
        getPlayerRule(baseWarRule, playerIndex).canActivateCoSkill = value;
    }

    export function getBannedUnitTypeArray(baseWarRule: BaseWarRule, playerIndex: number): number[] | null {
        return getPlayerRule(baseWarRule, playerIndex).bannedUnitTypeArray ?? null;
    }
    export function setBannedUnitTypeArray(baseWarRule: BaseWarRule, playerIndex: number, unitTypeArray: number[]): void {
        const playerRule        = getPlayerRule(baseWarRule, playerIndex);
        const bannedUnitTypeSet = new Set(unitTypeArray);
        if (playerRule.bannedUnitTypeArray == null) {
            playerRule.bannedUnitTypeArray = [...bannedUnitTypeSet];
        } else {
            const bannedUnitTypeArray   = playerRule.bannedUnitTypeArray;
            bannedUnitTypeArray.length  = 0;
            for (const coId of bannedUnitTypeSet) {
                bannedUnitTypeArray.push(coId);
            }
        }
    }

    export function getBannedCoIdArray(baseWarRule: BaseWarRule, playerIndex: number): number[] | null {
        return getPlayerRule(baseWarRule, playerIndex).bannedCoIdArray ?? null;
    }
    export function getAvailableCoIdArrayForPlayer({ baseWarRule, playerIndex, gameConfig }: {
        baseWarRule     : BaseWarRule;
        playerIndex     : number;
        gameConfig      : GameConfig;
    }): number[] {
        return getAvailableCoIdArray(gameConfig, new Set<number>(getPlayerRule(baseWarRule, playerIndex).bannedCoIdArray));
    }
    export function getAvailableCoIdArray(gameConfig: GameConfig, bannedCoIdSet: Set<number>): number[] {
        return gameConfig.getEnabledCoArray()
            .map(v => v.coId)
            .filter(v => !bannedCoIdSet.has(v));
    }
    export function setBannedCoIdArray(baseWarRule: BaseWarRule, playerIndex: number, coIdSet: Set<number>): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
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

    export function setFixedCoIdInCcw(baseWarRule: BaseWarRule, playerIndex: number, coId: number | null): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.fixedCoIdInCcw = coId;
    }
    export function getFixedCoIdInCcw(baseWarRule: BaseWarRule, playerIndex: number): number | null {
        return getPlayerRule(baseWarRule, playerIndex).fixedCoIdInCcw ?? null;
    }

    export function setFixedCoIdInSrw(baseWarRule: BaseWarRule, playerIndex: number, coId: number | null): void {
        getPlayerRule(baseWarRule, playerIndex).fixedCoIdInSrw = coId;
    }
    export function getFixedCoIdInSrw(baseWarRule: BaseWarRule, playerIndex: number): number | null {
        return getPlayerRule(baseWarRule, playerIndex).fixedCoIdInSrw ?? null;
    }

    export function getTeamIndex(baseWarRule: BaseWarRule, playerIndex: number): number {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return CommonConstants.WarNeutralTeamIndex;
        }

        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        return Helpers.getExisted(playerRule.teamIndex);
    }
    export function setTeamIndex(baseWarRule: BaseWarRule, playerIndex: number, teamIndex: number): void {
        const playerRule = getPlayerRule(baseWarRule, playerIndex);
        playerRule.teamIndex = teamIndex;
    }
    export function tickTeamIndex(baseWarRule: BaseWarRule, playerIndex: number): void {
        setTeamIndex(
            baseWarRule,
            playerIndex,
            getTeamIndex(baseWarRule, playerIndex) % getPlayersCountUnneutral(baseWarRule) + 1
        );
    }

    export function getTeamIndexByRuleForPlayers(ruleForPlayers: IRuleForPlayers, playerIndex: number): number {
        return Helpers.getExisted(ruleForPlayers.playerRuleDataArray?.find(v => v.playerIndex === playerIndex)?.teamIndex);
    }

    export function getPlayerRule(baseWarRule: BaseWarRule, playerIndex: number): IDataForPlayerRule {
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            return DEFAULT_PLAYER_RULE;
        }

        return Helpers.getExisted(baseWarRule.ruleForPlayers?.playerRuleDataArray?.find(v => v.playerIndex === playerIndex));
    }

    export function getPlayersCountUnneutral(baseWarRule: BaseWarRule): number {
        return Helpers.getExisted(baseWarRule.ruleForPlayers?.playerRuleDataArray).length;
    }

    export function moveWarEventId(templateWarRule: ITemplateWarRule, warEventId: number, deltaIndex: number): void {
        const warEventIdArray   = Helpers.getExisted(templateWarRule.warEventIdArray);
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
    export function deleteWarEventId(templateWarRule: ITemplateWarRule, warEventId: number): void {
        const warEventIdArray   = Helpers.getExisted(templateWarRule.warEventIdArray);
        const currIndex         = warEventIdArray.findIndex(v => v === warEventId);
        if (currIndex < 0) {
            throw Helpers.newError(`Invalid currIndex: ${currIndex}`, ClientErrorCode.WarRuleHelpers_DeleteWarEventId_00);
        }

        warEventIdArray.splice(currIndex, 1);
    }
    export function addWarEventId(templateWarRule: ITemplateWarRule, warEventId: number): void {
        if (templateWarRule.warEventIdArray == null) {
            templateWarRule.warEventIdArray = [];
        }

        const warEventIdArray = templateWarRule.warEventIdArray;
        if (warEventIdArray.indexOf(warEventId) >= 0) {
            throw Helpers.newError(`The warEventId exists: ${warEventId}.`, ClientErrorCode.WarRuleHelpers_AddWarEventId_00);
        }

        warEventIdArray.push(warEventId);
    }

    export function getRandomCoIdWithSettingsForCommon(baseWarRule: BaseWarRule, playerIndex: number, gameConfig: GameConfig): number {
        return getRandomCoIdWithCoIdList(getAvailableCoIdArrayForPlayer({
            baseWarRule: baseWarRule,
            playerIndex,
            gameConfig,
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

    export function createDefaultTemplateWarRule(ruleId: number, playersCount: number): ITemplateWarRule {
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
            warEventIdArray : null,
        };
    }
    export function createDefaultInstanceWarRule(playersCount: number): IInstanceWarRule {
        return {
            templateWarRuleId   : null,
            ruleNameArray       : [
                { languageType: LanguageType.Chinese, text: Lang.getText(LangTextType.B0001, LanguageType.Chinese) },
                { languageType: LanguageType.English, text: Lang.getText(LangTextType.B0001, LanguageType.English) },
            ],
            ruleForGlobalParams : {
                hasFogByDefault     : false,
                defaultWeatherType  : Types.WeatherType.Clear,
            },
            ruleForPlayers: {
                playerRuleDataArray: createDefaultPlayerRuleList(playersCount),
            },
            warEventFullData    : {
                eventArray          : [],
                actionArray         : [],
                conditionArray      : [],
                conditionNodeArray  : [],
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
            bannedUnitTypeArray     : [],
            canActivateCoSkill      : true,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Validators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorCodeForTemplateWarRule({ templateWarRule, allWarEventIdArray, gameConfig, playersCountUnneutral }: {
        templateWarRule         : ITemplateWarRule;
        allWarEventIdArray      : number[];
        gameConfig              : GameConfig;
        playersCountUnneutral   : number;
    }): ClientErrorCode {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : templateWarRule.ruleNameArray,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarRuleNameMaxLength,
            minTextCount    : 1,
        })) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_00;
        }

        const ruleForPlayers = templateWarRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_01;
        }

        const ruleAvailability = templateWarRule.ruleAvailability;
        if ((!ruleAvailability) || (!checkIsValidWarRuleAvailability(ruleAvailability))) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_02;
        }

        const errorCodeForRuleForPlayers = getErrorCodeForRuleForPlayers({ ruleForPlayers, gameConfig, playersCountUnneutral, ruleAvailability });
        if (errorCodeForRuleForPlayers) {
            return errorCodeForRuleForPlayers;
        }

        const ruleForGlobalParams = templateWarRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_03;
        }

        const errorCodeForGlobalParams = getErrorCodeForRuleForGlobalParams(ruleForGlobalParams, gameConfig);
        if (errorCodeForGlobalParams) {
            return errorCodeForGlobalParams;
        }

        for (const warEventId of templateWarRule.warEventIdArray || []) {
            if (allWarEventIdArray.indexOf(warEventId) < 0) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_04;
            }
        }

        return ClientErrorCode.NoError;
    }
    export function getErrorCodeForInstanceWarRule({ instanceWarRule, gameConfig, playersCountUnneutral, warType, mapSize }: {
        instanceWarRule         : IInstanceWarRule;
        gameConfig              : GameConfig;
        playersCountUnneutral   : number;
        warType                 : Types.WarType;
        mapSize                 : Types.MapSize;
    }): ClientErrorCode {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : instanceWarRule.ruleNameArray,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarRuleNameMaxLength,
            minTextCount    : 1,
        })) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_00;
        }

        const ruleForPlayers = instanceWarRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_01;
        }

        const ruleAvailability: IRuleAvailability = {
            canCcw  : (warType === Types.WarType.CcwFog) || (warType === Types.WarType.CcwStd),
            canMcw  : (warType === Types.WarType.McwFog) || (warType === Types.WarType.McwStd),
            canMrw  : (warType === Types.WarType.MrwFog) || (warType === Types.WarType.MrwStd),
            canScw  : (warType === Types.WarType.ScwFog) || (warType === Types.WarType.ScwStd),
            canSrw  : (warType === Types.WarType.SrwFog) || (warType === Types.WarType.SrwStd),
        };
        const errorCodeForRuleForPlayers = getErrorCodeForRuleForPlayers({ ruleForPlayers, gameConfig, playersCountUnneutral, ruleAvailability });
        if (errorCodeForRuleForPlayers) {
            return errorCodeForRuleForPlayers;
        }

        const ruleForGlobalParams = instanceWarRule.ruleForGlobalParams;
        if (ruleForGlobalParams == null) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForInstanceWarRule_02;
        }

        const errorCodeForGlobalParams = getErrorCodeForRuleForGlobalParams(ruleForGlobalParams, gameConfig);
        if (errorCodeForGlobalParams) {
            return errorCodeForGlobalParams;
        }

        const errorCodeForWarEvent = WarEventHelpers.getErrorCodeForWarEventFullData({ warEventFullData: instanceWarRule.warEventFullData, mapSize, gameConfig, playersCountUnneutral });
        if (errorCodeForWarEvent) {
            return errorCodeForWarEvent;
        }

        return ClientErrorCode.NoError;
    }
    export function getErrorCodeForTemplateWarRuleArray({ templateWarRuleArray, playersCountUnneutral, allWarEventIdArray, gameConfig }: {
        templateWarRuleArray    : Types.Undefinable<ITemplateWarRule[]>;
        playersCountUnneutral   : number;
        allWarEventIdArray      : number[];
        gameConfig              : GameConfig;
    }): ClientErrorCode {
        const rulesCount = templateWarRuleArray ? templateWarRuleArray.length : 0;
        if ((!templateWarRuleArray)                                     ||
            (rulesCount <= 0)                               ||
            (rulesCount > CommonConstants.WarRuleMaxCount)
        ) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_00;
        }

        const ruleIdSet         = new Set<number>();
        const trimmedRuleArray  : ITemplateWarRule[] = [];
        for (const templateWarRule of templateWarRuleArray) {
            const ruleId = templateWarRule.ruleId;
            if ((ruleId == null) || (ruleId < 0) || (ruleId >= rulesCount) || (ruleIdSet.has(ruleId))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_01;
            }
            ruleIdSet.add(ruleId);

            const warRuleErrorCode = getErrorCodeForTemplateWarRule({ templateWarRule: templateWarRule, allWarEventIdArray, gameConfig, playersCountUnneutral });
            if (warRuleErrorCode) {
                return warRuleErrorCode;
            }

            const trimmedRule           = Helpers.deepClone(templateWarRule);
            trimmedRule.ruleId          = null;
            trimmedRule.ruleNameArray   = null;
            if (trimmedRuleArray.some(v => Helpers.checkIsSameValue(v, trimmedRule))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_02;
            }
            trimmedRuleArray.push(trimmedRule);
        }

        return ClientErrorCode.NoError;
    }

    export function getErrorCodeForRuleForPlayers({ ruleForPlayers, gameConfig, playersCountUnneutral, ruleAvailability }: {
        ruleForPlayers          : IRuleForPlayers;
        gameConfig              : GameConfig;
        playersCountUnneutral   : number;
        ruleAvailability        : IRuleAvailability;
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
            if (bannedCoIdArray.some(coId => !gameConfig.checkHasCo(coId))) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_13;
            }
            if (bannedCoIdArray.length !== new Set(bannedCoIdArray).size) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_14;
            }

            const bannedUnitTypeArray = data.bannedUnitTypeArray ?? [];
            if (!gameConfig.checkIsValidUnitTypeSubset(bannedUnitTypeArray)) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_15;
            }

            {
                const fixedCoIdInSrw = data.fixedCoIdInSrw;
                if (fixedCoIdInSrw == null) {
                    if (canSrw) {
                        teamIndexSetForHumanInSrw.add(teamIndex);
                    }
                } else {
                    if (gameConfig.getCoBasicCfg(fixedCoIdInSrw) == null) {
                        return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_16;
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
                    if (gameConfig.getCoBasicCfg(fixedCoIdInCcw) == null) {
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

    function checkIsValidWarRuleAvailability(availability: IRuleAvailability): boolean {
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

    export function getTemplateWarRule(templateWarRuleId: Types.Undefinable<number>, templateWarRuleArray: Types.Undefinable<ITemplateWarRule[]>): ITemplateWarRule | null {
        return templateWarRuleId == null
            ? null
            : (templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId) ?? null);
    }
    export function createInstanceWarRule(templateWarRule: ITemplateWarRule, warEventFullData: Types.Undefinable<CommonProto.Map.IWarEventFullData>): IInstanceWarRule {
        return {
            templateWarRuleId       : templateWarRule.ruleId,
            ruleNameArray           : Helpers.deepClone(templateWarRule.ruleNameArray),

            ruleForGlobalParams     : Helpers.deepClone(templateWarRule.ruleForGlobalParams),
            ruleForPlayers          : Helpers.deepClone(templateWarRule.ruleForPlayers),
            warEventFullData        : WarEventHelpers.trimAndCloneWarEventFullData(warEventFullData, templateWarRule.warEventIdArray),
        };
    }

    function getErrorCodeForRuleForGlobalParams(ruleForGlobalParams: IRuleForGlobalParams, gameConfig: GameConfig): ClientErrorCode {
        {
            const hasFogByDefault = ruleForGlobalParams.hasFogByDefault;
            if (hasFogByDefault == null) {
                return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_00;
            }
        }

        {
            const defaultWeatherType = ruleForGlobalParams.defaultWeatherType;
            if ((defaultWeatherType != null)                            &&
                (!gameConfig.checkIsValidWeatherType(defaultWeatherType))
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
