
namespace TinyWars.MultiCustomWar {

    export class McwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return McwUnitMapView;
        }
        public getUnitClass(): new () => BaseWar.BwUnit {
            return McwUnit;
        }
    }
}
