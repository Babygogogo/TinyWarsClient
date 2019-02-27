
namespace TinyWars.MultiCustomWar {
    import AlertPanel           = Common.AlertPanel;
    import Lang                 = Utility.Lang;
    import Types                = Utility.Types;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Logger               = Utility.Logger;
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import FlowManager          = Utility.FlowManager;
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

        private _hasUnitOnBeginningTurn = false;

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
        public endPhaseWaitBeginTurn(data: ProtoTypes.IS_McwBeginTurn): void {
            Logger.assert(
                this.getPhaseCode() === TurnPhaseCode.WaitBeginTurn,
                "McTurnManager.endPhaseWaitBeginTurn() invalid current phase code: ", this.getPhaseCode()
            );

            Utility.FloatText.show(`${this._war.getPlayerInTurn().getNickname()} p${this.getPlayerIndexInTurn()}回合正式开始！！`);

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

        private _runPhaseGetFund(data: ProtoTypes.IS_McwBeginTurn): void {
            this._war.getPlayer(this.getPlayerIndexInTurn()).setFund(data.remainingFund);
        }
        private _runPhaseConsumeFuel(data: ProtoTypes.IS_McwBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if ((playerIndex !== 0) && (this.getTurnIndex() > 0)) {
                this._war.getUnitMap().forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setCurrentFuel(Math.max(0, unit.getCurrentFuel() - unit.getFuelConsumptionPerTurn()));
                    }
                });
            }
        }
        private _runPhaseRepairUnitByTile(data: ProtoTypes.IS_McwBeginTurn): void {
            const unitMap = this._war.getUnitMap();
            for (const repairData of data.repairDataByTile || []) {
                unitMap.getUnitOnMap(repairData.gridIndex as GridIndex).updateOnRepaired(repairData.repairAmount || 0);
            }
        }
        private _runPhaseDestroyUnitsOutOfFuel(data: ProtoTypes.IS_McwBeginTurn): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== 0) {
                const war       = this._war;
                const fogMap    = war.getFogMap();
                war.getUnitMap().forEachUnitOnMap(unit => {
                    if ((unit.checkIsDestroyedOnOutOfFuel()) && (unit.getCurrentFuel() <= 0) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        DestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
                    }
                });
            }
        }
        private _runPhaseRepairUnitByUnit(data: ProtoTypes.IS_McwBeginTurn): void {
            const unitMap = this._war.getUnitMap();
            for (const repairData of data.repairDataByUnit || []) {
                const unitLoaded = unitMap.getUnitLoadedById(repairData.unitId);
                if (unitLoaded) {
                    unitLoaded.updateOnRepaired(repairData.repairAmount || 0);
                } else {
                    unitMap.getUnitOnMap(repairData.gridIndex as GridIndex).updateOnRepaired(repairData.repairAmount || 0);
                }
            }
        }
        private _runPhaseActivateMapWeapon(data: ProtoTypes.IS_McwBeginTurn): void {
            // TODO
        }
        private _runPhaseMain(data: ProtoTypes.IS_McwBeginTurn): void {
            if (data.isDefeated) {
                const war           = this._war;
                const playerIndex   = this.getPlayerIndexInTurn();
                DestructionHelpers.destroyPlayerForce(war, playerIndex);

                const playerManager = war.getPlayerManager();
                if (playerManager.getPlayerIndexLoggedIn() === playerIndex) {
                    AlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0035),
                        content : Lang.getText(Lang.Type.A0023),
                        callback: () => FlowManager.gotoLobby(),
                    });
                    war.setIsEnded(true);
                } else {
                    if (playerManager.getAliveTeamsCount(false) === 1) {
                        AlertPanel.show({
                            title   : Lang.getText(Lang.Type.B0034),
                            content : Lang.getText(Lang.Type.A0022),
                            callback: () => FlowManager.gotoLobby(),
                        });
                        war.setIsEnded(true);

                    } else {
                        // Do nothing, because the server will tell what to do next.
                    }
                }
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

        private _getNextTurnAndPlayerIndex(): { turnIndex: number, playerIndex: number } {
            const playerManager = this._war.getPlayerManager();
            const playersCount  = playerManager.getTotalPlayersCount(true);
            let nextTurnIndex   = this.getTurnIndex();
            let nextPlayerIndex = this.getPlayerIndexInTurn() + 1;
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
                    DestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
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
