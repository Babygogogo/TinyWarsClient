
namespace TinyWars.Replay {
    export class ReplayBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ReplayBackgroundPanel;

        public static show(): void {
            if (!ReplayBackgroundPanel._instance) {
                ReplayBackgroundPanel._instance = new ReplayBackgroundPanel();
            }
            ReplayBackgroundPanel._instance.open();
        }

        public static hide(): void {
            if (ReplayBackgroundPanel._instance) {
                ReplayBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/replay/ReplayBackgroundPanel.exml";
        }
    }
}
