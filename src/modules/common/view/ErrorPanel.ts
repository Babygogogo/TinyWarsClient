
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForErrorPanel = {
        content     : string;
        callback?   : () => any;
    }

    export class ErrorPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Top;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ErrorPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        private _openData: OpenDataForErrorPanel;

        public static show(data: OpenDataForErrorPanel): void {
            if (!ErrorPanel._instance) {
                ErrorPanel._instance = new ErrorPanel();
            }
            ErrorPanel._instance._openData = data;
            ErrorPanel._instance.open();
        }

        public static hide(): void {
            if (ErrorPanel._instance) {
                ErrorPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/ErrorPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ];
        }

        protected _onOpened(): void {
            this._btnClose.label    = Lang.getText(Lang.Type.B0026);
            this._labelTitle.text   = Lang.getText(Lang.Type.A0056);
            this._labelContent.setRichText(this._openData.content);
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            ErrorPanel.hide();
            (this._openData.callback) && (this._openData.callback());
        }
    }
}
