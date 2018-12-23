
namespace TinyWars.Lobby {
    export class LobbyTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LobbyTopPanel;

        private _labelNickname: GameUi.UiLabel;

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
                { type: Utility.Notify.Type.SLogin,  callback: this._onNotifySLogin },
                { type: Utility.Notify.Type.SLogout, callback: this._onNotifySLogout },
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

        private _updateView(): void {
            this._labelNickname.text = User.UserModel.getUserNickname();
        }
    }
}
