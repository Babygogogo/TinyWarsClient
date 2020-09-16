
namespace TinyWars.Replay {
    import Types    = Utility.Types;

    export class ReplayPlayerManager extends BaseWar.BwPlayerManager {
        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ReplayPlayer;
        }

        public serializeForSimulation(): Types.SerializedPlayer[] {
            const dataList: Types.SerializedPlayer[] = [];
            this.forEachPlayer(true, (player: ReplayPlayer) => dataList.push(player.serializeForSimulation()));

            return dataList;
        }

        public serialize(): Types.SerializedPlayer[] {
            const data: Types.SerializedPlayer[] = [];
            this.forEachPlayer(true, (player: ReplayPlayer) => {
                data.push(player.serialize());
            });
            return data;
        }

        public getWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}
