
namespace TinyWars.ReplayWar {
    export class RwBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RwBackgroundPanel;

        public static show(): void {
            if (!RwBackgroundPanel._instance) {
                RwBackgroundPanel._instance = new RwBackgroundPanel();
            }
            RwBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (RwBackgroundPanel._instance) {
                await RwBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwBackgroundPanel.exml";
        }
    }
}
