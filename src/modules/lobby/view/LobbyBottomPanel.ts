
// import ChatModel                    from "../../chat/model/ChatModel";
// import TwnsChatPanel                from "../../chat/view/ChatPanel";
// import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
// import TwnsMeMapListPanel           from "../../mapEditor/view/MeMapListPanel";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import UserModel                    from "../../user/model/UserModel";
// import TwnsUserOnlineUsersPanel     from "../../user/view/UserOnlineUsersPanel";
// import TwnsUserPanel                from "../../user/view/UserPanel";
// import TwnsLobbyTopPanel            from "./LobbyTopPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsLobbyBottomPanel {
    import NotifyType               = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class LobbyBottomPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupBottom!  : eui.Group;
        private readonly _btnMyInfo!    : TwnsUiButton.UiButton;
        private readonly _btnChat!      : TwnsUiButton.UiButton;
        private readonly _btnMapEditor! : TwnsUiButton.UiButton;
        private readonly _btnGameData!  : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnMyInfo,          callback: this._onTouchedBtnMyInfo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnMapEditor,       callback: this._onTouchedBtnMapEditor },
                { ui: this._btnGameData,        callback: this._onTouchedBtnGameData },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: NotifyType.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,              callback: this._onMsgChatAddMessages },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateImgChatRed();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnMyInfo(): void {
            TwnsPanelManager.close(TwnsPanelConfig.Dict.UserOnlineUsersPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.ChatPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserPanel, {
                userId: Helpers.getExisted(UserModel.getSelfUserId()),
            });
        }

        private _onTouchedBtnChat(): void {
            TwnsPanelManager.close(TwnsPanelConfig.Dict.UserOnlineUsersPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.UserPanel);
            if (!TwnsPanelManager.getRunningPanel(TwnsPanelConfig.Dict.ChatPanel)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.ChatPanel, { toUserId: null });
            } else {
                TwnsPanelManager.close(TwnsPanelConfig.Dict.ChatPanel);
            }
        }

        private _onTouchedBtnMapEditor(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeMapListPanel, void 0);
        }

        private _onTouchedBtnGameData(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonDamageChartPanel, void 0);
        }

        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgChatGetAllReadProgressList(): void {
            this._updateImgChatRed();
        }
        private _onMsgChatUpdateReadProgress(): void {
            this._updateImgChatRed();
        }
        private _onMsgChatGetAllMessages(): void {
            this._updateImgChatRed();
        }
        private _onMsgChatAddMessages(): void {
            this._updateImgChatRed();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateImgChatRed(): void {
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupBottom,
                beginProps  : { alpha: 0, bottom: -40 },
                endProps    : { alpha: 1, bottom: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyInfo,
                beginProps  : { alpha: 0, top: 40 },
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnChat,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 66,
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMapEditor,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 132,
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnGameData,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 200,
                endProps    : { alpha: 1, top: 0 },
            });

            await Helpers.wait(200 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupBottom,
                beginProps  : { alpha: 1, bottom: 0 },
                endProps    : { alpha: 0, bottom: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsLobbyBottomPanel;
