
namespace TinyWars.SingleCustomWar {
    export class ScwWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScwWarPanel;

        public static show(): void {
            if (!ScwWarPanel._instance) {
                ScwWarPanel._instance = new ScwWarPanel();
            }
            ScwWarPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (ScwWarPanel._instance) {
                await ScwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(ScwModel.getWar().getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}
