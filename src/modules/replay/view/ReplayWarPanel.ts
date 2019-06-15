
namespace TinyWars.Replay {
    export class ReplayWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ReplayWarPanel;

        public static show(): void {
            if (!ReplayWarPanel._instance) {
                ReplayWarPanel._instance = new ReplayWarPanel();
            }
            ReplayWarPanel._instance.open();
        }

        public static hide(): void {
            if (ReplayWarPanel._instance) {
                ReplayWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/replay/ReplayWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(ReplayModel.getWar().getView());
        }

        protected _onClosed(): void {
            this.removeChildren();
        }
    }
}
