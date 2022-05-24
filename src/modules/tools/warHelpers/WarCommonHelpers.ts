
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import ConfigManager        from "../helpers/ConfigManager";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarRuleHelpers       from "./WarRuleHelpers";
// import WarVisibilityHelpers from "./WarVisibilityHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarCommonHelpers {
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MapSize          = Types.MapSize;
    import MovePathNode     = Types.MovePathNode;
    import WarType          = Types.WarType;
    import Visibility       = Types.Visibility;
    import LangTextType     = Lang.LangTextType;
    import CoSkillAreaType  = Types.CoSkillAreaType;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import ISerialWar       = WarSerialization.ISerialWar;
    import WarSerialization = CommonProto.WarSerialization;
    import GameConfig       = Config.GameConfig;

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

    export function createAttackableAreaForUnit({ movableArea, mapSize, minAttackRange, maxAttackRange, checkCanAttack }: {
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
                            for (const attackGridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: moveGridIndex, minDistance: minAttackRange, maxDistance: maxAttackRange, mapSize })) {
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
    export function createAttackableAreaForTile(tile: BaseWar.BwTile, mapSize: MapSize): AttackableArea {
        const area          : AttackableArea = [];
        const mapWeaponType = tile.getTemplateCfg().mapWeaponType;
        const tileGridIndex = tile.getGridIndex();
        const tileGridX     = tileGridIndex.x;
        const tileGridY     = tileGridIndex.y;
        const mapWidth      = mapSize.width;
        const mapHeight     = mapSize.height;
        const addGrid       = (x: number, y: number) => {
            if (GridIndexHelpers.checkIsInsideMap({ x, y }, mapSize)) {
                if (area[x] == null) {
                    area[x] = [];
                }
                area[x][y] = {
                    movePathDestination: { x: tileGridX, y: tileGridY },
                };
            }
        };

        if ((mapWeaponType === CommonConstants.MapWeaponType.Crystal) || (mapWeaponType === CommonConstants.MapWeaponType.CustomCrystal)) {
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: tileGridIndex, minDistance: 0, maxDistance: Helpers.getExisted(tile.getCustomCrystalData()?.radius), mapSize })) {
                addGrid(gridIndex.x, gridIndex.y);
            }

        } else if ((mapWeaponType === CommonConstants.MapWeaponType.CustomCannon) || (tile.checkIsNormalCannon())) {
            const { rangeForDown, rangeForLeft, rangeForRight, rangeForUp } = Helpers.getExisted(tile.getCustomCannonData());
            if (rangeForDown) {
                for (let deltaY = 1; deltaY <= rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 - deltaY; deltaX <= deltaY - 1; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForUp) {
                for (let deltaY = -rangeForUp; deltaY < 0; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 + deltaY; deltaX <= -1 - deltaY; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForRight) {
                for (let deltaX = 1; deltaX <= rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 - deltaX; deltaY <= deltaX - 1; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForLeft) {
                for (let deltaX = -rangeForLeft; deltaX < 0; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 + deltaX; deltaY <= -1 - deltaX; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }

        } else if ((mapWeaponType === CommonConstants.MapWeaponType.LaserTurret) || (mapWeaponType === CommonConstants.MapWeaponType.CustomLaserTurret)) {
            const { rangeForDown, rangeForLeft, rangeForRight, rangeForUp } = Helpers.getExisted(tile.getCustomLaserTurretData());
            if (rangeForDown) {
                for (let deltaY = 0; deltaY < rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY + 1;
                    if (y >= mapHeight) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForUp) {
                for (let deltaY = 0; deltaY < rangeForUp; ++deltaY) {
                    const y = tileGridY - deltaY - 1;
                    if (y < 0) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForRight) {
                for (let deltaX = 0; deltaX < rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX + 1;
                    if (x >= mapWidth) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }
            if (rangeForLeft) {
                for (let deltaX = 0; deltaX < rangeForLeft; ++deltaX) {
                    const x = tileGridX - deltaX - 1;
                    if (x < 0) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }

        } else {
            // TODO: handle other tile types
            throw Helpers.newError(`WarCommonHelpers.createAttackableAreaForTile() invalid mapWeaponType: ${mapWeaponType}`);
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
        war             : BaseWar.BwWar;
        rawPath         : Types.Undefinable<CommonProto.Structure.IMovePath>;
        launchUnitId    : Types.Undefinable<number>;
    }): Types.MovePath {
        if (rawPath == null) {
            throw Helpers.newError(`Empty rawPath.`, ClientErrorCode.BwHelpers_GetRevisedPath_00);
        }

        const rawPathNodes = rawPath.nodes;
        if ((rawPathNodes == null) || (!rawPathNodes.length)) {
            throw Helpers.newError(`Empty rawPathNodes.`, ClientErrorCode.BwHelpers_GetRevisedPath_01);
        }

        const beginningGridIndex    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(rawPathNodes[0]), ClientErrorCode.BwHelpers_GetRevisedPath_02);
        const playerInTurn          = war.getPlayerInTurn();
        const unitMap               = war.getUnitMap();
        const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
        if ((!focusUnit)                                                    ||
            (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
            (focusUnit.getActionState() !== Types.UnitActionState.Idle)     ||
            (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main)
        ) {
            throw Helpers.newError(`Invalid focusUnit.`, ClientErrorCode.BwHelpers_GetRevisedPath_03);
        }

        if (launchUnitId != null) {
            const gridIndex = focusUnit.getGridIndex();
            if (!GridIndexHelpers.checkIsEqual(gridIndex, beginningGridIndex)) {
                throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_04);
            }
        }

        const tileMap                   = war.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const teamIndexInTurn           = playerInTurn.getTeamIndex();
        const maxFuelConsumption        = focusUnit.getFinalMoveRange();
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
                throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_05);
            }

            const tile              = tileMap.getTile(gridIndex);
            const fuelConsumption   = Helpers.getExisted(tile.getMoveCostByUnit(focusUnit), ClientErrorCode.BwHelpers_GetRevisedPath_06);
            rawTotalFuelConsumption += fuelConsumption;
            if (rawTotalFuelConsumption > maxFuelConsumption) {
                throw Helpers.newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, ClientErrorCode.BwHelpers_GetRevisedPath_07);
            }

            const existingUnit = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
                const unitType          = existingUnit.getUnitType();
                const isDiving          = existingUnit.getIsDiving();
                const unitPlayerIndex   = existingUnit.getPlayerIndex();
                if (WarHelpers.WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex,
                    unitType,
                    isDiving,
                    unitPlayerIndex,
                    observerTeamIndex   : teamIndexInTurn,
                })) {
                    throw Helpers.newError(`There is a blocking visible unit.`, ClientErrorCode.BwHelpers_GetRevisedPath_08);
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
            nodes           : revisedNodes,
            isBlocked       : isBlocked,
            fuelConsumption : revisedTotalFuelConsumption,
        };
    }

    export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: BaseWar.BwWar, rawPath: GridIndex[]): boolean {
        if (rawPath.length == 1) {
            return false;
        } else {
            const unitMap       = war.getUnitMap();
            const destination   = rawPath[rawPath.length - 1];
            const unit          = unitMap.getUnitOnMap(destination);
            if (unit == null) {
                return false;
            } else {
                return WarHelpers.WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
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

    export function createDistanceMap(tileMap: BaseWar.BwTileMap, unit: BaseWar.BwUnit, destination: GridIndex): { distanceMap: (number | null)[][], maxDistance: number } {
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

    export function findNearestCapturableTile(tileMap: BaseWar.BwTileMap, unitMap: BaseWar.BwUnitMap, unit: BaseWar.BwUnit): BaseWar.BwTile | null {
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
            throw Helpers.newError(`Invalid coSkillAreaType: ${coSkillAreaType}`, ClientErrorCode.WarCommonHelpers_CheckIsGridIndexInsideCoSkillArea_00);
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

    export function checkIsUnitIdCompact(unitArray: Types.Undefinable<ISerialUnit[]>): boolean {
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
        war             : BaseWar.BwWar;
        pathNodes       : GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = war.getUnitMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = Helpers.getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));
        war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, pathNodes);
        focusUnit.setCurrentFuel(focusUnit.getCurrentFuel() - fuelConsumption);
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
                war.getTileMap().getTile(beginningGridIndex).updateOnUnitLeave();
            }
        }
    }
    export async function moveExtraUnit({ war, movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        war                     : BaseWar.BwWar;
        movingUnitAndPath       : Types.Undefinable<CommonProto.Structure.IMovingUnitAndPath>;
        aiming                  : GridIndex | null;
        deleteViewAfterMoving   : boolean;
    }): Promise<BaseWar.BwUnitView | null> {
        if (movingUnitAndPath == null) {
            return null;
        }

        const movingUnitData = movingUnitAndPath.unit;
        if (movingUnitData == null) {
            return null;
        }

        const movingPath = movingUnitAndPath.path;
        if (movingPath == null) {
            throw Helpers.newError(`Empty movingPath.`, ClientErrorCode.WarCommonHelpers_MoveExtraUnit_00);
        }

        const unitMap           = war.getUnitMap();
        const unitMapView       = unitMap.getView();
        const movingUnitView    = unitMap.getUnitById(Helpers.getExisted(movingUnitData.unitId, ClientErrorCode.WarCommonHelpers_MoveExtraUnit_01))?.getView();
        (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

        const virtualUnit = new BaseWar.BwUnit();
        virtualUnit.init(movingUnitData, war.getGameConfig());
        virtualUnit.startRunning(war);
        virtualUnit.startRunningView();

        const virtualUnitView = virtualUnit.getView();
        unitMapView.addUnit(virtualUnitView, true);
        await virtualUnitView.moveAlongExtraPath({
            path: movingPath,
            aiming,
            deleteViewAfterMoving
        });

        return virtualUnitView;
    }

    export function checkIsUnitRepaired(oldUnitData: ISerialUnit, newUnitData: ISerialUnit): boolean {
        if (oldUnitData.unitType != newUnitData.unitType) {
            return false;
        }

        return (newUnitData.currentHp ?? CommonConstants.UnitMaxHp) > (oldUnitData.currentHp ?? CommonConstants.UnitMaxHp);
    }
    export function checkIsUnitSupplied(oldUnitData: ISerialUnit, newUnitData: ISerialUnit, gameConfig: GameConfig): boolean {
        const unitType = newUnitData.unitType;
        if ((unitType == null) || (oldUnitData.unitType != newUnitData.unitType)) {
            return false;
        }

        const unitCfg = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType), ClientErrorCode.WarCommonHelpers_CheckIsUnitSupplied_00);
        {
            const maxFuel = unitCfg.maxFuel;
            if ((newUnitData.currentFuel ?? maxFuel) > (oldUnitData.currentFuel ?? maxFuel)) {
                return true;
            }
        }

        {
            const maxAmmo = unitCfg.primaryWeaponMaxAmmo;
            if ((maxAmmo != null)                                                                                       &&
                ((newUnitData.primaryWeaponCurrentAmmo ?? maxAmmo) > (oldUnitData.primaryWeaponCurrentAmmo ?? maxAmmo))
            ) {
                return true;
            }
        }

        {
            const maxAmmo = unitCfg.flareMaxAmmo;
            if ((maxAmmo != null)                                                                       &&
                ((newUnitData.flareCurrentAmmo ?? maxAmmo) > (oldUnitData.flareCurrentAmmo ?? maxAmmo))
            ) {
                return true;
            }
        }

        {
            const maxMaterial = unitCfg.maxProduceMaterial;
            if ((maxMaterial != null)                                                                                       &&
                ((newUnitData.currentProduceMaterial ?? maxMaterial) > (oldUnitData.currentProduceMaterial ?? maxMaterial))
            ) {
                return true;
            }
        }

        {
            const maxMaterial = unitCfg.maxBuildMaterial;
            if ((maxMaterial != null)                                                                                   &&
                ((newUnitData.currentBuildMaterial ?? maxMaterial) > (oldUnitData.currentBuildMaterial ?? maxMaterial))
            ) {
                return true;
            }
        }

        return false;
    }
    export function checkIsUnitDamaged(oldUnitData: ISerialUnit, newUnitData: ISerialUnit): boolean {
        if (oldUnitData.unitType != newUnitData.unitType) {
            return false;
        }

        return (newUnitData.currentHp ?? CommonConstants.UnitMaxHp) < (oldUnitData.currentHp ?? CommonConstants.UnitMaxHp);
    }

    // export function updateTilesAndUnits(
    //     war         : TwnsBwWar.BwWar,
    //     extraData   : Types.Undefinable<{
    //         actingTiles?        : ISerialTile[] | null;
    //         actingUnits?        : ISerialUnit[] | null;
    //         discoveredTiles?    : ISerialTile[] | null;
    //         discoveredUnits?    : ISerialUnit[] | null;
    //     }>,
    // ): void {
    //     if (extraData) {
    //         addUnitsBeforeExecutingAction(war, extraData.actingUnits, false);
    //         addUnitsBeforeExecutingAction(war, extraData.discoveredUnits, false);
    //         updateTilesBeforeExecutingAction(war, extraData.actingTiles);
    //         updateTilesBeforeExecutingAction(war, extraData.discoveredTiles);
    //     }
    // }
    // function addUnitsBeforeExecutingAction(
    //     war             : TwnsBwWar.BwWar,
    //     unitsData       : Types.Undefinable<ISerialUnit[]>,
    //     isViewVisible   : boolean
    // ): void {
    //     if ((unitsData) && (unitsData.length)) {
    //         const configVersion = war.getConfigVersion();
    //         const unitMap       = war.getUnitMap();
    //         for (const unitData of unitsData) {
    //             const unitId = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_AddUnitsBeforeExecutingAction_00);
    //             if (!unitMap.getUnitById(unitId)) {
    //                 const unit = new TwnsBwUnit.BwUnit();
    //                 unit.init(unitData, configVersion);

    //                 const isOnMap = unit.getLoaderUnitId() == null;
    //                 if (isOnMap) {
    //                     unitMap.setUnitOnMap(unit);
    //                 } else {
    //                     unitMap.setUnitLoaded(unit);
    //                 }
    //                 unit.startRunning(war);
    //                 unit.startRunningView();
    //                 unit.setViewVisible(isViewVisible);
    //             }
    //         }
    //     }
    // }
    // function updateTilesBeforeExecutingAction(war: TwnsBwWar.BwWar, tilesData: Types.Undefinable<ISerialTile[]>): void {
    //     if ((tilesData) && (tilesData.length)) {
    //         const tileMap   = war.getTileMap();
    //         for (const tileData of tilesData) {
    //             const gridIndex     = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
    //             const tile          = tileMap.getTile(gridIndex);
    //             const configVersion = tile.getConfigVersion();
    //             if (tile.getHasFog()) {
    //                 tile.setHasFog(false);
    //                 tile.deserialize(tileData, configVersion);
    //             }
    //         }
    //     }
    // }

    /**
     * @return the war view is vibrated or not
     */
    export function handleCommonExtraDataForWarActions({ war, commonExtraData, isFastExecute }: {
        war                 : BaseWar.BwWar;
        commonExtraData     : CommonProto.Structure.ICommonExtraDataForWarAction;
        isFastExecute       : boolean;
    }): boolean {
        const playerIndexInTurn = war.getPlayerIndexInTurn();
        {
            const visibilityArrayFromPathsAfterAction = commonExtraData.visibilityArrayFromPathsAfterAction;
            if (visibilityArrayFromPathsAfterAction) {
                war.getFogMap().updateMapFromPathsByVisibilityArray(playerIndexInTurn, visibilityArrayFromPathsAfterAction);
            }
        }

        const gameConfig                = war.getGameConfig();
        const playerArrayAfterAction    = commonExtraData.playerArrayAfterAction ?? [];
        for (const playerData of playerArrayAfterAction) {
            const player = war.getPlayer(Helpers.getExisted(playerData.playerIndex, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_00));
            player.init(playerData, gameConfig);
            player.startRunning(war);
        }

        const unitMap = war.getUnitMap();
        unitMap.setNextUnitId(Helpers.getExisted(commonExtraData.nextUnitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_01));

        const unitArrayAfterAction  = commonExtraData.unitArrayAfterAction ?? [];
        const destroyedUnitIdArray  = commonExtraData.destroyedUnitIdArray ?? [];
        if (unitArrayAfterAction.some(v => destroyedUnitIdArray.indexOf(Helpers.getExisted(v.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_02)) >= 0)) {
            throw Helpers.newError(`WarCommonHelpers.handleCommonExtraDataForWarActions() unitArrayAfterAction and destroyedUnitIdArray overlapped!`, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_03);
        }

        const movingUnitAndPath     = commonExtraData.movingUnitAndPath;
        const movingUnitId          = movingUnitAndPath ? Helpers.getExisted(movingUnitAndPath.unit?.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_04) : null;
        const movingUnit            = movingUnitId == null ? null : unitMap.getUnitById(movingUnitId);
        const gridVisualEffect      = war.getGridVisualEffect();
        let isShownExplosionEffect  = false;
        {
            const movingPath            = movingUnitAndPath?.path;
            const movingDestination     = movingPath ? movingPath[movingPath.length - 1] : null;
            const movingUnitPlayerIndex = movingUnit?.getPlayerIndex();
            const destinationGridIndex  = movingDestination?.isVisible ? GridIndexHelpers.convertGridIndex(movingDestination.gridIndex) : null;
            for (const unitId of destroyedUnitIdArray) {
                const unit = unitMap.getUnitById(unitId);
                if (unit == null) {
                    continue;
                }

                if (unit.getLoaderUnitId()) {
                    unitMap.removeUnitLoaded(unitId);

                } else {
                    const gridIndex = unit.getGridIndex();
                    unitMap.removeUnitOnMap(gridIndex, true);

                    if (!isFastExecute) {
                        if ((destinationGridIndex == null)                                      ||
                            (unit.getPlayerIndex() !== movingUnitPlayerIndex)                   ||
                            (!GridIndexHelpers.checkIsEqual(destinationGridIndex, gridIndex))
                        ) {
                            gridVisualEffect.showEffectExplosion(gridIndex);
                            isShownExplosionEffect = true;
                        }
                    }
                }
            }
        }

        // 先把unitArrayAfterAction涉及的部队全部从地图上移除，然后再重新加回来，否则如果遇到有部队互相交换了位置之类的复杂情况就会报错（因为尝试把A移动到B所在位置时，B仍然占着位置，A就无法移动过去）
        const tempRemovedUnits      = new Map<number, BaseWar.BwUnit>(); // 此临时变量仅用于优化性能，在后续把部队加回来的过程中可以直接从这里取，而不必重新创建
        const tempRemovedLoadedUnits: BaseWar.BwUnit[] = [];
        const hiddenUnitIdArray     = commonExtraData.hiddenUnitIdArray ?? [];
        if (hiddenUnitIdArray.length) {
            for (const unitId of hiddenUnitIdArray) {
                unitMap.removeUnitById(unitId, true);
            }
        } else {
            // 由于后端没有明确告诉前端哪些部队在动作过后消失，所以只能前端假定movingUnit和其搭载的部队会消失，在这里预先移除它们。若实际上没有消失，则unitArrayAfterAction会包含它们，从而可以重新加回来。
            // 但实际上存在一种特殊情况，比如装载了部队的运输部队原地待机或装载co，那么由于被装载的部队没有发生变化，所以unitArrayAfterAction不会包含它们，导致动作执行完后，被装载的部队假性消失
            // 等当前进行中的局全部结束后，就可以通过hiddenUnitIdArray来准确移除消失的部队，不用假定movingUnit消失，从而可以删掉这些代码
            if ((movingUnitId != null) && (movingUnit)) {
                unitMap.removeUnitById(movingUnitId, true);
                tempRemovedUnits.set(movingUnitId, movingUnit);

                for (const loadedUnit of unitMap.getUnitsLoadedByLoader(movingUnit, true)) {
                    const loadedUnitId = loadedUnit.getUnitId();
                    unitMap.removeUnitLoaded(loadedUnitId);
                    tempRemovedUnits.set(loadedUnitId, loadedUnit);
                    tempRemovedLoadedUnits.push(loadedUnit);
                }
            }
        }
        for (const unitData of unitArrayAfterAction) {
            const unitId    = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_05);
            const unit      = unitMap.getUnitById(unitId);
            if (unit) {
                unitMap.removeUnitById(unitId, true);
                tempRemovedUnits.set(unitId, unit);
            }
        }

        const updatedViewUnits = new Set<BaseWar.BwUnit>();
        for (const unitData of unitArrayAfterAction) {
            const unitId        = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_06);
            const existingUnit  = tempRemovedUnits.get(unitId);
            if (existingUnit) {
                const existingUnitData = existingUnit.serialize();
                existingUnit.init(unitData, gameConfig);
                if (existingUnit.getLoaderUnitId() == null) {
                    unitMap.setUnitOnMap(existingUnit);
                } else {
                    unitMap.setUnitLoaded(existingUnit);

                    if (!isFastExecute) {
                        const loaderUnit = unitMap.getUnitOnMap(existingUnit.getGridIndex());
                        if (loaderUnit) {
                            loaderUnit.updateView();
                            updatedViewUnits.add(loaderUnit);
                        }
                    }
                }
                existingUnit.startRunning(war);
                existingUnit.startRunningView();
                updatedViewUnits.add(existingUnit);

                if (!isFastExecute) {
                    const gridIndex = existingUnit.getGridIndex();
                    if (checkIsUnitRepaired(existingUnitData, unitData)) {
                        gridVisualEffect.showEffectRepair(gridIndex);
                    } else if (checkIsUnitSupplied(existingUnitData, unitData, gameConfig)) {
                        gridVisualEffect.showEffectSupply(gridIndex);
                    }

                    if (checkIsUnitDamaged(existingUnitData, unitData)) {
                        gridVisualEffect.showEffectDamage(gridIndex);
                    }
                }

            } else {
                const unit = new BaseWar.BwUnit();
                unit.init(unitData, gameConfig);

                if (unit.getLoaderUnitId() == null) {
                    unitMap.setUnitOnMap(unit);
                } else {
                    unitMap.setUnitLoaded(unit);

                    if (!isFastExecute) {
                        const loaderUnit = unitMap.getUnitOnMap(unit.getGridIndex());
                        if (loaderUnit) {
                            loaderUnit.updateView();
                            updatedViewUnits.add(loaderUnit);
                        }
                    }
                }
                unit.startRunning(war);
                unit.startRunningView();
                updatedViewUnits.add(unit);
            }
        }
        if (hiddenUnitIdArray.length) {
            // nothing to do
        } else {
            // HACK：临时处理 类似装载了部队的运输船原地待机后被装载物假性消失的问题
            // 等当前进行中的局全部结束后，就可以通过hiddenUnitIdArray完成相同逻辑，从而可以删掉这些代码
            if ((movingUnitId != null) && (unitMap.getUnitById(movingUnitId) != null)) {
                let hasAdd = false;
                for (const loadedUnit of tempRemovedLoadedUnits) {
                    if (unitMap.getUnitById(loadedUnit.getUnitId()) == null) {
                        unitMap.setUnitLoaded(loadedUnit);
                        hasAdd = true;
                    }
                }
                if (hasAdd) {
                    unitMap.getUnitById(movingUnitId)?.updateView();
                }
            }
        }

        const tileMap = war.getTileMap();
        for (const tileData of commonExtraData.tileArrayAfterAction ?? []) {
            const gridIndex         = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex), ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_07);
            const tile              = tileMap.getTile(gridIndex);
            const hpBeforeAction    = tile.getCurrentHp();
            tile.init(tileData, gameConfig);
            tile.startRunning(war);
            tile.startRunningView();

            if (!isFastExecute) {
                if (hpBeforeAction != null) {
                    const hpAfterAction = tile.getCurrentHp();
                    if (hpAfterAction == null) {
                        gridVisualEffect.showEffectExplosion(gridIndex);
                        isShownExplosionEffect = true;
                    } else if (hpAfterAction < hpBeforeAction) {
                        gridVisualEffect.showEffectDamage(gridIndex);
                    }
                }
            }
        }

        if ((!isFastExecute) && (playerArrayAfterAction.length)) {
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if ((!updatedViewUnits.has(unit))                                               &&
                    (playerArrayAfterAction.some(v => v.playerIndex === unit.getPlayerIndex()))
                ) {
                    unit.updateView();
                }
            }
        }

        if ((!isFastExecute) && (isShownExplosionEffect)) {
            war.getView().showVibration();
            SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
            return true;
        } else {
            return false;
        }
    }

    export function getConnectedGridIndexArrayWithTileType(tileMap: BaseWar.BwTileMap, origin: GridIndex, tileType: number): GridIndex[] {
        const plasmas           = [origin];
        const mapSize           = tileMap.getMapSize();
        const mapHeight         = mapSize.height;
        const searchedIndexes   = new Set<number>([getIndexOfGridIndex(mapHeight, origin)]);

        let i = 0;
        while (i < plasmas.length) {
            for (const adjacentGridIndex of GridIndexHelpers.getAdjacentGrids(plasmas[i], mapSize)) {
                if (tileMap.getTile(adjacentGridIndex).getType() === tileType) {
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

    export function resetTileDataAsHasFog(tile: BaseWar.BwTile): void {
        tile.setHasFog(true);

        tile.deserialize({
            gridIndex       : tile.getGridIndex(),
            baseType        : tile.getBaseType(),
            decoratorType   : tile.getDecorationType(),
            objectType      : tile.getObjectType(),
            playerIndex     : tile.getTemplateCfg().isAlwaysShowOwner ? tile.getPlayerIndex() : CommonConstants.PlayerIndex.Neutral,
            baseShapeId     : tile.getBaseShapeId(),
            decoratorShapeId: tile.getDecoratorShapeId(),
            objectShapeId   : tile.getObjectShapeId(),
            currentHp       : tile.getCurrentHp(),
            locationFlags   : tile.getLocationFlags(),
            isHighlighted   : tile.getIsHighlighted(),
        }, tile.getGameConfig());
    }

    function getIndexOfGridIndex(mapHeight: number, gridIndex: GridIndex): number {
        return gridIndex.x * mapHeight + gridIndex.y;
    }

    export function getIdleBuildingGridIndex(war: BaseWar.BwWar): Types.GridIndex | null {
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
    export function getIdleUnitGridIndex(war: BaseWar.BwWar): Types.GridIndex | null {
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
        const instanceWarRule   = warData.settingsForCommon?.instanceWarRule;
        const hasFog            = instanceWarRule ? WarHelpers.WarRuleHelpers.getHasFogByDefault(instanceWarRule) : null;
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
    export function getWarTypeByMpwWarSettings(warInfo: CommonProto.MultiPlayerWar.IMpwWarSettings): WarType {
        const instanceWarRule   = warInfo.settingsForCommon?.instanceWarRule;
        const hasFog            = instanceWarRule ? WarHelpers.WarRuleHelpers.getHasFogByDefault(instanceWarRule) : null;
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

    export function checkCanCheatInWar(warType: Types.WarType): boolean {
        return (warType === Types.WarType.ScwFog)
            || (warType === Types.WarType.ScwStd)
            || (warType === Types.WarType.SfwFog)
            || (warType === Types.WarType.SfwStd)
            || (warType === Types.WarType.Me);
    }

    export function getPlayersCountUnneutral(playerManagerData: Types.Undefinable<WarSerialization.ISerialPlayerManager>): number {
        const playerIndexSet = new Set<number>();
        for (const playerData of playerManagerData ? playerManagerData.players || [] : []) {
            const playerIndex = playerData.playerIndex;
            if ((playerIndex != null) && (playerIndex >= CommonConstants.PlayerIndex.First)) {
                playerIndexSet.add(playerIndex);
            }
        }
        return playerIndexSet.size;
    }

    export function getCoMaxEnergy(coConfig: CommonProto.Config.ICoBasicCfg): number {
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
            return isSelected ? `uncompressedCircle0010` : `uncompressedCircle0011`;
        } else if (skinId === 5) {
            return isSelected ? `uncompressedCircle0006` : `uncompressedCircle0007`;
        } else {
            return ``;
        }
    }
    export function getImageSourceForCoEyeFrame(skinId: number): string {
        switch (skinId) {
            case CommonConstants.PlayerIndex.Neutral  : return ``;
            case 1                                      : return `uncompressedTriangle0001`;
            case 2                                      : return `uncompressedTriangle0002`;
            case 3                                      : return `uncompressedTriangle0003`;
            case 4                                      : return `uncompressedTriangle0004`;
            case 5                                      : return `uncompressedTriangle0005`;
            default                                     : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetImageSourceForCoEyeFrame_00);
        }
    }
    export function getImageSourceForCoHeadFrame(skinId: Types.Undefinable<number>): string {
        switch (skinId) {
            case 1  : return `uncompressedRectangle0002`;
            case 2  : return `uncompressedRectangle0003`;
            case 3  : return `uncompressedRectangle0004`;
            case 4  : return `uncompressedRectangle0008`;
            case 5  : return `uncompressedRectangle0005`;
            default : return `uncompressedRectangle0006`;
        }
    }

    export function getTextColorForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0xFFFFFF;
            case 1  : return 0xF4664F;
            case 2  : return 0x34A7DE;
            case 3  : return 0xF9D803;
            case 4  : return 0x3ADA22;
            case 5  : return 0x000000;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetTextColorForSkinId_00);
        }
    }
    export function getTextStrokeForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0;
            case 1  : return 0;
            case 2  : return 0;
            case 3  : return 0;
            case 4  : return 0;
            case 5  : return 1;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetTextStrokeForSkinId_00);
        }
    }

    export function getHintForEndTurn(war: BaseWar.BwWar): string {
        const playerIndex   = war.getPlayerIndexInTurn();
        const unitMap       = war.getUnitMap();
        const hints         = new Array<string>();
        {
            let idleUnitsCount = 0;
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle)) {
                    ++idleUnitsCount;
                }
            }
            (idleUnitsCount) && (hints.push(Lang.getFormattedText(LangTextType.F0006, idleUnitsCount)));
        }

        {
            const player            = war.getPlayer(playerIndex);
            const idleBuildingsDict = new Map<number, GridIndex[]>();
            const gameConfig        = war.getGameConfig();
            const currentFund       = player.getFund();
            for (const tile of war.getTileMap().getAllTiles()) {
                const gridIndex = tile.getGridIndex();
                if ((!tile.checkIsUnitProducerForPlayer(playerIndex)) || (unitMap.getUnitOnMap(gridIndex))) {
                    continue;
                }

                const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex) ?? null;
                const unitCategory      = Helpers.getExisted(skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory());
                const minNormalizedHp   = skillCfg ? getNormalizedHp(skillCfg[3]) : getNormalizedHp(CommonConstants.UnitMaxHp);
                for (const unitType of gameConfig.getUnitTypesByCategory(unitCategory) ?? []) {
                    const costModifier  = player.getUnitCostModifier(gridIndex, false, unitType);
                    const cfgCost       = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.productionCost);
                    const minCost       = skillCfg
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
                        : Math.floor(cfgCost * costModifier);
                    if (minCost <= currentFund) {
                        const tileType = tile.getType();
                        if (!idleBuildingsDict.has(tileType)) {
                            idleBuildingsDict.set(tileType, [gridIndex]);
                        } else {
                            Helpers.getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                        }
                        break;
                    }
                }
            }

            const textArrayForBuildings: string[] = [];
            for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                textArrayForBuildings.push(Lang.getFormattedText(
                    LangTextType.F0007, gridIndexArray.length,
                    Lang.getTileName(tileType, gameConfig),
                    gridIndexArray.map(v => `(${v.x}, ${v.y})`).join(`, `)),
                );
            }
            (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
        }

        hints.push(Lang.getText(LangTextType.A0024));
        return hints.join(`\n\n`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other validators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, gameConfig }: {
        unitData                : CommonProto.WarSerialization.ISerialUnit;
        gameConfig              : GameConfig;
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

        const unitType = unitData.unitType;
        if (unitType == null) {
            return ClientErrorCode.UnitDataValidation02;
        }

        const playerIndex = unitData.playerIndex;
        if ((playerIndex == null)                               ||
            (playerIndex < CommonConstants.PlayerIndex.First) ||
            (playerIndex > CommonConstants.PlayerIndex.Max)
        ) {
            return ClientErrorCode.UnitDataValidation03;
        }
        if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
            return ClientErrorCode.UnitDataValidation04;
        }

        const cfg = gameConfig.getUnitTemplateCfg(unitType);
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
        const maxPromotion  = gameConfig.getUnitMaxPromotion();
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
}

// export default WarCommonHelpers;
