
import { BwField }          from "../../baseWar/model/BwField";
import { BwTileMap }        from "../../baseWar/model/BwTileMap";
import { BwUnitMap }        from "../../baseWar/model/BwUnitMap";
import { RwActionPlanner }  from "./RwActionPlanner";
import { RwFogMap }         from "./RwFogMap";

export class RwField extends BwField {
    private readonly _fogMap        = new RwFogMap();
    private readonly _tileMap       = new BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new RwActionPlanner();

    public getFogMap(): RwFogMap {
        return this._fogMap;
    }
    public getTileMap(): BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): RwActionPlanner {
        return this._actionPlanner;
    }
}
