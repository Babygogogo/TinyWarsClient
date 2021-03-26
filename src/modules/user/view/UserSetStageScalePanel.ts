
namespace TinyWars.User {
    import Lang             = Utility.Lang;
    import NotifyType       = Utility.Notify.Type;
    import LocalStorage     = Utility.LocalStorage;
    import StageManager     = Utility.StageManager;
    import CommonConstants  = Utility.CommonConstants;
    import Helpers          = Utility.Helpers;
    import StageMinScale    = CommonConstants.StageMinScale;
    import StageMaxScale    = CommonConstants.StageMaxScale;

    export class UserSetStageScalePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetStageScalePanel;

        private readonly _labelTitle        : TinyWars.GameUi.UiLabel;

        private readonly _labelScaleTitle   : TinyWars.GameUi.UiLabel;
        private readonly _groupScale        : eui.Group;
        private readonly _imgScaleBar       : TinyWars.GameUi.UiImage;
        private readonly _imgScalePoint     : TinyWars.GameUi.UiImage;
        private readonly _labelScale        : TinyWars.GameUi.UiLabel;

        private readonly _btnCancel         : TinyWars.GameUi.UiButton;
        private readonly _btnDefault        : TinyWars.GameUi.UiButton;
        private readonly _btnConfirm        : TinyWars.GameUi.UiButton;

        private _prevScale                  : number;
        private _selectedScale              : number;

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

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // callbacks
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupScale(e: egret.TouchEvent): void {
            const width         = this._groupScale.width;
            const scale         = Math.floor(Math.max(0, Math.min(e.localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            this._selectedScale = scale;
            StageManager.setStageScale(scale);
            this._updateGroupScale();
        }
        private _onTouchMoveGroupScale(e: egret.TouchEvent): void {
            // const width         = this._groupScale.width;
            // this._selectedScale = Math.floor(Math.max(0, Math.min(e.localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            // this._updateGroupScale();
            const width         = this._groupScale.width;
            const scale         = Math.floor(Math.max(0, Math.min(e.localX, width)) / width * (StageMaxScale - StageMinScale) + StageMinScale);
            this._selectedScale = scale;
            StageManager.setStageScale(scale);
            this._updateGroupScale();
        }
        private _onTouchEndGroupScale(e: egret.TouchEvent): void {
            StageManager.setStageScale(this._selectedScale);
        }
        private _onTouchReleaseOutsideGroupScale(e: egret.TouchEvent): void {
            StageManager.setStageScale(this._selectedScale);
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            StageManager.setStageScale(this._prevScale);

            this.close();
        }
        private _onTouchedBtnDefault(e: egret.TouchEvent): void {
            this._selectedScale = StageMinScale;
            StageManager.setStageScale(StageMinScale);

            this._updateView();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            LocalStorage.setStageScale(this._selectedScale);

            this.close();
        }
        private _onTouchedPanelMask(): void {
            StageManager.setStageScale(this._prevScale);

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupScale();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(Lang.Type.B0558);
            this._labelScaleTitle.text  = Lang.getText(Lang.Type.B0559);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnDefault.label      = Lang.getText(Lang.Type.B0543);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
        }

        private _updateGroupScale(): void {
            const scale                 = this._selectedScale;
            const width                 = this._groupScale.width;
            const pos                   = width * (scale - StageMinScale) / (StageMaxScale - StageMinScale);
            this._imgScalePoint.x       = pos;
            // this._imgScaleBar.width     = pos;
            this._imgScaleBar.width     = width;
            this._labelScale.text       = `${Helpers.formatString("%.2f", 10000 / scale)}%`;
        }
    }
}