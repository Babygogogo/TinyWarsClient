
namespace Login {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import LocalStorage = Utility.LocalStorage;

    export class LoginPanel extends GameUi.UiPanel {
        protected readonly _layerType = Utility.Types.LayerType.Hud;
        protected readonly _isAlone   = true;

        private _inputAccount : GameUi.UiTextInput;
        private _inputPassword: GameUi.UiTextInput;
        private _btnRegister  : GameUi.UiButton;
        private _btnLogin     : GameUi.UiButton;

        private static _instance: LoginPanel;

        public static create(): void {
            if (!LoginPanel._instance) {
                LoginPanel._instance = new LoginPanel();
                LoginPanel._instance.open();
            }
        }

        public static destroy(): void {
            if (LoginPanel._instance) {
                LoginPanel._instance.close();
                delete LoginPanel._instance;
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { name: NotifyType.SLogin, callback: this._onNotifySLogin },
            ];
            this._uiListeners = [
                { ui: this._btnLogin,    callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ];

            // let test = new OnlineWar.TileMapView();
            // test.init(100, 100);
            // test.scaleX = 0.15;
            // test.scaleY = 0.15;
            // this.addChildAt(test, 0);

            // let testImg = new GameUi.UiImage("c01_t01_s01_f01");
            // testImg.bottom = 0;
            // testImg.left = 0;
            // this.addChild(testImg);
        }

        protected _onOpened(): void {
            this._inputAccount.text = LocalStorage.getAccount();
        }

        private _onNotifySLogin(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S00));
            LoginPanel.destroy();
            Lobby.LobbyPanel.create();
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S01));
            } else if (!Utility.Helpers.checkIsPasswordValid(password)) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S03));
            } else {
                LoginProxy.reqLogin(account, password);
            }
        }

        private _onTouchedBtnRegister(e: egret.TouchEvent): void {
            RegisterPanel.create();
            LoginPanel.destroy();
        }
    }
}
