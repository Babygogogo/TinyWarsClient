
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import LocalStorage         from "../../tools/helpers/LocalStorage";
// import SoundManager         from "../../tools/helpers/SoundManager";
// import StageManager         from "../../tools/helpers/StageManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import NotifyType       = Twns.Notify.NotifyType;
    import LangTextType     = Twns.Lang.LangTextType;
    import StageMinScale    = CommonConstants.StageMinScale;
    import StageMaxScale    = CommonConstants.StageMaxScale;

    export type OpenDataForUserSetStageScalePanel = void;
    export class UserSetStageScalePanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetStageScalePanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;

        private readonly _labelScaleTitle!  : TwnsUiLabel.UiLabel;
        private readonly _groupScale!       : eui.Group;
        private readonly _imgScaleBar!      : TwnsUiImage.UiImage;
        private readonly _imgScalePoint!    : TwnsUiImage.UiImage;
        private readonly _labelScale!       : TwnsUiLabel.UiLabel;

        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnDefault!       : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        private _prevScale                  : number | null = null;
        private _selectedScale              : number | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupScale,     callback: this._onTouchedGroupScale },
                { ui: this._groupScale,     callback: this._onTouchMoveGroupScale,              eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupScale,     callback: this._onTouchEndGroupScale,               eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupScale,     callback: this._onTouchReleaseOutsideGroupScale,    eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },

                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnDefault,     callback: this._onTouchedBtnDefault },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled();
            this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());

            const scale         = StageManager.getStageScale();
            this._prevScale     = scale;
            this._selectedScale = scale;

            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // callbacks
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupScale(e: egret.Event): void {
            const width         = this._groupScale.width;
            const scale         = Math.floor(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            this._selectedScale = scale;
            StageManager.setStageScale(scale);
            this._updateGroupScale();
        }
        private _onTouchMoveGroupScale(e: egret.Event): void {
            // const width         = this._groupScale.width;
            // this._selectedScale = Math.floor(Math.max(0, Math.min(e.localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            // this._updateGroupScale();
            const width         = this._groupScale.width;
            const scale         = Math.floor(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            this._selectedScale = scale;
            StageManager.setStageScale(scale);
            this._updateGroupScale();
        }
        private _onTouchEndGroupScale(): void {
            StageManager.setStageScale(this._selectedScale || CommonConstants.StageMinScale);
        }
        private _onTouchReleaseOutsideGroupScale(): void {
            StageManager.setStageScale(this._selectedScale || CommonConstants.StageMinScale);
        }
        private _onTouchedBtnCancel(): void {
            StageManager.setStageScale(this._prevScale || CommonConstants.StageMinScale);

            this.close();
        }
        private _onTouchedBtnDefault(): void {
            this._selectedScale = StageMinScale;
            StageManager.setStageScale(StageMinScale);

            this._updateView();
        }
        private _onTouchedBtnConfirm(): void {
            LocalStorage.setStageScale(this._selectedScale || CommonConstants.StageMinScale);

            this.close();
        }
        private _onTouchedPanelMask(): void {
            StageManager.setStageScale(this._prevScale || CommonConstants.StageMinScale);
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonCancel01);

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupScale();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0558);
            this._labelScaleTitle.text  = Lang.getText(LangTextType.B0559);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnDefault.label      = Lang.getText(LangTextType.B0543);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _updateGroupScale(): void {
            const scale                 = this._selectedScale || CommonConstants.StageMinScale;
            const width                 = this._groupScale.width;
            const pos                   = width * (scale - StageMinScale) / (StageMaxScale - StageMinScale);
            this._imgScalePoint.x       = pos;
            this._imgScaleBar.width     = pos;
            this._labelScale.text       = `${Twns.Helpers.formatString("%.2f", 10000 / scale)}%`;
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
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
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsUserSetStageScalePanel;
