
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsSpwActionPlanner from "./SpwActionPlanner";
// import TwnsSpwFogMap        from "./SpwFogMap";

namespace Twns.SinglePlayerWar {
    import BwField          = Twns.BaseWar.BwField;
    import SpwFogMap        = Twns.SinglePlayerWar.SpwFogMap;
    import SpwActionPlanner = Twns.SinglePlayerWar.SpwActionPlanner;
    import BwUnitMap        = Twns.BaseWar.BwUnitMap;

    export class SpwField extends BwField {
        private readonly _fogMap        = new SpwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new BwUnitMap();
        private readonly _actionPlanner = new SpwActionPlanner();

        public getFogMap(): SpwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): SpwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsSpwField;
