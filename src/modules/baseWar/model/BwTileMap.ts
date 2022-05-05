
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsBwTileMapView    from "../view/BwTileMapView";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwTile           from "./BwTile";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import MapSize          = Twns.Types.MapSize;
    import WarSerialization = CommonProto.WarSerialization;
    import ISerialTileMap   = WarSerialization.ISerialTileMap;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ClientErrorCode  = Twns.ClientErrorCode;
    import GameConfig       = Config.GameConfig;

    export class BwTileMap {
        private _map?                   : Twns.BaseWar.BwTile[][];
        private _mapSize?               : MapSize;
        private _locationVisibleFlags   = 0;
        private _war?                   : Twns.BaseWar.BwWar;

        private readonly _view  = new Twns.BaseWar.BwTileMapView();

        public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
            data                    : Twns.Types.Undefinable<ISerialTileMap>;
            gameConfig              : GameConfig;
            mapSize                 : MapSize;
            playersCountUnneutral   : number;
        }): void {
            if (data == null) {
                throw Twns.Helpers.newError(`Empty data.`, ClientErrorCode.BwTileMap_Init_00);
            }

            const tiles     = Twns.Helpers.getExisted(data.tiles, ClientErrorCode.BwTileMap_Init_01);
            const mapWidth  = mapSize.width;
            const mapHeight = mapSize.height;
            if ((!Twns.WarHelpers.WarCommonHelpers.checkIsValidMapSize(mapSize)) ||
                (mapWidth * mapHeight !== tiles.length)
            ) {
                throw Twns.Helpers.newError(`Invalid mapSize.`, ClientErrorCode.BwTileMap_Init_02);
            }

            const map = Twns.Helpers.createEmptyMap<Twns.BaseWar.BwTile>(mapWidth, mapHeight);
            for (const tileData of tiles) {
                const gridIndex = Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex), ClientErrorCode.BwTileMap_Init_03);
                if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                    throw Twns.Helpers.newError(`The gridIndex is not inside the map.`, ClientErrorCode.BwTileMap_Init_04);
                }

                const gridX = gridIndex.x;
                const gridY = gridIndex.y;
                if (map[gridX][gridY]) {
                    throw Twns.Helpers.newError(`Duplicated gridIndex: ${gridX}, ${gridY}`, ClientErrorCode.BwTileMap_Init_05);
                }

                const tile = new Twns.BaseWar.BwTile();
                tile.init(tileData, gameConfig);

                const playerIndex = tile.getPlayerIndex();
                if ((playerIndex == null)                                   ||
                    (playerIndex < Twns.CommonConstants.WarNeutralPlayerIndex)   ||
                    (playerIndex > playersCountUnneutral)
                ) {
                    throw Twns.Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTileMap_Init_06);
                }

                map[gridX][gridY] = tile;
            }

            this._setMap(map);
            this._setMapSize(mapWidth, mapHeight);

            this.getView().init(this);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
            data                    : Twns.Types.Undefinable<ISerialTileMap>;
            gameConfig              : GameConfig;
            mapSize                 : MapSize;
            playersCountUnneutral   : number;
        }): void {
            const map = this._getMap();
            for (const tileData of data ? data.tiles || [] : []) {
                const gridIndex = Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
                map[gridIndex.x][gridIndex.y].fastInit(tileData, gameConfig);
            }

            this.getView().fastInit(this);
        }

        public startRunning(war: Twns.BaseWar.BwWar): void {
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
        public serializeForCreateSfw(): ISerialTileMap {
            const map               = this._getMap();
            const { width, height } = this.getMapSize();
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    tilesData.push(map[x][y].serializeForCreateSfw());
                }
            }
            return { tiles: tilesData };
        }
        public serializeForCreateMfr(): ISerialTileMap {
            const map               = this._getMap();
            const { width, height } = this.getMapSize();
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    tilesData.push(map[x][y].serializeForCreateMfr());
                }
            }
            return { tiles: tilesData };
        }

        private _setWar(war: Twns.BaseWar.BwWar): void {
            this._war = war;
        }
        public getWar(): Twns.BaseWar.BwWar {
            return Twns.Helpers.getExisted(this._war);
        }

        private _setMap(map: Twns.BaseWar.BwTile[][]): void {
            this._map = map;
        }
        protected _getMap(): Twns.BaseWar.BwTile[][] {
            return Twns.Helpers.getExisted(this._map);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): Twns.BaseWar.BwTileMapView {
            return this._view;
        }

        private _forEachTile(func: (t: Twns.BaseWar.BwTile) => any): void {
            for (const column of this._getMap()) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Twns.Types.GridIndex): Twns.BaseWar.BwTile {
            return this._getMap()[gridIndex.x][gridIndex.y];
        }
        public getAllTiles(): Twns.BaseWar.BwTile[] {
            const tileArray: Twns.BaseWar.BwTile[] = [];
            this._forEachTile(tile => tileArray.push(tile));
            return tileArray;
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): MapSize {
            return Twns.Helpers.getExisted(this._mapSize);
        }

        public getTilesCount(playerIndex: number): number {
            let count = 0;
            for (const column of this._getMap()) {
                for (const tile of column) {
                    if (tile.getPlayerIndex() === playerIndex) {
                        ++ count;
                    }
                }
            }
            return count;
        }

        public getTotalIncomeForPlayer(playerIndex: number): number {
            let totalIncome = 0;
            for (const column of this._getMap()) {
                for (const tile of column) {
                    totalIncome += tile.getIncomeForPlayer(playerIndex);
                }
            }

            return totalIncome;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for locations.
        ////////////////////////////////////////////////////////////////////////////////
        private _setLocationVisibleFlags(flags: number): void {
            this._locationVisibleFlags = flags;
        }
        public setLocationVisibleFlags(flags: number): void {
            this._setLocationVisibleFlags(flags);
            this.getView().resetLocationLayer();
            Twns.Notify.dispatch(Twns.Notify.NotifyType.BwTileMapLocationVisibleSet);
        }
        public getLocationVisibleFlags(): number {
            return this._locationVisibleFlags;
        }

        /** @param locationId range: [1-30] */
        public getIsLocationVisible(locationId: number): boolean {
            return !!((this.getLocationVisibleFlags() >> (locationId - 1)) & 1);
        }
        /** @param locationId range: [1-30] */
        public setIsLocationVisible(locationId: number, isVisible: boolean): void {
            if (isVisible) {
                this.setLocationVisibleFlags(this.getLocationVisibleFlags() | (1 << (locationId - 1)));
            } else {
                this.setLocationVisibleFlags(this.getLocationVisibleFlags() & ~(1 << (locationId - 1)));
            }
        }
        public setAllLocationVisible(isVisible: boolean): void {
            for (let locationId = Twns.CommonConstants.MapMinLocationId; locationId <= Twns.CommonConstants.MapMaxLocationId; ++locationId) {
                if (isVisible) {
                    this._setLocationVisibleFlags(this.getLocationVisibleFlags() | (1 << (locationId - 1)));
                } else {
                    this._setLocationVisibleFlags(this.getLocationVisibleFlags() & ~(1 << (locationId - 1)));
                }
            }
            this.getView().resetLocationLayer();
            Twns.Notify.dispatch(Twns.Notify.NotifyType.BwTileMapLocationVisibleSet);
        }
    }
}

// export default TwnsBwTileMap;
