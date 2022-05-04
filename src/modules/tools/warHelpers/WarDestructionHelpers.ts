
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarDestructionHelpers {
    import GridIndex        = Twns.Types.GridIndex;
    import TileObjectType   = Twns.Types.TileObjectType;
    import ClientErrorCode  = Twns.ClientErrorCode;
    import BwWar            = Twns.BaseWar.BwWar;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, showExplosionEffect: boolean): void {
        const unitMap       = war.getUnitMap();
        const unit          = Twns.Helpers.getExisted(unitMap.getUnitOnMap(gridIndex), ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_00);
        const allCoUnits    = unitMap.getAllCoUnits(unit.getPlayerIndex());
        unitMap.removeUnitOnMap(gridIndex, true);
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

        const destroyedUnits = [unit];
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        const player                = unit.getPlayer();
        const destroyedCoUnitsCount = destroyedUnits.filter(u => u.getHasLoadedCo()).length;
        if (destroyedCoUnitsCount > 0) {
            const currentEnergy     = player.getCoCurrentEnergy();
            const totalCoUnitsCount = allCoUnits.length;
            const restCoUnitsCount  = totalCoUnitsCount - destroyedCoUnitsCount;
            player.setCoIsDestroyedInTurn(true);
            if (restCoUnitsCount > 0) {
                player.setCoCurrentEnergy(Math.floor(currentEnergy * restCoUnitsCount / totalCoUnitsCount));
            } else {
                player.setCoCurrentEnergy(0);
                player.setCoUsingSkillType(Twns.Types.CoSkillType.Passive);
            }
        }

        if (showExplosionEffect) {
            const gridVisionEffect = war.getGridVisualEffect();
            (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

            const warView = war.getView();
            (warView) && (warView.showVibration());
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.Explode);
        }
    }

    export function destroyPlayerForce(war: BwWar, playerIndex: number, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        const gridVisionEffect  = showExplosionEffect ? war.getGridVisualEffect() : null;
        let hasRemovedUnit      = false;
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                hasRemovedUnit = true;

                const gridIndex = unit.getGridIndex();
                unitMap.removeUnitOnMap(gridIndex, true);
                tileMap.getTile(gridIndex).updateOnUnitLeave();
                (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));
            }
        }
        unitMap.removeUnitsLoadedForPlayer(playerIndex);
        if ((showExplosionEffect) && (hasRemovedUnit)) {
            const warView = war.getView();
            (warView) && (warView.showVibration());
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.Explode);
        }

        for (const tile of tileMap.getAllTiles()) {
            if (tile.getPlayerIndex() === playerIndex) {
                const baseType      = tile.getBaseType();
                const objectType    = tile.getObjectType();
                const hp            = tile.getCurrentHp();
                const buildPoint    = tile.getCurrentBuildPoint();
                const capturePoint  = tile.getCurrentCapturePoint();
                tile.resetByTypeAndPlayerIndex({
                    baseType,
                    objectType      : objectType === TileObjectType.Headquarters ? TileObjectType.City : objectType,
                    playerIndex     : CommonConstants.WarNeutralPlayerIndex,
                });
                tile.setCurrentHp(hp);
                tile.setCurrentBuildPoint(buildPoint);
                tile.setCurrentCapturePoint(capturePoint);
            }
        }

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        const player = war.getPlayer(playerIndex);
        player.setAliveState(Twns.Types.PlayerAliveState.Dead);
        player.setCoIsDestroyedInTurn(true);
        player.setCoCurrentEnergy(0);
        player.setCoUsingSkillType(Twns.Types.CoSkillType.Passive);

        war.getDrawVoteManager().setRemainingVotes(null);
    }

    export function removeUnitOnMap(war: BwWar, gridIndex: GridIndex): void {
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

        const unitMap   = war.getUnitMap();
        const unit      = Twns.Helpers.getExisted(unitMap.getUnitOnMap(gridIndex));

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
        }
    }
    export function removeInvisibleLoadedUnits(war: BwWar, watcherTeamIndexes: Set<number>): void {
        const unitMap = war.getUnitMap();
        if (war.getFogMap().checkHasFogCurrently()) {
            for (const [unitId, unit] of unitMap.getLoadedUnits()) {
                const teamIndex = unit.getTeamIndex();
                if (!watcherTeamIndexes.has(teamIndex)) {
                    unitMap.removeUnitLoaded(unitId);
                }
            }
        }
    }
}

// export default WarDestructionHelpers;
