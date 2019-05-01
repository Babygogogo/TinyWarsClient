
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Logger               = Utility.Logger;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import FloatText            = Utility.FloatText;
    import TimeModel            = Time.TimeModel;
    import SerializedMcTurn     = Types.SerializedMcwTurn;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import GridIndex            = Types.GridIndex;

    export class McwTurnManager {
        private _turnIndex          : number;
        private _playerIndexInTurn  : number;
        private _phaseCode          : TurnPhaseCode;
        private _enterTurnTime      : number;

        private _war                : McwWar;

        public constructor() {
        }

        public init(data: SerializedMcTurn): McwTurnManager {
            this._setTurnIndex(data.turnIndex);
            this._setPlayerIndexInTurn(data.playerIndex);
            this._setPhaseCode(data.turnPhaseCode);
            this._setEnterTurnTime(data.enterTurnTime);

            return this;
        }

        public startRunning(war: McwWar): void {
            this._war = war;
        }

        public serialize(): SerializedMcTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }
        public serializeForPlayer(playerIndex: number): SerializedMcTurn {
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
        public endPhaseWaitBeginTurn(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.WaitBeginTurn,
                "McTurnManager.endPhaseWaitBeginTurn() invalid current phase code: ", this.getPhaseCode()
            );

            FloatText.show(`${this._war.getPlayerInTurn().getNickname()} p${this.getPlayerIndexInTurn()}回合正式开始！！`);

            this._runPhaseGetFund(data);
            this._runPhaseConsumeFuel(data);
            this._runPhaseRepairUnitByTile(data);
            this._runPhaseDestroyUnitsOutOfFuel(data);
            this._runPhaseRepairUnitByUnit(data);
            this._runPhaseActivateMapWeapon(data);
            this._runPhaseMain(data);

            this._setPhaseCode(TurnPhaseCode.Main);
        }
        public endPhaseMain(): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.Main,
                "McTurnManager.endPhaseMain() invalid current phase code: ", this.getPhaseCode()
            );

            this._runPhaseResetUnitState();
            this._runPhaseResetVisionForCurrentPlayer();
            this._runPhaseTickTurnAndPlayerIndex();
            this._runPhaseResetSkillState();
            this._runPhaseResetVisionForNextPlayer();
            this._runPhaseResetVotesForDraw();
            this._runPhaseWaitBeginTurn();

            this._setPhaseCode(TurnPhaseCode.WaitBeginTurn);
        }

        private _runPhaseGetFund(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            this._war.getPlayer(this.getPlayerIndexInTurn()).setFund(data.remainingFund);
        }
        private _runPhaseConsumeFuel(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if ((playerIndex !== 0) && (this.getTurnIndex() > 0)) {
                this._war.getUnitMap().forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setCurrentFuel(Math.max(0, unit.getCurrentFuel() - unit.getFuelConsumptionPerTurn()));
                    }
                });
            }
        }
        private _runPhaseRepairUnitByTile(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const war               = this._war;
            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();

            for (const repairData of data.repairDataByTile || []) {
                const gridIndex     = repairData.gridIndex as GridIndex;
                const repairAmount  = repairData.repairAmount || 0;
                const unit          = unitMap.getUnitOnMap(gridIndex);
                if (repairAmount > 0) {
                    gridVisionEffect.showEffectRepair(gridIndex);
                } else {
                    (unit.checkCanBeSupplied()) && (gridVisionEffect.showEffectSupply(gridIndex));
                }
                unit.updateOnRepaired(repairAmount);
            }
        }
        private _runPhaseDestroyUnitsOutOfFuel(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war       = this._war;
                const fogMap    = war.getFogMap();
                war.getUnitMap().forEachUnitOnMap(unit => {
                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (unit.getCurrentFuel() <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, false, true);
                    }
                });
            }
        }
        private _runPhaseRepairUnitByUnit(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const war               = this._war;
            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();

            for (const repairData of data.repairDataByUnit || []) {
                const repairAmount = repairData.repairAmount || 0;
                if (repairData.unitId != null) {
                    const unit = unitMap.getUnitLoadedById(repairData.unitId);
                    if (repairAmount > 0) {
                        gridVisionEffect.showEffectRepair(unit.getGridIndex());
                    } else {
                        (unit.checkCanBeSupplied()) && (gridVisionEffect.showEffectSupply(unit.getGridIndex()));
                    }
                    unit.updateOnRepaired(repairAmount);
                } else {
                    const gridIndex = repairData.gridIndex as GridIndex;
                    const unit      = unitMap.getUnitOnMap(gridIndex);
                    if (repairAmount > 0) {
                        gridVisionEffect.showEffectRepair(gridIndex);
                    } else {
                        (unit.checkCanBeSupplied()) && (gridVisionEffect.showEffectSupply(gridIndex));
                    }
                    unit.updateOnRepaired(repairAmount);
                }
            }
        }
        private _runPhaseActivateMapWeapon(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            // TODO
        }
        private _runPhaseMain(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (data.isDefeated) {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0014, this._war.getPlayer(playerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(this._war, playerIndex, true);
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(this._war);
            } else {
                this._war.getUnitMap().forEachUnitOnMap(unit => (unit.getPlayerIndex() === playerIndex) && (unit.updateView()));
            }
        }
        private _runPhaseResetUnitState(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                this._war.getUnitMap().forEachUnit(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setState(Types.UnitState.Idle);
                        unit.updateView();
                    }
                });
            }
        }
        private _runPhaseResetVisionForCurrentPlayer(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war = this._war;
                war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

                if (playerIndex === war.getPlayerIndexLoggedIn()) {
                    this._resetFogForPlayerLoggedIn();
                }
            }
        }
        private _runPhaseTickTurnAndPlayerIndex(): void {
            const data = this._getNextTurnAndPlayerIndex();
            this._setTurnIndex(data.turnIndex);
            this._setPlayerIndexInTurn(data.playerIndex);
            this._setEnterTurnTime(TimeModel.getServerTimestamp());
        }
        private _runPhaseResetSkillState(): void {
            // TODO
            // const playerIndex = this.getPlayerIndexInTurn();
            // if (playerIndex !== 0) {
            // }
        }
        private _runPhaseResetVisionForNextPlayer(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war       = this._war;
                const fogMap    = war.getFogMap();
                fogMap.resetMapFromTilesForPlayer(playerIndex);
                fogMap.resetMapFromUnitsForPlayer(playerIndex);

                if (playerIndex === war.getPlayerIndexLoggedIn()) {
                    this._resetFogForPlayerLoggedIn();
                }
            }
        }
        private _runPhaseResetVotesForDraw(): void {
            this._war.getPlayer(this.getPlayerIndexInTurn())!.setHasVotedForDraw(false);
        }
        private _runPhaseWaitBeginTurn(): void {
            // Do nothing.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTurnIndex(): number {
            return this._turnIndex;
        }
        private _setTurnIndex(index: number): void {
            if (this._turnIndex !== index){
                this._turnIndex = index;
                Notify.dispatch(Notify.Type.McwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number {
            return this._playerIndexInTurn;
        }
        private _setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(Notify.Type.McwPlayerIndexInTurnChanged);
            }
        }
        public getNextPlayerIndex(playerIndex: number, includeNeutral = false): number {
            const data = this._getNextTurnAndPlayerIndex(undefined, playerIndex);
            if ((data.playerIndex !== 0) || (includeNeutral)) {
                return data.playerIndex;
            } else {
                return this._getNextTurnAndPlayerIndex(data.turnIndex, data.playerIndex).playerIndex;
            }
        }

        public getPhaseCode(): TurnPhaseCode {
            return this._phaseCode;
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            if (this._phaseCode !== code) {
                this._phaseCode = code;
                Notify.dispatch(Notify.Type.McwTurnPhaseCodeChanged);
            }
        }

        public getEnterTurnTime(): number {
            return this._enterTurnTime;
        }
        private _setEnterTurnTime(time: number): void {
            this._enterTurnTime = time;
        }

        private _getNextTurnAndPlayerIndex(currTurnIndex = this.getTurnIndex(), currPlayerIndex = this.getPlayerIndexInTurn()): { turnIndex: number, playerIndex: number } {
            const playerManager = this._war.getPlayerManager();
            const playersCount  = playerManager.getTotalPlayersCount(true);
            let nextTurnIndex   = currTurnIndex;
            let nextPlayerIndex = currPlayerIndex + 1;
            while (true) {
                if (nextPlayerIndex >= playersCount) {
                    nextPlayerIndex = 0;
                    nextTurnIndex   += 1;
                }

                if (playerManager.getPlayer(nextPlayerIndex)!.getIsAlive()) {
                    return { turnIndex: nextTurnIndex, playerIndex: nextPlayerIndex };
                } else {
                    ++nextPlayerIndex;
                }
            }
        }

        private _resetFogForPlayerLoggedIn(): void {
            const war           = this._war;
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
                    tile.updateView();
                }
            });
        }
    }

    function sorterForRepairUnits(unit1: McwUnit, unit2: McwUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        const cost2 = unit2.getProductionFinalCost();
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return unit1.getUnitId() - unit2.getUnitId();
        }
    }
}
