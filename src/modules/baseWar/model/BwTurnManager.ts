
import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Logger                   from "../../tools/helpers/Logger";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import WarDestructionHelpers    from "../../tools/warHelpers/WarDestructionHelpers";
import WarVisibilityHelpers     from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwUnit               from "./BwUnit";
import TwnsBwWar                from "./BwWar";

namespace TwnsBwTurnManager {
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import TurnPhaseCode                = Types.TurnPhaseCode;
    import TurnAndPlayerIndex           = Types.TurnAndPlayerIndex;
    import ISerialTurnManager           = ProtoTypes.WarSerialization.ISerialTurnManager;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn    = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = WarAction.IWarActionPlayerEndTurn;
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;
    import BwUnit                       = TwnsBwUnit.BwUnit;
    import BwWar                        = TwnsBwWar.BwWar;

    export class BwTurnManager {
        private _turnIndex          : number | undefined;
        private _playerIndexInTurn  : number | undefined;
        private _phaseCode          : TurnPhaseCode | undefined;
        private _enterTurnTime      : number | undefined;

        private _war                    : BwWar | undefined;
        private _hasUnitOnBeginningTurn = false;

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

            this._setTurnIndex(turnIndex);
            this._setPlayerIndexInTurn(playerIndex);
            this._setPhaseCode(turnPhaseCode);
            this._setEnterTurnTime(enterTurnTime);

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
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurn_00;
            }

            return war.getIsRunTurnPhaseWithExtraData()
                ? this._endPhaseWaitBeginTurnWithExtraData(action)
                : this._endPhaseWaitBeginTurnWithoutExtraData();
        }
        public endPhaseMain(action: IWarActionPlayerEndTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_EndPhaseMain_00;
            }

            return war.getIsRunTurnPhaseWithExtraData()
                ? this._endPhaseMainWithExtraData(action)
                : this._endPhaseMainWithoutExtraData();
        }

        private _endPhaseWaitBeginTurnWithExtraData(action: IWarActionSystemBeginTurn): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
                return ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00;
            }

            let errorCode = this._runPhaseGetFundWithExtraData(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseConsumeFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByTileWithExtraData(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseDestroyUnitsOutOfFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByUnitWithExtraData(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRecoverUnitByCoWithExtraData(action);
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseActivateMapWeapon();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseMainWithExtraData(action);
            if (errorCode) {
                return errorCode;
            }

            this._setPhaseCode(TurnPhaseCode.Main);

            return ClientErrorCode.NoError;
        }
        private _endPhaseWaitBeginTurnWithoutExtraData(): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
                return ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00;
            }

            let errorCode = this._runPhaseGetFundWithoutExtraData();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseConsumeFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByTileWithoutExtraData();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseDestroyUnitsOutOfFuel();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRepairUnitByUnitWithoutExtraData();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseRecoverUnitByCoWithoutExtraData();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseActivateMapWeapon();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseMainWithoutExtraData();
            if (errorCode) {
                return errorCode;
            }

            this._setPhaseCode(TurnPhaseCode.Main);

            return ClientErrorCode.NoError;
        }

        private _endPhaseMainWithExtraData(action: IWarActionPlayerEndTurn): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.Main) {
                return ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00;
            }

            let errorCode = this._runPhaseResetUnitState();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetVisionForCurrentPlayer();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseTickTurnAndPlayerIndexWithExtraData(action);
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
        private _endPhaseMainWithoutExtraData(): ClientErrorCode {
            if (this.getPhaseCode() !== TurnPhaseCode.Main) {
                return ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00;
            }

            let errorCode = this._runPhaseResetUnitState();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseResetVisionForCurrentPlayer();
            if (errorCode) {
                return errorCode;
            }

            errorCode = this._runPhaseTickTurnAndPlayerIndexWithoutExtraData();
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

        private _runPhaseGetFundWithExtraData(data: IWarActionSystemBeginTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_00;
            }

            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_01;
            }

            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const player = war.getPlayer(playerIndex);
                if (player == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_02;
                }

                const extraData = data.extraData;
                if (extraData == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_03;
                }

                const playerData = extraData.playerData;
                if (playerData == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_04;
                }

                const remainingFund = playerData.fund;
                if (remainingFund == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_05;
                }

                player.setFund(remainingFund);
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseGetFundWithoutExtraData(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_00;
            }

            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_01;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_02;
            }

            const currentFund = player.getFund();
            if (currentFund == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_03;
            }

            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                this._setHasUnitOnBeginningTurn(false);
            } else {
                this._setHasUnitOnBeginningTurn(war.getUnitMap().checkHasUnit(playerIndex));

                let totalIncome = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
                if (totalIncome == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_04;
                }

                if (this.getTurnIndex() === CommonConstants.WarFirstTurnIndex) {
                    const initialFund = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
                    if (initialFund == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_05;
                    }
                    totalIncome += initialFund;
                }

                player.setFund(currentFund + totalIncome);
            }

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

        private _runPhaseRepairUnitByTileWithExtraData(data: IWarActionSystemBeginTurn): ClientErrorCode {
            const extraData = data.extraData;
            if (extraData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_00;
            }

            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_01;
            }

            const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            if (visibleUnits == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_02;
            }

            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();
            for (const repairData of extraData.recoveryDataByTile || []) {
                const gridIndex = repairData.gridIndex as Types.GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId);
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (visibleUnits.has(unit)) {
                        if (repairData.deltaHp) {
                            gridVisionEffect.showEffectRepair(gridIndex);
                        } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                            gridVisionEffect.showEffectSupply(gridIndex);
                        }
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseRepairUnitByTileWithoutExtraData(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_00;
            }

            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_01;
            }

            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const player = war.getPlayer(playerIndex);
                if (player == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_02;
                }

                const allUnitsOnMap: BwUnit[] = [];
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsOnMap.push(unit));
                }

                const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                if (visibleUnits == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_03;
                }

                const tileMap           = war.getTileMap();
                const gridVisionEffect  = war.getGridVisionEffect();
                for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                    const gridIndex = unit.getGridIndex();
                    if (gridIndex == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_04;
                    }

                    const tile = tileMap.getTile(gridIndex);
                    if (tile == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_05;
                    }

                    const repairData = tile.getRepairHpAndCostForUnit(unit);
                    if (repairData) {
                        const fund = player.getFund();
                        if (fund == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_06;
                        }

                        const deltaFuel = unit.getUsedFuel();
                        if (deltaFuel == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_07;
                        }

                        const deltaHp                   = repairData.hp > 0 ? repairData.hp : undefined;
                        const deltaPrimaryWeaponAmmo    = unit.getPrimaryWeaponUsedAmmo();
                        const deltaFlareAmmo            = unit.getFlareUsedAmmo();
                        unit.updateByRepairData({
                            gridIndex,
                            unitId                  : unit.getUnitId(),
                            deltaHp,
                            deltaFuel,
                            deltaPrimaryWeaponAmmo,
                            deltaFlareAmmo,
                        });
                        player.setFund(fund - repairData.cost);

                        if (visibleUnits.has(unit)) {
                            if (deltaHp) {
                                gridVisionEffect.showEffectRepair(gridIndex);
                            } else if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                gridVisionEffect.showEffectSupply(gridIndex);
                            }
                        }
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
                        WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                    }
                }
            }

            return ClientErrorCode.NoError;
        }

        private _runPhaseRepairUnitByUnitWithExtraData(data: IWarActionSystemBeginTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_00;
            }

            const extraData = data.extraData;
            if (extraData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_01;
            }

            const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            if (visibleUnits == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_02;
            }

            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();
            for (const repairData of extraData.recoveryDataByUnit || []) {
                const gridIndex = repairData.gridIndex as Types.GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId);
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (visibleUnits.has(unit)) {
                        if (repairData.deltaHp) {
                            gridVisionEffect.showEffectRepair(gridIndex);
                        } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                            gridVisionEffect.showEffectSupply(gridIndex);
                        }
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseRepairUnitByUnitWithoutExtraData(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_00;
            }

            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war = this.getWar();
                if (war == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_01;
                }

                const player = war.getPlayer(playerIndex);
                if (player == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_02;
                }

                const unitMap = war.getUnitMap();
                const mapSize = unitMap.getMapSize();
                if (mapSize == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_03;
                }

                const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                if (visibleUnits == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_04;
                }

                const gridVisionEffect  = war.getGridVisionEffect();
                const allUnitsLoaded    : BwUnit[] = [];
                for (const unit of unitMap.getAllUnitsLoaded()) {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsLoaded.push(unit));
                }

                for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                    const loader = unit.getLoaderUnit();
                    if (loader == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_05;
                    }

                    const gridIndex = loader.getGridIndex();
                    if (gridIndex == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_06;
                    }

                    const repairData = loader.getRepairHpAndCostForLoadedUnit(unit);
                    if (repairData) {
                        const deltaFuel = unit.getUsedFuel();
                        if (deltaFuel == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_07;
                        }

                        const fund = player.getFund();
                        if (fund == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_08;
                        }

                        const deltaHp                   = repairData.hp > 0 ? repairData.hp : undefined;
                        const deltaPrimaryWeaponAmmo    = unit.getPrimaryWeaponUsedAmmo();
                        const deltaFlareAmmo            = unit.getFlareUsedAmmo();
                        unit.updateByRepairData({
                            gridIndex               : unit.getGridIndex(),
                            unitId                  : unit.getUnitId(),
                            deltaHp,
                            deltaFuel,
                            deltaPrimaryWeaponAmmo,
                            deltaFlareAmmo,
                        });
                        player.setFund(fund - repairData.cost);

                        if (visibleUnits.has(loader)) {
                            if (deltaHp) {
                                gridVisionEffect.showEffectRepair(gridIndex);
                            } else if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                gridVisionEffect.showEffectSupply(gridIndex);
                            }
                        }

                    } else if (loader.checkCanSupplyLoadedUnit()) {
                        const deltaFuel = unit.getUsedFuel();
                        if (deltaFuel == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_09;
                        }

                        const deltaPrimaryWeaponAmmo    = unit.getPrimaryWeaponUsedAmmo();
                        const deltaFlareAmmo            = unit.getFlareUsedAmmo();
                        unit.updateByRepairData({
                            gridIndex               : unit.getGridIndex(),
                            unitId                  : unit.getUnitId(),
                            deltaHp                 : null,
                            deltaFuel,
                            deltaPrimaryWeaponAmmo,
                            deltaFlareAmmo,
                        });

                        if (visibleUnits.has(loader)) {
                            if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                gridVisionEffect.showEffectSupply(gridIndex);
                            }
                        }
                    }
                }

                const suppliedUnitIds = new Set<number>();
                for (const supplier of unitMap.getAllUnitsOnMap()) {
                    if ((supplier.getPlayerIndex() === playerIndex) && (supplier.checkIsAdjacentUnitSupplier())) {
                        const supplierGridIndex = supplier.getGridIndex();
                        if (supplierGridIndex == null) {
                            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_10;
                        }

                        for (const gridIndex of GridIndexHelpers.getAdjacentGrids(supplierGridIndex, mapSize)) {
                            const unit      = unitMap.getUnitOnMap(gridIndex);
                            const unitId    = unit ? unit.getUnitId() : undefined;
                            if ((unitId != null) && (unit) && (!suppliedUnitIds.has(unitId)) && (supplier.checkCanSupplyAdjacentUnit(unit))) {
                                const deltaFuel = unit.getUsedFuel();
                                if (deltaFuel == null) {
                                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_11;
                                }

                                const deltaPrimaryWeaponAmmo    = unit.getPrimaryWeaponUsedAmmo();
                                const deltaFlareAmmo            = unit.getFlareUsedAmmo();
                                unit.updateByRepairData({
                                    gridIndex,
                                    unitId,
                                    deltaHp                 : null,
                                    deltaFuel,
                                    deltaPrimaryWeaponAmmo,
                                    deltaFlareAmmo,
                                });
                                suppliedUnitIds.add(unitId);

                                if (visibleUnits.has(unit)) {
                                    if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                        gridVisionEffect.showEffectSupply(gridIndex);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return ClientErrorCode.NoError;
        }

        private _runPhaseRecoverUnitByCoWithExtraData(data: IWarActionSystemBeginTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_00;
            }

            const extraData = data.extraData;
            if (extraData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_01;
            }

            const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            if (visibleUnits == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_02;
            }

            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();
            for (const repairData of extraData.recoveryDataByCo || []) {
                const gridIndex = repairData.gridIndex as Types.GridIndex;
                const unit      = unitMap.getUnit(gridIndex, repairData.unitId);
                if (unit) {
                    unit.updateByRepairData(repairData);

                    if (visibleUnits.has(unit)) {
                        if (repairData.deltaHp) {
                            gridVisionEffect.showEffectRepair(gridIndex);
                        } else if ((repairData.deltaFlareAmmo) || (repairData.deltaFuel) || (repairData.deltaPrimaryWeaponAmmo)) {
                            gridVisionEffect.showEffectSupply(gridIndex);
                        }
                    }
                }
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseRecoverUnitByCoWithoutExtraData(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_00;
            }

            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_01;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_02;
            }

            if (player.getCoId()) {
                const configVersion = war.getConfigVersion();
                if (configVersion == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_04;
                }

                const coZoneRadius = player.getCoZoneRadius();
                if (coZoneRadius == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_05;
                }

                const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                if (visibleUnits == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_06;
                }

                const unitMap                   = war.getUnitMap();
                const gridVisionEffect          = war.getGridVisionEffect();
                const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
                for (const skillId of player.getCoCurrentSkills() || []) {
                    const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                    if (skillCfg == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_07;
                    }

                    if (skillCfg.selfHpRecovery) {
                        const recoverCfg    = skillCfg.selfHpRecovery;
                        const targetUnits   : BwUnit[] = [];
                        for (const unit of unitMap.getAllUnits()) {
                            const unitType = unit.getUnitType();
                            if (unitType == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_08;
                            }

                            const unitGridIndex = unit.getGridIndex();
                            if (unitGridIndex == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_09;
                            }

                            if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                                (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                                    gridIndex               : unitGridIndex,
                                    coSkillAreaType         : recoverCfg[0],
                                    getCoGridIndexArrayOnMap,
                                    coZoneRadius,
                                }))
                            ) {
                                targetUnits.push(unit);
                            }
                        }

                        const recoverAmount = recoverCfg[2];
                        for (const unit of targetUnits.sort(sorterForRepairUnits)) {
                            const normalizedMaxHp = unit.getNormalizedMaxHp();
                            if (normalizedMaxHp == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_10;
                            }

                            const normalizedCurrentHp = unit.getNormalizedCurrentHp();
                            if (normalizedCurrentHp == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_11;
                            }

                            const currentFund = player.getFund();
                            if (currentFund == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_12;
                            }

                            const productionCost = unit.getProductionFinalCost();
                            if (productionCost == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_13;
                            }

                            const currentHp = unit.getCurrentHp();
                            if (currentHp == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_14;
                            }

                            const normalizedRepairHp = Math.min(
                                normalizedMaxHp - normalizedCurrentHp,
                                recoverAmount,
                                Math.floor(currentFund * normalizedMaxHp / productionCost)
                            );
                            const repairAmount = (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - currentHp;

                            if (repairAmount > 0) {
                                const gridIndex = unit.getGridIndex();
                                unit.updateByRepairData({
                                    gridIndex,
                                    unitId                  : unit.getUnitId(),
                                    deltaHp                 : repairAmount,
                                    deltaFuel               : null,
                                    deltaFlareAmmo          : null,
                                    deltaPrimaryWeaponAmmo  : null,
                                });
                                player.setFund(currentFund - Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp));

                                if (visibleUnits.has(unit)) {
                                    gridVisionEffect.showEffectRepair(gridIndex);
                                }
                            }
                        }
                    }

                    if (skillCfg.selfFuelRecovery) {
                        const recoverCfg = skillCfg.selfFuelRecovery;
                        for (const unit of unitMap.getAllUnits()) {
                            const unitType = unit.getUnitType();
                            if (unitType == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_15;
                            }

                            const unitGridIndex = unit.getGridIndex();
                            if (unitGridIndex == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_16;
                            }

                            if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                                (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                                    gridIndex               : unitGridIndex,
                                    coSkillAreaType         : recoverCfg[0],
                                    getCoGridIndexArrayOnMap,
                                    coZoneRadius,
                                }))
                            ) {
                                const maxFuel = unit.getMaxFuel();
                                if (maxFuel == null) {
                                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_17;
                                }

                                const currentFuel = unit.getCurrentFuel();
                                if (currentFuel == null) {
                                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_18;
                                }

                                const deltaFuel = Math.min(Math.floor(maxFuel * recoverCfg[2] / 100), maxFuel - currentFuel);
                                unit.updateByRepairData({
                                    gridIndex               : unitGridIndex,
                                    unitId                  : unit.getUnitId(),
                                    deltaHp                 : null,
                                    deltaFuel,
                                    deltaFlareAmmo          : null,
                                    deltaPrimaryWeaponAmmo  : null,
                                });

                                if (visibleUnits.has(unit)) {
                                    if (deltaFuel > 0) {
                                        gridVisionEffect.showEffectSupply(unitGridIndex);
                                    }
                                }
                            }
                        }
                    }

                    if (skillCfg.selfPrimaryAmmoRecovery) {
                        const recoverCfg = skillCfg.selfPrimaryAmmoRecovery;
                        for (const unit of unitMap.getAllUnits()) {
                            const unitType = unit.getUnitType();
                            if (unitType == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_19;
                            }

                            const unitGridIndex = unit.getGridIndex();
                            if (unitGridIndex == null) {
                                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_20;
                            }

                            if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                                (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                                    gridIndex               : unitGridIndex,
                                    coSkillAreaType         : recoverCfg[0],
                                    getCoGridIndexArrayOnMap,
                                    coZoneRadius,
                                }))
                            ) {
                                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                                if (maxAmmo) {
                                    const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                                    if (currentAmmo == null) {
                                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_21;
                                    }

                                    const deltaPrimaryWeaponAmmo = Math.min(Math.floor(maxAmmo * recoverCfg[2] / 100), maxAmmo - currentAmmo);
                                    unit.updateByRepairData({
                                        gridIndex               : unitGridIndex,
                                        unitId                  : unit.getUnitId(),
                                        deltaHp                 : null,
                                        deltaFuel               : null,
                                        deltaFlareAmmo          : null,
                                        deltaPrimaryWeaponAmmo,
                                    });

                                    if (visibleUnits.has(unit)) {
                                        if (deltaPrimaryWeaponAmmo > 0) {
                                            gridVisionEffect.showEffectSupply(unitGridIndex);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return ClientErrorCode.NoError;
        }

        private _runPhaseActivateMapWeapon(): ClientErrorCode {
            // nothing to do for now.

            return ClientErrorCode.NoError;
        }

        private _runPhaseMainWithExtraData(data: IWarActionSystemBeginTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_00;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_01;
            }

            const extraData = data.extraData;
            if (extraData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_02;
            }

            const playerData = extraData.playerData;
            if (playerData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_03;
            }

            if (playerData.playerIndex !== playerIndex) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_04;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_05;
            }

            const configVersion = war.getConfigVersion();
            if (configVersion == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithExtraData_06;
            }

            const errorCodeForPlayerInit = player.init(playerData, configVersion);
            if (errorCodeForPlayerInit) {
                return errorCodeForPlayerInit;
            }

            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                (unit.getPlayerIndex() === playerIndex) && (unit.updateView());
            }

            return ClientErrorCode.NoError;
        }
        private _runPhaseMainWithoutExtraData(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithoutExtraData_00;
            }

            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithoutExtraData_01;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithoutExtraData_02;
            }

            const unitMap = war.getUnitMap();
            const hasUnit = unitMap.checkHasUnit(playerIndex);
            if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) &&
                (this._getHasUnitOnBeginningTurn())                     &&
                (!hasUnit)
            ) {
                player.setAliveState(Types.PlayerAliveState.Dying);
            }

            if (hasUnit) {
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    (unit.getPlayerIndex() === playerIndex) && (unit.updateView());
                }
            }

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
        private _runPhaseResetVisionForCurrentPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetVisionForCurrentPlayer_00;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetVisionForCurrentPlayer_01;
            }

            war.getFogMap().resetMapFromPathsForPlayer(playerIndex);

            return ClientErrorCode.NoError;
        }

        private _runPhaseTickTurnAndPlayerIndexWithExtraData(data: IWarActionPlayerEndTurn): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithExtraData_00;
            }

            const extraData = data.extraData;
            if (extraData == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithExtraData_01;
            }

            const restTime = extraData.restTimeToBootForCurrentPlayer;
            if (restTime == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithExtraData_02;
            }

            war.getPlayerInTurn().setRestTimeToBoot(restTime);

            const { errorCode, info } = this._getNextTurnAndPlayerIndex();
            if (errorCode) {
                return errorCode;
            } else if (info == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithExtraData_03;
            }

            this._setTurnIndex(info.turnIndex);
            this._setPlayerIndexInTurn(info.playerIndex);
            this._setEnterTurnTime(Timer.getServerTimestamp());
            war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

            return ClientErrorCode.NoError;
        }
        private _runPhaseTickTurnAndPlayerIndexWithoutExtraData(): ClientErrorCode {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_00;
            }

            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_01;
            }

            const currTime      = Timer.getServerTimestamp();
            let restTimeToBoot  : number | null | undefined;
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                restTimeToBoot = 0;
            } else {
                const player = war.getPlayer(playerIndex);
                if (player == null) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_02;
                }

                const bootTimerParams = war.getSettingsBootTimerParams();
                if ((bootTimerParams == null) || (!bootTimerParams.length)) {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_03;
                }

                const timerType: Types.BootTimerType = bootTimerParams[0];
                if (timerType === Types.BootTimerType.NoBoot) {
                    restTimeToBoot = 0;
                    player.setRestTimeToBoot(restTimeToBoot);

                } else if (timerType === Types.BootTimerType.Regular) {
                    restTimeToBoot = bootTimerParams[1];
                    if (restTimeToBoot == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_04;
                    }

                    player.setRestTimeToBoot(restTimeToBoot);

                } else if (timerType === Types.BootTimerType.Incremental) {
                    const oldRestTimeToBoot = player.getRestTimeToBoot();
                    if (oldRestTimeToBoot == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_05;
                    }

                    const enterTurnTime = this.getEnterTurnTime();
                    if (enterTurnTime == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_06;
                    }

                    const incrementalTime = bootTimerParams[2];
                    if (incrementalTime == null) {
                        return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_07;
                    }

                    restTimeToBoot = Math.max(
                        0,
                        Math.min(
                            CommonConstants.WarBootTimerIncrementalMaxLimit,
                            oldRestTimeToBoot - (currTime - enterTurnTime) + incrementalTime * war.getUnitMap().countAllUnitsForPlayer(playerIndex),
                        ),
                    );
                    player.setRestTimeToBoot(restTimeToBoot);

                } else {
                    return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_08;
                }
            }

            if (restTimeToBoot == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_09;
            }

            const { errorCode, info } = this._getNextTurnAndPlayerIndex();
            if (errorCode) {
                return errorCode;
            } else if (info == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_10;
            }

            this._setTurnIndex(info.turnIndex);
            this._setPlayerIndexInTurn(info.playerIndex);
            this._setEnterTurnTime(Timer.getServerTimestamp());
            war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

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
        private _runPhaseResetVisionForNextPlayer(): ClientErrorCode {
            const war = this.getWar();
            if (war == null) {
                return ClientErrorCode.BwTurnManager_RunPhaseResetVisionForNextPlayer_00;
            }

            war.updateTilesAndUnitsOnVisibilityChanged();

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
        private _setTurnIndex(index: number): void {
            if (this._turnIndex !== index){
                this._turnIndex = index;
                Notify.dispatch(NotifyType.BwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number {
            return Helpers.getDefined(this._playerIndexInTurn);
        }
        private _setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(NotifyType.BwPlayerIndexInTurnChanged);
            }
        }
        public getNextPlayerIndex(playerIndex: number, includeNeutral = false): number | undefined {
            const data = this._getNextTurnAndPlayerIndex(undefined, playerIndex).info;
            if (data == null) {
                return undefined;
            }

            const playerIndex1 = data.playerIndex;
            if ((playerIndex1 !== CommonConstants.WarNeutralPlayerIndex) || (includeNeutral)) {
                return playerIndex1;
            } else {
                const nextData = this._getNextTurnAndPlayerIndex(data.turnIndex, playerIndex1).info;
                return nextData ? nextData.playerIndex : undefined;
            }
        }

        public getPhaseCode(): TurnPhaseCode | undefined {
            return this._phaseCode;
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            if (this._phaseCode !== code) {
                this._phaseCode = code;
                Notify.dispatch(NotifyType.BwTurnPhaseCodeChanged);
            }
        }

        public getEnterTurnTime(): number | undefined {
            return this._enterTurnTime;
        }
        private _setEnterTurnTime(time: number): void {
            this._enterTurnTime = time;
        }

        private _getNextTurnAndPlayerIndex(
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

        private _getHasUnitOnBeginningTurn(): boolean {
            return this._hasUnitOnBeginningTurn;
        }
        private _setHasUnitOnBeginningTurn(hasUnit: boolean): void {
            this._hasUnitOnBeginningTurn = hasUnit;
        }
    }

    function sorterForRepairUnits(unit1: BwUnit, unit2: BwUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        if (cost1 == null) {
            Logger.error(`BwTurnManagerHelper.sorterForRepairUnit empty cost1.`);
            return 0;
        }

        const cost2 = unit2.getProductionFinalCost();
        if (cost2 == null) {
            Logger.error(`BwTurnManagerHelper.sorterForRepairUnit empty cost2.`);
            return 0;
        }

        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            const unitId1 = unit1.getUnitId();
            if (unitId1 == null) {
                Logger.error(`BwTurnManagerHelper.sorterForRepairUnit empty unitId1.`);
                return 0;
            }

            const unitId2 = unit2.getUnitId();
            if (unitId2 == null) {
                Logger.error(`BwTurnManagerHelper.sorterForRepairUnit empty unitId2.`);
                return 0;
            }

            return unitId1 - unitId2;
        }
    }
}

export default TwnsBwTurnManager;
