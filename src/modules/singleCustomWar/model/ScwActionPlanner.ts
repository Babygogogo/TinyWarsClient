
namespace TinyWars.SingleCustomWar {
    import Types                = Utility.Types;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Logger               = Utility.Logger;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;
    import UnitType             = Types.UnitType;
    import BwHelpers            = BaseWar.BwHelpers;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;

    export class ScwActionPlanner extends BaseWar.BwActionPlanner {
        private _getPlayerIndexInTurn(): number {
            return (this._getWar() as ScwWar).getPlayerIndexInTurn();
        }

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
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            this._setState(State.RequestingPlayerProduceUnit);
            this._updateView();

            ScwLocalProxy.reqPlayerProduceUnit(this._getWar() as ScwWar, gridIndex, unitType, unitHp);
        }

        private _setStateRequestingUnitProduceUnit(): void {
            this._setState(State.RequestingUnitProduceUnit);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitProduceUnit(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitBeLoaded(): void {
            this._setState(State.RequestingUnitBeLoaded);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitBeLoaded(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitJoin(): void {
            this._setState(State.RequestingUnitJoin);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitJoin(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitUseCoSuperPower(): void {
            this._setState(State.RequestingUnitUseCoSuperPower);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitUseCoSkill(this._getWar() as ScwWar, Types.CoSkillType.SuperPower, this.getMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitUseCoPower(): void {
            this._setState(State.RequestingUnitUseCoPower);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitUseCoSkill(this._getWar() as ScwWar, Types.CoSkillType.Power, this.getMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitLoadCo(): void {
            this._setState(State.RequestingUnitLoadCo);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitLoadCo(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitWait(): void {
            this._setState(State.RequestingUnitWait);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitWait(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
            this._setState(State.RequestingUnitAttackUnit);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitAttackUnit(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, targetGridIndex);
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            this._setState(State.RequestingUnitAttackTile);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitAttackTile(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, targetGridIndex);
        }

        private _setStateRequestingUnitBuildTile(): void {
            this._setState(State.RequestingUnitBuildTile);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitBuildTile(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitCaptureTile(): void {
            this._setState(State.RequestingUnitCaptureTile);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitCaptureTile(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitDive(): void {
            this._setState(State.RequestingUnitDive);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitDive(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        private _setStateRequestingUnitSurface(): void {
            this._setState(State.RequestingUnitSurface);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitSurface(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitDrop);
            this._updateView();

            this._pushBackChosenUnitForDrop({
                unit        : this.getChoosingUnitForDrop(),
                destination : gridIndex,
            });

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitDrop(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);
        }
        private _setStateRequestingUnitDropOnChooseAction(): void {
            this._setState(State.RequestingUnitDrop);
            this._updateView();

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitDrop(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitLaunchFlare);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitLaunchFlare(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitLaunchSilo);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitLaunchSilo(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);
        }

        private _setStateRequestingUnitSupply(): void {
            this._setState(State.RequestingUnitSupply);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            ScwLocalProxy.reqUnitSupply(this._getWar() as ScwWar, this.getMovePath(), unit ? unit.getUnitId() : undefined);
        }

        public setStateRequestingPlayerEndTurn(): void {
            this._setState(State.RequestingPlayerEndTurn);
            this._updateView();

            ScwLocalProxy.reqPlayerEndTurn(this._getWar() as ScwWar);
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            this._setState(State.RequestingPlayerDeleteUnit);

            this._updateView();
            ScwLocalProxy.reqPlayerDeleteUnit(this._getWar() as ScwWar, this.getCursor().getGridIndex());
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
            const playerInTurn = this._getWar().getPlayerInTurn();
            return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
                && (playerInTurn.getUserId() != null);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const war               = this._getWar() as ScwWar;
            const turnManager       = this._getTurnManager();
            const playerIndexInTurn = turnManager.getPlayerIndexInTurn();

            if ((war.getHumanPlayerIndexes().indexOf(playerIndexInTurn) < 0) ||
                (turnManager.getPhaseCode() !== TurnPhaseCode.Main)
            ) {
                return State.Idle;
            } else {
                const unit = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if (tile.checkIsUnitProducerForPlayer(playerIndexInTurn)) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((unit.getActionState() === UnitState.Idle) && (playerIndexInTurn === unit.getPlayerIndex())) {
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
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
                    if (this._getUnitMap().getUnitOnMap(gridIndex)) {
                        return State.RequestingUnitAttackUnit;
                    } else {
                        return State.RequestingUnitAttackTile;
                    }
                } else {
                    return State.ChoosingAttackTarget;
                }
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

                return State.RequestingUnitDrop;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > this.getFocusUnit().getFlareMaxRange()) {
                return State.ChoosingAction;
            } else {
                if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                    return State.RequestingUnitLaunchFlare;
                } else {
                    return State.ChoosingFlareDestination;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                return State.RequestingUnitLaunchSilo;
            } else {
                return State.ChoosingSiloDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getPlayerIndexInTurn();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => this._setStateRequestingUnitBeLoaded() }]
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
                    ? [{ actionType: UnitActionType.Join, callback: () => this._setStateRequestingUnitJoin() }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0058),
                                callback: () => this._setStateRequestingUnitUseCoSuperPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0054),
                                callback: () => this._setStateRequestingUnitUseCoPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
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
                            return [{ actionType: UnitActionType.Supply, callback: () => this._setStateRequestingUnitSupply() }];
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
                    } else if ((this._getWar() as ScwWar).getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0053)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => this._setStateRequestingUnitProduceUnit(),
                            canProduceUnit  : true,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getVisibleUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitDropOnChooseAction()
                            : () => CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0055),
                                callback: () => this._setStateRequestingUnitDropOnChooseAction(),
                            }),
                    }];
                } else {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitWait()
                            : () => CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getMoveCost(targetGridIndex: GridIndex, movingUnit: BaseWar.BwUnit): number | undefined {
            if (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, this.getMapSize())) {
                return undefined;
            } else {
                const war           = this._getWar();
                const existingUnit  = this._getUnitMap().getVisibleUnitOnMap(targetGridIndex);
                if ((existingUnit)                                              &&
                    (existingUnit.getTeamIndex() !== movingUnit.getTeamIndex())
                ) {
                    return undefined;
                } else {
                    return this._getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                }
            }
        }

        protected _resetAttackableArea(): void {
            const focusUnit             = this.getFocusUnit();
            const canAttackAfterMove    = focusUnit.checkCanAttackAfterMove();
            const isLoaded              = focusUnit.getLoaderUnitId() != null;
            const beginningGridIndex    = focusUnit.getGridIndex();
            const hasAmmo               = (focusUnit.getPrimaryWeaponCurrentAmmo() > 0) || (focusUnit.checkHasSecondaryWeapon());
            const unitMap               = this._getUnitMap();
            const war                   = this._getWar();
            this._setAttackableArea(BwHelpers.createAttackableArea(
                this.getMovableArea(),
                this.getMapSize(),
                focusUnit.getMinAttackRange(),
                focusUnit.getFinalMaxAttackRange(),
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    if (!hasAmmo) {
                        return false;
                    } else {
                        const existingUnit = unitMap.getVisibleUnitOnMap(moveGridIndex);
                        if ((existingUnit) && (existingUnit !== focusUnit)) {
                            return false;
                        } else {
                            const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                            return ((!isLoaded) || (hasMoved))
                                && ((canAttackAfterMove) || (!hasMoved))
                        }
                    }
                }
            ));
        }

        protected _addUnitForPreviewAttackableArea(unit: BaseWar.BwUnit): void {
            const canAttackAfterMove    = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const unitMap               = this._getUnitMap();
            const war                   = this._getWar();
            const teamIndexes           = (war.getPlayerManager() as ScwPlayerManager).getAliveWatcherTeamIndexesForSelf();
            const newArea               = BwHelpers.createAttackableArea(
                BwHelpers.createMovableArea(
                    unit.getGridIndex(),
                    unit.getFinalMoveRange(),
                    gridIndex => this._getMoveCost(gridIndex, unit)
                ),
                mapSize,
                unit.getMinAttackRange(),
                unit.getFinalMaxAttackRange(),
                (moveGridIndex, attackGridIndex) => {
                    const existingUnit = unitMap.getVisibleUnitOnMap(moveGridIndex);
                    return ((!existingUnit) || (existingUnit === unit))
                        && (hasAmmo)
                        && ((canAttackAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)));
                }
            );

            const unitsForPreviewAttack = this.getUnitsForPreviewingAttackableArea();
            unitsForPreviewAttack.set(unit.getUnitId(), unit);

            const areaForPreviewAttack = this.getAreaForPreviewingAttack();
            if (!areaForPreviewAttack.length) {
                this._setAreaForPreviewingAttack(newArea);
            } else {
                const { width, height } = mapSize;
                for (let x = 0; x < width; ++x) {
                    if (newArea[x]) {
                        if (!areaForPreviewAttack[x]) {
                            areaForPreviewAttack[x] = newArea[x];
                        } else {
                            for (let y = 0; y < height; ++y) {
                                areaForPreviewAttack[x][y] = areaForPreviewAttack[x][y] || newArea[x][y];
                            }
                        }
                    }
                }
            }
        }
    }
}
