
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsRwActionPlanner  from "./RwActionPlanner";
// import TwnsRwFogMap         from "./RwFogMap";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.HalfwayReplayWar {
    import BwField          = Twns.BaseWar.BwField;
    import BwUnitMap        = Twns.BaseWar.BwUnitMap;

    export class HrwField extends BwField {
        private readonly _fogMap        = new Twns.HalfwayReplayWar.HrwFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new BwUnitMap();
        private readonly _actionPlanner = new Twns.HalfwayReplayWar.HrwActionPlanner();

        public getFogMap(): Twns.HalfwayReplayWar.HrwFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): Twns.HalfwayReplayWar.HrwActionPlanner {
            return this._actionPlanner;
        }
    }
}

// export default TwnsHrwField;
