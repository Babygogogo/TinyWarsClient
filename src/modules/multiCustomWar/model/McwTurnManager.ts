
namespace TinyWars.MultiCustomWar {
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import Types                = Utility.Types;

    export class McwTurnManager extends BaseWar.BwTurnManager {
        public serializeForSimulation(): Types.SerializedTurn {
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
            const war           = this._getWar() as McwWar;
            if (data.isDefeated) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0014, war.getPlayer(playerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            const war               = this._getWar() as McwWar;
            const userId            = User.UserModel.getSelfUserId();
            const visibleUnitsOnMap = VisibilityHelpers.getAllUnitsOnMapVisibleToUser(war, userId);
            war.getUnitMap().forEachUnitOnMap(unit => {
                if (!visibleUnitsOnMap.has(unit)) {
                    DestructionHelpers.removeUnitOnMap(war, unit.getGridIndex());
                }
            });
            DestructionHelpers.removeInvisibleLoadedUnits(war, userId);

            const tileMap       = war.getTileMap();
            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToUser(war, userId);
            tileMap.forEachTile(tile => {
                if (visibleTiles.has(tile)) {
                    tile.setFogDisabled();
                } else {
                    tile.setFogEnabled();
                }
                tile.updateView();
            });
            tileMap.getView().updateCoZone();
        }
    }
}
