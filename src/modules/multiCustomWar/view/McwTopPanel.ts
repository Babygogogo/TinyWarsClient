
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

        private _labelPlayer        : GameUi.UiLabel;
        private _labelFund          : GameUi.UiLabel;
        private _labelCo            : GameUi.UiLabel;
        private _labelCurrEnergy    : GameUi.UiLabel;
        private _labelPowerEnergy   : GameUi.UiLabel;
        private _labelZoneEnergy    : GameUi.UiLabel;
        private _btnUnitList        : GameUi.UiButton;
        private _btnFindBuilding    : GameUi.UiButton;
        private _btnEndTurn         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;
        private _btnMenu            : GameUi.UiButton;

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
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyMcwCoUsingSkillChanged },
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
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyMcwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnUnitList();
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getField().getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();
                McwUnitListPanel.show();
            }
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            const war           = this._war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = this._getIdleBuildingGridIndex();
                if (!gridIndex) {
                    FloatText.show(Lang.getText(Lang.Type.A0077));
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().moveGridToCenter(gridIndex);
                }
            }
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
            McwCoListPanel.hide();
            McwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCoAndEnergy();
            this._updateBtnEndTurn();
            this._updateBtnUnitList();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
            this._updateBtnMenu();
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
            if ((war.getFogMap().checkHasFogCurrently())                                                                        &&
                (!war.getPlayerManager().getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(playerInTurn.getTeamIndex()))
            ) {
                this._labelFund.text = `${Lang.getText(Lang.Type.B0032)}: ????`;
            } else {
                this._labelFund.text = `${Lang.getText(Lang.Type.B0032)}: ${playerInTurn.getFund()}`;
            }
        }

        private _updateLabelCoAndEnergy(): void {
            const war = this._war;
            if ((war) && (war.getIsRunning())) {
                const player        = war.getPlayerInTurn();
                const coId          = player.getCoId();
                this._labelCo.text  = `CO: ${coId == null ? "----" : ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

                const skillType = player.getCoUsingSkillType();
                if (skillType === Types.CoSkillType.Power) {
                    this._labelCurrEnergy.text = "COP";
                } else if (skillType === Types.CoSkillType.SuperPower) {
                    this._labelCurrEnergy.text = "SCOP";
                } else {
                    this._labelCurrEnergy.text = `${player.getCoUnitId() != null ? player.getCoCurrentEnergy() : `--`}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.label      = Lang.getText(Lang.Type.B0036);
            this._btnEndTurn.visible    = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnUnitList(): void {
            const war                   = this._war;
            const actionPlanner         = war.getActionPlanner();
            this._btnUnitList.label     = Lang.getText(Lang.Type.B0152);
            this._btnUnitList.visible   = (!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.label     = Lang.getText(Lang.Type.B0153);
            this._btnFindBuilding.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._war;
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._btnCancel.visible = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting());
        }

        private _updateBtnMenu(): void {
            this._btnMenu.label = Lang.getText(Lang.Type.B0155);
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
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getState() === Types.UnitActionState.Idle)) {
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

        private _getIdleBuildingGridIndex(): Types.GridIndex | null {
            const war                       = this._war;
            const field                     = war.getField();
            const tileMap                   = field.getTileMap();
            const unitMap                   = field.getUnitMap();
            const { x: currX, y: currY }    = field.getCursor().getGridIndex();
            const { width, height}          = tileMap.getMapSize();
            const playerIndex               = war.getPlayerIndexInTurn();
            const checkIsIdle               = (gridIndex: Types.GridIndex): boolean => {
                const tile = tileMap.getTile(gridIndex);
                if ((tile.getPlayerIndex() === playerIndex) && (tile.getProduceUnitCategory() != null)) {
                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if ((!unit)                                                                                     ||
                        ((unit.getState() === Types.UnitActionState.Idle) && (unit.getPlayerIndex() === playerIndex))
                    ) {
                        return true;
                    }
                }
                return false;
            }

            for (let y = currY; y < height; ++y) {
                for (let x = 0; x < width; ++x) {
                    if ((y > currY) || (x > currX)) {
                        const gridIndex = { x, y };
                        if (checkIsIdle(gridIndex)) {
                            return gridIndex;
                        }
                    }
                }
            }

            for (let y = 0; y <= currY; ++y) {
                for (let x = 0; x < width; ++x) {
                    if ((y < currY) || (x <= currX)) {
                        const gridIndex = { x, y };
                        if (checkIsIdle(gridIndex)) {
                            return gridIndex;
                        }
                    }
                }
            }

            return null;
        }
    }
}
