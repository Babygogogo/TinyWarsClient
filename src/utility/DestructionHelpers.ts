
namespace TinyWars.Utility.DestructionHelpers {
    import GridIndex    = Types.GridIndex;
    import BwWar        = BaseWar.BwWar;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, showExplosionEffect: boolean): void {
        resetTile(war, gridIndex);

        const unitMap           = war.getUnitMap();
        const unit              = unitMap.getUnitOnMap(gridIndex)!;
        const destroyedUnits    = [unit];

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        const player    = war.getPlayer(unit.getPlayerIndex())!;
        const coUnitId  = player.getCoUnitId();
        if (destroyedUnits.some(u => u.getUnitId() === coUnitId)) {
            player.setCoIsDestroyedInTurn(true);
            player.setCoUnitId(null);
            player.setCoCurrentEnergy(0);
            player.setCoUsingSkillType(Types.CoSkillType.Passive);
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

        const player = war.getPlayer(playerIndex)!;
        player.setIsAlive(false);
        player.setCoIsDestroyedInTurn(true);
        player.setCoUnitId(null);
        player.setCoCurrentEnergy(0);
        player.setCoUsingSkillType(Types.CoSkillType.Passive);

        war.setRemainingVotesForDraw(undefined);
    }

    export function removeUnitOnMap(war: BwWar, gridIndex: GridIndex): void {
        resetTile(war, gridIndex);

        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(gridIndex)!;

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
        }
    }
    export function removeEnemyUnitsLoaded(war: BwWar, selfTeamIndex: number): void {
        war.getUnitMap().removeEnemyUnitsLoaded(selfTeamIndex);
    }

    function resetTile(war: BwWar, gridIndex: GridIndex): void {
        const tile = war.getTileMap().getTile(gridIndex);
        tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
    }
}
