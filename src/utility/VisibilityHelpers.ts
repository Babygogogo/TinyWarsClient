
namespace TinyWars.Utility.VisibilityHelpers {
    import McwWar       = MultiCustomWar.McwWar;
    import McwUnit      = MultiCustomWar.McwUnit;
    import McwTile      = MultiCustomWar.McwTile;
    import McwUnitMap   = MultiCustomWar.McwUnitMap;
    import GridIndex    = Types.GridIndex;

    type Discoveries = {
        tiles: Set<McwTile>,
        units: Set<McwUnit>,
    }
    type ParamsForCheckIsUnitOnMapVisibleToPlayer = {
        war                 : McwWar;
        gridIndex           : GridIndex;
        unitType            : Types.UnitType;
        isDiving            : boolean;
        unitPlayerIndex     : number;
        observerPlayerIndex : number;
    }

    export function checkIsUnitOnMapVisibleToPlayer(params: ParamsForCheckIsUnitOnMapVisibleToPlayer): boolean {
        const { war, gridIndex, unitType, isDiving, unitPlayerIndex, observerPlayerIndex } = params;
        const playerManager = war.getPlayerManager();
        if (playerManager.checkIsSameTeam(unitPlayerIndex, observerPlayerIndex)) {
            return true;
        }

        const observerTeamIndex = playerManager.getTeamIndex(observerPlayerIndex);
        const unitMap           = war.getUnitMap();
        if (isDiving) {
            return _checkHasUnitWithTeamIndexOnAdjacentGrid(unitMap, gridIndex, observerTeamIndex);
        }

        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const tile = war.getTileMap().getTile(gridIndex);
        if (tile.getTeamIndex() === observerTeamIndex) {
            return true;
        }

        const { fromPaths, fromTiles, fromUnits } = fogMap.getVisibilityForTeam(gridIndex, observerTeamIndex);
        if (fromPaths === 2) {
            return true;
        } else if ((fromPaths === 0) && (fromTiles === 0) && (fromUnits === 0)) {
            return false;
        } else if (!tile.checkCanHideUnit(unitType)) {
            return true;
        } else if (_checkHasUnitWithTeamIndexOnAdjacentGrid(unitMap, gridIndex, observerTeamIndex)) {
            return true;
        } else {
            // TODO: take commander skills into account.
            return false;
        }
    }

    export function checkIsTileVisibleToPlayer(war: McwWar, gridIndex: GridIndex, observerPlayerIndex: number): boolean {
        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const tile              = war.getTileMap().getTile(gridIndex);
        const observerTeamIndex = war.getPlayerManager().getTeamIndex(observerPlayerIndex);
        if (tile.getTeamIndex() === observerTeamIndex) {
            return true;
        }

        const { fromPaths, fromTiles, fromUnits } = fogMap.getVisibilityForTeam(gridIndex, observerTeamIndex);
        if (fromPaths === 2) {
            return true;
        } else if ((fromPaths === 0) && (fromTiles === 0) && (fromUnits === 0)) {
            return false;
        } else if (!tile.checkIsUnitHider()) {
            return true;
        } else if (_checkHasUnitWithTeamIndexOnGrid(war.getUnitMap(), gridIndex, observerTeamIndex)) {
            return true;
        } else if (_checkHasUnitWithTeamIndexOnAdjacentGrid(war.getUnitMap(), gridIndex, observerTeamIndex)) {
            return true;
        } else {
            // TODO: take commander skills into account.
            return false;
        }
    }

    export function getDiscoveriesByPath(war: McwWar, path: GridIndex[], movingUnit: McwUnit, isUnitDestroyed: boolean): Discoveries {
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const observerPlayerIndex   = movingUnit.getPlayerIndex();
        const observerTeamIndex     = movingUnit.getTeamIndex()!;
        const visibilityMap         = _createVisibilityMapFromPath(war, path, movingUnit);
        const discoveredTiles       = new Set<McwTile>();
        const discoveredUnits       = new Set<McwUnit>();
        const destination           = path[path.length - 1];
        const { width: mapWidth, height: mapHeight } = tileMap.getMapSize();

        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const visibility = visibilityMap[x][y];
                if ((visibility != null) && (visibility > 0)) {
                    const gridIndex = { x: x, y: y } as GridIndex;

                    const tile = tileMap.getTile(gridIndex);
                    if (((visibility === 2) || (!tile.checkIsUnitHider()))              &&
                        (!checkIsTileVisibleToPlayer(war, gridIndex, observerPlayerIndex))) {
                        discoveredTiles.add(tile);
                    }

                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if (unit) {
                        if (unit.getIsDiving()) {
                            if ((!isUnitDestroyed)                                          &&
                                (GridIndexHelpers.checkIsAdjacent(gridIndex, destination))  &&
                                (!checkIsUnitOnMapVisibleToPlayer({
                                    war,
                                    gridIndex,
                                    unitType        : unit.getType(),
                                    isDiving        : true,
                                    unitPlayerIndex : unit.getPlayerIndex(),
                                    observerPlayerIndex
                                }))
                            ) {
                                discoveredUnits.add(unit);
                            }
                        } else {
                            if (((visibility === 2) || (!_checkIsUnitHiddenByTileToTeam(war, unit, observerTeamIndex))) &&
                                (!checkIsUnitOnMapVisibleToPlayer({
                                    war,
                                    gridIndex,
                                    unitType        : unit.getType(),
                                    isDiving        : false,
                                    unitPlayerIndex : unit.getPlayerIndex(),
                                    observerPlayerIndex
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

    export function getDiscoveriesByBuild(war: McwWar, gridIndex: GridIndex, builder: McwUnit): Discoveries {
        const vision = _getVisionForBuiltTile(war, gridIndex, builder);
        if (vision == null) {
            return { tiles: new Set(), units: new Set() };
        } else {
            return _getDiscoversByGettingBuilding(war, gridIndex, vision, builder.getPlayerIndex());
        }
    }

    export function getDiscoveriesByCapture(war: McwWar, gridIndex: GridIndex, observerPlayerIndex: number): Discoveries {
        const vision = _getVisionForCapturedTile(war, gridIndex, observerPlayerIndex);
        if (vision == null) {
            return { tiles: new Set(), units: new Set() };
        } else {
            return _getDiscoversByGettingBuilding(war, gridIndex, vision, observerPlayerIndex);
        }
    }

    export function getDiscoveriesByFlare(war: McwWar, origin: GridIndex, radius: number, observerPlayerIndex: number): Discoveries {
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const discoveredTiles   = new Set<McwTile>();
        const discoveredUnits   = new Set<McwUnit>();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(origin, 0, radius, tileMap.getMapSize())) {
            const tile = tileMap.getTile(gridIndex);
            if (!checkIsTileVisibleToPlayer(war, gridIndex, observerPlayerIndex)) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit) &&
                (!unit.getIsDiving()) &&
                (!checkIsUnitOnMapVisibleToPlayer({
                    war,
                    gridIndex,
                    unitType        : unit.getType(),
                    isDiving        : unit.getIsDiving(),
                    unitPlayerIndex : unit.getPlayerIndex(),
                    observerPlayerIndex,
                }))
            ) {
                discoveredUnits.add(unit);
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    export function getDiscoveriesByProduceUnitOnTile(war: McwWar, producerGridIndex: GridIndex, unitType: Types.UnitType): Discoveries {
        // TODO: take skills into account.
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const producerTile      = tileMap.getTile(producerGridIndex);
        const producerTileType  = producerTile.getType();
        const playerIndex       = producerTile.getPlayerIndex();
        const configVersion     = war.getConfigVersion();
        const visionBonusCfg    = ConfigManager.getVisionBonusCfg(configVersion, unitType);
        const visionRange       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).visionRange
            + (visionBonusCfg && visionBonusCfg[producerTileType] ? visionBonusCfg[producerTileType].visionBonus || 0 : 0);

        const discoveredTiles   = new Set<McwTile>();
        const discoveredUnits   = new Set<McwUnit>();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(producerGridIndex, 1, visionRange, tileMap.getMapSize())) {
            const distance  = GridIndexHelpers.getDistance(gridIndex, producerGridIndex);
            const tile      = tileMap.getTile(gridIndex);
            if ((!checkIsTileVisibleToPlayer(war, gridIndex, playerIndex))  &&
                ((distance === 1) || (!tile.checkIsUnitHider()))
            ) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                              &&
                (!checkIsUnitOnMapVisibleToPlayer({
                    war,
                    gridIndex,
                    isDiving            : unit.getIsDiving(),
                    unitType            : unit.getType(),
                    unitPlayerIndex     : unit.getPlayerIndex(),
                    observerPlayerIndex : playerIndex,
                }))                                 &&
                ((distance === 1) || ((!tile.checkCanHideUnit(unit.getType())) && (!unit.getIsDiving())))
            ) {
                discoveredUnits.add(unit);
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    function _checkHasUnitWithTeamIndexOnAdjacentGrid(unitMap: McwUnitMap, origin: GridIndex, teamIndex: number): boolean {
        for (const adjacentGrid of GridIndexHelpers.getAdjacentGrids(origin, unitMap.getMapSize())) {
            const unit = unitMap.getUnitOnMap(adjacentGrid);
            if ((unit) && (unit.getTeamIndex() === teamIndex)) {
                return true;
            }
        }
        return false;
    }

    function _checkHasUnitWithTeamIndexOnGrid(unitMap: McwUnitMap, gridIndex: GridIndex, teamIndex: number): boolean {
        const unit = unitMap.getUnitOnMap(gridIndex);
        return (unit != null) && (unit.getTeamIndex() === teamIndex);
    }

    function _createVisibilityMapFromPath(war: McwWar, path: GridIndex[], unit: McwUnit): (number | undefined)[][] {
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

    function _checkIsUnitHiddenByTileToTeam(war: McwWar, unit: McwUnit, teamIndex: number): boolean {
        const tile = war.getTileMap().getTile(unit.getGridIndex());
        return (tile.getTeamIndex() !== teamIndex) && (tile.checkCanHideUnit(unit.getType()));
    }

    function _getDiscoversByGettingBuilding(war: McwWar, origin: GridIndex, vision: number, observerPlayerIndex: number): Discoveries {
        // TODO: take commander skills into account.
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const discoveredTiles   = new Set<McwTile>();
        const discoveredUnits   = new Set<McwUnit>();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(origin, 0, vision, tileMap.getMapSize())) {
            const tile = tileMap.getTile(gridIndex);
            if (((!tile.checkIsUnitHider()) || (GridIndexHelpers.checkIsEqual(gridIndex, origin))) &&
                (!checkIsTileVisibleToPlayer(war, gridIndex, observerPlayerIndex))) {
                discoveredTiles.add(tile);
            }

            const unit = unitMap.getUnitOnMap(gridIndex);
            if (unit) {
                const unitType = unit.getType();
                if ((!tile.checkCanHideUnit(unitType))  &&
                    (!unit.getIsDiving())               &&
                    (!checkIsUnitOnMapVisibleToPlayer({
                        war,
                        gridIndex,
                        unitType,
                        isDiving        : unit.getIsDiving(),
                        unitPlayerIndex : unit.getPlayerIndex(),
                        observerPlayerIndex,
                    }))
                ) {
                    discoveredUnits.add(unit);
                }
            }
        }

        return { tiles: discoveredTiles, units: discoveredUnits };
    }

    function _getVisionForBuiltTile(war: McwWar, gridIndex: GridIndex, builder: McwUnit): number | undefined | null {
        // TODO: take commander skills into account.
        const newTileType   = builder.getBuildTargetTileType(war.getTileMap().getTile(gridIndex).getType())!;
        const cfg           = newTileType != null ? ConfigManager.getTileTemplateCfgByType(war.getConfigVersion(), newTileType) : undefined;
        return cfg ? cfg.visionRange : undefined;
    }

    function _getVisionForCapturedTile(war: McwWar, gridIndex: GridIndex, observerPlayerIndex: number): number | undefined | null {
        const oldTileType   = war.getTileMap().getTile(gridIndex).getType();
        const newTileType   = oldTileType === Types.TileType.Headquarters ? Types.TileType.City : oldTileType;
        const cfg           = ConfigManager.getTileTemplateCfgByType(war.getConfigVersion(), newTileType);
        return cfg ? cfg.visionRange : undefined;
    }
}
