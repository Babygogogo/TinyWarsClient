
namespace TinyWars.Utility.DestructionHelpers {
    import GridIndex    = Types.GridIndex;
    import BwWar        = BaseWar.BwWar;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, retainVisibility: boolean, showExplosionEffect: boolean): void {
        resetTile(war, gridIndex);

        const unitMap           = war.getUnitMap();
        const unit              = unitMap.getUnitOnMap(gridIndex)!;

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

    export function destroyPlayerForce(war: BwWar, playerIndex: number, showExplosionEffect: boolean): void {
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

    function resetTile(war: BwWar, gridIndex: GridIndex): void {
        const tile = war.getTileMap().getTile(gridIndex);
        tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
    }
}
