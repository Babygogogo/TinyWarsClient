
namespace TinyWars.SingleCustomWar {
    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ScwPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): ScwPlayer[] {
            const players: ScwPlayer[] = [];
            for (const [, player] of this._getPlayersMap()) {
                if (player.getUserId() != null) {
                    players.push(player as ScwPlayer);
                }
            }
            return players;
        }

        public getHumanPlayerIndexes(): number[] {
            const playerIndexes: number[] = [];
            for (const player of this.getHumanPlayers()) {
                playerIndexes.push(player.getPlayerIndex());
            }
            return playerIndexes;
        }

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            const humanPlayers = this.getHumanPlayers();
            if (!humanPlayers.length) {
                return this.getAliveTeamIndexes(false);
            } else {
                return this.getAliveWatcherTeamIndexes(User.UserModel.getSelfUserId());
                // const player = this.getPlayerInTurn();
                // if (player.getUserId() != null) {
                //     return new Set<number>([player.getTeamIndex()]);
                // } else {
                //     const teamIndexes = new Set<number>();
                //     for (const player of humanPlayers) {
                //         teamIndexes.add(player.getTeamIndex());
                //     }
                //     if (teamIndexes.size <= 1) {
                //         return teamIndexes;
                //     } else {
                //         return new Set<number>();
                //     }
                // }
            }
        }
    }
}
