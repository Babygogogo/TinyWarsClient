
namespace TinyWars.SingleCustomWar {
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ISerialTurnManager   = ProtoTypes.WarSerialization.ISerialTurnManager;

    export class ScwTurnManager extends BaseWar.BwTurnManager {
        public serialize(): ISerialTurnManager {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }

        public serializeForSimulation(): ISerialTurnManager {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _runPhaseMain(data: ProtoTypes.WarAction.IActionPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar() as ScwWar;
            if (data.extraData.isDefeated) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0014, war.getPlayer(playerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            } else {
                war.getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const war           = this._getWar();
            const playerInTurn  = war.getPlayerInTurn();
            war.getFogMap().resetMapFromPathsForPlayer(playerInTurn.getPlayerIndex());

            // if (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(playerInTurn.getTeamIndex())) {
                this._resetFogForWatcher();
            // }
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            const war = this._getWar();
            // if (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(war.getPlayerInTurn().getTeamIndex())) {
                this._resetFogForWatcher();
            // }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _resetFogForWatcher(): void {
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(this._getWar() as ScwWar);
        }
    }
}
