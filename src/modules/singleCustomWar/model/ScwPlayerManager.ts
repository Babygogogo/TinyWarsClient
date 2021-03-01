
namespace TinyWars.SingleCustomWar {
    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): BaseWar.BwPlayer[] {
            const players: BaseWar.BwPlayer[] = [];
            for (const [, player] of this._getPlayersMap()) {
                if (player.getUserId() != null) {
                    players.push(player);
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
                // return this.getAliveWatcherTeamIndexes(User.UserModel.getSelfUserId());
                const player = this.getPlayerInTurn();
                if (player.getUserId() != null) {
                    return new Set<number>([player.getTeamIndex()]);
                } else {
                    const teamIndexes = new Set<number>();
                    for (const player of humanPlayers) {
                        teamIndexes.add(player.getTeamIndex());
                    }
                    if (teamIndexes.size <= 1) {
                        return teamIndexes;
                    } else {
                        return new Set<number>();
                    }
                }
            }
        }
    }
}
