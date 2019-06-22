
namespace TinyWars.MultiCustomWar {
    export class McwUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return McwUnitView;
        }
    }
}
