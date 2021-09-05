
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsBwTileMapView    from "../view/BwTileMapView";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import TwnsBwTile           from "./BwTile";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwTileMap {
    import MapSize          = Types.MapSize;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialTileMap   = WarSerialization.ISerialTileMap;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwWar            = TwnsBwWar.BwWar;
    import BwTileMapView    = TwnsBwTileMapView.BwTileMapView;
    import BwTile           = TwnsBwTile.BwTile;

    export class BwTileMap {
        private _map        : BwTile[][];
        private _mapSize    : MapSize;
        private _war        : BwWar;

        private readonly _view  = new BwTileMapView();

        public init({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : ISerialTileMap;
            configVersion           : string;
            mapSize                 : MapSize;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            if (data == null) {
                return ClientErrorCode.BwTileMapInit00;
            }

            const tiles = data.tiles;
            if (tiles == null) {
                return ClientErrorCode.BwTileMapInit01;
            }

            const mapWidth  = mapSize.width;
            const mapHeight = mapSize.height;
            if ((!WarCommonHelpers.checkIsValidMapSize(mapSize)) ||
                (mapWidth * mapHeight !== tiles.length)
            ) {
                return ClientErrorCode.BwTileMapInit02;
            }

            const map = Helpers.createEmptyMap<BwTile>(mapWidth, mapHeight);
            for (const tileData of tiles) {
                const gridIndex = GridIndexHelpers.convertGridIndex(tileData.gridIndex);
                if (gridIndex == null) {
                    return ClientErrorCode.BwTileMapInit03;
                }

                if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                    return ClientErrorCode.BwTileMapInit04;
                }

                const gridX = gridIndex.x;
                const gridY = gridIndex.y;
                if (map[gridX][gridY]) {
                    return ClientErrorCode.BwTileMapInit05;
                }

                const tile      = new BwTile();
                const tileError = tile.init(tileData, configVersion);
                if (tileError) {
                    return tileError;
                }

                const playerIndex = tile.getPlayerIndex();
                if ((playerIndex == null)                                   ||
                    (playerIndex < CommonConstants.WarNeutralPlayerIndex)   ||
                    (playerIndex > playersCountUnneutral)
                ) {
                    return ClientErrorCode.BwTileMapInit06;
                }

                map[gridX][gridY] = tile;
            }

            this._setMap(map);
            this._setMapSize(mapWidth, mapHeight);

            this.getView().init(this);

            return ClientErrorCode.NoError;
        }
        public fastInit({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : ISerialTileMap | null | undefined;
            configVersion           : string;
            mapSize                 : MapSize;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            const map = this._getMap();
            for (const tileData of data ? data.tiles || [] : []) {
                const gridIndex = tileData.gridIndex;
                map[gridIndex.x][gridIndex.y].fastInit(tileData, configVersion);
            }

            this.getView().fastInit(this);

            return ClientErrorCode.NoError;
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
            this._forEachTile(tile => tile.startRunning(war));
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this._forEachTile(tile => tile.startRunningView());
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        public serialize(): ISerialTileMap {
            const map               = this._getMap();
            const { width, height } = this.getMapSize();
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    tilesData.push(map[x][y].serialize());
                }
            }
            return { tiles: tilesData };
        }
        public serializeForCreateSfw(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwTileMap.serializeForCreateSfw() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwTileMap.serializeForCreateSfw() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForCreateSfw();
                    if (tileData == null) {
                        Logger.error(`BwTileMap.serializeForCreateSfw() empty tileData.`);
                        return undefined;
                    }

                    tilesData.push(tileData);
                }
            }
            return { tiles: tilesData };
        }
        public serializeForCreateMfr(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwTileMap.serializeForCreateMfr() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwTileMap.serializeForCreateMfr() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForCreateMfr();
                    if (tileData == null) {
                        Logger.error(`BwTileMap.serializeForCreateMfr() empty tileData.`);
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

        private _forEachTile(func: (t: BwTile) => any): void {
            for (const column of this._getMap()) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): BwTile {
            return this._getMap()[gridIndex.x][gridIndex.y];
        }
        public getAllTiles(): BwTile[] {
            const tileArray: BwTile[] = [];
            this._forEachTile(tile => tileArray.push(tile));
            return tileArray;
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

export default TwnsBwTileMap;
