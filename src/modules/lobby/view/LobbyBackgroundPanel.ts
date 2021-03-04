
namespace TinyWars.Lobby {
    export class LobbyBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyBackgroundPanel;

        public static show(): void {
            if (!LobbyBackgroundPanel._instance) {
                LobbyBackgroundPanel._instance = new LobbyBackgroundPanel();
            }
            LobbyBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LobbyBackgroundPanel._instance) {
                await LobbyBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/lobby/LobbyBackgroundPanel.exml";
        }
    }
}