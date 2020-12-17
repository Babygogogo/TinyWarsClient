
namespace TinyWars.MultiPlayerWar {
    import DestructionHelpers       = Utility.DestructionHelpers;
    import ProtoTypes               = Utility.ProtoTypes;
    import Lang                     = Utility.Lang;
    import FloatText                = Utility.FloatText;
    import BwTurnManagerHelper      = BaseWar.BwTurnManagerHelper;
    import IActionPlayerBeginTurn   = ProtoTypes.WarAction.IActionPlayerBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;

    export class MpwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByTile(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithExtraData(this, data);
        }
        protected _runPhaseRepairUnitByUnit(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithExtraData(this, data);
        }
        protected _runPhaseRecoverUnitByCo(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithExtraData(this, data);
        }
        protected _runPhaseMain(data: IActionPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this.getWar();
            if (data.extraData.isDefeated) {
                war.getPlayer(playerIndex).getNickname().then(name => {
                    FloatText.show(Lang.getFormattedText(Lang.Type.F0014, name));
                });
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            } else {
                war.getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
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
