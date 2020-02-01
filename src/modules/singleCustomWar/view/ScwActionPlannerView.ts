
namespace TinyWars.SingleCustomWar {
    export class ScwActionPlannerView extends BaseWar.BwActionPlannerView {
        protected _getUnitViewClass(): new () => BaseWar.BwUnitView {
            return ScwUnitView;
        }
    }
}
