
namespace TinyWars.BaseWar {
    import Types    = Utility.Types;

    export abstract class BwPlayerManager {
        private _players        = new Map<number, BwPlayer>();
        private _war            : BwWar;

        protected abstract _getPlayerClass(): new () => BwPlayer;

        public init(dataList: Types.SerializedPlayer[]): BwPlayerManager {
            this._players.clear();
            for (const data of dataList) {
                this._players.set(data.playerIndex!, (new (this._getPlayerClass())).init(data));
            }
            return this;
        }
        public fastInit(dataList: Types.SerializedPlayer[]): BwPlayerManager {
            for (const data of dataList) {
                this.getPlayer(data.playerIndex).init(data);
            }
            return this;
        }

        public startRunning(war: BwWar): void {
            this._war = war;
            for (const [, player] of this._players) {
                player.startRunning(war);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayer(playerIndex: number): BwPlayer | undefined {
            return this._players.get(playerIndex);
        }
        public getAllPlayers(): Map<number, BwPlayer> {
            return this._players;
        }

        public getPlayerByUserId(userId: number): BwPlayer | undefined {
            for (const [, player] of this._players) {
                if (player.getUserId() === userId) {
                    return player;
                }
            }
            return undefined;
        }

        public getPlayerInTurn(): BwPlayer {
            return this.getPlayer(this._war.getTurnManager().getPlayerIndexInTurn());
        }

        public getTeamIndex(playerIndex: number): number {
            return this.getPlayer(playerIndex)!.getTeamIndex();
        }

        public getPlayerIndexesInTeam(teamIndex: number): number[] {
            const playerIndexes: number[] = [];
            for (const [playerIndex, player] of this._players) {
                if (player.getTeamIndex() === teamIndex) {
                    playerIndexes.push(playerIndex);
                }
            }
            return playerIndexes;
        }
        public getPlayerIndexesInTeams(teamIndexes: Set<number>): Set<number> {
            const playerIndexes = new Set<number>();
            for (const [playerIndex, player] of this._players) {
                if (teamIndexes.has(player.getTeamIndex())) {
                    playerIndexes.add(playerIndex);
                }
            }
            return playerIndexes;
        }

        public getTotalPlayersCount(includeNeutral: boolean): number {
            return includeNeutral ? this._players.size : this._players.size - 1;
        }

        public getAlivePlayersCount(includeNeutral: boolean): number {
            let count = 0;
            for (const [playerIndex, player] of this._players) {
                if ((player.getIsAlive())                   &&
                    ((includeNeutral) || (playerIndex !== 0))) {
                    ++count;
                }
            }
            return count;
        }

        public getAliveTeamsCount(includeNeutral: boolean, ignoredPlayerIndex?: number): number {
            return this.getAliveTeamIndexes(includeNeutral, ignoredPlayerIndex).size;
        }

        public getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number> {
            const indexes = new Set<number>();
            for (const [playerIndex, player] of this._players) {
                if ((player.getIsAlive())                   &&
                    (playerIndex !== ignoredPlayerIndex)    &&
                    ((includeNeutral) || (playerIndex !== 0))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            }
            return indexes;
        }

        public checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean {
            const p1 = this._players.get(playerIndex1);
            const p2 = this._players.get(playerIndex2);
            return (p1 != null) && (p2 != null) && (p1.getTeamIndex() === p2.getTeamIndex());
        }

        public forEachPlayer(includeNeutral: boolean, func: (p: BwPlayer) => void): void {
            for (const [playerIndex, player] of this._players) {
                ((includeNeutral) || (playerIndex !== 0)) && (func(player));
            }
        }

        public getWatcherTeamIndexes(watcherUserId: number): Set<number> {
            const indexes = new Set<number>();
            this.forEachPlayer(false, player => {
                if (player.getIsAlive()) {
                    if ((player.getUserId() === watcherUserId) ||
                        (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                    ) {
                        indexes.add(player.getTeamIndex());
                    }
                }
            });
            return indexes;
        }
        public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
            for (const [playerIndex, player] of this._players) {
                if ((playerIndex !== 0) && (player.getIsAlive())) {
                    if ((player.getUserId() === watcherUserId) || (player.getWatchOngoingSrcUserIds().has(watcherUserId))) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
