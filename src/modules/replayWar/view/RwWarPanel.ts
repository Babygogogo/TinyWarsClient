
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

        public static hide(): void {
            if (RwWarPanel._instance) {
                RwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/replayWar/RwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(RwModel.getWar().getView());
        }

        protected _onClosed(): void {
            this.removeChildren();
        }
    }
}
