
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    type OpenDataForCommonErrorPanel = {
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

        public static show(openData: OpenDataForCommonErrorPanel): void {
            if (!CommonErrorPanel._instance) {
                CommonErrorPanel._instance = new CommonErrorPanel();
            }
            CommonErrorPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonErrorPanel._instance) {
                await CommonErrorPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonErrorPanel.exml";
            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ]);

            this._btnClose.label    = Lang.getText(Lang.Type.B0026);
            this._labelTitle.text   = Lang.getText(Lang.Type.A0056);
            this._labelContent.setRichText(this._getOpenData<OpenDataForCommonErrorPanel>().content);
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForCommonErrorPanel>();
            (openData.callback) && (openData.callback());

            this.close();
        }
    }
}
