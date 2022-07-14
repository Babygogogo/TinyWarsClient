
// import TwnsBwWar                        from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode              from "../../tools/helpers/ClientErrorCode";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import ConfigManager                    from "../../tools/helpers/ConfigManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers                 from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsWeActionModifyPanel1         from "../view/WeActionModifyPanel1";
// import TwnsWeActionModifyPanel2         from "../view/WeActionModifyPanel2";
// import TwnsWeActionModifyPanel3         from "../view/WeActionModifyPanel3";
// import TwnsWeConditionModifyPanel1      from "../view/WeConditionModifyPanel1";
// import TwnsWeConditionModifyPanel10     from "../view/WeConditionModifyPanel10";
// import TwnsWeConditionModifyPanel11     from "../view/WeConditionModifyPanel11";
// import TwnsWeConditionModifyPanel12     from "../view/WeConditionModifyPanel12";
// import TwnsWeConditionModifyPanel2      from "../view/WeConditionModifyPanel2";
// import TwnsWeConditionModifyPanel3      from "../view/WeConditionModifyPanel3";
// import TwnsWeConditionModifyPanel4      from "../view/WeConditionModifyPanel4";
// import TwnsWeConditionModifyPanel5      from "../view/WeConditionModifyPanel5";
// import TwnsWeConditionModifyPanel6      from "../view/WeConditionModifyPanel6";
// import TwnsWeConditionModifyPanel7      from "../view/WeConditionModifyPanel7";
// import TwnsWeConditionModifyPanel8      from "../view/WeConditionModifyPanel8";
// import TwnsWeConditionModifyPanel9      from "../view/WeConditionModifyPanel9";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarEventHelpers {
    import LangTextType             = Lang.LangTextType;
    import LanguageType             = Types.LanguageType;
    import ConditionType            = Types.WarEventConditionType;
    import ActionType               = Types.WarEventActionType;
    import ValueComparator          = Types.ValueComparator;
    import WarEvent                 = CommonProto.WarEvent;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import BwWar                    = BaseWar.BwWar;
    import GameConfig               = Config.GameConfig;
    import ConfigManager            = Config.ConfigManager;

    const CONDITION_TYPE_ARRAY = [
        // ConditionType.WecTurnIndexEqualTo,
        // ConditionType.WecTurnIndexGreaterThan,
        // ConditionType.WecTurnIndexLessThan,
        // ConditionType.WecTurnIndexRemainderEqualTo,
        // ConditionType.WecTurnPhaseEqualTo,
        ConditionType.WecTurnAndPlayer,

        // ConditionType.WecPlayerIndexInTurnEqualTo,
        // ConditionType.WecPlayerIndexInTurnGreaterThan,
        // ConditionType.WecPlayerIndexInTurnLessThan,
        // ConditionType.WecPlayerAliveStateEqualTo,
        ConditionType.WecPlayerPresence,

        // ConditionType.WecEventCalledCountTotalEqualTo,
        // ConditionType.WecEventCalledCountTotalGreaterThan,
        // ConditionType.WecEventCalledCountTotalLessThan,
        ConditionType.WecEventCalledCount,

        ConditionType.WecWeatherAndFog,

        // ConditionType.WecTilePlayerIndexEqualTo,
        // ConditionType.WecTileTypeEqualTo,
        ConditionType.WecTilePresence,

        ConditionType.WecUnitPresence,

        ConditionType.WecCustomCounter,

        ConditionType.WecOngoingPersistentActionPresence,

        ConditionType.WecManualActionStatistics,
    ];

    const ACTION_TYPE_ARRAY = [
        // todo: add future types
        // ActionType.DeprecatedSetPlayerFund,
        // ActionType.DeprecatedSetPlayerCoEnergy,
        // ActionType.DeprecatedSetPlayerAliveState,
        ActionType.SetPlayerState,
        // ActionType.SetPlayerCoEnergy,
        // ActionType.SetPlayerAliveState,

        ActionType.AddUnit,
        ActionType.SetUnitState,

        ActionType.SetTileType,
        ActionType.SetTileState,

        ActionType.SetWeather,
        ActionType.SetForceFogCode,
        ActionType.SetCustomCounter,
        ActionType.Dialogue,
        ActionType.SimpleDialogue,
        ActionType.SetViewpoint,
        ActionType.PlayBgm,
        ActionType.StopPersistentAction,

        ActionType.PersistentShowText,
        ActionType.PersistentModifyPlayerAttribute,
    ];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // getter
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getEvent(fullData: IWarEventFullData, eventId: number): IWarEvent | null {
        return fullData.eventArray?.find(v => v.eventId === eventId) ?? null;
    }
    export function getCondition(fullData: IWarEventFullData, conditionId: number): IWarEventCondition | null {
        return fullData.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId) ?? null;
    }
    export function getNode(fullData: IWarEventFullData, nodeId: number): IWarEventConditionNode | null {
        return fullData.conditionNodeArray?.find(v => v.nodeId === nodeId) ?? null;
    }
    export function getAction(fullData: IWarEventFullData, actionId: number): IWarEventAction | null {
        return fullData.actionArray?.find(v => v.WeaCommonData?.actionId === actionId) ?? null;
    }

    export function getAllWarEventIdArray(fullData: Types.Undefinable<IWarEventFullData>): number[] {
        const idArray: number[] = [];
        for (const event of fullData ? fullData.eventArray || [] : []) {
            const eventId = event.eventId;
            if (eventId != null) {
                idArray.push(eventId);
            }
        }
        return idArray;
    }

    export function trimAndCloneWarEventFullData(fullData: Types.Undefinable<IWarEventFullData>, eventIdArray: Types.Undefinable<number[]>): IWarEventFullData {
        const dstEventArray     : IWarEvent[] = [];
        const dstNodeArray      : IWarEventConditionNode[] = [];
        const dstConditionArray : IWarEventCondition[] = [];
        const dstActionArray    : IWarEventAction[] = [];
        const trimmedData       : IWarEventFullData = {
            eventArray          : dstEventArray,
            conditionNodeArray  : dstNodeArray,
            conditionArray      : dstConditionArray,
            actionArray         : dstActionArray,
        };
        if ((fullData == null) || (eventIdArray == null)) {
            return trimmedData;
        }

        const srcEventArray     = fullData.eventArray || [];
        const srcNodeArray      = fullData.conditionNodeArray || [];
        const srcConditionArray = fullData.conditionArray || [];
        const srcActionArray    = fullData.actionArray || [];

        for (const eventId of eventIdArray) {
            const event = srcEventArray.find(v => v.eventId === eventId);
            if ((event == null) || (dstEventArray.indexOf(event) >= 0)) {
                continue;
            }
            dstEventArray.push(event);

            for (const actionId of event.actionIdArray || []) {
                const action = srcActionArray.find(v => {
                    const commonData = v.WeaCommonData;
                    return (!!commonData) && (commonData.actionId === actionId);
                });
                if ((action == null) || (dstActionArray.indexOf(action) >= 0)) {
                    continue;
                }

                dstActionArray.push(action);
            }

            const nodeIdArray = [event.conditionNodeId];
            for (let i = 0; i < nodeIdArray.length; ++i) {
                const nodeId    = nodeIdArray[i];
                const node      = srcNodeArray.find(v => v.nodeId === nodeId);
                if ((node == null) || (dstNodeArray.indexOf(node) >= 0)) {
                    continue;
                }

                dstNodeArray.push(node);
                nodeIdArray.push(...(node.subNodeIdArray || []));

                for (const conditionId of node.conditionIdArray || []) {
                    const condition = srcConditionArray.find(v => {
                        const commonData = v.WecCommonData;
                        return (!!commonData) && (commonData.conditionId === conditionId);
                    });
                    if ((condition == null) || (dstConditionArray.indexOf(condition) >= 0)) {
                        continue;
                    }

                    dstConditionArray.push(condition);
                }
            }
        }

        return Helpers.deepClone(trimmedData);
    }

    export function checkIsPersistentAction(action: IWarEventAction): boolean {
        return (action.WeaPersistentShowText != null)
            || (action.WeaPersistentModifyPlayerAttribute != null);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // validation
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type WarEventDict               = Map<number, IWarEvent>;
    type WarEventActionDict         = Map<number, IWarEventAction>;
    type WarEventConditionDict      = Map<number, IWarEventCondition>;
    type WarEventConditionNodeDict  = Map<number, IWarEventConditionNode>;
    export function getErrorCodeForWarEventFullData({ warEventFullData, gameConfig, mapSize, playersCountUnneutral }: {
        warEventFullData        : Types.Undefinable<IWarEventFullData>;
        gameConfig              : GameConfig;
        mapSize                 : Types.MapSize;
        playersCountUnneutral   : number;
    }): ClientErrorCode {   // DONE
        if (warEventFullData == null) {
            return ClientErrorCode.NoError;
        }

        const actionDict = new Map<number, IWarEventAction>();
        for (const action of warEventFullData.actionArray || []) {
            const actionId = action.WeaCommonData?.actionId;
            if ((actionId == null)                                              ||
                (actionDict.has(actionId))                                      ||
                (!ConfigManager.checkIsValidWarEventActionId(actionId))
            ) {
                return ClientErrorCode.WarEventFullDataValidation01;
            }
            actionDict.set(actionId, action);
        }
        if (actionDict.size > CommonConstants.WarEventMaxActionsPerMap) {
            return ClientErrorCode.WarEventFullDataValidation02;
        }

        const conditionDict = new Map<number, IWarEventCondition>();
        for (const condition of warEventFullData.conditionArray || []) {
            const conditionId = condition.WecCommonData?.conditionId;
            if ((conditionId == null) || (conditionDict.has(conditionId))) {
                return ClientErrorCode.WarEventFullDataValidation03;
            }
            conditionDict.set(conditionId, condition);
        }
        if (conditionDict.size > CommonConstants.WarEventMaxConditionsPerMap) {
            return ClientErrorCode.WarEventFullDataValidation04;
        }

        const nodeDict = new Map<number, IWarEventConditionNode>();
        for (const node of warEventFullData.conditionNodeArray || []) {
            const nodeId = node.nodeId;
            if ((nodeId == null) || (nodeDict.has(nodeId))) {
                return ClientErrorCode.WarEventFullDataValidation05;
            }
            nodeDict.set(nodeId, node);
        }
        if (nodeDict.size > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return ClientErrorCode.WarEventFullDataValidation06;
        }

        const eventDict = new Map<number, IWarEvent>();
        for (const event of warEventFullData.eventArray || []) {
            const eventId = event.eventId;
            if ((eventId == null) || (eventDict.has(eventId))) {
                return ClientErrorCode.WarEventFullDataValidation07;
            }
            eventDict.set(eventId, event);
        }
        if (eventDict.size > CommonConstants.WarEventMaxEventsPerMap) {
            return ClientErrorCode.WarEventFullDataValidation08;
        }

        if (!checkIsEveryWarEventActionInUse(actionDict, eventDict)) {
            return ClientErrorCode.WarEventFullDataValidation09;
        }
        if (!checkIsEveryWarEventConditionInUse(conditionDict, nodeDict)) {
            return ClientErrorCode.WarEventFullDataValidation10;
        }
        if (!checkIsEveryWarEventConditionNodeInUse(nodeDict, eventDict)) {
            return ClientErrorCode.WarEventFullDataValidation11;
        }

        for (const [, action] of actionDict) {
            if (!checkIsValidWarEventAction({ action, actionDict, mapSize, gameConfig, playersCountUnneutral })) {
                return ClientErrorCode.WarEventFullDataValidation13;
            }
        }
        for (const [, condition] of conditionDict) {
            if (!checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral })) {
                return ClientErrorCode.WarEventFullDataValidation14;
            }
        }
        for (const [, conditionNode] of nodeDict) {
            if (!checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict })) {
                return ClientErrorCode.WarEventFullDataValidation15;
            }
        }
        for (const [, warEvent] of eventDict) {
            if (!checkIsValidWarEvent({ warEvent, nodeDict, actionDict })) {
                return ClientErrorCode.WarEventFullDataValidation16;
            }
        }

        return ClientErrorCode.NoError;
    }
    function checkIsEveryWarEventActionInUse(actionDict: WarEventActionDict, eventDict: WarEventDict): boolean {    // DONE
        for (const [actionId] of actionDict) {
            let isInUse = false;
            for (const [, event] of eventDict) {
                if ((event.actionIdArray || []).indexOf(actionId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventConditionInUse(conditionDict: WarEventConditionDict, nodeDict: WarEventConditionNodeDict): boolean {   // DONE
        for (const [conditionId] of conditionDict) {
            let isInUse = false;
            for (const [, node] of nodeDict) {
                if ((node.conditionIdArray || []).indexOf(conditionId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventConditionNodeInUse(nodeDict: WarEventConditionNodeDict, eventDict: WarEventDict): boolean {    // DONE
        for (const [nodeId] of nodeDict) {
            let isInUse = false;
            for (const [, event] of eventDict) {
                if (event.conditionNodeId === nodeId) {
                    isInUse = true;
                    break;
                }
            }
            if (isInUse) {
                continue;
            }

            for (const [, node] of nodeDict) {
                if ((node.subNodeIdArray || []).indexOf(nodeId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }

    function checkIsValidWarEventAction({ action, actionDict, mapSize, gameConfig, playersCountUnneutral }: {    // DONE
        action                  : IWarEventAction;
        actionDict              : WarEventActionDict;
        mapSize                 : Types.MapSize;
        gameConfig              : GameConfig;
        playersCountUnneutral   : number;
    }): boolean {
        if (Object.keys(action).length !== 2) {
            return false;
        }

        const actionId = action.WeaCommonData?.actionId;
        if ((actionId == null) || (!ConfigManager.checkIsValidWarEventActionId(actionId))) {
            return false;
        }

        // todo: add more checkers when the action types grow.
        return (checkIsValidWeaAddUnit({ action: action.WeaAddUnit, gameConfig, mapSize, playersCountUnneutral }))
            || (checkIsValidWeaDialogue(action.WeaDialogue, gameConfig))
            || (checkIsValidWeaSetViewpoint(action.WeaSetViewpoint, mapSize))
            || (checkIsValidWeaSetWeather(action.WeaSetWeather, gameConfig))
            || (checkIsValidWeaSimpleDialogue(action.WeaSimpleDialogue, gameConfig))
            || (checkIsValidWeaPlayBgm(action.WeaPlayBgm, gameConfig))
            || (checkIsValidWeaSetForceFogCode(action.WeaSetForceFogCode))
            || (checkIsValidWeaSetCustomCounter(action.WeaSetCustomCounter))
            || (checkIsValidWeaStopPersistentAction(action.WeaStopPersistentAction, actionDict))
            || (checkIsValidWeaSetPlayerState(action.WeaSetPlayerState, playersCountUnneutral))
            || (checkIsValidWeaSetUnitState(action.WeaSetUnitState, mapSize, playersCountUnneutral, gameConfig))
            || (checkIsValidWeaSetTileType(action.WeaSetTileType, mapSize, playersCountUnneutral, gameConfig))
            || (checkIsValidWeaSetTileState(action.WeaSetTileState, mapSize, playersCountUnneutral, gameConfig))
            || (checkIsValidWeaPersistentShowText(action.WeaPersistentShowText))
            || (checkIsValidWeaPersistentModifyPlayerAttribute(action.WeaPersistentModifyPlayerAttribute, playersCountUnneutral, gameConfig));
        }
    function checkIsValidWeaAddUnit({ action, gameConfig, mapSize, playersCountUnneutral }: {
        action                  : Types.Undefinable<CommonProto.WarEvent.IWeaAddUnit>;
        gameConfig              : GameConfig;
        mapSize                 : Types.MapSize;
        playersCountUnneutral   : number;
    }): boolean {
        if (action == null) {
            return false;
        }

        const { unitArray } = action;
        if ((unitArray == null)                                              ||
            (unitArray.length <= 0)                                          ||
            (unitArray.length > CommonConstants.WarEventActionAddUnitMaxCount)
        ) {
            return false;
        }

        for (const data of unitArray) {
            const {
                needMovableTile,
                canBeBlockedByUnit,
                unitData,
            } = data;
            if ((needMovableTile == null) || (canBeBlockedByUnit == null) || (unitData == null)) {
                return false;
            }

            if (unitData.loaderUnitId != null) {
                return false;
            }

            if (WarHelpers.WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                playersCountUnneutral,
                gameConfig,
                mapSize,
            })) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWeaDialogue(action: Types.Undefinable<CommonProto.WarEvent.IWeaDialogue>, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        const backgroundId = action.backgroundId;
        if ((backgroundId != null) && (backgroundId > gameConfig.getSystemCfg().dialogueBackgroundMaxId)) {
            return false;
        }

        const dataArray = action.dataArray;
        if (dataArray == null) {
            return false;
        }

        const dialogueCount = dataArray.length;
        if ((dialogueCount <= 0) || (dialogueCount > CommonConstants.WarEventActionDialogueMaxCount)) {
            return false;
        }

        for (const data of dataArray) {
            if (Object.keys(data).length !== 1) {
                return false;
            }

            {
                const subData = data.dataForCoDialogue;
                if ((subData) && (!checkIsValidDataForCoDialogue(subData, gameConfig))) {
                    return false;
                }
            }

            {
                const subData = data.dataForAside;
                if ((subData) && (!checkIsValidDataForAside(subData))) {
                    return false;
                }
            }
        }

        return true;
    }
    function checkIsValidDataForCoDialogue(data: CommonProto.WarEvent.WeaDialogue.IDataForCoDialogue, gameConfig: GameConfig): boolean {
        const coId = data.coId;
        if ((coId == null)                          ||
            (coId === CommonConstants.CoId.Empty)    ||
            (gameConfig.getCoBasicCfg(coId) == null)
        ) {
            return false;
        }

        const side = data.side;
        if ((side !== Types.WarEventActionDialogueSide.Left) &&
            (side !== Types.WarEventActionDialogueSide.Right)
        ) {
            return false;
        }

        if (!Helpers.checkIsValidLanguageTextArray({
            list            : data.textArray,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarEventActionDialogueTextMaxLength,
            minTextCount    : 1,
        })) {
            return false;
        }

        const nameArray = data.nameArray;
        if ((nameArray)                             &&
            (!Helpers.checkIsValidLanguageTextArray({
                list            : nameArray,
                minTextLength   : 1,
                maxTextLength   : CommonConstants.WarEventActionDialogueNameMaxLength,
                minTextCount    : 1,
            }))
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidDataForAside(data: CommonProto.WarEvent.WeaDialogue.IDataForAside): boolean {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : data.textArray,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarEventActionDialogueTextMaxLength,
            minTextCount    : 1,
        })) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaSetViewpoint(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetViewpoint>, mapSize: Types.MapSize): boolean {
        if (action == null) {
            return false;
        }

        const gridIndex = GridIndexHelpers.convertGridIndex(action.gridIndex);
        return (gridIndex != null)
            && (GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize));
    }
    function checkIsValidWeaSetWeather(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetWeather>, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        const weatherType = action.weatherType;
        return (weatherType != null)
            && (gameConfig.checkIsValidWeatherType(weatherType))
            && (action.weatherTurnsCount != null);
    }
    function checkIsValidWeaSimpleDialogue(action: Types.Undefinable<CommonProto.WarEvent.IWeaSimpleDialogue>, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        const dataArray = action.dataArray;
        if (dataArray == null) {
            return false;
        }

        const dialogueCount = dataArray.length;
        if ((dialogueCount <= 0) || (dialogueCount > CommonConstants.WarEventActionDialogueMaxCount)) {
            return false;
        }

        for (const data of dataArray) {
            if (Object.keys(data).length !== 1) {
                return false;
            }

            {
                const subData = data.dataForCoDialogue;
                if ((subData) && (!checkIsValidDataForCoDialogue(subData, gameConfig))) {
                    return false;
                }
            }
        }

        return true;
    }
    function checkIsValidWeaPlayBgm(action: Types.Undefinable<CommonProto.WarEvent.IWeaPlayBgm>, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        if (action.useCoBgm) {
            return true;
        }

        const bgmCode = action.bgmCode;
        return (bgmCode != null) && (gameConfig.checkIsBgm(bgmCode));
    }
    function checkIsValidWeaSetForceFogCode(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetForceFogCode>): boolean {
        if (action == null) {
            return false;
        }

        const forceFogCode = action.forceFogCode;
        return (forceFogCode != null)
            && (ConfigManager.checkIsValidForceFogCode(forceFogCode))
            && (action.turnsCount != null);
    }
    function checkIsValidWeaSetCustomCounter(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetCustomCounter>): boolean {
        if (action == null) {
            return false;
        }

        {
            const counterIdArray = action.customCounterIdArray;
            if (counterIdArray?.length) {
                const counterIdSet = new Set<number>();
                for (const counterId of counterIdArray) {
                    if ((!ConfigManager.checkIsValidCustomCounterId(counterId)) ||
                        (counterIdSet.has(counterId))
                    ) {
                        return false;
                    }

                    counterIdSet.add(counterId);
                }
            }
        }

        const { deltaValue, multiplierPercentage } = action;
        if ((deltaValue ?? multiplierPercentage) == null) {
            return false;
        }
        if ((deltaValue != null) && (Math.abs(deltaValue) > CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue)) {
            return false;
        }
        if ((multiplierPercentage != null) && (Math.abs(multiplierPercentage) > CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage)) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaStopPersistentAction(action: Types.Undefinable<CommonProto.WarEvent.IWeaStopPersistentAction>, actionDict: WarEventActionDict): boolean {
        if (action == null) {
            return false;
        }

        const actionIdArray = action.actionIdArray;
        if ((actionIdArray == null)                                 ||
            (actionIdArray.length !== new Set(actionIdArray).size)  ||
            (actionIdArray.some((actionId): boolean => {
                const targetAction = actionDict.get(actionId);
                return (targetAction == null) || (!checkIsPersistentAction(targetAction));
            }))
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaSetPlayerState(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetPlayerState>, playersCountUnneutral: number): boolean {
        if (action == null) {
            return false;
        }

        {
            const conPlayerIndexArray = action.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const conAliveStateArray = action.conAliveStateArray;
            if ((conAliveStateArray) && (!ConfigManager.checkIsValidPlayerAliveStateSubset(conAliveStateArray))) {
                return false;
            }
        }

        {
            const comparator = action.conFundComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = action.conEnergyPercentageComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const conSkillTypeArray = action.conCoUsingSkillTypeArray;
            if ((conSkillTypeArray) && (!ConfigManager.checkIsValidCoSkillTypeSubset(conSkillTypeArray))) {
                return false;
            }
        }

        {
            const actAliveState = action.actAliveState;
            if ((actAliveState != null) && (!ConfigManager.checkIsValidPlayerAliveState(actAliveState))) {
                return false;
            }
        }

        if ((action.actFundDeltaValue               ??
                action.actFundMultiplierPercentage  ??
                action.actCoEnergyDeltaPct          ??
                action.actCoEnergyMultiplierPct     ??
                action.actAliveState
            ) == null
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaSetUnitState(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetUnitState>, mapSize: Types.MapSize, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        {
            const playerIndexArray = action.conPlayerIndexArray;
            if ((playerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const teamIndexArray = action.conTeamIndexArray;
            if ((teamIndexArray) && (!ConfigManager.checkIsValidTeamIndexSubset(teamIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const unitTypeArray = action.conUnitTypeArray;
            if ((unitTypeArray) && (unitTypeArray.some(v => !gameConfig.checkIsValidUnitType(v)))) {
                return false;
            }
        }

        {
            const locationIdArray = action.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return false;
            }
        }

        {
            const gridIndexArray = action.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, mapSize))) {
                return false;
            }
        }

        {
            const actionStateArray = action.conActionStateArray;
            if ((actionStateArray) && (!ConfigManager.checkIsValidUnitActionStateSubset(actionStateArray))) {
                return false;
            }
        }

        {
            const comparator = action.conHpComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = action.conFuelPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = action.conPriAmmoPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = action.conPromotionComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const actActionState = action.actActionState;
            if ((actActionState != null) && (!ConfigManager.checkIsValidUnitActionState(actActionState))) {
                return false;
            }
        }

        {
            const actUnitType = action.actUnitType;
            if ((actUnitType != null) && (!gameConfig.checkIsValidUnitType(actUnitType))) {
                return false;
            }
        }

        {
            const actPlayerIndex = action.actPlayerIndex;
            if ((actPlayerIndex != null)                                                                                                                            &&
                ((!ConfigManager.checkIsValidPlayerIndex(actPlayerIndex, playersCountUnneutral)) || (actPlayerIndex === CommonConstants.PlayerIndex.Neutral))
            ) {
                return false;
            }
        }

        if ((action.actHpMultiplierPercentage           ??
                action.actHpDeltaValue                  ??
                action.actFuelDeltaValue                ??
                action.actFuelMultiplierPercentage      ??
                action.actPriAmmoDeltaValue             ??
                action.actPriAmmoMultiplierPercentage   ??
                action.actPromotionDeltaValue           ??
                action.actPromotionMultiplierPercentage ??
                action.actActionState                   ??
                action.actHasLoadedCo                   ??
                action.actIsDiving                      ??
                action.actUnitType                      ??
                action.actPlayerIndex                   ??
                (action.actDestroyUnit || null)
            ) == null
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaSetTileType(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetTileType>, mapSize: Types.MapSize, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        {
            const locationIdArray = action.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return false;
            }
        }

        {
            const conPlayerIndexArray = action.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const conTileTypeArray = action.conTileTypeArray;
            if ((conTileTypeArray) && (!gameConfig.checkIsValidTileTypeSubset(conTileTypeArray))) {
                return false;
            }
        }

        {
            const gridIndexArray = action.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, mapSize))) {
                return false;
            }
        }

        {
            const tileData = action.actTileData;
            if (tileData == null) {
                return false;
            }

            const tempData      = Helpers.deepClone(tileData);
            tempData.gridIndex  = { x: 0, y: 0 };
            if ((new BaseWar.BwTile()).getErrorCodeForTileData(tempData, playersCountUnneutral, gameConfig)) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWeaSetTileState(action: Types.Undefinable<CommonProto.WarEvent.IWeaSetTileState>, mapSize: Types.MapSize, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        {
            const locationIdArray = action.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return false;
            }
        }

        {
            const gridIndexArray = action.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, mapSize))) {
                return false;
            }
        }

        {
            const conPlayerIndexArray = action.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const conTileTypeArray = action.conTileTypeArray;
            if ((conTileTypeArray) && (!gameConfig.checkIsValidTileTypeSubset(conTileTypeArray))) {
                return false;
            }
        }

        {
            const conHp = action.conHp;
            if (conHp) {
                if ((conHp.value == null) || (!ConfigManager.checkIsValidValueComparator(conHp.comparator))) {
                    return false;
                }
            }
        }

        {
            const conHp = action.conBuildPoint;
            if (conHp) {
                if ((conHp.value == null) || (!ConfigManager.checkIsValidValueComparator(conHp.comparator))) {
                    return false;
                }
            }
        }

        {
            const conHp = action.conCapturePoint;
            if (conHp) {
                if ((conHp.value == null) || (!ConfigManager.checkIsValidValueComparator(conHp.comparator))) {
                    return false;
                }
            }
        }

        const actAddLocationIdArray = action.actAddLocationIdArray ?? [];
        if (!ConfigManager.checkIsValidLocationIdSubset(actAddLocationIdArray)) {
            return false;
        }

        const actDeleteLocationIdArray = action.actDeleteLocationIdArray ?? [];
        if (!ConfigManager.checkIsValidLocationIdSubset(actDeleteLocationIdArray)) {
            return false;
        }

        if (new Set(actAddLocationIdArray.concat(actDeleteLocationIdArray)).size !== actAddLocationIdArray.length + actDeleteLocationIdArray.length) {
            return false;
        }

        if ((!actAddLocationIdArray.length)                         &&
            (!actDeleteLocationIdArray.length)                      &&
            (action.actBuildPointDeltaValue == null)                &&
            (action.actBuildPointMultiplierPercentage == null)      &&
            (action.actCapturePointDeltaValue == null)              &&
            (action.actCapturePointMultiplierPercentage == null)    &&
            (action.actHpDeltaValue == null)                        &&
            (action.actHpMultiplierPercentage == null)              &&
            (action.actIsHighlighted == null)
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaPersistentShowText(action: Types.Undefinable<CommonProto.WarEvent.IWeaPersistentShowText>): boolean {
        if (action == null) {
            return false;
        }

        if (!Helpers.checkIsValidLanguageTextArray({
            list            : action.textArray,
            minTextCount    : 1,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarEventActionPersistentShowTextMaxLength,
        })) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaPersistentModifyPlayerAttribute(action: Types.Undefinable<CommonProto.WarEvent.IWeaPersistentModifyPlayerAttribute>, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (action == null) {
            return false;
        }

        {
            const conPlayerIndexArray = action.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const actBannedUnitTypeArray = action.actBannedUnitTypeArray;
            if ((actBannedUnitTypeArray) && (!gameConfig.checkIsValidUnitTypeSubset(actBannedUnitTypeArray))) {
                return false;
            }
        }

        return true;
    }

    function checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral }: {  // DONE
        condition               : IWarEventCondition;
        mapSize                 : Types.MapSize;
        gameConfig              : GameConfig;
        playersCountUnneutral   : number;
    }): boolean {
        if (Object.keys(condition).length !== 2) {
            return false;
        }

        if (condition.WecCommonData?.conditionId == null) {
            return false;
        }

        // TODO add more checkers when the condition types grow.
        return (checkIsValidWecEventCalledCount(condition.WecEventCalledCount))
            || (checkIsValidWecPlayerPresence(condition.WecPlayerPresence, playersCountUnneutral, gameConfig))
            || (checkIsValidWecTurnAndPlayer(condition.WecTurnAndPlayer, playersCountUnneutral))
            || (checkIsValidWecWeatherAndFog(condition.WecWeatherAndFog, gameConfig))
            || (checkIsValidWecTilePresence(condition.WecTilePresence, mapSize, playersCountUnneutral, gameConfig))
            || (checkIsValidWecUnitPresence(condition.WecUnitPresence, mapSize, playersCountUnneutral, gameConfig))
            || (checkIsValidWecCustomCounter(condition.WecCustomCounter))
            || (checkIsValidWecOngoingPersistentActionPresence(condition.WecOngoingPersistentActionPresence))
            || (checkIsValidWecManualActionStatistics(condition.WecManualActionStatistics, playersCountUnneutral));
    }
    function checkIsValidWecEventCalledCount(condition: Types.Undefinable<CommonProto.WarEvent.IWecEventCalledCount>): boolean {
        if (condition == null) {
            return false;
        }

        {
            const eventIdArray = condition.eventIdArray;
            if (eventIdArray) {
                if (new Set(eventIdArray).size !== eventIdArray.length) {
                    return false;
                }
            }
        }

        if (condition.eventsCount == null) {
            return false;
        }

        {
            const comparator = condition.eventsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.timesInTurnComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.timesTotalComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWecPlayerPresence(condition: Types.Undefinable<CommonProto.WarEvent.IWecPlayerPresence>, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (condition == null) {
            return false;
        }

        if (condition.playersCount == null) {
            return false;
        }

        {
            const comparator = condition.playersCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const playerIndexArray = condition.playerIndexArray;
            if (playerIndexArray) {
                const playerIndexSet = new Set<number>();
                for (const playerIndex of playerIndexArray) {
                    if ((playerIndex < CommonConstants.PlayerIndex.Neutral)   ||
                        (playerIndex > playersCountUnneutral)                   ||
                        (playerIndexSet.has(playerIndex))
                    ) {
                        return false;
                    }

                    playerIndexSet.add(playerIndex);
                }
            }
        }

        {
            const aliveStateArray = condition.aliveStateArray;
            if (aliveStateArray) {
                const aliveStateSet = new Set<number>();
                for (const aliveState of aliveStateArray) {
                    if ((!ConfigManager.checkIsValidPlayerAliveState(aliveState))   ||
                        (aliveStateSet.has(aliveState))
                    ) {
                        return false;
                    }

                    aliveStateSet.add(aliveState);
                }
            }
        }

        {
            const comparator = condition.fundComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.energyPercentageComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const skillTypeArray = condition.coUsingSkillTypeArray;
            if (skillTypeArray) {
                const skillTypeSet = new Set<number>();
                for (const skillType of skillTypeArray) {
                    if ((!ConfigManager.checkIsValidCoSkillType(skillType)) ||
                        (skillTypeSet.has(skillType))
                    ) {
                        return false;
                    }

                    skillTypeSet.add(skillType);
                }
            }
        }

        {
            const coCategoryIdArray = condition.coCategoryIdArray;
            if ((coCategoryIdArray?.length) && (!gameConfig.checkIsValidCoCategoryIdSubset(coCategoryIdArray))) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWecTurnAndPlayer(condition: Types.Undefinable<CommonProto.WarEvent.IWecTurnAndPlayer>, playersCountUnneutral: number): boolean {
        if (condition == null) {
            return false;
        }

        {
            const comparator = condition.turnIndexComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
            // no need to check turnIndex
        }

        {
            const comparator = condition.turnIndexRemainderComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }

            const divider   = condition.turnIndexDivider;
            const remainder = condition.turnIndexRemainder;
            if (divider == null) {
                if (remainder != null) {
                    return false;
                }
            } else {
                if ((divider <= 1) || (remainder == null)) {
                    return false;
                }
            }
        }

        {
            const turnPhase = condition.turnPhase;
            if ((turnPhase != null) && (!ConfigManager.checkIsValidTurnPhaseCode(turnPhase))) {
                return false;
            }
        }

        {
            const playerIndexArray = condition.playerIndexArray;
            if (playerIndexArray) {
                const playerIndexSet = new Set<number>();
                for (const playerIndex of playerIndexArray) {
                    if ((playerIndex < CommonConstants.PlayerIndex.Neutral)   ||
                        (playerIndex > playersCountUnneutral)                   ||
                        (playerIndexSet.has(playerIndex))
                    ) {
                        return false;
                    }

                    playerIndexSet.add(playerIndex);
                }
            }
        }

        return true;
    }
    function checkIsValidWecWeatherAndFog(condition: Types.Undefinable<CommonProto.WarEvent.IWecWeatherAndFog>, gameConfig: GameConfig): boolean {
        if (condition == null) {
            return false;
        }

        if (condition.weatherTypeArray?.some(v => !gameConfig.checkIsValidWeatherType(v))) {
            return false;
        }

        return true;
    }
    function checkIsValidWecTilePresence(condition: Types.Undefinable<CommonProto.WarEvent.IWecTilePresence>, mapSize: Types.MapSize, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (condition == null) {
            return false;
        }

        const gridIndexArray = condition.gridIndexArray;
        if (gridIndexArray) {
            const gridIdSet = new Set<number>();
            for (const g of gridIndexArray) {
                const gridIndex = GridIndexHelpers.convertGridIndex(g);
                if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                    return false;
                }

                const gridId = GridIndexHelpers.getGridId(gridIndex, mapSize);
                if (gridIdSet.has(gridId)) {
                    return false;
                }
                gridIdSet.add(gridId);
            }
        }

        const locationIdArray = condition.locationIdArray;
        if (locationIdArray) {
            const locationIdSet = new Set<number>();
            for (const locationId of locationIdArray) {
                if ((locationId > CommonConstants.MapMaxLocationId) ||
                    (locationId < CommonConstants.MapMinLocationId) ||
                    (locationIdSet.has(locationId))
                ) {
                    return false;
                }
                locationIdSet.add(locationId);
            }
        }

        const playerIndexArray = condition.playerIndexArray;
        if (playerIndexArray) {
            const playerIndexSet = new Set<number>();
            for (const playerIndex of playerIndexArray) {
                if ((playerIndex < CommonConstants.PlayerIndex.Neutral)   ||
                    (playerIndex > playersCountUnneutral)                   ||
                    (playerIndexSet.has(playerIndex))
                ) {
                    return false;
                }
                playerIndexSet.add(playerIndex);
            }
        }

        const teamIndexArray = condition.teamIndexArray;
        if (teamIndexArray) {
            const teamIndexSet = new Set<number>();
            for (const teamIndex of teamIndexArray) {
                if ((teamIndex < CommonConstants.TeamIndex.Neutral)   ||
                    (teamIndex > playersCountUnneutral)                 ||
                    (teamIndexSet.has(teamIndex))
                ) {
                    return false;
                }
                teamIndexSet.add(teamIndex);
            }
        }

        {
            const tileTypeArray = condition.tileTypeArray;
            if ((tileTypeArray) && (!gameConfig.checkIsValidTileTypeSubset(tileTypeArray))) {
                return false;
            }
        }

        const tilesCount = condition.tilesCount;
        if (tilesCount == null) {
            return false;
        }

        const tilesCountComparator = condition.tilesCountComparator;
        if ((tilesCountComparator == null)                                      ||
            (!ConfigManager.checkIsValidValueComparator(tilesCountComparator))
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWecUnitPresence(condition: Types.Undefinable<CommonProto.WarEvent.IWecUnitPresence>, mapSize: Types.MapSize, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
        if (condition == null) {
            return false;
        }

        {
            const gridIndexArray = condition.gridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, mapSize))) {
                return false;
            }
        }

        {
            const locationIdArray = condition.locationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return false;
            }
        }

        {
            const playerIndexArray = condition.playerIndexArray;
            if ((playerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const teamIndexArray = condition.teamIndexArray;
            if ((teamIndexArray) && (!ConfigManager.checkIsValidTeamIndexSubset(teamIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const unitTypeArray = condition.unitTypeArray;
            if ((unitTypeArray) && (!gameConfig.checkIsValidUnitTypeSubset(unitTypeArray))) {
                return false;
            }
        }

        {
            const actionStateArray = condition.actionStateArray;
            if ((actionStateArray) && (!ConfigManager.checkIsValidUnitActionStateSubset(actionStateArray))) {
                return false;
            }
        }

        if (condition.unitsCount == null) {
            return false;
        }

        {
            const comparator = condition.unitsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.hpComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.fuelPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.priAmmoPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.promotionComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWecCustomCounter(condition: Types.Undefinable<CommonProto.WarEvent.IWecCustomCounter>): boolean {
        if (condition == null) {
            return false;
        }

        {
            const counterIdArray = condition.counterIdArray;
            if ((counterIdArray?.length) && (!ConfigManager.checkIsValidCustomCounterIdArray(counterIdArray))) {
                return false;
            }
        }

        if (condition.counterCount == null) {
            return false;
        }

        {
            const comparator = condition.counterCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const comparator = condition.valueComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        {
            const divider   = condition.valueDivider;
            const remainder = condition.valueRemainder;
            if (divider == null) {
                if (remainder != null) {
                    return false;
                }
            } else {
                if ((divider <= 1) || (remainder == null)) {
                    return false;
                }
            }
        }

        {
            const comparator = condition.valueRemainderComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWecOngoingPersistentActionPresence(condition: Types.Undefinable<CommonProto.WarEvent.IWecOngoingPersistentActionPresence>): boolean {
        if (condition == null) {
            return false;
        }

        {
            const actionIdArray = condition.ongoingActionIdArray;
            if ((actionIdArray) && (!ConfigManager.checkIsValidWarEventActionIdSubset(actionIdArray))) {
                return false;
            }
        }

        if (condition.ongoingActionsCount == null) {
            return false;
        }

        {
            const comparator = condition.ongoingActionsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWecManualActionStatistics(condition: Types.Undefinable<CommonProto.WarEvent.IWecManualActionStatistics>, playersCountUnneutral: number): boolean {
        if (condition == null) {
            return false;
        }

        {
            const playerIndexArray = condition.playerIndexArray;
            if ((playerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
                return false;
            }
        }

        {
            const totalActions = condition.totalActions;
            if ((totalActions == null)                                                      ||
                (totalActions.value == null)                                                ||
                (!ConfigManager.checkIsValidValueComparator(totalActions.comparator))
            ) {
                return false;
            }
        }

        return true;
    }

    function checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict }: {    // DONE
        conditionNode   : IWarEventConditionNode;
        conditionDict   : WarEventConditionDict;
        nodeDict        : WarEventConditionNodeDict;
    }): boolean {
        if (conditionNode.isAnd == null) {
            return false;
        }

        const currNodeId = conditionNode.nodeId;
        if (currNodeId == null) {
            return false;
        }

        const conditionIdArray  = conditionNode.conditionIdArray || [];
        const subNodeIdArray    = conditionNode.subNodeIdArray || [];
        if (conditionIdArray.length + subNodeIdArray.length <= 0) {
            return false;
        }

        for (const conditionId of conditionIdArray) {
            if (!conditionDict.has(conditionId)) {
                return false;
            }
        }

        for (const subNodeId of subNodeIdArray) {
            if (!nodeDict.has(subNodeId)) {
                return false;
            }
        }

        const usedNodeIdArray       = [currNodeId];
        const usedNodeIdSet         = new Set<number>();
        const usedConditionIdSet    = new Set<number>();
        for (let i = 0; i < usedNodeIdArray.length; ++i) {
            const nodeId = usedNodeIdArray[i];
            if (usedNodeIdSet.has(nodeId)) {
                return false;
            }
            usedNodeIdSet.add(nodeId);

            const subNode = nodeDict.get(nodeId);
            if (subNode == null) {
                return false;
            }

            const nodeIdArray = subNode.subNodeIdArray;
            if (nodeIdArray) {
                usedNodeIdArray.push(...nodeIdArray);
            }

            for (const conId of subNode.conditionIdArray || []) {
                if (usedConditionIdSet.has(conId)) {
                    return false;
                }
                usedConditionIdSet.add(conId);
            }
        }

        return true;
    }
    function checkIsValidWarEvent({ warEvent, nodeDict, actionDict }: { // DONE
        warEvent    : IWarEvent;
        nodeDict    : WarEventConditionNodeDict;
        actionDict  : WarEventActionDict;
    }): boolean {
        const eventNameArray = warEvent.eventNameArray;
        if ((eventNameArray == null)                                     ||
            (!Helpers.checkIsValidLanguageTextArray({
                list            : eventNameArray,
                maxTextLength   : CommonConstants.WarEventNameMaxLength,
                minTextLength   : 1,
                minTextCount    : 1,
            }))
        ) {
            return false;
        }

        const maxCallCountInPlayerTurn = warEvent.maxCallCountInPlayerTurn;
        if ((maxCallCountInPlayerTurn == null)                                          ||
            (maxCallCountInPlayerTurn < 1)                                              ||
            (maxCallCountInPlayerTurn > CommonConstants.WarEventMaxCallCountInPlayerTurn)
        ) {
            return false;
        }

        const maxCallCountTotal = warEvent.maxCallCountTotal;
        if ((maxCallCountTotal == null)                                     ||
            (maxCallCountTotal < 1)                                         ||
            (maxCallCountTotal > CommonConstants.WarEventMaxCallCountTotal)
        ) {
            return false;
        }

        const conditionNodeId = warEvent.conditionNodeId;
        if ((conditionNodeId == null) || (!nodeDict.has(conditionNodeId))) {
            return false;
        }

        const actionIdArray = warEvent.actionIdArray;
        if ((actionIdArray == null)                                              ||
            (actionIdArray.length > CommonConstants.WarEventMaxActionsPerEvent)  ||
            (actionIdArray.length <= 0)                                          ||
            (actionIdArray.some(v => !actionDict.has(v)))
        ) {
            return false;
        }

        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // description
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getDescForCondition(con: IWarEventCondition, gameConfig: GameConfig): string | null {
        return (getDescForWecEventCalledCount(con.WecEventCalledCount))
            || (getDescForWecPlayerPresence(con.WecPlayerPresence, gameConfig))
            || (getDescForWecTurnAndPlayer(con.WecTurnAndPlayer))
            || (getDescForWecWeatherAndFog(con.WecWeatherAndFog, gameConfig))
            || (getDescForWecTilePresence(con.WecTilePresence, gameConfig))
            || (getDescForWecUnitPresence(con.WecUnitPresence, gameConfig))
            || (getDescForWecCustomCounter(con.WecCustomCounter))
            || (getDescForWecOngoingPersistentActionPresence(con.WecOngoingPersistentActionPresence))
            || (getDescForWecManualActionStatistics(con.WecManualActionStatistics));
    }
    function getDescForWecEventCalledCount(data: Types.Undefinable<WarEvent.IWecEventCalledCount>): string | null {
        if (data == null) {
            return null;
        }

        const eventIdArray          = data.eventIdArray;
        const textForEventIdArray   = eventIdArray?.length
            ? eventIdArray.join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0792));

        const timesInTurn           = data.timesInTurn;
        const textForTimesInTurn    = timesInTurn != null
            ? Lang.getFormattedText(LangTextType.F0104, Lang.getValueComparatorName(Helpers.getExisted(data.timesInTurnComparator)), timesInTurn)
            : null;

        const timesTotal            = data.timesTotal;
        const textForTimesTotal     = timesTotal != null
            ? Lang.getFormattedText(LangTextType.F0105, Lang.getValueComparatorName(Helpers.getExisted(data.timesTotalComparator)), timesTotal)
            : null;

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForTimesInTurn,
            textForTimesTotal,
        ]);
        return Lang.getFormattedText(
            LangTextType.F0103,
            textForEventIdArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            Lang.getValueComparatorName(Helpers.getExisted(data.eventsCountComparator)),
            data.eventsCount ?? CommonConstants.ErrorTextForUndefined,
        );
    }
    function getDescForWecPlayerPresence(data: Types.Undefinable<WarEvent.IWecPlayerPresence>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const playerIndexArray          = data.playerIndexArray;
        const textForPlayerIndexArray   = playerIndexArray?.length
            ? playerIndexArray.map(v => `P${v}`).join(`/`)
            : Lang.getText(LangTextType.B0766);

        const aliveStateArray           = data.aliveStateArray;
        const textForAliveStateArray    = aliveStateArray?.length
            ? Lang.getFormattedText(LangTextType.F0099, aliveStateArray.map(v => Lang.getPlayerAliveStateName(v)).join(`/`))
            : null;

        const isSkipTurn        = data.isSkipTurn;
        const textForIsSkipTurn = isSkipTurn == null
            ? null
            : Lang.getText(isSkipTurn ? LangTextType.B0980 : LangTextType.B0981);

        const fund          = data.fund;
        const textForFund   = fund != null
            ? Lang.getFormattedText(LangTextType.F0100, Lang.getValueComparatorName(Helpers.getExisted(data.fundComparator)), fund)
            : null;

        const energyPercentage          = data.energyPercentage;
        const textForEnergyPercentage   = energyPercentage != null
            ? Lang.getFormattedText(LangTextType.F0101, Lang.getValueComparatorName(Helpers.getExisted(data.energyPercentageComparator)), energyPercentage)
            : null;

        const coUsingSkillTypeArray         = data.coUsingSkillTypeArray;
        const textForCoUsingSkillTypeArray  = coUsingSkillTypeArray?.length
            ? Lang.getFormattedText(LangTextType.F0102, coUsingSkillTypeArray.map(v => Lang.getCoSkillTypeName(v)).join(`/`))
            : null;

        const coCategoryIdArray         = data.coCategoryIdArray;
        const textForCoCategoryIdArray  = coCategoryIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0132, coCategoryIdArray.map(v => gameConfig.getCoCategoryCfg(v)?.name).join(`/`))
            : null;

        const textArrayForSubCondition = Helpers.getNonNullElements([
            textForAliveStateArray,
            textForIsSkipTurn,
            textForFund,
            textForEnergyPercentage,
            textForCoUsingSkillTypeArray,
            textForCoCategoryIdArray,
        ]);
        return Lang.getFormattedText(
            LangTextType.F0098,
            textForPlayerIndexArray,
            textArrayForSubCondition.length ? textArrayForSubCondition.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            Lang.getValueComparatorName(Helpers.getExisted(data.playersCountComparator)),
            data.playersCount ?? CommonConstants.ErrorTextForUndefined
        );
    }
    function getDescForWecTurnAndPlayer(data: Types.Undefinable<WarEvent.IWecTurnAndPlayer>): string | null {
        if (data == null) {
            return null;
        }

        const turnIndex                     = data.turnIndex;
        const turnIndexComparator           = data.turnIndexComparator;
        const turnIndexDivider              = data.turnIndexDivider;
        const turnIndexRemainder            = data.turnIndexRemainder;
        const turnIndexRemainderComparator  = data.turnIndexRemainderComparator;
        const playerIndexArray              = data.playerIndexArray;
        const turnPhase                     = data.turnPhase;
        const shouldShowTextForTurnDivider  = (turnIndexDivider ?? turnIndexRemainder) != null;
        const textForTurnIndex              = turnIndex == null
            ? Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0191))
            : `${turnIndexComparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(turnIndexComparator)} ${turnIndex}`;
        const textForTurnPhase              = turnPhase == null
            ? Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0780))
            : (Lang.getTurnPhaseName(turnPhase) ?? CommonConstants.ErrorTextForUndefined);
        const textForPlayerIndexArray       = playerIndexArray?.length
            ? playerIndexArray.map(v => `P${v}`).join(`/`)
            : Lang.getText(LangTextType.B0766);

        if (turnIndex == null) {
            if (shouldShowTextForTurnDivider) {
                return Lang.getFormattedText(
                    LangTextType.F0096,
                    turnIndexDivider ?? CommonConstants.ErrorTextForUndefined,
                    turnIndexRemainderComparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(turnIndexRemainderComparator),
                    turnIndexRemainder ?? CommonConstants.ErrorTextForUndefined,
                    textForTurnPhase,
                    textForPlayerIndexArray,
                );
            } else {
                return Lang.getFormattedText(
                    LangTextType.F0094,
                    textForTurnIndex,
                    textForTurnPhase,
                    textForPlayerIndexArray,
                );
            }
        } else {
            if (shouldShowTextForTurnDivider) {
                return Lang.getFormattedText(
                    LangTextType.F0095,
                    textForTurnIndex,
                    turnIndexDivider ?? CommonConstants.ErrorTextForUndefined,
                    turnIndexRemainderComparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(turnIndexRemainderComparator),
                    turnIndexRemainder ?? CommonConstants.ErrorTextForUndefined,
                    textForTurnPhase,
                    textForPlayerIndexArray,
                );
            } else {
                return Lang.getFormattedText(
                    LangTextType.F0094,
                    textForTurnIndex,
                    textForTurnPhase,
                    textForPlayerIndexArray,
                );
            }
        }
    }
    function getDescForWecWeatherAndFog(data: Types.Undefinable<WarEvent.IWecWeatherAndFog>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const weatherTypeArray          = data.weatherTypeArray;
        const textForWeatherTypeArray   = weatherTypeArray?.length
            ? weatherTypeArray.map(v => Lang.getWeatherName(v, gameConfig)).join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0705));

        const hasFogCurrently           = data.hasFogCurrently;
        const textForHasFogCurrently    = hasFogCurrently != null
            ? Lang.getFormattedText(LangTextType.F0107, Lang.getText(hasFogCurrently ? LangTextType.B0431 : LangTextType.B0432))
            : null;

        const textArrayForSubCondition = Helpers.getNonNullElements([
            textForHasFogCurrently
        ]);
        return Lang.getFormattedText(
            LangTextType.F0106,
            textForWeatherTypeArray,
            textArrayForSubCondition.length ? textArrayForSubCondition.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
        );
    }
    function getDescForWecTilePresence(data: Types.Undefinable<WarEvent.IWecTilePresence>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const teamIndexArray        = data.teamIndexArray;
        const textForTeamIndex      = teamIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`/`))
            : null;

        const playerIndexArray      = data.playerIndexArray;
        const textForPlayerIndex    = playerIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, playerIndexArray.map(v => `P${v}`).join(`/`))
            : null;

        const locationIdArray       = data.locationIdArray;
        const textForLocation       = locationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0116, locationIdArray.join(`/`))
            : null;

        const gridIndexArray        = data.gridIndexArray;
        const textForGridIndex      = gridIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0117, gridIndexArray.map(v => `(${v.x},${v.y})`).join(`/`))
            : null;

        const isOwnerPlayerInTurn           = data.isOwnerPlayerInTurn;
        const textForIsOwnerPlayerInTurn    = isOwnerPlayerInTurn == null
            ? null
            : Lang.getText(isOwnerPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForLocation,
            textForGridIndex,
            textForTeamIndex,
            textForPlayerIndex,
            textForIsOwnerPlayerInTurn,
        ]);

        const tileTypeArray         = data.tileTypeArray ?? [];
        const tilesCount            = data.tilesCount;
        const comparator            = data.tilesCountComparator;
        const textForTileType       = tileTypeArray.length ? tileTypeArray.map(v => Lang.getTileName(v, gameConfig)).join(`/`) : Lang.getText(LangTextType.B0777);

        return Lang.getFormattedText(
            LangTextType.F0093,
            textForTileType,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            comparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined),
            tilesCount ?? CommonConstants.ErrorTextForUndefined
        );
    }
    function getDescForWecUnitPresence(data: Types.Undefinable<WarEvent.IWecUnitPresence>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const unitTypeArray         = data.unitTypeArray;
        const textForUnitTypeArray  = unitTypeArray?.length
            ? unitTypeArray.map(v => Lang.getUnitName(v, gameConfig)).join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0805));

        const teamIndexArray        = data.teamIndexArray;
        const textForTeamIndex      = teamIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`/`))
            : null;

        const playerIndexArray      = data.playerIndexArray;
        const textForPlayerIndex    = playerIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, playerIndexArray.map(v => `P${v}`).join(`/`))
            : null;

        const locationIdArray       = data.locationIdArray;
        const textForLocation       = locationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0116, locationIdArray.join(`/`))
            : null;

        const gridIndexArray        = data.gridIndexArray;
        const textForGridIndex      = gridIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0117, gridIndexArray.map(v => `(${v.x},${v.y})`).join(`/`))
            : null;

        const actionStateArray      = data.actionStateArray;
        const textForActionState    = actionStateArray?.length
            ? Lang.getFormattedText(LangTextType.F0118, actionStateArray.map(v => Lang.getUnitActionStateText(v)).join(`/`))
            : null;

        const hasLoadedCo           = data.hasLoadedCo;
        const textForHasLoadedCo    = hasLoadedCo != null
            ? Lang.getText(hasLoadedCo ? LangTextType.A0270 : LangTextType.A0271)
            : null;

        const isOwnerPlayerInTurn           = data.isOwnerPlayerInTurn;
        const textForIsOwnerPlayerInTurn    = isOwnerPlayerInTurn == null
            ? null
            : Lang.getText(isOwnerPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const isDiving          = data.isDiving;
        const textForIsDiving   = isDiving == null
            ? null
            : Lang.getText(isDiving ? LangTextType.B0927 : LangTextType.B0928);

        const hp                    = data.hp;
        const hpComparator          = data.hpComparator;
        const textForHp             = hp != null
            ? Lang.getFormattedText(LangTextType.F0120, hpComparator != null ? Lang.getValueComparatorName(hpComparator) : CommonConstants.ErrorTextForUndefined, hp)
            : null;

        const fuelPct               = data.fuelPct;
        const fuelPctComparator     = data.fuelPctComparator;
        const textForFuelPct        = fuelPct != null
            ? Lang.getFormattedText(LangTextType.F0121, fuelPctComparator != null ? Lang.getValueComparatorName(fuelPctComparator) : CommonConstants.ErrorTextForUndefined, fuelPct)
            : null;

        const priAmmoPct            = data.priAmmoPct;
        const priAmmoPctComparator  = data.priAmmoPctComparator;
        const textForPriAmmoPct     = priAmmoPct != null
            ? Lang.getFormattedText(LangTextType.F0122, priAmmoPctComparator != null ? Lang.getValueComparatorName(priAmmoPctComparator) : CommonConstants.ErrorTextForUndefined, priAmmoPct)
            : null;

        const promotion             = data.promotion;
        const promotionComparator   = data.promotionComparator;
        const textForPromotion      = promotion != null
            ? Lang.getFormattedText(LangTextType.F0123, promotionComparator != null ? Lang.getValueComparatorName(promotionComparator) : CommonConstants.ErrorTextForUndefined, promotion)
            : null;

        const unitsCount                = data.unitsCount;
        const comparator                = data.unitsCountComparator;
        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForTeamIndex,
            textForPlayerIndex,
            textForIsOwnerPlayerInTurn,
            textForLocation,
            textForGridIndex,
            textForActionState,
            textForHasLoadedCo,
            textForHp,
            textForFuelPct,
            textForPriAmmoPct,
            textForPromotion,
            textForIsDiving,
        ]);
        return Lang.getFormattedText(
            LangTextType.F0090,
            textForUnitTypeArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            comparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined),
            unitsCount ?? CommonConstants.ErrorTextForUndefined
        );
    }
    function getDescForWecCustomCounter(data: Types.Undefinable<WarEvent.IWecCustomCounter>): string | null {
        if (data == null) {
            return null;
        }

        const counterIdArray        = data.counterIdArray;
        const textForCounterIdArray = counterIdArray?.length
            ? counterIdArray.join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0792));

        const targetValue           = data.value;
        const textForTargetValue    = targetValue != null
            ? Lang.getFormattedText(LangTextType.F0112, Lang.getValueComparatorName(Helpers.getExisted(data.valueComparator)), targetValue)
            : null;

        const valueDivider      = data.valueDivider;
        const valueRemainder    = data.valueRemainder;
        const textForRemainder  = (valueDivider ?? valueRemainder != null)
            ? Lang.getFormattedText(LangTextType.F0113, valueDivider ?? CommonConstants.ErrorTextForUndefined, Lang.getValueComparatorName(Helpers.getExisted(data.valueRemainderComparator)), valueRemainder ?? CommonConstants.ErrorTextForUndefined)
            : null;

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForTargetValue,
            textForRemainder,
        ]);
        return Lang.getFormattedText(
            LangTextType.F0111,
            textForCounterIdArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            Lang.getValueComparatorName(Helpers.getExisted(data.counterCountComparator)),
            data.counterCount ?? CommonConstants.ErrorTextForUndefined,
        );
    }
    function getDescForWecOngoingPersistentActionPresence(data: Types.Undefinable<WarEvent.IWecOngoingPersistentActionPresence>): string | null {
        if (data == null) {
            return null;
        }

        const actionIdArray         = data.ongoingActionIdArray;
        const textForActionIdArray  = actionIdArray?.length
            ? actionIdArray.join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0792));

        return Lang.getFormattedText(
            LangTextType.F0135,
            textForActionIdArray,
            Lang.getValueComparatorName(Helpers.getExisted(data.ongoingActionsCountComparator)),
            data.ongoingActionsCount ?? CommonConstants.ErrorTextForUndefined,
        );
    }
    function getDescForWecManualActionStatistics(data: Types.Undefinable<WarEvent.IWecManualActionStatistics>): string | null {
        if (data == null) {
            return null;
        }

        const playerIndexArray          = data.playerIndexArray;
        const textForPlayerIndexArray   = playerIndexArray?.length
            ? playerIndexArray.map(v => `P${v}`).join(`/`)
            : Lang.getText(LangTextType.B0766);

        const isPlayerInTurn        = data.isPlayerInTurn;
        const textForIsPlayerInTurn = isPlayerInTurn == null
            ? null
            : Lang.getText(isPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const textArrayForSubCondition1 = Helpers.getNonNullElements([
            textForIsPlayerInTurn,
        ]);

        const recentTurnsCount          = data.recentTurnsCount;
        const textForRecentTurnsCount   = recentTurnsCount == null
            ? ``
            : Lang.getFormattedText(LangTextType.F0144, recentTurnsCount);

        return Lang.getFormattedText(
            LangTextType.F0143,
            textForPlayerIndexArray,
            textArrayForSubCondition1.length ? textArrayForSubCondition1.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            textForRecentTurnsCount,
            Lang.getValueComparatorName(data.totalActions?.comparator) ?? `??`,
            data.totalActions?.value ?? CommonConstants.ErrorTextForUndefined
        );
    }

    export function getDescForAction(action: IWarEventAction, gameConfig: GameConfig): string | null {
        // todo: add functions for other actions
        return (getDescForWeaAddUnit(action.WeaAddUnit, gameConfig))
            || (getDescForWeaDialogue(action.WeaDialogue, gameConfig))
            || (getDescForWeaSetViewpoint(action.WeaSetViewpoint))
            || (getDescForWeaSetWeather(action.WeaSetWeather, gameConfig))
            || (getDescForWeaSimpleDialogue(action.WeaSimpleDialogue, gameConfig))
            || (getDescForWeaPlayBgm(action.WeaPlayBgm, gameConfig))
            || (getDescForWeaSetForceFogCode(action.WeaSetForceFogCode))
            || (getDescForWeaSetCustomCounter(action.WeaSetCustomCounter))
            || (getDescForWeaStopPersistentAction(action.WeaStopPersistentAction))
            || (getDescForWeaSetPlayerState(action.WeaSetPlayerState))
            || (getDescForWeaSetUnitState(action.WeaSetUnitState, gameConfig))
            || (getDescForWeaSetTileType(action.WeaSetTileType, gameConfig))
            || (getDescForWeaSetTileState(action.WeaSetTileState, gameConfig))
            || (getDescForWeaPersistentShowText(action.WeaPersistentShowText))
            || (getDescForWeaPersistentModifyPlayerAttribute(action.WeaPersistentModifyPlayerAttribute, gameConfig));
    }
    function getDescForWeaAddUnit(data: Types.Undefinable<WarEvent.IWeaAddUnit>, gameConfig: GameConfig): string | null {
        if (!data) {
            return null;
        } else {
            const unitCountDict = new Map<number, number>();
            for (const unitData of data.unitArray || []) {
                const unitType = Helpers.getExisted(unitData.unitData?.unitType);
                unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
            }

            const unitNameArray: string[] = [];
            for (const [unitType, count] of unitCountDict) {
                unitNameArray.push(`${Lang.getUnitName(unitType, gameConfig)} * ${count}`);
            }
            return Lang.getFormattedText(LangTextType.F0059, unitNameArray.join(", "));
        }
    }
    function getDescForWeaDialogue(data: Types.Undefinable<WarEvent.IWeaDialogue>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        } else {
            const coIdSet = new Set<number>();
            for (const dialogueData of data.dataArray || []) {
                const coId = dialogueData.dataForCoDialogue?.coId;
                (coId != null) && (coIdSet.add(coId));
            }

            const coNameArray   : string[] = [];
            for (const coId of coIdSet) {
                const coName = gameConfig.getCoNameAndTierText(coId);
                (coName != null) && (coNameArray.push(coName));
            }

            return Lang.getFormattedText(LangTextType.F0070, coNameArray.join(`, `));
        }
    }
    function getDescForWeaSetViewpoint(data: Types.Undefinable<WarEvent.IWeaSetViewpoint>): string | null {
        if (data == null) {
            return null;
        }

        const gridIndex = data.gridIndex;
        return Lang.getFormattedText(LangTextType.F0075, gridIndex?.x, gridIndex?.y);
    }
    function getDescForWeaSetWeather(data: Types.Undefinable<WarEvent.IWeaSetWeather>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const weatherTurnsCount = Helpers.getExisted(data.weatherTurnsCount, ClientErrorCode.WarEventHelper_GetDescForWeaSetWeather_00);
        const weatherName       = Lang.getWeatherName(Helpers.getExisted(data.weatherType, ClientErrorCode.WarEventHelper_GetDescForWeaSetWeather_01), gameConfig);
        return (weatherTurnsCount == 0)
            ? Lang.getFormattedText(LangTextType.F0077, weatherName)
            : Lang.getFormattedText(LangTextType.F0076, weatherName, weatherTurnsCount);
    }
    function getDescForWeaSimpleDialogue(data: Types.Undefinable<WarEvent.IWeaSimpleDialogue>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        } else {
            const coIdSet = new Set<number>();
            for (const dialogueData of data.dataArray || []) {
                const coId = dialogueData.dataForCoDialogue?.coId;
                (coId != null) && (coIdSet.add(coId));
            }

            const coNameArray   : string[] = [];
            for (const coId of coIdSet) {
                const coName = gameConfig.getCoNameAndTierText(coId);
                (coName != null) && (coNameArray.push(coName));
            }

            return Lang.getFormattedText(LangTextType.F0085, coNameArray.join(`, `));
        }
    }
    function getDescForWeaPlayBgm(data: Types.Undefinable<WarEvent.IWeaPlayBgm>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        if (data.useCoBgm) {
            return Lang.getText(LangTextType.A0262);
        } else {
            const bgmCode       = data.bgmCode;
            const langTextType  = bgmCode == null ? null : gameConfig.getBgmSfxCfg(bgmCode)?.lang;
            return `${Lang.getText(LangTextType.B0750)}: ${langTextType == null ? CommonConstants.ErrorTextForUndefined : Lang.getText(langTextType)}`;
        }
    }
    function getDescForWeaSetForceFogCode(data: Types.Undefinable<WarEvent.IWeaSetForceFogCode>): string | null {
        if (data == null) {
            return null;
        }

        const turnsCount            = Helpers.getExisted(data.turnsCount, ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_00);
        const textForForceFogCode   = Lang.getForceFogCodeName(Helpers.getExisted(data.forceFogCode, ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_01)) ?? CommonConstants.ErrorTextForUndefined;
        return (turnsCount == 0)
            ? Lang.getFormattedText(LangTextType.F0109, textForForceFogCode)
            : Lang.getFormattedText(LangTextType.F0108, textForForceFogCode, turnsCount);
    }
    function getDescForWeaSetCustomCounter(data: Types.Undefinable<WarEvent.IWeaSetCustomCounter>): string | null {
        if (data == null) {
            return null;
        }

        const counterIdArray = data.customCounterIdArray;
        return Lang.getFormattedText(
            LangTextType.F0110,
            counterIdArray?.length ? counterIdArray.join(`/`) : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0792)),
            data.multiplierPercentage ?? 100,
            data.deltaValue ?? 0
        );
    }
    function getDescForWeaStopPersistentAction(data: Types.Undefinable<WarEvent.IWeaStopPersistentAction>): string | null {
        if (data == null) {
            return null;
        }

        return Lang.getFormattedText(LangTextType.F0130, data.actionIdArray?.map(v => `A${v}`).join(`/`) || `--`);
    }
    function getDescForWeaSetPlayerState(data: Types.Undefinable<WarEvent.IWeaSetPlayerState>): string | null {
        if (data == null) {
            return null;
        }

        const conPlayerIndexArray           = data.conPlayerIndexArray;
        const textForConPlayerIndexArray    = conPlayerIndexArray?.length
            ? conPlayerIndexArray.map(v => `P${v}`).join(`/`)
            : Lang.getText(LangTextType.B0766);

        const conIsPlayerInTurn         = data.conIsPlayerInTurn;
        const textForConIsPlayerInTurn  = conIsPlayerInTurn == null
            ? null
            : Lang.getText(conIsPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const conIsSkipTurn         = data.conIsSkipTurn;
        const textForConIsSkipTurn  = conIsSkipTurn == null
            ? null
            : Lang.getText(conIsSkipTurn ? LangTextType.B0980 : LangTextType.B0981);

        const conAliveStateArray        = data.conAliveStateArray;
        const textForConAliveStateArray = conAliveStateArray?.length
            ? Lang.getFormattedText(LangTextType.F0099, conAliveStateArray.map(v => Lang.getPlayerAliveStateName(v)).join(`/`))
            : null;

        const conCoUsingSkillTypeArray          = data.conCoUsingSkillTypeArray;
        const textForConCoUsingSkillTypeArray   = conCoUsingSkillTypeArray?.length
            ? Lang.getFormattedText(LangTextType.F0102, conCoUsingSkillTypeArray.map(v => Lang.getCoSkillTypeName(v)).join(`/`))
            : null;

        const conFund           = data.conFund;
        const conFundComparator = data.conFundComparator;
        const textForConFund    = conFund != null
            ? Lang.getFormattedText(
                LangTextType.F0100,
                conFundComparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(conFundComparator) ?? CommonConstants.ErrorTextForUndefined),
                conFund
            )
            : null;

        const conEnergyPercentage           = data.conEnergyPercentage;
        const conEnergyPercentageComparator = data.conEnergyPercentageComparator;
        const textForConEnergyPercentage    = conEnergyPercentage != null
            ? Lang.getFormattedText(
                LangTextType.F0101,
                conEnergyPercentageComparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(conEnergyPercentageComparator) ?? CommonConstants.ErrorTextForUndefined),
                conEnergyPercentage
            )
            : null;

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForConIsPlayerInTurn,
            textForConIsSkipTurn,
            textForConAliveStateArray,
            textForConCoUsingSkillTypeArray,
            textForConFund,
            textForConEnergyPercentage,
        ]);

        const actAliveState         = data.actAliveState;
        const textForActAliveState  = actAliveState != null
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0784), Lang.getPlayerAliveStateName(actAliveState))
            : null;

        const actIsSkipTurn         = data.actIsSkipTurn;
        const textForActIsSkipTurn  = actIsSkipTurn == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0979), Lang.getText(actIsSkipTurn ? LangTextType.B0012 : LangTextType.B0013));

        const actFundDeltaValue             = data.actFundDeltaValue ?? 0;
        const actFundMultiplierPercentage   = data.actFundMultiplierPercentage ?? 100;
        const textForActFund                = ((actFundDeltaValue !== 0) || (actFundMultiplierPercentage !== 100))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0032), actFundMultiplierPercentage, actFundDeltaValue)
            : null;

        const actCoEnergyDeltaPct           = data.actCoEnergyDeltaPct ?? 0;
        const actCoEnergyMultiplierPct      = data.actCoEnergyMultiplierPct ?? 100;
        const textForActCoEnergy            = ((actCoEnergyDeltaPct !== 0) || (actCoEnergyMultiplierPct !== 100))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0809), actCoEnergyMultiplierPct, `${actCoEnergyDeltaPct}%`)
            : null;

        const textArrayForModifiers = Helpers.getNonNullElements([
            textForActAliveState,
            textForActIsSkipTurn,
            textForActFund,
            textForActCoEnergy,
        ]);

        return `${Lang.getFormattedText(
            LangTextType.F0126,
            textForConPlayerIndexArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
        )} ${textArrayForModifiers.join(` `)}`;
    }
    function getDescForWeaSetUnitState(data: Types.Undefinable<WarEvent.IWeaSetUnitState>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const unitTypeArray         = data.conUnitTypeArray;
        const textForUnitType       = unitTypeArray?.length
            ? unitTypeArray.map(v => Lang.getUnitName(v, gameConfig)).join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0805));

        const teamIndexArray        = data.conTeamIndexArray;
        const textForTeamIndex      = teamIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`/`))
            : null;

        const playerIndexArray      = data.conPlayerIndexArray;
        const textForPlayerIndex    = playerIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0115, playerIndexArray.map(v => `P${v}`).join(`/`))
            : null;

        const conIsOwnerPlayerInTurn        = data.conIsOwnerPlayerInTurn;
        const textForConIsOwnerPlayerInTurn = conIsOwnerPlayerInTurn == null
            ? null
            : Lang.getText(conIsOwnerPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const conIsDiving           = data.conIsDiving;
        const textForConIsDiving    = conIsDiving == null
            ? null
            : Lang.getText(conIsDiving ? LangTextType.B0927 : LangTextType.B0928);

        const locationIdArray       = data.conLocationIdArray;
        const textForLocation       = locationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0116, locationIdArray.join(`/`))
            : null;

        const gridIndexArray        = data.conGridIndexArray;
        const textForGridIndex      = gridIndexArray?.length
            ? Lang.getFormattedText(LangTextType.F0117, gridIndexArray.map(v => `(${v.x},${v.y})`).join(`/`))
            : null;

        const actionStateArray      = data.conActionStateArray;
        const textForActionState    = actionStateArray?.length
            ? Lang.getFormattedText(LangTextType.F0118, actionStateArray.map(v => Lang.getUnitActionStateText(v)).join(`/`))
            : null;

        const hasLoadedCo           = data.conHasLoadedCo;
        const textForHasLoadedCo    = hasLoadedCo != null
            ? Lang.getText(hasLoadedCo ? LangTextType.A0270 : LangTextType.A0271)
            : null;

        const conHp                 = data.conHp;
        const conHpComparator       = data.conHpComparator;
        const textForConHp          = conHp != null
            ? Lang.getFormattedText(LangTextType.F0120, conHpComparator != null ? Lang.getValueComparatorName(conHpComparator) : CommonConstants.ErrorTextForUndefined, conHp)
            : null;

        const conFuelPct            = data.conFuelPct;
        const conFuelPctComparator  = data.conFuelPctComparator;
        const textForConFuelPct     = conFuelPct != null
            ? Lang.getFormattedText(LangTextType.F0121, conFuelPctComparator != null ? Lang.getValueComparatorName(conFuelPctComparator) : CommonConstants.ErrorTextForUndefined, conFuelPct)
            : null;

        const conPriAmmoPct             = data.conPriAmmoPct;
        const conPriAmmoPctComparator   = data.conPriAmmoPctComparator;
        const textForConPriAmmoPct      = conPriAmmoPct != null
            ? Lang.getFormattedText(LangTextType.F0122, conPriAmmoPctComparator != null ? Lang.getValueComparatorName(conPriAmmoPctComparator) : CommonConstants.ErrorTextForUndefined, conPriAmmoPct)
            : null;

        const conPromotion              = data.conPromotion;
        const conPromotionComparator    = data.conPromotionComparator;
        const textForConPromotion       = conPromotion != null
            ? Lang.getFormattedText(LangTextType.F0123, conPromotionComparator != null ? Lang.getValueComparatorName(conPromotionComparator) : CommonConstants.ErrorTextForUndefined, conPromotion)
            : null;

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForTeamIndex,
            textForPlayerIndex,
            textForConIsOwnerPlayerInTurn,
            textForLocation,
            textForGridIndex,
            textForActionState,
            textForHasLoadedCo,
            textForConHp,
            textForConFuelPct,
            textForConPriAmmoPct,
            textForConPromotion,
            textForConIsDiving,
        ]);
        if (data.actDestroyUnit) {
            return Lang.getFormattedText(
                LangTextType.F0124,
                textForUnitType,
                textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
            );
        }

        const actUnitType           = data.actUnitType;
        const textForActUnitType    = actUnitType == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0525), Lang.getUnitName(actUnitType, gameConfig));

        const actPlayerIndex        = data.actPlayerIndex;
        const textForActPlayerIndex = actPlayerIndex == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0983), `P${actPlayerIndex}`);

        const actActionState        = data.actActionState;
        const textForActActionState = actActionState != null
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0526), Lang.getUnitActionStateText(actActionState))
            : null;

        const actHasLoadedCo        = data.actHasLoadedCo;
        const textForActHasLoadedCo = actHasLoadedCo != null
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0421), Lang.getText(actHasLoadedCo ? LangTextType.B0012 : LangTextType.B0013))
            : null;

        const actIsDiving           = data.actIsDiving;
        const textForActIsDiving    = actIsDiving == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0371), Lang.getText(actIsDiving ? LangTextType.B0012 : LangTextType.B0013));

        const hpMultiplierPercentage    = data.actHpMultiplierPercentage ?? 100;
        const hpDeltaValue              = data.actHpDeltaValue ?? 0;
        const textForHp                 = ((hpMultiplierPercentage !== 100) || (hpDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0807), hpMultiplierPercentage, hpDeltaValue)
            : null;

        const fuelMultiplierPercentage  = data.actFuelMultiplierPercentage ?? 100;
        const fuelDeltaValue            = data.actFuelDeltaValue ?? 0;
        const textForFuel               = ((fuelMultiplierPercentage !== 100) || (fuelDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0342), fuelMultiplierPercentage, fuelDeltaValue)
            : null;

        const priAmmoMultiplierPercentage   = data.actPriAmmoMultiplierPercentage ?? 100;
        const priAmmoDeltaValue             = data.actPriAmmoDeltaValue ?? 0;
        const textForPriAmmo                = ((priAmmoMultiplierPercentage !== 100) || (priAmmoDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0350), priAmmoMultiplierPercentage, priAmmoDeltaValue)
            : null;

        const promotionMultiplierPercentage = data.actPromotionMultiplierPercentage ?? 100;
        const promotionDeltaValue           = data.actPromotionDeltaValue ?? 0;
        const textForPromotion              = ((promotionMultiplierPercentage !== 100) || (promotionDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0370), promotionMultiplierPercentage, promotionDeltaValue)
            : null;

        const textArrayForModifiers = Helpers.getNonNullElements([
            textForActUnitType,
            textForActPlayerIndex,
            textForActActionState,
            textForActHasLoadedCo,
            textForActIsDiving,
            textForHp,
            textForFuel,
            textForPriAmmo,
            textForPromotion,
        ]);
        return `${Lang.getFormattedText(
            LangTextType.F0114,
            textForUnitType,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
        )} ${textArrayForModifiers.join(` `)}`;
    }
    function getDescForWeaSetTileType(data: Types.Undefinable<WarEvent.IWeaSetTileType>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const conTileTypeArray          = data.conTileTypeArray ?? [];
        const textForConTileTypeArray   = conTileTypeArray.length
            ? Lang.getFormattedText(LangTextType.F0142, conTileTypeArray.map(v => Lang.getTileName(v, gameConfig)).join(`/`))
            : null;

        const conGridIndexArray         = data.conGridIndexArray;
        const textForConGridIndexArray  = conGridIndexArray?.length
            ? conGridIndexArray.map(v => `(${v.x},${v.y})`).join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0531));

        const conLocationIdArray    = data.conLocationIdArray;
        const textForConLocation    = conLocationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0116, conLocationIdArray.join(`/`))
            : null;

        const conIsHighlighted          = data.conIsHighlighted;
        const textForConIsHighlighted   = conIsHighlighted == null
            ? null
            : Lang.getText(conIsHighlighted ? LangTextType.B0848 : LangTextType.B0849);

        const conPlayerIndexArray           = data.conPlayerIndexArray;
        const textForConPlayerIndexArray    = !conPlayerIndexArray?.length
            ? null
            : Lang.getFormattedText(LangTextType.F0115, conPlayerIndexArray.map(v => `P${v}`).join(`/`));

        const conIsOwnerPlayerInTurn        = data.conIsOwnerPlayerInTurn;
        const textForConIsOwnerPlayerInTurn = conIsOwnerPlayerInTurn == null
            ? null
            : Lang.getText(conIsOwnerPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForConTileTypeArray,
            textForConLocation,
            textForConPlayerIndexArray,
            textForConIsOwnerPlayerInTurn,
            textForConIsHighlighted,
        ]);

        const actDestroyUnit        = data.actDestroyUnit;
        const textForActDestroyUnit = actDestroyUnit
            ? Lang.getText(LangTextType.A0284)
            : null;

        const actTileData               = data.actTileData;
        const actTileBaseType           = actTileData?.baseType;
        const actTileObjectType         = actTileData?.objectType;
        const actIsModifyTileBase       = (data.actIsModifyTileBase) || (data.actIsModifyTileBase == null);
        const actIsModifyTileDecorator  = (data.actIsModifyTileDecorator) || (data.actIsModifyTileDecorator == null);
        const actIsModifyTileObject     = (data.actIsModifyTileObject) || (data.actIsModifyTileObject == null);
        const actTileType               = (actIsModifyTileBase || actIsModifyTileDecorator || actIsModifyTileObject) && (actTileBaseType != null) && (actTileObjectType != null)
            ? gameConfig.getTileType(actTileBaseType, actTileObjectType)
            : null;
        const textForActTileData    = actTileType != null
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0718), Lang.getTileName(actTileType, gameConfig))
            : null;

        const actIsHighlighted          = actTileData?.isHighlighted;
        const textForActIsHighlighted   = actIsHighlighted == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0847), Lang.getText(actIsHighlighted ? LangTextType.B0012 : LangTextType.B0013));

        const textArrayForModifiers = Helpers.getNonNullElements([
            textForActTileData,
            textForActDestroyUnit,
            textForActIsHighlighted,
        ]);
        return `${Lang.getFormattedText(
            LangTextType.F0129,
            textForConGridIndexArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
        )} ${textArrayForModifiers.join(` `)}`;
    }
    function getDescForWeaSetTileState(data: Types.Undefinable<WarEvent.IWeaSetTileState>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const conGridIndexArray         = data.conGridIndexArray;
        const textForConGridIndexArray  = conGridIndexArray?.length
            ? conGridIndexArray.map(v => `(${v.x},${v.y})`).join(`/`)
            : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0531));

        const conLocationIdArray    = data.conLocationIdArray;
        const textForConLocation    = conLocationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0116, conLocationIdArray.join(`/`))
            : null;

        const conTileTypeArray          = data.conTileTypeArray ?? [];
        const textForConTileTypeArray   = conTileTypeArray.length
            ? Lang.getFormattedText(LangTextType.F0142, conTileTypeArray.map(v => Lang.getTileName(v, gameConfig)).join(`/`))
            : null;

        const conIsHighlighted          = data.conIsHighlighted;
        const textForConIsHighlighted   = conIsHighlighted == null
            ? null
            : Lang.getText(conIsHighlighted ? LangTextType.B0848 : LangTextType.B0849);

        const conPlayerIndexArray           = data.conPlayerIndexArray;
        const textForConPlayerIndexArray    = !conPlayerIndexArray?.length
            ? null
            : Lang.getFormattedText(LangTextType.F0115, conPlayerIndexArray.map(v => `P${v}`).join(`/`));

        const conIsOwnerPlayerInTurn        = data.conIsOwnerPlayerInTurn;
        const textForConIsOwnerPlayerInTurn = conIsOwnerPlayerInTurn == null
            ? null
            : Lang.getText(conIsOwnerPlayerInTurn ? LangTextType.B0925 : LangTextType.B0926);

        const conHp         = data.conHp;
        const textForConHp  = conHp == null
            ? null
            : Lang.getFormattedText(LangTextType.F0120, conHp.comparator != null ? Lang.getValueComparatorName(conHp.comparator) : CommonConstants.ErrorTextForUndefined, conHp.value);

        const conCapturePoint           = data.conCapturePoint;
        const textForConCapturePoint    = conCapturePoint == null
            ? null
            : Lang.getFormattedText(LangTextType.F0139, conCapturePoint.comparator != null ? Lang.getValueComparatorName(conCapturePoint.comparator) : CommonConstants.ErrorTextForUndefined, conCapturePoint.value);

        const conBuildPoint         = data.conBuildPoint;
        const textForConBuildPoint  = conBuildPoint == null
            ? null
            : Lang.getFormattedText(LangTextType.F0140, conBuildPoint.comparator != null ? Lang.getValueComparatorName(conBuildPoint.comparator) : CommonConstants.ErrorTextForUndefined, conBuildPoint.value);

        const textArrayForSubConditions = Helpers.getNonNullElements([
            textForConLocation,
            textForConTileTypeArray,
            textForConPlayerIndexArray,
            textForConIsOwnerPlayerInTurn,
            textForConIsHighlighted,
            textForConHp,
            textForConCapturePoint,
            textForConBuildPoint,
        ]);

        const actHpMultiplierPercentage = data.actHpMultiplierPercentage ?? 100;
        const actHpDeltaValue           = data.actHpDeltaValue ?? 0;
        const textForActHp              = ((actHpMultiplierPercentage !== 100) || (actHpDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0807), actHpMultiplierPercentage, actHpDeltaValue)
            : null;

        const actCapturePointMultiplierPercentage   = data.actCapturePointMultiplierPercentage ?? 100;
        const actCapturePointDeltaValue             = data.actCapturePointDeltaValue ?? 0;
        const textForActCapturePoint                = ((actCapturePointMultiplierPercentage !== 100) || (actCapturePointDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0361), actCapturePointMultiplierPercentage, actCapturePointDeltaValue)
            : null;

        const actBuildPointMultiplierPercentage = data.actBuildPointMultiplierPercentage ?? 100;
        const actBuildPointDeltaValue           = data.actBuildPointDeltaValue ?? 0;
        const textForActBuildPoint              = ((actBuildPointMultiplierPercentage !== 100) || (actBuildPointDeltaValue !== 0))
            ? Lang.getFormattedText(LangTextType.F0119, Lang.getText(LangTextType.B0362), actBuildPointMultiplierPercentage, actBuildPointDeltaValue)
            : null;

        const actAddLocationIdArray         = data.actAddLocationIdArray;
        const textForActAddLocationIdArray  = actAddLocationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0759), actAddLocationIdArray.join(`/`))
            : null;

        const actDeleteLocationIdArray          = data.actDeleteLocationIdArray;
        const textForActDeleteLocationIdArray   = actDeleteLocationIdArray?.length
            ? Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0760), actDeleteLocationIdArray.join(`/`))
            : null;

        const actIsHighlighted          = data.actIsHighlighted;
        const textForActIsHighlighted   = actIsHighlighted == null
            ? null
            : Lang.getFormattedText(LangTextType.F0125, Lang.getText(LangTextType.B0847), Lang.getText(actIsHighlighted ? LangTextType.B0012 : LangTextType.B0013));

        const textArrayForModifiers = Helpers.getNonNullElements([
            textForActHp,
            textForActCapturePoint,
            textForActBuildPoint,
            textForActAddLocationIdArray,
            textForActDeleteLocationIdArray,
            textForActIsHighlighted,
        ]);
        return `${Lang.getFormattedText(
            LangTextType.F0128,
            textForConGridIndexArray,
            textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang.getText(LangTextType.B0783)}${v}`).join(``) : ``,
        )} ${textArrayForModifiers.join(` `)}`;
    }
    function getDescForWeaPersistentShowText(data: Types.Undefinable<WarEvent.IWeaPersistentShowText>): string | null {
        if (data == null) {
            return null;
        }

        const rawText = Lang.getLanguageText({ textArray: data.textArray });
        if (rawText == null) {
            return Lang.getFormattedText(LangTextType.F0131, CommonConstants.ErrorTextForUndefined);
        } else {
            return Lang.getFormattedText(LangTextType.F0131, rawText.length > 20 ? `${rawText?.substring(0, 20)}...` : rawText);
        }
    }
    function getDescForWeaPersistentModifyPlayerAttribute(data: Types.Undefinable<WarEvent.IWeaPersistentModifyPlayerAttribute>, gameConfig: GameConfig): string | null {
        if (data == null) {
            return null;
        }

        const conPlayerIndexArray           = data.conPlayerIndexArray;
        const textForConPlayerIndexArray    = conPlayerIndexArray?.length
            ? conPlayerIndexArray.map(v => `P${v}`).join(`/`)
            : Lang.getText(LangTextType.B0766);

        const actCanActivateCoSkill         = data.actCanActivateCoSkill;
        const textForActCanActivateCoSkill  = actCanActivateCoSkill == false
            ? Lang.getText(LangTextType.A0309)
            : null;

        const actBannedUnitTypeArray        = data.actBannedUnitTypeArray;
        const textForActBannedUnitTypeArray = actBannedUnitTypeArray?.length
            ? Lang.getFormattedText(LangTextType.F0137, actBannedUnitTypeArray.map(v => Lang.getUnitName(v, gameConfig)).join(`/`))
            : null;

        const textArrayForModifiers = Helpers.getNonNullElements([
            textForActCanActivateCoSkill,
            textForActBannedUnitTypeArray,
        ]);
        return `${Lang.getFormattedText(
            LangTextType.F0136,
            textForConPlayerIndexArray,
        )} ${textArrayForModifiers.join(` `)}`;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // error tips
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorTipForEvent(fullData: IWarEventFullData, event: IWarEvent): string | null {
        const eventsCount = (fullData.eventArray || []).length;
        if (eventsCount > CommonConstants.WarEventMaxEventsPerMap) {
            return `${Lang.getText(LangTextType.A0182)} (${eventsCount}/${CommonConstants.WarEventMaxEventsPerMap})`;
        }

        const actionsCount = (event.actionIdArray || []).length;
        if (actionsCount < 1) {
            return Lang.getText(LangTextType.A0167);
        }
        if (actionsCount > CommonConstants.WarEventMaxActionsPerEvent) {
            return `${Lang.getText(LangTextType.A0180)} (${actionsCount}/${CommonConstants.WarEventMaxActionsPerEvent})`;
        }

        const nodeId = event.conditionNodeId;
        if (nodeId == null) {
            return Lang.getText(LangTextType.A0159);
        }

        return null;
    }

    export function getErrorTipForEventCallCountInPlayerTurn(event: IWarEvent): string | null {
        const count = event.maxCallCountInPlayerTurn;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountInPlayerTurn)) {
            return Lang.getText(LangTextType.A0181);
        }

        return null;
    }

    export function getErrorTipForEventCallCountTotal(event: IWarEvent): string | null {
        const count = event.maxCallCountTotal;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountTotal)) {
            return Lang.getText(LangTextType.A0181);
        }

        return null;
    }

    export function getErrorTipForConditionNode(fullData: IWarEventFullData, node: IWarEventConditionNode): string | null {
        const nodesCount = (fullData.conditionNodeArray || []).length;
        if (nodesCount > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return `${Lang.getText(LangTextType.A0183)} (${nodesCount}/${CommonConstants.WarEventMaxConditionNodesPerMap})`;
        }

        if (((node.subNodeIdArray || []).length) + ((node.conditionIdArray || []).length) <= 0) {
            return Lang.getText(LangTextType.A0161);
        }

        const nodeId            = Helpers.getExisted(node.nodeId);
        const duplicatedNodeId  = getDuplicatedSubNodeId(fullData, nodeId);
        if (duplicatedNodeId != null) {
            return Lang.getFormattedText(LangTextType.F0061, `N${duplicatedNodeId}`);
        }

        const duplicatedConditionId = getDuplicatedConditionId(fullData, nodeId);
        if (duplicatedConditionId != null) {
            return Lang.getFormattedText(LangTextType.F0062, `C${duplicatedConditionId}`);
        }

        return null;
    }

    export function getErrorTipForCondition(fullData: IWarEventFullData, condition: IWarEventCondition, war: BwWar): string | null {
        const conditionsCount = (fullData.conditionArray || []).length;
        if (conditionsCount > CommonConstants.WarEventMaxConditionsPerMap) {
            return `${Lang.getText(LangTextType.A0185)} (${conditionsCount}/${CommonConstants.WarEventMaxConditionsPerMap})`;
        }

        if (Object.keys(condition).length !== 2) {
            return Lang.getText(LangTextType.A0187);
        }

        // todo add more tips for the future conditions.
        if      (condition.WecEventCalledCount)                 { return getErrorTipForWecEventCalledCount(condition.WecEventCalledCount, fullData); }
        else if (condition.WecPlayerPresence)                   { return getErrorTipForWecPlayerPresence(condition.WecPlayerPresence, war); }
        else if (condition.WecTurnAndPlayer)                    { return getErrorTipForWecTurnAndPlayer(condition.WecTurnAndPlayer, war); }
        else if (condition.WecWeatherAndFog)                    { return getErrorTipForWecWeatherAndFog(condition.WecWeatherAndFog, war); }
        else if (condition.WecTilePresence)                     { return getErrorTipForWecTilePresence(condition.WecTilePresence, war); }
        else if (condition.WecUnitPresence)                     { return getErrorTipForWecUnitPresence(condition.WecUnitPresence, war); }
        else if (condition.WecCustomCounter)                    { return getErrorTipForWecCustomCounter(condition.WecCustomCounter); }
        else if (condition.WecOngoingPersistentActionPresence)  { return getErrorTipForWecOngoingPersistentActionPresence(condition.WecOngoingPersistentActionPresence); }
        else if (condition.WecManualActionStatistics)           { return getErrorTipForWecManualActionStatistics(condition.WecManualActionStatistics, war); }
        else                                                    { return Lang.getText(LangTextType.A0187); }
    }
    function getErrorTipForWecEventCalledCount(data: WarEvent.IWecEventCalledCount, fullData: IWarEventFullData): string | null {
        if (data.eventsCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0788));
        }

        {
            const comparator = data.eventsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        if (data.eventIdArray?.some(eventId => !fullData.eventArray?.some(v => eventId === v.eventId))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0462));
        }

        {
            const comparator = data.timesTotalComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.timesInTurnComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        return null;
    }
    function getErrorTipForWecPlayerPresence(data: WarEvent.IWecPlayerPresence, war: BwWar): string | null {
        if (data.playersCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0229));
        }

        {
            const comparator = data.playersCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.playerIndexArray?.some(v => (v < CommonConstants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
        }

        if (data.aliveStateArray?.some(v => !ConfigManager.checkIsValidPlayerAliveState(v))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0784));
        }

        {
            const comparator = data.fundComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.energyPercentageComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        if (data.coUsingSkillTypeArray?.some(v => !ConfigManager.checkIsValidCoSkillType(v))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0785));
        }

        const gameConfig = war.getGameConfig();
        {
            const coCategoryIdArray = data.coCategoryIdArray;
            if ((coCategoryIdArray) && (!gameConfig.checkIsValidCoCategoryIdSubset(coCategoryIdArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0425));
            }
        }

        return null;
    }
    function getErrorTipForWecTurnAndPlayer(data: WarEvent.IWecTurnAndPlayer, war: BwWar): string | null {
        {
            const comparator = data.turnIndexComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const divider   = data.turnIndexDivider;
            const remainder = data.turnIndexRemainder;
            if (divider == null) {
                if (remainder != null) {
                    return Lang.getText(LangTextType.A0265);
                }
            } else {
                if ((divider <= 1) || (remainder == null)) {
                    return Lang.getText(LangTextType.A0265);
                }
            }

            const comparator = data.turnIndexRemainderComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const turnPhase = data.turnPhase;
            if ((turnPhase != null) && (!ConfigManager.checkIsValidTurnPhaseCode(turnPhase))) {
                return Lang.getText(LangTextType.A0265);
            }
        }

        {
            const playersCountUnneutral = war.getPlayersCountUnneutral();
            if (data.playerIndexArray?.some(v => (v < CommonConstants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        return null;
    }
    function getErrorTipForWecWeatherAndFog(data: WarEvent.IWecWeatherAndFog, war: BwWar): string | null {
        const gameConfig = war.getGameConfig();
        {
            const weatherTypeArray = data.weatherTypeArray;
            if ((weatherTypeArray?.length) && (weatherTypeArray.some(v => !gameConfig.checkIsValidWeatherType(v)))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0705));
            }
        }

        return null;
    }
    function getErrorTipForWecTilePresence(data: WarEvent.IWecTilePresence, war: BwWar): string | null {
        if (data.tilesCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0778));
        }

        const comparator = data.tilesCountComparator;
        if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
        }

        if (data.locationIdArray?.some(v => (v > CommonConstants.MapMaxLocationId) || (v < CommonConstants.MapMinLocationId))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0764));
        }

        const mapSize = war.getTileMap().getMapSize();
        for (const g of data.gridIndexArray ?? []) {
            const gridIndex = GridIndexHelpers.convertGridIndex(g);
            if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0531));
            }
        }

        {
            const tileTypeArray = data.tileTypeArray;
            if ((tileTypeArray) && (!war.getGameConfig().checkIsValidTileTypeSubset(tileTypeArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0718));
            }
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.playerIndexArray?.some(v => (v < CommonConstants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
        }
        if (data.teamIndexArray?.some(v => (v < CommonConstants.TeamIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0377));
        }

        return null;
    }
    function getErrorTipForWecUnitPresence(data: WarEvent.IWecUnitPresence, war: BwWar): string | null {
        if (data.unitsCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0773));
        }

        {
            const comparator = data.unitsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        if (data.locationIdArray?.some(v => (v > CommonConstants.MapMaxLocationId) || (v < CommonConstants.MapMinLocationId))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0764));
        }

        const mapSize = war.getTileMap().getMapSize();
        for (const g of data.gridIndexArray ?? []) {
            const gridIndex = GridIndexHelpers.convertGridIndex(g);
            if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0531));
            }
        }

        const gameConfig = war.getGameConfig();
        if (data.unitTypeArray?.some(v => !gameConfig.checkIsValidUnitType(v))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0525));
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.playerIndexArray?.some(v => (v < CommonConstants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
        }
        if (data.teamIndexArray?.some(v => (v < CommonConstants.TeamIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0377));
        }

        {
            const actionStateArray = data.actionStateArray;
            if ((actionStateArray) && (!ConfigManager.checkIsValidUnitActionStateSubset(actionStateArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0526));
            }
        }

        {
            const comparator = data.hpComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.fuelPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.priAmmoPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.promotionComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        return null;
    }
    function getErrorTipForWecCustomCounter(data: WarEvent.IWecCustomCounter): string | null {
        if (data.counterCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0801));
        }

        {
            const comparator = data.counterCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.valueComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const divider   = data.valueDivider;
            const remainder = data.valueRemainder;
            if (divider == null) {
                if (remainder != null) {
                    return Lang.getText(LangTextType.A0265);
                }
            } else {
                if ((divider <= 1) || (remainder == null)) {
                    return Lang.getText(LangTextType.A0265);
                }
            }
        }

        {
            const comparator = data.valueRemainderComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        return null;
    }
    function getErrorTipForWecOngoingPersistentActionPresence(data: WarEvent.IWecOngoingPersistentActionPresence): string | null {
        if (data.ongoingActionsCount == null) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0902));
        }

        {
            const comparator = data.ongoingActionsCountComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const actionIdArray = data.ongoingActionIdArray;
            if ((actionIdArray) && (!ConfigManager.checkIsValidWarEventActionIdSubset(actionIdArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0889));
            }
        }

        return null;
    }
    function getErrorTipForWecManualActionStatistics(data: WarEvent.IWecManualActionStatistics, war: BwWar): string | null {
        {
            const playerIndexArray = data.playerIndexArray;
            if ((playerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(playerIndexArray, war.getPlayersCountUnneutral()))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        {
            const totalActions = data.totalActions;
            if ((totalActions == null) || (totalActions.value == null)) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0902));
            }
            if (!ConfigManager.checkIsValidValueComparator(totalActions.comparator)) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        return null;
    }

    export function getErrorTipForAction(fullData: IWarEventFullData, action: IWarEventAction, war: BwWar): string | null {
        const actionsCountTotal = (fullData.actionArray || []).length;
        if (actionsCountTotal > CommonConstants.WarEventMaxActionsPerMap) {
            return `${Lang.getText(LangTextType.A0184)} (${actionsCountTotal}/${CommonConstants.WarEventMaxActionsPerMap})`;
        }

        if (Object.keys(action).length !== 2) {
            return Lang.getText(LangTextType.A0177);
        }

        const actionId = action.WeaCommonData?.actionId;
        if ((actionId == null) || (!ConfigManager.checkIsValidWarEventActionId(actionId))) {
            return Lang.getText(LangTextType.A0177);
        }

        // todo: add more tips for the future actions.
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        const gameConfig            = war.getGameConfig();
        if      (action.WeaAddUnit)                         { return getErrorTipForWeaAddUnit(action.WeaAddUnit, war); }
        else if (action.WeaDialogue)                        { return getErrorTipForWeaDialogue(action.WeaDialogue, war); }
        else if (action.WeaSetViewpoint)                    { return getErrorTipForWeaSetViewpoint(action.WeaSetViewpoint, war); }
        else if (action.WeaSetWeather)                      { return getErrorTipForWeaSetWeather(action.WeaSetWeather, war); }
        else if (action.WeaSimpleDialogue)                  { return getErrorTipForWeaSimpleDialogue(action.WeaSimpleDialogue, war); }
        else if (action.WeaPlayBgm)                         { return getErrorTipForWeaPlayBgm(action.WeaPlayBgm, gameConfig); }
        else if (action.WeaSetForceFogCode)                 { return getErrorTipForWeaSetForceFogCode(action.WeaSetForceFogCode); }
        else if (action.WeaSetCustomCounter)                { return getErrorTipForWeaSetCustomCounter(action.WeaSetCustomCounter); }
        else if (action.WeaStopPersistentAction)            { return getErrorTipForWeaStopPersistentAction(action.WeaStopPersistentAction, fullData); }
        else if (action.WeaSetPlayerState)                  { return getErrorTipForWeaSetPlayerState(action.WeaSetPlayerState, playersCountUnneutral); }
        else if (action.WeaSetUnitState)                    { return getErrorTipForWeaSetUnitState(action.WeaSetUnitState, war); }
        else if (action.WeaSetTileType)                     { return getErrorTipForWeaSetTileType(action.WeaSetTileType, war); }
        else if (action.WeaSetTileState)                    { return getErrorTipForWeaSetTileState(action.WeaSetTileState, war); }
        else if (action.WeaPersistentShowText)              { return getErrorTipForWeaPersistentShowText(action.WeaPersistentShowText); }
        else if (action.WeaPersistentModifyPlayerAttribute) { return getErrorTipForWeaPersistentModifyPlayerAttribute(action.WeaPersistentModifyPlayerAttribute, war, playersCountUnneutral); }
        else {
            return Lang.getText(LangTextType.A0177);
        }
    }
    function getErrorTipForWeaAddUnit(data: WarEvent.IWeaAddUnit, war: BwWar): string | null {
        const unitArray     = data.unitArray || [];
        const unitsCount    = unitArray.length;
        if ((unitsCount <= 0) || (unitsCount > CommonConstants.WarEventActionAddUnitMaxCount)) {
            return `${Lang.getText(LangTextType.A0191)} (${unitsCount} / ${CommonConstants.WarEventActionAddUnitMaxCount})`;
        }

        const mapSize               = war.getTileMap().getMapSize();
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        const validator             = (v: CommonProto.WarEvent.WeaAddUnit.IDataForAddUnit) => {
            const unitData = Helpers.getExisted(v.unitData);
            return (v.canBeBlockedByUnit != null)
                && (v.needMovableTile != null)
                && (unitData.loaderUnitId == null)
                && (!WarHelpers.WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    playersCountUnneutral,
                    gameConfig: war.getGameConfig(),
                }));
        };
        if (!unitArray.every(validator)) {
            return Lang.getText(LangTextType.A0169);
        }

        return null;
    }
    function getErrorTipForWeaDialogue(data: WarEvent.IWeaDialogue, war: BwWar): string | null {
        const backgroundId = data.backgroundId;
        if ((backgroundId != null) && (backgroundId > war.getGameConfig().getSystemCfg().dialogueBackgroundMaxId)) {
            return Lang.getText(LangTextType.A0258);
        }

        const dialoguesArray    = data.dataArray || [];
        const dialoguesCount    = dialoguesArray.length;
        if ((dialoguesCount <= 0) || (dialoguesCount > CommonConstants.WarEventActionDialogueMaxCount)) {
            return `${Lang.getText(LangTextType.A0227)} (${dialoguesCount} / ${CommonConstants.WarEventActionDialogueMaxCount})`;
        }

        const gameConfig = war.getGameConfig();
        for (let i = 0; i < dialoguesCount; ++i) {
            if (getErrorTipForWeaDialogueData(dialoguesArray[i], gameConfig)) {
                return Lang.getFormattedText(LangTextType.F0071, i);
            }
        }

        return null;
    }
    function getErrorTipForWeaSetViewpoint(data: WarEvent.IWeaSetViewpoint, war: BwWar): string | null {
        const gridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
        if (gridIndex == null) {
            return Lang.getText(LangTextType.A0250);
        }

        if (!GridIndexHelpers.checkIsInsideMap(gridIndex, war.getTileMap().getMapSize())) {
            return Lang.getText(LangTextType.A0251);
        }

        return null;
    }
    function getErrorTipForWeaSetWeather(data: WarEvent.IWeaSetWeather, war: BwWar): string | null {
        const weatherType = data.weatherType;
        if ((weatherType == null) || (!war.getGameConfig().checkIsValidWeatherType(weatherType))) {
            return Lang.getText(LangTextType.A0252);
        }

        if (data.weatherTurnsCount == null) {
            return Lang.getText(LangTextType.A0253);
        }

        return null;
    }
    export function getErrorTipForWeaDialogueData(dialogueData: WarEvent.WeaDialogue.IDataForDialogue, gameConfig: GameConfig): string | null {
        if (Object.keys(dialogueData).length !== 1) {
            return Lang.getText(LangTextType.A0230);
        }

        {
            const dataForCoDialogue = dialogueData.dataForCoDialogue;
            if (dataForCoDialogue) {
                const { coId, side, textArray, nameArray } = dataForCoDialogue;
                if ((coId == null)                                                                                          ||
                    (coId === CommonConstants.CoId.Empty)                                                                    ||
                    (gameConfig.getCoNameAndTierText(coId) == null)                                                         ||
                    ((side !== Types.WarEventActionDialogueSide.Left) && (side !== Types.WarEventActionDialogueSide.Right)) ||
                    (!Helpers.checkIsValidLanguageTextArray({
                        list            : textArray,
                        minTextCount    : 1,
                        minTextLength   : 1,
                        maxTextLength   : CommonConstants.WarEventActionDialogueTextMaxLength,
                    }))                                                                                                     ||
                    ((nameArray) && (!Helpers.checkIsValidLanguageTextArray({
                        list            : nameArray,
                        minTextCount    : 1,
                        minTextLength   : 1,
                        maxTextLength   : CommonConstants.WarEventActionDialogueNameMaxLength,
                    })))
                ) {
                    return Lang.getText(LangTextType.A0231);
                }

                return null;
            }
        }

        {
            const dataForAside = dialogueData.dataForAside;
            if (dataForAside) {
                if (!Helpers.checkIsValidLanguageTextArray({
                    list            : dataForAside.textArray,
                    minTextCount    : 1,
                    minTextLength   : 1,
                    maxTextLength   : CommonConstants.WarEventActionDialogueTextMaxLength,
                })) {
                    return Lang.getText(LangTextType.A0232);
                }

                return null;
            }
        }

        return Lang.getText(LangTextType.A0230);
    }
    function getErrorTipForWeaSimpleDialogue(data: WarEvent.IWeaSimpleDialogue, war: BwWar): string | null {
        const dialoguesArray    = data.dataArray || [];
        const dialoguesCount    = dialoguesArray.length;
        if ((dialoguesCount <= 0) || (dialoguesCount > CommonConstants.WarEventActionDialogueMaxCount)) {
            return `${Lang.getText(LangTextType.A0227)} (${dialoguesCount} / ${CommonConstants.WarEventActionDialogueMaxCount})`;
        }

        const gameConfig = war.getGameConfig();
        for (let i = 0; i < dialoguesCount; ++i) {
            if (getErrorTipForWeaSimpleDialogueData(dialoguesArray[i], gameConfig)) {
                return Lang.getFormattedText(LangTextType.F0071, i);
            }
        }

        return null;
    }
    function getErrorTipForWeaPlayBgm(data: WarEvent.IWeaPlayBgm, gameConfig: GameConfig): string | null {
        if (data.useCoBgm) {
            return null;
        }

        const bgmCode = data.bgmCode;
        return ((bgmCode == null) || (!gameConfig.checkIsBgm(bgmCode)))
            ? Lang.getText(LangTextType.A0263)
            : null;
    }
    function getErrorTipForWeaSetForceFogCode(data: WarEvent.IWeaSetForceFogCode): string | null {
        const forceFogCode = data.forceFogCode;
        if ((forceFogCode == null) || (!ConfigManager.checkIsValidForceFogCode(forceFogCode))) {
            return Lang.getText(LangTextType.A0264);
        }

        if (data.turnsCount == null) {
            return Lang.getText(LangTextType.A0253);
        }

        return null;
    }
    function getErrorTipForWeaSetCustomCounter(data: WarEvent.IWeaSetCustomCounter): string | null {
        const customCounterIdArray = data.customCounterIdArray;
        if ((customCounterIdArray)                                                                                                                                      &&
            ((customCounterIdArray.length !== new Set(customCounterIdArray).size) || (customCounterIdArray.some(v => !ConfigManager.checkIsValidCustomCounterId(v))))
        ) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0799));
        }

        const { deltaValue, multiplierPercentage } = data;
        if ((deltaValue ?? multiplierPercentage) == null) {
            return Lang.getText(LangTextType.A0264);
        }

        if (((deltaValue != null) && (Math.abs(deltaValue) > CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue))                             ||
            ((multiplierPercentage != null) && (Math.abs(multiplierPercentage) > CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage))
        ) {
            return Lang.getText(LangTextType.A0265);
        }

        return null;
    }
    function getErrorTipForWeaStopPersistentAction(data: WarEvent.IWeaStopPersistentAction, fullData: IWarEventFullData): string | null {
        const actionIdArray = data.actionIdArray;
        if ((actionIdArray == null) || (actionIdArray.length === 0)) {
            return Lang.getText(LangTextType.A0305);
        }

        if (actionIdArray.length !== new Set(actionIdArray).size) {
            return Lang.getText(LangTextType.A0306);
        }

        for (const actionId of actionIdArray) {
            const action = getAction(fullData, actionId);
            if ((action == null) || (!checkIsPersistentAction(action))) {
                return Lang.getText(LangTextType.A0307);
            }
        }

        return null;
    }
    function getErrorTipForWeaSetPlayerState(data: WarEvent.IWeaSetPlayerState, playersCountUnneutral: number): string | null {
        {
            const conPlayerIndexArray = data.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return `${Lang.getText(LangTextType.A0212)}`;
            }
        }

        {
            const conAliveStateArray = data.conAliveStateArray;
            if ((conAliveStateArray) && (!ConfigManager.checkIsValidPlayerAliveStateSubset(conAliveStateArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0784));
            }
        }

        {
            const conCoUsingSkillTypeArray = data.conCoUsingSkillTypeArray;
            if ((conCoUsingSkillTypeArray) && (!ConfigManager.checkIsValidCoSkillTypeSubset(conCoUsingSkillTypeArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0785));
            }
        }

        {
            const comparator = data.conFundComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.conEnergyPercentageComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const actAliveState = data.actAliveState;
            if ((actAliveState != null) && (!ConfigManager.checkIsValidPlayerAliveState(actAliveState))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0784));
            }
        }

        if ((data.actFundDeltaValue                 ??
                data.actFundMultiplierPercentage    ??
                data.actCoEnergyDeltaPct            ??
                data.actCoEnergyMultiplierPct       ??
                data.actAliveState
            ) == null
        ) {
            return Lang.getText(LangTextType.A0264);
        }

        return null;
    }
    function getErrorTipForWeaSetUnitState(data: WarEvent.IWeaSetUnitState, war: BwWar): string | null {
        const gameConfig = war.getGameConfig();
        {
            const locationIdArray = data.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0764));
            }
        }

        {
            const gridIndexArray = data.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, war.getTileMap().getMapSize()))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0531));
            }
        }

        if (data.conUnitTypeArray?.some(v => !gameConfig.checkIsValidUnitType(v))) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0525));
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        {
            const playerIndexArray = data.conPlayerIndexArray;
            if ((playerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        {
            const teamIndexArray = data.conTeamIndexArray;
            if ((teamIndexArray) && (!ConfigManager.checkIsValidTeamIndexSubset(teamIndexArray, playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0377));
            }
        }

        {
            const actionStateArray = data.conActionStateArray;
            if ((actionStateArray) && (!ConfigManager.checkIsValidUnitActionStateSubset(actionStateArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0526));
            }
        }

        {
            const comparator = data.conHpComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.conFuelPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.conPriAmmoPctComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const comparator = data.conPromotionComparator;
            if ((comparator == null) || (!ConfigManager.checkIsValidValueComparator(comparator))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0774));
            }
        }

        {
            const actActionState = data.actActionState;
            if ((actActionState != null) && (!ConfigManager.checkIsValidUnitActionState(actActionState))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0526));
            }
        }

        {
            const actUnitType = data.actUnitType;
            if ((actUnitType != null) && (!gameConfig.checkIsValidUnitType(actUnitType))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0525));
            }
        }

        {
            const actPlayerIndex = data.actPlayerIndex;
            if ((actPlayerIndex != null)                                                                                                                        &&
                ((!ConfigManager.checkIsValidPlayerIndex(actPlayerIndex, playersCountUnneutral)) || (actPlayerIndex === CommonConstants.PlayerIndex.Neutral))
            ) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        if ((data.actHpMultiplierPercentage             ??
                data.actHpDeltaValue                    ??
                data.actFuelDeltaValue                  ??
                data.actFuelMultiplierPercentage        ??
                data.actPriAmmoDeltaValue               ??
                data.actPriAmmoMultiplierPercentage     ??
                data.actPromotionDeltaValue             ??
                data.actPromotionMultiplierPercentage   ??
                data.actActionState                     ??
                data.actHasLoadedCo                     ??
                data.actIsDiving                        ??
                data.actUnitType                        ??
                data.actPlayerIndex                     ??
                (data.actDestroyUnit || null)
            ) == null
        ) {
            return Lang.getText(LangTextType.A0264);
        }

        return null;
    }
    function getErrorTipForWeaSetTileType(data: WarEvent.IWeaSetTileType, war: BwWar): string | null {
        {
            const locationIdArray = data.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0764));
            }
        }

        {
            const gridIndexArray = data.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, war.getTileMap().getMapSize()))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0531));
            }
        }

        {
            const conTileTypeArray = data.conTileTypeArray;
            if ((conTileTypeArray) && (!war.getGameConfig().checkIsValidTileTypeSubset(conTileTypeArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0718));
            }
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        {
            const conPlayerIndexArray = data.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        const actTileData = data.actTileData;
        if (actTileData == null) {
            return Lang.getText(LangTextType.A0264);
        }

        {
            const tileData      = Helpers.deepClone(actTileData);
            tileData.gridIndex  = { x: 0, y: 0 };

            const errorCode = (new BaseWar.BwTile()).getErrorCodeForTileData(tileData, playersCountUnneutral, war.getGameConfig());
            if (errorCode === ClientErrorCode.BwTile_GetErrorCodeForTileData_00) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            } else if (errorCode) {
                return Lang.getText(LangTextType.A0265);
            }
        }

        return null;
    }
    function getErrorTipForWeaSetTileState(data: WarEvent.IWeaSetTileState, war: BwWar): string | null {
        {
            const locationIdArray = data.conLocationIdArray;
            if ((locationIdArray) && (!ConfigManager.checkIsValidLocationIdSubset(locationIdArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0764));
            }
        }

        {
            const gridIndexArray = data.conGridIndexArray;
            if ((gridIndexArray) && (!ConfigManager.checkIsValidGridIndexSubset(gridIndexArray, war.getTileMap().getMapSize()))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0531));
            }
        }

        {
            const conTileTypeArray = data.conTileTypeArray;
            if ((conTileTypeArray) && (!war.getGameConfig().checkIsValidTileTypeSubset(conTileTypeArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0718));
            }
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        {
            const conPlayerIndexArray = data.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        {
            const conHp = data.conHp;
            if (conHp != null) {
                if (conHp.value == null) {
                    return Lang.getFormattedText(LangTextType.F0141, Lang.getText(LangTextType.B0807));
                }
                if (!ConfigManager.checkIsValidValueComparator(conHp.comparator)) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0774));
                }
            }
        }

        {
            const conBuildPoint = data.conBuildPoint;
            if (conBuildPoint != null) {
                if (conBuildPoint.value == null) {
                    return Lang.getFormattedText(LangTextType.F0141, Lang.getText(LangTextType.B0362));
                }
                if (!ConfigManager.checkIsValidValueComparator(conBuildPoint.comparator)) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0774));
                }
            }
        }

        {
            const conCapturePoint = data.conCapturePoint;
            if (conCapturePoint != null) {
                if (conCapturePoint.value == null) {
                    return Lang.getFormattedText(LangTextType.F0141, Lang.getText(LangTextType.B0361));
                }
                if (!ConfigManager.checkIsValidValueComparator(conCapturePoint.comparator)) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0774));
                }
            }
        }

        const actAddLocationIdArray = data.actAddLocationIdArray ?? [];
        if (!ConfigManager.checkIsValidLocationIdSubset(actAddLocationIdArray)) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0759));
        }

        const actDeleteLocationIdArray = data.actDeleteLocationIdArray ?? [];
        if (!ConfigManager.checkIsValidLocationIdSubset(actDeleteLocationIdArray)) {
            return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0760));
        }

        if (new Set(actAddLocationIdArray.concat(actDeleteLocationIdArray)).size !== actAddLocationIdArray.length + actDeleteLocationIdArray.length) {
            return Lang.getText(LangTextType.A0294);
        }

        if ((!actAddLocationIdArray?.length)                    &&
            (!actDeleteLocationIdArray?.length)                 &&
            (data.actBuildPointDeltaValue == null)              &&
            (data.actBuildPointMultiplierPercentage == null)    &&
            (data.actCapturePointDeltaValue == null)            &&
            (data.actCapturePointMultiplierPercentage == null)  &&
            (data.actHpDeltaValue == null)                      &&
            (data.actHpMultiplierPercentage == null)            &&
            (data.actIsHighlighted == null)
        ) {
            return Lang.getText(LangTextType.A0264);
        }

        return null;
    }
    function getErrorTipForWeaPersistentShowText(data: WarEvent.IWeaPersistentShowText): string | null {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : data.textArray,
            minTextCount    : 1,
            minTextLength   : 1,
            maxTextLength   : CommonConstants.WarEventActionPersistentShowTextMaxLength
        })) {
            return Lang.getText(LangTextType.A0308);
        }

        return null;
    }
    function getErrorTipForWeaPersistentModifyPlayerAttribute(data: WarEvent.IWeaPersistentModifyPlayerAttribute, war: BwWar, playersCountUnneutral: number): string | null {
        {
            const conPlayerIndexArray = data.conPlayerIndexArray;
            if ((conPlayerIndexArray) && (!ConfigManager.checkIsValidPlayerIndexSubset(conPlayerIndexArray, playersCountUnneutral))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0521));
            }
        }

        {
            const actBannedUnitTypeArray = data.actBannedUnitTypeArray;
            if ((actBannedUnitTypeArray?.length) && (!war.getGameConfig().checkIsValidUnitTypeSubset(actBannedUnitTypeArray))) {
                return Lang.getFormattedText(LangTextType.F0091, Lang.getText(LangTextType.B0525));
            }
        }

        return null;
    }
    export function getErrorTipForWeaSimpleDialogueData(dialogueData: WarEvent.WeaSimpleDialogue.IDataForDialogue, gameConfig: GameConfig): string | null {
        if (Object.keys(dialogueData).length !== 1) {
            return Lang.getText(LangTextType.A0230);
        }

        {
            const dataForCoDialogue = dialogueData.dataForCoDialogue;
            if (dataForCoDialogue) {
                const { coId, side, textArray, nameArray } = dataForCoDialogue;
                if ((coId == null)                                                                                          ||
                    (coId === CommonConstants.CoId.Empty)                                                                    ||
                    (gameConfig.getCoNameAndTierText(coId) == null)                                                         ||
                    ((side !== Types.WarEventActionDialogueSide.Left) && (side !== Types.WarEventActionDialogueSide.Right)) ||
                    (!Helpers.checkIsValidLanguageTextArray({
                        list            : textArray,
                        minTextCount    : 1,
                        minTextLength   : 1,
                        maxTextLength   : CommonConstants.WarEventActionDialogueTextMaxLength,
                    }))                                                                                                     ||
                    ((nameArray) && (!Helpers.checkIsValidLanguageTextArray({
                        list            : nameArray,
                        minTextCount    : 1,
                        minTextLength   : 1,
                        maxTextLength   : CommonConstants.WarEventActionDialogueNameMaxLength,
                    })))
                ) {
                    return Lang.getText(LangTextType.A0231);
                }

                return null;
            }
        }

        return Lang.getText(LangTextType.A0230);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // export function checkIsNodeUsedByEvent(fullData: IWarEventFullData, nodeId: number, eventId: number): boolean {
    //     const event = (fullData.eventArray || []).find(v => v.eventId === eventId);
    //     if (event == null) {
    //         return null;
    //     }

    //     if (event.conditionNodeId === nodeId) {
    //         return true;
    //     }

    //     const nodeArray     = fullData.conditionNodeArray || [];
    //     const nodeIdArray   = [event.conditionNodeId];
    //     for (const parentNodeId of nodeIdArray) {
    //         const node = nodeArray.find(v => v.nodeId === parentNodeId);
    //         for (const subNodeId of node ? node.subNodeIdArray || [] : []) {
    //             if (subNodeId === nodeId) {
    //                 return true;
    //             }
    //             if (nodeIdArray.indexOf(subNodeId) < 0) {
    //                 nodeIdArray.push(subNodeId);
    //             }
    //         }
    //     }

    //     return false;
    // }
    // function checkIsNodeDuplicatedInEvent(fullData: IWarEventFullData, nodeId: number, eventId: number): boolean {
    //     const event = (fullData.eventArray || []).find(v => v.eventId === eventId);
    //     if (event == null) {
    //         return null;
    //     }

    //     let isUsed          = event.conditionNodeId === nodeId;
    //     const nodeArray     = fullData.conditionNodeArray || [];
    //     const nodeIdArray   = [event.conditionNodeId];
    //     for (const parentNodeId of nodeIdArray) {
    //         const node = nodeArray.find(v => v.nodeId === parentNodeId);
    //         for (const subNodeId of node ? node.subNodeIdArray || [] : []) {
    //             if (subNodeId === nodeId) {
    //                 if (isUsed) {
    //                     return true;
    //                 } else {
    //                     isUsed = true;
    //                 }
    //             }
    //             nodeIdArray.push(subNodeId);
    //         }
    //     }

    //     return false;
    // }
    function getDuplicatedSubNodeId(fullData: IWarEventFullData, parentNodeId: number): number | null {
        const nodeIdArray   = [parentNodeId];
        const usedNodeIdSet = new Set<number>();
        for (const nodeId of nodeIdArray) {
            if (usedNodeIdSet.has(nodeId)) {
                return nodeId;
            }
            usedNodeIdSet.add(nodeId);

            const node = getNode(fullData, nodeId);
            nodeIdArray.push(...(node ? node.subNodeIdArray || [] : []));
        }
        return null;
    }
    // export function getNodeUsedCount(fullData: IWarEventFullData, nodeId: number): number {
    //     let count = 0;
    //     for (const event of fullData.eventArray || []) {
    //         if (event.conditionNodeId === nodeId) {
    //             ++count;
    //         }
    //     }
    //     for (const node of fullData.conditionNodeArray || []) {
    //         for (const subNodeId of node.subNodeIdArray || []) {
    //             if (subNodeId === nodeId) {
    //                 ++count;
    //             }
    //         }
    //     }
    //     return count;
    // }
    // function checkIsConditionDuplicatedInEvent(fullData: IWarEventFullData, conditionId: number, eventId: number): boolean {
    //     const event = (fullData.eventArray || []).find(v => v.eventId === eventId);
    //     if (event == null) {
    //         return null;
    //     }

    //     let isUsed          = false;
    //     const nodeArray     = fullData.conditionNodeArray || [];
    //     const nodeIdArray   = [event.conditionNodeId];
    //     for (const parentNodeId of nodeIdArray) {
    //         const node = nodeArray.find(v => v.nodeId === parentNodeId);
    //         if (node) {
    //             for (const conId of node.conditionIdArray || []) {
    //                 if (conId === conditionId) {
    //                     if (isUsed) {
    //                         return true;
    //                     } else {
    //                         isUsed = true;
    //                     }
    //                 }
    //             }
    //             for (const subNodeId of node.subNodeIdArray || []) {
    //                 nodeIdArray.push(subNodeId);
    //             }
    //         }
    //     }

    //     return false;
    // }
    function getDuplicatedConditionId(fullData: IWarEventFullData, parentNodeId: number): number | null {
        const nodeIdArray           = [parentNodeId];
        const usedConditionIdSet    = new Set<number>();
        for (const nodeId of nodeIdArray) {
            const node = getNode(fullData, nodeId);
            if (node) {
                nodeIdArray.push(...(node.subNodeIdArray || []));
                for (const conditionId of node.conditionIdArray || []) {
                    if (usedConditionIdSet.has(conditionId)) {
                        return conditionId;
                    }
                    usedConditionIdSet.add(conditionId);
                }
            }
        }
        return null;
    }

    export function getAllSubNodesAndConditionsForNode({ fullData, nodeId, ignoreNodeIdSet }: {
        fullData        : IWarEventFullData;
        nodeId          : number;
        ignoreNodeIdSet?: Set<number>;
    }): {
        conditionIdSet  : Set<number>;
        nodeIdSet       : Set<number>;
    } {
        const conditionIdSet        = new Set<number>();
        const nodeIdSet             = new Set<number>();
        const nodeIdArrayForSearch  = [nodeId];
        for (const nodeIdForSearch of nodeIdArrayForSearch) {
            if (((ignoreNodeIdSet) && (ignoreNodeIdSet.has(nodeIdForSearch))) ||
                (nodeIdSet.has(nodeIdForSearch))
            ) {
                continue;
            }

            nodeIdSet.add(nodeIdForSearch);

            const node = getNode(fullData, nodeIdForSearch);
            if (node) {
                for (const conditionId of node.conditionIdArray || []) {
                    conditionIdSet.add(conditionId);
                }
                nodeIdArrayForSearch.push(...(node.subNodeIdArray || []));
            }
        }

        return {
            nodeIdSet,
            conditionIdSet,
        };
    }

    export function checkAndDeleteUnusedComponents(fullData: IWarEventFullData): {
        deletedNodesCount       : number;
        deletedConditionsCount  : number;
        deletedActionsCount     : number;
    } {
        let deletedNodesCount = 0;
        for (const node of (fullData.conditionNodeArray || []).concat()) {
            deletedNodesCount += checkAndDeleteUnusedNode(fullData, Helpers.getExisted(node.nodeId), true);
        }

        let deletedConditionsCount = 0;
        for (const condition of (fullData.conditionArray || []).concat()) {
            deletedConditionsCount += checkAndDeleteUnusedCondition(fullData, Helpers.getExisted(condition.WecCommonData?.conditionId));
        }

        let deletedActionsCount = 0;
        for (const action of (fullData.actionArray || []).concat()) {
            deletedActionsCount += checkAndDeleteUnusedAction(fullData, Helpers.getExisted(action.WeaCommonData?.actionId));
        }

        return {
            deletedNodesCount,
            deletedConditionsCount,
            deletedActionsCount,
        };
    }
    function checkAndDeleteUnusedNode(fullData: IWarEventFullData, nodeId: number, isRecursive: boolean): number {
        const nodeArray = fullData.conditionNodeArray;
        let deleteCount = 0;
        if (nodeArray == null) {
            return deleteCount;
        }

        const node = getNode(fullData, nodeId);
        if (node == null) {
            return deleteCount;
        }

        if (((fullData.eventArray || []).some(v => v.conditionNodeId === nodeId)) ||
            (nodeArray.some(v => (v.subNodeIdArray || []).indexOf(nodeId) >= 0))
        ) {
            return deleteCount;
        }

        Helpers.deleteElementFromArray(nodeArray, node);
        ++deleteCount;

        if (isRecursive) {
            for (const subNodeId of node.subNodeIdArray || []) {
                deleteCount += checkAndDeleteUnusedNode(fullData, subNodeId, true);
            }
        }

        return deleteCount;
    }
    function checkAndDeleteUnusedCondition(fullData: IWarEventFullData, conditionId: number): number {
        const conditionArray = fullData.conditionArray;
        if (conditionArray == null) {
            return 0;
        }

        const condition = getCondition(fullData, conditionId);
        if (condition == null) {
            return 0;
        }

        if ((fullData.conditionNodeArray || []).some(v => (v.conditionIdArray || []).indexOf(conditionId) >= 0)) {
            return 0;
        }

        return Helpers.deleteElementFromArray(conditionArray, condition);
    }
    function checkAndDeleteUnusedAction(fullData: IWarEventFullData, actionId: number): number {
        const actionArray = fullData.actionArray;
        if (actionArray == null) {
            return 0;
        }

        const action = getAction(fullData, actionId);
        if (action == null) {
            return 0;
        }

        if ((fullData.eventArray || []).some(v => (v.actionIdArray || []).indexOf(actionId) >= 0)) {
            return 0;
        }

        return Helpers.deleteElementFromArray(actionArray, action);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // condition types
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getConditionTypeArray(): ConditionType[] {
        return CONDITION_TYPE_ARRAY;
    }
    export function getConditionType(condition: IWarEventCondition): ConditionType | null {
        if      (condition.WecTurnAndPlayer)                    { return ConditionType.WecTurnAndPlayer; }
        else if (condition.WecEventCalledCount)                 { return ConditionType.WecEventCalledCount; }
        else if (condition.WecPlayerPresence)                   { return ConditionType.WecPlayerPresence; }
        else if (condition.WecWeatherAndFog)                    { return ConditionType.WecWeatherAndFog; }
        else if (condition.WecTilePresence)                     { return ConditionType.WecTilePresence; }
        else if (condition.WecUnitPresence)                     { return ConditionType.WecUnitPresence; }
        else if (condition.WecCustomCounter)                    { return ConditionType.WecCustomCounter; }
        else if (condition.WecOngoingPersistentActionPresence)  { return ConditionType.WecOngoingPersistentActionPresence; }
        else if (condition.WecManualActionStatistics)           { return ConditionType.WecManualActionStatistics; }
        else                                                    { return null; }
    }
    export function resetCondition(condition: IWarEventCondition, conditionType: ConditionType, gameConfig: GameConfig): void {
        const commonData = condition.WecCommonData;
        for (const key in condition) {
            delete condition[key as keyof IWarEventCondition];
        }
        condition.WecCommonData = commonData;

        if (conditionType === ConditionType.WecTurnAndPlayer) {
            condition.WecTurnAndPlayer = {
                turnIndex                       : null,
                turnIndexComparator             : ValueComparator.EqualTo,
                turnIndexDivider                : null,
                turnIndexRemainder              : null,
                turnIndexRemainderComparator    : ValueComparator.EqualTo,
                turnPhase                       : null,
                playerIndexArray                : null,
            };
        } else if (conditionType === ConditionType.WecWeatherAndFog) {
            condition.WecWeatherAndFog = {
                weatherTypeArray    : null,
                hasFogCurrently     : null,
            };
        } else if (conditionType === ConditionType.WecEventCalledCount) {
            condition.WecEventCalledCount = {
                eventIdArray            : null,
                eventsCount             : 0,
                eventsCountComparator   : ValueComparator.EqualTo,
                timesInTurn             : null,
                timesInTurnComparator   : ValueComparator.EqualTo,
                timesTotal              : null,
                timesTotalComparator    : ValueComparator.EqualTo,
            };
        } else if (conditionType === ConditionType.WecPlayerPresence) {
            condition.WecPlayerPresence = {
                playersCount                : 0,
                playersCountComparator      : ValueComparator.EqualTo,
                playerIndexArray            : null,
                aliveStateArray             : null,
                fund                        : null,
                fundComparator              : ValueComparator.EqualTo,
                energyPercentage            : null,
                energyPercentageComparator  : ValueComparator.EqualTo,
                coUsingSkillTypeArray       : null,
                coCategoryIdArray           : null,
            };
        } else if (conditionType === ConditionType.WecTilePresence) {
            condition.WecTilePresence = {
                teamIndexArray      : null,
                playerIndexArray    : null,
                locationIdArray     : null,
                gridIndexArray      : null,
                tileTypeArray       : null,
                isOwnerPlayerInTurn : null,
                tilesCount          : 0,
                tilesCountComparator: ValueComparator.EqualTo,
            };
        } else if (conditionType === ConditionType.WecUnitPresence) {
            condition.WecUnitPresence = {
                teamIndexArray          : null,
                playerIndexArray        : null,
                locationIdArray         : null,
                gridIndexArray          : null,
                unitTypeArray           : null,
                actionStateArray        : null,
                hasLoadedCo             : null,
                hp                      : null,
                isOwnerPlayerInTurn     : null,
                isDiving                : null,
                hpComparator            : ValueComparator.EqualTo,
                fuelPct                 : null,
                fuelPctComparator       : ValueComparator.EqualTo,
                priAmmoPct              : null,
                priAmmoPctComparator    : ValueComparator.EqualTo,
                promotion               : null,
                promotionComparator     : ValueComparator.EqualTo,
                unitsCount              : 0,
                unitsCountComparator    : ValueComparator.EqualTo,
            };
        } else if (conditionType === ConditionType.WecCustomCounter) {
            condition.WecCustomCounter = {
                counterIdArray              : null,
                counterCount                : 1,
                counterCountComparator      : ValueComparator.EqualTo,
                value                       : null,
                valueComparator             : ValueComparator.EqualTo,
                valueDivider                : null,
                valueRemainder              : null,
                valueRemainderComparator    : ValueComparator.EqualTo,
            };
        } else if (conditionType === ConditionType.WecOngoingPersistentActionPresence) {
            condition.WecOngoingPersistentActionPresence = {
                ongoingActionIdArray            : null,
                ongoingActionsCount             : 1,
                ongoingActionsCountComparator   : ValueComparator.EqualTo,
            };
        } else if (conditionType === ConditionType.WecManualActionStatistics) {
            condition.WecManualActionStatistics = {
                playerIndexArray    : null,
                isPlayerInTurn      : null,
                recentTurnsCount    : 1,
                totalActions        : {
                    value           : 1,
                    comparator      : ValueComparator.EqualTo,
                },
            };
        } else {
            // todo: handle more condition types.
            throw Helpers.newError(`Invalid conditionType: ${conditionType}.`, ClientErrorCode.WarEventHelper_ResetCondition_00);
        }
    }

    export function openConditionModifyPanel({ fullData, condition, war }: {
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
        war         : BwWar;
    }): void {
        // todo: handle more condition types.
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel6);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel14);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel23);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel32);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel40);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel50);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel60);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel70);
        PanelHelpers.close(PanelHelpers.PanelDict.WeConditionModifyPanel80);

        if (condition.WecTurnAndPlayer)                         { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel6, { fullData, condition, war }); }

        else if (condition.WecPlayerPresence)                   { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel14, { fullData, condition, war }); }

        else if (condition.WecEventCalledCount)                 { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel23, { fullData, condition, war }); }

        else if (condition.WecTilePresence)                     { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel32, { fullData, condition, war }); }

        else if (condition.WecUnitPresence)                     { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel40, { fullData, condition, war }); }

        else if (condition.WecWeatherAndFog)                    { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel50, { fullData, condition, war }); }

        else if (condition.WecCustomCounter)                    { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel60, { fullData, condition, war }); }

        else if (condition.WecOngoingPersistentActionPresence)  { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel70, { fullData, condition, war }); }

        else if (condition.WecManualActionStatistics)           { PanelHelpers.open(PanelHelpers.PanelDict.WeConditionModifyPanel80, { fullData, condition, war }); }

        else                                                    { throw Helpers.newError(`Invalid condition.`, ClientErrorCode.WarEventHelper_OpenConditionModifyPanel_00); }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // action types
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getActionTypeArray(): ActionType[] {
        return ACTION_TYPE_ARRAY;
    }
    export function getActionType(action: IWarEventAction): ActionType | null {
        // todo: handle future actions.
        if      (action.WeaAddUnit)                         { return ActionType.AddUnit; }
        else if (action.WeaDialogue)                        { return ActionType.Dialogue; }
        else if (action.WeaSetViewpoint)                    { return ActionType.SetViewpoint; }
        else if (action.WeaSetWeather)                      { return ActionType.SetWeather; }
        else if (action.WeaSimpleDialogue)                  { return ActionType.SimpleDialogue; }
        else if (action.WeaPlayBgm)                         { return ActionType.PlayBgm; }
        else if (action.WeaSetForceFogCode)                 { return ActionType.SetForceFogCode; }
        else if (action.WeaSetCustomCounter)                { return ActionType.SetCustomCounter; }
        else if (action.WeaStopPersistentAction)            { return ActionType.StopPersistentAction; }
        else if (action.WeaSetPlayerState)                  { return ActionType.SetPlayerState; }
        else if (action.WeaSetUnitState)                    { return ActionType.SetUnitState; }
        else if (action.WeaSetTileType)                     { return ActionType.SetTileType; }
        else if (action.WeaSetTileState)                    { return ActionType.SetTileState; }
        else if (action.WeaPersistentShowText)              { return ActionType.PersistentShowText; }
        else if (action.WeaPersistentModifyPlayerAttribute) { return ActionType.PersistentModifyPlayerAttribute; }
        else                                                { return null; }
    }
    export function resetAction(action: IWarEventAction, actionType: ActionType, gameConfig: GameConfig): void {
        const commonData = action.WeaCommonData;
        for (const key in action) {
            delete action[key as keyof IWarEventAction];
        }
        action.WeaCommonData = commonData;

        // todo handle future actions.
        if (actionType === ActionType.AddUnit) {
            action.WeaAddUnit = {
                unitArray   : [],
            };
        } else if (actionType === ActionType.Dialogue) {
            action.WeaDialogue = {
                backgroundId    : 0,
                dataArray       : [],
            };
        } else if (actionType === ActionType.SetViewpoint) {
            action.WeaSetViewpoint = {
                gridIndex       : { x: 0, y: 0 },
                needFocusEffect : false,
            };
        } else if (actionType === ActionType.SetWeather) {
            action.WeaSetWeather = {
                weatherType         : gameConfig.getDefaultWeatherType(),
                weatherTurnsCount   : 0,
            };
        } else if (actionType === ActionType.SimpleDialogue) {
            action.WeaSimpleDialogue = {
                dataArray       : [],
            };
        } else if (actionType === ActionType.PlayBgm) {
            action.WeaPlayBgm = {
                useCoBgm        : false,
                bgmCode         : CommonConstants.BgmSfxCode.None,
            };
        } else if (actionType === ActionType.SetForceFogCode) {
            action.WeaSetForceFogCode = {
                forceFogCode    : Types.ForceFogCode.Fog,
                turnsCount      : 0,
            };
        } else if (actionType === ActionType.SetCustomCounter) {
            action.WeaSetCustomCounter = {
                customCounterIdArray    : null,
                deltaValue              : 0,
                multiplierPercentage    : 100,
            };
        } else if (actionType === ActionType.StopPersistentAction) {
            action.WeaStopPersistentAction = {
                actionIdArray   : [],
            };
        } else if (actionType === ActionType.SetPlayerState) {
            action.WeaSetPlayerState = {
                conPlayerIndexArray             : null,
                conIsPlayerInTurn               : null,
                conAliveStateArray              : null,
                conCoUsingSkillTypeArray        : null,
                conEnergyPercentage             : null,
                conIsSkipTurn                   : null,
                conEnergyPercentageComparator   : ValueComparator.EqualTo,
                conFund                         : null,
                conFundComparator               : ValueComparator.EqualTo,
                actFundDeltaValue               : 0,
                actFundMultiplierPercentage     : 100,
                actCoEnergyDeltaPct             : 0,
                actCoEnergyMultiplierPct        : 100,
                actAliveState                   : null,
                actIsSkipTurn                   : null,
            };
        } else if (actionType === ActionType.SetUnitState) {
            action.WeaSetUnitState = {
                conUnitTypeArray                    : null,
                conTeamIndexArray                   : null,
                conPlayerIndexArray                 : null,
                conIsOwnerPlayerInTurn              : null,
                conLocationIdArray                  : null,
                conGridIndexArray                   : null,
                conActionStateArray                 : null,
                conHasLoadedCo                      : null,
                conHp                               : null,
                conHpComparator                     : ValueComparator.EqualTo,
                conFuelPct                          : null,
                conFuelPctComparator                : ValueComparator.EqualTo,
                conPriAmmoPct                       : null,
                conPriAmmoPctComparator             : ValueComparator.EqualTo,
                conPromotion                        : null,
                conPromotionComparator              : ValueComparator.EqualTo,
                conIsDiving                         : null,
                actDestroyUnit                      : null,
                actActionState                      : null,
                actUnitType                         : null,
                actPlayerIndex                      : null,
                actHasLoadedCo                      : null,
                actIsDiving                         : null,
                actHpDeltaValue                     : 0,
                actHpMultiplierPercentage           : 100,
                actFuelDeltaValue                   : 0,
                actFuelMultiplierPercentage         : 100,
                actPriAmmoDeltaValue                : 0,
                actPriAmmoMultiplierPercentage      : 100,
                actPromotionDeltaValue              : 0,
                actPromotionMultiplierPercentage    : 100,
            };
        } else if (actionType === ActionType.SetTileType) {
            action.WeaSetTileType = {
                actTileData     : {
                    gridIndex   : null,
                    playerIndex : CommonConstants.PlayerIndex.Neutral,
                    objectType  : CommonConstants.TileObjectType.Empty,
                    baseType    : gameConfig.getDefaultTileBaseType(),
                },
                actIsModifyTileBase         : true,
                actIsModifyTileDecorator    : true,
                actIsModifyTileObject       : true,
                actDestroyUnit              : false,
            };
        } else if (actionType === ActionType.SetTileState) {
            action.WeaSetTileState = {
                actHpDeltaValue                     : 0,
                actHpMultiplierPercentage           : 100,
                actBuildPointDeltaValue             : 0,
                actBuildPointMultiplierPercentage   : 100,
                actCapturePointDeltaValue           : 0,
                actCapturePointMultiplierPercentage : 100,
            };
        } else if (actionType === ActionType.PersistentShowText) {
            action.WeaPersistentShowText = {
                textArray: [],
            };
        } else if (actionType === ActionType.PersistentModifyPlayerAttribute) {
            action.WeaPersistentModifyPlayerAttribute = {
                conPlayerIndexArray     : [],
                actCanActivateCoSkill   : true,
                actBannedUnitTypeArray  : [],
            };
        } else {
            throw Helpers.newError(`Invalid actionType: ${actionType}.`, ClientErrorCode.WarEventHelper_ResetAction_00);
        }
    }

    export function openActionModifyPanel(war: BwWar, fullData: IWarEventFullData, action: IWarEventAction): void {
        // todo: handle more action types.
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel1);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel2);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel3);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel4);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel5);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel6);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel7);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel10);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel11);

        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel24);

        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel30);

        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel40);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel41);

        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel50);
        PanelHelpers.close(PanelHelpers.PanelDict.WeActionModifyPanel51);

        if      (action.WeaAddUnit)                         { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel1,  { war, fullData, action }); }
        else if (action.WeaSetCustomCounter)                { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel2,  { war, fullData, action }); }
        else if (action.WeaDialogue)                        { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel3,  { war, fullData, action }); }
        else if (action.WeaSetViewpoint)                    { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel4,  { war, fullData, action }); }
        else if (action.WeaSetWeather)                      { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel5,  { war, fullData, action }); }
        else if (action.WeaSimpleDialogue)                  { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel6,  { war, fullData, action }); }
        else if (action.WeaPlayBgm)                         { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel7,  { war, fullData, action }); }
        else if (action.WeaSetForceFogCode)                 { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel10, { war, fullData, action }); }
        else if (action.WeaStopPersistentAction)            { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel11, { war, fullData, action }); }

        else if (action.WeaSetPlayerState)                  { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel24, { war, fullData, action }); }

        else if (action.WeaSetUnitState)                    { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel30, { war, fullData, action }); }

        else if (action.WeaSetTileType)                     { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel40, { war, fullData, action }); }
        else if (action.WeaSetTileState)                    { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel41, { war, fullData, action }); }

        else if (action.WeaPersistentShowText)              { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel50, { war, fullData, action }); }
        else if (action.WeaPersistentModifyPlayerAttribute) { PanelHelpers.open(PanelHelpers.PanelDict.WeActionModifyPanel51, { war, fullData, action }); }

        else {
            throw Helpers.newError(`Invalid action.`, ClientErrorCode.WarEventHelper_OpenActionModifyPanel_00);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // add/clone/replace
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function addEvent(fullData: IWarEventFullData): number | null {
        if (fullData.eventArray == null) {
            fullData.eventArray = [];
        }

        const eventArray = fullData.eventArray;
        for (let eventId = 1; ; ++eventId) {
            if (!eventArray.some(v => v.eventId === eventId)) {
                eventArray.push({
                    eventId,
                    eventNameArray          : [
                        { languageType: LanguageType.Chinese, text: `${Lang.getText(LangTextType.B0469, LanguageType.Chinese)} #${eventId}` },
                        { languageType: LanguageType.English, text: `${Lang.getText(LangTextType.B0469, LanguageType.English)} #${eventId}` },
                    ],
                    maxCallCountInPlayerTurn: 1,
                    maxCallCountTotal       : 1,
                    actionIdArray           : [],
                });
                eventArray.sort((v1, v2) => Helpers.getExisted(v1.eventId) - Helpers.getExisted(v2.eventId));
                return eventId;
            }
        }
    }
    export function cloneEvent(fullData: IWarEventFullData, srcEventId: number, isShallowClone: boolean): number {
        const eventArray    = Helpers.getExisted(fullData.eventArray);
        const srcEvent      = Helpers.getExisted(eventArray.find(v => v.eventId === srcEventId));
        for (let eventId = 1; ; ++eventId) {
            if (eventArray.some(v => v.eventId === eventId)) {
                continue;
            }

            const srcConditionNodeId = srcEvent.conditionNodeId;
            if (isShallowClone) {
                eventArray.push({
                    eventId,
                    eventNameArray          : Helpers.deepClone(srcEvent.eventNameArray),
                    maxCallCountInPlayerTurn: srcEvent.maxCallCountInPlayerTurn,
                    maxCallCountTotal       : srcEvent.maxCallCountTotal,
                    actionIdArray           : Helpers.deepClone(srcEvent.actionIdArray),
                    conditionNodeId         : srcConditionNodeId,
                });
            } else {
                eventArray.push({
                    eventId,
                    eventNameArray          : Helpers.deepClone(srcEvent.eventNameArray),
                    maxCallCountInPlayerTurn: srcEvent.maxCallCountInPlayerTurn,
                    maxCallCountTotal       : srcEvent.maxCallCountTotal,
                    actionIdArray           : (srcEvent.actionIdArray ?? []).map(v => cloneAction(fullData, v)),
                    conditionNodeId         : srcConditionNodeId == null ? null : cloneNode(fullData, srcConditionNodeId, isShallowClone),
                });
            }

            eventArray.sort((v1, v2) => Helpers.getExisted(v1.eventId) - Helpers.getExisted(v2.eventId));
            return eventId;
        }
    }

    export function createSubNodeInParentNode({ fullData, parentNodeId, isAnd = true, conditionIdArray = [], subNodeIdArray = [] }: {   // DONE
        fullData            : IWarEventFullData;
        parentNodeId        : number;
        isAnd?              : boolean;
        conditionIdArray?   : number[];
        subNodeIdArray?     : number[];
    }): number | null {
        const nodeArray     = fullData.conditionNodeArray || [];
        const parentNode    = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return null;
        }

        for (let nodeId = 1; ; ++nodeId) {
            if (!nodeArray.some(v => v.nodeId === nodeId)) {
                nodeArray.push({
                    nodeId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                });
                nodeArray.sort((v1, v2) => Helpers.getExisted(v1.nodeId) - Helpers.getExisted(v2.nodeId));

                if (parentNode.subNodeIdArray == null) {
                    parentNode.subNodeIdArray = [nodeId];
                } else {
                    parentNode.subNodeIdArray.push(nodeId);
                    parentNode.subNodeIdArray.sort((v1, v2) => v1 - v2);
                }

                return nodeId;
            }
        }
    }
    export function cloneNode(fullData: IWarEventFullData, srcNodeId: number, isShallowClone: boolean): number {
        const nodeArray = Helpers.getExisted(fullData.conditionNodeArray);
        const srcNode   = Helpers.getExisted(nodeArray.find(v => v.nodeId === srcNodeId));
        for (let nodeId = 1; ; ++nodeId) {
            if (nodeArray.some(v => v.nodeId === nodeId)) {
                continue;
            }

            const newNode   = Helpers.deepClone(srcNode);
            newNode.nodeId  = nodeId;
            nodeArray.push(newNode);
            if (!isShallowClone) {
                const conditionIdArray = srcNode.conditionIdArray;
                if (conditionIdArray) {
                    newNode.conditionIdArray = conditionIdArray.map(v => cloneCondition(fullData, v));
                }

                const subNodeIdArray = srcNode.subNodeIdArray;
                if (subNodeIdArray) {
                    newNode.subNodeIdArray = subNodeIdArray.map(v => cloneNode(fullData, v, isShallowClone));
                }
            }

            nodeArray.sort((v1, v2) => Helpers.getExisted(v1.nodeId) - Helpers.getExisted(v2.nodeId));
            return nodeId;
        }
    }
    export function cloneAndReplaceNodeInParentNode({ fullData, parentNodeId, nodeIdForDelete, nodeIdForClone }: {   // DONE
        fullData        : IWarEventFullData;
        parentNodeId    : number;
        nodeIdForDelete : number | null;
        nodeIdForClone  : number;
    }): number | null {
        const nodeArray = fullData.conditionNodeArray;
        if (nodeArray == null) {
            return null;
        }

        const parentNode = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return null;
        }

        const srcNode = getNode(fullData, nodeIdForClone);
        if (srcNode == null) {
            return null;
        }
        const newNode = Helpers.deepClone(srcNode);

        for (let nodeId = 1; ; ++nodeId) {
            if (!nodeArray.some(v => v.nodeId === nodeId)) {
                newNode.nodeId = nodeId;
                nodeArray.push(newNode);
                nodeArray.sort((v1, v2) => Helpers.getExisted(v1.nodeId) - Helpers.getExisted(v2.nodeId));

                if (parentNode.subNodeIdArray == null) {
                    parentNode.subNodeIdArray = [nodeId];
                } else {
                    Helpers.deleteElementFromArray(parentNode.subNodeIdArray, nodeIdForDelete);
                    parentNode.subNodeIdArray.push(nodeId);
                    parentNode.subNodeIdArray.sort((v1, v2) => v1 - v2);
                }

                return nodeId;
            }
        }
    }
    export function createAndReplaceSubNodeInEvent({ fullData, eventId, isAnd = true, conditionIdArray = [], subNodeIdArray = [] }: {   // DONE
        fullData            : IWarEventFullData;
        eventId             : number;
        isAnd?              : boolean;
        conditionIdArray?   : number[];
        subNodeIdArray?     : number[];
    }): number | null {
        const event = getEvent(fullData, eventId);
        if (event == null) {
            return null;
        }

        if (fullData.conditionNodeArray == null) {
            fullData.conditionNodeArray = [];
        }

        const nodeArray = fullData.conditionNodeArray;
        for (let nodeId = 1; ; ++nodeId) {
            if (!nodeArray.some(v => v.nodeId === nodeId)) {
                nodeArray.push({
                    nodeId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                });
                nodeArray.sort((v1, v2) => Helpers.getExisted(v1.nodeId) - Helpers.getExisted(v2.nodeId));

                // const oldNodeId         = event.conditionNodeId;
                event.conditionNodeId   = nodeId;
                // checkAndDeleteUnusedNode(fullData, oldNodeId);

                return nodeId;
            }
        }
    }

    export function replaceSubNodeInEvent({ fullData, eventId, newNodeId }: {                       // DONE
        fullData    : IWarEventFullData;
        eventId     : number;
        newNodeId   : number;
    }): boolean {
        if (getNode(fullData, newNodeId) == null) {
            return false;
        }

        const event = getEvent(fullData, eventId);
        if (event == null) {
            return false;
        }

        const oldNodeId = event.conditionNodeId;
        if (oldNodeId === newNodeId) {
            return false;
        }

        event.conditionNodeId = newNodeId;
        // checkAndDeleteUnusedNode(fullData, oldNodeId);

        return true;
    }
    export function replaceSubNodeInParentNode({ fullData, parentNodeId, oldNodeId, newNodeId }: {  // DONE
        fullData    : IWarEventFullData;
        parentNodeId: number;
        oldNodeId   : number | null;
        newNodeId   : number;
    }): boolean {
        if (oldNodeId === newNodeId) {
            return false;
        }

        const nodeArray = fullData.conditionNodeArray;
        if (nodeArray == null) {
            return false;
        }

        if (getNode(fullData, newNodeId) == null) {
            return false;
        }

        const parentNode = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return false;
        }

        const nodeIdArray = parentNode.subNodeIdArray;
        if (nodeIdArray == null) {
            return false;
        }

        Helpers.deleteElementFromArray(nodeIdArray, oldNodeId);
        nodeIdArray.push(newNodeId);
        nodeIdArray.sort((v1, v2) => v1 - v2);
        // checkAndDeleteUnusedNode(fullData, oldNodeId);

        return true;
    }

    export function addDefaultCondition(fullData: IWarEventFullData, nodeId: number): number { // DONE
        const node = Helpers.getExisted(getNode(fullData, nodeId), ClientErrorCode.WarEventHelper_AddDefaultCondition_00);
        if (node.conditionIdArray == null) {
            node.conditionIdArray = [];
        }
        if (fullData.conditionArray == null) {
            fullData.conditionArray = [];
        }

        const conditionIdArray  = node.conditionIdArray;
        const conditionArray    = fullData.conditionArray;
        for (let conditionId = 1; ; ++conditionId) {
            if (!conditionArray.some(v => v.WecCommonData?.conditionId === conditionId)) {
                conditionArray.push({
                    WecCommonData               : {
                        conditionId
                    },
                    WecTurnAndPlayer : {
                        turnIndex                       : null,
                        turnIndexComparator             : ValueComparator.EqualTo,
                        turnIndexDivider                : null,
                        turnIndexRemainder              : null,
                        turnIndexRemainderComparator    : ValueComparator.EqualTo,
                        turnPhase                       : null,
                        playerIndexArray                : null,
                    },
                });
                conditionArray.sort((v1, v2) => Helpers.getExisted(v1.WecCommonData?.conditionId) - Helpers.getExisted(v2.WecCommonData?.conditionId));

                conditionIdArray.push(conditionId);
                conditionIdArray.sort((v1, v2) => v1 - v2);

                return conditionId;
            }
        }
    }
    export function cloneCondition(fullData: IWarEventFullData, srcConditionId: number): number {
        const conditionArray    = Helpers.getExisted(fullData.conditionArray);
        const newCondition      = Helpers.deepClone(Helpers.getExisted(conditionArray.find(v => v.WecCommonData?.conditionId === srcConditionId)));
        conditionArray.push(newCondition);

        for (let conditionId = 1; ; ++conditionId) {
            if (conditionArray.some(v => v.WecCommonData?.conditionId === conditionId)) {
                continue;
            }

            Helpers.getExisted(newCondition.WecCommonData).conditionId = conditionId;
            conditionArray.sort((v1, v2) => Helpers.getExisted(v1.WecCommonData?.conditionId) - Helpers.getExisted(v2.WecCommonData?.conditionId));
            return conditionId;
        }
    }
    export function cloneAndReplaceConditionInParentNode({ fullData, parentNodeId, conditionIdForDelete, conditionIdForClone }: {
        fullData            : IWarEventFullData;
        parentNodeId        : number;
        conditionIdForDelete: number;
        conditionIdForClone : number;
    }): number | null {
        const parentNode = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return null;
        }

        const conditionArray = fullData.conditionArray;
        if (conditionArray == null) {
            return null;
        }

        const srcCondition = getCondition(fullData, conditionIdForClone);
        if (srcCondition == null) {
            return null;
        }
        const newCondition = Helpers.deepClone(srcCondition);

        if (parentNode.conditionIdArray == null) {
            parentNode.conditionIdArray = [];
        }

        const conditionIdArray = parentNode.conditionIdArray;
        for (let conditionId = 1; ; ++conditionId) {
            if (!conditionArray.some(v => v.WecCommonData?.conditionId === conditionId)) {
                Helpers.getExisted(newCondition.WecCommonData).conditionId = conditionId;
                conditionArray.push(newCondition);
                conditionArray.sort((v1, v2) => Helpers.getExisted(v1.WecCommonData?.conditionId) - Helpers.getExisted(v2.WecCommonData?.conditionId));

                Helpers.deleteElementFromArray(conditionIdArray, conditionIdForDelete);
                conditionIdArray.push(conditionId);
                conditionIdArray.sort((v1, v2) => v1 - v2);

                return conditionId;
            }
        }
    }
    export function replaceConditionInParentNode({ fullData, parentNodeId, oldConditionId, newConditionId }: {
        fullData        : IWarEventFullData;
        parentNodeId    : number;
        oldConditionId  : number;
        newConditionId  : number;
    }): boolean {
        if (oldConditionId === newConditionId) {
            return false;
        }

        const parentNode = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return false;
        }

        if (parentNode.conditionIdArray == null) {
            parentNode.conditionIdArray = [];
        }

        const conditionIdArray = parentNode.conditionIdArray;
        Helpers.deleteElementFromArray(conditionIdArray, oldConditionId);
        if (conditionIdArray.indexOf(newConditionId) < 0) {
            conditionIdArray.push(newConditionId);
            conditionIdArray.sort((v1, v2) => v1 - v2);
        }

        return true;
    }

    export function addDefaultAction(fullData: IWarEventFullData, eventId: number): number | null {   // DONE
        const event = getEvent(fullData, eventId);
        if (event == null) {
            return null;
        }

        if (fullData.actionArray == null) {
            fullData.actionArray = [];
        }
        if (event.actionIdArray == null) {
            event.actionIdArray = [];
        }

        const actionArray           = fullData.actionArray;
        const eventActionIdArray    = event.actionIdArray;
        for (let actionId = 1; ; ++actionId) {
            if (!actionArray.some(v => v.WeaCommonData?.actionId === actionId)) {
                actionArray.push({
                    WeaCommonData: {
                        actionId,
                    },
                    WeaAddUnit: {
                        unitArray: [],
                    },
                });
                actionArray.sort((v1, v2) => Helpers.getExisted(v1.WeaCommonData?.actionId) - Helpers.getExisted(v2.WeaCommonData?.actionId));

                eventActionIdArray.push(actionId);

                return actionId;
            }
        }
    }
    export function getDefaultAddUnitData(gameConfig: GameConfig): CommonProto.WarEvent.WeaAddUnit.IDataForAddUnit {
        return {
            canBeBlockedByUnit  : true,
            needMovableTile     : true,
            unitData            : {
                gridIndex       : { x: 0, y: 0 },
                playerIndex     : CommonConstants.PlayerIndex.First,
                unitType        : gameConfig.getFirstUnitType(),
            },
        };
    }
    export function getDefaultCoDialogueData(gameConfig: GameConfig): CommonProto.WarEvent.WeaDialogue.IDataForDialogue {
        return {
            dataForCoDialogue: {
                coId        : gameConfig.getCoIdArrayForDialogue()[0],
                side        : Types.WarEventActionDialogueSide.Left,
                textArray   : [
                    { languageType: Lang.getCurrentLanguageType(), text: `...` },
                ],
            },
        };
    }
    export function getDefaultAsideData(): CommonProto.WarEvent.WeaDialogue.IDataForDialogue {
        return {
            dataForAside: {
                textArray   : [
                    { languageType: Lang.getCurrentLanguageType(), text: `...` },
                ],
            },
        };
    }
    export function getDefaultSimpleCoDialogueData(gameConfig: GameConfig): CommonProto.WarEvent.WeaSimpleDialogue.IDataForDialogue {
        return {
            dataForCoDialogue: {
                coId        : gameConfig.getCoIdArrayForDialogue()[0],
                side        : Types.WarEventActionSimpleDialogueSide.Bottom,
                textArray   : [
                    { languageType: Lang.getCurrentLanguageType(), text: `...` },
                ],
            },
        };
    }

    export function cloneAction(fullData: IWarEventFullData, srcActionId: number): number {
        const actionArray   = Helpers.getExisted(fullData.actionArray);
        const newAction     = Helpers.deepClone(Helpers.getExisted(actionArray.find(v => v.WeaCommonData?.actionId === srcActionId)));
        actionArray.push(newAction);

        for (let actionId = 1; ; ++actionId) {
            if (actionArray.some(v => v.WeaCommonData?.actionId === actionId)) {
                continue;
            }

            Helpers.getExisted(newAction.WeaCommonData).actionId = actionId;
            actionArray.sort((v1, v2) => Helpers.getExisted(v1.WeaCommonData?.actionId) - Helpers.getExisted(v2.WeaCommonData?.actionId));
            return actionId;
        }
    }
    export function cloneAndReplaceActionInEvent({ fullData, eventId, actionIdForDelete, actionIdForClone }: {
        fullData            : IWarEventFullData;
        eventId             : number;
        actionIdForDelete   : number;
        actionIdForClone    : number;
    }): number | null {
        const eventData = getEvent(fullData, eventId);
        if (eventData == null) {
            return null;
        }

        const actionArray = fullData.actionArray;
        if (actionArray == null) {
            return null;
        }

        const srcAction = getAction(fullData, actionIdForClone);
        if (srcAction == null) {
            return null;
        }

        if (eventData.actionIdArray == null) {
            eventData.actionIdArray = [];
        }

        const actionIdArray = eventData.actionIdArray;
        const newAction     = Helpers.deepClone(srcAction);
        for (let actionId = 1; ; ++actionId) {
            if (!actionArray.some(v => v.WeaCommonData?.actionId === actionId)) {
                Helpers.getExisted(newAction.WeaCommonData).actionId = actionId;
                actionArray.push(newAction);
                actionArray.sort((v1, v2) => Helpers.getExisted(v1.WeaCommonData?.actionId) - Helpers.getExisted(v2.WeaCommonData?.actionId));

                Helpers.deleteElementFromArray(actionIdArray, actionIdForDelete);
                actionIdArray.push(actionId);
                actionIdArray.sort((v1, v2) => v1 - v2);

                return actionId;
            }
        }
    }
    export function replaceActionInEvent({ fullData, eventId, oldActionId, newActionId }: {
        fullData    : IWarEventFullData;
        eventId     : number;
        oldActionId : number;
        newActionId : number;
    }): boolean {
        if (oldActionId === newActionId) {
            return false;
        }

        const actionIdArray = Helpers.getExisted(getEvent(fullData, eventId)?.actionIdArray);
        actionIdArray[actionIdArray.indexOf(oldActionId)] = newActionId;

        return true;
    }
}

// export default WarEventHelper;
