
namespace TinyWars.Replay {
    import Types = Utility.Types;

    export class ReplayUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ReplayUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return ReplayUnit;
        }

        public serialize(): Types.SerializedUnitMap {
            const units: Types.SerializedUnit[] = [];
            this.forEachUnitOnMap(unit => units.push((unit as ReplayUnit).serialize()));
            this.forEachUnitLoaded(unit => units.push((unit as ReplayUnit).serialize()));

            return {
                units       : units,
                nextUnitId  : this.getNextUnitId(),
            };
        }
    }
}
