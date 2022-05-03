
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

namespace Twns.ReplayWar {
    import BwPlayerManager = Twns.BaseWar.BwPlayerManager;

    export class RwPlayerManager extends BwPlayerManager {
        public getWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}

// export default TwnsRwPlayerManager;
