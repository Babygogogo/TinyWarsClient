
namespace TinyWars.MapEditor {
    import Notify                   = Utility.Notify;
    import Lang                     = Utility.Lang;
    import Helpers                  = Utility.Helpers;
    import ConfigManager            = Utility.ConfigManager;
    import FloatText                = Utility.FloatText;
    import ProtoTypes               = Utility.ProtoTypes;
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import BwWarEventHelper         = BaseWar.BwWarEventHelper;
    import CommonConfirmPanel       = Common.CommonConfirmPanel;
    import CommonInputPanel         = Common.CommonInputPanel;
    import ColorValue               = Types.ColorValue;
    import WarEventDescType         = Types.WarEventDescType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import ILanguageText            = ProtoTypes.Structure.ILanguageText;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForMeWeCommandPanel = {
        descType        : WarEventDescType;
        warEventFullData: IWarEventFullData;
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    }
    export class MeWeCommandPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWeCommandPanel;

        private _labelTitle                     : GameUi.UiLabel;
        private _labelDesc                      : GameUi.UiLabel;
        private _labelError                     : GameUi.UiLabel;
        private _btnClose                       : GameUi.UiButton;

        private _groupBtn                       : eui.Group;
        private _btnModifyEventName             : GameUi.UiButton;
        private _btnModifyMaxCallCountPerTurn   : GameUi.UiButton;
        private _btnModifyMaxCallCountTotal     : GameUi.UiButton;
        private _btnDeleteEvent                 : GameUi.UiButton;
        private _btnSwitchNodeAndOr             : GameUi.UiButton;
        private _btnReplaceNode                 : GameUi.UiButton;
        private _btnAddSubNode                  : GameUi.UiButton;
        private _btnAddSubCondition             : GameUi.UiButton;
        private _btnDeleteNode                  : GameUi.UiButton;
        private _btnReplaceCondition            : GameUi.UiButton;
        private _btnDeleteCondition             : GameUi.UiButton;
        private _btnReplaceAction               : GameUi.UiButton;
        private _btnAddAction                   : GameUi.UiButton;
        private _btnDeleteAction                : GameUi.UiButton;

        public static show(openData: OpenDataForMeWeCommandPanel): void {
            if (!MeWeCommandPanel._instance) {
                MeWeCommandPanel._instance = new MeWeCommandPanel();
            }

            MeWeCommandPanel._instance.open(openData);
        }

        public static hide(): void {
            if (MeWeCommandPanel._instance) {
                MeWeCommandPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeWeCommandPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnModifyEventName,             callback: this._onTouchedBtnModifyEventName },
                { ui: this._btnModifyMaxCallCountPerTurn,   callback: this._onTouchedBtnModifyMaxCallCountPerTurn },
                { ui: this._btnModifyMaxCallCountTotal,     callback: this._onTouchedBtnModifyMaxCallCountTotal },
                { ui: this._btnDeleteEvent,                 callback: this._onTouchedBtnDeleteEvent },
                { ui: this._btnSwitchNodeAndOr,             callback: this._onTouchedBtnSwitchNodeAndOr },
                { ui: this._btnReplaceNode,                 callback: this._onTouchedBtnReplaceNode },
                { ui: this._btnAddSubNode,                  callback: this._onTouchedBtnAddSubNode },
                { ui: this._btnAddSubCondition,             callback: this._onTouchedBtnAddSubCondition },
                { ui: this._btnDeleteNode,                  callback: this._onTouchedBtnDeleteNode },
                { ui: this._btnReplaceCondition,            callback: this._onTouchedBtnReplaceCondition },
                { ui: this._btnDeleteCondition,             callback: this._onTouchedBtnDeleteCondition },
                { ui: this._btnReplaceAction,               callback: this._onTouchedBtnReplaceAction },
                { ui: this._btnAddAction,                   callback: this._onTouchedBtnAddAction },
                { ui: this._btnDeleteAction,                callback: this._onTouchedBtnDeleteAction },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyEventName(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                MeWeEventRenamePanel.show({ warEventId: data.eventId });
            }
        }
        private _onTouchedBtnModifyMaxCallCountPerTurn(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountInPlayerTurn;
                const eventData = data.warEventFullData.eventArray.find(v => v.eventId === data.eventId);
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
                            Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                        }
                    },
                });
            }
        }
        private _onTouchedBtnModifyMaxCallCountTotal(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const minValue  = 1;
                const maxValue  = CommonConstants.WarEventMaxCallCountTotal;
                const eventData = data.warEventFullData.eventArray.find(v => v.eventId === data.eventId);
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
                            Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                        }
                    },
                });
            }
        }
        private _onTouchedBtnDeleteEvent(e: egret.TouchEvent): void {
            const data      = this._getOpenData<OpenDataForMeWeCommandPanel>();
            const eventId   = data.eventId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0479)} E${eventId}`,
                content : Lang.getText(Lang.Type.A0171),
                callback: () => {
                    const eventArray = data.warEventFullData.eventArray;
                    Helpers.deleteElementFromArray(eventArray, eventArray.find(v => v.eventId === eventId));

                    MeManager.getWar().getWarRuleArray().forEach(v => {
                        const arr = v.warEventIdArray;
                        if (arr) {
                            Helpers.deleteElementFromArray(arr, eventId);
                        }
                    });

                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnSwitchNodeAndOr(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const node = data.warEventFullData.conditionNodeArray.find(v => v.nodeId === data.nodeId);
                node.isAnd = !node.isAnd;
                Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
            }
        }
        private _onTouchedBtnReplaceNode(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            MeWeNodeReplacePanel.show({
                eventId         : data.eventId,
                parentNodeId    : data.parentNodeId,
                nodeId          : data.nodeId,
                fullData        : data.warEventFullData,
            });
        }
        private _onTouchedBtnAddSubNode(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const fullData  = data.warEventFullData;
                const newNodeId = BwWarEventHelper.addNode({ fullData });
                if (newNodeId == null) {
                    Logger.error(`MeWePanel._onTouchedBtnAddSubNode() empty newNodeId.`);
                    return;
                }

                if (fullData.conditionNodeArray == null) {
                    fullData.conditionNodeArray = [];
                }

                const parentNode = fullData.conditionNodeArray.find(v => v.nodeId === data.nodeId);
                if (parentNode.subNodeIdArray == null) {
                    parentNode.subNodeIdArray = [newNodeId];
                } else {
                    const arr = parentNode.subNodeIdArray;
                    arr.push(newNodeId);
                    arr.sort();
                }

                Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
            }
        }
        private _onTouchedBtnAddSubCondition(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const fullData = data.warEventFullData;
                if (fullData.conditionArray == null) {
                    fullData.conditionArray = [];
                }

                const conditionId   = BwWarEventHelper.addCondition(fullData);
                const node          = fullData.conditionNodeArray.find(v => v.nodeId === data.nodeId);
                if (node.conditionIdArray == null) {
                    node.conditionIdArray = [conditionId];
                } else {
                    const arr = node.conditionIdArray;
                    arr.push(conditionId);
                    arr.sort();
                }

                Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
            }
        }
        private _onTouchedBtnDeleteNode(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const nodeId = data.nodeId;
                CommonConfirmPanel.show({
                    title   : `${Lang.getText(Lang.Type.B0481)} N${nodeId}`,
                    content : Lang.getText(Lang.Type.A0172),
                    callback: () => {
                        const fullData  = data.warEventFullData;
                        const nodeArray = fullData.conditionNodeArray;
                        const arr       = nodeArray.find(v => v.nodeId === data.parentNodeId).subNodeIdArray;
                        Helpers.deleteElementFromArray(arr, nodeId);

                        if ((!fullData.eventArray.some(v => v.conditionNodeId == nodeId))       &&
                            (!nodeArray.some(v => (v.subNodeIdArray || []).indexOf(nodeId) >= 0))
                        ) {
                            Helpers.deleteElementFromArray(nodeArray, nodeArray.find(v => v.nodeId === nodeId));
                        }

                        Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    },
                });
            }
        }
        private _onTouchedBtnReplaceCondition(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDeleteCondition(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const conditionId = data.conditionId;
                CommonConfirmPanel.show({
                    title   : `${Lang.getText(Lang.Type.B0485)} C${conditionId}`,
                    content : Lang.getText(Lang.Type.A0175),
                    callback: () => {
                        const fullData  = data.warEventFullData;
                        const nodeArray = fullData.conditionNodeArray;
                        const arr       = nodeArray.find(v => v.nodeId === data.parentNodeId).conditionIdArray;
                        Helpers.deleteElementFromArray(arr, conditionId);

                        if (!nodeArray.some(v => (v.conditionIdArray || []).indexOf(conditionId) >= 0)) {
                            const conditionArray = fullData.conditionArray;
                            Helpers.deleteElementFromArray(conditionArray, conditionArray.find(v => v.WecCommonData.conditionId === conditionId));
                        }

                        Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    },
                });
            }
        }
        private _onTouchedBtnReplaceAction(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnAddAction(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const fullData = data.warEventFullData;
                if (fullData.actionArray == null) {
                    fullData.actionArray = [];
                }

                const actionArray       = fullData.actionArray;
                const maxCountPerMap    = CommonConstants.WarEventMaxActionsPerMap;
                if (actionArray.length >= maxCountPerMap) {
                    FloatText.show(Lang.getText(Lang.Type.A0177));
                    return;
                }

                const eventActionArray = fullData.eventArray.find(v => v.eventId === data.eventId).actionIdArray;
                if (eventActionArray.length >= CommonConstants.WarEventMaxActionsPerEvent) {
                    FloatText.show(Lang.getText(Lang.Type.A0178));
                    return;
                }

                for (let actionId = 1; actionId <= maxCountPerMap; ++actionId) {
                    if (!actionArray.some(v => v.WarEventActionCommonData.actionId === actionId)) {
                        actionArray.push({
                            WarEventActionCommonData: {
                                actionId,
                            },
                        });
                        actionArray.sort((v1, v2) => v1.WarEventActionCommonData.actionId - v2.WarEventActionCommonData.actionId);

                        eventActionArray.push(actionId);
                        eventActionArray.sort();

                        Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                        return;
                    }
                }
            }
        }
        private _onTouchedBtnDeleteAction(e: egret.TouchEvent): void {
            const data = this._getOpenData<OpenDataForMeWeCommandPanel>();
            if (data) {
                const actionId = data.actionId;
                CommonConfirmPanel.show({
                    title   : `${Lang.getText(Lang.Type.B0486)} A${actionId}`,
                    content : Lang.getText(Lang.Type.A0176),
                    callback: () => {
                        const fullData      = data.warEventFullData;
                        const eventArray    = fullData.eventArray;
                        const arr           = eventArray.find(v => v.eventId === data.eventId).actionIdArray;
                        Helpers.deleteElementFromArray(arr, actionId);

                        if (!eventArray.some(v => v.actionIdArray.indexOf(actionId) >= 0)) {
                            const actionArray = fullData.actionArray;
                            Helpers.deleteElementFromArray(actionArray, actionArray.find(v => v.WarEventActionCommonData.actionId === actionId));
                        }

                        Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    },
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label                        = Lang.getText(Lang.Type.B0146);
            this._btnDeleteEvent.label                  = Lang.getText(Lang.Type.B0220);
            this._btnModifyEventName.label              = Lang.getText(Lang.Type.B0317);
            this._btnModifyMaxCallCountPerTurn.label    = Lang.getText(Lang.Type.B0317);
            this._btnModifyMaxCallCountTotal.label      = Lang.getText(Lang.Type.B0317);
            this._btnSwitchNodeAndOr.label              = Lang.getText(Lang.Type.B0482);
            this._btnReplaceNode.label                  = Lang.getText(Lang.Type.B0480);
            this._btnAddSubCondition.label              = Lang.getText(Lang.Type.B0483);
            this._btnAddSubNode.label                   = Lang.getText(Lang.Type.B0484);
            this._btnDeleteNode.label                   = Lang.getText(Lang.Type.B0220);
            this._btnReplaceCondition.label             = Lang.getText(Lang.Type.B0480);
            this._btnDeleteCondition.label              = Lang.getText(Lang.Type.B0220);
            this._btnReplaceAction.label                = Lang.getText(Lang.Type.B0480);
            this._btnAddAction.label                    = Lang.getText(Lang.Type.B0320);
            this._btnDeleteAction.label                 = Lang.getText(Lang.Type.B0220);

            this._updateLabelDescAndButtons();
        }

        private _updateLabelDescAndButtons(): void {
            const data      = this._getOpenData<OpenDataForMeWeCommandPanel>();
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
                const labelDesc     = this._labelDesc;
                const prefixArray   = data.prefixArray;
                // const prefix        = prefixArray.join(`.`);
                const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0166)}`;
            }
        }
        private _updateForEvent(data: OpenDataForMeWeCommandPanel): void {                      // DONE
            const fullData  = data.warEventFullData;
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEvent() empty event.`);
                this._labelDesc.text = `_updateForEvent() empty event!`;
                return;
            }

            const errorTip          = BwWarEventHelper.getErrorTipForEvent(fullData, event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getLanguageText({ textArray: event.eventNameArray })}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyEventName);
            group.addChild(this._btnReplaceNode);
            group.addChild(this._btnAddAction);
            group.addChild(this._btnDeleteEvent);
        }
        private _updateForEventCallCountInPlayerTurn(data: OpenDataForMeWeCommandPanel): void { // DONE
            const fullData  = data.warEventFullData;
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEventCallCountInPlayerTurn() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountInPlayerTurn() empty event!`;
                return;
            }

            const errorTip          = BwWarEventHelper.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(Lang.Type.B0476)}: ${event.maxCallCountInPlayerTurn}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountPerTurn);
        }
        private _updateForEventCallCountTotal(data: OpenDataForMeWeCommandPanel): void {        // DONE
            const fullData  = data.warEventFullData;
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWeCommandPanel._updateForEventCallCountTotal() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountTotal() empty event!`;
                return;
            }

            const errorTip          = BwWarEventHelper.getErrorTipForEventCallCountTotal(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `E${eventId} ${Lang.getText(Lang.Type.B0477)}: ${event.maxCallCountTotal}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountTotal);
        }
        private _updateForConditionNode(data: OpenDataForMeWeCommandPanel): void {              // DONE
            const fullData  = data.warEventFullData;
            const nodeId    = data.nodeId;
            const node      = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
            if (node == null) {
                Logger.error(`MeWeCommandPanel._updateForConditionNode() empty node.`);
                this._labelDesc.text = `_updateForConditionNode() empty node!`;
                return;
            }

            const errorTip          = BwWarEventHelper.getErrorTipForConditionNode(fullData, node, data.eventId);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `N${nodeId} ${node.isAnd ? Lang.getText(Lang.Type.A0162) : Lang.getText(Lang.Type.A0163)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnSwitchNodeAndOr);
            group.addChild(this._btnAddSubCondition);
            group.addChild(this._btnAddSubNode);
            group.addChild(this._btnReplaceNode);
            group.addChild(this._btnDeleteNode);
        }
        private _updateForCondition(data: OpenDataForMeWeCommandPanel): void {                  // DONE
            const fullData      = data.warEventFullData;
            const conditionId   = data.conditionId;
            const condition     = (fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === conditionId);
            if (conditionId == null) {
                Logger.error(`MeWeCommandPanel._updateForCondition() empty conditionId.`);
                this._labelDesc.text = `_updateForCondition() empty condition.`;
                return;
            }

            const errorTip          = BwWarEventHelper.getErrorTipForCondition(fullData, condition, data.eventId);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelDesc.text    = `C${conditionId} ${BwWarEventHelper.getDescForCondition(condition)}`;

            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnReplaceCondition);
            group.addChild(this._btnDeleteCondition);
        }
        private _updateForAction(data: OpenDataForMeWeCommandPanel): void {
            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnReplaceAction);

            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const actionId = data.actionId;
            if ((actionId == null) || (actionId < 0)) {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0167)}`;
                return;
            }

            group.addChild(this._btnAddAction);
            group.addChild(this._btnDeleteAction);

            const action = (fullData.actionArray || []).find(v => v.WarEventActionCommonData.actionId === actionId);
            if (action == null) {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0168)}`;
                return;
            }

            const desc = BwWarEventHelper.getDescForAction(action);
            if (desc) {
                labelDesc.textColor = ColorValue.White;
                labelDesc.text      = `${prefix} ${desc}`;
            } else {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0169)}`;
            }
        }
    }
}
