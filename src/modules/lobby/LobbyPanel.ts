
namespace Lobby {
    export class LobbyPanel extends GameUi.UiPanel {
        protected readonly _layerType = Utility.Types.LayerType.Scene;
        protected readonly _isAlone   = true;

        private static _instance: LobbyPanel;

        private _group1: eui.Group;
        private _group2: eui.Group;
        private _group3: eui.Group;
        private _group4: eui.Group;

        public static open(): void {
            if (!LobbyPanel._instance) {
                LobbyPanel._instance = new LobbyPanel();
            }
            LobbyPanel._instance.open();
        }

        public static close(): void {
            if (LobbyPanel._instance) {
                LobbyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this, callback: this._onResize, eventType: egret.Event.RESIZE },
            ];
            this._notifyListeners = [
                { name: Utility.Notify.Type.SLogout, callback: this._onNotifySLogout },
            ];
            this.addEventListener(egret.Event.RESIZE, this._onResize, this);
        }

        private _onResize(e: egret.Event): void {
            this._group1.height = (this.height - 40 - 90) / 2;
            this._group2.height = (this.height - 40 - 90) / 2;
            this._group3.height = (this.height - 40 - 90) / 2;
            this._group4.height = (this.height - 40 - 90) / 2;
        }

        private _onNotifySLogout(e: egret.Event): void {
            LobbyPanel.close();
        }
    }
}
