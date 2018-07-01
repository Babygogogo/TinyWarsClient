
namespace lobby {
    import Comp = GameUi.Component;

    export class LobbyPanel extends Comp.UiPanel {
        protected readonly _layerType = GameUi.LayerType.Scene;
        protected readonly _isAlone   = true;

        private static _instance: LobbyPanel;

        private _imgBg: Comp.UiImage;

        public static create(): void {
            egret.assert(!LobbyPanel._instance);
            LobbyPanel._instance = new LobbyPanel;
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
                {ui: this._imgBg, callback: () => Utility.Logger.log("asdf")},
            ];
        }
    }
}
