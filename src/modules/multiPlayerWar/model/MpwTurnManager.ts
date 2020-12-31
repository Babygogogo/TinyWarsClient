
namespace TinyWars.MultiPlayerWar {
    import ProtoTypes                   = Utility.ProtoTypes;
    import BwTurnManagerHelper          = BaseWar.BwTurnManagerHelper;
    import IWarActionSystemBeginTurn    = ProtoTypes.WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = ProtoTypes.WarAction.IWarActionPlayerEndTurn;

    export class MpwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithExtraData(this, data);
        }
        protected _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithExtraData(this, data);
        }
        protected _runPhaseMain(data: IWarActionSystemBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            this.getWar().getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void {
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
