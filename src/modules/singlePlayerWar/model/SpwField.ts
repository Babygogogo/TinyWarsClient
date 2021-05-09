
namespace TinyWars.SinglePlayerWar {
    export class SpwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return SpwFogMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return SpwActionPlanner;
        }
    }
}
