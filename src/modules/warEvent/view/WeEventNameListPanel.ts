
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;
    import IWarEventFullData    = CommonProto.Map.IWarEventFullData;

    export type OpenDataForWeEventNameListPanel = {
        gameConfig              : Config.GameConfig;
        templateWarRuleArray    : CommonProto.WarRule.ITemplateWarRule[];
        fullData                : IWarEventFullData;
        selectedEventId         : number | null;
    };
    export class WeEventNameListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeEventNameListPanel> {
        private readonly _listEvent!        : TwnsUiScrollList.UiScrollList<DataForEventRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoEvent!     : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listEvent.setItemRenderer(ConditionRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListConditionAndLabelNoCondition();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0461);
            this._labelNoEvent.text     = Lang.getText(LangTextType.B0278);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListConditionAndLabelNoCondition(): void {
            const openData              = this._getOpenData();
            const fullData              = openData.fullData;
            const gameConfig            = openData.gameConfig;
            const selectedEventId       = openData.selectedEventId;
            const templateWarRuleArray  = openData.templateWarRuleArray;
            const dataArray             : DataForEventRenderer[] = [];
            for (const eventData of openData.fullData.eventArray ?? []) {
                dataArray.push({
                    gameConfig,
                    selectedEventId,
                    templateWarRuleArray,
                    eventId         : Helpers.getExisted(eventData?.eventId),
                    fullData,
                    panel           : this,
                });
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listEvent.bindData(dataArray);
        }
    }

    type DataForEventRenderer = {
        gameConfig              : Config.GameConfig;
        templateWarRuleArray    : CommonProto.WarRule.ITemplateWarRule[];
        selectedEventId         : number | null;
        eventId                 : number;
        fullData                : IWarEventFullData;
        panel                   : WeEventNameListPanel;
    };
    class ConditionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForEventRenderer> {
        private readonly _labelEventId!     : TwnsUiLabel.UiLabel;
        private readonly _labelEvent!       : TwnsUiLabel.UiLabel;
        private readonly _btnShallowClone!  : TwnsUiButton.UiButton;
        private readonly _btnDeepClone!     : TwnsUiButton.UiButton;
        private readonly _btnSelect!        : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDeepClone,       callback: this._onTouchedBtnDeepClone },
                { ui: this._btnShallowClone,    callback: this._onTouchedBtnShallowClone },
                { ui: this._btnSelect,          callback: this._onTouchedBtnSelect },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateLabelEventId();
            this._updateLabelEvent();
            this._updateBtnSelect();
        }

        private _onTouchedBtnDeepClone(): void {          // DONE
            const data = this._getData();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const newEventId = WarHelpers.WarEventHelpers.cloneEvent(data.fullData, data.eventId, false);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `E${newEventId}`));

                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnShallowClone(): void {
            const data = this._getData();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const newEventId = WarHelpers.WarEventHelpers.cloneEvent(data.fullData, data.eventId, true);
                    FloatText.show(Lang.getFormattedText(LangTextType.F0084, `E${newEventId}`));

                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnSelect(): void {        // DONE
            const data = this._getData();
            (PanelHelpers.getRunningPanel(PanelHelpers.PanelDict.WeEventListPanel) as WeEventListPanel)?.setAndReviseSelectedEventId(data.eventId, true);
            data.panel.close();
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDeepClone.label    = Lang.getText(LangTextType.B0748);
            this._btnShallowClone.label = Lang.getText(LangTextType.B0487);
            this._btnSelect.label       = Lang.getText(LangTextType.B0258);

            this._updateLabelEventId();
            this._updateLabelEvent();
        }

        private _updateLabelEventId(): void {
            const data              = this._getData();
            const eventId           = data.eventId;
            const warRuleNameArray  = data.templateWarRuleArray?.filter(rule => rule.warEventIdArray?.some(v => v === eventId)).map(v => `R${v.ruleId}`);
            this._labelEventId.text = `E${eventId} (${Lang.getText(LangTextType.B0749)}: ${warRuleNameArray?.length ? warRuleNameArray.join(`, `) : Lang.getText(LangTextType.B0001)})`;
        }
        private _updateLabelEvent(): void {
            const data      = this._getData();
            const warEvent  = data.fullData.eventArray?.find(v => v.eventId === data.eventId);
            const label     = this._labelEvent;
            if (warEvent == null) {
                label.text = Lang.getText(LangTextType.A0158);
            } else {
                label.text = Lang.getLanguageText({ textArray: warEvent.eventNameArray }) ?? CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateBtnSelect(): void {
            const data              = this._getData();
            this._btnSelect.visible = data.selectedEventId !== data.eventId;
        }
    }
}

// export default TwnsWeEventNameListPanel;
