
namespace TinyWars.MapEditor {
    export class MeWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MeWarPanel;

        public static show(): void {
            if (!MeWarPanel._instance) {
                MeWarPanel._instance = new MeWarPanel();
            }
            MeWarPanel._instance.open(undefined);
        }

        public static hide(): void {
            if (MeWarPanel._instance) {
                MeWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/mapEditor/MeWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(MeManager.getWar().getView());
        }

        protected _onClosed(): void {
            this.removeChildren();
        }
    }
}
