
namespace lobby {
    export class LobbyPanel extends GameUi.UiPanel {
        protected readonly _layerType = Types.LayerType.Scene;
        protected readonly _isAlone   = true;

        private static _instance: LobbyPanel;

        private _imgBg: GameUi.UiImage;
        private _group1: eui.Group;
        private _group2: eui.Group;
        private _group3: eui.Group;
        private _group4: eui.Group;

        public static create(): void {
            egret.assert(!LobbyPanel._instance);
            LobbyPanel._instance = new LobbyPanel();
            LobbyPanel._instance.open();
        }

        public static destroy(): void {
            LobbyPanel._instance.close();
            delete LobbyPanel._instance;
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this,        callback: this._onResize, eventType: egret.Event.RESIZE },
                { ui: this._imgBg, callback: () => Utility.Logger.log("asdf") },
            ];
            this.addEventListener(egret.Event.RESIZE, this._onResize, this);
        }

        private _onResize(e: egret.Event): void {
            this._group1.height = (this.height - 40 - 90) / 2;
            this._group2.height = (this.height - 40 - 90) / 2;
            this._group3.height = (this.height - 40 - 90) / 2;
            this._group4.height = (this.height - 40 - 90) / 2;
        }
    }
}
