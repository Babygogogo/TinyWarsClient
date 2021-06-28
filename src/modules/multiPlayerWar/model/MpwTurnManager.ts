
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiPlayerWar {
    import ProtoTypes                   = Utility.ProtoTypes;
    import ClientErrorCode              = Utility.ClientErrorCode;
    import BwTurnManagerHelper          = BaseWar.BwTurnManagerHelper;
    import IWarActionSystemBeginTurn    = ProtoTypes.WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = ProtoTypes.WarAction.IWarActionPlayerEndTurn;

    export class MpwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IWarActionSystemBeginTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseGetFundWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRepairUnitByTileWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRepairUnitByUnitWithExtraData(this, data);
        }
        protected _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseRecoverUnitByCoWithExtraData(this, data);
        }
        protected _runPhaseMain(data: IWarActionSystemBeginTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseMainWithExtraData(this, data);
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): ClientErrorCode {
            return BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithExtraData(this, data);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.MpwTurnManager_RunPhaseResetVisionForCurrentPlayer_00;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.MpwTurnManager_RunPhaseResetVisionForCurrentPlayer_01;
            }

            war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

            return ClientErrorCode.NoError;
        }
        protected _runPhaseResetVisionForNextPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.MpwTurnManager_RunPhaseResetVisionForNextPlayer_00;
            }

            war.updateTilesAndUnitsOnVisibilityChanged();

            return ClientErrorCode.NoError;
        }
    }
}
