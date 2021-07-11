
import { Logger }           from "../../../utility/Logger";
import { BwPlayerManager }  from "../../baseWar/model/BwPlayerManager";
import { BwPlayer }         from "../../baseWar/model/BwPlayer";

export class SpwPlayerManager extends BwPlayerManager {
    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public getHumanPlayers(): BwPlayer[] {
        const players: BwPlayer[] = [];
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
            if (playerIndex == null) {
                Logger.error(`SpwPlayerManager.getHumanPlayerIndexes() empty playerIndex.`);
            } else {
                playerIndexes.push(playerIndex);
            }
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
            if (player == null) {
                Logger.error(`SpwPlayerManager.getAliveWatcherTeamIndexesForSelf() empty player.`);
                return new Set();
            }

            if (player.getUserId() != null) {
                const teamIndex = player.getTeamIndex();
                if (teamIndex == null) {
                    Logger.error(`SpwPlayerManager.getAliveWatcherTeamIndexesForSelf() empty player.teamIndex.`);
                    return new Set();
                }
                return new Set<number>([teamIndex]);
            } else {
                const teamIndexes = new Set<number>();
                for (const p of humanPlayers) {
                    const teamIndex = p.getTeamIndex();
                    if (teamIndex == null) {
                        Logger.error(`SpwPlayerManager.getAliveWatcherTeamIndexesForSelf() empty p.teamIndex.`);
                    } else {
                        teamIndexes.add(teamIndex);
                    }
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
