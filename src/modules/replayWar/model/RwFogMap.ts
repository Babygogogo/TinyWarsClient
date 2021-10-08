
import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsRwWar            from "./RwWar";

namespace TwnsRwFogMap {
    export class RwFogMap extends TwnsBwFogMap.BwFogMap {
        public startRunning(war: TwnsRwWar.RwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }
        }
    }
}

export default TwnsRwFogMap;
