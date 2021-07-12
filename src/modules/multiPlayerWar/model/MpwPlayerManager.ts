
import { BwPlayer }         from "../../baseWar/model/BwPlayer";
import { BwPlayerManager }  from "../../baseWar/model/BwPlayerManager";
import { UserModel }        from "../../user/model/UserModel";

export class MpwPlayerManager extends BwPlayerManager {
    private _loggedInPlayer : BwPlayer;

    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public getPlayerLoggedIn(): BwPlayer | undefined {
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
