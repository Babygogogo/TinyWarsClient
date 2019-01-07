
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Helpers  = Utility.Helpers;

    export class McPlayerManager {
        private _players            : { [playerIndex: number]: McPlayerModel } = {};

        private _totalPlayersCount  : number;
        private _loggedInPlayer     : McPlayerModel;

        public constructor(datas?: Types.SerializedMcPlayer[]) {
            if (datas) {
                this.init(datas);
            }
        }

        public init(datas: Types.SerializedMcPlayer[]): void {
            this._players = {};
            for (let i = 0; i < datas.length; ++i) {
                this._players[datas[i].playerIndex!] = new McPlayerModel(datas[i]);
            }
            this._totalPlayersCount = datas.length;
        }

        public serialize(): Types.SerializedMcPlayer[] {
            const data: Types.SerializedMcPlayer[] = [];
            for (const i in this._players) {
                data.push(this._players[i].serialize());
            }
            return data;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayer(playerIndex: number): McPlayerModel | undefined {
            return this._players[playerIndex];
        }

        public getPlayerByUserId(userId: number): McPlayerModel | undefined {
            for (const i in this._players) {
                const player = this._players[i];
                if (player.getUserId() === userId) {
                    return player;
                }
            }
            return undefined;
        }

        public getTotalPlayersCount(): number {
            return this._totalPlayersCount;
        }

        public getAlivePlayersCount(): number {
            let count = 0;
            for (const i in this._players) {
                if (this._players[i].getIsAlive()) {
                    ++count;
                }
            }
            return count;
        }

        public getAliveTeamsCount(ignoredPlayerIndex?: number): number {
            const aliveTeams: { [teamIndex: number]: boolean } = {};
            for (const i in this._players) {
                const player = this._players[i];
                if ((player.getIsAlive()) && (player.getPlayerIndex() !== ignoredPlayerIndex)) {
                    aliveTeams[player.getTeamIndex()] = true;
                }
            }

            return Helpers.getObjectKeysCount(aliveTeams);
        }

        public checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean {
            const p1 = this._players[playerIndex1];
            const p2 = this._players[playerIndex2];
            return (p1 != null) && (p2 != null) && (p1.getTeamIndex() === p2.getTeamIndex());
        }

        public getLoggedInPlayer(): McPlayerModel | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getUserId();
                for (const i in this._players) {
                    const player = this._players[i];
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
    }
}
