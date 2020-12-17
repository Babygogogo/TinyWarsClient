
namespace TinyWars.MultiPlayerWar {
    export class MpwPlayerManager extends BaseWar.BwPlayerManager {
        private _loggedInPlayer : MpwPlayer;

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return MpwPlayer;
        }
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): MpwPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getSelfUserId();
                for (const [, player] of this._getPlayersMap()) {
                    if (player.getUserId() === userId) {
                        this._loggedInPlayer = player as MpwPlayer;
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

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveWatcherTeamIndexes(User.UserModel.getSelfUserId());
        }
    }
}
