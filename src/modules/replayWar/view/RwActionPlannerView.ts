
namespace TinyWars.ReplayWar {
    export class RwActionPlannerView extends BaseWar.BwActionPlannerView {
        protected _getUnitViewClass(): new () => BaseWar.BwUnitView {
            return RwUnitView;
        }
    }
}
