
import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsRwWar            from "./RwWar";

namespace TwnsRwFogMap {
    import BwFogMap = TwnsBwFogMap.BwFogMap;
    import RwWar    = TwnsRwWar.RwWar;

    export class RwFogMap extends BwFogMap {
        public startRunning(war: RwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }
        }
    }
}

export default TwnsRwFogMap;
