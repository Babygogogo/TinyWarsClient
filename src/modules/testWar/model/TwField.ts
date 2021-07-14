
import BwField = TwnsBwField.BwField;import TwnsBwField          from "../../baseWar/model/BwField";
import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import { TwFogMap }         from "./TwFogMap";
import { TwActionPlanner }  from "./TwActionPlanner";
import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;

export class TwField extends BwField {
    private readonly _fogMap        = new TwFogMap();
    private readonly _tileMap       = new TwnsBwTileMap.BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new TwActionPlanner();

    public getFogMap(): TwFogMap {
        return this._fogMap;
    }
    public getTileMap(): TwnsBwTileMap.BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): TwActionPlanner {
        return this._actionPlanner;
    }
}
