
namespace TinyWars.SingleCustomWar {
    import Types = Utility.Types;

    export class ScwPlayer extends BaseWar.BwPlayer {
        public serialize(): Types.SerializedPlayer {
            return {
                fund                        : this.getFund(),
                hasVotedForDraw             : this.getHasVotedForDraw(),
                isAlive                     : this.getIsAlive(),
                playerIndex                 : this.getPlayerIndex(),
                teamIndex                   : this.getTeamIndex(),
                userId                      : this.getUserId(),
                coId                        : this.getCoId(),
                coUnitId                    : this.getCoUnitId(),
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                coUsingSkillType            : this.getCoUsingSkillType(),
                coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            };
        }
    }
}
