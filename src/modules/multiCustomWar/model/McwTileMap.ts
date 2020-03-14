
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return McwTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return McwTileMapView;
        }

        public serializeForSimulation(): Types.SerializedTileMap | undefined {
            const { width, height } = this.getMapSize();
            const map               = this._getMap() as McwTile[][];
            const tilesData         : Types.SerializedTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForSimulation();
                    (tileData) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : undefined;
        }
    }
}
