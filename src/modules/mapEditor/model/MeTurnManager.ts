
namespace TinyWars.MapEditor {
    import ProtoTypes               = Utility.ProtoTypes;
    import IActionSystemBeginTurn   = ProtoTypes.WarAction.IActionSystemBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;

    export class MeTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionSystemBeginTurn): void {
        }
        protected _runPhaseRepairUnitByTile(data: IActionSystemBeginTurn): void {
        }
        protected _runPhaseRepairUnitByUnit(data: IActionSystemBeginTurn): void {
        }
        protected _runPhaseRecoverUnitByCo(data: IActionSystemBeginTurn): void {
        }
        protected _runPhaseMain(data: IActionSystemBeginTurn): void {
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IActionPlayerEndTurn): void {
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
        }
    }
}
