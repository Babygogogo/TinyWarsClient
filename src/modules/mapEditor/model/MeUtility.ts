
namespace TinyWars.MapEditor.MeUtility {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import BwHelpers        = BaseWar.BwHelpers;
    import BwTile           = BaseWar.BwTile;
    import GridIndex        = Types.GridIndex;
    import TileObjectType   = Types.TileObjectType;
    import TileBaseType     = Types.TileBaseType;
    import SymmetryType     = Types.SymmetryType;
    import LanguageType     = Types.LanguageType;
    import InvalidationType = Types.CustomMapInvalidationType;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import IWarRule         = ProtoTypes.WarRule.IWarRule;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import MapConstants     = ConfigManager.MAP_CONSTANTS;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type AsymmetricalCounters = {
        UpToDown            : number | null;
        UpRightToDownLeft   : number | null;
        LeftToRight         : number | null;
        UpLeftToDownRight   : number | null;
        Rotation            : number | null;
    }

    export async function createDefaultMapRawData(slotIndex: number): Promise<IMapRawData> {
        const mapWidth  = 20;
        const mapHeight = 15;
        return {
            designerName    : await User.UserModel.getSelfNickname(),
            designerUserId  : User.UserModel.getSelfUserId(),
            mapNameList     : [
                `${Lang.getTextWithLanguage(Lang.Type.B0279, LanguageType.Chinese)} - ${slotIndex}`,
                `${Lang.getTextWithLanguage(Lang.Type.B0279, LanguageType.English)} - ${slotIndex}`,
            ],
            mapWidth,
            mapHeight,
            playersCount    : 2,
            modifiedTime    : Time.TimeModel.getServerTimestamp(),
            tileDataList    : createDefaultTileDataList(mapWidth, mapHeight, TileBaseType.Plain),
            unitDataList    : [],
        };
    }
    function createDefaultTileDataList(mapWidth: number, mapHeight: number, tileBaseType: TileBaseType): ISerialTile[] {
        const dataList: ISerialTile[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                dataList.push(createDefaultTileData({ x, y }, tileBaseType));
            }
        }
        return dataList;
    }
    function createDefaultTileData(gridIndex: GridIndex, tileBaseType: TileBaseType): ISerialTile {
        return {
            gridIndex,
            baseType    : tileBaseType,
            objectType  : TileObjectType.Empty,
            playerIndex : CommonConstants.WarNeutralPlayerIndex,
        };
    }

    export function createISerialWar(data: ProtoTypes.Map.IMapEditorData): WarSerialization.ISerialWar {
        const mapRawData    = data.mapRawData;
        const warRuleList   = mapRawData.warRuleList;
        const warRule       = (warRuleList ? warRuleList[0] : null) || BwSettingsHelper.createDefaultWarRule(0, CommonConstants.WarMaxPlayerIndex);
        const unitDataList  = mapRawData.unitDataList || [];
        return {
            settingsForCommon   : {
                configVersion   : ConfigManager.getLatestConfigVersion(),
                mapId           : data.mapRawData.mapId,
                presetWarRuleId : warRule.ruleId,
                warRule,
            },
            settingsForMcw          : null,
            settingsForScw          : null,
            warId                   : null,
            seedRandomInitialState  : new Math.seedrandom(null, { state: true }).state(),
            seedRandomCurrentState  : null,
            executedActions         : null,
            executedActionsCount    : 0,
            remainingVotesForDraw   : null,
            warEventData            : {
                calledCountList     : [],
            },
            playerManager           : createISerialPlayerManager(),
            turnManager             : {
                turnIndex       : CommonConstants.WarFirstTurnIndex,
                turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
                enterTurnTime   : 0,
            },
            field                   : {
                fogMap  : {
                    forceFogCode            : Types.ForceFogCode.None,
                    forceExpirePlayerIndex  : null,
                    forceExpireTurnIndex    : null,
                    mapsFromPath            : null,
                },
                tileMap : { tiles: mapRawData.tileDataList },
                unitMap : {
                    units       : unitDataList,
                    nextUnitId  : unitDataList.length,
                },
            },
        };
    }
    function createISerialPlayerManager(): WarSerialization.ISerialPlayerManager {
        const players: WarSerialization.ISerialPlayer[] = [];
        for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
            players.push({
                fund                        : 0,
                hasVotedForDraw             : false,
                aliveState                  : Types.PlayerAliveState.Alive,
                playerIndex,
                teamIndex                   : playerIndex,
                userId                      : null,
                coId                        : 0,
                coCurrentEnergy             : null,
                coUsingSkillType            : Types.CoSkillType.Passive,
                coIsDestroyedInTurn         : false,
                watchOngoingSrcUserIdList   : null,
                watchRequestSrcUserIdList   : null,
                restTimeToBoot              : 0,
                unitAndTileSkinId           : playerIndex,
            });
        }

        return { players };
    }

    export function getMapInvalidationType(mapRawData: IMapRawData): InvalidationType {
        if (!checkIsMapDesignerNameValid(mapRawData.designerName)) {
            return InvalidationType.InvalidMapDesigner;
        } else if (!checkIsMapNameListValid(mapRawData.mapNameList)) {
            return InvalidationType.InvalidMapName;
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
    function checkIsMapDesignerNameValid(mapDesigner: string | null | undefined): boolean {
        return (mapDesigner != null)
            && (mapDesigner.length > 0)
            && (mapDesigner.length <= MapConstants.MaxDesignerLength);
    }
    function checkIsMapNameListValid(mapNameList: string[] | null | undefined): boolean {
        return (mapNameList != null)
            && (mapNameList.length > 0)
            && (mapNameList.every(mapName => {
                return (!!mapName) && (mapName.length <= MapConstants.MaxMapNameLength);
            }));
    }
    function checkIsPlayersCountValid(mapRawData: IMapRawData): boolean {
        const playersCount = mapRawData.playersCount;
        if ((playersCount == null) || (playersCount <= 1) || (playersCount > CommonConstants.WarMaxPlayerIndex)) {
            return false;
        }

        const playerIndexes = new Set<number>();
        for (const tileData of mapRawData.tileDataList || []) {
            playerIndexes.add(tileData.playerIndex);
        }
        for (const unitData of mapRawData.unitDataList || []) {
            playerIndexes.add(unitData.playerIndex);
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
    function checkIsUnitsValid(mapRawData: IMapRawData): boolean {
        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const gridsCount = mapWidth * mapHeight;
        if (gridsCount > MapConstants.MaxGridsCount) {
            return false;
        }

        const unitDataList  = mapRawData.unitDataList;
        if (unitDataList) {
            const configVersion         = ConfigManager.getLatestConfigVersion()!;
            const maxPromotion          = ConfigManager.getUnitMaxPromotion(configVersion);
            const units                 = new Map<number, ISerialUnit>();
            const indexesForUnitOnMap   = new Set<number>();
            for (const unitData of unitDataList) {
                const unitId = unitData.unitId;
                if ((unitId == null) || (units.has(unitId))) {
                    return false;
                }
                units.set(unitId, unitData);

                const { x: gridX, y: gridY } = unitData.gridIndex;
                if ((gridX == null) || (gridY == null) || (gridX >= mapWidth) || (gridY >= mapHeight)) {
                    return false;
                }

                if (unitData.loaderUnitId == null) {
                    const index = gridY * mapWidth + gridX;
                    if (indexesForUnitOnMap.has(index)) {
                        return false;
                    }
                    indexesForUnitOnMap.add(index);
                }

                const cfg = Utility.ConfigManager.getUnitTemplateCfg(configVersion, unitData.unitType);
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

                if ((unitData.isDiving) && (cfg.diveCfgs == null)) {
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
                    if ((!loader) || (!GridIndexHelpers.checkIsEqual(loader.gridIndex as GridIndex, unitData.gridIndex as GridIndex))) {
                        return false;
                    }
                    const category = ConfigManager.getUnitTemplateCfg(configVersion, loader.unitType).loadUnitCategory;
                    if ((category == null)                                                                  ||
                        (!ConfigManager.checkIsUnitTypeInCategory(configVersion, unitData.unitType, category))
                    ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    function checkIsTilesValid(mapRawData: IMapRawData): boolean {
        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const gridsCount = mapWidth * mapHeight;
        if (gridsCount > MapConstants.MaxGridsCount) {
            return false;
        }

        const tileDataList = mapRawData.tileDataList;
        if ((tileDataList == null) || (tileDataList.length !== gridsCount)) {
            return false;
        }

        const indexes       = new Set<number>();
        const configVersion = ConfigManager.getLatestConfigVersion()!;
        for (const tileData of mapRawData.tileDataList || []) {
            const gridIndex                 = tileData.gridIndex as GridIndex;
            const { x: gridX, y: gridY }    = gridIndex;
            if ((gridX == null) || (gridY == null) || (gridX >= mapWidth || (gridY >= mapHeight))) {
                return false;
            }

            const index = gridX + gridY * mapWidth;
            if (indexes.has(index)) {
                return false;
            }
            indexes.add(index);

            const baseType = tileData.baseType;
            if (!ConfigManager.checkIsValidTileBaseShapeId(baseType, tileData.baseShapeId)) {
                return false;
            }

            const objectType = tileData.objectType;
            if (!ConfigManager.checkIsValidTileObjectShapeId(objectType, tileData.objectShapeId)) {
                return false;
            }

            const cfg = ConfigManager.getTileTemplateCfg(configVersion, baseType, objectType);
            if (!cfg) {
                return false;
            }

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

            if ((currHp != null)                                                        &&
                ((mapRawData.unitDataList || []).some(v => {
                    const g = BwHelpers.convertGridIndex(v.gridIndex);
                    return ((g != null) && (GridIndexHelpers.checkIsEqual(g, gridIndex)))
                }))
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
    function checkIsWarRuleListValid(ruleList: IWarRule[] | null | undefined, playersCount: number): boolean {
        const rulesCount = ruleList ? ruleList.length : 0;
        if ((rulesCount <= 0) || (rulesCount > CommonConstants.WarRuleMaxCount)) {
            return false;
        }

        const ruleIdSet = new Set<number>();
        for (const rule of ruleList) {
            const ruleId = rule.ruleId;
            if ((ruleId == null) || (ruleId < 0) || (ruleId >= rulesCount) || (ruleIdSet.has(ruleId))) {
                return false;
            }
            ruleIdSet.add(ruleId);

            if ((!BwSettingsHelper.checkIsValidWarRule(rule))           ||
                (BwSettingsHelper.getPlayersCount(rule) !== playersCount)
            ) {
                return false;
            }
        }

        return true;
    }

    export function clearMap(mapRawData: IMapRawData, newWidth: number, newHeight: number): IMapRawData {
        return {
            mapId           : mapRawData.mapId,
            designerName    : mapRawData.designerName,
            designerUserId  : mapRawData.designerUserId,
            mapNameList     : mapRawData.mapNameList,
            mapWidth        : newWidth,
            mapHeight       : newHeight,
            playersCount    : mapRawData.playersCount,
            modifiedTime    : Time.TimeModel.getServerTimestamp(),
            tileDataList    : createDefaultTileDataList(newWidth, newHeight, TileBaseType.Plain),
            unitDataList    : null,
            warRuleList     : mapRawData.warRuleList,
        };
    }
    export function resizeMap(mapRawData: IMapRawData, newWidth: number, newHeight: number): IMapRawData {
        return {
            mapId           : mapRawData.mapId,
            designerName    : mapRawData.designerName,
            designerUserId  : mapRawData.designerUserId,
            mapNameList     : mapRawData.mapNameList,
            mapWidth        : newWidth,
            mapHeight       : newHeight,
            playersCount    : mapRawData.playersCount,
            modifiedTime    : Time.TimeModel.getServerTimestamp(),
            tileDataList    : getNewTileDataListForResize(mapRawData, newWidth, newHeight),
            unitDataList    : getNewUnitDataListForResize(mapRawData, newWidth, newHeight),
            warRuleList     : mapRawData.warRuleList,
        };
    }
    function getNewTileDataListForResize(mapRawData: IMapRawData, newWidth: number, newHeight: number): ISerialTile[] {
        const tileList: ISerialTile[] = [];
        for (const tileData of mapRawData.tileDataList || []) {
            const gridIndex = tileData.gridIndex;
            if ((gridIndex.x < newWidth) && (gridIndex.y < newHeight)) {
                tileList.push(tileData);
            }
        }

        const oldWidth  = mapRawData.mapWidth;
        const oldHeight = mapRawData.mapHeight;
        for (let x = 0; x < newWidth; ++x) {
            for (let y = 0; y < newHeight; ++y) {
                if ((x >= oldWidth) || (y >= oldHeight)) {
                    tileList.push(createDefaultTileData({ x, y }, TileBaseType.Plain));
                }
            }
        }

        return tileList;
    }
    function getNewUnitDataListForResize(mapRawData: IMapRawData, newWidth: number, newHeight: number): ISerialUnit[] {
        const unitList: ISerialUnit[] = [];
        for (const unitData of mapRawData.unitDataList || []) {
            const gridIndex = unitData.gridIndex;
            if ((gridIndex.x < newWidth) && (gridIndex.y < newHeight)) {
                unitList.push(unitData);
            }
        }

        return unitList;
    }

    export function addOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): IMapRawData {
        return {
            mapId           : mapRawData.mapId,
            designerName    : mapRawData.designerName,
            designerUserId  : mapRawData.designerUserId,
            mapNameList     : mapRawData.mapNameList,
            mapWidth        : mapRawData.mapWidth,
            mapHeight       : mapRawData.mapHeight,
            playersCount    : mapRawData.playersCount,
            modifiedTime    : Time.TimeModel.getServerTimestamp(),
            tileDataList    : getNewTileDataListForOffset(mapRawData, offsetX, offsetY),
            unitDataList    : getNewUnitDataListForOffset(mapRawData, offsetX, offsetY),
            warRuleList     : mapRawData.warRuleList,
        }
    }
    function getNewTileDataListForOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): ISerialTile[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const tileDataList  : ISerialTile[] = [];
        for (const tileData of mapRawData.tileDataList) {
            const gridIndex = tileData.gridIndex;
            const newX      = gridIndex.x + offsetX;
            const newY      = gridIndex.y + offsetY;
            if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
                const newData       = Helpers.deepClone(tileData);
                newData.gridIndex   = { x: newX, y: newY };
                tileDataList.push(newData);
            }
        }

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                if (((offsetX > 0) && (x < offsetX))            ||
                    ((offsetX < 0) && (x >= width + offsetX))   ||
                    ((offsetY > 0) && (y < offsetY))            ||
                    ((offsetY < 0) && (y >= height + offsetY))
                ) {
                    tileDataList.push(createDefaultTileData({ x, y }, TileBaseType.Plain));
                }
            }
        }

        return tileDataList;
    }
    function getNewUnitDataListForOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): ISerialUnit[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const unitDataList  : ISerialUnit[] = [];
        for (const unitData of mapRawData.unitDataList || []) {
            const gridIndex = unitData.gridIndex;
            const newX      = gridIndex.x + offsetX;
            const newY      = gridIndex.y + offsetY;
            if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
                const newData       = Helpers.deepClone(unitData);
                newData.gridIndex   = { x: newX, y: newY };
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
    function checkIsSymmetrical(tile1: BwTile, tile2: BwTile, symmetryType: SymmetryType): boolean {
        const baseType      = tile1.getBaseType();
        const objectType    = tile1.getObjectType();
        return (baseType === tile2.getBaseType())
            && (objectType === tile2.getObjectType())
            && (ConfigManager.checkIsTileBaseSymmetrical({
                baseType,
                shapeId1    : tile1.getBaseShapeId(),
                shapeId2    : tile2.getBaseShapeId(),
                symmetryType,
            }))
            && (ConfigManager.checkIsTileObjectSymmetrical({
                objectType,
                shapeId1    : tile1.getObjectShapeId(),
                shapeId2    : tile2.getObjectShapeId(),
                symmetryType,
            }));
    }
}
