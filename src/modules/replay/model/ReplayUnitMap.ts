
namespace TinyWars.Replay {

    export class ReplayUnitMap extends BaseWar.BwUnitMap {
        protected _getViewClass(): new () => BaseWar.BwUnitMapView {
            return ReplayUnitMapView;
        }
        public getUnitClass(): new () => BaseWar.BwUnit {
            return ReplayUnit;
        }
    }
}
