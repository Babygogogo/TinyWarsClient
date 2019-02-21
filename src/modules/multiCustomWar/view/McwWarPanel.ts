
namespace TinyWars.MultiCustomWar {
    import McwWarManager = Utility.McwWarManager;

    export class McwWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwWarPanel;

        public static show(): void {
            if (!McwWarPanel._instance) {
                McwWarPanel._instance = new McwWarPanel();
            }
            McwWarPanel._instance.open();
        }

        public static hide(): void {
            if (McwWarPanel._instance) {
                McwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomWar/McwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(McwWarManager.getWar().getView());
        }

        protected _onClosed(): void {
            this.removeChildren();
        }
    }
}
