
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.BaseWar {
    import Types                        = Utility.Types;
    import DestructionHelpers           = Utility.DestructionHelpers;
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

        protected abstract _runPhaseGetFund(data: IWarActionSystemBeginTurn): ClientErrorCode;
        protected abstract _runPhaseRepairUnitByTile(data: IWarActionSystemBeginTurn): ClientErrorCode;
        protected abstract _runPhaseRepairUnitByUnit(data: IWarActionSystemBeginTurn): ClientErrorCode;
        protected abstract _runPhaseRecoverUnitByCo(data: IWarActionSystemBeginTurn): ClientErrorCode;
        protected abstract _runPhaseMain(data: IWarActionSystemBeginTurn): ClientErrorCode;
        protected abstract _runPhaseResetVisionForCurrentPlayer(): ClientErrorCode;
        protected abstract _runPhaseTickTurnAndPlayerIndex(data: IWarActionPlayerEndTurn): ClientErrorCode;
        protected abstract _runPhaseResetVisionForNextPlayer(): ClientErrorCode;

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
        public endPhaseWaitBeginTurn(action: IWarActionSystemBeginTurn): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
                return ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurn_00;
            }

            let errorCode = this._runPhaseGetFund(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseConsumeFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByTile(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseDestroyUnitsOutOfFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByUnit(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRecoverUnitByCo(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseActivateMapWeapon();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseMain(action);
            if (errorCode) {
                return errorCode;
            }

            this._setPhaseCode(TurnPhaseCode.Main);

            return ClientErrorCode.NoError;
        }
        public endPhaseMain(action: IWarActionPlayerEndTurn): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.Main) {
                return ClientErrorCode.BwTurnManager_EndPhaseMain_00;
            }

            let errorCode = this._runPhaseResetUnitState();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetVisionForCurrentPlayer();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseTickTurnAndPlayerIndex(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetSkillState();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetVisionForNextPlayer();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetVotesForDraw();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseWaitBeginTurn();
            if (errorCode) {
                return errorCode;
            }

            this._setPhaseCode(TurnPhaseCode.WaitBeginTurn);

            return ClientErrorCode.NoError;
        }

        private _runPhaseConsumeFuel(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseConsumeFuel_00;
            }

            const turnIndex = this.getTurnIndex();
            if (turnIndex == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseConsumeFuel_01;
            }

            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseConsumeFuel_02;
            }

            if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) && (turnIndex > CommonConstants.WarFirstTurnIndex)) {
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        const currentFuel = unit.getCurrentFuel();
                        if (currentFuel == null) {
                            return ClientErrorCode.BwTurnManager_RunPhaseConsumeFuel_03;
                        }

                        const consumption = unit.getFuelConsumptionPerTurn();
                        if (consumption == null) {
                            return ClientErrorCode.BwTurnManager_RunPhaseConsumeFuel_04;
                        }

                        unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseDestroyUnitsOutOfFuel(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war = this.getWar();
                if (war == null) {
                    return ClientErrorCode.BwTurnManager_RunPhaseDestroyUnitOutOfFuel_00;
                }

                const fogMap = war.getFogMap();
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        return ClientErrorCode.BwTurnManager_RunPhaseDestroyUnitOutOfFuel_01;
                    }

                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (currentFuel <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        if (gridIndex == null) {
                            return ClientErrorCode.BwTurnManager_RunPhaseDestroyUnitOutOfFuel_02;
                        }

                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseActivateMapWeapon(): ClientErrorCode {
            // nothing to do for now.

            return ClientErrorCode.NoError;
        }

        private _runPhaseResetUnitState(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetUnitState_00;
            }

            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war = this.getWar();
                if (war == null) {
                    return ClientErrorCode.BwTurnManager_RunPhaseResetUnitState_01;
                }

                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setActionState(Types.UnitActionState.Idle);
                        unit.updateView();
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseResetSkillState(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetSkillState_00;
            }

            const player = war.getPlayerInTurn();
            if (player == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetSkillState_01;
            }

            player.setCoIsDestroyedInTurn(false);

            if (player.checkCoIsUsingActiveSkill()) {
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
                war.getTileMap().getView().updateCoZone();
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseResetVotesForDraw(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetVotesForDraw_00;
            }

            const player = war.getPlayerInTurn();
            if (player == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetVotesForDraw_01;
            }

            player.setHasVotedForDraw(false);

            return ClientErrorCode.NoError;
        }
        private _runPhaseWaitBeginTurn(): ClientErrorCode {
            // Do nothing.

            return ClientErrorCode.NoError;
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

        public getHasUnitOnBeginningTurn(): boolean {
            return this._hasUnitOnBeginningTurn;
        }
        public setHasUnitOnBeginningTurn(hasUnit: boolean): void {
            this._hasUnitOnBeginningTurn = hasUnit;
        }
    }
}
