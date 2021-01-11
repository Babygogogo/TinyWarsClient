
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

        public static hide(): void {
            if (ScwWarPanel._instance) {
                ScwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomWar/McwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(ScwModel.getWar().getView());
        }

        protected _onClosed(): void {
            this.removeChildren();
        }
    }
}
