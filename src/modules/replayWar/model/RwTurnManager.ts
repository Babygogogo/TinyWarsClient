
namespace TinyWars.ReplayWar {
    import ProtoTypes                   = Utility.ProtoTypes;
    import BwTurnManagerHelper          = BaseWar.BwTurnManagerHelper;
    import IWarActionSystemBeginTurn    = ProtoTypes.WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = ProtoTypes.WarAction.IWarActionPlayerEndTurn;

    export class RwTurnManager extends BaseWar.BwTurnManager {
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
            const playerIndex = this.getPlayerIndexInTurn();
            this.getWar().getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
        }

        protected _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void {
            BwTurnManagerHelper.runPhaseTickTurnAndPlayerIndexWithoutExtraData(this);
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            this.getWar().updateTilesAndUnitsOnVisibilityChanged();
        }
    }
}
