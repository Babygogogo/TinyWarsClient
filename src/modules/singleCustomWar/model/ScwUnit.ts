
namespace TinyWars.SingleCustomWar {
    export class ScwUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return ScwUnitView;
        }
    }
}
