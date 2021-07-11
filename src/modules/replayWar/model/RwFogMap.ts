
import { BwFogMap }             from "../../baseWar/model/BwFogMap";
import { RwWar }                from "./RwWar";
import * as VisibilityHelpers   from "../../../utility/VisibilityHelpers";

export class RwFogMap extends BwFogMap {
    public startRunning(war: RwWar): void {
        this._setWar(war);

        const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
        for (const tile of war.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));
        }
    }
}
