
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Types                = Utility.Types;

    export class ScwFogMap extends BaseWar.BwFogMap {
        public serialize(): Types.SerializedFogMap {
            const mapSize       = this.getMapSize();
            const mapsForPath   : Types.SerializedBwFogMapForPath[] = [];
            for (const [playerIndex, map] of this._getMapsFromPaths()) {
                const serializedData = encodeMapForPaths(map, mapSize);
                if (serializedData != null) {
                    mapsForPath.push({
                        playerIndex : playerIndex,
                        encodedMap  : serializedData,
                    });
                }
            }
            return {
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsForPath             : mapsForPath.length ? mapsForPath : undefined,
            };
        }

        public startRunning(war: ScwWar): void {
            super.startRunning(war);

            const userId = User.UserModel.getSelfUserId();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToUser(war, tile.getGridIndex(), userId)) {
                    tile.setFogEnabled();
                }
            });
        }
    }

    function encodeMapForPaths(map: number[][], mapSize: Types.MapSize): string | undefined {
        const { width, height } = mapSize;
        const data              = new Array(width * height);
        let needSerialize       = false;

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                data[x + y * width] = map[x][y];
                (!needSerialize) && (map[x][y] > 0) && (needSerialize = true);
            }
        }

        return needSerialize ? data.join(``) : undefined;
    }
}
