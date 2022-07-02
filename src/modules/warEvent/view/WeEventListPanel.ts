
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsMeWar                from "../../mapEditor/model/MeWar";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";
// import TwnsWeCommandPanel       from "./WeCommandPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import MeWar                = MapEditor.MeWar;
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;
    import ColorValue           = Types.ColorValue;
    import WarEventDescType     = Types.WarEventDescType;

    export type OpenDataForWeEventListPanel = {
        war: MeWar;
    };
    export class WeEventListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeEventListPanel> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnAddEvent!          : TwnsUiButton.UiButton;
        private readonly _btnClear!             : TwnsUiButton.UiButton;
        private readonly _btnEventList!         : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _listWarEventId!       : TwnsUiScrollList.UiScrollList<DataForWarEventIdRenderer>;
        private readonly _listWarEventDetail!   : TwnsUiScrollList.UiScrollList<DataForWarEventDetailRenderer>;
        private readonly _labelNoEvent!         : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
                { ui: this._btnClear,       callback: this._onTouchedBtnClear },
                { ui: this._btnEventList,   callback: this._onTouchedBtnEventList },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listWarEventId.setItemRenderer(WarEventIdRenderer);
            this._listWarEventDetail.setItemRenderer(WarEventDetailRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedEventId(newEventId: number, needScroll: boolean): void {
            const listWarEventId    = this._listWarEventId;
            const index             = Helpers.getExisted(listWarEventId.getRandomIndex(v => v.eventId === newEventId));
            listWarEventId.setSelectedIndex(index);
            this._updateListWarEventDetailAndLabelNoEvent();

            if (needScroll) {
                listWarEventId.scrollVerticalToIndex(index);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMeWarEventFullDataChanged(): void {
            this._resetListWarEventId(this._listWarEventId.getSelectedData()?.eventId ?? null);
            this._updateListWarEventDetailAndLabelNoEvent();
        }

        private _onTouchedBtnAddEvent(): void {
            const fullData  = Helpers.getExisted(this._getOpenData().war.getWarEventManager().getWarEventFullData());
            const eventId   = WarHelpers.WarEventHelpers.addEvent(fullData);
            if (eventId != null) {
                const subNodeId = WarHelpers.WarEventHelpers.createAndReplaceSubNodeInEvent({ fullData, eventId });
                if (subNodeId != null) {
                    WarHelpers.WarEventHelpers.addDefaultCondition(fullData, subNodeId);
                }

                WarHelpers.WarEventHelpers.addDefaultAction(fullData, eventId);

                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0188),
                callback: () => {
                    const result = WarHelpers.WarEventHelpers.checkAndDeleteUnusedComponents(Helpers.getExisted(openData.war.getWarEventManager().getWarEventFullData()));
                    FloatText.show(Lang.getFormattedText(LangTextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnEventList(): void {
            const war = this._getOpenData().war;
            PanelHelpers.open(PanelHelpers.PanelDict.WeEventNameListPanel, {
                gameConfig              : war.getGameConfig(),
                templateWarRuleArray    : war.getTemplateWarRuleArray(),
                fullData                : Helpers.getExisted(war.getWarEventManager().getWarEventFullData()),
                selectedEventId         : this._listWarEventId.getSelectedData()?.eventId ?? null,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._resetListWarEventId(this._listWarEventId.getSelectedData()?.eventId ?? null);
            this._updateListWarEventDetailAndLabelNoEvent();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoEvent.text     = Lang.getText(LangTextType.B0278);
            this._labelTitle.text       = Lang.getText(LangTextType.B0469);
            this._btnAddEvent.label     = Lang.getText(LangTextType.B0497);
            this._btnClear.label        = Lang.getText(LangTextType.B0498);
            this._btnEventList.label    = Lang.getText(LangTextType.B0461);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
        }

        private _resetListWarEventId(eventId: number | null): void {
            const dataArray: DataForWarEventIdRenderer[] = [];
            for (const warEvent of (this._getOpenData().war.getWarEventManager().getWarEventFullData()?.eventArray || [])) {
                dataArray.push({
                    eventId : Helpers.getExisted(warEvent.eventId),
                    panel   : this,
                });
            }

            const list = this._listWarEventId;
            list.bindData(dataArray.sort((v1, v2) => v1.eventId - v2.eventId));
            list.setSelectedIndex(list.getFirstIndex(v => v.eventId === eventId) ?? (dataArray.length ? 0 : -1));
        }

        private _updateListWarEventDetailAndLabelNoEvent(): void {
            const war       = this._getOpenData().war;
            const dataArray : DataForWarEventDetailRenderer[] = [];
            const eventId   = this._listWarEventId.getSelectedData()?.eventId;
            if (eventId != null) {
                dataArray.push(...generateDataArrayForListWarEventDesc({
                    war,
                    eventId,
                }));
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEventDetail.bindData(dataArray);
        }
    }

    function generateDataArrayForListWarEventDesc({ war, eventId }: {
        war         : MeWar;
        eventId     : number;
    }): DataForWarEventDetailRenderer[] {
        const prefixArray   = [`E${eventId}`];
        const dataArray     : DataForWarEventDetailRenderer[] = [{
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
                parentNodeId: null,
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
        parentNodeId: number | null;
        nodeId      : number;
        prefixArray : string[];
    }): DataForWarEventDetailRenderer[] {
        const dataArray: DataForWarEventDetailRenderer[] = [{
            war,
            descType        : WarEventDescType.ConditionNode,
            prefixArray,
            eventId,
            parentNodeId    : parentNodeId ?? void 0,
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

    type DataForWarEventIdRenderer = {
        eventId : number;
        panel   : WeEventListPanel;
    };
    class WarEventIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventIdRenderer> {
        private readonly _labelEventId! : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelEventId.text = `E${this._getData().eventId}`;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedEventId(data.eventId, false);
        }
    }

    type DataForWarEventDetailRenderer = {
        war             : MeWar;
        descType        : WarEventDescType;
        prefixArray     : string[];
        eventId         : number;
        actionId?       : number;
        conditionId?    : number;
        parentNodeId?   : number;
        nodeId?         : number;
    };
    class WarEventDetailRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
        private readonly _btnModify!        : TwnsUiButton.UiButton;
        private readonly _groupDesc!        : eui.Group;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;

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
                PanelHelpers.open(PanelHelpers.PanelDict.WeCommandPanel, {
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
                    const labelDesc                 = this._labelDesc;
                    const prefixArray               = data.prefixArray;
                    // const prefix        = prefixArray.join(`.`);
                    this._btnModify.label           = prefixArray[prefixArray.length - 1];
                    labelDesc.textColor             = ColorValue.Red;
                    labelDesc.text                  = `${Lang.getText(LangTextType.A0166)}`;
                    this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
                }
            }
        }
        private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
            const fullData                  = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const eventId                   = data.eventId;
            const event                     = Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForEvent(fullData, event);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text                = `${Lang.getLanguageText({ textArray: event.eventNameArray })}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
            const eventId                   = data.eventId;
            const event                     = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForEventCallCountInPlayerTurn(event);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${Lang.getText(LangTextType.B0476)}: ${event.maxCallCountInPlayerTurn}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
            const eventId                   = data.eventId;
            const event                     = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData()?.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForEventCallCountTotal(event);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${Lang.getText(LangTextType.B0477)}: ${event.maxCallCountTotal}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
            const fullData                  = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const nodeId                    = data.nodeId;
            const node                      = Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === nodeId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForConditionNode(fullData, node);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${node.isAnd ? Lang.getText(LangTextType.A0162) : Lang.getText(LangTextType.A0163)}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
            const war                       = data.war;
            const fullData                  = Helpers.getExisted(data.war.getWarEventManager().getWarEventFullData());
            const conditionId               = data.conditionId;
            const condition                 = Helpers.getExisted(fullData.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForCondition(fullData, condition, war);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig())}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
            const war                       = data.war;
            const fullData                  = Helpers.getExisted(war.getWarEventManager().getWarEventFullData());
            const actionId                  = data.actionId;
            const action                    = Helpers.getExisted(fullData.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
            const prefixArray               = data.prefixArray;
            const errorTip                  = WarHelpers.WarEventHelpers.getErrorTipForAction(fullData, action, war);
            const labelError                = this._labelError;
            labelError.text                 = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor            = errorTip ? ColorValue.Red : ColorValue.Green;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${WarHelpers.WarEventHelpers.getDescForAction(action, war.getGameConfig())}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updatePositionForBtnModifyAndGroupDesc(prefixArrayLength: number): void {
            const placeholderWidth  = (prefixArrayLength - 1) * 16;
            this._btnModify.x       = placeholderWidth;
            this._groupDesc.left    = placeholderWidth + 60;
        }
    }
}

// export default TwnsWeEventListPanel;
