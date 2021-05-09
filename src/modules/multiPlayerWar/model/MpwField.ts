
namespace TinyWars.MultiPlayerWar {
    export class MpwField extends BaseWar.BwField {
        private readonly _fogMap        = new MpwFogMap();
        private readonly _tileMap       = new BaseWar.BwTileMap();
        private readonly _unitMap       = new BaseWar.BwUnitMap();
        private readonly _actionPlanner = new MpwActionPlanner();

        public getFogMap(): MpwFogMap {
            return this._fogMap;
        }
        public getTileMap(): BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): MpwActionPlanner {
            return this._actionPlanner;
        }
    }
}
