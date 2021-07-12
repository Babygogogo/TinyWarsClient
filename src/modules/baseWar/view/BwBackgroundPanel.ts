
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { Types }                        from "../../../utility/Types";

export namespace TwnsBwBackgroundPanel {
    export class BwBackgroundPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwBackgroundPanel;

        public static show(): void {
            if (!BwBackgroundPanel._instance) {
                BwBackgroundPanel._instance = new BwBackgroundPanel();
            }
            BwBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (BwBackgroundPanel._instance) {
                await BwBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/baseWar/BwBackgroundPanel.exml";
        }
    }
}
