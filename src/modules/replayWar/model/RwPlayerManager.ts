
import BwPlayerManager = TwnsBwPlayerManager.BwPlayerManager;import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

export class RwPlayerManager extends BwPlayerManager {
    public getAliveWatcherTeamIndexesForSelf(): Set<number> {
        return this.getAliveTeamIndexes(false);
    }
}
