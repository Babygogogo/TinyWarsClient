
namespace TinyWars.Replay {
    import SerializedBwTurn     = Types.SerializedTurn;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class ReplayTurnManager extends BaseWar.BwTurnManager {
        public serialize(): SerializedBwTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }

        protected _runPhaseMain(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar() as ReplayWar;
            if (data.isDefeated) {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0014, war.getPlayer(playerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                ReplayHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            } else {
                war.getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar();
            war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

            this._resetFogForPlayerInTurn();
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            this._resetFogForPlayerInTurn();
        }

        private _resetFogForPlayerInTurn(): void {
            const war       = this._getWar();
            const teamIndex = war.getPlayerInTurn().getTeamIndex();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToTeam(war, tile.getGridIndex(), teamIndex)) {
                    tile.setFogEnabled();
                } else {
                    tile.setFogDisabled();
                }
                tile.updateView();
            });
        }
    }
}
