

namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import WarMapModel          = WarMap.WarMapModel;
    import Helpers              = Utility.Helpers;
    import SerializedMcTileMap  = Types.SerializedMcTileMap;
    import SerializedMcTile     = Types.SerializedMcTile;
    import MapSize              = Types.MapSize;

    export class McTileMap {
        private _templateMap: Types.TemplateMap;
        private _mapIndexKey: Types.MapIndexKey;
        private _map        : McTile[][];
        private _mapSize    : MapSize;
        private _war        : McWar;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
        }

        public async init(configVersion: number, mapIndexKey: Types.MapIndexKey, data?: SerializedMcTileMap): Promise<McTileMap> {
            return data
                ? this._initWithSerializedData(configVersion, mapIndexKey, data)
                : this._initWithoutSerializedData(configVersion, mapIndexKey);
        }
        private async _initWithSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey, data: SerializedMcTileMap): Promise<McTileMap> {
            const mapData                   = await WarMapModel.getMapData(mapIndexKey);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<McTile>(mapWidth);

            for (const tileData of data.tiles || []) {
                map[tileData.gridX!][tileData.gridY!] = new McTile().init(tileData, configVersion);
            }

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    if (!map[x][y]) {
                        const index = x + y * mapWidth;
                        map[x][y] = new McTile().init({
                            baseViewId  : mapData.tileBases[index],
                            objectViewId: mapData.tileObjects[index],
                            gridX       : x,
                            gridY       : y,
                        }, configVersion);
                    }
                }
            }

            this._templateMap   = mapData;
            this._mapIndexKey   = mapIndexKey;
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }
        private async _initWithoutSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<McTileMap> {
            const mapData                   = await WarMapModel.getMapData(mapIndexKey);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<McTile>(mapWidth);

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const index = x + y * mapWidth;
                    map[x][y] = new McTile().init({
                        baseViewId  : mapData.tileBases[index],
                        objectViewId: mapData.tileObjects[index],
                        gridX       : x,
                        gridY       : y,
                    }, configVersion);
                }
            }

            this._templateMap   = mapData;
            this._mapIndexKey   = mapIndexKey;
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }

        public startRunning(war: McWar): void {
            this._war = war;
            this.forEachTile(tile => tile.startRunning(war));
        }

        public serialize(): SerializedMcTileMap {
            const mapData           = this._templateMap;
            const { width, height } = this.getMapSize();
            const map               = this._map;
            const tilesData: SerializedMcTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serialize();
                    (checkShouldSerializeTile(tileData, mapData, x + y * width)) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : {};
        }
        public serializeForPlayer(playerIndex: number): SerializedMcTileMap {
            const mapData           = this._templateMap;
            const { width, height } = this.getMapSize();
            const map               = this._map;
            const tilesData: SerializedMcTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForPlayer(playerIndex);
                    (checkShouldSerializeTile(tileData, mapData, x + y * width)) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : {};
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public forEachTile(func: (mcTile: McTile) => any): void {
            for (const column of this._map) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): McTile {
            return this._map[gridIndex.x][gridIndex.y];
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): MapSize {
            return this._mapSize;
        }
    }

    function checkShouldSerializeTile(tileData: SerializedMcTile, mapData: Types.TemplateMap, posIndex: number): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != mapData.tileBases[posIndex])
            || (tileData.objectViewId           != mapData.tileObjects[posIndex]);
    }
}

