
namespace TinyWars.SingleCustomWar {
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class ScwUnitMap extends BaseWar.BwUnitMap {
        public serialize(): Types.SerializedUnitMap {
            const units: Types.SerializedUnit[] = [];
            this.forEachUnitOnMap((unit: ScwUnit) => units.push(unit.serialize()));
            this.forEachUnitLoaded((unit: ScwUnit) => units.push(unit.serialize()));

            return {
                units       : units.length ? units : undefined,
                nextUnitId  : this.getNextUnitId(),
            };
        }

        public serializeForSimulation(): Types.SerializedUnitMap {
            const war               = this.getWar();
            const userId            = User.UserModel.getSelfUserId();
            const units             : Types.SerializedUnit[] = [];
            const teamIndexes       = war.getWatcherTeamIndexes(userId);
            const visibleUnitsOnMap = VisibilityHelpers.getAllUnitsOnMapVisibleToUser(war, userId);

            this.forEachUnitOnMap((unit: ScwUnit) => {
                if (visibleUnitsOnMap.has(unit)) {
                    units.push(unit.serializeForSimulation());

                    if (teamIndexes.has(unit.getTeamIndex())) {
                        for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                            units.push((loadedUnit as ScwUnit).serializeForSimulation());
                        }
                    }
                }
            });

            return {
                units       : units.length ? units : undefined,
                nextUnitId  : this.getNextUnitId(),
            }
        }

        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ScwUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return ScwUnit;
        }
    }
}
