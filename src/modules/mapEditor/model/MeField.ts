
namespace TinyWars.MapEditor {
    export class MeField extends BaseWar.BwField {
        private readonly _fogMap        = new MeFogMap();
        private readonly _tileMap       = new BaseWar.BwTileMap();
        private readonly _unitMap       = new BaseWar.BwUnitMap();
        private readonly _actionPlanner = new MeActionPlanner();

        public getFogMap(): MeFogMap {
            return this._fogMap;
        }
        public getTileMap(): BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): MeActionPlanner {
            return this._actionPlanner;
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
