
namespace TinyWars.MultiCustomWar {
    export class McwUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return McwUnitMapView;
        }
        protected _getBwUnitClass(): new () => BaseWar.BwUnit {
            return McwUnit;
        }
    }
}
