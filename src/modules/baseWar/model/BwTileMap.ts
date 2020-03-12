
namespace TinyWars.BaseWar {
    import WarMapModel          = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import SerializedBwTileMap  = Types.SerializedTileMap;
    import MapSize              = Types.MapSize;
    import GridIndex            = Types.GridIndex;

    export abstract class BwTileMap {
        private _mapRawData : ProtoTypes.IMapRawData;
        private _map        : BwTile[][];
        private _mapSize    : MapSize;
        private _war        : BwWar;

        private _view   : BwTileMapView;

        protected abstract _getBwTileClass(): new () => BwTile;
        protected abstract _getViewClass(): new () => BwTileMapView;

        public async init(configVersion: string, mapFileName: string, data?: SerializedBwTileMap): Promise<BwTileMap> {
            if (mapFileName) {
                await this._initWithMapFileName(configVersion, mapFileName, data);
            } else {
                await this._initWithoutMapFileName(configVersion, data);
            }

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }
        private async _initWithMapFileName(configVersion: string, mapFileName: string, data?: SerializedBwTileMap): Promise<BwTileMap> {
            const mapData                   = await WarMapModel.getMapRawData(mapFileName);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<BwTile>(mapWidth);

            for (const tileData of data ? data.tiles || [] : []) {
                map[tileData.gridX!][tileData.gridY!] = new (this._getBwTileClass())().init(tileData, configVersion);
            }

            for (const tileData of mapData.tileDataList || []) {
                const x = tileData.gridX!;
                const y = tileData.gridY!;
                if (!map[x][y]) {
                    map[x][y] = new (this._getBwTileClass())().init(tileData as Types.SerializedTile, configVersion);
                }
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
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }
        private async _initWithoutMapFileName(configVersion: string, data?: SerializedBwTileMap): Promise<BwTileMap> {
            const mapSize = getMapSizeWithSerializedMap(data);
            if (!mapSize) {
                Logger.error("BwTileMap._initWithoutMapFileName() invalid data!!");
            } else {
                const { width: mapWidth, height: mapHeight }    = mapSize;
                const map                                       = Helpers.createEmptyMap<BwTile>(mapWidth);

                for (const tileData of data ? data.tiles || [] : []) {
                    map[tileData.gridX!][tileData.gridY!] = new (this._getBwTileClass())().init(tileData, configVersion);
                }

                this._map = map;
                this._setMapSize(mapWidth, mapHeight);
            }

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

        private _getMapRawData(): ProtoTypes.IMapRawData {
            return this._mapRawData;
        }

        public getInitialObjectViewId(gridIndex: GridIndex): number | null {
            const mapRawData = this._getMapRawData();
            return mapRawData
                ? mapRawData.tileObjects[gridIndex.x + gridIndex.y * this.getMapSize().width]
                : null;
        }
        public getInitialBaseViewId(gridIndex: GridIndex): number | null {
            const mapRawData = this._getMapRawData();
            return mapRawData
                ? mapRawData.tileBases[gridIndex.x + gridIndex.y * this.getMapSize().width]
                : null;
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

    function getMapSizeWithSerializedMap(data: SerializedBwTileMap | null | undefined): MapSize | null {
        const tiles = data ? data.tiles : null;
        if ((!tiles) || (!tiles.length)) {
            return null;
        } else {
            let width   = 0;
            let height  = 0;
            for (const tile of tiles) {
                width   = Math.max(width, tile.gridX || 0);
                height  = Math.max(height, tile.gridY || 0);
            }
            return ((width > 0) && (height > 0))
                ? { width, height }
                : null;
        }
    }
}
