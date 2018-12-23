
namespace TinyWars.Login {
    import FloatText  = Utility.FloatText;
    import Lang       = Utility.Lang;
    import NotifyType = Utility.Notify.Type;

    export class RegisterPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private _inputAccount : GameUi.UiTextInput;
        private _inputPassword: GameUi.UiTextInput;
        private _inputNickname: GameUi.UiTextInput;
        private _btnRegister  : GameUi.UiButton;
        private _btnLogin     : GameUi.UiButton;

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
                { type: NotifyType.SLogin,    callback: this._onNotifySLogin },
                { type: NotifyType.SRegister, callback: this._onNotifySRegister },
            ];
            this._uiListeners = [
                { ui: this._btnLogin,    callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ];
        }

        private _onNotifySLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            Utility.StageManager.gotoLobby();
        }

        private _onNotifySRegister(e: egret.Event): void {
            const data = e.data as Utility.ProtoTypes.IS_Register;
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S04));
            LoginProxy.reqLogin(data.account, data.password);
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            Utility.StageManager.gotoLogin();
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
