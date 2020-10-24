
namespace TinyWars.SingleCustomWar {
    import DestructionHelpers       = Utility.DestructionHelpers;
    import ProtoTypes               = Utility.ProtoTypes;
    import Lang                     = Utility.Lang;
    import FloatText                = Utility.FloatText;
    import ConfigManager            = Utility.ConfigManager;
    import BwTurnManagerHelper      = BaseWar.BwTurnManagerHelper;
    import IActionPlayerBeginTurn   = ProtoTypes.WarAction.IActionPlayerBeginTurn;
    import IActionPlayerEndTurn     = ProtoTypes.WarAction.IActionPlayerEndTurn;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    export class ScwTurnManager extends BaseWar.BwTurnManager {
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
        protected _runPhaseMain(data: ProtoTypes.WarAction.IActionPlayerBeginTurn): void {
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
                ScwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
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
            ScwUtility.updateTilesAndUnitsOnVisibilityChanged(this.getWar());
        }
    }
}
