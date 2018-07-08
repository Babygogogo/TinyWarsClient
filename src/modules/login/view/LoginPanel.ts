
namespace Login {
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
            this._uiListeners = [
                { ui: this._btnLogin, callback: this._onTouchedBtnLogin },
            ];
        }

        private _onTouchedBtnLogin(e: egret.TouchEvent): void {
            Utility.FloatText.show("login touched!");
        }
    }
}
