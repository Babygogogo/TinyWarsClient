
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

namespace TwnsRwPlayerManager {
    import BwPlayerManager = TwnsBwPlayerManager.BwPlayerManager;

    export class RwPlayerManager extends BwPlayerManager {
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}

// export default TwnsRwPlayerManager;
