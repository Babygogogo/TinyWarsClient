
namespace TinyWars.TestWar {
    export class TwField extends BaseWar.BwField {
        private readonly _fogMap        = new TwFogMap();
        private readonly _tileMap       = new BaseWar.BwTileMap();
        private readonly _unitMap       = new BaseWar.BwUnitMap();
        private readonly _actionPlanner = new TwActionPlanner();

        public getFogMap(): TwFogMap {
            return this._fogMap;
        }
        public getTileMap(): BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): TwActionPlanner {
            return this._actionPlanner;
        }
    }
}
