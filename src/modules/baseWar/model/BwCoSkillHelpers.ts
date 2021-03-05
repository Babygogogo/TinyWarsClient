
namespace TinyWars.BaseWar.BwCoSkillHelper {
    import Types                    = Utility.Types;
    import ProtoTypes               = Utility.ProtoTypes;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import ConfigManager            = Utility.ConfigManager;
    import Logger                   = Utility.Logger;
    import Helpers                  = Utility.Helpers;
    import GridIndex                = Types.GridIndex;
    import Structure                = ProtoTypes.Structure;
    import IDataForUseCoSkill       = Structure.IDataForUseCoSkill;
    import CommonConstants          = Utility.CommonConstants;

    type DamageMaps = {
        hpMap   : number[][];
        fundMap : number[][];
    }
    type ValueMaps = {
        hpMap       : number[][];
        fundMap     : number[][];
        sameTeamMap : boolean[][];
    }

    export function exeInstantSkill(war: BwWar, player: BwPlayer, gridIndex: GridIndex, skillId: number, extraData: IDataForUseCoSkill): void {
        const configVersion = war.getConfigVersion();
        if (configVersion == null) {
            Logger.error(`BwHelpers.exeInstantSkill() empty configVersion.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`BwHelpers.exeInstantSkill() empty unitMap.`);
            return undefined;
        }

        const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
        if (skillCfg == null) {
            Logger.error(`BwHelpers.exeInstantSkill() empty skillCfg.`);
            return undefined;
        }

        const playerIndex = player.getPlayerIndex();
        if (playerIndex == null) {
            Logger.error(`BwHelpers.exeInstantSkill() empty playerIndex.`);
            return undefined;
        }

        const coGridIndexList = unitMap.getCoGridIndexListOnMap(playerIndex);
        if (coGridIndexList == null) {
            Logger.error(`BwCoSkillHelpers.exeInstantSkill() empty coGridIndexList.`);
            return undefined;
        }

        exeSelfHpGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeEnemyHpGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeSelfFuelGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeEnemyFuelGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeSelfMaterialGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeEnemyMaterialGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeSelfPrimaryAmmoGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeEnemyPrimaryAmmoGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
        exeIndiscriminateAreaDamage(configVersion, skillCfg, unitMap, player, coGridIndexList, extraData);
        exeSelfPromotionGain(configVersion, skillCfg, unitMap, player, coGridIndexList);
    }

    function exeSelfHpGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.selfHpGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
            unitMap.forEachUnit(unit => {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty gridIndex.`);
                    return undefined;
                }

                const maxHp = unit.getMaxHp();
                if (maxHp == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty maxHp.`);
                    return undefined;
                }

                const currentHp = unit.getCurrentHp();
                if (currentHp == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfHpGain() empty currentHp.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                }
            });
        }
    }

    function exeEnemyHpGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.enemyHpGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
            unitMap.forEachUnit(unit => {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty gridIndex.`);
                    return undefined;
                }

                const maxHp = unit.getMaxHp();
                if (maxHp == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty maxHp.`);
                    return undefined;
                }

                const currentHp = unit.getCurrentHp();
                if (currentHp == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyHpGain() empty currentHp.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                }
            });
        }
    }

    function exeSelfFuelGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.selfFuelGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel == null) {
                        Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty maxFuel.`);
                        return undefined;
                    }

                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        Logger.error(`BwCoSkillHelpers.exeSelfFuelGain() empty currentFuel.`);
                        return undefined;
                    }

                    if (modifier > 0) {
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            currentFuel + Math.floor(maxFuel * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(currentFuel * (100 + modifier) / 100)
                        ));
                    }
                }
            });
        }
    }

    function exeEnemyFuelGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.enemyFuelGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel == null) {
                        Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty maxFuel.`);
                        return undefined;
                    }

                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        Logger.error(`BwCoSkillHelpers.exeEnemyFuelGain() empty currentFuel.`);
                        return undefined;
                    }

                    if (modifier > 0) {
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            currentFuel + Math.floor(maxFuel * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(currentFuel * (100 + modifier) / 100)
                        ));
                    }
                }
            });
        }
    }

    function exeSelfMaterialGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.selfMaterialGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = unit.getCurrentBuildMaterial();
                        if (currentBuildMaterial == null) {
                            Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty currentBuildMaterial.`);
                            return undefined;
                        }

                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                            ));
                        }
                    }

                    if (maxProduceMaterial != null) {
                        const currentProduceMaterial = unit.getCurrentProduceMaterial();
                        if (currentProduceMaterial == null) {
                            Logger.error(`BwCoSkillHelpers.exeSelfMaterialGain() empty currentProduceMaterial.`);
                            return undefined;
                        }

                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                currentProduceMaterial + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(currentProduceMaterial * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            });
        }
    }

    function exeEnemyMaterialGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.enemyMaterialGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = unit.getCurrentBuildMaterial();
                        if (currentBuildMaterial == null) {
                            Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty currentBuildMaterial.`);
                            return undefined;
                        }

                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                            ));
                        }
                    }

                    if (maxProduceMaterial != null) {
                        const currentProduceMaterial = unit.getCurrentProduceMaterial();
                        if (currentProduceMaterial == null) {
                            Logger.error(`BwCoSkillHelpers.exeEnemyMaterialGain() empty currentProduceMaterial.`);
                            return undefined;
                        }

                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                currentProduceMaterial + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(currentProduceMaterial * (100 + modifier) / 100)
                            ));
                        }
                    }
                }
            });
        }
    }

    function exeSelfPrimaryAmmoGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.selfPrimaryAmmoGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfPrimaryAmmoGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfPrimaryAmmoGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfPrimaryAmmoGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfPrimaryAmmoGain() empty gridIndex.`);
                    return undefined;
                }

                const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfPrimaryAmmoGain() empty currentAmmo.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (modifier > 0) {
                        unit.setPrimaryWeaponCurrentAmmo(Math.min(
                            maxAmmo,
                            currentAmmo + Math.floor(maxAmmo * modifier / 100)
                        ));
                    } else {
                        unit.setPrimaryWeaponCurrentAmmo(Math.max(
                            0,
                            Math.floor(currentAmmo * (100 + modifier) / 100)
                        ));
                    }
                }
            });
        }
    }

    function exeEnemyPrimaryAmmoGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.enemyPrimaryAmmoGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty gridIndex.`);
                    return undefined;
                }

                const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty currentAmmo.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (modifier > 0) {
                        unit.setPrimaryWeaponCurrentAmmo(Math.min(
                            maxAmmo,
                            currentAmmo + Math.floor(maxAmmo * modifier / 100)
                        ));
                    } else {
                        unit.setPrimaryWeaponCurrentAmmo(Math.max(
                            0,
                            Math.floor(currentAmmo * (100 + modifier) / 100)
                        ));
                    }
                }
            });
        }
    }

    function exeIndiscriminateAreaDamage(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
        extraData       : IDataForUseCoSkill,
    ): void {
        const cfg = skillCfg.indiscriminateAreaDamage;
        if (cfg) {
            const center = extraData.indiscriminateAreaDamageCenter;
            if (center == null) {
                Logger.error(`BwCoSkillHelpers.exeIndiscriminateAreaDamage() empty center.`);
                return undefined;
            }

            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwCoSkillHelpers.exeIndiscriminateAreaDamage() empty mapSize.`);
                return undefined;
            }

            const hpDamage = cfg[2] * CommonConstants.UnitHpNormalizer;
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(center as GridIndex, 0, cfg[1], mapSize)) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if (unit) {
                    const currentHp = unit.getCurrentHp();
                    if (currentHp == null) {
                        Logger.error(`BwCoSkillHelpers.exeIndiscriminateAreaDamage() empty currentHp.`);
                        return undefined;
                    }

                    unit.setCurrentHp(Math.max(1, currentHp - hpDamage));
                }
            }
        }
    }

    function exeSelfPromotionGain(
        configVersion   : string,
        skillCfg        : ProtoTypes.Config.ICoSkillCfg,
        unitMap         : BwUnitMap,
        player          : BwPlayer,
        coGridIndexList : GridIndex[],
    ): void {
        const cfg = skillCfg.selfPromotionGain;
        if (cfg) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty zoneRadius.`);
                return undefined;
            }

            const maxPromotion = ConfigManager.getUnitMaxPromotion(configVersion);
            if (maxPromotion == null) {
                Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty maxPromotion.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            unitMap.forEachUnit(unit => {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const currentPromotion = unit.getCurrentPromotion();
                    if (currentPromotion == null) {
                        Logger.error(`BwCoSkillHelpers.exeSelfPromotionGain() empty currentPromotion.`);
                        return undefined;
                    }

                    unit.setCurrentPromotion(Math.max(
                        0,
                        Math.min(
                            maxPromotion,
                            currentPromotion + modifier
                        ),
                    ));
                }
            });
        }
    }

    export function getDataForUseCoSkill(
        war         : SinglePlayerWar.SpwWar,
        player      : BwPlayer,
        skillIndex  : number,
    ): IDataForUseCoSkill | undefined {
        const configVersion = war.getConfigVersion();
        if (configVersion == null) {
            Logger.error(`BwHelpers.getDataForUseCoSkill() empty configVersion.`);
            return undefined;
        }

        const skillId = (player.getCoCurrentSkills() || [])[skillIndex];
        if (skillId == null) {
            Logger.error(`BwHelpers.getDataForUseCoSkill() empty skillId.`);
            return undefined;
        }

        const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
        if (skillCfg == null) {
            Logger.error(`BwHelpers.getDataForUseCoSkill() empty skillCfg.`);
            return undefined;
        }

        const dataForUseCoSkill: IDataForUseCoSkill = {
            skillIndex,
        };

        if (skillCfg.indiscriminateAreaDamage) {
            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwHelpers.getDataForUseCoSkill() empty unitMap.`);
                return undefined;
            }

            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwHelpers.getDataForUseCoSkill() empty mapSize.`);
                return undefined;
            }

            const teamIndex = player.getTeamIndex();
            if (teamIndex == null) {
                Logger.error(`BwHelpers.getDataForUseCoSkill() empty teamIndex.`);
                return undefined;
            }

            const valueMap = getValueMap(unitMap, teamIndex);
            if (valueMap == null) {
                Logger.error(`BwHelpers.getDataForUseCoSkill() empty valueMap.`);
                return undefined;
            }

            const center = getIndiscriminateAreaDamageCenter(war, valueMap, skillCfg.indiscriminateAreaDamage);
            if (center == null) {
                Logger.error(`BwHelpers.getDataForUseCoSkill() empty center.`);
                return undefined;
            }

            dataForUseCoSkill.indiscriminateAreaDamageCenter = center;
        }

        return dataForUseCoSkill;
    }

    function getIndiscriminateAreaDamageCenter(war: SinglePlayerWar.SpwWar, valueMaps: ValueMaps, indiscriminateCfg: number[]): GridIndex | undefined {
        const targetType    = indiscriminateCfg[0];
        const radius        = indiscriminateCfg[1];
        const hpDamage      = indiscriminateCfg[2];
        if (targetType === 1) { // HP
            return getIndiscriminateAreaDamageCenterForType1(valueMaps, radius, hpDamage);

        } else if (targetType === 2) {  // fund
            return getIndiscriminateAreaDamageCenterForType2(valueMaps, radius, hpDamage);

        } else if (targetType === 3) {  // random: HP or fund
            const randomNumber = war.getRandomNumber();
            if (randomNumber == null) {
                Logger.error(`BwHelpers.getIndiscriminateAreaDamageCenter() empty randomNumber.`);
                return undefined;
            }

            return randomNumber < 0.5
                ? getIndiscriminateAreaDamageCenterForType1(valueMaps, radius, hpDamage)
                : getIndiscriminateAreaDamageCenterForType2(valueMaps, radius, hpDamage);

        } else {
            return undefined;
        }
    }

    function getIndiscriminateAreaDamageCenterForType1(valueMaps: ValueMaps, radius: number, hpDamage: number): GridIndex {
        const damageMap = getDamageMap(valueMaps, hpDamage);
        const centers   = getCentersOfHighestDamage(damageMap.hpMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return getCentersOfHighestDamageForCandidates(damageMap.fundMap, radius, centers);
        }
    }

    function getIndiscriminateAreaDamageCenterForType2(valueMaps: ValueMaps, radius: number, hpDamage: number): GridIndex {
        const damageMap = getDamageMap(valueMaps, hpDamage);
        const centers   = getCentersOfHighestDamage(damageMap.fundMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return getCentersOfHighestDamageForCandidates(damageMap.hpMap, radius, centers);
        }
    }

    function getValueMap(unitMap: BwUnitMap, teamIndex: number): ValueMaps | undefined {
        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            Logger.error(`BwHelpers.getValueMap() empty mapSize.`);
            return undefined;
        }

        const { width, height } = mapSize;
        const hpMap             = Helpers.createEmptyMap(width, height, 0);
        const fundMap           = Helpers.createEmptyMap(width, height, 0);
        const sameTeamMap       = Helpers.createEmptyMap(width, height, false);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const unit = unitMap.getUnitOnMap({ x, y });
                if (unit) {
                    const normalizedCurrentHp = unit.getNormalizedCurrentHp();
                    if (normalizedCurrentHp == null) {
                        Logger.error(`BwHelpers.getValueMap() empty normalizedCurrentHp.`);
                        return undefined;
                    }

                    const productionFinalCost = unit.getProductionFinalCost();
                    if (productionFinalCost == null) {
                        Logger.error(`BwHelpers.getValueMap() empty productionFinalCost.`);
                        return undefined;
                    }

                    const unitTeamIndex = unit.getTeamIndex();
                    if (unitTeamIndex == null) {
                        Logger.error(`BwHelpers.getValueMap() empty unitTeamIndex.`);
                        return undefined;
                    }

                    hpMap[x][y]         = normalizedCurrentHp;
                    fundMap[x][y]       = productionFinalCost;
                    sameTeamMap[x][y]   = unitTeamIndex === teamIndex;
                }
            }
        }

        return { hpMap, fundMap, sameTeamMap };
    }

    function getDamageMap(valueMaps: ValueMaps, hpDamage: number): DamageMaps {
        const srcHpMap          = valueMaps.hpMap;
        const srcFundMap        = valueMaps.fundMap;
        const srcSameTeamMap    = valueMaps.sameTeamMap;
        const width             = srcHpMap.length;
        const height            = srcHpMap[0].length;

        const hpMap     = Helpers.createEmptyMap(width, height, 0);
        const fundMap   = Helpers.createEmptyMap(width, height, 0);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                if (srcHpMap[x][y] > 0) {
                    const realHpDamage      = Math.min(hpDamage, srcHpMap[x][y] - 1);
                    const realFundDamage    = Math.floor(srcFundMap[x][y] * realHpDamage / CommonConstants.UnitHpNormalizer);
                    const isSameTeam        = srcSameTeamMap[x][y];
                    hpMap[x][y]             = isSameTeam ? -realHpDamage * 2 : realHpDamage;
                    fundMap[x][y]           = isSameTeam ? -realFundDamage * 2 : realFundDamage;
                }
            }
        }
        return { hpMap, fundMap };
    }

    function getCentersOfHighestDamage(map: number[][], radius: number): GridIndex[] {
        const centers   : GridIndex[] = [];
        const width     = map.length;
        const height    = map[0].length;
        const mapSize   = { width, height };
        const sumMap    = Helpers.createEmptyMap(width, height, 0);

        let maxDamage: number | null = null;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const center        = { x, y };
                let totalDamage     = 0;
                for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(center, 0, radius, mapSize)) {
                    totalDamage += map[gridIndex.x][gridIndex.y];
                }
                sumMap[x][y] = totalDamage;

                if ((maxDamage == null) || (totalDamage > maxDamage)) {
                    maxDamage = totalDamage;
                    centers.length = 0;
                    centers.push(center);
                } else if (maxDamage === totalDamage) {
                    centers.push(center);
                }
            }
        }

        return centers;
    }

    function getCentersOfHighestDamageForCandidates(map: number[][], radius: number, candidates: GridIndex[]): GridIndex {
        const mapSize   = { width: map.length, height: map[0].length };
        const centers   : GridIndex[] = [];
        let maxDamage   : number | null = null;

        for (const candidate of candidates) {
            let totalDamage = 0;
            for (const g of GridIndexHelpers.getGridsWithinDistance(candidate, 0, radius, mapSize)) {
                totalDamage += map[g.x][g.y];
            }
            if ((maxDamage == null) || (totalDamage > maxDamage)) {
                maxDamage       = totalDamage;
                centers.length  = 0;
                centers.push(candidate);
            } else if (totalDamage === maxDamage) {
                centers.push(candidate);
            }
        }

        return centers[0];
    }
}
