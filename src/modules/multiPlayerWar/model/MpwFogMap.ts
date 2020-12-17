
namespace TinyWars.MultiPlayerWar {
    import Logger               = Utility.Logger;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class MpwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: MpwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            war.getTileMap().forEachTile(tile => {
                if (!(tile instanceof MpwTile)) {
                    Logger.error(`McwFogMap.startRunning() invalid tile.`);
                    return;
                }

                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        tile.resetDataAsHasFog();
                    }
                }
            });
        }
    }
}
