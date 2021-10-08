
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsBwWar            from "../model/BwWar";
import Types                from "../../tools/helpers/Types";

namespace TwnsBwWarPanel {
    import BwWar            = TwnsBwWar.BwWar;

    type OpenDataForBwWarPanel = {
        war: BwWar;
    };
    export class BwWarPanel extends TwnsUiPanel.UiPanel<OpenDataForBwWarPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwWarPanel;

        public static show(openData: OpenDataForBwWarPanel): void {
            if (!BwWarPanel._instance) {
                BwWarPanel._instance = new BwWarPanel();
            }
            BwWarPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (BwWarPanel._instance) {
                await BwWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/baseWar/BwWarPanel.exml";
        }

        protected _onOpened(): void {
            this.addChild(this._getOpenData().war.getView());
        }

        protected async _onClosed(): Promise<void> {
            this.removeChildren();
        }
    }
}

export default TwnsBwWarPanel;
