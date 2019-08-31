
namespace TinyWars.Login {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        private _labelVersion       : GameUi.UiLabel;
        private _btnChangeLanguage  : GameUi.UiButton;

        public static show(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open();
        }

        public static hide(): void {
            if (LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnChangeLanguage, callback: this._onTouchedBtnChangeLanguage },
            ];
        }

        protected _onOpened(): void {
            this._labelVersion.text = `TinyWars v.${window.CLIENT_VERSION}`;
            this._updateBtnChangeLanguage();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateBtnChangeLanguage();
        }
        private _onTouchedBtnChangeLanguage(e: egret.TouchEvent): void {
            Lang.setLanguageType(Lang.getLanguageType() === Types.LanguageType.Chinese
                ? Types.LanguageType.English
                : Types.LanguageType.Chinese
            );
            Notify.dispatch(Notify.Type.LanguageChanged);
        }

        private _updateBtnChangeLanguage(): void {
            if (Lang.getLanguageType() === Types.LanguageType.Chinese) {
                this._btnChangeLanguage.label = Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.English);
            } else {
                this._btnChangeLanguage.label = Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.Chinese);
            }
        }
    }
}
