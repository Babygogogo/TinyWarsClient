
// import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import UserModel            from "../../user/model/UserModel";

namespace TwnsMpwPlayerManager {
    import BwPlayerManager = TwnsBwPlayerManager.BwPlayerManager;

    export class MpwPlayerManager extends BwPlayerManager {
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): TwnsBwPlayer.BwPlayer | null {
            const userId = Helpers.getExisted(UserModel.getSelfUserId());
            for (const [, player] of this.getAllPlayersDict()) {
                if (player.getUserId() === userId) {
                    return player;
                }
            }

            return null;
        }

        public getPlayerIndexLoggedIn(): number | null {
            return this.getPlayerLoggedIn()?.getPlayerIndex() ?? null;
        }

        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveWatcherTeamIndexes(Helpers.getExisted(UserModel.getSelfUserId()));
        }
    }
}

// export default TwnsMpwPlayerManager;
