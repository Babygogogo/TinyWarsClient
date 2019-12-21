
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        private _humanPlayers       : ScwPlayer[];
        private _humanPlayerIndexes : number[];

        public serialize(): Types.SerializedPlayer[] {
            const data: Types.SerializedPlayer[] = [];
            this.forEachPlayer(true, (player: ScwPlayer) => {
                data.push(player.serialize());
            });
            return data;
        }

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ScwPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): ScwPlayer[] {
            if (!this._humanPlayers) {
                const players: ScwPlayer[] = [];
                for (const [, player] of this.getAllPlayers()) {
                    if (player.getUserId() != null) {
                        players.push(player as ScwPlayer);
                    }
                }
                this._humanPlayers = players;
            }
            return this._humanPlayers;
        }

        public getHumanPlayerIndexes(): number[] {
            if (!this._humanPlayerIndexes) {
                const playerIndexes: number[] = [];
                for (const player of this.getHumanPlayers()) {
                    playerIndexes.push(player.getPlayerIndex());
                }
                this._humanPlayerIndexes = playerIndexes;
            }
            return this._humanPlayerIndexes;
        }
    }
}
