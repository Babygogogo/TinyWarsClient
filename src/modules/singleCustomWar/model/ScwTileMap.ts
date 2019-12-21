
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

    export class ScwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ScwTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return ScwTileMapView;
        }

        public serialize(): Types.SerializedTileMap | undefined {
            const { width, height } = this.getMapSize();
            const map               = this._getMap();
            const tilesData: Types.SerializedTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = (map[x][y] as ScwTile).serialize();
                    (tileData) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : undefined;
        }
    }
}
