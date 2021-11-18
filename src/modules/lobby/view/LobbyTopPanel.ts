
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import UserModel                from "../../user/model/UserModel";
// import TwnsUserOnlineUsersPanel from "../../user/view/UserOnlineUsersPanel";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsLobbyTopPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class LobbyTopPanel extends TwnsUiPanel.UiPanel<OpenData> {
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
            TwnsPanelManager.close(TwnsPanelConfig.Dict.UserOnlineUsersPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.ChatPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserPanel, {
                userId: Helpers.getExisted(UserModel.getSelfUserId()),
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, top: -40 },
                endProps    : { alpha: 1, top: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, top: 0 },
                endProps    : { alpha: 0, top: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateView(): void {
            this._updateLabelNickname();
            this._updateImgAvatar();
            this._labelUserId.text = `ID: ${UserModel.getSelfUserId()}`;
        }

        private _updateLabelNickname(): void {
            this._labelNickname.text = UserModel.getSelfNickname() ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateImgAvatar(): void {
            this._imgAvatar.source = ConfigManager.getUserAvatarImageSource(UserModel.getSelfAvatarId() ?? 1);
        }
    }
}

// export default TwnsLobbyTopPanel;
