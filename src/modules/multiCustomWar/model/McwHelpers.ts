
namespace TinyWars.MultiCustomWar.McwHelpers {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import GridIndex        = Types.GridIndex;
    import MovableGrid      = Types.MovableGrid;

    type AvailableMovableGrid = {
        currGridIndex   : GridIndex;
        prevGridIndex   : GridIndex | undefined;
        totalMoveCost   : number;
    }

    export function createMovableArea(origin: GridIndex, maxMoveCost: number, moveCostGetter: (g: GridIndex) => number | undefined): MovableGrid[][] {
        const area              = [] as MovableGrid[][];
        const availableGrids    = [] as AvailableMovableGrid[];
        _pushToAvailableMovableGrids(availableGrids, origin, undefined, 0);

        let index = 0;
        while (index < availableGrids.length) {
            const availableGrid = availableGrids[index];
            const { currGridIndex, totalMoveCost } = availableGrid;
            if (_updateMovableArea(area, currGridIndex, availableGrid.prevGridIndex, totalMoveCost)) {
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

    function _pushToAvailableMovableGrids(grids: AvailableMovableGrid[], gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): void {
        grids.push({
            currGridIndex: gridIndex,
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
            totalMoveCost,
        });
    }
    function _updateMovableArea(area: MovableGrid[][], gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): boolean {
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
