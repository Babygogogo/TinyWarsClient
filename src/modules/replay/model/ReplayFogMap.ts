
namespace TinyWars.Replay {
    import Types                    = Utility.Types;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import SerializedMcFogMap       = Types.SerializedFogMap;
    import MapSize                  = Types.MapSize;

    export class ReplayFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ReplayWar): void {
            super.startRunning(war);

            const teamIndex = war.getPlayerInTurn().getTeamIndex();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToTeam(war, tile.getGridIndex(), teamIndex)) {
                    tile.setFogEnabled();
                } else {
                    tile.setFogDisabled();
                }
            });
        }

        public serialize(): SerializedMcFogMap {
            const mapSize = this.getMapSize();
            const mapsForPath: Types.SerializedBwFogMapForPath[] = [];
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
    }

    function encodeMapForPaths(map: number[][], mapSize: MapSize): string | undefined {
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
