
namespace TinyWars.Lobby {
    import UserModel    = User.UserModel;
    import Notify       = Utility.Notify;

    export class LobbyTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyTopPanel;

        private _group          : eui.Group;
        private _labelNickname  : GameUi.UiLabel;
        private _btnMyInfo      : GameUi.UiButton;
        private _btnChat        : GameUi.UiButton;

        public static show(): void {
            if (!LobbyTopPanel._instance) {
                LobbyTopPanel._instance = new LobbyTopPanel();
            }
            LobbyTopPanel._instance.open();
        }

        public static hide(): void {
            if (LobbyTopPanel._instance) {
                LobbyTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogin,                   callback: this._onMsgUserLogin },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgUserSetNickname,             callback: this._onMsgUserSetNickname },
                { type: Notify.Type.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: Notify.Type.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: Notify.Type.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: Notify.Type.MsgChatAddMessage,              callback: this._onMsgChatAddMessages },
            ]);
            this._setUiListenerArray([
                { ui: this._btnMyInfo,  callback: this._onTouchedBtnMyInfo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
            ]);
        }

        protected _onOpened(): void {
            this._showOpenAnimation();

            this._updateView();
        }

        private _onMsgUserLogin(e: egret.Event): void {
            this._updateView();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            LobbyTopPanel.hide();
        }

        private _onMsgUserSetNickname(e: egret.Event): void {
            this._updateLabelNickname();
        }

        private _onMsgChatGetAllReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatAddMessages(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
        }

        private _onTouchedBtnMyInfo(e: egret.Event): void {
            User.UserOnlineUsersPanel.hide();
            Chat.ChatPanel.hide();
            User.UserPanel.show(UserModel.getSelfUserId());
        }

        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            User.UserOnlineUsersPanel.hide();
            User.UserPanel.hide();
            if (!Chat.ChatPanel.getIsOpening()) {
                Chat.ChatPanel.show({ toUserId: null });
            }
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, top: -40 })
                .to({ alpha: 1, top: 0 }, 200);
        }

        private _updateView(): void {
            this._updateLabelNickname();
            this._updateBtnChat();
        }

        private async _updateLabelNickname(): Promise<void> {
            this._labelNickname.text    = await UserModel.getSelfNickname();
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(Chat.ChatModel.checkHasUnreadMessage());
        }
    }
}
