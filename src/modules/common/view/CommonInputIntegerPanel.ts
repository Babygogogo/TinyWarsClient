
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type OpenDataForCommonInputIntegerPanel = {
        title           : string;
        currentValue    : number;
        maxValue        : number;
        minValue        : number;
        tips            : string | null;
        callback        : (panel: CommonInputIntegerPanel) => any;
    };
    export class CommonInputIntegerPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonInputIntegerPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;
        private readonly _input!        : TwnsUiTextInput.UiTextInput;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;
        private readonly _btnAdd1!      : TwnsUiButton.UiButton;
        private readonly _btnAdd10!     : TwnsUiButton.UiButton;
        private readonly _btnAdd100!    : TwnsUiButton.UiButton;
        private readonly _btnSub1!      : TwnsUiButton.UiButton;
        private readonly _btnSub10!     : TwnsUiButton.UiButton;
        private readonly _btnSub100!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._btnAdd1,        callback: this._onTouchedBtnAdd1 },
                { ui: this._btnAdd10,       callback: this._onTouchedBtnAdd10 },
                { ui: this._btnAdd100,      callback: this._onTouchedBtnAdd100 },
                { ui: this._btnSub1,        callback: this._onTouchedBtnSub1 },
                { ui: this._btnSub10,       callback: this._onTouchedBtnSub10 },
                { ui: this._btnSub100,      callback: this._onTouchedBtnSub100 },
                { ui: this._input,          callback: this._onFocusOutInput,    eventType: egret.Event.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            const openData          = this._getOpenData();
            this._labelTitle.text   = openData.title;
            this._labelTips.text    = openData.tips ?? ``;

            const input     = this._input;
            input.text      = `${openData.currentValue}`;
            input.restrict  = openData.minValue < 0 ? `0-9\\-` : `0-9`;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public getInputValue(): number {
            const value     = parseInt(this._input.text);
            const openData  = this._getOpenData();
            return ((value <= openData.maxValue) && (value >= openData.minValue))
                ? value
                : openData.currentValue;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callback(this);
            this.close();
        }

        private _onTouchedBtnAdd1(): void {
            this._updateOnTouchedButtonsForChangeValue(1);
        }
        private _onTouchedBtnAdd10(): void {
            this._updateOnTouchedButtonsForChangeValue(10);
        }
        private _onTouchedBtnAdd100(): void {
            this._updateOnTouchedButtonsForChangeValue(100);
        }
        private _onTouchedBtnSub1(): void {
            this._updateOnTouchedButtonsForChangeValue(-1);
        }
        private _onTouchedBtnSub10(): void {
            this._updateOnTouchedButtonsForChangeValue(-10);
        }
        private _onTouchedBtnSub100(): void {
            this._updateOnTouchedButtonsForChangeValue(-100);
        }

        private _onFocusOutInput(): void {
            const input     = this._input;
            const openData  = this._getOpenData();
            if (!input.text) {
                input.text = `${openData.currentValue}`;
            } else {
                input.text = `${Twns.Helpers.getValueInRange({
                    minValue    : openData.minValue,
                    maxValue    : openData.maxValue,
                    rawValue    : parseFloat(input.text) || 0,
                })}`;
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        }

        private _updateOnTouchedButtonsForChangeValue(deltaValue: number): void {
            const input     = this._input;
            const openData  = this._getOpenData();
            input.text      = `${Twns.Helpers.getValueInRange({
                minValue    : openData.minValue,
                maxValue    : openData.maxValue,
                rawValue    : (parseFloat(input.text) || 0) + deltaValue,
            })}`;
        }
    }
}

// export default TwnsCommonInputIntegerPanel;
