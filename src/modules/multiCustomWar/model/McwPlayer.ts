
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwPlayer extends BaseWar.BwPlayer {
        public serializeForSimulation(): Types.SerializedPlayer {
            const playerIndex       = this.getPlayerIndex();
            const selfUserId        = User.UserModel.getSelfUserId();
            const war               = this._getWar();
            const shouldShowFund    = (!war.getFogMap().checkHasFogCurrently()) || (war.getWatcherTeamIndexes(selfUserId).has(this.getTeamIndex()));

            return {
                fund                        : shouldShowFund ? this.getFund() : 0,
                hasVotedForDraw             : this.getHasVotedForDraw(),
                isAlive                     : this.getIsAlive(),
                playerIndex,
                teamIndex                   : this.getTeamIndex(),
                watchRequestSrcUserIdList   : [],
                watchOngoingSrcUserIdList   : [],
                userId                      : playerIndex > 0 ? selfUserId : null,
                coId                        : this.getCoId(),
                coUnitId                    : this.getCoUnitId(),
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                coUsingSkillType            : this.getCoUsingSkillType(),
                coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            };
        }
    }
}
