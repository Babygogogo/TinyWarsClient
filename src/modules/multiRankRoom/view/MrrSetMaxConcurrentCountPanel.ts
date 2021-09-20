
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import MrrModel             from "../model/MrrModel";
import MrrProxy             from "../model/MrrProxy";

namespace TwnsMrrSetMaxConcurrentCountPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import MaxCount         = CommonConstants.RankMaxConcurrentCount;
    import MinCount         = CommonConstants.RankMinConcurrentCount;

    export class MrrSetMaxConcurrentCountPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrSetMaxConcurrentCountPanel;

        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelTips!        : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        private readonly _labelStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _groupStd!         : eui.Group;
        private readonly _imgStdBar!        : TwnsUiImage.UiImage;
        private readonly _imgStdPoint!      : TwnsUiImage.UiImage;
        private readonly _labelStdCount!    : TwnsUiLabel.UiLabel;
        private readonly _labelStdMaxCount! : TwnsUiLabel.UiLabel;

        private readonly _labelFogTitle!    : TwnsUiLabel.UiLabel;
        private readonly _groupFog!         : eui.Group;
        private readonly _imgFogBar!        : TwnsUiImage.UiImage;
        private readonly _imgFogPoint!      : TwnsUiImage.UiImage;
        private readonly _labelFogCount!    : TwnsUiLabel.UiLabel;
        private readonly _labelFogMaxCount! : TwnsUiLabel.UiLabel;

        private _selectedCountForStd?       : number;
        private _selectedCountForFog?       : number;

        public static show(): void {
            if (!MrrSetMaxConcurrentCountPanel._instance) {
                MrrSetMaxConcurrentCountPanel._instance = new MrrSetMaxConcurrentCountPanel();
            }
            MrrSetMaxConcurrentCountPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MrrSetMaxConcurrentCountPanel._instance) {
                await MrrSetMaxConcurrentCountPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMrrGetMaxConcurrentCount,    callback: this._onMsgMrrGetMaxConcurrentCount },
                { type: NotifyType.MsgMrrSetMaxConcurrentCount,    callback: this._onMsgMrrSetMaxConcurrentCount },
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
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgMrrGetMaxConcurrentCount(): void {
            this._loadMaxCountAndUpdateView();
        }
        private _onMsgMrrSetMaxConcurrentCount(): void {
            this._loadMaxCountAndUpdateView();
        }

        private _onTouchedGroupStd(e: egret.Event): void {
            const width                 = this._groupStd.width;
            const countForStd           = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._selectedCountForStd   = countForStd;
            this._updateGroupStd();

            this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, CommonConstants.RankMaxConcurrentCount - countForStd);
            this._updateGroupFog();
        }
        private _onTouchMoveGroupStd(e: egret.Event): void {
            const width                 = this._groupStd.width;
            const countForStd           = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._selectedCountForStd   = countForStd;
            this._updateGroupStd();

            this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, CommonConstants.RankMaxConcurrentCount - countForStd);
            this._updateGroupFog();
        }
        private _onTouchEndGroupStd(): void {
            // nothing to do
        }
        private _onTouchReleaseOutsideGroupStd(): void {
            // nothing to do
        }

        private _onTouchedGroupFog(e: egret.Event): void {
            const width                 = this._groupFog.width;
            const countForFog           = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._selectedCountForFog   = countForFog;
            this._updateGroupFog();

            this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, CommonConstants.RankMaxConcurrentCount - countForFog);
            this._updateGroupStd();
        }
        private _onTouchMoveGroupFog(e: egret.Event): void {
            const width                 = this._groupFog.width;
            const countForFog           = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * (MaxCount - MinCount)) + MinCount;
            this._selectedCountForFog   = countForFog;
            this._updateGroupFog();

            this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, CommonConstants.RankMaxConcurrentCount - countForFog);
            this._updateGroupStd();
        }
        private _onTouchEndGroupFog(): void {
            // nothing to do
        }
        private _onTouchReleaseOutsideGroupFog(): void {
            // nothing to do
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }
        private _onTouchedBtnConfirm(): void {
            MrrProxy.reqMrrSetMaxConcurrentCount(Helpers.getExisted(this._selectedCountForStd), Helpers.getExisted(this._selectedCountForFog));

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
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._labelTitle.text       = Lang.getText(LangTextType.B0413);
            this._labelTips.text        = Lang.getText(LangTextType.A0132);
            this._labelStdTitle.text    = Lang.getText(LangTextType.B0548);
            this._labelFogTitle.text    = Lang.getText(LangTextType.B0549);
        }

        private _updateGroupStd(): void {
            const count                 = Helpers.getExisted(this._selectedCountForStd);
            const pos                   = this._groupStd.width * (count - MinCount) / (MaxCount - MinCount);
            this._imgStdPoint.x         = pos;
            this._imgStdBar.width       = pos;
            this._labelStdCount.text    = `${count}`;
        }
        private _updateGroupFog(): void {
            const count                 = Helpers.getExisted(this._selectedCountForFog);
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

export default TwnsMrrSetMaxConcurrentCountPanel;
