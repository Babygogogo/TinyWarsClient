
import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
import TwnsBwProduceUnitPanel   from "../../baseWar/view/BwProduceUnitPanel";
import TwnsBwUnitActionsPanel   from "../../baseWar/view/BwUnitActionsPanel";
import FloatText                from "../../tools/helpers/FloatText";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";

namespace TwnsRwActionPlanner {
    import BwProduceUnitPanel   = TwnsBwProduceUnitPanel.BwProduceUnitPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;

    export class RwActionPlanner extends TwnsBwActionPlanner.BwActionPlanner {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._setState(State.ChoosingProductionTarget);
            this._updateView();
            BwProduceUnitPanel.show({
                gridIndex,
                war     : this._getWar(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                TwnsBwUnitActionsPanel.BwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                TwnsBwUnitActionsPanel.BwUnitActionsPanel.hide();
            }
        }

        protected _checkCanControlUnit(): boolean {
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for settings the state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateRequestingUnitAttackUnit(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitAttackTile(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitDropOnTap(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchSilo(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchFlare(): void {
            // nothing to do
        }

        public setStateRequestingPlayerProduceUnit(): void {
            // nothing to do
        }

        public setStateRequestingPlayerEndTurn(): void {
            // nothing to do
        }

        public setStateRequestingPlayerUseCoSkill(): void {
            // nothing to do
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            // nothing to do
        }

        public setStateRequestingPlayerVoteForDraw(): void {
            // nothing to do
        }

        public setStateRequestingPlayerSurrender(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if (unit.checkHasWeapon()) {
                    return State.PreviewingAttackableArea;
                } else {
                    return State.PreviewingMovableArea;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingAttackTarget;
            }
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            if (Helpers.getExisted(this.getAvailableDropDestinations()).every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                return State.ChoosingAction;
            } else {
                const chosenUnits               = [this.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of this.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Helpers.getExisted(this.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return State.ChoosingAction;
                    }
                }

                return State.ChoosingAction;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > Helpers.getExisted(Helpers.getExisted(this.getFocusUnit()).getFlareMaxRange())) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingFlareDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(): State {
            return State.ChoosingSiloDestination;
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && GridIndexHelpers.checkIsEqual(previousGridIndex, gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
                const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                        return State.MakingMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.PreviewingMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.PreviewingMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingMovableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingMovableArea() !== unit) {
                        return State.PreviewingMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): TwnsBwActionPlanner.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._getUnitMap().getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitJoin(): TwnsBwActionPlanner.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._getUnitMap().getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? [{ actionType: UnitActionType.UseCoSuperPower, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitUseCoPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? [{ actionType: UnitActionType.UseCoPower, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitLoadCo(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Helpers.getExisted(this.getFocusUnit()).checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitDive(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit     = Helpers.getExisted(this.getFocusUnit());
                const playerIndex   = focusUnit.getPlayerIndex();
                const unitMap       = this._getUnitMap();
                if (focusUnit.checkIsAdjacentUnitSupplier()) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this.getMapSize())) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                            return [{ actionType: UnitActionType.Supply, callback: () => {
                                // nothing to do
                            } }];
                        }
                    }
                }
                return [];
            }
        }
        protected _getActionUnitProduceUnit(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit         = Helpers.getExisted(this.getFocusUnit());
                const produceUnitType   = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                    return [];
                } else {
                    const costForProduceUnit = focusUnit.getProduceUnitCost();
                    if (Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) < 1) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= Helpers.getExisted(focusUnit.getMaxLoadUnitsCount())) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (this._getWar().getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0053)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => {
                                // nothing to do
                            },
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(): TwnsBwActionPlanner.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{ actionType: UnitActionType.Wait, callback: () => {
                        // nothing to do
                    } }];
                } else {
                    return [{ actionType: UnitActionType.Wait, callback: () => {
                        // nothing to do
                    } }];
                }
            }
        }
    }
}

export default TwnsRwActionPlanner;
