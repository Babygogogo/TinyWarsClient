
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = Twns.Lang.LangTextType;

    export type OpenDataForCommonConfirmPanel = {
        title?              : string;
        content             : string;
        callback            : () => any;
        callbackOnCancel?   : () => any;
        textForConfirm?     : string;
        textForCancel?      : string;
        showButtonClose?    : boolean;
    };
    export class CommonConfirmPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonConfirmPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;

        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _scrContent!   : eui.Scroller;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const openData          = this._getOpenData();
            this._btnClose.visible  = !!openData.showButtonClose;
            this._btnConfirm.label  = openData.textForConfirm || Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = openData.textForCancel || Lang.getText(LangTextType.B0154);
            this._labelTitle.text   = openData.title || Lang.getText(LangTextType.B0088);
            this._labelContent.setRichText(openData.content);
            this._scrContent.viewport.scrollV = 0;
        }
        protected _onClosing(): void {
            // nothing to do
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

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsCommonConfirmPanel;
