
namespace TinyWars.Utility.VisibilityCalculator {
    import McWar        = MultiCustomWar.McWar;
    import McUnit       = MultiCustomWar.McUnit;
    // import McTile       = MultiCustomWar.McTile;
    import GridIndex    = Types.GridIndex;

    type Discoveries = {
        tiles: MultiCustomWar.McTile[],
        units: McUnit[],
    }

    export function checkIsUnitOnMapVisibleToPlayer(
        war                 : McWar,
        gridIndex           : GridIndex,
        unitType            : Types.UnitType,
        isDiving            : boolean,
        unitPlayerIndex     : number,
        targetPlayerIndex   : number,
    ): boolean {
        Logger.error("VisibilityCalculator.checkIsUnitOnMapVisibleToPlayer() TODO!!");
        return true;
    }

    export function checkIsTileVisibleToPlayer(war: McWar, gridIndex: GridIndex, targetPlayerIndex: number): boolean {
        Logger.error("VisibilityCalculator.checkIsTileVisibleToPlayer() TODO!!");
        return true;
    }

    export function getDiscoveriesByPath(war: McWar, path: GridIndex[], unit: McUnit, isUnitDestroyed: boolean): Discoveries {
        Logger.error("VisibilityCalculator.getDiscoveriesByPath() TODO!!");
        return { tiles: [], units: [] };
    }

    export function getDiscoveriesByBuild(war: McWar, gridIndex: GridIndex, builder: McUnit): Discoveries {
        Logger.error("VisibilityCalculator.getDiscoveriesByBuild() TODO!!");
        return { tiles: [], units: [] };
    }

    export function getDiscoveriesByCapture(war: McWar, gridIndex: GridIndex): Discoveries {
        Logger.error("VisibilityCalculator.getDiscoveriesByCapture() TODO!!")
        return { tiles: [], units: [] };
    }

    export function getDiscoveriesByFlare(war: McWar, gridIndex: GridIndex, radius: number): Discoveries {
        Logger.error("VisibilityCalculator.getDiscoveriesByFlare() TODO!!");
        return { tiles: [], units: [] };
    }
}
