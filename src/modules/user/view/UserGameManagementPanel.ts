
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

    export type OpenDataForUserGameManagementPanel = void;
    export class UserGameManagementPanel extends TwnsUiPanel.UiPanel<OpenDataForUserGameManagementPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _group!                    : eui.Group;
        private readonly _scroller!                 : eui.Scroller;

        private readonly _groupButtons!             : eui.Group;
        private readonly _btnDeleteAllSpmRank!      : TwnsUiButton.UiButton;
        private readonly _btnSetPrivilege!          : TwnsUiButton.UiButton;
        private readonly _btnMapManagement!         : TwnsUiButton.UiButton;
        private readonly _btnManageBroadcast!       : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._btnDeleteAllSpmRank,        callback: this._onTouchedBtnDeleteAllSpmRank },
                { ui: this._btnSetPrivilege,            callback: this._onTouchedBtnSetPrivilege },
                { ui: this._btnMapManagement,           callback: this._onTouchedBtnMapManagement },
                { ui: this._btnManageBroadcast,         callback: this._onTouchedBtnManageBroadcast },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

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
        private _onTouchedBtnDeleteAllSpmRank(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                title       : Lang.getText(LangTextType.B0879),
                content     : Lang.getText(LangTextType.A0225),
                callback    : () => Gm.GmProxy.reqGmDeleteSpmAllScoreAndReplay(),
            });
        }
        private _onTouchedBtnSetPrivilege(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.UserSetPrivilegePanel, { userId: Helpers.getExisted(User.UserModel.getSelfUserId()) });
        }
        private _onTouchedBtnMapManagement(): void {
            PanelHelpers.closeAllPanelsExcept([
                PanelHelpers.PanelDict.LobbyBackgroundPanel,
            ]);
            PanelHelpers.open(PanelHelpers.PanelDict.LobbyBackgroundPanel, void 0);
            PanelHelpers.open(PanelHelpers.PanelDict.MmMainMenuPanel, void 0);
        }
        private _onTouchedBtnManageBroadcast(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.BroadcastMessageListPanel, void 0);
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

            if (User.UserModel.getIsSelfAdmin()) {
                group.addChild(this._btnSetPrivilege);
                group.addChild(this._btnDeleteAllSpmRank);
                group.addChild(this._btnManageBroadcast);
            }
            if ((User.UserModel.getIsSelfAdmin()) || (User.UserModel.getIsSelfMapCommittee())) {
                group.addChild(this._btnMapManagement);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0878);
            this._btnDeleteAllSpmRank.label = Lang.getText(LangTextType.B0879);
            this._btnSetPrivilege.label     = Lang.getText(LangTextType.B0460);
            this._btnMapManagement.label    = Lang.getText(LangTextType.B0192);
            this._btnManageBroadcast.label  = Lang.getText(LangTextType.B0880);
        }
    }
}

// export default TwnsUserPrivilegedMenuPanel;
