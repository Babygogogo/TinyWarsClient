
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Helpers          from "../../tools/helpers/Helpers";
import LocalStorage     from "../../tools/helpers/LocalStorage";
import StageManager     from "../../tools/helpers/StageManager";
import Types            from "../../tools/helpers/Types";
import Lang             from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import TwnsNotifyType   from "../../tools/notify/NotifyType";
import TwnsUiButton     from "../../tools/ui/UiButton";
import TwnsUiImage      from "../../tools/ui/UiImage";
import TwnsUiLabel      from "../../tools/ui/UiLabel";
import TwnsUiPanel      from "../../tools/ui/UiPanel";

namespace TwnsUserSetStageScalePanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import StageMinScale    = CommonConstants.StageMinScale;
    import StageMaxScale    = CommonConstants.StageMaxScale;

    export class UserSetStageScalePanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetStageScalePanel;

        // @ts-ignore
        private readonly _imgMask           : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _group             : eui.Group;
        // @ts-ignore
        private readonly _labelTitle        : TwnsUiLabel.UiLabel;

        // @ts-ignore
        private readonly _labelScaleTitle   : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _groupScale        : eui.Group;
        // @ts-ignore
        private readonly _imgScaleBar       : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _imgScalePoint     : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _labelScale        : TwnsUiLabel.UiLabel;

        // @ts-ignore
        private readonly _btnCancel         : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnDefault        : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnConfirm        : TwnsUiButton.UiButton;

        private _prevScale                  : number | undefined;
        private _selectedScale              : number | undefined;

        public static show(): void {
            if (!UserSetStageScalePanel._instance) {
                UserSetStageScalePanel._instance = new UserSetStageScalePanel();
            }
            UserSetStageScalePanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserSetStageScalePanel._instance) {
                await UserSetStageScalePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/user/UserSetStageScalePanel.exml";
        }

        protected _onOpened(): void {
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
            this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());

            const scale         = StageManager.getStageScale();
            this._prevScale     = scale;
            this._selectedScale = scale;

            this._showOpenAnimation();
            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
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
            this._labelScale.text       = `${Helpers.formatString("%.2f", 10000 / scale)}%`;
        }

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }
}

export default TwnsUserSetStageScalePanel;
