
namespace TinyWars.MultiPlayerWar {
    export class MpwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return McwUnitMapView;
        }
        public getUnitClass(): new () => BaseWar.BwUnit {
            return MpwUnit;
        }
    }
}
