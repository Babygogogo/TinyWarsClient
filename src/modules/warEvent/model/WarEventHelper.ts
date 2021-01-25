
namespace TinyWars.WarEvent.WarEventHelper {
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import Lang                     = Utility.Lang;
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ConfigManager            = Utility.ConfigManager;
    import BwHelpers                = BaseWar.BwHelpers;
    import LanguageType             = Types.LanguageType;
    import WarEvent                 = ProtoTypes.WarEvent;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IMapRawData              = ProtoTypes.Map.IMapRawData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import ConditionType            = Types.WarEventConditionType;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

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
    ];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // getter
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getEvent(fullData: IWarEventFullData, eventId: number): IWarEvent | undefined {
        return (fullData.eventArray || []).find(v => v.eventId === eventId);
    }
    export function getCondition(fullData: IWarEventFullData, conditionId: number): IWarEventCondition | undefined {
        return (fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === conditionId);
    }
    export function getNode(fullData: IWarEventFullData, nodeId: number): IWarEventConditionNode | undefined {
        return (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
    }
    export function getAction(fullData: IWarEventFullData, actionId: number): IWarEventAction | undefined {
        return (fullData.actionArray || []).find(v => v.WarEventActionCommonData.actionId === actionId);
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
            const commonData = action.WarEventActionCommonData;
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
            if (!checkIsValidWarEventCondition({ condition, eventDict })) {
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

        const configVersion = ConfigManager.getLatestFormalVersion();
        if (configVersion == null) {
            return false;
        }

        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const mapSize: Types.MapSize = { width: mapWidth, height: mapHeight };

        const actionAddUnit = action.WarEventActionAddUnit;
        if (actionAddUnit) {
            const { unitArray } = actionAddUnit;
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
                if ((needMovableTile == null) || (canBeBlockedByUnit) || (unitData == null)) {
                    return false;
                }

                if (unitData.loaderUnitId != null) {
                    return false;
                }

                if (!BwHelpers.checkIsUnitDataValidIgnoringUnitId({
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

        // TODO add more checkers when the action types grow.

        return false;
    }
    function checkIsValidWarEventCondition({ condition, eventDict }: {  // DONE
        condition   : IWarEventCondition;
        eventDict   : WarEventDict;
    }): boolean {
        if (Object.keys(condition).length !== 2) {
            return false;
        }

        const commonData = condition.WecCommonData;
        if (commonData == null) {
            return false;
        }

        const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
        if (conEventCalledCountTotalEqualTo) {
            return (conEventCalledCountTotalEqualTo.countEqualTo != null)
                && (conEventCalledCountTotalEqualTo.eventIdEqualTo != null);
        }

        const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
        if (conEventCalledCountTotalGreaterThan) {
            return (conEventCalledCountTotalGreaterThan.countGreaterThan != null)
                && (conEventCalledCountTotalGreaterThan.eventIdEqualTo != null);
        }

        const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
        if (conEventCalledCountTotalLessThan) {
            return (conEventCalledCountTotalLessThan.countLessThan != null)
                && (conEventCalledCountTotalLessThan.eventIdEqualTo != null);
        }

        const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
        if (conPlayerAliveStateEqualTo) {
            const { playerIndexEqualTo, aliveStateEqualTo } = conPlayerAliveStateEqualTo;

            if ((aliveStateEqualTo !== Types.PlayerAliveState.Alive)    &&
                (aliveStateEqualTo !== Types.PlayerAliveState.Dead)     &&
                (aliveStateEqualTo !== Types.PlayerAliveState.Dying)
            ) {
                return false;
            }

            if (playerIndexEqualTo == null) {
                return false;
            }

            return true;
        }

        const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
        if (conTurnIndexEqualTo) {
            return conTurnIndexEqualTo.valueEqualTo != null;
        }

        const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
        if (conTurnIndexGreaterThan) {
            return conTurnIndexGreaterThan.valueGreaterThan != null;
        }

        const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
        if (conTurnIndexLessThan) {
            return conTurnIndexLessThan.valueLessThan != null;
        }

        const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
        if (conTurnIndexRemainderEqualTo) {
            const { divider, remainderEqualTo } = conTurnIndexRemainderEqualTo;
            return (!!divider) && (remainderEqualTo != null);
        }

        const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
        if (conPlayerIndexInTurnEqualTo) {
            return conPlayerIndexInTurnEqualTo.valueEqualTo != null;
        }

        const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
        if (conPlayerIndexInTurnGreaterThan) {
            return conPlayerIndexInTurnGreaterThan.valueGreaterThan != null;
        }

        const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
        if (conPlayerIndexInTurnLessThan) {
            return conPlayerIndexInTurnLessThan.valueLessThan != null;
        }

        const conTurnPhaseEqualTo = condition.WecTurnPhaseEqualTo;
        if (conTurnPhaseEqualTo) {
            const value = conTurnPhaseEqualTo.valueEqualTo;
            return (value === Types.TurnPhaseCode.Main)
                || (value === Types.TurnPhaseCode.WaitBeginTurn);
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

        const usedConditionIdSet = new Set<number>(conditionIdArray);
        if (usedConditionIdSet.size !== conditionIdArray.length) {
            return false;
        }

        const usedNodeIdArray   = [currNodeId];
        const usedNodeIdSet     = new Set<number>();
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
                minTextLength   : 1
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
    export function getDescForCondition(con: IWarEventCondition): string | undefined {
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
            || (getDescForWecTurnPhaseEqualTo(con.WecTurnPhaseEqualTo));
    }
    function getDescForWecEventCalledCountTotalEqualTo(data: WarEvent.IWecEventCalledCountTotalEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0035 : Lang.Type.F0036, data.eventIdEqualTo, data.countEqualTo)
            : undefined;
    }
    function getDescForWecEventCalledCountTotalGreaterThan(data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0037 : Lang.Type.F0038, data.eventIdEqualTo, data.countGreaterThan)
            : undefined;
    }
    function getDescForWecEventCalledCountTotalLessThan(data: WarEvent.IWecEventCalledCountTotalLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0039 : Lang.Type.F0040, data.eventIdEqualTo, data.countLessThan)
            : undefined;
    }
    function getDescForWecPlayerAliveStateEqualTo(data: WarEvent.IWecPlayerAliveStateEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0041 : Lang.Type.F0042, data.playerIndexEqualTo, Lang.getPlayerAliveStateName(data.aliveStateEqualTo))
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnEqualTo(data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0043 : Lang.Type.F0044, data.valueEqualTo)
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnGreaterThan(data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0045 : Lang.Type.F0046, data.valueGreaterThan)
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnLessThan(data: WarEvent.IWecPlayerIndexInTurnLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0047 : Lang.Type.F0048, data.valueLessThan)
            : undefined;
    }
    function getDescForWecTurnIndexEqualTo(data: WarEvent.IWecTurnIndexEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0049 : Lang.Type.F0050, data.valueEqualTo)
            : undefined;
    }
    function getDescForWecTurnIndexGreaterThan(data: WarEvent.IWecTurnIndexGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0051 : Lang.Type.F0052, data.valueGreaterThan)
            : undefined;
    }
    function getDescForWecTurnIndexLessThan(data: WarEvent.IWecTurnIndexLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0053 : Lang.Type.F0054, data.valueLessThan)
            : undefined;
    }
    function getDescForWecTurnIndexRemainderEqualTo(data: WarEvent.IWecTurnIndexRemainderEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0055 : Lang.Type.F0056, data.divider, data.remainderEqualTo)
            : undefined;
    }
    function getDescForWecTurnPhaseEqualTo(data: WarEvent.IWecTurnPhaseEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? Lang.Type.F0057 : Lang.Type.F0058, Lang.getTurnPhaseName(data.valueEqualTo))
            : undefined;
    }

    export function getDescForAction(action: IWarEventAction): string | undefined {
        return getDescForWeaAddUnit(action.WarEventActionAddUnit);
    }
    function getDescForWeaAddUnit(data: WarEvent.IWarEventActionAddUnit): string | undefined {
        if (!data) {
            return undefined;
        } else {
            const unitCountDict = new Map<Types.UnitType, number>();
            for (const unitData of data.unitArray || []) {
                const unitType = unitData.unitData.unitType;
                unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
            }

            const unitNameArray: string[] = [];
            for (const [unitType, count] of unitCountDict) {
                unitNameArray.push(`${Lang.getUnitName(unitType)} * ${count}`);
            }
            return Lang.getFormattedText(Lang.Type.F0059, unitNameArray.join(", "));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // error tips
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorTipForEvent(fullData: IWarEventFullData, event: IWarEvent): string | undefined {
        const eventsCount = (fullData.eventArray || []).length;
        if (eventsCount > CommonConstants.WarEventMaxEventsPerMap) {
            return `${Lang.getText(Lang.Type.A0182)} (${eventsCount}/${CommonConstants.WarEventMaxEventsPerMap})`;
        }

        const actionsCount = (event.actionIdArray || []).length;
        if (actionsCount < 1) {
            return Lang.getText(Lang.Type.A0167);
        }
        if (actionsCount > CommonConstants.WarEventMaxActionsPerEvent) {
            return `${Lang.getText(Lang.Type.A0180)} (${actionsCount}/${CommonConstants.WarEventMaxActionsPerEvent})`;
        }

        const nodeId = event.conditionNodeId;
        if (nodeId == null) {
            return Lang.getText(Lang.Type.A0159);
        }

        return undefined;
    }

    export function getErrorTipForEventCallCountInPlayerTurn(event: IWarEvent): string | undefined {
        const count = event.maxCallCountInPlayerTurn;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountInPlayerTurn)) {
            return Lang.getText(Lang.Type.A0181);
        }

        return undefined;
    }

    export function getErrorTipForEventCallCountTotal(event: IWarEvent): string | undefined {
        const count = event.maxCallCountTotal;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountTotal)) {
            return Lang.getText(Lang.Type.A0181);
        }

        return undefined;
    }

    export function getErrorTipForConditionNode(fullData: IWarEventFullData, node: IWarEventConditionNode): string | undefined {
        const nodesCount = (fullData.conditionNodeArray || []).length;
        if (nodesCount > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return `${Lang.getText(Lang.Type.A0183)} (${nodesCount}/${CommonConstants.WarEventMaxConditionNodesPerMap})`;
        }

        if (((node.subNodeIdArray || []).length) + ((node.conditionIdArray || []).length) <= 0) {
            return Lang.getText(Lang.Type.A0161);
        }

        const nodeId            = node.nodeId;
        const duplicatedNodeId  = getDuplicatedSubNodeId(fullData, nodeId);
        if (duplicatedNodeId != null) {
            return Lang.getFormattedText(Lang.Type.F0061, `N${duplicatedNodeId}`);
        }

        const duplicatedConditionId = getDuplicatedConditionId(fullData, nodeId);
        if (duplicatedConditionId != null) {
            return Lang.getFormattedText(Lang.Type.F0062, `C${duplicatedConditionId}`);
        }

        return undefined;
    }

    export function getErrorTipForCondition(fullData: IWarEventFullData, condition: IWarEventCondition, eventId: number): string | undefined {
        const conditionsCount = (fullData.conditionArray || []).length;
        if (conditionsCount > CommonConstants.WarEventMaxConditionsPerMap) {
            return `${Lang.getText(Lang.Type.A0185)} (${conditionsCount}/${CommonConstants.WarEventMaxConditionsPerMap})`;
        }

        if (Object.keys(condition).length !== 2) {
            return Lang.getText(Lang.Type.A0187);
        }

        // TODO add more tips for the future conditions.
        if (condition.WecEventCalledCountTotalEqualTo) {
            return getErrorTipForWecEventCalledCountTotalEqualTo(condition.WecEventCalledCountTotalEqualTo);
        } else if (condition.WecEventCalledCountTotalGreaterThan) {
            return getErrorTipForWecEventCalledCountTotalGreaterThan(condition.WecEventCalledCountTotalGreaterThan);
        } else if (condition.WecEventCalledCountTotalLessThan) {
            return getErrorTipForWecEventCalledCountTotalLessThan(condition.WecEventCalledCountTotalLessThan);
        } else if (condition.WecPlayerAliveStateEqualTo) {
            return getErrorTipForWecPlayerAliveStateEqualTo(condition.WecPlayerAliveStateEqualTo);
        } else if (condition.WecPlayerIndexInTurnEqualTo) {
            return getErrorTipForWecPlayerIndexInTurnEqualTo(condition.WecPlayerIndexInTurnEqualTo);
        } else if (condition.WecPlayerIndexInTurnGreaterThan) {
            return getErrorTipForWecPlayerIndexInTurnGreaterThan(condition.WecPlayerIndexInTurnGreaterThan);
        } else if (condition.WecPlayerIndexInTurnLessThan) {
            return getErrorTipForWecPlayerIndexInTurnLessThan(condition.WecPlayerIndexInTurnLessThan);
        } else if (condition.WecTurnIndexEqualTo) {
            return getErrorTipForWecTurnIndexEqualTo(condition.WecTurnIndexEqualTo);
        } else if (condition.WecTurnIndexGreaterThan) {
            return getErrorTipForWecTurnIndexGreaterThan(condition.WecTurnIndexGreaterThan);
        } else if (condition.WecTurnIndexLessThan) {
            return getErrorTipForWecTurnIndexLessThan(condition.WecTurnIndexLessThan);
        } else if (condition.WecTurnIndexRemainderEqualTo) {
            return getErrorTipForWecTurnIndexRemainderEqualTo(condition.WecTurnIndexRemainderEqualTo);
        } else if (condition.WecTurnPhaseEqualTo) {
            return getErrorTipForWecTurnPhaseEqualTo(condition.WecTurnPhaseEqualTo);
        } else {
            return Lang.getText(Lang.Type.A0187);
        }
    }
    function getErrorTipForWecEventCalledCountTotalEqualTo(data: WarEvent.IWecEventCalledCountTotalEqualTo): string | undefined {
        if ((data.countEqualTo == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecEventCalledCountTotalGreaterThan(data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | undefined {
        if ((data.countGreaterThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecEventCalledCountTotalLessThan(data: WarEvent.IWecEventCalledCountTotalLessThan): string | undefined {
        if ((data.countLessThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerAliveStateEqualTo(data: WarEvent.IWecPlayerAliveStateEqualTo): string | undefined {
        const aliveState = data.aliveStateEqualTo;
        if ((aliveState == null) || (data.playerIndexEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }
        if ((aliveState !== Types.PlayerAliveState.Alive)   &&
            (aliveState !== Types.PlayerAliveState.Dead)    &&
            (aliveState !== Types.PlayerAliveState.Dying)
        ) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnEqualTo(data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | undefined {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnGreaterThan(data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | undefined {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnLessThan(data: WarEvent.IWecPlayerIndexInTurnLessThan): string | undefined {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexEqualTo(data: WarEvent.IWecTurnIndexEqualTo): string | undefined {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexGreaterThan(data: WarEvent.IWecTurnIndexGreaterThan): string | undefined {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexLessThan(data: WarEvent.IWecTurnIndexLessThan): string | undefined {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexRemainderEqualTo(data: WarEvent.IWecTurnIndexRemainderEqualTo): string | undefined {
        const divider   = data.divider;
        const remainder = data.remainderEqualTo;
        if ((divider == null)       ||
            (remainder == null)     ||
            (data.isNot == null)    ||
            (divider < 1)           ||
            (remainder >= divider)
        ) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnPhaseEqualTo(data: WarEvent.IWecTurnPhaseEqualTo): string | undefined {
        const turnPhase = data.valueEqualTo;
        if ((turnPhase == null) || (data.isNot == null)) {
            return Lang.getText(Lang.Type.A0165);
        }

        if ((turnPhase !== Types.TurnPhaseCode.WaitBeginTurn)   &&
            (turnPhase !== Types.TurnPhaseCode.Main)
        ) {
            return Lang.getText(Lang.Type.A0165);
        }

        return undefined;
    }

    export function getErrorTipForAction(fullData: IWarEventFullData, action: IWarEventAction, war: MapEditor.MeWar): string | undefined {
        const actionsCountTotal = (fullData.actionArray || []).length;
        if (actionsCountTotal > CommonConstants.WarEventMaxActionsPerMap) {
            return `${Lang.getText(Lang.Type.A0184)} (${actionsCountTotal}/${CommonConstants.WarEventMaxActionsPerMap})`;
        }

        if (Object.keys(action).length !== 2) {
            return Lang.getText(Lang.Type.A0177);
        }

        // TODO add more tips for the future actions.
        if (action.WarEventActionAddUnit) {
            return getErrorTipForWeaAddUnit(action.WarEventActionAddUnit, war);
        } else {
            return Lang.getText(Lang.Type.A0177);
        }
    }
    function getErrorTipForWeaAddUnit(data: WarEvent.IWarEventActionAddUnit, war: MapEditor.MeWar): string | undefined {
        const unitArray = data.unitArray;
        if ((unitArray == null) || (unitArray.length <= 0)) {
            return Lang.getText(Lang.Type.A0169);
        }

        const mapSize               = war.getTileMap().getMapSize();
        const configVersion         = war.getConfigVersion();
        const playersCountUnneutral = (war.getField() as MapEditor.MeField).getMaxPlayerIndex();
        if (unitArray.some(v => !BwHelpers.checkIsUnitDataValidIgnoringUnitId({
            unitData                : v.unitData,
            mapSize,
            playersCountUnneutral,
            configVersion,
        }))) {
            return Lang.getText(Lang.Type.A0169);
        }

        return undefined;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // export function checkIsNodeUsedByEvent(fullData: IWarEventFullData, nodeId: number, eventId: number): boolean {
    //     const event = (fullData.eventArray || []).find(v => v.eventId === eventId);
    //     if (event == null) {
    //         return undefined;
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
    //         return undefined;
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
    function getDuplicatedSubNodeId(fullData: IWarEventFullData, parentNodeId: number): number | undefined {
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
        return undefined;
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
    //         return undefined;
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
    function getDuplicatedConditionId(fullData: IWarEventFullData, parentNodeId: number): number | undefined {
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
        return undefined;
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
            deletedNodesCount += checkAndDeleteUnusedNode(fullData, node.nodeId, true);
        }

        let deletedConditionsCount = 0;
        for (const condition of (fullData.conditionArray || []).concat()) {
            deletedConditionsCount += checkAndDeleteUnusedCondition(fullData, condition.WecCommonData.conditionId);
        }

        let deletedActionsCount = 0;
        for (const action of (fullData.actionArray || []).concat()) {
            deletedActionsCount += checkAndDeleteUnusedAction(fullData, action.WarEventActionCommonData.actionId);
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
    export function getConditionType(condition: IWarEventCondition): ConditionType | undefined {
        if (condition.WecTurnIndexEqualTo) {
            return ConditionType.WecTurnIndexEqualTo;
        } else if (condition.WecTurnIndexGreaterThan) {
            return ConditionType.WecTurnIndexGreaterThan;
        } else if (condition.WecTurnIndexLessThan) {
            return ConditionType.WecTurnIndexLessThan;
        } else if (condition.WecTurnIndexRemainderEqualTo) {
            return ConditionType.WecTurnIndexRemainderEqualTo;
        } else if (condition.WecTurnPhaseEqualTo) {
            return ConditionType.WecTurnPhaseEqualTo;
        } else if (condition.WecPlayerIndexInTurnEqualTo) {
            return ConditionType.WecPlayerIndexInTurnEqualTo;
        } else if (condition.WecPlayerIndexInTurnGreaterThan) {
            return ConditionType.WecPlayerIndexInTurnGreaterThan;
        } else if (condition.WecPlayerIndexInTurnLessThan) {
            return ConditionType.WecPlayerIndexInTurnLessThan;
        } else if (condition.WecEventCalledCountTotalEqualTo) {
            return ConditionType.WecEventCalledCountTotalEqualTo;
        } else if (condition.WecEventCalledCountTotalGreaterThan) {
            return ConditionType.WecEventCalledCountTotalGreaterThan;
        } else if (condition.WecEventCalledCountTotalLessThan) {
            return ConditionType.WecEventCalledCountTotalLessThan;
        } else if (condition.WecPlayerAliveStateEqualTo) {
            return ConditionType.WecPlayerAliveStateEqualTo;
        } else {
            return undefined;
        }
    }
    export function resetCondition(condition: IWarEventCondition, conditionType: ConditionType): void {
        const commonData = condition.WecCommonData;
        for (const key in condition) {
            delete condition[key];
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
                aliveStateEqualTo   : Types.PlayerAliveState.Alive,
            };
        } else {
            Logger.error(`WarEventHelper.resetCondition() invalid conditionType.`);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // add/clone/replace
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function addEvent(fullData: IWarEventFullData): number | undefined {
        if (fullData.eventArray == null) {
            fullData.eventArray = [];
        }

        const eventArray = fullData.eventArray;
        for (let eventId = 1; ; ++eventId) {
            if (!eventArray.some(v => v.eventId === eventId)) {
                eventArray.push({
                    eventId,
                    eventNameArray          : [
                        { languageType: LanguageType.Chinese, text: `${Lang.getText(Lang.Type.B0469, LanguageType.Chinese)} #${eventId}` },
                        { languageType: LanguageType.English, text: `${Lang.getText(Lang.Type.B0469, LanguageType.English)} #${eventId}` },
                    ],
                    maxCallCountInPlayerTurn: 1,
                    maxCallCountTotal       : 1,
                    actionIdArray           : [],
                });
                eventArray.sort((v1, v2) => v1.eventId - v2.eventId);
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
    }): number | undefined {
        const nodeArray     = fullData.conditionNodeArray || [];
        const parentNode    = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return undefined;
        }

        for (let nodeId = 1; ; ++nodeId) {
            if (!nodeArray.some(v => v.nodeId === nodeId)) {
                nodeArray.push({
                    nodeId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                });
                nodeArray.sort((v1, v2) => v1.nodeId - v2.nodeId);

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
        nodeIdForDelete : number;
        nodeIdForClone  : number;
    }): number | undefined {
        const nodeArray = fullData.conditionNodeArray;
        if (nodeArray == null) {
            return undefined;
        }

        const parentNode = getNode(fullData, parentNodeId);
        if (parentNode == null) {
            return undefined;
        }

        const srcNode = getNode(fullData, nodeIdForClone);
        if (srcNode == null) {
            return undefined;
        }
        const newNode = Helpers.deepClone(srcNode);

        for (let nodeId = 1; ; ++nodeId) {
            if (!nodeArray.some(v => v.nodeId === nodeId)) {
                newNode.nodeId = nodeId;
                nodeArray.push(newNode);
                nodeArray.sort((v1, v2) => v1.nodeId - v2.nodeId);

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
    }): number | undefined {
        const event = getEvent(fullData, eventId);
        if (event == null) {
            return undefined;
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
                nodeArray.sort((v1, v2) => v1.nodeId - v2.nodeId);

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
        oldNodeId   : number;
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

    export function addDefaultCondition(fullData: IWarEventFullData, nodeId: number): number | undefined { // DONE
        const node = getNode(fullData, nodeId);
        if (node == null) {
            return undefined;
        }

        if (node.conditionIdArray == null) {
            node.conditionIdArray = [];
        }
        if (fullData.conditionArray == null) {
            fullData.conditionArray = [];
        }

        const conditionIdArray  = node.conditionIdArray;
        const conditionArray    = fullData.conditionArray;
        for (let conditionId = 1; ; ++conditionId) {
            if (!conditionArray.some(v => v.WecCommonData.conditionId === conditionId)) {
                conditionArray.push({
                    WecCommonData               : {
                        conditionId
                    },
                    WecPlayerIndexInTurnEqualTo : {
                        valueEqualTo    : 1,
                        isNot           : false,
                    },
                });
                conditionArray.sort((v1, v2) => v1.WecCommonData.conditionId - v2.WecCommonData.conditionId);

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
    }): number | undefined {
        const parentNode = getNode(fullData, parentNodeId);
        if (parentNodeId == null) {
            return undefined;
        }

        const conditionArray = fullData.conditionArray;
        if (conditionArray == null) {
            return undefined;
        }

        const srcCondition = getCondition(fullData, conditionIdForClone);
        if (srcCondition == null) {
            return undefined;
        }
        const newCondition = Helpers.deepClone(srcCondition);

        if (parentNode.conditionIdArray == null) {
            parentNode.conditionIdArray = [];
        }

        const conditionIdArray = parentNode.conditionIdArray;
        for (let conditionId = 1; ; ++conditionId) {
            if (!conditionArray.some(v => v.WecCommonData.conditionId === conditionId)) {
                newCondition.WecCommonData.conditionId = conditionId;
                conditionArray.push(newCondition);
                conditionArray.sort((v1, v2) => v1.WecCommonData.conditionId - v2.WecCommonData.conditionId);

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
        conditionIdArray.push(newConditionId);
        conditionIdArray.sort((v1, v2) => v1 - v2);

        return true;
    }

    export function addAction(fullData: IWarEventFullData, eventId: number): number | undefined {   // DONE
        const event = getEvent(fullData, eventId);
        if (event == null) {
            return undefined;
        }

        if (fullData.actionArray == null) {
            fullData.actionArray = [];
        }
        if (event.actionIdArray == null) {
            event.actionIdArray == [];
        }

        const actionArray           = fullData.actionArray;
        const eventActionIdArray    = event.actionIdArray;
        for (let actionId = 1; ; ++actionId) {
            if (!actionArray.some(v => v.WarEventActionCommonData.actionId === actionId)) {
                actionArray.push({
                    WarEventActionCommonData: {
                        actionId,
                    },
                    WarEventActionAddUnit: {
                        unitArray: [],
                    },
                });
                actionArray.sort((v1, v2) => v1.WarEventActionCommonData.actionId - v2.WarEventActionCommonData.actionId);

                eventActionIdArray.push(actionId);

                return actionId;
            }
        }
    }
}
