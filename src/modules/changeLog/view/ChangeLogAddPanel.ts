
namespace TinyWars.ChangeLog {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import FloatText        = Utility.FloatText;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import CommonConstants  = Utility.CommonConstants;

    export class ChangeLogAddPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChangeLogAddPanel;

        private _inputChinese   : GameUi.UiTextInput;
        private _inputEnglish   : GameUi.UiTextInput;
        private _labelTip       : GameUi.UiLabel;
        private _labelTitle     : GameUi.UiLabel;
        private _labelChinese   : GameUi.UiLabel;
        private _labelEnglish   : GameUi.UiLabel;
        private _btnModify      : GameUi.UiButton;
        private _btnClose       : GameUi.UiButton;

        public static show(): void {
            if (!ChangeLogAddPanel._instance) {
                ChangeLogAddPanel._instance = new ChangeLogAddPanel();
            }

            ChangeLogAddPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (ChangeLogAddPanel._instance) {
                await ChangeLogAddPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName               = "resource/skins/changeLog/ChangeLogAddPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ]);

            this._inputChinese.maxChars = CommonConstants.ChangeLogTextMaxLength;
            this._inputEnglish.maxChars = CommonConstants.ChangeLogTextMaxLength;

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const chineseText   = this._inputChinese.text || ``;
            const englishText   = this._inputEnglish.text || ``;
            const textList      : ILanguageText[] = [
                { languageType: Types.LanguageType.Chinese, text: chineseText || englishText },
                { languageType: Types.LanguageType.English, text: englishText || chineseText },
            ];
            if (textList.every(v => v.text.length <= 0)) {
                FloatText.show(Lang.getText(Lang.Type.A0155));
            } else if (textList.some(v => v.text.length > CommonConstants.ChangeLogTextMaxLength)) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0034, CommonConstants.ChangeLogTextMaxLength));
            } else {
                ChangeLogProxy.reqChangeLogAddMessage(textList);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(Lang.Type.B0146);
            this._btnModify.label   = Lang.getText(Lang.Type.B0320);
            this._labelChinese.text = Lang.getText(Lang.Type.B0455);
            this._labelEnglish.text = Lang.getText(Lang.Type.B0456);
            this._labelTip.text     = Lang.getText(Lang.Type.A0156);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0454);
        }
    }
}
