
namespace TinyWars.ReplayWar {
    import ProtoTypes               = Utility.ProtoTypes;
    import BwTurnManagerHelper      = BaseWar.BwTurnManagerHelper;
    import IActionSystemBeginTurn   = ProtoTypes.WarAction.IActionSystemBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;

    export class RwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByTile(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByUnit(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData(this);
        }
        protected _runPhaseRecoverUnitByCo(data: IActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithoutExtraData(this);
        }
        protected _runPhaseMain(data: IActionSystemBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            this.getWar().getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IActionPlayerEndTurn): void {
            BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithoutExtraData(this);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(this.getWar());
        }
    }
}
