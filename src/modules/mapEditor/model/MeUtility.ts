
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsTwWar            from "../../testWar/model/TwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Timer                from "../../tools/helpers/Timer";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel            from "../../user/model/UserModel";
// import WarEventHelper       from "../../warEvent/model/WarEventHelper";
// import TwnsMeWar            from "./MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MeUtility {
    import BwTile               = Twns.BaseWar.BwTile;
    import MeWar                = Twns.MapEditor.MeWar;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import GridIndex            = Types.GridIndex;
    import TileType             = Types.TileType;
    import TileObjectType       = Types.TileObjectType;
    import TileBaseType         = Types.TileBaseType;
    import SymmetryType         = Types.SymmetryType;
    import LanguageType         = Types.LanguageType;
    import TileDecoratorType    = Types.TileDecoratorType;
    import IMapRawData          = CommonProto.Map.IMapRawData;
    import WarSerialization     = CommonProto.WarSerialization;
    import IWarRule             = CommonProto.WarRule.IWarRule;
    import ISerialTile          = WarSerialization.ISerialTile;
    import ISerialUnit          = WarSerialization.ISerialUnit;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwUnitMap            = Twns.BaseWar.BwUnitMap;

    export type AsymmetricalCounters = {
        UpToDown            : number | null;
        UpRightToDownLeft   : number | null;
        LeftToRight         : number | null;
        UpLeftToDownRight   : number | null;
        Rotation            : number | null;
    };

    const TileDecoratorAutoShapeIdArray = [
    //  000     001     010     011     100     101     110     111
        0,      1,      25,     25,     4,      5,      25,     25,     // 000 0 0
        16,     16,     29,     29,     17,     17,     29,     29,     // 000 0 1
        20,     21,     31,     31,     20,     21,     31,     31,     // 000 1 0
        24,     24,     33,     33,     24,     24,     33,     33,     // 000 1 1
        2,      3,      26,     26,     6,      7,      26,     26,     // 001 0 0
        16,     16,     29,     29,     17,     17,     29,     29,     // 001 0 1
        22,     23,     32,     32,     22,     23,     32,     32,     // 001 1 0
        24,     24,     33,     33,     24,     24,     33,     33,     // 001 1 1
        34,     35,     43,     43,     36,     37,     43,     43,     // 010 0 0
        38,     38,     44,     44,     39,     39,     44,     44,     // 010 0 1
        40,     41,     45,     45,     40,     41,     45,     45,     // 010 1 0
        42,     42,     46,     46,     42,     42,     46,     46,     // 010 1 1
        34,     35,     43,     43,     36,     37,     43,     43,     // 011 0 0
        38,     38,     44,     44,     39,     39,     44,     44,     // 011 0 1
        40,     41,     45,     45,     40,     41,     45,     45,     // 011 1 0
        42,     42,     46,     46,     42,     42,     46,     46,     // 011 1 1
        8,      9,      27,     27,     12,     13,     27,     27,     // 100 0 0
        18,     18,     30,     30,     19,     19,     30,     30,     // 100 0 1
        20,     21,     31,     31,     20,     21,     31,     31,     // 100 1 0
        24,     24,     33,     33,     24,     24,     33,     33,     // 100 1 1
        10,     11,     28,     28,     14,     15,     28,     28,     // 101 0 0
        18,     18,     30,     30,     19,     19,     30,     30,     // 100 0 1
        22,     23,     32,     32,     22,     23,     32,     32,     // 101 1 0
        24,     24,     33,     33,     24,     24,     33,     33,     // 101 1 1
        34,     35,     43,     43,     36,     37,     43,     43,     // 110 0 0
        38,     38,     44,     44,     39,     39,     44,     44,     // 110 0 1
        40,     41,     45,     45,     40,     41,     45,     45,     // 110 1 0
        42,     42,     46,     46,     42,     42,     46,     46,     // 110 1 1
        34,     35,     43,     43,     36,     37,     43,     43,     // 111 0 0
        38,     38,     44,     44,     39,     39,     44,     44,     // 111 0 1
        40,     41,     45,     45,     40,     41,     45,     45,     // 111 1 0
        42,     42,     46,     46,     42,     42,     46,     46,     // 111 1 1
    ];
    const TileRoadAutoShapeIdArray = [
    //  0   1
        0,  1,  // 0 0  0
        1,  1,  // 0 0  1
        0,  4,  // 0 1  0
        2,  8,  // 0 1  1
        0,  5,  // 1 0  0
        3,  9,  // 1 0  1
        0,  7,  // 1 1  0
        6,  10, // 1 1  1
    ];
    const TileBridgeAutoShapeIdArray = [
    //  0   1
        0,  1,  // 0 0  0
        1,  1,  // 0 0  1
        0,  4,  // 0 1  0
        2,  8,  // 0 1  1
        0,  5,  // 1 0  0
        3,  9,  // 1 0  1
        0,  7,  // 1 1  0
        6,  10, // 1 1  1
    ];
    const TilePlasmaAutoShapeIdMap = new Map<boolean, number[]>([
        // boolean表示是否与陨石/激光发射器邻接
        [ false, [
        //  0       1
            0,      1,      // 0 0  0
            3,      15,     // 0 0  1
            4,      10,     // 0 1  0
            9,      8,      // 0 1  1
            2,      11,     // 1 0  0
            12,     6,      // 1 0  1
            14,     5,      // 1 1  0
            7,      13,     // 1 1  1
        ]],
        [ true, [
        //  0       1
            0,      16,     // 0 0  0
            18,     24,     // 0 0  1
            17,     20,     // 0 1  0
            21,     26,     // 0 1  1
            19,     22,     // 1 0  0
            23,     28,     // 1 0  1
            25,     29,     // 1 1  0
            27,     13,     // 1 1  1
        ]],
    ]);
    const TilePipeAutoShapeIdArray = [
    //  0       1
        0,      1,      // 0 0  0
        3,      15,     // 0 0  1
        4,      10,     // 0 1  0
        9,      8,      // 0 1  1
        2,      11,     // 1 0  0
        12,     6,      // 1 0  1
        14,     5,      // 1 1  0
        7,      13,     // 1 1  1
    ];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDefaultMapRawData(slotIndex: number): Promise<IMapRawData> {
        const mapWidth  = 20;
        const mapHeight = 15;
        return {
            designerName            : UserModel.getSelfNickname(),
            designerUserId          : UserModel.getSelfUserId(),
            mapNameArray            : [
                { languageType: LanguageType.Chinese, text: `${Lang.getText(LangTextType.B0279, LanguageType.Chinese)} - ${slotIndex}`},
                { languageType: LanguageType.English, text: `${Lang.getText(LangTextType.B0279, LanguageType.English)} - ${slotIndex}`},
            ],
            mapWidth,
            mapHeight,
            playersCountUnneutral   : 2,
            modifiedTime            : Timer.getServerTimestamp(),
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
            baseType        : tileBaseType,
            decoratorType   : null,
            objectType      : TileObjectType.Empty,
            playerIndex     : CommonConstants.WarNeutralPlayerIndex,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function createISerialWar(data: CommonProto.Map.IMapEditorData): WarSerialization.ISerialWar {
        const mapRawData        = Helpers.deepClone(Helpers.getExisted(data.mapRawData));
        const warRuleArray      = mapRawData.warRuleArray;
        const unitDataArray     = mapRawData.unitDataArray || [];
        const warRule           = createRevisedWarRuleForMeWar(warRuleArray ? warRuleArray[0] : null);
        return {
            settingsForCommon   : {
                configVersion   : Twns.Config.ConfigManager.getLatestConfigVersion(),
                presetWarRuleId : warRule.ruleId,
                warRule,
            },
            settingsForMcw          : null,
            settingsForScw          : null,
            warId                   : null,
            isEnded                 : false,
            seedRandomInitialState  : null,
            seedRandomCurrentState  : null,
            executedActionManager   : null,
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
            players.push(createDefaultISerialPlayer(playerIndex));
        }

        return { players };
    }
    export function createDefaultISerialPlayer(playerIndex: number): ISerialPlayer {
        return {
            fund                        : 0,
            hasVotedForDraw             : false,
            aliveState                  : Types.PlayerAliveState.Alive,
            playerIndex,
            userId                      : playerIndex > 0 ? UserModel.getSelfUserId() : null,
            coId                        : 0,
            coCurrentEnergy             : null,
            coUsingSkillType            : Types.CoSkillType.Passive,
            coPowerActivatedCount       : null,
            coIsDestroyedInTurn         : false,
            watchRequestSrcUserIdArray  : [],
            watchOngoingSrcUserIdArray  : [],
            restTimeToBoot              : 0,
            unitAndTileSkinId           : playerIndex,
        };
    }

    export function createRevisedWarRuleArrayForMeWar(warRuleArray: Types.Undefinable<IWarRule[]>): IWarRule[] {
        if (!warRuleArray?.length) {
            return [createRevisedWarRuleForMeWar(null)];
        } else {
            const revisedWarRuleArray: IWarRule[] = [];
            for (const warRule of warRuleArray) {
                revisedWarRuleArray.push(createRevisedWarRuleForMeWar(warRule));
            }
            return revisedWarRuleArray;
        }
    }
    function createRevisedWarRuleForMeWar(warRule: Types.Undefinable<IWarRule>): IWarRule {
        if (warRule == null) {
            return WarRuleHelpers.createDefaultWarRule(0, CommonConstants.WarMaxPlayerIndex);
        } else {
            const newRule           = Helpers.deepClone(warRule);
            newRule.ruleForPlayers  = createRevisedRuleForPlayersForMeWar(newRule.ruleForPlayers);
            return newRule;
        }
    }
    function createRevisedRuleForPlayersForMeWar(ruleForPlayers: Types.Undefinable<CommonProto.WarRule.IRuleForPlayers>): CommonProto.WarRule.IRuleForPlayers {
        const playerRuleArray = ruleForPlayers?.playerRuleDataArray;
        if (playerRuleArray == null) {
            return {
                playerRuleDataArray : WarRuleHelpers.createDefaultPlayerRuleList(CommonConstants.WarMaxPlayerIndex),
            };
        } else {
            const revisedPlayerRuleArray: CommonProto.WarRule.IDataForPlayerRule[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                revisedPlayerRuleArray.push(Helpers.deepClone(playerRuleArray.find(v => v.playerIndex === playerIndex)) ?? WarRuleHelpers.createDefaultPlayerRule(playerIndex));
            }
            return {
                playerRuleDataArray : revisedPlayerRuleArray,
            };
        }
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
            modifiedTime            : Timer.getServerTimestamp(),
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
            modifiedTime            : Timer.getServerTimestamp(),
            tileDataArray           : getNewTileDataListForResize(mapRawData, newWidth, newHeight),
            unitDataArray           : getNewUnitDataListForResize(mapRawData, newWidth, newHeight),
            warRuleArray            : mapRawData.warRuleArray,
        };
    }
    function getNewTileDataListForResize(mapRawData: IMapRawData, newWidth: number, newHeight: number): ISerialTile[] {
        const tileList: ISerialTile[] = [];
        for (const tileData of mapRawData.tileDataArray || []) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
            if ((gridIndex.x < newWidth) && (gridIndex.y < newHeight)) {
                tileList.push(tileData);
            }
        }

        const oldWidth  = Helpers.getExisted(mapRawData.mapWidth);
        const oldHeight = Helpers.getExisted(mapRawData.mapHeight);
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
        const unitDataArray: ISerialUnit[] = [];
        for (const unitData of mapRawData.unitDataArray || []) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex));
            if ((gridIndex.x < newWidth) && (gridIndex.y < newHeight)) {
                unitDataArray.push(unitData);
            }
        }

        const allUnitsDict  = new Map<number, { unit: ISerialUnit, newUnitId: number }>();
        let nextUnitId      = 0;
        for (const unit of unitDataArray) {
            allUnitsDict.set(Helpers.getExisted(unit.unitId), { unit, newUnitId: nextUnitId } );
            ++nextUnitId;
        }
        for (const [, value] of allUnitsDict) {
            const unit  = value.unit;
            unit.unitId = value.newUnitId;

            const loaderUnitId = unit.loaderUnitId;
            if (loaderUnitId != null) {
                unit.loaderUnitId = Helpers.getExisted(allUnitsDict.get(loaderUnitId)).newUnitId;
            }
        }

        return unitDataArray;
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
            modifiedTime            : Timer.getServerTimestamp(),
            tileDataArray           : getNewTileDataListForOffset(mapRawData, offsetX, offsetY),
            unitDataArray           : getNewUnitDataListForOffset(mapRawData, offsetX, offsetY),
            warRuleArray            : mapRawData.warRuleArray,
            warEventFullData        : mapRawData.warEventFullData,
        };
    }
    function getNewTileDataListForOffset(mapRawData: IMapRawData, offsetX: number, offsetY: number): ISerialTile[] {
        const width         = Helpers.getExisted(mapRawData.mapWidth);
        const height        = Helpers.getExisted(mapRawData.mapHeight);
        const tileDataList  : ISerialTile[] = [];
        for (const tileData of Helpers.getExisted(mapRawData.tileDataArray)) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
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
        const width         = Helpers.getExisted(mapRawData.mapWidth);
        const height        = Helpers.getExisted(mapRawData.mapHeight);
        const unitDataArray : ISerialUnit[] = [];
        for (const unitData of mapRawData.unitDataArray || []) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex));
            const newX      = gridIndex.x + offsetX;
            const newY      = gridIndex.y + offsetY;
            if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
                const newData       = Helpers.deepClone(unitData);
                newData.gridIndex   = { x: newX, y: newY };
                unitDataArray.push(newData);
            }
        }

        const allUnitsDict  = new Map<number, { unit: ISerialUnit, newUnitId: number }>();
        let nextUnitId      = 0;
        for (const unit of unitDataArray) {
            allUnitsDict.set(Helpers.getExisted(unit.unitId), { unit, newUnitId: nextUnitId } );
            ++nextUnitId;
        }
        for (const [, value] of allUnitsDict) {
            const unit = value.unit;
            unit.unitId = value.newUnitId;

            const loaderUnitId = unit.loaderUnitId;
            if (loaderUnitId != null) {
                unit.loaderUnitId = Helpers.getExisted(allUnitsDict.get(loaderUnitId)).newUnitId;
            }
        }

        return unitDataArray;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function reviseAllUnitIds(unitMap: BwUnitMap): void {
        const allUnits  = new Map<number, { unit: Twns.BaseWar.BwUnit, newUnitId: number }>();
        let nextUnitId  = 0;
        for (const unit of unitMap.getAllUnits()) {
            allUnits.set(unit.getUnitId(), { unit, newUnitId: nextUnitId } );
            ++nextUnitId;
        }
        for (const [, value] of allUnits) {
            const unit = value.unit;
            unit.setUnitId(value.newUnitId);

            const loaderUnitId = unit.getLoaderUnitId();
            if (loaderUnitId != null) {
                unit.setLoaderUnitId(Helpers.getExisted(allUnits.get(loaderUnitId), ClientErrorCode.MeUtility_ReviseAllUnitIds_00).newUnitId);
            }
        }
        unitMap.setNextUnitId(nextUnitId);
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
                if (checkIsSymmetrical(tile, tileMap.getTile(Helpers.getExisted(getSymmetricalGridIndex(gridIndex, SymmetryType.LeftToRight, mapSize))), SymmetryType.LeftToRight)) {
                    ++countLeftRight;
                }
                if (checkIsSymmetrical(tile, tileMap.getTile(Helpers.getExisted(getSymmetricalGridIndex(gridIndex, SymmetryType.UpToDown, mapSize))), SymmetryType.UpToDown)) {
                    ++countUpDown;
                }
                if (checkIsSymmetrical(tile, tileMap.getTile(Helpers.getExisted(getSymmetricalGridIndex(gridIndex, SymmetryType.Rotation, mapSize))), SymmetryType.Rotation)) {
                    ++countRotational;
                }
                if (isSquare) {
                    if (checkIsSymmetrical(tile, tileMap.getTile(Helpers.getExisted(getSymmetricalGridIndex(gridIndex, SymmetryType.UpLeftToDownRight, mapSize))), SymmetryType.UpLeftToDownRight)) {
                        ++countUpLeftDownRight;
                    }
                    if (checkIsSymmetrical(tile, tileMap.getTile(Helpers.getExisted(getSymmetricalGridIndex(gridIndex, SymmetryType.UpRightToDownLeft, mapSize))), SymmetryType.UpRightToDownLeft)) {
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
        };
    }
    export function getSymmetricalGridIndex(gridIndex: GridIndex, symmetryType: SymmetryType, mapSize: Types.MapSize): GridIndex | null {
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
        const decoratorType = tile1.getDecoratorType();
        return (baseType === tile2.getBaseType())
            && (Twns.Config.ConfigManager.getSymmetricalTileObjectType(objectType, symmetryType) === tile2.getObjectType())
            && (decoratorType == tile2.getDecoratorType())
            && (Twns.Config.ConfigManager.checkIsTileBaseSymmetrical({
                baseType,
                shapeId1    : tile1.getBaseShapeId(),
                shapeId2    : tile2.getBaseShapeId(),
                symmetryType,
            }))
            && (Twns.Config.ConfigManager.checkIsTileObjectSymmetrical({
                objectType,
                shapeId1    : tile1.getObjectShapeId(),
                shapeId2    : tile2.getObjectShapeId(),
                symmetryType,
            }))
            && (Twns.Config.ConfigManager.checkIsTileDecoratorSymmetrical({
                decoratorType,
                shapeId1    : tile1.getDecoratorShapeId(),
                shapeId2    : tile2.getDecoratorShapeId(),
                symmetryType,
            }));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getAutoRoadShapeId(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): number {
        const { x, y }      = gridIndex;
        const isAdjacent4   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x: x - 1, y }) ? 1 : 0;
        const isAdjacent3   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x: x + 1, y }) ? 1 : 0;
        const isAdjacent2   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x, y: y + 1 }) ? 1 : 0;
        const isAdjacent1   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x, y: y - 1 }) ? 1 : 0;
        return TileRoadAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
    }
    export function getAutoBridgeShapeId(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): number {
        const { x, y }      = gridIndex;
        const isAdjacent4   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x: x - 1, y }) ? 1 : 0;
        const isAdjacent3   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x: x + 1, y }) ? 1 : 0;
        const isAdjacent2   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x, y: y + 1 }) ? 1 : 0;
        const isAdjacent1   = checkCanRoadOrBridgeLinkToTile(tileMap, gridIndex, { x, y: y - 1 }) ? 1 : 0;
        return TileBridgeAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
    }
    function checkCanRoadOrBridgeLinkToTile(tileMap: Twns.BaseWar.BwTileMap, gridIndex1: GridIndex, gridIndex2: GridIndex): boolean {
        if (!GridIndexHelpers.checkIsInsideMap(gridIndex2, tileMap.getMapSize())) {
            return true;
        }

        const tile2         = tileMap.getTile(gridIndex2);
        const objectType2   = tile2.getObjectType();
        if ((objectType2 === TileObjectType.Bridge) || (objectType2 === TileObjectType.Road)) {
            return true;
        }

        const baseType1 = tileMap.getTile(gridIndex1).getBaseType();
        if ((baseType1 === TileBaseType.River) || (baseType1 === TileBaseType.Sea)) {
            if (tile2.getMoveCostByMoveType(Types.MoveType.Tank) != null) {
                return true;
            }
        }

        return false;
    }

    export function getAutoPlasmaShapeId(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): number {
        const { x, y }              = gridIndex;
        const isAdjacent4           = checkIsPlasma(tileMap, { x: x - 1, y }) ? 1 : 0;
        const isAdjacent3           = checkIsPlasma(tileMap, { x: x + 1, y }) ? 1 : 0;
        const isAdjacent2           = checkIsPlasma(tileMap, { x, y: y + 1 }) ? 1 : 0;
        const isAdjacent1           = checkIsPlasma(tileMap, { x, y: y - 1 }) ? 1 : 0;
        const isAdjacentToMeteor    = GridIndexHelpers.getAdjacentGrids(gridIndex, tileMap.getMapSize()).some(v => tileMap.getTile(v).getType() === TileType.Meteor);
        return Helpers.getExisted(TilePlasmaAutoShapeIdMap.get(isAdjacentToMeteor))[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
    }
    function checkIsPlasma(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): boolean {
        if (!GridIndexHelpers.checkIsInsideMap(gridIndex, tileMap.getMapSize())) {
            return true;
        }

        const tileType = tileMap.getTile(gridIndex).getType();
        return (tileType === TileType.Plasma);
    }

    export function getAutoPipeShapeId(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): number {
        const isAdjacent4   = checkCanLinkToPipe(tileMap, gridIndex, Types.Direction.Left) ? 1 : 0;
        const isAdjacent3   = checkCanLinkToPipe(tileMap, gridIndex, Types.Direction.Right) ? 1 : 0;
        const isAdjacent2   = checkCanLinkToPipe(tileMap, gridIndex, Types.Direction.Down) ? 1 : 0;
        const isAdjacent1   = checkCanLinkToPipe(tileMap, gridIndex, Types.Direction.Up) ? 1 : 0;
        return TilePipeAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
    }
    function checkCanLinkToPipe(tileMap: Twns.BaseWar.BwTileMap, origin: GridIndex, direction: Types.Direction): boolean {
        const gridIndex = GridIndexHelpers.getAdjacentGrid(origin, direction);
        if (!GridIndexHelpers.checkIsInsideMap(gridIndex, tileMap.getMapSize())) {
            return true;
        }

        const tile          = tileMap.getTile(gridIndex);
        const objectType    = tile.getObjectType();
        const objectShapeId = tile.getObjectShapeId();
        if (objectType === Types.TileObjectType.Empty) {
            return ((objectShapeId === 1) && ((direction === Types.Direction.Left) || (direction === Types.Direction.Right)))
                || ((objectShapeId === 2) && ((direction === Types.Direction.Up) || (direction === Types.Direction.Down)));
        } else if (objectType === Types.TileObjectType.Pipe) {
            return true;
        } else if (objectType === Types.TileObjectType.PipeJoint) {
            return ((objectShapeId === 0) && ((direction === Types.Direction.Left) || (direction === Types.Direction.Right)))
                || ((objectShapeId === 1) && ((direction === Types.Direction.Up) || (direction === Types.Direction.Down)));
        } else {
            return false;
        }
    }

    export function getAutoTileDecoratorTypeAndShapeId(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): { decoratorType: TileDecoratorType | null, shapeId: number | null } {
        const tile = tileMap.getTile(gridIndex);
        if (tile == null) {
            return {
                decoratorType   : null,
                shapeId         : null,
            };
        }

        const baseType = tile.getBaseType();
        if (baseType === TileBaseType.Sea) {
            const mapSize   = tileMap.getMapSize();
            let weight      = Math.pow(2, 7);
            let index       = 0;
            for (let offsetY = -1; offsetY <= 1; ++offsetY) {
                for (let offsetX = -1; offsetX <= 1; ++offsetX) {
                    if ((offsetX === 0) && (offsetY === 0)) {
                        continue;
                    }

                    const g = GridIndexHelpers.add(gridIndex, { x: offsetX, y: offsetY });
                    const t = GridIndexHelpers.checkIsInsideMap(g, mapSize) ? tileMap.getTile(g).getBaseType() : null;
                    if ((t != null)              &&
                        (t !== TileBaseType.Sea) &&
                        (t !== TileBaseType.Beach)
                    ) {
                        index += weight;
                    }
                    weight /= 2;
                }
            }

            return {
                decoratorType   : TileDecoratorType.Shore,
                shapeId         : TileDecoratorAutoShapeIdArray[index],
            };

        } else if (baseType === TileBaseType.Beach) {
            const shapeId = tile.getBaseShapeId();
            if ((shapeId === 0) || (shapeId === 4) || (shapeId === 8) || (shapeId === 12)) {
                const isSea1 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: 1 }));
                const isSea2 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: 1 }));
                if (isSea1) {
                    return isSea2
                        ? { decoratorType: null,                        shapeId: null }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 1 };
                } else {
                    return isSea2
                        ? { decoratorType: TileDecoratorType.Shore,    shapeId: 4 }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 5 };
                }

            } else if ((shapeId === 1) || (shapeId === 5) || (shapeId === 9) || (shapeId === 13)) {
                const isSea1 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: -1 }));
                const isSea2 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: -1 }));
                if (isSea1) {
                    return isSea2
                        ? { decoratorType: null,                        shapeId: null }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 2 };
                } else {
                    return isSea2
                        ? { decoratorType: TileDecoratorType.Shore,    shapeId: 8 }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 10 };
                }

            } else if ((shapeId === 2) || (shapeId === 6) || (shapeId === 10) || (shapeId === 14)) {
                const isSea1 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: -1 }));
                const isSea2 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: 1 }));
                if (isSea1) {
                    return isSea2
                        ? { decoratorType: null,                        shapeId: null }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 1 };
                } else {
                    return isSea2
                        ? { decoratorType: TileDecoratorType.Shore,    shapeId: 2 }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 3 };
                }

            } else if ((shapeId === 3) || (shapeId === 7) || (shapeId === 11) || (shapeId === 15)) {
                const isSea1 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: -1 }));
                const isSea2 = checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: 1 }));
                if (isSea1) {
                    return isSea2
                        ? { decoratorType: null,                        shapeId: null }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 4 };
                } else {
                    return isSea2
                        ? { decoratorType: TileDecoratorType.Shore,    shapeId: 8 }
                        : { decoratorType: TileDecoratorType.Shore,    shapeId: 12 };
                }

            } else if ((shapeId === 16) || (shapeId === 20) || (shapeId === 24) || (shapeId === 28)) {
                return (checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: 1 })))
                    ? { decoratorType: null,                        shapeId: null }
                    : { decoratorType: TileDecoratorType.Shore,    shapeId: 1 };

            } else if ((shapeId === 17) || (shapeId === 21) || (shapeId === 25) || (shapeId === 29)) {
                return (checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: 1 })))
                    ? { decoratorType: null,                        shapeId: null }
                    : { decoratorType: TileDecoratorType.Shore,    shapeId: 4 };

            } else if ((shapeId === 18) || (shapeId === 22) || (shapeId === 26) || (shapeId === 30)) {
                return (checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: -1, y: -1 })))
                    ? { decoratorType: null,                        shapeId: null }
                    : { decoratorType: TileDecoratorType.Shore,    shapeId: 8 };

            } else if ((shapeId === 19) || (shapeId === 23) || (shapeId === 27) || (shapeId === 31)) {
                return (checkIsSeaOrEmpty(tileMap, GridIndexHelpers.add(gridIndex, { x: 1, y: -1 })))
                    ? { decoratorType: null,                        shapeId: null }
                    : { decoratorType: TileDecoratorType.Shore,    shapeId: 2 };

            } else {
                return {
                    decoratorType   : null,
                    shapeId         : null,
                };
            }
        }

        return {
            decoratorType   : null,
            shapeId         : null,
        };
    }
    function checkIsSeaOrEmpty(tileMap: Twns.BaseWar.BwTileMap, gridIndex: GridIndex): boolean {
        if (!GridIndexHelpers.checkIsInsideMap(gridIndex, tileMap.getMapSize())) {
            return true;
        } else {
            return tileMap.getTile(gridIndex)?.getBaseType() === TileBaseType.Sea;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function getErrorCodeForMapRawData(mapRawData: IMapRawData): Promise<ClientErrorCode> {
        const gameConfig = await Twns.Config.ConfigManager.getLatestGameConfig();
        if (gameConfig == null) {
            return ClientErrorCode.MapRawDataValidation00;
        }

        const designerNameError = getErrorCodeForMapDesigner(mapRawData.designerName);
        if (designerNameError) {
            return designerNameError;
        }

        const mapNameArrayError = getErrorCodeForMapNameArray(mapRawData.mapNameArray);
        if (mapNameArrayError) {
            return mapNameArrayError;
        }

        const unitArrayError = getErrorCodeForUnitArray(mapRawData.unitDataArray);
        if (unitArrayError) {
            return unitArrayError;
        }

        const playersCountUnneutralError = getErrorCodeForPlayersCountUnneutral(mapRawData);
        if (playersCountUnneutralError) {
            return playersCountUnneutralError;
        }

        const warRuleError = WarRuleHelpers.getErrorCodeForWarRuleArray({
            ruleList                : mapRawData.warRuleArray,
            playersCountUnneutral   : Helpers.getExisted(mapRawData.playersCountUnneutral),
            allWarEventIdArray      : Twns.WarHelpers.WarEventHelpers.getAllWarEventIdArray(mapRawData.warEventFullData),
            gameConfig,
        });
        if (warRuleError) {
            return warRuleError;
        }

        const warEventError = Twns.WarHelpers.WarEventHelpers.getErrorCodeForWarEventFullData(mapRawData, gameConfig);
        if (warEventError) {
            return warEventError;
        }

        return await new Twns.TestWar.TwWar().getErrorCodeForInitByMapRawData(mapRawData, gameConfig);
    }
    function getErrorCodeForMapDesigner(mapDesigner: Types.Undefinable<string>): ClientErrorCode {
        if ((mapDesigner == null)                                       ||
            (mapDesigner.length <= 0)                                   ||
            (mapDesigner.length > CommonConstants.MapMaxDesignerLength)
        ) {
            return ClientErrorCode.MapRawDataValidation01;
        } else {
            return ClientErrorCode.NoError;
        }
    }
    function getErrorCodeForMapNameArray(mapNameList: Types.Undefinable<CommonProto.Structure.ILanguageText[]>): ClientErrorCode {
        if (!Helpers.checkIsValidLanguageTextArray({
            list            : mapNameList,
            maxTextLength   : CommonConstants.MapMaxNameLength,
            minTextLength   : 1,
            minTextCount    : 1,
        })) {
            return ClientErrorCode.MapRawDataValidation02;
        }

        return ClientErrorCode.NoError;
    }
    function getErrorCodeForUnitArray(unitArray: Types.Undefinable<CommonProto.WarSerialization.ISerialUnit[]>): ClientErrorCode {
        if (!Twns.WarHelpers.WarCommonHelpers.checkIsUnitIdCompact(unitArray)) {
            return ClientErrorCode.MapRawDataValidation03;
        }

        return ClientErrorCode.NoError;
    }
    function getErrorCodeForPlayersCountUnneutral(mapRawData: IMapRawData): ClientErrorCode {
        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if ((playersCountUnneutral == null)                                 ||
            (playersCountUnneutral <= CommonConstants.WarFirstPlayerIndex)  ||
            (playersCountUnneutral > CommonConstants.WarMaxPlayerIndex)
        ) {
            return ClientErrorCode.MapRawDataValidation04;
        }

        const playerIndexSet = new Set<number>();
        for (const tileData of mapRawData.tileDataArray || []) {
            const playerIndex = tileData.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex < CommonConstants.WarNeutralPlayerIndex)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                return ClientErrorCode.MapRawDataValidation05;
            }
            playerIndexSet.add(playerIndex);
        }
        for (const unitData of mapRawData.unitDataArray || []) {
            const playerIndex = unitData.playerIndex;
            if ((playerIndex == null)                                   ||
                (playerIndex < CommonConstants.WarFirstPlayerIndex)     ||
                (playerIndex > playersCountUnneutral)
            ) {
                return ClientErrorCode.MapRawDataValidation06;
            }
            playerIndexSet.add(playerIndex);
        }

        for (const playerIndex of playerIndexSet) {
            if ((playerIndex > CommonConstants.WarFirstPlayerIndex) &&
                (!playerIndexSet.has(playerIndex - 1))
            ) {
                return ClientErrorCode.MapRawDataValidation07;
            }
        }

        if (Math.max(...playerIndexSet) !== playersCountUnneutral) {
            return ClientErrorCode.MapRawDataValidation08;
        }

        return ClientErrorCode.NoError;
    }

    export async function getSevereErrorCodeForMapRawData(mapRawData: IMapRawData): Promise<ClientErrorCode> {
        if (ProtoManager.encodeAsMapRawData(mapRawData).byteLength > CommonConstants.MapMaxFileSize) {
            return ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_00;
        }

        try {
            const war = new MeWar();
            war.initWithMapEditorData(
                {
                    mapRawData,
                    slotIndex: 0,
                },
                await Twns.Config.ConfigManager.getLatestGameConfig()
            );
            war.startRunning()
                .startRunningView();
        } catch (e) {
            return (e as Types.CustomError).errorCode ?? ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_01;
        }

        return ClientErrorCode.NoError;
    }
}

// export default MeUtility;
