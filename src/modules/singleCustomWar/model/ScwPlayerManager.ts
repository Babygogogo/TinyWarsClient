
namespace TinyWars.SingleCustomWar {
    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        private _loggedInPlayer : ScwPlayer;

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ScwPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): ScwPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getSelfUserId();
                for (const [, player] of this.getAllPlayers()) {
                    if (player.getUserId() === userId) {
                        this._loggedInPlayer = player;
                        break;
                    }
                }
            }
            return this._loggedInPlayer;
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            const player = this.getPlayerLoggedIn();
            return player ? player.getPlayerIndex() : undefined;
        }
    }
}
