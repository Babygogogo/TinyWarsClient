
namespace TinyWars.SinglePlayerWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class SpwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: SpwWar): void {
            this._setWar(war);

            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnits  = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }
        }
    }
}
