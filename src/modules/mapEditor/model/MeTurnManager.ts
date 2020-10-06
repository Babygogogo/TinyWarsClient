
namespace TinyWars.MapEditor {
    import ProtoTypes               = Utility.ProtoTypes;
    import IActionPlayerBeginTurn   = ProtoTypes.WarAction.IActionPlayerBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;

    export class MeTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionPlayerBeginTurn): void {
        }
        protected _runPhaseRepairUnitByTile(data: IActionPlayerBeginTurn): void {
        }
        protected _runPhaseRepairUnitByUnit(data: IActionPlayerBeginTurn): void {
        }
        protected _runPhaseRecoverUnitByCo(data: IActionPlayerBeginTurn): void {
        }
        protected _runPhaseMain(data: ProtoTypes.WarAction.IActionPlayerBeginTurn): void {
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IActionPlayerEndTurn): void {
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
        }
    }
}
