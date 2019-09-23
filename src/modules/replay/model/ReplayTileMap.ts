
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import SerializedBwTileMap  = Types.SerializedBwTileMap;
    import SerializedBwTile     = Types.SerializedBwTile;

    export class ReplayTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ReplayTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return ReplayTileMapView;
        }

        public serialize(): SerializedBwTileMap | undefined {
            const mapData           = this._getMapRawData();
            const { width, height } = this.getMapSize();
            const map               = this._getMap();
            const tilesData: SerializedBwTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = (map[x][y] as ReplayTile).serialize();
                    (checkShouldSerializeTile(tileData, mapData, x + y * width)) && (tilesData.push(tileData));
                }
            }
            return tilesData.length ? { tiles: tilesData } : undefined;
        }
    }

    function checkShouldSerializeTile(tileData: SerializedBwTile, mapData: ProtoTypes.IMapRawData, posIndex: number): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != mapData.tileBases[posIndex])
            || (tileData.objectViewId           != mapData.tileObjects[posIndex]);
    }
}
