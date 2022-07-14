
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsMpwActionPlanner from "./MpwActionPlanner";
// import TwnsMpwFogMap        from "./MpwFogMap";

namespace Twns.MultiPlayerWar {
    export class MpwField extends Twns.BaseWar.BwField {
        private readonly _fogMap        = new Twns.MultiPlayerWar.MpwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new Twns.BaseWar.BwUnitMap();
        private readonly _actionPlanner = new Twns.MultiPlayerWar.MpwActionPlanner();

        public getFogMap(): Twns.MultiPlayerWar.MpwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): Twns.BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): Twns.MultiPlayerWar.MpwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsMpwField;
