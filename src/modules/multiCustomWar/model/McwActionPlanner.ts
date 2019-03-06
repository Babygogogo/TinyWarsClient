
namespace TinyWars.MultiCustomWar {
    import WarMapModel      = WarMap.WarMapModel;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import UnitState        = Types.UnitState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;

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
        private _focusUnit                  : McwUnit;
        private _launchUnitId               : number;
        private _unitsForPreviewAttack      : McwUnit[] = [];
        private _unitsForPreviewMove        : McwUnit[] = [];
        private _gridsForPreviewAttack      : GridIndex[] = [];
        private _gridsForPreviewMove        : GridIndex[] = [];

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
            if (!this._getIsWaitingForServerResponse()) {
                const data      = e.data as Notify.Data.McwCursorTapped;
                const currState = this.getState();
                const gridIndex = data.tappedOn;

                if (currState === State.Idle) {
                    if (this._checkCanSetStateMakingMovePath(gridIndex)) {
                        this._setStateMakingMovePath(gridIndex);
                        this._updateView();
                    }
                }
            }
        }

        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            const data = e.data as Notify.Data.McwCursorDragged;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getState(): State {
            return this._state;
        }

        public setStateIdle(): void {
            this._state                 = State.Idle;
            this._focusUnit             = undefined;
            this._launchUnitId          = undefined;
            this._unitsForPreviewAttack = [];
            this._unitsForPreviewMove   = [];
            this._gridsForPreviewAttack = [];
            this._gridsForPreviewMove   = [];

            this._updateView();
            Notify.dispatch(Notify.Type.McwActionPlannerStateChanged);
        }

        private _setStateMakingMovePath(beginningGridIndex: GridIndex, launchUnitId?: number): void {
            this._state = State.MakingMovePath;

            const unit = this._unitMap.getUnit(beginningGridIndex, launchUnitId);

        }

        private _checkCanSetStateMakingMovePath(gridIndex: GridIndex, unitId?: number): boolean {
            const turnManager = this._turnManager;
            if ((turnManager.getPhaseCode() !== TurnPhaseCode.Main) ||
                (turnManager.getPlayerIndexInTurn() !== this._playerIndexLoggedIn)) {
                return false;
            } else {
                const unit = this._unitMap.getUnit(gridIndex, unitId);
                return (unit != null)
                    && (unit.getState() === UnitState.Idle)
                    && (unit.getPlayerIndex() === this._playerIndexLoggedIn);
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
    }
}
