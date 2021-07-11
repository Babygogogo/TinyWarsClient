
import { BwPlayerManager } from "../../baseWar/model/BwPlayerManager";

export class TwPlayerManager extends BwPlayerManager {
    public getAliveWatcherTeamIndexesForSelf(): Set<number> {
        return new Set();
    }
}
