
namespace TinyWars.Replay {
    import ConfirmPanel     = Common.ConfirmPanel;
    import FloatText        = Utility.FloatText;
    import FlowManager      = Utility.FlowManager;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class ReplayTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayTopPanel;

        private _labelPlayer    : GameUi.UiLabel;
        private _labelFund      : GameUi.UiLabel;
        private _labelEnergy    : GameUi.UiLabel;
        private _btnUnitList    : GameUi.UiButton;
        private _btnFindBuilding: GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;
        private _btnPlay        : GameUi.UiButton;
        private _btnMenu        : GameUi.UiButton;

        private _war    : ReplayWar;

        public static show(): void {
            if (!ReplayTopPanel._instance) {
                ReplayTopPanel._instance = new ReplayTopPanel();
            }
            ReplayTopPanel._instance.open();
        }

        public static hide(): void {
            if (ReplayTopPanel._instance) {
                ReplayTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replay/ReplayTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.McwTurnPhaseCodeChanged,        callback: this._onNotifyMcwTurnPhaseCodeChanged },
                { type: Notify.Type.McwPlayerFundChanged,           callback: this._onNotifyMcwPlayerFundChanged },
                { type: Notify.Type.McwPlayerIndexInTurnChanged,    callback: this._onNotifyMcwPlayerIndexInTurnChanged },
                { type: Notify.Type.McwPlayerEnergyChanged,         callback: this._onNotifyMcwPlayerEnergyChanged },
                { type: Notify.Type.McwActionPlannerStateChanged,   callback: this._onNotifyMcwActionPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
            ];
        }

        protected _onOpened(): void {
            this._war = ReplayModel.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
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
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnCancel();
        }

        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
            ReplayUnitListPanel.show();
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            ReplayWarMenuPanel.show();
        }
        private _onTouchedBtnPlay(e: egret.TouchEvent): void {
            this._war.executeNextAction();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelEnergy();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }

        private _updateLabelPlayer(): void {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${Lang.getText(Lang.Type.B0031)}:${player.getNickname()} (${Helpers.getColorTextForPlayerIndex(player.getPlayerIndex())})`;
        }

        private _updateLabelFund(): void {
            const war               = this._war;
            const playerInTurn      = war.getPlayerInTurn();
            this._labelFund.text    = `${Lang.getText(Lang.Type.B0032)}: ${playerInTurn.getFund()}`;
        }

        private _updateLabelEnergy(): void {
            // TODO
            this._labelEnergy.visible = false;
        }

        private _updateBtnFindUnit(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnUnitList.visible   = turnManager.getPhaseCode() === Types.TurnPhaseCode.Main;
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = turnManager.getPhaseCode() === Types.TurnPhaseCode.Main;
        }

        private _updateBtnCancel(): void {
            const war               = this._war;
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.visible = (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting());
        }
    }
}
