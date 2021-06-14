
namespace TinyWars.TestWar {
    export class TwPlayerManager extends BaseWar.BwPlayerManager {
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return new Set();
        }
    }
}
