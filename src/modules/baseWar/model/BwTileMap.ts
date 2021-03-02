
namespace TinyWars.BaseWar {
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import MapSize              = Types.MapSize;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialTileMap       = WarSerialization.ISerialTileMap;
    import ISerialTile          = WarSerialization.ISerialTile;

    export abstract class BwTileMap {
        private _map        : BwTile[][];
        private _mapSize    : MapSize;
        private _war        : BwWar;

        private readonly _view  = new BwTileMapView();

        protected abstract _getBwTileClass(): new () => BwTile;

        public init(
            data                    : ISerialTileMap,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: Types.MapSizeAndMaxPlayerIndex,
        ): BwTileMap | undefined {
            const tiles = data.tiles;
            if (tiles == null) {
                Logger.error(`BwTileMap.init() empty tiles.`);
                return undefined;
            }

            const mapWidth  = mapSizeAndMaxPlayerIndex.mapWidth;
            const mapHeight = mapSizeAndMaxPlayerIndex.mapHeight;
            const map       = Helpers.createEmptyMap<BwTile>(mapWidth);
            const mapSize   : MapSize = {
                width   : mapWidth,
                height  : mapHeight,
            };
            for (const tileData of tiles) {
                const gridIndex = BwHelpers.convertGridIndex(tileData.gridIndex);
                if (gridIndex == null) {
                    Logger.error(`BwTileMap.init() empty gridIndex.`);
                    return undefined;
                }

                if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                    Logger.error(`BwTileMap.init() invalid gridIndex.`);
                    return undefined;
                }

                const tile = new (this._getBwTileClass())().init(tileData, configVersion);
                if (tile == null) {
                    Logger.error(`BwTileMap.init() empty tile.`);
                    return undefined;
                }
                map[gridIndex.x][gridIndex.y] = tile;
            }

            this._setMap(map);
            this._setMapSize(mapWidth, mapHeight);

            this.getView().init(this);

            return this;
        }
        public async fastInit(
            data                    : ISerialTileMap | null | undefined,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: Types.MapSizeAndMaxPlayerIndex,
        ): Promise<BwTileMap> {
            const map = this._getMap();
            for (const tileData of data ? data.tiles || [] : []) {
                const gridIndex = tileData.gridIndex;
                map[gridIndex.x][gridIndex.y].fastInit(tileData, configVersion);
            }

            this.getView().fastInit(this);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
            this.forEachTile(tile => tile.startRunning(war));
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.forEachTile(tile => tile.startRunningView());
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        public serialize(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwTileMap.serialize() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwTileMap.serialize() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serialize();
                    if (tileData == null) {
                        Logger.error(`BwTileMap.serialize() empty tileData.`);
                        return undefined;
                    }

                    tilesData.push(tileData);
                }
            }
            return { tiles: tilesData };
        }
        public serializeForSimulation(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwTileMap.serializeForSimulation() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwTileMap.serializeForSimulation() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForSimulation();
                    if (tileData == null) {
                        Logger.error(`BwTileMap.serializeForSimulation() empty tileData.`);
                        return undefined;
                    }

                    tilesData.push(tileData);
                }
            }
            return { tiles: tilesData };
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return this._war;
        }

        private _setMap(map: BwTile[][]): void {
            this._map = map;
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
            for (const column of this._getMap()) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): BwTile {
            return this._getMap()[gridIndex.x][gridIndex.y];
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): MapSize {
            return this._mapSize;
        }

        public getTilesCount(tileType: Types.TileType, playerIndex: number): number {
            let count = 0;
            for (const column of this._getMap()) {
                for (const tile of column) {
                    if ((tile.getType() === tileType) && (tile.getPlayerIndex() === playerIndex)) {
                        ++ count;
                    }
                }
            }
            return count;
        }

        public getTotalIncomeForPlayer(playerIndex: number): number | undefined {
            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwTileMap.getTotalIncomeForPlayer() empty map.`);
                return undefined;
            }

            let totalIncome = 0;
            for (const column of map) {
                for (const tile of column) {
                    const income = tile.getIncomeForPlayer(playerIndex);
                    if (income == null) {
                        Logger.error(`BwTileMap.getTotalIncomeForPlayer() empty income.`);
                        return undefined;
                    }

                    totalIncome += income;
                }
            }

            return totalIncome;
        }
    }
}
