
namespace TinyWars.ReplayWar {
    export class RwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return RwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return RwTileMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return RwActionPlanner;
        }
    }
}
