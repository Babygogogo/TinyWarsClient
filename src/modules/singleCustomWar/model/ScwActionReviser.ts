
namespace TinyWars.SingleCustomWar.ScwActionReviser {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import Helpers                  = Utility.Helpers;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import DamageCalculator         = Utility.DamageCalculator;
    import ConfigManager            = Utility.ConfigManager;
    import BwWar                    = BaseWar.BwWar;
    import BwUnit                   = BaseWar.BwUnit;
    import BwTile                   = BaseWar.BwTile;
    import BwUnitMap                = BaseWar.BwUnitMap;
    import BwPlayer                 = BaseWar.BwPlayer;
    import TurnPhaseCode            = Types.TurnPhaseCode;
    import RawWarAction             = Types.RawWarActionContainer;
    import GridIndex                = Types.GridIndex;
    import UnitActionState          = Types.UnitActionState;
    import DropDestination          = Types.DropDestination;
    import UnitAttributes           = Types.UnitAttributes;
    import WarAction                = ProtoTypes.WarAction.IActionContainer;
    import Structure                = ProtoTypes.Structure;
    import IWarUseCoSkillExtraData  = Structure.IDataForUseCoSkill;
    import IGridIndex               = Structure.IGridIndex;
    import IDataForModifyUnit       = Structure.IDataForModifyUnit;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    type DamageMaps = {
        hpMap   : number[][];
        fundMap : number[][];
    }
    type ValueMaps = {
        hpMap       : number[][];
        fundMap     : number[][];
        sameTeamMap : boolean[][];
    }

    export function revise(war: ScwWar, container: RawWarAction): WarAction {
        if      (container.SystemBeginTurn)     { return revisePlayerBeginTurn(war, container); }
        else if (container.PlayerDeleteUnit)    { return revisePlayerDeleteUnit(war, container); }
        else if (container.PlayerEndTurn)       { return revisePlayerEndTurn(war, container); }
        else if (container.PlayerProduceUnit)   { return revisePlayerProduceUnit(war, container); }
        else if (container.UnitAttackUnit)      { return reviseUnitAttackUnit(war, container); }
        else if (container.UnitAttackTile)      { return reviseUnitAttackTile(war, container); }
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

    function revisePlayerBeginTurn(war: BwWar, container: RawWarAction): WarAction {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.WaitBeginTurn,
            `ScwActionReviser.revisePlayerBeginTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getExecutedActionsCount(),
            ActionPlayerBeginTurn   : {},
        }
    }

    function revisePlayerDeleteUnit(war: BwWar, container: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.revisePlayerDeleteUnit() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                    : war.getExecutedActionsCount(),
            ActionPlayerDeleteUnit   : {
                gridIndex: container.PlayerDeleteUnit.gridIndex,
            },
        }
    }

    function revisePlayerEndTurn(war: BwWar, container: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.revisePlayerEndTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getExecutedActionsCount(),
            ActionPlayerEndTurn  : {}
        };
    }

    function revisePlayerProduceUnit(war: BwWar, container: RawWarAction): WarAction {  // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.revisePlayerProduceUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = container.PlayerProduceUnit;
        const unitType      = action.unitType;
        const playerIndex   = war.getPlayerInTurn().getPlayerIndex();
        const gridIndex     = action.gridIndex;
        const unitHp        = action.unitHp;
        const skillCfg      = war.getTileMap().getTile(gridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const cfgCost       = Utility.ConfigManager.getUnitTemplateCfg(war.getConfigVersion(), unitType).productionCost;

        return {
            actionId                    : war.getExecutedActionsCount(),
            ActionPlayerProduceUnit  : {
                gridIndex,
                unitHp,
                unitType,
            },
        };
    }

    function reviseUnitAttackUnit(war: ScwWar, container: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitAttackUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action                        = container.UnitAttackUnit;
        const rawPath                       = action.path;
        const launchUnitId                  = action.launchUnitId;
        const targetGridIndex               = action.targetGridIndex;
        const revisedPath                   = getRevisedPath(war, rawPath, launchUnitId);
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitAttackUnit : {
                path    : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitAttackTile(war: ScwWar, container: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitAttackTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action                        = container.UnitAttackTile;
        const rawPath                       = action.path;
        const launchUnitId                  = action.launchUnitId;
        const targetGridIndex               = action.targetGridIndex;
        const revisedPath                   = getRevisedPath(war, rawPath, launchUnitId);
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitAttackTile : {
                path    : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitBeLoaded(war: BwWar, rawAction: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitBeLoaded() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitBeLoaded;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitBeLoaded   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitBuildTile(war: BwWar, rawAction: RawWarAction): WarAction {  // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitBuildTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitBuildTile;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitBuildTile  : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitCaptureTile(war: BwWar, rawAction: RawWarAction): WarAction {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitCaptureTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitCaptureTile;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitCaptureTile: {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitDive(war: BwWar, rawAction: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitDive() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitDive;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitDive   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitDrop(war: BwWar, rawAction: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitDrop() invalid turn phase code: ${currPhaseCode}`
        );

        const action                    = rawAction.UnitDrop;
        const launchUnitId              = action.launchUnitId;
        const revisedPath               = getRevisedPath(war, action.path, launchUnitId);
        const revisedDropDestinations   = getRevisedDropDestinations(war, action, revisedPath);
        const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < action.dropDestinations!.length);
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitDropUnit  : {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                dropDestinations: revisedDropDestinations,
                isDropBlocked,
            },
        };
    }

    function reviseUnitJoin(war: BwWar, rawAction: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitJoin() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitJoin;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitJoinUnit  : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitLaunchFlare(war: BwWar, rawAction: RawWarAction): WarAction {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitLaunchFlare() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLaunchFlare;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitLaunchFlare: {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                targetGridIndex : action.targetGridIndex,
            },
        };
    }

    function reviseUnitLaunchSilo(war: BwWar, rawAction: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitLaunchSilo() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLaunchSilo;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitLaunchSilo : {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                targetGridIndex : action.targetGridIndex,
            },
        };
    }

    function reviseUnitLoadCo(war: BwWar, rawAction: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitLoadCo() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLoadCo;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitLoadCo : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitProduceUnit(war: BwWar, rawAction: RawWarAction): WarAction {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitProduceUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitProduceUnit;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                    : war.getExecutedActionsCount(),
            ActionUnitProduceUnit    : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitSupply(war: BwWar, rawAction: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitSupply() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitSupply;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitSupplyUnit    : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitSurface(war: BwWar, rawAction: RawWarAction): WarAction {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitSurface() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitSurface;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitSurface: {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitUseCoSkill(war: ScwWar, rawAction: RawWarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitUseCoSkill() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitUseCoSkill;
        const launchUnitId  = action.launchUnitId;
        const skillType     = action.skillType;
        const revisedPath   = getRevisedPath(war, action.path, launchUnitId);
        const extraDataList = revisedPath.isBlocked
            ? null
            : getUseCoSkillExtraDataList(war, war.getPlayerInTurn(), skillType, revisedPath, launchUnitId);

        return {
            actionId                : war.getExecutedActionsCount(),
            ActionUnitUseCoSkill    : {
                path        : revisedPath,
                launchUnitId,
                skillType,
                extraData   : {
                    skillDataList: extraDataList
                },
            },
        };
    }

    function reviseUnitWait(war: BwWar, rawAction: RawWarAction): WarAction {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseUnitWait() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitWait;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionsCount(),
            ActionUnitWait      : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function sorterForRepairUnits(unit1: BwUnit, unit2: BwUnit): number {
        const cost1 = unit1.getProductionFinalCost();
        const cost2 = unit2.getProductionFinalCost();
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return unit1.getUnitId() - unit2.getUnitId();
        }
    }

    function updateAttributesByRepairData(attributes: UnitAttributes, repairData: IDataForModifyUnit): void {
        attributes.hp   += (repairData.deltaHp || 0);
        attributes.fuel += (repairData.deltaFuel || 0);
        (attributes.primaryAmmo != null) && (attributes.primaryAmmo += (repairData.deltaPrimaryWeaponAmmo || 0));
        (attributes.flareAmmo != null) && (attributes.flareAmmo += (repairData.deltaFlareAmmo || 0));
    }

    function convertGridIndex(raw: IGridIndex | undefined | null): GridIndex | undefined {
        return ((!raw) || (raw.x == null) || (raw.y == null))
            ? undefined
            : raw as GridIndex;
    }

    function getRevisedPath(war: BwWar, rawPath: IGridIndex[] | undefined | null, launchUnitId: number | null | undefined): Types.MovePath | undefined {
        const beginningGridIndex = convertGridIndex(rawPath ? rawPath[0] : undefined);
        if ((!rawPath) || (!beginningGridIndex)) {
            return undefined;
        } else {
            const unitMap           = war.getUnitMap();
            const playerInTurn      = war.getPlayerManager().getPlayerInTurn();
            const playerIndexInTurn = playerInTurn.getPlayerIndex();
            const isLaunch          = launchUnitId != null;
            const focusUnit         = isLaunch ? unitMap.getUnitLoadedById(launchUnitId!) : unitMap.getUnitOnMap(beginningGridIndex);
            if ((!focusUnit)                                                                                    ||
                (focusUnit.getPlayerIndex() !== playerIndexInTurn)                                              ||
                (focusUnit.getActionState() !== UnitActionState.Idle)                                                 ||
                (war.getTurnManager().getPhaseCode() !== TurnPhaseCode.Main)                                    ||
                ((isLaunch) && (!GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), beginningGridIndex)))
            ) {
                return undefined;
            } else {
                const teamIndexInTurn           = playerInTurn.getTeamIndex();
                const tileMap                   = war.getTileMap();
                const revisedNodes              = [GridIndexHelpers.clone(beginningGridIndex)];
                const maxFuelConsumption        = Math.min(focusUnit.getCurrentFuel(), focusUnit.getFinalMoveRange());
                const mapSize                   = tileMap.getMapSize();
                let revisedTotalFuelConsumption = 0;
                let rawTotalFuelConsumption     = 0;
                let isBlocked                   = false;
                for (let i = 1; i < rawPath.length; ++i) {
                    const gridIndex = convertGridIndex(rawPath[i]);
                    if ((!gridIndex)                                                                ||
                        (!GridIndexHelpers.checkIsAdjacent(gridIndex, rawPath[i - 1] as GridIndex)) ||
                        (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                    ||
                        (revisedNodes.some(g => GridIndexHelpers.checkIsEqual(g, gridIndex)))
                    ) {
                        return undefined;
                    } else {
                        const fuelConsumption = tileMap.getTile(gridIndex).getMoveCostByUnit(focusUnit);
                        if (fuelConsumption == null) {
                            return undefined;
                        }
                        rawTotalFuelConsumption += fuelConsumption;
                        if (rawTotalFuelConsumption > maxFuelConsumption) {
                            return undefined;
                        }

                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
                            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                                war,
                                gridIndex,
                                unitType            : existingUnit.getType(),
                                isDiving            : existingUnit.getIsDiving(),
                                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                                observerTeamIndex   : teamIndexInTurn,
                            })) {
                                return undefined;
                            } else {
                                isBlocked = true;
                            }
                        }

                        if (!isBlocked) {
                            revisedTotalFuelConsumption = rawTotalFuelConsumption;
                            revisedNodes.push(GridIndexHelpers.clone(gridIndex));
                        }
                    }
                }

                return {
                    nodes           : revisedNodes,
                    isBlocked       : isBlocked,
                    fuelConsumption : revisedTotalFuelConsumption,
                };
            }
        }
    }

    function getLostPlayerIndex(war: BwWar, attacker: BwUnit, target: BwUnit | BwTile, attackDamage: number, counterDamage: number | undefined): number | undefined {
        if (attackDamage >= target.getCurrentHp()!) {
            const playerIndex = target.getPlayerIndex();
            if ((target instanceof BwTile) || (playerIndex === 0)) {
                return undefined;
            } else {
                return (war.getUnitMap().countUnitsOnMapForPlayer(playerIndex) === 1) ? playerIndex : undefined;
            }
        } else {
            if ((counterDamage != null) && (counterDamage >= attacker.getCurrentHp())) {
                const playerIndex = attacker.getPlayerIndex();
                return (war.getUnitMap().countUnitsOnMapForPlayer(playerIndex) === 1) ? playerIndex : undefined;
            } else {
                return undefined;
            }
        }
    }

    function getRevisedDropDestinations(war: BwWar, action: ProtoTypes.NetMessage.MsgMpwActionUnitDropUnit.IC, revisedPath: Types.MovePath): DropDestination[] {
        const destinations: DropDestination[] = [];
        if (!revisedPath.isBlocked) {
            const unitMap       = war.getUnitMap();
            const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.launchUnitId);
            for (const raw of action.dropDestinations as DropDestination[]) {
                const existingUnit = unitMap.getUnitOnMap(raw.gridIndex);
                if ((existingUnit) && (existingUnit !== loaderUnit)) {
                    break;
                } else {
                    destinations.push(raw);
                }
            }
        }
        return destinations;
    }

    function getUseCoSkillExtraDataList(
        war             : ScwWar,
        player          : BwPlayer,
        skillType       : Types.CoSkillType,
        movePath        : Types.MovePath,
        launchUnitId    : number | null | undefined
    ): IWarUseCoSkillExtraData[] {
        const configVersion = war.getConfigVersion();
        const skillCfgs     : ProtoTypes.Config.ICoSkillCfg[] = [];

        let needValueMaps   = false;
        for (const skillId of player.getCoSkills(skillType) || []) {
            const skillCfg  = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!;
            skillCfgs.push(skillCfg);
            if (skillCfg.indiscriminateAreaDamage) {
                needValueMaps = true;
            }
        }

        const valueMaps = needValueMaps ? getValueMap(war.getUnitMap(), player.getTeamIndex(), movePath, launchUnitId) : null;
        const mapSize   = war.getUnitMap().getMapSize();
        const dataList  : IWarUseCoSkillExtraData[] = [];
        for (const skillCfg of skillCfgs) {
            const data: IWarUseCoSkillExtraData = {};

            if (skillCfg.indiscriminateAreaDamage) {
                const cfg       = skillCfg.indiscriminateAreaDamage;
                const center    = getIndiscriminateAreaDamageCenter(war, valueMaps!, cfg);
                if (!center) {
                    Logger.error("BwHelpers.getUseCoSkillExtraDataList() failed to get the indiscriminateAreaDamage center!!");
                } else {
                    const hpDamage = cfg[2];
                    for (const g of GridIndexHelpers.getGridsWithinDistance(center, 0, cfg[1], mapSize)) {
                        valueMaps!.hpMap[g.x][g.y] = Math.max(1, valueMaps!.hpMap[g.x][g.y] - hpDamage);
                    }
                }
                data.indiscriminateAreaDamageCenter = center;
            }

            dataList.push(data);
        }

        return dataList;
    }

    function getIndiscriminateAreaDamageCenter(war: ScwWar, valueMaps: ValueMaps, indiscriminateCfg: number[]): GridIndex | null {
        const targetType    = indiscriminateCfg[0];
        const radius        = indiscriminateCfg[1];
        const hpDamage      = indiscriminateCfg[2];
        if (targetType === 1) { // HP
            return getIndiscriminateAreaDamageCenterForType1(valueMaps, radius, hpDamage);

        } else if (targetType === 2) {  // fund
            return getIndiscriminateAreaDamageCenterForType2(valueMaps, radius, hpDamage);

        } else if (targetType === 3) {  // random: HP or fund
            return war.getRandomNumber() < 0.5
                ? getIndiscriminateAreaDamageCenterForType1(valueMaps, radius, hpDamage)
                : getIndiscriminateAreaDamageCenterForType2(valueMaps, radius, hpDamage);

        } else {
            return null;
        }
    }

    function getIndiscriminateAreaDamageCenterForType1(valueMaps: ValueMaps, radius: number, hpDamage: number): GridIndex {
        const damageMap = getDamageMap(valueMaps, hpDamage);
        const centers   = getCentersOfHighestDamage(damageMap.hpMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return getCentersOfHighestDamageForCandidates(damageMap.fundMap, radius, centers);
        }
    }

    function getIndiscriminateAreaDamageCenterForType2(valueMaps: ValueMaps, radius: number, hpDamage: number): GridIndex {
        const damageMap = getDamageMap(valueMaps, hpDamage);
        const centers   = getCentersOfHighestDamage(damageMap.fundMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return getCentersOfHighestDamageForCandidates(damageMap.hpMap, radius, centers);
        }
    }

    function getValueMap(unitMap: BwUnitMap, teamIndex: number, movePath: Types.MovePath, launchUnitId: number | null | undefined): ValueMaps {
        const { width, height }                 = unitMap.getMapSize();
        const pathNodes                         = movePath.nodes;
        const pathLength                        = pathNodes.length;
        const beginningGridIndex                = pathNodes[0];
        const unitOnBeginningGrid               = (pathLength > 1) && (launchUnitId == null) ? null : unitMap.getUnitOnMap(beginningGridIndex);
        const unitOnEndingGrid                  = unitMap.getUnit(beginningGridIndex, launchUnitId)!;
        const { x: beginningX, y: beginningY }  = beginningGridIndex;
        const { x: endingX, y: endingY }        = pathNodes[pathLength - 1];

        const hpMap         = Helpers.createEmptyMap(width, height, 0);
        const fundMap       = Helpers.createEmptyMap(width, height, 0);
        const sameTeamMap   = Helpers.createEmptyMap(width, height, false);

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                if ((x === beginningX) && (y === beginningY)) {
                    if (unitOnBeginningGrid) {
                        hpMap[x][y]         = unitOnBeginningGrid.getNormalizedCurrentHp();
                        fundMap[x][y]       = unitOnBeginningGrid.getProductionFinalCost();
                        sameTeamMap[x][y]   = unitOnBeginningGrid.getTeamIndex() === teamIndex;
                    }

                } else if ((x === endingX) && (y === endingY)) {
                    hpMap[x][y]         = unitOnEndingGrid.getNormalizedCurrentHp();
                    fundMap[x][y]       = unitOnEndingGrid.getProductionFinalCost();
                    sameTeamMap[x][y]   = unitOnEndingGrid.getTeamIndex() === teamIndex;

                } else {
                    const unit = unitMap.getUnitOnMap({ x, y });
                    if (unit) {
                        hpMap[x][y]         = unit.getNormalizedCurrentHp();
                        fundMap[x][y]       = unit.getProductionFinalCost();
                        sameTeamMap[x][y]   = unit.getTeamIndex() === teamIndex;
                    }
                }
            }
        }

        return { hpMap, fundMap, sameTeamMap };
    }

    function getDamageMap(valueMaps: ValueMaps, hpDamage: number): DamageMaps {
        const srcHpMap          = valueMaps.hpMap;
        const srcFundMap        = valueMaps.fundMap;
        const srcSameTeamMap    = valueMaps.sameTeamMap;
        const width             = srcHpMap.length;
        const height            = srcHpMap[0].length;

        const hpMap     = Helpers.createEmptyMap(width, height, 0);
        const fundMap   = Helpers.createEmptyMap(width, height, 0);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                if (srcHpMap[x][y] > 0) {
                    const realHpDamage      = Math.min(hpDamage, srcHpMap[x][y] - 1);
                    const realFundDamage    = Math.floor(srcFundMap[x][y] * realHpDamage / CommonConstants.UnitHpNormalizer);
                    const isSameTeam        = srcSameTeamMap[x][y];
                    hpMap[x][y]             = isSameTeam ? -realHpDamage * 2 : realHpDamage;
                    fundMap[x][y]           = isSameTeam ? -realFundDamage * 2 : realFundDamage;
                }
            }
        }
        return { hpMap, fundMap };
    }

    function getCentersOfHighestDamage(map: number[][], radius: number): GridIndex[] {
        const centers   : GridIndex[] = [];
        const width     = map.length;
        const height    = map[0].length;
        const mapSize   = { width, height };
        const sumMap    = Helpers.createEmptyMap(width, height, 0);

        let maxDamage: number | null = null;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const center        = { x, y };
                let totalDamage     = 0;
                for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(center, 0, radius, mapSize)) {
                    totalDamage += map[gridIndex.x][gridIndex.y];
                }
                sumMap[x][y] = totalDamage;

                if ((maxDamage == null) || (totalDamage > maxDamage)) {
                    maxDamage = totalDamage;
                    centers.length = 0;
                    centers.push(center);
                } else if (maxDamage === totalDamage) {
                    centers.push(center);
                }
            }
        }

        return centers;
    }

    function getCentersOfHighestDamageForCandidates(map: number[][], radius: number, candidates: GridIndex[]): GridIndex {
        const mapSize   = { width: map.length, height: map[0].length };
        const centers   : GridIndex[] = [];
        let maxDamage   : number | null = null;

        for (const candidate of candidates) {
            let totalDamage = 0;
            for (const g of GridIndexHelpers.getGridsWithinDistance(candidate, 0, radius, mapSize)) {
                totalDamage += map[g.x][g.y];
            }
            if ((maxDamage == null) || (totalDamage > maxDamage)) {
                maxDamage       = totalDamage;
                centers.length  = 0;
                centers.push(candidate);
            } else if (totalDamage === maxDamage) {
                centers.push(candidate);
            }
        }

        return centers[0];
    }
}
