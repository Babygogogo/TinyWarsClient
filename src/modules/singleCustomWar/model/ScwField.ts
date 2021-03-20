
namespace TinyWars.SingleCustomWar {
    export class ScwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return ScwFogMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return ScwActionPlanner;
        }
    }
}
