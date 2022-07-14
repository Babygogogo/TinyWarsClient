
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import MpwUtility           from "./MpwUtility";
// import TwnsMpwWar           from "./MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    export class MpwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: MultiPlayerWar.MpwWar): void {
            this._setWar(war);

            const visibleTiles = WarHelpers.WarVisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            for (const tile of war.getTileMap().getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        WarHelpers.WarCommonHelpers.resetTileDataAsHasFog(tile);
                    }
                }
            }
        }
    }
}

// export default TwnsMpwFogMap;
