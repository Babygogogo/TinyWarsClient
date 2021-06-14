
namespace TinyWars.ReplayWar {
    export class RwField extends BaseWar.BwField {
        private readonly _fogMap        = new RwFogMap();
        private readonly _tileMap       = new BaseWar.BwTileMap();
        private readonly _unitMap       = new BaseWar.BwUnitMap();
        private readonly _actionPlanner = new RwActionPlanner();

        public getFogMap(): RwFogMap {
            return this._fogMap;
        }
        public getTileMap(): BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): RwActionPlanner {
            return this._actionPlanner;
        }
    }
}
