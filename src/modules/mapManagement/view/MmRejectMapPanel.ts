
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTextInput }                  from "../../../utility/ui/UiTextInput";
import { MeWar }                        from "../../mapEditor/model/MeWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Types }                        from "../../../utility/Types";
import { WarMapProxy }                  from "../../warMap/model/WarMapProxy";
import LangTextType         = TwnsLangTextType.LangTextType;

type OpenData = {
    war: MeWar;
};
export class MmRejectMapPanel extends UiPanel<OpenData> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MmRejectMapPanel;

    // @ts-ignore
    private _labelTitle     : UiLabel;
    // @ts-ignore
    private _labelTips      : UiLabel;
    // @ts-ignore
    private _inputReason    : UiTextInput;
    // @ts-ignore
    private _btnCancel      : UiButton;
    // @ts-ignore
    private _btnConfirm     : UiButton;

    public static show(openData: OpenData): void {
        if (!MmRejectMapPanel._instance) {
            MmRejectMapPanel._instance = new MmRejectMapPanel();
        }
        MmRejectMapPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (MmRejectMapPanel._instance) {
            await MmRejectMapPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapManagement/MmRejectMapPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
        ]);

        this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        this._labelTitle.text   = Lang.getText(LangTextType.B0297);
        this._labelTips.text    = Lang.getText(LangTextType.A0094);
    }

    private _onTouchedBtnCancel(): void {
        this.close();
    }

    private _onTouchedBtnConfirm(): void {
        const war = this._getOpenData().war;
        WarMapProxy.reqMmReviewMap({
            designerUserId  : war.getMapDesignerUserId(),
            slotIndex       : war.getMapSlotIndex(),
            modifiedTime    : war.getMapModifiedTime(),
            isAccept        : false,
            reviewComment   : this._inputReason.text,
            availability    : {
                canMcw      : false,
                canCcw      : false,
                canMrwStd   : false,
                canMrwFog   : false,
                canScw      : false,
                canSrw      : false,
            },
        });
        this.close();
    }
}
