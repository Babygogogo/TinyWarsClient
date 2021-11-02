
// import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Timer                    from "../../tools/helpers/Timer";
// import Types                    from "../../tools/helpers/Types";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarDestructionHelpers    from "../../tools/warHelpers/WarDestructionHelpers";
// import WarVisibilityHelpers     from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwUnit               from "./BwUnit";
// import TwnsBwWar                from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwTurnManager {
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import TurnPhaseCode                = Types.TurnPhaseCode;
    import TurnAndPlayerIndex           = Types.TurnAndPlayerIndex;
    import ISerialTurnManager           = ProtoTypes.WarSerialization.ISerialTurnManager;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn    = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = WarAction.IWarActionPlayerEndTurn;
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;

    export class BwTurnManager {
        private _turnIndex?          : number;
        private _playerIndexInTurn?  : number;
        private _phaseCode?          : TurnPhaseCode;
        private _enterTurnTime?      : number;

        private _war?                   : TwnsBwWar.BwWar;
        private _hasUnitOnBeginningTurn = false;

        public init(data: Types.Undefinable<ISerialTurnManager>, playersCountUnneutral: number): void {
            if (data == null) {
                throw Helpers.newError(`Empty data.`, ClientErrorCode.BwTurnManager_Init_00);
            }

            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex < CommonConstants.WarNeutralPlayerIndex)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTurnManager_Init_01);
            }

            const turnPhaseCode = data.turnPhaseCode as TurnPhaseCode;
            if ((turnPhaseCode !== TurnPhaseCode.Main)          &&
                (turnPhaseCode !== TurnPhaseCode.WaitBeginTurn)
            ) {
                throw Helpers.newError(`Invalid turnPhaseCode: ${turnPhaseCode}`, ClientErrorCode.BwTurnManager_Init_02);
            }

            this._setTurnIndex(Helpers.getExisted(data.turnIndex, ClientErrorCode.BwTurnManager_Init_03));
            this._setPlayerIndexInTurn(playerIndex);
            this._setPhaseCode(turnPhaseCode);
            this._setEnterTurnTime(Helpers.getExisted(data.enterTurnTime, ClientErrorCode.BwTurnManager_Init_04));
        }
        public fastInit(data: ISerialTurnManager, playersCountUnneutral: number): void {
            this.init(data, playersCountUnneutral);
        }

        public startRunning(war: TwnsBwWar.BwWar): void {
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

        private _setWar(war: TwnsBwWar.BwWar): void {
            this._war = war;
        }
        public getWar(): TwnsBwWar.BwWar {
            return Helpers.getExisted(this._war);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The functions for running turn.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public endPhaseWaitBeginTurn(action: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            this.getWar().getIsExecuteActionsWithExtraData()
                ? this._endPhaseWaitBeginTurnWithExtraData(action, isFastExecute)
                : this._endPhaseWaitBeginTurnWithoutExtraData(isFastExecute);
        }
        public endPhaseMain(action: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            this.getWar().getIsExecuteActionsWithExtraData()
                ? this._endPhaseMainWithExtraData(action, isFastExecute)
                : this._endPhaseMainWithoutExtraData(isFastExecute);
        }

        private _endPhaseWaitBeginTurnWithExtraData(action: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            const phaseCode = this.getPhaseCode();
            if (phaseCode !== TurnPhaseCode.WaitBeginTurn) {
                throw Helpers.newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
            }

            this._runPhaseGetFundWithExtraData(action, isFastExecute);
            this._runPhaseConsumeFuelWithExtraData(action, isFastExecute);
            this._runPhaseRepairUnitByTileWithExtraData(action, isFastExecute);
            this._runPhaseDestroyUnitsOutOfFuelWithExtraData(action, isFastExecute);
            this._runPhaseRepairUnitByUnitWithExtraData(action, isFastExecute);
            this._runPhaseRecoverUnitByCoWithExtraData(action, isFastExecute);
            this._runPhaseActivateMapWeaponWithExtraData(action, isFastExecute);
            this._runPhaseMainWithExtraData(action, isFastExecute);

            this._setPhaseCode(TurnPhaseCode.Main);

            const extraData = Helpers.getExisted(action.extraData, ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
            WarCommonHelpers.handleCommonExtraDataForWarActions({
                war             : this.getWar(),
                commonExtraData : Helpers.getExisted(extraData.commonExtraData, ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
                isFastExecute,
            });
        }
        private _endPhaseWaitBeginTurnWithoutExtraData(isFastExecute: boolean): void {
            const phaseCode = this.getPhaseCode();
            if (phaseCode !== TurnPhaseCode.WaitBeginTurn) {
                throw Helpers.newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
            }

            this._runPhaseGetFundWithoutExtraData(isFastExecute);
            this._runPhaseConsumeFuelWithoutExtraData(isFastExecute);
            this._runPhaseRepairUnitByTileWithoutExtraData(isFastExecute);
            this._runPhaseDestroyUnitsOutOfFuelWithoutExtraData(isFastExecute);
            this._runPhaseRepairUnitByUnitWithoutExtraData(isFastExecute);
            this._runPhaseRecoverUnitByCoWithoutExtraData(isFastExecute);
            this._runPhaseActivateMapWeaponWithoutExtraData(isFastExecute);
            this._runPhaseMainWithoutExtraData(isFastExecute);

            this._setPhaseCode(TurnPhaseCode.Main);
        }

        private _endPhaseMainWithExtraData(action: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            const phaseCode = this.getPhaseCode();
            if (phaseCode !== TurnPhaseCode.Main) {
                throw Helpers.newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
            }

            this._runPhaseResetUnitStateWithExtraData(action, isFastExecute);
            this._runPhaseResetVisionForCurrentPlayerWithExtraData(action, isFastExecute);
            this._runPhaseTickTurnAndPlayerIndexWithExtraData(action, isFastExecute);
            this._runPhaseResetSkillStateWithExtraData(action, isFastExecute);
            this._runPhaseResetVotesForDrawWithExtraData(action, isFastExecute);
            this._runPhaseUpdateWeatherWithExtraData(action, isFastExecute);
            this._runPhaseResetVisionForNextPlayerWithExtraData(action, isFastExecute);
            this._runPhaseWaitBeginTurnWithExtraData(action, isFastExecute);

            this._setPhaseCode(TurnPhaseCode.WaitBeginTurn);

            const extraData = Helpers.getExisted(action.extraData, ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
            WarCommonHelpers.handleCommonExtraDataForWarActions({
                war             : this.getWar(),
                commonExtraData : Helpers.getExisted(extraData.commonExtraData, ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
                isFastExecute,
            });
        }
        private _endPhaseMainWithoutExtraData(isFastExecute: boolean): void {
            const phaseCode = this.getPhaseCode();
            if (phaseCode !== TurnPhaseCode.Main) {
                throw Helpers.newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
            }

            this._runPhaseResetUnitStateWithoutExtraData(isFastExecute);
            this._runPhaseResetVisionForCurrentPlayerWithoutExtraData(isFastExecute);
            this._runPhaseTickTurnAndPlayerIndexWithoutExtraData(isFastExecute);
            this._runPhaseResetSkillStateWithoutExtraData(isFastExecute);
            this._runPhaseResetVotesForDrawWithoutExtraData(isFastExecute);
            this._runPhaseUpdateWeatherWithoutExtraData(isFastExecute);
            this._runPhaseResetVisionForNextPlayerWithoutExtraData(isFastExecute);
            this._runPhaseWaitBeginTurnWithoutExtraData(isFastExecute);

            this._setPhaseCode(TurnPhaseCode.WaitBeginTurn);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseGetFundWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseGetFundWithoutExtraData(isFastExecute: boolean): void {
            const war = this.getWar();
            const playerIndex = this.getPlayerIndexInTurn();
            const player = war.getPlayer(playerIndex);
            const currentFund = player.getFund();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                this._setHasUnitOnBeginningTurn(false);
            } else {
                this._setHasUnitOnBeginningTurn(war.getUnitMap().checkHasUnit(playerIndex));

                let totalIncome = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
                if (this.getTurnIndex() === CommonConstants.WarFirstTurnIndex) {
                    const initialFund = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
                    totalIncome += initialFund;
                }

                player.setFund(currentFund + totalIncome);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseConsumeFuelWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseConsumeFuelWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex = this.getPlayerIndexInTurn();
            const turnIndex = this.getTurnIndex();
            const war = this.getWar();
            if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) && (turnIndex > CommonConstants.WarFirstTurnIndex)) {
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        const currentFuel = unit.getCurrentFuel();
                        const consumption = unit.getFuelConsumptionPerTurn();
                        unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseRepairUnitByTileWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        private _runPhaseRepairUnitByTileWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war           = this.getWar();
                const player        = war.getPlayer(playerIndex);
                const allUnitsOnMap : TwnsBwUnit.BwUnit[] = [];
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsOnMap.push(unit));
                }

                const visibleUnits      = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const tileMap           = war.getTileMap();
                const gridVisionEffect  = war.getGridVisualEffect();
                for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                    const gridIndex     = unit.getGridIndex();
                    const tile          = tileMap.getTile(gridIndex);
                    const repairData    = tile.getRepairHpAndCostForUnit(unit);
                    if (repairData) {
                        const fund                      = player.getFund();
                        const deltaFuel                 = unit.getUsedFuel();
                        const deltaHp                   = repairData.hp > 0 ? repairData.hp : null;
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

                        if ((!isFastExecute) && (visibleUnits.has(unit))) {
                            if (deltaHp) {
                                gridVisionEffect.showEffectRepair(gridIndex);
                            } else if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                gridVisionEffect.showEffectSupply(gridIndex);
                            }
                        }
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseDestroyUnitsOutOfFuelWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        private _runPhaseDestroyUnitsOutOfFuelWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war       = this.getWar();
                const fogMap    = war.getFogMap();
                for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                    const currentFuel = unit.getCurrentFuel();
                    if ((unit.checkIsDestroyedOnOutOfFuel())    &&
                        (currentFuel <= 0)                      &&
                        (unit.getPlayerIndex() === playerIndex)
                    ) {
                        const gridIndex = unit.getGridIndex();
                        fogMap.updateMapFromPathsByUnitAndPath(unit, [gridIndex]);
                        WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseRepairUnitByUnitWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        private _runPhaseRepairUnitByUnitWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war               = this.getWar();
                const player            = war.getPlayer(playerIndex);
                const unitMap           = war.getUnitMap();
                const mapSize           = unitMap.getMapSize();
                const visibleUnits      = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const gridVisionEffect  = war.getGridVisualEffect();
                const allUnitsLoaded    : TwnsBwUnit.BwUnit[] = [];
                for (const unit of unitMap.getAllUnitsLoaded()) {
                    (unit.getPlayerIndex() === playerIndex) && (allUnitsLoaded.push(unit));
                }

                for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                    const loader        = Helpers.getExisted(unit.getLoaderUnit(), ClientErrorCode.BwTurnManager_RunPhaseRepairUnitByUnitWithoutExtraData_00);
                    const gridIndex     = loader.getGridIndex();
                    const repairData    = loader.getRepairHpAndCostForLoadedUnit(unit);
                    if (repairData) {
                        const deltaFuel                 = unit.getUsedFuel();
                        const fund                      = player.getFund();
                        const deltaHp                   = repairData.hp > 0 ? repairData.hp : null;
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

                        if ((!isFastExecute) && (visibleUnits.has(loader))) {
                            if (deltaHp) {
                                gridVisionEffect.showEffectRepair(gridIndex);
                            } else if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                gridVisionEffect.showEffectSupply(gridIndex);
                            }
                        }

                    } else if (loader.checkCanSupplyLoadedUnit()) {
                        const deltaFuel                 = unit.getUsedFuel();
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

                        if ((!isFastExecute) && (visibleUnits.has(loader))) {
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
                        for (const gridIndex of GridIndexHelpers.getAdjacentGrids(supplierGridIndex, mapSize)) {
                            const unit      = unitMap.getUnitOnMap(gridIndex);
                            const unitId    = unit ? unit.getUnitId() : null;
                            if ((unitId != null) && (unit) && (!suppliedUnitIds.has(unitId)) && (supplier.checkCanSupplyAdjacentUnit(unit))) {
                                const deltaFuel                 = unit.getUsedFuel();
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

                                if ((!isFastExecute) && (visibleUnits.has(unit))) {
                                    if ((deltaFlareAmmo) || (deltaFuel) || (deltaPrimaryWeaponAmmo)) {
                                        gridVisionEffect.showEffectSupply(gridIndex);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseRecoverUnitByCoWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        private _runPhaseRecoverUnitByCoWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this.getWar();
            const player        = war.getPlayer(playerIndex);
            if (player.getCoId()) {
                const configVersion             = war.getConfigVersion();
                const coZoneRadius              = player.getCoZoneRadius();
                const visibleUnits              = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const unitMap                   = war.getUnitMap();
                const gridVisionEffect          = war.getGridVisualEffect();
                const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
                for (const skillId of player.getCoCurrentSkills() || []) {
                    const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                    if (skillCfg.selfHpRecovery) {
                        const recoverCfg    = skillCfg.selfHpRecovery;
                        const targetUnits   : TwnsBwUnit.BwUnit[] = [];
                        for (const unit of unitMap.getAllUnits()) {
                            const unitType      = unit.getUnitType();
                            const unitGridIndex = unit.getGridIndex();
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
                            const normalizedMaxHp       = unit.getNormalizedMaxHp();
                            const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
                            const currentFund           = player.getFund();
                            const productionCost        = unit.getProductionFinalCost();
                            const currentHp             = unit.getCurrentHp();
                            const normalizedRepairHp    = Math.min(
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

                                if ((!isFastExecute) && (visibleUnits.has(unit))) {
                                    gridVisionEffect.showEffectRepair(gridIndex);
                                }
                            }
                        }
                    }

                    if (skillCfg.selfFuelRecovery) {
                        const recoverCfg = skillCfg.selfFuelRecovery;
                        for (const unit of unitMap.getAllUnits()) {
                            const unitType      = unit.getUnitType();
                            const unitGridIndex = unit.getGridIndex();
                            if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                                (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                                    gridIndex               : unitGridIndex,
                                    coSkillAreaType         : recoverCfg[0],
                                    getCoGridIndexArrayOnMap,
                                    coZoneRadius,
                                }))
                            ) {
                                const maxFuel       = unit.getMaxFuel();
                                const currentFuel   = unit.getCurrentFuel();
                                const deltaFuel     = Math.min(Math.floor(maxFuel * recoverCfg[2] / 100), maxFuel - currentFuel);
                                unit.updateByRepairData({
                                    gridIndex               : unitGridIndex,
                                    unitId                  : unit.getUnitId(),
                                    deltaHp                 : null,
                                    deltaFuel,
                                    deltaFlareAmmo          : null,
                                    deltaPrimaryWeaponAmmo  : null,
                                });

                                if ((!isFastExecute) && (visibleUnits.has(unit))) {
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
                            const unitType      = unit.getUnitType();
                            const unitGridIndex = unit.getGridIndex();
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
                                    const currentAmmo               = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.BwTurnManager_RunPhaseRecoverUnitByCoWithoutExtraData_00);
                                    const deltaPrimaryWeaponAmmo    = Math.min(Math.floor(maxAmmo * recoverCfg[2] / 100), maxAmmo - currentAmmo);
                                    unit.updateByRepairData({
                                        gridIndex               : unitGridIndex,
                                        unitId                  : unit.getUnitId(),
                                        deltaHp                 : null,
                                        deltaFuel               : null,
                                        deltaFlareAmmo          : null,
                                        deltaPrimaryWeaponAmmo,
                                    });

                                    if ((!isFastExecute) && (visibleUnits.has(unit))) {
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
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseActivateMapWeaponWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do for now.
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseActivateMapWeaponWithoutExtraData(isFastExecute: boolean): void {
            // nothing to do for now.
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseMainWithExtraData(data: IWarActionSystemBeginTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseMainWithoutExtraData(isFastExecute: boolean): void {
            const war           = this.getWar();
            const playerIndex   = this.getPlayerIndexInTurn();
            const player        = war.getPlayer(playerIndex);
            const unitMap       = war.getUnitMap();
            const hasUnit       = unitMap.checkHasUnit(playerIndex);
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
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetUnitStateWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetUnitStateWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
                const war = this.getWar();
                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.setActionState(Types.UnitActionState.Idle);
                        unit.updateView();
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVisionForCurrentPlayerWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVisionForCurrentPlayerWithoutExtraData(isFastExecute: boolean): void {
            const war = this.getWar();
            war.getFogMap().resetMapFromPathsForPlayer(war.getPlayerIndexInTurn());
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseTickTurnAndPlayerIndexWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            const info = this._getNextTurnAndPlayerIndex();
            this._setTurnIndex(info.turnIndex);
            this._setPlayerIndexInTurn(info.playerIndex);
            this._setEnterTurnTime(Timer.getServerTimestamp());
            this.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseTickTurnAndPlayerIndexWithoutExtraData(isFastExecute: boolean): void {
            const playerIndex   = this.getPlayerIndexInTurn();
            const war           = this.getWar();
            const currTime      = Timer.getServerTimestamp();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                // nothing to do
            } else {
                const player            = war.getPlayer(playerIndex);
                const bootTimerParams   = war.getSettingsBootTimerParams();
                const timerType         : Types.BootTimerType = bootTimerParams[0];
                if (timerType === Types.BootTimerType.NoBoot) {
                    player.setRestTimeToBoot(0);

                } else if (timerType === Types.BootTimerType.Regular) {
                    player.setRestTimeToBoot(Helpers.getExisted(bootTimerParams[1], ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_00));

                } else if (timerType === Types.BootTimerType.Incremental) {
                    const oldRestTimeToBoot = player.getRestTimeToBoot();
                    const enterTurnTime     = this.getEnterTurnTime();
                    const incrementalTime   = Helpers.getExisted(bootTimerParams[2], ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_01);
                    const restTimeToBoot    = Math.max(
                        0,
                        Math.min(
                            CommonConstants.WarBootTimerIncrementalMaxLimit,
                            oldRestTimeToBoot - (currTime - enterTurnTime) + incrementalTime * war.getUnitMap().countAllUnitsForPlayer(playerIndex),
                        ),
                    );
                    player.setRestTimeToBoot(restTimeToBoot);

                } else {
                    throw Helpers.newError(`Invalid timerType: ${timerType}`, ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_02);
                }
            }

            const info = this._getNextTurnAndPlayerIndex();
            this._setTurnIndex(info.turnIndex);
            this._setPlayerIndexInTurn(info.playerIndex);
            this._setEnterTurnTime(Timer.getServerTimestamp());
            war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetSkillStateWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetSkillStateWithoutExtraData(isFastExecute: boolean): void {
            const war       = this.getWar();
            const player    = war.getPlayerInTurn();
            player.setCoIsDestroyedInTurn(false);

            if (player.checkCoIsUsingActiveSkill()) {
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
                war.getTileMap().getView().updateCoZone();
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVotesForDrawWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVotesForDrawWithoutExtraData(isFastExecute: boolean): void {
            const war       = this.getWar();
            const player    = war.getPlayerInTurn();
            player.setHasVotedForDraw(false);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseUpdateWeatherWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            const weatherManager = this.getWar().getWeatherManager();
            weatherManager.updateOnPlayerTurnSwitched();

            if (!isFastExecute) {
                weatherManager.getView().resetView(false);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseUpdateWeatherWithoutExtraData(isFastExecute: boolean): void {
            const weatherManager = this.getWar().getWeatherManager();
            weatherManager.updateOnPlayerTurnSwitched();

            if (!isFastExecute) {
                weatherManager.getView().resetView(false);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVisionForNextPlayerWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            // if (!isFastExecute) {
            //     this.getWar().updateTilesAndUnitsOnVisibilityChanged();
            // }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseResetVisionForNextPlayerWithoutExtraData(isFastExecute: boolean): void {
            // if (!isFastExecute) {
            //     this.getWar().updateTilesAndUnitsOnVisibilityChanged();
            // }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseWaitBeginTurnWithExtraData(data: IWarActionPlayerEndTurn, isFastExecute: boolean): void {
            // Do nothing.
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _runPhaseWaitBeginTurnWithoutExtraData(isFastExecute: boolean): void {
            // Do nothing.
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTurnIndex(): number {
            return Helpers.getExisted(this._turnIndex);
        }
        private _setTurnIndex(index: number): void {
            if (this._turnIndex !== index){
                this._turnIndex = index;
                Notify.dispatch(NotifyType.BwTurnIndexChanged);
            }
        }

        public getPlayerIndexInTurn(): number {
            return Helpers.getExisted(this._playerIndexInTurn);
        }
        private _setPlayerIndexInTurn(index: number): void {
            if (this._playerIndexInTurn !== index) {
                this._playerIndexInTurn = index;
                Notify.dispatch(NotifyType.BwPlayerIndexInTurnChanged);
            }
        }
        public getNextAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
            const data          = this._getNextAliveTurnAndPlayerIndex(null, playerIndex);
            const playerIndex1  = data.playerIndex;
            if ((playerIndex1 !== CommonConstants.WarNeutralPlayerIndex) || (includeNeutral)) {
                return playerIndex1;
            } else {
                const nextData = this._getNextAliveTurnAndPlayerIndex(data.turnIndex, playerIndex1);
                return nextData.playerIndex;
            }
        }

        public getPhaseCode(): TurnPhaseCode {
            return Helpers.getExisted(this._phaseCode);
        }
        private _setPhaseCode(code: TurnPhaseCode): void {
            if (this._phaseCode !== code) {
                this._phaseCode = code;
                Notify.dispatch(NotifyType.BwTurnPhaseCodeChanged);
            }
        }

        public getEnterTurnTime(): number {
            return Helpers.getExisted(this._enterTurnTime);
        }
        private _setEnterTurnTime(time: number): void {
            this._enterTurnTime = time;
        }

        private _getNextTurnAndPlayerIndex(
            currTurnIndex   = this.getTurnIndex(),
            currPlayerIndex = this.getPlayerIndexInTurn(),
        ): Types.TurnAndPlayerIndex {
            if (currPlayerIndex < this.getWar().getPlayerManager().getTotalPlayersCount(false)) {
                return {
                    turnIndex   : currTurnIndex,
                    playerIndex : currPlayerIndex + 1,
                };
            } else {
                return {
                    turnIndex   : currTurnIndex + 1,
                    playerIndex : CommonConstants.WarNeutralPlayerIndex,
                };
            }
        }
        private _getNextAliveTurnAndPlayerIndex(
            currTurnIndex   : number | null,
            currPlayerIndex = this.getPlayerIndexInTurn(),
        ): TurnAndPlayerIndex {
            const war           = this.getWar();
            currTurnIndex       = currTurnIndex ?? this.getTurnIndex();
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
                if (player.getAliveState() !== Types.PlayerAliveState.Dead) {
                    return {
                        turnIndex   : nextTurnIndex,
                        playerIndex : nextPlayerIndex
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

    function sorterForRepairUnits(unit1: TwnsBwUnit.BwUnit, unit2: TwnsBwUnit.BwUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        if (cost1 == null) {
            throw Helpers.newError(`Empty cost1.`, ClientErrorCode.BwTurnManager_SorterForRepairUnits_00);
        }

        const cost2 = unit2.getProductionFinalCost();
        if (cost2 == null) {
            throw Helpers.newError(`Empty cost2.`, ClientErrorCode.BwTurnManager_SorterForRepairUnits_01);
        }

        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            const unitId1 = unit1.getUnitId();
            if (unitId1 == null) {
                throw Helpers.newError(`Empty unitId1.`, ClientErrorCode.BwTurnManager_SorterForRepairUnits_02);
            }

            const unitId2 = unit2.getUnitId();
            if (unitId2 == null) {
                throw Helpers.newError(`Empty unitId2.`, ClientErrorCode.BwTurnManager_SorterForRepairUnits_03);
            }

            return unitId1 - unitId2;
        }
    }
}

// export default TwnsBwTurnManager;
