
namespace TinyWars.MapEditor.MeUtility {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import MapRawData       = Types.MapRawData;
    import GridIndex        = Types.GridIndex;
    import SymmetryType     = Types.SymmetryType;
    import InvalidationType = Types.CustomMapInvalidationType;
    import MapConstants     = ConfigManager.MAP_CONSTANTS;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type AsymmetricalCounters = {
        UpToDown            : number | null;
        UpRightToDownLeft   : number | null;
        LeftToRight         : number | null;
        UpLeftToDownRight   : number | null;
        Rotation            : number | null;
    }

    export function createDefaultMapRawData(slotIndex: number): Types.MapRawData {
        const mapWidth      = 20;
        const mapHeight     = 15;
        const gridsCount    = mapWidth * mapHeight;
        return {
            mapDesigner     : User.UserModel.getSelfNickname(),
            mapName         : `${Lang.getText(Lang.Type.B0279)} - ${slotIndex}`,
            mapNameEnglish  : `${Lang.getText(Lang.Type.B0279)} - ${slotIndex}`,
            mapWidth,
            mapHeight,
            designerUserId  : User.UserModel.getSelfUserId(),
            isMultiPlayer   : true,
            isSinglePlayer  : true,
            playersCount    : 2,
            tileBases       : (new Array(gridsCount)).fill(Utility.ConfigManager.getTileBaseViewId(Types.TileBaseType.Plain)),
            tileObjects     : (new Array(gridsCount)).fill(0),
            units           : null,
            unitDataList    : null,
            tileDataList    : null,
        }
    }

    export function getMapInvalidationType(mapRawData: ProtoTypes.IMapRawData): InvalidationType {
        if (!checkIsMapDesignerValid(mapRawData.mapDesigner)) {
            return InvalidationType.InvalidMapDesigner;
        } else if (!checkIsMapNameValid(mapRawData.mapName)) {
            return InvalidationType.InvalidMapName;
        } else if (!checkIsMapNameEnglishValid(mapRawData.mapNameEnglish)) {
            return InvalidationType.InvalidMapNameEnglish;
        } else if (!checkIsPlayersCountValid(mapRawData)) {
            return InvalidationType.InvalidPlayersCount;
        } else if (!checkIsUnitsValid(mapRawData)) {
            return InvalidationType.InvalidUnits;
        } else if (!checkIsTilesValid(mapRawData)) {
            return InvalidationType.InvalidTiles;
        } else if (!checkIsWarRuleListValid(mapRawData.warRuleList, mapRawData.playersCount!)) {
            return InvalidationType.InvalidWarRuleList;
        } else {
            return InvalidationType.Valid;
        }
    }
    function checkIsMapDesignerValid(mapDesigner: string | null | undefined): boolean {
        return (mapDesigner != null)
            && (mapDesigner.length > 0)
            && (mapDesigner.length <= MapConstants.MaxDesignerLength);
    }
    function checkIsMapNameValid(mapName: string | null | undefined): boolean {
        return (mapName != null)
            && (mapName.length > 0)
            && (mapName.length <= MapConstants.MaxMapNameLength);
    }
    function checkIsMapNameEnglishValid(mapNameEnglish: string | null | undefined): boolean {
        return (mapNameEnglish != null)
            && (mapNameEnglish.length > 0)
            && (mapNameEnglish.length <= MapConstants.MaxMapNameEnglishLength);
    }
    function checkIsPlayersCountValid(mapRawData: ProtoTypes.IMapRawData): boolean {
        const playersCount = mapRawData.playersCount;
        if ((playersCount == null) || (playersCount <= 1) || (playersCount > Utility.ConfigManager.MAX_PLAYER_INDEX)) {
            return false;
        }

        const playerIndexes = new Set<number>();
        for (const tileData of mapRawData.tileDataList || []) {
            const tileObjectViewId = tileData.objectViewId;
            if (tileObjectViewId != null) {
                const cfg = Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(tileObjectViewId);
                if (!cfg) {
                    return false;
                } else {
                    playerIndexes.add(cfg.playerIndex);
                }
            }
        }
        for (const tileObjectViewId of mapRawData.tileObjects || []) {
            const cfg = Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(tileObjectViewId);
            if (!cfg) {
                return false;
            } else {
                playerIndexes.add(cfg.playerIndex);
            }
        }
        for (const unitData of mapRawData.unitDataList || []) {
            const unitViewId    = unitData.viewId;
            const cfg           = unitViewId == null ? null : Utility.ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
            if (!cfg) {
                return false;
            } else {
                playerIndexes.add(cfg.playerIndex);
            }
        }
        for (const unitViewId of mapRawData.units || []) {
            const cfg = Utility.ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
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
        if (gridsCount > MapConstants.MaxGridsCount) {
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
                if ((unitViewId !== 0) && (!Utility.ConfigManager.getUnitTypeAndPlayerIndex(unitViewId))) {
                    return false;
                }
            }
        }

        if (unitDataList) {
            const configVersion = Utility.ConfigManager.getNewestConfigVersion()!;
            const maxPromotion  = Utility.ConfigManager.getUnitMaxPromotion(configVersion);
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

                const typeAndPlayerIndex = Utility.ConfigManager.getUnitTypeAndPlayerIndex(unitViewId);
                if (!typeAndPlayerIndex) {
                    return false;
                }

                const cfg = Utility.ConfigManager.getUnitTemplateCfg(configVersion, typeAndPlayerIndex.unitType);
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
                    const category = Utility.ConfigManager.getUnitTemplateCfg(configVersion, Utility.ConfigManager.getUnitTypeAndPlayerIndex(loader.viewId!).unitType).loadUnitCategory;
                    if ((category == null)                                                                                                                      ||
                        (!Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, Utility.ConfigManager.getUnitTypeAndPlayerIndex(unitData.viewId!).unitType, category))
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
        if (gridsCount > MapConstants.MaxGridsCount) {
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
            if ((!baseViewId) || (!Utility.ConfigManager.getTileBaseType(baseViewId))) {
                return false;
            }
        }

        for (const objectViewId of objectViewIds) {
            if ((objectViewId == null) || (!Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(objectViewId))) {
                return false;
            }
        }

        const configVersion = Utility.ConfigManager.getNewestConfigVersion()!;
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

            const cfg = Utility.ConfigManager.getTileTemplateCfg(
                configVersion,
                Utility.ConfigManager.getTileBaseType(baseViewId),
                Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(objectViewId).tileObjectType
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
    function checkIsWarRuleListValid(ruleList: ProtoTypes.IRuleForWar[] | null | undefined, playersCount: number): boolean {
        if ((!ruleList) || (!ruleList.length) || (ruleList.length > CommonConstants.WarRuleMaxCount)) {
            return false;
        }
        for (const rule of ruleList) {
            if (!checkIsWarRuleValid(rule, playersCount)) {
                return false;
            }
        }

        return true;
    }
    function checkIsWarRuleValid(rule: ProtoTypes.IRuleForWar, playersCount: number): boolean {
        const {
            attackPowerModifier,    energyGrowthModifier,   incomeModifier,     initialEnergy,      initialFund,
            luckLowerLimit,         luckUpperLimit,         moveRangeModifier,  ruleName,           ruleNameEnglish,
            visionRangeModifier
        } = rule;
        if ((rule.hasFog            == null)                                                    ||
            (attackPowerModifier    == null)                                                    ||
            (attackPowerModifier    > CommonConstants.WarRuleOffenseBonusMaxLimit)              ||
            (attackPowerModifier    < CommonConstants.WarRuleOffenseBonusMinLimit)              ||
            (energyGrowthModifier   == null)                                                    ||
            (energyGrowthModifier   > CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit)    ||
            (energyGrowthModifier   < CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)    ||
            (incomeModifier         == null)                                                    ||
            (incomeModifier         > CommonConstants.WarRuleIncomeMultiplierMaxLimit)          ||
            (incomeModifier         < CommonConstants.WarRuleIncomeMultiplierMinLimit)          ||
            (initialEnergy          == null)                                                    ||
            (initialEnergy          > CommonConstants.WarRuleInitialEnergyMaxLimit)             ||
            (initialEnergy          < CommonConstants.WarRuleInitialEnergyMinLimit)             ||
            (initialFund            == null)                                                    ||
            (initialFund            > CommonConstants.WarRuleInitialFundMaxLimit)               ||
            (initialFund            < CommonConstants.WarRuleInitialFundMinLimit)               ||
            (luckLowerLimit         == null)                                                    ||
            (luckLowerLimit         > CommonConstants.WarRuleLuckMaxLimit)                      ||
            (luckLowerLimit         < CommonConstants.WarRuleLuckMinLimit)                      ||
            (luckUpperLimit         == null)                                                    ||
            (luckUpperLimit         > CommonConstants.WarRuleLuckMaxLimit)                      ||
            (luckUpperLimit         < CommonConstants.WarRuleLuckMinLimit)                      ||
            (luckUpperLimit         < luckLowerLimit)                                           ||
            (moveRangeModifier      == null)                                                    ||
            (moveRangeModifier      > CommonConstants.WarRuleMoveRangeModifierMaxLimit)         ||
            (moveRangeModifier      < CommonConstants.WarRuleMoveRangeModifierMinLimit)         ||
            (ruleName               == null)                                                    ||
            (ruleName.length        > CommonConstants.WarRuleNameMaxLength)                     ||
            (ruleName.length        <= 0)                                                       ||
            (ruleNameEnglish        == null)                                                    ||
            (ruleNameEnglish.length > CommonConstants.WarRuleNameMaxLength)                     ||
            (ruleNameEnglish.length <= 0)                                                       ||
            (visionRangeModifier    == null)                                                    ||
            (visionRangeModifier    > CommonConstants.WarRuleVisionRangeModifierMaxLimit)       ||
            (visionRangeModifier    < CommonConstants.WarRuleVisionRangeModifierMinLimit)
        ) {
            return false;
        }
        if (!checkIsPlayerRuleListValid(rule.playerRuleList, playersCount)) {
            return false;
        }
        if (!checkIsBannedCoIdListValid(rule.bannedCoIdList)) {
            return false;
        }

        return true;
    }
    function checkIsPlayerRuleListValid(ruleList: ProtoTypes.IRuleForPlayer[] | null | undefined, playersCount: number): boolean {
        if ((!ruleList) || (ruleList.length !== playersCount)) {
            return false;
        }

        const playerIndexes = new Set<number>();
        const teamIndexes   = new Set<number>();
        for (const rule of ruleList) {
            const playerIndex = rule.playerIndex;
            if ((playerIndex == null)           ||
                (playerIndex <= 0)              ||
                (playerIndex > playersCount)    ||
                (playerIndexes.has(playerIndex))
            ) {
                return false;
            }
            playerIndexes.add(playerIndex);

            const teamIndex = rule.teamIndex;
            if ((teamIndex == null)         ||
                (teamIndex <= 0)            ||
                (teamIndex > playersCount)
            ) {
                return false;
            }
            teamIndexes.add(teamIndex);
        }

        if (playerIndexes.size !== playersCount) {
            return false;
        }
        if (teamIndexes.size <= 1) {
            return false;
        }

        return true;
    }
    function checkIsBannedCoIdListValid(list: number[] | null | undefined): boolean {
        // TODO
        return true;
    }

    export function clearMap(mapRawData: MapRawData, newWidth: number, newHeight: number): MapRawData {
        return {
            isMultiPlayer   : mapRawData.isMultiPlayer,
            isSinglePlayer  : mapRawData.isSinglePlayer,
            mapDesigner     : mapRawData.mapDesigner,
            mapName         : mapRawData.mapName,
            mapNameEnglish  : mapRawData.mapNameEnglish,
            designerUserId  : mapRawData.designerUserId,
            playersCount    : mapRawData.playersCount,
            mapHeight       : newHeight,
            mapWidth        : newWidth,
            tileBases       : new Array(newWidth * newHeight).fill(ConfigManager.getTileBaseViewId(Types.TileBaseType.Plain)),
            tileObjects     : new Array(newWidth * newHeight).fill(0),
            tileDataList    : null,
            unitDataList    : null,
            units           : null,
        };
    }
    export function resizeMap(mapRawData: MapRawData, newWidth: number, newHeight: number): MapRawData {
        return {
            isMultiPlayer   : mapRawData.isMultiPlayer,
            isSinglePlayer  : mapRawData.isSinglePlayer,
            mapDesigner     : mapRawData.mapDesigner,
            mapName         : mapRawData.mapName,
            mapNameEnglish  : mapRawData.mapNameEnglish,
            designerUserId  : mapRawData.designerUserId,
            playersCount    : mapRawData.playersCount,
            mapHeight       : newHeight,
            mapWidth        : newWidth,
            tileBases       : getNewTileBaseViewIdsForResize(mapRawData, newWidth, newHeight),
            tileObjects     : getNewTileObjectViewIdsForResize(mapRawData, newWidth, newHeight),
            tileDataList    : getNewTileDataListForResize(mapRawData, newWidth, newHeight),
            unitDataList    : getNewUnitDataListForResize(mapRawData, newWidth, newHeight),
            units           : null,
        };
    }
    function getNewTileBaseViewIdsForResize(mapRawData: MapRawData, newWidth: number, newHeight: number): number[] {
        const oldWidth      = mapRawData.mapWidth;
        const oldHeight     = mapRawData.mapHeight;
        const oldViewIds    = mapRawData.tileBases || [];
        const defaultId     = Utility.ConfigManager.getTileBaseViewId(Types.TileBaseType.Plain);
        const newViewIds    : number[] = [];
        for (let x = 0; x < newWidth; ++x) {
            for (let y = 0; y < newHeight; ++y) {
                const newIndex = x + y * newWidth;
                if ((x >= oldWidth) || (y >= oldHeight)) {
                    newViewIds[newIndex] = defaultId;
                } else {
                    newViewIds[newIndex] = oldViewIds[x + y * oldWidth] || defaultId;
                }
            }
        }
        return newViewIds;
    }
    function getNewTileObjectViewIdsForResize(mapRawData: MapRawData, newWidth: number, newHeight: number): number[] {
        const oldWidth      = mapRawData.mapWidth;
        const oldHeight     = mapRawData.mapHeight;
        const oldViewIds    = mapRawData.tileObjects || [];
        const defaultId     = 0;
        const newViewIds    : number[] = [];
        for (let x = 0; x < newWidth; ++x) {
            for (let y = 0; y < newHeight; ++y) {
                const newIndex = x + y * newWidth;
                if ((x >= oldWidth) || (y >= oldHeight)) {
                    newViewIds[newIndex] = defaultId;
                } else {
                    newViewIds[newIndex] = oldViewIds[x + y * oldWidth] || defaultId;
                }
            }
        }
        return newViewIds;
    }
    function getNewTileDataListForResize(mapRawData: MapRawData, newWidth: number, newHeight: number): Types.SerializedTile[] {
        const tileList: Types.SerializedTile[] = [];
        for (const tileData of mapRawData.tileDataList || []) {
            if ((tileData.gridX < newWidth) && (tileData.gridY < newHeight)) {
                tileList.push(tileData);
            }
        }
        return tileList;
    }
    function getNewUnitDataListForResize(mapRawData: MapRawData, newWidth: number, newHeight: number): Types.SerializedUnit[] {
        const unitList: Types.SerializedUnit[] = [];
        for (const unitData of mapRawData.unitDataList || []) {
            if ((unitData.gridX < newWidth) && (unitData.gridY < newHeight)) {
                unitList.push(unitData);
            }
        }
        return unitList;
    }

    export function addOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): MapRawData {
        return {
            isMultiPlayer   : mapRawData.isMultiPlayer,
            isSinglePlayer  : mapRawData.isSinglePlayer,
            mapDesigner     : mapRawData.mapDesigner,
            mapName         : mapRawData.mapName,
            mapNameEnglish  : mapRawData.mapNameEnglish,
            designerUserId  : mapRawData.designerUserId,
            playersCount    : mapRawData.playersCount,
            mapHeight       : mapRawData.mapHeight,
            mapWidth        : mapRawData.mapWidth,
            tileBases       : getNewTileBaseViewIdsForOffset(mapRawData, offsetX, offsetY),
            tileObjects     : getNewTileObjectViewIdsForOffset(mapRawData, offsetX, offsetY),
            tileDataList    : getNewTileDataListForOffset(mapRawData, offsetX, offsetY),
            unitDataList    : getNewUnitDataListForOffset(mapRawData, offsetX, offsetY),
            units           : null,
        }
    }
    function getNewTileBaseViewIdsForOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): number[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const oldViewIds    = mapRawData.tileBases || [];
        const baseViewIds   : number[] = [];
        const defaultId     = Utility.ConfigManager.getTileBaseViewId(Types.TileBaseType.Plain);
        for (let newX = 0; newX < width; ++newX) {
            for (let newY = 0; newY < height; ++newY) {
                const oldX      = newX - offsetX;
                const oldY      = newY - offsetY
                const newIndex  = newX + newY * width;
                if ((oldX >= 0) && (oldX < width) && (oldY >= 0) && (oldY < height)) {
                    baseViewIds[newIndex] = oldViewIds[oldX + oldY * width] || defaultId;
                } else {
                    baseViewIds[newIndex] = defaultId;
                }
            }
        }

        return baseViewIds;
    }
    function getNewTileObjectViewIdsForOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): number[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const oldViewIds    = mapRawData.tileObjects || [];
        const objectViewIds : number[] = [];
        const defaultId     = 0;
        for (let newX = 0; newX < width; ++newX) {
            for (let newY = 0; newY < height; ++newY) {
                const oldX      = newX - offsetX;
                const oldY      = newY - offsetY
                const newIndex  = newX + newY * width;
                if ((oldX >= 0) && (oldX < width) && (oldY >= 0) && (oldY < height)) {
                    objectViewIds[newIndex] = oldViewIds[oldX + oldY * width] || defaultId;
                } else {
                    objectViewIds[newIndex] = defaultId;
                }
            }
        }

        return objectViewIds;
    }
    function getNewTileDataListForOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): Types.SerializedTile[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const tileDataList  : Types.SerializedTile[] = [];
        for (const tileData of mapRawData.tileDataList || []) {
            const newX = tileData.gridX + offsetX;
            const newY = tileData.gridY + offsetY;
            if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
                const newData   = Helpers.deepClone(tileData);
                newData.gridX   = newX;
                newData.gridY   = newY;
                tileDataList.push(newData);
            }
        }

        return tileDataList;
    }
    function getNewUnitDataListForOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): Types.SerializedUnit[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const unitDataList  : Types.SerializedUnit[] = [];
        for (const unitData of mapRawData.unitDataList || []) {
            const newX = unitData.gridX + offsetX;
            const newY = unitData.gridY + offsetY;
            if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
                const newData   = Helpers.deepClone(unitData);
                newData.gridX   = newX;
                newData.gridY   = newY;
                unitDataList.push(newData);
            }
        }

        return unitDataList;
    }

    export function getAsymmetricalCounters(war: MeWar): AsymmetricalCounters {
        const tileMap               = war.getTileMap();
        const mapSize               = tileMap.getMapSize();
        const { width, height }     = mapSize;
        const isSquare              = width === height;
        let countLeftRight          = 0;
        let countUpDown             = 0;
        let countRotational         = 0;
        let countUpLeftDownRight    = 0;
        let countUpRightDownLeft    = 0;

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const gridIndex = { x, y };
                const tile      = tileMap.getTile(gridIndex);
                if (checkIsSymmetrical(tile, tileMap.getTile(getSymmetricalGridIndex(gridIndex, SymmetryType.LeftToRight, mapSize)), SymmetryType.LeftToRight)) {
                    ++countLeftRight;
                }
                if (checkIsSymmetrical(tile, tileMap.getTile(getSymmetricalGridIndex(gridIndex, SymmetryType.UpToDown, mapSize)), SymmetryType.UpToDown)) {
                    ++countUpDown;
                }
                if (checkIsSymmetrical(tile, tileMap.getTile(getSymmetricalGridIndex(gridIndex, SymmetryType.Rotation, mapSize)), SymmetryType.Rotation)) {
                    ++countRotational;
                }
                if (isSquare) {
                    if (checkIsSymmetrical(tile, tileMap.getTile(getSymmetricalGridIndex(gridIndex, SymmetryType.UpLeftToDownRight, mapSize)), SymmetryType.UpLeftToDownRight)) {
                        ++countUpLeftDownRight;
                    }
                    if (checkIsSymmetrical(tile, tileMap.getTile(getSymmetricalGridIndex(gridIndex, SymmetryType.UpRightToDownLeft, mapSize)), SymmetryType.UpRightToDownLeft)) {
                        ++countUpRightDownLeft;
                    }
                }
            }
        }

        const totalGrids = width * height;
        return {
            LeftToRight         : totalGrids - countLeftRight,
            UpToDown            : totalGrids - countUpDown,
            Rotation            : totalGrids - countRotational,
            UpLeftToDownRight   : isSquare ? totalGrids - countUpLeftDownRight : null,
            UpRightToDownLeft   : isSquare ? totalGrids - countUpRightDownLeft : null,
        }
    }
    export function getSymmetricalGridIndex(gridIndex: GridIndex, symmetryType: SymmetryType, mapSize: Types.MapSize): GridIndex {
        const { width, height } = mapSize;
        if (symmetryType === SymmetryType.LeftToRight) {
            return {
                x   : width - gridIndex.x - 1,
                y   : gridIndex.y,
            };
        } else if (symmetryType === SymmetryType.UpToDown) {
            return {
                x   : gridIndex.x,
                y   : height - gridIndex.y - 1,
            };
        } else if (symmetryType === SymmetryType.Rotation) {
            return {
                x   : width - gridIndex.x - 1,
                y   : height - gridIndex.y - 1,
            };
        } else if (symmetryType === SymmetryType.UpLeftToDownRight) {
            if (width !== height) {
                return null;
            } else {
                return {
                    x   : width - 1 - gridIndex.y,
                    y   : width - 1 - gridIndex.x,
                };
            }
        } else if (symmetryType === SymmetryType.UpRightToDownLeft) {
            if (mapSize.width !== mapSize.height) {
                return null;
            } else {
                return {
                    x   : gridIndex.y,
                    y   : gridIndex.x,
                };
            }
        } else {
            return null;
        }
    }
    function checkIsSymmetrical(tile1: MeTile, tile2: MeTile, symmetryType: SymmetryType): boolean {
        if (tile1.getBaseViewId() !== Utility.ConfigManager.getSymmetricalTileBaseViewId(tile2.getBaseViewId(), symmetryType)) {
            return false;
        } else {
            if ((tile1.getPlayerIndex() !== 0) || (tile2.getPlayerIndex() !== 0)) {
                return tile1.getType() === tile2.getType();
            } else {
                return (tile1.getObjectViewId() === Utility.ConfigManager.getSymmetricalTileObjectViewId(tile2.getObjectViewId(), symmetryType));
            }
        }
    }
}
