
namespace TinyWars.Replay {
    import Types    = Utility.Types;

    export class ReplayPlayerManager extends BaseWar.BwPlayerManager {
        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ReplayPlayer;
        }

        public serialize(): Types.SerializedBwPlayer[] {
            const data: Types.SerializedBwPlayer[] = [];
            this.forEachPlayer(true, (player: ReplayPlayer) => {
                data.push(player.serialize());
            });
            return data;
        }
    }
}
