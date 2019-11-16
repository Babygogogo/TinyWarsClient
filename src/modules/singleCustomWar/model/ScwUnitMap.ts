
namespace TinyWars.SingleCustomWar {
    export class ScwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ScwUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return ScwUnit;
        }
    }
}
