
import { BwField }          from "../../baseWar/model/BwField";
import { BwTileMap }        from "../../baseWar/model/BwTileMap";
import { BwUnitMap }        from "../../baseWar/model/BwUnitMap";
import { TwFogMap }         from "./TwFogMap";
import { TwActionPlanner }  from "./TwActionPlanner";

export class TwField extends BwField {
    private readonly _fogMap        = new TwFogMap();
    private readonly _tileMap       = new BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new TwActionPlanner();

    public getFogMap(): TwFogMap {
        return this._fogMap;
    }
    public getTileMap(): BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): TwActionPlanner {
        return this._actionPlanner;
    }
}
