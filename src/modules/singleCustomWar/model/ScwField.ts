
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

    export class ScwField extends BaseWar.BwField {
        public serialize(): Types.SerializedField {
            return {
                fogMap  : (this.getFogMap() as ScwFogMap).serialize(),
                unitMap : (this.getUnitMap() as ScwUnitMap).serialize(),
                tileMap : (this.getTileMap() as ScwTileMap).serialize(),
            };
        }

        public serializeForSimulation(): Types.SerializedField {
            return {
                fogMap  : (this.getFogMap() as ScwFogMap).serializeForSimulation(),
                unitMap : (this.getUnitMap() as ScwUnitMap).serializeForSimulation(),
                tileMap : (this.getTileMap() as ScwTileMap).serializeForSimulation(),
            };
        }

        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return ScwFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return ScwTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return ScwUnitMap;
        }
        protected _getCursorClass(): new () => BaseWar.BwCursor {
            return ScwCursor;
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
