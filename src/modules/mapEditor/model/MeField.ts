
import { BwField }          from "../../baseWar/model/BwField";
import { BwTileMap }        from "../../baseWar/model/BwTileMap";
import { BwUnitMap }        from "../../baseWar/model/BwUnitMap";
import { MeActionPlanner }  from "./MeActionPlanner";
import { MeFogMap }         from "./MeFogMap";

export class MeField extends BwField {
    private readonly _fogMap        = new MeFogMap();
    private readonly _tileMap       = new BwTileMap();
    private readonly _unitMap       = new BwUnitMap();
    private readonly _actionPlanner = new MeActionPlanner();

    public getFogMap(): MeFogMap {
        return this._fogMap;
    }
    public getTileMap(): BwTileMap {
        return this._tileMap;
    }
    public getUnitMap(): BwUnitMap {
        return this._unitMap;
    }
    public getActionPlanner(): MeActionPlanner {
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
