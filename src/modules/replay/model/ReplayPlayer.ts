
namespace TinyWars.Replay {
    import Types    = Utility.Types;

    export class ReplayPlayer extends BaseWar.BwPlayer {
        public serialize(): Types.SerializedBwPlayer {
            return {
                fund                : this.getFund(),
                hasVotedForDraw     : this.getHasVotedForDraw(),
                isAlive             : this.getIsAlive(),
                playerIndex         : this.getPlayerIndex(),
                teamIndex           : this.getTeamIndex(),
                userId              : this.getUserId(),
                nickname            : this.getNickname(),
                coId                : this.getCoId(),
                coUnitId            : this.getCoUnitId(),
                coCurrentEnergy     : this.getCoCurrentEnergy(),
                coIsUsingSkill      : this.getCoIsUsingSkill(),
                coIsDestroyedInTurn : this.getCoIsDestroyedInTurn(),
            };
        }
    }
}
