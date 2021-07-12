
import { BwVisibilityHelpers }    from "../../baseWar/model/BwVisibilityHelpers";
import * as MpwUtility          from "./MpwUtility";
import { BwFogMap }             from "../../baseWar/model/BwFogMap";
import { MpwWar }               from "./MpwWar";

export class MpwFogMap extends BwFogMap {
    public startRunning(war: MpwWar): void {
        this._setWar(war);

        const visibleTiles = BwVisibilityHelpers.getAllTilesVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
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
