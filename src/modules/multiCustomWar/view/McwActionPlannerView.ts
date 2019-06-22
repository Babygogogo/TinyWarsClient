
namespace TinyWars.MultiCustomWar {
    export class McwActionPlannerView extends BaseWar.BwActionPlannerView {
        protected _getUnitViewClass(): new () => BaseWar.BwUnitView {
            return McwUnitView;
        }
    }
}
