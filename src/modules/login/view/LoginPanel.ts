
namespace TinyWars.Login {
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Types            = Utility.Types;
    import NotifyType       = Utility.Notify.Type;
    import LocalStorage     = Utility.LocalStorage;
    import NoSleepManager   = Utility.NoSleepManager;

    export class LoginPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private _labelAccount           : GameUi.UiLabel;
        private _inputAccount           : GameUi.UiTextInput;
        private _labelPassword          : GameUi.UiLabel;
        private _inputPassword          : GameUi.UiTextInput;
        private _btnRegister            : GameUi.UiButton;
        private _groupRememberPassword  : eui.Group;
        private _labelRememberPassword  : GameUi.UiLabel;
        private _imgRememberPassword    : GameUi.UiImage;
        private _btnLogin               : GameUi.UiButton;

        private static _instance: LoginPanel;

        public static show(): void {
            if (!LoginPanel._instance) {
                LoginPanel._instance = new LoginPanel();
            }
            LoginPanel._instance.open();
        }

        public static hide(): void {
            if (LoginPanel._instance) {
                LoginPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.SLogin,          callback: this._onNotifySLogin },
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
                { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            ];
        }

        protected _onOpened(): void {
            const isRememberPassword            = LocalStorage.getIsRememberPassword();
            this._inputAccount.text             = LocalStorage.getAccount();
            this._inputPassword.text            = isRememberPassword ? LocalStorage.getPassword() : null;
            this._btnLogin.enabled              = true;
            this._imgRememberPassword.visible   = isRememberPassword;
            this._updateViewOnLanguageChanged();
        }

        private _onNotifySLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0000));
            this._btnLogin.enabled = false;
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateViewOnLanguageChanged();
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            NoSleepManager.enable();

            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.Type.A0001));
            } else {
                if ((!password) || (!password.length)) {
                    LoginProxy.reqLogin(account, account, false); // For convenience for testing
                } else {
                    if (!Utility.Helpers.checkIsPasswordValid(password)) {
                        FloatText.show(Lang.getText(Lang.Type.A0003));
                    } else {
                        LoginProxy.reqLogin(account, password, false);
                    }
                }
            }
        }

        private _onTouchedBtnRegister(e: egret.TouchEvent): void {
            NoSleepManager.enable();

            RegisterPanel.show();
            LoginPanel.hide();
        }

        private _onTouchedGroupRememberPassword(e: egret.TouchEvent): void {
            const isRemember = LocalStorage.getIsRememberPassword();
            LocalStorage.setIsRememberPassword(!isRemember);
            this._imgRememberPassword.visible = !isRemember;
        }

        private _updateViewOnLanguageChanged(): void {
            this._labelAccount.text             = Lang.getText(Lang.Type.B0170);
            this._labelPassword.text            = Lang.getText(Lang.Type.B0171);
            this._labelRememberPassword.text    = Lang.getText(Lang.Type.B0172);
            if (Lang.getLanguageType() === Types.LanguageType.Chinese) {
                this._btnLogin.label    = "";
                this._btnRegister.label = "";
            } else {
                this._btnLogin.label    = Lang.getText(Lang.Type.B0173);
                this._btnRegister.label = Lang.getText(Lang.Type.B0174);
            }
        }
    }
}
