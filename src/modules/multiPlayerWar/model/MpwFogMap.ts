
import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import MpwUtility           from "./MpwUtility";
import TwnsMpwWar           from "./MpwWar";

namespace TwnsMpwFogMap {
    import BwFogMap = TwnsBwFogMap.BwFogMap;
    import MpwWar   = TwnsMpwWar.MpwWar;

    export class MpwFogMap extends BwFogMap {
        public startRunning(war: MpwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            for (const tile of war.getTileMap().getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        MpwUtility.resetTileDataAsHasFog(tile);
                    }
                }
            }
        }
    }
}

export default TwnsMpwFogMap;
