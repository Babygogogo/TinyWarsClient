
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Helpers  = Utility.Helpers;

    type OpenData = {
        title           : string;
        currentValue    : string;
        tips            : string | null;
        maxChars        : number | null;
        charRestrict    : string | null;
        callback        : (panel: CommonInputPanel) => any;
    };
    export class CommonInputPanel extends GameUi.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonInputPanel;

        private readonly _imgMask       : GameUi.UiImage;
        private readonly _group         : eui.Group;
        private readonly _labelTitle    : GameUi.UiLabel;
        private readonly _labelTips     : GameUi.UiLabel;
        private readonly _input         : GameUi.UiTextInput;
        private readonly _btnCancel     : GameUi.UiButton;
        private readonly _btnConfirm    : GameUi.UiButton;

        public static show(openData: OpenData): void {
            if (!CommonInputPanel._instance) {
                CommonInputPanel._instance = new CommonInputPanel();
            }
            CommonInputPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonInputPanel._instance) {
                await CommonInputPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonInputPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
                { ui: this._input,      callback: this._onFocusOutInput,    eventType: egret.Event.FOCUS_OUT },
            ]);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();

            const openData          = this._getOpenData();
            this._labelTitle.text   = openData.title;
            this._labelTips.text    = openData.tips;
            this._input.text        = openData.currentValue;
            this._input.maxChars    = openData.maxChars;
            this._input.restrict    = openData.charRestrict;
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        public getInputText(): string {
            return this._input.text;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callback(this);
            this.close();
        }

        private _onFocusOutInput(): void {
            if (!this._input.text) {
                this._input.text = this._getOpenData().currentValue;
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    callback    : resolve,
                });
            });
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
        }
    }
}
