
namespace TinyWars.BaseWar {
    import WarMapModel          = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import SerializedBwTileMap  = Types.SerializedTileMap;
    import SerializedBwTile     = Types.SerializedTile;
    import MapSize              = Types.MapSize;

    export abstract class BwTileMap {
        private _mapRawData : ProtoTypes.IMapRawData;
        private _mapFileName: string;
        private _map        : BwTile[][];
        private _mapSize    : MapSize;
        private _war        : BwWar;

        private _view   : BwTileMapView;

        protected abstract _getBwTileClass(): new () => BwTile;
        protected abstract _getViewClass(): new () => BwTileMapView;

        public async init(configVersion: string, mapFileName: string, data?: SerializedBwTileMap): Promise<BwTileMap> {
            if (data) {
                await this._initWithSerializedData(configVersion, mapFileName, data)
            } else {
                await this._initWithoutSerializedData(configVersion, mapFileName);
            }

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }
        private async _initWithSerializedData(configVersion: string, mapFileName: string, data: SerializedBwTileMap): Promise<BwTileMap> {
            const mapData                   = await WarMapModel.getMapRawData(mapFileName);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<BwTile>(mapWidth);

            for (const tileData of data.tiles || []) {
                map[tileData.gridX!][tileData.gridY!] = new (this._getBwTileClass())().init(tileData, configVersion);
            }

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    if (!map[x][y]) {
                        const index = x + y * mapWidth;
                        map[x][y] = new (this._getBwTileClass())().init({
                            baseViewId  : mapData.tileBases[index],
                            objectViewId: mapData.tileObjects[index],
                            gridX       : x,
                            gridY       : y,
                        }, configVersion);
                    }
                }
            }

            this._mapRawData    = mapData;
            this._mapFileName   = mapFileName;
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }
        private async _initWithoutSerializedData(configVersion: string, mapFileName: string): Promise<BwTileMap> {
            const mapData                   = await WarMapModel.getMapRawData(mapFileName);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<BwTile>(mapWidth);

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const index = x + y * mapWidth;
                    map[x][y] = new (this._getBwTileClass())().init({
                        baseViewId  : mapData.tileBases[index],
                        objectViewId: mapData.tileObjects[index],
                        gridX       : x,
                        gridY       : y,
                    }, configVersion);
                }
            }

            this._mapRawData    = mapData;
            this._mapFileName   = mapFileName;
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._war = war;
            this.forEachTile(tile => tile.startRunning(war));
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.forEachTile(tile => tile.startRunningView());
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        public getWar(): BwWar {
            return this._war;
        }
        protected _getMap(): BwTile[][] {
            return this._map;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwTileMapView {
            return this._view;
        }

        public forEachTile(func: (t: BwTile) => any): void {
            for (const column of this._map) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): BwTile {
            return this._map[gridIndex.x][gridIndex.y];
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): MapSize {
            return this._mapSize;
        }

        public getMapRawData(): ProtoTypes.IMapRawData {
            return this._mapRawData;
        }

        public getTilesCount(tileType: Types.TileType, playerIndex: number): number {
            let count = 0;
            for (const column of this._map) {
                for (const tile of column) {
                    if ((tile.getType() === tileType) && (tile.getPlayerIndex() === playerIndex)) {
                        ++ count;
                    }
                }
            }
            return count;
        }
    }

    function checkShouldSerializeTile(tileData: SerializedBwTile, mapData: Types.MapRawData, posIndex: number): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != mapData.tileBases[posIndex])
            || (tileData.objectViewId           != mapData.tileObjects[posIndex]);
    }
}
