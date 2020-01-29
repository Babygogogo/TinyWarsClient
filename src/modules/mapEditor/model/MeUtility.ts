
namespace TinyWars.MapEditor.MeUtility {
    import ProtoTypes   = Utility.ProtoTypes;
    import mapConstants = ConfigManager.MAP_CONSTANTS;

    export function checkIsValidMap(mapRawData: ProtoTypes.IMapRawData, userId: number): boolean {
        if (mapRawData.designerUserId !== userId) {
            return false;
        }

        return (checkIsMapDesignerValid(mapRawData.mapDesigner))
            && (checkIsMapNameValid(mapRawData.mapName))
            && (checkIsMapNameEnglishValid(mapRawData.mapNameEnglish))
            && (checkIsPlayersCountValid(mapRawData))
            && (checkIsUnitsValid(mapRawData))
            && (checkIsTilesValid(mapRawData));
    }
    function checkIsMapDesignerValid(mapDesigner: string | null | undefined): boolean {
        return (mapDesigner != null)
            && (mapDesigner.length > 0)
            && (mapDesigner.length <= mapConstants.MaxDesignerLength);
    }
    function checkIsMapNameValid(mapName: string | null | undefined): boolean {
        return (mapName != null)
            && (mapName.length > 0)
            && (mapName.length <= mapConstants.MaxMapNameLength);
    }
    function checkIsMapNameEnglishValid(mapNameEnglish: string | null | undefined): boolean {
        return (mapNameEnglish != null)
            && (mapNameEnglish.length > 0)
            && (mapNameEnglish.length <= mapConstants.MaxMapNameEnglishLength);
    }
    function checkIsPlayersCountValid(mapRawData: ProtoTypes.IMapRawData): boolean {
        const playersCount = mapRawData.playersCount;
        if ((playersCount == null) || (playersCount <= 1) || (playersCount > ConfigManager.MAX_PLAYER_INDEX)) {
            return false;
        }

        const playerIndexes = new Set<number>();
        for (const tileData of mapRawData.tileDataList || []) {
            const tileObjectViewId = tileData.objectViewId;
            if (tileObjectViewId != null) {
                const cfg = ConfigManager.getTileObjectTypeAndPlayerIndex(tileObjectViewId);
                if (!cfg) {
                    return false;
                } else {
                    playerIndexes.add(cfg.playerIndex);
                }
            }
        }
        for (const tileObjectViewId of mapRawData.tileObjects || []) {
            const cfg = ConfigManager.getTileObjectTypeAndPlayerIndex(tileObjectViewId);
            if (!cfg) {
                return false;
            } else {
                playerIndexes.add(cfg.playerIndex);
            }
        }
        for (const unitData of mapRawData.unitDataList || []) {
            const unitViewId    = unitData.viewId;
            const cfg           = unitViewId == null ? null : ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
            if (!cfg) {
                return false;
            } else {
                playerIndexes.add(cfg.playerIndex);
            }
        }
        for (const unitViewId of mapRawData.units || []) {
            const cfg = ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
            if (!cfg) {
                return false;
            } else {
                playerIndexes.add(cfg.playerIndex);
            }
        }

        let maxPlayerIndex = 0;
        for (const playerIndex of playerIndexes) {
            maxPlayerIndex = Math.max(maxPlayerIndex, playerIndex);
            if ((playerIndex > 1) && (!playerIndexes.has(playerIndex - 1))) {
                return false;
            }
        }

        return maxPlayerIndex === playersCount;
    }
    function checkIsUnitsValid(mapRawData: ProtoTypes.IMapRawData): boolean {
        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const gridsCount = mapWidth * mapHeight;
        if (gridsCount > mapConstants.MaxGridsCount) {
            return false;
        }

        const unitViewIds   = mapRawData.units;
        const unitDataList  = mapRawData.unitDataList;
        if ((unitViewIds) && (unitDataList)) {
            return false;
        }

        if (unitViewIds) {
            if (unitViewIds.length !== gridsCount) {
                return false;
            }
            for (const unitViewId of unitViewIds) {
                if ((unitViewId !== 0) && (!ConfigManager.getUnitTypeAndPlayerIndex(unitViewId))) {
                    return false;
                }
            }
        }

        if (unitDataList) {
            const configVersion = ConfigManager.getNewestConfigVersion()!;
            const maxPromotion  = ConfigManager.getUnitMaxPromotion(configVersion);
            const units         = new Map<number, ProtoTypes.ISerializedWarUnit>();
            for (const unitData of unitDataList) {
                const unitId = unitData.unitId;
                if ((unitId == null) || (units.has(unitId))) {
                    return false;
                }
                units.set(unitId, unitData);

                const { gridX, gridY } = unitData;
                if ((gridX == null) || (gridY == null) || (gridX >= mapWidth) || (gridY >= mapHeight)) {
                    return false;
                }

                const unitViewId = unitData.viewId;
                if (!unitViewId) {
                    return false;
                }

                const typeAndPlayerIndex = ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
                if (!typeAndPlayerIndex) {
                    return false;
                }

                const cfg = ConfigManager.getUnitTemplateCfg(configVersion, typeAndPlayerIndex.unitType);
                if (!cfg) {
                    return false;
                }

                const currBuildMaterial = unitData.currentBuildMaterial;
                const maxBuildMaterial  = cfg.maxBuildMaterial;
                if ((currBuildMaterial != null)                                         &&
                    ((maxBuildMaterial == null) || (currBuildMaterial >= maxBuildMaterial))
                ) {
                    return false;
                }

                const currFuel  = unitData.currentFuel;
                const maxFuel   = cfg.maxFuel;
                if ((currFuel != null)                          &&
                    ((maxFuel == null) || (currFuel >= maxFuel))
                ) {
                    return false;
                }

                const currHp    = unitData.currentHp;
                const maxHp     = cfg.maxHp;
                if ((currHp != null)                    &&
                    ((maxHp == null) || (currHp >= maxHp))
                ) {
                    return false;
                }

                const currProduceMaterial   = unitData.currentProduceMaterial;
                const maxProduceMaterial    = cfg.maxProduceMaterial;
                if ((currProduceMaterial != null)                                               &&
                    ((maxProduceMaterial == null) || (currProduceMaterial >= maxProduceMaterial))
                ) {
                    return false;
                }

                const currPromotion = unitData.currentPromotion;
                if ((currPromotion != null)                                 &&
                    ((maxPromotion == null) || (currPromotion > maxPromotion))
                ) {
                    return false;
                }

                const flareCurrentAmmo  = unitData.flareCurrentAmmo;
                const flareMaxAmmo      = cfg.flareMaxAmmo;
                if ((flareCurrentAmmo != null)                                  &&
                    ((flareMaxAmmo == null) || (flareCurrentAmmo >= flareMaxAmmo))
                ) {
                    return false;
                }

                if ((unitData.isDiving) && (cfg.fuelConsumptionInDiving == null)) {
                    return false;
                }

                const currAmmo  = unitData.primaryWeaponCurrentAmmo;
                const maxAmmo   = cfg.primaryWeaponMaxAmmo;
                if ((currAmmo != null)                          &&
                    ((maxAmmo == null) || (currAmmo >= maxAmmo))
                ) {
                    return false;
                }
            }

            for (const [, unitData] of units) {
                const loaderUnitId = unitData.loaderUnitId;
                if (loaderUnitId != null) {
                    const loader = units.get(loaderUnitId);
                    if ((!loader) || (loader.gridX !== unitData.gridX) || (loader.gridY !== unitData.gridY)) {
                        return false;
                    }
                    const category = ConfigManager.getUnitTemplateCfg(configVersion, ConfigManager.getUnitTypeAndPlayerIndex(loader.viewId!).unitType).loadUnitCategory;
                    if ((category == null)                                                                                                                      ||
                        (!ConfigManager.checkIsUnitTypeInCategory(configVersion, ConfigManager.getUnitTypeAndPlayerIndex(unitData.viewId!).unitType, category))
                    ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    function checkIsTilesValid(mapRawData: ProtoTypes.IMapRawData): boolean {
        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const gridsCount = mapWidth * mapHeight;
        if (gridsCount > mapConstants.MaxGridsCount) {
            return false;
        }

        const baseViewIds   = mapRawData.tileBases;
        const objectViewIds = mapRawData.tileObjects;
        if ((!baseViewIds)                      ||
            (!objectViewIds)                    ||
            (baseViewIds.length !== gridsCount) ||
            (objectViewIds.length !== gridsCount)
        ) {
            return false;
        }

        for (const baseViewId of baseViewIds) {
            if ((!baseViewId) || (!ConfigManager.getTileBaseType(baseViewId))) {
                return false;
            }
        }

        for (const objectViewId of objectViewIds) {
            if ((objectViewId == null) || (!ConfigManager.getTileObjectTypeAndPlayerIndex(objectViewId))) {
                return false;
            }
        }

        const configVersion = ConfigManager.getNewestConfigVersion()!;
        for (const tileData of mapRawData.tileDataList || []) {
            const { gridX, gridY } = tileData;
            if ((gridX == null) || (gridY == null) || (gridX >= mapWidth || (gridY >= mapHeight))) {
                return false;
            }
            const index                         = gridX + gridY * mapWidth;
            const { objectViewId, baseViewId }  = tileData;
            if ((objectViewId == null)                  ||
                (objectViewId !== baseViewIds[index])   ||
                (baseViewId == null)                    ||
                (baseViewId !== baseViewIds[index])
            ) {
                return false;
            }

            const cfg = ConfigManager.getTileTemplateCfg(
                configVersion,
                ConfigManager.getTileBaseType(baseViewId),
                ConfigManager.getTileObjectTypeAndPlayerIndex(objectViewId).tileObjectType
            );

            const currBuildPoint    = tileData.currentBuildPoint;
            const maxBuildPoint     = cfg.maxBuildPoint;
            if ((currBuildPoint != null)                                    &&
                ((maxBuildPoint == null) || (currBuildPoint >= maxBuildPoint))
            ) {
                return false;
            }

            const currHp    = tileData.currentHp;
            const maxHp     = cfg.maxHp;
            if ((currHp != null)                    &&
                ((maxHp == null) || (currHp >= maxHp))
            ) {
                return false;
            }

            const currCapturePoint  = tileData.currentCapturePoint;
            const maxCapturePoint   = cfg.maxCapturePoint;
            if ((currCapturePoint != null)                                          &&
                ((maxCapturePoint == null) || (currCapturePoint >= maxCapturePoint))
            ) {
                return false;
            }
        }

        return true;
    }

}
