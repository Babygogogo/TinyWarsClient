
namespace TinyWars.SingleCustomWar {
    import Logger               = Utility.Logger;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialUnitMap       = WarSerialization.ISerialUnitMap;
    import ISerialUnit          = WarSerialization.ISerialUnit;

    export class ScwUnitMap extends BaseWar.BwUnitMap {
        public serialize(): ISerialUnitMap | undefined {
            const nextUnitId = this.getNextUnitId();
            if (nextUnitId == null) {
                Logger.error(`ScwUnitMap.serialize() empty nextUnitId.`);
                return undefined;
            }

            const units: ISerialUnit[] = [];
            for (const unit of this._getAllUnits()) {
                const serializedUnit = (unit as ScwUnit).serialize();
                if (!serializedUnit) {
                    Logger.error(`ScwUnitMap.serialize() empty serializedUnit.`);
                    return undefined;
                }
                units.push(serializedUnit);
            }

            return {
                units       : units.length ? units : undefined,
                nextUnitId,
            };
        }

        public serializeForSimulation(): ISerialUnitMap | undefined {
            const war           = this.getWar();
            const userId        = User.UserModel.getSelfUserId();
            const units         : ISerialUnit[] = [];
            const teamIndexes   = war.getWatcherTeamIndexes(userId);
            for (const unit of VisibilityHelpers.getAllUnitsOnMapVisibleToUser(war, userId)) {
                units.push((unit as ScwUnit).serializeForSimulation());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push((loadedUnit as ScwUnit).serializeForSimulation());
                    }
                }
            }

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
