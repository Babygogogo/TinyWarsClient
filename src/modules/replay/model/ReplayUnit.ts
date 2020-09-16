
namespace TinyWars.Replay {
    export class ReplayUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return ReplayUnitView;
        }
    }
}
