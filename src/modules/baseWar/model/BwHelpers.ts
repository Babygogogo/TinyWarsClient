
import { BwWar }                from "./BwWar";
import { BwTile }               from "./BwTile";
import { BwUnit }               from "./BwUnit";
import { BwPlayer }             from "./BwPlayer";
import { BwTileMap }            from "./BwTileMap";
import { BwUnitMap }            from "./BwUnitMap";
import { ClientErrorCode }      from "../../../utility/ClientErrorCode";
import * as BwWarRuleHelper     from "./BwWarRuleHelper";
import { Types }                from "../../../utility/Types";
import * as GridIndexHelpers    from "../../../utility/GridIndexHelpers";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import { Logger }               from "../../../utility/Logger";
import * as Helpers             from "../../../utility/Helpers";
import * as ConfigManager       from "../../../utility/ConfigManager";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as VisibilityHelpers   from "../../../utility/VisibilityHelpers";
import GridIndex                = Types.GridIndex;
import MovableArea              = Types.MovableArea;
import AttackableArea           = Types.AttackableArea;
import MapSize                  = Types.MapSize;
import MovePathNode             = Types.MovePathNode;
import UnitType                 = Types.UnitType;
import TileType                 = Types.TileType;
import WarType                  = Types.WarType;
import Visibility               = Types.Visibility;
import CoSkillAreaType          = Types.CoSkillAreaType;
import ISerialUnit              = WarSerialization.ISerialUnit;
import ISerialTile              = WarSerialization.ISerialTile;
import ISerialWar               = WarSerialization.ISerialWar;
import WarSerialization         = ProtoTypes.WarSerialization;
import IRuleForPlayers          = ProtoTypes.WarRule.IRuleForPlayers;

type AvailableMovableGrid = {
    currGridIndex   : GridIndex;
    prevGridIndex   : GridIndex | undefined;
    totalMoveCost   : number;
};

export function createMovableArea({ origin, maxMoveCost, mapSize, moveCostGetter }: {
    origin          : GridIndex;
    maxMoveCost     : number;
    mapSize         : MapSize;
    moveCostGetter  : (g: GridIndex) => number | undefined | null;
}): MovableArea {
    const area              = [] as MovableArea;
    const availableGrids    = [] as AvailableMovableGrid[];
    _updateAvailableGrids({ grids: availableGrids, index: 0, gridIndex: origin, prev: undefined, totalMoveCost: 0 });

    let index = 0;
    while (index < availableGrids.length) {
        const availableGrid                     = _sortAvailableMovableGrids(availableGrids, index);
        const { currGridIndex, totalMoveCost }  = availableGrid;
        if (_checkAndUpdateMovableArea({ area, gridIndex: currGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
            for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currGridIndex, mapSize)) {
                const nextMoveCost = moveCostGetter(nextGridIndex);
                if ((nextMoveCost != null) && (nextMoveCost + totalMoveCost <= maxMoveCost)) {
                    _updateAvailableGrids({ grids: availableGrids, index: index + 1, gridIndex: nextGridIndex, prev: currGridIndex, totalMoveCost: nextMoveCost + totalMoveCost });
                }
            }
        }

        ++index;
    }

    return area;
}

export function createAttackableArea({ movableArea, mapSize, minAttackRange, maxAttackRange, checkCanAttack }: {
    movableArea     : MovableArea;
    mapSize         : MapSize;
    minAttackRange  : number;
    maxAttackRange  : number;
    checkCanAttack  : (destination: GridIndex, target: GridIndex) => boolean;
}): AttackableArea {
    const area = [] as AttackableArea;
    const { width, height } = mapSize;
    for (let moveX = 0; moveX < width; ++moveX) {
        if (movableArea[moveX]) {
            for (let moveY = 0; moveY < height; ++moveY) {
                const movableGrid = movableArea[moveX][moveY];
                if (movableGrid) {
                    const moveGridIndex = { x: moveX, y: moveY };
                    for (const attackGridIndex of GridIndexHelpers.getGridsWithinDistance(moveGridIndex, minAttackRange, maxAttackRange, mapSize)) {
                        const { x: attackX, y: attackY } = attackGridIndex;
                        if (checkCanAttack(moveGridIndex, attackGridIndex)) {
                            area[attackX] = area[attackX] || [];
                            const attackableGrid = area[attackX][attackY];
                            if ((!attackableGrid)                                                                                                               ||
                                (movableGrid.totalMoveCost < movableArea[attackableGrid.movePathDestination.x][attackableGrid.movePathDestination.y].totalMoveCost)
                            ) {
                                area[attackX][attackY] = {
                                    movePathDestination: { x: moveX, y: moveY },
                                };
                            }
                        }
                    }
                }
            }
        }
    }
    return area;
}

export function createShortestMovePath(area: MovableArea, destination: GridIndex): MovePathNode[] {
    const reversedPath  : MovePathNode[] = [];
    let gridIndex       : GridIndex | undefined = destination;
    let movableNode     = area[gridIndex.x][gridIndex.y];

    for (;;) {
        reversedPath.push({
            x               : gridIndex.x,
            y               : gridIndex.y,
            totalMoveCost   : movableNode.totalMoveCost,
        });

        gridIndex = movableNode.prevGridIndex;
        if (!gridIndex) {
            return reversedPath.reverse();
        }
        movableNode = area[gridIndex.x][gridIndex.y];
    }
}

export function getRevisedPath({ war, rawPath, launchUnitId }: {
    war             : BwWar;
    rawPath         : ProtoTypes.Structure.IMovePath | undefined | null;
    launchUnitId    : number | null | undefined;
}): { errorCode: ClientErrorCode, revisedPath?: Types.MovePath} {
    if (rawPath == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_00 };
    }
    const rawPathNodes = rawPath.nodes;
    if ((rawPathNodes == null) || (!rawPathNodes.length)) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_01 };
    }

    const beginningGridIndex = GridIndexHelpers.convertGridIndex(rawPathNodes[0]);
    if (beginningGridIndex == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_02 };
    }

    const playerInTurn  = war.getPlayerInTurn();
    if (playerInTurn == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_03 };
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
    if ((!focusUnit)                                                    ||
        (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
        (focusUnit.getActionState() !== Types.UnitActionState.Idle)     ||
        (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main)
    ) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_04 };
    }

    if (launchUnitId != null) {
        const gridIndex = focusUnit.getGridIndex();
        if (gridIndex == null) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_05 };
        }

        if (!GridIndexHelpers.checkIsEqual(gridIndex, beginningGridIndex)) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_06 };
        }
    }

    const tileMap = war.getTileMap();
    const mapSize = tileMap.getMapSize();
    if (mapSize == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_07 };
    }

    const teamIndexInTurn = playerInTurn.getTeamIndex();
    if (teamIndexInTurn == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_08 };
    }

    const maxFuelConsumption = focusUnit.getFinalMoveRange();
    if (maxFuelConsumption == null) {
        return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_09 };
    }

    const revisedNodes              = [GridIndexHelpers.clone(beginningGridIndex)];
    let revisedTotalFuelConsumption = 0;
    let rawTotalFuelConsumption     = 0;
    let isBlocked                   = false;
    for (let i = 1; i < rawPathNodes.length; ++i) {
        const gridIndex = GridIndexHelpers.convertGridIndex(rawPathNodes[i]);
        if ((!gridIndex)                                                                        ||
            (!GridIndexHelpers.checkIsAdjacent(gridIndex, rawPathNodes[i - 1] as GridIndex))    ||
            (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                            ||
            (revisedNodes.some(g => GridIndexHelpers.checkIsEqual(g, gridIndex)))
        ) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_10 };
        }

        const tile = tileMap.getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_11 };
        }

        const fuelConsumption = tile.getMoveCostByUnit(focusUnit);
        if (fuelConsumption == null) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_12 };
        }

        rawTotalFuelConsumption += fuelConsumption;
        if (rawTotalFuelConsumption > maxFuelConsumption) {
            return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_13 };
        }

        const existingUnit = unitMap.getUnitOnMap(gridIndex);
        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
            const unitType = existingUnit.getUnitType();
            if (unitType == null) {
                return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_14 };
            }

            const isDiving = existingUnit.getIsDiving();
            if (isDiving == null) {
                return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_15 };
            }

            const unitPlayerIndex = existingUnit.getPlayerIndex();
            if (unitPlayerIndex == null) {
                return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_16 };
            }

            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                war,
                gridIndex,
                unitType,
                isDiving,
                unitPlayerIndex,
                observerTeamIndex   : teamIndexInTurn,
            })) {
                return { errorCode: ClientErrorCode.BwHelpers_GetRevisedPath_17 };
            } else {
                isBlocked = true;
            }
        }

        if (!isBlocked) {
            revisedTotalFuelConsumption = rawTotalFuelConsumption;
            revisedNodes.push(GridIndexHelpers.clone(gridIndex));
        }
    }

    return {
        errorCode   : ClientErrorCode.NoError,
        revisedPath : {
            nodes           : revisedNodes,
            isBlocked       : isBlocked,
            fuelConsumption : revisedTotalFuelConsumption,
        },
    };
}

export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: BwWar, rawPath: GridIndex[]): boolean | undefined {
    if (rawPath.length == 1) {
        return false;
    } else {
        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty unitMap.`);
            return undefined;
        }

        const destination   = rawPath[rawPath.length - 1];
        const unit          = unitMap.getUnitOnMap(destination);
        if (unit == null) {
            return false;
        } else {
            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty unitType.`);
                return undefined;
            }

            const isDiving = unit.getIsDiving();
            if (isDiving == null) {
                Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty isDiving.`);
                return undefined;
            }

            const unitPlayerIndex = unit.getPlayerIndex();
            if (unitPlayerIndex == null) {
                Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty unitPlayerIndex.`);
                return undefined;
            }

            const focusUnit = unitMap.getUnitOnMap(rawPath[0]);
            if (focusUnit == null) {
                Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty focusUnit.`);
                return undefined;
            }

            const observerTeamIndex = focusUnit.getTeamIndex();
            if (observerTeamIndex == null) {
                Logger.error(`BwHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit() empty observerTeamIndex.`);
                return undefined;
            }

            return VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                war,
                gridIndex           : destination,
                unitType,
                isDiving,
                unitPlayerIndex,
                observerTeamIndex,
            });
        }
    }
}

export function createDistanceMap(tileMap: BwTileMap, unit: BwUnit, destination: GridIndex): { distanceMap: (number | null)[][], maxDistance: number } {
    const area          : MovableArea = [];
    const availableGrids: AvailableMovableGrid[] = [];
    _updateAvailableGrids({ grids: availableGrids, index: 0, gridIndex: destination, prev: undefined, totalMoveCost: 0 });

    const mapSize   = tileMap.getMapSize();
    let index       = 0;
    while (index < availableGrids.length) {
        const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
        const currentGridIndex  = availableGrid.currGridIndex;
        const totalMoveCost     = availableGrid.totalMoveCost;
        if (_checkAndUpdateMovableArea({ area, gridIndex: currentGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
            const nextMoveCost = tileMap.getTile(currentGridIndex).getMoveCostByUnit(unit);
            if (nextMoveCost != null) {
                for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                    _updateAvailableGrids({ grids: availableGrids, index, gridIndex: nextGridIndex, prev: currentGridIndex, totalMoveCost: totalMoveCost + nextMoveCost });
                }
            }
        }

        ++index;
    }

    const distanceMap   = Helpers.createEmptyMap<number>(mapSize.width);
    let maxDistance     = 0;
    for (let x = 0; x < mapSize.width; ++x) {
        if (area[x]) {
            for (let y = 0; y < mapSize.height; ++y) {
                if (area[x][y]) {
                    distanceMap[x][y]   = area[x][y].totalMoveCost;
                    maxDistance         = Math.max(maxDistance, distanceMap[x][y]);
                }
            }
        }
    }
    return { distanceMap, maxDistance};
}

export function findNearestCapturableTile(tileMap: BwTileMap, unitMap: BwUnitMap, unit: BwUnit): BwTile | null {
    const area          : MovableArea = [];
    const availableGrids: AvailableMovableGrid[] = [];
    _updateAvailableGrids({ grids: availableGrids, index: 0, gridIndex: unit.getGridIndex(), prev: undefined, totalMoveCost: 0 });

    const teamIndex = unit.getTeamIndex();
    const mapSize   = tileMap.getMapSize();
    let index   = 0;
    while (index < availableGrids.length) {
        const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
        const currentGridIndex  = availableGrid.currGridIndex;
        const totalMoveCost     = availableGrid.totalMoveCost;
        const tile              = tileMap.getTile(currentGridIndex);
        // const existingUnit      = unitMap.getUnitOnMap(currentGridIndex);

        if ((tile.getMaxCapturePoint())                                                                 &&
            (tile.getTeamIndex() !== teamIndex)    //                                                     &&
            // ((!existingUnit) || (existingUnit === unit) || (existingUnit.getTeamIndex() !== teamIndex))
        ) {
            return tile;
        } else {
            if (_checkAndUpdateMovableArea({ area, gridIndex: currentGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
                for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                    const nextMoveCost = tileMap.getTile(nextGridIndex).getMoveCostByUnit(unit);
                    if (nextMoveCost != null) {
                        _updateAvailableGrids({ grids: availableGrids, index, gridIndex: nextGridIndex, prev: currentGridIndex, totalMoveCost: totalMoveCost + nextMoveCost });
                    }
                }
            }
        }

        ++index;
    }

    return null;
}

function _updateAvailableGrids({ grids, index, gridIndex, prev, totalMoveCost }: {
    grids           : AvailableMovableGrid[];
    index           : number;
    gridIndex       : GridIndex;
    prev            : GridIndex | undefined;
    totalMoveCost   : number;
}): void {
    const newNode: AvailableMovableGrid = {
        currGridIndex: gridIndex,
        prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
        totalMoveCost,
    };

    for (let i = index; i < grids.length; ++i) {
        if (GridIndexHelpers.checkIsEqual(grids[i].currGridIndex, gridIndex)) {
            if (grids[i].totalMoveCost > totalMoveCost) {
                grids[i] = newNode;
            }
            return;
        }
    }

    grids.push(newNode);
}
function _checkAndUpdateMovableArea({ area, gridIndex, prev, totalMoveCost }: {
    area            : MovableArea;
    gridIndex       : GridIndex;
    prev            : GridIndex | undefined;
    totalMoveCost   : number;
}): boolean {
    const { x, y } = gridIndex;
    area[x] = area[x] || [];

    if ((area[x][y]) && (area[x][y].totalMoveCost <= totalMoveCost)) {
        return false;
    } else {
        area[x][y] = {
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
            totalMoveCost,
        };
        return true;
    }
}
function _sortAvailableMovableGrids(list: AvailableMovableGrid[], startingIndex: number): AvailableMovableGrid {
    let indexForMinMoveCost = startingIndex;
    let minMoveCost         = list[indexForMinMoveCost].totalMoveCost;
    for (let i = startingIndex + 1; i < list.length; ++i) {
        if (list[i].totalMoveCost < minMoveCost) {
            indexForMinMoveCost = i;
            minMoveCost         = list[i].totalMoveCost;
        }
    }

    if (indexForMinMoveCost !== startingIndex) {
        [list[indexForMinMoveCost], list[startingIndex]] = [list[startingIndex], list[indexForMinMoveCost]];
    }
    return list[startingIndex];
}

export function checkAreaHasGrid(area: AttackableArea | MovableArea, gridIndex: GridIndex): boolean {
    const { x, y } = gridIndex;
    return (!!area[x]) && (!!area[x][y]);
}
export function checkIsGridIndexInsideCoSkillArea(
    gridIndex               : GridIndex,
    coSkillAreaType         : CoSkillAreaType,
    coGridIndexListOnMap    : GridIndex[],
    coZoneRadius            : number,
): boolean | undefined {
    if (coSkillAreaType === CoSkillAreaType.Halo) {
        return true;
    } else if (coSkillAreaType === CoSkillAreaType.OnMap) {
        return coGridIndexListOnMap.length > 0;
    } else if (coSkillAreaType === CoSkillAreaType.Zone) {
        const distance = GridIndexHelpers.getMinDistance(gridIndex, coGridIndexListOnMap);
        return (distance != null) && (distance <= coZoneRadius);
    } else {
        Logger.error(`BwHelpers.checkIsGridIndexInsideSkillArea() invalid areaType: ${coSkillAreaType}`);
        return undefined;
    }
}

export function getNormalizedHp(hp: number): number {
    return Math.ceil(hp / CommonConstants.UnitHpNormalizer);
}

export function getMapSize(data: WarSerialization.ISerialTileMap | null | undefined): Types.MapSize {
    let width   = 0;
    let height  = 0;

    for (const tile of data ? data.tiles || [] : []) {
        const gridIndex = tile.gridIndex;
        width           = Math.max(width, (gridIndex ? gridIndex.x || 0 : 0) + 1);
        height          = Math.max(height, (gridIndex ? gridIndex.y || 0 : 0) + 1);
    }

    return { width, height };
}
export function checkIsValidMapSize(mapSize: Types.MapSize): boolean {
    const mapWidth  = mapSize.width;
    const mapHeight = mapSize.height;
    return (mapWidth > 0)
        && (mapHeight > 0)
        && (mapWidth * mapHeight <= CommonConstants.MapMaxGridsCount);
}

export function checkIsUnitIdCompact(unitArray: WarSerialization.ISerialUnit[] | null | undefined): boolean {
    if ((unitArray == null) || (unitArray.length <= 0)) {
        return true;
    }

    const unitIdSet = new Set<number>();
    for (const unit of unitArray) {
        const unitId = unit.unitId;
        if ((unitId == null) || (unitId < 0) || (unitIdSet.has(unitId))) {
            return false;
        }
        unitIdSet.add(unitId);
    }

    if (!unitIdSet.has(0)) {
        return false;
    }
    for (const unitId of unitIdSet) {
        if ((unitId > 0) && (!unitIdSet.has(unitId - 1))) {
            return false;
        }
    }

    return true;
}

export function checkIsStateRequesting(state: Types.ActionPlannerState): boolean {
    return (state === Types.ActionPlannerState.RequestingPlayerActivateSkill)
        || (state === Types.ActionPlannerState.RequestingPlayerBeginTurn)
        || (state === Types.ActionPlannerState.RequestingPlayerDeleteUnit)
        || (state === Types.ActionPlannerState.RequestingPlayerEndTurn)
        || (state === Types.ActionPlannerState.RequestingPlayerSurrender)
        || (state === Types.ActionPlannerState.RequestingPlayerVoteForDraw)
        || (state === Types.ActionPlannerState.RequestingPlayerProduceUnit)
        || (state === Types.ActionPlannerState.RequestingUnitAttackUnit)
        || (state === Types.ActionPlannerState.RequestingUnitAttackTile)
        || (state === Types.ActionPlannerState.RequestingUnitBeLoaded)
        || (state === Types.ActionPlannerState.RequestingUnitBuildTile)
        || (state === Types.ActionPlannerState.RequestingUnitCaptureTile)
        || (state === Types.ActionPlannerState.RequestingUnitDive)
        || (state === Types.ActionPlannerState.RequestingUnitDrop)
        || (state === Types.ActionPlannerState.RequestingUnitJoin)
        || (state === Types.ActionPlannerState.RequestingUnitLaunchFlare)
        || (state === Types.ActionPlannerState.RequestingUnitLaunchSilo)
        || (state === Types.ActionPlannerState.RequestingUnitLoadCo)
        || (state === Types.ActionPlannerState.RequestingUnitProduceUnit)
        || (state === Types.ActionPlannerState.RequestingUnitSupply)
        || (state === Types.ActionPlannerState.RequestingUnitSurface)
        || (state === Types.ActionPlannerState.RequestingUnitUseCoPower)
        || (state === Types.ActionPlannerState.RequestingUnitUseCoSuperPower)
        || (state === Types.ActionPlannerState.RequestingUnitWait);
}

/**
 * The unit is dangling after moving!
 * You must call unitMap.addUnitOnMap() or unitMap.addUnitLoaded() after calling this function.
 */
export function moveUnit(
    params: {
        war             : BwWar;
        pathNodes       : GridIndex[];
        launchUnitId    : number | null | undefined;
        fuelConsumption : number;
    }
): void {
    const { war, pathNodes, launchUnitId, fuelConsumption } = params;
    const unitMap = war.getUnitMap();
    if (unitMap == null) {
        Logger.error(`BwHelpers.moveUnit() empty unitMap.`);
        return undefined;
    }

    const tileMap = war.getTileMap();
    if (tileMap == null) {
        Logger.error(`BwHelpers.getTileMap() empty tileMap.`);
        return undefined;
    }

    const fogMap = war.getFogMap();
    if (fogMap == null) {
        Logger.error(`BwHelpers.getFogMap() empty fogMap.`);
        return undefined;
    }

    const beginningGridIndex    = pathNodes[0];
    const focusUnit             = unitMap.getUnit(beginningGridIndex, launchUnitId);
    if (focusUnit == null) {
        Logger.error(`BwHelpers.moveUnit() empty focusUnit.`);
        return undefined;
    }

    const currentFuel = focusUnit.getCurrentFuel();
    if (currentFuel == null) {
        Logger.error(`BwHelpers.moveUnit() empty currentFuel.`);
        return undefined;
    }

    const tile = tileMap.getTile(beginningGridIndex);
    if (tile == null) {
        Logger.error(`BwHelpers.moveUnit() empty tile.`);
        return undefined;
    }

    fogMap.updateMapFromPathsByUnitAndPath(focusUnit, pathNodes);
    focusUnit.setCurrentFuel(currentFuel - fuelConsumption);
    if (launchUnitId == null) {
        unitMap.removeUnitOnMap(beginningGridIndex, false);
    } else {
        unitMap.removeUnitLoaded(launchUnitId);
    }

    if (pathNodes.length > 1) {
        const endingGridIndex = pathNodes[pathNodes.length - 1];
        focusUnit.setIsCapturingTile(false);
        focusUnit.setIsBuildingTile(false);
        focusUnit.setLoaderUnitId(undefined);
        focusUnit.setGridIndex(endingGridIndex);
        for (const unit of unitMap.getUnitsLoadedByLoader(focusUnit, true)) {
            unit.setGridIndex(endingGridIndex);
        }

        if (launchUnitId == null) {
            tile.updateOnUnitLeave();
        }
    }
}

export function updateTilesAndUnitsBeforeExecutingAction(
    war         : BwWar,
    extraData   : {
        actingTiles?    : ISerialTile[],
        actingUnits?    : ISerialUnit[],
        discoveredTiles?: ISerialTile[],
        discoveredUnits?: ISerialUnit[],
    } | undefined | null,
): void {
    if (extraData) {
        addUnitsBeforeExecutingAction(war, extraData.actingUnits, false);
        addUnitsBeforeExecutingAction(war, extraData.discoveredUnits, false);
        updateTilesBeforeExecutingAction(war, extraData.actingTiles);
        updateTilesBeforeExecutingAction(war, extraData.discoveredTiles);
    }
}
function addUnitsBeforeExecutingAction(
    war             : BwWar,
    unitsData       : ISerialUnit[] | undefined | null,
    isViewVisible   : boolean
): void {
    if ((unitsData) && (unitsData.length)) {
        const unitMap       = war.getUnitMap();
        const configVersion = war.getConfigVersion();
        for (const unitData of unitsData) {
            const unitId = unitData.unitId;
            if (unitId == null) {
                Logger.error(`BwHelpers.addUnitsBeforeExecutingAction() empty unitId.`);
                continue;
            }

            if (!unitMap.getUnitById(unitId)) {
                const unit = new BwUnit();
                unit.init(unitData, configVersion);

                const isOnMap = unit.getLoaderUnitId() == null;
                if (isOnMap) {
                    unitMap.setUnitOnMap(unit);
                } else {
                    unitMap.setUnitLoaded(unit);
                }
                unit.startRunning(war);
                unit.startRunningView();
                unit.setViewVisible(isViewVisible);
            }
        }
    }
}
function updateTilesBeforeExecutingAction(war: BwWar, tilesData: ISerialTile[] | undefined | null): void {
    if ((tilesData) && (tilesData.length)) {
        const tileMap   = war.getTileMap();
        for (const tileData of tilesData) {
            const gridIndex = GridIndexHelpers.convertGridIndex(tileData.gridIndex);
            if (gridIndex == null) {
                Logger.error(`BwHelpers.updateTilesBeforeExecutingAction() empty gridIndex.`);
                return undefined;
            }

            const tile          = tileMap.getTile(gridIndex);
            const configVersion = tile.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwHelpers.updateTilesBeforeExecutingAction() empty configVersion.`);
                return undefined;
            }

            if (tile.getHasFog()) {
                tile.setHasFog(false);
                tile.deserialize(tileData, configVersion);
            }
        }
    }
}

export function exeInstantSkill(
    war         : BwWar,
    player      : BwPlayer,
    gridIndex   : GridIndex,
    skillId     : number,
    extraData   : ProtoTypes.Structure.IDataForUseCoSkill
): ClientErrorCode {
    const configVersion = war.getConfigVersion();
    const skillCfg      = ConfigManager.getCoSkillCfg(configVersion, skillId);
    if (skillCfg == null) {
        return ClientErrorCode.BwHelpers_ExeInstantSkill_00;
    }

    const playerIndex   = player.getPlayerIndex();
    const unitMap       = war.getUnitMap();
    const zoneRadius    = player.getCoZoneRadius();
    if (zoneRadius == null) {
        return ClientErrorCode.BwHelpers_ExeInstantSkill_01;
    }

    if (skillCfg.selfHpGain) {
        const cfg       = skillCfg.selfHpGain;
        const category  = cfg[1];
        const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            unit.getMaxHp(),
                            unit.getCurrentHp() + modifier
                        ),
                    ));
                }
            }
        }
    }

    if (skillCfg.enemyHpGain) {
        const cfg       = skillCfg.enemyHpGain;
        const category  = cfg[1];
        const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            unit.getMaxHp(),
                            unit.getCurrentHp() + modifier
                        ),
                    ));
                }
            }
        }
    }

    if (skillCfg.selfFuelGain) {
        const cfg       = skillCfg.selfFuelGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel != null) {
                        if (modifier > 0) {
                            unit.setCurrentFuel(Math.min(
                                maxFuel,
                                unit.getCurrentFuel() + Math.floor(maxFuel * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentFuel(Math.max(
                                0,
                                Math.floor(unit.getCurrentFuel() * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.enemyFuelGain) {
        const cfg       = skillCfg.enemyFuelGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel != null) {
                        if (modifier > 0) {
                            unit.setCurrentFuel(Math.min(
                                maxFuel,
                                unit.getCurrentFuel() + Math.floor(maxFuel * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentFuel(Math.max(
                                0,
                                Math.floor(unit.getCurrentFuel() * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.selfMaterialGain) {
        const cfg       = skillCfg.selfMaterialGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxBuildMaterial = unit.getMaxBuildMaterial();
                    if (maxBuildMaterial != null) {
                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                unit.getCurrentBuildMaterial()! + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(unit.getCurrentBuildMaterial()! * (100 + modifier) / 100)
                            ));
                        }
                    }

                    const maxProduceMaterial = unit.getMaxProduceMaterial();
                    if (maxProduceMaterial != null) {
                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                unit.getCurrentProduceMaterial()! + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(unit.getCurrentProduceMaterial()! * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.enemyMaterialGain) {
        const cfg       = skillCfg.enemyMaterialGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxBuildMaterial = unit.getMaxBuildMaterial();
                    if (maxBuildMaterial != null) {
                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                unit.getCurrentBuildMaterial()! + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(unit.getCurrentBuildMaterial()! * (100 + modifier) / 100)
                            ));
                        }
                    }

                    const maxProduceMaterial = unit.getMaxProduceMaterial();
                    if (maxProduceMaterial != null) {
                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                unit.getCurrentProduceMaterial()! + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(unit.getCurrentProduceMaterial()! * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.selfPrimaryAmmoGain) {
        const cfg       = skillCfg.selfPrimaryAmmoGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                    if (maxAmmo != null) {
                        if (modifier > 0) {
                            unit.setPrimaryWeaponCurrentAmmo(Math.min(
                                maxAmmo,
                                unit.getPrimaryWeaponCurrentAmmo()! + Math.floor(maxAmmo * modifier / 100)
                            ));
                        } else {
                            unit.setPrimaryWeaponCurrentAmmo(Math.max(
                                0,
                                Math.floor(unit.getPrimaryWeaponCurrentAmmo()! * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.enemyPrimaryAmmoGain) {
        const cfg       = skillCfg.enemyPrimaryAmmoGain;
        const category  = cfg[1];
        const modifier  = cfg[2];
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                    if (maxAmmo != null) {
                        if (modifier > 0) {
                            unit.setPrimaryWeaponCurrentAmmo(Math.min(
                                maxAmmo,
                                unit.getPrimaryWeaponCurrentAmmo()! + Math.floor(maxAmmo * modifier / 100)
                            ));
                        } else {
                            unit.setPrimaryWeaponCurrentAmmo(Math.max(
                                0,
                                Math.floor(unit.getPrimaryWeaponCurrentAmmo()! * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            }
        }
    }

    if (skillCfg.indiscriminateAreaDamage) {
        const center = extraData ? extraData.indiscriminateAreaDamageCenter : null;
        if (!center) {
            Logger.error("BwHelpers.exeInstantSkill() no center for indiscriminateAreaDamage!");
        } else {
            const hpDamage = skillCfg.indiscriminateAreaDamage[2] * CommonConstants.UnitHpNormalizer;
            for (const g of GridIndexHelpers.getGridsWithinDistance(center as GridIndex, 0, skillCfg.indiscriminateAreaDamage[1], unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(g);
                if (unit) {
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - hpDamage));
                }
            }
        }
    }

    if (skillCfg.selfPromotionGain) {
        const cfg           = skillCfg.selfPromotionGain;
        const category      = cfg[1];
        const modifier      = cfg[2];
        const maxPromotion  = ConfigManager.getUnitMaxPromotion(configVersion);
        for (const unit of unitMap.getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex)                                         &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), category))
            ) {
                if (((cfg[0] === 0) && (GridIndexHelpers.getDistance(unit.getGridIndex(), gridIndex) <= zoneRadius)) ||
                    (cfg[0] === 1)
                ) {
                    unit.setCurrentPromotion(Math.max(
                        0,
                        Math.min(
                            maxPromotion,
                            unit.getCurrentPromotion() + modifier
                        ),
                    ));
                }
            }
        }
    }

    return ClientErrorCode.NoError;
}

export function getAdjacentPlasmas(tileMap: BwTileMap, origin: GridIndex): GridIndex[] {
    const plasmas           = [origin];
    const mapSize           = tileMap.getMapSize();
    const mapHeight         = mapSize.height;
    const searchedIndexes   = new Set<number>([getIndexOfGridIndex(mapHeight, origin)]);

    let i = 0;
    while (i < plasmas.length) {
        for (const adjacentGridIndex of GridIndexHelpers.getAdjacentGrids(plasmas[i], mapSize)) {
            if (tileMap.getTile(adjacentGridIndex).getType() === TileType.Plasma) {
                const searchIndex = getIndexOfGridIndex(mapHeight, adjacentGridIndex);
                if (!searchedIndexes.has(searchIndex)) {
                    searchedIndexes.add(searchIndex);
                    plasmas.push(adjacentGridIndex);
                }
            }
        }
        ++i;
    }

    plasmas.shift();
    return plasmas;
}

function getIndexOfGridIndex(mapHeight: number, gridIndex: GridIndex): number {
    return gridIndex.x * mapHeight + gridIndex.y;
}

export function getIdleBuildingGridIndex(war: BwWar): Types.GridIndex | null {
    const field                     = war.getField();
    const tileMap                   = field.getTileMap();
    const unitMap                   = field.getUnitMap();
    const { x: currX, y: currY }    = field.getCursor().getGridIndex();
    const { width, height}          = tileMap.getMapSize();
    const playerIndex               = war.getPlayerIndexInTurn();
    const checkIsIdle               = (gridIndex: Types.GridIndex): boolean => {
        if (tileMap.getTile(gridIndex).checkIsUnitProducerForPlayer(playerIndex)) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((!unit)                                                                                     ||
                ((unit.getActionState() === Types.UnitActionState.Idle) && (unit.getPlayerIndex() === playerIndex))
            ) {
                return true;
            }
        }
        return false;
    };

    for (let y = currY; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            if ((y > currY) || (x > currX)) {
                const gridIndex = { x, y };
                if (checkIsIdle(gridIndex)) {
                    return gridIndex;
                }
            }
        }
    }

    for (let y = 0; y <= currY; ++y) {
        for (let x = 0; x < width; ++x) {
            if ((y < currY) || (x <= currX)) {
                const gridIndex = { x, y };
                if (checkIsIdle(gridIndex)) {
                    return gridIndex;
                }
            }
        }
    }

    return null;
}

export function getTeamIndexByRuleForPlayers(ruleForPlayers: IRuleForPlayers, playerIndex: number): number | null | undefined {
    for (const playerRule of ruleForPlayers.playerRuleDataArray || []) {
        if (playerRule.playerIndex === playerIndex) {
            return playerRule.teamIndex;
        }
    }
    return undefined;
}

export function getVisibilityArrayWithMapFromPath(map: Visibility[][], mapSize: MapSize): Visibility[] | undefined {
    const { width, height } = mapSize;
    const data              = new Array(width * height);
    let needSerialize       = false;

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            data[x + y * width] = map[x][y];
            if ((!needSerialize) && (map[x][y] !== Visibility.OutsideVision)) {
                needSerialize = true;
            }
        }
    }

    return needSerialize ? data : undefined;
}

export function getMapId(warData: ISerialWar): number | undefined | null {
    if (warData.settingsForMcw) {
        return warData.settingsForMcw.mapId;
    } else if (warData.settingsForMrw) {
        return warData.settingsForMrw.mapId;
    } else if (warData.settingsForScw) {
        return warData.settingsForScw.mapId;
    } else if (warData.settingsForCcw) {
        return warData.settingsForCcw.mapId;
    } else {
        return undefined;
    }
}
export function getWarType(warData: ISerialWar): WarType {
    const settingsForCommon = warData.settingsForCommon;
    const warRule           = settingsForCommon ? settingsForCommon.warRule : null;
    const hasFog            = warRule ? BwWarRuleHelper.getHasFogByDefault(warRule) : null;
    if (hasFog == null) {
        return WarType.Undefined;
    }

    if (warData.settingsForMcw) {
        return hasFog ? WarType.McwFog : WarType.McwStd;
    } else if (warData.settingsForMfw) {
        return hasFog ? WarType.MfwFog : WarType.MfwStd;
    } else if (warData.settingsForMrw) {
        return hasFog ? WarType.MrwFog : WarType.MrwStd;
    } else if (warData.settingsForScw) {
        return hasFog ? WarType.ScwFog : WarType.ScwStd;
    } else if (warData.settingsForSfw) {
        return hasFog ? WarType.SfwFog : WarType.SfwStd;
    } else {
        return WarType.Undefined;
    }
}

export function getPlayersCountUnneutral(playerManagerData: WarSerialization.ISerialPlayerManager | null | undefined): number {
    const playerIndexSet = new Set<number>();
    for (const playerData of playerManagerData ? playerManagerData.players || [] : []) {
        const playerIndex = playerData.playerIndex;
        if ((playerIndex != null) && (playerIndex >= CommonConstants.WarFirstPlayerIndex)) {
            playerIndexSet.add(playerIndex);
        }
    }
    return playerIndexSet.size;
}

export function getCoMaxEnergy(coConfig: ProtoTypes.Config.ICoBasicCfg): number {
    const expansionArray = coConfig.zoneExpansionEnergyList || [];
    return Math.max(
        expansionArray[expansionArray.length - 1] || 0,
        (coConfig.powerEnergyList || [])[1] || 0,
    );
}

export function getImageSourceForSkinId(skinId: number, isSelected: boolean): string | undefined {
    if (skinId === 1) {
        return isSelected ? `commonCircle0000` : `commonCircle0001`;
    } else if (skinId === 2) {
        return isSelected ? `commonCircle0002` : `commonCircle0003`;
    } else if (skinId === 3) {
        return isSelected ? `commonCircle0004` : `commonCircle0005`;
    } else if (skinId === 4) {
        return isSelected ? `commonCircle0006` : `commonCircle0007`;
    } else {
        return undefined;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Other validators.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, configVersion }: {
    unitData                : ProtoTypes.WarSerialization.ISerialUnit;
    configVersion           : string;
    mapSize                 : Types.MapSize | null | undefined;
    playersCountUnneutral   : number | null | undefined;
}): ClientErrorCode {
    const gridIndex = GridIndexHelpers.convertGridIndex(unitData.gridIndex);
    if (gridIndex == null) {
        return ClientErrorCode.UnitDataValidation00;
    }
    if ((mapSize) && (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
        return ClientErrorCode.UnitDataValidation01;
    }

    const unitType = unitData.unitType as UnitType;
    if (unitType == null) {
        return ClientErrorCode.UnitDataValidation02;
    }

    const playerIndex = unitData.playerIndex;
    if ((playerIndex == null)                               ||
        (playerIndex < CommonConstants.WarFirstPlayerIndex) ||
        (playerIndex > CommonConstants.WarMaxPlayerIndex)
    ) {
        return ClientErrorCode.UnitDataValidation03;
    }
    if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
        return ClientErrorCode.UnitDataValidation04;
    }

    const cfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
    if (cfg == null) {
        return ClientErrorCode.UnitDataValidation05;
    }

    const currBuildMaterial = unitData.currentBuildMaterial;
    const maxBuildMaterial  = cfg.maxBuildMaterial;
    if ((currBuildMaterial != null)                                         &&
        ((maxBuildMaterial == null) || (currBuildMaterial > maxBuildMaterial))
    ) {
        return ClientErrorCode.UnitDataValidation06;
    }

    const currFuel  = unitData.currentFuel;
    const maxFuel   = cfg.maxFuel;
    if ((currFuel != null)                          &&
        ((maxFuel == null) || (currFuel > maxFuel))
    ) {
        return ClientErrorCode.UnitDataValidation07;
    }

    const currHp    = unitData.currentHp;
    const maxHp     = cfg.maxHp;
    if ((currHp != null)                    &&
        ((maxHp == null) || (currHp > maxHp))
    ) {
        return ClientErrorCode.UnitDataValidation08;
    }

    const currProduceMaterial   = unitData.currentProduceMaterial;
    const maxProduceMaterial    = cfg.maxProduceMaterial;
    if ((currProduceMaterial != null)                                               &&
        ((maxProduceMaterial == null) || (currProduceMaterial > maxProduceMaterial))
    ) {
        return ClientErrorCode.UnitDataValidation09;
    }

    const currPromotion = unitData.currentPromotion;
    const maxPromotion  = ConfigManager.getUnitMaxPromotion(configVersion);
    if ((currPromotion != null)                                 &&
        ((maxPromotion == null) || (currPromotion > maxPromotion))
    ) {
        return ClientErrorCode.UnitDataValidation10;
    }

    const flareCurrentAmmo  = unitData.flareCurrentAmmo;
    const flareMaxAmmo      = cfg.flareMaxAmmo;
    if ((flareCurrentAmmo != null)                                  &&
        ((flareMaxAmmo == null) || (flareCurrentAmmo > flareMaxAmmo))
    ) {
        return ClientErrorCode.UnitDataValidation11;
    }

    if ((unitData.isDiving) && (cfg.diveCfgs == null)) {
        return ClientErrorCode.UnitDataValidation12;
    }

    const currAmmo  = unitData.primaryWeaponCurrentAmmo;
    const maxAmmo   = cfg.primaryWeaponMaxAmmo;
    if ((currAmmo != null)                          &&
        ((maxAmmo == null) || (currAmmo > maxAmmo))
    ) {
        return ClientErrorCode.UnitDataValidation13;
    }

    if ((unitData.isCapturingTile) && (!cfg.canCaptureTile)) {
        return ClientErrorCode.UnitDataValidation14;
    }

    const actionState = unitData.actionState;
    if ((actionState != null)                           &&
        (actionState !== Types.UnitActionState.Idle)    &&
        (actionState !== Types.UnitActionState.Acted)
    ) {
        return ClientErrorCode.UnitDataValidation15;
    }

    const loaderUnitId = unitData.loaderUnitId;
    if ((loaderUnitId != null) && (loaderUnitId === unitData.unitId)) {
        return ClientErrorCode.UnitDataValidation16;
    }

    return ClientErrorCode.NoError;
}

export function checkCanVoteForDraw({ playerIndex, aliveState }: {
    playerIndex : number | null | undefined;
    aliveState  : Types.PlayerAliveState | null | undefined;
}): boolean {
    return (playerIndex != null)
        && (playerIndex !== CommonConstants.WarNeutralPlayerIndex)
        && (aliveState != null)
        && (aliveState !== Types.PlayerAliveState.Dead);
}
