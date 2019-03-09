
namespace TinyWars.MultiCustomWar {
    import WarMapModel      = WarMap.WarMapModel;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import UnitState        = Types.UnitState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MovePathGrid     = Types.MovePathNode;

    export class McwActionPlanner {
        private _view               : McwActionPlannerView;
        private _war                : McwWar;
        private _unitMap            : McwUnitMap;
        private _tileMap            : McwTileMap;
        private _turnManager        : McwTurnManager;
        private _mapSize            : Types.MapSize;
        private _playerIndexLoggedIn: number;

        private _state                      : State;
        private _isWaitingForServerResponse : boolean;
        private _focusUnitOnMap             : McwUnit;
        private _focusUnitsLoaded           : McwUnit[] = [];
        private _unitsForPreviewAttack      : McwUnit[] = [];
        private _unitsForPreviewMove        : McwUnit[] = [];
        private _gridsForPreviewAttack      : GridIndex[] = [];
        private _gridsForPreviewMove        : GridIndex[] = [];
        private _movableArea                : MovableArea;
        private _attackableArea             : AttackableArea;
        private _movePath                   : MovePathGrid[] = [];

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
            this._playerIndexLoggedIn   = war.getPlayerIndexLoggedIn();

            this.setStateIdle();
            this._setIsWaitingForServerResponse(false);

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
            const data      = e.data as Notify.Data.McwCursorTapped;
            const currState = this.getState();
            const gridIndex = data.tappedOn;

            if (currState === State.Idle) {
                if (this._checkCanSetStateMakingMovePathForUnitOnMap(gridIndex)) {
                    this._setStateMakingMovePathForUnitOnMap(gridIndex);
                }
            } else if (currState === State.MakingMovePathForUnitOnMap) {
                if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }
            }
        }

        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            const data      = e.data as Notify.Data.McwCursorDragged;
            const currState = this.getState();
            if (currState === State.ChoosingProductionTarget) {
                if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }
            } else if (currState === State.MakingMovePathForUnitOnMap) {
                this._updateMovePath(data.draggedTo);
            } else {
                // TODO
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getState(): State {
            return this._state;
        }

        public setStateIdle(): void {
            this._state                 = State.Idle;
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitsLoaded();
            this._unitsForPreviewAttack = [];
            this._unitsForPreviewMove   = [];
            this._gridsForPreviewAttack = [];
            this._gridsForPreviewMove   = [];

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStateIdle(): boolean {
            return true;
        }

        private _setStateMakingMovePathForUnitOnMap(beginningGridIndex: GridIndex): void {
            const currState = this.getState();
            this._state = State.MakingMovePathForUnitOnMap;

            const focusUnit = this._unitMap.getUnitOnMap(beginningGridIndex);
            if (this.getFocusUnitOnMap() !== focusUnit) {
                this._setFocusUnitOnMap(focusUnit);
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePath(beginningGridIndex);
            }
            this._clearFocusUnitsLoaded();

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStateMakingMovePathForUnitOnMap(gridIndex: GridIndex): boolean {
            const turnManager = this._turnManager;
            if ((this._war.getIsRunningAction())                                ||
                (this._isWaitingForServerResponse)                              ||
                (turnManager.getPhaseCode() !== TurnPhaseCode.Main)             ||
                (turnManager.getPlayerIndexInTurn() !== this._playerIndexLoggedIn)) {
                return false;
            } else {
                const state = this.getState();
                if (state === State.Idle) {
                    const unit = this._unitMap.getUnitOnMap(gridIndex);
                    return (unit != null)
                        && (unit.getState() === UnitState.Idle)
                        && (unit.getPlayerIndex() === this._playerIndexLoggedIn);
                } else {
                    // TODO
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwActionPlannerView {
            return this._view;
        }
        private _updateView(): void {
            this.getView().updateView();
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        private _getIsWaitingForServerResponse(): boolean {
            return this._isWaitingForServerResponse;
        }
        private _setIsWaitingForServerResponse(isWaiting: boolean) {
            this._isWaitingForServerResponse = isWaiting;
        }

        public getFocusUnitOnMap(): McwUnit | undefined {
            return this._focusUnitOnMap;
        }
        private _setFocusUnitOnMap(unit: McwUnit): void {
            this._focusUnitOnMap = unit;
        }

        public getAllFocusUnitsLoaded(): McwUnit[] {
            return this._focusUnitsLoaded;
        }
        public getFocusUnitLoaded(): McwUnit | undefined {
            const units = this.getAllFocusUnitsLoaded();
            return units[units.length - 1];
        }
        private _pushBackFocusUnitLoaded(unit: McwUnit): void {
            this.getAllFocusUnitsLoaded().push(unit);
        }
        private _popBackFocusUnitLoaded(): void {
            this.getAllFocusUnitsLoaded().length -= 1;
        }
        private _clearFocusUnitsLoaded(): void {
            this.getAllFocusUnitsLoaded().length = 0;
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
        private _resetMovePath(beginningGridIndex: GridIndex): void {
            this._movePath = [{
                x               : beginningGridIndex.x,
                y               : beginningGridIndex.y,
                totalMoveCost   : 0,
            }];
        }
        public getMovePath(): MovePathGrid[] {
            return this._movePath;
        }
        private _updateMovePath(destination: GridIndex): void {
            const { x, y }      = destination;
            const movableArea   = this.getMovableArea();
            const currPath      = this.getMovePath();
            if ((movableArea[x]) && (movableArea[x][y]) && (!GridIndexHelpers.checkIsEqual(currPath[currPath.length - 1], destination))) {
                if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                    this._movePath = McwHelpers.createShortestMovePath(movableArea, destination);
                }

                this.getView().resetConForMovePath();
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
    }
}
