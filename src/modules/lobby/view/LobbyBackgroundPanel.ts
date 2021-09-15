
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import Types                from "../../tools/helpers/Types";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";

namespace TwnsLobbyBackgroundPanel {
    export class LobbyBackgroundPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyBackgroundPanel | null = null;

        public static show(): void {
            if (!LobbyBackgroundPanel._instance) {
                LobbyBackgroundPanel._instance = new LobbyBackgroundPanel();
            }
            LobbyBackgroundPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (LobbyBackgroundPanel._instance) {
                await LobbyBackgroundPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        public static getInstance(): LobbyBackgroundPanel | null {
            return LobbyBackgroundPanel._instance;
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyBackgroundPanel.exml";
        }
    }
}

export default TwnsLobbyBackgroundPanel;
