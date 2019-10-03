
namespace TinyWars.Utility.VisibilityHelpers {
    import BwWar        = BaseWar.BwWar;
    import BwUnit       = BaseWar.BwUnit;
    import BwTile       = BaseWar.BwTile;
    import BwUnitMap    = BaseWar.BwUnitMap;
    import GridIndex    = Types.GridIndex;
    import Visibility   = Types.Visibility;

    type Discoveries = {
        tiles: Set<BwTile>,
        units: Set<BwUnit>,
    }
    type ParamsForCheckIsUnitOnMapVisibleToTeam = {
        war                 : BwWar;
        gridIndex           : GridIndex;
        unitType            : Types.UnitType;
        isDiving            : boolean;
        unitPlayerIndex     : number;
        observerTeamIndex   : number;
    }

    export function checkIsUnitOnMapVisibleToTeam(params: ParamsForCheckIsUnitOnMapVisibleToTeam): boolean {
        const { war, gridIndex, unitType, isDiving, unitPlayerIndex, observerTeamIndex } = params;
        const playerManager = war.getPlayerManager();
        if (playerManager.getTeamIndex(unitPlayerIndex) === observerTeamIndex) {
            return true;
        }

        const unitMap = war.getUnitMap();
        if (_checkHasUnitWithTeamIndexOnAdjacentGrids(unitMap, gridIndex, observerTeamIndex)) {
            return true;
        }

        if (isDiving) {
            return false;
        }

        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const tile = war.getTileMap().getTile(gridIndex);
        if (tile.getTeamIndex() === observerTeamIndex) {
            return true;
        }

        const canTileHideUnit = tile.checkCanHideUnit(unitType);
        for (const playerIndex of playerManager.getPlayerIndexesInTeam(observerTeamIndex)) {
            const visibilityFromPaths = fogMap.getVisibilityFromPathsForPlayer(gridIndex, playerIndex);
            if (visibilityFromPaths === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromPaths === Visibility.InsideVision) {
                if (!canTileHideUnit) {
                    return true;
                }
            }

            const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
            if (visibilityFromUnits === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromUnits === Visibility.InsideVision) {
                if (!canTileHideUnit) {
                    return true;
                }
            }

            const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
            if (visibilityFromTiles === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromTiles === Visibility.InsideVision) {
                if (!canTileHideUnit) {
                    return true;
                }
            }
        }

        return false;
    }

    export function checkIsTileVisibleToTeam(war: BwWar, gridIndex: GridIndex, observerTeamIndex: number): boolean {
        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const tile = war.getTileMap().getTile(gridIndex);
        if (tile.getTeamIndex() === observerTeamIndex) {
            return true;
        }

        const unitMap = war.getUnitMap();
        if (_checkHasUnitWithTeamIndexOnGrid(unitMap, gridIndex, observerTeamIndex)) {
            return true;
        }
        if (_checkHasUnitWithTeamIndexOnAdjacentGrids(unitMap, gridIndex, observerTeamIndex)) {
            return true;
        }

        const isUnitHider = tile.checkIsUnitHider();
        for (const playerIndex of war.getPlayerManager().getPlayerIndexesInTeam(observerTeamIndex)) {
            const visibilityFromPaths = fogMap.getVisibilityFromPathsForPlayer(gridIndex, playerIndex);
            if (visibilityFromPaths === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromPaths === Visibility.InsideVision) {
                if (!isUnitHider) {
                    return true;
                }
            }

            const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
            if (visibilityFromUnits === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromUnits === Visibility.InsideVision) {
                if (!isUnitHider) {
                    return true;
                }
            }

            const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
            if (visibilityFromTiles === Visibility.TrueVision) {
                return true;
            } else if (visibilityFromTiles === Visibility.InsideVision) {
                if (!isUnitHider) {
                    return true;
                }
            }
        }

        return false;
    }

    export function getDiscoveriesByPath(war: BwWar, path: GridIndex[], movingUnit: BwUnit, isUnitDestroyed: boolean): Discoveries {
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const observerPlayerIndex   = movingUnit.getPlayerIndex();
        const observerTeamIndex     = movingUnit.getTeamIndex()!;
        const visibilityMap         = _createVisibilityMapFromPath(war, path, movingUnit);
        const discoveredTiles       = new Set<BwTile>();
        const discoveredUnits       = new Set<BwUnit>();
        const destination           = path[path.length - 1];
        const { width: mapWidth, height: mapHeight } = tileMap.getMapSize();

        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const visibility = visibilityMap[x][y];
                if ((visibility != null) && (visibility > 0)) {
                    const gridIndex = { x: x, y: y } as GridIndex;

                    const tile = tileMap.getTile(gridIndex);
                    if (((visibility === 2) || (!tile.checkIsUnitHider()))          &&
                        (!checkIsTileVisibleToTeam(war, gridIndex, observerTeamIndex))
                    ) {
                        discoveredTiles.add(tile);
                    }

                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if (unit) {
                        if (unit.getIsDiving()) {
                            if ((!isUnitDestroyed)                                          &&
                                (GridIndexHelpers.checkIsAdjacent(gridIndex, destination))  &&
                                (!checkIsUnitOnMapVisibleToTeam({
                                    war,
                                    gridIndex,
                                    unitType        : unit.getType(),
                                    isDiving        : true,
                                    unitPlayerIndex : unit.getPlayerIndex(),
                                    observerTeamIndex,
                                }))
                            ) {
                                discoveredUnits.add(unit);
                            }
                        } else {
                            if (((visibility === 2) || (!_checkIsUnitHiddenByTileToTeam(war, unit, observerTeamIndex))) &&
                                (!checkIsUnitOnMapVisibleToTeam({
                                    war,
                                    gridIndex,
                                    unitType        : unit.getType(),
                                    isDiving        : false,
                                    unitPlayerIndex : unit.getPlayerIndex(),
                                    observerTeamIndex,
                                }))
                            ) {
                                discoveredUnits.add(unit);
                            }
                        }
                    }
                }
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    export function getDiscoveriesByBuild(war: BwWar, gridIndex: GridIndex, builder: BwUnit): Discoveries {
        const vision = _getVisionForBuiltTile(war, gridIndex, builder);
        if (vision == null) {
            return { tiles: new Set(), units: new Set() };
        } else {
            return _getDiscoversByGettingBuilding(war, gridIndex, vision, builder.getPlayerIndex());
        }
    }

    export function getDiscoveriesByCapture(war: BwWar, gridIndex: GridIndex, observerPlayerIndex: number): Discoveries {
        const vision = _getVisionForCapturedTile(war, gridIndex, observerPlayerIndex);
        if (vision == null) {
            return { tiles: new Set(), units: new Set() };
        } else {
            return _getDiscoversByGettingBuilding(war, gridIndex, vision, observerPlayerIndex);
        }
    }

    export function getDiscoveriesByFlare(war: BwWar, origin: GridIndex, radius: number, observerPlayerIndex: number): Discoveries {
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const discoveredTiles   = new Set<BwTile>();
        const discoveredUnits   = new Set<BwUnit>();
        const observerTeamIndex = war.getPlayerManager().getTeamIndex(observerPlayerIndex);
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(origin, 0, radius, tileMap.getMapSize())) {
            const tile = tileMap.getTile(gridIndex);
            if (!checkIsTileVisibleToTeam(war, gridIndex, observerTeamIndex)) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit) &&
                (!unit.getIsDiving()) &&
                (!checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex,
                    unitType        : unit.getType(),
                    isDiving        : unit.getIsDiving(),
                    unitPlayerIndex : unit.getPlayerIndex(),
                    observerTeamIndex,
                }))
            ) {
                discoveredUnits.add(unit);
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    export function getDiscoveriesByPlayerProduceUnit(war: BwWar, producerGridIndex: GridIndex, unitType: Types.UnitType): Discoveries {
        // TODO: take skills into account.
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const producerTile      = tileMap.getTile(producerGridIndex);
        const producerTileType  = producerTile.getType();
        const playerIndex       = producerTile.getPlayerIndex();
        const observerTeamIndex = war.getPlayerManager().getTeamIndex(playerIndex);
        const configVersion     = war.getConfigVersion();
        const visionBonusCfg    = ConfigManager.getVisionBonusCfg(configVersion, unitType);
        const visionRange       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).visionRange
            + (visionBonusCfg && visionBonusCfg[producerTileType] ? visionBonusCfg[producerTileType].visionBonus || 0 : 0);

        const discoveredTiles   = new Set<BwTile>();
        const discoveredUnits   = new Set<BwUnit>();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(producerGridIndex, 1, visionRange, tileMap.getMapSize())) {
            const distance  = GridIndexHelpers.getDistance(gridIndex, producerGridIndex);
            const tile      = tileMap.getTile(gridIndex);
            if ((!checkIsTileVisibleToTeam(war, gridIndex, observerTeamIndex))  &&
                ((distance === 1) || (!tile.checkIsUnitHider()))
            ) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                              &&
                (!checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex,
                    isDiving        : unit.getIsDiving(),
                    unitType        : unit.getType(),
                    unitPlayerIndex : unit.getPlayerIndex(),
                    observerTeamIndex,
                }))                                 &&
                ((distance === 1) || ((!tile.checkCanHideUnit(unit.getType())) && (!unit.getIsDiving())))
            ) {
                discoveredUnits.add(unit);
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    function _checkHasUnitWithTeamIndexOnAdjacentGrids(unitMap: BwUnitMap, origin: GridIndex, teamIndex: number): boolean {
        for (const adjacentGrid of GridIndexHelpers.getAdjacentGrids(origin, unitMap.getMapSize())) {
            const unit = unitMap.getUnitOnMap(adjacentGrid);
            if ((unit) && (unit.getTeamIndex() === teamIndex)) {
                return true;
            }
        }
        return false;
    }

    function _checkHasUnitWithTeamIndexOnGrid(unitMap: BwUnitMap, gridIndex: GridIndex, teamIndex: number): boolean {
        const unit = unitMap.getUnitOnMap(gridIndex);
        return (unit != null) && (unit.getTeamIndex() === teamIndex);
    }

    function _createVisibilityMapFromPath(war: BwWar, path: GridIndex[], unit: BwUnit): (number | undefined)[][] {
        // TODO: take commander skills into account.
        const playerIndex   = unit.getPlayerIndex();
        const mapSize       = war.getTileMap().getMapSize();
        const visibilityMap = Helpers.createEmptyMap<number | undefined>(mapSize.width, mapSize.height);
        for (const node of path) {
            const vision = unit.getVisionRangeForPlayer(playerIndex, node);
            for (const grid of GridIndexHelpers.getGridsWithinDistance(node, 0, 1, mapSize)) {
                visibilityMap[grid.x][grid.y] = 2;
            }

            if (vision) {
                for (const grid of GridIndexHelpers.getGridsWithinDistance(node, 2, vision, mapSize)) {
                    visibilityMap[grid.x][grid.y] = visibilityMap[grid.x][grid.y] || 1;
                }
            }
        }

        return visibilityMap;
    }

    function _checkIsUnitHiddenByTileToTeam(war: BwWar, unit: BwUnit, teamIndex: number): boolean {
        const tile = war.getTileMap().getTile(unit.getGridIndex());
        return (tile.getTeamIndex() !== teamIndex) && (tile.checkCanHideUnit(unit.getType()));
    }

    function _getDiscoversByGettingBuilding(war: BwWar, origin: GridIndex, vision: number, observerPlayerIndex: number): Discoveries {
        // TODO: take commander skills into account.
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const discoveredTiles   = new Set<BwTile>();
        const discoveredUnits   = new Set<BwUnit>();
        const observerTeamIndex = war.getPlayerManager().getTeamIndex(observerPlayerIndex);
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(origin, 0, vision, tileMap.getMapSize())) {
            const tile = tileMap.getTile(gridIndex);
            if (((!tile.checkIsUnitHider()) || (GridIndexHelpers.checkIsEqual(gridIndex, origin))) &&
                (!checkIsTileVisibleToTeam(war, gridIndex, observerTeamIndex))) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if (unit) {
                const unitType = unit.getType();
                if ((!tile.checkCanHideUnit(unitType))  &&
                    (!unit.getIsDiving())               &&
                    (!checkIsUnitOnMapVisibleToTeam({
                        war,
                        gridIndex,
                        unitType,
                        isDiving        : unit.getIsDiving(),
                        unitPlayerIndex : unit.getPlayerIndex(),
                        observerTeamIndex,
                    }))
                ) {
                    discoveredUnits.add(unit);
                }
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    function _getVisionForBuiltTile(war: BwWar, gridIndex: GridIndex, builder: BwUnit): number | undefined | null {
        // TODO: take commander skills into account.
        const newTileType   = builder.getBuildTargetTileType(war.getTileMap().getTile(gridIndex).getType())!;
        const cfg           = newTileType != null ? ConfigManager.getTileTemplateCfgByType(war.getConfigVersion(), newTileType) : undefined;
        return cfg ? cfg.visionRange : undefined;
    }

    function _getVisionForCapturedTile(war: BwWar, gridIndex: GridIndex, observerPlayerIndex: number): number | undefined | null {
        const oldTileType   = war.getTileMap().getTile(gridIndex).getType();
        const newTileType   = oldTileType === Types.TileType.Headquarters ? Types.TileType.City : oldTileType;
        const cfg           = ConfigManager.getTileTemplateCfgByType(war.getConfigVersion(), newTileType);
        return cfg ? cfg.visionRange : undefined;
    }
}
