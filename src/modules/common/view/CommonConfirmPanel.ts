
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForCommonConfirmPanel = {
        title   : string;
        content : string;
        callback: () => any;
    }

    export class CommonConfirmPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonConfirmPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _openData: OpenDataForCommonConfirmPanel;

        public static show(data: OpenDataForCommonConfirmPanel): void {
            if (!CommonConfirmPanel._instance) {
                CommonConfirmPanel._instance = new CommonConfirmPanel();
            }
            CommonConfirmPanel._instance._openData = data;
            CommonConfirmPanel._instance.open();
        }

        public static hide(): void {
            if (CommonConfirmPanel._instance) {
                CommonConfirmPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonConfirmPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ];
        }

        protected _onOpened(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            CommonConfirmPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            CommonConfirmPanel.hide();
            this._openData.callback();
        }
    }
}
