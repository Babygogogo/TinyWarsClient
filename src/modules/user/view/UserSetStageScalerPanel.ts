
namespace TinyWars.User {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import SoundManager = Utility.SoundManager;

    export class UserSetStageScalerPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetStageScalerPanel;

        private readonly _labelTitle        : TinyWars.GameUi.UiLabel;

        private readonly _labelScalerTitle  : TinyWars.GameUi.UiLabel;
        private readonly _groupScaler       : eui.Group;
        private readonly _imgScalerBar      : TinyWars.GameUi.UiImage;
        private readonly _imgScalerPoint    : TinyWars.GameUi.UiImage;
        private readonly _labelScaler       : TinyWars.GameUi.UiLabel;

        private readonly _btnCancel         : TinyWars.GameUi.UiButton;
        private readonly _btnDefault        : TinyWars.GameUi.UiButton;
        private readonly _btnConfirm        : TinyWars.GameUi.UiButton;

        private _prevScaler                 : boolean;

        public static show(): void {
            if (!UserSetStageScalerPanel._instance) {
                UserSetStageScalerPanel._instance = new UserSetStageScalerPanel();
            }
            UserSetStageScalerPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserSetStageScalerPanel._instance) {
                await UserSetStageScalerPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/user/UserSetStageScalerPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupScaler,    callback: this._onTouchedGroupBgmVolume },
                { ui: this._groupScaler,    callback: this._onTouchMoveGroupBgmVolume,              eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._groupScaler,    callback: this._onTouchEndGroupEffectVolume,            eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupScaler,    callback: this._onTouchReleaseOutsideGroupEffectVolume, eventType: egret.TouchEvent.TOUCH_RELEASE_OUTSIDE },

                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnDefault,     callback: this._onTouchedBtnDefault },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);

            this._prevScaler = SoundManager.getIsBgmMute();

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // callbacks
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupBgmVolume(e: egret.TouchEvent): void {
            const width = this._groupScaler.width;
            SoundManager.setBgmVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupScaler();
        }
        private _onTouchMoveGroupBgmVolume(e: egret.TouchEvent): void {
            const width = this._groupScaler.width;
            SoundManager.setBgmVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupScaler();
        }
        private _onTouchEndGroupEffectVolume(e: egret.TouchEvent): void {
            SoundManager.playEffect("button.mp3");
        }
        private _onTouchReleaseOutsideGroupEffectVolume(e: egret.TouchEvent): void {
            SoundManager.playEffect("button.mp3");
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            SoundManager.setIsBgmMute(this._prevScaler);

            this.close();
        }
        private _onTouchedBtnDefault(e: egret.TouchEvent): void {
            const defaultVolume = SoundManager.DEFAULT_VOLUME;
            const defaultMute   = SoundManager.DEFAULT_MUTE;
            SoundManager.setBgmVolume(defaultVolume);
            SoundManager.setEffectVolume(defaultVolume);
            SoundManager.setIsBgmMute(defaultMute);
            SoundManager.setIsEffectMute(defaultMute);

            this._updateView();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            SoundManager.setBgmVolumeToStore();
            SoundManager.setEffectVolumeToStore();
            SoundManager.setIsBgmMuteToStore();
            SoundManager.setIsEffectMuteToStore();

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupScaler();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(Lang.Type.B0540);
            this._labelScalerTitle.text = Lang.getText(Lang.Type.B0541);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnDefault.label      = Lang.getText(Lang.Type.B0543);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
        }

        private _updateGroupScaler(): void {
            const volume                = SoundManager.getBgmVolume();
            const pos                   = this._groupScaler.width * volume;
            this._imgScalerPoint.x      = pos;
            this._imgScalerBar.width    = pos;
            this._labelScaler.text      = `${Math.floor(volume * 100)}`;
        }
    }
}
