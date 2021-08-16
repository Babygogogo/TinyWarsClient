
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import TwnsMeWar                    from "../../mapEditor/model/MeWar";
import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Helpers                      from "../../tools/helpers/Helpers";
import Logger                       from "../../tools/helpers/Logger";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
import TwnsWeActionModifyPanel1     from "../view/WeActionModifyPanel1";
import TwnsWeActionModifyPanel2     from "../view/WeActionModifyPanel2";
import TwnsWeConditionModifyPanel1  from "../view/WeConditionModifyPanel1";
import TwnsWeConditionModifyPanel10 from "../view/WeConditionModifyPanel10";
import TwnsWeConditionModifyPanel11 from "../view/WeConditionModifyPanel11";
import TwnsWeConditionModifyPanel12 from "../view/WeConditionModifyPanel12";
import TwnsWeConditionModifyPanel2  from "../view/WeConditionModifyPanel2";
import TwnsWeConditionModifyPanel3  from "../view/WeConditionModifyPanel3";
import TwnsWeConditionModifyPanel4  from "../view/WeConditionModifyPanel4";
import TwnsWeConditionModifyPanel5  from "../view/WeConditionModifyPanel5";
import TwnsWeConditionModifyPanel6  from "../view/WeConditionModifyPanel6";
import TwnsWeConditionModifyPanel7  from "../view/WeConditionModifyPanel7";
import TwnsWeConditionModifyPanel8  from "../view/WeConditionModifyPanel8";
import TwnsWeConditionModifyPanel9  from "../view/WeConditionModifyPanel9";

namespace WarEventHelper {
    import MeWar                    = TwnsMeWar.MeWar;
    import WeConditionModifyPanel1  = TwnsWeConditionModifyPanel1.WeConditionModifyPanel1;
    import WeConditionModifyPanel10 = TwnsWeConditionModifyPanel10.WeConditionModifyPanel10;
    import WeConditionModifyPanel11 = TwnsWeConditionModifyPanel11.WeConditionModifyPanel11;
    import WeConditionModifyPanel12 = TwnsWeConditionModifyPanel12.WeConditionModifyPanel12;
    import WeConditionModifyPanel2  = TwnsWeConditionModifyPanel2.WeConditionModifyPanel2;
    import WeConditionModifyPanel3  = TwnsWeConditionModifyPanel3.WeConditionModifyPanel3;
    import WeConditionModifyPanel4  = TwnsWeConditionModifyPanel4.WeConditionModifyPanel4;
    import WeConditionModifyPanel5  = TwnsWeConditionModifyPanel5.WeConditionModifyPanel5;
    import WeConditionModifyPanel6  = TwnsWeConditionModifyPanel6.WeConditionModifyPanel6;
    import WeConditionModifyPanel7  = TwnsWeConditionModifyPanel7.WeConditionModifyPanel7;
    import WeConditionModifyPanel8  = TwnsWeConditionModifyPanel8.WeConditionModifyPanel8;
    import WeConditionModifyPanel9  = TwnsWeConditionModifyPanel9.WeConditionModifyPanel9;
    import WeActionModifyPanel1     = TwnsWeActionModifyPanel1.WeActionModifyPanel1;
    import WeActionModifyPanel2     = TwnsWeActionModifyPanel2.WeActionModifyPanel2;
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
    ];

    const ACTION_TYPE_ARRAY = [
        ActionType.AddUnit,
        ActionType.SetPlayerAliveState,
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
        return (fullData.actionArray || []).find(v => v.WeaCommonData.actionId === actionId);
    }

    export function getAllWarEventIdArray(fullData: IWarEventFullData | null | undefined): number[] {
        const idArray: number[] = [];
        for (const event of fullData ? fullData.eventArray || [] : []) {
            const eventId = event.eventId;
            if (eventId != null) {
                idArray.push(eventId);
            }
        }
        return idArray;
    }

    export function trimWarEventFullData(fullData: IWarEventFullData | null | undefined, eventIdArray: number[] | null | undefined): IWarEventFullData {
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
            const actionId      = commonData ? commonData.actionId : undefined;
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
            const conditionId   = commonData ? commonData.conditionId : undefined;
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
            if (!checkIsValidWarEventCondition({ condition, eventDict })) {
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

        const playerAliveState: Types.PlayerAliveState | null | undefined = actionData.playerAliveState;
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
                const subData = data.dataForNeutralDialogue;
                if ((subData) && (!checkIsValidDataForNeutralDialogue(subData))) {
                    return false;
                }
            }
        }

        return true;
    }
    function checkIsValidDataForCoDialogue(data: ProtoTypes.WarEvent.WeaDialogue.IDataForCoDialogue): boolean {
        const configVersion = ConfigManager.getLatestFormalVersion();
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

        return true;
    }
    function checkIsValidDataForNeutralDialogue(data: ProtoTypes.WarEvent.WeaDialogue.IDataForNeutralDialogue): boolean {
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
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0035 : LangTextType.F0036, data.eventIdEqualTo, data.countEqualTo)
            : undefined;
    }
    function getDescForWecEventCalledCountTotalGreaterThan(data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0037 : LangTextType.F0038, data.eventIdEqualTo, data.countGreaterThan)
            : undefined;
    }
    function getDescForWecEventCalledCountTotalLessThan(data: WarEvent.IWecEventCalledCountTotalLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0039 : LangTextType.F0040, data.eventIdEqualTo, data.countLessThan)
            : undefined;
    }
    function getDescForWecPlayerAliveStateEqualTo(data: WarEvent.IWecPlayerAliveStateEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0041 : LangTextType.F0042, data.playerIndexEqualTo, Lang.getPlayerAliveStateName(data.aliveStateEqualTo))
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnEqualTo(data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0043 : LangTextType.F0044, data.valueEqualTo)
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnGreaterThan(data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0045 : LangTextType.F0046, data.valueGreaterThan)
            : undefined;
    }
    function getDescForWecPlayerIndexInTurnLessThan(data: WarEvent.IWecPlayerIndexInTurnLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0047 : LangTextType.F0048, data.valueLessThan)
            : undefined;
    }
    function getDescForWecTurnIndexEqualTo(data: WarEvent.IWecTurnIndexEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0049 : LangTextType.F0050, data.valueEqualTo)
            : undefined;
    }
    function getDescForWecTurnIndexGreaterThan(data: WarEvent.IWecTurnIndexGreaterThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0051 : LangTextType.F0052, data.valueGreaterThan)
            : undefined;
    }
    function getDescForWecTurnIndexLessThan(data: WarEvent.IWecTurnIndexLessThan): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0053 : LangTextType.F0054, data.valueLessThan)
            : undefined;
    }
    function getDescForWecTurnIndexRemainderEqualTo(data: WarEvent.IWecTurnIndexRemainderEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0055 : LangTextType.F0056, data.divider, data.remainderEqualTo)
            : undefined;
    }
    function getDescForWecTurnPhaseEqualTo(data: WarEvent.IWecTurnPhaseEqualTo): string | undefined {
        return (data)
            ? Lang.getFormattedText(!data.isNot ? LangTextType.F0057 : LangTextType.F0058, Lang.getTurnPhaseName(data.valueEqualTo))
            : undefined;
    }

    export function getDescForAction(action: IWarEventAction): string | undefined {
        // TODO: add functions for other actions
        return (getDescForWeaAddUnit(action.WeaAddUnit))
            || (getDescForWeaSetPlayerAliveState(action.WeaSetPlayerAliveState));
    }
    function getDescForWeaAddUnit(data: WarEvent.IWeaAddUnit): string | undefined {
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
            return Lang.getFormattedText(LangTextType.F0059, unitNameArray.join(", "));
        }
    }
    function getDescForWeaSetPlayerAliveState(data: WarEvent.IWeaSetPlayerAliveState): string | undefined {
        if (!data) {
            return undefined;
        } else {
            return Lang.getFormattedText(LangTextType.F0066, data.playerIndex, Lang.getPlayerAliveStateName(data.playerAliveState));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // error tips
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorTipForEvent(fullData: IWarEventFullData, event: IWarEvent): string | undefined {
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

        return undefined;
    }

    export function getErrorTipForEventCallCountInPlayerTurn(event: IWarEvent): string | undefined {
        const count = event.maxCallCountInPlayerTurn;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountInPlayerTurn)) {
            return Lang.getText(LangTextType.A0181);
        }

        return undefined;
    }

    export function getErrorTipForEventCallCountTotal(event: IWarEvent): string | undefined {
        const count = event.maxCallCountTotal;
        if ((count == null) || (count < 1) || (count > CommonConstants.WarEventMaxCallCountTotal)) {
            return Lang.getText(LangTextType.A0181);
        }

        return undefined;
    }

    export function getErrorTipForConditionNode(fullData: IWarEventFullData, node: IWarEventConditionNode): string | undefined {
        const nodesCount = (fullData.conditionNodeArray || []).length;
        if (nodesCount > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return `${Lang.getText(LangTextType.A0183)} (${nodesCount}/${CommonConstants.WarEventMaxConditionNodesPerMap})`;
        }

        if (((node.subNodeIdArray || []).length) + ((node.conditionIdArray || []).length) <= 0) {
            return Lang.getText(LangTextType.A0161);
        }

        const nodeId            = node.nodeId;
        const duplicatedNodeId  = getDuplicatedSubNodeId(fullData, nodeId);
        if (duplicatedNodeId != null) {
            return Lang.getFormattedText(LangTextType.F0061, `N${duplicatedNodeId}`);
        }

        const duplicatedConditionId = getDuplicatedConditionId(fullData, nodeId);
        if (duplicatedConditionId != null) {
            return Lang.getFormattedText(LangTextType.F0062, `C${duplicatedConditionId}`);
        }

        return undefined;
    }

    export function getErrorTipForCondition(fullData: IWarEventFullData, condition: IWarEventCondition): string | undefined {
        const conditionsCount = (fullData.conditionArray || []).length;
        if (conditionsCount > CommonConstants.WarEventMaxConditionsPerMap) {
            return `${Lang.getText(LangTextType.A0185)} (${conditionsCount}/${CommonConstants.WarEventMaxConditionsPerMap})`;
        }

        if (Object.keys(condition).length !== 2) {
            return Lang.getText(LangTextType.A0187);
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
            return Lang.getText(LangTextType.A0187);
        }
    }
    function getErrorTipForWecEventCalledCountTotalEqualTo(data: WarEvent.IWecEventCalledCountTotalEqualTo): string | undefined {
        if ((data.countEqualTo == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecEventCalledCountTotalGreaterThan(data: WarEvent.IWecEventCalledCountTotalGreaterThan): string | undefined {
        if ((data.countGreaterThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecEventCalledCountTotalLessThan(data: WarEvent.IWecEventCalledCountTotalLessThan): string | undefined {
        if ((data.countLessThan == null) || (data.eventIdEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerAliveStateEqualTo(data: WarEvent.IWecPlayerAliveStateEqualTo): string | undefined {
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

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnEqualTo(data: WarEvent.IWecPlayerIndexInTurnEqualTo): string | undefined {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnGreaterThan(data: WarEvent.IWecPlayerIndexInTurnGreaterThan): string | undefined {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecPlayerIndexInTurnLessThan(data: WarEvent.IWecPlayerIndexInTurnLessThan): string | undefined {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexEqualTo(data: WarEvent.IWecTurnIndexEqualTo): string | undefined {
        if ((data.valueEqualTo == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexGreaterThan(data: WarEvent.IWecTurnIndexGreaterThan): string | undefined {
        if ((data.valueGreaterThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnIndexLessThan(data: WarEvent.IWecTurnIndexLessThan): string | undefined {
        if ((data.valueLessThan == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
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
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }
    function getErrorTipForWecTurnPhaseEqualTo(data: WarEvent.IWecTurnPhaseEqualTo): string | undefined {
        const turnPhase = data.valueEqualTo;
        if ((turnPhase == null) || (data.isNot == null)) {
            return Lang.getText(LangTextType.A0165);
        }

        if ((turnPhase !== Types.TurnPhaseCode.WaitBeginTurn)   &&
            (turnPhase !== Types.TurnPhaseCode.Main)
        ) {
            return Lang.getText(LangTextType.A0165);
        }

        return undefined;
    }

    export function getErrorTipForAction(fullData: IWarEventFullData, action: IWarEventAction, war: MeWar): string | undefined {
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
        } else {
            return Lang.getText(LangTextType.A0177);
        }
    }
    function getErrorTipForWeaAddUnit(data: WarEvent.IWeaAddUnit, war: MeWar): string | undefined {
        const unitArray     = data.unitArray || [];
        const unitsCount    = unitArray.length;
        if ((unitsCount <= 0) || (unitsCount > CommonConstants.WarEventActionAddUnitMaxCount)) {
            return `${Lang.getText(LangTextType.A0191)} (${unitsCount} / ${CommonConstants.WarEventActionAddUnitMaxCount})`;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const configVersion = war.getConfigVersion();
        const validator     = (v: ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit) => {
            const unitData = v.unitData;
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

        return undefined;
    }
    function getErrorTipForWeaSetPlayerAliveState(data: WarEvent.IWeaSetPlayerAliveState): string | undefined {
        const playerIndex = data.playerIndex;
        if ((playerIndex == null)                               ||
            (playerIndex > CommonConstants.WarMaxPlayerIndex)   ||
            (playerIndex < CommonConstants.WarFirstPlayerIndex)
        ) {
            return `${Lang.getText(LangTextType.A0212)} (${CommonConstants.WarFirstPlayerIndex} ~ ${CommonConstants.WarMaxPlayerIndex})`;
        }

        const playerAliveState: PlayerAliveState | null | undefined = data.playerAliveState;
        if (playerAliveState == null) {
            return Lang.getText(LangTextType.A0213);
        }

        if ((playerAliveState !== PlayerAliveState.Alive)   &&
            (playerAliveState !== PlayerAliveState.Dead)    &&
            (playerAliveState !== PlayerAliveState.Dying)
        ) {
            return Lang.getText(LangTextType.A0213);
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
            deletedActionsCount += checkAndDeleteUnusedAction(fullData, action.WeaCommonData.actionId);
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
                aliveStateEqualTo   : PlayerAliveState.Alive,
            };
        } else {
            // TODO handle more condition types.
            Logger.error(`WarEventHelper.resetCondition() invalid conditionType.`);
        }
    }

    export function openConditionModifyPanel(fullData: IWarEventFullData, condition: IWarEventCondition): void {
        // TODO handle more condition types.
        WeConditionModifyPanel1.hide();
        WeConditionModifyPanel2.hide();
        WeConditionModifyPanel3.hide();
        WeConditionModifyPanel4.hide();
        WeConditionModifyPanel5.hide();
        WeConditionModifyPanel6.hide();
        WeConditionModifyPanel7.hide();
        WeConditionModifyPanel8.hide();
        WeConditionModifyPanel9.hide();
        WeConditionModifyPanel10.hide();
        WeConditionModifyPanel11.hide();
        WeConditionModifyPanel12.hide();

        if (condition.WecTurnIndexEqualTo) {
            WeConditionModifyPanel1.show({ fullData, condition });
        } else if (condition.WecTurnIndexGreaterThan) {
            WeConditionModifyPanel2.show({ fullData, condition });
        } else if (condition.WecTurnIndexLessThan) {
            WeConditionModifyPanel3.show({ fullData, condition });
        } else if (condition.WecTurnIndexRemainderEqualTo) {
            WeConditionModifyPanel4.show({ fullData, condition });
        } else if (condition.WecTurnPhaseEqualTo) {
            WeConditionModifyPanel5.show({ fullData, condition });
        } else if (condition.WecPlayerIndexInTurnEqualTo) {
            WeConditionModifyPanel6.show({ fullData, condition });
        } else if (condition.WecPlayerIndexInTurnGreaterThan) {
            WeConditionModifyPanel7.show({ fullData, condition });
        } else if (condition.WecPlayerIndexInTurnLessThan) {
            WeConditionModifyPanel8.show({ fullData, condition });
        } else if (condition.WecEventCalledCountTotalEqualTo) {
            WeConditionModifyPanel9.show({ fullData, condition });
        } else if (condition.WecEventCalledCountTotalGreaterThan) {
            WeConditionModifyPanel10.show({ fullData, condition });
        } else if (condition.WecEventCalledCountTotalLessThan) {
            WeConditionModifyPanel11.show({ fullData, condition });
        } else if (condition.WecPlayerAliveStateEqualTo) {
            WeConditionModifyPanel12.show({ fullData, condition });
        } else {
            Logger.error(`WarEventHelper.openConditionModifyPanel() invalid condition.`);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // action types
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getActionTypeArray(): ActionType[] {
        return ACTION_TYPE_ARRAY;
    }
    export function getActionType(action: IWarEventAction): ActionType | undefined {
        // TODO: handle future actions.
        if (action.WeaAddUnit) {
            return ActionType.AddUnit;
        } else if (action.WeaSetPlayerAliveState) {
            return ActionType.SetPlayerAliveState;
        } else {
            return undefined;
        }
    }
    export function resetAction(action: IWarEventAction, actionType: ActionType): void {
        const commonData = action.WeaCommonData;
        for (const key in action) {
            delete action[key];
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
        } else {
            Logger.error(`WarEventHelper.resetCondition() invalid conditionType.`);
        }
    }

    export function openActionModifyPanel(war: BwWar, fullData: IWarEventFullData, action: IWarEventAction): void {
        // TODO handle more action types.
        WeActionModifyPanel1.hide();
        WeActionModifyPanel2.hide();

        if (action.WeaAddUnit) {
            WeActionModifyPanel1.show({ war, fullData, action });
        } else if (action.WeaSetPlayerAliveState) {
            WeActionModifyPanel2.show({ war, fullData, action });
        } else {
            Logger.error(`WarEventHelper.openActionModifyPanel() invalid action.`);
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
                        { languageType: LanguageType.Chinese, text: `${Lang.getText(LangTextType.B0469, LanguageType.Chinese)} #${eventId}` },
                        { languageType: LanguageType.English, text: `${Lang.getText(LangTextType.B0469, LanguageType.English)} #${eventId}` },
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
        if (parentNode == null) {
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
        if (conditionIdArray.indexOf(newConditionId) < 0) {
            conditionIdArray.push(newConditionId);
            conditionIdArray.sort((v1, v2) => v1 - v2);
        }

        return true;
    }

    export function addDefaultAction(fullData: IWarEventFullData, eventId: number): number | undefined {   // DONE
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
            if (!actionArray.some(v => v.WeaCommonData.actionId === actionId)) {
                actionArray.push({
                    WeaCommonData: {
                        actionId,
                    },
                    WeaAddUnit: {
                        unitArray: [],
                    },
                });
                actionArray.sort((v1, v2) => v1.WeaCommonData.actionId - v2.WeaCommonData.actionId);

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

    export function cloneAndReplaceActionInEvent({ fullData, eventId, actionIdForDelete, actionIdForClone }: {
        fullData            : IWarEventFullData;
        eventId             : number;
        actionIdForDelete   : number;
        actionIdForClone    : number;
    }): number | undefined {
        const eventData = getEvent(fullData, eventId);
        if (eventData == null) {
            return undefined;
        }

        const actionArray = fullData.actionArray;
        if (actionArray == null) {
            return undefined;
        }

        const srcAction = getAction(fullData, actionIdForClone);
        if (srcAction == null) {
            return undefined;
        }

        if (eventData.actionIdArray == null) {
            eventData.actionIdArray = [];
        }

        const actionIdArray = eventData.actionIdArray;
        const newAction     = Helpers.deepClone(srcAction);
        for (let actionId = 1; ; ++actionId) {
            if (!actionArray.some(v => v.WeaCommonData.actionId === actionId)) {
                newAction.WeaCommonData.actionId = actionId;
                actionArray.push(newAction);
                actionArray.sort((v1, v2) => v1.WeaCommonData.actionId - v2.WeaCommonData.actionId);

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

export default WarEventHelper;
