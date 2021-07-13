
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTextInput }                  from "../../../utility/ui/UiTextInput";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { FloatText }                    from "../../../utility/FloatText";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { MeModel }                      from "../model/MeModel";
import * as MeUtility                   from "../model/MeUtility";

export class MeResizePanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeResizePanel;

    private _labelTitle         : TwnsUiLabel.UiLabel;
    private _labelCurrSizeTitle : TwnsUiLabel.UiLabel;
    private _labelCurrWidth     : TwnsUiLabel.UiLabel;
    private _labelCurrHeight    : TwnsUiLabel.UiLabel;
    private _labelNewSizeTitle  : TwnsUiLabel.UiLabel;
    private _inputNewWidth      : TwnsUiTextInput.UiTextInput;
    private _inputNewHeight     : TwnsUiTextInput.UiTextInput;
    private _labelTips1         : TwnsUiLabel.UiLabel;
    private _labelTips2         : TwnsUiLabel.UiLabel;
    private _btnCancel          : TwnsUiButton.UiButton;
    private _btnConfirm         : TwnsUiButton.UiButton;

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
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            FloatText.show(Lang.getText(LangTextType.A0087));
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
        this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
        this._btnCancel.label           = Lang.getText(LangTextType.B0154);
        this._labelTitle.text           = Lang.getText(LangTextType.B0290);
        this._labelCurrSizeTitle.text   = Lang.getText(LangTextType.B0291);
        this._labelNewSizeTitle.text    = Lang.getText(LangTextType.B0292);
        this._labelTips1.text           = Lang.getText(LangTextType.A0086);
        this._labelTips2.text           = Lang.getFormattedText(LangTextType.F0023, CommonConstants.MapMaxGridsCount);
    }
}
