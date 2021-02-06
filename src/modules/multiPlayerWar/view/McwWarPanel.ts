
namespace TinyWars.MultiPlayerWar {
    export class McwWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwWarPanel;

        public static show(): void {
            if (!McwWarPanel._instance) {
                McwWarPanel._instance = new McwWarPanel();
            }
            McwWarPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (McwWarPanel._instance) {
                await McwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomWar/McwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(MpwModel.getWar().getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}
