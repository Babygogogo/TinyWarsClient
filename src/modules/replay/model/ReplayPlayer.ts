
namespace TinyWars.Replay {
    import Types    = Utility.Types;

    export class ReplayPlayer extends BaseWar.BwPlayer {
        public serialize(): Types.SerializedPlayer {
            return {
                fund                        : this.getFund(),
                hasVotedForDraw             : this.getHasVotedForDraw(),
                isAlive                     : this.getIsAlive(),
                playerIndex                 : this.getPlayerIndex(),
                teamIndex                   : this.getTeamIndex(),
                restTimeToBoot              : this.getRestTimeToBoot(),
                watchRequestSrcUserIdList   : [...this.getWatchRequestSrcUserIds()],
                watchOngoingSrcUserIdList   : [...this.getWatchOngoingSrcUserIds()],
                userId                      : this.getUserId(),
                coId                        : this.getCoId(),
                coUnitId                    : this.getCoUnitId(),
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                coUsingSkillType            : this.getCoUsingSkillType(),
                coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            };
        }

        public serializeForSimulation(): Types.SerializedPlayer {
            const playerIndex   = this.getPlayerIndex();
            const selfUserId    = User.UserModel.getSelfUserId();

            return {
                fund                        : this.getFund(),
                hasVotedForDraw             : this.getHasVotedForDraw(),
                isAlive                     : this.getIsAlive(),
                playerIndex,
                teamIndex                   : this.getTeamIndex(),
                restTimeToBoot              : this.getRestTimeToBoot(),
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
