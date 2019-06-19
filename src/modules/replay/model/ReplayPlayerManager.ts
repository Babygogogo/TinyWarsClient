
namespace TinyWars.Replay {
    import Types    = Utility.Types;
    import Helpers  = Utility.Helpers;
    import Logger   = Utility.Logger;

    export class ReplayPlayerManager {
        private _players        = new Map<number, ReplayPlayer>();
        private _war            : ReplayWar;

        public constructor() {
        }

        public init(datas: Types.SerializedMcwPlayer[]): ReplayPlayerManager {
            this._players.clear();
            for (const data of datas) {
                this._players.set(data.playerIndex!, new ReplayPlayer().init(data) as ReplayPlayer);
            }
            return this;
        }

        public serialize(): Types.SerializedMcwPlayer[] {
            const data: Types.SerializedMcwPlayer[] = [];
            for (const [, player] of this._players) {
                data.push(player.serialize());
            }
            return data;
        }

        public startRunning(war: ReplayWar): void {
            this._war = war;
            for (const [, player] of this._players) {
                player.startRunning(war);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayer(playerIndex: number): ReplayPlayer | undefined {
            return this._players.get(playerIndex);
        }

        public getPlayerByUserId(userId: number): ReplayPlayer | undefined {
            for (const [, player] of this._players) {
                if (player.getUserId() === userId) {
                    return player;
                }
            }
            return undefined;
        }

        public getPlayerInTurn(): ReplayPlayer {
            return this.getPlayer(this._war.getTurnManager().getPlayerIndexInTurn());
        }

        public getTeamIndex(playerIndex: number): number {
            return this.getPlayer(playerIndex)!.getTeamIndex();
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
            const aliveTeams = new Map<number, boolean>();
            for (const [playerIndex, player] of this._players) {
                if ((player.getIsAlive())                   &&
                    (playerIndex !== ignoredPlayerIndex)    &&
                    ((includeNeutral) || (playerIndex !== 0))) {
                    aliveTeams.set(player.getTeamIndex(), true);
                }
            }
            return aliveTeams.size;
        }

        public checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean {
            const p1 = this._players.get(playerIndex1);
            const p2 = this._players.get(playerIndex2);
            return (p1 != null) && (p2 != null) && (p1.getTeamIndex() === p2.getTeamIndex());
        }

        public forEachPlayer(includeNeutral: boolean, func: (p: ReplayPlayer) => void): void {
            for (const [playerIndex, player] of this._players) {
                ((includeNeutral) || (playerIndex !== 0)) && (func(player));
            }
        }
    }
}
