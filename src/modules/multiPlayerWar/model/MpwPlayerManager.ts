
// import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import UserModel            from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    export class MpwPlayerManager extends BaseWar.BwPlayerManager {
        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerLoggedIn(): BaseWar.BwPlayer | null {
            const userId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId());
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

        public getWatcherTeamIndexesForSelf(): Set<number> {
            const watcherUserId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId());
            const indexes       = new Set<number>();
            this.forEachPlayer(false, player => {
                if ((player.getUserId() === watcherUserId)                  ||
                    (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            });

            return indexes;
        }
    }
}

// export default TwnsMpwPlayerManager;
