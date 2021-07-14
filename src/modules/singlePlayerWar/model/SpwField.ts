
import { BwField }          from "../../baseWar/model/BwField";
import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import { SpwFogMap }        from "./SpwFogMap";
import { SpwActionPlanner } from "./SpwActionPlanner";
import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;

export class SpwField extends BwField {
    private readonly _fogMap        = new SpwFogMap();
    private readonly _tileMap       = new TwnsBwTileMap.BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new SpwActionPlanner();

    public getFogMap(): SpwFogMap {
        return this._fogMap;
    }
    public getTileMap(): TwnsBwTileMap.BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): SpwActionPlanner {
        return this._actionPlanner;
    }
}
