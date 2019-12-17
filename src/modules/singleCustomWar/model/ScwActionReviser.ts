
namespace TinyWars.SingleCustomWar.ScwActionReviser {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import BwWar            = BaseWar.BwWar;
    import BwUnit           = BaseWar.BwUnit;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import WarAction        = Types.WarActionContainer;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;
    import DropDestination  = Types.DropDestination;
    import CoSkillType      = Types.CoSkillType;

    export function revise(war: BwWar, container: Types.RawWarActionContainer): WarAction {
        if      (container.PlayerBeginTurn)     { return revisePlayerBeginTurn(war, container.PlayerBeginTurn); }
        else if (container.PlayerDeleteUnit)    { return revisePlayerDeleteUnit(war, container.PlayerDeleteUnit); }
        else if (container.PlayerEndTurn)       { return revisePlayerEndTurn(war, container.PlayerEndTurn); }
        else if (container.PlayerProduceUnit)   { return revisePlayerProduceUnit(war, container.PlayerProduceUnit); }
        else if (container.UnitAttack)          { return reviseUnitAttack(war, container.UnitAttack); }
        else if (container.UnitBeLoaded)        { return reviseUnitBeLoaded(war, container.UnitBeLoaded); }
        else if (container.UnitBuildTile)       { return reviseUnitBuildTile(war, container.UnitBuildTile); }
        else if (container.UnitCaptureTile)     { return reviseUnitCaptureTile(war, container.UnitCaptureTile); }
        else if (container.UnitDive)            { return reviseUnitDive(war, container.UnitDive); }
        else if (container.UnitDrop)            { return reviseUnitDrop(war, container.UnitDrop); }
        else if (container.UnitJoin)            { return reviseUnitJoin(war, container.UnitJoin); }
        else if (container.UnitLaunchFlare)     { return reviseUnitLaunchFlare(war, container.UnitLaunchFlare); }
        else if (container.UnitLaunchSilo)      { return reviseUnitLaunchSilo(war, container.UnitLaunchSilo); }
        else if (container.UnitLoadCo)          { return reviseUnitLoadCo(war, container.UnitLoadCo); }
        else if (container.UnitProduceUnit)     { return reviseUnitProduceUnit(war, container.UnitProduceUnit); }
        else if (container.UnitSupply)          { return reviseUnitSupply(war, container.UnitSupply); }
        else if (container.UnitSurface)         { return reviseUnitSurface(war, container.UnitSurface); }
        else if (container.UnitUseCoSkill)      { return reviseUnitUseCoSkill(war, container.UnitUseCoSkill); }
        else if (container.UnitWait)            { return reviseUnitWait(war, container.UnitWait); }
        else                                    { return null; }
    }

    export function revisePlayerBeginTurn(war: BwWar, rawAction: Types.RawWarActionPlayerBeginTurn): WarAction {
        const turnManager   = war.getTurnManager();
        const currPhaseCode = turnManager.getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.WaitBeginTurn,
            `ScwActionReviser.revisePlayerBeginTurn() invalid turn phase code: ${currPhaseCode}`
        );

        const action: WarAction = {
            actionId                : war.getNextActionId(),
            WarActionPlayerBeginTurn: {},
        }

        // PhaseGetFund
        const playerIndexInTurn         = turnManager.getPlayerIndexInTurn();
        const turnIndex                 = turnManager.getTurnIndex();
        const tileMap                   = war.getTileMap();
        const unitMap                   = war.getUnitMap();
        const hasUnitOnBeginningTurn    = unitMap.checkHasUnit(playerIndexInTurn);
        let totalIncome                 = 0;
        if (playerIndexInTurn !== 0) {
            totalIncome += turnIndex === 0 ? war.getSettingsInitialFund() : 0;
            tileMap.forEachTile(tile => totalIncome += tile.getIncomeForPlayer(playerIndexInTurn));
        }

        // PhaseConsumeFuel
        const newFuelMap    = new Map<BwUnit, number>();
        const newHpMap      = new Map<BwUnit, number>();
        if (playerIndexInTurn !== 0) {
            const shouldConsumeFuel = turnIndex > 0;
            unitMap.forEachUnitOnMap(unit => {
                if (unit.getPlayerIndex() === playerIndexInTurn) {
                    newFuelMap.set(
                        unit,
                        shouldConsumeFuel ? Math.max(0, unit.getCurrentFuel() - unit.getFuelConsumptionPerTurn()) : unit.getCurrentFuel()
                    );
                    newHpMap.set(unit, unit.getCurrentHp());
                }
            });
            unitMap.forEachUnitLoaded(unit => {
                if (unit.getPlayerIndex() === playerIndexInTurn) {
                    newFuelMap.set(unit, unit.getCurrentFuel());
                    newHpMap.set(unit, unit.getCurrentHp());
                }
            });
        }

        // PhaseRepairUnitByTile
        const playerInTurn  = war.getPlayer(playerIndexInTurn);
        const suppliedUnits = new Set<BwUnit>();
        let newFund         = playerInTurn.getFund() + totalIncome;
        if (playerIndexInTurn !== 0) {
            const allUnitsOnMap: BwUnit[] = [];
            unitMap.forEachUnitOnMap(unit => {
                (unit.getPlayerIndex() === playerIndexInTurn) && (allUnitsOnMap.push(unit));
            });

            const repairDataByTile  : ProtoTypes.IWarUnitRepairData[] = [];
            for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
                const gridIndex     = unit.getGridIndex();
                const repairData    = tileMap.getTile(gridIndex).getRepairHpAndCostForUnit(unit, newFund);
                if (repairData) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex,
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : repairData.hp > 0 ? repairData.hp : undefined,
                        deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                    };
                    repairDataByTile.push(data);
                    suppliedUnits.add(unit);
                    newFund -= repairData.cost;
                    newFuelMap.set(unit, unit.getMaxFuel());
                    newHpMap.set(unit, unit.getCurrentHp() + (repairData.hp || 0));
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
                    (newFuelMap.get(unit) <= 0)                 &&
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
            const repairDataByUnit  : ProtoTypes.IWarUnitRepairData[] = [];
            const allUnitsLoaded    : BwUnit[] = [];
            unitMap.forEachUnitLoaded(unit => {
                if ((unit.getPlayerIndex() === playerIndexInTurn) && (!destroyedUnits.has(unit))) {
                    allUnitsLoaded.push(unit);
                }
            });

            for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
                const loader        = unit.getLoaderUnit();
                const repairData    = loader.getRepairHpAndCostForLoadedUnit(unit, newFund);
                if (repairData) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex               : unit.getGridIndex(),
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : repairData.hp > 0 ? repairData.hp : undefined,
                        deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                    };
                    repairDataByUnit.push(data);
                    suppliedUnits.add(unit);
                    newFund -= repairData.cost;
                    newFuelMap.set(unit, unit.getMaxFuel());

                } else if (loader.checkCanSupplyLoadedUnit()) {
                    const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                    const maxFlareAmmo      = unit.getFlareMaxAmmo();
                    const data              : ProtoTypes.IWarUnitRepairData = {
                        gridIndex               : unit.getGridIndex(),
                        unitId                  : unit.getUnitId(),
                        deltaHp                 : null,
                        deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                        deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                    };
                    repairDataByUnit.push(data);
                    suppliedUnits.add(unit);
                    newFuelMap.set(unit, unit.getMaxFuel());
                }
            }

            unitMap.forEachUnitOnMap(supplier => {
                if ((supplier.checkIsAdjacentUnitSupplier())            &&
                    (!destroyedUnits.has(supplier))                     &&
                    (supplier.getPlayerIndex() === playerIndexInTurn)
                ) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(supplier.getGridIndex(), mapSize)) {
                        const unit      = unitMap.getUnitOnMap(gridIndex);
                        const unitId    = unit ? unit.getUnitId() : null;
                        if ((unitId != null)                            &&
                            (!destroyedUnits.has(unit))                 &&
                            (!suppliedUnits.has(unit))                  &&
                            (supplier.checkCanSupplyAdjacentUnit(unit))
                        ) {
                            const maxPrimaryAmmo    = unit.getPrimaryWeaponMaxAmmo();
                            const maxFlareAmmo      = unit.getFlareMaxAmmo();
                            const data              : ProtoTypes.IWarUnitRepairData = {
                                gridIndex,
                                unitId,
                                deltaHp                 : null,
                                deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                                deltaPrimaryWeaponAmmo  : maxPrimaryAmmo ? maxPrimaryAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                                deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                            };
                            repairDataByUnit.push(data);
                            suppliedUnits.add(unit);
                            newFuelMap.set(unit, unit.getMaxFuel());
                        }
                    }
                }
            });

            if (repairDataByUnit.length > 0) {
                action.WarActionPlayerBeginTurn.repairDataByUnit = repairDataByUnit;
            }
        }

        // PhaseRecoverUnitByCo


        return null;
    }

    export function revisePlayerDeleteUnit(war: BwWar, rawAction: Types.RawWarActionPlayerDeleteUnit): WarAction {
        // TODO
        return null;
    }

    export function revisePlayerEndTurn(war: BwWar, rawAction: Types.RawWarActionPlayerEndTurn): WarAction { // DONE
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

    export function revisePlayerProduceUnit(war: BwWar, rawAction: Types.RawWarActionPlayerProduceUnit): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitAttack(war: BwWar, rawAction: Types.RawWarActionUnitAttack): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitBeLoaded(war: BwWar, rawAction: Types.RawWarActionUnitBeLoaded): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitBuildTile(war: BwWar, rawAction: Types.RawWarActionUnitBuildTile): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitCaptureTile(war: BwWar, rawAction: Types.RawWarActionUnitCaptureTile): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitDive(war: BwWar, rawAction: Types.RawWarActionUnitDive): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitDrop(war: BwWar, rawAction: Types.RawWarActionUnitDrop): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitJoin(war: BwWar, rawAction: Types.RawWarActionUnitJoin): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLaunchFlare(war: BwWar, rawAction: Types.RawWarActionUnitLaunchFlare): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLaunchSilo(war: BwWar, rawAction: Types.RawWarActionUnitLaunchSilo): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLoadCo(war: BwWar, rawAction: Types.RawWarActionUnitLoadCo): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitProduceUnit(war: BwWar, rawAction: Types.RawWarActionUnitProduceUnit): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitSupply(war: BwWar, rawAction: Types.RawWarActionUnitSupply): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitSurface(war: BwWar, rawAction: Types.RawWarActionUnitSurface): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitUseCoSkill(war: BwWar, rawAction: Types.RawWarActionUnitUseCoSkill): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitWait(war: BwWar, rawAction: Types.RawWarActionUnitWait): WarAction {
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
}
