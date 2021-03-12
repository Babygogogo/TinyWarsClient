
namespace TinyWars.TestWar {
    export class TwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return TwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return TwTileMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return TwActionPlanner;
        }
    }
}
