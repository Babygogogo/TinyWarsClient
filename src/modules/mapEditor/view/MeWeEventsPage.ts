
namespace TinyWars.MapEditor {
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import Lang                     = Utility.Lang;
    import Notify                   = Utility.Notify;
    import Types                    = Utility.Types;
    import FloatText                = Utility.FloatText;
    import ConfigManager            = Utility.ConfigManager;
    import BwWarEventHelper         = BaseWar.BwWarEventHelper;
    import WarMapModel              = WarMap.WarMapModel;
    import CommonHelpPanel          = Common.CommonHelpPanel;
    import WarEvent                 = ProtoTypes.WarEvent;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import ColorValue               = Types.ColorValue;
    import CommonConstants          = Utility.ConfigManager.COMMON_CONSTANTS;

    export class MeWeEventsPage extends GameUi.UiTabPage {
        private _btnAddEvent    : GameUi.UiButton;
        private _labelNoEvent   : GameUi.UiLabel;
        private _listWarEvent   : GameUi.UiScrollList;

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeWeEventsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._listWarEvent.setItemRenderer(WarEventRenderer);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnAddEvent(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
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
            this._btnAddEvent.label = Lang.getText(Lang.Type.B0320);
        }

        private _updateListWarEventAndLabelNoEvent(): void {
            const dataArray         : DataForWarEventRenderer[] = [];
            const warEventFullData  = MeManager.getWar().getWarEventManager().getWarEventFullData();
            for (const warEvent of warEventFullData.eventArray || []) {
                dataArray.push({
                    warEventId      : warEvent.eventId,
                    warEventFullData: warEventFullData,
                });
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray.sort((v1, v2) => v1.warEventId - v2.warEventId));
        }
    }

    type DataForWarEventRenderer = {
        warEventId      : number;
        warEventFullData: ProtoTypes.Map.IWarEventFullData;
    }
    class WarEventRenderer extends GameUi.UiListItemRenderer {
        private _labelName  : GameUi.UiLabel;
        private _listDesc   : GameUi.UiScrollList;
        private _btnModify  : GameUi.UiButton;
        private _btnDelete  : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listDesc.setItemRenderer(WarEventDescRenderer);
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelName();
            this._updateListDesc();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label   = Lang.getText(Lang.Type.B0220);
            this._btnModify.label   = Lang.getText(Lang.Type.B0317);

            this._updateLabelName();
        }

        private _updateLabelName(): void {
            const data = this.data as DataForWarEventRenderer;
            if (data) {
                const warEventId        = data.warEventId;
                const warEvent          = (data.warEventFullData.eventArray || []).find(v => v.eventId === warEventId);
                this._labelName.text    = `#${warEventId} ${warEvent ? Lang.getLanguageText(warEvent.eventNameArray) : `???`}`;
            }
        }

        private _updateListDesc(): void {
            const data = this.data as DataForWarEventRenderer;
            if (data) {
                this._listDesc.bindData(generateDataArrayForListWarEventDesc(data.warEventId, data.warEventFullData));
            }
        }
    }

    function generateDataArrayForListWarEventDesc(warEventId: number, fullData: IWarEventFullData): DataForWarEventDescRenderer[] {
        const prefixArray = [`${warEventId}`];
        const dataArray: DataForWarEventDescRenderer[] = [{
            warEventFullData: fullData,
            prefixArray,
            eventId         : warEventId,
        }];

        const warEvent = (fullData.eventArray || []).find(v => v.eventId === warEventId);
        if (warEvent == null) {
            return dataArray;
        }

        const nodeId = warEvent.conditionNodeId;
        if (nodeId != null) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc(nodeId, fullData, prefixArray.concat(`N${nodeId}`)));
        } else {
            dataArray.push({
                warEventFullData: fullData,
                prefixArray     : prefixArray.concat(`N??`),
                nodeId          : -1,
            });
        }

        const actionIdArray = warEvent.actionIdArray || [];
        if (!actionIdArray.length) {
            dataArray.push({
                warEventFullData: fullData,
                prefixArray     : prefixArray.concat(`A??`),
                actionId        : -1,
            });
        } else {
            for (const actionId of actionIdArray) {
                dataArray.push({
                    warEventFullData: fullData,
                    prefixArray     : prefixArray.concat(`A${actionId}`),
                    actionId,
                });
            }
        }

        return dataArray;
    }
    function generateNodeDataArrayForListWarEventDesc(nodeId: number, fullData: IWarEventFullData, prefixArray: string[]): DataForWarEventDescRenderer[] {
        const dataArray: DataForWarEventDescRenderer[] = [{
            warEventFullData: fullData,
            nodeId,
            prefixArray,
        }];

        const node = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
        if (node == null) {
            return dataArray;
        }

        for (const conditionId of node.conditionIdArray || []) {
            dataArray.push({
                warEventFullData: fullData,
                conditionId,
                prefixArray     : prefixArray.concat([`C${conditionId}`]),
            });
        }

        for (const subNodeId of node.subNodeIdArray || []) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc(subNodeId, fullData, prefixArray.concat([`N${subNodeId}`])));
        }

        return dataArray;
    }

    type DataForWarEventDescRenderer = {
        prefixArray     : string[];
        warEventFullData: IWarEventFullData;
        eventId?        : number;
        actionId?       : number;
        conditionId?    : number;
        nodeId?         : number;
    }
    class WarEventDescRenderer extends GameUi.UiListItemRenderer {
        private _labelDesc  : GameUi.UiLabel;
        private _btnDelete  : GameUi.UiButton;
        private _btnModify  : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelDesc();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label   = Lang.getText(Lang.Type.B0220);
            this._btnModify.label   = Lang.getText(Lang.Type.B0317);

            this._updateLabelDesc();
        }

        private _updateLabelDesc(): void {
            const data = this.data as DataForWarEventDescRenderer;
            if (data) {
                const labelDesc = this._labelDesc;
                const prefix    = data.prefixArray.join(`.`);
                const fullData  = data.warEventFullData;

                const eventId = data.eventId;
                if (eventId != null) {
                    const event = (fullData.eventArray || []).find(v => v.eventId === eventId);
                    if (event == null) {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0158)}`;
                    } else {
                        labelDesc.textColor = ColorValue.White;
                        labelDesc.text      = `${prefix} ${Lang.getLanguageText(event.eventNameArray)}`;
                    }

                    return;
                }

                const nodeId = data.nodeId;
                if (nodeId != null) {
                    if (nodeId < 0) {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0159)}`;
                        return;
                    }

                    const node = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
                    if (node == null) {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0160)}`;
                        return;
                    }

                    if (((node.subNodeIdArray || []).length) + ((node.conditionIdArray || []).length) <= 0) {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0161)}`;
                        return;
                    }

                    labelDesc.textColor = ColorValue.White;
                    labelDesc.text      = `${prefix} ${node.isAnd ? Lang.getText(Lang.Type.A0162) : Lang.getText(Lang.Type.A0163)}`;
                    return;
                }

                const conditionId = data.conditionId;
                if (conditionId != null) {
                    const condition = (fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === conditionId);
                    if (condition == null) {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0164)}`;
                        return;
                    }

                    const desc = BwWarEventHelper.getDescForCondition(condition);
                    if (desc) {
                        labelDesc.textColor = ColorValue.White;
                        labelDesc.text      = `${prefix} ${desc}`;
                    } else {
                        labelDesc.textColor = ColorValue.Red;
                        labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0165)}`;
                    }

                    return;
                }

                // TODO
            }
        }
    }
}
