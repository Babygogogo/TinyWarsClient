
namespace TinyWars.MultiPlayerWar {
    import ProtoTypes               = Utility.ProtoTypes;
    import BwTurnManagerHelper      = BaseWar.BwTurnManagerHelper;
    import IActionSystemBeginTurn   = ProtoTypes.WarAction.IActionSystemBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;

    export class MpwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByTile(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByUnit(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithExtraData(this, data);
        }
        protected _runPhaseRecoverUnitByCo(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithExtraData(this, data);
        }
        protected _runPhaseMain(data: IActionSystemBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            this.getWar().getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IActionPlayerEndTurn): void {
            BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithExtraData(this, data);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(this.getWar());
        }
    }
}
