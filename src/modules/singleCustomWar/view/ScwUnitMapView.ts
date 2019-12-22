
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;
    export class ScwUnitMapView extends BaseWar.BwUnitMapView {
        protected _resetVisibleForAllUnitsOnMap(): void {
            const unitMap       = this._getUnitMap();
            const war           = unitMap.getWar();
            const userId        = war.getPlayerInTurn().getUserId() || User.UserModel.getSelfUserId();
            unitMap.forEachUnitOnMap(unit => unit.setViewVisible(VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                war                 : war,
                gridIndex           : unit.getGridIndex(),
                unitType            : unit.getType(),
                isDiving            : unit.getIsDiving(),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerUserId      : userId,
            })));
        }
    }
}
