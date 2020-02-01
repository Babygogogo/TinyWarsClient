
namespace TinyWars.Replay {
    import Types = Utility.Types;

    export class ReplayField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return ReplayFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return ReplayTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return ReplayUnitMap;
        }
        protected _getCursorClass(): new () => BaseWar.BwCursor {
            return ReplayCursor;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return ReplayActionPlanner;
        }
        protected _getGridVisionEffectClass(): new () => BaseWar.BwGridVisionEffect {
            return ReplayGridVisionEffect;
        }
        protected _getViewClass(): new () => BaseWar.BwFieldView {
            return ReplayFieldView;
        }

        public serialize(): Types.SerializedField {
            return {
                fogMap  : (this.getFogMap() as ReplayFogMap).serialize(),
                unitMap : (this.getUnitMap() as ReplayUnitMap).serialize(),
                tileMap : (this.getTileMap() as ReplayTileMap).serialize(),
            };
        }
    }
}
