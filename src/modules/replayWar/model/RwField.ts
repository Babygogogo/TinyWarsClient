
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsRwActionPlanner  from "./RwActionPlanner";
// import TwnsRwFogMap         from "./RwFogMap";

namespace TwnsRwField {
    import BwField          = Twns.BaseWar.BwField;
    import RwActionPlanner  = TwnsRwActionPlanner.RwActionPlanner;
    import RwFogMap         = TwnsRwFogMap.RwFogMap;
    import BwUnitMap        = Twns.BaseWar.BwUnitMap;

    export class RwField extends BwField {
        private readonly _fogMap        = new RwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new BwUnitMap();
        private readonly _actionPlanner = new RwActionPlanner();

        public getFogMap(): RwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): RwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsRwField;
