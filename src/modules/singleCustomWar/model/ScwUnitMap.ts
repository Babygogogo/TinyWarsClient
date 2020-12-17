
namespace TinyWars.SingleCustomWar {
    export class ScwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ScwUnitMapView;
        }
        public getUnitClass(): new () => BaseWar.BwUnit {
            return ScwUnit;
        }
    }
}
