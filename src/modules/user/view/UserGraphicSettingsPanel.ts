
// import TwnsChangeLogPanel           from "../../changeLog/view/ChangeLogPanel";
// import TwnsChatPanel                from "../../chat/view/ChatPanel";
// import TwnsCommonChangeVersionPanel from "../../common/view/CommonChangeVersionPanel";
// import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
// import TwnsCommonRankListPanel      from "../../common/view/CommonRankListPanel";
// import TwnsCommonServerStatusPanel  from "../../common/view/CommonServerStatusPanel";
// import TwnsLobbyBackgroundPanel     from "../../lobby/view/LobbyBackgroundPanel";
// import TwnsMmMainMenuPanel          from "../../mapManagement/view/MmMainMenuPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import LocalStorage                 from "../../tools/helpers/LocalStorage";
// import StageManager                 from "../../tools/helpers/StageManager";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiRadioButton            from "../../tools/ui/UiRadioButton";
// import UserModel                    from "../../user/model/UserModel";
// import UserProxy                    from "../../user/model/UserProxy";
// import TwnsUserChangeDiscordIdPanel from "./UserChangeDiscordIdPanel";
// import TwnsUserChangeNicknamePanel  from "./UserChangeNicknamePanel";
// import TwnsUserOnlineUsersPanel     from "./UserOnlineUsersPanel";
// import TwnsUserSetPasswordPanel     from "./UserSetPasswordPanel";
// import TwnsUserSetPrivilegePanel    from "./UserSetPrivilegePanel";
// import TwnsUserSetSoundPanel        from "./UserSetSoundPanel";
// import TwnsUserSetStageScalePanel   from "./UserSetStageScalePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;

    export type OpenDataForUserGraphicSettingsPanel = void;
    export class UserGraphicSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForUserGraphicSettingsPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _group!                    : eui.Group;
        private readonly _scroller!                 : eui.Scroller;

        private readonly _uiRadioTexture!           : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioUnitAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioTileAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioWeatherAnimation!  : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioShowGridBorder!    : TwnsUiRadioButton.UiRadioButton;

        private readonly _groupButtons!             : eui.Group;
        private readonly _btnSetOpacity!            : TwnsUiButton.UiButton;
        private readonly _btnSetStageScaler!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._btnSetOpacity,          callback: this._onTouchedBtnSetOpacity },
                { ui: this._btnSetStageScaler,      callback: this._onTouchedBtnSetStageScaler },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._uiRadioTexture.setData({
                titleTextType   : LangTextType.B0628,
                leftTextType    : LangTextType.B0385,
                rightTextType   : LangTextType.B0386,
                callbackOnLeft  : () => {
                    User.UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V0,
                    });
                },
                callbackOnRight : () => {
                    User.UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V1,
                    });
                },
                checkerForLeftOn: () => {
                    return User.UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0;
                },
            });
            this._uiRadioUnitAnimation.setData({
                titleTextType   : LangTextType.B0629,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Timer.startUnitAnimationTick();
                    LocalStorage.setShowUnitAnimation(true);
                },
                callbackOnRight : () => {
                    Timer.stopUnitAnimationTick();
                    LocalStorage.setShowUnitAnimation(false);
                },
                checkerForLeftOn: () => {
                    return Timer.checkIsUnitAnimationTicking();
                },
            });
            this._uiRadioTileAnimation.setData({
                titleTextType   : LangTextType.B0630,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Timer.startTileAnimationTick();
                    LocalStorage.setShowTileAnimation(true);
                },
                callbackOnRight : () => {
                    Timer.stopTileAnimationTick();
                    LocalStorage.setShowTileAnimation(false);
                },
                checkerForLeftOn: () => {
                    return Timer.checkIsTileAnimationTicking();
                },
            });
            this._uiRadioWeatherAnimation.setData({
                titleTextType   : LangTextType.B0985,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    LocalStorage.setShowWeatherAnimation(true);
                    Notify.dispatch(NotifyType.UserSettingsIsShowWeatherAnimationChanged);
                },
                callbackOnRight : () => {
                    LocalStorage.setShowWeatherAnimation(false);
                    Notify.dispatch(NotifyType.UserSettingsIsShowWeatherAnimationChanged);
                },
                checkerForLeftOn: () => {
                    return LocalStorage.getShowWeatherAnimation();
                },
            });
            this._uiRadioShowGridBorder.setData({
                titleTextType   : LangTextType.B0584,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    User.UserProxy.reqUserSetSettings({
                        isShowGridBorder: true,
                    });
                },
                callbackOnRight : () => {
                    User.UserProxy.reqUserSetSettings({
                        isShowGridBorder: false,
                    });
                },
                checkerForLeftOn: () => {
                    return User.UserModel.getSelfSettingsIsShowGridBorder();
                },
            });

            this._scroller.viewport.scrollV = 0;
            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._uiRadioTexture.updateView();
        }
        private _onNotifyUserSettingsIsShowGridBorderChanged(): void {
            this._uiRadioShowGridBorder.updateView();
        }
        private _onTouchedBtnSetOpacity(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.UserSetOpacityPanel, void 0);
        }
        private _onTouchedBtnSetStageScaler(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.UserSetStageScalePanel, void 0);
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

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateGroupButtons();
        }

        private async _updateGroupButtons(): Promise<void> {
            const group = this._groupButtons;
            group.removeChildren();
            group.addChild(this._btnSetOpacity);
            group.addChild(this._btnSetStageScaler);
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(LangTextType.B0984);
            this._updateBtnSetOpacity();
            this._updateBtnSetStageScaler();
        }

        private _updateBtnSetOpacity(): void {
            this._btnSetOpacity.label = Lang.getText(LangTextType.B0827);
        }
        private _updateBtnSetStageScaler(): void {
            this._btnSetStageScaler.label = Lang.getText(LangTextType.B0558);
        }
    }
}

// export default TwnsUserGraphicSettingsPanel;
