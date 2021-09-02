
import TwnsBwWar            from "../../baseWar/model/BwWar";
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import CommonConstants      from "../helpers/CommonConstants";
import Helpers              from "../helpers/Helpers";
import Logger               from "../helpers/Logger";
import Types                from "../helpers/Types";

namespace WarDestructionHelpers {
    import GridIndex        = Types.GridIndex;
    import TileObjectType   = Types.TileObjectType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwWar            = TwnsBwWar.BwWar;

    export function destroyUnitOnMap(war: BwWar, gridIndex: GridIndex, showExplosionEffect: boolean): ClientErrorCode {
        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(gridIndex);
        if (unit == null) {
            return ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_00;
        }

        const allCoUnits = unitMap.getAllCoUnits(unit.getPlayerIndex());
        if (allCoUnits == null) {
            return ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_01;
        }

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
            const currentEnergy = player.getCoCurrentEnergy();
            if (currentEnergy == null) {
                return ClientErrorCode.DestructionHelpers_DestroyUnitOnMap_02;
            }

            const totalCoUnitsCount = allCoUnits.length;
            const restCoUnitsCount  = totalCoUnitsCount - destroyedCoUnitsCount;
            player.setCoIsDestroyedInTurn(true);
            if (restCoUnitsCount > 0) {
                player.setCoCurrentEnergy(Math.floor(currentEnergy * restCoUnitsCount / totalCoUnitsCount));
            } else {
                player.setCoCurrentEnergy(0);
                player.setCoUsingSkillType(Types.CoSkillType.Passive);
            }
        }

        if (showExplosionEffect) {
            const gridVisionEffect = war.getGridVisionEffect();
            (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

            const warView = war.getView();
            (warView) && (warView.showVibration());
        }

        return ClientErrorCode.NoError;
    }

    export function destroyPlayerForce(war: BwWar, playerIndex: number, showExplosionEffect: boolean): void {
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        const gridVisionEffect  = showExplosionEffect ? war.getGridVisionEffect() : undefined;
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
        }

        for (const tile of tileMap.getAllTiles()) {
            if (tile.getPlayerIndex() === playerIndex) {
                const baseType = tile.getBaseType();
                if (baseType == null) {
                    Logger.error(`DestructionHelpers.destroyPlayerForce() empty baseType.`);
                    continue;
                }

                const objectType = tile.getObjectType();
                if (objectType == null) {
                    Logger.error(`DestructionHelpers.destroyPlayerForce() empty objectType.`);
                    continue;
                }

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
        player.setAliveState(Types.PlayerAliveState.Dead);
        player.setCoIsDestroyedInTurn(true);
        player.setCoCurrentEnergy(0);
        player.setCoUsingSkillType(Types.CoSkillType.Passive);

        war.getDrawVoteManager().setRemainingVotes(undefined);
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
        const unitMap = war.getUnitMap();
        if (war.getFogMap().checkHasFogCurrently()) {
            for (const [unitId, unit] of unitMap.getLoadedUnits()) {
                const teamIndex = unit.getTeamIndex();
                if (teamIndex == null) {
                    Logger.error(`DestructionHelpers.removeInvisibleLoadedUnits() empty teamIndex.`);
                    continue;
                }

                if (!watcherTeamIndexes.has(teamIndex)) {
                    unitMap.removeUnitLoaded(unitId);
                }
            }
        }
    }
}

export default WarDestructionHelpers;
