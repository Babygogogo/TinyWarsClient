
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import MeModel              from "../model/MeModel";
// import MeUtility            from "../model/MeUtility";
// import TwnsMeWarMenuPanel   from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeClearPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export type OpenData = void;
    export class MeClearPanel extends TwnsUiPanel.UiPanel<OpenData> {
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

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._inputNewWidth,      callback: this._onFocusOutInputNewWidth,    eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputNewHeight,     callback: this._onFocusOutInputNewHeight,   eventType: egret.Event.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            const { width, height }     = Helpers.getExisted(MeModel.getWar()).getTileMap().getMapSize();
            this._labelCurrHeight.text  = "" + height;
            this._labelCurrWidth.text   = "" + width;
            this._inputNewHeight.text   = "" + height;
            this._inputNewWidth.text    = "" + width;
            this._newWidth              = width;
            this._newHeight             = height;
        }
        protected _onClosing(): void {
            // nothing to do
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
                const war = Helpers.getExisted(MeModel.getWar());
                war.stopRunning();
                await war.initWithMapEditorData(
                    {
                        mapRawData  : MeUtility.clearMap(war.serializeForMap(), width, height),
                        slotIndex   : war.getMapSlotIndex(),
                    },
                    war.getGameConfig()
                );
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();

                this.close();
                TwnsPanelManager.close(TwnsPanelConfig.Dict.MeWarMenuPanel);
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
            this._labelTitle.text           = Lang.getText(LangTextType.B0391);
            this._labelCurrSizeTitle.text   = Lang.getText(LangTextType.B0291);
            this._labelNewSizeTitle.text    = Lang.getText(LangTextType.B0292);
            this._labelTips1.text           = Lang.getText(LangTextType.A0117);
            this._labelTips2.text           = Lang.getFormattedText(LangTextType.F0023, CommonConstants.MapMaxGridsCount);
        }
    }
}

// export default TwnsMeClearPanel;
