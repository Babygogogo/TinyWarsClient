
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
    import MovePathNode     = Types.MovePathNode;

    export class McwActionPlanner {
        private _view               : McwActionPlannerView;
        private _war                : McwWar;
        private _unitMap            : McwUnitMap;
        private _tileMap            : McwTileMap;
        private _turnManager        : McwTurnManager;
        private _mapSize            : Types.MapSize;
        private _playerIndexLoggedIn: number;

        private _state                          : State;
        private _isWaitingForServerResponse     : boolean;
        private _focusUnitOnMap                 : McwUnit;
        private _focusUnitsLoaded               : McwUnit[] = [];
        private _unitsForPreviewAttackableArea  = new Map<number, McwUnit>();
        private _areaForPreviewAttack           : AttackableArea = [];
        private _unitForPreviewMove             : McwUnit;
        private _areaForPreviewMove             : MovableArea;
        private _movableArea                    : MovableArea;
        private _attackableArea                 : AttackableArea;
        private _movePath                       : MovePathNode[] = [];

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
                } else if (this._checkCanSetStateChooseProductionTarget(gridIndex)) {
                    this._setStateChooseProductionTarget(gridIndex);
                } else if (this._checkCanSetStatePreviewingAttackableArea(gridIndex)) {
                    this._setStatePreviewingAttackableArea(gridIndex);
                } else if (this._checkCanSetStatePreviewingMovableArea(gridIndex)) {
                    this._setStatePreviewingMovableArea(gridIndex);
                } else if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }

            } else if (currState === State.MakingMovePathForUnitOnMap) {
                if (this._checkCanSetStateMakingMovePathForUnitOnMap(gridIndex)) {
                    this._setStateMakingMovePathForUnitOnMap(gridIndex);
                } else if (this._checkCanSetStateChooseProductionTarget(gridIndex)) {
                    this._setStateChooseProductionTarget(gridIndex);
                } else if (this._checkCanSetStatePreviewingAttackableArea(gridIndex)) {
                    this._setStatePreviewingAttackableArea(gridIndex);
                } else if (this._checkCanSetStatePreviewingMovableArea(gridIndex)) {
                    this._setStatePreviewingMovableArea(gridIndex);
                } else if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }

            } else if (currState === State.ChoosingProductionTarget) {
                if (this._checkCanSetStateMakingMovePathForUnitOnMap(gridIndex)) {
                    this._setStateMakingMovePathForUnitOnMap(gridIndex);
                } else if (this._checkCanSetStateChooseProductionTarget(gridIndex)) {
                    this._setStateChooseProductionTarget(gridIndex);
                } else if (this._checkCanSetStatePreviewingAttackableArea(gridIndex)) {
                    this._setStatePreviewingAttackableArea(gridIndex);
                } else if (this._checkCanSetStatePreviewingMovableArea(gridIndex)) {
                    this._setStatePreviewingMovableArea(gridIndex);
                } else if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }

            } else if (currState === State.PreviewingAttackableArea) {
                if (this._checkCanSetStateMakingMovePathForUnitOnMap(gridIndex)) {
                    this._setStateMakingMovePathForUnitOnMap(gridIndex);
                } else if (this._checkCanSetStateChooseProductionTarget(gridIndex)) {
                    this._setStateChooseProductionTarget(gridIndex);
                } else if (this._checkCanSetStatePreviewingAttackableArea(gridIndex)) {
                    this._setStatePreviewingAttackableArea(gridIndex);
                } else if (this._checkCanSetStatePreviewingMovableArea(gridIndex)) {
                    this._setStatePreviewingMovableArea(gridIndex);
                } else if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }

            } else if (currState === State.PreviewingMovableArea) {
                if (this._checkCanSetStateMakingMovePathForUnitOnMap(gridIndex)) {
                    this._setStateMakingMovePathForUnitOnMap(gridIndex);
                } else if (this._checkCanSetStateChooseProductionTarget(gridIndex)) {
                    this._setStateChooseProductionTarget(gridIndex);
                } else if (this._checkCanSetStatePreviewingMovableArea(gridIndex)) {
                    this._setStatePreviewingMovableArea(gridIndex);
                } else if (this._checkCanSetStatePreviewingAttackableArea(gridIndex)) {
                    this._setStatePreviewingAttackableArea(gridIndex);
                } else if (this._checkCanSetStateIdle()) {
                    this.setStateIdle();
                }

            } else {
                // TODO
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
                this._updateMovePathAndView(data.draggedTo);
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
            this._state = State.Idle;
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitsLoaded();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStateIdle(): boolean {
            return this.getState() !== State.Idle;
        }

        private _setStateMakingMovePathForUnitOnMap(beginningGridIndex: GridIndex): void {
            this._state = State.MakingMovePathForUnitOnMap;

            const focusUnit = this._unitMap.getUnitOnMap(beginningGridIndex);
            if (this.getFocusUnitOnMap() !== focusUnit) {
                this._setFocusUnitOnMap(focusUnit);
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePath(beginningGridIndex);
            }
            this._clearFocusUnitsLoaded();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStateMakingMovePathForUnitOnMap(gridIndex: GridIndex): boolean {
            const turnManager = this._turnManager;
            if ((this._war.getIsRunningAction())                                ||
                (this._getIsWaitingForServerResponse())                         ||
                (turnManager.getPhaseCode() !== TurnPhaseCode.Main)             ||
                (turnManager.getPlayerIndexInTurn() !== this._playerIndexLoggedIn)) {
                return false;
            } else {
                const state     = this.getState();
                const unit      = this._unitMap.getUnitOnMap(gridIndex);
                const canMove   = (unit != null)
                    && (unit.getState() === UnitState.Idle)
                    && (unit.getPlayerIndex() === this._playerIndexLoggedIn);
                if (state === State.MakingMovePathForUnitOnMap) {
                    return (canMove) && (unit !== this.getFocusUnitOnMap());
                } else if (state === State.ChoosingProductionTarget) {
                    return canMove;
                } else if (state === State.PreviewingAttackableArea) {
                    return canMove;
                } else if (state === State.PreviewingMovableArea) {
                    return canMove;
                } else if (state === State.Idle) {
                    return canMove;
                } else {
                    // TODO
                    return false;
                }
            }
        }

        private _setStateChooseProductionTarget(gridIndex: GridIndex): void {
            // TODO
        }
        private _checkCanSetStateChooseProductionTarget(gridIndex: GridIndex): boolean {
            // TODO
            return false;
        }

        private _setStatePreviewingAttackableArea(gridIndex: GridIndex): void {
            this._state = State.PreviewingAttackableArea;
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitsLoaded();
            this._addUnitForPreviewAttackableArea(this._unitMap.getUnitOnMap(gridIndex));
            this._clearDataForPreviewingMovableArea();

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStatePreviewingAttackableArea(gridIndex: GridIndex): boolean {
            const unit          = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndex   = this._playerIndexLoggedIn;
            if ((this._war.getIsRunningAction())                                                                ||
                (this._getIsWaitingForServerResponse())                                                         ||
                (!unit)                                                                                         ||
                ((!unit.checkHasPrimaryWeapon()) && (!unit.checkHasSecondaryWeapon()))                          ||
                ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndex) && (playerIndex === this._turnManager.getPlayerIndexInTurn()))
            ) {
                return false;
            } else {
                const state = this.getState();
                if (state === State.MakingMovePathForUnitOnMap) {
                    // TODO
                    return true;
                } else if (state === State.ChoosingProductionTarget) {
                    return true;
                } else if (state === State.PreviewingAttackableArea) {
                    return !this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId());
                } else if (state === State.PreviewingMovableArea) {
                    return true;
                } else if (state === State.Idle) {
                    return true;
                } else {
                    // TODO
                    return false;
                }
            }
        }

        private _setStatePreviewingMovableArea(gridIndex: GridIndex): void {
            this._state = State.PreviewingMovableArea;
            this._setFocusUnitOnMap(undefined);
            this._clearFocusUnitsLoaded();
            this._clearDataForPreviewingAttackableArea();
            this._setUnitForPreviewingMovableArea(this._unitMap.getUnitOnMap(gridIndex));

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }
        private _checkCanSetStatePreviewingMovableArea(gridIndex: GridIndex): boolean {
            const unit          = this._unitMap.getUnitOnMap(gridIndex);
            const playerIndex   = this._playerIndexLoggedIn;
            if ((this._war.getIsRunningAction())                                                                ||
                (this._getIsWaitingForServerResponse())                                                         ||
                (!unit)                                                                                         ||
                ((unit.getState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndex) && (playerIndex === this._turnManager.getPlayerIndexInTurn()))
            ) {
                return false;
            } else {
                const hasWeapon = unit.checkHasPrimaryWeapon() || unit.checkHasSecondaryWeapon();
                const state     = this.getState();
                if (state === State.MakingMovePathForUnitOnMap) {
                    // TODO
                    return !hasWeapon;
                } else if (state === State.ChoosingProductionTarget) {
                    return !hasWeapon;
                } else if (state === State.PreviewingAttackableArea) {
                    return (!hasWeapon) || (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId()));
                } else if (state === State.PreviewingMovableArea) {
                    return this.getUnitForPreviewingMovableArea() !== unit;
                } else if (state === State.Idle) {
                    return !hasWeapon;
                } else {
                    // TODO
                    return false;
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
            const units = this._focusUnitsLoaded;
            return units[units.length - 1];
        }
        private _pushBackFocusUnitLoaded(unit: McwUnit): void {
            this._focusUnitsLoaded.push(unit);
        }
        private _popBackFocusUnitLoaded(): void {
            this._focusUnitsLoaded.length -= 1;
        }
        private _clearFocusUnitsLoaded(): void {
            this._focusUnitsLoaded.length = 0;
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
        private _resetMovePath(destination: GridIndex): void {
            this._movePath = McwHelpers.createShortestMovePath(this.getMovableArea(), destination);
        }
        public getMovePath(): MovePathNode[] {
            return this._movePath;
        }
        private _updateMovePathAndView(destination: GridIndex): void {
            const { x, y }      = destination;
            const movableArea   = this.getMovableArea();
            const currPath      = this.getMovePath();
            if ((movableArea[x]) && (movableArea[x][y]) && (!GridIndexHelpers.checkIsEqual(currPath[currPath.length - 1], destination))) {
                if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                    this._resetMovePath(destination);
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
        // Functions for previewing attackable area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitsForPreviewingAttackableArea(): Map<number, McwUnit> {
            return this._unitsForPreviewAttackableArea;
        }
        public getAreaForPreviewingAttack(): AttackableArea {
            return this._areaForPreviewAttack;
        }
        private _clearDataForPreviewingAttackableArea(): void {
            this._unitsForPreviewAttackableArea.clear();
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

            this._unitsForPreviewAttackableArea.set(unit.getUnitId(), unit);
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
