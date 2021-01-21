
namespace TinyWars.WarEvent {
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;
    import ColorValue           = Types.ColorValue;
    import WarEventDescType     = Types.WarEventDescType;

    type OpenDataForWeEventListPanel = {
        war: MapEditor.MeWar;
    }
    export class WeEventListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeEventListPanel;

        private _btnBack        : GameUi.UiButton;
        private _btnAddEvent    : GameUi.UiButton;
        private _labelTitle     : GameUi.UiLabel;
        private _labelNoEvent   : GameUi.UiLabel;
        private _listWarEvent   : GameUi.UiScrollList;

        public static show(openData: OpenDataForWeEventListPanel): void {
            if (!WeEventListPanel._instance) {
                WeEventListPanel._instance = new WeEventListPanel();
            }
            WeEventListPanel._instance.open(openData);
        }
        public static hide(): void {
            if (WeEventListPanel._instance) {
                WeEventListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/warEvent/WeEventListPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
            ]);
            this._listWarEvent.setItemRenderer(WarEventDescRenderer);

            this._updateView();
        }
        protected _onClosed(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMeWarEventFullDataChanged(e: egret.Event): void {
            this._updateListWarEventAndLabelNoEvent();
        }

        private _onTouchedBtnAddEvent(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForWeEventListPanel>();
            if (WarEventHelper.addEvent(openData.war.getWarEventManager().getWarEventFullData()) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListWarEventAndLabelNoEvent();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoEvent.text = Lang.getText(Lang.Type.B0278);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0469);
            this._btnAddEvent.label = Lang.getText(Lang.Type.B0320);
            this._btnBack.label     = Lang.getText(Lang.Type.B0146);
        }

        private _updateListWarEventAndLabelNoEvent(): void {
            const war       = this._getOpenData<OpenDataForWeEventListPanel>().war;
            const dataArray : DataForWarEventDescRenderer[] = [];
            for (const warEvent of (war.getWarEventManager().getWarEventFullData().eventArray || []).concat().sort((v1, v2) => v1.eventId - v2.eventId)) {
                dataArray.push(...generateDataArrayForListWarEventDesc({
                    war,
                    eventId : warEvent.eventId,
                }));
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray);
        }
    }

    function generateDataArrayForListWarEventDesc({ war, eventId }: {
        war         : MapEditor.MeWar;
        eventId     : number;
    }): DataForWarEventDescRenderer[] {
        const prefixArray   = [`E${eventId}`];
        const dataArray     : DataForWarEventDescRenderer[] = [{
            war,
            descType        : WarEventDescType.EventName,
            prefixArray,
            eventId,
        }];

        const warEvent = (war.getWarEventManager().getWarEventFullData().eventArray || []).find(v => v.eventId === eventId);
        if (warEvent == null) {
            return dataArray;
        }

        dataArray.push(
            {
                war,
                descType        : WarEventDescType.EventMaxCallCountInPlayerTurn,
                prefixArray,
                eventId,
            },
            {
                war,
                descType        : WarEventDescType.EventMaxCallCountTotal,
                prefixArray,
                eventId,
            },
        );

        const nodeId = warEvent.conditionNodeId;
        if (nodeId != null) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                war,
                eventId,
                parentNodeId: undefined,
                nodeId,
                prefixArray : prefixArray.concat(`N${nodeId}`),
            }));
        }

        for (const actionId of warEvent.actionIdArray || []) {
            dataArray.push({
                war,
                descType        : WarEventDescType.Action,
                prefixArray     : prefixArray.concat(`A${actionId}`),
                eventId,
                actionId,
            });
        }

        return dataArray;
    }
    function generateNodeDataArrayForListWarEventDesc({ war, eventId, parentNodeId, nodeId, prefixArray }: {
        war         : MapEditor.MeWar;
        eventId     : number;
        parentNodeId: number | undefined;
        nodeId      : number;
        prefixArray : string[];
    }): DataForWarEventDescRenderer[] {
        const dataArray: DataForWarEventDescRenderer[] = [{
            war,
            descType        : WarEventDescType.ConditionNode,
            prefixArray,
            eventId,
            parentNodeId,
            nodeId,
        }];

        const node = (war.getWarEventManager().getWarEventFullData().conditionNodeArray || []).find(v => v.nodeId === nodeId);
        if (node == null) {
            return dataArray;
        }

        for (const conditionId of node.conditionIdArray || []) {
            dataArray.push({
                war,
                descType        : WarEventDescType.Condition,
                prefixArray     : prefixArray.concat([`C${conditionId}`]),
                eventId,
                parentNodeId    : nodeId,
                conditionId,
            });
        }

        for (const subNodeId of node.subNodeIdArray || []) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                war,
                eventId,
                parentNodeId: nodeId,
                nodeId      : subNodeId,
                prefixArray : prefixArray.concat([`N${subNodeId}`]),
            }));
        }

        return dataArray;
    }

    type DataForWarEventDescRenderer = {
        war             : MapEditor.MeWar;
        descType        : WarEventDescType;
        prefixArray     : string[];
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    }
    class WarEventDescRenderer extends GameUi.UiListItemRenderer {
        private _btnModify  : GameUi.UiButton;
        private _labelPrefix: GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;
        private _labelError : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify, callback: this._onTouchedBtnModify },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const data = this.data as DataForWarEventDescRenderer;
            if (data) {
                WeCommandPanel.show({
                    war             : data.war,
                    descType        : data.descType,
                    eventId         : data.eventId,
                    actionId        : data.actionId,
                    conditionId     : data.conditionId,
                    parentNodeId    : data.parentNodeId,
                    nodeId          : data.nodeId,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelDescAndError();
        }

        private _updateComponentsForLanguage(): void {
            this._btnModify.label = Lang.getText(Lang.Type.B0317);

            this._updateLabelDescAndError();
        }

        private _updateLabelDescAndError(): void {
            const data = this.data as DataForWarEventDescRenderer;
            if (data) {
                const descType = data.descType;
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
                    this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
                    labelDesc.textColor = ColorValue.Red;
                    labelDesc.text      = `${Lang.getText(Lang.Type.A0166)}`;
                }
            }
        }
        private _updateForEvent(data: DataForWarEventDescRenderer): void {                      // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForEvent() empty event.`);
                this._labelDesc.text = `_updateForEvent() empty event!`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEvent(fullData, event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getLanguageText({ textArray: event.eventNameArray })}`;
        }
        private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDescRenderer): void { // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForEventCallCountInPlayerTurn() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountInPlayerTurn() empty event!`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getText(Lang.Type.B0476)}: ${event.maxCallCountInPlayerTurn}`;
        }
        private _updateForEventCallCountTotal(data: DataForWarEventDescRenderer): void {        // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForEventCallCountTotal() empty event.`);
                this._labelDesc.text = `_updateForEventCallCountTotal() empty event!`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEventCallCountTotal(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getText(Lang.Type.B0477)}: ${event.maxCallCountTotal}`;
        }
        private _updateForConditionNode(data: DataForWarEventDescRenderer): void {              // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const nodeId    = data.nodeId;
            const node      = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
            if (node == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForConditionNode() empty node.`);
                this._labelDesc.text = `_updateForConditionNode() empty node!`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForConditionNode(fullData, node, data.eventId);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${node.isAnd ? Lang.getText(Lang.Type.A0162) : Lang.getText(Lang.Type.A0163)}`;
        }
        private _updateForCondition(data: DataForWarEventDescRenderer): void {                  // DONE
            const fullData      = data.war.getWarEventManager().getWarEventFullData();
            const conditionId   = data.conditionId;
            const condition     = (fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === conditionId);
            if (condition == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForCondition() empty condition.`);
                this._labelDesc.text = `_updateForCondition() empty condition.`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForCondition(fullData, condition, data.eventId);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${WarEventHelper.getDescForCondition(condition)}`;
        }
        private _updateForAction(data: DataForWarEventDescRenderer): void {                     // DONE
            const fullData  = data.war.getWarEventManager().getWarEventFullData();
            const actionId  = data.actionId;
            const action    = (fullData.actionArray || []).find(v => v.WarEventActionCommonData.actionId === actionId);
            if (action == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForAction() empty action.`);
                this._labelDesc.text = `_updateForAction() empty action.`;
                return;
            }

            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForAction(fullData, action, data.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${WarEventHelper.getDescForAction(action)}`;
        }
    }
}
