
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsMeWar                from "../../mapEditor/model/MeWar";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";
// import TwnsWeCommandPanel       from "./WeCommandPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import ColorValue           = Twns.Types.ColorValue;
    import WarEventDescType     = Twns.Types.WarEventDescType;
    import WarEventFullData     = CommonProto.Map.IWarEventFullData;

    export type OpenDataForCommonWarEventListPanel = {
        warEventFullData    : WarEventFullData;
        warEventIdArray     : number[];
        gameConfig          : Config.GameConfig;
    };
    export class CommonWarEventListPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonWarEventListPanel> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _listWarEventId!       : TwnsUiScrollList.UiScrollList<DataForWarEventIdRenderer>;
        private readonly _listWarEventDetail!   : TwnsUiScrollList.UiScrollList<DataForWarEventDetailRenderer>;
        private readonly _labelNoEvent!         : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
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
            const index             = Twns.Helpers.getExisted(listWarEventId.getRandomIndex(v => v.eventId === newEventId));
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

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._resetListWarEventId(this._listWarEventId.getSelectedData()?.eventId ?? null);
            this._updateListWarEventDetailAndLabelNoEvent();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoEvent.text = Lang.getText(LangTextType.B0278);
            this._labelTitle.text   = Lang.getText(LangTextType.B0469);
            this._btnBack.label     = Lang.getText(LangTextType.B0146);
        }

        private _resetListWarEventId(eventId: number | null): void {
            const dataArray: DataForWarEventIdRenderer[] = [];
            for (const warEventId of (this._getOpenData().warEventIdArray)) {
                dataArray.push({
                    eventId : warEventId,
                    panel   : this,
                });
            }

            const list = this._listWarEventId;
            list.bindData(dataArray.sort((v1, v2) => v1.eventId - v2.eventId));
            list.setSelectedIndex(list.getFirstIndex(v => v.eventId === eventId) ?? (dataArray.length ? 0 : -1));
        }

        private _updateListWarEventDetailAndLabelNoEvent(): void {
            const openData          = this._getOpenData();
            const dataArray         : DataForWarEventDetailRenderer[] = [];
            const eventId           = this._listWarEventId.getSelectedData()?.eventId;
            if (eventId != null) {
                dataArray.push(...generateDataArrayForListWarEventDesc({
                    warEventFullData    : openData.warEventFullData,
                    gameConfig          : openData.gameConfig,
                    eventId,
                }));
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEventDetail.bindData(dataArray);
        }
    }

    function generateDataArrayForListWarEventDesc({ warEventFullData, gameConfig, eventId }: {
        warEventFullData    : WarEventFullData;
        gameConfig          : Config.GameConfig;
        eventId             : number;
    }): DataForWarEventDetailRenderer[] {
        const prefixArray   = [`E${eventId}`];
        const dataArray     : DataForWarEventDetailRenderer[] = [{
            warEventFullData,
            gameConfig,
            descType        : WarEventDescType.EventName,
            prefixArray,
            eventId,
        }];

        const warEvent = warEventFullData.eventArray?.find(v => v.eventId === eventId);
        if (warEvent == null) {
            return dataArray;
        }

        dataArray.push(
            {
                warEventFullData,
                gameConfig,
                descType        : WarEventDescType.EventMaxCallCountInPlayerTurn,
                prefixArray,
                eventId,
            },
            {
                warEventFullData,
                gameConfig,
                descType        : WarEventDescType.EventMaxCallCountTotal,
                prefixArray,
                eventId,
            },
        );

        const nodeId = warEvent.conditionNodeId;
        if (nodeId != null) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                warEventFullData,
                gameConfig,
                eventId,
                parentNodeId: null,
                nodeId,
                prefixArray : prefixArray.concat(`N${nodeId}`),
            }));
        }

        for (const actionId of warEvent.actionIdArray || []) {
            dataArray.push({
                warEventFullData,
                gameConfig,
                descType        : WarEventDescType.Action,
                prefixArray     : prefixArray.concat(`A${actionId}`),
                eventId,
                actionId,
            });
        }

        return dataArray;
    }
    function generateNodeDataArrayForListWarEventDesc({ warEventFullData, gameConfig, eventId, parentNodeId, nodeId, prefixArray }: {
        warEventFullData    : WarEventFullData;
        gameConfig          : Config.GameConfig;
        eventId             : number;
        parentNodeId        : number | null;
        nodeId              : number;
        prefixArray         : string[];
    }): DataForWarEventDetailRenderer[] {
        const dataArray: DataForWarEventDetailRenderer[] = [{
            warEventFullData,
            gameConfig,
            descType        : WarEventDescType.ConditionNode,
            prefixArray,
            eventId,
            parentNodeId    : parentNodeId ?? void 0,
            nodeId,
        }];

        const node = warEventFullData.conditionNodeArray?.find(v => v.nodeId === nodeId);
        if (node == null) {
            return dataArray;
        }

        for (const conditionId of node.conditionIdArray || []) {
            dataArray.push({
                warEventFullData,
                gameConfig,
                descType        : WarEventDescType.Condition,
                prefixArray     : prefixArray.concat([`C${conditionId}`]),
                eventId,
                parentNodeId    : nodeId,
                conditionId,
            });
        }

        for (const subNodeId of node.subNodeIdArray || []) {
            dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                warEventFullData,
                gameConfig,
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
        panel   : CommonWarEventListPanel;
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
        warEventFullData    : WarEventFullData;
        gameConfig          : Config.GameConfig;
        descType            : WarEventDescType;
        prefixArray         : string[];
        eventId             : number;
        actionId?           : number;
        conditionId?        : number;
        parentNodeId?       : number;
        nodeId?             : number;
    };
    class WarEventDetailRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
        private readonly _btnModify!        : TwnsUiButton.UiButton;
        private readonly _groupDesc!        : eui.Group;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
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
            const fullData                  = data.warEventFullData;
            const eventId                   = data.eventId;
            const event                     = Twns.Helpers.getExisted(fullData.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text                = `${Lang.getLanguageText({ textArray: event.eventNameArray })}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
            const eventId                   = data.eventId;
            const event                     = Twns.Helpers.getExisted(data.warEventFullData.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${Lang.getText(LangTextType.B0476)}: ${event.maxCallCountInPlayerTurn}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
            const eventId                   = data.eventId;
            const event                     = Twns.Helpers.getExisted(data.warEventFullData.eventArray?.find(v => v.eventId === eventId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${Lang.getText(LangTextType.B0477)}: ${event.maxCallCountTotal}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
            const fullData                  = data.warEventFullData;
            const nodeId                    = data.nodeId;
            const node                      = Twns.Helpers.getExisted(fullData.conditionNodeArray?.find(v => v.nodeId === nodeId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${node.isAnd ? Lang.getText(LangTextType.A0162) : Lang.getText(LangTextType.A0163)}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
            const fullData                  = data.warEventFullData;
            const conditionId               = data.conditionId;
            const condition                 = Twns.Helpers.getExisted(fullData.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${WarHelpers.WarEventHelpers.getDescForCondition(condition, data.gameConfig)}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
            const fullData                  = data.warEventFullData;
            const actionId                  = data.actionId;
            const action                    = Twns.Helpers.getExisted(fullData.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
            const prefixArray               = data.prefixArray;
            this._btnModify.label           = prefixArray[prefixArray.length - 1];
            this._labelDesc.text            = `${WarHelpers.WarEventHelpers.getDescForAction(action, data.gameConfig)}`;
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
        private _updatePositionForBtnModifyAndGroupDesc(prefixArrayLength: number): void {
            const placeholderWidth  = (prefixArrayLength - 1) * 16;
            this._btnModify.x       = placeholderWidth;
            this._groupDesc.left    = placeholderWidth + 60;
        }
    }
}

// export default TwnsCommonWarEventListPanel;
