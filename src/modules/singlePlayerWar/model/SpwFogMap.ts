
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";

namespace TwnsSpwFogMap {
    import BwFogMap = TwnsBwFogMap.BwFogMap;

    export class SpwFogMap extends BwFogMap {
        public startRunning(war: TwnsBwWar.BwWar): void {
            this._setWar(war);

            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnits  = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }
        }
    }
}

// export default TwnsSpwFogMap;
