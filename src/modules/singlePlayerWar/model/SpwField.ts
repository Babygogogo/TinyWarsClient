
namespace TinyWars.SinglePlayerWar {
    export class SpwField extends BaseWar.BwField {
        private readonly _fogMap        = new SpwFogMap();
        private readonly _tileMap       = new BaseWar.BwTileMap();
        private readonly _unitMap       = new BaseWar.BwUnitMap();
        private readonly _actionPlanner = new SpwActionPlanner();

        public getFogMap(): SpwFogMap {
            return this._fogMap;
        }
        public getTileMap(): BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): SpwActionPlanner {
            return this._actionPlanner;
        }
    }
}
