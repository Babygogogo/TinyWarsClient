
namespace TinyWars.Lobby {
    import UserModel    = User.UserModel;
    import Notify       = Utility.Notify;

    export class LobbyTopPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyTopPanel;

        private _group          : eui.Group;

        private _groupUserInfo  : eui.Group;
        private _labelNickname  : GameUi.UiLabel;
        private _labelUserId    : GameUi.UiLabel;

        private _btnSettings    : GameUi.UiButton;

        public static show(): void {
            if (!LobbyTopPanel._instance) {
                LobbyTopPanel._instance = new LobbyTopPanel();
            }
            LobbyTopPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LobbyTopPanel._instance) {
                await LobbyTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogin,                   callback: this._onMsgUserLogin },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgUserSetNickname,             callback: this._onMsgUserSetNickname },
            ]);
            this._setUiListenerArray([
                { ui: this._groupUserInfo,  callback: this._onTouchedGroupUserInfo },
                { ui: this._btnSettings,    callback: this._onTouchedBtnSettings },
            ]);

            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserLogin(e: egret.Event): void {
            this._updateView();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        private _onMsgUserSetNickname(e: egret.Event): void {
            this._updateLabelNickname();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
        }

        private _onTouchedGroupUserInfo(e: egret.Event): void {
            User.UserOnlineUsersPanel.hide();
            Chat.ChatPanel.hide();
            User.UserPanel.show({ userId: UserModel.getSelfUserId() });
        }

        private _onTouchedBtnSettings(e: egret.TouchEvent): void {
            User.UserSettingsPanel.show();
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, top: -40 })
                .to({ alpha: 1, top: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, top: 0 })
                    .to({ alpha: 0, top: -40 }, 200)
                    .call(resolve);
            });
        }

        private _updateView(): void {
            this._updateLabelNickname();
            this._labelUserId.text = `ID: ${UserModel.getSelfUserId()}`;
        }

        private async _updateLabelNickname(): Promise<void> {
            this._labelNickname.text = await UserModel.getSelfNickname();
        }
    }
}
