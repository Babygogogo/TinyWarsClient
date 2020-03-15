
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class McwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return McwUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return McwUnit;
        }

        public serializeForSimulation(): Types.SerializedUnitMap {
            const war           = this.getWar();
            const userId        = User.UserModel.getSelfUserId();
            const units         : Types.SerializedUnit[] = [];
            const teamIndexes   = war.getWatcherTeamIndexes(userId);

            this.forEachUnitOnMap((unit: McwUnit) => {
                if (VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                    war,
                    gridIndex           : unit.getGridIndex(),
                    unitType            : unit.getType(),
                    isDiving            : unit.getIsDiving(),
                    unitPlayerIndex     : unit.getPlayerIndex(),
                    observerUserId      : userId,
                })) {
                    units.push(unit.serializeForSimulation());

                    if (teamIndexes.has(unit.getTeamIndex())) {
                        for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                            units.push((loadedUnit as McwUnit).serializeForSimulation());
                        }
                    }
                }
            });

            return {
                units       : units.length ? units : undefined,
                nextUnitId  : this.getNextUnitId(),
            }
        }
    }
}
