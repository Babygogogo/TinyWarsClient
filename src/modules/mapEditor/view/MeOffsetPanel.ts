
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import { Types }                        from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";
import * as MeUtility                   from "../model/MeUtility";

export class MeOffsetPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeOffsetPanel;

    private _labelTitle     : UiLabel;
    private _inputOffsetX   : UiTextInput;
    private _inputOffsetY   : UiTextInput;
    private _labelTips      : UiLabel;
    private _btnCancel      : UiButton;
    private _btnConfirm     : UiButton;

    private _offsetX   : number;
    private _offsetY  : number;

    public static show(): void {
        if (!MeOffsetPanel._instance) {
            MeOffsetPanel._instance = new MeOffsetPanel();
        }
        MeOffsetPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (MeOffsetPanel._instance) {
            await MeOffsetPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapEditor/MeOffsetPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
            { ui: this._inputOffsetX,   callback: this._onFocusOutInputOffsetX, eventType: egret.Event.FOCUS_OUT },
            { ui: this._inputOffsetY,   callback: this._onFocusOutInputOffsetY, eventType: egret.Event.FOCUS_OUT },
        ]);

        this._updateComponentsForLanguage();

        this._inputOffsetY.text = "" + 0;
        this._inputOffsetX.text = "" + 0;
        this._offsetX           = 0;
        this._offsetY           = 0;
    }

    private _onTouchedBtnCancel(): void {
        this.close();
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const offsetX   = this._offsetX;
        const offsetY   = this._offsetY;
        const war       = MeModel.getWar();
        if ((offsetX !== 0) || (offsetY !== 0)) {
            war.stopRunning();
            await war.initWithMapEditorData({
                mapRawData  : MeUtility.addOffset(war.serializeForMap(), offsetX, offsetY),
                slotIndex   : war.getMapSlotIndex(),
            });
            war.setIsMapModified(true);
            war.startRunning()
                .startRunningView();
        }

        this.close();
        MeWarMenuPanel.hide();
    }

    private _onFocusOutInputOffsetX(): void {
        const input = this._inputOffsetX;
        let offsetX = Number(input.text);
        if (isNaN(offsetX)) {
            offsetX = 0;
        }
        this._offsetX  = offsetX;
        input.text      = "" + offsetX;
    }

    private _onFocusOutInputOffsetY(): void {
        const input = this._inputOffsetY;
        let offsetY = Number(input.text);
        if (isNaN(offsetY)) {
            offsetY = 0;
        }
        this._offsetY = offsetY;
        input.text      = "" + offsetY;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        this._labelTitle.text   = Lang.getText(LangTextType.B0293);
        this._labelTips.text    = Lang.getText(LangTextType.A0088);
    }
}
