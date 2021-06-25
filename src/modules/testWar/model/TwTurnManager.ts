
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.TestWar {
    import ClientErrorCode = Utility.ClientErrorCode;

    export class TwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseRepairUnitByTile(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseRepairUnitByUnit(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseRecoverUnitByCo(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseMain(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseResetVisionForCurrentPlayer(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseTickTurnAndPlayerIndex(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
        protected _runPhaseResetVisionForNextPlayer(): ClientErrorCode {
            return ClientErrorCode.NoError;
        }
    }
}
