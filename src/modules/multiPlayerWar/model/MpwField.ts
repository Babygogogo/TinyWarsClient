
namespace TinyWars.MultiPlayerWar {
    export class MpwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return MpwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return MpwTileMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return MpwActionPlanner;
        }
    }
}
