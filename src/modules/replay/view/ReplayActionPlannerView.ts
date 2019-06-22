
namespace TinyWars.Replay {
    export class ReplayActionPlannerView extends BaseWar.BwActionPlannerView {
        protected _getUnitViewClass(): new () => BaseWar.BwUnitView {
            return ReplayUnitView;
        }
    }
}
