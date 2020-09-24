
namespace TinyWars.Utility.VisibilityHelpers {
    import BwWar        = BaseWar.BwWar;
    import BwUnit       = BaseWar.BwUnit;
    import BwTile       = BaseWar.BwTile;
    import BwUnitMap    = BaseWar.BwUnitMap;
    import GridIndex    = Types.GridIndex;
    import Visibility   = Types.Visibility;

    export function checkIsUnitOnMapVisibleToTeam(params: {
        war                 : BwWar;
        gridIndex           : GridIndex;
        unitType            : Types.UnitType;
        isDiving            : boolean;
        unitPlayerIndex     : number;
        observerTeamIndex   : number;
    }): boolean {
        return checkIsUnitOnMapVisibleToTeams({
            war                 : params.war,
            gridIndex           : params.gridIndex,
            unitType            : params.unitType,
            isDiving            : params.isDiving,
            unitPlayerIndex     : params.unitPlayerIndex,
            observerTeamIndexes : new Set<number>([params.observerTeamIndex])
        });
    }
    export function checkIsUnitOnMapVisibleToUser(params: {
        war                 : BwWar;
        gridIndex           : GridIndex;
        unitType            : Types.UnitType;
        isDiving            : boolean;
        unitPlayerIndex     : number;
        observerUserId      : number;
    }): boolean {
        return checkIsUnitOnMapVisibleToTeams({
            war                 : params.war,
            gridIndex           : params.gridIndex,
            unitType            : params.unitType,
            isDiving            : params.isDiving,
            unitPlayerIndex     : params.unitPlayerIndex,
            observerTeamIndexes : params.war.getPlayerManager().getAliveWatcherTeamIndexes(params.observerUserId)
        });
    }
    export function checkIsUnitOnMapVisibleToTeams(params: {
        war                 : BwWar;
        gridIndex           : GridIndex;
        unitType            : Types.UnitType;
        isDiving            : boolean;
        unitPlayerIndex     : number;
        observerTeamIndexes : Set<number>;
    }): boolean {
        const { war, gridIndex, unitType, isDiving, unitPlayerIndex, observerTeamIndexes } = params;
        const playerManager = war.getPlayerManager();
        if (observerTeamIndexes.has(playerManager.getTeamIndex(unitPlayerIndex))) {
            return true;
        }

        const unitMap = war.getUnitMap();
        if (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes)) {
            return true;
        }

        const tile = war.getTileMap().getTile(gridIndex);
        if (observerTeamIndexes.has(tile.getTeamIndex())) {
            return true;
        }

        if (isDiving) {
            return false;
        }

        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const canTileHideUnit = tile.checkCanHideUnit(unitType);
        for (const playerIndex of playerManager.getPlayerIndexesInTeams(observerTeamIndexes)) {
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

    export function getAllUnitsOnMapVisibleToTeams(war: BwWar, teamIndexes: Set<number>): Set<BwUnit> {
        const fogMap                = war.getFogMap();
        const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
        const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
        const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const units                 = new Set<BwUnit>();

        unitMap.forEachUnitOnMap(unit => {
            const gridIndex = unit.getGridIndex();
            const tile      = tileMap.getTile(gridIndex);
            if ((teamIndexes.has(unit.getTeamIndex()))                                          ||
                (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, teamIndexes))  ||
                (teamIndexes.has(tile.getTeamIndex()))
            ) {
                units.add(unit);
            } else {
                if (unit.getIsDiving()) {
                    // Do nothing.
                } else {
                    const { x, y }      = gridIndex;
                    const visibility    = Math.max(
                        visibilityFromPaths[x][y],
                        visibilityFromTiles[x][y],
                        visibilityFromUnits[x][y],
                    );
                    if ((visibility === Visibility.TrueVision)                                                  ||
                        ((visibility === Visibility.InsideVision) && (!tile.checkCanHideUnit(unit.getType())))
                    ) {
                        units.add(unit);
                    }
                }
            }
        });
        return units;
    }
    // export function getAllUnitsOnMapVisibleToUser(war: BwWar, userId: number): Set<BwUnit> {
    //     const fogMap                = war.getFogMap();
    //     const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForUser(userId);
    //     const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForUser(userId);
    //     const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForUser(userId);
    //     const observerTeamIndexes   = war.getWatcherTeamIndexes(userId);
    //     const unitMap               = war.getUnitMap();
    //     const tileMap               = war.getTileMap();
    //     const units                 = new Set<BwUnit>();

    //     unitMap.forEachUnitOnMap(unit => {
    //         const gridIndex = unit.getGridIndex();
    //         const tile      = tileMap.getTile(gridIndex);
    //         if ((observerTeamIndexes.has(unit.getTeamIndex()))                                          ||
    //             (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes))  ||
    //             (observerTeamIndexes.has(tile.getTeamIndex()))
    //         ) {
    //             units.add(unit);
    //         } else {
    //             if (unit.getIsDiving()) {
    //                 // Do nothing.
    //             } else {
    //                 const { x, y }      = gridIndex;
    //                 const visibility    = Math.max(
    //                     visibilityFromPaths[x][y],
    //                     visibilityFromTiles[x][y],
    //                     visibilityFromUnits[x][y],
    //                 );
    //                 if ((visibility === Visibility.TrueVision)                                                  ||
    //                     ((visibility === Visibility.InsideVision) && (!tile.checkCanHideUnit(unit.getType())))
    //                 ) {
    //                     units.add(unit);
    //                 }
    //             }
    //         }
    //     });
    //     return units;
    // }

    // export function checkIsTileVisibleToTeam(war: BwWar, gridIndex: GridIndex, observerTeamIndex: number): boolean {
    //     return checkIsTileVisibleToTeams(war, gridIndex, new Set<number>([observerTeamIndex]));
    // }
    // export function checkIsTileVisibleToUser(war: BwWar, gridIndex: GridIndex, observerUserId: number): boolean {
    //     return checkIsTileVisibleToTeams(war, gridIndex, war.getPlayerManager().getAliveWatcherTeamIndexes(observerUserId));
    // }
    export function checkIsTileVisibleToTeams(war: BwWar, gridIndex: GridIndex, observerTeamIndexes: Set<number>): boolean {
        const fogMap = war.getFogMap();
        if (!fogMap.checkHasFogCurrently()) {
            return true;
        }

        const playerManager = war.getPlayerManager();
        const tile          = war.getTileMap().getTile(gridIndex);
        if (observerTeamIndexes.has(tile.getTeamIndex())) {
            return true;
        }

        const unitMap = war.getUnitMap();
        if (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, observerTeamIndexes)) {
            return true;
        }
        if (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes)) {
            return true;
        }

        const isUnitHider = tile.checkIsUnitHider();
        for (const playerIndex of playerManager.getPlayerIndexesInTeams(observerTeamIndexes)) {
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

    export function getAllTilesVisibleToTeam(war: BwWar, teamIndex: number): Set<BwTile> {
        const fogMap                = war.getFogMap();
        const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeam(teamIndex);
        const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeam(teamIndex);
        const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeam(teamIndex);
        const observerTeamIndexes   = new Set([teamIndex]);
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const tiles                 = new Set<BwTile>();
        const hasFog                = fogMap.checkHasFogCurrently();

        tileMap.forEachTile(tile => {
            const gridIndex = tile.getGridIndex();
            if ((!hasFog)                                                                               ||
                (observerTeamIndexes.has(tile.getTeamIndex()))                                          ||
                (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, observerTeamIndexes))           ||
                (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes))
            ) {
                tiles.add(tile);
            } else {
                const { x, y }      = gridIndex;
                const visibility    = Math.max(
                    visibilityFromPaths[x][y],
                    visibilityFromTiles[x][y],
                    visibilityFromUnits[x][y],
                );
                if ((visibility === Visibility.TrueVision)                                  ||
                    ((visibility === Visibility.InsideVision) && (!tile.checkIsUnitHider()))
                ) {
                    tiles.add(tile);
                }
            }
        });
        return tiles;
    }
    export function getAllTilesVisibleToTeams(war: BwWar, teamIndexes: Set<number>): Set<BwTile> {
        const fogMap                = war.getFogMap();
        const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
        const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
        const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const tiles                 = new Set<BwTile>();
        const hasFog                = fogMap.checkHasFogCurrently();

        tileMap.forEachTile(tile => {
            const gridIndex = tile.getGridIndex();
            if ((!hasFog)                                                                       ||
                (teamIndexes.has(tile.getTeamIndex()))                                          ||
                (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, teamIndexes))           ||
                (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, teamIndexes))
            ) {
                tiles.add(tile);
            } else {
                const { x, y }      = gridIndex;
                const visibility    = Math.max(
                    visibilityFromPaths[x][y],
                    visibilityFromTiles[x][y],
                    visibilityFromUnits[x][y],
                );
                if ((visibility === Visibility.TrueVision)                                  ||
                    ((visibility === Visibility.InsideVision) && (!tile.checkIsUnitHider()))
                ) {
                    tiles.add(tile);
                }
            }
        });
        return tiles;
    }
    // export function getAllTilesVisibleToUser(war: BwWar, userId: number): Set<BwTile> {
    //     const fogMap                = war.getFogMap();
    //     const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForUser(userId);
    //     const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForUser(userId);
    //     const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForUser(userId);
    //     const observerTeamIndexes   = war.getWatcherTeamIndexes(userId);
    //     const unitMap               = war.getUnitMap();
    //     const tileMap               = war.getTileMap();
    //     const tiles                 = new Set<BwTile>();
    //     const hasFog                = fogMap.checkHasFogCurrently();

    //     tileMap.forEachTile(tile => {
    //         const gridIndex = tile.getGridIndex();
    //         if ((!hasFog)                                                                               ||
    //             (observerTeamIndexes.has(tile.getTeamIndex()))                                          ||
    //             (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, observerTeamIndexes))           ||
    //             (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes))  ||
    //             (observerTeamIndexes.has(tile.getTeamIndex()))
    //         ) {
    //             tiles.add(tile);
    //         } else {
    //             const { x, y }      = gridIndex;
    //             const visibility    = Math.max(
    //                 visibilityFromPaths[x][y],
    //                 visibilityFromTiles[x][y],
    //                 visibilityFromUnits[x][y],
    //             );
    //             if ((visibility === Visibility.TrueVision)                                  ||
    //                 ((visibility === Visibility.InsideVision) && (!tile.checkIsUnitHider()))
    //             ) {
    //                 tiles.add(tile);
    //             }
    //         }
    //     });
    //     return tiles;
    // }

    function _checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap: BwUnitMap, origin: GridIndex, teamIndexes: Set<number>): boolean {
        for (const adjacentGrid of GridIndexHelpers.getAdjacentGrids(origin, unitMap.getMapSize())) {
            const unit = unitMap.getUnitOnMap(adjacentGrid);
            if ((unit) && (teamIndexes.has(unit.getTeamIndex()!))) {
                return true;
            }
        }
        return false;
    }

    function _checkHasUnitWithTeamIndexesOnGrid(unitMap: BwUnitMap, gridIndex: GridIndex, teamIndexes: Set<number>): boolean {
        const unit = unitMap.getUnitOnMap(gridIndex);
        return (unit != null) && (teamIndexes.has(unit.getTeamIndex()!));
    }
}
