
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Types                = Utility.Types;
    import BwHelpers            = BaseWar.BwHelpers;

    export class ScwFogMap extends BaseWar.BwFogMap {
        public serialize(): Types.SerializedFogMap {
            const mapSize       = this.getMapSize();
            const mapsForPath   : Types.SerializedBwFogMapForPath[] = [];
            for (const [playerIndex, map] of this._getMapsFromPaths()) {
                const serializedData = BwHelpers.encodeFogMapForPaths(map, mapSize);
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

        public serializeForSimulation(): Types.SerializedFogMap {
            const mapSize           = this.getMapSize();
            const war               = this._getWar();
            const targetTeamIndexes = war.getPlayerManager().getWatcherTeamIndexes(User.UserModel.getSelfUserId());
            const mapsForPath       : Types.SerializedBwFogMapForPath[] = [];

            for (const [playerIndex, map] of this._getMapsFromPaths()) {
                const player = war.getPlayer(playerIndex)!;
                if ((player.getIsAlive()) && (targetTeamIndexes.has(player.getTeamIndex()))) {
                    const serializedData = BwHelpers.encodeFogMapForPaths(map, mapSize);
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

        public startRunning(war: ScwWar): void {
            super.startRunning(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(
                war,
                (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw()
            );
            war.getTileMap().forEachTile(tile => {
                if (!visibleTiles.has(tile)) {
                    tile.setFogEnabled();
                }
            });
        }
    }
}
