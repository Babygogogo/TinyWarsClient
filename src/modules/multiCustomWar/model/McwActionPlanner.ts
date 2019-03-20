
namespace TinyWars.MultiCustomWar {
    import WarMapModel      = WarMap.WarMapModel;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Logger           = Utility.Logger;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import UnitState        = Types.UnitState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MovePathNode     = Types.MovePathNode;

    export class McwActionPlanner {
        private _view               : McwActionPlannerView;
        private _war                : McwWar;
        private _unitMap            : McwUnitMap;
        private _tileMap            : McwTileMap;
        private _turnManager        : McwTurnManager;
        private _cursor             : McwCursor;
        private _mapSize            : Types.MapSize;
        private _playerIndexLoggedIn: number;

        private _state  : State;

        private _focusUnitOnMap     : McwUnit;
        private _focusUnitLoaded    : McwUnit;
        private _chosenUnitsForDrop : McwUnit[] = [];
        private _movableArea        : MovableArea;
        private _attackableArea     : AttackableArea;
        private _movePath           : MovePathNode[] = [];

        private _gridIndexForTileProduceUnit    : GridIndex;
        private _unitsForPreviewAttack          = new Map<number, McwUnit>();
        private _areaForPreviewAttack           : AttackableArea = [];
        private _unitForPreviewMove             : McwUnit;
        private _areaForPreviewMove             : MovableArea;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.McwCursorTapped,    callback: this._onNotifyMcwCursorTapped },
            { type: Notify.Type.McwCursorDragged,   callback: this._onNotifyMcwCursorDragged },
        ];

        public constructor() {
        }

        public async init(mapIndexKey: Types.MapIndexKey): Promise<McwActionPlanner> {
            const mapData = await WarMapModel.getMapData(mapIndexKey);
            this._setMapSize({ width: mapData.mapWidth, height: mapData.mapHeight });

            this._view = this._view || new McwActionPlannerView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: McwWar): void {
            this._war                   = war;
            this._unitMap               = war.getUnitMap();
            this._tileMap               = war.getTileMap();
            this._turnManager           = war.getTurnManager();
            this._cursor                = war.getField().getCursor();
            this._playerIndexLoggedIn   = war.getPlayerIndexLoggedIn();

            this.setStateIdle();

            Notify.addEventListeners(this._notifyListeners, this, undefined, 1);
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
            const gridIndex = (e.data as Notify.Data.McwCursorTapped).tappedOn;
            const nextState = this._getNextStateOnTap(gridIndex);
            if (nextState === State.Idle) {
                this.setStateIdle();

            } else if (nextState === State.MakingMovePathForUnitOnMap) {
                this._setStateMakingMovePathForUnitOnMapOnTap(gridIndex);

            } else if (nextState === State.ChoosingActionForUnitOnMap) {
                this._setStateChoosingActionForUnitOnMapOnTap(gridIndex);

            } else if (nextState === State.MakingMovePathForUnitLoaded) {
                this._setStateMakingMovePathForUnitLoadedOnTap(gridIndex);

            } else if (nextState === State.ChoosingActionForUnitLoaded) {
                this._setStateChoosingActionForUnitLoadedOnTap(gridIndex);

            } else if (nextState === State.ChoosingDropDestination) {
                this._setStateChoosingDropDestinationOnTap(gridIndex);

            } else if (nextState === State.ChoosingProductionTarget) {
                this._setStateChoosingProductionTargetOnTap(gridIndex);

            } else if (nextState === State.PreviewingAttackableArea) {
                this._setStatePreviewingAttackableAreaOnTap(gridIndex);

            } else if (nextState === State.PreviewingMovableArea) {
                this._setStatePreviewingMovableAreaOnTap(gridIndex);

            } else {
                Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() invalid nextState!`, nextState);
            }
        }

        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            const gridIndex = (e.data as Notify.Data.McwCursorDragged).draggedTo;
            const nextState = this._getNextStateOnDrag(gridIndex);
            if (nextState === State.Idle) {
                this.setStateIdle();

            } else if (nextState === State.MakingMovePathForUnitOnMap) {
                this._setStateMakingMovePathForUnitOnMapOnDrag(gridIndex);

            } else if (nextState === State.ChoosingActionForUnitOnMap) {
                this._setStateChoosingActionForUnitOnMapOnDrag(gridIndex);

            } else if (nextState === State.MakingMovePathForUnitLoaded) {
                this._setStateMakingMovePathForUnitLoadedOnDrag(gridIndex);

            } else if (nextState === State.ChoosingActionForUnitLoaded) {
                this._setStateChoosingActionForUnitLoadedOnDrag(gridIndex);

            } else if (nextState === State.ChoosingDropDestination) {
                this._setStateChoosingDropDestinationOnDrag(gridIndex);

            } else if (nextState === State.ChoosingProductionTarget) {
                this._setStateChoosingProductionTargetOnDrag(gridIndex);

            } else if (nextState === State.PreviewingAttackableArea) {
                this._setStatePreviewingAttackableAreaOnDrag(gridIndex);

            } else if (nextState === State.PreviewingMovableArea) {
                this._setStatePreviewingMovableAreaOnDrag(gridIndex);

            } else {
                Logger.error(`McwActionPlanner._onNotifyMcwCursorTapped() invalid nextState!`, nextState);
            }

            // const currState = this.getState();
            // if (currState === State.ChoosingProductionTarget) {
            //     if (this._checkCanSetStateIdle()) {
            //         this.setStateIdle();
            //     }
            // } else if (currState === State.MakingMovePathForUnitOnMap) {
            //     this._updateMovePathAndView(gridIndex);
            // } else {
            //     // TODO
            // }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getState(): State {
            return this._state;
        }
        private _setState(state: State): void {
            this._state = state;
            Logger.log(`McwActionPlanner._setState() ${state}`);
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }

        public setStateIdle(): void {
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitLoaded();
            this._clearChosenUnitsForDrop();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            delete this._gridIndexForTileProduceUnit;

            this._setState(State.Idle);
            this._updateView();
        }

        private _setStateMakingMovePathForUnitOnMapOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.MakingMovePathForUnitOnMap) {
                if (this.getFocusUnitOnMap().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do noting.
                } else {
                    const targetUnit = this._unitMap.getUnitOnMap(gridIndex);
                    if ((!targetUnit) || (targetUnit.getPlayerIndex() !== this._playerIndexLoggedIn)) {
                        this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                    } else {
                        this._setFocusUnitOnMap(targetUnit);
                        this._resetMovableArea();
                        this._resetAttackableArea();
                        this._resetMovePathAsShortest(gridIndex);
                    }
                }

            } else if (currState === State.ChoosingActionForUnitOnMap) {
                // Do nothing.

            } else if (currState === State.MakingMovePathForUnitLoaded) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ChoosingActionForUnitLoaded) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                this._setFocusUnitOnMap(this._unitMap.getUnitOnMap(gridIndex));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                delete this._gridIndexForTileProduceUnit;

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
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnTap() error 4, currState: ${currState}`);
            }

            this._setState(State.MakingMovePathForUnitOnMap);
            this._updateView();
        }
        private _setStateMakingMovePathForUnitOnMapOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.MakingMovePathForUnitOnMap) {
                if (this.getFocusUnitOnMap().checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do noting.
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
                            if (this.getFocusUnitOnMap().checkCanAttackTargetAfterMovePath(newPath, gridIndex)) {
                                this._setMovePath(newPath);
                            } else {
                                // Do nothing.
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingActionForUnitOnMap) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePathForUnitLoaded) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingActionForUnitLoaded) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 8, currState: ${currState}`);

            } else {
                Logger.error(`McwActionPlanner._setStateMakingMovePathForUnitOnMapOnDrag() error 9, currState: ${currState}`);
            }

            this._setState(State.MakingMovePathForUnitOnMap);
            this._updateView();
        }

        private _setStateChoosingActionForUnitOnMapOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.MakingMovePathForUnitOnMap) {
                this._updateMovePathByDestination(gridIndex);

            } else if (currState === State.ChoosingActionForUnitOnMap) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePathForUnitLoaded) {
                this._clearFocusUnitLoaded();

            } else if (currState === State.ChoosingActionForUnitLoaded) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                this._clearFocusUnitLoaded();

            } else if (currState === State.ChoosingProductionTarget) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.PreviewingAttackableArea) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.PreviewingMovableArea) {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 6, currState: ${currState}`);

            } else {
                Logger.error(`McwActionPlanner._setStateChoosingActionForUnitOnMapOnTap() error 7, currState: ${currState}`);
            }

            this._setState(State.ChoosingActionForUnitOnMap);
            this._updateView();
        }
        private _setStateChoosingActionForUnitOnMapOnDrag(gridIndex: GridIndex): void {
            // TODO
            this._setState(State.ChoosingActionForUnitOnMap);
            this._updateView();
        }

        private _setStateMakingMovePathForUnitLoadedOnTap(beginningGridIndex: GridIndex): void {
            // TODO
            this._setState(State.MakingMovePathForUnitLoaded);
        }
        private _setStateMakingMovePathForUnitLoadedOnDrag(beginningGridIndex: GridIndex): void {
            // TODO
            this._setState(State.MakingMovePathForUnitLoaded);
        }

        private _setStateChoosingActionForUnitLoadedOnTap(gridIndex: GridIndex): void {
            // TODO
            this._setState(State.ChoosingActionForUnitLoaded);
        }
        private _setStateChoosingActionForUnitLoadedOnDrag(gridIndex: GridIndex): void {
            // TODO
            this._setState(State.ChoosingActionForUnitLoaded);
        }

        private _setStateChoosingDropDestinationOnTap(gridIndex: GridIndex): void {
            // TODO
            this._setState(State.ChoosingDropDestination);
        }
        private _setStateChoosingDropDestinationOnDrag(gridIndex: GridIndex): void {
            // TODO
            this._setState(State.ChoosingDropDestination);
        }

        private _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitLoaded();
            this._clearChosenUnitsForDrop();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            this._gridIndexForTileProduceUnit = { x: gridIndex.x, y: gridIndex.y };

            this._setState(State.ChoosingProductionTarget);
            this._updateView();
            // TODO: open the production panel.
        }
        private _setStateChoosingProductionTargetOnDrag(gridIndex: GridIndex): void {
            Logger.error(`McwActionPlanner._setStateChoosingProductionTargetOnDrag() this function should not be called!`);
        }

        private _setStatePreviewingAttackableAreaOnTap(gridIndex: GridIndex): void {
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitLoaded();
            this._clearChosenUnitsForDrop();
            this._addUnitForPreviewAttackableArea(this._unitMap.getUnitOnMap(gridIndex));
            this._clearDataForPreviewingMovableArea();
            delete this._gridIndexForTileProduceUnit;

            this._setState(State.PreviewingAttackableArea);
            this._updateView();
        }
        private _setStatePreviewingAttackableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStatePreviewingMovableAreaOnTap(gridIndex: GridIndex): void {
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitLoaded();
            this._clearChosenUnitsForDrop();
            this._clearDataForPreviewingAttackableArea();
            this._setUnitForPreviewingMovableArea(this._unitMap.getUnitOnMap(gridIndex));
            delete this._gridIndexForTileProduceUnit;

            this._setState(State.PreviewingMovableArea);
            this._updateView();
        }
        private _setStatePreviewingMovableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwActionPlannerView {
            return this._view;
        }
        private _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if ((currState === State.ChoosingActionForUnitLoaded) || (currState === State.ChoosingActionForUnitOnMap)) {
                McwUnitActionsPanel.show(this._generateDataForUnitActionsPanel());
            } else {
                McwUnitActionsPanel.hide();
            }
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        private _checkIsWaitingForServerResponse(): boolean {
            const state = this.getState();
            return (state === State.RequestingPlayerActivateSkill)
                || (state === State.RequestingPlayerBeginTurn)
                || (state === State.RequestingPlayerDestroyUnit)
                || (state === State.RequestingPlayerEndTurn)
                || (state === State.RequestingPlayerSurrender)
                || (state === State.RequestingPlayerVoteForDraw)
                || (state === State.RequestingTileProduceUnit)
                || (state === State.RequestingUnitAttack)
                || (state === State.RequestingUnitBeLoaded)
                || (state === State.RequestingUnitBuild)
                || (state === State.RequestingUnitCapture)
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

        public getFocusUnitOnMap(): McwUnit | undefined {
            return this._focusUnitOnMap;
        }
        private _setFocusUnitOnMap(unit: McwUnit): void {
            this._focusUnitOnMap = unit;
        }

        public getFocusUnitLoaded(): McwUnit | undefined {
            return this._focusUnitLoaded;
        }
        private _setFocusUnitLoaded(unit: McwUnit): void {
            this._focusUnitLoaded = unit;
        }
        private _clearFocusUnitLoaded(): void {
            delete this._focusUnitLoaded;
        }

        public getChosenUnitsForDrop(): McwUnit[] {
            return this._chosenUnitsForDrop;
        }
        private _pushBackChosenUnitForDrop(unit: McwUnit): void {
            this._chosenUnitsForDrop.push(unit);
        }
        private _popBackChosenUnitForDrop(): void {
            this._chosenUnitsForDrop.length -= 1;
        }
        private _clearChosenUnitsForDrop(): void {
            this._chosenUnitsForDrop.length = 0;
        }

        private _resetMovableArea(): void {
            const unit = this.getFocusUnitOnMap();
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
            const unit                  = this.getFocusUnitOnMap();
            const canAttakAfterMove     = unit.checkCanAttackAfterMove();
            const isLoaded              = unit.getLoaderUnitId() != null;
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            this._attackableArea        = McwHelpers.createAttackableArea(
                this.getMovableArea(),
                this.getMapSize(),
                unit.getMinAttackRange(),
                unit.getMaxAttackRange(),
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    if (!hasAmmo) {
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
                const focusUnit     = this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
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
        public getUnitsForPreviewingAttackableArea(): Map<number, McwUnit> {
            return this._unitsForPreviewAttack;
        }
        public getAreaForPreviewingAttack(): AttackableArea {
            return this._areaForPreviewAttack;
        }
        private _clearDataForPreviewingAttackableArea(): void {
            this._unitsForPreviewAttack.clear();
            this._areaForPreviewAttack.length = 0;
        }
        private _addUnitForPreviewAttackableArea(unit: McwUnit): void {
            const canAttakAfterMove     = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (unit.getPrimaryWeaponCurrentAmmo() > 0) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const newArea               = McwHelpers.createAttackableArea(
                McwHelpers.createMovableArea(
                    unit.getGridIndex(),
                    unit.getFinalMoveRange(),
                    gridIndex => this._getMoveCost(gridIndex, unit)
                ),
                mapSize,
                unit.getMinAttackRange(),
                unit.getMaxAttackRange(),
                (moveGridIndex, attackGridIndex) =>
                    (hasAmmo)                                                                                   &&
                    ((canAttakAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)))
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
        public getUnitForPreviewingMovableArea(): McwUnit | undefined {
            return this._unitForPreviewMove;
        }
        public getAreaForPreviewingMove(): MovableArea {
            return this._areaForPreviewMove;
        }
        private _clearDataForPreviewingMovableArea(): void {
            delete this._unitForPreviewMove;
            delete this._areaForPreviewMove;
        }
        private _setUnitForPreviewingMovableArea(unit: McwUnit): void {
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
            if (this._checkIsWaitingForServerResponse()) {
                return currState;
            } else {
                switch (currState) {
                    case State.Idle                         : return this._getNextStateOnTapWhenIdle(gridIndex);
                    case State.MakingMovePathForUnitOnMap   : return this._getNextStateOnTapWhenMakingMovePathForUnitOnMap(gridIndex);
                    case State.ChoosingActionForUnitOnMap   : return this._getNextStateOnTapWhenChoosingActionForUnitOnMap(gridIndex);
                    case State.MakingMovePathForUnitLoaded  : return this._getNextStateOnTapWhenMakingMovePathForUnitLoaded(gridIndex);
                    case State.ChoosingActionForUnitLoaded  : return this._getNextStateOnTapWhenChoosingActionForUnitLoaded(gridIndex);
                    case State.ChoosingDropDestination      : return this._getNextStateOnTapWhenChoosingDropDestination(gridIndex);
                    case State.ChoosingProductionTarget     : return this._getNextStateOnTapWhenChoosingProductionTarget(gridIndex);
                    case State.PreviewingAttackableArea     : return this._getNextStateOnTapWhenPreviewingAttackableArea(gridIndex);
                    case State.PreviewingMovableArea        : return this._getNextStateOnTapWhenPreviewingMovableArea(gridIndex);
                    default:
                        Logger.error(`McwActionPlanner._getNextStateOnTap() invalid currState!`);
                        return State.Idle;
                }
            }
        }
        private _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            if (this._war.getIsRunningAction()) {
                return State.Idle;
            } else {
                const turnManager       = this._turnManager;
                const unit              = this._unitMap.getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._playerIndexLoggedIn;
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._tileMap.getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.getPlayerIndex() === selfPlayerIndex) && (tile.checkIsUnitProducer())) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                        return State.MakingMovePathForUnitOnMap;
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
        private _getNextStateOnTapWhenMakingMovePathForUnitOnMap(gridIndex: GridIndex): State {
            const targetUnit        = this._unitMap.getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._playerIndexLoggedIn;
            if (checkAreaHasGrid(this.getMovableArea(), gridIndex)) {
                if (!targetUnit) {
                    return State.ChoosingActionForUnitOnMap;
                } else {
                    if (targetUnit.getPlayerIndex() !== selfPlayerIndex) {
                        if (targetUnit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.ChoosingProductionTarget;
                        }
                    } else {
                        const focusUnit = this.getFocusUnitOnMap();
                        if ((targetUnit.checkCanJoinUnit(focusUnit)) || (targetUnit.checkCanLoadUnit(focusUnit))) {
                            return State.ChoosingActionForUnitOnMap;
                        } else {
                            if (targetUnit.getState() === UnitState.Idle) {
                                return State.MakingMovePathForUnitOnMap;
                            } else {
                                return State.Idle;
                            }
                        }
                    }
                }
            } else {
                if (this._checkCanFocusUnitOnMapAttackTarget(gridIndex)) {
                    if (GridIndexHelpers.checkIsEqual(gridIndex, this._cursor.getGridIndex())) {
                        return State.RequestingUnitAttack;
                    } else {
                        return State.MakingMovePathForUnitOnMap;
                    }
                } else {
                    if (!targetUnit) {
                        return State.Idle;
                    } else {
                        if ((targetUnit.getPlayerIndex() === selfPlayerIndex) && (targetUnit.getState() === UnitState.Idle)) {
                            return State.MakingMovePathForUnitOnMap;
                        } else {
                            if (targetUnit.checkHasWeapon()) {
                                return State.PreviewingAttackableArea;
                            } else {
                                return State.ChoosingProductionTarget;
                            }
                        }
                    }
                }
            }
        }
        private _getNextStateOnTapWhenChoosingActionForUnitOnMap(gridIndex: GridIndex): State {
            // TODO
            return State.Idle;
        }
        private _getNextStateOnTapWhenMakingMovePathForUnitLoaded(gridIndex: GridIndex): State {
            // TODO
            return State.Idle;
        }
        private _getNextStateOnTapWhenChoosingActionForUnitLoaded(gridIndex: GridIndex): State {
            // TODO
            return State.Idle;
        }
        private _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            // TODO
            return State.Idle;
        }
        private _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(this._cursor.getGridIndex(), gridIndex)) {
                return State.Idle;
            } else {
                const turnManager       = this._turnManager;
                const unit              = this._unitMap.getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._playerIndexLoggedIn;
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._tileMap.getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.getPlayerIndex() === selfPlayerIndex) && (tile.checkIsUnitProducer())) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                        return State.MakingMovePathForUnitOnMap;
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
            const selfPlayerIndex   = this._playerIndexLoggedIn;
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._tileMap.getTile(gridIndex);
                if ((isSelfInTurn) && (tile.getPlayerIndex() === selfPlayerIndex) && (tile.checkIsUnitProducer())) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePathForUnitOnMap;
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
            const selfPlayerIndex   = this._playerIndexLoggedIn;
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._tileMap.getTile(gridIndex);
                if ((isSelfInTurn) && (tile.getPlayerIndex() === selfPlayerIndex) && (tile.checkIsUnitProducer())) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePathForUnitOnMap;
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
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getMoveCost(targetGridIndex: GridIndex, movingUnit: McwUnit): number | undefined {
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
                const focusUnit = this.getFocusUnitOnMap();
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

        private _generateDataForUnitActionsPanel(): DataForUnitActionRenderer[] {
            return [{name: "AAA", callback: () => {}}];
        }
    }

    function checkAreaHasGrid(area: AttackableArea | MovableArea, gridIndex: GridIndex): boolean {
        const { x, y } = gridIndex;
        return (!!area[x]) && (!!area[x][y]);
    }
}