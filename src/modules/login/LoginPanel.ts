
namespace Login {
    export class LoginPanel extends GameUi.UiPanel {
        protected readonly _layerType = Types.LayerType.Hud;
        protected readonly _isAlone   = true;

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
    }
}
