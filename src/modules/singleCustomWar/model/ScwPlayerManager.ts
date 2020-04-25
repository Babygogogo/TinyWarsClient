
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        public serialize(): Types.SerializedPlayer[] {
            const data: Types.SerializedPlayer[] = [];
            this.forEachPlayer(true, (player: ScwPlayer) => {
                data.push(player.serialize());
            });
            return data;
        }

        public serializeForSimulation(): Types.SerializedPlayer[] {
            const dataList: Types.SerializedPlayer[] = [];
            this.forEachPlayer(true, (player: ScwPlayer) => dataList.push(player.serializeForSimulation()));

            return dataList;
        }

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ScwPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): ScwPlayer[] {
            const players: ScwPlayer[] = [];
            for (const [, player] of this.getAllPlayers()) {
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

        public getWatcherTeamIndexesForScw(): Set<number> {
            const humanPlayers = this.getHumanPlayers();
            if (!humanPlayers.length) {
                return this.getAliveTeamIndexes(false);
            } else {
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
