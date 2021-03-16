
namespace TinyWars.MultiPlayerWar {
    export class MpwBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MpwBackgroundPanel;

        public static show(): void {
            if (!MpwBackgroundPanel._instance) {
                MpwBackgroundPanel._instance = new MpwBackgroundPanel();
            }
            MpwBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MpwBackgroundPanel._instance) {
                await MpwBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiPlayerWar/MpwBackgroundPanel.exml";
        }
    }
}
