
namespace TinyWars.MultiCustomWar {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import WarMapModel  = WarMap.WarMapModel;

    export class McwCursor {
        private _gridX      = 0;
        private _gridY      = 0;
        private _mapSize    : Types.MapSize;
        private _view       : McwCursorView;

        private _war    : McwWar;

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
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
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

        public setGridX(x: number): void {
            this._gridX = x;
            this.getView().updateView();
        }
        public getGridX(): number {
            return this._gridX;
        }
        public setGridY(y: number): void {
            this._gridY = y;
            this.getView().updateView();
        }
        public getGridY(): number {
            return this._gridY;
        }
        public setGridIndex(gridIndex: Types.GridIndex): void {
            this._gridX = gridIndex.x;
            this._gridY = gridIndex.y;
        }
        public getGridIndex(): Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }
    }
}
