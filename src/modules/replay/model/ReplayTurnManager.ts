
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import SerializedBwTurn     = Types.SerializedBwTurn;

    export class ReplayTurnManager extends BaseWar.BwTurnManager {
        public serialize(): SerializedBwTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }
        public serializeForPlayer(playerIndex: number): SerializedBwTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }
    }
}
