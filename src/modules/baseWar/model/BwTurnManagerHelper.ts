
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.BaseWar.BwTurnManagerHelper {
    import Logger                       = Utility.Logger;
    import ProtoTypes                   = Utility.ProtoTypes;
    import Types                        = Utility.Types;
    import VisibilityHelpers            = Utility.VisibilityHelpers;
    import GridIndexHelpers             = Utility.GridIndexHelpers;
    import ConfigManager                = Utility.ConfigManager;
    import CommonConstants              = Utility.CommonConstants;
    import ClientErrorCode              = Utility.ClientErrorCode;
    import GridIndex                    = Types.GridIndex;
    import WarAction                    = ProtoTypes.WarAction;
    import IWarActionSystemBeginTurn    = WarAction.IWarActionSystemBeginTurn;
    import IWarActionPlayerEndTurn      = WarAction.IWarActionPlayerEndTurn;

    export function runPhaseGetFundWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): ClientErrorCode {
        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithExtraData_00;
        }

        const playerIndex = turnManager.getPlayerIndexInTurn();
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
    export function runPhaseGetFundWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_00;
        }

        const playerIndex = turnManager.getPlayerIndexInTurn();
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
            turnManager.setHasUnitOnBeginningTurn(false);
        } else {
            turnManager.setHasUnitOnBeginningTurn(war.getUnitMap().checkHasUnit(playerIndex));

            let totalIncome = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
            if (totalIncome == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseGetFundWithoutExtraData_04;
            }

            if (turnManager.getTurnIndex() === CommonConstants.WarFirstTurnIndex) {
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

    export function runPhaseRepairUnitByTileWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): ClientErrorCode {
        const extraData = data.extraData;
        if (extraData == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_00;
        }

        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_01;
        }

        const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
        if (visibleUnits == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithExtraData_02;
        }

        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
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

        return ClientErrorCode.NoError;
    }
    export function runPhaseRepairUnitByTileWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByTileWithoutExtraData_00;
        }

        const war = turnManager.getWar();
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

            const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
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

    export function runPhaseRepairUnitByUnitWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): ClientErrorCode {
        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_00;
        }

        const extraData = data.extraData;
        if (extraData == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_01;
        }

        const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
        if (visibleUnits == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithExtraData_02;
        }

        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
        for (const repairData of extraData.recoveryDataByUnit || []) {
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

        return ClientErrorCode.NoError;
    }
    export function runPhaseRepairUnitByUnitWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRepairUnitByUnitWithoutExtraData_00;
        }

        if (playerIndex !== CommonConstants.WarNeutralPlayerIndex) {
            const war = turnManager.getWar();
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

            const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
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

    export function runPhaseRecoverUnitByCoWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): ClientErrorCode {
        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_00;
        }

        const extraData = data.extraData;
        if (extraData == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_01;
        }

        const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
        if (visibleUnits == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithExtraData_02;
        }

        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = war.getGridVisionEffect();
        for (const repairData of extraData.recoveryDataByCo || []) {
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

        return ClientErrorCode.NoError;
    }
    export function runPhaseRecoverUnitByCoWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const playerIndex = turnManager.getPlayerIndexInTurn();
        if (playerIndex == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_00;
        }

        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_01;
        }

        const player = war.getPlayer(playerIndex);
        if (player == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_02;
        }

        if (player.getCoId()) {
            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_03;
            }

            const configVersion = war.getConfigVersion();
            if (configVersion == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_04;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_05;
            }

            const visibleUnits = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            if (visibleUnits == null) {
                return ClientErrorCode.BwTurnManagerHelper_RunPhaseRecoverUnitByCoWithoutExtraData_06;
            }

            const unitMap           = war.getUnitMap();
            const gridVisionEffect  = war.getGridVisionEffect();
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
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
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
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
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
                            (BwHelpers.checkIsGridIndexInsideCoSkillArea(unitGridIndex, recoverCfg[0], coGridIndexListOnMap, coZoneRadius))
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

    export function runPhaseMainWithExtraData(turnManager: BwTurnManager, data: IWarActionSystemBeginTurn): ClientErrorCode {
        const war = turnManager.getWar();
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
    export function runPhaseMainWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseMainWithoutExtraData_00;
        }

        const playerIndex = turnManager.getPlayerIndexInTurn();
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
            (turnManager.getHasUnitOnBeginningTurn())               &&
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

    export function runPhaseTickTurnAndPlayerIndexWithExtraData(turnManager: BwTurnManager, data: IWarActionPlayerEndTurn): ClientErrorCode {
        const war = turnManager.getWar();
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

        const { errorCode, info } = turnManager.getNextTurnAndPlayerIndex();
        if (errorCode) {
            return errorCode;
        } else if (info == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithExtraData_03;
        }

        turnManager.setTurnIndex(info.turnIndex);
        turnManager.setPlayerIndexInTurn(info.playerIndex);
        turnManager.setEnterTurnTime(Time.TimeModel.getServerTimestamp());
        war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

        return ClientErrorCode.NoError;
    }
    export function runPhaseTickTurnAndPlayerIndexWithoutExtraData(turnManager: BwTurnManager): ClientErrorCode {
        const { errorCode, info } = turnManager.getNextTurnAndPlayerIndex();
        if (errorCode) {
            return errorCode;
        } else if (info == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_00;
        }

        const war = turnManager.getWar();
        if (war == null) {
            return ClientErrorCode.BwTurnManagerHelper_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_01;
        }

        turnManager.setTurnIndex(info.turnIndex);
        turnManager.setPlayerIndexInTurn(info.playerIndex);
        turnManager.setEnterTurnTime(Time.TimeModel.getServerTimestamp());
        war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

        return ClientErrorCode.NoError;
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
