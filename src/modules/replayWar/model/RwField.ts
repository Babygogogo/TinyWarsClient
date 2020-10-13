
namespace TinyWars.ReplayWar {
    export class RwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return RwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return RwTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return RwUnitMap;
        }
        protected _getCursorClass(): new () => BaseWar.BwCursor {
            return RwCursor;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return RwActionPlanner;
        }
        protected _getGridVisionEffectClass(): new () => BaseWar.BwGridVisionEffect {
            return RwGridVisionEffect;
        }
        protected _getViewClass(): new () => BaseWar.BwFieldView {
            return RwFieldView;
        }
    }
}
