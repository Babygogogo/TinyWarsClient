
namespace TinyWars.MultiPlayerWar {
    export class MpwPlayerManager extends BaseWar.BwPlayerManager {
        private _loggedInPlayer : BaseWar.BwPlayer;

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): BaseWar.BwPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = User.UserModel.getSelfUserId();
                for (const [, player] of this.getAllPlayersDict()) {
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

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveWatcherTeamIndexes(User.UserModel.getSelfUserId());
        }
    }
}
