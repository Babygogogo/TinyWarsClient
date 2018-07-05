
namespace Login {
    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _layerType = Types.LayerType.Bottom;
        protected readonly _isAlone   = true;

        private static _instance: LoginBackgroundPanel;

        public static create(): void {
            egret.assert(!LoginBackgroundPanel._instance);
            LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            LoginBackgroundPanel._instance.open();
        }

        public static destroy(): void {
            LoginBackgroundPanel._instance.close();
            delete LoginBackgroundPanel._instance;
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }
    }
}
