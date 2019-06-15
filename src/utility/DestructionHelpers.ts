
namespace TinyWars.Utility.DestructionHelpers {
    import GridIndex    = Types.GridIndex;
    import McwWar       = MultiCustomWar.McwWar;
    import ReplayWar    = Replay.ReplayWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // For multi custom war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function destroyUnitOnMap(war: McwWar, gridIndex: GridIndex, retainVisibility: boolean, showExplosionEffect: boolean): void {
        resetTile(war, gridIndex);

        const unitMap           = war.getUnitMap();
        const unit              = unitMap.getUnitOnMap(gridIndex)!;
        const destroyedUnits    = [unit];

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        if (!retainVisibility) {
            const playerIndex = unit.getPlayerIndex();
            war.getFogMap().updateMapFromUnitsForPlayerOnLeaving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex)!);
        }

        const gridVisionEffect = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
    }

    export function destroyPlayerForce(war: McwWar, playerIndex: number, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        unitMap.forEachUnitOnMap(unit => {
            if (unit.getPlayerIndex() === playerIndex) {
                const gridIndex = unit.getGridIndex();
                resetTile(war, gridIndex);
                unitMap.removeUnitOnMap(gridIndex, true);
                (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
            }
        });
        unitMap.removeUnitsLoadedForPlayer(playerIndex);

        war.getTileMap().forEachTile(tile => {
            (tile.getPlayerIndex() === playerIndex) && (tile.resetByPlayerIndex(0));
        });

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        war.getPlayer(playerIndex)!.setIsAlive(false);

        war.setRemainingVotesForDraw(undefined);
    }

    function resetTile(war: McwWar, gridIndex: GridIndex): void {
        const tile = war.getTileMap().getTile(gridIndex);
        tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // For replay.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function destroyUnitOnMapForReplay(war: ReplayWar, gridIndex: GridIndex, retainVisibility: boolean, showExplosionEffect: boolean): void {
        resetTileForReplay(war, gridIndex);

        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(gridIndex)!;

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
        }

        if (!retainVisibility) {
            const playerIndex = unit.getPlayerIndex();
            war.getFogMap().updateMapFromUnitsForPlayerOnLeaving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex)!);
        }

        const gridVisionEffect = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
    }

    export function destroyPlayerForceForReplay(war: ReplayWar, playerIndex: number, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const gridVisionEffect  = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        unitMap.forEachUnitOnMap(unit => {
            if (unit.getPlayerIndex() === playerIndex) {
                const gridIndex = unit.getGridIndex();
                resetTileForReplay(war, gridIndex);
                unitMap.removeUnitOnMap(gridIndex, true);
                (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
            }
        });
        unitMap.removeUnitsLoadedForPlayer(playerIndex);

        war.getTileMap().forEachTile(tile => {
            (tile.getPlayerIndex() === playerIndex) && (tile.resetByPlayerIndex(0));
        });

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        war.getPlayer(playerIndex)!.setIsAlive(false);

        war.setRemainingVotesForDraw(undefined);
    }

    function resetTileForReplay(war: ReplayWar, gridIndex: GridIndex): void {
        const tile = war.getTileMap().getTile(gridIndex);
        tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
    }
}
