
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTextInput }                  from "../../../utility/ui/UiTextInput";
import { MeWar }                        from "../../mapEditor/model/MeWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { WarMapProxy }                  from "../../warMap/model/WarMapProxy";
import LangTextType         = TwnsLangTextType.LangTextType;

type OpenData = {
    war: MeWar;
};
export class MmAcceptMapPanel extends UiPanel<OpenData> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MmAcceptMapPanel;

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

    // @ts-ignore
    private _groupMcw       : eui.Group;
    // @ts-ignore
    private _labelMcw       : UiLabel;
    // @ts-ignore
    private _imgMcw         : UiImage;

    // @ts-ignore
    private _groupCcw       : eui.Group;
    // @ts-ignore
    private _labelCcw       : UiLabel;
    // @ts-ignore
    private _imgCcw         : UiImage;

    // @ts-ignore
    private _groupScw       : eui.Group;
    // @ts-ignore
    private _labelScw       : UiLabel;
    // @ts-ignore
    private _imgScw         : UiImage;

    // @ts-ignore
    private _groupSrw       : eui.Group;
    // @ts-ignore
    private _labelSrw       : UiLabel;
    // @ts-ignore
    private _imgSrw         : UiImage;

    // @ts-ignore
    private _groupMrwStd    : eui.Group;
    // @ts-ignore
    private _labelMrwStd    : UiLabel;
    // @ts-ignore
    private _imgMrwStd      : UiImage;

    // @ts-ignore
    private _groupMrwFog    : eui.Group;
    // @ts-ignore
    private _labelMrwFog    : UiLabel;
    // @ts-ignore
    private _imgMrwFog      : UiImage;

    public static show(openData: OpenData): void {
        if (!MmAcceptMapPanel._instance) {
            MmAcceptMapPanel._instance = new MmAcceptMapPanel();
        }
        MmAcceptMapPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (MmAcceptMapPanel._instance) {
            await MmAcceptMapPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapManagement/MmAcceptMapPanel.exml";
        this._setIsTouchMaskEnabled();
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
            { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
            { ui: this._groupCcw,       callback: this._onTouchedGroupCcw },
            { ui: this._groupScw,       callback: this._onTouchedGroupScw },
            { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
            { ui: this._groupMrwStd,    callback: this._onTouchedGroupMrwStd },
            { ui: this._groupMrwFog,    callback: this._onTouchedGroupMrwFog },
        ]);

        this._updateComponentsForLanguage();

        this._imgMcw.visible    = false;
        this._imgCcw.visible    = false;
        this._imgScw.visible    = false;
        this._imgSrw.visible    = false;
        this._imgMrwStd.visible = false;
        this._imgMrwFog.visible = false;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
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
            isAccept        : true,
            reviewComment   : this._inputReason.text,
            availability    : {
                canMcw      : this._imgMcw.visible,
                canCcw      : this._imgCcw.visible,
                canScw      : this._imgScw.visible,
                canSrw      : this._imgSrw.visible,
                canMrwStd   : this._imgMrwStd.visible,
                canMrwFog   : this._imgMrwFog.visible,
            },
        });
        this.close();
    }
    private _onTouchedGroupMcw(): void {
        this._imgMcw.visible = !this._imgMcw.visible;
    }
    private _onTouchedGroupCcw(): void {
        this._imgCcw.visible = !this._imgCcw.visible;
    }
    private _onTouchedGroupScw(): void {
        this._imgScw.visible = !this._imgScw.visible;
    }
    private _onTouchedGroupSrw(): void {
        this._imgSrw.visible = !this._imgSrw.visible;
    }
    private _onTouchedGroupMrwStd(): void {
        this._imgMrwStd.visible = !this._imgMrwStd.visible;
    }
    private _onTouchedGroupMrwFog(): void {
        this._imgMrwFog.visible = !this._imgMrwFog.visible;
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        this._labelTitle.text   = Lang.getText(LangTextType.B0296);
        this._labelTips.text    = Lang.getText(LangTextType.A0105);
        this._labelMcw.text     = Lang.getText(LangTextType.B0200);
        this._labelCcw.text     = Lang.getText(LangTextType.B0619);
        this._labelMrwStd.text  = Lang.getText(LangTextType.B0404);
        this._labelMrwFog.text  = Lang.getText(LangTextType.B0408);
        this._labelScw.text     = Lang.getText(LangTextType.B0409);
        this._labelSrw.text     = Lang.getText(LangTextType.B0614);
    }
}
