
namespace TinyWars.MultiCustomWar {
    import ConfirmPanel     = Common.ConfirmPanel;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class McwTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwTopPanel;

        private _labelPlayer    : GameUi.UiLabel;
        private _labelFund      : GameUi.UiLabel;
        private _labelCo        : GameUi.UiLabel;
        private _btnUnitList    : GameUi.UiButton;
        private _btnFindBuilding: GameUi.UiButton;
        private _btnEndTurn     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;
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
                { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyMcwTurnPhaseCodeChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyMcwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyMcwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyMcwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillChanged,          callback: this._onNotifyMcwCoUsingSkillChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwActionPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = McwModel.getWar();
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
            this._updateBtnCancel();
        }
        private _onNotifyMcwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyMcwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwCoEnergyChanged(e: egret.Event): void {
            this._updateLabelCo();
        }
        private _onNotifyMcwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCo();
        }
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
            McwUnitListPanel.show();
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnEndTurn(e: egret.TouchEvent): void {
            const war = this._war;
            if ((war.getRemainingVotesForDraw()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(Lang.Type.A0034));
            } else {
                ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => (this._war.getActionPlanner() as McwActionPlanner).setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            McwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCo();
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }

        private _updateLabelPlayer(): void {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${Lang.getText(Lang.Type.B0031)}:${player.getNickname()} (${Helpers.getColorTextForPlayerIndex(player.getPlayerIndex())})`;
            this._labelPlayer.textColor = player === war.getPlayerLoggedIn() ? 0x00FF00 : 0xFFFFFF;
        }

        private _updateLabelFund(): void {
            const war               = this._war;
            const playerInTurn      = war.getPlayerInTurn();
            this._labelFund.text    = (war.getFogMap().checkHasFogCurrently()) && (playerInTurn.getTeamIndex() !== war.getPlayerLoggedIn().getTeamIndex())
                ? `${Lang.getText(Lang.Type.B0032)}: ????`
                : `${Lang.getText(Lang.Type.B0032)}: ${playerInTurn.getFund()}`;
        }

        private _updateLabelCo(): void {
            const war = this._war;
            if ((war) && (war.getIsRunning())) {
                const player    = war.getPlayerInTurn();
                const coId      = player.getCoId();
                if (coId == null) {
                    this._labelCo.text = `CO:----`;
                } else {
                    this._labelCo.text = `CO:${ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`
                        + ` ${player.getCoIsUsingSkill() ? `POWER` : (player.getCoUnitId() != null ? player.getCoCurrentEnergy() : "--")} / ${player.getCoMiddleEnergy() || `--`} / ${player.getCoMaxEnergy() || `--`}`;
                }
            }
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnFindUnit(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnUnitList.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._war;
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.visible = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getHintForEndTurn(): string {
            const war           = this._war;
            const playerIndex   = war.getPlayerIndexLoggedIn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

            let idleUnitsCount = 0;
            unitMap.forEachUnitOnMap(unit => {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getState() === Types.UnitState.Idle)) {
                    ++idleUnitsCount;
                }
            });
            (idleUnitsCount) && (hints.push(Lang.getFormatedText(Lang.Type.F0006, idleUnitsCount)));

            let idleBuildingsCount = 0;
            war.getTileMap().forEachTile(tile => {
                if ((tile.getPlayerIndex() === playerIndex) && (tile.checkIsUnitProducer()) && (!unitMap.getUnitOnMap(tile.getGridIndex()))) {
                    ++idleBuildingsCount;
                }
            });
            (idleBuildingsCount) && (hints.push(Lang.getFormatedText(Lang.Type.F0007, idleBuildingsCount)));

            hints.push(Lang.getText(Lang.Type.A0024));
            return hints.join(`\n`);
        }
    }
}
