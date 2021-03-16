
namespace TinyWars.MultiPlayerWar {
    export class MpwWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MpwWarPanel;

        public static show(): void {
            if (!MpwWarPanel._instance) {
                MpwWarPanel._instance = new MpwWarPanel();
            }
            MpwWarPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MpwWarPanel._instance) {
                await MpwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiPlayerWar/MpwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(MpwModel.getWar().getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}
