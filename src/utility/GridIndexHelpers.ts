
namespace TinyWars.Utility.GridIndexHelpers {
    import GridIndex = Types.GridIndex;

    export function getDistance(g1: GridIndex, g2: GridIndex): number {
        return Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
    }

    export function checkIsEqual(g1: Types.GridIndex, g2: Types.GridIndex): boolean {
        return (g1.x === g2.x) && (g1.y === g2.y);
    }
}

