
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

namespace TwnsUserSetSoundPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export class UserSetSoundPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetSoundPanel;

        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;

        private readonly _labelBgmTitle!        : TwnsUiLabel.UiLabel;
        private readonly _imgBgmMute!           : TwnsUiImage.UiImage;
        private readonly _groupBgmVolume!       : eui.Group;
        private readonly _imgBgmBar!            : TwnsUiImage.UiImage;
        private readonly _imgBgmPoint!          : TwnsUiImage.UiImage;
        private readonly _labelBgmVolume!       : TwnsUiLabel.UiLabel;

        private readonly _labelEffectTitle!     : TwnsUiLabel.UiLabel;
        private readonly _imgEffectMute!        : TwnsUiImage.UiImage;
        private readonly _groupEffectVolume!    : eui.Group;
        private readonly _imgEffectBar!         : TwnsUiImage.UiImage;
        private readonly _imgEffectPoint!       : TwnsUiImage.UiImage;
        private readonly _labelEffectVolume!    : TwnsUiLabel.UiLabel;

        private readonly _labelSwitchBgm!       : TwnsUiLabel.UiLabel;
        private readonly _labelBgmName!         : TwnsUiLabel.UiLabel;
        private readonly _btnPrevBgm!           : TwnsUiButton.UiButton;
        private readonly _btnNextBgm!           : TwnsUiButton.UiButton;

        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnDefault!           : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private _prevBgmMute                : boolean | null = null;
        private _prevBgmVolume              : number | null = null;
        private _prevEffectMute             : boolean | null = null;
        private _prevEffectVolume           : number | null = null;

        public static show(): void {
            if (!UserSetSoundPanel._instance) {
                UserSetSoundPanel._instance = new UserSetSoundPanel();
            }
            UserSetSoundPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (UserSetSoundPanel._instance) {
                await UserSetSoundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/user/UserSetSoundPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupBgmVolume,     callback: this._onTouchedGroupBgmVolume },
                { ui: this._groupBgmVolume,     callback: this._onTouchMoveGroupBgmVolume,              eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._imgBgmMute,         callback: this._onTouchedGroupBgmMute },

                { ui: this._groupEffectVolume,  callback: this._onTouchedGroupEffectVolume },
                { ui: this._groupEffectVolume,  callback: this._onTouchMoveGroupEffectVolume,           eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupEffectVolume,  callback: this._onTouchEndGroupEffectVolume,            eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupEffectVolume,  callback: this._onTouchReleaseOutsideGroupEffectVolume, eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },
                { ui: this._imgEffectMute,      callback: this._onTouchedGroupEffectMute },

                { ui: this._btnPrevBgm,         callback: this._onTouchedBtnPrevBgm },
                { ui: this._btnNextBgm,         callback: this._onTouchedBtnNextBgm },

                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnDefault,         callback: this._onTouchedBtnDefault },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            ]);

            this._imgBgmMute.touchEnabled       = true;
            this._imgEffectMute.touchEnabled    = true;
            this._btnCancel.setShortSfxCode(Types.ShortSfxCode.ButtonCancel01);
            this._btnConfirm.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);

            this._prevBgmMute                   = SoundManager.getIsBgmMute();
            this._prevBgmVolume                 = SoundManager.getBgmVolume();
            this._prevEffectMute                = SoundManager.getIsEffectMute();
            this._prevEffectVolume              = SoundManager.getEffectVolume();

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

        private _onTouchedGroupBgmVolume(e: egret.Event): void {
            const width = this._groupBgmVolume.width;
            SoundManager.setBgmVolume(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width);
            this._updateGroupBgmVolume();
        }
        private _onTouchMoveGroupBgmVolume(e: egret.Event): void {
            const width = this._groupBgmVolume.width;
            SoundManager.setBgmVolume(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width);
            this._updateGroupBgmVolume();
        }
        private _onTouchedGroupBgmMute(): void {
            const soundManager = SoundManager;
            soundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            soundManager.setIsBgmMute(!soundManager.getIsBgmMute());
            this._updateGroupBgmMute();
        }
        private _onTouchedGroupEffectVolume(e: egret.TouchEvent): void {
            const width = this._groupEffectVolume.width;
            SoundManager.setEffectVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupEffectVolume();
        }
        private _onTouchMoveGroupEffectVolume(e: egret.TouchEvent): void {
            const width = this._groupEffectVolume.width;
            SoundManager.setEffectVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupEffectVolume();
        }
        private _onTouchEndGroupEffectVolume(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchReleaseOutsideGroupEffectVolume(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupEffectMute(): void {
            const soundManager = SoundManager;
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            soundManager.setIsEffectMute(!soundManager.getIsEffectMute());
            this._updateGroupEffectMute();
        }
        private _onTouchedBtnPrevBgm(): void {
            SoundManager.playPreviousBgm();
            this._updateLabelBgmName();
        }
        private _onTouchedBtnNextBgm(): void {
            SoundManager.playNextBgm();
            this._updateLabelBgmName();
        }
        private _onTouchedBtnCancel(): void {
            const prevBgmVolume = this._prevBgmVolume;
            (prevBgmVolume != null) && (SoundManager.setBgmVolume(prevBgmVolume));

            const prevEffectVolume = this._prevEffectVolume;
            (prevEffectVolume != null) && (SoundManager.setEffectVolume(prevEffectVolume));

            const prevBgmMute = this._prevBgmMute;
            (prevBgmMute != null) && (SoundManager.setIsBgmMute(prevBgmMute));

            const prevEffectMute = this._prevEffectMute;
            (prevEffectMute != null) && (SoundManager.setIsEffectMute(prevEffectMute));

            this.close();
        }
        private _onTouchedBtnDefault(): void {
            const defaultVolume = SoundManager.DEFAULT_VOLUME;
            const defaultMute   = SoundManager.DEFAULT_MUTE;
            SoundManager.setBgmVolume(defaultVolume);
            SoundManager.setEffectVolume(defaultVolume);
            SoundManager.setIsBgmMute(defaultMute);
            SoundManager.setIsEffectMute(defaultMute);

            this._updateView();
        }
        private _onTouchedBtnConfirm(): void {
            SoundManager.setBgmVolumeToStore();
            SoundManager.setEffectVolumeToStore();
            SoundManager.setIsBgmMuteToStore();
            SoundManager.setIsEffectMuteToStore();

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupBgmMute();
            this._updateGroupEffectMute();
            this._updateGroupBgmVolume();
            this._updateGroupEffectVolume();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0540);
            this._labelBgmTitle.text    = Lang.getText(LangTextType.B0541);
            this._labelEffectTitle.text = Lang.getText(LangTextType.B0542);
            this._labelSwitchBgm.text   = Lang.getText(LangTextType.B0631);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnDefault.label      = Lang.getText(LangTextType.B0543);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._updateLabelBgmName();
        }

        private _updateGroupBgmMute(): void {
            this._imgBgmMute.source = SoundManager.getIsBgmMute() ? "commonIconSound0001" : "commonIconSound0000";
        }
        private _updateGroupEffectMute(): void {
            this._imgEffectMute.source = SoundManager.getIsEffectMute() ? "commonIconSound0001" : "commonIconSound0000";
        }
        private _updateGroupBgmVolume(): void {
            const volume                = SoundManager.getBgmVolume();
            const pos                   = this._groupBgmVolume.width * volume;
            this._imgBgmPoint.x         = pos;
            this._imgBgmBar.width       = pos;
            this._labelBgmVolume.text   = `${Math.floor(volume * 100)}`;
        }
        private _updateGroupEffectVolume(): void {
            const volume                    = SoundManager.getEffectVolume();
            const pos                       = this._groupEffectVolume.width * volume;
            this._imgEffectPoint.x          = pos;
            this._imgEffectBar.width        = pos;
            this._labelEffectVolume.text    = `${Math.floor(volume * 100)}`;
        }
        private _updateLabelBgmName(): void {
            this._labelBgmName.text = Lang.getBgmName(SoundManager.getPlayingBgmCode()) || CommonConstants.ErrorTextForUndefined;
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

// export default TwnsUserSetSoundPanel;
