
namespace TinyWars.BaseWar.BwHelpers {
    import Types                = Utility.Types;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import GridIndex            = Types.GridIndex;
    import MovableArea          = Types.MovableArea;
    import AttackableArea       = Types.AttackableArea;
    import MapSize              = Types.MapSize;
    import MovePathNode         = Types.MovePathNode;
    import UnitType             = Types.UnitType;

    type AvailableMovableGrid = {
        currGridIndex   : GridIndex;
        prevGridIndex   : GridIndex | undefined;
        totalMoveCost   : number;
    }

    export function createMovableArea(origin: GridIndex, maxMoveCost: number, moveCostGetter: (g: GridIndex) => number | undefined): MovableArea {
        const area              = [] as MovableArea;
        const availableGrids    = [] as AvailableMovableGrid[];
        _updateAvailableGrids(availableGrids, 0, origin, undefined, 0);

        let index = 0;
        while (index < availableGrids.length) {
            const availableGrid                     = _sortAvailableMovableGrids(availableGrids, index);
            const { currGridIndex, totalMoveCost }  = availableGrid;
            if (_checkAndUpdateMovableArea(area, currGridIndex, availableGrid.prevGridIndex, totalMoveCost)) {
                for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currGridIndex)) {
                    const nextMoveCost = moveCostGetter(nextGridIndex);
                    if ((nextMoveCost != null) && (nextMoveCost + totalMoveCost <= maxMoveCost)) {
                        _updateAvailableGrids(availableGrids, index + 1, nextGridIndex, currGridIndex, nextMoveCost + totalMoveCost);
                    }
                }
            }

            ++index;
        }

        return area;
    }

    export function createAttackableArea(movableArea: MovableArea, mapSize: MapSize, minAttackRange: number, maxAttackRange: number, checkCanAttack: (destination: GridIndex, target: GridIndex) => boolean): AttackableArea {
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
        const reversedPath = [] as MovePathNode[];
        let gridIndex   = destination;
        let movableNode = area[gridIndex.x][gridIndex.y];

        while (true) {
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

    export function createDistanceMap(tileMap: BwTileMap, unit: BwUnit, destination: GridIndex): { distanceMap: (number | null)[][], maxDistance: number } {
        const area          : MovableArea = [];
        const availableGrids: AvailableMovableGrid[] = [];
        _updateAvailableGrids(availableGrids, 0, destination, null, 0);

        const mapSize   = tileMap.getMapSize();
        let index       = 0;
        while (index < availableGrids.length) {
            const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
            const currentGridIndex  = availableGrid.currGridIndex;
            const totalMoveCost     = availableGrid.totalMoveCost;
            if (_checkAndUpdateMovableArea(area, currentGridIndex, availableGrid.prevGridIndex, totalMoveCost)) {
                const nextMoveCost = tileMap.getTile(currentGridIndex).getMoveCostByUnit(unit);
                if (nextMoveCost != null) {
                    for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                        _updateAvailableGrids(availableGrids, index, nextGridIndex, currentGridIndex, totalMoveCost + nextMoveCost);
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
        _updateAvailableGrids(availableGrids, 0, unit.getGridIndex(), null, 0);

        const teamIndex = unit.getTeamIndex();
        const mapSize   = tileMap.getMapSize();
        let index   = 0;
        while (index < availableGrids.length) {
            const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
            const currentGridIndex  = availableGrid.currGridIndex;
            const totalMoveCost     = availableGrid.totalMoveCost;
            const tile              = tileMap.getTile(currentGridIndex);
            const existingUnit      = unitMap.getUnitOnMap(currentGridIndex);

            if ((tile.getMaxCapturePoint())                                                                 &&
                (tile.getTeamIndex() !== teamIndex)    //                                                     &&
                // ((!existingUnit) || (existingUnit === unit) || (existingUnit.getTeamIndex() !== teamIndex))
            ) {
                return tile;
            } else {
                if (_checkAndUpdateMovableArea(area, currentGridIndex, availableGrid.prevGridIndex, totalMoveCost)) {
                    for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                        const nextMoveCost = tileMap.getTile(nextGridIndex).getMoveCostByUnit(unit);
                        if (nextMoveCost != null) {
                            _updateAvailableGrids(availableGrids, index, nextGridIndex, currentGridIndex, totalMoveCost + nextMoveCost);
                        }
                    }
                }
            }

            ++index;
        }

        return null;
    }

    function _updateAvailableGrids(grids: AvailableMovableGrid[], index: number, gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): void {
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
    function _checkAndUpdateMovableArea(area: MovableArea, gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): boolean {
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

    export function getUnitProductionCost(war: BwWar, unitType: UnitType): number | undefined {
        // TODO: take skills into account.
        const cfg = ConfigManager.getUnitTemplateCfg(war.getConfigVersion(), unitType);
        return cfg ? cfg.productionCost : undefined;
    }

    export function checkIsStateRequesting(state: Types.ActionPlannerState): boolean {
        return (state === Types.ActionPlannerState.RequestingPlayerActivateSkill)
            || (state === Types.ActionPlannerState.RequestingPlayerBeginTurn)
            || (state === Types.ActionPlannerState.RequestingPlayerDeleteUnit)
            || (state === Types.ActionPlannerState.RequestingPlayerEndTurn)
            || (state === Types.ActionPlannerState.RequestingPlayerSurrender)
            || (state === Types.ActionPlannerState.RequestingPlayerVoteForDraw)
            || (state === Types.ActionPlannerState.RequestingPlayerProduceUnit)
            || (state === Types.ActionPlannerState.RequestingUnitAttack)
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

    export function exeInstantSkill(war: BwWar, player: BwPlayer, gridIndex: GridIndex, skillId: number, extraData: ProtoTypes.IWarUseCoSkillExtraData): void {
        const configVersion = war.getConfigVersion();
        const skillCfg      = ConfigManager.getCoSkillCfg(configVersion, skillId)!;
        const playerIndex   = player.getPlayerIndex();
        const unitMap       = war.getUnitMap();
        const zoneRadius    = player.getCoZoneRadius()!;

        if (skillCfg.selfHpGain) {
            const cfg       = skillCfg.selfHpGain;
            const category  = cfg[1];
            const modifier  = cfg[2] * ConfigManager.UNIT_HP_NORMALIZER;
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.enemyHpGain) {
            const cfg       = skillCfg.enemyHpGain;
            const category  = cfg[1];
            const modifier  = cfg[2] * ConfigManager.UNIT_HP_NORMALIZER;
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.selfFuelGain) {
            const cfg       = skillCfg.selfFuelGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.enemyFuelGain) {
            const cfg       = skillCfg.enemyFuelGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.selfMaterialGain) {
            const cfg       = skillCfg.selfMaterialGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.enemyMaterialGain) {
            const cfg       = skillCfg.enemyMaterialGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.selfPrimaryAmmoGain) {
            const cfg       = skillCfg.selfPrimaryAmmoGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.enemyPrimaryAmmoGain) {
            const cfg       = skillCfg.enemyPrimaryAmmoGain;
            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() !== playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }

        if (skillCfg.indiscriminateAreaDamage) {
            const center = extraData ? extraData.indiscriminateAreaDamageCenter : null;
            if (!center) {
                Logger.error("BwHelpers.exeInstantSkill() no center for indiscriminateAreaDamage!");
            } else {
                const hpDamage = skillCfg.indiscriminateAreaDamage[2] * ConfigManager.UNIT_HP_NORMALIZER;
                for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(center as GridIndex, 0, skillCfg.indiscriminateAreaDamage[1], unitMap.getMapSize())) {
                    const unit = unitMap.getUnitOnMap(gridIndex);
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
            unitMap.forEachUnit(unit => {
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getType(), category))
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
            });
        }
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
        }

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

    export async function getMapSizeAndMaxPlayerIndex(data: Types.SerializedWar): Promise<Types.MapSizeAndMaxPlayerIndex | null> {
        const mapFileName = data.mapFileName;
        if (mapFileName) {
            const mapExtraData = await WarMap.WarMapModel.getExtraData(mapFileName);
            return !mapExtraData
                ? null
                : {
                    mapWidth        : mapExtraData.mapWidth,
                    mapHeight       : mapExtraData.mapHeight,
                    maxPlayerIndex  : mapExtraData.playersCount,
                };
        } else {
            const tiles             = data.field.tileMap.tiles;
            const maxPlayerIndex    = data.players.length - 1;
            if ((!tiles) || (!tiles.length) || (!maxPlayerIndex)) {
                return null;
            } else {
                let mapWidth   = 0;
                let mapHeight  = 0;
                for (const tile of tiles) {
                    mapWidth   = Math.max(mapWidth, (tile.gridX || 0) + 1);
                    mapHeight  = Math.max(mapHeight, (tile.gridY || 0) + 1);
                }
                return ((mapWidth > 0) && (mapHeight > 0))
                    ? { mapWidth, mapHeight, maxPlayerIndex }
                    : null;
            }
        }
    }

    export function encodeFogMapForPaths(map: number[][], mapSize: MapSize): string | undefined {
        const { width, height } = mapSize;
        const data              = new Array(width * height);
        let needSerialize       = false;

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                data[x + y * width] = map[x][y];
                (!needSerialize) && (map[x][y] > 0) && (needSerialize = true);
            }
        }

        return needSerialize ? data.join(``) : undefined;
    }

    export function checkShouldSerializeTile(
        tileData            : Types.SerializedTile,
        initialBaseViewId   : number | null,
        initialObjectViewId : number | null,
    ): boolean {
        return (tileData.currentBuildPoint      != null)
            || (tileData.currentCapturePoint    != null)
            || (tileData.currentHp              != null)
            || (tileData.baseViewId             != initialBaseViewId)
            || (tileData.objectViewId           != initialObjectViewId)
            || (initialBaseViewId               == null)
            || (initialObjectViewId             == null);
    }
}
