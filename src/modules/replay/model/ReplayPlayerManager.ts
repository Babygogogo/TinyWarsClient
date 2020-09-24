
namespace TinyWars.Replay {
    import Types    = Utility.Types;

    export class ReplayPlayerManager extends BaseWar.BwPlayerManager {
        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ReplayPlayer;
        }

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}
