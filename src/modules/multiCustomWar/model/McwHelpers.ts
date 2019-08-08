
namespace TinyWars.MultiCustomWar.McwHelpers {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
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
        _pushToAvailableMovableGrids(availableGrids, origin, undefined, 0);

        let index = 0;
        while (index < availableGrids.length) {
            const availableGrid = availableGrids[index];
            const { currGridIndex, totalMoveCost } = availableGrid;
            if (_checkAndUpdateMovableArea(area, currGridIndex, availableGrid.prevGridIndex, totalMoveCost)) {
                for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currGridIndex)) {
                    const nextMoveCost = moveCostGetter(nextGridIndex);
                    if ((nextMoveCost != null) && (nextMoveCost + totalMoveCost <= maxMoveCost)) {
                        _pushToAvailableMovableGrids(availableGrids, nextGridIndex, currGridIndex, nextMoveCost + totalMoveCost);
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

    export function updateTilesAndUnitsOnVisibilityChanged(war: McwWar): void {
        const playerIndexLoggedIn   = war.getPlayerIndexLoggedIn();
        const fogMap                = war.getFogMap();

        const tileMap = war.getTileMap();
        tileMap.forEachTile(tile => {
            const gridIndex = tile.getGridIndex();
            if (VisibilityHelpers.checkIsTileVisibleToPlayer(war, gridIndex, playerIndexLoggedIn)) {
                if (tile.getIsFogEnabled()) {
                    const playerIndex = tile.getPlayerIndex();
                    if (playerIndex > 0) {
                        fogMap.updateMapFromTilesForPlayerOnGettingOwnership(playerIndex, gridIndex, tile.getVisionRangeForPlayer(playerIndex));
                    }

                    tile.setFogDisabled();
                }
            } else {
                if (!tile.getIsFogEnabled()) {
                    const playerIndex = tile.getPlayerIndex();
                    if (playerIndex > 0) {
                        fogMap.updateMapFromTilesForPlayerOnLosingOwnership(playerIndex, gridIndex, tile.getVisionRangeForPlayer(playerIndex));
                    }

                    tile.setFogEnabled();
                }
            }
            tile.updateView();
        });

        war.getUnitMap().forEachUnitOnMap(unit => {
            const gridIndex = unit.getGridIndex();
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToPlayer({
                war,
                gridIndex,
                unitType            : unit.getType(),
                isDiving            : unit.getIsDiving(),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerPlayerIndex : playerIndexLoggedIn,
            })) {
                unit.setViewVisible(true);
            } else {
                DestructionHelpers.removeUnitOnMap(war, gridIndex);
            }
        });

        tileMap.getView().updateCoZone();
    }

    export function getUnitProductionCost(war: McwWar, unitType: UnitType): number | undefined {
        // TODO: take skills into account.
        const cfg = ConfigManager.getUnitTemplateCfg(war.getConfigVersion(), unitType);
        return cfg ? cfg.productionCost : undefined;
    }

    function _pushToAvailableMovableGrids(grids: AvailableMovableGrid[], gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): void {
        grids.push({
            currGridIndex: gridIndex,
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
            totalMoveCost,
        });
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
}
