
namespace TinyWars.MapEditor {
    import ProtoTypes                   = Utility.ProtoTypes;
    import IWarActionSystemBeginTurn    = ProtoTypes.WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = ProtoTypes.WarAction.IWarActionPlayerEndTurn;

    export class MeTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IWarActionSystemBeginTurn): void {
        }
        protected _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): void {
        }
        protected _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): void {
        }
        protected _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): void {
        }
        protected _runPhaseMain(data: IWarActionSystemBeginTurn): void {
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void {
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
        }
    }
}
