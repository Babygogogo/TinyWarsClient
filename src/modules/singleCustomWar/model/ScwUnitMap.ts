
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

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

        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ScwUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return ScwUnit;
        }
    }
}
