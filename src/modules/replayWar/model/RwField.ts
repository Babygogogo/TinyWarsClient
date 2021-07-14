
import BwField = TwnsBwField.BwField;import TwnsBwField          from "../../baseWar/model/BwField";
import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import { RwActionPlanner }  from "./RwActionPlanner";
import { RwFogMap }         from "./RwFogMap";
import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;

export class RwField extends BwField {
    private readonly _fogMap        = new RwFogMap();
    private readonly _tileMap       = new TwnsBwTileMap.BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new RwActionPlanner();

    public getFogMap(): RwFogMap {
        return this._fogMap;
    }
    public getTileMap(): TwnsBwTileMap.BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): RwActionPlanner {
        return this._actionPlanner;
    }
}
