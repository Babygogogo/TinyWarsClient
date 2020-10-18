
namespace TinyWars.Utility.DestructionHelpers {
    import BwWar            = BaseWar.BwWar;
    import GridIndex        = Types.GridIndex;
    import TileObjectType   = Types.TileObjectType;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const unit              = unitMap.getUnitOnMap(gridIndex)!;
        const destroyedUnits    = [unit];
        const allCoUnits        = unitMap.getAllCoUnits(unit.getPlayerIndex());
        unitMap.removeUnitOnMap(gridIndex, true);
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        const player                = unit.getPlayer();
        const destroyedCoUnitsCount = destroyedUnits.filter(unit => unit.getHasLoadedCo()).length;
        if (destroyedCoUnitsCount > 0) {
            const currentEnergy = player.getCoCurrentEnergy();
            if (currentEnergy == null) {
                Logger.error(`DestructionHelpers.destroyUnitOnMap() empty currentEnergy.`);
                return undefined;
            }

            const totalCoUnitsCount = allCoUnits.length;
            const restCoUnitsCount  = totalCoUnitsCount - destroyedCoUnitsCount;
            player.setCoIsDestroyedInTurn(true);
            if (restCoUnitsCount > 0) {
                player.setCoCurrentEnergy(Math.floor(currentEnergy * restCoUnitsCount / totalCoUnitsCount));
            } else {
                player.setCoCurrentEnergy(undefined);
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
            }
        }

        const gridVisionEffect = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
    }

    export function destroyPlayerForce(war: BwWar, playerIndex: number, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        const gridVisionEffect  = showExplosionEffect ? war.getGridVisionEffect() : undefined;
        unitMap.forEachUnitOnMap(unit => {
            if (unit.getPlayerIndex() === playerIndex) {
                const gridIndex = unit.getGridIndex();
                unitMap.removeUnitOnMap(gridIndex, true);
                tileMap.getTile(gridIndex).updateOnUnitLeave();
                (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
            }
        });
        unitMap.removeUnitsLoadedForPlayer(playerIndex);

        tileMap.forEachTile(tile => {
            if (tile.getPlayerIndex() === playerIndex) {
                const objectType    = tile.getObjectType();
                const hp            = tile.getCurrentHp();
                const buildPoint    = tile.getCurrentBuildPoint();
                const capturePoint  = tile.getCurrentCapturePoint();
                tile.resetByTypeAndPlayerIndex(
                    tile.getBaseType(),
                    objectType === TileObjectType.Headquarters ? TileObjectType.City : objectType,
                    CommonConstants.WarNeutralPlayerIndex,
                );
                tile.setCurrentHp(hp);
                tile.setCurrentBuildPoint(buildPoint);
                tile.setCurrentCapturePoint(capturePoint);
            };
        });

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        const player = war.getPlayer(playerIndex)!;
        player.setIsAlive(false);
        player.setCoIsDestroyedInTurn(true);
        player.setCoCurrentEnergy(undefined);
        player.setCoUsingSkillType(Types.CoSkillType.Passive);

        war.setRemainingVotesForDraw(undefined);
    }

    export function removeUnitOnMap(war: BwWar, gridIndex: GridIndex): void {
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(gridIndex)!;

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
        }
    }
    export function removeInvisibleLoadedUnits(war: BwWar, watcherTeamIndexes: Set<number>): void {
        const unitMap = war.getUnitMap();
        if (war.getFogMap().checkHasFogCurrently()) {
            for (const [unitId, unit] of unitMap.getLoadedUnits()) {
                if (!watcherTeamIndexes.has(unit.getTeamIndex())) {
                    unitMap.removeUnitLoaded(unitId);
                }
            }
        }
    }
}
