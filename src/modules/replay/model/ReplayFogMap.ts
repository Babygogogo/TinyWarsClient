
namespace TinyWars.Replay {
    import Types                    = Utility.Types;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import SerializedMcFogMap       = Types.SerializedBwFogMap;
    import MapSize                  = Types.MapSize;

    export class ReplayFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ReplayWar): void {
            super.startRunning(war);

            const playerIndex = war.getPlayerInTurn().getPlayerIndex();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToPlayer(war, tile.getGridIndex(), playerIndex)) {
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
        public serializeForPlayer(targetPlayerIndex: number): SerializedMcFogMap {
            const mapSize           = this.getMapSize();
            const war               = this._getWar() as ReplayWar;
            const targetTeamIndex   = war.getPlayer(targetPlayerIndex)!.getTeamIndex();
            const mapsForPath: Types.SerializedBwFogMapForPath[] = [];

            for (const [playerIndex, map] of this._getMapsFromPaths()) {
                const player = war.getPlayer(playerIndex)!;
                if ((player.getIsAlive()) && (player.getTeamIndex() === targetTeamIndex)) {
                    const serializedData = encodeMapForPaths(map, mapSize);
                    if (serializedData != null) {
                        mapsForPath.push({
                            playerIndex : playerIndex,
                            encodedMap  : serializedData,
                        });
                    }
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
