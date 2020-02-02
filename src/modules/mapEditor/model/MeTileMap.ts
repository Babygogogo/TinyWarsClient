
namespace TinyWars.MapEditor {
    import WarMapModel          = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import SerializedBwTileMap  = Types.SerializedTileMap;
    import SerializedTile     = Types.SerializedTile;
    import MapSize              = Types.MapSize;

    type SerializedMeTileMap = {
        tileObjects : number[];
        tileBases   : number[];
        tileDataList: SerializedTile[];
    };

    export class MeTileMap {
        private _mapRawData : ProtoTypes.IMapRawData;
        private _map        : MeTile[][];
        private _mapSize    : MapSize;
        private _war        : MeWar;

        private _view   : MeTileMapView;

        public init(configVersion: string, mapRawData: Types.MapRawData): MeTileMap {
            this._initWithMapRawData(configVersion, mapRawData);

            this._view = this._view || new MeTileMapView();
            this._view.init(this);

            return this;
        }
        private _initWithMapRawData(configVersion: string, mapRawData: Types.MapRawData): MeTileMap {
            const { mapWidth, mapHeight }   = mapRawData;
            const map                       = Helpers.createEmptyMap<MeTile>(mapWidth);

            for (const tileData of mapRawData.tileDataList || []) {
                const x = tileData.gridX!;
                const y = tileData.gridY!;
                if (!map[x][y]) {
                    map[x][y] = (new MeTile()).init(tileData as Types.SerializedTile, configVersion);
                }
            }

            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const index = x + y * mapWidth;
                    map[x][y] = new MeTile().init({
                        baseViewId  : mapRawData.tileBases[index],
                        objectViewId: mapRawData.tileObjects[index],
                        gridX       : x,
                        gridY       : y,
                    }, configVersion);
                }
            }

            this._mapRawData    = mapRawData;
            this._map           = map;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }

        public startRunning(war: MeWar): void {
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

        public serialize(): SerializedMeTileMap {
            const { width, height } = this.getMapSize();
            const gridsCount        = width * height;
            const tileBases         = new Array(gridsCount).fill(0);
            const tileObjects       = new Array(gridsCount).fill(0);
            const tileDataList      : SerializedTile[] = [];
            this.forEachTile(tile => {
                const { x, y }      = tile.getGridIndex();
                const index         = x + y * width;
                tileBases[index]    = tile.getBaseViewId() || 0;
                tileObjects[index]  = tile.getObjectViewId() || 0;

                const data = tile.serialize();
                (data) && (tileDataList.push(data));
            });

            return {
                tileBases,
                tileObjects,
                tileDataList,
            };
        }

        public getWar(): MeWar {
            return this._war;
        }
        protected _getMap(): MeTile[][] {
            return this._map;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): MeTileMapView {
            return this._view;
        }

        public forEachTile(func: (t: MeTile) => any): void {
            for (const column of this._map) {
                for (const tile of column) {
                    func(tile);
                }
            }
        }
        public getTile(gridIndex: Types.GridIndex): MeTile {
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

    function checkShouldSerializeTile(tileData: SerializedTile, mapData: Types.MapRawData, posIndex: number): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != mapData.tileBases[posIndex])
            || (tileData.objectViewId           != mapData.tileObjects[posIndex]);
    }
}
