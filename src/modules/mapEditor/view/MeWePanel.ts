
namespace TinyWars.MapEditor {
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import Lang                     = Utility.Lang;
    import Notify                   = Utility.Notify;
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import FloatText                = Utility.FloatText;
    import ConfigManager            = Utility.ConfigManager;
    import BwWarEventHelper         = BaseWar.BwWarEventHelper;
    import WarMapModel              = WarMap.WarMapModel;
    import CommonHelpPanel          = Common.CommonHelpPanel;
    import CommonConfirmPanel       = Common.CommonConfirmPanel;
    import CommonInputPanel         = Common.CommonInputPanel;
    import WarEvent                 = ProtoTypes.WarEvent;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEvent                = WarEvent.IWarEvent;
    import IWarEventAction          = WarEvent.IWarEventAction;
    import IWarEventCondition       = WarEvent.IWarEventCondition;
    import IWarEventConditionNode   = WarEvent.IWarEventConditionNode;
    import ColorValue               = Types.ColorValue;
    import LanguageType             = Types.LanguageType;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    export class MeWePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWePanel;

        private _btnBack        : GameUi.UiButton;
        private _btnAddEvent    : GameUi.UiButton;
        private _labelTitle     : GameUi.UiLabel;
        private _labelNoEvent   : GameUi.UiLabel;
        private _listWarEvent   : GameUi.UiScrollList;

        private _eventManager   : BaseWar.BwWarEventManager;

        public static show(): void {
            if (!MeWePanel._instance) {
                MeWePanel._instance = new MeWePanel();
            }
            MeWePanel._instance.open(undefined);
        }
        public static hide(): void {
            if (MeWePanel._instance) {
                MeWePanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/mapEditor/MeWePanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MeWarEventFullDataChanged,  callback: this._onNotifyMeWarEventFullDataChanged },
            ]);
            this._listWarEvent.setItemRenderer(WarEventDescRenderer);

            this._eventManager = MeManager.getWar().getWarEventManager();

            this._updateView();
        }
        protected _onClosed(): void {
            this._eventManager = null;
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
            const fullData = this._eventManager.getWarEventFullData();
            if (fullData.eventArray == null) {
                fullData.eventArray = [];
            }

            const eventArray        = fullData.eventArray;
            const maxEventsCount    = CommonConstants.WarEventMaxEventsPerMap;
            if (eventArray.length >= maxEventsCount) {
                FloatText.show(Lang.getText(Lang.Type.A0170));
            } else {
                for (let eventId = 1; eventId <= maxEventsCount; ++eventId) {
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
                        Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);

                        return;
                    }
                }
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
            const dataArray : DataForWarEventDescRenderer[] = [];
            const fullData  = MeManager.getWar().getWarEventManager().getWarEventFullData();
            if (fullData) {
                for (const warEvent of (fullData.eventArray || []).concat().sort((v1, v2) => v1.eventId - v2.eventId)) {
                    dataArray.push(...generateDataArrayForListWarEventDesc(warEvent.eventId, fullData));
                }
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray);
        }
    }

    function generateDataArrayForListWarEventDesc(eventId: number, fullData: IWarEventFullData): DataForWarEventDescRenderer[] {
        const prefixArray   = [`E${eventId}`];
        const dataArray     : DataForWarEventDescRenderer[] = [{
            descType        : DescType.EventName,
            prefixArray,
            warEventFullData: fullData,
            eventId,
        }];

        const warEvent = (fullData.eventArray || []).find(v => v.eventId === eventId);
        if (warEvent == null) {
            return dataArray;
        }

        dataArray.push(
            {
                descType        : DescType.EventMaxCallCountInPlayerTurn,
                prefixArray,
                warEventFullData: fullData,
                eventId,
            },
            {
                descType        : DescType.EventMaxCallCountTotal,
                prefixArray,
                warEventFullData: fullData,
                eventId,
            },
        );

        const nodeId = warEvent.conditionNodeId;
        if (nodeId != null) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({ eventId, nodeId, fullData, prefixArray: prefixArray.concat(`N${nodeId}`) }));
        } else {
            dataArray.push({
                descType        : DescType.ConditionNode,
                prefixArray     : prefixArray.concat(`N??`),
                warEventFullData: fullData,
                eventId,
                nodeId          : -1,
            });
        }

        const actionIdArray = warEvent.actionIdArray || [];
        if (!actionIdArray.length) {
            dataArray.push({
                descType        : DescType.Action,
                prefixArray     : prefixArray.concat(`A??`),
                warEventFullData: fullData,
                eventId,
                actionId        : -1,
            });
        } else {
            for (const actionId of actionIdArray) {
                dataArray.push({
                    descType        : DescType.Action,
                    prefixArray     : prefixArray.concat(`A${actionId}`),
                    warEventFullData: fullData,
                    eventId,
                    actionId,
                });
            }
        }

        return dataArray;
    }
    function generateNodeDataArrayForListWarEventDesc({ eventId, nodeId, fullData, prefixArray }: {
        eventId     : number;
        nodeId      : number;
        fullData    : IWarEventFullData;
        prefixArray : string[];
    }): DataForWarEventDescRenderer[] {
        const dataArray: DataForWarEventDescRenderer[] = [{
            descType        : DescType.ConditionNode,
            prefixArray,
            warEventFullData: fullData,
            eventId,
            nodeId,
        }];

        const node = (fullData.conditionNodeArray || []).find(v => v.nodeId === nodeId);
        if (node == null) {
            return dataArray;
        }

        for (const conditionId of node.conditionIdArray || []) {
            dataArray.push({
                descType        : DescType.Condition,
                prefixArray     : prefixArray.concat([`C${conditionId}`]),
                warEventFullData: fullData,
                eventId,
                conditionId,
            });
        }

        for (const subNodeId of node.subNodeIdArray || []) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                eventId,
                nodeId      : subNodeId,
                fullData,
                prefixArray : prefixArray.concat([`N${subNodeId}`])
            }));
        }

        return dataArray;
    }

    const enum DescType {
        EventName,
        EventMaxCallCountInPlayerTurn,
        EventMaxCallCountTotal,
        ConditionNode,
        Condition,
        Action,
    }
    type DataForWarEventDescRenderer = {
        descType        : DescType;
        prefixArray     : string[];
        warEventFullData: IWarEventFullData;
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        nodeId?         : number;
    }
    class WarEventDescRenderer extends GameUi.UiListItemRenderer {
        private _labelDesc                      : GameUi.UiLabel;
        private _groupBtn                       : eui.Group;
        private _btnModifyEventName             : GameUi.UiButton;
        private _btnModifyMaxCallCountPerTurn   : GameUi.UiButton;
        private _btnModifyMaxCallCountTotal     : GameUi.UiButton;
        private _btnDeleteEvent                 : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModifyEventName,             callback: this._onTouchedBtnModifyEventName },
                { ui: this._btnModifyMaxCallCountPerTurn,   callback: this._onTouchedBtnModifyMaxCallCountPerTurn },
                { ui: this._btnModifyMaxCallCountTotal,     callback: this._onTouchedBtnModifyMaxCallCountTotal },
                { ui: this._btnDeleteEvent,                 callback: this._onTouchedBtnDeleteEvent },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyEventName(e: egret.TouchEvent): void {
            const data = this.data as DataForWarEventDescRenderer;
            if (data) {
                MeWeEventRenamePanel.show({ warEventId: data.eventId });
            }
        }
        private _onTouchedBtnModifyMaxCallCountPerTurn(e: egret.TouchEvent): void {
            const data = this.data as DataForWarEventDescRenderer;
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
            const data = this.data as DataForWarEventDescRenderer;
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
            const data      = this.data as DataForWarEventDescRenderer;
            const eventId   = data.eventId;
            CommonConfirmPanel.show({
                title   : `${Lang.getText(Lang.Type.B0479)} #${eventId}`,
                content : Lang.getText(Lang.Type.A0171),
                callback: () => {
                    const eventArray = data.warEventFullData.eventArray;
                    eventArray.splice(eventArray.findIndex(v => v.eventId === eventId), 1);

                    MeManager.getWar().getWarRuleArray().forEach(v => {
                        const arr = v.warEventIdArray;
                        if (arr) {
                            arr.splice(arr.indexOf(eventId), 1);
                        }
                    });

                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                },
            });
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelDescAndButtons();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDeleteEvent.label                  = Lang.getText(Lang.Type.B0220);
            this._btnModifyEventName.label              = Lang.getText(Lang.Type.B0317);
            this._btnModifyMaxCallCountPerTurn.label    = Lang.getText(Lang.Type.B0317);
            this._btnModifyMaxCallCountTotal.label      = Lang.getText(Lang.Type.B0317);

            this._updateLabelDescAndButtons();
        }

        private _updateLabelDescAndButtons(): void {
            const data = this.data as DataForWarEventDescRenderer;
            if (data) {
                const descType = data.descType;
                if (descType === DescType.EventName) {
                    this._updateForEvent(data);
                } else if (descType === DescType.EventMaxCallCountInPlayerTurn) {
                    this._updateForEventCallCountInPlayerTurn(data);
                } else if (descType === DescType.EventMaxCallCountTotal) {
                    this._updateForEventCallCountTotal(data);
                } else if (descType === DescType.ConditionNode) {
                    this._updateForConditionNode(data);
                } else if (descType === DescType.Condition) {
                    this._updateForCondition(data);
                } else if (descType === DescType.Action) {
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
        }
        private _updateForEvent(data: DataForWarEventDescRenderer): void {
            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyEventName);
            group.addChild(this._btnDeleteEvent);

            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0158)}`;
            } else {
                labelDesc.textColor = ColorValue.White;
                labelDesc.text      = `${prefix} ${Lang.getLanguageText({ textArray: event.eventNameArray })}`;
            }
        }
        private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDescRenderer): void {
            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountPerTurn);

            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0158)}`;
            } else {
                labelDesc.textColor = ColorValue.White;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.B0476)}: ${event.maxCallCountInPlayerTurn}`;
            }
        }
        private _updateForEventCallCountTotal(data: DataForWarEventDescRenderer): void {
            const group = this._groupBtn;
            group.removeChildren();
            group.addChild(this._btnModifyMaxCallCountTotal);

            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const eventId   = data.eventId;
            const event     = (fullData.eventArray || []).find(v => v.eventId === eventId);
            if (event == null) {
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.A0158)}`;
            } else {
                labelDesc.textColor = ColorValue.White;
                labelDesc.text      = `${prefix} ${Lang.getText(Lang.Type.B0477)}: ${event.maxCallCountTotal}`;
            }
        }
        private _updateForConditionNode(data: DataForWarEventDescRenderer): void {
            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const nodeId = data.nodeId;
            if ((nodeId == null) || (nodeId < 0)) {
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
        }
        private _updateForCondition(data: DataForWarEventDescRenderer): void {
            const labelDesc     = this._labelDesc;
            const prefixArray   = data.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            const prefix        = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            const fullData      = data.warEventFullData;

            const conditionId = data.conditionId;
            if (conditionId == null) {
                Logger.error(`MeWePanel.WarEventDescRenderer._updateForCondition() empty conditionId.`);
                labelDesc.textColor = ColorValue.Red;
                labelDesc.text      = `${prefix} Error: empty conditionId.`;
                return;
            }

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
        }
        private _updateForAction(data: DataForWarEventDescRenderer): void {
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
