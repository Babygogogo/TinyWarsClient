
namespace TinyWars.BaseWar {
    import Types                = Utility.Types;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Logger               = Utility.Logger;
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import TimeModel            = Time.TimeModel;
    import SerializedBwTurn     = Types.SerializedTurn;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import GridIndex            = Types.GridIndex;

    export abstract class BwTurnManager {
        private _turnIndex          : number;
        private _playerIndexInTurn  : number;
        private _phaseCode          : TurnPhaseCode;
        private _enterTurnTime      : number;

        private _war                : BwWar;

        public init(data: SerializedBwTurn): BwTurnManager {
            this._setTurnIndex(data.turnIndex);
            this._setPlayerIndexInTurn(data.playerIndex);
            this._setPhaseCode(data.turnPhaseCode);
            this._setEnterTurnTime(data.enterTurnTime);

            return this;
        }
        public fastInit(data: SerializedBwTurn): BwTurnManager {
            return this.init(data);
        }

        public startRunning(war: BwWar): void {
            this._war = war;
        }

        protected _getWar(): BwWar {
            return this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public endPhaseWaitBeginTurn(container: ProtoTypes.IWarActionContainer): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.WaitBeginTurn,
                "BwTurnManager.endPhaseWaitBeginTurn() invalid current phase code: ", this.getPhaseCode()
            );

            const data = container.WarActionPlayerBeginTurn;
            this._runPhaseGetFund(data);
            this._runPhaseConsumeFuel(data);
            this._runPhaseRepairUnitByTile(data);
            this._runPhaseDestroyUnitsOutOfFuel(data);
            this._runPhaseRepairUnitByUnit(data);
            this._runPhaseRecoverUnitByCo(data);
            this._runPhaseActivateMapWeapon(data);
            this._runPhaseMain(data);

            this._setPhaseCode(TurnPhaseCode.Main);
        }
        public endPhaseMain(): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.Main,
                "BwTurnManager.endPhaseMain() invalid current phase code: ", this.getPhaseCode()
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

        private _runPhaseGetFund(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            this._war.getPlayer(this.getPlayerIndexInTurn()).setFund(data.remainingFund);
        }
        private _runPhaseConsumeFuel(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if ((playerIndex !== 0) && (this.getTurnIndex() > 0)) {
                this._war.getUnitMap().forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setCurrentFuel(Math.max(0, unit.getCurrentFuel() - unit.getFuelConsumptionPerTurn()));
                    }
                });
            }
        }
        private _runPhaseRepairUnitByTile(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const war               = this._war;
            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();

            for (const repairData of data.repairDataByTile || []) {
                const gridIndex = repairData.gridIndex as GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId);
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (repairData.deltaHp) {
                        gridVisionEffect.showEffectRepair(gridIndex);
                    } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                        gridVisionEffect.showEffectSupply(gridIndex);
                    }
                }
            }
        }
        private _runPhaseDestroyUnitsOutOfFuel(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war       = this._war;
                const fogMap    = war.getFogMap();
                war.getUnitMap().forEachUnitOnMap(unit => {
                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (unit.getCurrentFuel() <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                    }
                });
            }
        }
        private _runPhaseRepairUnitByUnit(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const war               = this._war;
            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();

            for (const repairData of data.repairDataByUnit || []) {
                const gridIndex = repairData.gridIndex as GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId)
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (repairData.deltaHp) {
                        gridVisionEffect.showEffectRepair(gridIndex);
                    } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                        gridVisionEffect.showEffectSupply(gridIndex);
                    }
                }
            }
        }
        private _runPhaseRecoverUnitByCo(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            const war               = this._war;
            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();

            for (const repairData of data.recoverDataByCo || []) {
                const gridIndex = repairData.gridIndex as GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId);
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (repairData.deltaHp) {
                        gridVisionEffect.showEffectRepair(gridIndex);
                    } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                        gridVisionEffect.showEffectSupply(gridIndex);
                    }
                }
            }
        }
        private _runPhaseActivateMapWeapon(data: ProtoTypes.IWarActionPlayerBeginTurn): void {
            // TODO
        }
        protected abstract _runPhaseMain(data: ProtoTypes.IWarActionPlayerBeginTurn): void;

        private _runPhaseResetUnitState(): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                this._war.getUnitMap().forEachUnit(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setActionState(Types.UnitActionState.Idle);
                        unit.updateView();
                    }
                });
            }
        }
        protected abstract _runPhaseResetVisionForCurrentPlayer(): void;
        private _runPhaseTickTurnAndPlayerIndex(): void {
            const data = this._getNextTurnAndPlayerIndex();
            this._setTurnIndex(data.turnIndex);
            this._setPlayerIndexInTurn(data.playerIndex);
            this._setEnterTurnTime(TimeModel.getServerTimestamp());
        }
        private _runPhaseResetSkillState(): void {
            const war       = this._getWar();
            const player    = war.getPlayerInTurn();
            player.setCoIsDestroyedInTurn(false);

            if (player.checkCoIsUsingActiveSkill()) {
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
                war.getTileMap().getView().updateCoZone();
            }
        }
        protected abstract _runPhaseResetVisionForNextPlayer(): void;
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
                Notify.dispatch(Notify.Type.BwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number {
            return this._playerIndexInTurn;
        }
        private _setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(Notify.Type.BwPlayerIndexInTurnChanged);
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
                Notify.dispatch(Notify.Type.BwTurnPhaseCodeChanged);
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
    }
}
