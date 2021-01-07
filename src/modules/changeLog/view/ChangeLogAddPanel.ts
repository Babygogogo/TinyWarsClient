
namespace TinyWars.ChangeLog {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import FloatText        = Utility.FloatText;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

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

            ChangeLogAddPanel._instance.open();
        }

        public static hide(): void {
            if (ChangeLogAddPanel._instance) {
                ChangeLogAddPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this._setTouchMaskEnabled(true);
            this._callbackForTouchMask  = () => this.close();
            this.skinName               = "resource/skins/changeLog/ChangeLogAddPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ];
        }

        protected _onOpened(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const textList = [this._inputChinese.text || ``, this._inputEnglish.text || ``];
            if (textList.every(v => v.length <= 0)) {
                FloatText.show(Lang.getText(Lang.Type.A0155));
            } else if (textList.some(v => v.length > CommonConstants.ChangeLogTextMaxLength)) {
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
            this._btnModify.label   = Lang.getText(Lang.Type.B0317);
            this._labelChinese.text = Lang.getText(Lang.Type.B0455);
            this._labelEnglish.text = Lang.getText(Lang.Type.B0456);
            this._labelTip.text     = Lang.getText(Lang.Type.A0156);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0454);
        }
    }
}
