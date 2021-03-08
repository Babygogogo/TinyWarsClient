
namespace TinyWars.ReplayWar {
    export class RwWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RwWarPanel;

        public static show(): void {
            if (!RwWarPanel._instance) {
                RwWarPanel._instance = new RwWarPanel();
            }
            RwWarPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (RwWarPanel._instance) {
                await RwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(RwModel.getWar().getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}
