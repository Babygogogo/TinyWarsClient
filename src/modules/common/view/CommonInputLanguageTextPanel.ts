
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;
    import ILanguageText    = CommonProto.Structure.ILanguageText;

    export type OpenDataForCommonInputLanguageTextPanel = {
        maxLength           : number;
        currentTextArray    : ILanguageText[] | null;
        callback            : (languageTextArray: ILanguageText[]) => void;
    };
    export class CommonInputLanguageTextPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonInputLanguageTextPanel> {
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

        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const maxLength             = this._getOpenData().maxLength;
            this._inputChinese.maxChars = maxLength;
            this._inputEnglish.maxChars = maxLength;

            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(): void {
            const chineseText   = this._inputChinese.text.trim() ?? ``;
            const englishText   = this._inputEnglish.text.trim() ?? ``;
            const textArray     : ILanguageText[] = [];
            if (chineseText) {
                textArray.push({ languageType: Types.LanguageType.Chinese, text: chineseText });
            }
            if (englishText) {
                textArray.push({ languageType: Types.LanguageType.English, text: englishText });
            }

            if (textArray.every(v => Helpers.getExisted(v.text).length <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0155));
                return;
            }

            const maxLength = this._getOpenData().maxLength;
            if (textArray.some(v => Helpers.getExisted(v.text).length > maxLength)) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0034, maxLength));
                return;
            }

            this._getOpenData().callback(textArray);
            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            const textArray         = this._getOpenData().currentTextArray ?? [];
            this._inputChinese.text = Lang.getLanguageText({ textArray, languageType: Types.LanguageType.Chinese, useAlternate: false }) ?? ``;
            this._inputEnglish.text = Lang.getLanguageText({ textArray, languageType: Types.LanguageType.English, useAlternate: false }) ?? ``;
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(LangTextType.B0146);
            this._btnModify.label   = Lang.getText(LangTextType.B0317);
            this._labelChinese.text = Lang.getText(LangTextType.B0455);
            this._labelEnglish.text = Lang.getText(LangTextType.B0456);
            this._labelTip.text     = Lang.getText(LangTextType.A0156);
            this._labelTitle.text   = Lang.getText(LangTextType.B0458);
        }
    }
}

// export default TwnsCommonInputLanguageTextPanel;
