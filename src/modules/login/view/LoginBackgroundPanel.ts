
namespace Login {
    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _layerType = Utility.Types.LayerType.Bottom;
        protected readonly _isAlone   = true;

        private static _instance: LoginBackgroundPanel;

        public static open(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open();
        }

        public static close(): void {
            if (LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }
    }
}
