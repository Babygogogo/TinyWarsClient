
namespace TinyWars.SingleCustomWar.ScwActionReviser {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Helpers          = Utility.Helpers;
    import BwWar            = BaseWar.BwWar;
    import BwUnit           = BaseWar.BwUnit;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import RawWarAction     = Types.RawWarActionContainer;
    import WarAction        = Types.WarActionContainer;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;
    import DropDestination  = Types.DropDestination;
    import CoSkillType      = Types.CoSkillType;
    import UnitAttributes   = Types.UnitAttributes;

    export function revise(war: BwWar, container: RawWarAction): WarAction {
        if      (container.PlayerBeginTurn)     { return revisePlayerBeginTurn(war, container); }
        else if (container.PlayerDeleteUnit)    { return revisePlayerDeleteUnit(war, container); }
        else if (container.PlayerEndTurn)       { return revisePlayerEndTurn(war, container); }
        else if (container.PlayerProduceUnit)   { return revisePlayerProduceUnit(war, container); }
        else if (container.UnitAttack)          { return reviseUnitAttack(war, container); }
        else if (container.UnitBeLoaded)        { return reviseUnitBeLoaded(war, container); }
        else if (container.UnitBuildTile)       { return reviseUnitBuildTile(war, container); }
        else if (container.UnitCaptureTile)     { return reviseUnitCaptureTile(war, container); }
        else if (container.UnitDive)            { return reviseUnitDive(war, container); }
        else if (container.UnitDrop)            { return reviseUnitDrop(war, container); }
        else if (container.UnitJoin)            { return reviseUnitJoin(war, container); }
        else if (container.UnitLaunchFlare)     { return reviseUnitLaunchFlare(war, container); }
        else if (container.UnitLaunchSilo)      { return reviseUnitLaunchSilo(war, container); }
        else if (container.UnitLoadCo)          { return reviseUnitLoadCo(war, container); }
        else if (container.UnitProduceUnit)     { return reviseUnitProduceUnit(war, container); }
        else if (container.UnitSupply)          { return reviseUnitSupply(war, container); }
        else if (container.UnitSurface)         { return reviseUnitSurface(war, container); }
        else if (container.UnitUseCoSkill)      { return reviseUnitUseCoSkill(war, container); }
        else if (container.UnitWait)            { return reviseUnitWait(war, container); }
        else                                    { return null; }
    }

    function revisePlayerBeginTurn(war: BwWar, rawAction: RawWarAction): WarAction {    // DONE
        const turnManager   = war.getTurnManager();
        const currPhaseCode = turnManager.getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.WaitBeginTurn,
            `ScwActionReviser.revisePlayerBeginTurn() invalid turn phase code: ${currPhaseCode}`
        );

        // init
        const playerIndexInTurn         = turnManager.getPlayerIndexInTurn();
        const turnIndex                 = turnManager.getTurnIndex();
        const tileMap                   = war.getTileMap();
        const unitMap                   = war.getUnitMap();
        const unitAttributesMap         = new Map<BwUnit, UnitAttributes>();
        const action                    : WarAction = {
            actionId                : war.getNextActionId(),
            WarActionPlayerBeginTurn: {},
        };
        unitMap.forEachUnit(unit => {
            if (unit.getPlayerIndex() === playerIndexInTurn) {
                unitAttributesMap.set(unit, unit.getAttributes());
            }
        });

        // PhaseGetFund
        let totalIncome = 0;
        if (playerIndexInTurn !== 0) {
            totalIncome += turnIndex === 0 ? war.getSettingsInitialFund() : 0;
            tileMap.forEachTile(tile => totalIncome += tile.getIncomeForPlayer(playerIndexInTurn));
        }

        // PhaseConsumeFuel
        if (playerIndexInTurn !== 0) {
            if (turnIndex > 0) {
                unitMap.forEachUnitOnMap(unit => {
                    if (unit.getPlayerIndex() === playerIndexInTurn) {
                        const attributes    = unitAttributesMap.get(unit);
                        attributes.fuel     = Math.max(0, attributes.fuel - unit.getFuelConsumptionPerTurn());
                    }
                });
            }
        }

        // PhaseRepairUnitByTile
        const playerInTurn  = war.getPlayer(playerIndexInTurn);
        let newFund         = playerInTurn.getFund() + totalIncome;
        if (playerIndexInTurn !== 0) {
            const allUnitsOnMap: BwUnit[] = [];
            unitMap.forEachUnitOnMap(unit => {
                (unit.getPlayerIndex() === playerIndexInTurn) && (allUnitsOnMap.push(unit));
            });

            const repairDataByTile  : ProtoTypes.IWarUnitRepairData[] = [];
            for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                const gridIndex     = unit.getGridIndex();
                const attributes    = unitAttributesMap.get(unit);
                const repairData    = tileMap.getTile(gridIndex).getRepairHpAndCostForUnit(unit, newFund, attributes);
                if (repairData) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex,
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : repairData.hp > 0 ? repairData.hp : undefined,
                        deltaFuel               : unit.getMaxFuel() - attributes.fuel,
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - attributes.primaryAmmo! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - attributes.flareAmmo! : null,
                    };
                    repairDataByTile.push(data);
                    newFund -= repairData.cost;
                    updateAttributesByRepairData(attributes, data);
                }
            }

            if (repairDataByTile.length) {
                action.WarActionPlayerBeginTurn.repairDataByTile = repairDataByTile;
            }
        }

        // PhaseDestroyUnitsOutOfFuel
        const destroyedUnits = new Set<BwUnit>();
        if (playerIndexInTurn !== 0) {
            unitMap.forEachUnitOnMap(unit => {
                if ((unit.checkIsDestroyedOnOutOfFuel())        &&
                    (unitAttributesMap.get(unit).fuel <= 0)     &&
                    (unit.getPlayerIndex() === playerIndexInTurn)
                ) {
                    destroyedUnits.add(unit);
                    for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
                        destroyedUnits.add(u);
                    }
                }
            });
        }

        // PhaseRepairUnitByUnit
        const mapSize = unitMap.getMapSize();
        if (playerIndexInTurn !== 0) {
            const allUnitsLoaded: BwUnit[] = [];
            unitMap.forEachUnitLoaded(unit => {
                if ((unit.getPlayerIndex() === playerIndexInTurn) && (!destroyedUnits.has(unit))) {
                    allUnitsLoaded.push(unit);
                }
            });

            const repairDataByUnit: ProtoTypes.IWarUnitRepairData[] = [];
            for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                const loader        = unit.getLoaderUnit();
                const attributes    = unitAttributesMap.get(unit);
                const repairData    = loader.getRepairHpAndCostForLoadedUnit(unit, newFund, attributes);
                if (repairData) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex               : unit.getGridIndex(),
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : repairData.hp > 0 ? repairData.hp : undefined,
                        deltaFuel               : unit.getMaxFuel() - attributes.fuel,
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - attributes.primaryAmmo! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - attributes.flareAmmo! : null,
                    };
                    repairDataByUnit.push(data);
                    newFund -= repairData.cost;
                    updateAttributesByRepairData(attributes, data);

                } else if (loader.checkCanSupplyLoadedUnit()) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex               : unit.getGridIndex(),
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : null,
                        deltaFuel               : unit.getMaxFuel() - attributes.fuel,
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - attributes.primaryAmmo! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - attributes.flareAmmo! : null,
                    };
                    repairDataByUnit.push(data);
                    updateAttributesByRepairData(attributes, data);
                }
            }

            unitMap.forEachUnitOnMap(supplier => {
                if ((supplier.checkIsAdjacentUnitSupplier())            &&
                    (!destroyedUnits.has(supplier))                     &&
                    (supplier.getPlayerIndex() === playerIndexInTurn)
                ) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(supplier.getGridIndex(), mapSize)) {
                        const unit          = unitMap.getUnitOnMap(gridIndex);
                        const unitId        = unit ? unit.getUnitId() : null;
                        const attributes    = unitAttributesMap.get(unit);
                        if ((unitId != null)                                        &&
                            (!destroyedUnits.has(unit))                             &&
                            (supplier.checkCanSupplyAdjacentUnit(unit, attributes))
                        ) {
                            const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                            const maxFlareAmmo      = unit.getFlareMaxAmmo();
                            const data              : ProtoTypes.IWarUnitRepairData = {
                                gridIndex,
                                unitId,
                                deltaHp                 : null,
                                deltaFuel               : unit.getMaxFuel() - attributes.fuel,
                                deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - attributes.primaryAmmo! : null,
                                deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - attributes.flareAmmo! : null,
                            };
                            repairDataByUnit.push(data);
                            updateAttributesByRepairData(attributes, data);
                        }
                    }
                }
            });

            if (repairDataByUnit.length > 0) {
                action.WarActionPlayerBeginTurn.repairDataByUnit = repairDataByUnit;
            }
        }

        // PhaseRecoverUnitByCo
        const coGridIndex = playerInTurn.getCoGridIndexOnMap();
        if ((playerIndexInTurn !== 0)                               &&
            (coGridIndex)                                           &&
            (!destroyedUnits.has(unitMap.getUnitOnMap(coGridIndex)))
        ) {
            const configVersion     = war.getConfigVersion();
            const unitHpNormalizer  = ConfigManager.UNIT_HP_NORMALIZER;
            const coZoneRadius      = playerInTurn.getCoZoneBaseRadius();
            const recoverDataList   : ProtoTypes.IWarUnitRepairData[] = [];

            for (const skillId of playerInTurn.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);

                if (skillCfg.selfHpRecovery) {
                    const recoverCfg    = skillCfg.selfHpRecovery;
                    const targetUnits   : BwUnit[] = [];
                    unitMap.forEachUnit(unit => {
                        if ((unit.getPlayerIndex() === playerIndexInTurn)                                           &&
                            (!destroyedUnits.has(unit))                                                             &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), recoverCfg[1]))
                        ) {
                            if ((recoverCfg[0] === Types.CoSkillAreaType.OnMap)                                                                                     ||
                                ((recoverCfg[0] === Types.CoSkillAreaType.Zone) && (GridIndexHelpers.getDistance(unit.getGridIndex(), coGridIndex) <= coZoneRadius))
                            ) {
                                targetUnits.push(unit);
                            }
                        }
                    });

                    const recoverAmount = recoverCfg[2];
                    for (const unit of targetUnits.sort(sorterForRepairUnits)) {
                        const attributes            = unitAttributesMap.get(unit);
                        const currentHp             = attributes.hp;
                        const normalizedMaxHp       = unit.getNormalizedMaxHp();
                        const productionCost        = unit.getProductionFinalCost();
                        const normalizedCurrentHp   = Helpers.getNormalizedHp(currentHp);
                        const normalizedRepairHp    = Math.min(
                            normalizedMaxHp - normalizedCurrentHp,
                            recoverAmount,
                            Math.floor(newFund * normalizedMaxHp / productionCost)
                        );

                        const repairAmount = (normalizedRepairHp + normalizedCurrentHp) * unitHpNormalizer - currentHp;
                        if (repairAmount > 0) {
                            const recoverData: ProtoTypes.IWarUnitRepairData = {
                                gridIndex               : unit.getGridIndex(),
                                unitId                  : unit.getUnitId(),
                                deltaHp                 : repairAmount,
                                deltaFuel               : null,
                                deltaFlareAmmo          : null,
                                deltaPrimaryWeaponAmmo  : null,
                            };
                            recoverDataList.push(recoverData);
                            newFund -= Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp);
                            updateAttributesByRepairData(attributes, recoverData);
                        }
                    }
                }

                if (skillCfg.selfFuelRecovery) {
                    const recoverCfg = skillCfg.selfFuelRecovery;
                    unitMap.forEachUnit(unit => {
                        if ((unit.getPlayerIndex() === playerIndexInTurn)                                           &&
                            (!destroyedUnits.has(unit))                                                             &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), recoverCfg[1]))
                        ) {
                            if ((recoverCfg[0] === Types.CoSkillAreaType.OnMap)                                                                                   ||
                                ((recoverCfg[0] === Types.CoSkillAreaType.Zone) && (GridIndexHelpers.getDistance(unit.getGridIndex(), coGridIndex) <= coZoneRadius))
                            ) {
                                const maxFuel       = unit.getMaxFuel();
                                const attributes    = unitAttributesMap.get(unit);
                                const recoverData   : ProtoTypes.IWarUnitRepairData = {
                                    gridIndex               : unit.getGridIndex(),
                                    unitId                  : unit.getUnitId(),
                                    deltaHp                 : null,
                                    deltaFuel               : Math.min(Math.floor(maxFuel * recoverCfg[2] / 100), maxFuel - attributes.fuel),
                                    deltaFlareAmmo          : null,
                                    deltaPrimaryWeaponAmmo  : null,
                                };
                                recoverDataList.push(recoverData);
                                updateAttributesByRepairData(attributes, recoverData);
                            }
                        }
                    });
                }

                if (skillCfg.selfPrimaryAmmoRecovery) {
                    const recoverCfg = skillCfg.selfPrimaryAmmoRecovery;
                    unitMap.forEachUnit(unit => {
                        if ((unit.getPlayerIndex() === playerIndexInTurn)                                           &&
                            (!destroyedUnits.has(unit))                                                             &&
                            (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), recoverCfg[1]))
                        ) {
                            if ((recoverCfg[0] === Types.CoSkillAreaType.OnMap)                                                                                   ||
                                ((recoverCfg[0] === Types.CoSkillAreaType.Zone) && (GridIndexHelpers.getDistance(unit.getGridIndex(), coGridIndex) <= coZoneRadius))
                            ) {
                                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                                if (maxAmmo) {
                                    const attributes    = unit.getAttributes();
                                    const recoverData   : ProtoTypes.IWarUnitRepairData = {
                                        gridIndex               : unit.getGridIndex(),
                                        unitId                  : unit.getUnitId(),
                                        deltaHp                 : null,
                                        deltaFuel               : null,
                                        deltaFlareAmmo          : null,
                                        deltaPrimaryWeaponAmmo  : Math.min(Math.floor(maxAmmo * recoverCfg[2] / 100), maxAmmo - attributes.primaryAmmo!),
                                    };
                                    recoverDataList.push(recoverData);
                                    updateAttributesByRepairData(attributes, recoverData);
                                }
                            }
                        }
                    });
                }
            }

            if (recoverDataList.length) {
                const dict = new Map<number, ProtoTypes.IWarUnitRepairData>();
                for (const data of recoverDataList) {
                    const unitId = data.unitId!;
                    if (!dict.has(unitId)) {
                        dict.set(unitId, Helpers.deepClone(data));
                    } else {
                        const currData      = dict.get(unitId)!;
                        currData.deltaHp    = currData.deltaHp == null
                            ? data.deltaHp
                            : currData.deltaHp + (data.deltaHp || 0);
                        currData.deltaFuel = currData.deltaFuel == null
                            ? data.deltaFuel
                            : currData.deltaFuel + (data.deltaFuel || 0);
                        currData.deltaFlareAmmo = currData.deltaFlareAmmo == null
                            ? data.deltaFlareAmmo
                            : currData.deltaFlareAmmo + (data.deltaFlareAmmo || 0);
                        currData.deltaPrimaryWeaponAmmo = currData.deltaPrimaryWeaponAmmo == null
                            ? data.deltaPrimaryWeaponAmmo
                            : currData.deltaPrimaryWeaponAmmo + (data.deltaPrimaryWeaponAmmo || 0);
                    }
                }

                const arr: ProtoTypes.IWarUnitRepairData[] = [];
                for (const [, data] of dict) {
                    arr.push(data);
                }
                action.WarActionPlayerBeginTurn!.recoverDataByCo = arr;
            }
        }

        // PhaseActivateMapWeapon
        // Nothing to do for now.

        // PhaseMain
        const unitsCount                                = unitAttributesMap.size;
        action.WarActionPlayerBeginTurn.remainingFund   = newFund;
        action.WarActionPlayerBeginTurn.isDefeated      = (playerIndexInTurn !== 0) && (unitsCount > 0) && (unitsCount === destroyedUnits.size);
        action.actionId                                 = rawAction.actionId;
        return action;
    }

    function revisePlayerDeleteUnit(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function revisePlayerEndTurn(war: BwWar, rawAction: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.revisePlayerEndTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getNextActionId(),
            WarActionPlayerEndTurn  : {}
        };
    }

    function revisePlayerProduceUnit(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitAttack(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitBeLoaded(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitBuildTile(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitCaptureTile(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        // return null;
        return {
            actionId                : rawAction.actionId,
            WarActionPlayerEndTurn  : {},
        }
    }

    function reviseUnitDive(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitDrop(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitJoin(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitLaunchFlare(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitLaunchSilo(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitLoadCo(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitProduceUnit(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitSupply(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitSurface(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitUseCoSkill(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function reviseUnitWait(war: BwWar, rawAction: RawWarAction): WarAction {
        // TODO
        return null;
    }

    function sorterForRepairUnits(unit1: BwUnit, unit2: BwUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        const cost2 = unit2.getProductionFinalCost();
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return unit1.getUnitId() - unit2.getUnitId();
        }
    }

    function updateAttributesByRepairData(attributes: UnitAttributes, repairData: ProtoTypes.IWarUnitRepairData): void {
        attributes.hp   += (repairData.deltaHp || 0);
        attributes.fuel += (repairData.deltaFuel || 0);
        (attributes.primaryAmmo != null) && (attributes.primaryAmmo += (repairData.deltaPrimaryWeaponAmmo || 0));
        (attributes.flareAmmo != null) && (attributes.flareAmmo += (repairData.deltaFlareAmmo || 0));
    }
}
