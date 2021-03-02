
namespace TinyWars.SingleCustomWar {
    export class ScwField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return ScwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return ScwTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return ScwUnitMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return ScwActionPlanner;
        }
        protected _getGridVisionEffectClass(): new () => BaseWar.BwGridVisionEffect {
            return ScwGridVisionEffect;
        }
        protected _getViewClass(): new () => BaseWar.BwFieldView {
            return ScwFieldView;
        }
    }
}
