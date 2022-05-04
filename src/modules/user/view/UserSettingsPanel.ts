
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
// import Twns.Notify               from "../../tools/notify/NotifyType";
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
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import ClientErrorCode          = Twns.ClientErrorCode;

    export type OpenDataForUserSettingsPanel = void;
    export class UserSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSettingsPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _btnDamageCalculator!      : TwnsUiButton.UiButton;
        private readonly _group!                    : eui.Group;
        private readonly _scroller!                 : eui.Scroller;

        private readonly _uiRadioLanguage!          : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioTexture!           : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioUnitAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioTileAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioShowGridBorder!    : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioAutoScrollMap!     : TwnsUiRadioButton.UiRadioButton;

        private readonly _groupButtons!             : eui.Group;
        private readonly _btnChangeNickname!        : TwnsUiButton.UiButton;
        private readonly _btnChangePassword!        : TwnsUiButton.UiButton;
        private readonly _btnChangeDiscordId!       : TwnsUiButton.UiButton;
        private readonly _btnChangeGameVersion!     : TwnsUiButton.UiButton;
        private readonly _btnRankList!              : TwnsUiButton.UiButton;
        private readonly _btnShowOnlineUsers!       : TwnsUiButton.UiButton;
        private readonly _btnSetSound!              : TwnsUiButton.UiButton;
        private readonly _btnSetOpacity!            : TwnsUiButton.UiButton;
        private readonly _btnSetStageScaler!        : TwnsUiButton.UiButton;
        private readonly _btnServerStatus!          : TwnsUiButton.UiButton;
        private readonly _btnComplaint!             : TwnsUiButton.UiButton;
        private readonly _btnUnitsInfo!             : TwnsUiButton.UiButton;
        private readonly _btnChangeLog!             : TwnsUiButton.UiButton;
        private readonly _btnGameManagement!        : TwnsUiButton.UiButton;
        private readonly _btnMapManagement!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
                { type: NotifyType.UserSettingsIsAutoScrollMapChanged,  callback: this._onNotifyUserSettingsIsAutoScrollMapChanged },
                { type: NotifyType.MsgUserGetPublicInfo,                callback: this._onMsgUserGetPublicInfo },
                { type: NotifyType.MsgUserSetNickname,                  callback: this._onMsgUserSetNickname },
                { type: NotifyType.MsgUserSetDiscordId,                 callback: this._onMsgUserSetDiscordId },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._btnDamageCalculator,    callback: this._onTouchedBtnDamageCalculator },
                { ui: this._btnChangeNickname,      callback: this._onTouchedBtnChangeNickname },
                { ui: this._btnChangePassword,      callback: this._onTouchedBtnChangePassword },
                { ui: this._btnChangeDiscordId,     callback: this._onTouchedBtnChangeDiscordId },
                { ui: this._btnChangeGameVersion,   callback: this._onTouchedBtnChangeGameVersion },
                { ui: this._btnRankList,            callback: this._onTouchedBtnRankList },
                { ui: this._btnShowOnlineUsers,     callback: this._onTouchedBtnShowOnlineUsers },
                { ui: this._btnSetSound,            callback: this._onTouchedBtnSetSound },
                { ui: this._btnSetOpacity,          callback: this._onTouchedBtnSetOpacity },
                { ui: this._btnSetStageScaler,      callback: this._onTouchedBtnSetStageScaler },
                { ui: this._btnServerStatus,        callback: this._onTouchedBtnServerStatus },
                { ui: this._btnComplaint,           callback: this._onTouchedBtnComplaint },
                { ui: this._btnUnitsInfo,           callback: this._onTouchedBtnUnitsInfo },
                { ui: this._btnChangeLog,           callback: this._onTouchedBtnChangeLog },
                { ui: this._btnGameManagement,      callback: this._onTouchedBtnGameManagement },
                { ui: this._btnMapManagement,       callback: this._onTouchedBtnMapManagement },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._uiRadioLanguage.setData({
                titleTextType   : LangTextType.B0627,
                leftTextType    : LangTextType.B0624,
                leftLangType    : Twns.Types.LanguageType.Chinese,
                rightTextType   : LangTextType.B0625,
                rightLangType   : Twns.Types.LanguageType.English,
                callbackOnLeft  : () => {
                    const languageType = Twns.Types.LanguageType.Chinese;
                    Lang.setLanguageType(languageType);
                    LocalStorage.setLanguageType(languageType);

                    Twns.Notify.dispatch(NotifyType.LanguageChanged);
                },
                callbackOnRight : () => {
                    const languageType = Twns.Types.LanguageType.English;
                    Lang.setLanguageType(languageType);
                    LocalStorage.setLanguageType(languageType);

                    Twns.Notify.dispatch(NotifyType.LanguageChanged);
                },
                checkerForLeftOn: () => {
                    return Lang.getCurrentLanguageType() === Twns.Types.LanguageType.Chinese;
                },
            });
            this._uiRadioTexture.setData({
                titleTextType   : LangTextType.B0628,
                leftTextType    : LangTextType.B0385,
                rightTextType   : LangTextType.B0386,
                callbackOnLeft  : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Twns.Types.UnitAndTileTextureVersion.V0,
                    });
                },
                callbackOnRight : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Twns.Types.UnitAndTileTextureVersion.V1,
                    });
                },
                checkerForLeftOn: () => {
                    return Twns.User.UserModel.getSelfSettingsTextureVersion() === Twns.Types.UnitAndTileTextureVersion.V0;
                },
            });
            this._uiRadioUnitAnimation.setData({
                titleTextType   : LangTextType.B0629,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Twns.Timer.startUnitAnimationTick();
                    LocalStorage.setShowUnitAnimation(true);
                },
                callbackOnRight : () => {
                    Twns.Timer.stopUnitAnimationTick();
                    LocalStorage.setShowUnitAnimation(false);
                },
                checkerForLeftOn: () => {
                    return Twns.Timer.checkIsUnitAnimationTicking();
                },
            });
            this._uiRadioTileAnimation.setData({
                titleTextType   : LangTextType.B0630,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Twns.Timer.startTileAnimationTick();
                    LocalStorage.setShowTileAnimation(true);
                },
                callbackOnRight : () => {
                    Twns.Timer.stopTileAnimationTick();
                    LocalStorage.setShowTileAnimation(false);
                },
                checkerForLeftOn: () => {
                    return Twns.Timer.checkIsTileAnimationTicking();
                },
            });
            this._uiRadioShowGridBorder.setData({
                titleTextType   : LangTextType.B0584,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        isShowGridBorder: true,
                    });
                },
                callbackOnRight : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        isShowGridBorder: false,
                    });
                },
                checkerForLeftOn: () => {
                    return Twns.User.UserModel.getSelfSettingsIsShowGridBorder();
                },
            });
            this._uiRadioAutoScrollMap.setData({
                titleTextType   : LangTextType.B0793,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        isAutoScrollMap: true,
                    });
                },
                callbackOnRight : () => {
                    Twns.User.UserProxy.reqUserSetSettings({
                        isAutoScrollMap: false,
                    });
                },
                checkerForLeftOn: () => {
                    return Twns.User.UserModel.getSelfSettingsIsAutoScrollMap();
                },
            });

            const selfUserId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnOpened_00);
            Twns.User.UserProxy.reqUserGetPublicInfo(selfUserId);

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
        private _onNotifyUserSettingsIsAutoScrollMapChanged(): void {
            this._uiRadioAutoScrollMap.updateView();
        }
        private _onMsgUserGetPublicInfo(): void {
            this._updateView();
        }
        private _onMsgUserSetNickname(): void {
            const selfUserId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetNickname_00);
            Twns.User.UserProxy.reqUserGetPublicInfo(selfUserId);
        }
        private _onMsgUserSetDiscordId(): void {
            const selfUserId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetDiscordId_00);
            Twns.User.UserProxy.reqUserGetPublicInfo(selfUserId);
        }
        private _onTouchedBtnDamageCalculator(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonDamageCalculatorPanel, {
                data    : null,
            });
        }
        private _onTouchedBtnChangeNickname(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserChangeNicknamePanel, void 0);
        }
        private _onTouchedBtnChangePassword(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSetPasswordPanel, void 0);
        }
        private _onTouchedBtnChangeDiscordId(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserChangeDiscordIdPanel, void 0);
        }
        private _onTouchedBtnChangeGameVersion(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChangeVersionPanel, void 0);
        }
        private _onTouchedBtnRankList(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonRankListPanel, void 0);
        }
        private _onTouchedBtnShowOnlineUsers(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserOnlineUsersPanel, void 0);
        }
        private _onTouchedBtnSetSound(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSetSoundPanel, void 0);
        }
        private _onTouchedBtnSetOpacity(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSetOpacityPanel, void 0);
        }
        private _onTouchedBtnSetStageScaler(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSetStageScalePanel, void 0);
        }
        private _onTouchedBtnServerStatus(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonServerStatusPanel, void 0);
        }
        private _onTouchedBtnComplaint(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ChatPanel, { toUserId: CommonConstants.AdminUserId });
        }
        private async _onTouchedBtnUnitsInfo(): Promise<void> {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonDamageChartPanel, {
                gameConfig  : await Twns.Config.ConfigManager.getLatestGameConfig(),
            });
        }
        private _onTouchedBtnChangeLog(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ChangeLogPanel, void 0);
        }
        private _onTouchedBtnGameManagement(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserGameManagementPanel, void 0);
        }
        private _onTouchedBtnMapManagement(): void {
            Twns.PanelHelpers.closeAllPanelsExcept([
                Twns.PanelHelpers.PanelDict.LobbyBackgroundPanel,
            ]);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyBackgroundPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmMainMenuPanel, void 0);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateGroupButtons();
        }

        private async _updateGroupButtons(): Promise<void> {
            const group = this._groupButtons;
            group.removeChildren();
            group.addChild(this._btnChangePassword);
            group.addChild(this._btnChangeNickname);
            group.addChild(this._btnChangeDiscordId);
            group.addChild(this._btnSetSound);
            group.addChild(this._btnSetOpacity);
            group.addChild(this._btnSetStageScaler);
            group.addChild(this._btnRankList);
            group.addChild(this._btnShowOnlineUsers);
            group.addChild(this._btnServerStatus);
            group.addChild(this._btnChangeLog);
            group.addChild(this._btnUnitsInfo);
            group.addChild(this._btnComplaint);
            group.addChild(this._btnChangeGameVersion);
            if (Twns.User.UserModel.getIsSelfAdmin()) {
                group.addChild(this._btnGameManagement);
            }
            if ((Twns.User.UserModel.getIsSelfAdmin()) || (Twns.User.UserModel.getIsSelfMapCommittee())) {
                group.addChild(this._btnMapManagement);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(LangTextType.B0560);
            this._updateBtnChangeNickname();
            this._updateBtnChangePassword();
            this._updateBtnChangeDiscordId();
            this._updateBtnChangeGameVersion();
            this._updateBtnRankList();
            this._updateBtnShowOnlineUsers();
            this._updateBtnSetSound();
            this._updateBtnSetOpacity();
            this._updateBtnSetStageScaler();
            this._updateBtnUnitsInfo();
            this._updateBtnChangeLog();
            this._updateBtnGameManagement();
            this._updateBtnServerStatus();
            this._updateBtnComplaint();
            this._updateBtnMapManagement();
        }

        private _updateBtnChangeNickname(): void {
            this._btnChangeNickname.label = Lang.getText(LangTextType.B0149);
        }
        private _updateBtnChangePassword(): void {
            this._btnChangePassword.label = Lang.getText(LangTextType.B0426);
        }
        private _updateBtnChangeDiscordId(): void {
            this._btnChangeDiscordId.label = Lang.getText(LangTextType.B0150);
        }
        private _updateBtnChangeGameVersion(): void {
            this._btnChangeGameVersion.label = Lang.getText(LangTextType.B0620);
        }
        private _updateBtnRankList(): void {
            this._btnRankList.label = Lang.getText(LangTextType.B0436);
        }
        private _updateBtnShowOnlineUsers(): void {
            this._btnShowOnlineUsers.label = Lang.getText(LangTextType.B0151);
        }
        private _updateBtnSetSound(): void {
            this._btnSetSound.label = Lang.getText(LangTextType.B0540);
        }
        private _updateBtnSetOpacity(): void {
            this._btnSetOpacity.label = Lang.getText(LangTextType.B0827);
        }
        private _updateBtnSetStageScaler(): void {
            this._btnSetStageScaler.label = Lang.getText(LangTextType.B0558);
        }
        private _updateBtnUnitsInfo(): void {
            this._btnUnitsInfo.label = Lang.getText(LangTextType.B0440);
        }
        private _updateBtnChangeLog(): void {
            this._btnChangeLog.label = Lang.getText(LangTextType.B0457);
        }
        private _updateBtnGameManagement(): void {
            this._btnGameManagement.label = Lang.getText(LangTextType.B0878);
        }
        private _updateBtnServerStatus(): void {
            this._btnServerStatus.label = Lang.getText(LangTextType.B0327);
        }
        private _updateBtnComplaint(): void {
            this._btnComplaint.label = Lang.getText(LangTextType.B0453);
        }
        private _updateBtnMapManagement(): void {
            this._btnMapManagement.label = Lang.getText(LangTextType.B0192);
        }
    }
}

// export default TwnsUserSettingsPanel;
