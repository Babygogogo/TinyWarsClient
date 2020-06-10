
namespace TinyWars.Lobby {
    import UserModel    = User.UserModel;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;

    export class LobbyTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LobbyTopPanel;

        private _labelNickname  : GameUi.UiLabel;
        private _labelRankScore : GameUi.UiLabel;
        private _labelRankName  : GameUi.UiLabel;
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
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SLogin,                         callback: this._onNotifySLogin },
                { type: Notify.Type.SLogout,                        callback: this._onNotifySLogout },
                { type: Notify.Type.SUserChangeNickname,            callback: this._onNotifySUserChangeNickname },
                { type: Notify.Type.SChatGetAllReadProgressList,    callback: this._onNotifyChatGetAllReadProgressList },
                { type: Notify.Type.SChatUpdateReadProgress,        callback: this._onNotifyChatUpdateReadProgress },
                { type: Notify.Type.SChatGetAllMessages,            callback: this._onNotifyChatGetAllMessages },
                { type: Notify.Type.SChatAddMessage,                callback: this._onNotifyChatAddMessage },
            ];
            this._uiListeners = [
                { ui: this._btnMyInfo,  callback: this._onTouchedBtnMyInfo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
            ];
        }

        protected _onOpened(): void {
            this._updateView();
        }

        private _onNotifySLogin(e: egret.Event): void {
            this._updateView();
        }

        private _onNotifySLogout(e: egret.Event): void {
            LobbyTopPanel.hide();
        }

        private _onNotifySUserChangeNickname(e: egret.Event): void {
            this._updateLabelNickname();
        }

        private _onNotifyChatGetAllReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatAddMessage(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
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

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelNickname();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            const score                 = UserModel.getSelfRankScore();
            this._labelRankScore.text   = `${Lang.getText(Lang.Type.B0060)}: ${score}`;
            this._labelRankName.text    = Utility.ConfigManager.getRankName(Utility.ConfigManager.getNewestConfigVersion(), score);
        }

        private _updateLabelNickname(): void {
            this._labelNickname.text    = UserModel.getSelfNickname();
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(Chat.ChatModel.checkHasUnreadMessage());
        }
    }
}
