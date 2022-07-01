
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
    import LangTextType = Lang.LangTextType;

    export type OpenDataForCommonDeletePlayerPanel = {
        content     : string;
        callback    : (forbidReentrance: boolean) => any;
    };
    export class CommonDeletePlayerPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonDeletePlayerPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;

        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _scrContent!   : eui.Scroller;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        private readonly _groupForbidReentrance!    : eui.Group;
        private readonly _imgForbidReentrance!      : TwnsUiImage.UiImage;
        private readonly _labelForbidReentrance!    : TwnsUiLabel.UiLabel;

        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._groupForbidReentrance,  callback: this._onTouchedGroupForbidReentrance },
                { ui: this._btnCancel,              callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.NotifyType.LanguageChanged,  callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();

            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const openData = this._getOpenData();
            this._labelContent.setRichText(openData.content);

            this._scrContent.viewport.scrollV = 0;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupForbidReentrance(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);

            const img   = this._imgForbidReentrance;
            img.visible = !img.visible;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const callback          = this._getOpenData().callback;
            const forbidReentrance  = this._imgForbidReentrance.visible;
            this.close();
            callback(forbidReentrance);
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
            this._labelTitle.text               = Lang.getText(LangTextType.B0088);
            this._labelForbidReentrance.text    = Lang.getText(LangTextType.B0916);
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsCommonDeletePlayerPanel;
