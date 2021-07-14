import BwField = TwnsBwField.BwField;import TwnsBwField          from "../../baseWar/model/BwField";
import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import { MpwActionPlanner } from "./MpwActionPlanner";
import { MpwFogMap }        from "./MpwFogMap";
import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;

export class MpwField extends BwField {
    private readonly _fogMap        = new MpwFogMap();
    private readonly _tileMap       = new TwnsBwTileMap.BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new MpwActionPlanner();

    public getFogMap(): MpwFogMap {
        return this._fogMap;
    }
    public getTileMap(): TwnsBwTileMap.BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): MpwActionPlanner {
        return this._actionPlanner;
    }
}
