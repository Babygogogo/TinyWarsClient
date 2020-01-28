
namespace TinyWars.MapEditor {
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;
    import GridIndex    = Types.GridIndex;

    export class MeCursor {
        private _gridX              = 0;
        private _gridY              = 0;
        private _previousGridIndex  : GridIndex;
        private _mapSize            : Types.MapSize;
        private _isMovableByTouches = true;
        private _view               : MeCursorView;

        private _war    : MeWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwCursorTapped,                 callback: this._onNotifyBwCursorTapped },
            { type: Notify.Type.BwCursorDragged,                callback: this._onNotifyBwCursorDragged },
        ];

        public init(mapRawData: Types.MapRawData): MeCursor {
            this._setMapSize({ width: mapRawData.mapWidth, height: mapRawData.mapHeight });
            this.setGridIndex({ x: 0, y: 0 });

            this._view = this._view || new MeCursorView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
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
        private _onNotifyBwCursorTapped(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.Data.BwCursorTapped;
                this.setGridIndex(data.tappedOn);
                this.updateView();
            }
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.Data.BwCursorDragged;
                this.setGridIndex(data.draggedTo);
                this.updateView();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWar(): MeWar {
            return this._war;
        }

        public getView(): MeCursorView {
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
            Notify.dispatch(Notify.Type.BwCursorGridIndexChanged);
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
