
import CommonConstants      from "../../tools/helpers/CommonConstants";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
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

namespace TwnsMeResizePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export class MeResizePanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeResizePanel;

        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelCurrSizeTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelCurrWidth!       : TwnsUiLabel.UiLabel;
        private readonly _labelCurrHeight!      : TwnsUiLabel.UiLabel;
        private readonly _labelNewSizeTitle!    : TwnsUiLabel.UiLabel;
        private readonly _inputNewWidth!        : TwnsUiTextInput.UiTextInput;
        private readonly _inputNewHeight!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips1!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips2!           : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private _newWidth   : number | null = null;
        private _newHeight  : number | null = null;

        public static show(): void {
            if (!MeResizePanel._instance) {
                MeResizePanel._instance = new MeResizePanel();
            }
            MeResizePanel._instance.open();
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

            const war                   = Helpers.getExisted(MeModel.getWar());
            const { width, height }     = war.getTileMap().getMapSize();
            this._labelCurrHeight.text  = "" + height;
            this._labelCurrWidth.text   = "" + width;
            this._inputNewHeight.text   = "" + height;
            this._inputNewWidth.text    = "" + width;
            this._newWidth              = width;
            this._newHeight             = height;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const width         = Helpers.getExisted(this._newWidth);
            const height        = Helpers.getExisted(this._newHeight);
            const gridsCount    = width * height;
            if ((!gridsCount) || (gridsCount <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0087));
            } else {
                const war       = Helpers.getExisted(MeModel.getWar());
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
                TwnsMeWarMenuPanel.MeWarMenuPanel.hide();
            }
        }

        private _onFocusOutInputNewWidth(): void {
            const input = this._inputNewWidth;
            let width = Number(input.text);
            if ((isNaN(width)) || (width <= 0)) {
                width = Helpers.getExisted(MeModel.getWar()).getTileMap().getMapSize().width;
            }
            this._newWidth  = width;
            input.text      = "" + width;
        }

        private _onFocusOutInputNewHeight(): void {
            const input = this._inputNewHeight;
            let width = Number(input.text);
            if ((isNaN(width)) || (width <= 0)) {
                width = Helpers.getExisted(MeModel.getWar()).getTileMap().getMapSize().height;
            }
            this._newHeight = width;
            input.text      = "" + width;
        }

        private _onNotifyLanguageChanged(): void {
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
}

export default TwnsMeResizePanel;
