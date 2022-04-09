
// import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import Helpers              from "../../tools/helpers/Helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpwPlayerManager {
    import BwPlayerManager  = Twns.BaseWar.BwPlayerManager;

    export class SpwPlayerManager extends BwPlayerManager {
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): Twns.BaseWar.BwPlayer[] {
            const players: Twns.BaseWar.BwPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                if (player.getUserId() != null) {
                    players.push(player);
                }
            }
            return players;
        }

        public getHumanPlayerIndexes(): number[] {
            const playerIndexes: number[] = [];
            for (const player of this.getHumanPlayers()) {
                const playerIndex = player.getPlayerIndex();
                playerIndexes.push(playerIndex);
            }
            return playerIndexes;
        }

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            const humanPlayers = this.getHumanPlayers();
            if (!humanPlayers.length) {
                return this.getAliveTeamIndexes(false);
            } else {
                // return this.getAliveWatcherTeamIndexes(UserModel.getSelfUserId());
                const player = this.getPlayerInTurn();
                if (player.getUserId() != null) {
                    const teamIndex = player.getTeamIndex();
                    return new Set<number>([teamIndex]);
                } else {
                    const teamIndexes = new Set<number>();
                    for (const p of humanPlayers) {
                        const teamIndex = p.getTeamIndex();
                        teamIndexes.add(teamIndex);
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

// export default TwnsSpwPlayerManager;
