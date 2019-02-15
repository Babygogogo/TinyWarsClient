
namespace TinyWars.MultiCustomWar {
    export class McwBackgroundView extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwBackgroundView;

        public static show(): void {
            if (!McwBackgroundView._instance) {
                McwBackgroundView._instance = new McwBackgroundView();
            }
            McwBackgroundView._instance.open();
        }

        public static hide(): void {
            if (McwBackgroundView._instance) {
                McwBackgroundView._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomWar/McwBackgroundView.exml";
        }
    }
}
