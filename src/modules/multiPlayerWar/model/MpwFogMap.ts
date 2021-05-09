
namespace TinyWars.MultiPlayerWar {
    import Logger               = Utility.Logger;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class MpwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: MpwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            war.getTileMap().forEachTile(tile => {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        MpwUtility.resetTileDataAsHasFog(tile);
                    }
                }
            });
        }
    }
}
