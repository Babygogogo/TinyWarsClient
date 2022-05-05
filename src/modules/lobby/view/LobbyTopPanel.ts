
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import UserModel                from "../../user/model/UserModel";
// import TwnsUserOnlineUsersPanel from "../../user/view/UserOnlineUsersPanel";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lobby {
    import NotifyType           = Twns.Notify.NotifyType;

    export type OpenDataForLobbyTopPanel = void;
    export class LobbyTopPanel extends TwnsUiPanel.UiPanel<OpenDataForLobbyTopPanel> {
        private readonly _group!            : eui.Group;

        private readonly _groupUserInfo!    : eui.Group;
        private readonly _imgAvatar!        : TwnsUiImage.UiImage;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _labelUserId!      : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogin,            callback: this._onMsgUserLogin },
                { type: NotifyType.MsgUserLogout,           callback: this._onMsgUserLogout },
                { type: NotifyType.MsgUserSetNickname,      callback: this._onMsgUserSetNickname },
                { type: NotifyType.MsgUserSetAvatarId,      callback: this._onNotifyMsgUserSetAvatarId },
            ]);
            this._setUiListenerArray([
                { ui: this._groupUserInfo,  callback: this._onTouchedGroupUserInfo },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserLogin(): void {
            this._updateView();
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onMsgUserSetNickname(): void {
            this._updateLabelNickname();
        }

        private _onNotifyMsgUserSetAvatarId(): void {
            this._updateImgAvatar();
        }

        private _onNotifyLanguageChanged(): void {
            // nothing to do
        }

        private _onTouchedGroupUserInfo(): void {
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.UserOnlineUsersPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.ChatPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, {
                userId: Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId()),
            });
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, top: -40 },
                endProps    : { alpha: 1, top: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, top: 0 },
                endProps    : { alpha: 0, top: -40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }

        private _updateView(): void {
            this._updateLabelNickname();
            this._updateImgAvatar();
            this._labelUserId.text = `ID: ${Twns.User.UserModel.getSelfUserId()}`;
        }

        private _updateLabelNickname(): void {
            this._labelNickname.text = Twns.User.UserModel.getSelfNickname() ?? Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _updateImgAvatar(): void {
            this._imgAvatar.source = Twns.Config.ConfigManager.getUserAvatarImageSource(Twns.User.UserModel.getSelfAvatarId() ?? 1);
        }
    }
}

// export default TwnsLobbyTopPanel;
