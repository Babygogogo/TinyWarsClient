
namespace TinyWars.SingleCustomWar {
    export class ScwBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScwBackgroundPanel;

        public static show(): void {
            if (!ScwBackgroundPanel._instance) {
                ScwBackgroundPanel._instance = new ScwBackgroundPanel();
            }
            ScwBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (ScwBackgroundPanel._instance) {
                await ScwBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwBackgroundPanel.exml";
        }
    }
}
