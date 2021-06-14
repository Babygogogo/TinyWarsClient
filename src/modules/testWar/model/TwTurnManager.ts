
namespace TinyWars.TestWar {
    import ProtoTypes                   = Utility.ProtoTypes;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn    = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = WarAction.IWarActionPlayerEndTurn;

    export class TwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IWarActionSystemBeginTurn): void {}
        protected _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): void {}
        protected _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): void {}
        protected _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): void {}
        protected _runPhaseMain(data: IWarActionSystemBeginTurn): void {}
        protected _runPhaseResetVisionForCurrentPlayer(): void {}
        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void {}
        protected _runPhaseResetVisionForNextPlayer(): void {}
    }
}
