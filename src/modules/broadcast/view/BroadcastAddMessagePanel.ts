
// import ChangeLogProxy       from "../../changeLog/model/ChangeLogProxy";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBroadcastAddMessagePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;

    export type OpenData = void;
    export class BroadcastAddMessagePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _inputChinese! : TwnsUiTextInput.UiTextInput;
        private readonly _inputEnglish! : TwnsUiTextInput.UiTextInput;
        private readonly _labelTip!     : TwnsUiLabel.UiLabel;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelChinese! : TwnsUiLabel.UiLabel;
        private readonly _labelEnglish! : TwnsUiLabel.UiLabel;
        private readonly _btnModify!    : TwnsUiButton.UiButton;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._inputChinese.maxChars = CommonConstants.BroadcastTextMaxLength;
            this._inputEnglish.maxChars = CommonConstants.BroadcastTextMaxLength;
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
            this._inputChinese.text = `服务器即将进行停机更新。请尽快保存您的进度以免丢失，谢谢！`;
            this._inputEnglish.text = `The server is about to be down and updated. Please save your progress ASAP, thank you!`;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(): void {
            const chineseText   = this._inputChinese.text.trim() || ``;
            const englishText   = this._inputEnglish.text.trim() || ``;
            const textList      : ILanguageText[] = [];
            if (chineseText) {
                textList.push({ languageType: Types.LanguageType.Chinese, text: chineseText });
            }
            if (englishText) {
                textList.push({ languageType: Types.LanguageType.English, text: englishText });
            }
            if (textList.every(v => Helpers.getExisted(v.text).length <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0155));
            } else if (textList.some(v => Helpers.getExisted(v.text).length > CommonConstants.BroadcastTextMaxLength)) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.BroadcastTextMaxLength));
            } else {
                BroadcastProxy.reqBroadcastAddMessage(textList, Timer.getServerTimestamp(), Timer.getServerTimestamp() + 20);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(LangTextType.B0146);
            this._btnModify.label   = Lang.getText(LangTextType.B0320);
            this._labelChinese.text = Lang.getText(LangTextType.B0455);
            this._labelEnglish.text = Lang.getText(LangTextType.B0456);
            this._labelTip.text     = Lang.getText(LangTextType.A0156);
            this._labelTitle.text   = Lang.getText(LangTextType.B0454);
        }
    }
}

// export default TwnsBroadcastAddMessagePanel;
