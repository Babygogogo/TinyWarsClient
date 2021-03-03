
namespace TinyWars.BaseWar.BwTurnManagerHelper {
    import Logger                       = Utility.Logger;
    import ProtoTypes                   = Utility.ProtoTypes;
    import Types                        = Utility.Types;
    import VisibilityHelpers            = Utility.VisibilityHelpers;
    import GridIndexHelpers             = Utility.GridIndexHelpers;
    import ConfigManager                = Utility.ConfigManager;
    import GridIndex                    = Types.GridIndex;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn   = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn     = WarAction.IWarActionPlayerEndTurn;
    import CommonConstants              = ConfigManager.COMMON_CONSTANTS;

    export function runPhaseGetFundWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): void {
        const war = turnManager.getWar();
        if (war == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty war.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty unitMap.`);
            return undefined;
        }

        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty playerIndex.`);
            return undefined;
        }

        const player = war.getPlayer(playerIndex);
        if (player == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty player.`);
            return undefined;
        }

        if (playerIndex !== 0) {
            const extraData = data.extraData;
            if (extraData == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty extraData.`);
                return undefined;
            }

            const remainingFund = extraData.remainingFund;
            if (remainingFund == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithExtraData() empty remainingFund.`);
                return undefined;
            }

            player.setFund(remainingFund);
        }
    }
    export function runPhaseGetFundWithoutExtraData(turnManager: BwTurnManager): void {
        const war = turnManager.getWar();
        if (war == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty war.`);
            return undefined;
        }

        const tileMap = war.getTileMap();
        if (tileMap == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty tileMap.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty unitMap.`);
            return undefined;
        }

        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty playerIndex.`);
            return undefined;
        }

        const player = war.getPlayer(playerIndex);
        if (player == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty player.`);
            return undefined;
        }

        const currentFund = player.getFund();
        if (currentFund == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty currentFund.`);
            return undefined;
        }

        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            turnManager.setHasUnitOnBeginningTurn(false);
        } else {
            turnManager.setHasUnitOnBeginningTurn(unitMap.checkHasUnit(playerIndex));

            let totalIncome = tileMap.getTotalIncomeForPlayer(playerIndex);
            if (totalIncome == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty totalIncome.`);
                return undefined;
            }

            if (turnManager.getTurnIndex() === CommonConstants.WarFirstTurnIndex) {
                const initialFund = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
                if (initialFund == null) {
                    Logger.error(`BwTurnManagerHelper.runPhaseGetFundWithoutExtraData() empty initialFund.`);
                    return undefined;
                }
                totalIncome += initialFund;
            }

            player.setFund(currentFund + totalIncome);
        }
    }

    export function runPhaseRepairUnitByTileWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): void {
        const extraData = data.extraData;
        if (extraData == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithExtraData() empty extraData.`);
            return undefined;
        }

        const war               = turnManager.getWar();
        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
        const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());

        for (const repairData of extraData.recoveryDataByTile || []) {
            const gridIndex = repairData.gridIndex as GridIndex;
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
    }
    export function runPhaseRepairUnitByTileWithoutExtraData(turnManager: BwTurnManager): void {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty playerIndex.`);
            return undefined;
        }

        const war = turnManager.getWar();
        if (war == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty war.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty unitMap.`);
            return undefined;
        }

        const tileMap = war.getTileMap();
        if (tileMap == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty tileMap.`);
            return undefined;
        }

        if (playerIndex !== 0) {
            const player = war.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty player.`);
                return undefined;
            }

            const allUnitsOnMap: BwUnit[] = [];
            unitMap.forEachUnitOnMap(unit => {
                (unit.getPlayerIndex() === playerIndex) && (allUnitsOnMap.push(unit));
            });

            const gridVisionEffect  = war.getGridVisionEffect();
            const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty gridIndex.`);
                    return undefined;
                }

                const tile = tileMap.getTile(gridIndex);
                if (tile == null) {
                    Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty tile.`);
                    return undefined;
                }

                const repairData = tile.getRepairHpAndCostForUnit(unit);
                if (repairData) {
                    const fund = player.getFund();
                    if (fund == null) {
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty fund.`);
                        return undefined;
                    }

                    const deltaFuel = unit.getUsedFuel();
                    if (deltaFuel == null) {
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByTileWithoutExtraData() empty deltaFuel.`);
                        return undefined;
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
    }

    export function runPhaseRepairUnitByUnitWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): void {
        const war               = turnManager.getWar();
        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
        const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());

        for (const repairData of data.extraData.recoveryDataByUnit || []) {
            const gridIndex = repairData.gridIndex as GridIndex;
            const unit      = unitMap.getUnit(gridIndex, repairData.unitId)
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
    }
    export function runPhaseRepairUnitByUnitWithoutExtraData(turnManager: BwTurnManager): void {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty playerIndex.`);
            return undefined;
        }

        if (playerIndex !== 0) {
            const war = turnManager.getWar();
            if (war == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty war.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty unitMap.`);
                return undefined;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty player.`);
                return undefined;
            }

            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty mapSize.`);
                return undefined;
            }

            const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            const gridVisionEffect  = war.getGridVisionEffect();
            const allUnitsLoaded    : BwUnit[] = [];
            unitMap.forEachUnitLoaded(unit => {
                (unit.getPlayerIndex() === playerIndex) && (allUnitsLoaded.push(unit));
            });

            for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                const loader = unit.getLoaderUnit();
                if (loader == null) {
                    Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty loader.`);
                    return undefined;
                }

                const gridIndex = loader.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty gridIndex.`);
                    return undefined;
                }

                const repairData = loader.getRepairHpAndCostForLoadedUnit(unit);
                if (repairData) {
                    const deltaFuel = unit.getUsedFuel();
                    if (deltaFuel == null) {
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty deltaFuel.`);
                        return undefined;
                    }

                    const fund = player.getFund();
                    if (fund == null) {
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty fund.`);
                        return undefined;
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
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty deltaFuel 2.`);
                        return undefined;
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
            unitMap.forEachUnitOnMap(supplier => {
                if ((supplier.getPlayerIndex() === playerIndex) && (supplier.checkIsAdjacentUnitSupplier())) {
                    const supplierGridIndex = supplier.getGridIndex();
                    if (supplierGridIndex == null) {
                        Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty supplierGridIndex.`);
                        return undefined;
                    }

                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(supplierGridIndex, mapSize)) {
                        const unit      = unitMap.getUnitOnMap(gridIndex);
                        const unitId    = unit ? unit.getUnitId() : undefined;
                        if ((unitId != null) && (unit) && (!suppliedUnitIds.has(unitId)) && (supplier.checkCanSupplyAdjacentUnit(unit))) {
                            const deltaFuel = unit.getUsedFuel();
                            if (deltaFuel == null) {
                                Logger.error(`BwTurnManagerHelper.runPhaseRepairUnitByUnitWithoutExtraData() empty deltaFuel 3.`);
                                return undefined;
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
            });
        }
    }

    export function runPhaseRecoverUnitByCoWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): void {
        const war               = turnManager.getWar();
        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
        const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());

        for (const repairData of data.extraData.recoveryDataByCo || []) {
            const gridIndex = repairData.gridIndex as GridIndex;
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
    }
    export function runPhaseRecoverUnitByCoWithoutExtraData(turnManager: BwTurnManager): void {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty playerIndex.`);
            return undefined;
        }

        const war = turnManager.getWar();
        if (war == null) {
            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty war.`);
            return undefined;
        }

        const player = war.getPlayer(playerIndex);
        if (player == null) {
            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty player.`);
            return;
        }

        const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
        if (coGridIndexListOnMap == null) {
            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty coGridIndexList.`);
            return;
        }

        const configVersion = war.getConfigVersion();
        if (configVersion == null) {
            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty configVersion.`);
            return;
        }

        if (player.getCoId()) {
            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty coZoneRadius.`);
                return;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitMap.`);
                return undefined;
            }

            const gridVisionEffect  = war.getGridVisionEffect();
            const visibleUnits      = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId)!;

                if (skillCfg.selfHpRecovery) {
                    const recoverCfg    = skillCfg.selfHpRecovery;
                    const targetUnits   : BwUnit[] = [];
                    unitMap.forEachUnit(unit => {
                        const unitType = unit.getUnitType();
                        if (unitType == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitType.`);
                            return;
                        }

                        const unitGridIndex = unit.getGridIndex();
                        if (unitGridIndex == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitGridIndex.`);
                            return;
                        }

                        if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
                        ) {
                            targetUnits.push(unit);
                        }
                    });

                    const recoverAmount = recoverCfg[2];
                    for (const unit of targetUnits.sort(sorterForRepairUnits)) {
                        const normalizedMaxHp = unit.getNormalizedMaxHp();
                        if (normalizedMaxHp == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty normalizedMaxHp.`);
                            return undefined;
                        }

                        const normalizedCurrentHp = unit.getNormalizedCurrentHp();
                        if (normalizedCurrentHp == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty normalizedCurrentHp.`);
                            return undefined;
                        }

                        const currentFund = player.getFund();
                        if (currentFund == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty currentFund.`);
                            return undefined;
                        }

                        const productionCost = unit.getProductionFinalCost();
                        if (productionCost == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty productionCost.`);
                            return undefined;
                        }

                        const currentHp = unit.getCurrentHp();
                        if (currentHp == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty currentHp.`);
                            return undefined;
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
                    unitMap.forEachUnit(unit => {
                        const unitType = unit.getUnitType();
                        if (unitType == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitType.`);
                            return;
                        }

                        const unitGridIndex = unit.getGridIndex();
                        if (unitGridIndex == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitGridIndex.`);
                            return;
                        }

                        if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
                        ) {
                            const maxFuel = unit.getMaxFuel();
                            if (maxFuel == null) {
                                Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty maxFuel.`);
                                return undefined;
                            }

                            const currentFuel = unit.getCurrentFuel();
                            if (currentFuel == null) {
                                Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty currentFuel.`);
                                return undefined;
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
                    });
                }

                if (skillCfg.selfPrimaryAmmoRecovery) {
                    const recoverCfg = skillCfg.selfPrimaryAmmoRecovery;
                    unitMap.forEachUnit(unit => {
                        const unitType = unit.getUnitType();
                        if (unitType == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitType.`);
                            return;
                        }

                        const unitGridIndex = unit.getGridIndex();
                        if (unitGridIndex == null) {
                            Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty unitGridIndex.`);
                            return;
                        }

                        if ((unit.getPlayerIndex() === playerIndex)                                                                         &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, recoverCfg[1]))                               &&
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
                        ) {
                            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                            if (maxAmmo) {
                                const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                                if (currentAmmo == null) {
                                    Logger.error(`BwTurnManager._runPhaseRecoverUnitByCo() empty currentAmmo.`);
                                    return undefined;
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
                    });
                }
            }
        }
    }

    export function runPhaseTickTurnAndPlayerIndexWithExtraData(turnManager: BwTurnManager, data: IWarActionPlayerEndTurn): void {
        turnManager.getWar().getPlayerInTurn().setRestTimeToBoot(data.extraData.restTimeToBootForCurrentPlayer);

        const nextTurnAndPlayerIndex = turnManager.getNextTurnAndPlayerIndex();
        turnManager.setTurnIndex(nextTurnAndPlayerIndex.turnIndex);
        turnManager.setPlayerIndexInTurn(nextTurnAndPlayerIndex.playerIndex);
        turnManager.setEnterTurnTime(Time.TimeModel.getServerTimestamp());
        turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
    }
    export function runPhaseTickTurnAndPlayerIndexWithoutExtraData(turnManager: BwTurnManager): void {
        const nextTurnAndPlayerIndex = turnManager.getNextTurnAndPlayerIndex();
        turnManager.setTurnIndex(nextTurnAndPlayerIndex.turnIndex);
        turnManager.setPlayerIndexInTurn(nextTurnAndPlayerIndex.playerIndex);
        turnManager.setEnterTurnTime(Time.TimeModel.getServerTimestamp());
        turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
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
