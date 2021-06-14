
namespace TinyWars.Common {
    import Helpers  = Utility.Helpers;
    import Lang     = Utility.Lang;

    type OpenDataForCommonConfirmPanel = {
        title?              : string;
        content             : string;
        callback            : () => any;
        callbackOnCancel?   : () => any;
        textForConfirm?     : string;
        textForCancel?      : string;
    }

    export class CommonConfirmPanel extends GameUi.UiPanel<OpenDataForCommonConfirmPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonConfirmPanel;

        private readonly _imgMask       : GameUi.UiImage;

        private readonly _group         : eui.Group;
        private readonly _labelTitle    : GameUi.UiLabel;
        private readonly _scrContent    : eui.Scroller;
        private readonly _labelContent  : GameUi.UiLabel;
        private readonly _btnCancel     : GameUi.UiButton;
        private readonly _btnConfirm    : GameUi.UiButton;

        public static show(openData: OpenDataForCommonConfirmPanel): void {
            if (!CommonConfirmPanel._instance) {
                CommonConfirmPanel._instance = new CommonConfirmPanel();
            }
            CommonConfirmPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonConfirmPanel._instance) {
                await CommonConfirmPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/common/CommonConfirmPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ]);

            this._showOpenAnimation();

            const openData          = this._getOpenData();
            this._btnConfirm.label  = openData.textForConfirm || Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = openData.textForCancel || Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = openData.title || Lang.getText(Lang.Type.B0088);
            this._labelContent.setRichText(openData.content);
            this._scrContent.viewport.scrollV = 0;
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            const openData = this._getOpenData();
            (openData.callbackOnCancel) && (openData.callbackOnCancel());

            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            this._getOpenData().callback();
            this.close();
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
    }
}
