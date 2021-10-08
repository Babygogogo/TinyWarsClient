
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarCommonHelpers     from "./WarCommonHelpers";

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
        minRange            : number | null,
        maxRange            : number | null
    ): boolean {
        if ((minRange == null) || (maxRange == null)) {
            return false;
        } else {
            const distance = GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex);
            return (distance >= minRange) && (distance <= maxRange);
        }
    }

    function getLuckValue(war: BwWar, attackerUnit: BwUnit, attackerGridIndex: GridIndex): number {
        const randomNumber          = war.getRandomNumberManager().getRandomNumber();
        const playerIndex           = attackerUnit.getPlayerIndex();
        const lowerLimitForSettings = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
        const upperLimitForSettings = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
        const modifierByCo          = attackerUnit.getLuckLimitModifierByCo(attackerGridIndex);
        const upperLimit            = upperLimitForSettings + modifierByCo.upper;
        const lowerLimit            = lowerLimitForSettings + modifierByCo.lower;
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
    }): number {
        const amountFromPromotion   = attacker.getPromotionAttackBonus();
        const amountFromCo          = attacker.getAttackModifierByCo(attackerGridIndex);
        const tileMap               = war.getTileMap();
        const playerIndex           = attacker.getPlayerIndex();
        const settingsModifier      = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
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
    ): number {
        if (target instanceof BwTile) {
            return 1;
        } else {
            const tileMap               = war.getTileMap();
            const tile                  = tileMap.getTile(targetGridIndex);
            const amountFromTile        = tile.getDefenseAmountForUnit(target);
            const amountFromPromotion   = target.getPromotionDefenseBonus();
            const amountFromCo          = target.getDefenseModifierByCo(targetGridIndex);
            let amountFromGlobalTiles   = 0;
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
        attackerMovePath    : GridIndex[] | null,
        targetUnit          : BwUnit,
        targetMovePath      : GridIndex[] | null,
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
    ): number {
        const targetArmorType   = Helpers.getExisted(target.getArmorType());
        const baseAttackDamage  = Helpers.getExisted(attacker.getBaseDamage(targetArmorType));
        if (attackerHp <= 0) {
            return 0;
        }

        const attackBonusMultiplier     = getAttackBonusMultiplier({ war, attacker, attackerGridIndex });
        const defenseBonusMultiplier    = getDefenseBonusMultiplier(war, attacker, attackerGridIndex, target, targetGridIndex);
        const luckValue                 = ((isWithLuck) && (target.checkIsArmorAffectByLuck()))
            ? getLuckValue(war, attacker, attackerGridIndex)
            : 0;
        return Math.max(0, Math.floor(0.000001 +
            (baseAttackDamage * attackBonusMultiplier + luckValue)  *
            (WarCommonHelpers.getNormalizedHp(attackerHp) / 10)     *
            defenseBonusMultiplier
        ));
    }

    function getBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex, isWithLuck }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        targetGridIndex : GridIndex;
        isWithLuck      : boolean;
    }): IBattleDamageInfo[] {
        const unitMap           = war.getUnitMap();
        const attackerUnit      = Helpers.getExisted(unitMap.getUnit(attackerMovePath[0], launchUnitId), ClientErrorCode.DamageCalculator_GetBattleDamage_00);
        const attackerHp        = attackerUnit.getCurrentHp();
        const attackerUnitId    = attackerUnit.getUnitId();
        const attackerGridIndex = attackerMovePath[attackerMovePath.length - 1];
        const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
        if (targetUnit) {
            const targetUnitHp = targetUnit.getCurrentHp();
            const targetUnitId = targetUnit.getUnitId();
            if (!checkCanAttackUnit(attackerUnit, attackerMovePath, targetUnit, null)) {
                throw Helpers.newError(`Can not attack.`, ClientErrorCode.DamageCalculator_GetBattleDamage_01);
            }

            const attackDamage = getAttackDamage(war, attackerUnit, attackerGridIndex, attackerHp, targetUnit, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                throw Helpers.newError(`Invalid attackDamage: ${attackDamage}`, ClientErrorCode.DamageCalculator_GetBattleDamage_02);
            }

            const damageInfoArray: IBattleDamageInfo[] = [{
                attackerUnitId,
                targetUnitId,
                damage              : attackDamage,
                targetTileGridIndex : null,
            }];

            if ((GridIndexHelpers.getDistance(attackerGridIndex, targetGridIndex) <= 1) &&
                (attackDamage < targetUnitHp)                                               &&
                (checkCanAttackUnit(targetUnit, null, attackerUnit, attackerMovePath))
            ) {
                const counterDamage = getAttackDamage(war, targetUnit, targetGridIndex, targetUnitHp - attackDamage, attackerUnit, attackerGridIndex, isWithLuck);
                if ((counterDamage == null) || (counterDamage < 0)) {
                    throw Helpers.newError(`Invalid counterDamage: ${counterDamage}`, ClientErrorCode.DamageCalculator_GetBattleDamage_03);
                }

                damageInfoArray.push({
                    attackerUnitId      : targetUnitId,
                    targetUnitId        : attackerUnitId,
                    damage              : counterDamage,
                    targetTileGridIndex : null,
                });
            }

            return damageInfoArray;
        }

        {
            const targetTile = war.getTileMap().getTile(targetGridIndex);
            if (!checkCanAttackTile(attackerUnit, attackerMovePath, targetTile)) {
                throw Helpers.newError(`Can not attack.`, ClientErrorCode.DamageCalculator_GetBattleDamage_04);
            }

            const attackDamage = getAttackDamage(war, attackerUnit, attackerGridIndex, attackerHp, targetTile, targetGridIndex, isWithLuck);
            if ((attackDamage == null) || (attackDamage < 0)) {
                throw Helpers.newError(`Invalid attackDamage.`, ClientErrorCode.DamageCalculator_GetBattleDamage_05);
            }

            return [{
                attackerUnitId,
                targetUnitId        : null,
                targetTileGridIndex : targetGridIndex,
                damage              : attackDamage,
            }];
        }
    }

    export function getEstimatedBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        targetGridIndex : GridIndex;
    }): IBattleDamageInfo[] {
        return getBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex, isWithLuck: false });
    }

    export function getFinalBattleDamage({ war, attackerMovePath, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        attackerMovePath: GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        targetGridIndex : GridIndex;
    }): IBattleDamageInfo[] {
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
        attackDamage    : number | null;
        counterDamage   : number | null;
    };
    export function getAttackAndCounterDamage({ battleDamageInfoArray, attackerUnitId, targetGridIndex, unitMap }: {
        battleDamageInfoArray   : IBattleDamageInfo[];
        attackerUnitId          : number;
        targetGridIndex         : GridIndex;
        unitMap                 : BwUnitMap;
    }): AttackAndCounterDamage {
        let attackDamage    : number | null = null;
        let counterDamage   : number | null = null;
        for (const info of battleDamageInfoArray) {
            const damage                = Helpers.getExisted(info.damage, ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_00);
            const infoAttackerUnitId    = Helpers.getExisted(info.attackerUnitId, ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_01);
            const infoTargetUnitId      = info.targetUnitId;
            const targetTileGridIndex   = info.targetTileGridIndex;
            if (attackerUnitId === infoAttackerUnitId) {
                if (targetTileGridIndex != null) {
                    if (GridIndexHelpers.checkIsEqual(targetGridIndex, targetTileGridIndex as GridIndex)) {
                        attackDamage = (attackDamage || 0) + damage;
                    }
                } else {
                    if (infoTargetUnitId == null) {
                        throw Helpers.newError(`Empty infoTargetUnitId.`, ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_02);
                    }

                    const unit = Helpers.getExisted(unitMap.getUnitById(infoTargetUnitId), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_03);
                    if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                        attackDamage = (attackDamage || 0) + damage;
                    }
                }

            } else if (attackerUnitId === infoTargetUnitId) {
                const unit = Helpers.getExisted(unitMap.getUnitById(infoAttackerUnitId), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_04);
                if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                    counterDamage = (counterDamage || 0) + damage;
                }
            }
        }

        return { attackDamage, counterDamage };
    }
}

// export default WarDamageCalculator;
