
import BwFogMap = TwnsBwFogMap.BwFogMap;import TwnsBwFogMap             from "../../baseWar/model/BwFogMap";
import { RwWar }                from "./RwWar";
import WarVisibilityHelpers   from "../../tools/warHelpers/WarVisibilityHelpers";

export class RwFogMap extends BwFogMap {
    public startRunning(war: RwWar): void {
        this._setWar(war);

        const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
        for (const tile of war.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));
        }
    }
}
