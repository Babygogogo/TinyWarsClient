
import CommonConstants      from "../../tools/helpers/CommonConstants";
import FloatText            from "../../tools/helpers/FloatText";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
import MeModel              from "../model/MeModel";
import MeUtility            from "../model/MeUtility";
import TwnsMeWarMenuPanel   from "./MeWarMenuPanel";

namespace TwnsMeClearPanel {
    import MeWarMenuPanel   = TwnsMeWarMenuPanel.MeWarMenuPanel;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export class MeClearPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeClearPanel;

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
            if (!MeClearPanel._instance) {
                MeClearPanel._instance = new MeClearPanel();
            }
            MeClearPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MeClearPanel._instance) {
                await MeClearPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeClearPanel.exml";
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
                const war = MeModel.getWar();
                war.stopRunning();
                await war.initWithMapEditorData({
                    mapRawData  : MeUtility.clearMap(war.serializeForMap(), width, height),
                    slotIndex   : war.getMapSlotIndex(),
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();

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
            this._labelTitle.text           = Lang.getText(LangTextType.B0391);
            this._labelCurrSizeTitle.text   = Lang.getText(LangTextType.B0291);
            this._labelNewSizeTitle.text    = Lang.getText(LangTextType.B0292);
            this._labelTips1.text           = Lang.getText(LangTextType.A0117);
            this._labelTips2.text           = Lang.getFormattedText(LangTextType.F0023, CommonConstants.MapMaxGridsCount);
        }
    }
}

export default TwnsMeClearPanel;
