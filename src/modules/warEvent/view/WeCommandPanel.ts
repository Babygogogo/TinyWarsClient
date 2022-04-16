
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
// import TwnsMeWar                    from "../../mapEditor/model/MeWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeActionReplacePanel     from "./WeActionReplacePanel";
// import TwnsWeConditionReplacePanel  from "./WeConditionReplacePanel";
// import TwnsWeEventRenamePanel       from "./WeEventRenamePanel";
// import TwnsWeNodeReplacePanel       from "./WeNodeReplacePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeCommandPanel {
    import MeWar                    = Twns.MapEditor.MeWar;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import ColorValue               = Types.ColorValue;
    import WarEventDescType         = Types.WarEventDescType;

    export type OpenData = {
        war             : MeWar;
        descType        : WarEventDescType;
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    };
    export class WeCommandPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;

        private readonly _groupBtn!                     : eui.Group;
        private readonly _btnModifyEventName!           : TwnsUiButton.UiButton;
        private readonly _btnModifyMaxCallCountPerTurn! : TwnsUiButton.UiButton;
        private readonly _btnModifyMaxCallCountTotal!   : TwnsUiButton.UiButton;
        private readonly _btnInitSubNodeToEvent!        : TwnsUiButton.UiButton;
        private readonly _btnShallowCloneEvent!         : TwnsUiButton.UiButton;
        private readonly _btnDeepCloneEvent!            : TwnsUiButton.UiButton;
        private readonly _btnDeleteEvent!               : TwnsUiButton.UiButton;
        private readonly _btnSwitchNodeAndOr!           : TwnsUiButton.UiButton;
        private readonly _btnReplaceNode!               : TwnsUiButton.UiButton;
        private readonly _btnAddSubNodeToNode!          : TwnsUiButton.UiButton;
        private readonly _btnAddSubCondition!           : TwnsUiButton.UiButton;
        private readonly _btnShallowCloneNode!          : TwnsUiButton.UiButton;
        private readonly _btnDeepCloneNode!             : TwnsUiButton.UiButton;
        private readonly _btnDeleteNode!                : TwnsUiButton.UiButton;
        private readonly _btnModifyCondition!           : TwnsUiButton.UiButton;
        private readonly _btnReplaceCondition!          : TwnsUiButton.UiButton;
        private readonly _btnDeepCloneCondition!        : TwnsUiButton.UiButton;
        private readonly _btnDeleteCondition!           : TwnsUiButton.UiButton;
        private readonly _btnModifyAction!              : TwnsUiButton.UiButton;
        private readonly _btnReplaceAction!             : TwnsUiButton.UiButton;
        private readonly _btnAddAction!                 : TwnsUiButton.UiButton;
        private readonly _btnDeepCloneAction!           : TwnsUiButton.UiButton;
        private readonly _btnDeleteAction!              : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnModifyEventName,             callback: this._onTouchedBtnModifyEventName },
                { ui: this._btnModifyMaxCallCountPerTurn,   callback: this._onTouchedBtnModifyMaxCallCountPerTurn },
                { ui: this._btnModifyMaxCallCountTotal,     callback: this._onTouchedBtnModifyMaxCallCountTotal },
                { ui: this._btnInitSubNodeToEvent,          callback: this._onTouchedBtnInitSubNodeToEvent },
                { ui: this._btnShallowCloneEvent,           callback: this._onTouchedBtnShallowCloneEvent },
                { ui: this._btnDeepCloneEvent,              callback: this._onTouchedBtnDeepCloneEvent },
                { ui: this._btnDeleteEvent,                 callback: this._onTouchedBtnDeleteEvent },
                { ui: this._btnSwitchNodeAndOr,             callback: this._onTouchedBtnSwitchNodeAndOr },
                { ui: this._btnReplaceNode,                 callback: this._onTouchedBtnReplaceNode },
                { ui: this._btnAddSubNodeToNode,            callback: this._onTouchedBtnAddSubNodeToNode },
                { ui: this._btnAddSubCondition,             callback: this._onTouchedBtnAddSubCondition },
                { ui: this._btnShallowCloneNode,            callback: this._onTouchedBtnShallowCloneNode },
                { ui: this._btnDeepCloneNode,               callback: this._onTouchedBtnDeepCloneNode },
                { ui: this._btnDeleteNode,                  callback: this._onTouchedBtnDeleteNode },
                { ui: this._btnModifyCondition,             callback: this._onTouchedBtnModifyCondition },
                { ui: this._btnReplaceCondition,            callback: this._onTouchedBtnReplaceCondition },
                { ui: this._btnDeepCloneCondition,          callback: this._onTouchedBtnDeepCloneCondition },
                { ui: this._btnDeleteCondition,             callback: this._onTouchedBtnDeleteCondition },
                { ui: this._btnModifyAction,                callback: this._onTouchedBtnModifyAction },
                { ui: this._btnReplaceAction,               callback: this._onTouchedBtnReplaceAction },
                { ui: this._btnAddAction,                   callback: this._onTouchedBtnAddAction },
                { ui: this._btnDeepCloneAction,             callback: this._onTouchedBtnDeepCloneAction },
                { ui: this._btnDeleteAction,                callback: this._onTouchedBtnDeleteAction },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,        callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnModifyEventName(): void {           // DONE
            const data = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeEventRenamePanel, {
                war         : data.war,
                warEventId  : data.eventId,
            });
        }
        private _onTouchedBtnModifyMaxCallCountPerTurn(): void { // DONE
            const data = this._getOpenData();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountInPlayerTurn;
                const eventData = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === data.eventId));
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                    title           : Lang.getText(LangTextType.B0476),
                    currentValue    : eventData.maxCallCountInPlayerTurn ?? 1,
                    minValue,
                    maxValue,
                    tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : (panel) => {
                        eventData.maxCallCountInPlayerTurn = panel.getInputValue();
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }
        private _onTouchedBtnModifyMaxCallCountTotal(): void {   // DONE
            const data = this._getOpenData();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountTotal;
                const eventData = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === data.eventId));
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                    title           : Lang.getText(LangTextType.B0477),
                    currentValue    : eventData.maxCallCountTotal ?? 1,
                    minValue,
                    maxValue,
                    tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : (panel) => {
                        eventData.maxCallCountTotal = panel.getInputValue();
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }
        private _onTouchedBtnInitSubNodeToEvent(): void {        // DONE
            const data      = this._getOpenData();
            const eventId   = data.eventId;
            const fullData  = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const callback  = () => {
                if (Twns.WarHelpers.WarEventHelpers.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId,
                }) != null) {
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            };

            const nodeId = fullData.eventArray?.find(v => v.eventId === eventId)?.conditionNodeId;
            if (nodeId == null) {
                callback();
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getFormattedText(LangTextType.F0060, `N${nodeId}`),
                    callback,
                });
            }
        }
        private _onTouchedBtnShallowCloneEvent(): void {
            const data      = this._getOpenData();
            const eventId   = data.eventId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0487)} E${eventId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const newEventId = Twns.WarHelpers.WarEventHelpers.cloneEvent(Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()), eventId, true);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `E${newEventId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeepCloneEvent(): void {
            const data      = this._getOpenData();
            const eventId   = data.eventId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0748)} E${eventId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const newEventId = Twns.WarHelpers.WarEventHelpers.cloneEvent(Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()), eventId, false);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `E${newEventId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteEvent(): void {               // DONE
            const data      = this._getOpenData();
            const eventId   = data.eventId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0479)} E${eventId}`,
                content : Lang.getText(LangTextType.A0171),
                callback: () => {
                    const war           = data.war;
                    const eventArray    = Helpers.getExisted(war.getWarEventManager().getWarEventFullData()?.eventArray);
                    Helpers.deleteElementFromArray(eventArray, eventArray.find(v => v.eventId === eventId));

                    for (const warRule of war.getWarRuleArray() || []) {
                        const arr = warRule.warEventIdArray;
                        if (arr) {
                            Helpers.deleteElementFromArray(arr, eventId);
                        }
                    }

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnSwitchNodeAndOr(): void {           // DONE
            const data = this._getOpenData();
            const node = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.conditionNodeArray?.find(v => v.nodeId === data.nodeId));
            node.isAnd = !node.isAnd;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnReplaceNode(): void {               // DONE
            const data = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeNodeReplacePanel, {
                eventId         : data.eventId,
                parentNodeId    : data.parentNodeId,
                nodeId          : data.nodeId ?? null,
                fullData        : Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()),
            });
        }
        private _onTouchedBtnAddSubNodeToNode(): void {          // DONE
            const data = this._getOpenData();
            if (Twns.WarHelpers.WarEventHelpers.createSubNodeInParentNode({
                fullData        : Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()),
                parentNodeId    : Helpers.getExisted(data.nodeId),
            }) != null) {
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnAddSubCondition(): void {           // DONE
            const data = this._getOpenData();
            if (Twns.WarHelpers.WarEventHelpers.addDefaultCondition(Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()), Helpers.getExisted(data.nodeId)) != null) {
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnShallowCloneNode(): void {
            const data      = this._getOpenData();
            const nodeId    = Helpers.getExisted(data.nodeId);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0487)} N${nodeId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const fullData      = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    const newNodeId     = Twns.WarHelpers.WarEventHelpers.cloneNode(fullData, nodeId, true);
                    const parentNodeId  = data.parentNodeId;
                    if (parentNodeId != null) {
                        Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getNode(fullData, parentNodeId)?.subNodeIdArray).push(newNodeId);
                    } else {
                        Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getEvent(fullData, data.eventId)).conditionNodeId = newNodeId;
                    }
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `N${newNodeId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeepCloneNode(): void {
            const data      = this._getOpenData();
            const nodeId    = Helpers.getExisted(data.nodeId);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0748)} N${nodeId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const fullData      = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    const newNodeId     = Twns.WarHelpers.WarEventHelpers.cloneNode(fullData, nodeId, false);
                    const parentNodeId  = data.parentNodeId;
                    if (parentNodeId != null) {
                        Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getNode(fullData, parentNodeId)?.subNodeIdArray).push(newNodeId);
                    } else {
                        Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getEvent(fullData, data.eventId)).conditionNodeId = newNodeId;
                    }
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `N${newNodeId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteNode(): void {                // DONE
            const data      = this._getOpenData();
            const nodeId    = data.nodeId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0481)} N${nodeId}`,
                content : Lang.getText(LangTextType.A0172),
                callback: () => {
                    const fullData      = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    const parentNodeId  = data.parentNodeId;
                    if (parentNodeId != null) {
                        Helpers.deleteElementFromArray(Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === data.parentNodeId)?.subNodeIdArray), nodeId);
                    } else {
                        Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === data.eventId)).conditionNodeId = null;
                    }

                    // WarEventHelper.checkAndDeleteUnusedNode(fullData, nodeId);

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnModifyCondition(): void {           // DONE
            const openData  = this._getOpenData();
            const fullData  = Helpers.getExisted(openData.war.getWarEventManager().getWarEventFullData());
            Twns.WarHelpers.WarEventHelpers.openConditionModifyPanel(
                { fullData, condition: Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getCondition(fullData, Helpers.getExisted(openData.conditionId))), war: openData.war }            );
        }
        private _onTouchedBtnReplaceCondition(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeConditionReplacePanel, {
                fullData    : Helpers.getExisted(openData.war.getWarEventManager().getWarEventFullData()),
                parentNodeId: Helpers.getExisted(openData.parentNodeId),
                conditionId : Helpers.getExisted(openData.conditionId),
            });
            this.close();
        }
        private _onTouchedBtnDeepCloneCondition(): void {
            const data          = this._getOpenData();
            const conditionId   = Helpers.getExisted(data.conditionId);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0748)} C${conditionId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    const conditionIdArray  = Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === data.parentNodeId)?.conditionIdArray);
                    const newConditionId    = Twns.WarHelpers.WarEventHelpers.cloneCondition(fullData, conditionId);
                    conditionIdArray.push(newConditionId);
                    conditionIdArray.sort((v1, v2) => v1 - v2);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `C${newConditionId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteCondition(): void {           // DONE
            const data          = this._getOpenData();
            const conditionId   = data.conditionId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0485)} C${conditionId}`,
                content : Lang.getText(LangTextType.A0175),
                callback: () => {
                    const fullData = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    Helpers.deleteElementFromArray(Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === data.parentNodeId)?.conditionIdArray), conditionId, 1);
                    // WarEventHelper.checkAndDeleteUnusedCondition(fullData, conditionId);

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnModifyAction(): void {              // DONE
            const openData  = this._getOpenData();
            const war       = openData.war;
            const fullData  = Helpers.getExisted(war.getWarEventManager().getWarEventFullData());
            Twns.WarHelpers.WarEventHelpers.openActionModifyPanel(war, fullData, Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getAction(fullData, Helpers.getExisted(openData.actionId))));
        }
        private _onTouchedBtnReplaceAction(): void {
            const openData = this._getOpenData();
            const war       = openData.war;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionReplacePanel, {
                war,
                fullData    : Helpers.getExisted(war.getWarEventManager().getWarEventFullData()),
                eventId     : openData.eventId,
                actionId    : Helpers.getExisted(openData.actionId),
            });
            this.close();
        }
        private _onTouchedBtnAddAction(): void {                 // DONE
            const data = this._getOpenData();
            if (Twns.WarHelpers.WarEventHelpers.addDefaultAction(Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()), data.eventId) != null) {
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnDeepCloneAction(): void {
            const data      = this._getOpenData();
            const actionId  = Helpers.getExisted(data.actionId);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0748)} A${actionId}`,
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const fullData      = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    const newActionId   = Twns.WarHelpers.WarEventHelpers.cloneAction(fullData, actionId);
                    Helpers.getExisted(Twns.WarHelpers.WarEventHelpers.getEvent(fullData, data.eventId)?.actionIdArray).push(newActionId);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `A${newActionId}`));

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteAction(): void {              // DONE
            const data      = this._getOpenData();
            const actionId  = data.actionId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : `${Lang.getText(LangTextType.B0486)} A${actionId}`,
                content : Lang.getText(LangTextType.A0176),
                callback: () => {
                    const fullData = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
                    Helpers.deleteElementFromArray(Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === data.eventId)?.actionIdArray), actionId);
                    // WarEventHelper.checkAndDeleteUnusedAction(fullData, actionId);

                    this.close();
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {                    // DONE
            this._updateComponentsForLanguage();
        }
        private _onNotifyWarEventFullDataChanged(): void {
            this._updateLabelDescAndButtons();
        }

        private _updateComponentsForLanguage(): void {                              // DONE
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnShallowCloneEvent.label            = Lang.getText(LangTextType.B0487);
            this._btnDeepCloneEvent.label               = Lang.getText(LangTextType.B0748);
            this._btnDeleteEvent.label                  = Lang.getText(LangTextType.B0479);
            this._btnModifyEventName.label              = Lang.getText(LangTextType.B0495);
            this._btnModifyMaxCallCountPerTurn.label    = Lang.getText(LangTextType.B0317);
            this._btnModifyMaxCallCountTotal.label      = Lang.getText(LangTextType.B0317);
            this._btnInitSubNodeToEvent.label           = Lang.getText(LangTextType.B0494);
            this._btnSwitchNodeAndOr.label              = Lang.getText(LangTextType.B0482);
            this._btnReplaceNode.label                  = Lang.getText(LangTextType.B0491);
            this._btnAddSubCondition.label              = Lang.getText(LangTextType.B0483);
            this._btnAddSubNodeToNode.label             = Lang.getText(LangTextType.B0484);
            this._btnShallowCloneNode.label             = Lang.getText(LangTextType.B0487);
            this._btnDeepCloneNode.label                = Lang.getText(LangTextType.B0748);
            this._btnDeleteNode.label                   = Lang.getText(LangTextType.B0499);
            this._btnModifyCondition.label              = Lang.getText(LangTextType.B0501);
            this._btnReplaceCondition.label             = Lang.getText(LangTextType.B0500);
            this._btnDeepCloneCondition.label           = Lang.getText(LangTextType.B0748);
            this._btnDeleteCondition.label              = Lang.getText(LangTextType.B0485);
            this._btnModifyAction.label                 = Lang.getText(LangTextType.B0317);
            this._btnReplaceAction.label                = Lang.getText(LangTextType.B0480);
            this._btnAddAction.label                    = Lang.getText(LangTextType.B0496);
            this._btnDeepCloneAction.label              = Lang.getText(LangTextType.B0748);
            this._btnDeleteAction.label                 = Lang.getText(LangTextType.B0220);

            this._updateLabelTitle();
            this._updateLabelDescAndButtons();
        }

        private _updateLabelTitle(): void {
            const openData  = this._getOpenData();
            const descType  = openData.descType;
            const label     = this._labelTitle;
            if (descType === WarEventDescType.Action) {
                label.text = `${Lang.getText(LangTextType.B0317)} A${openData.actionId || `???`}`;
            } else if (descType === WarEventDescType.Condition) {
                label.text = `${Lang.getText(LangTextType.B0317)} C${openData.conditionId || `???`}`;
            } else if (descType === WarEventDescType.ConditionNode) {
                label.text = `${Lang.getText(LangTextType.B0317)} N${openData.nodeId || `???`}`;
            } else if (descType === WarEventDescType.EventName) {
                label.text = `${Lang.getText(LangTextType.B0317)} E${openData.eventId || `???`}`;
            } else if (descType === WarEventDescType.EventMaxCallCountInPlayerTurn) {
                label.text = `${Lang.getText(LangTextType.B0317)} E${openData.eventId || `???`}`;
            } else if (descType === WarEventDescType.EventMaxCallCountTotal) {
                label.text = `${Lang.getText(LangTextType.B0317)} E${openData.eventId || `???`}`;
            } else {
                throw Helpers.newError(`Invalid descType: ${descType}`, ClientErrorCode.WeCommandPanel_UpdateLabelTitle_00);
            }
        }

        private _updateLabelDescAndButtons(): void {                                          // DONE
            const data      = this._getOpenData();
            const descType  = data.descType;
            if (descType === WarEventDescType.EventName) {
                this._updateForEvent(data);
            } else if (descType === WarEventDescType.EventMaxCallCountInPlayerTurn) {
                this._updateForEventCallCountInPlayerTurn(data);
            } else if (descType === WarEventDescType.EventMaxCallCountTotal) {
                this._updateForEventCallCountTotal(data);
            } else if (descType === WarEventDescType.ConditionNode) {
                this._updateForConditionNode(data);
            } else if (descType === WarEventDescType.Condition) {
                this._updateForCondition(data);
            } else if (descType === WarEventDescType.Action) {
                this._updateForAction(data);
            } else {
                throw Helpers.newError(`Invalid descType: ${descType}`, ClientErrorCode.WeCommandPanel_UpdateLabelDescAndButtons_00);
            }
        }
        private _updateForEvent(data: OpenData): void {                      // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForEvent(fullData, event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getLanguageText({ textArray: event.eventNameArray })}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyEventName);
            group.addChild(this._btnInitSubNodeToEvent);
            group.addChild(this._btnAddAction);
            group.addChild(this._btnShallowCloneEvent);
            group.addChild(this._btnDeepCloneEvent);
            group.addChild(this._btnDeleteEvent);
        }
        private _updateForEventCallCountInPlayerTurn(data: OpenData): void { // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(LangTextType.B0476)}: ${event.maxCallCountInPlayerTurn}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountPerTurn);
        }
        private _updateForEventCallCountTotal(data: OpenData): void {        // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForEventCallCountTotal(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(LangTextType.B0477)}: ${event.maxCallCountTotal}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountTotal);
        }
        private _updateForConditionNode(data: OpenData): void {              // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const nodeId            = data.nodeId;
            const node              = Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === nodeId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForConditionNode(fullData, node);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `N${nodeId} ${node.isAnd ? Lang.getText(LangTextType.A0162) : Lang.getText(LangTextType.A0163)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnSwitchNodeAndOr);
            group.addChild(this._btnAddSubCondition);
            group.addChild(this._btnAddSubNodeToNode);
            group.addChild(this._btnReplaceNode);
            group.addChild(this._btnShallowCloneNode);
            group.addChild(this._btnDeepCloneNode);
            group.addChild(this._btnDeleteNode);
        }
        private _updateForCondition(data: OpenData): void {                  // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const conditionId       = data.conditionId;
            const condition         = Helpers.getExisted(fullData.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForCondition(fullData, condition, data.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `C${conditionId} ${Twns.WarHelpers.WarEventHelpers.getDescForCondition(condition)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyCondition);
            group.addChild(this._btnReplaceCondition);
            group.addChild(this._btnDeepCloneCondition);
            group.addChild(this._btnDeleteCondition);
        }
        private _updateForAction(data: OpenData): void {                     // DONE
            const war               = data.war;
            const fullData          = Helpers.getExisted(war.getWarEventManager().getWarEventFullData());
            const actionId          = data.actionId;
            const action            = Helpers.getExisted(fullData.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForAction(fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `A${actionId} ${Twns.WarHelpers.WarEventHelpers.getDescForAction(action, war)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyAction);
            group.addChild(this._btnReplaceAction);
            group.addChild(this._btnAddAction);
            group.addChild(this._btnDeepCloneAction);
            group.addChild(this._btnDeleteAction);
        }
    }
}

// export default TwnsWeCommandPanel;
