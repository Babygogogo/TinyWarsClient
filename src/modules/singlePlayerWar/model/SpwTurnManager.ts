
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.SinglePlayerWar {
    import ClientErrorCode      = Utility.ClientErrorCode;
    import BwTurnManagerHelper  = BaseWar.BwTurnManagerHelper;

    export class SpwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseGetFundWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByTile(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByUnit(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData(this);
        }
        protected _runPhaseRecoverUnitByCo(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRecoverUnitByCoWithoutExtraData(this);
        }
        protected _runPhaseMain(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseMainWithoutExtraData(this);
        }

        protected _runPhaseTickTurnAndPlayerIndex(): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithoutExtraData(this);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.SpwTurnManager_RunPhaseResetVisionForCurrentPlayer_00;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.SpwTurnManager_RunPhaseResetVisionForCurrentPlayer_01;
            }

            war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

            return ClientErrorCode.NoError;
        }
        protected _runPhaseResetVisionForNextPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.SpwTurnManager_RunPhaseResetVisionForNextPlayer_00;
            }

            war.updateTilesAndUnitsOnVisibilityChanged();

            return ClientErrorCode.NoError;
        }
    }
}
