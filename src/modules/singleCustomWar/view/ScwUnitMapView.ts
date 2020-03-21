
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class ScwUnitMapView extends BaseWar.BwUnitMapView {
        protected _resetVisibleForAllUnitsOnMap(): void {
            const unitMap       = this._getUnitMap();
            const war           = unitMap.getWar();
            const visibleUnits  = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(
                war,
                (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw()
            );
            unitMap.forEachUnitOnMap(unit => {
                unit.setViewVisible(visibleUnits.has(unit));
            });
        }
    }
}
