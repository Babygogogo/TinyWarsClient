
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Helpers  = Utility.Helpers;
    import Logger   = Utility.Logger;

    export class McPlayerManager {
        private _players        = new Map<number, McPlayer>();
        private _war            : McWar;
        private _loggedInPlayer : McPlayer;

        public constructor() {
        }

        public init(datas: Types.SerializedMcPlayer[]): McPlayerManager {
            this._players.clear();
            for (const data of datas) {
                this._players.set(data.playerIndex!, new McPlayer().init(data));
            }
            return this;
        }

        public serialize(): Types.SerializedMcPlayer[] {
            const data: Types.SerializedMcPlayer[] = [];
            for (const [, player] of this._players) {
                data.push(player.serialize());
            }
            return data;
        }

        public startRunning(war: McWar): void {
            this._war = war;
            Logger.error("McPlayerManager.startRunning() TODO!!");
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayer(playerIndex: number): McPlayer | undefined {
            return this._players.get(playerIndex);
        }

        public getPlayerByUserId(userId: number): McPlayer | undefined {
            for (const [, player] of this._players) {
                if (player.getUserId() === userId) {
                    return player;
                }
            }
            return undefined;
        }

        public getLoggedInPlayer(): McPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getUserId();
                for (const [, player] of this._players) {
                    if (player.getUserId() === userId) {
                        this._loggedInPlayer = player;
                        break;
                    }
                }
            }
            return this._loggedInPlayer;
        }

        public getLoggedInPlayerIndex(): number | undefined {
            const player = this.getLoggedInPlayer();
            return player ? player.getPlayerIndex() : undefined;
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

        public forEachPlayer(includeNeutral: boolean, func: (p: McPlayer) => void): void {
            for (const [playerIndex, player] of this._players) {
                ((includeNeutral) || (playerIndex !== 0)) && (func(player));
            }
        }
    }
}
