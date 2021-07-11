
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as Types                       from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";
import * as MeUtility                   from "../model/MeUtility";

export class MeResizePanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeResizePanel;

    private _labelTitle         : UiLabel;
    private _labelCurrSizeTitle : UiLabel;
    private _labelCurrWidth     : UiLabel;
    private _labelCurrHeight    : UiLabel;
    private _labelNewSizeTitle  : UiLabel;
    private _inputNewWidth      : UiTextInput;
    private _inputNewHeight     : UiTextInput;
    private _labelTips1         : UiLabel;
    private _labelTips2         : UiLabel;
    private _btnCancel          : UiButton;
    private _btnConfirm         : UiButton;

    private _newWidth   : number;
    private _newHeight  : number;

    public static show(): void {
        if (!MeResizePanel._instance) {
            MeResizePanel._instance = new MeResizePanel();
        }
        MeResizePanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (MeResizePanel._instance) {
            await MeResizePanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapEditor/MeResizePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
            { ui: this._inputNewWidth,      callback: this._onFocusOutInputNewWidth,    eventType: egret.Event.FOCUS_OUT },
            { ui: this._inputNewHeight,     callback: this._onFocusOutInputNewHeight,   eventType: egret.Event.FOCUS_OUT },
        ]);

        this._updateComponentsForLanguage();

        const war                   = MeModel.getWar();
        const { width, height }     = war.getTileMap().getMapSize();
        this._labelCurrHeight.text  = "" + height;
        this._labelCurrWidth.text   = "" + width;
        this._inputNewHeight.text   = "" + height;
        this._inputNewWidth.text    = "" + width;
        this._newWidth              = width;
        this._newHeight             = height;
    }

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private async _onTouchedBtnConfirm(e: egret.TouchEvent): Promise<void> {
        const width         = this._newWidth;
        const height        = this._newHeight;
        const gridsCount    = width * height;
        if ((!gridsCount) || (gridsCount <= 0)) {
            FloatText.show(Lang.getText(Lang.Type.A0087));
        } else {
            const war       = MeModel.getWar();
            const currSize  = war.getTileMap().getMapSize();
            if ((width !== currSize.width) || (height !== currSize.height)) {
                war.stopRunning();
                await war.initWithMapEditorData({
                    mapRawData  : MeUtility.resizeMap(war.serializeForMap(), width, height),
                    slotIndex   : war.getMapSlotIndex(),
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();
            }

            this.close();
            MeWarMenuPanel.hide();
        }
    }

    private _onFocusOutInputNewWidth(e: egret.Event): void {
        const input = this._inputNewWidth;
        let width = Number(input.text);
        if ((isNaN(width)) || (width <= 0)) {
            width = MeModel.getWar().getTileMap().getMapSize().width;
        }
        this._newWidth  = width;
        input.text      = "" + width;
    }

    private _onFocusOutInputNewHeight(e: egret.Event): void {
        const input = this._inputNewHeight;
        let width = Number(input.text);
        if ((isNaN(width)) || (width <= 0)) {
            width = MeModel.getWar().getTileMap().getMapSize().height;
        }
        this._newHeight = width;
        input.text      = "" + width;
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
        this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
        this._labelTitle.text           = Lang.getText(Lang.Type.B0290);
        this._labelCurrSizeTitle.text   = Lang.getText(Lang.Type.B0291);
        this._labelNewSizeTitle.text    = Lang.getText(Lang.Type.B0292);
        this._labelTips1.text           = Lang.getText(Lang.Type.A0086);
        this._labelTips2.text           = Lang.getFormattedText(Lang.Type.F0023, CommonConstants.MapMaxGridsCount);
    }
}
