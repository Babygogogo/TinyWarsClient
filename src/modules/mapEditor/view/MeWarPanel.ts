
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

        public static async hide(): Promise<void> {
            if (MeWarPanel._instance) {
                await MeWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(MeModel.getWar().getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}
