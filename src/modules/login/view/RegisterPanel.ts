
namespace TinyWars.Login {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import Types        = Utility.Types;
    import FlowManager  = Utility.FlowManager;
    import LocalStorage = Utility.LocalStorage;

    export class RegisterPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private _imgAccountTitle    : GameUi.UiImage;
        private _inputAccount       : GameUi.UiTextInput;
        private _imgPasswordTitle   : GameUi.UiImage;
        private _inputPassword      : GameUi.UiTextInput;
        private _imgNicknameTitle   : GameUi.UiImage;
        private _inputNickname      : GameUi.UiTextInput;
        private _btnRegister        : GameUi.UiButton;
        private _btnLogin           : GameUi.UiButton;
        private _imgTips            : GameUi.UiImage;

        private static _instance: RegisterPanel;

        public static show(): void {
            if (!RegisterPanel._instance) {
                RegisterPanel._instance = new RegisterPanel();
            }
            RegisterPanel._instance.open();
        }

        public static hide(): void {
            if (RegisterPanel._instance) {
                RegisterPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/RegisterPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogin,    callback: this._onMsgUserLogin },
                { type: NotifyType.MsgUserRegister, callback: this._onMsgUserRegister },
            ];
            this._uiListeners = [
                { ui: this._btnLogin,    callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ];
        }

        protected _onOpened(): void {
            this._updateOnLanguageChanged();
        }

        private _onMsgUserLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0000));
        }
        private _onMsgUserRegister(e: egret.Event): void {
            const data = e.data as Utility.ProtoTypes.NetMessage.MsgUserRegister.IS;
            FloatText.show(Lang.getText(Lang.Type.A0004));

            const account   = data.account;
            const password  = this._inputPassword.text;
            LocalStorage.setAccount(account);
            LocalStorage.setPassword(password);
            User.UserModel.setSelfAccount(account);
            User.UserModel.setSelfPassword(password);
            User.UserProxy.reqLogin(account, password, false);
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateOnLanguageChanged();
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            FlowManager.gotoLogin();
        }

        private _onTouchedBtnRegister(e: egret.TouchEvent): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            const nickname = this._inputNickname.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.Type.A0001));
            } else if (!Utility.Helpers.checkIsPasswordValid(password)) {
                FloatText.show(Lang.getText(Lang.Type.A0003));
            } else if (!Utility.Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(Lang.Type.A0002));
            } else {
                User.UserProxy.reqUserRegister(account, password, nickname);
            }
        }

        private _updateOnLanguageChanged(): void {
            if (Lang.getCurrentLanguageType() === Types.LanguageType.Chinese) {
                this._imgAccountTitle.source    = "login_text_account_001";
                this._imgPasswordTitle.source   = "login_text_password_001";
                this._imgNicknameTitle.source   = "login_text_nickname_001";
                this._imgTips.source            = "login_text_registerTips_001";
                this._btnRegister.setImgDisplaySource("login_button_register_003");
            } else {
                this._imgAccountTitle.source    = "login_text_account_002";
                this._imgPasswordTitle.source   = "login_text_password_002";
                this._imgNicknameTitle.source   = "login_text_nickname_002";
                this._imgTips.source            = "login_text_registerTips_002";
                this._btnRegister.setImgDisplaySource("login_button_register_004");
            }
        }
    }
}
