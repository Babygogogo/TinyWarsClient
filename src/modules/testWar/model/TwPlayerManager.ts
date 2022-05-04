
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

namespace Twns.TestWar {
    import BwPlayerManager = Twns.BaseWar.BwPlayerManager;

    export class TwPlayerManager extends BwPlayerManager {
        public getWatcherTeamIndexesForSelf(): Set<number> {
            return new Set();
        }
    }
}

// export default TwnsTwPlayerManager;
