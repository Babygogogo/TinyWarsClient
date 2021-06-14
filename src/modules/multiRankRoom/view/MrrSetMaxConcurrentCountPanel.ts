
namespace TinyWars.MultiRankRoom {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.CommonConstants;
    import MaxCount         = CommonConstants.RankMaxConcurrentCount;
    import MinCount         = CommonConstants.RankMinConcurrentCount;

    export class MrrSetMaxConcurrentCountPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrSetMaxConcurrentCountPanel;

        private readonly _imgMask           : GameUi.UiImage;
        private readonly _group             : eui.Group;
        private readonly _labelTitle        : GameUi.UiLabel;
        private readonly _labelTips         : GameUi.UiLabel;
        private readonly _btnCancel         : GameUi.UiButton;
        private readonly _btnConfirm        : GameUi.UiButton;

        private readonly _labelStdTitle     : GameUi.UiLabel;
        private readonly _groupStd          : eui.Group;
        private readonly _imgStdBar         : GameUi.UiImage;
        private readonly _imgStdPoint       : GameUi.UiImage;
        private readonly _labelStdCount     : GameUi.UiLabel;
        private readonly _labelStdMaxCount  : GameUi.UiLabel;

        private readonly _labelFogTitle     : GameUi.UiLabel;
        private readonly _groupFog          : eui.Group;
        private readonly _imgFogBar         : GameUi.UiImage;
        private readonly _imgFogPoint       : GameUi.UiImage;
        private readonly _labelFogCount     : GameUi.UiLabel;
        private readonly _labelFogMaxCount  : GameUi.UiLabel;

        private _selectedCountForStd        : number;
        private _selectedCountForFog        : number;

        public static show(): void {
            if (!MrrSetMaxConcurrentCountPanel._instance) {
                MrrSetMaxConcurrentCountPanel._instance = new MrrSetMaxConcurrentCountPanel();
            }
            MrrSetMaxConcurrentCountPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MrrSetMaxConcurrentCountPanel._instance) {
                await MrrSetMaxConcurrentCountPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiRankRoom/MrrSetMaxConcurrentCountPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetMaxConcurrentCount,    callback: this._onMsgMrrGetMaxConcurrentCount },
                { type: Notify.Type.MsgMrrSetMaxConcurrentCount,    callback: this._onMsgMrrSetMaxConcurrentCount },
            ]);
            this._setUiListenerArray([
                { ui: this._groupStd,       callback: this._onTouchedGroupStd },
                { ui: this._groupStd,       callback: this._onTouchMoveGroupStd,            eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupStd,       callback: this._onTouchEndGroupStd,             eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupStd,       callback: this._onTouchReleaseOutsideGroupStd,  eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },

                { ui: this._groupFog,       callback: this._onTouchedGroupFog },
                { ui: this._groupFog,       callback: this._onTouchMoveGroupFog,            eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupFog,       callback: this._onTouchEndGroupFog,             eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupFog,       callback: this._onTouchReleaseOutsideGroupFog,  eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },

                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);

            this._showOpenAnimation();

            this._labelStdMaxCount.text = ` / ${MaxCount}`;
            this._labelFogMaxCount.text = ` / ${MaxCount}`;

            this._updateComponentsForLanguage();
            this._loadMaxCountAndUpdateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgMrrGetMaxConcurrentCount(e: egret.Event): void {
            this._loadMaxCountAndUpdateView();
        }
        private _onMsgMrrSetMaxConcurrentCount(e: egret.Event): void {
            this._loadMaxCountAndUpdateView();
        }

        private _onTouchedGroupStd(e: egret.TouchEvent): void {
            const width                 = this._groupStd.width;
            this._selectedCountForStd   = Math.round(Math.max(0, Math.min(e.localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._updateGroupStd();
        }
        private _onTouchMoveGroupStd(e: egret.TouchEvent): void {
            const width                 = this._groupStd.width;
            this._selectedCountForStd   = Math.round(Math.max(0, Math.min(e.localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._updateGroupStd();
        }
        private _onTouchEndGroupStd(e: egret.TouchEvent): void {
        }
        private _onTouchReleaseOutsideGroupStd(e: egret.TouchEvent): void {
        }

        private _onTouchedGroupFog(e: egret.TouchEvent): void {
            const width                 = this._groupFog.width;
            this._selectedCountForFog   = Math.round(Math.max(0, Math.min(e.localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._updateGroupFog();
        }
        private _onTouchMoveGroupFog(e: egret.TouchEvent): void {
            const width                 = this._groupFog.width;
            this._selectedCountForFog   = Math.round(Math.max(0, Math.min(e.localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._updateGroupFog();
        }
        private _onTouchEndGroupFog(e: egret.TouchEvent): void {
        }
        private _onTouchReleaseOutsideGroupFog(e: egret.TouchEvent): void {
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            MrrProxy.reqMrrSetMaxConcurrentCount(this._selectedCountForStd, this._selectedCountForFog);

            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Function for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _loadMaxCountAndUpdateView(): void {
            this._selectedCountForStd = MrrModel.getMaxConcurrentCount(false);
            this._selectedCountForFog = MrrModel.getMaxConcurrentCount(true);
            this._updateGroupStd();
            this._updateGroupFog();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text       = Lang.getText(Lang.Type.B0413);
            this._labelTips.text        = Lang.getText(Lang.Type.A0132);
            this._labelStdTitle.text    = Lang.getText(Lang.Type.B0548);
            this._labelFogTitle.text    = Lang.getText(Lang.Type.B0549);
        }

        private _updateGroupStd(): void {
            const count                 = this._selectedCountForStd;
            const pos                   = this._groupStd.width * (count - MinCount) / (MaxCount - MinCount);
            this._imgStdPoint.x         = pos;
            this._imgStdBar.width       = pos;
            this._labelStdCount.text    = `${count}`;
        }
        private _updateGroupFog(): void {
            const count                 = this._selectedCountForFog;
            const pos                   = this._groupFog.width * (count - MinCount) / (MaxCount - MinCount);
            this._imgFogPoint.x         = pos;
            this._imgFogBar.width       = pos;
            this._labelFogCount.text    = `${count}`;
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { verticalCenter: 40, alpha: 0 },
                endProps    : { verticalCenter: 0, alpha: 1 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { verticalCenter: 0, alpha: 1 },
                    endProps    : { verticalCenter: 40, alpha: 0 },
                });
            });
        }
    }
}
