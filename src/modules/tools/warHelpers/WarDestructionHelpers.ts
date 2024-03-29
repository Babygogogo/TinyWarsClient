
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarDestructionHelpers {
    import GridIndex        = Types.GridIndex;
    import BwWar            = BaseWar.BwWar;
    import BwUnit           = BaseWar.BwUnit;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const unit              = Helpers.getExisted(unitMap.getUnitOnMap(gridIndex), ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_00);
        const destroyedUnits    = [unit];
        unitMap.removeUnitOnMap(gridIndex, true);
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        updatePlayersOnUnitDestroyed(destroyedUnits);

        if (showExplosionEffect) {
            const gridVisionEffect = war.getGridVisualEffect();
            (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

            const warView = war.getView();
            (warView) && (warView.showVibration());
            SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
        }
    }
    export function destroyUnitLoaded(war: BwWar, unitId: number): void {
        const unitMap           = war.getUnitMap();
        const unit              = Helpers.getExisted(unitMap.getUnitLoadedById(unitId));
        const destroyedUnits    = [unit];
        unitMap.removeUnitLoaded(unitId);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
            destroyedUnits.push(u);
        }

        updatePlayersOnUnitDestroyed(destroyedUnits);
    }
    /** @param destroyedUnits 必须属于同一个玩家 */
    function updatePlayersOnUnitDestroyed(destroyedUnits: BwUnit[]): void {
        const destroyedCoUnitsCount = destroyedUnits.filter(u => u.getHasLoadedCo()).length;
        if (destroyedCoUnitsCount > 0) {
            const player            = destroyedUnits[0].getPlayer();
            const restCoUnitsCount  = player.getWar().getUnitMap().getAllCoUnits(player.getPlayerIndex()).length;
            player.setCoIsDestroyedInTurn(true);
            if (restCoUnitsCount > 0) {
                player.setCoCurrentEnergy(Math.floor(player.getCoCurrentEnergy() * restCoUnitsCount / (restCoUnitsCount + destroyedCoUnitsCount)));
            } else {
                player.setCoCurrentEnergy(0);
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
            }
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
            SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
        }

        for (const tile of tileMap.getAllTiles()) {
            if (tile.getPlayerIndex() === playerIndex) {
                const baseType          = tile.getBaseType();
                const tileObjectType    = tile.getObjectType();
                const hp                = tile.getCurrentHp();
                const buildPoint        = tile.getCurrentBuildPoint();
                const capturePoint      = tile.getCurrentCapturePoint();
                tile.resetByTypeAndPlayerIndex({
                    baseType,
                    objectType  : tile.getGameConfig().getTileObjectCfg(tileObjectType)?.typeAfterOwnerChange ?? tileObjectType,
                    playerIndex : CommonConstants.PlayerIndex.Neutral,
                });
                tile.setCurrentHp(hp);
                tile.setCurrentBuildPoint(buildPoint);
                tile.setCurrentCapturePoint(capturePoint);
            }
        }

        war.getFogMap().resetAllMapsForPlayer(playerIndex);

        const player = war.getPlayer(playerIndex);
        player.setAliveState(Types.PlayerAliveState.Dead);
        player.setCoIsDestroyedInTurn(true);
        player.setCoCurrentEnergy(0);
        player.setCoUsingSkillType(Types.CoSkillType.Passive);

        war.getDrawVoteManager().setRemainingVotes(null);
    }

    export function removeUnitOnMap(war: BwWar, gridIndex: GridIndex): void {
        war.getTileMap().getTile(gridIndex).updateOnUnitLeave();

        const unitMap   = war.getUnitMap();
        const unit      = Helpers.getExisted(unitMap.getUnitOnMap(gridIndex));

        unitMap.removeUnitOnMap(gridIndex, true);
        for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
            unitMap.removeUnitLoaded(u.getUnitId());
        }
    }
    export function removeInvisibleLoadedUnits(war: BwWar, watcherTeamIndexes: Set<number>): void {
        if ((war.getFogMap().checkHasFogCurrently())                &&
            (!war.getGameConfig().checkIsLoadedUnitVisibleInFog())
        ) {
            const unitMap = war.getUnitMap();
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
