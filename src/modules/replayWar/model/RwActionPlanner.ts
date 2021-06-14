
namespace TinyWars.ReplayWar {
    import Types            = Utility.Types;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Logger           = Utility.Logger;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import UnitState        = Types.UnitActionState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;
    import UnitActionType   = Types.UnitActionType;
    import BwHelpers        = BaseWar.BwHelpers;

    export class RwActionPlanner extends BaseWar.BwActionPlanner {
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
            BaseWar.BwProduceUnitPanel.show({
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
                BaseWar.BwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                BaseWar.BwUnitActionsPanel.hide();
            }
        }

        protected _checkCanControlUnit(unit: BaseWar.BwUnit): boolean {
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for settings the state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateRequestingUnitAttackUnit(gridIndex: GridIndex): void{
        }

        protected _setStateRequestingUnitAttackTile(gridIndex: GridIndex): void{
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void{
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
        }

        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void {
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
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._getUnitMap().getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitJoin(): BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._getUnitMap().getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? [{ actionType: UnitActionType.UseCoSuperPower, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? [{ actionType: UnitActionType.UseCoPower, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => {} }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitAction[] {
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
                            return [{ actionType: UnitActionType.Supply, callback: () => {} }];
                        }
                    }
                }
                return [];
            }
        }
        protected _getActionUnitProduceUnit(): BaseWar.DataForUnitAction[] {
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
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0051)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= focusUnit.getMaxLoadUnitsCount()) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0052)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else if (this._getWar().getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0053)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => {},
                            canProduceUnit  : true,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{ actionType: UnitActionType.Wait, callback: () => {} }];
                } else {
                    return [{ actionType: UnitActionType.Wait, callback: () => {} }];
                }
            }
        }
    }
}
