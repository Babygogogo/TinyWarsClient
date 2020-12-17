
namespace TinyWars.ReplayWar {
    export class RwUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return RwUnitView;
        }
    }
}
