
// import TwnsMeWar            from "../../mapEditor/model/MeWar";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import WarMapProxy          from "../../warMap/model/WarMapProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmAcceptMapPanel {
    import MeWar        = Twns.MapEditor.MeWar;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import LangTextType = TwnsLangTextType.LangTextType;

    export type OpenData = {
        war: MeWar;
    };
    export class MmAcceptMapPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;
        private readonly _inputReason!  : TwnsUiTextInput.UiTextInput;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._inputReason.maxChars  = CommonConstants.MapReviewCommentMaxLength;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }
        private _onTouchedBtnConfirm(): void {
            const war       = this._getOpenData().war;
            const callback  = () => {
                WarMapProxy.reqMmReviewMap({
                    designerUserId  : war.getMapDesignerUserId(),
                    slotIndex       : war.getMapSlotIndex(),
                    modifiedTime    : war.getMapModifiedTime(),
                    isAccept        : true,
                    reviewComment   : this._inputReason.text,
                });
                this.close();
            };
            if (!war.getTemplateWarRuleArray().some(v => v.ruleAvailability?.canMrw)) {
                callback();
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0296),
                    callback,
                });
            }
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._labelTitle.text   = Lang.getText(LangTextType.B0296);
            this._labelTips.text    = Lang.getText(LangTextType.A0105);
        }
    }
}

// export default TwnsMmAcceptMapPanel;
