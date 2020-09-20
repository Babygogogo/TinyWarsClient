
namespace TinyWars.MultiCustomWar {
    export class McwPlayerManager extends BaseWar.BwPlayerManager {
        private _loggedInPlayer : McwPlayer;

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return McwPlayer;
        }
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): McwPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getSelfUserId();
                for (const [, player] of this._getPlayersMap()) {
                    if (player.getUserId() === userId) {
                        this._loggedInPlayer = player as McwPlayer;
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

        public getWatcherTeamIndexesForSelf(): Set<number> {
            return this.getWatcherTeamIndexes(User.UserModel.getSelfUserId());
        }
    }
}
