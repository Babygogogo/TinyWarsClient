
namespace TinyWars.MultiCustomWar {
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
    import UnitType         = Types.UnitType;
    import BwHelpers        = BaseWar.BwHelpers;
    import ConfirmPanel     = Common.ConfirmPanel;

    export class McwActionPlanner extends BaseWar.BwActionPlanner {
        private _getPlayerIndexLoggedIn(): number {
            return (this._getWar() as McwWar).getPlayerIndexLoggedIn();
        }

        protected _getViewClass(): new () => BaseWar.BwActionPlannerView {
            return McwActionPlannerView;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _onNotifyBwCursorTapped(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnTap(gridIndex);
            if ((nextState === this.getState())                                                 &&
                ((nextState === State.ExecutingAction) || (BwHelpers.checkIsStateRequesting(nextState)))
            ) {
                // Do noting.
            } else {
                if (nextState === State.Idle) {
                    this.setStateIdle();

                } else if (nextState === State.MakingMovePath) {
                    this._setStateMakingMovePathOnTap(gridIndex);

                } else if (nextState === State.ChoosingAction) {
                    this._setStateChoosingActionOnTap(gridIndex);

                } else if (nextState === State.ChoosingAttackTarget) {
                    this._setStateChoosingAttackTargetOnTap(gridIndex);

                } else if (nextState === State.ChoosingDropDestination) {
                    this._setStateChoosingDropDestinationOnTap(gridIndex);

                } else if (nextState === State.ChoosingFlareDestination) {
                    this._setStateChoosingFlareDestinationOnTap(gridIndex);

                } else if (nextState === State.ChoosingSiloDestination) {
                    this._setStateChoosingSiloDestinationOnTap(gridIndex);

                } else if (nextState === State.ChoosingProductionTarget) {
                    this._setStateChoosingProductionTargetOnTap(gridIndex);

                } else if (nextState === State.PreviewingAttackableArea) {
                    this._setStatePreviewingAttackableAreaOnTap(gridIndex);

                } else if (nextState === State.PreviewingMovableArea) {
                    this._setStatePreviewingMovableAreaOnTap(gridIndex);

                } else if (nextState === State.RequestingUnitAttack) {
                    this._setStateRequestingUnitAttack(gridIndex);

                } else if (nextState === State.RequestingUnitBeLoaded) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 1, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitBuildTile) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 2, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitCaptureTile) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 3, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitDive) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 4, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitDrop) {
                    this._setStateRequestingUnitDropOnTap(gridIndex);

                } else if (nextState === State.RequestingUnitJoin) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 5, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitLaunchFlare) {
                    this._setStateRequestingUnitLaunchFlare(gridIndex);

                } else if (nextState === State.RequestingUnitLaunchSilo) {
                    this._setStateRequestingUnitLaunchSilo(gridIndex);

                } else if (nextState === State.RequestingUnitProduceUnit) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 6, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitSupply) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 7, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitSurface) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 8, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitWait) {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 9, nextState: ${nextState}`);

                } else {
                    Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() error 10, nextState: ${nextState}`);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateMakingMovePathOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            const unitMap   = this._getUnitMap();

            if (currState === State.Idle) {
                this._setFocusUnitOnMap(unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (this.getFocusUnit().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Nothing to do.
                } else {
                    const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
                    if ((existingUnit === this.getFocusUnitOnMap()) && (this.getFocusUnitLoaded())) {
                        // Nothing to do.
                    } else {
                        if ((!existingUnit) || (existingUnit.getPlayerIndex() !== this._getPlayerIndexLoggedIn())) {
                            this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                        } else {
                            this._setFocusUnitOnMap(existingUnit);
                            this._clearFocusUnitLoaded();
                            this._resetMovableArea();
                            this._resetAttackableArea();
                            this._resetMovePathAsShortest(gridIndex);
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                // Do nothing.

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                this._setFocusUnitOnMap(this._getUnitMap().getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.PreviewingAttackableArea) {
                this._setFocusUnitOnMap(this._getUnitMap().getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingAttackableArea();

            } else if (currState === State.PreviewingMovableArea) {
                this._setFocusUnitOnMap(this._getUnitMap().getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingMovableArea();

            } else {
                Logger.error(`McwActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }

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
            McwProduceUnitPanel.show(gridIndex);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            McwProxy.reqMcwPlayerProduceUnit(this._getWar(), gridIndex, unitType, unitHp);

            this._setState(State.RequestingPlayerProduceUnit);
            this._updateView();
        }

        public setStateRequestingPlayerVoteForDraw(isAgree: boolean): void {
            McwProxy.reqMcwPlayerVoteForDraw(this._getWar(), isAgree);

            this._setState(State.RequestingPlayerVoteForDraw);
            this._updateView();
        }

        private _setStateRequestingUnitProduceUnit(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitProduceUnit(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitProduceUnit);
            this._updateView();
        }

        private _setStateRequestingUnitBeLoaded(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitBeLoaded(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitBeLoaded);
            this._updateView();
        }

        private _setStateRequestingUnitJoin(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitJoin(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitJoin);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoSuperPower(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitUseCoSkill(this._getWar(), Types.CoSkillType.SuperPower, this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitUseCoSuperPower);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoPower(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitUseCoSkill(this._getWar(), Types.CoSkillType.Power, this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitUseCoPower);
            this._updateView();
        }

        private _setStateRequestingUnitLoadCo(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitLoadCo(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitLoadCo);
            this._updateView();
        }

        private _setStateRequestingUnitWait(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitWait(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitWait);
            this._updateView();
        }

        private _setStateRequestingUnitAttack(targetGridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitAttack(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, targetGridIndex);

            this._setState(State.RequestingUnitAttack);
            this._updateView();
        }

        private _setStateRequestingUnitBuildTile(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitBuildTile(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitBuildTile);
            this._updateView();
        }

        private _setStateRequestingUnitCaptureTile(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitCaptureTile(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitCaptureTile);
            this._updateView();
        }

        private _setStateRequestingUnitDive(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitDive(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitDive);
            this._updateView();
        }

        private _setStateRequestingUnitSurface(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitSurface(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitSurface);
            this._updateView();
        }

        private _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            this._pushBackChosenUnitForDrop({
                unit        : this.getChoosingUnitForDrop(),
                destination : gridIndex,
            });

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitDrop(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }
        private _setStateRequestingUnitDropOnChooseAction(): void {
            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitDrop(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }

        private _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitLaunchFlare(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);

            this._setState(State.RequestingUnitLaunchFlare);
            this._updateView();
        }

        private _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitLaunchSilo(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);

            this._setState(State.RequestingUnitLaunchSilo);
            this._updateView();
        }

        private _setStateRequestingUnitSupply(): void {
            const unit = this.getFocusUnitLoaded();
            McwProxy.reqMcwUnitSupply(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitSupply);
            this._updateView();
        }

        public setStateRequestingPlayerBeginTurn(): void {
            McwProxy.reqMcwPlayerBeginTurn(this._getWar());

            this._setState(State.RequestingPlayerBeginTurn);
            this._updateView();
        }

        public setStateRequestingPlayerEndTurn(): void {
            McwProxy.reqMcwPlayerEndTurn(this._getWar());

            this._setState(State.RequestingPlayerEndTurn);
            this._updateView();
        }

        public setStateRequestingPlayerSurrender(): void {
            McwProxy.reqMcwPlayerSurrender(this._getWar());

            this._setState(State.RequestingPlayerSurrender);
            this._updateView();
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            McwProxy.reqMcwPlayerDeleteUnit(this._getWar(), this.getCursor().getGridIndex());

            this._setState(State.RequestingPlayerDeleteUnit);
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                McwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                McwUnitActionsPanel.hide();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
        protected _getNextStateOnTapWhenMakingMovePath(gridIndex: GridIndex): State {
            const existingUnit      = this._getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                if (!existingUnit) {
                    return State.ChoosingAction;
                } else {
                    if (existingUnit.getPlayerIndex() !== selfPlayerIndex) {
                        if (existingUnit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.PreviewingMovableArea;
                        }
                    } else {
                        const focusUnit = this.getFocusUnit();
                        if ((focusUnit === this.getFocusUnitLoaded()) && (GridIndexHelpers.checkIsEqual(gridIndex, focusUnit.getGridIndex()))) {
                            return State.MakingMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return State.ChoosingAction;
                            } else {
                                if (existingUnit.getState() === UnitState.Idle) {
                                    return State.MakingMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return State.PreviewingAttackableArea;
                                    } else {
                                        return State.PreviewingMovableArea;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (this._checkCanFocusUnitOnMapAttackTarget(gridIndex)) {
                    if (!GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                        return State.MakingMovePath;
                    } else {
                        if (this.getFocusUnit().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                            return State.RequestingUnitAttack;
                        } else {
                            return State.MakingMovePath;
                        }
                    }
                } else {
                    if (this.getFocusUnitLoaded()) {
                        return State.ChoosingAction;
                    } else {
                        if (!existingUnit) {
                            return State.Idle;
                        } else {
                            if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getState() === UnitState.Idle)) {
                                return State.MakingMovePath;
                            } else {
                                if (existingUnit.checkHasWeapon()) {
                                    return State.PreviewingAttackableArea;
                                } else {
                                    return State.PreviewingMovableArea;
                                }
                            }
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
                    return State.RequestingUnitAttack;
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
                const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitActionRenderer[] {
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
        protected _getActionUnitJoin(): BaseWar.DataForUnitActionRenderer[] {
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
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            ConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0058),
                                callback: () => this._setStateRequestingUnitUseCoSuperPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            ConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0054),
                                callback: () => this._setStateRequestingUnitUseCoPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitActionRenderer[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitActionRenderer[] {
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
        protected _getActionUnitProduceUnit(): BaseWar.DataForUnitActionRenderer[] {
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
                    } else if ((this._getWar() as McwWar).getPlayerLoggedIn().getFund() < focusUnit.getProduceUnitCost()) {
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
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitActionRenderer[] {
            const existingUnit = this._getUnitMap().getUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitDropOnChooseAction()
                            : () => ConfirmPanel.show({
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
                            : () => ConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }
    }
}
