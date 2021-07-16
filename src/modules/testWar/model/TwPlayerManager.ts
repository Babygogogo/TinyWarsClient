
import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

namespace TwnsTwPlayerManager {
    import BwPlayerManager = TwnsBwPlayerManager.BwPlayerManager;

    export class TwPlayerManager extends BwPlayerManager {
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return new Set();
        }
    }
}

export default TwnsTwPlayerManager;
