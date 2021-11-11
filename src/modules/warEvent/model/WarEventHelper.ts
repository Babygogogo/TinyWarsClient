
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
namespace WarEventHelper {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import LanguageType             = Types.LanguageType;
    import ConditionType            = Types.WarEventConditionType;
    import ActionType               = Types.WarEventActionType;
    import PlayerAliveState         = Types.PlayerAliveState;
    import WarEvent                 = ProtoTypes.WarEvent;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IMapRawData              = ProtoTypes.Map.IMapRawData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                    = TwnsBwWar.BwWar;

    const CONDITION_TYPE_ARRAY = [
        ConditionType.WecTurnIndexEqualTo,
        ConditionType.WecTurnIndexGreaterThan,
        ConditionType.WecTurnIndexLessThan,
        ConditionType.WecTurnIndexRemainderEqualTo,

        ConditionType.WecTurnPhaseEqualTo,

        ConditionType.WecPlayerIndexInTurnEqualTo,
        ConditionType.WecPlayerIndexInTurnGreaterThan,
        ConditionType.WecPlayerIndexInTurnLessThan,

        ConditionType.WecEventCalledCountTotalEqualTo,
        ConditionType.WecEventCalledCountTotalGreaterThan,
        ConditionType.WecEventCalledCountTotalLessThan,

        ConditionType.WecPlayerAliveStateEqualTo,

        ConditionType.WecTilePlayerIndexEqualTo,
        ConditionType.WecTileTypeEqualTo,
    ];

    const ACTION_TYPE_ARRAY = [
        // TODO: add future types
        ActionType.AddUnit,
        ActionType.SetPlayerAliveState,
        ActionType.Dialogue,
        ActionType.SetViewpoint,
        ActionType.SetWeather,
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

    export function trimWarEventFullData(fullData: Types.Undefinable<IWarEventFullData>, eventIdArray: Types.Undefinable<number[]>): IWarEventFullData {
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

        return trimmedData;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // validation
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type WarEventDict               = Map<number, IWarEvent>;
    type WarEventActionDict         = Map<number, IWarEventAction>;
    type WarEventConditionDict      = Map<number, IWarEventCondition>;
    type WarEventConditionNodeDict  = Map<number, IWarEventConditionNode>;
    export function checkIsWarEventFullDataValid(mapRawData: IMapRawData): boolean {   // DONE
        const warEventFullData = mapRawData.warEventFullData;
        if (warEventFullData == null) {
            return true;
        }

        const warRuleList = mapRawData.warRuleArray;
        if (warRuleList == null) {
            return false;
        }

        const actionDict = new Map<number, IWarEventAction>();
        for (const action of warEventFullData.actionArray || []) {
            const commonData = action.WeaCommonData;
            if (commonData == null) {
                return false;
            }

            const actionId = commonData.actionId;
            if ((actionId == null) || (actionDict.has(actionId))) {
                return false;
            }
            actionDict.set(actionId, action);
        }
        if (actionDict.size > CommonConstants.WarEventMaxActionsPerMap) {
            return false;
        }

        const conditionDict = new Map<number, IWarEventCondition>();
        for (const condition of warEventFullData.conditionArray || []) {
            const commonData = condition.WecCommonData;
            if (commonData == null) {
                return false;
            }

            const conditionId = commonData.conditionId;
            if ((conditionId == null) || (conditionDict.has(conditionId))) {
                return false;
            }
            conditionDict.set(conditionId, condition);
        }
        if (conditionDict.size > CommonConstants.WarEventMaxConditionsPerMap) {
            return false;
        }

        const nodeDict = new Map<number, IWarEventConditionNode>();
        for (const node of warEventFullData.conditionNodeArray || []) {
            const nodeId = node.nodeId;
            if ((nodeId == null) || (nodeDict.has(nodeId))) {
                return false;
            }
            nodeDict.set(nodeId, node);
        }
        if (nodeDict.size > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return false;
        }

        const eventDict = new Map<number, IWarEvent>();
        for (const event of warEventFullData.eventArray || []) {
            const eventId = event.eventId;
            if ((eventId == null) || (eventDict.has(eventId))) {
                return false;
            }
            eventDict.set(eventId, event);
        }
        if (eventDict.size > CommonConstants.WarEventMaxEventsPerMap) {
            return false;
        }

        if (!checkIsEveryWarEventActionInUse(actionDict, eventDict)) {
            return false;
        }
        if (!checkIsEveryWarEventConditionInUse(conditionDict, nodeDict)) {
            return false;
        }
        if (!checkIsEveryWarEventConditionNodeInUse(nodeDict, eventDict)) {
            return false;
        }
        if (!checkIsEveryWarEventInUse(eventDict, warRuleList)) {
            return false;
        }

        for (const [, action] of actionDict) {
            if (!checkIsValidWarEventAction({ action, eventDict, mapRawData })) {
                return false;
            }
        }
        for (const [, condition] of conditionDict) {
            if (!checkIsValidWarEventCondition({ condition, mapRawData })) {
                return false;
            }
        }
        for (const [, conditionNode] of nodeDict) {
            if (!checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict })) {
                return false;
            }
        }
        for (const [, warEvent] of eventDict) {
            if (!checkIsValidWarEvent({ warEvent, nodeDict, actionDict })) {
                return false;
            }
        }

        return true;
    }
    export function getErrorCodeForWarEventFullData(mapRawData: IMapRawData): ClientErrorCode {   // DONE
        const warEventFullData = mapRawData.warEventFullData;
        if (warEventFullData == null) {
            return ClientErrorCode.NoError;
        }

        const warRuleArray = mapRawData.warRuleArray;
        if (warRuleArray == null) {
            return ClientErrorCode.WarEventFullDataValidation00;
        }

        const actionDict = new Map<number, IWarEventAction>();
        for (const action of warEventFullData.actionArray || []) {
            const commonData    = action.WeaCommonData;
            const actionId      = commonData?.actionId;
            if ((actionId == null) || (actionDict.has(actionId))) {
                return ClientErrorCode.WarEventFullDataValidation01;
            }
            actionDict.set(actionId, action);
        }
        if (actionDict.size > CommonConstants.WarEventMaxActionsPerMap) {
            return ClientErrorCode.WarEventFullDataValidation02;
        }

        const conditionDict = new Map<number, IWarEventCondition>();
        for (const condition of warEventFullData.conditionArray || []) {
            const commonData    = condition.WecCommonData;
            const conditionId   = commonData?.conditionId;
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
        if (!checkIsEveryWarEventInUse(eventDict, warRuleArray)) {
            return ClientErrorCode.WarEventFullDataValidation12;
        }

        for (const [, action] of actionDict) {
            if (!checkIsValidWarEventAction({ action, eventDict, mapRawData })) {
                return ClientErrorCode.WarEventFullDataValidation13;
            }
        }
        for (const [, condition] of conditionDict) {
            if (!checkIsValidWarEventCondition({ condition, mapRawData })) {
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
    function checkIsEveryWarEventInUse(eventDict: WarEventDict, warRuleArray: ProtoTypes.WarRule.IWarRule[]): boolean {  // DONE
        for (const [eventId] of eventDict) {
            let isInUse = false;
            for (const warRule of warRuleArray) {
                if ((warRule.warEventIdArray || []).indexOf(eventId) >= 0) {
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

    function checkIsValidWarEventAction({ action, eventDict, mapRawData }: {    // DONE
        action      : IWarEventAction;
        eventDict   : WarEventDict;
        mapRawData  : IMapRawData;
    }): boolean {
        if (Object.keys(action).length !== 2) {
            return false;
        }

        const configVersion = ConfigManager.getLatestConfigVersion();
        if (configVersion == null) {
            return false;
        }

        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const mapSize: Types.MapSize = { width: mapWidth, height: mapHeight };

        {
            const actionData = action.WeaAddUnit;
            if (actionData) {
                return checkIsValidWeaAddUnit(actionData, configVersion, mapSize);
            }
        }

        {
            const actionData = action.WeaSetPlayerAliveState;
            if (actionData) {
                return checkIsValidWeaSetPlayerAliveState(actionData);
            }
        }

        {
            const actionData = action.WeaDialogue;
            if (actionData) {
                return checkIsValidWeaDialogue(actionData);
            }
        }

        {
            const actionData = action.WeaSetViewpoint;
            if (actionData) {
                return checkIsValidWeaSetViewpoint(actionData, mapSize);
            }
        }

        {
            const actionData = action.WeaSetWeather;
            if (actionData) {
                return checkIsValidWeaSetWeather(actionData);
            }
        }

        // TODO add more checkers when the action types grow.

        return false;
    }
    function checkIsValidWeaAddUnit(action: ProtoTypes.WarEvent.IWeaAddUnit, configVersion: string, mapSize: Types.MapSize): boolean {
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

            if (WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                playersCountUnneutral   : CommonConstants.WarMaxPlayerIndex,
                configVersion,
                mapSize,
            })) {
                return false;
            }
        }

        return true;
    }
    function checkIsValidWeaSetPlayerAliveState(actionData: ProtoTypes.WarEvent.IWeaSetPlayerAliveState): boolean {
        const playerIndex   = actionData.playerIndex;
        if ((playerIndex == null)                                   ||
            (playerIndex === CommonConstants.WarNeutralPlayerIndex) ||
            (playerIndex > CommonConstants.WarMaxPlayerIndex)
        ) {
            return false;
        }

        const playerAliveState: Types.Undefinable<Types.PlayerAliveState> = actionData.playerAliveState;
        if (playerAliveState == null) {
            return false;
        }
        if ((playerAliveState !== Types.PlayerAliveState.Alive) &&
            (playerAliveState !== Types.PlayerAliveState.Dying) &&
            (playerAliveState !== Types.PlayerAliveState.Dead)
        ) {
            return false;
        }

        return true;
    }
    function checkIsValidWeaDialogue(action: ProtoTypes.WarEvent.IWeaDialogue): boolean {
        const backgroundId = action.backgroundId;
        if ((backgroundId != null) && (backgroundId > ConfigManager.getSystemDialogueBackgroundMaxId(Helpers.getExisted(ConfigManager.getLatestConfigVersion())))) {
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
                if ((subData) && (!checkIsValidDataForCoDialogue(subData))) {
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
    function checkIsValidDataForCoDialogue(data: ProtoTypes.WarEvent.WeaDialogue.IDataForCoDialogue): boolean {
        const configVersion = ConfigManager.getLatestConfigVersion();
        if (configVersion == null) {
            return false;
        }

        const coId = data.coId;
        if ((coId == null)                                          ||
            (coId === CommonConstants.CoEmptyId)                    ||
            (ConfigManager.getCoBasicCfg(configVersion, coId) == null)
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
    function checkIsValidDataForAside(data: ProtoTypes.WarEvent.WeaDialogue.IDataForAside): boolean {
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
    function checkIsValidWeaSetViewpoint(data: ProtoTypes.WarEvent.IWeaSetViewpoint, mapSize: Types.MapSize): boolean {
        const gridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
        return (gridIndex != null)
            && (GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize));
    }
    function checkIsValidWeaSetWeather(data: ProtoTypes.WarEvent.IWeaSetWeather): boolean {
        const weatherType = data.weatherType;
        return (weatherType != null)
            && (ConfigManager.checkIsValidWeatherType(weatherType))
            && (data.turnsCount != null);
    }

    function checkIsValidWarEventCondition({ condition, mapRawData }: {  // DONE
        condition   : IWarEventCondition;
        mapRawData  : ProtoTypes.Map.IMapRawData;
    }): boolean {
        if (Object.keys(condition).length !== 2) {
            return false;
        }

        {
            const commonData = condition.WecCommonData;
            if (commonData == null) {
                return false;
            }
        }

        {
            const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
            if (conEventCalledCountTotalEqualTo) {
                return (conEventCalledCountTotalEqualTo.countEqualTo != null)
                    && (conEventCalledCountTotalEqualTo.eventIdEqualTo != null);
            }
        }

        {
            const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
            if (conEventCalledCountTotalGreaterThan) {
                return (conEventCalledCountTotalGreaterThan.countGreaterThan != null)
                && (conEventCalledCountTotalGreaterThan.eventIdEqualTo != null);
            }
        }

        {
            const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
            if (conEventCalledCountTotalLessThan) {
                return (conEventCalledCountTotalLessThan.countLessThan != null)
                && (conEventCalledCountTotalLessThan.eventIdEqualTo != null);
            }
        }

        {
            const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
            if (conPlayerAliveStateEqualTo) {
                const { playerIndexEqualTo, aliveStateEqualTo } = conPlayerAliveStateEqualTo;

                if ((aliveStateEqualTo !== PlayerAliveState.Alive)    &&
                (aliveStateEqualTo !== PlayerAliveState.Dead)     &&
                (aliveStateEqualTo !== PlayerAliveState.Dying)
                ) {
                    return false;
                }

                if (playerIndexEqualTo == null) {
                    return false;
                }

                return true;
            }
        }

        {
            const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
            if (conTurnIndexEqualTo) {
                return conTurnIndexEqualTo.valueEqualTo != null;
            }
        }

        {
            const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
            if (conTurnIndexGreaterThan) {
                return conTurnIndexGreaterThan.valueGreaterThan != null;
            }
        }

        {
            const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
            if (conTurnIndexLessThan) {
                return conTurnIndexLessThan.valueLessThan != null;
            }
        }

        {
            const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
            if (conTurnIndexRemainderEqualTo) {
                const { divider, remainderEqualTo } = conTurnIndexRemainderEqualTo;
                return (!!divider) && (remainderEqualTo != null);
            }
        }

        {
            const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
            if (conPlayerIndexInTurnEqualTo) {
                return conPlayerIndexInTurnEqualTo.valueEqualTo != null;
            }
        }

        {
            const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
            if (conPlayerIndexInTurnGreaterThan) {
                return conPlayerIndexInTurnGreaterThan.valueGreaterThan != null;
            }
        }

        {
            const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
            if (conPlayerIndexInTurnLessThan) {
                return conPlayerIndexInTurnLessThan.valueLessThan != null;
            }
        }

        {
            const conTurnPhaseEqualTo = condition.WecTurnPhaseEqualTo;
            if (conTurnPhaseEqualTo) {
                const value = conTurnPhaseEqualTo.valueEqualTo;
                return (value === Types.TurnPhaseCode.Main)
                    || (value === Types.TurnPhaseCode.WaitBeginTurn);
            }
        }

        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return false;
        }

        const mapSize = WarMapModel.getMapSize(mapRawData);
        if (mapSize == null) {
            return false;
        }

        {
            const con = condition.WecTilePlayerIndexEqualTo;
            if (con) {
                const playerIndex   = con.playerIndex;
                const gridIndex     = GridIndexHelpers.convertGridIndex(con.gridIndex);
                return (playerIndex != null)
                    && (playerIndex <= playersCountUnneutral)
                    && (gridIndex != null)
                    && (GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize));
            }
        }

        {
            const con = condition.WecTileTypeEqualTo;
            if (con) {
                const tileType = con.tileType;
                const gridIndex     = GridIndexHelpers.convertGridIndex(con.gridIndex);
                return (tileType != null)
                    && (ConfigManager.checkIsValidTileType(tileType))
                    && (gridIndex != null)
                    && (GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize));
            }
        }

        // TODO add more checkers when the condition types grow.

        return false;
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
    export function getDescForCondition(con: IWarEventCondition): string | null {
        return (getDescForWecEventCalledCountTotalEqualTo(con.WecEventCalledCountTotalEqualTo))
            || (getDescForWecEventCalledCountTotalGreaterThan(con.WecEventCalledCountTotalGreaterThan))
            || (getDescForWecEventCalledCountTotalLessThan(con.WecEventCalledCountTotalLessThan))
            || (getDescForWecPlayerAliveStateEqualTo(con.WecPlayerAliveStateEqualTo))
            || (getDescForWecPlayerIndexInTurnEqualTo(con.WecPlayerIndexInTurnEqualTo))
            || (getDescForWecPlayerIndexInTurnGreaterThan(con.WecPlayerIndexInTurnGreaterThan))
            || (getDescForWecPlayerIndexInTurnLessThan(con.WecPlayerIndexInTurnLessThan))
            || (getDescForWecTurnIndexEqualTo(con.WecTurnIndexEqualTo))
            || (getDescForWecTurnIndexGreaterThan(con.WecTurnIndexGreaterThan))
            || (getDescForWecTurnIndexLessThan(con.WecTurnIndexLessThan))
            || (getDescForWecTurnIndexRemainderEqualTo(con.WecTurnIndexRemainderEqualTo))
            || (getDescForWecTurnPhaseEqualTo(con.WecTurnPhaseEqualTo))
            || (getDescForWecTilePlayerIndexEqualTo(con.WecTilePlayerIndexEqualTo))
            || (getDescForWecTileTypeEqualTo(con.WecTileTypeEqualTo));
    }
    function getDescForWecEventCalledCountTotalEqualTo(data: Types.Undefinable<WarEvent.IWecEventCalledCountTotalEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0035 : LangTextType.F0036, data.eventIdEqualTo, data.countEqualTo)
            : null;
    }
    function getDescForWecEventCalledCountTotalGreaterThan(data: Types.Undefinable<WarEvent.IWecEventCalledCountTotalGreaterThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0037 : LangTextType.F0038, data.eventIdEqualTo, data.countGreaterThan)
            : null;
    }
    function getDescForWecEventCalledCountTotalLessThan(data: Types.Undefinable<WarEvent.IWecEventCalledCountTotalLessThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0039 : LangTextType.F0040, data.eventIdEqualTo, data.countLessThan)
            : null;
    }
    function getDescForWecPlayerAliveStateEqualTo(data: Types.Undefinable<WarEvent.IWecPlayerAliveStateEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0041 : LangTextType.F0042, data.playerIndexEqualTo, Lang.getPlayerAliveStateName(Helpers.getExisted(data.aliveStateEqualTo)))
            : null;
    }
    function getDescForWecPlayerIndexInTurnEqualTo(data: Types.Undefinable<WarEvent.IWecPlayerIndexInTurnEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0043 : LangTextType.F0044, data.valueEqualTo)
            : null;
    }
    function getDescForWecPlayerIndexInTurnGreaterThan(data: Types.Undefinable<WarEvent.IWecPlayerIndexInTurnGreaterThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0045 : LangTextType.F0046, data.valueGreaterThan)
            : null;
    }
    function getDescForWecPlayerIndexInTurnLessThan(data: Types.Undefinable<WarEvent.IWecPlayerIndexInTurnLessThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0047 : LangTextType.F0048, data.valueLessThan)
            : null;
    }
    function getDescForWecTurnIndexEqualTo(data: Types.Undefinable<WarEvent.IWecTurnIndexEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0049 : LangTextType.F0050, data.valueEqualTo)
            : null;
    }
    function getDescForWecTurnIndexGreaterThan(data: Types.Undefinable<WarEvent.IWecTurnIndexGreaterThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0051 : LangTextType.F0052, data.valueGreaterThan)
            : null;
    }
    function getDescForWecTurnIndexLessThan(data: Types.Undefinable<WarEvent.IWecTurnIndexLessThan>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0053 : LangTextType.F0054, data.valueLessThan)
            : null;
    }
    function getDescForWecTurnIndexRemainderEqualTo(data: Types.Undefinable<WarEvent.IWecTurnIndexRemainderEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0055 : LangTextType.F0056, data.divider, data.remainderEqualTo)
            : null;
    }
    function getDescForWecTurnPhaseEqualTo(data: Types.Undefinable<WarEvent.IWecTurnPhaseEqualTo>): string | null {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0057 : LangTextType.F0058, Lang.getTurnPhaseName(Helpers.getExisted(data.valueEqualTo)))
            : null;
    }
    function getDescForWecTilePlayerIndexEqualTo(data: Types.Undefinable<WarEvent.IWecTilePlayerIndexEqualTo>): string | null {
        if (data == null) {
            return null;
        }

        const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.gridIndex), ClientErrorCode.WarEventHelper_GetDescForWecTilePlayerIndexEqualTo_00);
        return Lang.getFormattedText(
            data.isNot ? LangTextType.F0079 : LangTextType.F0078,
            gridIndex.x,
            gridIndex.y,
            data.playerIndex
        );
    }
    function getDescForWecTileTypeEqualTo(data: Types.Undefinable<WarEvent.IWecTileTypeEqualTo>): string | null {
        if (data == null) {
            return null;
        }

        const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.gridIndex), ClientErrorCode.WarEventHelper_GetDescForWecTileTypeEqualTo_00);
        return Lang.getFormattedText(
            data.isNot ? LangTextType.F0081 : LangTextType.F0080,
            gridIndex.x,
            gridIndex.y,
            Lang.getTileName(Helpers.getExisted(data.tileType, ClientErrorCode.WarEventHelper_GetDescForWecTileTypeEqualTo_01))
        );
    }

    export function getDescForAction(action: IWarEventAction): string | null {
        // TODO: add functions for other actions
        return (getDescForWeaAddUnit(action.WeaAddUnit))
            || (getDescForWeaSetPlayerAliveState(action.WeaSetPlayerAliveState))
            || (getDescForWeaDialogue(action.WeaDialogue))
            || (getDescForWeaSetViewpoint(action.WeaSetViewpoint))
            || (getDescForWeaSetWeather(action.WeaSetWeather));
    }
    function getDescForWeaAddUnit(data: Types.Undefinable<WarEvent.IWeaAddUnit>): string | null {
        if (!data) {
            return null;
        } else {
            const unitCountDict = new Map<Types.UnitType, number>();
            for (const unitData of data.unitArray || []) {
                const unitType = Helpers.getExisted(unitData.unitData?.unitType);
                unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
            }

            const unitNameArray: string[] = [];
            for (const [unitType, count] of unitCountDict) {
                unitNameArray.push(`${Lang.getUnitName(unitType)} * ${count}`);
            }
            return Lang.getFormattedText(LangTextType.F0059, unitNameArray.join(", "));
        }
    }
    function getDescForWeaSetPlayerAliveState(data: Types.Undefinable<WarEvent.IWeaSetPlayerAliveState>): string | null {
        if (!data) {
            return null;
        } else {
            return Lang.getFormattedText(LangTextType.F0066, data.playerIndex, Lang.getPlayerAliveStateName(Helpers.getExisted(data.playerAliveState)));
        }
    }
    function getDescForWeaDialogue(data: Types.Undefinable<WarEvent.IWeaDialogue>): string | null {
        if (data == null) {
            return null;
        } else {
            const coIdSet = new Set<number>();
            for (const dialogueData of data.dataArray || []) {
                const coId = dialogueData.dataForCoDialogue?.coId;
                (coId != null) && (coIdSet.add(coId));
            }

            const coNameArray   : string[] = [];
            const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
            for (const coId of coIdSet) {
                const coName = ConfigManager.getCoNameAndTierText(configVersion, coId);
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
    function getDescForWeaSetWeather(data: Types.Undefinable<WarEvent.IWeaSetWeather>): string | null {
        if (data == null) {
            return null;
        }

        const turnsCount    = Helpers.getExisted(data.turnsCount, ClientErrorCode.WarEventHelper_GetDescForWeaSetWeather_00);
        const weatherName   = Lang.getWeatherName(Helpers.getExisted(data.weatherType, ClientErrorCode.WarEventHelper_GetDescForWeaSetWeather_01));
        return (turnsCount == 0)
            ? Lang.getFormattedText(LangTextType.F0077, weatherName)
            : Lang.getFormattedText(LangTextType.F0076, weatherName, turnsCount);
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

        // TODO add more tips for the future conditions.
        if      (condition.WecEventCalledCountTotalEqualTo)     { return getErrorTipForWecEventCalledCountTotalEqualTo(condition.WecEventCalledCountTotalEqualTo); }
        else if (condition.WecEventCalledCountTotalGreaterThan) { return getErrorTipForWecEventCalledCountTotalGreaterThan(condition.WecEventCalledCountTotalGreaterThan); }
        else if (condition.WecEventCalledCountTotalLessThan)    { return getErrorTipForWecEventCalledCountTotalLessThan(condition.WecEventCalledCountTotalLessThan); }
        else if (condition.WecPlayerAliveStateEqualTo)          { return getErrorTipForWecPlayerAliveStateEqualTo(condition.WecPlayerAliveStateEqualTo); }
        else if (condition.WecPlayerIndexInTurnEqualTo)         { return getErrorTipForWecPlayerIndexInTurnEqualTo(condition.WecPlayerIndexInTurnEqualTo); }
        else if (condition.WecPlayerIndexInTurnGreaterThan)     { return getErrorTipForWecPlayerIndexInTurnGreaterThan(condition.WecPlayerIndexInTurnGreaterThan); }
        else if (condition.WecPlayerIndexInTurnLessThan)        { return getErrorTipForWecPlayerIndexInTurnLessThan(condition.WecPlayerIndexInTurnLessThan); }
        else if (condition.WecTurnIndexEqualTo)                 { return getErrorTipForWecTurnIndexEqualTo(condition.WecTurnIndexEqualTo); }
        else if (condition.WecTurnIndexGreaterThan)             { return getErrorTipForWecTurnIndexGreaterThan(condition.WecTurnIndexGreaterThan); }
        else if (condition.WecTurnIndexLessThan)                { return getErrorTipForWecTurnIndexLessThan(condition.WecTurnIndexLessThan); }
        else if (condition.WecTurnIndexRemainderEqualTo)        { return getErrorTipForWecTurnIndexRemainderEqualTo(condition.WecTurnIndexRemainderEqualTo); }
        else if (condition.WecTurnPhaseEqualTo)                 { return getErrorTipForWecTurnPhaseEqualTo(condition.WecTurnPhaseEqualTo); }
        else if (condition.WecTilePlayerIndexEqualTo)           { return getErrorTipForWecTilePlayerIndexEqualTo(condition.WecTilePlayerIndexEqualTo, war); }
        else if (condition.WecTileTypeEqualTo)                  { return getErrorTipForWecTileTypeEqualTo(condition.WecTileTypeEqualTo, war); }
        else                                                    { return Lang.getText(LangTextType.A0187); }
    }
    function getErrorTipForWecEventCalledCountTotalEqualTo(data: WarEvent.IWecEventCalledCountTotalEqualTo): string | null {
        if ((data.countEqualTo == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecEventCalledCountTotalGreaterThan(data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | null {
        if ((data.countGreaterThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecEventCalledCountTotalLessThan(data: WarEvent.IWecEventCalledCountTotalLessThan): string | null {
        if ((data.countLessThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecPlayerAliveStateEqualTo(data: WarEvent.IWecPlayerAliveStateEqualTo): string | null {
        const aliveState = data.aliveStateEqualTo;
        if ((aliveState == null) || (data.playerIndexEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }
        if ((aliveState !== PlayerAliveState.Alive)   &&
            (aliveState !== PlayerAliveState.Dead)    &&
            (aliveState !== PlayerAliveState.Dying)
        ) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecPlayerIndexInTurnEqualTo(data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | null {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecPlayerIndexInTurnGreaterThan(data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | null {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecPlayerIndexInTurnLessThan(data: WarEvent.IWecPlayerIndexInTurnLessThan): string | null {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTurnIndexEqualTo(data: WarEvent.IWecTurnIndexEqualTo): string | null {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTurnIndexGreaterThan(data: WarEvent.IWecTurnIndexGreaterThan): string | null {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTurnIndexLessThan(data: WarEvent.IWecTurnIndexLessThan): string | null {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTurnIndexRemainderEqualTo(data: WarEvent.IWecTurnIndexRemainderEqualTo): string | null {
        const divider   = data.divider;
        const remainder = data.remainderEqualTo;
        if ((divider == null)       ||
            (remainder == null)     ||
            (data.isNot == null)    ||
            (divider < 1)           ||
            (remainder >= divider)
        ) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTurnPhaseEqualTo(data: WarEvent.IWecTurnPhaseEqualTo): string | null {
        const turnPhase = data.valueEqualTo;
        if ((turnPhase == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        if ((turnPhase !== Types.TurnPhaseCode.WaitBeginTurn)   &&
            (turnPhase !== Types.TurnPhaseCode.Main)
        ) {
            return Lang.getText(LangTextType.A0165);
        }

        return null;
    }
    function getErrorTipForWecTilePlayerIndexEqualTo(data: WarEvent.IWecTilePlayerIndexEqualTo, war: BwWar): string | null {
        const gridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
        if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, war.getTileMap().getMapSize()))) {
            return Lang.getText(LangTextType.A0250);
        }

        const playerIndex = data.playerIndex;
        if ((playerIndex == null)                                               ||
            (playerIndex < CommonConstants.WarNeutralPlayerIndex)               ||
            (playerIndex > war.getPlayerManager().getTotalPlayersCount(true))
        ) {
            return Lang.getText(LangTextType.A0255);
        }

        return null;
    }
    function getErrorTipForWecTileTypeEqualTo(data: WarEvent.IWecTileTypeEqualTo, war: BwWar): string | null {
        const gridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
        if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, war.getTileMap().getMapSize()))) {
            return Lang.getText(LangTextType.A0250);
        }

        const tileType = data.tileType;
        if ((tileType == null) || (!ConfigManager.checkIsValidTileType(tileType))) {
            return Lang.getText(LangTextType.A0256);
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

        // TODO add more tips for the future actions.
        if (action.WeaAddUnit) {
            return getErrorTipForWeaAddUnit(action.WeaAddUnit, war);
        } else if (action.WeaSetPlayerAliveState) {
            return getErrorTipForWeaSetPlayerAliveState(action.WeaSetPlayerAliveState);
        } else if (action.WeaDialogue) {
            return getErrorTipForWeaDialogue(action.WeaDialogue);
        } else if (action.WeaSetViewpoint) {
            return getErrorTipForWeaSetViewpoint(action.WeaSetViewpoint, war);
        } else if (action.WeaSetWeather) {
            return getErrorTipForWeaSetWeather(action.WeaSetWeather);
        } else {
            return Lang.getText(LangTextType.A0177);
        }
    }
    function getErrorTipForWeaAddUnit(data: WarEvent.IWeaAddUnit, war: BwWar): string | null {
        const unitArray     = data.unitArray || [];
        const unitsCount    = unitArray.length;
        if ((unitsCount <= 0) || (unitsCount > CommonConstants.WarEventActionAddUnitMaxCount)) {
            return `${Lang.getText(LangTextType.A0191)} (${unitsCount} / ${CommonConstants.WarEventActionAddUnitMaxCount})`;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const configVersion = war.getConfigVersion();
        const validator     = (v: ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit) => {
            const unitData = Helpers.getExisted(v.unitData);
            return (v.canBeBlockedByUnit != null)
                && (v.needMovableTile != null)
                && (unitData.loaderUnitId == null)
                && (!WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    playersCountUnneutral: CommonConstants.WarMaxPlayerIndex,
                    configVersion,
                }));
        };
        if (!unitArray.every(validator)) {
            return Lang.getText(LangTextType.A0169);
        }

        return null;
    }
    function getErrorTipForWeaSetPlayerAliveState(data: WarEvent.IWeaSetPlayerAliveState): string | null {
        const playerIndex = data.playerIndex;
        if ((playerIndex == null)                               ||
            (playerIndex > CommonConstants.WarMaxPlayerIndex)   ||
            (playerIndex < CommonConstants.WarFirstPlayerIndex)
        ) {
            return `${Lang.getText(LangTextType.A0212)} (${CommonConstants.WarFirstPlayerIndex} ~ ${CommonConstants.WarMaxPlayerIndex})`;
        }

        const playerAliveState: Types.Undefinable<PlayerAliveState> = data.playerAliveState;
        if (playerAliveState == null) {
            return Lang.getText(LangTextType.A0213);
        }

        if ((playerAliveState !== PlayerAliveState.Alive)   &&
            (playerAliveState !== PlayerAliveState.Dead)    &&
            (playerAliveState !== PlayerAliveState.Dying)
        ) {
            return Lang.getText(LangTextType.A0213);
        }

        return null;
    }
    function getErrorTipForWeaDialogue(data: WarEvent.IWeaDialogue): string | null {
        const backgroundId = data.backgroundId;
        if ((backgroundId != null) && (backgroundId > ConfigManager.getSystemDialogueBackgroundMaxId(Helpers.getExisted(ConfigManager.getLatestConfigVersion())))) {
            return Lang.getText(LangTextType.A0258);
        }

        const dialoguesArray    = data.dataArray || [];
        const dialoguesCount    = dialoguesArray.length;
        if ((dialoguesCount <= 0) || (dialoguesCount > CommonConstants.WarEventActionDialogueMaxCount)) {
            return `${Lang.getText(LangTextType.A0227)} (${dialoguesCount} / ${CommonConstants.WarEventActionDialogueMaxCount})`;
        }

        for (let i = 0; i < dialoguesCount; ++i) {
            if (getErrorTipForWeaDialogueData(dialoguesArray[i])) {
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
    function getErrorTipForWeaSetWeather(data: WarEvent.IWeaSetWeather): string | null {
        const weatherType = data.weatherType;
        if ((weatherType == null) || (!ConfigManager.checkIsValidWeatherType(weatherType))) {
            return Lang.getText(LangTextType.A0252);
        }

        if (data.turnsCount == null) {
            return Lang.getText(LangTextType.A0253);
        }

        return null;
    }
    export function getErrorTipForWeaDialogueData(dialogueData: WarEvent.WeaDialogue.IDataForDialogue): string | null {
        if (Object.keys(dialogueData).length !== 1) {
            return Lang.getText(LangTextType.A0230);
        }

        const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
        {
            const dataForCoDialogue = dialogueData.dataForCoDialogue;
            if (dataForCoDialogue) {
                const { coId, side, textArray, nameArray } = dataForCoDialogue;
                if ((coId == null)                                                                                          ||
                    (coId === CommonConstants.CoEmptyId)                                                                    ||
                    (ConfigManager.getCoNameAndTierText(configVersion, coId) == null)                                       ||
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
        if      (condition.WecTurnIndexEqualTo)                 { return ConditionType.WecTurnIndexEqualTo; }
        else if (condition.WecTurnIndexGreaterThan)             { return ConditionType.WecTurnIndexGreaterThan; }
        else if (condition.WecTurnIndexLessThan)                { return ConditionType.WecTurnIndexLessThan; }
        else if (condition.WecTurnIndexRemainderEqualTo)        { return ConditionType.WecTurnIndexRemainderEqualTo; }
        else if (condition.WecPlayerIndexInTurnEqualTo)         { return ConditionType.WecPlayerIndexInTurnEqualTo; }
        else if (condition.WecPlayerIndexInTurnGreaterThan)     { return ConditionType.WecPlayerIndexInTurnGreaterThan; }
        else if (condition.WecPlayerIndexInTurnLessThan)        { return ConditionType.WecPlayerIndexInTurnLessThan; }
        else if (condition.WecEventCalledCountTotalEqualTo)     { return ConditionType.WecEventCalledCountTotalEqualTo; }
        else if (condition.WecEventCalledCountTotalGreaterThan) { return ConditionType.WecEventCalledCountTotalGreaterThan; }
        else if (condition.WecEventCalledCountTotalLessThan)    { return ConditionType.WecEventCalledCountTotalLessThan; }
        else if (condition.WecPlayerAliveStateEqualTo)          { return ConditionType.WecPlayerAliveStateEqualTo; }
        else if (condition.WecTurnPhaseEqualTo)                 { return ConditionType.WecTurnPhaseEqualTo; }
        else if (condition.WecTilePlayerIndexEqualTo)           { return ConditionType.WecTilePlayerIndexEqualTo; }
        else if (condition.WecTileTypeEqualTo)                  { return ConditionType.WecTileTypeEqualTo; }
        else                                                    { return null; }
    }
    export function resetCondition(condition: IWarEventCondition, conditionType: ConditionType): void {
        const commonData = condition.WecCommonData;
        for (const key in condition) {
            delete condition[key as keyof IWarEventCondition];
        }
        condition.WecCommonData = commonData;

        if (conditionType === ConditionType.WecTurnIndexEqualTo) {
            condition.WecTurnIndexEqualTo = {
                isNot           : false,
                valueEqualTo    : CommonConstants.WarFirstTurnIndex,
            };
        } else if (conditionType === ConditionType.WecTurnIndexGreaterThan) {
            condition.WecTurnIndexGreaterThan = {
                isNot           : false,
                valueGreaterThan: CommonConstants.WarFirstTurnIndex,
            };
        } else if (conditionType === ConditionType.WecTurnIndexLessThan) {
            condition.WecTurnIndexLessThan = {
                isNot           : false,
                valueLessThan   : CommonConstants.WarFirstTurnIndex,
            };
        } else if (conditionType === ConditionType.WecTurnIndexRemainderEqualTo) {
            condition.WecTurnIndexRemainderEqualTo = {
                isNot           : false,
                divider         : 2,
                remainderEqualTo: 0,
            };
        } else if (conditionType === ConditionType.WecTurnPhaseEqualTo) {
            condition.WecTurnPhaseEqualTo = {
                isNot           : false,
                valueEqualTo    : Types.TurnPhaseCode.WaitBeginTurn,
            };
        } else if (conditionType === ConditionType.WecPlayerIndexInTurnEqualTo) {
            condition.WecPlayerIndexInTurnEqualTo = {
                isNot           : false,
                valueEqualTo    : CommonConstants.WarFirstPlayerIndex,
            };
        } else if (conditionType === ConditionType.WecPlayerIndexInTurnGreaterThan) {
            condition.WecPlayerIndexInTurnGreaterThan = {
                isNot           : false,
                valueGreaterThan: CommonConstants.WarFirstPlayerIndex,
            };
        } else if (conditionType === ConditionType.WecPlayerIndexInTurnLessThan) {
            condition.WecPlayerIndexInTurnLessThan = {
                isNot           : false,
                valueLessThan   : CommonConstants.WarFirstPlayerIndex,
            };
        } else if (conditionType === ConditionType.WecEventCalledCountTotalEqualTo) {
            condition.WecEventCalledCountTotalEqualTo = {
                isNot           : false,
                eventIdEqualTo  : 1,
                countEqualTo    : 1,
            };
        } else if (conditionType === ConditionType.WecEventCalledCountTotalGreaterThan) {
            condition.WecEventCalledCountTotalGreaterThan = {
                isNot           : false,
                eventIdEqualTo  : 1,
                countGreaterThan: 1,
            };
        } else if (conditionType === ConditionType.WecEventCalledCountTotalLessThan) {
            condition.WecEventCalledCountTotalLessThan = {
                isNot           : false,
                eventIdEqualTo  : 1,
                countLessThan   : 1,
            };
        } else if (conditionType === ConditionType.WecPlayerAliveStateEqualTo) {
            condition.WecPlayerAliveStateEqualTo = {
                isNot               : false,
                playerIndexEqualTo  : CommonConstants.WarFirstPlayerIndex,
                aliveStateEqualTo   : PlayerAliveState.Alive,
            };
        } else if (conditionType === ConditionType.WecTilePlayerIndexEqualTo) {
            condition.WecTilePlayerIndexEqualTo = {
                isNot       : false,
                gridIndex   : { x: 0, y: 0 },
                playerIndex : 0,
            };
        } else if (conditionType === ConditionType.WecTileTypeEqualTo) {
            condition.WecTileTypeEqualTo = {
                isNot       : false,
                gridIndex   : { x: 0, y: 0 },
                tileType    : Types.TileType.Plain,
            };
        } else {
            // TODO handle more condition types.
            throw Helpers.newError(`Invalid conditionType: ${conditionType}.`, ClientErrorCode.WarEventHelper_ResetCondition_00);
        }
    }

    export function openConditionModifyPanel({ fullData, condition, war }: {
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
        war         : BwWar;
    }): void {
        // TODO handle more condition types.
        TwnsWeConditionModifyPanel1.WeConditionModifyPanel1.hide();
        TwnsWeConditionModifyPanel2.WeConditionModifyPanel2.hide();
        TwnsWeConditionModifyPanel3.WeConditionModifyPanel3.hide();
        TwnsWeConditionModifyPanel4.WeConditionModifyPanel4.hide();
        TwnsWeConditionModifyPanel5.WeConditionModifyPanel5.hide();
        TwnsWeConditionModifyPanel6.WeConditionModifyPanel6.hide();
        TwnsWeConditionModifyPanel7.WeConditionModifyPanel7.hide();
        TwnsWeConditionModifyPanel8.WeConditionModifyPanel8.hide();
        TwnsWeConditionModifyPanel9.WeConditionModifyPanel9.hide();
        TwnsWeConditionModifyPanel10.WeConditionModifyPanel10.hide();
        TwnsWeConditionModifyPanel11.WeConditionModifyPanel11.hide();
        TwnsWeConditionModifyPanel12.WeConditionModifyPanel12.hide();
        TwnsWeConditionModifyPanel13.WeConditionModifyPanel13.hide();
        TwnsWeConditionModifyPanel14.WeConditionModifyPanel14.hide();

        if      (condition.WecTurnIndexEqualTo)                 { TwnsWeConditionModifyPanel1.WeConditionModifyPanel1.show({ fullData, condition, war }); }
        else if (condition.WecTurnIndexGreaterThan)             { TwnsWeConditionModifyPanel2.WeConditionModifyPanel2.show({ fullData, condition, war }); }
        else if (condition.WecTurnIndexLessThan)                { TwnsWeConditionModifyPanel3.WeConditionModifyPanel3.show({ fullData, condition, war }); }
        else if (condition.WecTurnIndexRemainderEqualTo)        { TwnsWeConditionModifyPanel4.WeConditionModifyPanel4.show({ fullData, condition, war }); }
        else if (condition.WecTurnPhaseEqualTo)                 { TwnsWeConditionModifyPanel5.WeConditionModifyPanel5.show({ fullData, condition, war }); }
        else if (condition.WecPlayerIndexInTurnEqualTo)         { TwnsWeConditionModifyPanel6.WeConditionModifyPanel6.show({ fullData, condition, war }); }
        else if (condition.WecPlayerIndexInTurnGreaterThan)     { TwnsWeConditionModifyPanel7.WeConditionModifyPanel7.show({ fullData, condition, war }); }
        else if (condition.WecPlayerIndexInTurnLessThan)        { TwnsWeConditionModifyPanel8.WeConditionModifyPanel8.show({ fullData, condition, war }); }
        else if (condition.WecEventCalledCountTotalEqualTo)     { TwnsWeConditionModifyPanel9.WeConditionModifyPanel9.show({ fullData, condition, war }); }
        else if (condition.WecEventCalledCountTotalGreaterThan) { TwnsWeConditionModifyPanel10.WeConditionModifyPanel10.show({ fullData, condition, war }); }
        else if (condition.WecEventCalledCountTotalLessThan)    { TwnsWeConditionModifyPanel11.WeConditionModifyPanel11.show({ fullData, condition, war }); }
        else if (condition.WecPlayerAliveStateEqualTo)          { TwnsWeConditionModifyPanel12.WeConditionModifyPanel12.show({ fullData, condition, war }); }
        else if (condition.WecTilePlayerIndexEqualTo)           { TwnsWeConditionModifyPanel13.WeConditionModifyPanel13.show({ fullData, condition, war }); }
        else if (condition.WecTileTypeEqualTo)                  { TwnsWeConditionModifyPanel14.WeConditionModifyPanel14.show({ fullData, condition, war }); }
        else                                                    { throw Helpers.newError(`Invalid condition.`, ClientErrorCode.WarEventHelper_OpenConditionModifyPanel_00); }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // action types
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getActionTypeArray(): ActionType[] {
        return ACTION_TYPE_ARRAY;
    }
    export function getActionType(action: IWarEventAction): ActionType | null {
        // TODO: handle future actions.
        if (action.WeaAddUnit) {
            return ActionType.AddUnit;
        } else if (action.WeaSetPlayerAliveState) {
            return ActionType.SetPlayerAliveState;
        } else if (action.WeaDialogue) {
            return ActionType.Dialogue;
        } else if (action.WeaSetViewpoint) {
            return ActionType.SetViewpoint;
        } else if (action.WeaSetWeather) {
            return ActionType.SetWeather;
        } else {
            return null;
        }
    }
    export function resetAction(action: IWarEventAction, actionType: ActionType): void {
        const commonData = action.WeaCommonData;
        for (const key in action) {
            delete action[key as keyof IWarEventAction];
        }
        action.WeaCommonData = commonData;

        // TODO handle future actions.
        if (actionType === ActionType.AddUnit) {
            action.WeaAddUnit = {
                unitArray   : [],
            };
        } else if (actionType === ActionType.SetPlayerAliveState) {
            action.WeaSetPlayerAliveState = {
                playerIndex     : 1,
                playerAliveState: PlayerAliveState.Alive,
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
                weatherType : Types.WeatherType.Clear,
                turnsCount  : 0,
            };
        } else {
            throw Helpers.newError(`Invalid actionType: ${actionType}.`, ClientErrorCode.WarEventHelper_ResetAction_00);
        }
    }

    export function openActionModifyPanel(war: BwWar, fullData: IWarEventFullData, action: IWarEventAction): void {
        // TODO handle more action types.
        TwnsWeActionModifyPanel1.WeActionModifyPanel1.hide();
        TwnsWeActionModifyPanel2.WeActionModifyPanel2.hide();
        TwnsWeActionModifyPanel3.WeActionModifyPanel3.hide();
        TwnsWeActionModifyPanel4.WeActionModifyPanel4.hide();
        TwnsWeActionModifyPanel5.WeActionModifyPanel5.hide();

        if (action.WeaAddUnit) {
            TwnsWeActionModifyPanel1.WeActionModifyPanel1.show({ war, fullData, action });
        } else if (action.WeaSetPlayerAliveState) {
            TwnsWeActionModifyPanel2.WeActionModifyPanel2.show({ war, fullData, action });
        } else if (action.WeaDialogue) {
            TwnsWeActionModifyPanel3.WeActionModifyPanel3.show({ war, fullData, action });
        } else if (action.WeaSetViewpoint) {
            TwnsWeActionModifyPanel4.WeActionModifyPanel4.show({ war, fullData, action });
        } else if (action.WeaSetWeather) {
            TwnsWeActionModifyPanel5.WeActionModifyPanel5.show({ war, fullData, action });
        } else {
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
                    WecPlayerIndexInTurnEqualTo : {
                        valueEqualTo    : 1,
                        isNot           : false,
                    },
                });
                conditionArray.sort((v1, v2) => Helpers.getExisted(v1.WecCommonData?.conditionId) - Helpers.getExisted(v2.WecCommonData?.conditionId));

                conditionIdArray.push(conditionId);
                conditionIdArray.sort((v1, v2) => v1 - v2);

                return conditionId;
            }
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
    export function getDefaultAddUnitData(): ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit {
        return {
            canBeBlockedByUnit  : true,
            needMovableTile     : true,
            unitData            : {
                gridIndex       : { x: 0, y: 0 },
                playerIndex     : CommonConstants.WarFirstPlayerIndex,
                unitType        : Types.UnitType.Infantry,
            },
        };
    }
    export function getDefaultCoDialogueData(): ProtoTypes.WarEvent.WeaDialogue.IDataForDialogue {
        return {
            dataForCoDialogue: {
                coId        : ConfigManager.getCoIdArrayForDialogue(Helpers.getExisted(ConfigManager.getLatestConfigVersion()))[0],
                side        : Types.WarEventActionDialogueSide.Left,
                textArray   : [
                    { languageType: Lang.getCurrentLanguageType(), text: `...` },
                ],
            },
        };
    }
    export function getDefaultAsideData(): ProtoTypes.WarEvent.WeaDialogue.IDataForDialogue {
        return {
            dataForAside: {
                textArray   : [
                    { languageType: Lang.getCurrentLanguageType(), text: `...` },
                ],
            },
        };
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

        const eventData = getEvent(fullData, eventId);
        if (eventData == null) {
            return false;
        }

        if (eventData.actionIdArray == null) {
            eventData.actionIdArray = [];
        }

        const actionIdArray = eventData.actionIdArray;
        Helpers.deleteElementFromArray(actionIdArray, oldActionId);
        if (actionIdArray.indexOf(newActionId) < 0) {
            actionIdArray.push(newActionId);
            actionIdArray.sort((v1, v2) => v1 - v2);
        }

        return true;
    }
}

// export default WarEventHelper;
