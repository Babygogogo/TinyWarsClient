
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
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
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
namespace TwnsUserSettingsPanel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;

    export type OpenData = void;
    export class UserSettingsPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _group!                    : eui.Group;
        private readonly _scroller!                 : eui.Scroller;

        private readonly _uiRadioLanguage!          : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioTexture!           : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioUnitAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioTileAnimation!     : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioShowGridBorder!    : TwnsUiRadioButton.UiRadioButton;
        private readonly _uiRadioUnitOpacity!       : TwnsUiRadioButton.UiRadioButton;

        private readonly _groupButtons!             : eui.Group;
        private readonly _btnChangeNickname!        : TwnsUiButton.UiButton;
        private readonly _btnChangePassword!        : TwnsUiButton.UiButton;
        private readonly _btnChangeDiscordId!       : TwnsUiButton.UiButton;
        private readonly _btnChangeGameVersion!     : TwnsUiButton.UiButton;
        private readonly _btnRankList!              : TwnsUiButton.UiButton;
        private readonly _btnShowOnlineUsers!       : TwnsUiButton.UiButton;
        private readonly _btnSetSound!              : TwnsUiButton.UiButton;
        private readonly _btnSetStageScaler!        : TwnsUiButton.UiButton;
        private readonly _btnServerStatus!          : TwnsUiButton.UiButton;
        private readonly _btnComplaint!             : TwnsUiButton.UiButton;
        private readonly _btnUnitsInfo!             : TwnsUiButton.UiButton;
        private readonly _btnChangeLog!             : TwnsUiButton.UiButton;
        private readonly _btnSetPrivilege!          : TwnsUiButton.UiButton;
        private readonly _btnMapManagement!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyUserSettingsIsShowGridBorderChanged },
                { type: NotifyType.UserSettingsUnitOpacityChanged,      callback: this._onNotifyUserSettingsUnitOpacityChanged },
                { type: NotifyType.MsgUserGetPublicInfo,                callback: this._onMsgUserGetPublicInfo },
                { type: NotifyType.MsgUserSetNickname,                  callback: this._onMsgUserSetNickname },
                { type: NotifyType.MsgUserSetDiscordId,                 callback: this._onMsgUserSetDiscordId },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._btnChangeNickname,      callback: this._onTouchedBtnChangeNickname },
                { ui: this._btnChangePassword,      callback: this._onTouchedBtnChangePassword },
                { ui: this._btnChangeDiscordId,     callback: this._onTouchedBtnChangeDiscordId },
                { ui: this._btnChangeGameVersion,   callback: this._onTouchedBtnChangeGameVersion },
                { ui: this._btnRankList,            callback: this._onTouchedBtnRankList },
                { ui: this._btnShowOnlineUsers,     callback: this._onTouchedBtnShowOnlineUsers },
                { ui: this._btnSetSound,            callback: this._onTouchedBtnSetSound },
                { ui: this._btnSetStageScaler,      callback: this._onTouchedBtnSetStageScaler },
                { ui: this._btnServerStatus,        callback: this._onTouchedBtnServerStatus },
                { ui: this._btnComplaint,           callback: this._onTouchedBtnComplaint },
                { ui: this._btnUnitsInfo,           callback: this._onTouchedBtnUnitsInfo },
                { ui: this._btnChangeLog,           callback: this._onTouchedBtnChangeLog },
                { ui: this._btnSetPrivilege,        callback: this._onTouchedBtnSetPrivilege },
                { ui: this._btnMapManagement,       callback: this._onTouchedBtnMapManagement },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._uiRadioLanguage.setData({
                titleTextType   : LangTextType.B0627,
                leftTextType    : LangTextType.B0624,
                leftLangType    : Types.LanguageType.Chinese,
                rightTextType   : LangTextType.B0625,
                rightLangType   : Types.LanguageType.English,
                callbackOnLeft  : () => {
                    const languageType = Types.LanguageType.Chinese;
                    Lang.setLanguageType(languageType);
                    LocalStorage.setLanguageType(languageType);

                    Notify.dispatch(NotifyType.LanguageChanged);
                },
                callbackOnRight : () => {
                    const languageType = Types.LanguageType.English;
                    Lang.setLanguageType(languageType);
                    LocalStorage.setLanguageType(languageType);

                    Notify.dispatch(NotifyType.LanguageChanged);
                },
                checkerForLeftOn: () => {
                    return Lang.getCurrentLanguageType() === Types.LanguageType.Chinese;
                },
            });
            this._uiRadioTexture.setData({
                titleTextType   : LangTextType.B0628,
                leftTextType    : LangTextType.B0385,
                rightTextType   : LangTextType.B0386,
                callbackOnLeft  : () => {
                    UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V0,
                    });
                },
                callbackOnRight : () => {
                    UserProxy.reqUserSetSettings({
                        unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V1,
                    });
                },
                checkerForLeftOn: () => {
                    return UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0;
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
            this._uiRadioShowGridBorder.setData({
                titleTextType   : LangTextType.B0584,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    UserProxy.reqUserSetSettings({
                        isShowGridBorder: true,
                    });
                },
                callbackOnRight : () => {
                    UserProxy.reqUserSetSettings({
                        isShowGridBorder: false,
                    });
                },
                checkerForLeftOn: () => {
                    return UserModel.getSelfSettingsIsShowGridBorder();
                },
            });
            this._uiRadioUnitOpacity.setData({
                titleTextType   : LangTextType.B0356,
                leftTextType    : LangTextType.B0561,
                rightTextType   : LangTextType.B0562,
                callbackOnLeft  : () => {
                    UserProxy.reqUserSetSettings({
                        unitOpacity : 0,
                    });
                },
                callbackOnRight : () => {
                    UserProxy.reqUserSetSettings({
                        unitOpacity : 100,
                    });
                },
                checkerForLeftOn: () => {
                    return UserModel.getSelfSettingsUnitOpacity() != 100;
                },
            });

            const selfUserId = Helpers.getExisted(UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnOpened_00);
            UserProxy.reqUserGetPublicInfo(selfUserId);

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
        private _onNotifyUserSettingsUnitOpacityChanged(): void {
            this._uiRadioUnitOpacity.updateView();
        }
        private _onMsgUserGetPublicInfo(): void {
            this._updateView();
        }
        private _onMsgUserSetNickname(): void {
            const selfUserId = Helpers.getExisted(UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetNickname_00);
            UserProxy.reqUserGetPublicInfo(selfUserId);
        }
        private _onMsgUserSetDiscordId(): void {
            const selfUserId = Helpers.getExisted(UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetDiscordId_00);
            UserProxy.reqUserGetPublicInfo(selfUserId);
        }
        private _onTouchedBtnChangeNickname(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserChangeNicknamePanel, void 0);
        }
        private _onTouchedBtnChangePassword(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSetPasswordPanel, void 0);
        }
        private _onTouchedBtnChangeDiscordId(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserChangeDiscordIdPanel, void 0);
        }
        private _onTouchedBtnChangeGameVersion(): void {
            TwnsCommonChangeVersionPanel.CommonChangeVersionPanel.show();
        }
        private _onTouchedBtnRankList(): void {
            TwnsCommonRankListPanel.CommonRankListPanel.show();
        }
        private _onTouchedBtnShowOnlineUsers(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserOnlineUsersPanel, void 0);
        }
        private _onTouchedBtnSetSound(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSetSoundPanel, void 0);
        }
        private _onTouchedBtnSetStageScaler(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSetStageScalePanel, void 0);
        }
        private _onTouchedBtnServerStatus(): void {
            TwnsCommonServerStatusPanel.CommonServerStatusPanel.show();
        }
        private _onTouchedBtnComplaint(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.ChatPanel, { toUserId: CommonConstants.AdminUserId });
        }
        private _onTouchedBtnUnitsInfo(): void {
            TwnsCommonDamageChartPanel.CommonDamageChartPanel.show();
        }
        private _onTouchedBtnChangeLog(): void {
            TwnsChangeLogPanel.ChangeLogPanel.show();
        }
        private _onTouchedBtnSetPrivilege(): void {
            const selfUserId = Helpers.getExisted(UserModel.getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnTouchedBtnSetPrivilege_00);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSetPrivilegePanel, { userId: selfUserId });
        }
        private _onTouchedBtnMapManagement(): void {
            StageManager.closeAllPanels();
            TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
            TwnsMmMainMenuPanel.MmMainMenuPanel.show();
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
            group.addChild(this._btnChangePassword);
            group.addChild(this._btnChangeNickname);
            group.addChild(this._btnChangeDiscordId);
            group.addChild(this._btnChangeGameVersion);
            group.addChild(this._btnSetSound);
            group.addChild(this._btnSetStageScaler);
            group.addChild(this._btnRankList);
            group.addChild(this._btnShowOnlineUsers);
            group.addChild(this._btnServerStatus);
            group.addChild(this._btnChangeLog);
            group.addChild(this._btnUnitsInfo);
            group.addChild(this._btnComplaint);
            if (UserModel.getIsSelfAdmin()) {
                group.addChild(this._btnSetPrivilege);
            }
            if ((UserModel.getIsSelfAdmin()) || (UserModel.getIsSelfMapCommittee())) {
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
            this._updateBtnSetStageScaler();
            this._updateBtnUnitsInfo();
            this._updateBtnChangeLog();
            this._updateBtnSetPrivilege();
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
        private _updateBtnSetStageScaler(): void {
            this._btnSetStageScaler.label = Lang.getText(LangTextType.B0558);
        }
        private _updateBtnUnitsInfo(): void {
            this._btnUnitsInfo.label = Lang.getText(LangTextType.B0440);
        }
        private _updateBtnChangeLog(): void {
            this._btnChangeLog.label = Lang.getText(LangTextType.B0457);
        }
        private _updateBtnSetPrivilege(): void {
            this._btnSetPrivilege.label = Lang.getText(LangTextType.B0460);
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
