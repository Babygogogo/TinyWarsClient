
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.BaseWar {
    import Types                        = Utility.Types;
    import DestructionHelpers           = Utility.DestructionHelpers;
    import Logger                       = Utility.Logger;
    import Notify                       = Utility.Notify;
    import ProtoTypes                   = Utility.ProtoTypes;
    import ClientErrorCode              = Utility.ClientErrorCode;
    import CommonConstants              = Utility.CommonConstants;
    import TurnPhaseCode                = Types.TurnPhaseCode;
    import TurnAndPlayerIndex           = Types.TurnAndPlayerIndex;
    import ISerialTurnManager           = ProtoTypes.WarSerialization.ISerialTurnManager;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn    = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = WarAction.IWarActionPlayerEndTurn;

    export abstract class BwTurnManager {
        private _turnIndex          : number | undefined;
        private _playerIndexInTurn  : number | undefined;
        private _phaseCode          : TurnPhaseCode | undefined;
        private _enterTurnTime      : number | undefined;

        private _war                    : BwWar | undefined;
        private _hasUnitOnBeginningTurn = false;

        protected abstract _runPhaseGetFund(data: IWarActionSystemBeginTurn): void;
        protected abstract _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): void;
        protected abstract _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): void;
        protected abstract _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): void;
        protected abstract _runPhaseMain(data: IWarActionSystemBeginTurn): void;
        protected abstract _runPhaseResetVisionForCurrentPlayer(): void;
        protected abstract _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): void;
        protected abstract _runPhaseResetVisionForNextPlayer(): void;

        public init(data: ISerialTurnManager | null | undefined, playersCountUnneutral: number): ClientErrorCode {
            if (data == null) {
                return ClientErrorCode.BwTurnManagerInit00;
            }

            const turnIndex = data.turnIndex;
            if (turnIndex == null) {
                return ClientErrorCode.BwTurnManagerInit01;
            }

            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex < CommonConstants.WarNeutralPlayerIndex)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                return ClientErrorCode.BwTurnManagerInit02;
            }

            const turnPhaseCode = data.turnPhaseCode as TurnPhaseCode;
            if ((turnPhaseCode !== TurnPhaseCode.Main)          &&
                (turnPhaseCode !== TurnPhaseCode.WaitBeginTurn)
            ) {
                return ClientErrorCode.BwTurnManagerInit03;
            }

            const enterTurnTime = data.enterTurnTime;
            if (enterTurnTime == null) {
                return ClientErrorCode.BwTurnManagerInit04;
            }

            this.setTurnIndex(turnIndex);
            this.setPlayerIndexInTurn(playerIndex);
            this._setPhaseCode(turnPhaseCode);
            this.setEnterTurnTime(enterTurnTime);

            return ClientErrorCode.NoError;
        }
        public fastInit(data: ISerialTurnManager, playersCountUnneutral: number): ClientErrorCode {
            return this.init(data, playersCountUnneutral);
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
        public serializeForCreateSfw(): ISerialTurnManager {
            return this.serialize();
        }
        public serializeForCreateMfr(): ISerialTurnManager {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar | undefined {
            return this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public endPhaseWaitBeginTurn(action: IWarActionSystemBeginTurn): void {
            if (this.getPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
                Logger.error(`BwTurnManager.endPhaseWaitBeginTurn() invalid current phase code: ${this.getPhaseCode()}`);
                return;
            }

            this._runPhaseGetFund(action);
            this._runPhaseConsumeFuel();
            this._runPhaseRepairUnitByTile(action);
            this._runPhaseDestroyUnitsOutOfFuel();
            this._runPhaseRepairUnitByUnit(action);
            this._runPhaseRecoverUnitByCo(action);
            this._runPhaseActivateMapWeapon();
            this._runPhaseMain(action);

            this._setPhaseCode(TurnPhaseCode.Main);
        }
        public endPhaseMain(action: IWarActionPlayerEndTurn): void {
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

            if ((playerIndex !== 0) && (turnIndex > CommonConstants.WarFirstTurnIndex)) {
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
        private _runPhaseDestroyUnitsOutOfFuel(): void {
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
        private _runPhaseActivateMapWeapon(): void {
            // nothing to do for now.
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
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTurnManager._runPhaseResetSkillState() empty war.`);
                return undefined;
            }

            const player = war.getPlayerInTurn();
            player.setCoIsDestroyedInTurn(false);

            if (player.checkCoIsUsingActiveSkill()) {
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
                war.getTileMap().getView().updateCoZone();
            }
        }
        private _runPhaseResetVotesForDraw(): void {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTurnManager._runPhaseResetVotesForDraw() empty war.`);
                return;
            }

            const player = war.getPlayerInTurn();
            if (player == null) {
                Logger.error(`BwTurnManager._runPhaseResetVotesForDraw() empty player.`);
                return;
            }

            player.setHasVotedForDraw(false);
        }
        private _runPhaseWaitBeginTurn(): void {
            // Do nothing.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTurnIndex(): number | undefined {
            return this._turnIndex;
        }
        public setTurnIndex(index: number): void {
            if (this._turnIndex !== index){
                this._turnIndex = index;
                Notify.dispatch(Notify.Type.BwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number | undefined {
            return this._playerIndexInTurn;
        }
        public setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(Notify.Type.BwPlayerIndexInTurnChanged);
            }
        }
        public getNextPlayerIndex(playerIndex: number, includeNeutral = false): number | undefined {
            const data = this.getNextTurnAndPlayerIndex(undefined, playerIndex).info;
            if (data == null) {
                return undefined;
            }

            const playerIndex1 = data.playerIndex;
            if ((playerIndex1 !== CommonConstants.WarNeutralPlayerIndex) || (includeNeutral)) {
                return playerIndex1;
            } else {
                const nextData = this.getNextTurnAndPlayerIndex(data.turnIndex, playerIndex1).info;
                return nextData ? nextData.playerIndex : undefined;
            }
        }

        public getPhaseCode(): TurnPhaseCode | undefined {
            return this._phaseCode;
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            if (this._phaseCode !== code) {
                this._phaseCode = code;
                Notify.dispatch(Notify.Type.BwTurnPhaseCodeChanged);
            }
        }

        public getEnterTurnTime(): number | undefined {
            return this._enterTurnTime;
        }
        public setEnterTurnTime(time: number): void {
            this._enterTurnTime = time;
        }

        public getNextTurnAndPlayerIndex(
            currTurnIndex   = this.getTurnIndex(),
            currPlayerIndex = this.getPlayerIndexInTurn(),
        ): { errorCode: ClientErrorCode, info?: TurnAndPlayerIndex } {
            const war = this.getWar();
            if (war == null) {
                return { errorCode: ClientErrorCode.BwTurnManager_GetNextTurnAndPlayerIndex_00 };
            }

            if (currTurnIndex == null) {
                return { errorCode: ClientErrorCode.BwTurnManager_GetNextTurnAndPlayerIndex_01 };
            }

            if (currPlayerIndex == null) {
                return { errorCode: ClientErrorCode.BwTurnManager_GetNextTurnAndPlayerIndex_02 };
            }

            const playerManager = war.getPlayerManager();
            const playersCount  = playerManager.getTotalPlayersCount(true);
            let nextTurnIndex   = currTurnIndex;
            let nextPlayerIndex = currPlayerIndex + 1;
            for (;;) {
                if (nextPlayerIndex >= playersCount) {
                    nextPlayerIndex = 0;
                    nextTurnIndex   += 1;
                }

                const player = playerManager.getPlayer(nextPlayerIndex);
                if (player == null) {
                    return { errorCode: ClientErrorCode.BwTurnManager_GetNextTurnAndPlayerIndex_03 };
                }

                if (player.getAliveState() !== Types.PlayerAliveState.Dead) {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        info        : {
                            turnIndex   : nextTurnIndex,
                            playerIndex : nextPlayerIndex
                        },
                    };
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
