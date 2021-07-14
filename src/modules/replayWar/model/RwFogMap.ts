
import { BwFogMap }             from "../../baseWar/model/BwFogMap";
import { RwWar }                from "./RwWar";
import BwVisibilityHelpers    from "../../baseWar/model/BwVisibilityHelpers";

export class RwFogMap extends BwFogMap {
    public startRunning(war: RwWar): void {
        this._setWar(war);

        const visibleTiles = BwVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
        for (const tile of war.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));
        }
    }
}
