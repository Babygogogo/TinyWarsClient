
namespace TinyWars.Utility.DamageCalculator {
    import BwUnit       = BaseWar.BwUnit;
    import BwWar        = BaseWar.BwWar;
    import BwTile       = BaseWar.BwTile;
    import GridIndex    = Types.GridIndex;

    function checkIsInAttackRange(attackerGridIndex: GridIndex, targetGridIndex: GridIndex, minRange: number | null | undefined, maxRange: number | null | undefined): boolean {
        if ((minRange == null) || (maxRange == null)) {
            return false;
        } else {
            const distance = GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex);
            return (distance >= minRange) && (distance <= maxRange);
        }
    }

    function getLuckValue(war: BwWar, playerIndex: number): number {
        // TODO: take skill into account.
        return Math.floor(war.getRandomNumberGenerator()() * 11);
    }

    function getAttackBonusMultiplier(war: BwWar, attacker: BwUnit, attackerGridIndex: GridIndex, target: BwUnit | BwTile, targetGridIndex: GridIndex): number {
        const playerIndex   = attacker.getPlayerIndex();
        let bonus           = war.getSettingsAttackPowerModifier() + attacker.getPromotionAttackBonus();
        // TODO: take skill into account.

        war.getTileMap().forEachTile(tile => {
            if (tile.getPlayerIndex() === playerIndex) {
                bonus += tile.getGlobalAttackBonus();
            }
        });

        return Math.max(1 + bonus / 100, 0);
    }

    function getDefenseBonusMultiplier(war: BwWar, attacker: BwUnit, attackerGridIndex: GridIndex, target: BwUnit | BwTile, targetGridIndex: GridIndex): number {
        if (target instanceof BwTile) {
            return 1;
        } else {
            const tileMap   = war.getTileMap();
            let bonus       = tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(target) + target.getPromotionDefenseBonus();
            // TODO: take skill into account.

            tileMap.forEachTile(tile => {
                if (tile.getPlayerIndex() === target.getPlayerIndex()) {
                    bonus   += tile.getGlobalDefenseBonus();
                }
            })

            return bonus >= 0
                ? 1 / (1 + bonus / 100)
                : 1 - bonus / 100;
        }
    }

    function checkCanAttack(attacker: BwUnit, attackerMovePath: GridIndex[] | undefined, target: BwUnit | BwTile, targetMovePath: GridIndex[] | undefined): boolean {
        if ((!attacker) || (!target) || (attacker.getTeamIndex() === target.getTeamIndex())) {
            return false;
        }

        const armorType         = target.getArmorType();
        const attackerGridIndex = attackerMovePath ? attackerMovePath[attackerMovePath.length - 1] : attacker.getGridIndex();
        const targetGridIndex   = targetMovePath   ? targetMovePath[targetMovePath.length - 1]     : target.getGridIndex();
        if ((armorType == null)                                                                                                     ||
            ((!attacker.checkCanAttackAfterMove()) && (attackerMovePath) && (attackerMovePath.length > 1))                          ||
            (!checkIsInAttackRange(attackerGridIndex, targetGridIndex, attacker.getMinAttackRange(), attacker.getMaxAttackRange())) ||
            ((target instanceof BwUnit) && (target.getIsDiving()) && (!attacker.checkCanAttackDivingUnits()))
        ) {
            return false;
        }

        return attacker.getBaseDamage(armorType) != null;
    }

    function getAttackDamage(war: BwWar, attacker: BwUnit, attackerGridIndex: GridIndex, attackerHp: number, target: BwTile | BwUnit, targetGridIndex: GridIndex, isWithLuck: boolean): number | undefined {
        const baseAttackDamage = attacker.getBaseDamage(target.getArmorType()!);
        if (baseAttackDamage == null) {
            return undefined;
        } else {
            if (attackerHp <= 0) {
                return 0;
            } else {
                const luckValue = ((isWithLuck) && (target.checkIsArmorAffectByLuck()))
                    ? getLuckValue(war, attacker.getPlayerIndex())
                    : 0
                return Math.floor(
                    (baseAttackDamage * getAttackBonusMultiplier(war, attacker, attackerGridIndex, target, targetGridIndex) + luckValue)    *
                    (Helpers.getNormalizedHp(attackerHp) / 10)                                                                              *
                    (getDefenseBonusMultiplier(war, attacker, attackerGridIndex, target, targetGridIndex))
                );
            }
        }
    }

    function getBattleDamage(war: BwWar, attackerMovePath: GridIndex[], launchUnitId: number | undefined | null, targetGridIndex: GridIndex, isWithLuck: boolean): (number | undefined)[] {
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(attackerMovePath[0], launchUnitId)!;
        const target    = unitMap.getUnitOnMap(targetGridIndex) || war.getTileMap().getTile(targetGridIndex);
        if (!checkCanAttack(attacker, attackerMovePath, target, undefined)) {
            return [undefined, undefined];
        } else {
            const attackerGridIndex = attackerMovePath[attackerMovePath.length - 1];
            const attackDamage      = getAttackDamage(war, attacker, attackerGridIndex, attacker.getCurrentHp(), target, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                Logger.error(`DamageCalculator.getBattleDamage() ???`);
                return [undefined, undefined];
            } else {
                if ((target instanceof BwTile)                                             ||
                    (GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex) > 1)  ||
                    (!checkCanAttack(target, undefined, attacker, attackerMovePath))
                ) {
                    return [attackDamage, undefined];
                } else {
                    return [
                        attackDamage,
                        getAttackDamage(war, target, targetGridIndex, target.getCurrentHp() - attackDamage, attacker, attackerGridIndex, isWithLuck)
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
