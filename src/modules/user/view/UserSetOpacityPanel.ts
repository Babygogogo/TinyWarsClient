
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import SoundManager         from "../../tools/helpers/SoundManager";
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
    import LangTextType     = TwnsLangTextType.LangTextType;

    export type OpenDataForUserSetOpacityPanel = void;
    export class UserSetOpacityPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetOpacityPanel> {
        private readonly _imgMask!                      : TwnsUiImage.UiImage;
        private readonly _group!                        : eui.Group;
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;

        private readonly _labelUnitTitle!               : TwnsUiLabel.UiLabel;
        private readonly _groupUnitOpacity!             : eui.Group;
        private readonly _imgUnitBar!                   : TwnsUiImage.UiImage;
        private readonly _imgUnitPoint!                 : TwnsUiImage.UiImage;
        private readonly _labelUnitOpacity!             : TwnsUiLabel.UiLabel;

        private readonly _labelTileBaseTitle!           : TwnsUiLabel.UiLabel;
        private readonly _groupTileBaseOpacity!         : eui.Group;
        private readonly _imgTileBaseBar!               : TwnsUiImage.UiImage;
        private readonly _imgTileBasePoint!             : TwnsUiImage.UiImage;
        private readonly _labelTileBaseOpacity!         : TwnsUiLabel.UiLabel;

        private readonly _labelTileObjectTitle!         : TwnsUiLabel.UiLabel;
        private readonly _groupTileObjectOpacity!       : eui.Group;
        private readonly _imgTileObjectBar!             : TwnsUiImage.UiImage;
        private readonly _imgTileObjectPoint!           : TwnsUiImage.UiImage;
        private readonly _labelTileObjectOpacity!       : TwnsUiLabel.UiLabel;

        private readonly _labelTileDecoratorTitle!      : TwnsUiLabel.UiLabel;
        private readonly _groupTileDecoratorOpacity!    : eui.Group;
        private readonly _imgTileDecoratorBar!          : TwnsUiImage.UiImage;
        private readonly _imgTileDecoratorPoint!        : TwnsUiImage.UiImage;
        private readonly _labelTileDecoratorOpacity!    : TwnsUiLabel.UiLabel;

        private readonly _btnCancel!                    : TwnsUiButton.UiButton;
        private readonly _btnDefault!                   : TwnsUiButton.UiButton;
        private readonly _btnConfirm!                   : TwnsUiButton.UiButton;

        private _prevOpacitySettings                    : CommonProto.User.IUserOpacitySettings = {};

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupUnitOpacity,           callback: this._onTouchedGroupUnitOpacity },
                { ui: this._groupUnitOpacity,           callback: this._onTouchMoveGroupUnitOpacity,            eventType: egret.TouchEvent.TOUCH_MOVE },

                { ui: this._groupTileBaseOpacity,       callback: this._onTouchedGroupTileBaseOpacity },
                { ui: this._groupTileBaseOpacity,       callback: this._onTouchMoveGroupTileBaseOpacity,        eventType: egret.TouchEvent.TOUCH_MOVE },

                { ui: this._groupTileObjectOpacity,     callback: this._onTouchedGroupTileObjectOpacity },
                { ui: this._groupTileObjectOpacity,     callback: this._onTouchMoveGroupTileObjectOpacity,      eventType: egret.TouchEvent.TOUCH_MOVE },

                { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchedGroupTileDecoratorOpacity },
                { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchMoveGroupTileDecoratorOpacity,      eventType: egret.TouchEvent.TOUCH_MOVE },

                { ui: this._btnCancel,                  callback: this._onTouchedBtnCancel },
                { ui: this._btnDefault,                 callback: this._onTouchedBtnDefault },
                { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled();

            this._btnCancel.setShortSfxCode(Types.ShortSfxCode.ButtonCancel01);
            this._btnConfirm.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._prevOpacitySettings = Helpers.deepClone(Twns.User.UserModel.getSelfSettingsOpacitySettings()) ?? {};

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

        private _onTouchedGroupUnitOpacity(e: egret.Event): void {
            const width                 = this._groupUnitOpacity.width;
            const opacitySettings       = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.unitOpacity = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupUnitOpacity();
        }
        private _onTouchMoveGroupUnitOpacity(e: egret.Event): void {
            const width                 = this._groupUnitOpacity.width;
            const opacitySettings       = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.unitOpacity = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupUnitOpacity();
        }

        private _onTouchedGroupTileBaseOpacity(e: egret.TouchEvent): void {
            const width                     = this._groupTileBaseOpacity.width;
            const opacitySettings           = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileBaseOpacity = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileBaseOpacity();
        }
        private _onTouchMoveGroupTileBaseOpacity(e: egret.TouchEvent): void {
            const width                     = this._groupTileBaseOpacity.width;
            const opacitySettings           = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileBaseOpacity = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileBaseOpacity();
        }

        private _onTouchedGroupTileObjectOpacity(e: egret.TouchEvent): void {
            const width                         = this._groupTileObjectOpacity.width;
            const opacitySettings               = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileObjectOpacity   = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileObjectOpacity();
        }
        private _onTouchMoveGroupTileObjectOpacity(e: egret.TouchEvent): void {
            const width                         = this._groupTileObjectOpacity.width;
            const opacitySettings               = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileObjectOpacity   = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileObjectOpacity();
        }

        private _onTouchedGroupTileDecoratorOpacity(e: egret.TouchEvent): void {
            const width                             = this._groupTileDecoratorOpacity.width;
            const opacitySettings                   = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileDecoratorOpacity    = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileDecoratorOpacity();
        }
        private _onTouchMoveGroupTileDecoratorOpacity(e: egret.TouchEvent): void {
            const width                             = this._groupTileDecoratorOpacity.width;
            const opacitySettings                   = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            opacitySettings.tileDecoratorOpacity    = Math.round(Math.max(0, Math.min((e as egret.TouchEvent).localX, width)) / width * 100);
            Twns.User.UserModel.setSelfSettingsOpacitySettings(opacitySettings);

            this._updateGroupTileDecoratorOpacity();
        }

        private _onTouchedBtnCancel(): void {
            Twns.User.UserModel.setSelfSettingsOpacitySettings(this._prevOpacitySettings);
            this.close();
        }
        private _onTouchedBtnDefault(): void {
            Twns.User.UserModel.setSelfSettingsOpacitySettings({
                unitOpacity             : 100,
                tileBaseOpacity         : 100,
                tileDecoratorOpacity    : 100,
                tileObjectOpacity       : 100,
            });

            this._updateView();
        }
        private _onTouchedBtnConfirm(): void {
            const opacitySettings       = Twns.User.UserModel.getSelfSettingsOpacitySettings() ?? {};
            const prevOpacitySettings   = this._prevOpacitySettings;
            if (((opacitySettings.tileBaseOpacity ?? 100) !== (prevOpacitySettings.tileBaseOpacity ?? 100))             ||
                ((opacitySettings.tileDecoratorOpacity ?? 100) !== (prevOpacitySettings.tileDecoratorOpacity ?? 100))   ||
                ((opacitySettings.tileObjectOpacity ?? 100) !== (prevOpacitySettings.tileObjectOpacity ?? 100))         ||
                ((opacitySettings.unitOpacity ?? 100) !== (prevOpacitySettings.unitOpacity ?? 100))
            ) {
                Twns.User.UserProxy.reqUserSetSettings({ opacitySettings });
            }

            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupUnitOpacity();
            this._updateGroupTileBaseOpacity();
            this._updateGroupTileObjectOpacity();
            this._updateGroupTileDecoratorOpacity();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(LangTextType.B0827);
            this._labelUnitTitle.text           = Lang.getText(LangTextType.B0304);
            this._labelTileBaseTitle.text       = Lang.getText(LangTextType.B0302);
            this._labelTileObjectTitle.text     = Lang.getText(LangTextType.B0303);
            this._labelTileDecoratorTitle.text  = Lang.getText(LangTextType.B0664);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnDefault.label              = Lang.getText(LangTextType.B0543);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private _updateGroupUnitOpacity(): void {
            const opacity               = Twns.User.UserModel.getSelfSettingsOpacitySettings()?.unitOpacity ?? 100;
            const pos                   = this._groupUnitOpacity.width * opacity / 100;
            this._imgUnitPoint.x        = pos;
            this._imgUnitBar.width      = pos;
            this._labelUnitOpacity.text = `${opacity}%`;
        }
        private _updateGroupTileBaseOpacity(): void {
            const opacity                   = Twns.User.UserModel.getSelfSettingsOpacitySettings()?.tileBaseOpacity ?? 100;
            const pos                       = this._groupTileBaseOpacity.width * opacity / 100;
            this._imgTileBasePoint.x        = pos;
            this._imgTileBaseBar.width      = pos;
            this._labelTileBaseOpacity.text = `${opacity}%`;
        }
        private _updateGroupTileObjectOpacity(): void {
            const opacity                       = Twns.User.UserModel.getSelfSettingsOpacitySettings()?.tileObjectOpacity ?? 100;
            const pos                           = this._groupTileObjectOpacity.width * opacity / 100;
            this._imgTileObjectPoint.x          = pos;
            this._imgTileObjectBar.width        = pos;
            this._labelTileObjectOpacity.text   = `${opacity}%`;
        }
        private _updateGroupTileDecoratorOpacity(): void {
            const opacity                           = Twns.User.UserModel.getSelfSettingsOpacitySettings()?.tileDecoratorOpacity ?? 100;
            const pos                               = this._groupTileDecoratorOpacity.width * opacity / 100;
            this._imgTileDecoratorPoint.x           = pos;
            this._imgTileDecoratorBar.width         = pos;
            this._labelTileDecoratorOpacity.text    = `${opacity}%`;
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

// export default TwnsUserSetOpacityPanel;
