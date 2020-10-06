
namespace TinyWars.MapEditor {
    export class MeActionPlannerView extends BaseWar.BwActionPlannerView {
        protected _getUnitViewClass(): new () => BaseWar.BwUnitView {
            return MeUnitView;
        }
    }
}
