
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiButton              from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiImage              from "../../tools/ui/UiImage";
import Helpers              from "../../tools/helpers/Helpers";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Types                from "../../tools/helpers/Types";

namespace TwnsCommonConfirmPanel {

    type OpenDataForCommonConfirmPanel = {
        title?              : string;
        content             : string;
        callback            : () => any;
        callbackOnCancel?   : () => any;
        textForConfirm?     : string;
        textForCancel?      : string;
    };
    export class CommonConfirmPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonConfirmPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonConfirmPanel;

        // @ts-ignore
        private readonly _imgMask       : TwnsUiImage.UiImage;

        // @ts-ignore
        private readonly _group         : eui.Group;
        // @ts-ignore
        private readonly _labelTitle    : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _scrContent    : eui.Scroller;
        // @ts-ignore
        private readonly _labelContent  : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _btnCancel     : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnConfirm    : TwnsUiButton.UiButton;

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
            this._btnConfirm.label  = openData.textForConfirm || Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = openData.textForCancel || Lang.getText(LangTextType.B0154);
            this._labelTitle.text   = openData.title || Lang.getText(LangTextType.B0088);
            this._labelContent.setRichText(openData.content);
            this._scrContent.viewport.scrollV = 0;
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onTouchedBtnCancel(): void {
            const openData = this._getOpenData();
            (openData.callbackOnCancel) && (openData.callbackOnCancel());

            this.close();
        }

        private _onTouchedBtnConfirm(): void {
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

export default TwnsCommonConfirmPanel;
