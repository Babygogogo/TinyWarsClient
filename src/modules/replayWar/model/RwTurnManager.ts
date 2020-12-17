
namespace TinyWars.ReplayWar {
    import DestructionHelpers       = Utility.DestructionHelpers;
    import ProtoTypes               = Utility.ProtoTypes;
    import Lang                     = Utility.Lang;
    import ConfigManager            = Utility.ConfigManager;
    import FloatText                = Utility.FloatText;
    import BwTurnManagerHelper      = BaseWar.BwTurnManagerHelper;
    import IActionPlayerBeginTurn   = ProtoTypes.WarAction.IActionPlayerBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    export class RwTurnManager extends BaseWar.BwTurnManager {
        protected _runPhaseGetFund(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseGetFundWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByTile(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData(this);
        }
        protected _runPhaseRepairUnitByUnit(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData(this);
        }
        protected _runPhaseRecoverUnitByCo(data: IActionPlayerBeginTurn): void {
            BwTurnManagerHelper.runPhaseRecoverUnitByCoWithoutExtraData(this);
        }
        protected _runPhaseMain(data: IActionPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this.getWar();
            const unitMap       = war.getUnitMap();
            if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) &&
                (this._getHasUnitOnBeginningTurn())                     &&
                (!unitMap.checkHasUnit(playerIndex))
            ) {
                war.getPlayer(playerIndex).getNickname().then(name => {
                    FloatText.show(Lang.getFormattedText(Lang.Type.F0014, name));
                });
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            } else {
                unitMap.forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
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
