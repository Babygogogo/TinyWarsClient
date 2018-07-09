
namespace Login {
    import FloatText  = Utility.FloatText;
    import Lang       = Utility.Lang;
    import NotifyType = Utility.Notify.Type;

    export class RegisterPanel extends GameUi.UiPanel {
        protected readonly _layerType = Utility.Types.LayerType.Hud;
        protected readonly _isAlone   = true;

        private _inputAccount : GameUi.UiTextInput;
        private _inputPassword: GameUi.UiTextInput;
        private _inputNickname: GameUi.UiTextInput;
        private _btnRegister  : GameUi.UiButton;
        private _btnLogin     : GameUi.UiButton;

        private static _instance: RegisterPanel;

        public static create(): void {
            egret.assert(!RegisterPanel._instance);
            RegisterPanel._instance = new RegisterPanel();
            RegisterPanel._instance.open();
        }

        public static destroy(): void {
            RegisterPanel._instance.close();
            delete RegisterPanel._instance;
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/RegisterPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { name: NotifyType.SLogin,    callback: this._onNotifySLogin },
                { name: NotifyType.SRegister, callback: this._onNotifySRegister },
            ];
            this._uiListeners = [
                { ui: this._btnLogin,    callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ];
        }

        private _onNotifySLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            RegisterPanel.destroy();
            lobby.LobbyPanel.create();
        }

        private _onNotifySRegister(e: egret.Event): void {
            // TODO
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            LoginPanel.create();
            RegisterPanel.destroy();
        }

        private _onTouchedBtnRegister(e: egret.TouchEvent): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            const nickname = this._inputNickname.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S01));
            } else if (!Utility.Helpers.checkIsPasswordValid(password)) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S03));
            } else if (!Utility.Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S02));
            } else {
                LoginProxy.reqRegister(account, password, nickname);
            }
        }
    }
}
