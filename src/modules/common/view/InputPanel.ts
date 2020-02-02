
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export type OpenDataForInputPanel = {
        title           : string;
        currentValue    : string;
        maxChars        : number;
        callback        : (panel: InputPanel) => any;
    }

    export class InputPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: InputPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _input          : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _openData: OpenDataForInputPanel;

        public static show(data: OpenDataForInputPanel): void {
            if (!InputPanel._instance) {
                InputPanel._instance = new InputPanel();
            }
            InputPanel._instance._openData = data;
            InputPanel._instance.open();
        }

        public static hide(): void {
            if (InputPanel._instance) {
                InputPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/InputPanel.exml";
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
            this._input.text        = openData.currentValue;
            this._input.maxChars    = openData.maxChars;
        }

        public getInputText(): string {
            return this._input.text;
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            InputPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            InputPanel.hide();
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
