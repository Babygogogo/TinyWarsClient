
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;
    export class ScwUnitMapView extends BaseWar.BwUnitMapView {
        protected _resetVisibleForAllUnitsOnMap(): void {
            const unitMap       = this._getUnitMap();
            const war           = unitMap.getWar();
            const teamIndexes   = (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw();
            unitMap.forEachUnitOnMap(unit => {
                if (!VisibilityHelpers.checkIsUnitOnMapVisibleToTeams(
                    war,
                    unit.getGridIndex(),
                    unit.getType(),
                    unit.getIsDiving(),
                    unit.getPlayerIndex(),
                    teamIndexes
                )) {
                    unit.setViewVisible(false);
                } else {
                    unit.setViewVisible(true);
                }
            });
        }
    }
}
