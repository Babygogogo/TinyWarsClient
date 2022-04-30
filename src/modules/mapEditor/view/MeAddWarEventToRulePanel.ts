
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import MeModel                  from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeAddWarEventToRulePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = {
        templateWarRule : CommonProto.WarRule.ITemplateWarRule;
        warEventArray   : CommonProto.WarEvent.IWarEvent[];
    };
    export class MeAddWarEventToRulePanel extends TwnsUiPanel.UiPanel<OpenData>{
        private readonly _listWarEvent!     : TwnsUiScrollList.UiScrollList<DataForWarEventRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoWarEvent!  : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listWarEvent.setItemRenderer(WarEventRenderer);
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

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListMessageAndLabelNoMessage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0468);
            this._labelNoWarEvent.text  = Lang.getText(LangTextType.B0278);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListMessageAndLabelNoMessage(): void {
            const openData          = this._getOpenData();
            const templateWarRule   = openData.templateWarRule;
            const warEventArray     = openData.warEventArray;
            const dataArray         : DataForWarEventRenderer[] = [];
            for (const warEvent of warEventArray) {
                dataArray.push({
                    warEventId      : Helpers.getExisted(warEvent.eventId),
                    warEventArray,
                    templateWarRule,
                });
            }

            this._labelNoWarEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray.sort((v1, v2) => v1.warEventId - v2.warEventId));
        }
    }

    type DataForWarEventRenderer = {
        warEventId      : number;
        warEventArray   : CommonProto.WarEvent.IWarEvent[];
        templateWarRule : CommonProto.WarRule.ITemplateWarRule;
    };
    class WarEventRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventRenderer> {
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _btnDelete!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _btnAdd!       : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnAdd,     callback: this._onTouchedBtnAdd },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MeWarEventIdArrayChanged,   callback: this._onNotifyMeWarEventIdArrayChanged },
            ]);
            this._updateComponentsForLanguage();
            this._btnDelete.setTextColor(0xFF0000);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMeWarEventIdArrayChanged(): void {
            this._updateBtnAddAndBtnDelete();
        }
        private _onTouchedBtnAdd(): void {
            const data = this.data;
            if (data) {
                Twns.WarHelpers.WarRuleHelpers.addWarEventId(data.templateWarRule, data.warEventId);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                Twns.WarHelpers.WarRuleHelpers.deleteWarEventId(data.templateWarRule, data.warEventId);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }

        protected async _onDataChanged(): Promise<void> {
            const data          = this._getData();
            this._labelId.text  = `#${data.warEventId}`;
            this._updateLabelName();
            this._updateBtnAddAndBtnDelete();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label   = Lang.getText(LangTextType.B0220);
            this._btnAdd.label      = Lang.getText(LangTextType.B0467);

            this._updateLabelName();
        }

        private _updateLabelName(): void {
            if (this._checkHasData()) {
                const data              = this._getData();
                this._labelName.text    = Lang.getLanguageText({ textArray: data.warEventArray.find(v => v.eventId === data.warEventId)?.eventNameArray }) ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private _updateBtnAddAndBtnDelete(): void {
            const data = this.data;
            if (data) {
                const isAdded               = (data.templateWarRule.warEventIdArray || []).indexOf(data.warEventId) >= 0;
                this._btnAdd.visible        = !isAdded;
                this._btnDelete.visible     = isAdded;
            }
        }
    }
}

// export default TwnsMeAddWarEventToRulePanel;
