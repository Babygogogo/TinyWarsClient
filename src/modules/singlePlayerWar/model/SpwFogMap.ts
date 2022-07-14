
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";

namespace Twns.SinglePlayerWar {
    import BwFogMap = Twns.BaseWar.BwFogMap;

    export class SpwFogMap extends BwFogMap {
        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._setWar(war);

            const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const visibleUnits  = Twns.WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = Twns.WarHelpers.WarVisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }
        }
    }
}

// export default TwnsSpwFogMap;
