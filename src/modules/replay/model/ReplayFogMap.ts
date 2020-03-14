
namespace TinyWars.Replay {
    import Types                    = Utility.Types;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import SerializedMcFogMap       = Types.SerializedFogMap;
    import MapSize                  = Types.MapSize;
    import BwHelpers                = BaseWar.BwHelpers;

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
                const serializedData = BaseWar.BwHelpers.encodeFogMapForPaths(map, mapSize);
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
}
