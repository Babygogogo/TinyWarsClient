
namespace TinyWars.MultiCustomWar {
    export class McwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return McwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return McwTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return McwUnitMap;
        }
        protected _getCursorClass(): new () => BaseWar.BwCursor {
            return McwCursor;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return McwActionPlanner;
        }
        protected _getGridVisionEffectClass(): new () => BaseWar.BwGridVisionEffect {
            return McwGridVisionEffect;
        }
        protected _getViewClass(): new () => BaseWar.BwFieldView {
            return McwFieldView;
        }
    }
}
