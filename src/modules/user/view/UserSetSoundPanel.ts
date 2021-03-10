
namespace TinyWars.User {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import SoundManager = Utility.SoundManager;

    export class UserSetSoundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetSoundPanel;

        private readonly _labelTitle        : TinyWars.GameUi.UiLabel;

        private readonly _labelBgmTitle     : TinyWars.GameUi.UiLabel;
        private readonly _imgBgmMute        : TinyWars.GameUi.UiImage;
        private readonly _groupBgmVolume    : eui.Group;
        private readonly _imgBgmBar         : TinyWars.GameUi.UiImage;
        private readonly _imgBgmPoint       : TinyWars.GameUi.UiImage;
        private readonly _labelBgmVolume    : TinyWars.GameUi.UiLabel;

        private readonly _labelEffectTitle  : TinyWars.GameUi.UiLabel;
        private readonly _imgEffectMute     : TinyWars.GameUi.UiImage;
        private readonly _groupEffectVolume : eui.Group;
        private readonly _imgEffectBar      : TinyWars.GameUi.UiImage;
        private readonly _imgEffectPoint    : TinyWars.GameUi.UiImage;
        private readonly _labelEffectVolume : TinyWars.GameUi.UiLabel;

        private readonly _btnCancel         : TinyWars.GameUi.UiButton;
        private readonly _btnDefault        : TinyWars.GameUi.UiButton;
        private readonly _btnConfirm        : TinyWars.GameUi.UiButton;

        private _prevBgmMute                : boolean;
        private _prevBgmVolume              : number;
        private _prevEffectMute             : boolean;
        private _prevEffectVolume           : number;

        public static show(): void {
            if (!UserSetSoundPanel._instance) {
                UserSetSoundPanel._instance = new UserSetSoundPanel();
            }
            UserSetSoundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserSetSoundPanel._instance) {
                await UserSetSoundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserSetSoundPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupBgmVolume,     callback: this._onTouchMoveGroupBgmVolume,      eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._imgBgmMute,         callback: this._onTouchedGroupBgmMute },

                { ui: this._groupEffectVolume,  callback: this._onTouchMoveGroupEffectVolume,   eventType: egret.TouchEvent.TOUCH_MOVE },
                { ui: this._imgEffectMute,      callback: this._onTouchedGroupEffectMute },

                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnDefault,         callback: this._onTouchedBtnDefault },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            ]);

            this._imgBgmMute.touchEnabled       = true;
            this._imgEffectMute.touchEnabled    = true;

            this._prevBgmMute                   = SoundManager.getIsBgmMute();
            this._prevBgmVolume                 = SoundManager.getBgmVolume();
            this._prevEffectMute                = SoundManager.getIsEffectMute();
            this._prevEffectVolume              = SoundManager.getEffectVolume();

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // callbacks
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchMoveGroupBgmVolume(e: egret.TouchEvent): void {
            const width = this._groupBgmVolume.width;
            SoundManager.setBgmVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupBgmVolume();
        }
        private _onTouchedGroupBgmMute(e: egret.TouchEvent): void {
            const soundManager = SoundManager;
            soundManager.setIsBgmMute(!soundManager.getIsBgmMute());
            this._updateGroupBgmMute();
        }
        private _onTouchMoveGroupEffectVolume(e: egret.TouchEvent): void {
            const width = this._groupEffectVolume.width;
            SoundManager.setEffectVolume(Math.max(0, Math.min(e.localX, width)) / width);
            this._updateGroupEffectVolume();
        }
        private _onTouchedGroupEffectMute(e: egret.TouchEvent): void {
            const soundManager = SoundManager;
            soundManager.setIsEffectMute(!soundManager.getIsEffectMute());
            this._updateGroupEffectMute();
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            SoundManager.setBgmVolume(this._prevBgmVolume);
            SoundManager.setEffectVolume(this._prevEffectVolume);
            SoundManager.setIsBgmMute(this._prevBgmMute);
            SoundManager.setIsEffectMute(this._prevEffectMute);

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
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupBgmMute();
            this._updateGroupEffectMute();
            this._updateGroupBgmVolume();
            this._updateGroupEffectVolume();
        }

        private _updateComponentsForLanguage(): void {
            // TODO
            this._labelTitle.text;
            this._labelBgmTitle.text;
            this._labelEffectTitle;
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
        }

        private _updateGroupBgmMute(): void {
            // TODO
            this._imgBgmMute.visible = SoundManager.getIsBgmMute();
        }
        private _updateGroupEffectMute(): void {
            // TODO
            this._imgEffectMute.visible = SoundManager.getIsEffectMute();
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
    }
}
