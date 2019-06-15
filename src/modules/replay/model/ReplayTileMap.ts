
namespace TinyWars.Replay {
    import WarMapModel          = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import SerializedMcTileMap  = Types.SerializedMcwTileMap;
    import SerializedMcTile     = Types.SerializedMcwTile;
    import MapSize              = Types.MapSize;

    export class ReplayTileMap {
        private _templateMap: Types.TemplateMap;
        private _mapIndexKey: Types.MapIndexKey;
        private _map        : ReplayTile[][];
        private _mapSize    : MapSize;
        private _war        : ReplayWar;

        private _view   : ReplayTileMapView;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
        }

        public async init(configVersion: number, mapIndexKey: Types.MapIndexKey, data?: SerializedMcTileMap): Promise<ReplayTileMap> {
            if (data) {
                await this._initWithSerializedData(configVersion, mapIndexKey, data)
            } else {
                await this._initWithoutSerializedData(configVersion, mapIndexKey);
            }

            this._view = this._view || new ReplayTileMapView();
            this._view.init(this);

            return this;
        }
        private async _initWithSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey, data: SerializedMcTileMap): Promise<ReplayTileMap> {
            const mapData                   = await WarMapModel.getMapData(mapIndexKey);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<ReplayTile>(mapWidth);

            for (const tileData of data.tiles || []) {
                map[tileData.gridX!][tileData.gridY!] = new ReplayTile().init(tileData, configVersion);
            }

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    if (!map[x][y]) {
                        const index = x + y * mapWidth;
                        map[x][y] = new ReplayTile().init({
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
        private async _initWithoutSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<ReplayTileMap> {
            const mapData                   = await WarMapModel.getMapData(mapIndexKey);
            const { mapWidth, mapHeight }   = mapData;
            const map                       = Helpers.createEmptyMap<ReplayTile>(mapWidth);

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const index = x + y * mapWidth;
                    map[x][y] = new ReplayTile().init({
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

        public startRunning(war: ReplayWar): void {
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

        public serialize(): SerializedMcTileMap | undefined {
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
            return tilesData.length ? { tiles: tilesData } : undefined;
        }
        public serializeForPlayer(playerIndex: number): SerializedMcTileMap | undefined {
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
            return tilesData.length ? { tiles: tilesData } : undefined;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): ReplayTileMapView {
            return this._view;
        }

        public forEachTile(func: (mcTile: ReplayTile) => any): void {
            for (const column of this._map) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): ReplayTile {
            return this._map[gridIndex.x][gridIndex.y];
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): MapSize {
            return this._mapSize;
        }

        public getTemplateMap(): Types.TemplateMap {
            return this._templateMap;
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

    function checkShouldSerializeTile(tileData: SerializedMcTile, mapData: Types.TemplateMap, posIndex: number): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != mapData.tileBases[posIndex])
            || (tileData.objectViewId           != mapData.tileObjects[posIndex]);
    }
}

