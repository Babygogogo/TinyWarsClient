
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Types }                        from "../../../utility/Types";

type OpenDataForCommonErrorPanel = {
    content     : string;
    callback?   : () => any;
};
export class CommonErrorPanel extends UiPanel<OpenDataForCommonErrorPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Top;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: CommonErrorPanel;

    private _labelTitle     : UiLabel;
    private _labelContent   : UiLabel;
    private _btnClose       : UiButton;

    public static show(openData: OpenDataForCommonErrorPanel): void {
        if (!CommonErrorPanel._instance) {
            CommonErrorPanel._instance = new CommonErrorPanel();
        }
        CommonErrorPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (CommonErrorPanel._instance) {
            await CommonErrorPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/common/CommonErrorPanel.exml";
        this._setIsTouchMaskEnabled();
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnClose, callback: this._onTouchedBtnClose },
        ]);

        this._btnClose.label    = Lang.getText(LangTextType.B0026);
        this._labelTitle.text   = Lang.getText(LangTextType.A0056);
        this._labelContent.setRichText(this._getOpenData().content);
    }

    private _onTouchedBtnClose(e: egret.TouchEvent): void {
        const openData = this._getOpenData();
        (openData.callback) && (openData.callback());

        this.close();
    }
}
