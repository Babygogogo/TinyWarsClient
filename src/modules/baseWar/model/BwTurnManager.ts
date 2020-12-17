
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import DestructionHelpers       = Utility.DestructionHelpers;
    import Logger                   = Utility.Logger;
    import Notify                   = Utility.Notify;
    import ProtoTypes               = Utility.ProtoTypes;
    import TurnPhaseCode            = Types.TurnPhaseCode;
    import ISerialTurnManager       = ProtoTypes.WarSerialization.ISerialTurnManager;
    import WarAction                = ProtoTypes.WarAction;
    import IActionPlayerBeginTurn   = WarAction.IActionPlayerBeginTurn;
    import IActionPlayerEndTurn     = WarAction.IActionPlayerEndTurn;

    export abstract class BwTurnManager {
        private _turnIndex          : number;
        private _playerIndexInTurn  : number;
        private _phaseCode          : TurnPhaseCode;
        private _enterTurnTime      : number;

        private _war                    : BwWar;
        private _hasUnitOnBeginningTurn = false;

        protected abstract _runPhaseGetFund(data: IActionPlayerBeginTurn): void;
        protected abstract _runPhaseRepairUnitByTile(data: IActionPlayerBeginTurn): void;
        protected abstract _runPhaseRepairUnitByUnit(data: IActionPlayerBeginTurn): void;
        protected abstract _runPhaseRecoverUnitByCo(data: IActionPlayerBeginTurn): void;
        protected abstract _runPhaseMain(data: IActionPlayerBeginTurn): void;
        protected abstract _runPhaseResetVisionForCurrentPlayer(): void;
        protected abstract _runPhaseTickTurnAndPlayerIndex(data: IActionPlayerEndTurn): void;
        protected abstract _runPhaseResetVisionForNextPlayer(): void;

        public init(data: ISerialTurnManager): BwTurnManager {
            this.setTurnIndex(data.turnIndex);
            this.setPlayerIndexInTurn(data.playerIndex);
            this._setPhaseCode(data.turnPhaseCode);
            this.setEnterTurnTime(data.enterTurnTime);

            return this;
        }
        public fastInit(data: ISerialTurnManager): BwTurnManager {
            return this.init(data);
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        public serialize(): ISerialTurnManager {
            return {
                turnIndex       : this.getTurnIndex(),
                playerIndex     : this.getPlayerIndexInTurn(),
                turnPhaseCode   : this.getPhaseCode(),
                enterTurnTime   : this.getEnterTurnTime(),
            };
        }
        public serializeForSimulation(): ISerialTurnManager {
            return this.serialize();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public endPhaseWaitBeginTurn(action: IActionPlayerBeginTurn | null | undefined): void {
            if (this.getPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
                Logger.error(`BwTurnManager.endPhaseWaitBeginTurn() invalid current phase code: ${this.getPhaseCode()}`);
                return;
            }

            this._runPhaseGetFund(action);
            this._runPhaseConsumeFuel();
            this._runPhaseRepairUnitByTile(action);
            this._runPhaseDestroyUnitsOutOfFuel(action);
            this._runPhaseRepairUnitByUnit(action);
            this._runPhaseRecoverUnitByCo(action);
            this._runPhaseActivateMapWeapon(action);
            this._runPhaseMain(action);

            this._setPhaseCode(TurnPhaseCode.Main);
        }
        public endPhaseMain(action: IActionPlayerEndTurn): void {
            if (this.getPhaseCode() !== TurnPhaseCode.Main) {
                Logger.error("BwTurnManager.endPhaseMain() invalid current phase code: ", this.getPhaseCode());
                return;
            }

            this._runPhaseResetUnitState();
            this._runPhaseResetVisionForCurrentPlayer();
            this._runPhaseTickTurnAndPlayerIndex(action);
            this._runPhaseResetSkillState();
            this._runPhaseResetVisionForNextPlayer();
            this._runPhaseResetVotesForDraw();
            this._runPhaseWaitBeginTurn();

            this._setPhaseCode(TurnPhaseCode.WaitBeginTurn);
        }

        private _runPhaseConsumeFuel(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty playerIndex.`);
                return undefined;
            }

            const turnIndex = this.getTurnIndex();
            if (turnIndex == null) {
                Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty turnIndex.`);
                return undefined;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty war.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty unitMap.`);
                return undefined;
            }

            if ((playerIndex !== 0) && (turnIndex > 0)) {
                unitMap.forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        const currentFuel = unit.getCurrentFuel();
                        if (currentFuel == null) {
                            Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty currentFuel.`);
                            return undefined;
                        }

                        const consumption = unit.getFuelConsumptionPerTurn();
                        if (consumption == null) {
                            Logger.error(`BwTurnManager._runPhaseConsumeFuel() empty consumption.`);
                            return undefined;
                        }

                        unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
                    }
                });
            }
        }
        private _runPhaseDestroyUnitsOutOfFuel(data: IActionPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war = this.getWar();
                if (war == null) {
                    Logger.error(`BwTurnManager._runPhaseDestroyUnitsOutOfFuel() empty war.`);
                    return undefined;
                }

                const fogMap = war.getFogMap();
                if (fogMap == null) {
                    Logger.error(`BwTurnManager._runPhaseDestroyUnitsOutOfFuel() empty fogMap.`);
                    return undefined;
                }

                const unitMap = war.getUnitMap();
                if (unitMap == null) {
                    Logger.error(`BwTurnManager._runPhaseDestroyUnitsOutOfFuel() empty unitMap.`);
                    return undefined;
                }

                unitMap.forEachUnitOnMap(unit => {
                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        Logger.error(`BwTurnManager._runPhaseDestroyUnitsOutOfFuel() empty currentFuel.`);
                        return undefined;
                    }

                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (currentFuel <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        if (gridIndex == null) {
                            Logger.error(`BwTurnManager._runPhaseDestroyUnitsOutOfFuel() empty gridIndex.`);
                            return undefined;
                        }

                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                    }
                });
            }
        }
        private _runPhaseActivateMapWeapon(data: IActionPlayerBeginTurn): void {
        }

        private _runPhaseResetUnitState(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war = this.getWar();
                if (war == null) {
                    Logger.error(`BwTurnManager._runPhaseResetUnitState() empty war.`);
                    return undefined;
                }

                const unitMap = war.getUnitMap();
                if (unitMap == null) {
                    Logger.error(`BwTurnManager._runPhaseResetUnitState() empty unitMap.`);
                    return undefined;
                }

                unitMap.forEachUnit(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setActionState(Types.UnitActionState.Idle);
                        unit.updateView();
                    }
                });
            }
        }
        private _runPhaseResetSkillState(): void {
            const war       = this.getWar();
            const player    = war.getPlayerInTurn();
            player.setCoIsDestroyedInTurn(false);

            if (player.checkCoIsUsingActiveSkill()) {
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
                war.getTileMap().getView().updateCoZone();
            }
        }
        private _runPhaseResetVotesForDraw(): void {
            this.getWar().getPlayer(this.getPlayerIndexInTurn())!.setHasVotedForDraw(false);
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
        public setTurnIndex(index: number): void {
            if (this._turnIndex !== index){
                this._turnIndex = index;
                Notify.dispatch(Notify.Type.BwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number {
            return this._playerIndexInTurn;
        }
        public setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(Notify.Type.BwPlayerIndexInTurnChanged);
            }
        }
        public getNextPlayerIndex(playerIndex: number, includeNeutral = false): number {
            const data = this.getNextTurnAndPlayerIndex(undefined, playerIndex);
            if ((data.playerIndex !== 0) || (includeNeutral)) {
                return data.playerIndex;
            } else {
                return this.getNextTurnAndPlayerIndex(data.turnIndex, data.playerIndex).playerIndex;
            }
        }

        public getPhaseCode(): TurnPhaseCode {
            return this._phaseCode;
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            if (this._phaseCode !== code) {
                this._phaseCode = code;
                Notify.dispatch(Notify.Type.BwTurnPhaseCodeChanged);
            }
        }

        public getEnterTurnTime(): number {
            return this._enterTurnTime;
        }
        public setEnterTurnTime(time: number): void {
            this._enterTurnTime = time;
        }

        public getNextTurnAndPlayerIndex(currTurnIndex = this.getTurnIndex(), currPlayerIndex = this.getPlayerIndexInTurn()): { turnIndex: number, playerIndex: number } {
            const playerManager = this.getWar().getPlayerManager();
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

        protected _getHasUnitOnBeginningTurn(): boolean {
            return this._hasUnitOnBeginningTurn;
        }
        public setHasUnitOnBeginningTurn(hasUnit: boolean): void {
            this._hasUnitOnBeginningTurn = hasUnit;
        }
    }
}
