
import TwnsBwWar            from "../../baseWar/model/BwWar";
import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import CommonConstants      from "../helpers/CommonConstants";
import ConfigManager        from "../helpers/ConfigManager";
import GridIndexHelpers     from "../helpers/GridIndexHelpers";
import Helpers              from "../helpers/Helpers";
import Logger               from "../helpers/Logger";
import ProtoTypes           from "../proto/ProtoTypes";
import Types                from "../helpers/Types";
import WarCommonHelpers     from "./WarCommonHelpers";

namespace WarCoSkillHelpers {
    import BwPlayer             = TwnsBwPlayer.BwPlayer;
    import GridIndex            = Types.GridIndex;
    import Structure            = ProtoTypes.Structure;
    import IDataForUseCoSkill   = Structure.IDataForUseCoSkill;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;
    import BwWar                = TwnsBwWar.BwWar;

    type DamageMaps = {
        hpMap   : number[][];
        fundMap : number[][];
    };
    type ValueMaps = {
        hpMap       : number[][];
        fundMap     : number[][];
        sameTeamMap : boolean[][];
    };

    export function exeInstantSkill({ war, player, skillId, extraData }: {
        war         : BwWar;
        player      : BwPlayer;
        skillId     : number;
        extraData   : IDataForUseCoSkill;
    }): void {
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
            Logger.error(`WarCoSkillHelpers.exeInstantSkill() empty coGridIndexList.`);
            return undefined;
        }

        exeSelfFund({ skillCfg, player });
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
        exeSelfUnitActionState(configVersion, skillCfg, unitMap, player, coGridIndexList);
    }

    function exeSelfFund({ skillCfg, player }: {
        skillCfg        : ProtoTypes.Config.ICoSkillCfg;
        player          : BwPlayer;
    }): void {
        const cfg = skillCfg.selfFund;
        if (cfg == null) {
            return;
        }

        const currFund = player.getFund();
        if (currFund == null) {
            Logger.error(`WarCoSkillHelpers.exeSelfFund() empty currFund.`);
            return;
        }

        player.setFund(Math.floor(currFund * cfg[0] / 100 + cfg[1]));
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
                Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty gridIndex.`);
                    return undefined;
                }

                const maxHp = unit.getMaxHp();
                if (maxHp == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty maxHp.`);
                    return undefined;
                }

                const currentHp = unit.getCurrentHp();
                if (currentHp == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfHpGain() empty currentHp.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                }
            }
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
            const teamIndex = player.getTeamIndex();
            if (teamIndex == null) {
                Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty teamIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2] * CommonConstants.UnitHpNormalizer;
            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty gridIndex.`);
                    return undefined;
                }

                const maxHp = unit.getMaxHp();
                if (maxHp == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty maxHp.`);
                    return undefined;
                }

                const currentHp = unit.getCurrentHp();
                if (currentHp == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyHpGain() empty currentHp.`);
                    return undefined;
                }

                if ((unit.getTeamIndex() !== teamIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                }
            }
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
                Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel == null) {
                        Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty maxFuel.`);
                        return undefined;
                    }

                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        Logger.error(`WarCoSkillHelpers.exeSelfFuelGain() empty currentFuel.`);
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const maxFuel = unit.getMaxFuel();
                    if (maxFuel == null) {
                        Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty maxFuel.`);
                        return undefined;
                    }

                    const currentFuel = unit.getCurrentFuel();
                    if (currentFuel == null) {
                        Logger.error(`WarCoSkillHelpers.exeEnemyFuelGain() empty currentFuel.`);
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = unit.getCurrentBuildMaterial();
                        if (currentBuildMaterial == null) {
                            Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty currentBuildMaterial.`);
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
                            Logger.error(`WarCoSkillHelpers.exeSelfMaterialGain() empty currentProduceMaterial.`);
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = unit.getCurrentBuildMaterial();
                        if (currentBuildMaterial == null) {
                            Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty currentBuildMaterial.`);
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
                            Logger.error(`WarCoSkillHelpers.exeEnemyMaterialGain() empty currentProduceMaterial.`);
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeSelfPrimaryAmmoGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfPrimaryAmmoGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfPrimaryAmmoGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfPrimaryAmmoGain() empty gridIndex.`);
                    return undefined;
                }

                const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfPrimaryAmmoGain() empty currentAmmo.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty zoneRadius.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    return;
                }

                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty gridIndex.`);
                    return undefined;
                }

                const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`WarCoSkillHelpers.exeEnemyPrimaryAmmoGain() empty currentAmmo.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
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
            }
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
                Logger.error(`WarCoSkillHelpers.exeIndiscriminateAreaDamage() empty center.`);
                return undefined;
            }

            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                Logger.error(`WarCoSkillHelpers.exeIndiscriminateAreaDamage() empty mapSize.`);
                return undefined;
            }

            const hpDamage = cfg[2] * CommonConstants.UnitHpNormalizer;
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(center as GridIndex, 0, cfg[1], mapSize)) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if (unit) {
                    const currentHp = unit.getCurrentHp();
                    if (currentHp == null) {
                        Logger.error(`WarCoSkillHelpers.exeIndiscriminateAreaDamage() empty currentHp.`);
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
                Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty zoneRadius.`);
                return undefined;
            }

            const maxPromotion = ConfigManager.getUnitMaxPromotion(configVersion);
            if (maxPromotion == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty maxPromotion.`);
                return undefined;
            }

            const category  = cfg[1];
            const modifier  = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    const currentPromotion = unit.getCurrentPromotion();
                    if (currentPromotion == null) {
                        Logger.error(`WarCoSkillHelpers.exeSelfPromotionGain() empty currentPromotion.`);
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
            }
        }
    }

    function exeSelfUnitActionState(
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
                Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() empty playerIndex.`);
                return undefined;
            }

            const zoneRadius = player.getCoZoneRadius();
            if (zoneRadius == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() empty zoneRadius.`);
                return undefined;
            }

            const maxPromotion = ConfigManager.getUnitMaxPromotion(configVersion);
            if (maxPromotion == null) {
                Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() empty maxPromotion.`);
                return undefined;
            }

            const category      = cfg[1];
            const actionState   : Types.UnitActionState = cfg[2];
            if ((actionState !== Types.UnitActionState.Acted) && (actionState !== Types.UnitActionState.Idle)) {
                Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() invalid actionState.`);
                return undefined;
            }

            for (const unit of unitMap.getAllUnits()) {
                const unitType = unit.getUnitType();
                if (unitType == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() empty unitType.`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`WarCoSkillHelpers.exeSelfUnitActionState() empty gridIndex.`);
                    return undefined;
                }

                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexList, zoneRadius))
                ) {
                    unit.setActionState(actionState);
                }
            }
        }
    }

    export function getDataForUseCoSkill(
        war         : BwWar,
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

    function getIndiscriminateAreaDamageCenter(war: BwWar, valueMaps: ValueMaps, indiscriminateCfg: number[]): GridIndex | undefined {
        const targetType    = indiscriminateCfg[0];
        const radius        = indiscriminateCfg[1];
        const hpDamage      = indiscriminateCfg[2];
        if (targetType === 1) { // HP
            return getIndiscriminateAreaDamageCenterForType1(valueMaps, radius, hpDamage);

        } else if (targetType === 2) {  // fund
            return getIndiscriminateAreaDamageCenterForType2(valueMaps, radius, hpDamage);

        } else if (targetType === 3) {  // random: HP or fund
            const randomNumber = war.getRandomNumberManager().getRandomNumber();
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

export default WarCoSkillHelpers;
