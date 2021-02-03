
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import Helpers              = Utility.Helpers;
    import ConfigManager        = Utility.ConfigManager;
    import FloatText            = Utility.FloatText;
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import CommonInputPanel     = Common.CommonInputPanel;
    import ColorValue           = Types.ColorValue;
    import WarEventDescType     = Types.WarEventDescType;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForWeCommandPanel = {
        war             : MapEditor.MeWar;
        descType        : WarEventDescType;
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    }
    export class WeCommandPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeCommandPanel;

        private _labelTitle                     : GameUi.UiLabel;
        private _labelDesc                      : GameUi.UiLabel;
        private _labelError                     : GameUi.UiLabel;
        private _btnClose                       : GameUi.UiButton;

        private _groupBtn                       : eui.Group;
        private _btnModifyEventName             : GameUi.UiButton;
        private _btnModifyMaxCallCountPerTurn   : GameUi.UiButton;
        private _btnModifyMaxCallCountTotal     : GameUi.UiButton;
        private _btnInitSubNodeToEvent          : GameUi.UiButton;
        private _btnDeleteEvent                 : GameUi.UiButton;
        private _btnSwitchNodeAndOr             : GameUi.UiButton;
        private _btnReplaceNode                 : GameUi.UiButton;
        private _btnAddSubNodeToNode            : GameUi.UiButton;
        private _btnAddSubCondition             : GameUi.UiButton;
        private _btnDeleteNode                  : GameUi.UiButton;
        private _btnModifyCondition             : GameUi.UiButton;
        private _btnReplaceCondition            : GameUi.UiButton;
        private _btnDeleteCondition             : GameUi.UiButton;
        private _btnModifyAction                : GameUi.UiButton;
        private _btnReplaceAction               : GameUi.UiButton;
        private _btnAddAction                   : GameUi.UiButton;
        private _btnDeleteAction                : GameUi.UiButton;

        public static show(openData: OpenDataForWeCommandPanel): void {
            if (!WeCommandPanel._instance) {
                WeCommandPanel._instance = new WeCommandPanel();
            }

            WeCommandPanel._instance.open(openData);
        }

        public static hide(): void {
            if (WeCommandPanel._instance) {
                WeCommandPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeCommandPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnModifyEventName,             callback: this._onTouchedBtnModifyEventName },
                { ui: this._btnModifyMaxCallCountPerTurn,   callback: this._onTouchedBtnModifyMaxCallCountPerTurn },
                { ui: this._btnModifyMaxCallCountTotal,     callback: this._onTouchedBtnModifyMaxCallCountTotal },
                { ui: this._btnInitSubNodeToEvent,          callback: this._onTouchedBtnInitSubNodeToEvent },
                { ui: this._btnDeleteEvent,                 callback: this._onTouchedBtnDeleteEvent },
                { ui: this._btnSwitchNodeAndOr,             callback: this._onTouchedBtnSwitchNodeAndOr },
                { ui: this._btnReplaceNode,                 callback: this._onTouchedBtnReplaceNode },
                { ui: this._btnAddSubNodeToNode,            callback: this._onTouchedBtnAddSubNodeToNode },
                { ui: this._btnAddSubCondition,             callback: this._onTouchedBtnAddSubCondition },
                { ui: this._btnDeleteNode,                  callback: this._onTouchedBtnDeleteNode },
                { ui: this._btnModifyCondition,             callback: this._onTouchedBtnModifyCondition },
                { ui: this._btnReplaceCondition,            callback: this._onTouchedBtnReplaceCondition },
                { ui: this._btnDeleteCondition,             callback: this._onTouchedBtnDeleteCondition },
                { ui: this._btnModifyAction,                callback: this._onTouchedBtnModifyAction },
                { ui: this._btnReplaceAction,               callback: this._onTouchedBtnReplaceAction },
                { ui: this._btnAddAction,                   callback: this._onTouchedBtnAddAction },
                { ui: this._btnDeleteAction,                callback: this._onTouchedBtnDeleteAction },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.WarEventFullDataChanged,        callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyEventName(e: egret.TouchEvent): void {           // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            WeEventRenamePanel.show({
                war         : data.war,
                warEventId  : data.eventId,
            });
        }
        private _onTouchedBtnModifyMaxCallCountPerTurn(e: egret.TouchEvent): void { // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountInPlayerTurn;
                const eventData = data.war.getWarEventManager().getWarEventFullData().eventArray.find(v => v.eventId === data.eventId);
                CommonInputPanel.show({
                    title           : Lang.getText(Lang.Type.B0476),
                    charRestrict    : `0-9`,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    maxChars        : 3,
                    currentValue    : `${eventData.maxCallCountInPlayerTurn}`,
                    callback        : (panel) => {
                        const text  = panel.getInputText();
                        const value = text ? Number(text) : NaN;
                        if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            eventData.maxCallCountInPlayerTurn = value;
                            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                        }
                    },
                });
            }
        }
        private _onTouchedBtnModifyMaxCallCountTotal(e: egret.TouchEvent): void {   // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountTotal;
                const eventData = data.war.getWarEventManager().getWarEventFullData().eventArray.find(v => v.eventId === data.eventId);
                CommonInputPanel.show({
                    title           : Lang.getText(Lang.Type.B0477),
                    charRestrict    : `0-9`,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    maxChars        : 3,
                    currentValue    : `${eventData.maxCallCountTotal}`,
                    callback        : (panel) => {
                        const text  = panel.getInputText();
                        const value = text ? Number(text) : NaN;
                        if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            eventData.maxCallCountTotal = value;
                            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                        }
                    },
                });
            }
        }
        private _onTouchedBtnInitSubNodeToEvent(e: egret.TouchEvent): void {        // DONE
            const data      = this._getOpenData<OpenDataForWeCommandPanel>();
            const eventId   = data.eventId;
            const fullData  =  data.war.getWarEventManager().getWarEventFullData();
            const callback  = () => {
                if (WarEventHelper.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId,
                }) != null) {
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                }
            };

            const nodeId = fullData.eventArray.find(v => v.eventId === eventId).conditionNodeId;
            if (nodeId == null) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getFormattedText(Lang.Type.F0060, `N${nodeId}`),
                    callback,
                });
            }
        }
        private _onTouchedBtnDeleteEvent(e: egret.TouchEvent): void {               // DONE
            const data      = this._getOpenData<OpenDataForWeCommandPanel>();
            const eventId   = data.eventId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0479)} E${eventId}`,
                content : Lang.getText(Lang.Type.A0171),
                callback: () => {
                    const war           = data.war;
                    const eventArray    = war.getWarEventManager().getWarEventFullData().eventArray;
                    Helpers.deleteElementFromArray(eventArray, eventArray.find(v => v.eventId === eventId));

                    for (const warRule of war.getWarRuleArray() || []) {
                        const arr = warRule.warEventIdArray;
                        if (arr) {
                            Helpers.deleteElementFromArray(arr, eventId);
                        }
                    }

                    this.close();
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnSwitchNodeAndOr(e: egret.TouchEvent): void {           // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            const node = data.war.getWarEventManager().getWarEventFullData().conditionNodeArray.find(v => v.nodeId === data.nodeId);
            node.isAnd = !node.isAnd;
            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
        }
        private _onTouchedBtnReplaceNode(e: egret.TouchEvent): void {               // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            WeNodeReplacePanel.show({
                eventId         : data.eventId,
                parentNodeId    : data.parentNodeId,
                nodeId          : data.nodeId,
                fullData        : data.war.getWarEventManager().getWarEventFullData(),
            });
        }
        private _onTouchedBtnAddSubNodeToNode(e: egret.TouchEvent): void {          // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            if (WarEventHelper.createSubNodeInParentNode({
                fullData        : data.war.getWarEventManager().getWarEventFullData(),
                parentNodeId    : data.nodeId,
            }) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnAddSubCondition(e: egret.TouchEvent): void {           // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            if (WarEventHelper.addDefaultCondition(data.war.getWarEventManager().getWarEventFullData(), data.nodeId) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnDeleteNode(e: egret.TouchEvent): void {                // DONE
            const data      = this._getOpenData<OpenDataForWeCommandPanel>();
            const nodeId    = data.nodeId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0481)} N${nodeId}`,
                content : Lang.getText(Lang.Type.A0172),
                callback: () => {
                    const fullData = data.war.getWarEventManager().getWarEventFullData();
                    Helpers.deleteElementFromArray(fullData.conditionNodeArray.find(v => v.nodeId === data.parentNodeId).subNodeIdArray, nodeId);
                    // WarEventHelper.checkAndDeleteUnusedNode(fullData, nodeId);

                    this.close();
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnModifyCondition(e: egret.TouchEvent): void {           // DONE
            const openData  = this._getOpenData<OpenDataForWeCommandPanel>();
            const fullData  = openData.war.getWarEventManager().getWarEventFullData();
            WarEventHelper.openConditionModifyPanel(fullData, WarEventHelper.getCondition(fullData, openData.conditionId));
        }
        private _onTouchedBtnReplaceCondition(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForWeCommandPanel>();
            WeConditionReplacePanel.show({
                fullData    : openData.war.getWarEventManager().getWarEventFullData(),
                parentNodeId: openData.parentNodeId,
                conditionId : openData.conditionId,
            });
        }
        private _onTouchedBtnDeleteCondition(e: egret.TouchEvent): void {           // DONE
            const data          = this._getOpenData<OpenDataForWeCommandPanel>();
            const conditionId   = data.conditionId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0485)} C${conditionId}`,
                content : Lang.getText(Lang.Type.A0175),
                callback: () => {
                    const fullData = data.war.getWarEventManager().getWarEventFullData();
                    Helpers.deleteElementFromArray(fullData.conditionNodeArray.find(v => v.nodeId === data.parentNodeId).conditionIdArray, conditionId, 1);
                    // WarEventHelper.checkAndDeleteUnusedCondition(fullData, conditionId);

                    this.close();
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnModifyAction(e: egret.TouchEvent): void {              // DONE
            const openData  = this._getOpenData<OpenDataForWeCommandPanel>();
            const war       = openData.war;
            const fullData  = war.getWarEventManager().getWarEventFullData();
            WarEventHelper.openActionModifyPanel(war, fullData, WarEventHelper.getAction(fullData, openData.actionId));
        }
        private _onTouchedBtnReplaceAction(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnAddAction(e: egret.TouchEvent): void {                 // DONE
            const data = this._getOpenData<OpenDataForWeCommandPanel>();
            if (WarEventHelper.addDefaultAction(data.war.getWarEventManager().getWarEventFullData(), data.eventId) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnDeleteAction(e: egret.TouchEvent): void {              // DONE
            const data      = this._getOpenData<OpenDataForWeCommandPanel>();
            const actionId  = data.actionId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0486)} A${actionId}`,
                content : Lang.getText(Lang.Type.A0176),
                callback: () => {
                    const fullData = data.war.getWarEventManager().getWarEventFullData();
                    Helpers.deleteElementFromArray(fullData.eventArray.find(v => v.eventId === data.eventId).actionIdArray, actionId);
                    // WarEventHelper.checkAndDeleteUnusedAction(fullData, actionId);

                    this.close();
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                },
            });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {                    // DONE
            this._updateComponentsForLanguage();
        }
        private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
            this._updateLabelDescAndButtons();
        }

        private _updateComponentsForLanguage(): void {                              // DONE
            this._btnClose.label                        = Lang.getText(Lang.Type.B0146);
            this._btnDeleteEvent.label                  = Lang.getText(Lang.Type.B0479);
            this._btnModifyEventName.label              = Lang.getText(Lang.Type.B0495);
            this._btnModifyMaxCallCountPerTurn.label    = Lang.getText(Lang.Type.B0317);
            this._btnModifyMaxCallCountTotal.label      = Lang.getText(Lang.Type.B0317);
            this._btnInitSubNodeToEvent.label           = Lang.getText(Lang.Type.B0494);
            this._btnSwitchNodeAndOr.label              = Lang.getText(Lang.Type.B0482);
            this._btnReplaceNode.label                  = Lang.getText(Lang.Type.B0491);
            this._btnAddSubCondition.label              = Lang.getText(Lang.Type.B0483);
            this._btnAddSubNodeToNode.label             = Lang.getText(Lang.Type.B0484);
            this._btnDeleteNode.label                   = Lang.getText(Lang.Type.B0499);
            this._btnModifyCondition.label              = Lang.getText(Lang.Type.B0501);
            this._btnReplaceCondition.label             = Lang.getText(Lang.Type.B0500);
            this._btnDeleteCondition.label              = Lang.getText(Lang.Type.B0485);
            this._btnModifyAction.label                 = Lang.getText(Lang.Type.B0317);
            this._btnReplaceAction.label                = Lang.getText(Lang.Type.B0480);
            this._btnAddAction.label                    = Lang.getText(Lang.Type.B0496);
            this._btnDeleteAction.label                 = Lang.getText(Lang.Type.B0220);

            this._updateLabelTitle();
            this._updateLabelDescAndButtons();
        }

        private _updateLabelTitle(): void {
            const openData  = this._getOpenData<OpenDataForWeCommandPanel>();
            const descType  = openData.descType;
            const label     = this._labelTitle;
            if (descType === WarEventDescType.Action) {
                label.text = `${Lang.getText(Lang.Type.B0317)} A${openData.actionId || `???`}`;
            } else if (descType === WarEventDescType.Condition) {
                label.text = `${Lang.getText(Lang.Type.B0317)} C${openData.conditionId || `???`}`;
            } else if (descType === WarEventDescType.ConditionNode) {
                label.text = `${Lang.getText(Lang.Type.B0317)} N${openData.nodeId || `???`}`;
            } else if (descType === WarEventDescType.EventName) {
                label.text = `${Lang.getText(Lang.Type.B0317)} E${openData.eventId || `???`}`;
            } else if (descType === WarEventDescType.EventMaxCallCountInPlayerTurn) {
                label.text = `${Lang.getText(Lang.Type.B0317)} E${openData.eventId || `???`}`;
            } else if (descType === WarEventDescType.EventMaxCallCountTotal) {
                label.text = `${Lang.getText(Lang.Type.B0317)} E${openData.eventId || `???`}`;
            } else {
                Logger.error(`WeCommandPanel._updateLabelTitle() invalid descType.`);
                label.text = Lang.getText(Lang.Type.B0317);
            }
        }

        private _updateLabelDescAndButtons(): void {                                          // DONE
            const data      = this._getOpenData<OpenDataForWeCommandPanel>();
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
                Logger.error(`MeWeCommandPanel._updateLabelDescAndButtons() invalid descType.`);
                FloatText.show(`MeWeCommandPanel._updateLabelDescAndButtons() invalid descType.`);
                this.close();
            }
        }
        private _updateForEvent(data: OpenDataForWeCommandPanel): void {                      // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEvent() empty event.`);
                this._labelDesc.text = `_updateForEvent() empty event!`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForEvent(fullData, event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getLanguageText({ textArray: event.eventNameArray })}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyEventName);
            group.addChild(this._btnInitSubNodeToEvent);
            group.addChild(this._btnAddAction);
            group.addChild(this._btnDeleteEvent);
        }
        private _updateForEventCallCountInPlayerTurn(data: OpenDataForWeCommandPanel): void { // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEventCallCountInPlayerTurn() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountInPlayerTurn() empty event!`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(Lang.Type.B0476)}: ${event.maxCallCountInPlayerTurn}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountPerTurn);
        }
        private _updateForEventCallCountTotal(data: OpenDataForWeCommandPanel): void {        // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEventCallCountTotal() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountTotal() empty event!`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForEventCallCountTotal(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(Lang.Type.B0477)}: ${event.maxCallCountTotal}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountTotal);
        }
        private _updateForConditionNode(data: OpenDataForWeCommandPanel): void {              // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const nodeId    = data.nodeId;
            const node      = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
            if (node == null) {
                Logger.error(`MeWeCommandPanel._updateForConditionNode() empty node.`);
                this._labelDesc.text = `_updateForConditionNode() empty node!`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForConditionNode(fullData, node);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `N${nodeId} ${node.isAnd ? Lang.getText(Lang.Type.A0162) : Lang.getText(Lang.Type.A0163)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnSwitchNodeAndOr);
            group.addChild(this._btnAddSubCondition);
            group.addChild(this._btnAddSubNodeToNode);
            group.addChild(this._btnReplaceNode);
            group.addChild(this._btnDeleteNode);
        }
        private _updateForCondition(data: OpenDataForWeCommandPanel): void {                  // DONE
            const fullData      = data.war.getWarEventManager().getWarEventFullData();
            const conditionId   = data.conditionId;
            const condition     = (fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === conditionId);
            if (condition == null) {
                Logger.error(`MeWeCommandPanel._updateForCondition() empty condition.`);
                this._labelDesc.text = `_updateForCondition() empty condition.`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForCondition(fullData, condition);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `C${conditionId} ${WarEventHelper.getDescForCondition(condition)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyCondition);
            group.addChild(this._btnReplaceCondition);
            group.addChild(this._btnDeleteCondition);
        }
        private _updateForAction(data: OpenDataForWeCommandPanel): void {                     // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const actionId  = data.actionId;
            const action    = (fullData.actionArray || []).find(v => v.WarEventActionCommonData.actionId === actionId);
            if (action == null) {
                Logger.error(`MeWeCommandPanel._updateForAction() empty action.`);
                this._labelDesc.text = `_updateForAction() empty action.`;
                return;
            }

            const errorTip          = WarEventHelper.getErrorTipForAction(fullData, action, data.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `A${actionId} ${WarEventHelper.getDescForAction(action)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyAction);
            group.addChild(this._btnReplaceAction);
            group.addChild(this._btnAddAction);
            group.addChild(this._btnDeleteAction);
        }
    }
}
