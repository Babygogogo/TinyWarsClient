
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
                { type: Notify.Type.SLogin,                 callback: this._onNotifySLogin },
                { type: Notify.Type.SLogout,                callback: this._onNotifySLogout },
                { type: Notify.Type.SUserChangeNickname,    callback: this._onNotifySUserChangeNickname },
            ];
            this._uiListeners = [
                { ui: this._btnMyInfo, callback: this._onTouchedBtnMyInfo },
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
            this._updateView();
        }

        private _onTouchedBtnMyInfo(e: egret.Event): void {
            User.UserPanel.show(UserModel.getSelfUserId());
            User.UserOnlineUsersPanel.hide();
        }

        private _updateView(): void {
            const score                 = UserModel.getSelfRankScore();
            this._labelNickname.text    = UserModel.getSelfNickname();
            this._labelRankScore.text   = `${Lang.getText(Lang.Type.B0060)}: ${score}`;
            this._labelRankName.text    = ConfigManager.getRankName(ConfigManager.getNewestConfigVersion(), score);
        }
    }
}
