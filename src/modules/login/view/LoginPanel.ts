
namespace TinyWars.Login {
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Types            = Utility.Types;
    import NotifyType       = Utility.Notify.Type;
    import LocalStorage     = Utility.LocalStorage;
    import NoSleepManager   = Utility.NoSleepManager;

    export class LoginPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private _imgTitle                   : GameUi.UiImage;

        private _groupAccount               : eui.Group;
        private _imgAccountTitle            : GameUi.UiImage;
        private _inputAccount               : GameUi.UiTextInput;

        private _groupPassword              : eui.Group;
        private _imgPasswordTitle           : GameUi.UiImage;
        private _inputPassword              : GameUi.UiTextInput;

        private _groupPasswordCommand       : eui.Group;
        private _groupRememberPassword      : eui.Group;
        private _labelRememberPassword      : GameUi.UiLabel;
        private _imgRememberPasswordCheck   : GameUi.UiImage;
        private _imgRememberPassword        : GameUi.UiImage;
        private _btnForgetPassword          : GameUi.UiButton;

        private _groupButton                : eui.Group;
        private _btnRegister                : GameUi.UiButton;
        private _btnLogin                   : GameUi.UiButton;

        private static _instance: LoginPanel;

        public static show(): void {
            if (!LoginPanel._instance) {
                LoginPanel._instance = new LoginPanel();
            }
            LoginPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LoginPanel._instance) {
                await LoginPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/login/LoginPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogin,    callback: this._onMsgUserLogin },
            ]);
            this._setUiListenerArray([
                { ui: this,                         callback: this._onTouchedSelf },
                { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
                { ui: this._btnForgetPassword,      callback: this._onTouchedBtnForgetPassword },
                { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            ]);

            this._showOpenAnimation();

            const isRememberPassword                = LocalStorage.getIsRememberPassword();
            this._inputAccount.text                 = LocalStorage.getAccount();
            this._inputPassword.text                = isRememberPassword ? LocalStorage.getPassword() : null;
            this._btnLogin.enabled                  = true;
            this._imgRememberPasswordCheck.visible  = isRememberPassword;
            this._updateComponentsForLanguage();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0000));
            this._btnLogin.enabled = false;
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedSelf(e: egret.TouchEvent): void {
            Utility.SoundManager.init();
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            NoSleepManager.enable();

            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.Type.A0001));
            } else {
                if (!Utility.Helpers.checkIsPasswordValid(password)) {
                    FloatText.show(Lang.getText(Lang.Type.A0003));
                } else {
                    LocalStorage.setAccount(account);
                    LocalStorage.setPassword(password);
                    User.UserModel.setSelfAccount(account);
                    User.UserModel.setSelfPassword(password);
                    User.UserProxy.reqLogin(account, password, false);
                }
            }
        }

        private _onTouchedBtnRegister(e: egret.TouchEvent): void {
            NoSleepManager.enable();

            RegisterPanel.show();
        }

        private _onTouchedBtnForgetPassword(e: egret.TouchEvent): void {
            FloatText.show(Lang.getText(Lang.Type.A0115));
        }

        private _onTouchedGroupRememberPassword(e: egret.TouchEvent): void {
            const isRemember = LocalStorage.getIsRememberPassword();
            LocalStorage.setIsRememberPassword(!isRemember);
            this._imgRememberPasswordCheck.visible = !isRemember;
        }

        private _updateComponentsForLanguage(): void {
            if (Lang.getCurrentLanguageType() === Types.LanguageType.Chinese) {
                this._imgAccountTitle.source        = "login_text_account_001";
                this._imgPasswordTitle.source       = "login_text_password_001";
                this._imgRememberPassword.source    = "login_text_remember_001";
                this._btnLogin.setImgDisplaySource("login_button_login_001");
                this._btnRegister.setImgDisplaySource("login_button_register_001");
                this._btnForgetPassword.setImgDisplaySource("login_text_findPassword_001");
            } else {
                this._imgAccountTitle.source        = "login_text_account_002";
                this._imgPasswordTitle.source       = "login_text_password_002";
                this._imgRememberPassword.source    = "login_text_remember_002";
                this._btnLogin.setImgDisplaySource("login_button_login_002");
                this._btnRegister.setImgDisplaySource("login_button_register_002");
                this._btnForgetPassword.setImgDisplaySource("login_text_findPassword_002");
            }
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgTitle,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 1000,
            });
            Helpers.resetTween({
                obj         : this._groupAccount,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 800,
            });
            Helpers.resetTween({
                obj         : this._groupPassword,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 900,
            });
            Helpers.resetTween({
                obj         : this._groupPasswordCommand,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1000,
            });
            Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1100,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgTitle,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._groupAccount,
                    beginProps  : { alpha: 1, y: 0 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._groupPassword,
                    beginProps  : { alpha: 1, y: 0 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._groupPasswordCommand,
                    beginProps  : { alpha: 1, y: 0 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._groupButton,
                    beginProps  : { alpha: 1, y: 0 },
                    endProps    : { alpha: 0, y: 40 },
                });
            });
        }
    }
}
