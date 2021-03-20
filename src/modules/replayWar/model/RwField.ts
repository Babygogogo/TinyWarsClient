
namespace TinyWars.ReplayWar {
    export class RwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return RwFogMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return RwActionPlanner;
        }
    }
}
