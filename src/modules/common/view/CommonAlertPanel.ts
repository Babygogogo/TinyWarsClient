
namespace TinyWars.Common {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Types    = Utility.Types;

    type OpenDataForCommonAlertPanel = {
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

        public static show(openData: OpenDataForCommonAlertPanel): void {
            if (!CommonAlertPanel._instance) {
                CommonAlertPanel._instance = new CommonAlertPanel();
            }
            CommonAlertPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonAlertPanel._instance) {
                await CommonAlertPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/common/CommonAlertPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();

            const openData          = this._getOpenData<OpenDataForCommonAlertPanel>();
            this._labelTitle.text   = openData.title;
            this._labelContent.setRichText(openData.content);
            this._scrContent.viewport.scrollV = 0;
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForCommonAlertPanel>();
            (openData.callback) && (openData.callback());

            this.close();
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
