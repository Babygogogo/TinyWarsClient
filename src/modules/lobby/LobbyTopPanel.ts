
namespace Lobby {
    export class LobbyTopPanel extends GameUi.UiPanel {
        protected readonly _layerType   = Utility.Types.LayerType.Notify;
        protected readonly _isExclusive = true;

        private static _instance: LobbyTopPanel;

        public static open(): void {
            if (!LobbyTopPanel._instance) {
                LobbyTopPanel._instance = new LobbyTopPanel();
            }
            LobbyTopPanel._instance.open();
        }

        public static close(): void {
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
                { name: Utility.Notify.Type.SLogout, callback: this._onNotifySLogout },
            ];
        }

        private _onNotifySLogout(e: egret.Event): void {
            LobbyTopPanel.close();
        }
    }
}
