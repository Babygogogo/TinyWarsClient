
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsRwActionPlanner  from "./RwActionPlanner";
// import TwnsRwFogMap         from "./RwFogMap";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsHrwField {
    import BwField          = Twns.BaseWar.BwField;
    import BwUnitMap        = Twns.BaseWar.BwUnitMap;

    export class HrwField extends BwField {
        private readonly _fogMap        = new TwnsHrwFogMap.HrwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new BwUnitMap();
        private readonly _actionPlanner = new TwnsHrwActionPlanner.HrwActionPlanner();

        public getFogMap(): TwnsHrwFogMap.HrwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): TwnsHrwActionPlanner.HrwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsHrwField;
