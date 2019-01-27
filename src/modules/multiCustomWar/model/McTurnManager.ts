
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import Logger               = Utility.Logger;
    import SerializedMcTurn     = Types.SerializedMcTurn;
    import TurnPhaseCode        = Types.TurnPhaseCode;

    export class McTurnManager {
        private _turnIndex          : number;
        private _playerIndexInTurn  : number;
        private _phaseCode          : TurnPhaseCode;
        private _war                : McWar;

        private _hasUnitOnBeginningTurn = false;

        public constructor() {
        }

        public init(data: SerializedMcTurn): McTurnManager {
            this._turnIndex         = data.turnIndex;
            this._playerIndexInTurn = data.playerIndex;
            this._phaseCode         = data.turnPhaseCode;

            return this;
        }

        public startRunning(war: McWar): void {
            this._war = war;
        }

        public serialize(): SerializedMcTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
            };
        }
        public serializeForPlayer(playerIndex: number): SerializedMcTurn {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public beginPhaseGetFund(): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.RequestBeginTurn,
                "McTurnManager.beginPhaseGetFund() invalid current phase code: ", this.getPhaseCode()
            );

            this._setPhaseCode(TurnPhaseCode.GetFund);
            this._runTurn();
        }
        public endPhaseMain(): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.Main,
                "McTurnManager.endPhaseMain() invalid current phase code: ", this.getPhaseCode()
            );

            this._setPhaseCode(TurnPhaseCode.ResetUnitState);
            this._runTurn();
        }

        private _runTurn(): void {
            if (this.getPhaseCode() === TurnPhaseCode.GetFund) {
                this._runPhaseGetFund();
                this._setPhaseCode(TurnPhaseCode.ConsumeFuel);
            }
            if (this.getPhaseCode() === TurnPhaseCode.ConsumeFuel) {
                this._runPhaseConsumeFuel();
                this._setPhaseCode(TurnPhaseCode.RepairUnitByTile);
            }
            if (this.getPhaseCode() === TurnPhaseCode.RepairUnitByTile) {
                this._runPhaseRepairUnitByTile();
                this._setPhaseCode(TurnPhaseCode.DestroyUnitsOutOfFuel);
            }
            if (this.getPhaseCode() === TurnPhaseCode.DestroyUnitsOutOfFuel) {
                this._runPhaseDestroyUnitsOutOfFuel();
                this._setPhaseCode(TurnPhaseCode.RepairUnitByUnit);
            }
            if (this.getPhaseCode() === TurnPhaseCode.RepairUnitByUnit) {
                this._runPhaseRepairUnitByUnit();
                this._setPhaseCode(TurnPhaseCode.Main);
            }
            if (this.getPhaseCode() === TurnPhaseCode.Main) {
                this._runPhaseMain();
                // DO NOT update phase code.
            }
            if (this.getPhaseCode() === TurnPhaseCode.ResetUnitState) {
                this._runPhaseResetUnitState();
                this._setPhaseCode(TurnPhaseCode.ResetVisionForCurrentPlayer);
            }
            if (this.getPhaseCode() === TurnPhaseCode.ResetVisionForCurrentPlayer) {
                this._runPhaseResetVisionForCurrentPlayer();
                this._setPhaseCode(TurnPhaseCode.TickTurnAndPlayerIndex);
            }
            if (this.getPhaseCode() === TurnPhaseCode.TickTurnAndPlayerIndex) {
                this._runPhaseTickTurnAndPlayerIndex();
                this._setPhaseCode(TurnPhaseCode.ResetSkillState);
            }
            if (this.getPhaseCode() === TurnPhaseCode.ResetSkillState) {
                this._runPhaseResetSkillState();
                this._setPhaseCode(TurnPhaseCode.ResetVisionForNextPlayer);
            }
            if (this.getPhaseCode() === TurnPhaseCode.ResetVisionForNextPlayer) {
                this._runPhaseResetVisionForNextPlayer();
                this._setPhaseCode(TurnPhaseCode.ResetVotesForDraw);
            }
            if (this.getPhaseCode() === TurnPhaseCode.ResetVotesForDraw) {
                this._runPhaseResetVotesForDraw();
                this._setPhaseCode(TurnPhaseCode.RequestBeginTurn);
            }
            if (this.getPhaseCode() === TurnPhaseCode.RequestBeginTurn) {
                this._runPhaseRequestBeginTurn();
                // DO NOT update phase code.
            }
        }
        private _runPhaseGetFund(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                let totalIncome = 0;
                this._war.getTileMap().forEachTile(tile => {
                    totalIncome += tile.getIncomeForPlayer(playerIndex);
                });

                const player = this._war.getPlayer(playerIndex)!;
                player.setFund(player.getFund() + totalIncome);
                this._hasUnitOnBeginningTurn = this._war.getUnitMap().checkHasUnit(playerIndex);
            }
        }
        private _runPhaseConsumeFuel(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if ((playerIndex !== 0) && (this.getTurnIndex() > 0)) {
                this._war.getUnitMap().forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setCurrentFuel(Math.max(0, unit.getCurrentFuel() - unit.getFuelConsumptionPerTurn()));
                    }
                });
            }
        }
        private _runPhaseRepairUnitByTile(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war           = this._war;
                const allUnitsOnMap = [] as McUnit[];
                war.getUnitMap().forEachUnitOnMap(unit => {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsOnMap.push(unit));
                });

                const tileMap   = war.getTileMap();
                const player    = war.getPlayer(playerIndex)!;
                for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                    const repairData = tileMap.getTile(unit.getGridIndex()).getRepairHpAndCostForUnit(unit);
                    if (repairData) {
                        unit.updateOnRepaired(repairData.hp);
                        player.setFund(player.getFund() - repairData.cost);
                    }
                }
            }
        }
        private _runPhaseDestroyUnitsOutOfFuel(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war           = this._war;
                const fogMap        = war.getFogMap();
                war.getUnitMap().forEachUnitOnMap(unit => {
                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (unit.getCurrentFuel() <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                    }
                });
            }
        }
        private _runPhaseRepairUnitByUnit(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const allUnitsLoaded    = [] as McUnit[];
                const war               = this._war;
                const unitMap           = war.getUnitMap();
                unitMap.forEachUnitLoaded(unit => {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsLoaded.push(unit));
                });

                const player = war.getPlayer(playerIndex)!;
                for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                    const loader        = unit.getLoaderUnit()!;
                    const repairData    = loader.getRepairHpAndCostForLoadedUnit(unit);
                    if (repairData) {
                        unit.updateOnRepaired(repairData.hp);
                        player.setFund(player.getFund() - repairData.cost);
                    } else if (loader.checkCanSupplyLoadedUnit()) {
                        unit.updateOnSupplied();
                    }
                }
            }
        }
        private _runPhaseMain(): void {
            const war           = this._war;
            const playerIndex   = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                if ((this._hasUnitOnBeginningTurn) && (!war.getUnitMap().checkHasUnit(playerIndex))) {
                    DestructionHelpers.destroyPlayerForce(war, playerIndex);

                    if (war.getPlayerManager().getAliveTeamsCount(false) <= 1) {
                        war.setIsEnded(true);
                    } else {
                        this.endPhaseMain();
                    }
                }
            } else {
                // TODO: Activate neutral map weapons.
            }
        }
        private _runPhaseResetUnitState(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                this._war.getUnitMap().forEachUnit(unit => {
                    (unit.getPlayerIndex() === playerIndex) && (unit.setState(Types.UnitState.Idle));
                });
            }
        }
        private _runPhaseResetVisionForCurrentPlayer(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                this._war.getFogMap().resetMapFromPathsForPlayer(this.getPlayerIndexInTurn());
            }
        }
        private _runPhaseTickTurnAndPlayerIndex(): void {
            const data = this._getNextTurnAndPlayerIndex();
            this._setTurnIndex(data.turnIndex);
            this._setPlayerIndexInTurn(data.playerIndex);
        }
        private _runPhaseResetSkillState(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                // TODO
            }
        }
        private _runPhaseResetVisionForNextPlayer(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const fogMap = this._war.getFogMap();
                fogMap.resetMapFromTilesForPlayer(playerIndex);
                fogMap.resetMapFromUnitsForPlayer(playerIndex);
            }
        }
        private _runPhaseResetVotesForDraw(): void {
            this._war.getPlayer(this.getPlayerIndexInTurn())!.setHasVotedForDraw(false);
        }
        private _runPhaseRequestBeginTurn(): void {
            // Do nothing.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTurnIndex(): number {
            return this._turnIndex;
        }
        private _setTurnIndex(index: number): void {
            this._turnIndex = index;
        }

        public getPlayerIndexInTurn(): number {
            return this._playerIndexInTurn;
        }
        private _setPlayerIndexInTurn(index: number): void {
            this._playerIndexInTurn = index;
        }

        public getPhaseCode(): TurnPhaseCode {
            return this._phaseCode;
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            this._phaseCode = code;
        }

        private _getNextTurnAndPlayerIndex(): { turnIndex: number, playerIndex: number } {
            const playerManager = this._war.getPlayerManager();
            const playersCount  = playerManager.getTotalPlayersCount(true);
            let nextTurnIndex   = this.getTurnIndex();
            let nextPlayerIndex = this.getPlayerIndexInTurn() + 1;
            while (true) {
                if (nextPlayerIndex > playersCount) {
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
    }

    function sorterForRepairUnits(unit1: McUnit, unit2: McUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        const cost2 = unit2.getProductionFinalCost();
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return unit1.getUnitId() - unit2.getUnitId();
        }
    }
}
