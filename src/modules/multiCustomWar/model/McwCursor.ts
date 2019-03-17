
namespace TinyWars.MultiCustomWar {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import WarMapModel  = WarMap.WarMapModel;

    export class McwCursor {
        private _gridX      = 0;
        private _gridY      = 0;
        private _mapSize    : Types.MapSize;
        private _view       : McwCursorView;

        private _war    : McwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.McwCursorTapped,    callback: this._onNotifyMcwCursorTapped },
            { type: Notify.Type.McwCursorDragged,   callback: this._onNotifyMcwCursorDragged },
        ];

        public constructor() {
        }

        public async init(mapIndexKey: Types.MapIndexKey): Promise<McwCursor> {
            const mapData = await WarMapModel.getMapData(mapIndexKey);
            this._setMapSize({ width: mapData.mapWidth, height: mapData.mapHeight });
            this.setGridIndex({ x: 0, y: 0 });

            this._view = this._view || new McwCursorView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: McwWar): void {
            this._war = war;

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
            const data = e.data as Notify.Data.McwCursorTapped;
            this.setGridIndex(data.tappedOn);
            this.updateView();
        }
        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            const data = e.data as Notify.Data.McwCursorDragged;
            this.setGridIndex(data.draggedTo);
            this.updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWar(): McwWar {
            return this._war;
        }

        public getView(): McwCursorView {
            return this._view;
        }
        public updateView(): void {
            this.getView().updateView();
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
        public setGridIndex(gridIndex: Types.GridIndex): void {
            this._gridX = gridIndex.x;
            this._gridY = gridIndex.y;
            Notify.dispatch(Notify.Type.McwCursorGridIndexChanged);
        }
        public getGridIndex(): Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }
    }
}
