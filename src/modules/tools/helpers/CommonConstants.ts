
// import Types    from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CommonConstants {
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;

    type FrameCfg = {
        framesCount     : number;
        ticksPerFrame   : number;
    };
    type TileDecoratorShapeCfg = {
        shapesCount     : number;
    };

    export const DiscordUrl                             = `https://discord.gg/jdtRpY9`;
    export const GithubUrl                              = `https://github.com/Babygogogo/TinyWarsClient`;
    export const LegacyVersionUrl                       = `https://tinywars.online/game/legacy`;
    export const TestVersionUrl                         = `https://tinywars.online/game/test`;

    export const ErrorTextForLang                       = `LangErr`;
    export const ErrorTextForUndefined                  = `UndefErr`;
    export const GameVersion                            = Types.GameVersion.Legacy;
    export const AdminUserId                            = 1000001;
    export const NameListMaxLength                      = 5;

    export const BroadcastTextMaxLength                 = 150;
    export const ChangeLogTextMaxLength                 = 200;
    export const ChangeLogTextListMaxLength             = 2;
    export const ChangeLogMessageListMaxLength          = 100;

    export const BgmSfxCode = {
        None        : 0,
        CoEmpty     : 9999,
        Lobby       : 10000,
        MapEditor   : 10100,
        CoPower     : 10200,
    };

    export const UnitDisplayLayer = {
        Air         : 3,
        Ground      : 2,
        Sea         : 1,
    };

    export const MapMaxGridsCount                       = 1000;
    export const MapMaxNameLength                       = 30;
    export const MapMaxDesignerLength                   = 30;
    export const MapMaxRating                           = 10;
    export const MapMinRating                           = 0;
    export const MapMaxFileSize                         = 50000;
    export const MapMinLocationId                       = 1;
    export const MapMaxLocationId                       = 30;
    export const MapDescriptionMaxLength                = 1000;

    export const WarEventNameMaxLength                                  = 150;
    export const WarEventMaxEventsPerMap                                = 30;
    export const WarEventMaxConditionNodesPerMap                        = 50;
    export const WarEventMaxConditionsPerMap                            = 100;
    export const WarEventMaxActionsPerMap                               = 100;
    export const WarEventMaxActionsPerEvent                             = 10;
    export const WarEventMaxCallCountTotal                              = 1000;
    export const WarEventMaxCallCountInPlayerTurn                       = 10;
    export const WarEventActionAddUnitMaxCount                          = 50;
    export const WarEventActionDialogueTextMaxLength                    = 300;
    export const WarEventActionDialogueMaxCount                         = 100;
    export const WarEventActionDialogueNameMaxLength                    = 30;
    export const WarEventActionPersistentShowTextMaxLength              = 100;
    export const WarEventActionSetCustomCounterMaxDeltaValue            = 10000000;
    export const WarEventActionSetCustomCounterMaxMultiplierPercentage  = 10000;
    export const WarEventActionSetPlayerFundMaxDeltaValue               = 10000000;
    export const WarEventActionSetPlayerFundMaxMultiplierPercentage     = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxMultiplierPercentage = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxDeltaPercentage      = 100;

    export const MapEditorSlotMaxCountForNormal         = 10;
    export const MapEditorSlotMaxCountForCommittee      = 100;
    export const MapEditorAutoSaveMinTime               = 180;
    export const MapEditorAutoSaveMaxTime               = 1800;
    export const MapReviewCommentMaxLength              = 5000;
    export const SpwSaveSlotMaxCount                    = 10;
    export const SpmSaveSlotCommentMaxLength            = 15;

    export const RankInitialScore                       = 1200;
    export const RankMaxConcurrentCount                 = 10;
    export const RankMinConcurrentCount                 = 0;
    export const RankRoomPhaseTime                      = 3600 * 24;

    export const ChatMessageMaxLength                   = 200;
    export const ChatErrorMaxLength                     = 2000;
    export const ChatTeamDivider                        = 100;

    export const SiloRadius                             = 2;
    export const SiloDamage                             = 30;

    export const UnitHpNormalizer                       = 10;
    export const UnitMaxHp                              = 100;
    export const UnitAndTileMinSkinId                   = 1;
    export const UnitAndTileMaxSkinId                   = 5;
    export const UnitAndTileNeutralSkinId               = 0;

    export const CoEmptyId                              = 0;
    export const TileBaseEmptyType                      = 0;

    export const WarNeutralPlayerIndex                  = 0;
    export const WarFirstPlayerIndex                    = 1;
    export const WarMaxPlayerIndex                      = 5;
    export const WarNeutralTeamIndex                    = 0;
    export const WarFirstTeamIndex                      = 1;
    export const WarFirstTurnIndex                      = 1;
    export const WarPlayerMaxFund                       = 1_000_000_000;
    export const WarCustomCounterMaxValue               = 1_000_000_000;

    export const ReplayMaxRating                        = 10;
    export const ReplayMinRating                        = 0;

    export const WarNameMaxLength                       = 20;
    export const WarCommentMaxLength                    = 50;
    export const WarPasswordMaxLength                   = 4;
    export const WarCustomCounterMinId                  = 1;
    export const WarCustomCounterMaxId                  = 30;
    export const WarBootTimerRegularMaxLimit            = 3600 * 24 * 7;
    export const WarBootTimerRegularDefaultValue        = 3600 * 24 * 3;
    export const WarBootTimerIncrementalMaxLimit        = 3600 * 24;
    export const WarBootTimerDefaultParams              = [Types.BootTimerType.Regular, WarBootTimerRegularDefaultValue];
    export const WarMaxTurnsLimit                       = 80;
    export const WarMinTurnsLimit                       = 20;

    export const WarRuleFirstId                             = 0;
    export const WarRuleNameMaxLength                       = 15;
    export const WarRuleOffenseBonusMinLimit                = -100;
    export const WarRuleOffenseBonusMaxLimit                = 10000;
    export const WarRuleOffenseBonusDefault                 = 0;
    export const WarRuleEnergyGrowthMultiplierMinLimit      = 0;
    export const WarRuleEnergyGrowthMultiplierMaxLimit      = 10000;
    export const WarRuleEnergyGrowthMultiplierDefault       = 100;
    export const WarRuleIncomeMultiplierMinLimit            = 0;
    export const WarRuleIncomeMultiplierMaxLimit            = 10000;
    export const WarRuleIncomeMultiplierDefault             = 100;
    export const WarRuleEnergyAddPctOnLoadCoMinLimit        = 0;
    export const WarRuleEnergyAddPctOnLoadCoMaxLimit        = 100;
    export const WarRuleEnergyAddPctOnLoadCoDefault         = 0;
    export const WarRuleInitialFundMinLimit                 = 0;
    export const WarRuleInitialFundMaxLimit                 = 1000000;
    export const WarRuleInitialFundDefault                  = 0;
    export const WarRuleBannedUnitTypeCountDefault          = 0;
    export const WarRuleLuckMinLimit                        = -100;
    export const WarRuleLuckMaxLimit                        = 100;
    export const WarRuleLuckDefaultLowerLimit               = 0;
    export const WarRuleLuckDefaultUpperLimit               = 10;
    export const WarRuleMoveRangeModifierMinLimit           = -10;
    export const WarRuleMoveRangeModifierMaxLimit           = 10;
    export const WarRuleMoveRangeModifierDefault            = 0;
    export const WarRuleVisionRangeModifierMinLimit         = -10;
    export const WarRuleVisionRangeModifierMaxLimit         = 10;
    export const WarRuleVisionRangeModifierDefault          = 0;
    export const WarRuleMaxCount                            = 5;

    export const GridSize: Types.Size = {
        width   : 24,
        height  : 24,
    };
    export const StageMinScale      = 100;
    export const StageMaxScale      = 300;
    export const DefaultTweenTime   = 200;

    export const TileDecoratorFrameConfigs = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileDecoratorType, FrameCfg>([
                [ TileDecoratorType.Shore, { framesCount: 6, ticksPerFrame: 1 } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileDecoratorType, FrameCfg>([
                [ TileDecoratorType.Shore, { framesCount: 6, ticksPerFrame: 1 } ],
            ]),
        ],
    ]);
    export const TileDecoratorShapeConfigs = new Map<TileDecoratorType, TileDecoratorShapeCfg>([
        [ TileDecoratorType.Shore, { shapesCount: 47 } ],
    ]);

    export const TileBaseSymmetry = new Map<TileBaseType, Map<number, number[]>>([
        //          上下对称 左下右上 左右对称 左上右下 旋转对称    // 对称方式
        // 原图     上下翻转 左下右上 左右翻转 左上右下 逆时针180  // 图块变换
        ////////// plain: 1 (1 total) //////////
        [TileBaseType.Plain, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileBaseType.River, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   1,      3,      2,      4,      2,  ]],
            [   2,  [   2,      4,      1,      3,      1,  ]],
            [   3,  [   4,      1,      3,      2,      4,  ]],
            [   4,  [   3,      2,      4,      1,      3,  ]],
            [   5,  [   5,      10,     5,      10,     5,  ]],
            [   6,  [   8,      6,      7,      9,      9,  ]],
            [   7,  [   9,      8,      6,      7,      8,  ]],
            [   8,  [   6,      7,      9,      8,      7,  ]],
            [   9,  [   7,      9,      8,      6,      6,  ]],
            [   10, [   10,     5,      10,     5,      10, ]],
            [   11, [   12,     13,     11,     14,     12, ]],
            [   12, [   11,     14,     12,     13,     11, ]],
            [   13, [   13,     11,     14,     12,     14, ]],
            [   14, [   14,     12,     13,     11,     13, ]],
            [   15, [   15,     15,     15,     15,     15, ]],
        ])],
        [TileBaseType.Sea, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   2,      1,      4,      8,      8,  ]],
            [   2,  [   1,      4,      8,      2,      4,  ]],
            [   3,  [   3,      5,      12,     10,     12, ]],
            [   4,  [   8,      2,      1,      4,      2,  ]],
            [   5,  [   10,     3,      5,      12,     10, ]],
            [   6,  [   9,      6,      9,      6,      6,  ]],
            [   7,  [   11,     7,      13,     14,     14, ]],
            [   8,  [   4,      8,      2,      1,      1,  ]],
            [   9,  [   6,      9,      6,      9,      9,  ]],
            [   10, [   5,      12,     10,     3,      5,  ]],
            [   11, [   7,      13,     14,     11,     13, ]],
            [   12, [   12,     10,     3,      5,      3,  ]],
            [   13, [   14,     11,     7,      13,     11, ]],
            [   14, [   13,     14,     11,     7,      7,  ]],
            [   15, [   15,     15,     15,     15,     15, ]],
            [   16, [   16,     25,     20,     34,     20, ]],
            [   17, [   18,     26,     21,     36,     22, ]],
            [   18, [   17,     27,     22,     35,     21, ]],
            [   19, [   19,     28,     23,     37,     23, ]],
            [   20, [   20,     34,     16,     25,     16, ]],
            [   21, [   22,     35,     17,     27,     18, ]],
            [   22, [   21,     36,     18,     26,     17, ]],
            [   23, [   23,     37,     19,     28,     19, ]],
            [   24, [   24,     43,     24,     43,     24, ]],
            [   25, [   34,     16,     25,     20,     34, ]],
            [   26, [   35,     17,     27,     22,     36, ]],
            [   27, [   36,     18,     26,     21,     35, ]],
            [   28, [   37,     19,     28,     23,     37, ]],
            [   29, [   38,     29,     31,     40,     40, ]],
            [   30, [   39,     30,     32,     41,     41, ]],
            [   31, [   40,     38,     29,     31,     38, ]],
            [   32, [   41,     39,     30,     32,     39, ]],
            [   33, [   42,     44,     33,     45,     42, ]],
            [   34, [   25,     20,     34,     16,     25, ]],
            [   35, [   26,     21,     36,     18,     27, ]],
            [   36, [   27,     22,     35,     17,     26, ]],
            [   37, [   28,     23,     37,     19,     28, ]],
            [   38, [   29,     31,     40,     38,     31, ]],
            [   39, [   30,     32,     41,     39,     32, ]],
            [   40, [   31,     40,     38,     29,     29, ]],
            [   41, [   32,     41,     39,     30,     30, ]],
            [   42, [   33,     45,     42,     44,     33, ]],
            [   43, [   43,     24,     43,     24,     43, ]],
            [   44, [   44,     33,     45,     42,     45, ]],
            [   45, [   45,     42,     44,     33,     44, ]],
            [   46, [   46,     46,     46,     46,     46, ]],
        ])],
        [TileBaseType.Beach, new Map([
            [   0,  [   1,      2,      0,      3,      1,  ]],
            [   1,  [   0,      3,      1,      2,      0,  ]],
            [   2,  [   2,      0,      3,      1,      3,  ]],
            [   3,  [   3,      1,      2,      0,      2,  ]],
            [   4,  [   5,      6,      4,      7,      5,  ]],
            [   5,  [   4,      7,      5,      6,      4,  ]],
            [   6,  [   6,      4,      7,      5,      7,  ]],
            [   7,  [   7,      5,      6,      4,      6,  ]],
            [   8,  [   13,     14,     12,     15,     9,  ]],
            [   9,  [   12,     15,     13,     14,     8,  ]],
            [   10, [   14,     12,     15,     13,     11, ]],
            [   11, [   15,     13,     14,     12,     10, ]],
            [   12, [   9,      10,     8,      11,     13, ]],
            [   13, [   8,      11,     9,      10,     12, ]],
            [   14, [   10,     8,      11,     9,      15, ]],
            [   15, [   11,     9,      10,     8,      14, ]],
            [   16, [   19,     16,     17,     18,     18, ]],
            [   17, [   18,     19,     16,     17,     19, ]],
            [   18, [   17,     18,     19,     16,     16, ]],
            [   19, [   16,     17,     18,     19,     17, ]],
            [   20, [   23,     20,     21,     22,     22, ]],
            [   21, [   22,     23,     20,     21,     23, ]],
            [   22, [   21,     22,     23,     20,     20, ]],
            [   23, [   20,     21,     22,     23,     21, ]],
            [   24, [   31,     28,     29,     30,     26, ]],
            [   25, [   30,     31,     28,     29,     27, ]],
            [   26, [   29,     30,     31,     28,     24, ]],
            [   27, [   28,     29,     30,     31,     25, ]],
            [   28, [   27,     24,     25,     26,     30, ]],
            [   29, [   26,     27,     24,     25,     31, ]],
            [   30, [   25,     26,     27,     24,     28, ]],
            [   31, [   24,     25,     26,     27,     29, ]],
            [   32, [   33,     34,     32,     35,     33, ]],
            [   33, [   32,     35,     33,     34,     32, ]],
            [   34, [   34,     32,     35,     33,     35, ]],
            [   35, [   35,     33,     34,     32,     34, ]],
            [   36, [   36,     36,     36,     36,     36, ]],
        ])],
    ]);
    export const TileDecoratorSymmetry = new Map<TileDecoratorType, Map<number, number[]>>([
        //          上下对称 左下右上 左右对称 左上右下 旋转对称    // 对称方式
        // 原图     上下翻转 左下右上 左右翻转 左上右下 逆时针180  // 图块变换
        [TileDecoratorType.Empty, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileDecoratorType.Shore, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   2,      1,      4,      8,      8,  ]],
            [   2,  [   1,      4,      8,      2,      4,  ]],
            [   3,  [   3,      5,      12,     10,     12, ]],
            [   4,  [   8,      2,      1,      4,      2,  ]],
            [   5,  [   10,     3,      5,      12,     10, ]],
            [   6,  [   9,      6,      9,      6,      6,  ]],
            [   7,  [   11,     7,      13,     14,     14, ]],
            [   8,  [   4,      8,      2,      1,      1,  ]],
            [   9,  [   6,      9,      6,      9,      9,  ]],
            [   10, [   5,      12,     10,     3,      5,  ]],
            [   11, [   7,      13,     14,     11,     13, ]],
            [   12, [   12,     10,     3,      5,      3,  ]],
            [   13, [   14,     11,     7,      13,     11, ]],
            [   14, [   13,     14,     11,     7,      7,  ]],
            [   15, [   15,     15,     15,     15,     15, ]],
            [   16, [   16,     25,     20,     34,     20, ]],
            [   17, [   18,     26,     21,     36,     22, ]],
            [   18, [   17,     27,     22,     35,     21, ]],
            [   19, [   19,     28,     23,     37,     23, ]],
            [   20, [   20,     34,     16,     25,     16, ]],
            [   21, [   22,     35,     17,     27,     18, ]],
            [   22, [   21,     36,     18,     26,     17, ]],
            [   23, [   23,     37,     19,     28,     19, ]],
            [   24, [   24,     43,     24,     43,     24, ]],
            [   25, [   34,     16,     25,     20,     34, ]],
            [   26, [   35,     17,     27,     22,     36, ]],
            [   27, [   36,     18,     26,     21,     35, ]],
            [   28, [   37,     19,     28,     23,     37, ]],
            [   29, [   38,     29,     31,     40,     40, ]],
            [   30, [   39,     30,     32,     41,     41, ]],
            [   31, [   40,     38,     29,     31,     38, ]],
            [   32, [   41,     39,     30,     32,     39, ]],
            [   33, [   42,     44,     33,     45,     42, ]],
            [   34, [   25,     20,     34,     16,     25, ]],
            [   35, [   26,     21,     36,     18,     27, ]],
            [   36, [   27,     22,     35,     17,     26, ]],
            [   37, [   28,     23,     37,     19,     28, ]],
            [   38, [   29,     31,     40,     38,     31, ]],
            [   39, [   30,     32,     41,     39,     32, ]],
            [   40, [   31,     40,     38,     29,     29, ]],
            [   41, [   32,     41,     39,     30,     30, ]],
            [   42, [   33,     45,     42,     44,     33, ]],
            [   43, [   43,     24,     43,     24,     43, ]],
            [   44, [   44,     33,     45,     42,     45, ]],
            [   45, [   45,     42,     44,     33,     44, ]],
            [   46, [   46,     46,     46,     46,     46, ]],
        ])],
    ]);

    // const textArray: string[] = [];
    // for (const [tileObjectType, cfg] of [...TileObjectShapeSymmetry].sort((v1, v2) => v1[0] - v2[0])) {
    //     for (const [shapeId, shapeIdArray] of [...cfg].sort((v1, v2) => v1[0] - v2[0])) {
    //         textArray.push(`${tileObjectType},        ${shapeId},    ${shapeIdArray.join(`, `)}`);
    //     }
    // }
    // console.log(textArray.join(`\n`));

    export const TileDefaultCrystalData: CommonProto.WarSerialization.ITileCustomCrystalData = {
        radius                      : 2,
        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : false,

        deltaFund                   : 0,
        deltaEnergyPercentage       : 0,

        deltaHp                     : 2,
        deltaFuelPercentage         : 100,
        deltaPrimaryAmmoPercentage  : 100,
    };
    export const TileDefaultCannonUpData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonDownData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonLeftData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 4,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonRightData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 4,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomCannonData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 4,
        rangeForRight               : 4,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomLaserTurretData: CommonProto.WarSerialization.ITileCustomLaserTurretData = {
        rangeForDown                : 9999,
        rangeForLeft                : 9999,
        rangeForRight               : 9999,
        rangeForUp                  : 9999,

        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : true,

        deltaHp                     : -5,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
}

// export default CommonConstants;
