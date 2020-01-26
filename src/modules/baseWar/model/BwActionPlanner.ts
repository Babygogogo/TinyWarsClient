
namespace TinyWars.BaseWar {
    import WarMapModel          = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Logger               = Utility.Logger;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import MovableArea          = Types.MovableArea;
    import AttackableArea       = Types.AttackableArea;
    import MovePathNode         = Types.MovePathNode;
    import UnitActionType       = Types.UnitActionType;

    type ChosenUnitForDrop = {
        unit        : BwUnit;
        destination : GridIndex;
    }
    export type OpenDataForBwUnitActionsPanel   = DataForUnitActionRenderer[];
    export type DataForUnitActionRenderer       = {
        actionType      : UnitActionType;
        callback        : () => void;
        unitForLaunch?  : BwUnit;
        unitForDrop?    : BwUnit;
        produceUnitType?: Types.UnitType;
        canProduceUnit? : boolean;
    }

    export abstract class BwActionPlanner {
        private _view       : BwActionPlannerView;
        private _war        : BwWar;
        private _mapSize    : Types.MapSize;

        private _state      : State;
        private _prevState  : State;

        private _focusUnitOnMap             : BwUnit;
        private _focusUnitLoaded            : BwUnit;
        private _choosingUnitForDrop        : BwUnit;
        private _chosenUnitsForDrop         : ChosenUnitForDrop[] = [];
        private _availableDropDestinations  : GridIndex[];
        private _movableArea                : MovableArea;
        private _attackableArea             : AttackableArea;
        private _attackableGridsAfterMove   : GridIndex[];
        private _movePath                   : MovePathNode[] = [];

        private _unitsForPreviewAttack  = new Map<number, BwUnit>();
        private _areaForPreviewAttack   : AttackableArea = [];
        private _unitForPreviewMove     : BwUnit;
        private _areaForPreviewMove     : MovableArea;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwCursorTapped,    callback: this._onNotifyBwCursorTapped },
            { type: Notify.Type.BwCursorDragged,   callback: this._onNotifyBwCursorDragged },
        ];

        public async init(mapFileName: string): Promise<BwActionPlanner> {
            const mapData = await WarMapModel.getExtraData(mapFileName);
            this._setMapSize({ width: mapData.mapWidth, height: mapData.mapHeight });

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._war = war;

            this.setStateIdle();
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);

            this.getView().stopRunningView();
        }

        protected _getWar(): BwWar {
            return this._war;
        }
        protected _getUnitMap(): BwUnitMap {
            return this._getWar().getUnitMap();
        }
        protected _getTileMap(): BwTileMap {
            return this._getWar().getTileMap();
        }
        protected _getTurnManager(): BwTurnManager {
            return this._getWar().getTurnManager();
        }
        public getCursor(): BwCursor {
            return this._getWar().getField().getCursor();
        }
        protected _getMapSize(): Types.MapSize {
            return this._mapSize;
        }
        protected abstract _getViewClass(): new () => BwActionPlannerView;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected abstract _onNotifyBwCursorTapped(e: egret.Event): void;

        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDrag(gridIndex);
            if ((nextState === this.getState())                                                 &&
                ((nextState === State.ExecutingAction) || (BwHelpers.checkIsStateRequesting(nextState)))
            ) {
                // Do noting.
            } else {
                if (nextState === State.Idle) {
                    this.setStateIdle();

                } else if (nextState === State.MakingMovePath) {
                    this._setStateMakingMovePathOnDrag(gridIndex);

                } else if (nextState === State.ChoosingAction) {
                    this._setStateChoosingActionOnDrag(gridIndex);

                } else if (nextState === State.ChoosingAttackTarget) {
                    this._setStateChoosingAttackTargetOnDrag(gridIndex);

                } else if (nextState === State.ChoosingDropDestination) {
                    this._setStateChoosingDropDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingFlareDestination) {
                    this._setStateChoosingFlareDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingSiloDestination) {
                    this._setStateChoosingSiloDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingProductionTarget) {
                    this._setStateChoosingProductionTargetOnDrag(gridIndex);

                } else if (nextState === State.PreviewingAttackableArea) {
                    this._setStatePreviewingAttackableAreaOnDrag(gridIndex);

                } else if (nextState === State.PreviewingMovableArea) {
                    this._setStatePreviewingMovableAreaOnDrag(gridIndex);

                } else {
                    Logger.error(`BwActionPlanner._onNotifyBwCursorTapped() invalid nextState!`, nextState);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getState(): State {
            return this._state;
        }
        public getPreviousState(): State | undefined {
            return this._prevState;
        }
        protected _setState(state: State): void {
            this._prevState = this._state;
            this._state     = state;
            Logger.log(`BwActionPlanner._setState() ${state}`);
            Notify.dispatch(Notify.Type.BwActionPlannerStateChanged);
        }

        public setStateIdle(): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._setState(State.Idle);
            this._updateView();
        }

        public setStateExecutingAction(): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._setState(State.ExecutingAction);
            this._updateView();
        }

        protected abstract _setStateMakingMovePathOnTap(gridIndex: GridIndex): void;

        private _setStateMakingMovePathOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                const focusUnit = this.getFocusUnit();
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do nothing.
                } else {
                    const movableArea = this.getMovableArea();
                    if (BwHelpers.checkAreaHasGrid(movableArea, gridIndex)) {
                        this._updateMovePathByDestination(gridIndex);
                    } else {
                        const attackableArea = this.getAttackableArea();
                        if (!BwHelpers.checkAreaHasGrid(attackableArea, gridIndex)) {
                            // Do nothing.
                        } else {
                            const newPath = BwHelpers.createShortestMovePath(movableArea, attackableArea[gridIndex.x][gridIndex.y].movePathDestination);
                            if (focusUnit.checkCanAttackTargetAfterMovePath(newPath, gridIndex)) {
                                this._setMovePath(newPath);
                            } else {
                                // Do nothing.
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }
        private _setStateMakingMovePathOnChooseAction(unitForLaunch: BwUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateMakingMovePathOnChooseAction() error 1, currState: ${currState}`);
            } else {
                if (this.getFocusUnitLoaded()) {
                    Logger.error(`BwActionPlanner._setStateMakingMovePathOnChooseAction() error 2, currState: ${currState}`);
                } else {
                    this._setFocusUnitLoaded(unitForLaunch);
                    this._resetMovableArea();
                    this._resetAttackableArea();
                    this._resetMovePathAsShortest(unitForLaunch.getGridIndex());
                }
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }

        protected _setStateChoosingActionOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                } else {
                    if (!this.getFocusUnitLoaded()) {
                        Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 3, currState: ${currState}`);
                    } else {
                        this._clearFocusUnitLoaded();
                        this._resetMovableArea();
                        this._resetAttackableArea();
                        this._resetMovePathAsShortest(this.getFocusUnitOnMap().getGridIndex());
                    }
                }

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                if (this.getAvailableDropDestinations().some(g => GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                    this._pushBackChosenUnitForDrop({
                        unit        : this.getChoosingUnitForDrop(),
                        destination : gridIndex,
                    });
                }
                this._clearChoosingUnitForDrop();
                this._clearAvailableDropDestinations();

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 8, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnTap() error 9, currState: ${currState}`);
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }
        private _setStateChoosingActionOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnDrag() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }

        protected _setStateChoosingAttackTargetOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingAttackTargetOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setAttackableGridsAfterMove(this._createAttackableGridsAfterMove());
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }

        protected _setStateChoosingDropDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                const data = this._popBackChosenUnitForDrop();
                this._setChoosingUnitForDrop(data.unit);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(data.unit, this._getChosenDropDestinations()));

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnChooseAction(unitForDrop: BwUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingDropDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setChoosingUnitForDrop(unitForDrop);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(unitForDrop, this._getChosenDropDestinations()));
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }

        protected _setStateChoosingFlareDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingFlareDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }

        protected _setStateChoosingSiloDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`BwActionPlanner._setStateChoosingSiloDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }

        protected abstract _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void;
        private _setStateChoosingProductionTargetOnDrag(gridIndex: GridIndex): void {
            Logger.error(`BwActionPlanner._setStateChoosingProductionTargetOnDrag() error 1, currState: ${this.getState()}`);
        }

        protected _setStatePreviewingAttackableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._addUnitForPreviewAttackableArea(this._getUnitMap().getUnitOnMap(gridIndex));
            this._clearDataForPreviewingMovableArea();

            this._setState(State.PreviewingAttackableArea);
            this._updateView();
        }
        private _setStatePreviewingAttackableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        protected _setStatePreviewingMovableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._setUnitForPreviewingMovableArea(this._getUnitMap().getUnitOnMap(gridIndex));

            this._setState(State.PreviewingMovableArea);
            this._updateView();
        }
        private _setStatePreviewingMovableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwActionPlannerView {
            return this._view;
        }
        protected abstract _updateView(): void;

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        public checkIsStateRequesting(): boolean {
            return BwHelpers.checkIsStateRequesting(this.getState());
        }

        public getFocusUnit(): BwUnit | undefined {
            return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
        }
        public getFocusUnitOnMap(): BwUnit | undefined {
            return this._focusUnitOnMap;
        }
        protected _setFocusUnitOnMap(unit: BwUnit): void {
            this._focusUnitOnMap = unit;
        }
        protected _clearFocusUnitOnMap(): void {
            delete this._focusUnitOnMap;
        }

        public getFocusUnitLoaded(): BwUnit | undefined {
            return this._focusUnitLoaded;
        }
        private _setFocusUnitLoaded(unit: BwUnit): void {
            this._focusUnitLoaded = unit;
        }
        protected _clearFocusUnitLoaded(): void {
            delete this._focusUnitLoaded;
        }

        public getAvailableDropDestinations(): GridIndex[] | undefined {
            return this._availableDropDestinations;
        }
        private _setAvailableDropDestinations(destinations: GridIndex[]): void {
            this._availableDropDestinations = destinations;
        }
        protected _clearAvailableDropDestinations(): void {
            delete this._availableDropDestinations;
        }

        public getChoosingUnitForDrop(): BwUnit | undefined {
            return this._choosingUnitForDrop;
        }
        private _setChoosingUnitForDrop(unit: BwUnit): void {
            this._choosingUnitForDrop = unit;
        }
        protected _clearChoosingUnitForDrop(): void {
            delete this._choosingUnitForDrop;
        }

        public getChosenUnitsForDrop(): ChosenUnitForDrop[] {
            return this._chosenUnitsForDrop;
        }
        protected _pushBackChosenUnitForDrop(data: ChosenUnitForDrop): void {
            this._chosenUnitsForDrop.push(data);
        }
        private _popBackChosenUnitForDrop(): ChosenUnitForDrop {
            return this._chosenUnitsForDrop.pop();
        }
        protected _clearChosenUnitsForDrop(): void {
            this._chosenUnitsForDrop.length = 0;
        }
        private _getChosenDropDestinations(): GridIndex[] {
            const destinations: GridIndex[] = [];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push(data.destination);
            }
            return destinations;
        }

        protected _resetMovableArea(): void {
            const unit = this.getFocusUnit();
            this._movableArea = BwHelpers.createMovableArea(
                unit.getGridIndex(),
                unit.getFinalMoveRange(),
                gridIndex => this._getMoveCost(gridIndex, unit)
            );
        }
        public getMovableArea(): MovableArea {
            return this._movableArea;
        }

        protected _resetAttackableArea(): void {
            const unit                  = this.getFocusUnit();
            const canAttackAfterMove    = unit.checkCanAttackAfterMove();
            const isLoaded              = unit.getLoaderUnitId() != null;
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const unitMap               = this._getUnitMap();
            this._setAttackableArea(BwHelpers.createAttackableArea(
                this.getMovableArea(),
                this.getMapSize(),
                unit.getMinAttackRange(),
                unit.getFinalMaxAttackRange(),
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    if ((!hasAmmo) || ((existingUnit) && (existingUnit !== unit))) {
                        return false;
                    } else {
                        const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                        return ((!isLoaded) || (hasMoved))
                            && ((canAttackAfterMove) || (!hasMoved))
                    }
                }
            ));
        }
        protected _setAttackableArea(area: AttackableArea): void {
            this._attackableArea = area;
        }
        public getAttackableArea(): AttackableArea {
            return this._attackableArea;
        }

        private _setAttackableGridsAfterMove(grids: GridIndex[]): void {
            this._attackableGridsAfterMove = grids;
        }
        public getAttackableGridsAfterMove(): GridIndex[] {
            return this._attackableGridsAfterMove;
        }
        public checkHasAttackableGridAfterMove(gridIndex: GridIndex): boolean {
            for (const grid of this.getAttackableGridsAfterMove()) {
                if (GridIndexHelpers.checkIsEqual(grid, gridIndex)) {
                    return true;
                }
            }
            return false;
        }
        private _createAttackableGridsAfterMove(): GridIndex[] {
            const unit = this.getFocusUnit();
            return GridIndexHelpers.getGridsWithinDistance(
                this.getMovePathDestination(),
                unit.getMinAttackRange(),
                unit.getFinalMaxAttackRange(),
                this._mapSize,
                (gridIndex) => unit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for move path.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _resetMovePathAsShortest(destination: GridIndex): void {
            this._setMovePath(BwHelpers.createShortestMovePath(this.getMovableArea(), destination));
        }
        private _setMovePath(movePath: MovePathNode[]): void {
            this._movePath = movePath;
        }
        public getMovePath(): MovePathNode[] {
            return this._movePath;
        }
        public getMovePathDestination(): MovePathNode {
            const movePath = this.getMovePath();
            return movePath[movePath.length - 1];
        }
        private _updateMovePathByDestination(destination: GridIndex): void {
            const { x, y }      = destination;
            const movableArea   = this.getMovableArea();
            const currPath      = this.getMovePath();
            if ((movableArea[x]) && (movableArea[x][y]) && (!GridIndexHelpers.checkIsEqual(currPath[currPath.length - 1], destination))) {
                if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                    this._resetMovePathAsShortest(destination);
                }
            }
        }
        private _checkAndTruncateMovePath(destination: GridIndex): boolean {
            const path      = this.getMovePath();
            const length    = path.length;
            for (let i = 0; i < length; ++i) {
                if (GridIndexHelpers.checkIsEqual(path[i], destination)) {
                    path.length = i + 1;
                    return true;
                }
            }
            return false;
        }
        private _checkAndExtendMovePath(destination: GridIndex): boolean {
            const path      = this.getMovePath();
            const length    = path.length;
            const prevGrid  = path[length - 1];
            if (!GridIndexHelpers.checkIsAdjacent(prevGrid, destination)) {
                return false;
            } else {
                const focusUnit     = this.getFocusUnit();
                const totalMoveCost = this._getMoveCost(destination, focusUnit) + prevGrid.totalMoveCost;
                if (totalMoveCost > focusUnit.getFinalMoveRange()) {
                    return false;
                } else {
                    path.push({
                        x   : destination.x,
                        y   : destination.y,
                        totalMoveCost,
                    });
                    return true;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for previewing attackable area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitsForPreviewingAttackableArea(): Map<number, BwUnit> {
            return this._unitsForPreviewAttack;
        }
        public getAreaForPreviewingAttack(): AttackableArea {
            return this._areaForPreviewAttack;
        }
        protected _setAreaForPreviewingAttack(area: AttackableArea): void {
            this._areaForPreviewAttack = area;
        }
        protected _clearDataForPreviewingAttackableArea(): void {
            this._unitsForPreviewAttack.clear();
            this._areaForPreviewAttack.length = 0;
        }
        protected _addUnitForPreviewAttackableArea(unit: BwUnit): void {
            const canAttackAfterMove    = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const unitMap               = this._getUnitMap();
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
                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    return ((!existingUnit) || (existingUnit === unit))
                        && (hasAmmo)
                        && ((canAttackAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)));
                }
            );

            this._unitsForPreviewAttack.set(unit.getUnitId(), unit);
            if (!this._areaForPreviewAttack.length) {
                this._areaForPreviewAttack = newArea;
            } else {
                const { width, height } = mapSize;
                for (let x = 0; x < width; ++x) {
                    if (newArea[x]) {
                        if (!this._areaForPreviewAttack[x]) {
                            this._areaForPreviewAttack[x] = newArea[x];
                        } else {
                            for (let y = 0; y < height; ++y) {
                                this._areaForPreviewAttack[x][y] = this._areaForPreviewAttack[x][y] || newArea[x][y];
                            }
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for previewing movable area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitForPreviewingMovableArea(): BwUnit | undefined {
            return this._unitForPreviewMove;
        }
        public getAreaForPreviewingMove(): MovableArea {
            return this._areaForPreviewMove;
        }
        protected _clearDataForPreviewingMovableArea(): void {
            delete this._unitForPreviewMove;
            delete this._areaForPreviewMove;
        }
        private _setUnitForPreviewingMovableArea(unit: BwUnit): void {
            this._unitForPreviewMove = unit;
            this._areaForPreviewMove = BwHelpers.createMovableArea(
                unit.getGridIndex(),
                unit.getFinalMoveRange(),
                gridIndex => this._getMoveCost(gridIndex, unit)
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTap(gridIndex: GridIndex): State {
            const currState = this.getState();
            if ((this.checkIsStateRequesting()) || (currState === State.ExecutingAction)) {
                return currState;
            } else {
                switch (currState) {
                    case State.Idle                         : return this._getNextStateOnTapWhenIdle(gridIndex);
                    case State.MakingMovePath               : return this._getNextStateOnTapWhenMakingMovePath(gridIndex);
                    case State.ChoosingAction               : return this._getNextStateOnTapWhenChoosingAction(gridIndex);
                    case State.ChoosingAttackTarget         : return this._getNextStateOnTapWhenChoosingAttackTarget(gridIndex);
                    case State.ChoosingDropDestination      : return this._getNextStateOnTapWhenChoosingDropDestination(gridIndex);
                    case State.ChoosingFlareDestination     : return this._getNextStateOnTapWhenChoosingFlareDestination(gridIndex);
                    case State.ChoosingSiloDestination      : return this._getNextStateOnTapWhenChoosingSiloDestination(gridIndex);
                    case State.ChoosingProductionTarget     : return this._getNextStateOnTapWhenChoosingProductionTarget(gridIndex);
                    case State.PreviewingAttackableArea     : return this._getNextStateOnTapWhenPreviewingAttackableArea(gridIndex);
                    case State.PreviewingMovableArea        : return this._getNextStateOnTapWhenPreviewingMovableArea(gridIndex);
                    default:
                        Logger.error(`BwActionPlanner._getNextStateOnTap() invalid currState!`);
                        return State.Idle;
                }
            }
        }
        protected abstract _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenMakingMovePath(gridIndex: GridIndex): State;
        private _getNextStateOnTapWhenChoosingAction(gridIndex: GridIndex): State {
            if (this.getChosenUnitsForDrop().length) {
                return State.ChoosingDropDestination;
            } else {
                return State.MakingMovePath;
            }
        }
        protected abstract _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingAttackableArea(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingMovableArea(gridIndex: GridIndex): State;

        private _getNextStateOnDrag(gridIndex: GridIndex): State {
            const currState = this.getState();
            if (currState === State.ChoosingProductionTarget) {
                return State.Idle;
            } else {
                return currState;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getDataForUnitActionsPanel(): OpenDataForBwUnitActionsPanel {
            const actionUnitBeLoaded = this._getActionUnitBeLoaded();
            if (actionUnitBeLoaded.length) {
                return actionUnitBeLoaded;
            }

            const actionUnitJoin = this._getActionUnitJoin();
            if (actionUnitJoin.length) {
                return actionUnitJoin;
            }

            const dataList = [] as DataForUnitActionRenderer[];
            dataList.push(...this._getActionUnitUseCoSuperPower());
            dataList.push(...this._getActionUnitUseCoPower());
            dataList.push(...this._getActionUnitLoadCo());
            dataList.push(...this._getActionUnitAttack());
            dataList.push(...this._getActionUnitCapture());
            dataList.push(...this._getActionUnitDive());
            dataList.push(...this._getActionUnitSurface());
            dataList.push(...this._getActionUnitBuildTile());
            dataList.push(...this._getActionUnitSupply());
            dataList.push(...this._getActionsUnitLaunchUnit());
            dataList.push(...this._getActionsUnitDropUnit());
            dataList.push(...this._getActionUnitLaunchFlare());
            dataList.push(...this._getActionUnitLaunchSilo());
            dataList.push(...this._getActionUnitProduceUnit());
            dataList.push(...this._getActionUnitWait(dataList.length > 0));

            Logger.assert(dataList.length, `BwActionPlanner._getDataForUnitActionsPanel() no actions available?!`);
            return dataList;
        }

        protected abstract _getActionUnitBeLoaded(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitJoin(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitUseCoSuperPower(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitUseCoPower(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitLoadCo(): DataForUnitActionRenderer[];
        private _getActionUnitAttack(): DataForUnitActionRenderer[] {
            return this._createAttackableGridsAfterMove().length
                ? [{ actionType: UnitActionType.Attack, callback: () => this._setStateChoosingAttackTargetOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitCapture(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitDive(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitSurface(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitBuildTile(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitSupply(): DataForUnitActionRenderer[];
        private _getActionsUnitLaunchUnit(): DataForUnitActionRenderer[] {
            const dataList  = [] as DataForUnitActionRenderer[];
            const focusUnit = this.getFocusUnit();
            if ((focusUnit !== this.getFocusUnitLoaded()) && (this.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
                const tile = this._getTileMap().getTile(this.getMovePathDestination());
                for (const unit of focusUnit.getLoadedUnits()) {
                    if ((unit.getState() === UnitState.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                        dataList.push({
                            actionType      : UnitActionType.LaunchUnit,
                            callback        : () => this._setStateMakingMovePathOnChooseAction(unit),
                            unitForLaunch   : unit,
                        });
                    }
                }
            }
            return dataList;
        }
        private _getActionsUnitDropUnit(): DataForUnitActionRenderer[] {
            const focusUnit                 = this.getFocusUnit();
            const destination               = this.getMovePathDestination();
            const loadedUnits               = focusUnit.getLoadedUnits();
            const chosenUnits               = this.getChosenUnitsForDrop();
            const chosenDropDestinations    = this._getChosenDropDestinations();
            const actions                   = [] as DataForUnitActionRenderer[];
            if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(this._getTileMap().getTile(destination).getType()))) {
                for (const unit of loadedUnits) {
                    if ((chosenUnits.every(value => value.unit !== unit)) && (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length)) {
                        actions.push({
                            actionType  : UnitActionType.DropUnit,
                            callback    : () => this._setStateChoosingDropDestinationOnChooseAction(unit),
                            unitForDrop : unit,
                        });
                    }
                }
            }
            return actions;
        }
        private _getActionUnitLaunchFlare(): DataForUnitActionRenderer[] {
            if ((!this._getWar().getFogMap().checkHasFogCurrently()) ||
                (this.getMovePath().length !== 1)               ||
                (!this.getFocusUnit().getFlareCurrentAmmo())
            ) {
                return [];
            } else {
                return [{ actionType: UnitActionType.LaunchFlare, callback: () => this._setStateChoosingFlareDestinationOnChooseAction() }];
            }
        }
        private _getActionUnitLaunchSilo(): DataForUnitActionRenderer[] {
            return (this.getFocusUnit().checkCanLaunchSiloOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.LaunchSilo, callback: () => this._setStateChoosingSiloDestinationOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitProduceUnit(): DataForUnitActionRenderer[];
        protected abstract _getActionUnitWait(hasOtherAction: boolean): DataForUnitActionRenderer[];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getMoveCost(targetGridIndex: GridIndex, movingUnit: BwUnit): number | undefined {
            if (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, this.getMapSize())) {
                return undefined;
            } else {
                const existingUnit  = this._getUnitMap().getUnitOnMap(targetGridIndex);
                const teamIndex     = movingUnit.getTeamIndex();
                if ((existingUnit)                                      &&
                    (existingUnit.getTeamIndex() !== teamIndex)         &&
                    (VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                        war                 : this._war,
                        gridIndex           : targetGridIndex,
                        unitType            : existingUnit.getType(),
                        isDiving            : existingUnit.getIsDiving(),
                        unitPlayerIndex     : existingUnit.getPlayerIndex(),
                        observerTeamIndex   : teamIndex,
                    }))
                ) {
                    return undefined;
                } else {
                    return this._getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                }
            }
        }

        protected _checkCanFocusUnitOnMapAttackTarget(gridIndex: GridIndex): boolean {
            const attackableArea = this.getAttackableArea();
            if (!BwHelpers.checkAreaHasGrid(attackableArea, gridIndex)) {
                return false;
            } else {
                const focusUnit = this.getFocusUnit();
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    return true;
                } else {
                    return focusUnit.checkCanAttackTargetAfterMovePath(
                        BwHelpers.createShortestMovePath(this.getMovableArea(), attackableArea[gridIndex.x][gridIndex.y].movePathDestination),
                        gridIndex
                    );
                }
            }
        }

        protected _calculateAvailableDropDestination(unitForDrop: BwUnit, chosenDropDestinations: GridIndex[]): GridIndex[] {
            const loader                = this.getFocusUnit();
            const loaderEndingGridIndex = this.getMovePathDestination();
            const tileMap               = this._getTileMap();
            const unitMap               = this._getUnitMap();
            const destinations          = new Array<GridIndex>();
            if (tileMap.getTile(loaderEndingGridIndex).getMoveCostByUnit(unitForDrop) != null) {
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(loaderEndingGridIndex, this._mapSize)) {
                    const existingUnit = unitMap.getUnitOnMap(gridIndex);
                    if ((tileMap.getTile(gridIndex).getMoveCostByUnit(unitForDrop) != null)                 &&
                        (chosenDropDestinations.every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex)))   &&
                        ((!existingUnit) || (existingUnit === loader))
                    ) {
                        destinations.push(gridIndex);
                    }
                }
            }
            return destinations;
        }
    }
}
