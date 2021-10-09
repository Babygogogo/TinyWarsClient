
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsMpwActionPlanner from "./MpwActionPlanner";
// import TwnsMpwFogMap        from "./MpwFogMap";

namespace TwnsMpwField {
    export class MpwField extends TwnsBwField.BwField {
        private readonly _fogMap        = new TwnsMpwFogMap.MpwFogMap();
        private readonly _tileMap       = new TwnsBwTileMap.BwTileMap();
        private readonly _unitMap       = new TwnsBwUnitMap.BwUnitMap();
        private readonly _actionPlanner = new TwnsMpwActionPlanner.MpwActionPlanner();

        public getFogMap(): TwnsMpwFogMap.MpwFogMap {
            return this._fogMap;
        }
        public getTileMap(): TwnsBwTileMap.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): TwnsBwUnitMap.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): TwnsMpwActionPlanner.MpwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsMpwField;
