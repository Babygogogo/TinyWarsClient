
namespace TinyWars.MultiCustomWar {

    export class McwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return McwUnitMapView;
        }
        protected _getUnitClass(): new () => BaseWar.BwUnit {
            return McwUnit;
        }
    }
}
