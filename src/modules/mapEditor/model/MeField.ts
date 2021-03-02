
namespace TinyWars.MapEditor {
    export class MeField extends BaseWar.BwField {
        protected _getFogMapClass(): new () => BaseWar.BwFogMap {
            return MeFogMap;
        }
        protected _getTileMapClass(): new () => BaseWar.BwTileMap {
            return MeTileMap;
        }
        protected _getUnitMapClass(): new () => BaseWar.BwUnitMap {
            return MeUnitMap;
        }
        protected _getActionPlannerClass(): new () => BaseWar.BwActionPlanner {
            return MeActionPlanner;
        }
        protected _getGridVisionEffectClass(): new () => BaseWar.BwGridVisionEffect {
            return MeGridVisionEffect;
        }
        protected _getViewClass(): new () => BaseWar.BwFieldView {
            return MeFieldView;
        }

        public getMaxPlayerIndex(): number {
            let maxPlayerIndex = 0;
            this.getTileMap().forEachTile(tile => {
                maxPlayerIndex = Math.max(maxPlayerIndex, tile.getPlayerIndex());
            });
            this.getUnitMap().forEachUnit(unit => {
                maxPlayerIndex = Math.max(maxPlayerIndex, unit.getPlayerIndex());
            });
            return maxPlayerIndex;
        }
    }
}
