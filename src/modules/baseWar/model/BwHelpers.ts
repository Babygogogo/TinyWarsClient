
namespace TinyWars.BaseWar.BwHelpers {
    import Types                    = Utility.Types;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import ProtoTypes               = Utility.ProtoTypes;
    import Logger                   = Utility.Logger;
    import Helpers                  = Utility.Helpers;
    import ConfigManager            = Utility.ConfigManager;
    import GridIndex                = Types.GridIndex;
    import MovableArea              = Types.MovableArea;
    import AttackableArea           = Types.AttackableArea;
    import MapSize                  = Types.MapSize;
    import MovePathNode             = Types.MovePathNode;
    import UnitType                 = Types.UnitType;
    import TileType                 = Types.TileType;
    import Visibility               = Types.Visibility;
    import CoSkillAreaType          = Types.CoSkillAreaType;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import ISerialUnit              = WarSerialization.ISerialUnit;
    import ISerialTile              = WarSerialization.ISerialTile;
    import ISerialWar               = WarSerialization.ISerialWar;
    import IGridIndex               = ProtoTypes.Structure.IGridIndex;
    import IRuleForPlayers          = ProtoTypes.WarRule.IRuleForPlayers;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

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

    export function convertGridIndex(raw: IGridIndex | undefined | null): GridIndex | undefined {
        return ((!raw) || (raw.x == null) || (raw.y == null))
            ? undefined
            : raw as GridIndex;
    }

    export function getNormalizedHp(hp: number): number {
        return Math.ceil(hp / CommonConstants.UnitHpNormalizer);
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
            const unitClass     = unitMap.getUnitClass();

            for (const unitData of unitsData) {
                if (!unitMap.getUnitById(unitData.unitId)) {
                    const unit      = new unitClass().init(unitData, configVersion);
                    const isOnMap   = unit.getLoaderUnitId() == null;
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
                const gridIndex = BwHelpers.convertGridIndex(tileData.gridIndex);
                if (gridIndex == null) {
                    Logger.error(`BwHelpers.updateTilesBeforeExecutingAction() empty gridIndex.`);
                    return undefined;
                }

                const tile = tileMap.getTile(gridIndex);
                if (tile.getHasFog()) {
                    tile.setHasFog(false);
                    tile.deserialize(tileData, tile.getConfigVersion());
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
    ): void {
        const configVersion = war.getConfigVersion();
        const skillCfg      = ConfigManager.getCoSkillCfg(configVersion, skillId)!;
        const playerIndex   = player.getPlayerIndex();
        const unitMap       = war.getUnitMap();
        const zoneRadius    = player.getCoZoneRadius()!;

        if (skillCfg.selfHpGain) {
            const cfg       = skillCfg.selfHpGain;
            const category  = cfg[1];
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
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
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
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
                const hpDamage = skillCfg.indiscriminateAreaDamage[2] * CommonConstants.UnitHpNormalizer;
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

    export async function getMapSizeAndMaxPlayerIndex(data: ISerialWar): Promise<Types.MapSizeAndMaxPlayerIndex | null> {
        const settingsForCommon = data.settingsForCommon;
        const mapId             = settingsForCommon ? settingsForCommon.mapId : null;
        if (mapId != null) {
            const mapRawData = await WarMap.WarMapModel.getRawData(mapId);
            if (mapRawData == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty mapRawData.`);
                return undefined;
            }

            const mapWidth = mapRawData.mapWidth;
            if (mapWidth == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty mapWidth.`);
                return undefined;
            }

            const mapHeight = mapRawData.mapHeight;
            if (mapHeight == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty mapHeight.`);
                return undefined;
            }

            const maxPlayerIndex = mapRawData.playersCount;
            if (maxPlayerIndex == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty maxPlayerIndex.`);
                return undefined;
            }

            return {
                mapWidth,
                mapHeight,
                maxPlayerIndex,
            };

        } else {
            const fieldData     = data.field;
            const tileMapData   = fieldData ? fieldData.tileMap : null;
            const tiles         = tileMapData ? tileMapData.tiles : null;
            if (tiles == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty tiles.`);
                return undefined;
            }

            const playerManagerData             = data.playerManager;
            const playersData                   = playerManagerData ? playerManagerData.players : null;
            const playersCountIncludingNeutral  = playersData ? playersData.length : null;
            if (playersCountIncludingNeutral == null) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty playersCountIncludingNeutral.`);
                return undefined;
            }

            const maxPlayerIndex = playersCountIncludingNeutral - 1;
            if (maxPlayerIndex <= 1) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() invalid maxPlayerIndex: ${maxPlayerIndex}`);
                return undefined;
            }

            let mapWidth   = 0;
            let mapHeight  = 0;
            for (const tile of tiles) {
                const gridIndex = convertGridIndex(tile.gridIndex);
                if (gridIndex == null) {
                    Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() empty gridIndex.`);
                    return undefined;
                }

                mapWidth   = Math.max(mapWidth, gridIndex.x + 1);
                mapHeight  = Math.max(mapHeight, gridIndex.y + 1);
            }

            if (mapWidth <= 0) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() mapWidth <= 0: ${mapWidth}`);
                return undefined;
            }
            if (mapHeight <= 0) {
                Logger.error(`BwHelpers.getMapSizeAndMaxPlayerIndex() mapHeight <= 0: ${mapHeight}`);
                return undefined;
            }

            return {
                mapWidth,
                mapHeight,
                maxPlayerIndex,
            };
        }
    }

    export function getTeamIndexByRuleForPlayers(ruleForPlayers: IRuleForPlayers, playerIndex: number): number | null | undefined {
        for (const playerRule of ruleForPlayers.playerRuleDataList || []) {
            if (playerRule.playerIndex === playerIndex) {
                return playerRule.teamIndex;
            }
        }
        return undefined;
    }

    export function getVisibilityListWithMapFromPath(map: Visibility[][], mapSize: MapSize): Visibility[] | undefined {
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
}
