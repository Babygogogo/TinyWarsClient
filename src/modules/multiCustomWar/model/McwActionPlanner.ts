
namespace TinyWars.MultiCustomWar {
    import WarMapModel  = WarMap.WarMapModel;
    import Types        = Utility.Types;

    export class McwActionPlanner {
        private _view   : McwActionPlannerView;
        private _war    : McwWar;
        private _unitMap: McwUnitMap;
        private _tileMap: McwTileMap;
        private _mapSize: Types.MapSize;

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
            this._war       = war;
            this._unitMap   = war.getUnitMap();
            this._tileMap   = war.getTileMap();
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        public getView(): McwActionPlannerView {
            return this._view;
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }
    }
}
