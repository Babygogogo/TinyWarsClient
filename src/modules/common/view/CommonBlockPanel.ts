
import { TwnsUiPanel }                  from "../../../utility/ui/UiPanel";
import { TwnsUiLabel }                  from "../../../utility/ui/UiLabel";
import { Types }                        from "../../../utility/Types";

type OpenDataForCommonBlockPanel = {
    title  : string;
    content: string;
};
export class CommonBlockPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonBlockPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CommonBlockPanel;

    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _labelContent   : TwnsUiLabel.UiLabel;

    public static show(openData: OpenDataForCommonBlockPanel): void {
        if (!CommonBlockPanel._instance) {
            CommonBlockPanel._instance = new CommonBlockPanel();
        }
        CommonBlockPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (CommonBlockPanel._instance) {
            await CommonBlockPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/common/CommonBlockPanel.exml";
        this._setIsTouchMaskEnabled();
    }

    protected _onOpened(): void {
        const openData          = this._getOpenData();
        this._labelTitle.text   = openData.title;
        this._labelContent.setRichText(openData.content);
    }
}
