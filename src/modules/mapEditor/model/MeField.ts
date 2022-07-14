
// import TwnsBwField          from "../../baseWar/model/BwField";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsMeActionPlanner  from "./MeActionPlanner";
// import TwnsMeFogMap         from "./MeFogMap";

namespace Twns.MapEditor {
    export class MeField extends Twns.BaseWar.BwField {
        private readonly _fogMap        = new Twns.MapEditor.MeFogMap();
        private readonly _tileMap       = new Twns.BaseWar.BwTileMap();
        private readonly _unitMap       = new Twns.BaseWar.BwUnitMap();
        private readonly _actionPlanner = new Twns.MapEditor.MeActionPlanner();

        public getFogMap(): Twns.MapEditor.MeFogMap {
            return this._fogMap;
        }
        public getTileMap(): Twns.BaseWar.BwTileMap {
            return this._tileMap;
        }
        public getUnitMap(): Twns.BaseWar.BwUnitMap {
            return this._unitMap;
        }
        public getActionPlanner(): Twns.MapEditor.MeActionPlanner {
            return this._actionPlanner;
        }

        public getMaxPlayerIndex(): number {
            let maxPlayerIndex = 0;
            for (const tile of this.getTileMap().getAllTiles()) {
                maxPlayerIndex = Math.max(maxPlayerIndex, tile.getPlayerIndex());
            }
            for (const unit of this.getUnitMap().getAllUnits()) {
                maxPlayerIndex = Math.max(maxPlayerIndex, unit.getPlayerIndex());
            }
            return maxPlayerIndex;
        }
    }
}

// export default TwnsMeField;
