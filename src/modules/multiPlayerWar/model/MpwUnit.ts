
namespace TinyWars.MultiPlayerWar {
    export class MpwUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return McwUnitView;
        }
    }
}
