import { BwField }          from "../../baseWar/model/BwField";
import { BwTileMap }        from "../../baseWar/model/BwTileMap";
import { BwUnitMap }        from "../../baseWar/model/BwUnitMap";
import { MpwActionPlanner } from "./MpwActionPlanner";
import { MpwFogMap }        from "./MpwFogMap";

export class MpwField extends BwField {
    private readonly _fogMap        = new MpwFogMap();
    private readonly _tileMap       = new BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new MpwActionPlanner();

    public getFogMap(): MpwFogMap {
        return this._fogMap;
    }
    public getTileMap(): BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): MpwActionPlanner {
        return this._actionPlanner;
    }
}
