
import { UiPanel }  from "../../../gameui/UiPanel";
import { BwWar }    from "../model/BwWar";
import * as Types   from "../../../utility/Types";

type OpenDataForBwWarPanel = {
    war: BwWar;
};
export class BwWarPanel extends UiPanel<OpenDataForBwWarPanel> {
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
