
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    type OpenDataForCommonInputPanel = {
        title           : string;
        currentValue    : string;
        tips            : string | null;
        maxChars        : number | null;
        charRestrict    : string | null;
        callback        : (panel: CommonInputPanel) => any;
    }

    export class CommonInputPanel extends GameUi.UiPanel<OpenDataForCommonInputPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonInputPanel;

        private _group          : eui.Group;
        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _input          : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        public static show(openData: OpenDataForCommonInputPanel): void {
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

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            this._getOpenData().callback(this);
            this.close();
        }

        private _onFocusOutInput(e: egret.Event): void {
            if (!this._input.text) {
                this._input.text = this._getOpenData().currentValue;
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, verticalCenter: -40 })
                .to({ alpha: 1, verticalCenter: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, verticalCenter: 0 })
                    .to({ alpha: 0, verticalCenter: -40 }, 200)
                    .call(resolve);
            });
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
        }
    }
}
