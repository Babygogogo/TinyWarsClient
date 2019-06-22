
namespace TinyWars.Replay {
    import WarMapModel      = WarMap.WarMapModel;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Logger           = Utility.Logger;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import UnitState        = Types.UnitState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MovePathNode     = Types.MovePathNode;
    import UnitActionType   = Types.UnitActionType;
    import UnitType         = Types.UnitType;

    type ChosenUnitForDrop = {
        unit        : ReplayUnit;
        destination : GridIndex;
    }

    export class ReplayActionPlanner {
        private _view       : ReplayActionPlannerView;
        private _war        : ReplayWar;
        private _unitMap    : ReplayUnitMap;
        private _tileMap    : ReplayTileMap;
        private _turnManager: ReplayTurnManager;
        private _cursor     : ReplayCursor;
        private _mapSize    : Types.MapSize;

        private _state      : State;
        private _prevState  : State;

        private _focusUnitOnMap             : ReplayUnit;
        private _focusUnitLoaded            : ReplayUnit;
        private _choosingUnitForDrop        : ReplayUnit;
        private _chosenUnitsForDrop         : ChosenUnitForDrop[] = [];
        private _availableDropDestinations  : GridIndex[];
        private _movableArea                : MovableArea;
        private _attackableArea             : AttackableArea;
        private _attackableGridsAfterMove   : GridIndex[];
        private _movePath                   : MovePathNode[] = [];

        private _unitsForPreviewAttack  = new Map<number, ReplayUnit>();
        private _areaForPreviewAttack   : AttackableArea = [];
        private _unitForPreviewMove     : ReplayUnit;
        private _areaForPreviewMove     : MovableArea;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwCursorTapped,    callback: this._onNotifyMcwCursorTapped },
            { type: Notify.Type.BwCursorDragged,   callback: this._onNotifyMcwCursorDragged },
        ];

        public constructor() {
        }

        public async init(mapIndexKey: Types.MapIndexKey): Promise<ReplayActionPlanner> {
            const mapData = await WarMapModel.getMapData(mapIndexKey);
            this._setMapSize({ width: mapData.mapWidth, height: mapData.mapHeight });

            this._view = this._view || new ReplayActionPlannerView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: ReplayWar): void {
            this._war           = war;
            this._unitMap       = war.getUnitMap();
            this._tileMap       = war.getTileMap();
            this._turnManager   = war.getTurnManager();
            this._cursor        = war.getField().getCursor();

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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwCursorTapped(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnTap(gridIndex);
            if ((nextState === this.getState())                                                 &&
                ((nextState === State.ExecutingAction) || (_checkIsStateRequesting(nextState)))
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
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 11, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitBeLoaded) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 1, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitBuildTile) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 2, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitCaptureTile) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 3, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitDive) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 4, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitDrop) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 12, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitJoin) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 5, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitLaunchFlare) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 13, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitLaunchSilo) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 14, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitProduceUnit) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 6, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitSupply) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 7, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitSurface) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 8, nextState: ${nextState}`);

                } else if (nextState === State.RequestingUnitWait) {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 9, nextState: ${nextState}`);

                } else {
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() error 10, nextState: ${nextState}`);
                }
            }
        }

        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDrag(gridIndex);
            if ((nextState === this.getState())                                                 &&
                ((nextState === State.ExecutingAction) || (_checkIsStateRequesting(nextState)))
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
                    Logger.error(`ReplayActionPlanner._onNotifyMcwCursorTapped() invalid nextState!`, nextState);
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
        private _setState(state: State): void {
            this._prevState = this._state;
            this._state     = state;
            Logger.log(`ReplayActionPlanner._setState() ${state}`);
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

        private _setStateMakingMovePathOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (this.getFocusUnit().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Nothing to do.
                } else {
                    const existingUnit = this._unitMap.getUnitOnMap(gridIndex);
                    if ((existingUnit === this.getFocusUnitOnMap()) && (this.getFocusUnitLoaded())) {
                        // Nothing to do.
                    } else {
                        if ((!existingUnit) || (existingUnit.getPlayerIndex() !== this._war.getPlayerInTurn().getPlayerIndex())) {
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
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.PreviewingAttackableArea) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingAttackableArea();

            } else if (currState === State.PreviewingMovableArea) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingMovableArea();

            } else {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }
        private _setStateMakingMovePathOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                const focusUnit = this.getFocusUnit();
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do nothing.
                } else {
                    const movableArea = this.getMovableArea();
                    if (checkAreaHasGrid(movableArea, gridIndex)) {
                        this._updateMovePathByDestination(gridIndex);
                    } else {
                        const attackableArea = this.getAttackableArea();
                        if (!checkAreaHasGrid(attackableArea, gridIndex)) {
                            // Do nothing.
                        } else {
                            const newPath = McwHelpers.createShortestMovePath(movableArea, attackableArea[gridIndex.x][gridIndex.y].movePathDestination);
                            if (focusUnit.checkCanAttackTargetAfterMovePath(newPath, gridIndex)) {
                                this._setMovePath(newPath);
                            } else {
                                // Do nothing.
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }
        private _setStateMakingMovePathOnChooseAction(unitForLaunch: ReplayUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnChooseAction() error 1, currState: ${currState}`);
            } else {
                if (this.getFocusUnitLoaded()) {
                    Logger.error(`ReplayActionPlanner._setStateMakingMovePathOnChooseAction() error 2, currState: ${currState}`);
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

        private _setStateChoosingActionOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                } else {
                    if (!this.getFocusUnitLoaded()) {
                        Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 3, currState: ${currState}`);
                    } else {
                        this._clearFocusUnitLoaded();
                        this._resetMovableArea();
                        this._resetAttackableArea();
                        this._resetMovePathAsShortest(this.getFocusUnitOnMap().getGridIndex());
                    }
                }

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 4, currState: ${currState}`);

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
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 8, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnTap() error 9, currState: ${currState}`);
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }
        private _setStateChoosingActionOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingActionOnDrag() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }

        private _setStateChoosingAttackTargetOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingAttackTargetOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setAttackableGridsAfterMove(this._createAttackableGridsAfterMove());
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }

        private _setStateChoosingDropDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                const data = this._popBackChosenUnitForDrop();
                this._setChoosingUnitForDrop(data.unit);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(data.unit, this._getChosenDropDestinations()));

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnChooseAction(unitForDrop: ReplayUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingDropDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setChoosingUnitForDrop(unitForDrop);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(unitForDrop, this._getChosenDropDestinations()));
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }

        private _setStateChoosingFlareDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingFlareDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }

        private _setStateChoosingSiloDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnTap error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 10, currState: ${currState}`);

            } else {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                Logger.error(`ReplayActionPlanner._setStateChoosingSiloDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }

        private _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._setState(State.ChoosingProductionTarget);
            this._updateView();
            ReplayProduceUnitPanel.show(gridIndex);
        }
        private _setStateChoosingProductionTargetOnDrag(gridIndex: GridIndex): void {
            Logger.error(`ReplayActionPlanner._setStateChoosingProductionTargetOnDrag() error 1, currState: ${this.getState()}`);
        }

        private _setStatePreviewingAttackableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._addUnitForPreviewAttackableArea(this._unitMap.getUnitOnMap(gridIndex));
            this._clearDataForPreviewingMovableArea();

            this._setState(State.PreviewingAttackableArea);
            this._updateView();
        }
        private _setStatePreviewingAttackableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStatePreviewingMovableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._setUnitForPreviewingMovableArea(this._unitMap.getUnitOnMap(gridIndex));

            this._setState(State.PreviewingMovableArea);
            this._updateView();
        }
        private _setStatePreviewingMovableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): ReplayActionPlannerView {
            return this._view;
        }
        private _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                ReplayUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                ReplayUnitActionsPanel.hide();
            }
        }

        public getCursor(): ReplayCursor {
            return this._cursor;
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        public checkIsStateRequesting(): boolean {
            return _checkIsStateRequesting(this.getState());
        }

        public getFocusUnit(): ReplayUnit | undefined {
            return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
        }
        public getFocusUnitOnMap(): ReplayUnit | undefined {
            return this._focusUnitOnMap;
        }
        private _setFocusUnitOnMap(unit: ReplayUnit): void {
            this._focusUnitOnMap = unit;
        }
        private _clearFocusUnitOnMap(): void {
            delete this._focusUnitOnMap;
        }

        public getFocusUnitLoaded(): ReplayUnit | undefined {
            return this._focusUnitLoaded;
        }
        private _setFocusUnitLoaded(unit: ReplayUnit): void {
            this._focusUnitLoaded = unit;
        }
        private _clearFocusUnitLoaded(): void {
            delete this._focusUnitLoaded;
        }

        public getAvailableDropDestinations(): GridIndex[] | undefined {
            return this._availableDropDestinations;
        }
        private _setAvailableDropDestinations(destinations: GridIndex[]): void {
            this._availableDropDestinations = destinations;
        }
        private _clearAvailableDropDestinations(): void {
            delete this._availableDropDestinations;
        }

        public getChoosingUnitForDrop(): ReplayUnit | undefined {
            return this._choosingUnitForDrop;
        }
        private _setChoosingUnitForDrop(unit: ReplayUnit): void {
            this._choosingUnitForDrop = unit;
        }
        private _clearChoosingUnitForDrop(): void {
            delete this._choosingUnitForDrop;
        }

        public getChosenUnitsForDrop(): ChosenUnitForDrop[] {
            return this._chosenUnitsForDrop;
        }
        private _pushBackChosenUnitForDrop(data: ChosenUnitForDrop): void {
            this._chosenUnitsForDrop.push(data);
        }
        private _popBackChosenUnitForDrop(): ChosenUnitForDrop {
            return this._chosenUnitsForDrop.pop();
        }
        private _clearChosenUnitsForDrop(): void {
            this._chosenUnitsForDrop.length = 0;
        }
        private _getChosenDropDestinations(): GridIndex[] {
            const destinations: GridIndex[] = [];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push(data.destination);
            }
            return destinations;
        }

        private _resetMovableArea(): void {
            const unit = this.getFocusUnit();
            this._movableArea = McwHelpers.createMovableArea(
                unit.getGridIndex(),
                unit.getFinalMoveRange(),
                gridIndex => this._getMoveCost(gridIndex, unit)
            );
        }
        public getMovableArea(): MovableArea {
            return this._movableArea;
        }

        private _resetAttackableArea(): void {
            const unit                  = this.getFocusUnit();
            const canAttakAfterMove     = unit.checkCanAttackAfterMove();
            const isLoaded              = unit.getLoaderUnitId() != null;
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const unitMap               = this._unitMap;
            this._attackableArea        = McwHelpers.createAttackableArea(
                this.getMovableArea(),
                this.getMapSize(),
                unit.getMinAttackRange(),
                unit.getMaxAttackRange(),
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    if ((!hasAmmo) || ((existingUnit) && (existingUnit !== unit))) {
                        return false;
                    } else {
                        const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                        return ((!isLoaded) || (hasMoved))
                            && ((canAttakAfterMove) || (!hasMoved))
                    }
                }
            );
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
                unit.getMaxAttackRange(),
                this._mapSize,
                (gridIndex) => unit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for move path.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _resetMovePathAsShortest(destination: GridIndex): void {
            this._setMovePath(McwHelpers.createShortestMovePath(this.getMovableArea(), destination));
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
        public getUnitsForPreviewingAttackableArea(): Map<number, ReplayUnit> {
            return this._unitsForPreviewAttack;
        }
        public getAreaForPreviewingAttack(): AttackableArea {
            return this._areaForPreviewAttack;
        }
        private _clearDataForPreviewingAttackableArea(): void {
            this._unitsForPreviewAttack.clear();
            this._areaForPreviewAttack.length = 0;
        }
        private _addUnitForPreviewAttackableArea(unit: ReplayUnit): void {
            const canAttakAfterMove     = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const unitMap               = this._unitMap;
            const newArea               = McwHelpers.createAttackableArea(
                McwHelpers.createMovableArea(
                    unit.getGridIndex(),
                    unit.getFinalMoveRange(),
                    gridIndex => this._getMoveCost(gridIndex, unit)
                ),
                mapSize,
                unit.getMinAttackRange(),
                unit.getMaxAttackRange(),
                (moveGridIndex, attackGridIndex) => {
                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    return ((!existingUnit) || (existingUnit === unit))
                        && (hasAmmo)
                        && ((canAttakAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)));
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
        public getUnitForPreviewingMovableArea(): ReplayUnit | undefined {
            return this._unitForPreviewMove;
        }
        public getAreaForPreviewingMove(): MovableArea {
            return this._areaForPreviewMove;
        }
        private _clearDataForPreviewingMovableArea(): void {
            delete this._unitForPreviewMove;
            delete this._areaForPreviewMove;
        }
        private _setUnitForPreviewingMovableArea(unit: ReplayUnit): void {
            this._unitForPreviewMove = unit;
            this._areaForPreviewMove = McwHelpers.createMovableArea(
                unit.getGridIndex(),
                unit.getFinalMoveRange(),
                gridIndex => this._getMoveCost(gridIndex, unit)
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getNextStateOnTap(gridIndex: GridIndex): State {
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
                        Logger.error(`ReplayActionPlanner._getNextStateOnTap() invalid currState!`);
                        return State.Idle;
                }
            }
        }
        private _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const turnManager       = this._turnManager;
            const unit              = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._tileMap.getTile(gridIndex);
                if ((isSelfInTurn) && (tile.getPlayerIndex() === playerIndexInTurn) && (tile.checkIsUnitProducer())) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
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
        private _getNextStateOnTapWhenMakingMovePath(gridIndex: GridIndex): State {
            const existingUnit      = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._war.getPlayerInTurn().getPlayerIndex();
            if (checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                if (!existingUnit) {
                    return State.ChoosingAction;
                } else {
                    if (existingUnit.getPlayerIndex() !== playerIndexInTurn) {
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
                    return State.MakingMovePath;
                } else {
                    if (this.getFocusUnitLoaded()) {
                        return State.ChoosingAction;
                    } else {
                        if (!existingUnit) {
                            return State.Idle;
                        } else {
                            if ((existingUnit.getPlayerIndex() === playerIndexInTurn) && (existingUnit.getState() === UnitState.Idle)) {
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
        private _getNextStateOnTapWhenChoosingAction(gridIndex: GridIndex): State {
            if (this.getChosenUnitsForDrop().length) {
                return State.ChoosingDropDestination;
            } else {
                return State.MakingMovePath;
            }
        }
        private _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingAttackTarget;
            }
        }
        private _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
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
        private _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > this.getFocusUnit().getFlareMaxRange()) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingFlareDestination;
            }
        }
        private _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            return State.ChoosingSiloDestination;
        }
        private _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._turnManager;
                const unit              = this._unitMap.getUnitOnMap(gridIndex);
                const playerIndexInTurn = this._war.getPlayerInTurn().getPlayerIndex();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._tileMap.getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.getPlayerIndex() === playerIndexInTurn) && (tile.checkIsUnitProducer())) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
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
        private _getNextStateOnTapWhenPreviewingAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._turnManager;
            const unit              = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._tileMap.getTile(gridIndex);
                if ((isSelfInTurn) && (tile.getPlayerIndex() === playerIndexInTurn) && (tile.checkIsUnitProducer())) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
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
        private _getNextStateOnTapWhenPreviewingMovableArea(gridIndex: GridIndex): State {
            const turnManager       = this._turnManager;
            const unit              = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._war.getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._tileMap.getTile(gridIndex);
                if ((isSelfInTurn) && (tile.getPlayerIndex() === playerIndexInTurn) && (tile.checkIsUnitProducer())) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
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
        private _getDataForUnitActionsPanel(): OpenDataForMcwUnitActionsPanel {
            const actionUnitBeLoaded = this._getActionUnitBeLoaded();
            if (actionUnitBeLoaded.length) {
                return actionUnitBeLoaded;
            }

            const actionUnitJoin = this._getActionUnitJoin();
            if (actionUnitJoin.length) {
                return actionUnitJoin;
            }

            const datas = [] as DataForMcwUnitAction[];
            for (const action of this._getActionUnitAttack())       { datas.push(action); }
            for (const action of this._getActionUnitCapture())      { datas.push(action); }
            for (const action of this._getActionUnitDive())         { datas.push(action); }
            for (const action of this._getActionUnitSurface())      { datas.push(action); }
            for (const action of this._getActionUnitBuildTile())    { datas.push(action); }
            for (const action of this._getActionUnitSupply())       { datas.push(action); }
            for (const action of this._getActionsUnitLaunchUnit())  { datas.push(action); }
            for (const action of this._getActionsUnitDropUnit())    { datas.push(action); }
            for (const action of this._getActionUnitLaunchFlare())  { datas.push(action); }
            for (const action of this._getActionUnitLaunchSilo())   { datas.push(action); }
            for (const action of this._getActionUnitProduceUnit())  { datas.push(action); }
            for (const action of this._getActionUnitWait())         { datas.push(action); }

            Logger.assert(datas.length, `McwActionPlanner._getDataForUntiActionsPanel() no actions available?!`);
            return datas;
        }

        private _getActionUnitBeLoaded(): DataForMcwUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._unitMap.getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => {} }]
                    : [];
            }
        }
        private _getActionUnitJoin(): DataForMcwUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._unitMap.getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => {} }]
                    : [];
            }
        }
        private _getActionUnitAttack(): DataForMcwUnitAction[] {
            return this._createAttackableGridsAfterMove().length
                ? [{ actionType: UnitActionType.Attack, callback: () => this._setStateChoosingAttackTargetOnChooseAction() }]
                : [];
        }
        private _getActionUnitCapture(): DataForMcwUnitAction[] {
            return (this.getFocusUnit().checkCanCaptureTile(this._tileMap.getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.Capture, callback: () => {} }]
                : [];
        }
        private _getActionUnitDive(): DataForMcwUnitAction[] {
            return (this.getFocusUnit().checkCanDive())
                ? [{ actionType: UnitActionType.Dive, callback: () => {} }]
                : [];
        }
        private _getActionUnitSurface(): DataForMcwUnitAction[] {
            return (this.getFocusUnit().checkCanSurface())
                ? [{ actionType: UnitActionType.Surface, callback: () => {} }]
                : [];
        }
        private _getActionUnitBuildTile(): DataForMcwUnitAction[] {
            return (this.getFocusUnit().checkCanBuildOnTile(this._tileMap.getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.BuildTile, callback: () => {} }]
                : [];
        }
        private _getActionUnitSupply(): DataForMcwUnitAction[] {
            const focusUnit     = this.getFocusUnit();
            const playerIndex   = focusUnit.getPlayerIndex();
            const unitMap       = this._unitMap;
            if (focusUnit.checkIsAdjacentUnitSupplier()) {
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this._mapSize)) {
                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                        return [{ actionType: UnitActionType.Supply, callback: () => {} }];
                    }
                }
            }
            return [];
        }
        private _getActionsUnitLaunchUnit(): DataForMcwUnitAction[] {
            const datas     = [] as DataForMcwUnitAction[];
            const focusUnit = this.getFocusUnit();
            if ((focusUnit !== this.getFocusUnitLoaded()) && (this.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
                const tile = this._tileMap.getTile(this.getMovePathDestination());
                for (const unit of focusUnit.getLoadedUnits()) {
                    if ((unit.getState() === UnitState.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                        datas.push({
                            actionType      : UnitActionType.LaunchUnit,
                            callback        : () => this._setStateMakingMovePathOnChooseAction(unit),
                            unitForLaunch   : unit,
                        });
                    }
                }
            }
            return datas;
        }
        private _getActionsUnitDropUnit(): DataForMcwUnitAction[] {
            const focusUnit                 = this.getFocusUnit();
            const destination               = this.getMovePathDestination();
            const loadedUnits               = focusUnit.getLoadedUnits();
            const chosenUnits               = this.getChosenUnitsForDrop();
            const chosenDropDestinations    = this._getChosenDropDestinations();
            const actions                   = [] as DataForMcwUnitAction[];
            if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(this._tileMap.getTile(destination).getType()))) {
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
        private _getActionUnitLaunchFlare(): DataForMcwUnitAction[] {
            if ((!this._war.getFogMap().checkHasFogCurrently()) ||
                (this.getMovePath().length !== 1)               ||
                (!this.getFocusUnit().getFlareCurrentAmmo())
            ) {
                return [];
            } else {
                return [{ actionType: UnitActionType.LaunchFlare, callback: () => this._setStateChoosingFlareDestinationOnChooseAction() }];
            }
        }
        private _getActionUnitLaunchSilo(): DataForMcwUnitAction[] {
            return (this.getFocusUnit().checkCanLaunchSiloOnTile(this._tileMap.getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.LaunchSilo, callback: () => this._setStateChoosingSiloDestinationOnChooseAction() }]
                : [];
        }
        private _getActionUnitProduceUnit(): DataForMcwUnitAction[] {
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
                } else if (this._war.getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
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
        private _getActionUnitWait(): DataForMcwUnitAction[] {
            const existingUnit = this._unitMap.getUnitOnMap(this.getMovePathDestination());
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getMoveCost(targetGridIndex: GridIndex, movingUnit: ReplayUnit): number | undefined {
            if (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, this.getMapSize())) {
                return undefined;
            } else {
                const existingUnit = this._unitMap.getUnitOnMap(targetGridIndex);
                if ((existingUnit) && (existingUnit.getTeamIndex() !== movingUnit.getTeamIndex())) {
                    return undefined;
                } else {
                    return this._tileMap.getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                }
            }
        }

        private _checkCanFocusUnitOnMapAttackTarget(gridIndex: GridIndex): boolean {
            const attackableArea = this.getAttackableArea();
            if (!checkAreaHasGrid(attackableArea, gridIndex)) {
                return false;
            } else {
                const focusUnit = this.getFocusUnit();
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    return true;
                } else {
                    return focusUnit.checkCanAttackTargetAfterMovePath(
                        McwHelpers.createShortestMovePath(this.getMovableArea(), attackableArea[gridIndex.x][gridIndex.y].movePathDestination),
                        gridIndex
                    );
                }
            }
        }

        private _calculateAvailableDropDestination(unitForDrop: ReplayUnit, chosenDropDestinations: GridIndex[]): GridIndex[] {
            const loader                = this.getFocusUnit();
            const loaderEndingGridIndex = this.getMovePathDestination();
            const tileMap               = this._tileMap;
            const unitMap               = this._unitMap;
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

    function checkAreaHasGrid(area: AttackableArea | MovableArea, gridIndex: GridIndex): boolean {
        const { x, y } = gridIndex;
        return (!!area[x]) && (!!area[x][y]);
    }

    function _checkIsStateRequesting(state: State): boolean {
        return (state === State.RequestingPlayerActivateSkill)
            || (state === State.RequestingPlayerBeginTurn)
            || (state === State.RequestingPlayerDeleteUnit)
            || (state === State.RequestingPlayerEndTurn)
            || (state === State.RequestingPlayerSurrender)
            || (state === State.RequestingPlayerVoteForDraw)
            || (state === State.RequestingPlayerProduceUnit)
            || (state === State.RequestingUnitAttack)
            || (state === State.RequestingUnitBeLoaded)
            || (state === State.RequestingUnitBuildTile)
            || (state === State.RequestingUnitCaptureTile)
            || (state === State.RequestingUnitDive)
            || (state === State.RequestingUnitDrop)
            || (state === State.RequestingUnitJoin)
            || (state === State.RequestingUnitLaunchFlare)
            || (state === State.RequestingUnitLaunchSilo)
            || (state === State.RequestingUnitProduceUnit)
            || (state === State.RequestingUnitSupply)
            || (state === State.RequestingUnitSurface)
            || (state === State.RequestingUnitWait);
    }
}
