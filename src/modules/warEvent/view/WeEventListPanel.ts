
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import TwnsMeWar                from "../../mapEditor/model/MeWar";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import WarEventHelper           from "../model/WarEventHelper";
import TwnsWeCommandPanel       from "./WeCommandPanel";

namespace TwnsWeEventListPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MeWar                = TwnsMeWar.MeWar;
    import WeCommandPanel       = TwnsWeCommandPanel.WeCommandPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import ColorValue           = Types.ColorValue;
    import WarEventDescType     = Types.WarEventDescType;

    type OpenDataForWeEventListPanel = {
        war: MeWar;
    };
    export class WeEventListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeEventListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeEventListPanel;

        private readonly _btnBack!      : TwnsUiButton.UiButton;
        private readonly _btnAddEvent!  : TwnsUiButton.UiButton;
        private readonly _btnClear!     : TwnsUiButton.UiButton;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelNoEvent! : TwnsUiLabel.UiLabel;
        private readonly _listWarEvent! : TwnsUiScrollList.UiScrollList<DataForWarEventDescRenderer>;

        public static show(openData: OpenDataForWeEventListPanel): void {
            if (!WeEventListPanel._instance) {
                WeEventListPanel._instance = new WeEventListPanel();
            }
            WeEventListPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeEventListPanel._instance) {
                await WeEventListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/warEvent/WeEventListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
                { ui: this._btnClear,       callback: this._onTouchedBtnClear },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
            ]);
            this._listWarEvent.setItemRenderer(WarEventDescRenderer);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMeWarEventFullDataChanged(): void {
            this._updateListWarEventAndLabelNoEvent();
        }

        private _onTouchedBtnAddEvent(): void {
            const fullData  = Helpers.getExisted(this._getOpenData().war.getWarEventManager().getWarEventFullData());
            const eventId   = WarEventHelper.addEvent(fullData);
            if (eventId != null) {
                WarEventHelper.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId,
                });
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(): void {
            const openData = this._getOpenData();
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0188),
                callback: () => {
                    const result = WarEventHelper.checkAndDeleteUnusedComponents(Helpers.getExisted(openData.war.getWarEventManager().getWarEventFullData()));
                    FloatText.show(Lang.getFormattedText(LangTextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListWarEventAndLabelNoEvent();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoEvent.text = Lang.getText(LangTextType.B0278);
            this._labelTitle.text   = Lang.getText(LangTextType.B0469);
            this._btnAddEvent.label = Lang.getText(LangTextType.B0497);
            this._btnClear.label    = Lang.getText(LangTextType.B0498);
            this._btnBack.label     = Lang.getText(LangTextType.B0146);
        }

        private _updateListWarEventAndLabelNoEvent(): void {
            const war       = this._getOpenData().war;
            const dataArray : DataForWarEventDescRenderer[] = [];
            for (const warEvent of (war.getWarEventManager().getWarEventFullData()?.eventArray || []).concat().sort((v1, v2) => Helpers.getExisted(v1.eventId) - Helpers.getExisted(v2.eventId))) {
                dataArray.push(...generateDataArrayForListWarEventDesc({
                    war,
                    eventId : Helpers.getExisted(warEvent.eventId),
                }));
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray);
        }
    }

    function generateDataArrayForListWarEventDesc({ war, eventId }: {
        war         : MeWar;
        eventId     : number;
    }): DataForWarEventDescRenderer[] {
        const prefixArray   = [`E${eventId}`];
        const dataArray     : DataForWarEventDescRenderer[] = [{
            war,
            descType        : WarEventDescType.EventName,
            prefixArray,
            eventId,
        }];

        const warEvent = (war.getWarEventManager().getWarEventFullData()?.eventArray || []).find(v => v.eventId === eventId);
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
        war         : MeWar;
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

        const node = (war.getWarEventManager().getWarEventFullData()?.conditionNodeArray || []).find(v => v.nodeId === nodeId);
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
        war             : MeWar;
        descType        : WarEventDescType;
        prefixArray     : string[];
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    };
    class WarEventDescRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventDescRenderer> {
        private readonly _btnModify!    : TwnsUiButton.UiButton;
        private readonly _labelPrefix!  : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!    : TwnsUiLabel.UiLabel;
        private readonly _labelError!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify, callback: this._onTouchedBtnModify },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(): void {
            const data = this.data;
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

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateLabelDescAndError();
        }

        private _updateComponentsForLanguage(): void {
            this._btnModify.label = Lang.getText(LangTextType.B0317);

            this._updateLabelDescAndError();
        }

        private _updateLabelDescAndError(): void {
            const data = this.data;
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
                    labelDesc.text      = `${Lang.getText(LangTextType.A0166)}`;
                }
            }
        }
        private _updateForEvent(data: DataForWarEventDescRenderer): void {                      // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEvent(fullData, event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getLanguageText({ textArray: event.eventNameArray })}`;
        }
        private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDescRenderer): void { // DONE
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === eventId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getText(LangTextType.B0476)}: ${event.maxCallCountInPlayerTurn}`;
        }
        private _updateForEventCallCountTotal(data: DataForWarEventDescRenderer): void {        // DONE
            const eventId           = data.eventId;
            const event             = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === eventId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForEventCallCountTotal(event);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${Lang.getText(LangTextType.B0477)}: ${event.maxCallCountTotal}`;
        }
        private _updateForConditionNode(data: DataForWarEventDescRenderer): void {              // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const nodeId            = data.nodeId;
            const node              = Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === nodeId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForConditionNode(fullData, node);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${node.isAnd ? Lang.getText(LangTextType.A0162) : Lang.getText(LangTextType.A0163)}`;
        }
        private _updateForCondition(data: DataForWarEventDescRenderer): void {                  // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const conditionId       = data.conditionId;
            const condition         = Helpers.getExisted(fullData.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForCondition(fullData, condition);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${WarEventHelper.getDescForCondition(condition)}`;
        }
        private _updateForAction(data: DataForWarEventDescRenderer): void {                     // DONE
            const fullData          = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const actionId          = data.actionId;
            const action            = Helpers.getExisted(fullData.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
            const prefixArray       = data.prefixArray;
            const errorTip          = WarEventHelper.getErrorTipForAction(fullData, action, data.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
            this._labelPrefix.text  = `${Helpers.repeatString(`  `, (prefixArray.length - 1) * 2)}${prefixArray[prefixArray.length - 1]}`;
            this._labelDesc.text    = `${WarEventHelper.getDescForAction(action)}`;
        }
    }
}

export default TwnsWeEventListPanel;
