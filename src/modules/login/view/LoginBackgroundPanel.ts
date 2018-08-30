
namespace Login {
    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        public static show(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open();
        }

        public static hide(): void {
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
