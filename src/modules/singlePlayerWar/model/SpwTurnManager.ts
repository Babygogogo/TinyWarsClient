
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.SinglePlayerWar {
    import Types                        = Utility.Types;
    import CommonConstants              = Utility.CommonConstants;
    import ClientErrorCode              = Utility.ClientErrorCode;
    import BwTurnManagerHelper          = BaseWar.BwTurnManagerHelper;

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
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.SpwTurnManager_RunPhaseMain_00;
            }

            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.SpwTurnManager_RunPhaseMain_01;
            }

            const unitMap = war.getUnitMap();
            if (unitMap.checkHasUnit(playerIndex)) {
                unitMap.forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            } else {
                if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) && (this._getHasUnitOnBeginningTurn())) {
                    const player = war.getPlayer(playerIndex);
                    if (player == null) {
                        return ClientErrorCode.SpwTurnManager_RunPhaseMain_02;
                    }

                    player.setAliveState(Types.PlayerAliveState.Dying);
                }
            }

            return ClientErrorCode.NoError;
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
