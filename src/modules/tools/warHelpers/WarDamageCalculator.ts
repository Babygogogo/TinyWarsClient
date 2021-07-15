
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import GridIndexHelpers     from "../helpers/GridIndexHelpers";
import Logger               from "../helpers/Logger";
import Types                from "../helpers/Types";
import ProtoTypes           from "../proto/ProtoTypes";
import WarCommonHelpers     from "./WarCommonHelpers";
import TwnsBwTile           from "../../baseWar/model/BwTile";
import TwnsBwUnit           from "../../baseWar/model/BwUnit";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import TwnsBwWar            from "../../baseWar/model/BwWar";

namespace WarDamageCalculator {
    import GridIndex            = Types.GridIndex;
    import IBattleDamageInfo    = ProtoTypes.Structure.IBattleDamageInfo;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwUnit               = TwnsBwUnit.BwUnit;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;
    import BwWar                = TwnsBwWar.BwWar;
    import BwTile               = TwnsBwTile.BwTile;

    function checkIsInAttackRange(
        attackerGridIndex   : GridIndex,
        targetGridIndex     : GridIndex,
        minRange            : number | null | undefined,
        maxRange            : number | null | undefined
    ): boolean {
        if ((minRange == null) || (maxRange == null)) {
            return false;
        } else {
            const distance = GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex);
            return (distance >= minRange) && (distance <= maxRange);
        }
    }

    function getLuckValue(war: BwWar, playerIndex: number): number | undefined {
        const randomNumber = war.getRandomNumberManager().getRandomNumber();
        if (randomNumber == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty randomNumber.`);
            return undefined;
        }

        const lowerLimit = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
        if (lowerLimit == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty lowerLimit.`);
            return undefined;
        }

        const upperLimit = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
        if (upperLimit == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty upperLimit.`);
            return undefined;
        }

        return Math.floor(randomNumber * (upperLimit - lowerLimit + 1)) + lowerLimit;
    }

    export function getDamageMultiplierForDefenseBonus(bonus: number): number {    // DONE
        return (bonus >= 0)
            ? 1 / (1 + bonus / 100)
            : 1 - bonus / 100;
    }

    function getAttackBonusMultiplier({ war, attacker, attackerGridIndex }: {
        war                 : BwWar;
        attacker            : BwUnit;
        attackerGridIndex   : GridIndex;
    }): number | undefined {
        const amountFromPromotion = attacker.getPromotionAttackBonus();
        if (amountFromPromotion == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty amountFromPromotion.`);
            return undefined;
        }

        const amountFromCo = attacker.getAttackModifierByCo(attackerGridIndex);
        if (amountFromCo == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty amountFromCo.`);
            return undefined;
        }

        const tileMap = war.getTileMap();
        if (tileMap == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty tileMap.`);
            return undefined;
        }

        const playerIndex = attacker.getPlayerIndex();
        if (playerIndex == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty playerIndex.`);
            return undefined;
        }

        const settingsModifier = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
        if (settingsModifier == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty settingsModifier.`);
            return undefined;
        }

        let amountFromGlobalTiles   = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getPlayerIndex() === playerIndex) {
                amountFromGlobalTiles += tile.getGlobalAttackBonus() || 0;
            }
        }

        const totalAmount = settingsModifier
            + amountFromPromotion
            + amountFromCo
            + amountFromGlobalTiles;
        return Math.max(1 + totalAmount / 100, 0);
    }

    function getDefenseBonusMultiplier(
        war                 : BwWar,
        attacker            : BwUnit,
        attackerGridIndex   : GridIndex,
        target              : BwUnit | BwTile,
        targetGridIndex     : GridIndex
    ): number | undefined {
        if (target instanceof BwTile) {
            return 1;
        } else {
            const tileMap = war.getTileMap();
            if (tileMap == null) {
                Logger.error(`DamageCalculator.getDefenseBonusMultiplier() empty tileMap.`);
                return undefined;
            }

            const tile = tileMap.getTile(targetGridIndex);
            if (!tile) {
                Logger.error(`DamageCalculator.getDefenseBonusMultiplier() the target is not on a tile?! targetGridIndex: ${targetGridIndex}`);
                return undefined;
            }

            const amountFromTile = tile.getDefenseAmountForUnit(target);
            if (amountFromTile == null) {
                Logger.error(`DamageCalculator.getDefenseBonusMultiplier() empty amountFromTile.`);
                return undefined;
            }

            const amountFromPromotion = target.getPromotionDefenseBonus();
            if (amountFromPromotion == null) {
                Logger.error(`DamageCalculator.getDefenseBonusMultiplier() empty amountFromPromotion.`);
                return undefined;
            }

            const amountFromCo = target.getDefenseModifierByCo(targetGridIndex);
            if (amountFromCo == null) {
                Logger.error(`DamageCalculator.getDefenseBonusMultiplier() empty amountFromCo.`);
                return undefined;
            }

            let amountFromGlobalTiles = 0;
            for (const t of tileMap.getAllTiles()) {
                if (t.getPlayerIndex() === target.getPlayerIndex()) {
                    amountFromGlobalTiles += t.getGlobalDefenseBonus() || 0;
                }
            }

            return getDamageMultiplierForDefenseBonus(amountFromTile + amountFromPromotion + amountFromCo + amountFromGlobalTiles);
        }
    }

    function checkCanAttackTile(
        attackerUnit        : BwUnit,
        attackerMovePath    : GridIndex[],
        targetTile          : BwTile,
    ): boolean {
        if ((!attackerUnit) || (!targetTile) || (attackerUnit.getTeamIndex() === targetTile.getTeamIndex())) {
            return false;
        }

        const armorType         = targetTile.getArmorType();
        const attackerGridIndex = attackerMovePath[attackerMovePath.length - 1];
        const targetGridIndex   = targetTile.getGridIndex();
        if ((!attackerGridIndex)                                                                                                                ||
            (!targetGridIndex)                                                                                                                  ||
            (armorType == null)                                                                                                                 ||
            ((!attackerUnit.checkCanAttackAfterMove()) && (attackerMovePath) && (attackerMovePath.length > 1))                                  ||
            (!checkIsInAttackRange(attackerGridIndex, targetGridIndex, attackerUnit.getMinAttackRange(), attackerUnit.getFinalMaxAttackRange()))
        ) {
            return false;
        }

        return attackerUnit.getBaseDamage(armorType) != null;
    }

    function checkCanAttackUnit(
        attackerUnit        : BwUnit,
        attackerMovePath    : GridIndex[] | null | undefined,
        targetUnit          : BwUnit,
        targetMovePath      : GridIndex[] | null | undefined,
    ): boolean {
        if ((!attackerUnit) || (!targetUnit) || (attackerUnit.getTeamIndex() === targetUnit.getTeamIndex())) {
            return false;
        }

        const armorType         = targetUnit.getArmorType();
        const attackerGridIndex = attackerMovePath ? attackerMovePath[attackerMovePath.length - 1] : attackerUnit.getGridIndex();
        const targetGridIndex   = targetMovePath   ? targetMovePath[targetMovePath.length - 1]     : targetUnit.getGridIndex();
        if ((!attackerGridIndex)                                                                                                                    ||
            (!targetGridIndex)                                                                                                                      ||
            (armorType == null)                                                                                                                     ||
            ((!attackerUnit.checkCanAttackAfterMove()) && (attackerMovePath) && (attackerMovePath.length > 1))                                      ||
            (!checkIsInAttackRange(attackerGridIndex, targetGridIndex, attackerUnit.getMinAttackRange(), attackerUnit.getFinalMaxAttackRange()))    ||
            ((targetUnit.getIsDiving()) && (!attackerUnit.checkCanAttackDivingUnits()))
        ) {
            return false;
        }

        return attackerUnit.getBaseDamage(armorType) != null;
    }

    function getAttackDamage(
        war                 : BwWar,
        attacker            : BwUnit,
        attackerGridIndex   : GridIndex,
        attackerHp          : number,
        target              : BwTile | BwUnit,
        targetGridIndex     : GridIndex,
        isWithLuck          : boolean
    ): number | undefined {
        const targetArmorType = target.getArmorType();
        if (targetArmorType == null) {
            Logger.error(`DamageCalculator.getAttackDamage() empty targetArmorType.`);
            return undefined;
        }

        const baseAttackDamage = attacker.getBaseDamage(targetArmorType);
        if (baseAttackDamage == null) {
            return undefined;
        }

        const playerIndex = attacker.getPlayerIndex();
        if (playerIndex == null) {
            Logger.error(`DamageCalculator.getAttackDamage() the attacker has no playerIndex!`);
            return undefined;
        }

        if (attackerHp <= 0) {
            return 0;
        }

        const attackBonusMultiplier = getAttackBonusMultiplier({ war, attacker, attackerGridIndex });
        if (attackBonusMultiplier == null) {
            Logger.error(`DamageCalculator.getAttackDamage() empty attackBonusMultiplier.`);
            return undefined;
        }

        const defenseBonusMultiplier = getDefenseBonusMultiplier(war, attacker, attackerGridIndex, target, targetGridIndex);
        if (defenseBonusMultiplier == null) {
            Logger.error(`DamageCalculator.getAttackDamage() empty defenseBonusMultiplier.`);
            return undefined;
        }

        const luckValue = ((isWithLuck) && (target.checkIsArmorAffectByLuck()))
            ? getLuckValue(war, playerIndex)
            : 0;
        if (luckValue == null) {
            Logger.error(`DamageCalculator.getAttackDamage() empty luckValue.`);
            return undefined;
        }

        return Math.max(0, Math.floor(0.000001 +
            (baseAttackDamage * attackBonusMultiplier + luckValue)  *
            (WarCommonHelpers.getNormalizedHp(attackerHp) / 10)            *
            defenseBonusMultiplier
        ));
    }

    function getBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex, isWithLuck }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : number | undefined | null;
        targetGridIndex : GridIndex;
        isWithLuck      : boolean;
    }): { errorCode: ClientErrorCode, battleDamageInfoArray?: IBattleDamageInfo[] } {
        const unitMap       = war.getUnitMap();
        const attackerUnit  = unitMap.getUnit(attackerMovePath[0], launchUnitId);
        if (attackerUnit == null) {
            return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_00 };
        }

        const attackerHp = attackerUnit.getCurrentHp();
        if (attackerHp == null) {
            return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_01 };
        }

        const attackerUnitId = attackerUnit.getUnitId();
        if (attackerUnitId == null) {
            return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_02 };
        }

        const attackerGridIndex = attackerMovePath[attackerMovePath.length - 1];
        const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
        if (targetUnit) {
            const targetUnitHp = targetUnit.getCurrentHp();
            if (targetUnitHp == null) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_03 };
            }

            const targetUnitId = targetUnit.getUnitId();
            if (targetUnitId == null) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_04 };
            }

            if (!checkCanAttackUnit(attackerUnit, attackerMovePath, targetUnit, undefined)) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_05 };
            }

            const attackDamage      = getAttackDamage(war, attackerUnit, attackerGridIndex, attackerHp, targetUnit, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_06 };
            }

            const damageInfoArray: IBattleDamageInfo[] = [{
                attackerUnitId,
                targetUnitId,
                damage              : attackDamage,
                targetTileGridIndex : null,
            }];

            if ((GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex) <= 1) &&
                (attackDamage < targetUnitHp)                                               &&
                (checkCanAttackUnit(targetUnit, undefined, attackerUnit, attackerMovePath))
            ) {
                const counterDamage = getAttackDamage(war, targetUnit, targetGridIndex, targetUnitHp - attackDamage, attackerUnit, attackerGridIndex, isWithLuck);
                if ((counterDamage == null) || (counterDamage < 0)) {
                    return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_07 };
                }

                damageInfoArray.push({
                    attackerUnitId      : targetUnitId,
                    targetUnitId        : attackerUnitId,
                    damage              : counterDamage,
                    targetTileGridIndex : null,
                });
            }

            return {
                errorCode               : ClientErrorCode.NoError,
                battleDamageInfoArray   : damageInfoArray,
            };
        }

        const targetTile = war.getTileMap().getTile(targetGridIndex);
        if (targetTile) {
            const targetTileHp = targetTile.getCurrentHp();
            if (targetTileHp == null) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_08 };
            }

            if (!checkCanAttackTile(attackerUnit, attackerMovePath, targetTile)) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_09 };
            }

            const attackDamage = getAttackDamage(war, attackerUnit, attackerGridIndex, attackerHp, targetTile, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_10 };
            }

            return {
                errorCode       : ClientErrorCode.NoError,
                battleDamageInfoArray : [{
                    attackerUnitId,
                    targetUnitId        : null,
                    targetTileGridIndex : targetGridIndex,
                    damage              : attackDamage,
                }],
            };
        }

        return { errorCode: ClientErrorCode.DamageCalculator_GetBattleDamage_11 };
    }

    export function getEstimatedBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : number | undefined | null;
        targetGridIndex : GridIndex;
    }): { errorCode: ClientErrorCode, battleDamageInfoArray?: IBattleDamageInfo[] } {
        return getBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex, isWithLuck: false });
    }

    export function getFinalBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : number | undefined | null;
        targetGridIndex : GridIndex;
    }): { errorCode: ClientErrorCode, battleDamageInfoArray?: IBattleDamageInfo[] } {
        return getBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex, isWithLuck: true });
    }

    export function getTotalDamage(targetUnitId: number, damageInfoArray: IBattleDamageInfo[]): number | null {
        let totalDamage: number | null = null;
        for (const info of damageInfoArray) {
            if (info.targetUnitId === targetUnitId) {
                totalDamage = (totalDamage || 0) + (info.damage || 0);
            }
        }
        return totalDamage;
    }

    type AttackAndCounterDamage = {
        attackDamage    : number | undefined;
        counterDamage   : number | undefined;
    };
    export function getAttackAndCounterDamage({ battleDamageInfoArray, attackerUnitId, targetGridIndex, unitMap }: {
        battleDamageInfoArray   : IBattleDamageInfo[];
        attackerUnitId          : number;
        targetGridIndex         : GridIndex;
        unitMap                 : BwUnitMap;
    }): { errorCode: ClientErrorCode, damages?: AttackAndCounterDamage } {
        let attackDamage    : number | undefined = undefined;
        let counterDamage   : number | undefined = undefined;
        for (const info of battleDamageInfoArray) {
            const damage = info.damage;
            if (damage == null) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_00 };
            }

            const infoAttackerUnitId = info.attackerUnitId;
            if (infoAttackerUnitId == null) {
                return { errorCode: ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_01 };
            }

            const infoTargetUnitId      = info.targetUnitId;
            const targetTileGridIndex   = info.targetTileGridIndex;
            if (attackerUnitId === infoAttackerUnitId) {
                if (targetTileGridIndex != null) {
                    if (GridIndexHelpers.checkIsEqual(targetGridIndex, targetTileGridIndex as GridIndex)) {
                        attackDamage = (attackDamage || 0) + damage;
                    }
                } else {
                    if (infoTargetUnitId == null) {
                        return { errorCode: ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_02 };
                    }

                    const unit = unitMap.getUnitById(infoTargetUnitId);
                    if (unit == null) {
                        return { errorCode: ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_03 };
                    }

                    if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                        attackDamage = (attackDamage || 0) + damage;
                    }
                }

            } else if (attackerUnitId === infoTargetUnitId) {
                const unit = unitMap.getUnitById(infoAttackerUnitId);
                if (unit == null) {
                    return { errorCode: ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_04 };
                }

                if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                    counterDamage = (counterDamage || 0) + damage;
                }
            }
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            damages     : { attackDamage, counterDamage },
        };
    }
}

export default WarDamageCalculator;
