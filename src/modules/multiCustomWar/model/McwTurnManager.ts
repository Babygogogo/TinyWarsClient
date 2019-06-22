
namespace TinyWars.MultiCustomWar {
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;

    export class McwTurnManager extends BaseWar.BwTurnManager {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _runPhaseMain(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar() as McwWar;
            if (data.isDefeated) {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0014, war.getPlayer(playerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, playerIndex, true);
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            } else {
                war.getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
        }
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar() as McwWar;
            war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

            if (this.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn()) {
                this._resetFogForPlayerLoggedIn();
            }
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this._getWar();
            const fogMap        = war.getFogMap();
            fogMap.resetMapFromTilesForPlayer(playerIndex);
            fogMap.resetMapFromUnitsForPlayer(playerIndex);

            if (this.getPlayerIndexInTurn() === (this._getWar() as McwWar).getPlayerIndexLoggedIn()) {
                this._resetFogForPlayerLoggedIn();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _resetFogForPlayerLoggedIn(): void {
            const war           = this._getWar() as McwWar;
            const playerIndex   = war.getPlayerIndexLoggedIn();
            war.getUnitMap().forEachUnitOnMap(unit => {
                const gridIndex = unit.getGridIndex();
                if (!VisibilityHelpers.checkIsUnitOnMapVisibleToPlayer({
                    war,
                    gridIndex,
                    unitType            : unit.getType(),
                    isDiving            : unit.getIsDiving(),
                    unitPlayerIndex     : unit.getPlayerIndex(),
                    observerPlayerIndex : playerIndex,
                })) {
                    DestructionHelpers.destroyUnitOnMap(war, gridIndex, false, false);
                }
            });

            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToPlayer(war, tile.getGridIndex(), playerIndex)) {
                    tile.setFogEnabled();
                } else {
                    tile.setFogDisabled();
                }
                tile.updateView();
            });
        }
    }
}
