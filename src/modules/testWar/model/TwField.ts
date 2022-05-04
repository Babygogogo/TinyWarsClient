
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsTwActionPlanner  from "./TwActionPlanner";
// import TwnsTwFogMap         from "./TwFogMap";

namespace Twns.TestWar {
    import BwField          = Twns.BaseWar.BwField;
    import TwFogMap         = Twns.TestWar.TwFogMap;
    import TwActionPlanner  = Twns.TestWar.TwActionPlanner;
    import BwUnitMap        = Twns.BaseWar.BwUnitMap;

    export class TwField extends BwField {
        private readonly _fogMap        = new TwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new BwUnitMap();
        private readonly _actionPlanner = new TwActionPlanner();

        public getFogMap(): TwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): TwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsTwField;
