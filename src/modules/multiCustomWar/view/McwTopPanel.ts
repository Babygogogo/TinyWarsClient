
namespace TinyWars.MultiCustomWar {
    import FloatText    = Utility.FloatText;
    import FlowManager  = Utility.FlowManager;
    import ConfirmPanel = Common.ConfirmPanel;

    export class McwTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwTopPanel;

        private _labelPlayer    : GameUi.UiLabel;
        private _btnFindUnit    : GameUi.UiButton;
        private _btnFindBuilding: GameUi.UiButton;
        private _btnEndTurn     : GameUi.UiButton;
        private _btnMenu        : GameUi.UiButton;

        public static show(): void {
            if (!McwTopPanel._instance) {
                McwTopPanel._instance = new McwTopPanel();
            }
            McwTopPanel._instance.open();
        }

        public static hide(): void {
            if (McwTopPanel._instance) {
                McwTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
            ];
            this._uiListeners = [
                { ui: this._btnFindUnit,        callback: this._onTouchedBtnFindUnit, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._updateView();
        }

        private _onTouchedBtnFindUnit(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnEndTurn(e: egret.TouchEvent): void {

        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            ConfirmPanel.show({
                title   : "返回大厅",
                content : "确定要回到大厅吗？",
                callback: () => FlowManager.gotoLobby(),
            });
        }

        private _updateView(): void {
            this._labelPlayer.text = User.UserModel.getUserNickname();
        }
    }
}
