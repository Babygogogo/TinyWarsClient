
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Types    = Utility.Types;

    export type OpenDataForCommonAlertPanel = {
        title       : string;
        content     : string;
        callback?   : () => any;
    }

    export class CommonAlertPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonAlertPanel;

        private _scrContent     : eui.Scroller;
        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        private _openData: OpenDataForCommonAlertPanel;

        public static show(data: OpenDataForCommonAlertPanel): void {
            if (!CommonAlertPanel._instance) {
                CommonAlertPanel._instance = new CommonAlertPanel();
            }
            CommonAlertPanel._instance._openData = data;
            CommonAlertPanel._instance.open();
        }

        public static hide(): void {
            if (CommonAlertPanel._instance) {
                CommonAlertPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonAlertPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._labelTitle.text = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
            this._scrContent.viewport.scrollV = 0;
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            this.close();
            (this._openData.callback) && (this._openData.callback());
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            if (Lang.getCurrentLanguageType() === Types.LanguageType.Chinese) {
                this._btnClose.setImgDisplaySource("button_confirm_001");
            } else {
                this._btnClose.setImgDisplaySource("button_confirm_002");
            }
        }
    }
}
