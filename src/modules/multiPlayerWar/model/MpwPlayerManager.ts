
import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
import UserModel            from "../../user/model/UserModel";

namespace TwnsMpwPlayerManager {
    import BwPlayerManager = TwnsBwPlayerManager.BwPlayerManager;

    export class MpwPlayerManager extends BwPlayerManager {
        private _loggedInPlayer : TwnsBwPlayer.BwPlayer;

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): TwnsBwPlayer.BwPlayer | undefined {
            if (!this._loggedInPlayer) {
                const userId = UserModel.getSelfUserId();
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
            return this.getAliveWatcherTeamIndexes(UserModel.getSelfUserId());
        }
    }
}

export default TwnsMpwPlayerManager;
