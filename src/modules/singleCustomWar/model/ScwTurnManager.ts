
namespace TinyWars.SingleCustomWar {
    import ProtoTypes                   = Utility.ProtoTypes;
    import ConfigManager                = Utility.ConfigManager;
    import Types                        = Utility.Types;
    import BwTurnManagerHelper          = BaseWar.BwTurnManagerHelper;
    import IWarActionSystemBeginTurn    = ProtoTypes.WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = ProtoTypes.WarAction.IWarActionPlayerEndTurn;
    import CommonConstants              = ConfigManager.COMMON_CONSTANTS;

    export class ScwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData(this);
        }
        protected _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithoutExtraData(this);
        }
        protected _runPhaseMain(data: IWarActionSystemBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this.getWar();
            const unitMap       = war.getUnitMap();
            if (unitMap.checkHasUnit(playerIndex)) {
                unitMap.forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            } else {
                if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) && (this._getHasUnitOnBeginningTurn())) {
                    war.getPlayer(playerIndex).setAliveState(Types.PlayerAliveState.Dying);
                }
            }
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void {
            BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithoutExtraData(this);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            ScwUtility.updateTilesAndUnitsOnVisibilityChanged(this.getWar());
        }
    }
}
