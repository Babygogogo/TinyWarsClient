
namespace TinyWars.BaseWar.BwWarEventHelper {
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import Lang                     = Utility.Lang;
    import Notify                   = Utility.Notify;
    import Types                    = Utility.Types;
    import FloatText                = Utility.FloatText;
    import ConfigManager            = Utility.ConfigManager;
    import BwSettingsHelper         = BaseWar.BwSettingsHelper;
    import WarMapModel              = WarMap.WarMapModel;
    import CommonHelpPanel          = Common.CommonHelpPanel;
    import WarEvent                 = ProtoTypes.WarEvent;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IMapRawData              = ProtoTypes.Map.IMapRawData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import CommonConstants          = Utility.ConfigManager.COMMON_CONSTANTS;

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

        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if (playersCountUnneutral == null) {
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
                    playersCountUnneutral,
                    configVersion,
                    mapSize ,
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
        if ((commonData == null) || (commonData.isNot == null)) {
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
        if ((conditionIdArray.length > CommonConstants.WarEventMaxConditionsPerNode)         ||
            (subNodeIdArray.length > CommonConstants.WarEventMaxSubConditionNodesPerNode)    ||
            (conditionIdArray.length + subNodeIdArray.length <= 0)
        ) {
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

        const usedNodeIdList    = [currNodeId];
        const usedNodeIdSet     = new Set<number>();
        for (let i = 0; i < usedNodeIdList.length; ++i) {
            const nodeId = usedNodeIdList[i];
            if (usedNodeIdSet.has(nodeId)) {
                return false;
            }
            usedNodeIdSet.add(nodeId);

            const subNode = nodeDict.get(nodeId);
            if (subNode == null) {
                return false;
            }

            const idArray = subNode.subNodeIdArray;
            if (idArray) {
                usedNodeIdList.push(...idArray);
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
    export function getDescForCondition(con: IWarEventCondition): string {
        const commonData = con.WecCommonData;
        return (getDescForWecEventCalledCountTotalEqualTo(commonData, con.WecEventCalledCountTotalEqualTo))
            || (getDescForWecEventCalledCountTotalGreaterThan(commonData, con.WecEventCalledCountTotalGreaterThan))
            || (getDescForWecEventCalledCountTotalLessThan(commonData, con.WecEventCalledCountTotalLessThan))
            || (getDescForWecPlayerAliveStateEqualTo(commonData, con.WecPlayerAliveStateEqualTo))
            || (getDescForWecPlayerIndexInTurnEqualTo(commonData, con.WecPlayerIndexInTurnEqualTo))
            || (getDescForWecPlayerIndexInTurnGreaterThan(commonData, con.WecPlayerIndexInTurnGreaterThan))
            || (getDescForWecPlayerIndexInTurnLessThan(commonData, con.WecPlayerIndexInTurnLessThan))
            || (getDescForWecTurnIndexEqualTo(commonData, con.WecTurnIndexEqualTo))
            || (getDescForWecTurnIndexGreaterThan(commonData, con.WecTurnIndexGreaterThan))
            || (getDescForWecTurnIndexLessThan(commonData, con.WecTurnIndexLessThan))
            || (getDescForWecTurnIndexRemainderEqualTo(commonData, con.WecTurnIndexRemainderEqualTo))
            || (getDescForWecTurnPhaseEqualTo(commonData, con.WecTurnPhaseEqualTo));
    }
    function getDescForWecEventCalledCountTotalEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecEventCalledCountTotalEqualTo): string | undefined {
        const { eventIdEqualTo, countEqualTo } = data;

    }
    function getDescForWecEventCalledCountTotalGreaterThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | undefined {

    }
    function getDescForWecEventCalledCountTotalLessThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecEventCalledCountTotalLessThan): string | undefined {

    }
    function getDescForWecPlayerAliveStateEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecPlayerAliveStateEqualTo): string | undefined {

    }
    function getDescForWecPlayerIndexInTurnEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | undefined {

    }
    function getDescForWecPlayerIndexInTurnGreaterThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | undefined {

    }
    function getDescForWecPlayerIndexInTurnLessThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecPlayerIndexInTurnLessThan): string | undefined {

    }
    function getDescForWecTurnIndexEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecTurnIndexEqualTo): string | undefined {

    }
    function getDescForWecTurnIndexGreaterThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecTurnIndexGreaterThan): string | undefined {

    }
    function getDescForWecTurnIndexLessThan(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecTurnIndexLessThan): string | undefined {

    }
    function getDescForWecTurnIndexRemainderEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecTurnIndexRemainderEqualTo): string | undefined {

    }
    function getDescForWecTurnPhaseEqualTo(commonData: WarEvent.IWecCommonData, data: WarEvent.IWecTurnPhaseEqualTo): string | undefined {

    }
}
