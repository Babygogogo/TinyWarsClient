
import { BwProduceUnitPanel }                   from "../../baseWar/view/BwProduceUnitPanel";
import { BwUnitActionsPanel }                   from "../../baseWar/view/BwUnitActionsPanel";
import { BwUnit }                               from "../../baseWar/model/BwUnit";
import { TwnsBwActionPlanner }   from "../../baseWar/model/BwActionPlanner";
import { FloatText }                            from "../../../utility/FloatText";
import { GridIndexHelpers }                     from "../../../utility/GridIndexHelpers";
import { Lang }                                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Types }                                from "../../../utility/Types";
import LangTextType         = TwnsLangTextType.LangTextType;
import TurnPhaseCode                            = Types.TurnPhaseCode;
import UnitState                                = Types.UnitActionState;
import GridIndex                                = Types.GridIndex;
import State                                    = Types.ActionPlannerState;
import UnitActionType                           = Types.UnitActionType;

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
            BwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
        } else {
            BwUnitActionsPanel.hide();
        }
    }

    protected _checkCanControlUnit(unit: BwUnit): boolean {
        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for settings the state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setStateRequestingUnitAttackUnit(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitAttackTile(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
        // nothing to do
    }

    public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void {
        // nothing to do
    }

    public setStateRequestingPlayerEndTurn(): void {
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
        if (this.getAvailableDropDestinations().every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
            return State.ChoosingAction;
        } else {
            const chosenUnits               = [this.getChoosingUnitForDrop()];
            const chosenDropDestinations    = [gridIndex];
            for (const data of this.getChosenUnitsForDrop()) {
                chosenUnits.push(data.unit);
                chosenDropDestinations.push(data.destination);
            }

            const restLoadedUnits = this.getFocusUnit().getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
            for (const unit of restLoadedUnits) {
                if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                    return State.ChoosingAction;
                }
            }

            return State.ChoosingAction;
        }
    }
    protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
        if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > this.getFocusUnit().getFlareMaxRange()) {
            return State.ChoosingAction;
        } else {
            return State.ChoosingFlareDestination;
        }
    }
    protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
        return State.ChoosingSiloDestination;
    }
    protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
        if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
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
        const focusUnit     = this.getFocusUnit();
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
        const focusUnit     = this.getFocusUnit();
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
            return this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
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
            return this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
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
            return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
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
            return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
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
            return (this.getFocusUnit().checkCanDive())
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
            return (this.getFocusUnit().checkCanSurface())
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
            return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
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
            const focusUnit     = this.getFocusUnit();
            const playerIndex   = focusUnit.getPlayerIndex();
            const unitMap       = this._getUnitMap();
            if (focusUnit.checkIsAdjacentUnitSupplier()) {
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this._getMapSize())) {
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
            const focusUnit         = this.getFocusUnit();
            const produceUnitType   = focusUnit.getProduceUnitType();
            if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                return [];
            } else {
                if (focusUnit.getCurrentProduceMaterial() < 1) {
                    return [{
                        actionType      : UnitActionType.ProduceUnit,
                        callback        : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                        canProduceUnit  : false,
                        produceUnitType,
                    }];
                } else if (focusUnit.getLoadedUnitsCount() >= focusUnit.getMaxLoadUnitsCount()) {
                    return [{
                        actionType      : UnitActionType.ProduceUnit,
                        callback        : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                        canProduceUnit  : false,
                        produceUnitType,
                    }];
                } else if (this._getWar().getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
                    return [{
                        actionType      : UnitActionType.ProduceUnit,
                        callback        : () => FloatText.show(Lang.getText(LangTextType.B0053)),
                        canProduceUnit  : false,
                        produceUnitType,
                    }];
                } else {
                    return [{
                        actionType      : UnitActionType.ProduceUnit,
                        callback        : () => {
                            // nothing to do
                        },
                        canProduceUnit  : true,
                        produceUnitType,
                    }];
                }
            }
        }
    }
    protected _getActionUnitWait(hasOtherAction: boolean): TwnsBwActionPlanner.DataForUnitAction[] {
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
