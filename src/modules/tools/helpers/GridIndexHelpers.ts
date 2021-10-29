
// import Types            from "./Types";
// import ProtoTypes       from "../proto/ProtoTypes";
// import CommonConstants  from "./CommonConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridIndexHelpers {
    import GridIndex            = Types.GridIndex;
    import MapSize              = Types.MapSize;
    import Direction            = Types.Direction;
    import Point                = Types.Point;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = CommonConstants.GridSize;
    const _ADJACENT_OFFSETS = [
        { offset: { x: -1, y:  0 }, direction: Direction.Left,  clockwiseOffset: { x:  1, y:  1 }, },
        { offset: { x:  1, y:  0 }, direction: Direction.Right, clockwiseOffset: { x: -1, y: -1 }, },
        { offset: { x:  0, y: -1 }, direction: Direction.Up,    clockwiseOffset: { x: -1, y:  1 }, },
        { offset: { x:  0, y:  1 }, direction: Direction.Down,  clockwiseOffset: { x:  1, y: -1 }, },
    ];

    export function convertGridIndex(raw: Types.Undefinable<ProtoTypes.Structure.IGridIndex>): GridIndex | null {
        return ((!raw) || (raw.x == null) || (raw.y == null))
            ? null
            : raw as GridIndex;
    }

    export function createGridIndexByPoint(p: Point): GridIndex {
        return {
            x: Math.floor(p.x / _GRID_WIDTH),
            y: Math.floor(p.y / _GRID_HEIGHT),
        };
    }

    export function createPointByGridIndex(g: GridIndex): Point {
        return {
            x: g.x * _GRID_WIDTH,
            y: g.y * _GRID_HEIGHT,
        };
    }

    export function add(g1: GridIndex, g2: GridIndex): GridIndex {
        return {
            x: g1.x + g2.x,
            y: g1.y + g2.y,
        };
    }
    export function sub(g1: GridIndex, g2: GridIndex): GridIndex {
        return {
            x: g1.x - g2.x,
            y: g1.y - g2.y,
        };
    }
    export function scale(g: GridIndex, factor: number): GridIndex {
        return {
            x: g.x * factor,
            y: g.y * factor,
        };
    }
    export function clone(g: GridIndex): GridIndex {
        return {
            x: g.x,
            y: g.y,
        };
    }

    export function getDistance(g1: GridIndex, g2: GridIndex): number {
        return Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
    }
    export function getMinDistance(gridIndex: GridIndex, list: GridIndex[]): number {
        let minDistance = Number.MAX_VALUE;
        for (const g of list) {
            const distance = getDistance(gridIndex, g);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }
        return minDistance;
    }

    export function checkIsAdjacent(g1: GridIndex, g2: GridIndex): boolean {
        return getDistance(g1, g2) === 1;
    }

    export function checkIsEqual(g1: GridIndex, g2: GridIndex): boolean {
        return (g1.x === g2.x) && (g1.y === g2.y);
    }

    export function checkIsInsideMap(g: ProtoTypes.Structure.IGridIndex, mapSize: MapSize): boolean {
        const { x, y } = g;
        return (x != null)
            && (y != null)
            && (x >= 0)
            && (y >= 0)
            && (x < mapSize.width)
            && (y < mapSize.height);
    }

    export function getAdjacentGrids(g: GridIndex, mapSize: MapSize): GridIndex[] {
        const grids: GridIndex[] = [];
        for (const o of _ADJACENT_OFFSETS) {
            const adjacentGrid = add(g, o.offset);
            if ((!mapSize) || (checkIsInsideMap(adjacentGrid, mapSize))) {
                grids.push(adjacentGrid);
            }
        }
        return grids;
    }

    /**
     * If g1 is not adjacent to g2, Direction.Undefined is returned.
     * Else, if index1 is at the right side of index2, then Direction.Right is returned, and so on.
    */
    export function getAdjacentDirection(g1: GridIndex, g2: GridIndex): Direction {
        if ((g1) && (g2) && (getDistance(g1, g2) === 1)) {
            const offset = sub(g1, g2);
            for (const o of _ADJACENT_OFFSETS) {
                if (checkIsEqual(offset, o.offset)) {
                    return o.direction;
                }
            }
        }
        return Direction.Undefined;
    }

    export function getGridsWithinDistance(origin: GridIndex, minDistance: number, maxDistance: number, mapSize: MapSize, predicate?: (g: GridIndex) => boolean): GridIndex[] {
        const grids: GridIndex[] = [];
        if ((minDistance == 0)                  &&
            (maxDistance >= minDistance)        &&
            (checkIsInsideMap(origin, mapSize)) &&
            ((!predicate) || (predicate(origin)))) {
            grids.push(origin);
        }

        for (let distance = minDistance; distance <= maxDistance; ++distance) {
            for (const offsetItem of _ADJACENT_OFFSETS) {
                let gridIndex = add(origin, sub(scale(offsetItem.offset, distance), offsetItem.clockwiseOffset));
                for (let i = 1; i <= distance; ++i) {
                    gridIndex = add(gridIndex, offsetItem.clockwiseOffset);
                    if ((checkIsInsideMap(gridIndex, mapSize)) &&
                        ((!predicate) || (predicate(gridIndex)))) {
                        grids.push(gridIndex);
                    }
                }
            }
        }

        return grids;
    }

    export function getGridId(gridIndex: GridIndex, mapSize: MapSize): number {
        return gridIndex.y * mapSize.width + gridIndex.x;
    }
    export function getGridIndexByGridId(gridId: number, mapSize: MapSize): GridIndex {
        const width = mapSize.width;
        return {
            x   : gridId % width,
            y   : Math.floor(gridId / width),
        };
    }
}

// export default GridIndexHelpers;
