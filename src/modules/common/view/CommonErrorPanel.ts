
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForCommonErrorPanel = {
        content     : string;
        callback?   : () => any;
    }

    export class CommonErrorPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Top;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonErrorPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        private _openData: OpenDataForCommonErrorPanel;

        public static show(data: OpenDataForCommonErrorPanel): void {
            if (!CommonErrorPanel._instance) {
                CommonErrorPanel._instance = new CommonErrorPanel();
            }
            CommonErrorPanel._instance._openData = data;
            CommonErrorPanel._instance.open();
        }

        public static hide(): void {
            if (CommonErrorPanel._instance) {
                CommonErrorPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonErrorPanel.exml";
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
            CommonErrorPanel.hide();
            (this._openData.callback) && (this._openData.callback());
        }
    }
}
