
namespace TinyWars.MultiCustomWar {
    import Logger               = Utility.Logger;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class McwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: McwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            war.getTileMap().forEachTile(tile => {
                if (!(tile instanceof McwTile)) {
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
