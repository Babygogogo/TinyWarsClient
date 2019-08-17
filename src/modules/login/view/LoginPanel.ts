
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

        private _inputAccount           : GameUi.UiTextInput;
        private _inputPassword          : GameUi.UiTextInput;
        private _btnRegister            : GameUi.UiButton;
        private _groupRememberPassword  : eui.Group;
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
                { type: NotifyType.SLogin, callback: this._onNotifySLogin },
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
        }

        private _onNotifySLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0000));
            this._btnLogin.enabled = false;
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            NoSleepManager.enable();

            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.Type.A0001));
            } else {
                if ((!password) || (!password.length)) {
                    LoginProxy.reqLogin(account, account); // For convenience for testing
                } else {
                    if (!Utility.Helpers.checkIsPasswordValid(password)) {
                        FloatText.show(Lang.getText(Lang.Type.A0003));
                    } else {
                        LoginProxy.reqLogin(account, password);
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
    }
}
