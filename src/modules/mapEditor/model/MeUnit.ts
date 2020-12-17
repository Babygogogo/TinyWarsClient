
namespace TinyWars.MapEditor {
    export class MeUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return MeUnitView;
        }
    }
}
