
namespace TinyWars.ReplayWar {
    export class RwPlayerManager extends BaseWar.BwPlayerManager {
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}
