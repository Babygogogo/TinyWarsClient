
namespace TinyWars.Utility.DestructionHelpers {
    import GridIndex    = Types.GridIndex;
    import McWar        = MultiCustomWar.McWar;
    import McUnit       = MultiCustomWar.McUnit;

    export function destroyUnitOnMap(war: McWar, gridIndex: GridIndex, retainVisibility: boolean): McUnit[] {
        resetTile(war, gridIndex);

        const unitMap           = war.getUnitMap();
        const unit              = unitMap.getUnitOnMap(gridIndex)!;
        const destroyedUnits    = [unit];

        unitMap.removeUnitOnMap(gridIndex);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        if (!retainVisibility) {
            const playerIndex = unit.getPlayerIndex();
            war.getFogMap().updateMapFromUnitsForPlayerOnLeaving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex)!);
        }

        return destroyedUnits;
    }

    export function destroyPlayerForce(war: McWar, playerIndex: number): void {
        const unitMap = war.getUnitMap();
        unitMap.forEachUnitOnMap(unit => {
            if (unit.getPlayerIndex() === playerIndex) {
                const gridIndex = unit.getGridIndex();
                resetTile(war, gridIndex);
                unitMap.removeUnitOnMap(gridIndex);
            }
        });
        unitMap.removeUnitsLoadedForPlayer(playerIndex);

        war.getTileMap().forEachTile(tile => {
            (tile.getPlayerIndex() === playerIndex) && (tile.resetByPlayerIndex(0));
        });

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        war.getPlayer(playerIndex)!.setIsAlive(false);
    }

    function resetTile(war: McWar, gridIndex: GridIndex): void {
        const tile = war.getTileMap().getTile(gridIndex);
        tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
    }
}
