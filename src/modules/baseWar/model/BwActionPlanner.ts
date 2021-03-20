
namespace TinyWars.BaseWar {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import ClientErrorCode      = Utility.ClientErrorCode;
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
    export type DataForUnitAction = {
        actionType      : UnitActionType;
        callback        : () => void;
        unitForLaunch?  : BwUnit;
        unitForDrop?    : BwUnit;
        produceUnitType?: Types.UnitType;
        canProduceUnit? : boolean;
    }

    export abstract class BwActionPlanner {
        private readonly _view  = new BwActionPlannerView();

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
            { type: Notify.Type.BwCursorDragEnded, callback: this._onNotifyBwCursorDragEnded },
        ];

        public init(mapSize: Types.MapSize): ClientErrorCode {
            this._setMapSize(Helpers.deepClone(mapSize));

            this.getView().init(this);

            return ClientErrorCode.NoError;
        }
        public fastInit(mapSize: Types.MapSize): ClientErrorCode {
            this.getView().fastInit(this);

            return ClientErrorCode.NoError;
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
            return this._getWar().getCursor();
        }
        protected _getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwCursorTapped(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnTap(gridIndex);
            this._getWar().getView().tweenGridToCentralArea(gridIndex);

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

                } else if (nextState === State.RequestingUnitAttackUnit) {
                    this._setStateRequestingUnitAttackUnit(gridIndex);

                } else if (nextState === State.RequestingUnitAttackTile) {
                    this._setStateRequestingUnitAttackTile(gridIndex);

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

        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDrag(gridIndex);
            this._getWar().getView().tweenGridToCentralArea((e.data as Notify.Data.BwCursorDragged).draggedTo);

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

        private _onNotifyBwCursorDragEnded(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDragEnded(gridIndex);

            if (nextState === this.getState()) {
                // Do noting.
            } else {
                if (nextState === State.ChoosingAction) {
                    this._setStateChoosingActionOnDragEnded(gridIndex);

                } else {
                    Logger.error(`McwActionPlanner._onNotifyBwCursorDragEnded() error 10, nextState: ${nextState}`);
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
                        // if ((!existingUnit) || (existingUnit.getPlayerIndex() !== this._getPlayerIndexLoggedIn())) {
                        //     this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                        // } else {
                        //     this._setFocusUnitOnMap(existingUnit);
                        //     this._clearFocusUnitLoaded();
                        //     this._resetMovableArea();
                        //     this._resetAttackableArea();
                        //     this._resetMovePathAsShortest(gridIndex);
                        // }
                        if (existingUnit) {
                            if (this._checkCanControlUnit(existingUnit)) {
                                this._setFocusUnitOnMap(existingUnit);
                                this._clearFocusUnitLoaded();
                                this._resetMovableArea();
                                this._resetAttackableArea();
                                this._resetMovePathAsShortest(gridIndex);
                            } else {
                                this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                            }
                        } else {
                            if (this._getTileMap().getTile(gridIndex).getMaxHp() != null) {
                                this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                            } else {
                                this._updateMovePathByDestination(gridIndex);
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                if (this.getFocusUnit().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Nothing to do.
                } else {
                    const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
                    if ((existingUnit === this.getFocusUnitOnMap()) && (this.getFocusUnitLoaded())) {
                        // Nothing to do.
                    } else {
                        if (existingUnit) {
                            if (this._checkCanControlUnit(existingUnit)) {
                                this._setFocusUnitOnMap(existingUnit);
                                this._clearFocusUnitLoaded();
                                this._resetMovableArea();
                                this._resetAttackableArea();
                                this._resetMovePathAsShortest(gridIndex);
                            } else {
                                this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                            }
                        } else {
                            if (this._getTileMap().getTile(gridIndex).getMaxHp() != null) {
                                this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                            } else {
                                this._updateMovePathByDestination(gridIndex);
                            }
                        }
                    }
                }

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
                if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                } else {
                    if (this.getFocusUnit().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                        // Nothing to do.
                    } else {
                        if (this.getFocusUnitLoaded()) {
                            this._clearFocusUnitLoaded();
                            this._resetMovableArea();
                            this._resetAttackableArea();
                            this._resetMovePathAsShortest(this.getFocusUnitOnMap().getGridIndex());
                        } else {
                            // Nothing to do.
                        }
                    }
                }

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

        private _setStateChoosingActionOnDragEnded(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.MakingMovePath) {
                if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                } else {
                    Logger.error(`BwActionPlanner._setStateChoosingActionOnDragEnded() error 1, currState: ${currState}`);
                }

            } else {
                Logger.error(`BwActionPlanner._setStateChoosingActionOnDragEnded() error 2, currState: ${currState}`);
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }

        protected abstract _setStateRequestingUnitAttackUnit(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitAttackTile(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void;
        public abstract setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwActionPlannerView {
            return this._view;
        }
        protected abstract _updateView(): void;

        protected abstract _checkCanControlUnit(unit: BwUnit): boolean;

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
            this._focusUnitOnMap = null;
        }

        public getFocusUnitLoaded(): BwUnit | undefined {
            return this._focusUnitLoaded;
        }
        private _setFocusUnitLoaded(unit: BwUnit): void {
            this._focusUnitLoaded = unit;
        }
        protected _clearFocusUnitLoaded(): void {
            this._focusUnitLoaded = null;
        }

        public getAvailableDropDestinations(): GridIndex[] | undefined {
            return this._availableDropDestinations;
        }
        private _setAvailableDropDestinations(destinations: GridIndex[]): void {
            this._availableDropDestinations = destinations;
        }
        protected _clearAvailableDropDestinations(): void {
            this._availableDropDestinations = null;
        }

        public getChoosingUnitForDrop(): BwUnit | undefined {
            return this._choosingUnitForDrop;
        }
        private _setChoosingUnitForDrop(unit: BwUnit): void {
            this._choosingUnitForDrop = unit;
        }
        protected _clearChoosingUnitForDrop(): void {
            this._choosingUnitForDrop = null;
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
        protected _updateMovePathByDestination(destination: GridIndex): void {
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
            this._unitForPreviewMove = null;
            this._areaForPreviewMove = null;
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
        private _getNextStateOnTapWhenMakingMovePath(gridIndex: GridIndex): State {
            const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
            if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                if (!existingUnit) {
                    if (!User.UserModel.getSelfSettingsIsSetPathMode()) {
                        return State.ChoosingAction;
                    } else {
                        if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                            return State.ChoosingAction;
                        } else {
                            return State.MakingMovePath;
                        }
                    }
                } else {
                    if (!this._checkCanControlUnit(existingUnit)) {
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
                                if (existingUnit.getActionState() === UnitState.Idle) {
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
                            if (existingUnit) {
                                return State.RequestingUnitAttackUnit;
                            } else {
                                return State.RequestingUnitAttackTile;
                            }
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
                            if ((this._checkCanControlUnit(existingUnit)) && (existingUnit.getActionState() === UnitState.Idle)) {
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
                // return State.MakingMovePath;
                const existingUnit      = this._getUnitMap().getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getWar().getPlayerIndexInTurn();
                if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                    if (!existingUnit) {
                        if (!User.UserModel.getSelfSettingsIsSetPathMode()) {
                            return State.ChoosingAction;
                        } else {
                            if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                                return State.ChoosingAction;
                            } else {
                                return State.MakingMovePath;
                            }
                        }
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
                                    if (existingUnit.getActionState() === UnitState.Idle) {
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
                                if (existingUnit) {
                                    return State.RequestingUnitAttackUnit;
                                } else {
                                    return State.RequestingUnitAttackTile;
                                }
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
                                if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getActionState() === UnitState.Idle)) {
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
            } else if (currState === State.ChoosingAction) {
                if (this.getChosenUnitsForDrop().length) {
                    return State.ChoosingAction;
                } else {
                    return State.MakingMovePath;
                }
            } else {
                return currState;
            }
        }

        private _getNextStateOnDragEnded(gridIndex: GridIndex): State {
            const currState = this.getState();
            if (currState === State.MakingMovePath) {
                return this._getNextStateOnDragEndedWhenMakingMovePath(gridIndex);
            } else {
                return currState;
            }
        }
        private _getNextStateOnDragEndedWhenMakingMovePath(gridIndex: GridIndex): State {
            if (BwHelpers.checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
                if (!existingUnit) {
                    if (!User.UserModel.getSelfSettingsIsSetPathMode()) {
                        return State.ChoosingAction;
                    } else {
                        return State.MakingMovePath;
                    }
                } else {
                    if (!this._checkCanControlUnit(existingUnit)) {
                        return State.MakingMovePath;
                    } else {
                        const focusUnit = this.getFocusUnit();
                        if ((focusUnit === this.getFocusUnitLoaded()) && (GridIndexHelpers.checkIsEqual(gridIndex, focusUnit.getGridIndex()))) {
                            return State.MakingMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return State.ChoosingAction;
                            } else {
                                return State.MakingMovePath;
                            }
                        }
                    }
                }
            } else {
                return State.MakingMovePath;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getDataForUnitActionsPanel(): OpenDataForBwUnitActionsPanel {
            const destination           = this.getMovePathDestination();
            const actionUnitBeLoaded    = this._getActionUnitBeLoaded();
            const war                   = this._getWar();
            if (actionUnitBeLoaded.length) {
                return {
                    war,
                    destination,
                    actionList: actionUnitBeLoaded
                };
            }

            const actionUnitJoin = this._getActionUnitJoin();
            if (actionUnitJoin.length) {
                return {
                    war,
                    destination,
                    actionList: actionUnitJoin
                };
            }

            const dataList = [] as DataForUnitAction[];
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
            return {
                war,
                destination,
                actionList: dataList,
            };
        }

        protected abstract _getActionUnitBeLoaded(): DataForUnitAction[];
        protected abstract _getActionUnitJoin(): DataForUnitAction[];
        protected abstract _getActionUnitUseCoSuperPower(): DataForUnitAction[];
        protected abstract _getActionUnitUseCoPower(): DataForUnitAction[];
        protected abstract _getActionUnitLoadCo(): DataForUnitAction[];
        private _getActionUnitAttack(): DataForUnitAction[] {
            return this._createAttackableGridsAfterMove().length
                ? [{ actionType: UnitActionType.Attack, callback: () => this._setStateChoosingAttackTargetOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitCapture(): DataForUnitAction[];
        protected abstract _getActionUnitDive(): DataForUnitAction[];
        protected abstract _getActionUnitSurface(): DataForUnitAction[];
        protected abstract _getActionUnitBuildTile(): DataForUnitAction[];
        protected abstract _getActionUnitSupply(): DataForUnitAction[];
        private _getActionsUnitLaunchUnit(): DataForUnitAction[] {
            const dataList  = [] as DataForUnitAction[];
            const focusUnit = this.getFocusUnit();
            if ((focusUnit !== this.getFocusUnitLoaded()) && (this.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
                const tile = this._getTileMap().getTile(this.getMovePathDestination());
                for (const unit of focusUnit.getLoadedUnits()) {
                    if ((unit.getActionState() === UnitState.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
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
        private _getActionsUnitDropUnit(): DataForUnitAction[] {
            const focusUnit                 = this.getFocusUnit();
            const destination               = this.getMovePathDestination();
            const loadedUnits               = focusUnit.getLoadedUnits();
            const chosenUnits               = this.getChosenUnitsForDrop();
            const chosenDropDestinations    = this._getChosenDropDestinations();
            const actions                   = [] as DataForUnitAction[];
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
        private _getActionUnitLaunchFlare(): DataForUnitAction[] {
            if ((!this._getWar().getFogMap().checkHasFogCurrently()) ||
                (this.getMovePath().length !== 1)               ||
                (!this.getFocusUnit().getFlareCurrentAmmo())
            ) {
                return [];
            } else {
                return [{ actionType: UnitActionType.LaunchFlare, callback: () => this._setStateChoosingFlareDestinationOnChooseAction() }];
            }
        }
        private _getActionUnitLaunchSilo(): DataForUnitAction[] {
            return (this.getFocusUnit().checkCanLaunchSiloOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.LaunchSilo, callback: () => this._setStateChoosingSiloDestinationOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitProduceUnit(): DataForUnitAction[];
        protected abstract _getActionUnitWait(hasOtherAction: boolean): DataForUnitAction[];

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
                        unitType            : existingUnit.getUnitType(),
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
