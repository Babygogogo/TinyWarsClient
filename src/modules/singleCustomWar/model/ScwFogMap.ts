
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class ScwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ScwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            war.getTileMap().forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
            });
        }
    }
}
