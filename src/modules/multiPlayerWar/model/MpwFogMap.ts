
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import MpwUtility           from "./MpwUtility";
// import TwnsMpwWar           from "./MpwWar";

namespace TwnsMpwFogMap {
    export class MpwFogMap extends Twns.BaseWar.BwFogMap {
        public startRunning(war: Twns.MultiPlayerWar.MpwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
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

// export default TwnsMpwFogMap;
