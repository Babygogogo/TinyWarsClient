
namespace TinyWars.Utility.DamageCalculator {
    import BwUnit       = BaseWar.BwUnit;
    import BwWar        = BaseWar.BwWar;
    import BwTile       = BaseWar.BwTile;
    import BwHelpers    = BaseWar.BwHelpers;
    import GridIndex    = Types.GridIndex;

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
        // TODO: take skill into account.
        const randomNumber = war.getRandomNumber();
        if (randomNumber == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty randomNumber.`);
            return undefined;
        }

        const lowerLimit = war.getSettingsLuckLowerLimit(playerIndex);
        if (lowerLimit == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty lowerLimit.`);
            return undefined;
        }

        const upperLimit = war.getSettingsLuckUpperLimit(playerIndex);
        if (upperLimit == null) {
            Logger.error(`DamageCalculator.getLuckValue() empty upperLimit.`);
            return undefined;
        }

        return Math.floor(randomNumber * (upperLimit - lowerLimit + 1)) + lowerLimit;
    }

    function getAttackBonusMultiplier(
        war                 : BwWar,
        attacker            : BwUnit,
        attackerGridIndex   : GridIndex,
        target              : BwUnit | BwTile,
        targetGridIndex     : GridIndex
    ): number | undefined {
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

        const settingsModifier = war.getSettingsAttackPowerModifier(playerIndex);
        if (settingsModifier == null) {
            Logger.error(`DamageCalculator.getAttackBonusMultiplier() empty settingsModifier.`);
            return undefined;
        }

        let amountFromGlobalTiles   = 0;
        tileMap.forEachTile(tile => {
            if (tile.getPlayerIndex() === playerIndex) {
                amountFromGlobalTiles += tile.getGlobalAttackBonus() || 0;
            }
        });

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
            tileMap.forEachTile(tile => {
                if (tile.getPlayerIndex() === target.getPlayerIndex()) {
                    amountFromGlobalTiles += tile.getGlobalDefenseBonus() || 0;
                }
            });

            const totalAmount = amountFromTile + amountFromPromotion + amountFromCo + amountFromGlobalTiles;
            return totalAmount >= 0
                ? 1 / (1 + totalAmount / 100)
                : 1 - totalAmount / 100;
        }
    }

    function checkCanAttack(
        attacker            : BwUnit,
        attackerMovePath    : GridIndex[] | undefined,
        target              : BwUnit | BwTile,
        targetMovePath      : GridIndex[] | undefined
    ): boolean {
        if ((!attacker) || (!target) || (attacker.getTeamIndex() === target.getTeamIndex())) {
            return false;
        }

        const armorType         = target.getArmorType();
        const attackerGridIndex = attackerMovePath ? attackerMovePath[attackerMovePath.length - 1] : attacker.getGridIndex();
        const targetGridIndex   = targetMovePath   ? targetMovePath[targetMovePath.length - 1]     : target.getGridIndex();
        if ((!attackerGridIndex)                                                                                                            ||
            (!targetGridIndex)                                                                                                              ||
            (armorType == null)                                                                                                             ||
            ((!attacker.checkCanAttackAfterMove()) && (attackerMovePath) && (attackerMovePath.length > 1))                                  ||
            (!checkIsInAttackRange(attackerGridIndex, targetGridIndex, attacker.getMinAttackRange(), attacker.getFinalMaxAttackRange()))    ||
            ((target instanceof BwUnit) && (target.getIsDiving()) && (!attacker.checkCanAttackDivingUnits()))
        ) {
            return false;
        }

        return attacker.getBaseDamage(armorType) != null;
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
            Logger.error(`DamageCalculator.getAttackDamage() empty targetArmorType.`)
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

        const attackBonusMultiplier = getAttackBonusMultiplier(war, attacker, attackerGridIndex, target, targetGridIndex);
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

        return Math.max(0, Math.floor(
            (baseAttackDamage * attackBonusMultiplier + luckValue)  *
            (BwHelpers.getNormalizedHp(attackerHp) / 10)            *
            defenseBonusMultiplier
        ));
    }

    function getBattleDamage(
        war                 : BwWar,
        attackerMovePath    : GridIndex[],
        launchUnitId        : number | undefined | null,
        targetGridIndex     : GridIndex,
        isWithLuck          : boolean
    ): (number | undefined)[] {
        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`DamageCalculator.getBattleDamage() empty unitMap.`);
            return [];
        }

        const tileMap = war.getTileMap();
        if (tileMap == null) {
            Logger.error(`DamageCalculator.getBattleDamage() empty tileMap.`);
            return [];
        }

        const attacker = unitMap.getUnit(attackerMovePath[0], launchUnitId);
        if (!attacker) {
            Logger.error(`DamageCalculator.getBattleDamage() failed to get the attacker.`);
            return [];
        }

        const attackerHp = attacker.getCurrentHp();
        if (attackerHp == null) {
            Logger.error(`DamageCalculator.getBattleDamage() failed the attacker hp is empty!`);
            return [];
        }

        const target = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
        if (!target) {
            Logger.error(`DamageCalculator.getBattleDamage() failed to get the target.`);
            return [];
        }

        const targetHp = target.getCurrentHp();
        if (targetHp == null) {
            Logger.error(`DamageCalculator.getBattleDamage() failed the target hp is empty!`);
            return [];
        }

        if (!checkCanAttack(attacker, attackerMovePath, target, undefined)) {
            return [];
        } else {
            const attackerGridIndex = attackerMovePath[attackerMovePath.length - 1];
            const attackDamage      = getAttackDamage(war, attacker, attackerGridIndex, attackerHp, target, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                Logger.error(`DamageCalculator.getBattleDamage() ???`);
                return [];
            } else {
                if ((target instanceof BwTile)                                              ||
                    (GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex) > 1)  ||
                    (!checkCanAttack(target, undefined, attacker, attackerMovePath))
                ) {
                    return [attackDamage, undefined];
                } else {
                    return [
                        attackDamage,
                        getAttackDamage(war, target, targetGridIndex, targetHp - attackDamage, attacker, attackerGridIndex, isWithLuck)
                    ];
                }
            }
        }
    }

    export function getEstimatedBattleDamage(war: BwWar, attackerMovePath: GridIndex[], launchUnitId: number | undefined | null, targetGridIndex: GridIndex): (number | undefined)[] {
        return getBattleDamage(war, attackerMovePath, launchUnitId, targetGridIndex, false);
    }

    export function getFinalBattleDamage(war: BwWar, attackerMovePath: GridIndex[], launchUnitId: number | undefined | null, targetGridIndex: GridIndex): (number | undefined)[] {
        return getBattleDamage(war, attackerMovePath, launchUnitId, targetGridIndex, true);
    }
}
