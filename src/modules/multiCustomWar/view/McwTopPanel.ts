
namespace TinyWars.MultiCustomWar {
    import ConfirmPanel     = Common.ConfirmPanel;
    import FloatText        = Utility.FloatText;
    import FlowManager      = Utility.FlowManager;
    import McwWarManager    = Utility.McwWarManager;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class McwTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwTopPanel;

        private _labelPlayer    : GameUi.UiLabel;
        private _labelFund      : GameUi.UiLabel;
        private _labelEnergy    : GameUi.UiLabel;
        private _btnFindUnit    : GameUi.UiButton;
        private _btnFindBuilding: GameUi.UiButton;
        private _btnEndTurn     : GameUi.UiButton;
        private _btnMenu        : GameUi.UiButton;

        private _war    : McwWar;

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
                { type: Notify.Type.McwTurnPhaseCodeChanged,        callback: this._onNotifyMcwTurnPhaseCodeChanged },
                { type: Notify.Type.McwPlayerFundChanged,           callback: this._onNotifyMcwPlayerFundChanged },
                { type: Notify.Type.McwPlayerIndexInTurnChanged,    callback: this._onNotifyMcwPlayerIndexInTurnChanged },
                { type: Notify.Type.McwPlayerEnergyChanged,         callback: this._onNotifyMcwPlayerEnergyChanged },
            ];
            this._uiListeners = [
                { ui: this._btnFindUnit,        callback: this._onTouchedBtnFindUnit, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = McwWarManager.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
        }
        private _onNotifyMcwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyMcwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwPlayerEnergyChanged(e: egret.Event): void {
            this._updateLabelEnergy();
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelEnergy();
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
        }

        private _updateLabelPlayer(): void {
            const player            = this._war.getPlayerManager().getPlayerInTurn();
            this._labelPlayer.text  = `${Lang.getText(Lang.Type.B0031)}:${player.getNickname()} (${Helpers.getColorTextForPlayerIndex(player.getPlayerIndex())})`;
        }

        private _updateLabelFund(): void {
            const war               = this._war;
            const playerManager     = war.getPlayerManager();
            const playerInTurn      = playerManager.getPlayerInTurn();
            const playerLoggedIn    = playerManager.getPlayerLoggedIn();
            this._labelFund.text    = (war.getFogMap().checkHasFogCurrently()) && (playerInTurn.getTeamIndex() !== playerLoggedIn.getTeamIndex())
                ? `${Lang.getText(Lang.Type.B0032)}: ????`
                : `${Lang.getText(Lang.Type.B0032)}: ${playerInTurn.getFund()}`;
        }

        private _updateLabelEnergy(): void {
            // TODO
            this._labelEnergy.visible = false;
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnFindUnit(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnFindUnit.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }
    }
}
