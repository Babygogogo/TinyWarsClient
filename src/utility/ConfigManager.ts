
namespace TinyWars.Utility.ConfigManager {
    import NetManager       = Network.Manager;
    import ActionCode       = Network.Codes;
    import GridSize         = Types.Size;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import UnitCategory     = Types.UnitCategory;
    import TileCategory     = Types.TileCategory;
    import WeaponType       = Types.WeaponType;
    import TileCategoryCfg  = Types.TileCategoryCfg;
    import UnitCategoryCfg  = Types.UnitCategoryCfg;
    import TileTemplateCfg  = Types.TileTemplateCfg;
    import UnitTemplateCfg  = Types.UnitTemplateCfg;
    import DamageChartCfg   = Types.DamageChartCfg;
    import MoveCostCfg      = Types.MoveCostCfg;
    import UnitPromotionCfg = Types.UnitPromotionCfg;
    import VisionBonusCfg   = Types.VisionBonusCfg;
    import BuildableTileCfg = Types.BuildableTileCfg;
    import PlayerRankCfg    = Types.PlayerRankCfg;
    import CoBasicCfg       = Types.CoBasicCfg;
    import CoSkillCfg       = Types.CoSkillCfg;

    ////////////////////////////////////////////////////////////////////////////////
    // Internal types.
    ////////////////////////////////////////////////////////////////////////////////
    type TileObjectTypeAndPlayerIndex = {
        tileObjectType: TileObjectType;
        playerIndex   : number;
    }

    type UnitTypeAndPlayerIndex = {
        unitType   : UnitType;
        playerIndex: number;
    }

    type ExtendedFullConfig = {
        TileCategory            : { [category: number]: TileCategoryCfg };
        UnitCategory            : { [category: number]: UnitCategoryCfg };
        TileTemplate            : { [tileType: number]: TileTemplateCfg };
        UnitTemplate            : { [unitType: number]: UnitTemplateCfg };
        DamageChart             : { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } };
        MoveCost                : { [tileType: number]: { [moveType: number]: MoveCostCfg } };
        UnitPromotion           : { [promotion: number]: UnitPromotionCfg };
        VisionBonus             : { [unitType: number]: { [tileType: number]: VisionBonusCfg } };
        BuildableTile           : { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } };
        PlayerRank              : { [minScore: number]: PlayerRankCfg };
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
    export const COMMON_CONSTANTS           = {
        MapEditorSlotMaxCount                   : 3,
        ScwSaveSlotMaxCount                     : 10,

        ChatContentMaxLength                    : 200,
        ChatTeamDivider                         : 100,

        UnitHpNormalizer                        : 10,
        UnitMaxHp                               : 100,
        UnitAndTileMinSkinId                    : 1,
        UnitAndTileMaxSkinId                    : 4,
        UnitAndTileNeutralSkinId                : 0,

        WarNeutralPlayerIndex                   : 0,
        WarFirstPlayerIndex                     : 1,
        WarMaxPlayerIndex                       : 4,
        WarFirstTeamIndex                       : 1,

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
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileBaseType, FrameCfg >([
                [ TileBaseType.Beach,   { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileBaseType.Plain,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.River,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.Sea,     { framesCount: 6,   ticksPerFrame: 1                }],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V2,
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
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileObjectType, FrameCfg>([
                [ TileObjectType.Airport,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Bridge,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.City,          { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.CommandTower,  { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.EmptySilo,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Factory,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Fire,          { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.GreenPlasma,   { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Headquarters,  { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Meteor,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mist,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mountain,      { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Plasma,        { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Radar,         { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Reef,          { framesCount: 8,   ticksPerFrame: 1                }],
                [ TileObjectType.Road,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Rough,         { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Ruins,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Seaport,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Silo,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempAirport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempSeaport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wasteland,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wood,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V2,
            new Map<TileObjectType, FrameCfg >([
                [ TileObjectType.Airport,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Bridge,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.City,          { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.CommandTower,  { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.EmptySilo,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Factory,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Fire,          { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.GreenPlasma,   { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Headquarters,  { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Meteor,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mist,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Mountain,      { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Plasma,        { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Radar,         { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Reef,          { framesCount: 8,   ticksPerFrame: 1                }],
                [ TileObjectType.Road,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Rough,         { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileObjectType.Ruins,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Seaport,       { framesCount: 3,   ticksPerFrame: 1                }],
                [ TileObjectType.Silo,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempAirport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.TempSeaport,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wasteland,     { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileObjectType.Wood,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
            ]),
        ],
    ]);
    const _TILE_OBJECT_SHAPE_CFGS = new Map<TileObjectType, TileObjectShapeCfg>([
        [ TileObjectType.Airport,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Bridge,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 11,    }],
        [ TileObjectType.City,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.CommandTower,  { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.EmptySilo,     { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Factory,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Fire,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.GreenPlasma,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 16,    }],
        [ TileObjectType.Headquarters,  { minPlayerIndex: COMMON_CONSTANTS.WarFirstPlayerIndex,     maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Meteor,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Mist,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Mountain,      { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Plasma,        { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 16,    }],
        [ TileObjectType.Radar,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Reef,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Road,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 11,    }],
        [ TileObjectType.Rough,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Ruins,         { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Seaport,       { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Silo,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.TempAirport,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.TempSeaport,   { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarMaxPlayerIndex,     shapesCount: 1,     }],
        [ TileObjectType.Wasteland,     { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
        [ TileObjectType.Wood,          { minPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex,   maxPlayerIndex: COMMON_CONSTANTS.WarNeutralPlayerIndex, shapesCount: 1,     }],
    ]);

    // const _TILE_BASE_NORMAL_IMAGE_SOURCES = new Map<number, string[]>([
    //     ////////// plain * 1 //////////
    //     [  1, ["c01_t01_s01_f01",]],

    //     ////////// river * 16 //////////
    //     [  2, ["c01_t02_s01_f01",]],
    //     [  3, ["c01_t02_s02_f01",]],
    //     [  4, ["c01_t02_s03_f01",]],
    //     [  5, ["c01_t02_s04_f01",]],
    //     [  6, ["c01_t02_s05_f01",]],
    //     [  7, ["c01_t02_s06_f01",]],
    //     [  8, ["c01_t02_s07_f01",]],
    //     [  9, ["c01_t02_s08_f01",]],
    //     [ 10, ["c01_t02_s09_f01",]],
    //     [ 11, ["c01_t02_s10_f01",]],
    //     [ 12, ["c01_t02_s11_f01",]],
    //     [ 13, ["c01_t02_s12_f01",]],
    //     [ 14, ["c01_t02_s13_f01",]],
    //     [ 15, ["c01_t02_s14_f01",]],
    //     [ 16, ["c01_t02_s15_f01",]],
    //     [ 17, ["c01_t02_s16_f01",]],

    //     // ////////// sea * 47 //////////
    //     [ 18, ["c01_t03_s01_f01", "c01_t03_s01_f02", "c01_t03_s01_f03", "c01_t03_s01_f04", "c01_t03_s01_f03", "c01_t03_s01_f02",]],
    //     [ 19, ["c01_t03_s02_f01", "c01_t03_s02_f02", "c01_t03_s02_f03", "c01_t03_s02_f04", "c01_t03_s02_f03", "c01_t03_s02_f02",]],
    //     [ 20, ["c01_t03_s03_f01", "c01_t03_s03_f02", "c01_t03_s03_f03", "c01_t03_s03_f04", "c01_t03_s03_f03", "c01_t03_s03_f02",]],
    //     [ 21, ["c01_t03_s04_f01", "c01_t03_s04_f02", "c01_t03_s04_f03", "c01_t03_s04_f04", "c01_t03_s04_f03", "c01_t03_s04_f02",]],
    //     [ 22, ["c01_t03_s05_f01", "c01_t03_s05_f02", "c01_t03_s05_f03", "c01_t03_s05_f04", "c01_t03_s05_f03", "c01_t03_s05_f02",]],
    //     [ 23, ["c01_t03_s06_f01", "c01_t03_s06_f02", "c01_t03_s06_f03", "c01_t03_s06_f04", "c01_t03_s06_f03", "c01_t03_s06_f02",]],
    //     [ 24, ["c01_t03_s07_f01", "c01_t03_s07_f02", "c01_t03_s07_f03", "c01_t03_s07_f04", "c01_t03_s07_f03", "c01_t03_s07_f02",]],
    //     [ 25, ["c01_t03_s08_f01", "c01_t03_s08_f02", "c01_t03_s08_f03", "c01_t03_s08_f04", "c01_t03_s08_f03", "c01_t03_s08_f02",]],
    //     [ 26, ["c01_t03_s09_f01", "c01_t03_s09_f02", "c01_t03_s09_f03", "c01_t03_s09_f04", "c01_t03_s09_f03", "c01_t03_s09_f02",]],
    //     [ 27, ["c01_t03_s10_f01", "c01_t03_s10_f02", "c01_t03_s10_f03", "c01_t03_s10_f04", "c01_t03_s10_f03", "c01_t03_s10_f02",]],
    //     [ 28, ["c01_t03_s11_f01", "c01_t03_s11_f02", "c01_t03_s11_f03", "c01_t03_s11_f04", "c01_t03_s11_f03", "c01_t03_s11_f02",]],
    //     [ 29, ["c01_t03_s12_f01", "c01_t03_s12_f02", "c01_t03_s12_f03", "c01_t03_s12_f04", "c01_t03_s12_f03", "c01_t03_s12_f02",]],
    //     [ 30, ["c01_t03_s13_f01", "c01_t03_s13_f02", "c01_t03_s13_f03", "c01_t03_s13_f04", "c01_t03_s13_f03", "c01_t03_s13_f02",]],
    //     [ 31, ["c01_t03_s14_f01", "c01_t03_s14_f02", "c01_t03_s14_f03", "c01_t03_s14_f04", "c01_t03_s14_f03", "c01_t03_s14_f02",]],
    //     [ 32, ["c01_t03_s15_f01", "c01_t03_s15_f02", "c01_t03_s15_f03", "c01_t03_s15_f04", "c01_t03_s15_f03", "c01_t03_s15_f02",]],
    //     [ 33, ["c01_t03_s16_f01", "c01_t03_s16_f02", "c01_t03_s16_f03", "c01_t03_s16_f04", "c01_t03_s16_f03", "c01_t03_s16_f02",]],
    //     [ 34, ["c01_t03_s17_f01", "c01_t03_s17_f02", "c01_t03_s17_f03", "c01_t03_s17_f04", "c01_t03_s17_f03", "c01_t03_s17_f02",]],
    //     [ 35, ["c01_t03_s18_f01", "c01_t03_s18_f02", "c01_t03_s18_f03", "c01_t03_s18_f04", "c01_t03_s18_f03", "c01_t03_s18_f02",]],
    //     [ 36, ["c01_t03_s19_f01", "c01_t03_s19_f02", "c01_t03_s19_f03", "c01_t03_s19_f04", "c01_t03_s19_f03", "c01_t03_s19_f02",]],
    //     [ 37, ["c01_t03_s20_f01", "c01_t03_s20_f02", "c01_t03_s20_f03", "c01_t03_s20_f04", "c01_t03_s20_f03", "c01_t03_s20_f02",]],
    //     [ 38, ["c01_t03_s21_f01", "c01_t03_s21_f02", "c01_t03_s21_f03", "c01_t03_s21_f04", "c01_t03_s21_f03", "c01_t03_s21_f02",]],
    //     [ 39, ["c01_t03_s22_f01", "c01_t03_s22_f02", "c01_t03_s22_f03", "c01_t03_s22_f04", "c01_t03_s22_f03", "c01_t03_s22_f02",]],
    //     [ 40, ["c01_t03_s23_f01", "c01_t03_s23_f02", "c01_t03_s23_f03", "c01_t03_s23_f04", "c01_t03_s23_f03", "c01_t03_s23_f02",]],
    //     [ 41, ["c01_t03_s24_f01", "c01_t03_s24_f02", "c01_t03_s24_f03", "c01_t03_s24_f04", "c01_t03_s24_f03", "c01_t03_s24_f02",]],
    //     [ 42, ["c01_t03_s25_f01", "c01_t03_s25_f02", "c01_t03_s25_f03", "c01_t03_s25_f04", "c01_t03_s25_f03", "c01_t03_s25_f02",]],
    //     [ 43, ["c01_t03_s26_f01", "c01_t03_s26_f02", "c01_t03_s26_f03", "c01_t03_s26_f04", "c01_t03_s26_f03", "c01_t03_s26_f02",]],
    //     [ 44, ["c01_t03_s27_f01", "c01_t03_s27_f02", "c01_t03_s27_f03", "c01_t03_s27_f04", "c01_t03_s27_f03", "c01_t03_s27_f02",]],
    //     [ 45, ["c01_t03_s28_f01", "c01_t03_s28_f02", "c01_t03_s28_f03", "c01_t03_s28_f04", "c01_t03_s28_f03", "c01_t03_s28_f02",]],
    //     [ 46, ["c01_t03_s29_f01", "c01_t03_s29_f02", "c01_t03_s29_f03", "c01_t03_s29_f04", "c01_t03_s29_f03", "c01_t03_s29_f02",]],
    //     [ 47, ["c01_t03_s30_f01", "c01_t03_s30_f02", "c01_t03_s30_f03", "c01_t03_s30_f04", "c01_t03_s30_f03", "c01_t03_s30_f02",]],
    //     [ 48, ["c01_t03_s31_f01", "c01_t03_s31_f02", "c01_t03_s31_f03", "c01_t03_s31_f04", "c01_t03_s31_f03", "c01_t03_s31_f02",]],
    //     [ 49, ["c01_t03_s32_f01", "c01_t03_s32_f02", "c01_t03_s32_f03", "c01_t03_s32_f04", "c01_t03_s32_f03", "c01_t03_s32_f02",]],
    //     [ 50, ["c01_t03_s33_f01", "c01_t03_s33_f02", "c01_t03_s33_f03", "c01_t03_s33_f04", "c01_t03_s33_f03", "c01_t03_s33_f02",]],
    //     [ 51, ["c01_t03_s34_f01", "c01_t03_s34_f02", "c01_t03_s34_f03", "c01_t03_s34_f04", "c01_t03_s34_f03", "c01_t03_s34_f02",]],
    //     [ 52, ["c01_t03_s35_f01", "c01_t03_s35_f02", "c01_t03_s35_f03", "c01_t03_s35_f04", "c01_t03_s35_f03", "c01_t03_s35_f02",]],
    //     [ 53, ["c01_t03_s36_f01", "c01_t03_s36_f02", "c01_t03_s36_f03", "c01_t03_s36_f04", "c01_t03_s36_f03", "c01_t03_s36_f02",]],
    //     [ 54, ["c01_t03_s37_f01", "c01_t03_s37_f02", "c01_t03_s37_f03", "c01_t03_s37_f04", "c01_t03_s37_f03", "c01_t03_s37_f02",]],
    //     [ 55, ["c01_t03_s38_f01", "c01_t03_s38_f02", "c01_t03_s38_f03", "c01_t03_s38_f04", "c01_t03_s38_f03", "c01_t03_s38_f02",]],
    //     [ 56, ["c01_t03_s39_f01", "c01_t03_s39_f02", "c01_t03_s39_f03", "c01_t03_s39_f04", "c01_t03_s39_f03", "c01_t03_s39_f02",]],
    //     [ 57, ["c01_t03_s40_f01", "c01_t03_s40_f02", "c01_t03_s40_f03", "c01_t03_s40_f04", "c01_t03_s40_f03", "c01_t03_s40_f02",]],
    //     [ 58, ["c01_t03_s41_f01", "c01_t03_s41_f02", "c01_t03_s41_f03", "c01_t03_s41_f04", "c01_t03_s41_f03", "c01_t03_s41_f02",]],
    //     [ 59, ["c01_t03_s42_f01", "c01_t03_s42_f02", "c01_t03_s42_f03", "c01_t03_s42_f04", "c01_t03_s42_f03", "c01_t03_s42_f02",]],
    //     [ 60, ["c01_t03_s43_f01", "c01_t03_s43_f02", "c01_t03_s43_f03", "c01_t03_s43_f04", "c01_t03_s43_f03", "c01_t03_s43_f02",]],
    //     [ 61, ["c01_t03_s44_f01", "c01_t03_s44_f02", "c01_t03_s44_f03", "c01_t03_s44_f04", "c01_t03_s44_f03", "c01_t03_s44_f02",]],
    //     [ 62, ["c01_t03_s45_f01", "c01_t03_s45_f02", "c01_t03_s45_f03", "c01_t03_s45_f04", "c01_t03_s45_f03", "c01_t03_s45_f02",]],
    //     [ 63, ["c01_t03_s46_f01", "c01_t03_s46_f02", "c01_t03_s46_f03", "c01_t03_s46_f04", "c01_t03_s46_f03", "c01_t03_s46_f02",]],
    //     [ 64, ["c01_t03_s47_f01", "c01_t03_s47_f02", "c01_t03_s47_f03", "c01_t03_s47_f04", "c01_t03_s47_f03", "c01_t03_s47_f02",]],

    //     // ////////// beach * 36 //////////
    //     [ 65, ["c01_t04_s01_f01", "c01_t04_s01_f02", "c01_t04_s01_f03", "c01_t04_s01_f04", "c01_t04_s01_f03", "c01_t04_s01_f02",]],
    //     [ 66, ["c01_t04_s02_f01", "c01_t04_s02_f02", "c01_t04_s02_f03", "c01_t04_s02_f04", "c01_t04_s02_f03", "c01_t04_s02_f02",]],
    //     [ 67, ["c01_t04_s03_f01", "c01_t04_s03_f02", "c01_t04_s03_f03", "c01_t04_s03_f04", "c01_t04_s03_f03", "c01_t04_s03_f02",]],
    //     [ 68, ["c01_t04_s04_f01", "c01_t04_s04_f02", "c01_t04_s04_f03", "c01_t04_s04_f04", "c01_t04_s04_f03", "c01_t04_s04_f02",]],
    //     [ 69, ["c01_t04_s05_f01", "c01_t04_s05_f02", "c01_t04_s05_f03", "c01_t04_s05_f04", "c01_t04_s05_f03", "c01_t04_s05_f02",]],
    //     [ 70, ["c01_t04_s06_f01", "c01_t04_s06_f02", "c01_t04_s06_f03", "c01_t04_s06_f04", "c01_t04_s06_f03", "c01_t04_s06_f02",]],
    //     [ 71, ["c01_t04_s07_f01", "c01_t04_s07_f02", "c01_t04_s07_f03", "c01_t04_s07_f04", "c01_t04_s07_f03", "c01_t04_s07_f02",]],
    //     [ 72, ["c01_t04_s08_f01", "c01_t04_s08_f02", "c01_t04_s08_f03", "c01_t04_s08_f04", "c01_t04_s08_f03", "c01_t04_s08_f02",]],
    //     [ 73, ["c01_t04_s09_f01", "c01_t04_s09_f02", "c01_t04_s09_f03", "c01_t04_s09_f04", "c01_t04_s09_f03", "c01_t04_s09_f02",]],
    //     [ 74, ["c01_t04_s10_f01", "c01_t04_s10_f02", "c01_t04_s10_f03", "c01_t04_s10_f04", "c01_t04_s10_f03", "c01_t04_s10_f02",]],
    //     [ 75, ["c01_t04_s11_f01", "c01_t04_s11_f02", "c01_t04_s11_f03", "c01_t04_s11_f04", "c01_t04_s11_f03", "c01_t04_s11_f02",]],
    //     [ 76, ["c01_t04_s12_f01", "c01_t04_s12_f02", "c01_t04_s12_f03", "c01_t04_s12_f04", "c01_t04_s12_f03", "c01_t04_s12_f02",]],
    //     [ 77, ["c01_t04_s13_f01", "c01_t04_s13_f02", "c01_t04_s13_f03", "c01_t04_s13_f04", "c01_t04_s13_f03", "c01_t04_s13_f02",]],
    //     [ 78, ["c01_t04_s14_f01", "c01_t04_s14_f02", "c01_t04_s14_f03", "c01_t04_s14_f04", "c01_t04_s14_f03", "c01_t04_s14_f02",]],
    //     [ 79, ["c01_t04_s15_f01", "c01_t04_s15_f02", "c01_t04_s15_f03", "c01_t04_s15_f04", "c01_t04_s15_f03", "c01_t04_s15_f02",]],
    //     [ 80, ["c01_t04_s16_f01", "c01_t04_s16_f02", "c01_t04_s16_f03", "c01_t04_s16_f04", "c01_t04_s16_f03", "c01_t04_s16_f02",]],
    //     [ 81, ["c01_t04_s17_f01", "c01_t04_s17_f02", "c01_t04_s17_f03", "c01_t04_s17_f04", "c01_t04_s17_f03", "c01_t04_s17_f02",]],
    //     [ 82, ["c01_t04_s18_f01", "c01_t04_s18_f02", "c01_t04_s18_f03", "c01_t04_s18_f04", "c01_t04_s18_f03", "c01_t04_s18_f02",]],
    //     [ 83, ["c01_t04_s19_f01", "c01_t04_s19_f02", "c01_t04_s19_f03", "c01_t04_s19_f04", "c01_t04_s19_f03", "c01_t04_s19_f02",]],
    //     [ 84, ["c01_t04_s20_f01", "c01_t04_s20_f02", "c01_t04_s20_f03", "c01_t04_s20_f04", "c01_t04_s20_f03", "c01_t04_s20_f02",]],
    //     [ 85, ["c01_t04_s21_f01", "c01_t04_s21_f02", "c01_t04_s21_f03", "c01_t04_s21_f04", "c01_t04_s21_f03", "c01_t04_s21_f02",]],
    //     [ 86, ["c01_t04_s22_f01", "c01_t04_s22_f02", "c01_t04_s22_f03", "c01_t04_s22_f04", "c01_t04_s22_f03", "c01_t04_s22_f02",]],
    //     [ 87, ["c01_t04_s23_f01", "c01_t04_s23_f02", "c01_t04_s23_f03", "c01_t04_s23_f04", "c01_t04_s23_f03", "c01_t04_s23_f02",]],
    //     [ 88, ["c01_t04_s24_f01", "c01_t04_s24_f02", "c01_t04_s24_f03", "c01_t04_s24_f04", "c01_t04_s24_f03", "c01_t04_s24_f02",]],
    //     [ 89, ["c01_t04_s25_f01", "c01_t04_s25_f02", "c01_t04_s25_f03", "c01_t04_s25_f04", "c01_t04_s25_f03", "c01_t04_s25_f02",]],
    //     [ 90, ["c01_t04_s26_f01", "c01_t04_s26_f02", "c01_t04_s26_f03", "c01_t04_s26_f04", "c01_t04_s26_f03", "c01_t04_s26_f02",]],
    //     [ 91, ["c01_t04_s27_f01", "c01_t04_s27_f02", "c01_t04_s27_f03", "c01_t04_s27_f04", "c01_t04_s27_f03", "c01_t04_s27_f02",]],
    //     [ 92, ["c01_t04_s28_f01", "c01_t04_s28_f02", "c01_t04_s28_f03", "c01_t04_s28_f04", "c01_t04_s28_f03", "c01_t04_s28_f02",]],
    //     [ 93, ["c01_t04_s29_f01", "c01_t04_s29_f02", "c01_t04_s29_f03", "c01_t04_s29_f04", "c01_t04_s29_f03", "c01_t04_s29_f02",]],
    //     [ 94, ["c01_t04_s30_f01", "c01_t04_s30_f02", "c01_t04_s30_f03", "c01_t04_s30_f04", "c01_t04_s30_f03", "c01_t04_s30_f02",]],
    //     [ 95, ["c01_t04_s31_f01", "c01_t04_s31_f02", "c01_t04_s31_f03", "c01_t04_s31_f04", "c01_t04_s31_f03", "c01_t04_s31_f02",]],
    //     [ 96, ["c01_t04_s32_f01", "c01_t04_s32_f02", "c01_t04_s32_f03", "c01_t04_s32_f04", "c01_t04_s32_f03", "c01_t04_s32_f02",]],
    //     [ 97, ["c01_t04_s33_f01", "c01_t04_s33_f02", "c01_t04_s33_f03", "c01_t04_s33_f04", "c01_t04_s33_f03", "c01_t04_s33_f02",]],
    //     [ 98, ["c01_t04_s34_f01", "c01_t04_s34_f02", "c01_t04_s34_f03", "c01_t04_s34_f04", "c01_t04_s34_f03", "c01_t04_s34_f02",]],
    //     [ 99, ["c01_t04_s35_f01", "c01_t04_s35_f02", "c01_t04_s35_f03", "c01_t04_s35_f04", "c01_t04_s35_f03", "c01_t04_s35_f02",]],
    //     [100, ["c01_t04_s36_f01", "c01_t04_s36_f02", "c01_t04_s36_f03", "c01_t04_s36_f04", "c01_t04_s36_f03", "c01_t04_s36_f02",]],
    // ]);

    // const _TILE_BASE_FOG_IMAGE_SOURCES = new Map<number, string[]>();
    // for (const [viewId, rawSources] of _TILE_BASE_NORMAL_IMAGE_SOURCES) {
    //     const sources = rawSources.concat();
    //     for (let i = 0; i < sources.length; ++i) {
    //         sources[i] = sources[i].replace("c01", "c05");
    //     }
    //     _TILE_BASE_FOG_IMAGE_SOURCES.set(viewId, sources);
    // }

    // const _TILE_OBJECT_NORMAL_IMAGE_SOURCES = new Map<number, string[]>([
    //     [  0, []],

    //     ////////// road * 11 //////////
    //     [  1, ["c02_t001_s01_f01",]],
    //     [  2, ["c02_t001_s02_f01",]],
    //     [  3, ["c02_t001_s03_f01",]],
    //     [  4, ["c02_t001_s04_f01",]],
    //     [  5, ["c02_t001_s05_f01",]],
    //     [  6, ["c02_t001_s06_f01",]],
    //     [  7, ["c02_t001_s07_f01",]],
    //     [  8, ["c02_t001_s08_f01",]],
    //     [  9, ["c02_t001_s09_f01",]],
    //     [ 10, ["c02_t001_s10_f01",]],
    //     [ 11, ["c02_t001_s11_f01",]],

    //     ////////// bridge * 11 //////////
    //     [ 12, ["c02_t002_s01_f01",]],
    //     [ 13, ["c02_t002_s02_f01",]],
    //     [ 14, ["c02_t002_s03_f01",]],
    //     [ 15, ["c02_t002_s04_f01",]],
    //     [ 16, ["c02_t002_s05_f01",]],
    //     [ 17, ["c02_t002_s06_f01",]],
    //     [ 18, ["c02_t002_s07_f01",]],
    //     [ 19, ["c02_t002_s08_f01",]],
    //     [ 20, ["c02_t002_s09_f01",]],
    //     [ 21, ["c02_t002_s10_f01",]],
    //     [ 22, ["c02_t002_s11_f01",]],

    //     ////////// wood * 1 //////////
    //     [ 23, ["c02_t003_s01_f01",]],

    //     ////////// mountain * 1 //////////
    //     [ 24, ["c02_t004_s01_f01",]],

    //     ////////// wasteland * 1 //////////
    //     [ 25, ["c02_t005_s01_f01",]],

    //     ////////// ruin * 1 //////////
    //     [ 26, ["c02_t006_s01_f01",]],

    //     ////////// fire * 1 //////////
    //     [ 27, ["c02_t007_s01_f01", "c02_t007_s01_f02", "c02_t007_s01_f03", "c02_t007_s01_f04", "c02_t007_s01_f05",]],

    //     ////////// rough * 1 //////////
    //     [ 28, ["c02_t008_s01_f01", "c02_t008_s01_f02", "c02_t008_s01_f03", "c02_t008_s01_f04", "c02_t008_s01_f03", "c02_t008_s01_f02",]],

    //     ////////// mist * 1 //////////
    //     [ 29, ["c02_t009_s01_f01",]],

    //     ////////// reef * 1 //////////
    //     [ 30, ["c02_t010_s01_f01", "c02_t010_s01_f02", "c02_t010_s01_f03", "c02_t010_s01_f04", "c02_t010_s01_f03", "c02_t010_s01_f02",]],

    //     ////////// plasma * 16 //////////
    //     [ 31, ["c02_t011_s01_f01", "c02_t011_s01_f02", "c02_t011_s01_f03",]],
    //     [ 32, ["c02_t011_s02_f01", "c02_t011_s02_f02", "c02_t011_s02_f03",]],
    //     [ 33, ["c02_t011_s03_f01", "c02_t011_s03_f02", "c02_t011_s03_f03",]],
    //     [ 34, ["c02_t011_s04_f01", "c02_t011_s04_f02", "c02_t011_s04_f03",]],
    //     [ 35, ["c02_t011_s05_f01", "c02_t011_s05_f02", "c02_t011_s05_f03",]],
    //     [ 36, ["c02_t011_s06_f01", "c02_t011_s06_f02", "c02_t011_s06_f03",]],
    //     [ 37, ["c02_t011_s07_f01", "c02_t011_s07_f02", "c02_t011_s07_f03",]],
    //     [ 38, ["c02_t011_s08_f01", "c02_t011_s08_f02", "c02_t011_s08_f03",]],
    //     [ 39, ["c02_t011_s09_f01", "c02_t011_s09_f02", "c02_t011_s09_f03",]],
    //     [ 40, ["c02_t011_s10_f01", "c02_t011_s10_f02", "c02_t011_s10_f03",]],
    //     [ 41, ["c02_t011_s11_f01", "c02_t011_s11_f02", "c02_t011_s11_f03",]],
    //     [ 42, ["c02_t011_s12_f01", "c02_t011_s12_f02", "c02_t011_s12_f03",]],
    //     [ 43, ["c02_t011_s13_f01", "c02_t011_s13_f02", "c02_t011_s13_f03",]],
    //     [ 44, ["c02_t011_s14_f01", "c02_t011_s14_f02", "c02_t011_s14_f03",]],
    //     [ 45, ["c02_t011_s15_f01", "c02_t011_s15_f02", "c02_t011_s15_f03",]],
    //     [ 46, ["c02_t011_s16_f01", "c02_t011_s16_f02", "c02_t011_s16_f03",]],

    //     ////////// meteor * 1 //////////
    //     [ 47, ["c02_t012_s01_f01",]],

    //     ////////// silo * 1 //////////
    //     [ 48, ["c02_t013_s01_f01",]],

    //     ////////// empty silo * 1 //////////
    //     [ 49, ["c02_t014_s01_f01",]],

    //     ////////// headquarters * 4 //////////
    //     [ 50, ["c02_t015_s01_f01", "c02_t015_s01_f02",]],
    //     [ 51, ["c02_t015_s02_f01", "c02_t015_s02_f02",]],
    //     [ 52, ["c02_t015_s03_f01", "c02_t015_s03_f02",]],
    //     [ 53, ["c02_t015_s04_f01", "c02_t015_s04_f02",]],

    //     ////////// city * 5 //////////
    //     [ 54, ["c02_t016_s01_f01", "c02_t016_s01_f02",]],
    //     [ 55, ["c02_t016_s02_f01", "c02_t016_s02_f02",]],
    //     [ 56, ["c02_t016_s03_f01", "c02_t016_s03_f02",]],
    //     [ 57, ["c02_t016_s04_f01", "c02_t016_s04_f02",]],
    //     [ 58, ["c02_t016_s05_f01", "c02_t016_s05_f02",]],

    //     ////////// command tower * 5 //////////
    //     [ 59, ["c02_t017_s01_f01", "c02_t017_s01_f02",]],
    //     [ 60, ["c02_t017_s02_f01", "c02_t017_s02_f02",]],
    //     [ 61, ["c02_t017_s03_f01", "c02_t017_s03_f02",]],
    //     [ 62, ["c02_t017_s04_f01", "c02_t017_s04_f02",]],
    //     [ 63, ["c02_t017_s05_f01", "c02_t017_s05_f02",]],

    //     ////////// radar * 5 //////////
    //     [ 64, ["c02_t018_s01_f01", "c02_t018_s01_f02",]],
    //     [ 65, ["c02_t018_s02_f01", "c02_t018_s02_f02",]],
    //     [ 66, ["c02_t018_s03_f01", "c02_t018_s03_f02",]],
    //     [ 67, ["c02_t018_s04_f01", "c02_t018_s04_f02",]],
    //     [ 68, ["c02_t018_s05_f01", "c02_t018_s05_f02",]],

    //     ////////// factory * 5 //////////
    //     [ 69, ["c02_t019_s01_f01", "c02_t019_s01_f02",]],
    //     [ 70, ["c02_t019_s02_f01", "c02_t019_s02_f02",]],
    //     [ 71, ["c02_t019_s03_f01", "c02_t019_s03_f02",]],
    //     [ 72, ["c02_t019_s04_f01", "c02_t019_s04_f02",]],
    //     [ 73, ["c02_t019_s05_f01", "c02_t019_s05_f02",]],

    //     ////////// airport * 5 //////////
    //     [ 74, ["c02_t020_s01_f01", "c02_t020_s01_f02",]],
    //     [ 75, ["c02_t020_s02_f01", "c02_t020_s02_f02",]],
    //     [ 76, ["c02_t020_s03_f01", "c02_t020_s03_f02",]],
    //     [ 77, ["c02_t020_s04_f01", "c02_t020_s04_f02",]],
    //     [ 78, ["c02_t020_s05_f01", "c02_t020_s05_f02",]],

    //     ////////// seaport * 5 //////////
    //     [ 79, ["c02_t021_s01_f01", "c02_t021_s01_f02",]],
    //     [ 80, ["c02_t021_s02_f01", "c02_t021_s02_f02",]],
    //     [ 81, ["c02_t021_s03_f01", "c02_t021_s03_f02",]],
    //     [ 82, ["c02_t021_s04_f01", "c02_t021_s04_f02",]],
    //     [ 83, ["c02_t021_s05_f01", "c02_t021_s05_f02",]],

    //     ////////// temp airport * 5 //////////
    //     [ 84, ["c02_t022_s01_f01",]],
    //     [ 85, ["c02_t022_s02_f01",]],
    //     [ 86, ["c02_t022_s03_f01",]],
    //     [ 87, ["c02_t022_s04_f01",]],
    //     [ 88, ["c02_t022_s05_f01",]],

    //     ////////// temp seaport * 5 //////////
    //     [ 89, ["c02_t023_s01_f01",]],
    //     [ 90, ["c02_t023_s02_f01",]],
    //     [ 91, ["c02_t023_s03_f01",]],
    //     [ 92, ["c02_t023_s04_f01",]],
    //     [ 93, ["c02_t023_s05_f01",]],

    //     ////////// green plasma * 16 //////////
    //     [ 94, ["c02_t024_s01_f01", "c02_t024_s01_f02", "c02_t024_s01_f03",]],
    //     [ 95, ["c02_t024_s02_f01", "c02_t024_s02_f02", "c02_t024_s02_f03",]],
    //     [ 96, ["c02_t024_s03_f01", "c02_t024_s03_f02", "c02_t024_s03_f03",]],
    //     [ 97, ["c02_t024_s04_f01", "c02_t024_s04_f02", "c02_t024_s04_f03",]],
    //     [ 98, ["c02_t024_s05_f01", "c02_t024_s05_f02", "c02_t024_s05_f03",]],
    //     [ 99, ["c02_t024_s06_f01", "c02_t024_s06_f02", "c02_t024_s06_f03",]],
    //     [100, ["c02_t024_s07_f01", "c02_t024_s07_f02", "c02_t024_s07_f03",]],
    //     [101, ["c02_t024_s08_f01", "c02_t024_s08_f02", "c02_t024_s08_f03",]],
    //     [102, ["c02_t024_s09_f01", "c02_t024_s09_f02", "c02_t024_s09_f03",]],
    //     [103, ["c02_t024_s10_f01", "c02_t024_s10_f02", "c02_t024_s10_f03",]],
    //     [104, ["c02_t024_s11_f01", "c02_t024_s11_f02", "c02_t024_s11_f03",]],
    //     [105, ["c02_t024_s12_f01", "c02_t024_s12_f02", "c02_t024_s12_f03",]],
    //     [106, ["c02_t024_s13_f01", "c02_t024_s13_f02", "c02_t024_s13_f03",]],
    //     [107, ["c02_t024_s14_f01", "c02_t024_s14_f02", "c02_t024_s14_f03",]],
    //     [108, ["c02_t024_s15_f01", "c02_t024_s15_f02", "c02_t024_s15_f03",]],
    //     [109, ["c02_t024_s16_f01", "c02_t024_s16_f02", "c02_t024_s16_f03",]],
    // ]);

    // const _TILE_OBJECT_FOG_IMAGE_SOURCES = new Map<number, string[]>();
    // for (const [viewId, rawSources] of _TILE_OBJECT_NORMAL_IMAGE_SOURCES) {
    //     const sources = rawSources.concat();
    //     for (let i = 0; i < sources.length; ++i) {
    //         sources[i] = sources[i].replace("c02", "c06");
    //     }
    //     _TILE_OBJECT_FOG_IMAGE_SOURCES.set(viewId, sources);
    // }

    // const _TILE_BASE_TYPES = new Map<number, TileBaseType>([
    //     ////////// empty: 0 (1 total) //////////
    //     [  0, TileBaseType.Empty],

    //     ////////// plain: 1 (1 total) //////////
    //     [  1, TileBaseType.Plain],

    //     ////////// river: 2 - 17 (16 total) //////////
    //     [  2, TileBaseType.River],
    //     [  3, TileBaseType.River],
    //     [  4, TileBaseType.River],
    //     [  5, TileBaseType.River],
    //     [  6, TileBaseType.River],
    //     [  7, TileBaseType.River],
    //     [  8, TileBaseType.River],
    //     [  9, TileBaseType.River],
    //     [ 10, TileBaseType.River],
    //     [ 11, TileBaseType.River],
    //     [ 12, TileBaseType.River],
    //     [ 13, TileBaseType.River],
    //     [ 14, TileBaseType.River],
    //     [ 15, TileBaseType.River],
    //     [ 16, TileBaseType.River],
    //     [ 17, TileBaseType.River],

    //     ////////// sea: 18 - 64 (47 total) //////////
    //     [ 18, TileBaseType.Sea],
    //     [ 19, TileBaseType.Sea],
    //     [ 20, TileBaseType.Sea],
    //     [ 21, TileBaseType.Sea],
    //     [ 22, TileBaseType.Sea],
    //     [ 23, TileBaseType.Sea],
    //     [ 24, TileBaseType.Sea],
    //     [ 25, TileBaseType.Sea],
    //     [ 26, TileBaseType.Sea],
    //     [ 27, TileBaseType.Sea],
    //     [ 28, TileBaseType.Sea],
    //     [ 29, TileBaseType.Sea],
    //     [ 30, TileBaseType.Sea],
    //     [ 31, TileBaseType.Sea],
    //     [ 32, TileBaseType.Sea],
    //     [ 33, TileBaseType.Sea],
    //     [ 34, TileBaseType.Sea],
    //     [ 35, TileBaseType.Sea],
    //     [ 36, TileBaseType.Sea],
    //     [ 37, TileBaseType.Sea],
    //     [ 38, TileBaseType.Sea],
    //     [ 39, TileBaseType.Sea],
    //     [ 40, TileBaseType.Sea],
    //     [ 41, TileBaseType.Sea],
    //     [ 42, TileBaseType.Sea],
    //     [ 43, TileBaseType.Sea],
    //     [ 44, TileBaseType.Sea],
    //     [ 45, TileBaseType.Sea],
    //     [ 46, TileBaseType.Sea],
    //     [ 47, TileBaseType.Sea],
    //     [ 48, TileBaseType.Sea],
    //     [ 49, TileBaseType.Sea],
    //     [ 50, TileBaseType.Sea],
    //     [ 51, TileBaseType.Sea],
    //     [ 52, TileBaseType.Sea],
    //     [ 53, TileBaseType.Sea],
    //     [ 54, TileBaseType.Sea],
    //     [ 55, TileBaseType.Sea],
    //     [ 56, TileBaseType.Sea],
    //     [ 57, TileBaseType.Sea],
    //     [ 58, TileBaseType.Sea],
    //     [ 59, TileBaseType.Sea],
    //     [ 60, TileBaseType.Sea],
    //     [ 61, TileBaseType.Sea],
    //     [ 62, TileBaseType.Sea],
    //     [ 63, TileBaseType.Sea],
    //     [ 64, TileBaseType.Sea],

    //     ////////// beach: 65 - 100 (36 total) //////////
    //     [ 65, TileBaseType.Beach],
    //     [ 66, TileBaseType.Beach],
    //     [ 67, TileBaseType.Beach],
    //     [ 68, TileBaseType.Beach],
    //     [ 69, TileBaseType.Beach],
    //     [ 70, TileBaseType.Beach],
    //     [ 71, TileBaseType.Beach],
    //     [ 72, TileBaseType.Beach],
    //     [ 73, TileBaseType.Beach],
    //     [ 74, TileBaseType.Beach],
    //     [ 75, TileBaseType.Beach],
    //     [ 76, TileBaseType.Beach],
    //     [ 77, TileBaseType.Beach],
    //     [ 78, TileBaseType.Beach],
    //     [ 79, TileBaseType.Beach],
    //     [ 80, TileBaseType.Beach],
    //     [ 81, TileBaseType.Beach],
    //     [ 82, TileBaseType.Beach],
    //     [ 83, TileBaseType.Beach],
    //     [ 84, TileBaseType.Beach],
    //     [ 85, TileBaseType.Beach],
    //     [ 86, TileBaseType.Beach],
    //     [ 87, TileBaseType.Beach],
    //     [ 88, TileBaseType.Beach],
    //     [ 89, TileBaseType.Beach],
    //     [ 90, TileBaseType.Beach],
    //     [ 91, TileBaseType.Beach],
    //     [ 92, TileBaseType.Beach],
    //     [ 93, TileBaseType.Beach],
    //     [ 94, TileBaseType.Beach],
    //     [ 95, TileBaseType.Beach],
    //     [ 96, TileBaseType.Beach],
    //     [ 97, TileBaseType.Beach],
    //     [ 98, TileBaseType.Beach],
    //     [ 99, TileBaseType.Beach],
    //     [100, TileBaseType.Beach],
    // ]);

    // const _TILE_OBJECT_TYPES_AND_PLAYER_INDEX = new Map<number, TileObjectTypeAndPlayerIndex>([
    //     ////////// empty //////////
    //     [  0, { tileObjectType: TileObjectType.Empty, playerIndex: 0 }],

    //     ////////// road //////////
    //     [  1, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  2, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  3, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  4, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  5, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  6, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  7, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  8, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [  9, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [ 10, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
    //     [ 11, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],

    //     ////////// bridge //////////
    //     [ 12, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 13, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 14, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 15, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 16, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 17, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 18, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 19, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 20, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 21, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
    //     [ 22, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],

    //     ////////// wood //////////
    //     [ 23, { tileObjectType: TileObjectType.Wood, playerIndex: 0 }],

    //     ////////// mountain //////////
    //     [ 24, { tileObjectType: TileObjectType.Mountain, playerIndex: 0 }],

    //     ////////// wasteland //////////
    //     [ 25, { tileObjectType: TileObjectType.Wasteland, playerIndex: 0 }],

    //     ////////// ruins //////////
    //     [ 26, { tileObjectType: TileObjectType.Ruins, playerIndex: 0 }],

    //     ////////// fire //////////
    //     [ 27, { tileObjectType: TileObjectType.Fire, playerIndex: 0 }],

    //     ////////// rough //////////
    //     [ 28, { tileObjectType: TileObjectType.Rough, playerIndex: 0 }],

    //     ////////// mist //////////
    //     [ 29, { tileObjectType: TileObjectType.Mist, playerIndex: 0 }],

    //     ////////// reef //////////
    //     [ 30, { tileObjectType: TileObjectType.Reef, playerIndex: 0 }],

    //     ////////// plasma //////////
    //     [ 31, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 32, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 33, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 34, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 35, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 36, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 37, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 38, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 39, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 40, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 41, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 42, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 43, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 44, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 45, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
    //     [ 46, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],

    //     ////////// meteor //////////
    //     [ 47, { tileObjectType: TileObjectType.Meteor, playerIndex: 0 }],

    //     ////////// silo //////////
    //     [ 48, { tileObjectType: TileObjectType.Silo, playerIndex: 0 }],

    //     ////////// empty silo //////////
    //     [ 49, { tileObjectType: TileObjectType.EmptySilo, playerIndex: 0 }],

    //     ////////// headquarters //////////
    //     [ 50, { tileObjectType: TileObjectType.Headquarters, playerIndex: 1 }],
    //     [ 51, { tileObjectType: TileObjectType.Headquarters, playerIndex: 2 }],
    //     [ 52, { tileObjectType: TileObjectType.Headquarters, playerIndex: 3 }],
    //     [ 53, { tileObjectType: TileObjectType.Headquarters, playerIndex: 4 }],

    //     ////////// city //////////
    //     [ 54, { tileObjectType: TileObjectType.City, playerIndex: 0 }],
    //     [ 55, { tileObjectType: TileObjectType.City, playerIndex: 1 }],
    //     [ 56, { tileObjectType: TileObjectType.City, playerIndex: 2 }],
    //     [ 57, { tileObjectType: TileObjectType.City, playerIndex: 3 }],
    //     [ 58, { tileObjectType: TileObjectType.City, playerIndex: 4 }],

    //     ////////// command tower //////////
    //     [ 59, { tileObjectType: TileObjectType.CommandTower, playerIndex: 0 }],
    //     [ 60, { tileObjectType: TileObjectType.CommandTower, playerIndex: 1 }],
    //     [ 61, { tileObjectType: TileObjectType.CommandTower, playerIndex: 2 }],
    //     [ 62, { tileObjectType: TileObjectType.CommandTower, playerIndex: 3 }],
    //     [ 63, { tileObjectType: TileObjectType.CommandTower, playerIndex: 4 }],

    //     ////////// radar //////////
    //     [ 64, { tileObjectType: TileObjectType.Radar, playerIndex: 0 }],
    //     [ 65, { tileObjectType: TileObjectType.Radar, playerIndex: 1 }],
    //     [ 66, { tileObjectType: TileObjectType.Radar, playerIndex: 2 }],
    //     [ 67, { tileObjectType: TileObjectType.Radar, playerIndex: 3 }],
    //     [ 68, { tileObjectType: TileObjectType.Radar, playerIndex: 4 }],

    //     ////////// factory //////////
    //     [ 69, { tileObjectType: TileObjectType.Factory, playerIndex: 0 }],
    //     [ 70, { tileObjectType: TileObjectType.Factory, playerIndex: 1 }],
    //     [ 71, { tileObjectType: TileObjectType.Factory, playerIndex: 2 }],
    //     [ 72, { tileObjectType: TileObjectType.Factory, playerIndex: 3 }],
    //     [ 73, { tileObjectType: TileObjectType.Factory, playerIndex: 4 }],

    //     ////////// airport //////////
    //     [ 74, { tileObjectType: TileObjectType.Airport, playerIndex: 0 }],
    //     [ 75, { tileObjectType: TileObjectType.Airport, playerIndex: 1 }],
    //     [ 76, { tileObjectType: TileObjectType.Airport, playerIndex: 2 }],
    //     [ 77, { tileObjectType: TileObjectType.Airport, playerIndex: 3 }],
    //     [ 78, { tileObjectType: TileObjectType.Airport, playerIndex: 4 }],

    //     ////////// seaport //////////
    //     [ 79, { tileObjectType: TileObjectType.Seaport, playerIndex: 0 }],
    //     [ 80, { tileObjectType: TileObjectType.Seaport, playerIndex: 1 }],
    //     [ 81, { tileObjectType: TileObjectType.Seaport, playerIndex: 2 }],
    //     [ 82, { tileObjectType: TileObjectType.Seaport, playerIndex: 3 }],
    //     [ 83, { tileObjectType: TileObjectType.Seaport, playerIndex: 4 }],

    //     ////////// temp airport //////////
    //     [ 84, { tileObjectType: TileObjectType.TempAirport, playerIndex: 0 }],
    //     [ 85, { tileObjectType: TileObjectType.TempAirport, playerIndex: 1 }],
    //     [ 86, { tileObjectType: TileObjectType.TempAirport, playerIndex: 2 }],
    //     [ 87, { tileObjectType: TileObjectType.TempAirport, playerIndex: 3 }],
    //     [ 88, { tileObjectType: TileObjectType.TempAirport, playerIndex: 4 }],

    //     ////////// temp seaport //////////
    //     [ 89, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 0 }],
    //     [ 90, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 1 }],
    //     [ 91, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 2 }],
    //     [ 92, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 3 }],
    //     [ 93, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 4 }],

    //     ////////// green plasma //////////
    //     [ 94, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [ 95, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [ 96, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [ 97, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [ 98, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [ 99, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [100, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [101, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [102, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [103, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [104, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [105, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [106, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [107, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [108, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    //     [109, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    // ]);

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

    // const _UNIT_TYPES_AND_PLAYER_INDEX = new Map<number, UnitTypeAndPlayerIndex>([
    //     ////////// infantry //////////
    //     [  1, { unitType: UnitType.Infantry, playerIndex: 1 }],
    //     [  2, { unitType: UnitType.Infantry, playerIndex: 2 }],
    //     [  3, { unitType: UnitType.Infantry, playerIndex: 3 }],
    //     [  4, { unitType: UnitType.Infantry, playerIndex: 4 }],

    //     ////////// mech //////////
    //     [  5, { unitType: UnitType.Mech, playerIndex: 1 }],
    //     [  6, { unitType: UnitType.Mech, playerIndex: 2 }],
    //     [  7, { unitType: UnitType.Mech, playerIndex: 3 }],
    //     [  8, { unitType: UnitType.Mech, playerIndex: 4 }],

    //     ////////// bike //////////
    //     [  9, { unitType: UnitType.Bike, playerIndex: 1 }],
    //     [ 10, { unitType: UnitType.Bike, playerIndex: 2 }],
    //     [ 11, { unitType: UnitType.Bike, playerIndex: 3 }],
    //     [ 12, { unitType: UnitType.Bike, playerIndex: 4 }],

    //     ////////// recon //////////
    //     [ 13, { unitType: UnitType.Recon, playerIndex: 1 }],
    //     [ 14, { unitType: UnitType.Recon, playerIndex: 2 }],
    //     [ 15, { unitType: UnitType.Recon, playerIndex: 3 }],
    //     [ 16, { unitType: UnitType.Recon, playerIndex: 4 }],

    //     ////////// flare //////////
    //     [ 17, { unitType: UnitType.Flare, playerIndex: 1 }],
    //     [ 18, { unitType: UnitType.Flare, playerIndex: 2 }],
    //     [ 19, { unitType: UnitType.Flare, playerIndex: 3 }],
    //     [ 20, { unitType: UnitType.Flare, playerIndex: 4 }],

    //     ////////// anti air //////////
    //     [ 21, { unitType: UnitType.AntiAir, playerIndex: 1 }],
    //     [ 22, { unitType: UnitType.AntiAir, playerIndex: 2 }],
    //     [ 23, { unitType: UnitType.AntiAir, playerIndex: 3 }],
    //     [ 24, { unitType: UnitType.AntiAir, playerIndex: 4 }],

    //     ////////// tank //////////
    //     [ 25, { unitType: UnitType.Tank, playerIndex: 1 }],
    //     [ 26, { unitType: UnitType.Tank, playerIndex: 2 }],
    //     [ 27, { unitType: UnitType.Tank, playerIndex: 3 }],
    //     [ 28, { unitType: UnitType.Tank, playerIndex: 4 }],

    //     ////////// medium tank //////////
    //     [ 29, { unitType: UnitType.MediumTank, playerIndex: 1 }],
    //     [ 30, { unitType: UnitType.MediumTank, playerIndex: 2 }],
    //     [ 31, { unitType: UnitType.MediumTank, playerIndex: 3 }],
    //     [ 32, { unitType: UnitType.MediumTank, playerIndex: 4 }],

    //     ////////// war tank //////////
    //     [ 33, { unitType: UnitType.WarTank, playerIndex: 1 }],
    //     [ 34, { unitType: UnitType.WarTank, playerIndex: 2 }],
    //     [ 35, { unitType: UnitType.WarTank, playerIndex: 3 }],
    //     [ 36, { unitType: UnitType.WarTank, playerIndex: 4 }],

    //     ////////// artillery //////////
    //     [ 37, { unitType: UnitType.Artillery, playerIndex: 1 }],
    //     [ 38, { unitType: UnitType.Artillery, playerIndex: 2 }],
    //     [ 39, { unitType: UnitType.Artillery, playerIndex: 3 }],
    //     [ 40, { unitType: UnitType.Artillery, playerIndex: 4 }],

    //     ////////// antitank //////////
    //     [ 41, { unitType: UnitType.AntiTank, playerIndex: 1 }],
    //     [ 42, { unitType: UnitType.AntiTank, playerIndex: 2 }],
    //     [ 43, { unitType: UnitType.AntiTank, playerIndex: 3 }],
    //     [ 44, { unitType: UnitType.AntiTank, playerIndex: 4 }],

    //     ////////// rockets //////////
    //     [ 45, { unitType: UnitType.Rockets, playerIndex: 1 }],
    //     [ 46, { unitType: UnitType.Rockets, playerIndex: 2 }],
    //     [ 47, { unitType: UnitType.Rockets, playerIndex: 3 }],
    //     [ 48, { unitType: UnitType.Rockets, playerIndex: 4 }],

    //     ////////// missiles //////////
    //     [ 49, { unitType: UnitType.Missiles, playerIndex: 1 }],
    //     [ 50, { unitType: UnitType.Missiles, playerIndex: 2 }],
    //     [ 51, { unitType: UnitType.Missiles, playerIndex: 3 }],
    //     [ 52, { unitType: UnitType.Missiles, playerIndex: 4 }],

    //     ////////// rig //////////
    //     [ 53, { unitType: UnitType.Rig, playerIndex: 1 }],
    //     [ 54, { unitType: UnitType.Rig, playerIndex: 2 }],
    //     [ 55, { unitType: UnitType.Rig, playerIndex: 3 }],
    //     [ 56, { unitType: UnitType.Rig, playerIndex: 4 }],

    //     ////////// fighter //////////
    //     [ 57, { unitType: UnitType.Fighter, playerIndex: 1 }],
    //     [ 58, { unitType: UnitType.Fighter, playerIndex: 2 }],
    //     [ 59, { unitType: UnitType.Fighter, playerIndex: 3 }],
    //     [ 60, { unitType: UnitType.Fighter, playerIndex: 4 }],

    //     ////////// bomber //////////
    //     [ 61, { unitType: UnitType.Bomber, playerIndex: 1 }],
    //     [ 62, { unitType: UnitType.Bomber, playerIndex: 2 }],
    //     [ 63, { unitType: UnitType.Bomber, playerIndex: 3 }],
    //     [ 64, { unitType: UnitType.Bomber, playerIndex: 4 }],

    //     ////////// duster //////////
    //     [ 65, { unitType: UnitType.Duster, playerIndex: 1 }],
    //     [ 66, { unitType: UnitType.Duster, playerIndex: 2 }],
    //     [ 67, { unitType: UnitType.Duster, playerIndex: 3 }],
    //     [ 68, { unitType: UnitType.Duster, playerIndex: 4 }],

    //     ////////// battle copter //////////
    //     [ 69, { unitType: UnitType.BattleCopter, playerIndex: 1 }],
    //     [ 70, { unitType: UnitType.BattleCopter, playerIndex: 2 }],
    //     [ 71, { unitType: UnitType.BattleCopter, playerIndex: 3 }],
    //     [ 72, { unitType: UnitType.BattleCopter, playerIndex: 4 }],

    //     ////////// transport copter //////////
    //     [ 73, { unitType: UnitType.TransportCopter, playerIndex: 1 }],
    //     [ 74, { unitType: UnitType.TransportCopter, playerIndex: 2 }],
    //     [ 75, { unitType: UnitType.TransportCopter, playerIndex: 3 }],
    //     [ 76, { unitType: UnitType.TransportCopter, playerIndex: 4 }],

    //     ////////// seaplane //////////
    //     [ 77, { unitType: UnitType.Seaplane, playerIndex: 1 }],
    //     [ 78, { unitType: UnitType.Seaplane, playerIndex: 2 }],
    //     [ 79, { unitType: UnitType.Seaplane, playerIndex: 3 }],
    //     [ 80, { unitType: UnitType.Seaplane, playerIndex: 4 }],

    //     ////////// battleship //////////
    //     [ 81, { unitType: UnitType.Battleship, playerIndex: 1 }],
    //     [ 82, { unitType: UnitType.Battleship, playerIndex: 2 }],
    //     [ 83, { unitType: UnitType.Battleship, playerIndex: 3 }],
    //     [ 84, { unitType: UnitType.Battleship, playerIndex: 4 }],

    //     ////////// carrier //////////
    //     [ 85, { unitType: UnitType.Carrier, playerIndex: 1 }],
    //     [ 86, { unitType: UnitType.Carrier, playerIndex: 2 }],
    //     [ 87, { unitType: UnitType.Carrier, playerIndex: 3 }],
    //     [ 88, { unitType: UnitType.Carrier, playerIndex: 4 }],

    //     ////////// submarine //////////
    //     [ 89, { unitType: UnitType.Submarine, playerIndex: 1 }],
    //     [ 90, { unitType: UnitType.Submarine, playerIndex: 2 }],
    //     [ 91, { unitType: UnitType.Submarine, playerIndex: 3 }],
    //     [ 92, { unitType: UnitType.Submarine, playerIndex: 4 }],

    //     ////////// cruiser //////////
    //     [ 93, { unitType: UnitType.Cruiser, playerIndex: 1 }],
    //     [ 94, { unitType: UnitType.Cruiser, playerIndex: 2 }],
    //     [ 95, { unitType: UnitType.Cruiser, playerIndex: 3 }],
    //     [ 96, { unitType: UnitType.Cruiser, playerIndex: 4 }],

    //     ////////// lander //////////
    //     [ 97, { unitType: UnitType.Lander, playerIndex: 1 }],
    //     [ 98, { unitType: UnitType.Lander, playerIndex: 2 }],
    //     [ 99, { unitType: UnitType.Lander, playerIndex: 3 }],
    //     [100, { unitType: UnitType.Lander, playerIndex: 4 }],

    //     ////////// gunboat //////////
    //     [101, { unitType: UnitType.Gunboat, playerIndex: 1 }],
    //     [102, { unitType: UnitType.Gunboat, playerIndex: 2 }],
    //     [103, { unitType: UnitType.Gunboat, playerIndex: 3 }],
    //     [104, { unitType: UnitType.Gunboat, playerIndex: 4 }],
    // ]);

    const _UNIT_IMAGE_CFGS = new Map([
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V2,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 2 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
            ]),
        ],
    ]);

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    function _destructTileCategoryCfg(data: TileCategoryCfg[]): { [category: number]: TileCategoryCfg } {
        const dst: { [category: number]: TileCategoryCfg } = {};
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
    function _destructPlayerRankCfg(data: PlayerRankCfg[]): { [minScore: number]: PlayerRankCfg } {
        const dst: { [minScore: number]: PlayerRankCfg } = {};
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

    // function _initTileObjectViewIds(): void {
    //     for (const [tileObjectViewId, tileObjectTypeAndPlayerIndex] of _TILE_OBJECT_TYPES_AND_PLAYER_INDEX) {
    //         const type = tileObjectTypeAndPlayerIndex.tileObjectType;
    //         if (_TILE_OBJECT_VIEW_IDS.has(type)) {
    //             _TILE_OBJECT_VIEW_IDS.get(type)!.set(tileObjectTypeAndPlayerIndex.playerIndex, tileObjectViewId);
    //         } else {
    //             _TILE_OBJECT_VIEW_IDS.set(type, new Map([[tileObjectTypeAndPlayerIndex.playerIndex, tileObjectViewId]]));
    //         }
    //     }

    //     Logger.log("[ConfigManager init] _initTileObjectViewIds() finished.");
    // }

    // function _initTileBaseViewIds(): void {
    //     for (const [viewId, type] of _TILE_BASE_TYPES) {
    //         if (!_TILE_BASE_VIEW_IDS.has(type)) {
    //             _TILE_BASE_VIEW_IDS.set(type, viewId);
    //         }
    //     }
    // }

    // function _initUnitViewIds(): void {
    //     for (const [unitViewId, unitTypeAndPlayerIndex] of _UNIT_TYPES_AND_PLAYER_INDEX) {
    //         const type = unitTypeAndPlayerIndex.unitType;
    //         if (_UNIT_VIEW_IDS.has(type)) {
    //             _UNIT_VIEW_IDS.get(type)!.set(unitTypeAndPlayerIndex.playerIndex, unitViewId);
    //         } else {
    //             _UNIT_VIEW_IDS.set(type, new Map([[unitTypeAndPlayerIndex.playerIndex, unitViewId]]));
    //         }
    //     }

    //     Logger.log("[ConfigManager init] _initUnitViewIds() finished.");
    // }

    function _onSNewestConfigVersion(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.IS_NewestConfigVersion;
        _newestFormalVersion = data.version;
        loadConfig(_newestFormalVersion);
    }

    const _ALL_CONFIGS          = new Map<string, ExtendedFullConfig>();
    const _TILE_OBJECT_VIEW_IDS = new Map<TileObjectType, Map<number, number>>();
    const _TILE_BASE_VIEW_IDS   = new Map<TileBaseType, number>();
    const _UNIT_VIEW_IDS        = new Map<UnitType, Map<number, number>>();
    const _AVAILABLE_CO_LIST    = new Map<string, CoBasicCfg[]>();
    const _CO_TIERS             = new Map<string, number[]>();
    const _CO_ID_LIST_IN_TIER   = new Map<string, Map<number, number[]>>();
    const _CUSTOM_CO_ID_LIST    = new Map<string, number[]>();
    let _newestFormalVersion    : string;

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export const SILO_RADIUS                = 2;
    export const SILO_DAMAGE                = 30;

    export const MAP_CONSTANTS              = {
        MaxGridsCount           : 1000,
        MaxMapNameLength        : 30,
        MaxMapNameEnglishLength : 30,
        MaxDesignerLength       : 30,
    };

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_NewestConfigVersion, callback: _onSNewestConfigVersion },
        ], Utility.ConfigManager);

        // _initTileObjectViewIds();
        // _initTileBaseViewIds();
        // _initUnitViewIds();
    }

    export function getNewestConfigVersion(): string {
        return _newestFormalVersion;
    }

    export function checkIsConfigLoaded(version: string): boolean {
        return _ALL_CONFIGS.has(version);
    }

    export async function loadConfig(version: string): Promise<ExtendedFullConfig> {
        if (!checkIsConfigLoaded(version)) {
            const data = Utility.ProtoManager.decodeAsFullConfig(await RES.getResByUrl(
                `resource/config/FullConfig${version}.bin`,
                undefined,
                undefined,
                RES.ResourceItem.TYPE_BIN
            ));
            const cfg: ExtendedFullConfig = {
                TileCategory        : _destructTileCategoryCfg(data.TileCategory),
                UnitCategory        : _destructUnitCategoryCfg(data.UnitCategory),
                TileTemplate        : _destructTileTemplateCfg(data.TileTemplate),
                UnitTemplate        : _destructUnitTemplateCfg(data.UnitTemplate),
                DamageChart         : _destructDamageChartCfg(data.DamageChart),
                MoveCost            : _destructMoveCostCfg(data.MoveCost),
                UnitPromotion       : _destructUnitPromotionCfg(data.UnitPromotion),
                VisionBonus         : _destructVisionBonusCfg(data.VisionBonus),
                BuildableTile       : _destructBuildableTileCfg(data.BuildableTile),
                PlayerRank          : _destructPlayerRankCfg(data.PlayerRank),
                CoBasic             : _destructCoBasicCfg(data.CoBasic),
                CoSkill             : _destructCoSkillCfg(data.CoSkill),
            };
            cfg.maxUnitPromotion    = _getMaxUnitPromotion(cfg.UnitPromotion);
            cfg.secondaryWeaponFlag = _getSecondaryWeaponFlags(cfg.DamageChart);

            _ALL_CONFIGS.set(version, cfg);
        }
        Notify.dispatch(Notify.Type.ConfigLoaded, version);
        return Promise.resolve(_ALL_CONFIGS.get(version));
    }

    export function getGridSize(): GridSize {
        return _GRID_SIZE;
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        return _TILE_TYPE_MAPPING.get(baseType)!.get(objectType)!;
    }

    export function getTileTemplateCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
        return _ALL_CONFIGS.get(version)!.TileTemplate[getTileType(baseType, objectType)];
    }
    export function getTileTemplateCfgByType(version: string, tileType: TileType): TileTemplateCfg {
        return _ALL_CONFIGS.get(version)!.TileTemplate[tileType];
    }

    export function getTileTypesByCategory(version: string, category: TileCategory): TileType[] | undefined | null {
        return _ALL_CONFIGS.get(version)!.TileCategory[category].tileTypes;
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
        return _ALL_CONFIGS.get(version)!.UnitTemplate[unitType];
    }

    export function getUnitTypesByCategory(version: string, category: UnitCategory): UnitType[] | undefined | null {
        return _ALL_CONFIGS.get(version)!.UnitCategory[category].unitTypes;
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
        return _ALL_CONFIGS.get(version)!.maxUnitPromotion!;
    }

    export function checkHasSecondaryWeapon(version: string, unitType: UnitType): boolean {
        return _ALL_CONFIGS.get(version)!.secondaryWeaponFlag![unitType];
    }

    export function getUnitPromotionAttackBonus(version: string, promotion: number): number {
        return _ALL_CONFIGS.get(version)!.UnitPromotion![promotion].attackBonus!;
    }

    export function getUnitPromotionDefenseBonus(version: string, promotion: number): number {
        return _ALL_CONFIGS.get(version)!.UnitPromotion![promotion].defenseBonus!;
    }

    export function getDamageChartCfgs(version: string, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        return _ALL_CONFIGS.get(version)!.DamageChart[attackerType];
    }

    export function getBuildableTileCfgs(version: string, unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | undefined {
        return _ALL_CONFIGS.get(version)!.BuildableTile[unitType];
    }

    export function getVisionBonusCfg(version: string, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
        return _ALL_CONFIGS.get(version)!.VisionBonus[unitType];
    }

    export function getMoveCostCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
        return _ALL_CONFIGS.get(version)!.MoveCost[getTileType(baseType, objectType)];
    }
    export function getMoveCostCfgByTileType(version: string, tileType: TileType): { [moveType: number]: MoveCostCfg } {
        return _ALL_CONFIGS.get(version)!.MoveCost[tileType];
    }

    // export function getTileBaseType(tileBaseViewId: number): TileBaseType {
    //     return _TILE_BASE_TYPES.get(tileBaseViewId)!;
    // }

    // export function getTileBaseViewId(type: TileBaseType): number {
    //     return _TILE_BASE_VIEW_IDS.get(type);
    // }

    // export function getTileObjectTypeAndPlayerIndex(tileObjectViewId: number): TileObjectTypeAndPlayerIndex {
    //     return _TILE_OBJECT_TYPES_AND_PLAYER_INDEX.get(tileObjectViewId)!;
    // }

    // export function getUnitTypeAndPlayerIndex(unitViewId: number): UnitTypeAndPlayerIndex {
    //     return _UNIT_TYPES_AND_PLAYER_INDEX.get(unitViewId)!;
    // }

    // export function getTileObjectViewId(type: Types.TileObjectType, playerIndex: number): number | undefined {
    //     const mapping = _TILE_OBJECT_VIEW_IDS.get(type);
    //     return mapping ? mapping.get(playerIndex) : undefined;
    // }

    export function getTileObjectTypeByTileType(type: TileType): TileObjectType {
        return _TILE_TYPE_TO_TILE_OBJECT_TYPE.get(type)!;
    }

    // export function getUnitViewId(type: Types.UnitType, playerIndex: number): number | undefined {
    //     const mapping = _UNIT_VIEW_IDS.get(type);
    //     return mapping ? mapping.get(playerIndex) : undefined;
    // }

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
            const textForDark       = isDark ? `dark` : `normal`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(baseType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame1`;
            return `tileBase_${textForDark}_${textForShapeId}_${textForVersion}_${textForSkin}_${textForType}_${textForFrame}`;
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
            const textForDark       = isDark ? `dark` : `normal`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(objectType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame1`;
            return `tileObject_${textForDark}_${textForShapeId}_${textForVersion}_${textForSkin}_${textForType}_${textForFrame}`;
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
            const textForDark       = isDark ? `dark` : `normal`;
            const textForMoving     = isMoving ? `moving` : `idle`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(unitType)}`;
            const textForFrame      = `frame${Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame)}`;
            return `unit_${textForDark}_${textForMoving}_${textForVersion}_${textForSkin}_${textForType}_${textForFrame}`;
        }
    }

    export function getRankName(version: string, rankScore: number): string {
        return Lang.getRankName(getPlayerRank(version, rankScore));
    }
    export function getPlayerRank(version: string, rankScore: number): number | undefined {
        const cfgs  = _ALL_CONFIGS.get(version)!.PlayerRank;
        let maxRank = 0;
        for (const i in cfgs) {
            const cfg = cfgs[i];
            if (rankScore >= cfg.minScore) {
                maxRank = cfg.rank;
            }
        }
        return maxRank;
    }

    export function getCoBasicCfg(version: string, coId: number): CoBasicCfg | null {
        return _ALL_CONFIGS.get(version)!.CoBasic[coId];
    }

    export function getCoNameAndTierText(version: string, coId: number | null): string {
        const coConfig = coId == null ? null : Utility.ConfigManager.getCoBasicCfg(version, coId);
        return coConfig
            ? `(${coConfig.name}(T${coConfig.tier}))`
            : `(${Lang.getText(Lang.Type.B0211)} CO)`;
    }

    export function getCoSkillCfg(version: string, skillId: number): CoSkillCfg | null {
        return _ALL_CONFIGS.get(version)!.CoSkill[skillId];
    }

    export function getAvailableCoList(version: string): CoBasicCfg[] {
        if (!_AVAILABLE_CO_LIST.has(version)) {
            const list: CoBasicCfg[] = [];
            const cfgs = _ALL_CONFIGS.get(version)!.CoBasic;
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
            for (const cfg of getAvailableCoList(version)) {
                tiers.add(cfg.tier);
            }
            _CO_TIERS.set(version, Array.from(tiers).sort());
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
            for (const cfg of getAvailableCoList(version)) {
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
            for (const cfg of getAvailableCoList(version)) {
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
    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: Types.UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
    }

    // export function forEachTileObjectTypeAndPlayerIndex(func: (value: TileObjectTypeAndPlayerIndex, tileObjectViewId: number) => void): void {
    //     _TILE_OBJECT_TYPES_AND_PLAYER_INDEX.forEach(func);
    // }
    // export function forEachTileBaseType(func: (value: TileBaseType, tileBaseViewId: number) => void): void {
    //     _TILE_BASE_TYPES.forEach(func);
    // }
    // export function forEachUnitTypeAndPlayerIndex(func: (value: UnitTypeAndPlayerIndex, unitViewId: number) => void): void {
    //     _UNIT_TYPES_AND_PLAYER_INDEX.forEach(func);
    // }
    export function getTileObjectShapeCfgs(): Map<TileObjectType, TileObjectShapeCfg> {
        return _TILE_OBJECT_SHAPE_CFGS;
    }
    export function getTileBaseShapeCfgs(): Map<TileBaseType, TileBaseShapeCfg> {
        return _TILE_BASE_SHAPE_CFGS;
    }
    export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: number): boolean {
        const cfg = getTileObjectShapeCfgs().get(tileObjectType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
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
