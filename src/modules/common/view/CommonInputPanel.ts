
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export type OpenDataForCommonInputPanel = {
        title           : string;
        currentValue    : string;
        tips            : string | null;
        maxChars        : number | null;
        charRestrict    : string | null;
        callback        : (panel: CommonInputPanel) => any;
    }

    export class CommonInputPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonInputPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _input          : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _openData: OpenDataForCommonInputPanel;

        public static show(data: OpenDataForCommonInputPanel): void {
            if (!CommonInputPanel._instance) {
                CommonInputPanel._instance = new CommonInputPanel();
            }
            CommonInputPanel._instance._openData = data;
            CommonInputPanel._instance.open();
        }

        public static hide(): void {
            if (CommonInputPanel._instance) {
                CommonInputPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonInputPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
                { ui: this._input,      callback: this._onFocusOutInput,    eventType: egret.Event.FOCUS_OUT },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            const openData          = this._openData;
            this._labelTitle.text   = openData.title;
            this._labelTips.text    = openData.tips;
            this._input.text        = openData.currentValue;
            this._input.maxChars    = openData.maxChars;
            this._input.restrict    = openData.charRestrict;
        }

        public getInputText(): string {
            return this._input.text;
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            CommonInputPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            CommonInputPanel.hide();
            this._openData.callback(this);
        }

        private _onFocusOutInput(e: egret.Event): void {
            if (!this._input.text) {
                this._input.text = this._openData.currentValue;
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
        }
    }
}
