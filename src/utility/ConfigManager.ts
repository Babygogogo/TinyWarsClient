
namespace TinyWars.Utility.ConfigManager {
    import GridSize         = Types.Size;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import UnitCategory     = Types.UnitCategory;
    import TileCategory     = Types.TileCategory;
    import WeaponType       = Types.WeaponType;
    import UnitTemplateCfg  = Types.UnitTemplateCfg;
    import DamageChartCfg   = Types.DamageChartCfg;
    import BuildableTileCfg = Types.BuildableTileCfg;
    import VisionBonusCfg   = Types.VisionBonusCfg;
    import ITileCategoryCfg = ProtoTypes.Config.ITileCategoryCfg;
    import UnitCategoryCfg  = ProtoTypes.Config.IUnitCategoryCfg;
    import TileTemplateCfg  = ProtoTypes.Config.ITileTemplateCfg;
    import MoveCostCfg      = ProtoTypes.Config.IMoveCostCfg;
    import UnitPromotionCfg = ProtoTypes.Config.IUnitPromotionCfg;
    import IPlayerRankCfg   = ProtoTypes.Config.IPlayerRankCfg;
    import CoBasicCfg       = ProtoTypes.Config.ICoBasicCfg;
    import CoSkillCfg       = ProtoTypes.Config.ICoSkillCfg;

    ////////////////////////////////////////////////////////////////////////////////
    // Internal types.
    ////////////////////////////////////////////////////////////////////////////////
    type ExtendedFullConfig = {
        TileCategory            : { [category: number]: ITileCategoryCfg };
        UnitCategory            : { [category: number]: UnitCategoryCfg };
        TileTemplate            : { [tileType: number]: TileTemplateCfg };
        UnitTemplate            : { [unitType: number]: UnitTemplateCfg };
        DamageChart             : { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } };
        MoveCost                : { [tileType: number]: { [moveType: number]: MoveCostCfg } };
        UnitPromotion           : { [promotion: number]: UnitPromotionCfg };
        VisionBonus             : { [unitType: number]: { [tileType: number]: VisionBonusCfg } };
        BuildableTile           : { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } };
        PlayerRank              : { [minScore: number]: IPlayerRankCfg };
        CoBasic                 : { [coId: number]: CoBasicCfg };
        CoSkill                 : { [skillId: number]: CoSkillCfg };
        maxUnitPromotion?       : number;
        secondaryWeaponFlag?    : { [unitType: number]: boolean };
    }

    type FrameCfg = {
        framesCount     : number;
        ticksPerFrame   : number;
    }
    type TileObjectShapeCfg = {
        minPlayerIndex  : number;
        maxPlayerIndex  : number;
        shapesCount     : number;
    }
    type TileBaseShapeCfg = {
        shapesCount     : number;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Constants.
    ////////////////////////////////////////////////////////////////////////////////
    export const COMMON_CONSTANTS = {
        AdminUserId                             : 1000001,
        NameListMaxLength                       : 5,

        ChangeLogTextMaxLength                  : 200,
        ChangeLogTextListMaxLength              : 2,
        ChangeLogMessageListMaxLength           : 100,

        MaxGridsCount                           : 1000,
        MaxMapNameLength                        : 30,
        MaxDesignerLength                       : 30,

        WarEventNameMaxLength                   : 150,
        WarEventMaxEventsPerMap                 : 10,
        WarEventMaxConditionNodesPerMap         : 50,
        WarEventMaxConditionsPerMap             : 100,
        WarEventMaxActionsPerMap                : 100,
        WarEventMaxActionsPerEvent              : 10,
        WarEventMaxCallCountTotal               : 100,
        WarEventMaxCallCountInPlayerTurn        : 10,
        WarEventActionAddUnitMaxCount           : 50,

        MapEditorSlotMaxCountForNormal          : 3,
        MapEditorSlotMaxCountForCommittee       : 100,
        ScwSaveSlotMaxCount                     : 10,
        ScwSaveSlotCommentMaxLength             : 15,

        RankInitialScore                        : 1200,
        RankMaxConcurrentCount                  : 5,
        RankMaxBanCoCount                       : 3,

        ChatContentMaxLength                    : 200,
        ChatTeamDivider                         : 100,

        UnitHpNormalizer                        : 10,
        UnitMaxHp                               : 100,
        UnitAndTileMinSkinId                    : 1,
        UnitAndTileMaxSkinId                    : 4,
        UnitAndTileNeutralSkinId                : 0,

        CoEmptyId                               : 0,

        WarNeutralPlayerIndex                   : 0,
        WarFirstPlayerIndex                     : 1,
        WarMaxPlayerIndex                       : 4,
        WarNeutralTeamIndex                     : 0,
        WarFirstTeamIndex                       : 1,
        WarFirstTurnIndex                       : 1,

        ReplayMaxRating                         : 10,
        ReplayMinRating                         : 0,

        WarNameMaxLength                        : 20,
        WarCommentMaxLength                     : 50,
        WarPasswordMaxLength                    : 4,
        WarBootTimerRegularMaxLimit             : 3600 * 24 * 7,
        WarBootTimerRegularDefaultValue         : 3600 * 24 * 3,
        WarBootTimerIncrementalMaxLimit         : 3600 * 24,

        WarRuleFirstId                          : 0,
        WarRuleNameMaxLength                    : 15,
        WarRuleOffenseBonusMinLimit             : -100,
        WarRuleOffenseBonusMaxLimit             : 10000,
        WarRuleOffenseBonusDefault              : 0,
        WarRuleEnergyGrowthMultiplierMinLimit   : 0,
        WarRuleEnergyGrowthMultiplierMaxLimit   : 10000,
        WarRuleEnergyGrowthMultiplierDefault    : 100,
        WarRuleIncomeMultiplierMinLimit         : 0,
        WarRuleIncomeMultiplierMaxLimit         : 10000,
        WarRuleIncomeMultiplierDefault          : 100,
        WarRuleInitialEnergyPercentageMinLimit  : 0,
        WarRuleInitialEnergyPercentageMaxLimit  : 100,
        WarRuleInitialEnergyPercentageDefault   : 0,
        WarRuleInitialFundMinLimit              : 0,
        WarRuleInitialFundMaxLimit              : 1000000,
        WarRuleInitialFundDefault               : 0,
        WarRuleLuckMinLimit                     : -100,
        WarRuleLuckMaxLimit                     : 100,
        WarRuleLuckDefaultLowerLimit            : 0,
        WarRuleLuckDefaultUpperLimit            : 10,
        WarRuleMoveRangeModifierMinLimit        : -10,
        WarRuleMoveRangeModifierMaxLimit        : 10,
        WarRuleMoveRangeModifierDefault         : 0,
        WarRuleVisionRangeModifierMinLimit      : -10,
        WarRuleVisionRangeModifierMaxLimit      : 10,
        WarRuleVisionRangeModifierDefault       : 0,
        WarRuleMaxCount                         : 5,
    };

    const _GRID_SIZE: GridSize = {
        width: 72,
        height: 72
    };

    const _TILE_TYPE_MAPPING = new Map<TileBaseType, Map<TileObjectType, TileType>>([
        [TileBaseType.Beach, new Map([
            [TileObjectType.Empty,          TileType.Beach],
            [TileObjectType.Road,           TileType.Road],
            [TileObjectType.Bridge,         TileType.BridgeOnBeach],
            [TileObjectType.Wood,           TileType.Wood],
            [TileObjectType.Mountain,       TileType.Mountain],
            [TileObjectType.Wasteland,      TileType.Wasteland],
            [TileObjectType.Ruins,          TileType.Ruins],
            [TileObjectType.Fire,           TileType.Fire],
            [TileObjectType.Rough,          TileType.Rough],
            [TileObjectType.Mist,           TileType.MistOnBeach],
            [TileObjectType.Reef,           TileType.Reef],
            [TileObjectType.Plasma,         TileType.Plasma],
            [TileObjectType.Meteor,         TileType.Meteor],
            [TileObjectType.Silo,           TileType.Silo],
            [TileObjectType.EmptySilo,      TileType.EmptySilo],
            [TileObjectType.Headquarters,   TileType.Headquarters],
            [TileObjectType.City,           TileType.City],
            [TileObjectType.CommandTower,   TileType.CommandTower],
            [TileObjectType.Radar,          TileType.Radar],
            [TileObjectType.Factory,        TileType.Factory],
            [TileObjectType.Airport,        TileType.Airport],
            [TileObjectType.Seaport,        TileType.Seaport],
            [TileObjectType.TempAirport,    TileType.TempAirport],
            [TileObjectType.TempSeaport,    TileType.TempSeaport],
            [TileObjectType.GreenPlasma,    TileType.GreenPlasma],
        ])],
        [TileBaseType.Plain, new Map([
            [TileObjectType.Empty,          TileType.Plain],
            [TileObjectType.Road,           TileType.Road],
            [TileObjectType.Bridge,         TileType.BridgeOnPlain],
            [TileObjectType.Wood,           TileType.Wood],
            [TileObjectType.Mountain,       TileType.Mountain],
            [TileObjectType.Wasteland,      TileType.Wasteland],
            [TileObjectType.Ruins,          TileType.Ruins],
            [TileObjectType.Fire,           TileType.Fire],
            [TileObjectType.Rough,          TileType.Rough],
            [TileObjectType.Mist,           TileType.MistOnPlain],
            [TileObjectType.Reef,           TileType.Reef],
            [TileObjectType.Plasma,         TileType.Plasma],
            [TileObjectType.Meteor,         TileType.Meteor],
            [TileObjectType.Silo,           TileType.Silo],
            [TileObjectType.EmptySilo,      TileType.EmptySilo],
            [TileObjectType.Headquarters,   TileType.Headquarters],
            [TileObjectType.City,           TileType.City],
            [TileObjectType.CommandTower,   TileType.CommandTower],
            [TileObjectType.Radar,          TileType.Radar],
            [TileObjectType.Factory,        TileType.Factory],
            [TileObjectType.Airport,        TileType.Airport],
            [TileObjectType.Seaport,        TileType.Seaport],
            [TileObjectType.TempAirport,    TileType.TempAirport],
            [TileObjectType.TempSeaport,    TileType.TempSeaport],
            [TileObjectType.GreenPlasma,    TileType.GreenPlasma],
        ])],
        [TileBaseType.River, new Map([
            [TileObjectType.Empty,          TileType.River],
            [TileObjectType.Road,           TileType.Road],
            [TileObjectType.Bridge,         TileType.BridgeOnRiver],
            [TileObjectType.Wood,           TileType.Wood],
            [TileObjectType.Mountain,       TileType.Mountain],
            [TileObjectType.Wasteland,      TileType.Wasteland],
            [TileObjectType.Ruins,          TileType.Ruins],
            [TileObjectType.Fire,           TileType.Fire],
            [TileObjectType.Rough,          TileType.Rough],
            [TileObjectType.Mist,           TileType.MistOnRiver],
            [TileObjectType.Reef,           TileType.Reef],
            [TileObjectType.Plasma,         TileType.Plasma],
            [TileObjectType.Meteor,         TileType.Meteor],
            [TileObjectType.Silo,           TileType.Silo],
            [TileObjectType.EmptySilo,      TileType.EmptySilo],
            [TileObjectType.Headquarters,   TileType.Headquarters],
            [TileObjectType.City,           TileType.City],
            [TileObjectType.CommandTower,   TileType.CommandTower],
            [TileObjectType.Radar,          TileType.Radar],
            [TileObjectType.Factory,        TileType.Factory],
            [TileObjectType.Airport,        TileType.Airport],
            [TileObjectType.Seaport,        TileType.Seaport],
            [TileObjectType.TempAirport,    TileType.TempAirport],
            [TileObjectType.TempSeaport,    TileType.TempSeaport],
            [TileObjectType.GreenPlasma,    TileType.GreenPlasma],
        ])],
        [TileBaseType.Sea, new Map([
            [TileObjectType.Empty,          TileType.Sea],
            [TileObjectType.Road,           TileType.Road],
            [TileObjectType.Bridge,         TileType.BridgeOnSea],
            [TileObjectType.Wood,           TileType.Wood],
            [TileObjectType.Mountain,       TileType.Mountain],
            [TileObjectType.Wasteland,      TileType.Wasteland],
            [TileObjectType.Ruins,          TileType.Ruins],
            [TileObjectType.Fire,           TileType.Fire],
            [TileObjectType.Rough,          TileType.Rough],
            [TileObjectType.Mist,           TileType.MistOnSea],
            [TileObjectType.Reef,           TileType.Reef],
            [TileObjectType.Plasma,         TileType.Plasma],
            [TileObjectType.Meteor,         TileType.Meteor],
            [TileObjectType.Silo,           TileType.Silo],
            [TileObjectType.EmptySilo,      TileType.EmptySilo],
            [TileObjectType.Headquarters,   TileType.Headquarters],
            [TileObjectType.City,           TileType.City],
            [TileObjectType.CommandTower,   TileType.CommandTower],
            [TileObjectType.Radar,          TileType.Radar],
            [TileObjectType.Factory,        TileType.Factory],
            [TileObjectType.Airport,        TileType.Airport],
            [TileObjectType.Seaport,        TileType.Seaport],
            [TileObjectType.TempAirport,    TileType.TempAirport],
            [TileObjectType.TempSeaport,    TileType.TempSeaport],
            [TileObjectType.GreenPlasma,    TileType.GreenPlasma],
        ])],
    ]);

    const _TILE_TYPE_TO_TILE_OBJECT_TYPE = new Map<TileType, TileObjectType>([
        [TileType.Airport,          TileObjectType.Airport],
        [TileType.Beach,            TileObjectType.Empty],
        [TileType.BridgeOnBeach,    TileObjectType.Bridge],
        [TileType.BridgeOnPlain,    TileObjectType.Bridge],
        [TileType.BridgeOnRiver,    TileObjectType.Bridge],
        [TileType.BridgeOnSea,      TileObjectType.Bridge],
        [TileType.City,             TileObjectType.City],
        [TileType.CommandTower,     TileObjectType.CommandTower],
        [TileType.EmptySilo,        TileObjectType.EmptySilo],
        [TileType.Factory,          TileObjectType.Factory],
        [TileType.Fire,             TileObjectType.Fire],
        [TileType.GreenPlasma,      TileObjectType.GreenPlasma],
        [TileType.Headquarters,     TileObjectType.Headquarters],
        [TileType.Meteor,           TileObjectType.Meteor],
        [TileType.MistOnBeach,      TileObjectType.Mist],
        [TileType.MistOnPlain,      TileObjectType.Mist],
        [TileType.MistOnRiver,      TileObjectType.Mist],
        [TileType.MistOnSea,        TileObjectType.Mist],
        [TileType.Mountain,         TileObjectType.Mountain],
        [TileType.Plain,            TileObjectType.Empty],
        [TileType.Plasma,           TileObjectType.Plasma],
        [TileType.Radar,            TileObjectType.Radar],
        [TileType.Reef,             TileObjectType.Reef],
        [TileType.River,            TileObjectType.Empty],
        [TileType.Road,             TileObjectType.Road],
        [TileType.Rough,            TileObjectType.Rough],
        [TileType.Ruins,            TileObjectType.Ruins],
        [TileType.Sea,              TileObjectType.Empty],
        [TileType.Seaport,          TileObjectType.Seaport],
        [TileType.Silo,             TileObjectType.Silo],
        [TileType.TempAirport,      TileObjectType.TempAirport],
        [TileType.TempSeaport,      TileObjectType.TempSeaport],
        [TileType.Wasteland,        TileObjectType.Wasteland],
        [TileType.Wood,             TileObjectType.Wood],
    ]);

    const _TILE_BASE_FRAME_CFGS = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileBaseType, FrameCfg >([
                [ TileBaseType.Beach,   { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileBaseType.Plain,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.River,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.Sea,     { framesCount: 6,   ticksPerFrame: 1                }],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileBaseType, FrameCfg >([
                [ TileBaseType.Beach,   { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileBaseType.Plain,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.River,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.Sea,     { framesCount: 6,   ticksPerFrame: 1                }],
            ]),
        ],
    ]);
    const _TILE_BASE_SHAPE_CFGS = new Map<TileBaseType, TileBaseShapeCfg>([
        [ TileBaseType.Beach,   { shapesCount: 36,  }],
        [ TileBaseType.Plain,   { shapesCount: 1,   }],
        [ TileBaseType.River,   { shapesCount: 16,  }],
        [ TileBaseType.Sea,     { shapesCount: 47,  }],
    ]);
    const _TILE_OBJECT_FRAME_CFGS = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileObjectType, FrameCfg>([
                [ TileObjectType.Airport,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Bridge,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.City,          { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.CommandTower,  { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.EmptySilo,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Factory,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Fire,          { framesCount: 5,   ticksPerFrame: 1                }],
                [ TileObjectType.GreenPlasma,   { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Headquarters,  { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Meteor,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mist,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mountain,      { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Plasma,        { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Radar,         { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Reef,          { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Road,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Rough,         { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Ruins,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Seaport,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Silo,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempAirport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempSeaport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wasteland,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wood,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileObjectType, FrameCfg >([
                [ TileObjectType.Airport,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Bridge,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.City,          { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.CommandTower,  { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.EmptySilo,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Factory,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Fire,          { framesCount: 5,   ticksPerFrame: 1                }],
                [ TileObjectType.GreenPlasma,   { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Headquarters,  { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Meteor,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mist,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mountain,      { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Plasma,        { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Radar,         { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Reef,          { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Road,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Rough,         { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Ruins,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Seaport,       { framesCount: 2,   ticksPerFrame: 3                }],
                [ TileObjectType.Silo,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempAirport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempSeaport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wasteland,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wood,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
            ]),
        ],
    ]);
    const _TILE_OBJECT_SHAPE_CFGS = new Map<TileObjectType, TileObjectShapeCfg>([
        [ TileObjectType.Road,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 11,    }],
        [ TileObjectType.Bridge,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 11,    }],
        [ TileObjectType.Wood,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Mountain,      { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Ruins,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Wasteland,     { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Mist,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Fire,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Reef,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Rough,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Silo,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.EmptySilo,     { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Plasma,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 16,    }],
        [ TileObjectType.GreenPlasma,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 16,    }],
        [ TileObjectType.Meteor,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Headquarters,  { minPlayerIndex: COMMON_CONSTANTS.WarFirstPlayerIndex,     maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.City,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Factory,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Airport,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Seaport,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.CommandTower,  { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Radar,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.TempAirport,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.TempSeaport,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
    ]);

    const _TILE_BASE_SYMMETRY = new Map<TileBaseType, Map<number, number[]>>([
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
        ])],
    ]);

    const _TILE_OBJECT_SYMMETRY = new Map<TileObjectType, Map<number, number[]>>([
        // 原图     上下翻转 左下右上 左右翻转 左上右下 逆时针180  // 图块变换
        [TileObjectType.Empty, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Road, new Map([
            [   0,  [   0,      1,      0,      1,      0,  ]],
            [   1,  [   1,      0,      1,      0,      1,  ]],
            [   2,  [   4,      2,      3,      5,      5,  ]],
            [   3,  [   5,      4,      2,      3,      4,  ]],
            [   4,  [   2,      3,      5,      4,      3,  ]],
            [   5,  [   3,      5,      4,      2,      2,  ]],
            [   6,  [   7,      8,      6,      9,      7,  ]],
            [   7,  [   6,      9,      7,      8,      6,  ]],
            [   8,  [   8,      6,      9,      7,      9,  ]],
            [   9,  [   9,      7,      8,      6,      8,  ]],
            [   10, [   10,     10,     10,     10,     10, ]],
        ])],
        [TileObjectType.Bridge, new Map([
            [   0,  [   0,      1,      0,      1,      0,  ]],
            [   1,  [   1,      0,      1,      0,      1,  ]],
            [   2,  [   4,      2,      3,      5,      5,  ]],
            [   3,  [   5,      4,      2,      3,      4,  ]],
            [   4,  [   2,      3,      5,      4,      3,  ]],
            [   5,  [   3,      5,      4,      2,      2,  ]],
            [   6,  [   7,      8,      6,      9,      7,  ]],
            [   7,  [   6,      9,      7,      8,      6,  ]],
            [   8,  [   8,      6,      9,      7,      9,  ]],
            [   9,  [   9,      7,      8,      6,      8,  ]],
            [   10, [   10,     10,     10,     10,     10, ]],
        ])],
        [TileObjectType.Wood, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Mountain, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Wasteland, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Ruins, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Fire, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Rough, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Mist, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Reef, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Plasma, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   3,      2,      1,      4,      3,  ]],
            [   2,  [   2,      1,      4,      3,      4,  ]],
            [   3,  [   1,      4,      3,      2,      1,  ]],
            [   4,  [   4,      3,      2,      1,      2,  ]],
            [   5,  [   7,      6,      5,      8,      7,  ]],
            [   6,  [   6,      5,      8,      7,      8,  ]],
            [   7,  [   5,      8,      7,      6,      5,  ]],
            [   8,  [   8,      7,      6,      5,      6,  ]],
            [   9,  [   10,     9,      12,     11,     11, ]],
            [   10, [   9,      12,     11,     10,     12, ]],
            [   11, [   12,     11,     10,     9,      9,  ]],
            [   12, [   11,     10,     9,      12,     10, ]],
            [   13, [   13,     13,     13,     13,     13, ]],
            [   14, [   14,     15,     14,     15,     14, ]],
            [   15, [   15,     14,     15,     14,     15, ]],
        ])],
        [TileObjectType.Meteor, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Silo, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.EmptySilo, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Headquarters, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.City, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CommandTower, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Radar, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Factory, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Airport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Seaport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.TempAirport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.TempSeaport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.GreenPlasma, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   3,      2,      1,      4,      3,  ]],
            [   2,  [   2,      1,      4,      3,      4,  ]],
            [   3,  [   1,      4,      3,      2,      1,  ]],
            [   4,  [   4,      3,      2,      1,      2,  ]],
            [   5,  [   7,      6,      5,      8,      7,  ]],
            [   6,  [   6,      5,      8,      7,      8,  ]],
            [   7,  [   5,      8,      7,      6,      5,  ]],
            [   8,  [   8,      7,      6,      5,      6,  ]],
            [   9,  [   10,     9,      12,     11,     11, ]],
            [   10, [   9,      12,     11,     10,     12, ]],
            [   11, [   12,     11,     10,     9,      9,  ]],
            [   12, [   11,     10,     9,      12,     10, ]],
            [   13, [   13,     13,     13,     13,     13, ]],
            [   14, [   14,     15,     14,     15,     14, ]],
            [   15, [   15,     14,     15,     14,     15, ]],
        ])],
    ]);

    const _UNIT_IMAGE_CFGS = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
            ]),
        ],
    ]);

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    function _destructTileCategoryCfg(data: ITileCategoryCfg[]): { [category: number]: ITileCategoryCfg } {
        const dst: { [category: number]: ITileCategoryCfg } = {};
        for (const d of data) {
            dst[d.category!] = d;
        }
        return dst;
    }
    function _destructUnitCategoryCfg(data: UnitCategoryCfg[]): { [category: number]: UnitCategoryCfg } {
        const dst: { [category: number]: UnitCategoryCfg } = {};
        for (const d of data) {
            dst[d.category!] = d;
        }
        return dst;
    }
    function _destructTileTemplateCfg(data: TileTemplateCfg[]): { [tileType: number]: TileTemplateCfg } {
        const dst: { [category: number]: TileTemplateCfg } = {};
        for (const d of data) {
            dst[d.type!] = d;
        }
        return dst;
    }
    function _destructUnitTemplateCfg(data: UnitTemplateCfg[]): { [unitType: number]: UnitTemplateCfg } {
        const dst: { [category: number]: UnitTemplateCfg } = {};
        for (const d of data) {
            dst[d.type!] = d;
        }
        return dst;
    }
    function _destructDamageChartCfg(data: DamageChartCfg[]): { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } {
        const dst: { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } = {};
        for (const d of data) {
            const attackerType  = d.attackerType!;
            const armorType     = d.armorType!;
            dst[attackerType]                           = dst[attackerType] || {};
            dst[attackerType][armorType]                = dst[attackerType][armorType] || {};
            dst[attackerType][armorType][d.weaponType!] = d;
        }
        return dst;
    }
    function _destructMoveCostCfg(data: MoveCostCfg[]): { [tileType: number]: { [moveType: number]: MoveCostCfg } } {
        const dst: { [tileType: number]: { [moveType: number]: MoveCostCfg } } = {};
        for (const d of data) {
            const tileType              = d.tileType!;
            dst[tileType]               = dst[tileType] || {};
            dst[tileType][d.moveType!]  = d;
        }
        return dst;
    }
    function _destructUnitPromotionCfg(data: UnitPromotionCfg[]): { [promotion: number]: UnitPromotionCfg } {
        const dst: { [promotion: number]: UnitPromotionCfg } = {};
        for (const d of data) {
            dst[d.promotion!] = d;
        }
        return dst;
    }
    function _destructVisionBonusCfg(data: VisionBonusCfg[]): { [unitType: number]: { [tileType: number]: VisionBonusCfg } } {
        const dst: { [unitType: number]: { [tileType: number]: VisionBonusCfg } } = {};
        for (const d of data) {
            const unitType              = d.unitType!;
            dst[unitType]               = dst[unitType] || {};
            dst[unitType][d.tileType!]  = d;
        }
        return dst;
    }
    function _destructBuildableTileCfg(
        data: BuildableTileCfg[]
    ): { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } {
        const dst: { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } = {};
        for (const d of data) {
            const unitType                                  = d.unitType!;
            const srcBaseType                               = d.srcBaseType!;
            dst[unitType]                                   = dst[unitType] || {};
            dst[unitType][srcBaseType]                      = dst[unitType][srcBaseType] || {};
            dst[unitType][srcBaseType][d.srcObjectType!]    = d;
        }
        return dst;
    }
    function _destructPlayerRankCfg(data: IPlayerRankCfg[]): { [minScore: number]: IPlayerRankCfg } {
        const dst: { [minScore: number]: IPlayerRankCfg } = {};
        for (const d of data) {
            dst[d.minScore!] = d;
        }
        return dst;
    }
    function _destructCoBasicCfg(data: CoBasicCfg[]): { [coId: number]: CoBasicCfg } {
        const dst: { [coId: number]: CoBasicCfg } = {};
        for (const d of data) {
            dst[d.coId] = d;
        }
        return dst;
    }
    function _destructCoSkillCfg(data: CoSkillCfg[]): { [skillId: number]: CoSkillCfg } {
        const dst: { [skillId: number]: CoSkillCfg } = {};
        for (const d of data) {
            dst[d.skillId] = d;
        }
        return dst;
    }
    function _getMaxUnitPromotion(cfg: { [promotion: number]: UnitPromotionCfg }): number {
        let maxPromotion = 0;
        for (const p in cfg) {
            maxPromotion = Math.max(cfg[p].promotion, maxPromotion);
        }
        return maxPromotion
    }
    function _getSecondaryWeaponFlags(chartCfgs: { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } }): { [unitType: number]: boolean } {
        const flags: { [unitType: number]: boolean } = {};
        for (const attackerType in chartCfgs) {
            flags[attackerType] = false;

            const cfgs = chartCfgs[attackerType];
            for (const armorType in cfgs) {
                const cfg = cfgs[armorType][WeaponType.Secondary];
                if ((cfg) && (cfg.damage != null)) {
                    flags[attackerType] = true;
                    break;
                }
            }
        }

        return flags;
    }

    const _CACHED_CONFIGS       = new Map<string, ExtendedFullConfig>();
    const _INVALID_CONFIGS      = new Set<string>();
    const _AVAILABLE_CO_LIST    = new Map<string, CoBasicCfg[]>();
    const _CO_TIERS             = new Map<string, number[]>();
    const _CO_ID_LIST_IN_TIER   = new Map<string, Map<number, number[]>>();
    const _CUSTOM_CO_ID_LIST    = new Map<string, number[]>();
    let _latestFormalVersion    : string;

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export const SILO_RADIUS                = 2;
    export const SILO_DAMAGE                = 30;

    export function init(): void {
    }

    export function getLatestFormalVersion(): string {
        return _latestFormalVersion;
    }
    export function setLatestFormalVersion(version: string): void {
        _latestFormalVersion = version;
    }
    export async function checkIsVersionValid(version: string): Promise<boolean> {
        return (await loadConfig(version)) != null;
    }

    export async function loadConfig(version: string): Promise<ExtendedFullConfig | undefined> {
        const cachedConfig = getCachedConfig(version);
        if (cachedConfig) {
            return cachedConfig;
        }

        if (_INVALID_CONFIGS.has(version)) {
            return undefined;
        }

        let configBin: any;
        let rawConfig: Types.FullConfig;
        try {
            configBin = await RES.getResByUrl(
                `resource/config/FullConfig${version}.bin`,
                undefined,
                undefined,
                RES.ResourceItem.TYPE_BIN
            );
            rawConfig = configBin ? Utility.ProtoManager.decodeAsFullConfig(configBin) as Types.FullConfig : undefined;
        } catch (e) {
        }

        if (rawConfig == null) {
            _INVALID_CONFIGS.add(version);
            return undefined;
        }

        const unitPromotionCfg  = _destructUnitPromotionCfg(rawConfig.UnitPromotion);
        const damageChartCfg    = _destructDamageChartCfg(rawConfig.DamageChart);
        const fullCfg           : ExtendedFullConfig = {
            TileCategory        : _destructTileCategoryCfg(rawConfig.TileCategory),
            UnitCategory        : _destructUnitCategoryCfg(rawConfig.UnitCategory),
            TileTemplate        : _destructTileTemplateCfg(rawConfig.TileTemplate),
            UnitTemplate        : _destructUnitTemplateCfg(rawConfig.UnitTemplate),
            MoveCost            : _destructMoveCostCfg(rawConfig.MoveCost),
            VisionBonus         : _destructVisionBonusCfg(rawConfig.VisionBonus),
            BuildableTile       : _destructBuildableTileCfg(rawConfig.BuildableTile),
            PlayerRank          : _destructPlayerRankCfg(rawConfig.PlayerRank),
            CoBasic             : _destructCoBasicCfg(rawConfig.CoBasic),
            CoSkill             : _destructCoSkillCfg(rawConfig.CoSkill),
            DamageChart         : damageChartCfg,
            UnitPromotion       : unitPromotionCfg,
            maxUnitPromotion    : _getMaxUnitPromotion(unitPromotionCfg),
            secondaryWeaponFlag : _getSecondaryWeaponFlags(damageChartCfg),
        };
        setCachedConfig(version, fullCfg);
        Notify.dispatch(Notify.Type.ConfigLoaded);

        return fullCfg;
    }
    export function getCachedConfig(version: string): ExtendedFullConfig | undefined {
        return _CACHED_CONFIGS.get(version);
    }
    function setCachedConfig(version: string, config: ExtendedFullConfig) {
        _CACHED_CONFIGS.set(version, config);
    }

    export function getGridSize(): GridSize {
        return _GRID_SIZE;
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        return _TILE_TYPE_MAPPING.get(baseType)!.get(objectType)!;
    }

    export function getTileTemplateCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
        return _CACHED_CONFIGS.get(version)!.TileTemplate[getTileType(baseType, objectType)];
    }
    export function getTileTemplateCfgByType(version: string, tileType: TileType): TileTemplateCfg {
        return _CACHED_CONFIGS.get(version)!.TileTemplate[tileType];
    }

    export function getTileTypesByCategory(version: string, category: TileCategory): TileType[] | undefined | null {
        return _CACHED_CONFIGS.get(version)!.TileCategory[category].tileTypes;
    }

    export function checkIsValidPlayerIndexForTile(playerIndex: number, baseType: TileBaseType, objectType: TileObjectType): boolean {
        const neutralPlayerIndex = COMMON_CONSTANTS.WarNeutralPlayerIndex;
        if ((playerIndex < neutralPlayerIndex) || (playerIndex > COMMON_CONSTANTS.WarMaxPlayerIndex)) {
            return false;
        }

        if (objectType === TileObjectType.Airport) {
            return true;
        } else if (objectType === TileObjectType.Bridge) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.City) {
            return true;
        } else if (objectType === TileObjectType.CommandTower) {
            return true;
        } else if (objectType === TileObjectType.Empty) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.EmptySilo) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Factory) {
            return true;
        } else if (objectType === TileObjectType.Fire) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.GreenPlasma) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Headquarters) {
            return playerIndex !== neutralPlayerIndex;
        } else if (objectType === TileObjectType.Meteor) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Mist) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Mountain) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Plasma) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Radar) {
            return true;
        } else if (objectType === TileObjectType.Reef) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Road) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Rough) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Ruins) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Seaport) {
            return true;
        } else if (objectType === TileObjectType.Silo) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.TempAirport) {
            return true;
        } else if (objectType === TileObjectType.TempSeaport) {
            return true;
        } else if (objectType === TileObjectType.Wasteland) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Wood) {
            return playerIndex === neutralPlayerIndex;
        } else {
            return false;
        }
    }

    export function getUnitTemplateCfg(version: string, unitType: UnitType): UnitTemplateCfg {
        return _CACHED_CONFIGS.get(version)!.UnitTemplate[unitType];
    }

    export function getUnitTypesByCategory(version: string, category: UnitCategory): UnitType[] | undefined | null {
        return _CACHED_CONFIGS.get(version)!.UnitCategory[category].unitTypes;
    }

    export function checkIsUnitTypeInCategory(version: string, unitType: UnitType, category: UnitCategory): boolean {
        const types = getUnitTypesByCategory(version, category);
        return (types != null) && (types.indexOf(unitType) >= 0);
    }

    export function checkIsTileTypeInCategory(version: string, tileType: TileType, category: TileCategory): boolean {
        const types = getTileTypesByCategory(version, category);
        return (types != null) && (types.indexOf(tileType) >= 0);
    }

    export function getUnitMaxPromotion(version: string): number {
        return _CACHED_CONFIGS.get(version)!.maxUnitPromotion!;
    }

    export function checkHasSecondaryWeapon(version: string, unitType: UnitType): boolean {
        return _CACHED_CONFIGS.get(version)!.secondaryWeaponFlag![unitType];
    }

    export function getUnitPromotionAttackBonus(version: string, promotion: number): number {
        return _CACHED_CONFIGS.get(version)!.UnitPromotion![promotion].attackBonus!;
    }

    export function getUnitPromotionDefenseBonus(version: string, promotion: number): number {
        return _CACHED_CONFIGS.get(version)!.UnitPromotion![promotion].defenseBonus!;
    }

    export function getDamageChartCfgs(version: string, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        return _CACHED_CONFIGS.get(version)!.DamageChart[attackerType];
    }

    export function getBuildableTileCfgs(version: string, unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | undefined {
        return _CACHED_CONFIGS.get(version)!.BuildableTile[unitType];
    }

    export function getVisionBonusCfg(version: string, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
        return _CACHED_CONFIGS.get(version)!.VisionBonus[unitType];
    }

    export function getMoveCostCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
        return _CACHED_CONFIGS.get(version)!.MoveCost[getTileType(baseType, objectType)];
    }
    export function getMoveCostCfgByTileType(version: string, tileType: TileType): { [moveType: number]: MoveCostCfg } {
        return _CACHED_CONFIGS.get(version)!.MoveCost[tileType];
    }

    export function getTileObjectTypeByTileType(type: TileType): TileObjectType {
        return _TILE_TYPE_TO_TILE_OBJECT_TYPE.get(type)!;
    }

    export function getTileBaseImageSource(
        params: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            baseType    : TileBaseType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string {
        const { version, skinId, baseType, isDark, shapeId, tickCount } = params;
        if (baseType === TileBaseType.Empty) {
            return undefined;
        }

        const cfgForVersion = _TILE_BASE_FRAME_CFGS.get(version);
        const cfgForFrame   = cfgForVersion ? cfgForVersion.get(baseType) : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(baseType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileBase_${textForVersion}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }
    }
    export function getTileObjectImageSource(
        params: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            objectType  : TileObjectType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string {
        const { version, skinId, objectType, isDark, shapeId, tickCount } = params;
        if (objectType === TileObjectType.Empty) {
            return undefined;
        }

        const cfgForVersion = _TILE_OBJECT_FRAME_CFGS.get(version);
        const cfgForFrame   = cfgForVersion ? cfgForVersion.get(objectType) : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(objectType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileObject_${textForVersion}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }
    }

    export function getUnitAndTileDefaultSkinId(playerIndex: number): number {
        return playerIndex;
    }

    export function getUnitImageSource(
        { version, skinId, unitType, isDark, isMoving, tickCount }: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            unitType    : UnitType;
            isDark      : boolean;
            isMoving    : boolean;
            tickCount   : number;
        },
    ): string | undefined {
        const cfgForVersion = _UNIT_IMAGE_CFGS.get(version);
        const cfgForUnit    = cfgForVersion ? cfgForVersion.get(unitType) : undefined;
        const cfgForFrame   = cfgForUnit
            ? (isMoving ? cfgForUnit.moving : cfgForUnit.idle)
            : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForMoving     = isMoving ? `act01` : `act00`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(unitType)}`;
            const textForFrame      = `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`;
            return `unit_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
        }
    }

    export function getRankName(version: string, rankScore: number): string {
        const cfg = getPlayerRankCfg(version, rankScore);
        return cfg ? Lang.getStringInCurrentLanguage(cfg.nameList) : undefined;
    }
    export function getPlayerRankCfg(version: string, rankScore: number): IPlayerRankCfg {
        const cfgs  = _CACHED_CONFIGS.get(version)!.PlayerRank;
        let maxRank = -1;
        let maxCfg  : IPlayerRankCfg;

        for (const i in cfgs) {
            const currCfg   = cfgs[i];
            const currRank  = currCfg.rank;
            if ((rankScore >= currCfg.minScore) && (currRank > maxRank)) {
                maxRank = currRank;
                maxCfg  = currCfg;
            }
        }
        return maxCfg;
    }

    export function getCoBasicCfg(version: string, coId: number): CoBasicCfg | null {
        return _CACHED_CONFIGS.get(version)!.CoBasic[coId];
    }

    export function getCoNameAndTierText(version: string, coId: number | null): string {
        const coConfig = coId == null ? null : getCoBasicCfg(version, coId);
        return coConfig
            // ? `(${coConfig.name}(T${coConfig.tier}))`
            ? `${coConfig.name}`
            : undefined;
    }

    export function getCoSkillCfg(version: string, skillId: number): CoSkillCfg | null {
        return _CACHED_CONFIGS.get(version)!.CoSkill[skillId];
    }

    export function getAvailableCoArray(version: string): CoBasicCfg[] {
        if (!_AVAILABLE_CO_LIST.has(version)) {
            const list: CoBasicCfg[] = [];
            const cfgs = _CACHED_CONFIGS.get(version)!.CoBasic;
            for (const k in cfgs || {}) {
                const cfg = cfgs[k];
                if (cfg.isEnabled) {
                    list.push(cfg);
                }
            }

            list.sort((c1, c2) => {
                if (c1.name !== c2.name) {
                    return c1.name < c2.name ? -1 : 1;
                } else {
                    return c1.tier - c2.tier;
                }
            });
            _AVAILABLE_CO_LIST.set(version, list);
        }
        return _AVAILABLE_CO_LIST.get(version);
    }

    export function getCoTiers(version: string): number[] {
        if (!_CO_TIERS.has(version)) {
            const tiers = new Set<number>();
            for (const cfg of getAvailableCoArray(version)) {
                tiers.add(cfg.tier);
            }
            _CO_TIERS.set(version, Array.from(tiers).sort((v1, v2) => v1 - v2));
        }
        return _CO_TIERS.get(version);
    }

    export function getAvailableCoIdListInTier(version: string, tier: number): number[] {
        if (!_CO_ID_LIST_IN_TIER.has(version)) {
            _CO_ID_LIST_IN_TIER.set(version, new Map<number, number[]>());
        }

        const cfgs = _CO_ID_LIST_IN_TIER.get(version);
        if (!cfgs.get(tier)) {
            const idList: number[] = [];
            for (const cfg of getAvailableCoArray(version)) {
                if (cfg.tier === tier) {
                    idList.push(cfg.coId);
                }
            }
            cfgs.set(tier, idList);
        }
        return cfgs.get(tier);
    }

    export function getAvailableCustomCoIdList(version: string): number[] {
        if (!_CUSTOM_CO_ID_LIST.has(version)) {
            const idList: number[] = [];
            for (const cfg of getAvailableCoArray(version)) {
                if (cfg.designer !== "Intelligent Systems") {
                    idList.push(cfg.coId);
                }
            }
            _CUSTOM_CO_ID_LIST.set(version, idList);
        }
        return _CUSTOM_CO_ID_LIST.get(version);
    }

    export function checkIsUnitDivingByDefault(version: string, unitType: UnitType): boolean | undefined {
        const templateCfg = getUnitTemplateCfg(version, unitType);
        if (templateCfg == null) {
            Logger.error(`ConfigManager.checkIsUnitDivingByDefault() empty templateCfg.`);
            return undefined;
        }
        return checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg);
    }
    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
    }

    export function getTileObjectShapeCfgs(): Map<TileObjectType, TileObjectShapeCfg> {
        return _TILE_OBJECT_SHAPE_CFGS;
    }
    export function getTileBaseShapeCfgs(): Map<TileBaseType, TileBaseShapeCfg> {
        return _TILE_BASE_SHAPE_CFGS;
    }
    export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: number): boolean {
        if (tileObjectType === TileObjectType.Empty) {
            return !shapeId;
        } else {
            const cfg = getTileObjectShapeCfgs().get(tileObjectType);
            return (!!cfg)
                && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
        }
    }
    export function checkIsValidTileBaseShapeId(tileBaseType: TileBaseType, shapeId: number): boolean {
        const cfg = getTileBaseShapeCfgs().get(tileBaseType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }

    export function getSymmetricalTileBaseShapeId(baseType: TileBaseType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
        const cfg           = _TILE_BASE_SYMMETRY.get(baseType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function getSymmetricalTileObjectShapeId(objectType: TileObjectType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
        const cfg           = _TILE_OBJECT_SYMMETRY.get(objectType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function checkIsTileBaseSymmetrical(params: {
        baseType    : TileBaseType;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileBaseShapeId(params.baseType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
    export function checkIsTileObjectSymmetrical(params: {
        objectType  : TileObjectType;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileObjectShapeId(params.objectType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
}
