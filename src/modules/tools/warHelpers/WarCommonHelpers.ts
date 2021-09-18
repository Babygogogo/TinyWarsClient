
import TwnsBwTile           from "../../baseWar/model/BwTile";
import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
import TwnsBwUnit           from "../../baseWar/model/BwUnit";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import TwnsBwWar            from "../../baseWar/model/BwWar";
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import CommonConstants      from "../helpers/CommonConstants";
import ConfigManager        from "../helpers/ConfigManager";
import GridIndexHelpers     from "../helpers/GridIndexHelpers";
import Helpers              from "../helpers/Helpers";
import Types                from "../helpers/Types";
import ProtoTypes           from "../proto/ProtoTypes";
import WarRuleHelpers       from "./WarRuleHelpers";
import WarVisibilityHelpers from "./WarVisibilityHelpers";

namespace WarCommonHelpers {
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MapSize          = Types.MapSize;
    import MovePathNode     = Types.MovePathNode;
    import UnitType         = Types.UnitType;
    import TileType         = Types.TileType;
    import WarType          = Types.WarType;
    import Visibility       = Types.Visibility;
    import CoSkillAreaType  = Types.CoSkillAreaType;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ISerialWar       = WarSerialization.ISerialWar;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwUnit           = TwnsBwUnit.BwUnit;
    import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;
    import BwWar            = TwnsBwWar.BwWar;
    import BwTile           = TwnsBwTile.BwTile;

    type AvailableMovableGrid = {
        currGridIndex   : GridIndex;
        prevGridIndex   : GridIndex | null;
        totalMoveCost   : number;
    };

    export function createMovableArea({ origin, maxMoveCost, mapSize, moveCostGetter }: {
        origin          : GridIndex;
        maxMoveCost     : number;
        mapSize         : MapSize;
        moveCostGetter  : (g: GridIndex) => number | null;
    }): MovableArea {
        const area              = [] as MovableArea;
        const availableGrids    = [] as AvailableMovableGrid[];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : origin,
            prev            : null,
            totalMoveCost   : 0,
        });

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
        minAttackRange  : number | null;
        maxAttackRange  : number | null;
        checkCanAttack  : (destination: GridIndex, target: GridIndex) => boolean;
    }): AttackableArea {
        const area: AttackableArea = [];
        if ((minAttackRange != null) && (maxAttackRange != null)) {
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
        }

        return area;
    }

    export function createShortestMovePath(area: MovableArea, destination: GridIndex): MovePathNode[] {
        const reversedPath  : MovePathNode[] = [];
        let gridIndex       : GridIndex | null = destination;
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
        rawPath         : Types.Undefinable<ProtoTypes.Structure.IMovePath>;
        launchUnitId    : Types.Undefinable<number>;
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

                if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
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

    export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: BwWar, rawPath: GridIndex[]): boolean {
        if (rawPath.length == 1) {
            return false;
        } else {
            const unitMap       = war.getUnitMap();
            const destination   = rawPath[rawPath.length - 1];
            const unit          = unitMap.getUnitOnMap(destination);
            if (unit == null) {
                return false;
            } else {
                return WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex           : destination,
                    unitType            : unit.getUnitType(),
                    isDiving            : unit.getIsDiving(),
                    unitPlayerIndex     : unit.getPlayerIndex(),
                    observerTeamIndex   : Helpers.getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
                });
            }
        }
    }

    export function createDistanceMap(tileMap: TwnsBwTileMap.BwTileMap, unit: BwUnit, destination: GridIndex): { distanceMap: (number | null)[][], maxDistance: number } {
        const area          : MovableArea = [];
        const availableGrids: AvailableMovableGrid[] = [];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : destination,
            prev            : null,
            totalMoveCost   : 0,
        });

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

    export function findNearestCapturableTile(tileMap: TwnsBwTileMap.BwTileMap, unitMap: BwUnitMap, unit: BwUnit): BwTile | null {
        const area          : MovableArea = [];
        const availableGrids: AvailableMovableGrid[] = [];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : unit.getGridIndex(),
            prev            : null,
            totalMoveCost   : 0,
        });

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
        prev            : GridIndex | null;
        totalMoveCost   : number;
    }): void {
        const newNode: AvailableMovableGrid = {
            currGridIndex: gridIndex,
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : null,
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
        prev            : GridIndex | null;
        totalMoveCost   : number;
    }): boolean {
        const { x, y } = gridIndex;
        area[x] = area[x] || [];

        if ((area[x][y]) && (area[x][y].totalMoveCost <= totalMoveCost)) {
            return false;
        } else {
            area[x][y] = {
                prevGridIndex: prev ? { x: prev.x, y: prev.y } : null,
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
    export function checkIsGridIndexInsideCoSkillArea({ gridIndex, coSkillAreaType, getCoGridIndexArrayOnMap, coZoneRadius }: {
        gridIndex               : GridIndex;
        coSkillAreaType         : CoSkillAreaType;
        getCoGridIndexArrayOnMap: () => GridIndex[];
        coZoneRadius            : number;
    }): boolean {
        if (coSkillAreaType === CoSkillAreaType.Halo) {
            return true;

        } else if (coSkillAreaType === CoSkillAreaType.OnMap) {
            const coGridIndexArray = getCoGridIndexArrayOnMap();
            return coGridIndexArray.length > 0;

        } else if (coSkillAreaType === CoSkillAreaType.Zone) {
            const coGridIndexArray  = getCoGridIndexArrayOnMap();
            const distance          = GridIndexHelpers.getMinDistance(gridIndex, coGridIndexArray);
            return (distance != null) && (distance <= coZoneRadius);

        } else {
            throw Helpers.newError(`Invalid coSkillAreaType: ${coSkillAreaType}`);
        }
    }

    export function getNormalizedHp(hp: number): number {
        return Math.ceil(hp / CommonConstants.UnitHpNormalizer);
    }

    export function getMapSize(data: Types.Undefinable<WarSerialization.ISerialTileMap>): Types.MapSize {
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

    export function checkIsUnitIdCompact(unitArray: Types.Undefinable<WarSerialization.ISerialUnit[]>): boolean {
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
            || (state === Types.ActionPlannerState.RequestingPlayerUseCoSkill)
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
    export function moveUnit({ war, pathNodes, launchUnitId, fuelConsumption }: {
        war             : BwWar;
        pathNodes       : GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const fogMap                = war.getFogMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = Helpers.getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));
        const currentFuel           = focusUnit.getCurrentFuel();
        const tile                  = tileMap.getTile(beginningGridIndex);
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
            focusUnit.setLoaderUnitId(null);
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
        extraData   : Types.Undefinable<{
            actingTiles?        : ISerialTile[] | null;
            actingUnits?        : ISerialUnit[] | null;
            discoveredTiles?    : ISerialTile[] | null;
            discoveredUnits?    : ISerialUnit[] | null;
        }>,
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
        unitsData       : Types.Undefinable<ISerialUnit[]>,
        isViewVisible   : boolean
    ): void {
        if ((unitsData) && (unitsData.length)) {
            const configVersion = war.getConfigVersion();
            const unitMap       = war.getUnitMap();
            for (const unitData of unitsData) {
                const unitId = unitData.unitId;
                if (unitId == null) {
                    throw Helpers.newError(`WarCommonHelpers.addUnitsBeforeExecutingAction() empty unitId.`);
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
    function updateTilesBeforeExecutingAction(war: BwWar, tilesData: Types.Undefinable<ISerialTile[]>): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap   = war.getTileMap();
            for (const tileData of tilesData) {
                const gridIndex     = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
                const tile          = tileMap.getTile(gridIndex);
                const configVersion = tile.getConfigVersion();
                if (tile.getHasFog()) {
                    tile.setHasFog(false);
                    tile.deserialize(tileData, configVersion);
                }
            }
        }
    }

    export function getAdjacentPlasmas(tileMap: TwnsBwTileMap.BwTileMap, origin: GridIndex): GridIndex[] {
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
        const playerIndex               = war.getPlayerIndexInTurn();
        const field                     = war.getField();
        const tileMap                   = field.getTileMap();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex();
        const { width, height}          = tileMap.getMapSize();
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
    export function getIdleUnitGridIndex(war: BwWar): Types.GridIndex | null {
        const playerIndex               = war.getPlayerIndexInTurn();
        const field                     = war.getField();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex();
        const { width, height}          = unitMap.getMapSize();
        const checkIsIdle               = (gridIndex: Types.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            return (unit?.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle);
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

    export function getVisibilityArrayWithMapFromPath(map: Visibility[][], mapSize: MapSize): Visibility[] | null {
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

        return needSerialize ? data : null;
    }

    export function getMapId(warData: ISerialWar): number | null {
        if (warData.settingsForMcw) {
            return Helpers.getExisted(warData.settingsForMcw.mapId);
        } else if (warData.settingsForMrw) {
            return Helpers.getExisted(warData.settingsForMrw.mapId);
        } else if (warData.settingsForScw) {
            return Helpers.getExisted(warData.settingsForScw.mapId);
        } else if (warData.settingsForCcw) {
            return Helpers.getExisted(warData.settingsForCcw.mapId);
        } else if (warData.settingsForSrw) {
            return Helpers.getExisted(warData.settingsForSrw.mapId);
        } else {
            return null;
        }
    }
    export function getWarType(warData: ISerialWar): WarType {
        const warRule   = warData.settingsForCommon?.warRule;
        const hasFog    = warRule ? WarRuleHelpers.getHasFogByDefault(warRule) : null;
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
        } else if (warData.settingsForCcw) {
            return hasFog ? WarType.CcwFog : WarType.CcwStd;
        } else if (warData.settingsForSrw) {
            return hasFog ? WarType.SrwFog : WarType.SrwStd;
        } else {
            return WarType.Undefined;
        }
    }
    export function getWarTypeByMpwWarInfo(warInfo: ProtoTypes.MultiPlayerWar.IMpwWarInfo): WarType {
        const warRule   = warInfo.settingsForCommon?.warRule;
        const hasFog    = warRule ? WarRuleHelpers.getHasFogByDefault(warRule) : null;
        if (hasFog == null) {
            return WarType.Undefined;
        }

        if (warInfo.settingsForMcw) {
            return hasFog ? WarType.McwFog : WarType.McwStd;
        } else if (warInfo.settingsForMfw) {
            return hasFog ? WarType.MfwFog : WarType.MfwStd;
        } else if (warInfo.settingsForMrw) {
            return hasFog ? WarType.MrwFog : WarType.MrwStd;
        } else if (warInfo.settingsForCcw) {
            return hasFog ? WarType.CcwFog : WarType.CcwStd;
        } else {
            return WarType.Undefined;
        }
    }

    export function getPlayersCountUnneutral(playerManagerData: Types.Undefinable<WarSerialization.ISerialPlayerManager>): number {
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

    export function getImageSourceForSkinId(skinId: number, isSelected: boolean): string {
        if (skinId === 1) {
            return isSelected ? `uncompressedCircle0000` : `uncompressedCircle0001`;
        } else if (skinId === 2) {
            return isSelected ? `uncompressedCircle0002` : `uncompressedCircle0003`;
        } else if (skinId === 3) {
            return isSelected ? `uncompressedCircle0004` : `uncompressedCircle0005`;
        } else if (skinId === 4) {
            return isSelected ? `uncompressedCircle0006` : `uncompressedCircle0007`;
        } else {
            return ``;
        }
    }
    export function getImageSourceForCoEyeFrame(skinId: number): string {
        switch (skinId) {
            case CommonConstants.WarNeutralPlayerIndex  : return ``;
            case 1                                      : return `uncompressedTriangle0001`;
            case 2                                      : return `uncompressedTriangle0002`;
            case 3                                      : return `uncompressedTriangle0003`;
            case 4                                      : return `uncompressedTriangle0004`;
            default                                     : throw Helpers.newError(`Invalid skinId: ${skinId}`);
        }
    }

    export function getTextColorForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0xFFFFFF;
            case 1  : return 0xF4664F;
            case 2  : return 0x34A7DE;
            case 3  : return 0xF9D803;
            case 4  : return 0x000000;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`);
        }
    }
    export function getTextStrokeForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0;
            case 1  : return 0;
            case 2  : return 0;
            case 3  : return 0;
            case 4  : return 1;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other validators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, configVersion }: {
        unitData                : ProtoTypes.WarSerialization.ISerialUnit;
        configVersion           : string;
        mapSize                 : Types.Undefinable<Types.MapSize>;
        playersCountUnneutral   : Types.Undefinable<number>;
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
        playerIndex : number;
        aliveState  : Types.PlayerAliveState;
    }): boolean {
        return (playerIndex !== CommonConstants.WarNeutralPlayerIndex)
            && (aliveState !== Types.PlayerAliveState.Dead);
    }
}

export default WarCommonHelpers;
