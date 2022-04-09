
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import LocalStorage         from "../../tools/helpers/LocalStorage";
// import SoundManager         from "../../tools/helpers/SoundManager";
// import StageManager         from "../../tools/helpers/StageManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsRwReplayProgressPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export type OpenData = {
        war: Twns.ReplayWar.RwWar;
    };
    export class RwReplayProgressPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;

        private readonly _labelTarget!      : TwnsUiLabel.UiLabel;

        private readonly _groupProgress!    : eui.Group;
        private readonly _imgProgressBar!   : TwnsUiImage.UiImage;
        private readonly _imgProgressPoint! : TwnsUiImage.UiImage;

        private readonly _btnFirst!         : TwnsUiButton.UiButton;
        private readonly _btnLast!          : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        private _allCheckpointInfoArray?    : Types.ReplayCheckpointInfo[];
        private _selectedCheckpointId?      : number;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupProgress,     callback: this._onTouchedGroupProgress },
                { ui: this._groupProgress,     callback: this._onTouchMoveGroupProgress,            eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupProgress,     callback: this._onTouchEndGroupProgress,             eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupProgress,     callback: this._onTouchReleaseOutsideGroupProgress,  eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },

                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnFirst,       callback: this._onTouchedBtnFirst },
                { ui: this._btnLast,        callback: this._onTouchedBtnLast },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const war                       = this._getOpenData().war;
            const allCheckpointInfoArray    = war.getAllCheckpointInfoArray();
            const nextActionId              = war.getNextActionId();
            const nextCheckpointId          = allCheckpointInfoArray.findIndex(v => v.nextActionId > nextActionId);
            this._allCheckpointInfoArray    = allCheckpointInfoArray;
            this._selectedCheckpointId      = nextCheckpointId >= 0 ? Math.max(nextCheckpointId - 1, 0) : allCheckpointInfoArray.length - 1;

            this._updateView();
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

        private _onTouchedGroupProgress(e: egret.Event): void {
            const width             = this._groupProgress.width;
            const minCheckpointId   = this._getMinCheckpointId();
            const checkpointId      = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
            this._setSelectedCheckpointId(checkpointId);
            this._updateGroupProgress();
            this._updateLabelTarget();
        }
        private _onTouchMoveGroupProgress(e: egret.Event): void {
            const width             = this._groupProgress.width;
            const minCheckpointId   = this._getMinCheckpointId();
            const checkpointId      = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
            this._setSelectedCheckpointId(checkpointId);
            this._updateGroupProgress();
            this._updateLabelTarget();
        }
        private _onTouchEndGroupProgress(): void {
            // nothing to do
        }
        private _onTouchReleaseOutsideGroupProgress(): void {
            // nothing to do
        }
        private _onTouchedBtnCancel(): void {
            this.close();
        }
        private _onTouchedBtnFirst(): void {
            this._setSelectedCheckpointId(this._getMinCheckpointId());
            this._updateGroupProgress();
            this._updateLabelTarget();
        }
        private _onTouchedBtnLast(): void {
            this._setSelectedCheckpointId(this._getMaxCheckpointId());
            this._updateGroupProgress();
            this._updateLabelTarget();
        }
        private async _onTouchedBtnConfirm(): Promise<void> {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonBlockPanel, {
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0040),
            });
            await this._getOpenData().war.loadCheckpoint(this._getSelectedCheckpointId());
            TwnsPanelManager.close(TwnsPanelConfig.Dict.CommonBlockPanel);
            this.close();
        }
        private _onTouchedPanelMask(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonCancel01);

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupProgress();
            this._updateLabelTarget();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0712);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);

            this._updateLabelTarget();
        }

        private _updateGroupProgress(): void {
            const checkpointId          = this._getSelectedCheckpointId();
            const minCheckpointId       = this._getMinCheckpointId();
            const width                 = this._groupProgress.width;
            const pos                   = width * (checkpointId - minCheckpointId) / (this._getMaxCheckpointId() - minCheckpointId);
            this._imgProgressPoint.x    = pos;
            this._imgProgressBar.width  = pos;
        }
        private _updateLabelTarget(): void {
            const checkpointInfo        = Helpers.getExisted(this._allCheckpointInfoArray, ClientErrorCode.RwReplayProgressPanel_UpdateGroupProgress_00)[this._getSelectedCheckpointId()];
            this._labelTarget.text      = `${Lang.getText(LangTextType.B0191)}${checkpointInfo.turnIndex}  P${checkpointInfo.playerIndex}  ${Lang.getText(LangTextType.B0616)}${checkpointInfo.nextActionId}`;
        }

        private _getSelectedCheckpointId(): number {
            return Helpers.getExisted(this._selectedCheckpointId, ClientErrorCode.RwReplayProgressPanel_GetSelectedCheckpointId_00);
        }
        private _setSelectedCheckpointId(checkpointId: number): void {
            this._selectedCheckpointId = checkpointId;
        }
        private _getMinCheckpointId(): number {
            return 0;
        }
        private _getMaxCheckpointId(): number {
            return Helpers.getExisted(this._allCheckpointInfoArray?.length, ClientErrorCode.RwReplayProgressPanel_GetMaxCheckpointId_00) - 1;
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
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
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsRwReplayProgressPanel;
