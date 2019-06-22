
namespace TinyWars.Replay {
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;
    import WarMapModel  = WarMap.WarMapModel;
    import GridIndex    = Types.GridIndex;

    export class ReplayCursor {
        private _gridX              = 0;
        private _gridY              = 0;
        private _previousGridIndex  : GridIndex;
        private _mapSize            : Types.MapSize;
        private _isMovableByTouches = true;
        private _view               : ReplayCursorView;

        private _war    : ReplayWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.McwCursorTapped,                callback: this._onNotifyMcwCursorTapped },
            { type: Notify.Type.McwCursorDragged,               callback: this._onNotifyMcwCursorDragged },
            { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyMcwActionPlannerStateChanged },
        ];

        public constructor() {
        }

        public async init(mapIndexKey: Types.MapIndexKey): Promise<ReplayCursor> {
            const mapData = await WarMapModel.getMapData(mapIndexKey);
            this._setMapSize({ width: mapData.mapWidth, height: mapData.mapHeight });
            this.setGridIndex({ x: 0, y: 0 });

            this._view = this._view || new ReplayCursorView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: ReplayWar): void {
            this._war = war;

            Notify.addEventListeners(this._notifyListeners, this, undefined, 10);
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
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.Data.McwCursorTapped;
                this.setGridIndex(data.tappedOn);
                this.updateView();
            }
        }
        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.Data.McwCursorDragged;
                this.setGridIndex(data.draggedTo);
                this.updateView();
            }
        }
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            this.updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWar(): ReplayWar {
            return this._war;
        }

        public getView(): ReplayCursorView {
            return this._view;
        }
        public updateView(): void {
            this.getView().updateView();
        }

        public setVisibleForConForNormal(visible: boolean): void {
            this.getView().setVisibleForConForNormal(visible);
        }
        public setVisibleForConForTarget(visible: boolean): void {
            this.getView().setVisibleForConForTarget(visible);
        }
        public setVisibleForConForSiloArea(visible: boolean): void {
            this.getView().setVisibleForConForSiloArea(visible);
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        public getGridX(): number {
            return this._gridX;
        }
        public getGridY(): number {
            return this._gridY;
        }
        public setGridIndex(gridIndex: GridIndex): void {
            this._setPreviousGridIndex(this.getGridIndex());

            this._gridX = gridIndex.x;
            this._gridY = gridIndex.y;
            Notify.dispatch(Notify.Type.McwCursorGridIndexChanged);
        }
        public getGridIndex(): GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }

        private _setPreviousGridIndex(gridIndex: GridIndex): void {
            this._previousGridIndex = gridIndex;
        }
        public getPreviousGridIndex(): GridIndex | undefined {
            return this._previousGridIndex;
        }

        public setIsMovableByTouches(isMovable: boolean): void {
            this._isMovableByTouches = isMovable;
        }
        public getIsMovableByTouches(): boolean {
            return this._isMovableByTouches;
        }
    }
}
