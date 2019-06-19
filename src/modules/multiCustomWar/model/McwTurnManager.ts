
namespace TinyWars.MultiCustomWar {
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class McwTurnManager extends BaseWar.BwTurnManager {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _runPhaseResetVisionForCurrentPlayer(): void {
            super._runPhaseResetVisionForCurrentPlayer();

            if (this.getPlayerIndexInTurn() === (this._getWar() as McwWar).getPlayerIndexLoggedIn()) {
                this._resetFogForPlayerLoggedIn();
            }
        }
        protected _runPhaseResetVisionForNextPlayer(): void {
            super._runPhaseResetVisionForNextPlayer();

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
        }
    }
}
