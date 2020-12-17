
namespace TinyWars.ReplayWar {

    export class RwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return RwUnitMapView;
        }
        public getUnitClass(): new () => BaseWar.BwUnit {
            return RwUnit;
        }
    }
}
