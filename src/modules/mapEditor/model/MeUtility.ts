
namespace TinyWars.MapEditor.MeUtility {
    import ProtoTypes               = Utility.ProtoTypes;
    import Types                    = Utility.Types;
    import Lang                     = Utility.Lang;
    import Helpers                  = Utility.Helpers;
    import ConfigManager            = Utility.ConfigManager;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import BwSettingsHelper         = BaseWar.BwSettingsHelper;
    import BwHelpers                = BaseWar.BwHelpers;
    import BwTile                   = BaseWar.BwTile;
    import GridIndex                = Types.GridIndex;
    import TileObjectType           = Types.TileObjectType;
    import TileBaseType             = Types.TileBaseType;
    import SymmetryType             = Types.SymmetryType;
    import LanguageType             = Types.LanguageType;
    import InvalidationType         = Types.CustomMapInvalidationType;
    import IMapRawData              = ProtoTypes.Map.IMapRawData;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarRule                 = ProtoTypes.WarRule.IWarRule;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IWarEvent                = ProtoTypes.WarEvent.IWarEvent;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import IWarEventConditionNode   = ProtoTypes.WarEvent.IWarEventConditionNode;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;
    import ISerialTile              = WarSerialization.ISerialTile;
    import ISerialUnit              = WarSerialization.ISerialUnit;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    export type AsymmetricalCounters = {
        UpToDown            : number | null;
        UpRightToDownLeft   : number | null;
        LeftToRight         : number | null;
        UpLeftToDownRight   : number | null;
        Rotation            : number | null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDefaultMapRawData(slotIndex: number): Promise<IMapRawData> {
        const mapWidth  = 20;
        const mapHeight = 15;
        return {
            designerName            : await User.UserModel.getSelfNickname(),
            designerUserId          : User.UserModel.getSelfUserId(),
            mapNameArray            : [
                { languageType: LanguageType.Chinese, text: `${Lang.getTextWithLanguage(Lang.Type.B0279, LanguageType.Chinese)} - ${slotIndex}`},
                { languageType: LanguageType.English, text: `${Lang.getTextWithLanguage(Lang.Type.B0279, LanguageType.English)} - ${slotIndex}`},
            ],
            mapWidth,
            mapHeight,
            playersCountUnneutral   : 2,
            modifiedTime            : Time.TimeModel.getServerTimestamp(),
            tileDataArray           : createDefaultTileDataArray(mapWidth, mapHeight, TileBaseType.Plain),
            unitDataArray           : [],
            warEventFullData        : {
                eventArray          : [],
                actionArray         : [],
                conditionArray      : [],
                conditionNodeArray  : [],
            },
        };
    }
    function createDefaultTileDataArray(mapWidth: number, mapHeight: number, tileBaseType: TileBaseType): ISerialTile[] {
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function createISerialWar(data: ProtoTypes.Map.IMapEditorData): WarSerialization.ISerialWar {
        const mapRawData    = data.mapRawData;
        const warRuleArray  = mapRawData.warRuleArray;
        const warRule       = (warRuleArray ? warRuleArray[0] : null) || BwSettingsHelper.createDefaultWarRule(0, CommonConstants.WarMaxPlayerIndex);
        const unitDataArray = mapRawData.unitDataArray || [];
        return {
            settingsForCommon   : {
                configVersion   : ConfigManager.getLatestFormalVersion(),
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
            warEventManager         : {
                warEventFullData    : mapRawData.warEventFullData,
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
                tileMap : { tiles: mapRawData.tileDataArray },
                unitMap : {
                    units       : unitDataArray,
                    nextUnitId  : unitDataArray.length,
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
                watchOngoingSrcUserIdArray  : null,
                watchRequestSrcUserIdArray  : null,
                restTimeToBoot              : 0,
                unitAndTileSkinId           : playerIndex,
            });
        }

        return { players };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getMapInvalidationType(mapRawData: IMapRawData): InvalidationType {
        if (!checkIsMapDesignerNameValid(mapRawData.designerName)) {
            return InvalidationType.InvalidMapDesigner;
        } else if (!checkIsMapNameArrayValid(mapRawData.mapNameArray)) {
            return InvalidationType.InvalidMapName;
        } else if (!checkIsPlayersCountValid(mapRawData)) {
            return InvalidationType.InvalidPlayersCount;
        } else if (!checkIsUnitsValid(mapRawData)) {
            return InvalidationType.InvalidUnits;
        } else if (!checkIsTilesValid(mapRawData)) {
            return InvalidationType.InvalidTiles;
        } else if (!checkIsWarRuleArrayValid(mapRawData.warRuleArray, mapRawData.playersCountUnneutral, mapRawData.warEventFullData)) {
            return InvalidationType.InvalidWarRuleList;
        } else if (!checkIsWarEventDataValid(mapRawData)) {
            return InvalidationType.InvalidWarEventData;
        } else {
            return InvalidationType.Valid;
        }
    }
    function checkIsMapDesignerNameValid(mapDesigner: string | null | undefined): boolean {
        return (mapDesigner != null)
            && (mapDesigner.length > 0)
            && (mapDesigner.length <= CommonConstants.MaxDesignerLength);
    }
    function checkIsMapNameArrayValid(mapNameList: ProtoTypes.Structure.ILanguageText[] | null | undefined): boolean {
        return (mapNameList != null)
            && (Helpers.checkIsValidLanguageTextArray({
                list            : mapNameList,
                minTextLength   : 1,
                maxTextLength   : CommonConstants.MaxMapNameLength,
            }));
    }
    function checkIsPlayersCountValid(mapRawData: IMapRawData): boolean {
        const playersCount = mapRawData.playersCountUnneutral;
        if ((playersCount == null) || (playersCount <= 1) || (playersCount > CommonConstants.WarMaxPlayerIndex)) {
            return false;
        }

        const playerIndexes = new Set<number>();
        for (const tileData of mapRawData.tileDataArray || []) {
            playerIndexes.add(tileData.playerIndex);
        }
        for (const unitData of mapRawData.unitDataArray || []) {
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
        if (gridsCount > CommonConstants.MaxGridsCount) {
            return false;
        }

        const unitDataArray = mapRawData.unitDataArray;
        if (unitDataArray) {
            const configVersion         = ConfigManager.getLatestFormalVersion()!;
            const maxPromotion          = ConfigManager.getUnitMaxPromotion(configVersion);
            const units                 = new Map<number, ISerialUnit>();
            const indexesForUnitOnMap   = new Set<number>();
            for (const unitData of unitDataArray) {
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
        if (gridsCount > CommonConstants.MaxGridsCount) {
            return false;
        }

        const tileDataArray = mapRawData.tileDataArray;
        if ((tileDataArray == null) || (tileDataArray.length !== gridsCount)) {
            return false;
        }

        const indexes       = new Set<number>();
        const configVersion = ConfigManager.getLatestFormalVersion()!;
        for (const tileData of mapRawData.tileDataArray || []) {
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
                ((mapRawData.unitDataArray || []).some(v => {
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
    function checkIsWarRuleArrayValid(ruleList: IWarRule[] | null | undefined, playersCount: number, warEventData: IWarEventFullData | null | undefined): boolean {
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

            if ((!BwSettingsHelper.checkIsValidWarRule(rule, warEventData)) ||
                (BwSettingsHelper.getPlayersCount(rule) !== playersCount)
            ) {
                return false;
            }
        }

        return true;
    }

    type WarEventDict               = Map<number, IWarEvent>;
    type WarEventActionDict         = Map<number, IWarEventAction>;
    type WarEventConditionDict      = Map<number, IWarEventCondition>;
    type WarEventConditionNodeDict  = Map<number, IWarEventConditionNode>;
    function checkIsWarEventDataValid(mapRawData: IMapRawData): boolean {   // DONE
        const warEventFullData = mapRawData.warEventFullData;
        if (warEventFullData == null) {
            return true;
        }

        const warRuleList = mapRawData.warRuleArray;
        if (warRuleList == null) {
            return false;
        }

        const actionDict = new Map<number, IWarEventAction>();
        for (const action of warEventFullData.actionArray || []) {
            const commonData = action.WarEventActionCommonData;
            if (commonData == null) {
                return false;
            }

            const actionId = commonData.actionId;
            if ((actionId == null) || (actionDict.has(actionId))) {
                return false;
            }
            actionDict.set(actionId, action);
        }
        if (actionDict.size > CommonConstants.WarEventMaxActionsPerMap) {
            return false;
        }

        const conditionDict = new Map<number, IWarEventCondition>();
        for (const condition of warEventFullData.conditionArray || []) {
            const commonData = condition.WecCommonData;
            if (commonData == null) {
                return false;
            }

            const conditionId = commonData.conditionId;
            if ((conditionId == null) || (conditionDict.has(conditionId))) {
                return false;
            }
            conditionDict.set(conditionId, condition);
        }
        if (conditionDict.size > CommonConstants.WarEventMaxConditionsPerMap) {
            return false;
        }

        const nodeDict = new Map<number, IWarEventConditionNode>();
        for (const node of warEventFullData.conditionNodeArray || []) {
            const nodeId = node.nodeId;
            if ((nodeId == null) || (nodeDict.has(nodeId))) {
                return false;
            }
            nodeDict.set(nodeId, node);
        }
        if (nodeDict.size > CommonConstants.WarEventMaxConditionNodesPerMap) {
            return false;
        }

        const eventDict = new Map<number, IWarEvent>();
        for (const event of warEventFullData.eventArray || []) {
            const eventId = event.eventId;
            if ((eventId == null) || (eventDict.has(eventId))) {
                return false;
            }
            eventDict.set(eventId, event);
        }
        if (eventDict.size > CommonConstants.WarEventMaxEventsPerMap) {
            return false;
        }

        if (!checkIsEveryWarEventActionInUse(actionDict, eventDict)) {
            return false;
        }
        if (!checkIsEveryWarEventConditionInUse(conditionDict, nodeDict)) {
            return false;
        }
        if (!checkIsEveryWarEventConditionNodeInUse(nodeDict, eventDict)) {
            return false;
        }
        if (!checkIsEveryWarEventInUse(eventDict, warRuleList)) {
            return false;
        }

        for (const [, action] of actionDict) {
            if (!checkIsValidWarEventAction({ action, eventDict, mapRawData })) {
                return false;
            }
        }
        for (const [, condition] of conditionDict) {
            if (!checkIsValidWarEventCondition({ condition, eventDict })) {
                return false;
            }
        }
        for (const [, conditionNode] of nodeDict) {
            if (!checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict })) {
                return false;
            }
        }
        for (const [, warEvent] of eventDict) {
            if (!checkIsValidWarEvent({ warEvent, nodeDict, actionDict })) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventActionInUse(actionDict: WarEventActionDict, eventDict: WarEventDict): boolean {    // DONE
        for (const [actionId] of actionDict) {
            let isInUse = false;
            for (const [, event] of eventDict) {
                if ((event.actionIdArray || []).indexOf(actionId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventConditionInUse(conditionDict: WarEventConditionDict, nodeDict: WarEventConditionNodeDict): boolean {   // DONE
        for (const [conditionId] of conditionDict) {
            let isInUse = false;
            for (const [, node] of nodeDict) {
                if ((node.conditionIdArray || []).indexOf(conditionId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventConditionNodeInUse(nodeDict: WarEventConditionNodeDict, eventDict: WarEventDict): boolean {    // DONE
        for (const [nodeId] of nodeDict) {
            let isInUse = false;
            for (const [, event] of eventDict) {
                if (event.conditionNodeId === nodeId) {
                    isInUse = true;
                    break;
                }
            }
            if (isInUse) {
                continue;
            }

            for (const [, node] of nodeDict) {
                if ((node.subNodeIdArray || []).indexOf(nodeId) >= 0) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse) {
                return false;
            }
        }

        return true;
    }
    function checkIsEveryWarEventInUse(eventDict: WarEventDict, warRuleArray: ProtoTypes.WarRule.IWarRule[]): boolean {  // DONE
        for (const [eventId] of eventDict) {
            let isInUse = false;
            for (const warRule of warRuleArray) {
                if ((warRule.warEventIdArray || []).indexOf(eventId) >= 0) {
                    isInUse = true;
                    break;
                }
            }

            if (!isInUse) {
                return false;
            }
        }

        return true;
    }

    function checkIsValidWarEventAction({ action, eventDict, mapRawData }: {    // DONE
        action      : IWarEventAction;
        eventDict   : WarEventDict;
        mapRawData  : IMapRawData;
    }): boolean {
        if (Object.keys(action).length !== 2) {
            return false;
        }

        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return false;
        }

        const configVersion = ConfigManager.getLatestFormalVersion();
        if (configVersion == null) {
            return false;
        }

        const mapHeight = mapRawData.mapHeight;
        const mapWidth  = mapRawData.mapWidth;
        if ((!mapHeight) || (!mapWidth)) {
            return false;
        }
        const mapSize: Types.MapSize = { width: mapWidth, height: mapHeight };

        const actionAddUnit = action.WarEventActionAddUnit;
        if (actionAddUnit) {
            const { unitArray } = actionAddUnit;
            if ((unitArray == null)                                              ||
                (unitArray.length <= 0)                                          ||
                (unitArray.length > CommonConstants.WarEventActionAddUnitMaxCount)
            ) {
                return false;
            }

            for (const data of unitArray) {
                const {
                    needMovableTile,
                    canBeBlockedByUnit,
                    unitData,
                } = data;
                if ((needMovableTile == null) || (canBeBlockedByUnit) || (unitData == null)) {
                    return false;
                }

                if (unitData.loaderUnitId != null) {
                    return false;
                }

                if (!BwHelpers.checkIsUnitDataValidIgnoringUnitId({
                    unitData,
                    playersCountUnneutral,
                    configVersion,
                    mapSize ,
                })) {
                    return false;
                }
            }

            return true;
        }

        // TODO add more checkers when the action types grow.

        return false;
    }
    function checkIsValidWarEventCondition({ condition, eventDict }: {  // DONE
        condition   : IWarEventCondition;
        eventDict   : WarEventDict;
    }): boolean {
        if (Object.keys(condition).length !== 2) {
            return false;
        }

        const commonData = condition.WecCommonData;
        if ((commonData == null) || (commonData.isNot == null)) {
            return false;
        }

        const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
        if (conEventCalledCountTotalEqualTo) {
            return (conEventCalledCountTotalEqualTo.countEqualTo != null)
                && (conEventCalledCountTotalEqualTo.eventIdEqualTo != null);
        }

        const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
        if (conEventCalledCountTotalGreaterThan) {
            return (conEventCalledCountTotalGreaterThan.countGreaterThan != null)
                && (conEventCalledCountTotalGreaterThan.eventIdEqualTo != null);
        }

        const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
        if (conEventCalledCountTotalLessThan) {
            return (conEventCalledCountTotalLessThan.countLessThan != null)
                && (conEventCalledCountTotalLessThan.eventIdEqualTo != null);
        }

        const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
        if (conPlayerAliveStateEqualTo) {
            const { playerIndexEqualTo, aliveStateEqualTo } = conPlayerAliveStateEqualTo;

            if ((aliveStateEqualTo !== Types.PlayerAliveState.Alive)    &&
                (aliveStateEqualTo !== Types.PlayerAliveState.Dead)     &&
                (aliveStateEqualTo !== Types.PlayerAliveState.Dying)
            ) {
                return false;
            }

            if (playerIndexEqualTo == null) {
                return false;
            }

            return true;
        }

        const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
        if (conTurnIndexEqualTo) {
            return conTurnIndexEqualTo.valueEqualTo != null;
        }

        const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
        if (conTurnIndexGreaterThan) {
            return conTurnIndexGreaterThan.valueGreaterThan != null;
        }

        const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
        if (conTurnIndexLessThan) {
            return conTurnIndexLessThan.valueLessThan != null;
        }

        const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
        if (conTurnIndexRemainderEqualTo) {
            const { divider, remainderEqualTo } = conTurnIndexRemainderEqualTo;
            return (!!divider) && (remainderEqualTo != null);
        }

        const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
        if (conPlayerIndexInTurnEqualTo) {
            return conPlayerIndexInTurnEqualTo.valueEqualTo != null;
        }

        const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
        if (conPlayerIndexInTurnGreaterThan) {
            return conPlayerIndexInTurnGreaterThan.valueGreaterThan != null;
        }

        const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
        if (conPlayerIndexInTurnLessThan) {
            return conPlayerIndexInTurnLessThan.valueLessThan != null;
        }

        const conTurnPhaseEqualTo = condition.WecTurnPhaseEqualTo;
        if (conTurnPhaseEqualTo) {
            const value = conTurnPhaseEqualTo.valueEqualTo;
            return (value === Types.TurnPhaseCode.Main)
                || (value === Types.TurnPhaseCode.WaitBeginTurn);
        }

        // TODO add more checkers when the condition types grow.

        return false;
    }
    function checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict }: {    // DONE
        conditionNode   : IWarEventConditionNode;
        conditionDict   : WarEventConditionDict;
        nodeDict        : WarEventConditionNodeDict;
    }): boolean {
        if (conditionNode.isAnd == null) {
            return false;
        }

        const currNodeId = conditionNode.nodeId;
        if (currNodeId == null) {
            return false;
        }

        const conditionIdArray  = conditionNode.conditionIdArray || [];
        const subNodeIdArray    = conditionNode.subNodeIdArray || [];
        if ((conditionIdArray.length > CommonConstants.WarEventMaxConditionsPerNode)         ||
            (subNodeIdArray.length > CommonConstants.WarEventMaxSubConditionNodesPerNode)    ||
            (conditionIdArray.length + subNodeIdArray.length <= 0)
        ) {
            return false;
        }

        for (const conditionId of conditionIdArray) {
            if (!conditionDict.has(conditionId)) {
                return false;
            }
        }

        for (const subNodeId of subNodeIdArray) {
            if (!nodeDict.has(subNodeId)) {
                return false;
            }
        }

        const usedNodeIdList    = [currNodeId];
        const usedNodeIdSet     = new Set<number>();
        for (let i = 0; i < usedNodeIdList.length; ++i) {
            const nodeId = usedNodeIdList[i];
            if (usedNodeIdSet.has(nodeId)) {
                return false;
            }
            usedNodeIdSet.add(nodeId);

            const subNode = nodeDict.get(nodeId);
            if (subNode == null) {
                return false;
            }

            const idArray = subNode.subNodeIdArray;
            if (idArray) {
                usedNodeIdList.push(...idArray);
            }
        }

        return true;
    }
    function checkIsValidWarEvent({ warEvent, nodeDict, actionDict }: { // DONE
        warEvent    : IWarEvent;
        nodeDict    : WarEventConditionNodeDict;
        actionDict  : WarEventActionDict;
    }): boolean {
        const eventNameArray = warEvent.eventNameArray;
        if ((eventNameArray == null)                                     ||
            (!Helpers.checkIsValidLanguageTextArray({
                list            : eventNameArray,
                maxTextLength   : CommonConstants.WarEventNameMaxLength,
                minTextLength   : 1
            }))
        ) {
            return false;
        }

        const maxCallCountInPlayerTurn = warEvent.maxCallCountInPlayerTurn;
        if ((maxCallCountInPlayerTurn == null)                                          ||
            (maxCallCountInPlayerTurn < 1)                                              ||
            (maxCallCountInPlayerTurn > CommonConstants.WarEventMaxCallCountInPlayerTurn)
        ) {
            return false;
        }

        const maxCallCountTotal = warEvent.maxCallCountTotal;
        if ((maxCallCountTotal == null)                                     ||
            (maxCallCountTotal < 1)                                         ||
            (maxCallCountTotal > CommonConstants.WarEventMaxCallCountTotal)
        ) {
            return false;
        }

        const conditionNodeId = warEvent.conditionNodeId;
        if ((conditionNodeId == null) || (!nodeDict.has(conditionNodeId))) {
            return false;
        }

        const actionIdArray = warEvent.actionIdArray;
        if ((actionIdArray == null)                                              ||
            (actionIdArray.length > CommonConstants.WarEventMaxActionsPerEvent)  ||
            (actionIdArray.length <= 0)                                          ||
            (actionIdArray.some(v => !actionDict.has(v)))
        ) {
            return false;
        }

        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function clearMap(mapRawData: IMapRawData, newWidth: number, newHeight: number): IMapRawData {
        return {
            mapId                   : mapRawData.mapId,
            designerName            : mapRawData.designerName,
            designerUserId          : mapRawData.designerUserId,
            mapNameArray            : mapRawData.mapNameArray,
            mapWidth                : newWidth,
            mapHeight               : newHeight,
            playersCountUnneutral   : mapRawData.playersCountUnneutral,
            warEventFullData        : mapRawData.warEventFullData,
            modifiedTime            : Time.TimeModel.getServerTimestamp(),
            tileDataArray           : createDefaultTileDataArray(newWidth, newHeight, TileBaseType.Plain),
            unitDataArray           : null,
            warRuleArray            : mapRawData.warRuleArray,
        };
    }
    export function resizeMap(mapRawData: IMapRawData, newWidth: number, newHeight: number): IMapRawData {
        return {
            mapId                   : mapRawData.mapId,
            designerName            : mapRawData.designerName,
            designerUserId          : mapRawData.designerUserId,
            mapNameArray            : mapRawData.mapNameArray,
            mapWidth                : newWidth,
            mapHeight               : newHeight,
            playersCountUnneutral   : mapRawData.playersCountUnneutral,
            warEventFullData        : mapRawData.warEventFullData,
            modifiedTime            : Time.TimeModel.getServerTimestamp(),
            tileDataArray           : getNewTileDataListForResize(mapRawData, newWidth, newHeight),
            unitDataArray           : getNewUnitDataListForResize(mapRawData, newWidth, newHeight),
            warRuleArray            : mapRawData.warRuleArray,
        };
    }
    function getNewTileDataListForResize(mapRawData: IMapRawData, newWidth: number, newHeight: number): ISerialTile[] {
        const tileList: ISerialTile[] = [];
        for (const tileData of mapRawData.tileDataArray || []) {
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
        for (const unitData of mapRawData.unitDataArray || []) {
            const gridIndex = unitData.gridIndex;
            if ((gridIndex.x < newWidth) && (gridIndex.y < newHeight)) {
                unitList.push(unitData);
            }
        }

        return unitList;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function addOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): IMapRawData {
        return {
            mapId                   : mapRawData.mapId,
            designerName            : mapRawData.designerName,
            designerUserId          : mapRawData.designerUserId,
            mapNameArray            : mapRawData.mapNameArray,
            mapWidth                : mapRawData.mapWidth,
            mapHeight               : mapRawData.mapHeight,
            playersCountUnneutral   : mapRawData.playersCountUnneutral,
            modifiedTime            : Time.TimeModel.getServerTimestamp(),
            tileDataArray           : getNewTileDataListForOffset(mapRawData, offsetX, offsetY),
            unitDataArray           : getNewUnitDataListForOffset(mapRawData, offsetX, offsetY),
            warRuleArray            : mapRawData.warRuleArray,
            warEventFullData        : mapRawData.warEventFullData,
        }
    }
    function getNewTileDataListForOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): ISerialTile[] {
        const width         = mapRawData.mapWidth;
        const height        = mapRawData.mapHeight;
        const tileDataList  : ISerialTile[] = [];
        for (const tileData of mapRawData.tileDataArray) {
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
        for (const unitData of mapRawData.unitDataArray || []) {
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
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
