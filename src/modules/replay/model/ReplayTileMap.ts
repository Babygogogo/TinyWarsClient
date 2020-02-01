
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import SerializedBwTileMap  = Types.SerializedTileMap;
    import SerializedBwTile     = Types.SerializedTile;

    export class ReplayTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ReplayTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return ReplayTileMapView;
        }

        public serialize(): SerializedBwTileMap | undefined {
            const { width, height } = this.getMapSize();
            const map               = this._getMap();
            const tilesData: SerializedBwTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = (map[x][y] as ReplayTile).serialize();
                    (tileData) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : undefined;
        }
    }
}
