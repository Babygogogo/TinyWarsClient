
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class ScwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ScwWar): void {
            this._setWar(war);

            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnits  = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            war.getUnitMap().forEachUnitOnMap(unit => {
                unit.setViewVisible(visibleUnits.has(unit));
            });

            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
            const tileMap       = war.getTileMap();
            tileMap.forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            });
        }
    }
}
