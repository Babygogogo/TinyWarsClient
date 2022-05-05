
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    export type OpenDataForCommonHelpPanel = {
        title  : string;
        content: string;
    };
    export class CommonHelpPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonHelpPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _scrContent!   : eui.Scroller;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const openData                      = this._getOpenData();
            this._labelTitle.text               = openData.title;
            this._scrContent.viewport.scrollV   = 0;
            this._labelContent.setRichText(openData.content);
        }
        protected _onClosing(): void {
            // nothing to do
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

// export default TwnsCommonHelpPanel;
