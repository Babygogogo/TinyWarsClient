
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

namespace TwnsLobbyBottomPanel {
    import UserPanel                = TwnsUserPanel.UserPanel;
    import CommonDamageChartPanel   = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import UserOnlineUsersPanel     = TwnsUserOnlineUsersPanel.UserOnlineUsersPanel;
    import MeMapListPanel           = TwnsMeMapListPanel.MeMapListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import Tween                    = egret.Tween;

    // eslint-disable-next-line no-shadow
    export class LobbyBottomPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance        : LobbyBottomPanel | null = null;

        private readonly _groupBottom!  : eui.Group;
        private readonly _btnMyInfo!    : TwnsUiButton.UiButton;
        private readonly _btnChat!      : TwnsUiButton.UiButton;
        private readonly _btnMapEditor! : TwnsUiButton.UiButton;
        private readonly _btnGameData!  : TwnsUiButton.UiButton;

        public static show(): void {
            if (!LobbyBottomPanel._instance) {
                LobbyBottomPanel._instance = new LobbyBottomPanel();
            }
            LobbyBottomPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (LobbyBottomPanel._instance) {
                await LobbyBottomPanel._instance.close();
            }
        }
        public static getInstance(): LobbyBottomPanel | null {
            return LobbyBottomPanel._instance;
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyBottomPanel.exml";
        }

        protected _onOpened(): void {
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

            this._showOpenAnimation();
            this._updateImgChatRed();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnMyInfo(): void {
            UserOnlineUsersPanel.hide();
            TwnsChatPanel.ChatPanel.hide();
            UserPanel.show({
                userId: Helpers.getExisted(UserModel.getSelfUserId()),
            });
        }

        private _onTouchedBtnChat(): void {
            UserOnlineUsersPanel.hide();
            UserPanel.hide();
            if (!TwnsChatPanel.ChatPanel.getIsOpening()) {
                TwnsChatPanel.ChatPanel.show({ toUserId: null });
            } else {
                TwnsChatPanel.ChatPanel.hide();
            }
        }

        private _onTouchedBtnMapEditor(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            MeMapListPanel.show();
        }

        private _onTouchedBtnGameData(): void {
            CommonDamageChartPanel.show();
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

        private _showOpenAnimation(): void {
            const groupBottom = this._groupBottom;
            Tween.removeTweens(groupBottom);
            Tween.get(groupBottom)
                .set({ alpha: 0, bottom: -40 })
                .to({ alpha: 1, bottom: 0 }, 200);

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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const groupBottom = this._groupBottom;
                Tween.removeTweens(groupBottom);
                Tween.get(groupBottom)
                    .set({ alpha: 1, bottom: 0 })
                    .to({ alpha: 0, bottom: -40 }, 200)
                    .call(resolve);
            });
        }
    }
}

// export default TwnsLobbyBottomPanel;
