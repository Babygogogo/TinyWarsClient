
namespace TinyWars.SingleCustomWar {
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;

    export class ScwTurnManager extends BaseWar.BwTurnManager {
        public serialize(): Types.SerializedTurn {
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
        protected _runPhaseMain(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar() as ScwWar;
            if (data.isDefeated) {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0014, war.getPlayer(playerIndex).getNickname()));
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

            if (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(playerInTurn.getTeamIndex())) {
                this._resetFogForWatcher();
            }
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            const war = this._getWar();
            if (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(war.getPlayerInTurn().getTeamIndex())) {
                this._resetFogForWatcher();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _resetFogForWatcher(): void {
            const war       = this._getWar() as ScwWar;
            const userId    = User.UserModel.getSelfUserId();
            war.getUnitMap().forEachUnitOnMap(unit => {
                const gridIndex = unit.getGridIndex();
                if (!VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                    war,
                    gridIndex,
                    unitType        : unit.getType(),
                    isDiving        : unit.getIsDiving(),
                    unitPlayerIndex : unit.getPlayerIndex(),
                    observerUserId  : userId,
                })) {
                    unit.setViewVisible(false);
                }
            });

            const tileMap = war.getTileMap();
            tileMap.forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToUser(war, tile.getGridIndex(), userId)) {
                    tile.setFogEnabled();
                } else {
                    tile.setFogDisabled();
                }
                tile.updateView();
            });
            tileMap.getView().updateCoZone();
        }
    }
}
