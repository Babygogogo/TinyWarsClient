
namespace TinyWars.SinglePlayerWar.SpwUtility {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import BwWar                = BaseWar.BwWar;
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

    export function updateTilesAndUnitsOnVisibilityChanged(war: BwWar): void {
        const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        const visibleUnits  = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
        war.getUnitMap().forEachUnitOnMap(unit => {
            unit.setViewVisible(visibleUnits.has(unit));
        });

        const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(war, teamIndexes);
        const tileMap       = war.getTileMap();
        tileMap.forEachTile(tile => {
            tile.setHasFog(!visibleTiles.has(tile));
            tile.flushDataToView();
        });
        tileMap.getView().updateCoZone();
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
