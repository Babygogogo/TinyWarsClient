
import BwVisibilityHelpers            from "../../baseWar/model/BwVisibilityHelpers";
import { BwFogMap }                     from "../../baseWar/model/BwFogMap";
import { SpwWar }                       from "./SpwWar";

export class SpwFogMap extends BwFogMap {
    public startRunning(war: SpwWar): void {
        this._setWar(war);

        const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        const visibleUnits  = BwVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            unit.setViewVisible(visibleUnits.has(unit));
        }

        const visibleTiles = BwVisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
        for (const tile of war.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));
            tile.flushDataToView();
        }
    }
}
