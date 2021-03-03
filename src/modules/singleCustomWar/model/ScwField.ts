
namespace TinyWars.SingleCustomWar {
    export class ScwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return ScwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return ScwTileMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return ScwActionPlanner;
        }
    }
}
