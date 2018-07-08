
namespace Login {
    import FloatText = Utility.FloatText;
    import Lang      = Utility.Lang;

    export class LoginPanel extends GameUi.UiPanel {
        protected readonly _layerType = Types.LayerType.Hud;
        protected readonly _isAlone   = true;

        private _inputAccount : GameUi.UiTextInput;
        private _inputPassword: GameUi.UiTextInput;
        private _btnRegister  : GameUi.UiButton;
        private _btnLogin     : GameUi.UiButton;

        private static _instance: LoginPanel;

        public static create(): void {
            egret.assert(!LoginPanel._instance);
            LoginPanel._instance = new LoginPanel();
            LoginPanel._instance.open();
        }

        public static destroy(): void {
            LoginPanel._instance.close();
            delete LoginPanel._instance;
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { name: Types.NotifyType.SLogin, callback: this._onNotifySLogin },
            ];
            this._uiListeners = [
                { ui: this._btnLogin, callback: this._onTouchedBtnLogin },
            ];
        }

        private _onNotifySLogin(e: egret.Event): void {
            const data = e.data as Network.Proto.IS_Login;
            if (data.status === ProtoEnums.S_Login_Status.AccountInvalid) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            } else if (data.status === ProtoEnums.S_Login_Status.AlreadyLoggedIn) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S01));
            } else if (data.status === ProtoEnums.S_Login_Status.PasswordInvalid) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            } else {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S02));
                LoginPanel.destroy();
                lobby.LobbyPanel.create();
            }
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if ((!Utility.Helpers.checkIsAccountValid(account)) || (!Utility.Helpers.checkIsPasswordValid(password))) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            } else {
                LoginProxy.reqLogin(account, password);
            }
        }
    }
}
