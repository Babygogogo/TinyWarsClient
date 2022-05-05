
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;
    import ILanguageText    = CommonProto.Structure.ILanguageText;

    export type OpenDataForMeModifyMapNamePanel = void;
    export class MeModifyMapNamePanel extends TwnsUiPanel.UiPanel<OpenDataForMeModifyMapNamePanel> {
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

            this._inputChinese.maxChars = Twns.CommonConstants.MapMaxNameLength;
            this._inputEnglish.maxChars = Twns.CommonConstants.MapMaxNameLength;
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

        private _onTouchedBtnModify(): void {
            const chineseText   = this._inputChinese.text || ``;
            const englishText   = this._inputEnglish.text || ``;
            const textList      : ILanguageText[] = [
                { languageType: Twns.Types.LanguageType.Chinese, text: chineseText || englishText },
                { languageType: Twns.Types.LanguageType.English, text: englishText || chineseText },
            ];
            if (textList.every(v => Twns.Helpers.getExisted(v.text).length <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0155));
            } else if (textList.some(v => Twns.Helpers.getExisted(v.text).length > Twns.CommonConstants.MapMaxNameLength)) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0034, Twns.CommonConstants.MapMaxNameLength));
            } else {
                Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).setMapNameArray(textList);
                Twns.Notify.dispatch(NotifyType.MeMapNameChanged);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            const textList          = Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).getMapNameArray() || [];
            this._inputChinese.text = Lang.getLanguageText({ textArray: textList, languageType: Twns.Types.LanguageType.Chinese }) ?? ``;
            this._inputEnglish.text = Lang.getLanguageText({ textArray: textList, languageType: Twns.Types.LanguageType.English }) ?? ``;
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

// export default TwnsMeModifyMapNamePanel;
