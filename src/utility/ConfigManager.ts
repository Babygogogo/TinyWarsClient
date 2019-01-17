
namespace TinyWars.ConfigManager {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import Logger           = Utility.Logger;
    import NetManager       = Network.Manager;
    import ActionCode       = Network.Codes;
    import GridSize         = Types.Size;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import UnitCategory     = Types.UnitCategory;
    import TileCategory     = Types.TileCategory;
    import MoveType         = Types.MoveType;
    import ArmorType        = Types.ArmorType;
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

    type FullConfig = {
        TileCategory            : { [category: number]: TileCategoryCfg };
        UnitCategory            : { [category: number]: UnitCategoryCfg };
        TileTemplate            : { [tileType: number]: TileTemplateCfg };
        UnitTemplate            : { [unitType: number]: UnitTemplateCfg };
        DamageChart             : { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } };
        MoveCost                : { [tileType: number]: { [moveType: number]: MoveCostCfg } };
        UnitPromotion           : { [promotion: number]: UnitPromotionCfg };
        VisionBonus             : { [unitType: number]: { [tileType: number]: VisionBonusCfg } };
        BuildableTile           : { [unitType: number]: { [srcTileType: number]: BuildableTileCfg } };
        maxUnitPromotion?       : number;
        secondaryWeaponFlag?    : { [unitType: number]: boolean };
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Constants.
    ////////////////////////////////////////////////////////////////////////////////
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
            [TileObjectType.Empty,          TileType.Beach],
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
            [TileObjectType.Empty,          TileType.Beach],
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
            [TileObjectType.Empty,          TileType.Beach],
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

    const _TILE_BASE_IMAGE_SOURCES = new Map<number, string[]>([
        ////////// plain * 1 //////////
        [  1, ["c01_t01_s01_f01",]],

        ////////// river * 16 //////////
        [  2, ["c01_t02_s01_f01",]],
        [  3, ["c01_t02_s02_f01",]],
        [  4, ["c01_t02_s03_f01",]],
        [  5, ["c01_t02_s04_f01",]],
        [  6, ["c01_t02_s05_f01",]],
        [  7, ["c01_t02_s06_f01",]],
        [  8, ["c01_t02_s07_f01",]],
        [  9, ["c01_t02_s08_f01",]],
        [ 10, ["c01_t02_s09_f01",]],
        [ 11, ["c01_t02_s10_f01",]],
        [ 12, ["c01_t02_s11_f01",]],
        [ 13, ["c01_t02_s12_f01",]],
        [ 14, ["c01_t02_s13_f01",]],
        [ 15, ["c01_t02_s14_f01",]],
        [ 16, ["c01_t02_s15_f01",]],
        [ 17, ["c01_t02_s16_f01",]],

        // ////////// sea * 47 //////////
        [ 18, ["c01_t03_s01_f01", "c01_t03_s01_f02", "c01_t03_s01_f03", "c01_t03_s01_f04", "c01_t03_s01_f03", "c01_t03_s01_f02",]],
        [ 19, ["c01_t03_s02_f01", "c01_t03_s02_f02", "c01_t03_s02_f03", "c01_t03_s02_f04", "c01_t03_s02_f03", "c01_t03_s02_f02",]],
        [ 20, ["c01_t03_s03_f01", "c01_t03_s03_f02", "c01_t03_s03_f03", "c01_t03_s03_f04", "c01_t03_s03_f03", "c01_t03_s03_f02",]],
        [ 21, ["c01_t03_s04_f01", "c01_t03_s04_f02", "c01_t03_s04_f03", "c01_t03_s04_f04", "c01_t03_s04_f03", "c01_t03_s04_f02",]],
        [ 22, ["c01_t03_s05_f01", "c01_t03_s05_f02", "c01_t03_s05_f03", "c01_t03_s05_f04", "c01_t03_s05_f03", "c01_t03_s05_f02",]],
        [ 23, ["c01_t03_s06_f01", "c01_t03_s06_f02", "c01_t03_s06_f03", "c01_t03_s06_f04", "c01_t03_s06_f03", "c01_t03_s06_f02",]],
        [ 24, ["c01_t03_s07_f01", "c01_t03_s07_f02", "c01_t03_s07_f03", "c01_t03_s07_f04", "c01_t03_s07_f03", "c01_t03_s07_f02",]],
        [ 25, ["c01_t03_s08_f01", "c01_t03_s08_f02", "c01_t03_s08_f03", "c01_t03_s08_f04", "c01_t03_s08_f03", "c01_t03_s08_f02",]],
        [ 26, ["c01_t03_s09_f01", "c01_t03_s09_f02", "c01_t03_s09_f03", "c01_t03_s09_f04", "c01_t03_s09_f03", "c01_t03_s09_f02",]],
        [ 27, ["c01_t03_s10_f01", "c01_t03_s10_f02", "c01_t03_s10_f03", "c01_t03_s10_f04", "c01_t03_s10_f03", "c01_t03_s10_f02",]],
        [ 28, ["c01_t03_s11_f01", "c01_t03_s11_f02", "c01_t03_s11_f03", "c01_t03_s11_f04", "c01_t03_s11_f03", "c01_t03_s11_f02",]],
        [ 29, ["c01_t03_s12_f01", "c01_t03_s12_f02", "c01_t03_s12_f03", "c01_t03_s12_f04", "c01_t03_s12_f03", "c01_t03_s12_f02",]],
        [ 30, ["c01_t03_s13_f01", "c01_t03_s13_f02", "c01_t03_s13_f03", "c01_t03_s13_f04", "c01_t03_s13_f03", "c01_t03_s13_f02",]],
        [ 31, ["c01_t03_s14_f01", "c01_t03_s14_f02", "c01_t03_s14_f03", "c01_t03_s14_f04", "c01_t03_s14_f03", "c01_t03_s14_f02",]],
        [ 32, ["c01_t03_s15_f01", "c01_t03_s15_f02", "c01_t03_s15_f03", "c01_t03_s15_f04", "c01_t03_s15_f03", "c01_t03_s15_f02",]],
        [ 33, ["c01_t03_s16_f01", "c01_t03_s16_f02", "c01_t03_s16_f03", "c01_t03_s16_f04", "c01_t03_s16_f03", "c01_t03_s16_f02",]],
        [ 34, ["c01_t03_s17_f01", "c01_t03_s17_f02", "c01_t03_s17_f03", "c01_t03_s17_f04", "c01_t03_s17_f03", "c01_t03_s17_f02",]],
        [ 35, ["c01_t03_s18_f01", "c01_t03_s18_f02", "c01_t03_s18_f03", "c01_t03_s18_f04", "c01_t03_s18_f03", "c01_t03_s18_f02",]],
        [ 36, ["c01_t03_s19_f01", "c01_t03_s19_f02", "c01_t03_s19_f03", "c01_t03_s19_f04", "c01_t03_s19_f03", "c01_t03_s19_f02",]],
        [ 37, ["c01_t03_s20_f01", "c01_t03_s20_f02", "c01_t03_s20_f03", "c01_t03_s20_f04", "c01_t03_s20_f03", "c01_t03_s20_f02",]],
        [ 38, ["c01_t03_s21_f01", "c01_t03_s21_f02", "c01_t03_s21_f03", "c01_t03_s21_f04", "c01_t03_s21_f03", "c01_t03_s21_f02",]],
        [ 39, ["c01_t03_s22_f01", "c01_t03_s22_f02", "c01_t03_s22_f03", "c01_t03_s22_f04", "c01_t03_s22_f03", "c01_t03_s22_f02",]],
        [ 40, ["c01_t03_s23_f01", "c01_t03_s23_f02", "c01_t03_s23_f03", "c01_t03_s23_f04", "c01_t03_s23_f03", "c01_t03_s23_f02",]],
        [ 41, ["c01_t03_s24_f01", "c01_t03_s24_f02", "c01_t03_s24_f03", "c01_t03_s24_f04", "c01_t03_s24_f03", "c01_t03_s24_f02",]],
        [ 42, ["c01_t03_s25_f01", "c01_t03_s25_f02", "c01_t03_s25_f03", "c01_t03_s25_f04", "c01_t03_s25_f03", "c01_t03_s25_f02",]],
        [ 43, ["c01_t03_s26_f01", "c01_t03_s26_f02", "c01_t03_s26_f03", "c01_t03_s26_f04", "c01_t03_s26_f03", "c01_t03_s26_f02",]],
        [ 44, ["c01_t03_s27_f01", "c01_t03_s27_f02", "c01_t03_s27_f03", "c01_t03_s27_f04", "c01_t03_s27_f03", "c01_t03_s27_f02",]],
        [ 45, ["c01_t03_s28_f01", "c01_t03_s28_f02", "c01_t03_s28_f03", "c01_t03_s28_f04", "c01_t03_s28_f03", "c01_t03_s28_f02",]],
        [ 46, ["c01_t03_s29_f01", "c01_t03_s29_f02", "c01_t03_s29_f03", "c01_t03_s29_f04", "c01_t03_s29_f03", "c01_t03_s29_f02",]],
        [ 47, ["c01_t03_s30_f01", "c01_t03_s30_f02", "c01_t03_s30_f03", "c01_t03_s30_f04", "c01_t03_s30_f03", "c01_t03_s30_f02",]],
        [ 48, ["c01_t03_s31_f01", "c01_t03_s31_f02", "c01_t03_s31_f03", "c01_t03_s31_f04", "c01_t03_s31_f03", "c01_t03_s31_f02",]],
        [ 49, ["c01_t03_s32_f01", "c01_t03_s32_f02", "c01_t03_s32_f03", "c01_t03_s32_f04", "c01_t03_s32_f03", "c01_t03_s32_f02",]],
        [ 50, ["c01_t03_s33_f01", "c01_t03_s33_f02", "c01_t03_s33_f03", "c01_t03_s33_f04", "c01_t03_s33_f03", "c01_t03_s33_f02",]],
        [ 51, ["c01_t03_s34_f01", "c01_t03_s34_f02", "c01_t03_s34_f03", "c01_t03_s34_f04", "c01_t03_s34_f03", "c01_t03_s34_f02",]],
        [ 52, ["c01_t03_s35_f01", "c01_t03_s35_f02", "c01_t03_s35_f03", "c01_t03_s35_f04", "c01_t03_s35_f03", "c01_t03_s35_f02",]],
        [ 53, ["c01_t03_s36_f01", "c01_t03_s36_f02", "c01_t03_s36_f03", "c01_t03_s36_f04", "c01_t03_s36_f03", "c01_t03_s36_f02",]],
        [ 54, ["c01_t03_s37_f01", "c01_t03_s37_f02", "c01_t03_s37_f03", "c01_t03_s37_f04", "c01_t03_s37_f03", "c01_t03_s37_f02",]],
        [ 55, ["c01_t03_s38_f01", "c01_t03_s38_f02", "c01_t03_s38_f03", "c01_t03_s38_f04", "c01_t03_s38_f03", "c01_t03_s38_f02",]],
        [ 56, ["c01_t03_s39_f01", "c01_t03_s39_f02", "c01_t03_s39_f03", "c01_t03_s39_f04", "c01_t03_s39_f03", "c01_t03_s39_f02",]],
        [ 57, ["c01_t03_s40_f01", "c01_t03_s40_f02", "c01_t03_s40_f03", "c01_t03_s40_f04", "c01_t03_s40_f03", "c01_t03_s40_f02",]],
        [ 58, ["c01_t03_s41_f01", "c01_t03_s41_f02", "c01_t03_s41_f03", "c01_t03_s41_f04", "c01_t03_s41_f03", "c01_t03_s41_f02",]],
        [ 59, ["c01_t03_s42_f01", "c01_t03_s42_f02", "c01_t03_s42_f03", "c01_t03_s42_f04", "c01_t03_s42_f03", "c01_t03_s42_f02",]],
        [ 60, ["c01_t03_s43_f01", "c01_t03_s43_f02", "c01_t03_s43_f03", "c01_t03_s43_f04", "c01_t03_s43_f03", "c01_t03_s43_f02",]],
        [ 61, ["c01_t03_s44_f01", "c01_t03_s44_f02", "c01_t03_s44_f03", "c01_t03_s44_f04", "c01_t03_s44_f03", "c01_t03_s44_f02",]],
        [ 62, ["c01_t03_s45_f01", "c01_t03_s45_f02", "c01_t03_s45_f03", "c01_t03_s45_f04", "c01_t03_s45_f03", "c01_t03_s45_f02",]],
        [ 63, ["c01_t03_s46_f01", "c01_t03_s46_f02", "c01_t03_s46_f03", "c01_t03_s46_f04", "c01_t03_s46_f03", "c01_t03_s46_f02",]],
        [ 64, ["c01_t03_s47_f01", "c01_t03_s47_f02", "c01_t03_s47_f03", "c01_t03_s47_f04", "c01_t03_s47_f03", "c01_t03_s47_f02",]],

        // ////////// beach * 36 //////////
        [ 65, ["c01_t04_s01_f01", "c01_t04_s01_f02", "c01_t04_s01_f03", "c01_t04_s01_f04", "c01_t04_s01_f03", "c01_t04_s01_f02",]],
        [ 66, ["c01_t04_s02_f01", "c01_t04_s02_f02", "c01_t04_s02_f03", "c01_t04_s02_f04", "c01_t04_s02_f03", "c01_t04_s02_f02",]],
        [ 67, ["c01_t04_s03_f01", "c01_t04_s03_f02", "c01_t04_s03_f03", "c01_t04_s03_f04", "c01_t04_s03_f03", "c01_t04_s03_f02",]],
        [ 68, ["c01_t04_s04_f01", "c01_t04_s04_f02", "c01_t04_s04_f03", "c01_t04_s04_f04", "c01_t04_s04_f03", "c01_t04_s04_f02",]],
        [ 69, ["c01_t04_s05_f01", "c01_t04_s05_f02", "c01_t04_s05_f03", "c01_t04_s05_f04", "c01_t04_s05_f03", "c01_t04_s05_f02",]],
        [ 70, ["c01_t04_s06_f01", "c01_t04_s06_f02", "c01_t04_s06_f03", "c01_t04_s06_f04", "c01_t04_s06_f03", "c01_t04_s06_f02",]],
        [ 71, ["c01_t04_s07_f01", "c01_t04_s07_f02", "c01_t04_s07_f03", "c01_t04_s07_f04", "c01_t04_s07_f03", "c01_t04_s07_f02",]],
        [ 72, ["c01_t04_s08_f01", "c01_t04_s08_f02", "c01_t04_s08_f03", "c01_t04_s08_f04", "c01_t04_s08_f03", "c01_t04_s08_f02",]],
        [ 73, ["c01_t04_s09_f01", "c01_t04_s09_f02", "c01_t04_s09_f03", "c01_t04_s09_f04", "c01_t04_s09_f03", "c01_t04_s09_f02",]],
        [ 74, ["c01_t04_s10_f01", "c01_t04_s10_f02", "c01_t04_s10_f03", "c01_t04_s10_f04", "c01_t04_s10_f03", "c01_t04_s10_f02",]],
        [ 75, ["c01_t04_s11_f01", "c01_t04_s11_f02", "c01_t04_s11_f03", "c01_t04_s11_f04", "c01_t04_s11_f03", "c01_t04_s11_f02",]],
        [ 76, ["c01_t04_s12_f01", "c01_t04_s12_f02", "c01_t04_s12_f03", "c01_t04_s12_f04", "c01_t04_s12_f03", "c01_t04_s12_f02",]],
        [ 77, ["c01_t04_s13_f01", "c01_t04_s13_f02", "c01_t04_s13_f03", "c01_t04_s13_f04", "c01_t04_s13_f03", "c01_t04_s13_f02",]],
        [ 78, ["c01_t04_s14_f01", "c01_t04_s14_f02", "c01_t04_s14_f03", "c01_t04_s14_f04", "c01_t04_s14_f03", "c01_t04_s14_f02",]],
        [ 79, ["c01_t04_s15_f01", "c01_t04_s15_f02", "c01_t04_s15_f03", "c01_t04_s15_f04", "c01_t04_s15_f03", "c01_t04_s15_f02",]],
        [ 80, ["c01_t04_s16_f01", "c01_t04_s16_f02", "c01_t04_s16_f03", "c01_t04_s16_f04", "c01_t04_s16_f03", "c01_t04_s16_f02",]],
        [ 81, ["c01_t04_s17_f01", "c01_t04_s17_f02", "c01_t04_s17_f03", "c01_t04_s17_f04", "c01_t04_s17_f03", "c01_t04_s17_f02",]],
        [ 82, ["c01_t04_s18_f01", "c01_t04_s18_f02", "c01_t04_s18_f03", "c01_t04_s18_f04", "c01_t04_s18_f03", "c01_t04_s18_f02",]],
        [ 83, ["c01_t04_s19_f01", "c01_t04_s19_f02", "c01_t04_s19_f03", "c01_t04_s19_f04", "c01_t04_s19_f03", "c01_t04_s19_f02",]],
        [ 84, ["c01_t04_s20_f01", "c01_t04_s20_f02", "c01_t04_s20_f03", "c01_t04_s20_f04", "c01_t04_s20_f03", "c01_t04_s20_f02",]],
        [ 85, ["c01_t04_s21_f01", "c01_t04_s21_f02", "c01_t04_s21_f03", "c01_t04_s21_f04", "c01_t04_s21_f03", "c01_t04_s21_f02",]],
        [ 86, ["c01_t04_s22_f01", "c01_t04_s22_f02", "c01_t04_s22_f03", "c01_t04_s22_f04", "c01_t04_s22_f03", "c01_t04_s22_f02",]],
        [ 87, ["c01_t04_s23_f01", "c01_t04_s23_f02", "c01_t04_s23_f03", "c01_t04_s23_f04", "c01_t04_s23_f03", "c01_t04_s23_f02",]],
        [ 88, ["c01_t04_s24_f01", "c01_t04_s24_f02", "c01_t04_s24_f03", "c01_t04_s24_f04", "c01_t04_s24_f03", "c01_t04_s24_f02",]],
        [ 89, ["c01_t04_s25_f01", "c01_t04_s25_f02", "c01_t04_s25_f03", "c01_t04_s25_f04", "c01_t04_s25_f03", "c01_t04_s25_f02",]],
        [ 90, ["c01_t04_s26_f01", "c01_t04_s26_f02", "c01_t04_s26_f03", "c01_t04_s26_f04", "c01_t04_s26_f03", "c01_t04_s26_f02",]],
        [ 91, ["c01_t04_s27_f01", "c01_t04_s27_f02", "c01_t04_s27_f03", "c01_t04_s27_f04", "c01_t04_s27_f03", "c01_t04_s27_f02",]],
        [ 92, ["c01_t04_s28_f01", "c01_t04_s28_f02", "c01_t04_s28_f03", "c01_t04_s28_f04", "c01_t04_s28_f03", "c01_t04_s28_f02",]],
        [ 93, ["c01_t04_s29_f01", "c01_t04_s29_f02", "c01_t04_s29_f03", "c01_t04_s29_f04", "c01_t04_s29_f03", "c01_t04_s29_f02",]],
        [ 94, ["c01_t04_s30_f01", "c01_t04_s30_f02", "c01_t04_s30_f03", "c01_t04_s30_f04", "c01_t04_s30_f03", "c01_t04_s30_f02",]],
        [ 95, ["c01_t04_s31_f01", "c01_t04_s31_f02", "c01_t04_s31_f03", "c01_t04_s31_f04", "c01_t04_s31_f03", "c01_t04_s31_f02",]],
        [ 96, ["c01_t04_s32_f01", "c01_t04_s32_f02", "c01_t04_s32_f03", "c01_t04_s32_f04", "c01_t04_s32_f03", "c01_t04_s32_f02",]],
        [ 97, ["c01_t04_s33_f01", "c01_t04_s33_f02", "c01_t04_s33_f03", "c01_t04_s33_f04", "c01_t04_s33_f03", "c01_t04_s33_f02",]],
        [ 98, ["c01_t04_s34_f01", "c01_t04_s34_f02", "c01_t04_s34_f03", "c01_t04_s34_f04", "c01_t04_s34_f03", "c01_t04_s34_f02",]],
        [ 99, ["c01_t04_s35_f01", "c01_t04_s35_f02", "c01_t04_s35_f03", "c01_t04_s35_f04", "c01_t04_s35_f03", "c01_t04_s35_f02",]],
        [100, ["c01_t04_s36_f01", "c01_t04_s36_f02", "c01_t04_s36_f03", "c01_t04_s36_f04", "c01_t04_s36_f03", "c01_t04_s36_f02",]],
    ]);

    const _TILE_OBJECT_IMAGE_SOURCES = new Map<number, string[]>([
        [  0, []],

        ////////// road * 11 //////////
        [  1, ["c02_t001_s01_f01",]],
        [  2, ["c02_t001_s02_f01",]],
        [  3, ["c02_t001_s03_f01",]],
        [  4, ["c02_t001_s04_f01",]],
        [  5, ["c02_t001_s05_f01",]],
        [  6, ["c02_t001_s06_f01",]],
        [  7, ["c02_t001_s07_f01",]],
        [  8, ["c02_t001_s08_f01",]],
        [  9, ["c02_t001_s09_f01",]],
        [ 10, ["c02_t001_s10_f01",]],
        [ 11, ["c02_t001_s11_f01",]],

        ////////// bridge * 11 //////////
        [ 12, ["c02_t002_s01_f01",]],
        [ 13, ["c02_t002_s02_f01",]],
        [ 14, ["c02_t002_s03_f01",]],
        [ 15, ["c02_t002_s04_f01",]],
        [ 16, ["c02_t002_s05_f01",]],
        [ 17, ["c02_t002_s06_f01",]],
        [ 18, ["c02_t002_s07_f01",]],
        [ 19, ["c02_t002_s08_f01",]],
        [ 20, ["c02_t002_s09_f01",]],
        [ 21, ["c02_t002_s10_f01",]],
        [ 22, ["c02_t002_s11_f01",]],

        ////////// wood * 1 //////////
        [ 23, ["c02_t003_s01_f01",]],

        ////////// mountain * 1 //////////
        [ 24, ["c02_t004_s01_f01",]],

        ////////// wasteland * 1 //////////
        [ 25, ["c02_t005_s01_f01",]],

        ////////// ruin * 1 //////////
        [ 26, ["c02_t006_s01_f01",]],

        ////////// fire * 1 //////////
        [ 27, ["c02_t007_s01_f01", "c02_t007_s01_f02", "c02_t007_s01_f03", "c02_t007_s01_f04", "c02_t007_s01_f05",]],

        ////////// rough * 1 //////////
        [ 28, ["c02_t008_s01_f01", "c02_t008_s01_f02", "c02_t008_s01_f03", "c02_t008_s01_f04", "c02_t008_s01_f03", "c02_t008_s01_f02",]],

        ////////// mist * 1 //////////
        [ 29, ["c02_t009_s01_f01",]],

        ////////// reef * 1 //////////
        [ 30, ["c02_t010_s01_f01", "c02_t010_s01_f02", "c02_t010_s01_f03", "c02_t010_s01_f04", "c02_t010_s01_f03", "c02_t010_s01_f02",]],

        ////////// plasma * 16 //////////
        [ 31, ["c02_t011_s01_f01", "c02_t011_s01_f02", "c02_t011_s01_f03",]],
        [ 32, ["c02_t011_s02_f01", "c02_t011_s02_f02", "c02_t011_s02_f03",]],
        [ 33, ["c02_t011_s03_f01", "c02_t011_s03_f02", "c02_t011_s03_f03",]],
        [ 34, ["c02_t011_s04_f01", "c02_t011_s04_f02", "c02_t011_s04_f03",]],
        [ 35, ["c02_t011_s05_f01", "c02_t011_s05_f02", "c02_t011_s05_f03",]],
        [ 36, ["c02_t011_s06_f01", "c02_t011_s06_f02", "c02_t011_s06_f03",]],
        [ 37, ["c02_t011_s07_f01", "c02_t011_s07_f02", "c02_t011_s07_f03",]],
        [ 38, ["c02_t011_s08_f01", "c02_t011_s08_f02", "c02_t011_s08_f03",]],
        [ 39, ["c02_t011_s09_f01", "c02_t011_s09_f02", "c02_t011_s09_f03",]],
        [ 40, ["c02_t011_s10_f01", "c02_t011_s10_f02", "c02_t011_s10_f03",]],
        [ 41, ["c02_t011_s11_f01", "c02_t011_s11_f02", "c02_t011_s11_f03",]],
        [ 42, ["c02_t011_s12_f01", "c02_t011_s12_f02", "c02_t011_s12_f03",]],
        [ 43, ["c02_t011_s13_f01", "c02_t011_s13_f02", "c02_t011_s13_f03",]],
        [ 44, ["c02_t011_s14_f01", "c02_t011_s14_f02", "c02_t011_s14_f03",]],
        [ 45, ["c02_t011_s15_f01", "c02_t011_s15_f02", "c02_t011_s15_f03",]],
        [ 46, ["c02_t011_s16_f01", "c02_t011_s16_f02", "c02_t011_s16_f03",]],

        ////////// meteor * 1 //////////
        [ 47, ["c02_t012_s01_f01",]],

        ////////// silo * 1 //////////
        [ 48, ["c02_t013_s01_f01",]],

        ////////// emptysilo * 1 //////////
        [ 49, ["c02_t014_s01_f01",]],

        ////////// headquaters * 4 //////////
        [ 50, ["c02_t015_s01_f01", "c02_t015_s01_f02",]],
        [ 51, ["c02_t015_s02_f01", "c02_t015_s02_f02",]],
        [ 52, ["c02_t015_s03_f01", "c02_t015_s03_f02",]],
        [ 53, ["c02_t015_s04_f01", "c02_t015_s04_f02",]],

        ////////// city * 5 //////////
        [ 54, ["c02_t016_s01_f01", "c02_t016_s01_f02",]],
        [ 55, ["c02_t016_s02_f01", "c02_t016_s02_f02",]],
        [ 56, ["c02_t016_s03_f01", "c02_t016_s03_f02",]],
        [ 57, ["c02_t016_s04_f01", "c02_t016_s04_f02",]],
        [ 58, ["c02_t016_s05_f01", "c02_t016_s05_f02",]],

        ////////// commandtower * 5 //////////
        [ 59, ["c02_t017_s01_f01", "c02_t017_s01_f02",]],
        [ 60, ["c02_t017_s02_f01", "c02_t017_s02_f02",]],
        [ 61, ["c02_t017_s03_f01", "c02_t017_s03_f02",]],
        [ 62, ["c02_t017_s04_f01", "c02_t017_s04_f02",]],
        [ 63, ["c02_t017_s05_f01", "c02_t017_s05_f02",]],

        ////////// radar * 5 //////////
        [ 64, ["c02_t018_s01_f01", "c02_t018_s01_f02",]],
        [ 65, ["c02_t018_s02_f01", "c02_t018_s02_f02",]],
        [ 66, ["c02_t018_s03_f01", "c02_t018_s03_f02",]],
        [ 67, ["c02_t018_s04_f01", "c02_t018_s04_f02",]],
        [ 68, ["c02_t018_s05_f01", "c02_t018_s05_f02",]],

        ////////// factory * 5 //////////
        [ 69, ["c02_t019_s01_f01", "c02_t019_s01_f02",]],
        [ 70, ["c02_t019_s02_f01", "c02_t019_s02_f02",]],
        [ 71, ["c02_t019_s03_f01", "c02_t019_s03_f02",]],
        [ 72, ["c02_t019_s04_f01", "c02_t019_s04_f02",]],
        [ 73, ["c02_t019_s05_f01", "c02_t019_s05_f02",]],

        ////////// airport * 5 //////////
        [ 74, ["c02_t020_s01_f01", "c02_t020_s01_f02",]],
        [ 75, ["c02_t020_s02_f01", "c02_t020_s02_f02",]],
        [ 76, ["c02_t020_s03_f01", "c02_t020_s03_f02",]],
        [ 77, ["c02_t020_s04_f01", "c02_t020_s04_f02",]],
        [ 78, ["c02_t020_s05_f01", "c02_t020_s05_f02",]],

        ////////// seaport * 5 //////////
        [ 79, ["c02_t021_s01_f01", "c02_t021_s01_f02",]],
        [ 80, ["c02_t021_s02_f01", "c02_t021_s02_f02",]],
        [ 81, ["c02_t021_s03_f01", "c02_t021_s03_f02",]],
        [ 82, ["c02_t021_s04_f01", "c02_t021_s04_f02",]],
        [ 83, ["c02_t021_s05_f01", "c02_t021_s05_f02",]],

        ////////// tempairport * 5 //////////
        [ 84, ["c02_t022_s01_f01",]],
        [ 85, ["c02_t022_s02_f01",]],
        [ 86, ["c02_t022_s03_f01",]],
        [ 87, ["c02_t022_s04_f01",]],
        [ 88, ["c02_t022_s05_f01",]],

        ////////// tempseaport * 5 //////////
        [ 89, ["c02_t023_s01_f01",]],
        [ 90, ["c02_t023_s02_f01",]],
        [ 91, ["c02_t023_s03_f01",]],
        [ 92, ["c02_t023_s04_f01",]],
        [ 93, ["c02_t023_s05_f01",]],

        ////////// greenplasma * 16 //////////
        [ 94, ["c02_t024_s01_f01", "c02_t024_s01_f02", "c02_t024_s01_f03",]],
        [ 95, ["c02_t024_s02_f01", "c02_t024_s02_f02", "c02_t024_s02_f03",]],
        [ 96, ["c02_t024_s03_f01", "c02_t024_s03_f02", "c02_t024_s03_f03",]],
        [ 97, ["c02_t024_s04_f01", "c02_t024_s04_f02", "c02_t024_s04_f03",]],
        [ 98, ["c02_t024_s05_f01", "c02_t024_s05_f02", "c02_t024_s05_f03",]],
        [ 99, ["c02_t024_s06_f01", "c02_t024_s06_f02", "c02_t024_s06_f03",]],
        [100, ["c02_t024_s07_f01", "c02_t024_s07_f02", "c02_t024_s07_f03",]],
        [101, ["c02_t024_s08_f01", "c02_t024_s08_f02", "c02_t024_s08_f03",]],
        [102, ["c02_t024_s09_f01", "c02_t024_s09_f02", "c02_t024_s09_f03",]],
        [103, ["c02_t024_s10_f01", "c02_t024_s10_f02", "c02_t024_s10_f03",]],
        [104, ["c02_t024_s11_f01", "c02_t024_s11_f02", "c02_t024_s11_f03",]],
        [105, ["c02_t024_s12_f01", "c02_t024_s12_f02", "c02_t024_s12_f03",]],
        [106, ["c02_t024_s13_f01", "c02_t024_s13_f02", "c02_t024_s13_f03",]],
        [107, ["c02_t024_s14_f01", "c02_t024_s14_f02", "c02_t024_s14_f03",]],
        [108, ["c02_t024_s15_f01", "c02_t024_s15_f02", "c02_t024_s15_f03",]],
        [109, ["c02_t024_s16_f01", "c02_t024_s16_f02", "c02_t024_s16_f03",]],
    ]);

    const _TILE_BASE_TYPES = new Map<number, TileBaseType>([
        ////////// empty: 0 (1 total) //////////
        [  0, TileBaseType.Empty],

        ////////// plain: 1 (1 total) //////////
        [  1, TileBaseType.Plain],

        ////////// river: 2 - 17 (16 total) //////////
        [  2, TileBaseType.River],
        [  3, TileBaseType.River],
        [  4, TileBaseType.River],
        [  5, TileBaseType.River],
        [  6, TileBaseType.River],
        [  7, TileBaseType.River],
        [  8, TileBaseType.River],
        [  9, TileBaseType.River],
        [ 10, TileBaseType.River],
        [ 11, TileBaseType.River],
        [ 12, TileBaseType.River],
        [ 13, TileBaseType.River],
        [ 14, TileBaseType.River],
        [ 15, TileBaseType.River],
        [ 16, TileBaseType.River],
        [ 17, TileBaseType.River],

        ////////// sea: 18 - 64 (47 total) //////////
        [ 18, TileBaseType.Sea],
        [ 19, TileBaseType.Sea],
        [ 20, TileBaseType.Sea],
        [ 21, TileBaseType.Sea],
        [ 22, TileBaseType.Sea],
        [ 23, TileBaseType.Sea],
        [ 24, TileBaseType.Sea],
        [ 25, TileBaseType.Sea],
        [ 26, TileBaseType.Sea],
        [ 27, TileBaseType.Sea],
        [ 28, TileBaseType.Sea],
        [ 29, TileBaseType.Sea],
        [ 30, TileBaseType.Sea],
        [ 31, TileBaseType.Sea],
        [ 32, TileBaseType.Sea],
        [ 33, TileBaseType.Sea],
        [ 34, TileBaseType.Sea],
        [ 35, TileBaseType.Sea],
        [ 36, TileBaseType.Sea],
        [ 37, TileBaseType.Sea],
        [ 38, TileBaseType.Sea],
        [ 39, TileBaseType.Sea],
        [ 40, TileBaseType.Sea],
        [ 41, TileBaseType.Sea],
        [ 42, TileBaseType.Sea],
        [ 43, TileBaseType.Sea],
        [ 44, TileBaseType.Sea],
        [ 45, TileBaseType.Sea],
        [ 46, TileBaseType.Sea],
        [ 47, TileBaseType.Sea],
        [ 48, TileBaseType.Sea],
        [ 49, TileBaseType.Sea],
        [ 50, TileBaseType.Sea],
        [ 51, TileBaseType.Sea],
        [ 52, TileBaseType.Sea],
        [ 53, TileBaseType.Sea],
        [ 54, TileBaseType.Sea],
        [ 55, TileBaseType.Sea],
        [ 56, TileBaseType.Sea],
        [ 57, TileBaseType.Sea],
        [ 58, TileBaseType.Sea],
        [ 59, TileBaseType.Sea],
        [ 60, TileBaseType.Sea],
        [ 61, TileBaseType.Sea],
        [ 62, TileBaseType.Sea],
        [ 63, TileBaseType.Sea],
        [ 64, TileBaseType.Sea],

        ////////// beach: 65 - 100 (36 total) //////////
        [ 65, TileBaseType.Beach],
        [ 66, TileBaseType.Beach],
        [ 67, TileBaseType.Beach],
        [ 68, TileBaseType.Beach],
        [ 69, TileBaseType.Beach],
        [ 70, TileBaseType.Beach],
        [ 71, TileBaseType.Beach],
        [ 72, TileBaseType.Beach],
        [ 73, TileBaseType.Beach],
        [ 74, TileBaseType.Beach],
        [ 75, TileBaseType.Beach],
        [ 76, TileBaseType.Beach],
        [ 77, TileBaseType.Beach],
        [ 78, TileBaseType.Beach],
        [ 79, TileBaseType.Beach],
        [ 80, TileBaseType.Beach],
        [ 81, TileBaseType.Beach],
        [ 82, TileBaseType.Beach],
        [ 83, TileBaseType.Beach],
        [ 84, TileBaseType.Beach],
        [ 85, TileBaseType.Beach],
        [ 86, TileBaseType.Beach],
        [ 87, TileBaseType.Beach],
        [ 88, TileBaseType.Beach],
        [ 89, TileBaseType.Beach],
        [ 90, TileBaseType.Beach],
        [ 91, TileBaseType.Beach],
        [ 92, TileBaseType.Beach],
        [ 93, TileBaseType.Beach],
        [ 94, TileBaseType.Beach],
        [ 95, TileBaseType.Beach],
        [ 96, TileBaseType.Beach],
        [ 97, TileBaseType.Beach],
        [ 98, TileBaseType.Beach],
        [ 99, TileBaseType.Beach],
        [100, TileBaseType.Beach],
    ]);

    const _TILE_OBJECT_TYPES_AND_PLAYER_INDEX = new Map<number, TileObjectTypeAndPlayerIndex>([
        ////////// empty //////////
        [  0, { tileObjectType: TileObjectType.Empty, playerIndex: 0 }],

        ////////// road //////////
        [  1, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  2, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  3, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  4, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  5, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  6, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  7, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  8, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [  9, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [ 10, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],
        [ 11, { tileObjectType: TileObjectType.Road, playerIndex: 0 }],

        ////////// bridge //////////
        [ 12, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 13, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 14, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 15, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 16, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 17, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 18, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 19, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 20, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 21, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],
        [ 22, { tileObjectType: TileObjectType.Bridge, playerIndex: 0 }],

        ////////// wood //////////
        [ 23, { tileObjectType: TileObjectType.Wood, playerIndex: 0 }],

        ////////// mountain //////////
        [ 24, { tileObjectType: TileObjectType.Mountain, playerIndex: 0 }],

        ////////// wasteland //////////
        [ 25, { tileObjectType: TileObjectType.Wasteland, playerIndex: 0 }],

        ////////// ruins //////////
        [ 26, { tileObjectType: TileObjectType.Ruins, playerIndex: 0 }],

        ////////// fire //////////
        [ 27, { tileObjectType: TileObjectType.Fire, playerIndex: 0 }],

        ////////// rough //////////
        [ 28, { tileObjectType: TileObjectType.Rough, playerIndex: 0 }],

        ////////// mist //////////
        [ 29, { tileObjectType: TileObjectType.Mist, playerIndex: 0 }],

        ////////// reef //////////
        [ 30, { tileObjectType: TileObjectType.Reef, playerIndex: 0 }],

        ////////// plasma //////////
        [ 31, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 32, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 33, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 34, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 35, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 36, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 37, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 38, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 39, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 40, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 41, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 42, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 43, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 44, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 45, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],
        [ 46, { tileObjectType: TileObjectType.Plasma, playerIndex: 0 }],

        ////////// meteor //////////
        [ 47, { tileObjectType: TileObjectType.Meteor, playerIndex: 0 }],

        ////////// silo //////////
        [ 48, { tileObjectType: TileObjectType.Silo, playerIndex: 0 }],

        ////////// emptysilo //////////
        [ 49, { tileObjectType: TileObjectType.EmptySilo, playerIndex: 0 }],

        ////////// headquaters //////////
        [ 50, { tileObjectType: TileObjectType.Headquarters, playerIndex: 1 }],
        [ 51, { tileObjectType: TileObjectType.Headquarters, playerIndex: 2 }],
        [ 52, { tileObjectType: TileObjectType.Headquarters, playerIndex: 3 }],
        [ 53, { tileObjectType: TileObjectType.Headquarters, playerIndex: 4 }],

        ////////// city //////////
        [ 54, { tileObjectType: TileObjectType.City, playerIndex: 0 }],
        [ 55, { tileObjectType: TileObjectType.City, playerIndex: 1 }],
        [ 56, { tileObjectType: TileObjectType.City, playerIndex: 2 }],
        [ 57, { tileObjectType: TileObjectType.City, playerIndex: 3 }],
        [ 58, { tileObjectType: TileObjectType.City, playerIndex: 4 }],

        ////////// commandtower //////////
        [ 59, { tileObjectType: TileObjectType.CommandTower, playerIndex: 0 }],
        [ 60, { tileObjectType: TileObjectType.CommandTower, playerIndex: 1 }],
        [ 61, { tileObjectType: TileObjectType.CommandTower, playerIndex: 2 }],
        [ 62, { tileObjectType: TileObjectType.CommandTower, playerIndex: 3 }],
        [ 63, { tileObjectType: TileObjectType.CommandTower, playerIndex: 4 }],

        ////////// radar //////////
        [ 64, { tileObjectType: TileObjectType.Radar, playerIndex: 0 }],
        [ 65, { tileObjectType: TileObjectType.Radar, playerIndex: 1 }],
        [ 66, { tileObjectType: TileObjectType.Radar, playerIndex: 2 }],
        [ 67, { tileObjectType: TileObjectType.Radar, playerIndex: 3 }],
        [ 68, { tileObjectType: TileObjectType.Radar, playerIndex: 4 }],

        ////////// factory //////////
        [ 69, { tileObjectType: TileObjectType.Factory, playerIndex: 0 }],
        [ 70, { tileObjectType: TileObjectType.Factory, playerIndex: 1 }],
        [ 71, { tileObjectType: TileObjectType.Factory, playerIndex: 2 }],
        [ 72, { tileObjectType: TileObjectType.Factory, playerIndex: 3 }],
        [ 73, { tileObjectType: TileObjectType.Factory, playerIndex: 4 }],

        ////////// airport //////////
        [ 74, { tileObjectType: TileObjectType.Airport, playerIndex: 0 }],
        [ 75, { tileObjectType: TileObjectType.Airport, playerIndex: 1 }],
        [ 76, { tileObjectType: TileObjectType.Airport, playerIndex: 2 }],
        [ 77, { tileObjectType: TileObjectType.Airport, playerIndex: 3 }],
        [ 78, { tileObjectType: TileObjectType.Airport, playerIndex: 4 }],

        ////////// seaport //////////
        [ 79, { tileObjectType: TileObjectType.Seaport, playerIndex: 0 }],
        [ 80, { tileObjectType: TileObjectType.Seaport, playerIndex: 1 }],
        [ 81, { tileObjectType: TileObjectType.Seaport, playerIndex: 2 }],
        [ 82, { tileObjectType: TileObjectType.Seaport, playerIndex: 3 }],
        [ 83, { tileObjectType: TileObjectType.Seaport, playerIndex: 4 }],

        ////////// tempairport //////////
        [ 84, { tileObjectType: TileObjectType.TempAirport, playerIndex: 0 }],
        [ 85, { tileObjectType: TileObjectType.TempAirport, playerIndex: 1 }],
        [ 86, { tileObjectType: TileObjectType.TempAirport, playerIndex: 2 }],
        [ 87, { tileObjectType: TileObjectType.TempAirport, playerIndex: 3 }],
        [ 88, { tileObjectType: TileObjectType.TempAirport, playerIndex: 4 }],

        ////////// tempseaport //////////
        [ 89, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 0 }],
        [ 90, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 1 }],
        [ 91, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 2 }],
        [ 92, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 3 }],
        [ 93, { tileObjectType: TileObjectType.TempSeaport, playerIndex: 4 }],

        ////////// greenplasma //////////
        [ 94, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [ 95, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [ 96, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [ 97, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [ 98, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [ 99, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [100, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [101, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [102, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [103, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [104, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [105, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [106, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [107, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [108, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
        [109, { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 }],
    ]);

    const _UNIT_TYPES_AND_PLAYER_INDEX = new Map<number, UnitTypeAndPlayerIndex>([
        ////////// infantry //////////
        [  1, { unitType: UnitType.Infantry, playerIndex: 1 }],
        [  2, { unitType: UnitType.Infantry, playerIndex: 2 }],
        [  3, { unitType: UnitType.Infantry, playerIndex: 3 }],
        [  4, { unitType: UnitType.Infantry, playerIndex: 4 }],

        ////////// mech //////////
        [  5, { unitType: UnitType.Mech, playerIndex: 1 }],
        [  6, { unitType: UnitType.Mech, playerIndex: 2 }],
        [  7, { unitType: UnitType.Mech, playerIndex: 3 }],
        [  8, { unitType: UnitType.Mech, playerIndex: 4 }],

        ////////// bike //////////
        [  9, { unitType: UnitType.Bike, playerIndex: 1 }],
        [ 10, { unitType: UnitType.Bike, playerIndex: 2 }],
        [ 11, { unitType: UnitType.Bike, playerIndex: 3 }],
        [ 12, { unitType: UnitType.Bike, playerIndex: 4 }],

        ////////// recon //////////
        [ 13, { unitType: UnitType.Recon, playerIndex: 1 }],
        [ 14, { unitType: UnitType.Recon, playerIndex: 2 }],
        [ 15, { unitType: UnitType.Recon, playerIndex: 3 }],
        [ 16, { unitType: UnitType.Recon, playerIndex: 4 }],

        ////////// flare //////////
        [ 17, { unitType: UnitType.Flare, playerIndex: 1 }],
        [ 18, { unitType: UnitType.Flare, playerIndex: 2 }],
        [ 19, { unitType: UnitType.Flare, playerIndex: 3 }],
        [ 20, { unitType: UnitType.Flare, playerIndex: 4 }],

        ////////// antiair //////////
        [ 21, { unitType: UnitType.AntiAir, playerIndex: 1 }],
        [ 22, { unitType: UnitType.AntiAir, playerIndex: 2 }],
        [ 23, { unitType: UnitType.AntiAir, playerIndex: 3 }],
        [ 24, { unitType: UnitType.AntiAir, playerIndex: 4 }],

        ////////// tank //////////
        [ 25, { unitType: UnitType.Tank, playerIndex: 1 }],
        [ 26, { unitType: UnitType.Tank, playerIndex: 2 }],
        [ 27, { unitType: UnitType.Tank, playerIndex: 3 }],
        [ 28, { unitType: UnitType.Tank, playerIndex: 4 }],

        ////////// mediumtank //////////
        [ 29, { unitType: UnitType.MediumTank, playerIndex: 1 }],
        [ 30, { unitType: UnitType.MediumTank, playerIndex: 2 }],
        [ 31, { unitType: UnitType.MediumTank, playerIndex: 3 }],
        [ 32, { unitType: UnitType.MediumTank, playerIndex: 4 }],

        ////////// wartank //////////
        [ 33, { unitType: UnitType.WarTank, playerIndex: 1 }],
        [ 34, { unitType: UnitType.WarTank, playerIndex: 2 }],
        [ 35, { unitType: UnitType.WarTank, playerIndex: 3 }],
        [ 36, { unitType: UnitType.WarTank, playerIndex: 4 }],

        ////////// artillery //////////
        [ 37, { unitType: UnitType.Artillery, playerIndex: 1 }],
        [ 38, { unitType: UnitType.Artillery, playerIndex: 2 }],
        [ 39, { unitType: UnitType.Artillery, playerIndex: 3 }],
        [ 40, { unitType: UnitType.Artillery, playerIndex: 4 }],

        ////////// antitank //////////
        [ 41, { unitType: UnitType.AntiTank, playerIndex: 1 }],
        [ 42, { unitType: UnitType.AntiTank, playerIndex: 2 }],
        [ 43, { unitType: UnitType.AntiTank, playerIndex: 3 }],
        [ 44, { unitType: UnitType.AntiTank, playerIndex: 4 }],

        ////////// rockets //////////
        [ 45, { unitType: UnitType.Rockets, playerIndex: 1 }],
        [ 46, { unitType: UnitType.Rockets, playerIndex: 2 }],
        [ 47, { unitType: UnitType.Rockets, playerIndex: 3 }],
        [ 48, { unitType: UnitType.Rockets, playerIndex: 4 }],

        ////////// missiles //////////
        [ 49, { unitType: UnitType.Missiles, playerIndex: 1 }],
        [ 50, { unitType: UnitType.Missiles, playerIndex: 2 }],
        [ 51, { unitType: UnitType.Missiles, playerIndex: 3 }],
        [ 52, { unitType: UnitType.Missiles, playerIndex: 4 }],

        ////////// rig //////////
        [ 53, { unitType: UnitType.Rig, playerIndex: 1 }],
        [ 54, { unitType: UnitType.Rig, playerIndex: 2 }],
        [ 55, { unitType: UnitType.Rig, playerIndex: 3 }],
        [ 56, { unitType: UnitType.Rig, playerIndex: 4 }],

        ////////// fighter //////////
        [ 57, { unitType: UnitType.Fighter, playerIndex: 1 }],
        [ 58, { unitType: UnitType.Fighter, playerIndex: 2 }],
        [ 59, { unitType: UnitType.Fighter, playerIndex: 3 }],
        [ 60, { unitType: UnitType.Fighter, playerIndex: 4 }],

        ////////// bomber //////////
        [ 61, { unitType: UnitType.Bomber, playerIndex: 1 }],
        [ 62, { unitType: UnitType.Bomber, playerIndex: 2 }],
        [ 63, { unitType: UnitType.Bomber, playerIndex: 3 }],
        [ 64, { unitType: UnitType.Bomber, playerIndex: 4 }],

        ////////// duster //////////
        [ 65, { unitType: UnitType.Duster, playerIndex: 1 }],
        [ 66, { unitType: UnitType.Duster, playerIndex: 2 }],
        [ 67, { unitType: UnitType.Duster, playerIndex: 3 }],
        [ 68, { unitType: UnitType.Duster, playerIndex: 4 }],

        ////////// battlecopter //////////
        [ 69, { unitType: UnitType.BattleCopter, playerIndex: 1 }],
        [ 70, { unitType: UnitType.BattleCopter, playerIndex: 2 }],
        [ 71, { unitType: UnitType.BattleCopter, playerIndex: 3 }],
        [ 72, { unitType: UnitType.BattleCopter, playerIndex: 4 }],

        ////////// transportcopter //////////
        [ 73, { unitType: UnitType.TransportCopter, playerIndex: 1 }],
        [ 74, { unitType: UnitType.TransportCopter, playerIndex: 2 }],
        [ 75, { unitType: UnitType.TransportCopter, playerIndex: 3 }],
        [ 76, { unitType: UnitType.TransportCopter, playerIndex: 4 }],

        ////////// seaplane //////////
        [ 77, { unitType: UnitType.Seaplane, playerIndex: 1 }],
        [ 78, { unitType: UnitType.Seaplane, playerIndex: 2 }],
        [ 79, { unitType: UnitType.Seaplane, playerIndex: 3 }],
        [ 80, { unitType: UnitType.Seaplane, playerIndex: 4 }],

        ////////// battleship //////////
        [ 81, { unitType: UnitType.Battleship, playerIndex: 1 }],
        [ 82, { unitType: UnitType.Battleship, playerIndex: 2 }],
        [ 83, { unitType: UnitType.Battleship, playerIndex: 3 }],
        [ 84, { unitType: UnitType.Battleship, playerIndex: 4 }],

        ////////// carrier //////////
        [ 85, { unitType: UnitType.Carrier, playerIndex: 1 }],
        [ 86, { unitType: UnitType.Carrier, playerIndex: 2 }],
        [ 87, { unitType: UnitType.Carrier, playerIndex: 3 }],
        [ 88, { unitType: UnitType.Carrier, playerIndex: 4 }],

        ////////// submarine //////////
        [ 89, { unitType: UnitType.Submarine, playerIndex: 1 }],
        [ 90, { unitType: UnitType.Submarine, playerIndex: 2 }],
        [ 91, { unitType: UnitType.Submarine, playerIndex: 3 }],
        [ 92, { unitType: UnitType.Submarine, playerIndex: 4 }],

        ////////// cruiser //////////
        [ 93, { unitType: UnitType.Cruiser, playerIndex: 1 }],
        [ 94, { unitType: UnitType.Cruiser, playerIndex: 2 }],
        [ 95, { unitType: UnitType.Cruiser, playerIndex: 3 }],
        [ 96, { unitType: UnitType.Cruiser, playerIndex: 4 }],

        ////////// lander //////////
        [ 97, { unitType: UnitType.Lander, playerIndex: 1 }],
        [ 98, { unitType: UnitType.Lander, playerIndex: 2 }],
        [ 99, { unitType: UnitType.Lander, playerIndex: 3 }],
        [100, { unitType: UnitType.Lander, playerIndex: 4 }],

        ////////// gunboat //////////
        [101, { unitType: UnitType.Gunboat, playerIndex: 1 }],
        [102, { unitType: UnitType.Gunboat, playerIndex: 2 }],
        [103, { unitType: UnitType.Gunboat, playerIndex: 3 }],
        [104, { unitType: UnitType.Gunboat, playerIndex: 4 }],
    ]);

    const UNIT_IDLE_IMAGE_SOURCES = new Map<number, string[]>([
        ////////// infantry //////////
        [  1, ["c03_t01_s01_f01", "c03_t01_s01_f01", "c03_t01_s01_f02", "c03_t01_s01_f02", "c03_t01_s01_f03", "c03_t01_s01_f03", "c03_t01_s01_f04", "c03_t01_s01_f04",]],
        [  2, ["c03_t01_s02_f01", "c03_t01_s02_f01", "c03_t01_s02_f02", "c03_t01_s02_f02", "c03_t01_s02_f03", "c03_t01_s02_f03", "c03_t01_s02_f04", "c03_t01_s02_f04",]],
        [  3, ["c03_t01_s03_f01", "c03_t01_s03_f01", "c03_t01_s03_f02", "c03_t01_s03_f02", "c03_t01_s03_f03", "c03_t01_s03_f03", "c03_t01_s03_f04", "c03_t01_s03_f04",]],
        [  4, ["c03_t01_s04_f01", "c03_t01_s04_f01", "c03_t01_s04_f02", "c03_t01_s04_f02", "c03_t01_s04_f03", "c03_t01_s04_f03", "c03_t01_s04_f04", "c03_t01_s04_f04",]],

        ////////// mech //////////
        [  5, ["c03_t02_s01_f01", "c03_t02_s01_f01", "c03_t02_s01_f02", "c03_t02_s01_f02", "c03_t02_s01_f03", "c03_t02_s01_f03", "c03_t02_s01_f04", "c03_t02_s01_f04",]],
        [  6, ["c03_t02_s02_f01", "c03_t02_s02_f01", "c03_t02_s02_f02", "c03_t02_s02_f02", "c03_t02_s02_f03", "c03_t02_s02_f03", "c03_t02_s02_f04", "c03_t02_s02_f04",]],
        [  7, ["c03_t02_s03_f01", "c03_t02_s03_f01", "c03_t02_s03_f02", "c03_t02_s03_f02", "c03_t02_s03_f03", "c03_t02_s03_f03", "c03_t02_s03_f04", "c03_t02_s03_f04",]],
        [  8, ["c03_t02_s04_f01", "c03_t02_s04_f01", "c03_t02_s04_f02", "c03_t02_s04_f02", "c03_t02_s04_f03", "c03_t02_s04_f03", "c03_t02_s04_f04", "c03_t02_s04_f04",]],

        ////////// bike //////////
        [  9, ["c03_t03_s01_f01", "c03_t03_s01_f01", "c03_t03_s01_f02", "c03_t03_s01_f02", "c03_t03_s01_f03", "c03_t03_s01_f03", "c03_t03_s01_f04", "c03_t03_s01_f04",]],
        [ 10, ["c03_t03_s02_f01", "c03_t03_s02_f01", "c03_t03_s02_f02", "c03_t03_s02_f02", "c03_t03_s02_f03", "c03_t03_s02_f03", "c03_t03_s02_f04", "c03_t03_s02_f04",]],
        [ 11, ["c03_t03_s03_f01", "c03_t03_s03_f01", "c03_t03_s03_f02", "c03_t03_s03_f02", "c03_t03_s03_f03", "c03_t03_s03_f03", "c03_t03_s03_f04", "c03_t03_s03_f04",]],
        [ 12, ["c03_t03_s04_f01", "c03_t03_s04_f01", "c03_t03_s04_f02", "c03_t03_s04_f02", "c03_t03_s04_f03", "c03_t03_s04_f03", "c03_t03_s04_f04", "c03_t03_s04_f04",]],

        ////////// recon //////////
        [ 13, ["c03_t04_s01_f01", "c03_t04_s01_f01", "c03_t04_s01_f02", "c03_t04_s01_f02", "c03_t04_s01_f03", "c03_t04_s01_f03", "c03_t04_s01_f04", "c03_t04_s01_f04",]],
        [ 14, ["c03_t04_s02_f01", "c03_t04_s02_f01", "c03_t04_s02_f02", "c03_t04_s02_f02", "c03_t04_s02_f03", "c03_t04_s02_f03", "c03_t04_s02_f04", "c03_t04_s02_f04",]],
        [ 15, ["c03_t04_s03_f01", "c03_t04_s03_f01", "c03_t04_s03_f02", "c03_t04_s03_f02", "c03_t04_s03_f03", "c03_t04_s03_f03", "c03_t04_s03_f04", "c03_t04_s03_f04",]],
        [ 16, ["c03_t04_s04_f01", "c03_t04_s04_f01", "c03_t04_s04_f02", "c03_t04_s04_f02", "c03_t04_s04_f03", "c03_t04_s04_f03", "c03_t04_s04_f04", "c03_t04_s04_f04",]],

        ////////// flare //////////
        [ 17, ["c03_t05_s01_f01", "c03_t05_s01_f01", "c03_t05_s01_f02", "c03_t05_s01_f02", "c03_t05_s01_f03", "c03_t05_s01_f03", "c03_t05_s01_f04", "c03_t05_s01_f04",]],
        [ 18, ["c03_t05_s02_f01", "c03_t05_s02_f01", "c03_t05_s02_f02", "c03_t05_s02_f02", "c03_t05_s02_f03", "c03_t05_s02_f03", "c03_t05_s02_f04", "c03_t05_s02_f04",]],
        [ 19, ["c03_t05_s03_f01", "c03_t05_s03_f01", "c03_t05_s03_f02", "c03_t05_s03_f02", "c03_t05_s03_f03", "c03_t05_s03_f03", "c03_t05_s03_f04", "c03_t05_s03_f04",]],
        [ 20, ["c03_t05_s04_f01", "c03_t05_s04_f01", "c03_t05_s04_f02", "c03_t05_s04_f02", "c03_t05_s04_f03", "c03_t05_s04_f03", "c03_t05_s04_f04", "c03_t05_s04_f04",]],

        ////////// antiair //////////
        [ 21, ["c03_t06_s01_f01", "c03_t06_s01_f01", "c03_t06_s01_f02", "c03_t06_s01_f02", "c03_t06_s01_f03", "c03_t06_s01_f03", "c03_t06_s01_f04", "c03_t06_s01_f04",]],
        [ 22, ["c03_t06_s02_f01", "c03_t06_s02_f01", "c03_t06_s02_f02", "c03_t06_s02_f02", "c03_t06_s02_f03", "c03_t06_s02_f03", "c03_t06_s02_f04", "c03_t06_s02_f04",]],
        [ 23, ["c03_t06_s03_f01", "c03_t06_s03_f01", "c03_t06_s03_f02", "c03_t06_s03_f02", "c03_t06_s03_f03", "c03_t06_s03_f03", "c03_t06_s03_f04", "c03_t06_s03_f04",]],
        [ 24, ["c03_t06_s04_f01", "c03_t06_s04_f01", "c03_t06_s04_f02", "c03_t06_s04_f02", "c03_t06_s04_f03", "c03_t06_s04_f03", "c03_t06_s04_f04", "c03_t06_s04_f04",]],

        ////////// tank //////////
        [ 25, ["c03_t07_s01_f01", "c03_t07_s01_f01", "c03_t07_s01_f02", "c03_t07_s01_f02", "c03_t07_s01_f03", "c03_t07_s01_f03", "c03_t07_s01_f04", "c03_t07_s01_f04",]],
        [ 26, ["c03_t07_s02_f01", "c03_t07_s02_f01", "c03_t07_s02_f02", "c03_t07_s02_f02", "c03_t07_s02_f03", "c03_t07_s02_f03", "c03_t07_s02_f04", "c03_t07_s02_f04",]],
        [ 27, ["c03_t07_s03_f01", "c03_t07_s03_f01", "c03_t07_s03_f02", "c03_t07_s03_f02", "c03_t07_s03_f03", "c03_t07_s03_f03", "c03_t07_s03_f04", "c03_t07_s03_f04",]],
        [ 28, ["c03_t07_s04_f01", "c03_t07_s04_f01", "c03_t07_s04_f02", "c03_t07_s04_f02", "c03_t07_s04_f03", "c03_t07_s04_f03", "c03_t07_s04_f04", "c03_t07_s04_f04",]],

        ////////// mediumtank //////////
        [ 29, ["c03_t08_s01_f01", "c03_t08_s01_f01", "c03_t08_s01_f02", "c03_t08_s01_f02", "c03_t08_s01_f03", "c03_t08_s01_f03", "c03_t08_s01_f04", "c03_t08_s01_f04",]],
        [ 30, ["c03_t08_s02_f01", "c03_t08_s02_f01", "c03_t08_s02_f02", "c03_t08_s02_f02", "c03_t08_s02_f03", "c03_t08_s02_f03", "c03_t08_s02_f04", "c03_t08_s02_f04",]],
        [ 31, ["c03_t08_s03_f01", "c03_t08_s03_f01", "c03_t08_s03_f02", "c03_t08_s03_f02", "c03_t08_s03_f03", "c03_t08_s03_f03", "c03_t08_s03_f04", "c03_t08_s03_f04",]],
        [ 32, ["c03_t08_s04_f01", "c03_t08_s04_f01", "c03_t08_s04_f02", "c03_t08_s04_f02", "c03_t08_s04_f03", "c03_t08_s04_f03", "c03_t08_s04_f04", "c03_t08_s04_f04",]],

        ////////// wartank //////////
        [ 33, ["c03_t09_s01_f01", "c03_t09_s01_f01", "c03_t09_s01_f02", "c03_t09_s01_f02", "c03_t09_s01_f03", "c03_t09_s01_f03", "c03_t09_s01_f04", "c03_t09_s01_f04",]],
        [ 34, ["c03_t09_s02_f01", "c03_t09_s02_f01", "c03_t09_s02_f02", "c03_t09_s02_f02", "c03_t09_s02_f03", "c03_t09_s02_f03", "c03_t09_s02_f04", "c03_t09_s02_f04",]],
        [ 35, ["c03_t09_s03_f01", "c03_t09_s03_f01", "c03_t09_s03_f02", "c03_t09_s03_f02", "c03_t09_s03_f03", "c03_t09_s03_f03", "c03_t09_s03_f04", "c03_t09_s03_f04",]],
        [ 36, ["c03_t09_s04_f01", "c03_t09_s04_f01", "c03_t09_s04_f02", "c03_t09_s04_f02", "c03_t09_s04_f03", "c03_t09_s04_f03", "c03_t09_s04_f04", "c03_t09_s04_f04",]],

        ////////// artillery //////////
        [ 37, ["c03_t10_s01_f01", "c03_t10_s01_f01", "c03_t10_s01_f02", "c03_t10_s01_f02", "c03_t10_s01_f03", "c03_t10_s01_f03", "c03_t10_s01_f04", "c03_t10_s01_f04",]],
        [ 38, ["c03_t10_s02_f01", "c03_t10_s02_f01", "c03_t10_s02_f02", "c03_t10_s02_f02", "c03_t10_s02_f03", "c03_t10_s02_f03", "c03_t10_s02_f04", "c03_t10_s02_f04",]],
        [ 39, ["c03_t10_s03_f01", "c03_t10_s03_f01", "c03_t10_s03_f02", "c03_t10_s03_f02", "c03_t10_s03_f03", "c03_t10_s03_f03", "c03_t10_s03_f04", "c03_t10_s03_f04",]],
        [ 40, ["c03_t10_s04_f01", "c03_t10_s04_f01", "c03_t10_s04_f02", "c03_t10_s04_f02", "c03_t10_s04_f03", "c03_t10_s04_f03", "c03_t10_s04_f04", "c03_t10_s04_f04",]],

        ////////// antitank //////////
        [ 41, ["c03_t11_s01_f01", "c03_t11_s01_f01", "c03_t11_s01_f02", "c03_t11_s01_f02", "c03_t11_s01_f03", "c03_t11_s01_f03", "c03_t11_s01_f04", "c03_t11_s01_f04",]],
        [ 42, ["c03_t11_s02_f01", "c03_t11_s02_f01", "c03_t11_s02_f02", "c03_t11_s02_f02", "c03_t11_s02_f03", "c03_t11_s02_f03", "c03_t11_s02_f04", "c03_t11_s02_f04",]],
        [ 43, ["c03_t11_s03_f01", "c03_t11_s03_f01", "c03_t11_s03_f02", "c03_t11_s03_f02", "c03_t11_s03_f03", "c03_t11_s03_f03", "c03_t11_s03_f04", "c03_t11_s03_f04",]],
        [ 44, ["c03_t11_s04_f01", "c03_t11_s04_f01", "c03_t11_s04_f02", "c03_t11_s04_f02", "c03_t11_s04_f03", "c03_t11_s04_f03", "c03_t11_s04_f04", "c03_t11_s04_f04",]],

        ////////// rockets //////////
        [ 45, ["c03_t12_s01_f01", "c03_t12_s01_f01", "c03_t12_s01_f02", "c03_t12_s01_f02", "c03_t12_s01_f03", "c03_t12_s01_f03", "c03_t12_s01_f04", "c03_t12_s01_f04",]],
        [ 46, ["c03_t12_s02_f01", "c03_t12_s02_f01", "c03_t12_s02_f02", "c03_t12_s02_f02", "c03_t12_s02_f03", "c03_t12_s02_f03", "c03_t12_s02_f04", "c03_t12_s02_f04",]],
        [ 47, ["c03_t12_s03_f01", "c03_t12_s03_f01", "c03_t12_s03_f02", "c03_t12_s03_f02", "c03_t12_s03_f03", "c03_t12_s03_f03", "c03_t12_s03_f04", "c03_t12_s03_f04",]],
        [ 48, ["c03_t12_s04_f01", "c03_t12_s04_f01", "c03_t12_s04_f02", "c03_t12_s04_f02", "c03_t12_s04_f03", "c03_t12_s04_f03", "c03_t12_s04_f04", "c03_t12_s04_f04",]],

        ////////// missiles //////////
        [ 49, ["c03_t13_s01_f01", "c03_t13_s01_f01", "c03_t13_s01_f02", "c03_t13_s01_f02", "c03_t13_s01_f03", "c03_t13_s01_f03", "c03_t13_s01_f04", "c03_t13_s01_f04",]],
        [ 50, ["c03_t13_s02_f01", "c03_t13_s02_f01", "c03_t13_s02_f02", "c03_t13_s02_f02", "c03_t13_s02_f03", "c03_t13_s02_f03", "c03_t13_s02_f04", "c03_t13_s02_f04",]],
        [ 51, ["c03_t13_s03_f01", "c03_t13_s03_f01", "c03_t13_s03_f02", "c03_t13_s03_f02", "c03_t13_s03_f03", "c03_t13_s03_f03", "c03_t13_s03_f04", "c03_t13_s03_f04",]],
        [ 52, ["c03_t13_s04_f01", "c03_t13_s04_f01", "c03_t13_s04_f02", "c03_t13_s04_f02", "c03_t13_s04_f03", "c03_t13_s04_f03", "c03_t13_s04_f04", "c03_t13_s04_f04",]],

        ////////// rig //////////
        [ 53, ["c03_t14_s01_f01", "c03_t14_s01_f01", "c03_t14_s01_f02", "c03_t14_s01_f02", "c03_t14_s01_f03", "c03_t14_s01_f03", "c03_t14_s01_f04", "c03_t14_s01_f04",]],
        [ 54, ["c03_t14_s02_f01", "c03_t14_s02_f01", "c03_t14_s02_f02", "c03_t14_s02_f02", "c03_t14_s02_f03", "c03_t14_s02_f03", "c03_t14_s02_f04", "c03_t14_s02_f04",]],
        [ 55, ["c03_t14_s03_f01", "c03_t14_s03_f01", "c03_t14_s03_f02", "c03_t14_s03_f02", "c03_t14_s03_f03", "c03_t14_s03_f03", "c03_t14_s03_f04", "c03_t14_s03_f04",]],
        [ 56, ["c03_t14_s04_f01", "c03_t14_s04_f01", "c03_t14_s04_f02", "c03_t14_s04_f02", "c03_t14_s04_f03", "c03_t14_s04_f03", "c03_t14_s04_f04", "c03_t14_s04_f04",]],

        ////////// fighter //////////
        [ 57, ["c03_t15_s01_f01", "c03_t15_s01_f01", "c03_t15_s01_f02", "c03_t15_s01_f02", "c03_t15_s01_f03", "c03_t15_s01_f03", "c03_t15_s01_f04", "c03_t15_s01_f04",]],
        [ 58, ["c03_t15_s02_f01", "c03_t15_s02_f01", "c03_t15_s02_f02", "c03_t15_s02_f02", "c03_t15_s02_f03", "c03_t15_s02_f03", "c03_t15_s02_f04", "c03_t15_s02_f04",]],
        [ 59, ["c03_t15_s03_f01", "c03_t15_s03_f01", "c03_t15_s03_f02", "c03_t15_s03_f02", "c03_t15_s03_f03", "c03_t15_s03_f03", "c03_t15_s03_f04", "c03_t15_s03_f04",]],
        [ 60, ["c03_t15_s04_f01", "c03_t15_s04_f01", "c03_t15_s04_f02", "c03_t15_s04_f02", "c03_t15_s04_f03", "c03_t15_s04_f03", "c03_t15_s04_f04", "c03_t15_s04_f04",]],

        ////////// bomber //////////
        [ 61, ["c03_t16_s01_f01", "c03_t16_s01_f01", "c03_t16_s01_f02", "c03_t16_s01_f02", "c03_t16_s01_f03", "c03_t16_s01_f03", "c03_t16_s01_f04", "c03_t16_s01_f04",]],
        [ 62, ["c03_t16_s02_f01", "c03_t16_s02_f01", "c03_t16_s02_f02", "c03_t16_s02_f02", "c03_t16_s02_f03", "c03_t16_s02_f03", "c03_t16_s02_f04", "c03_t16_s02_f04",]],
        [ 63, ["c03_t16_s03_f01", "c03_t16_s03_f01", "c03_t16_s03_f02", "c03_t16_s03_f02", "c03_t16_s03_f03", "c03_t16_s03_f03", "c03_t16_s03_f04", "c03_t16_s03_f04",]],
        [ 64, ["c03_t16_s04_f01", "c03_t16_s04_f01", "c03_t16_s04_f02", "c03_t16_s04_f02", "c03_t16_s04_f03", "c03_t16_s04_f03", "c03_t16_s04_f04", "c03_t16_s04_f04",]],

        ////////// duster //////////
        [ 65, ["c03_t17_s01_f01", "c03_t17_s01_f01", "c03_t17_s01_f02", "c03_t17_s01_f02", "c03_t17_s01_f03", "c03_t17_s01_f03", "c03_t17_s01_f04", "c03_t17_s01_f04",]],
        [ 66, ["c03_t17_s02_f01", "c03_t17_s02_f01", "c03_t17_s02_f02", "c03_t17_s02_f02", "c03_t17_s02_f03", "c03_t17_s02_f03", "c03_t17_s02_f04", "c03_t17_s02_f04",]],
        [ 67, ["c03_t17_s03_f01", "c03_t17_s03_f01", "c03_t17_s03_f02", "c03_t17_s03_f02", "c03_t17_s03_f03", "c03_t17_s03_f03", "c03_t17_s03_f04", "c03_t17_s03_f04",]],
        [ 68, ["c03_t17_s04_f01", "c03_t17_s04_f01", "c03_t17_s04_f02", "c03_t17_s04_f02", "c03_t17_s04_f03", "c03_t17_s04_f03", "c03_t17_s04_f04", "c03_t17_s04_f04",]],

        ////////// battlecopter //////////
        [ 69, ["c03_t18_s01_f01", "c03_t18_s01_f01", "c03_t18_s01_f02", "c03_t18_s01_f02", "c03_t18_s01_f03", "c03_t18_s01_f03", "c03_t18_s01_f04", "c03_t18_s01_f04",]],
        [ 70, ["c03_t18_s02_f01", "c03_t18_s02_f01", "c03_t18_s02_f02", "c03_t18_s02_f02", "c03_t18_s02_f03", "c03_t18_s02_f03", "c03_t18_s02_f04", "c03_t18_s02_f04",]],
        [ 71, ["c03_t18_s03_f01", "c03_t18_s03_f01", "c03_t18_s03_f02", "c03_t18_s03_f02", "c03_t18_s03_f03", "c03_t18_s03_f03", "c03_t18_s03_f04", "c03_t18_s03_f04",]],
        [ 72, ["c03_t18_s04_f01", "c03_t18_s04_f01", "c03_t18_s04_f02", "c03_t18_s04_f02", "c03_t18_s04_f03", "c03_t18_s04_f03", "c03_t18_s04_f04", "c03_t18_s04_f04",]],

        ////////// transportcopter //////////
        [ 73, ["c03_t19_s01_f01", "c03_t19_s01_f01", "c03_t19_s01_f02", "c03_t19_s01_f02", "c03_t19_s01_f03", "c03_t19_s01_f03", "c03_t19_s01_f04", "c03_t19_s01_f04",]],
        [ 74, ["c03_t19_s02_f01", "c03_t19_s02_f01", "c03_t19_s02_f02", "c03_t19_s02_f02", "c03_t19_s02_f03", "c03_t19_s02_f03", "c03_t19_s02_f04", "c03_t19_s02_f04",]],
        [ 75, ["c03_t19_s03_f01", "c03_t19_s03_f01", "c03_t19_s03_f02", "c03_t19_s03_f02", "c03_t19_s03_f03", "c03_t19_s03_f03", "c03_t19_s03_f04", "c03_t19_s03_f04",]],
        [ 76, ["c03_t19_s04_f01", "c03_t19_s04_f01", "c03_t19_s04_f02", "c03_t19_s04_f02", "c03_t19_s04_f03", "c03_t19_s04_f03", "c03_t19_s04_f04", "c03_t19_s04_f04",]],

        ////////// seaplane //////////
        [ 77, ["c03_t20_s01_f01", "c03_t20_s01_f01", "c03_t20_s01_f02", "c03_t20_s01_f02", "c03_t20_s01_f03", "c03_t20_s01_f03", "c03_t20_s01_f04", "c03_t20_s01_f04",]],
        [ 78, ["c03_t20_s02_f01", "c03_t20_s02_f01", "c03_t20_s02_f02", "c03_t20_s02_f02", "c03_t20_s02_f03", "c03_t20_s02_f03", "c03_t20_s02_f04", "c03_t20_s02_f04",]],
        [ 79, ["c03_t20_s03_f01", "c03_t20_s03_f01", "c03_t20_s03_f02", "c03_t20_s03_f02", "c03_t20_s03_f03", "c03_t20_s03_f03", "c03_t20_s03_f04", "c03_t20_s03_f04",]],
        [ 80, ["c03_t20_s04_f01", "c03_t20_s04_f01", "c03_t20_s04_f02", "c03_t20_s04_f02", "c03_t20_s04_f03", "c03_t20_s04_f03", "c03_t20_s04_f04", "c03_t20_s04_f04",]],

        ////////// battleship //////////
        [ 81, ["c03_t21_s01_f01", "c03_t21_s01_f01", "c03_t21_s01_f02", "c03_t21_s01_f02", "c03_t21_s01_f03", "c03_t21_s01_f03", "c03_t21_s01_f04", "c03_t21_s01_f04",]],
        [ 82, ["c03_t21_s02_f01", "c03_t21_s02_f01", "c03_t21_s02_f02", "c03_t21_s02_f02", "c03_t21_s02_f03", "c03_t21_s02_f03", "c03_t21_s02_f04", "c03_t21_s02_f04",]],
        [ 83, ["c03_t21_s03_f01", "c03_t21_s03_f01", "c03_t21_s03_f02", "c03_t21_s03_f02", "c03_t21_s03_f03", "c03_t21_s03_f03", "c03_t21_s03_f04", "c03_t21_s03_f04",]],
        [ 84, ["c03_t21_s04_f01", "c03_t21_s04_f01", "c03_t21_s04_f02", "c03_t21_s04_f02", "c03_t21_s04_f03", "c03_t21_s04_f03", "c03_t21_s04_f04", "c03_t21_s04_f04",]],

        ////////// carrier //////////
        [ 85, ["c03_t22_s01_f01", "c03_t22_s01_f01", "c03_t22_s01_f02", "c03_t22_s01_f02", "c03_t22_s01_f03", "c03_t22_s01_f03", "c03_t22_s01_f04", "c03_t22_s01_f04",]],
        [ 86, ["c03_t22_s02_f01", "c03_t22_s02_f01", "c03_t22_s02_f02", "c03_t22_s02_f02", "c03_t22_s02_f03", "c03_t22_s02_f03", "c03_t22_s02_f04", "c03_t22_s02_f04",]],
        [ 87, ["c03_t22_s03_f01", "c03_t22_s03_f01", "c03_t22_s03_f02", "c03_t22_s03_f02", "c03_t22_s03_f03", "c03_t22_s03_f03", "c03_t22_s03_f04", "c03_t22_s03_f04",]],
        [ 88, ["c03_t22_s04_f01", "c03_t22_s04_f01", "c03_t22_s04_f02", "c03_t22_s04_f02", "c03_t22_s04_f03", "c03_t22_s04_f03", "c03_t22_s04_f04", "c03_t22_s04_f04",]],

        ////////// submarine //////////
        [ 89, ["c03_t23_s01_f01", "c03_t23_s01_f01", "c03_t23_s01_f02", "c03_t23_s01_f02", "c03_t23_s01_f03", "c03_t23_s01_f03", "c03_t23_s01_f04", "c03_t23_s01_f04",]],
        [ 90, ["c03_t23_s02_f01", "c03_t23_s02_f01", "c03_t23_s02_f02", "c03_t23_s02_f02", "c03_t23_s02_f03", "c03_t23_s02_f03", "c03_t23_s02_f04", "c03_t23_s02_f04",]],
        [ 91, ["c03_t23_s03_f01", "c03_t23_s03_f01", "c03_t23_s03_f02", "c03_t23_s03_f02", "c03_t23_s03_f03", "c03_t23_s03_f03", "c03_t23_s03_f04", "c03_t23_s03_f04",]],
        [ 92, ["c03_t23_s04_f01", "c03_t23_s04_f01", "c03_t23_s04_f02", "c03_t23_s04_f02", "c03_t23_s04_f03", "c03_t23_s04_f03", "c03_t23_s04_f04", "c03_t23_s04_f04",]],

        ////////// cruiser //////////
        [ 93, ["c03_t24_s01_f01", "c03_t24_s01_f01", "c03_t24_s01_f02", "c03_t24_s01_f02", "c03_t24_s01_f03", "c03_t24_s01_f03", "c03_t24_s01_f04", "c03_t24_s01_f04",]],
        [ 94, ["c03_t24_s02_f01", "c03_t24_s02_f01", "c03_t24_s02_f02", "c03_t24_s02_f02", "c03_t24_s02_f03", "c03_t24_s02_f03", "c03_t24_s02_f04", "c03_t24_s02_f04",]],
        [ 95, ["c03_t24_s03_f01", "c03_t24_s03_f01", "c03_t24_s03_f02", "c03_t24_s03_f02", "c03_t24_s03_f03", "c03_t24_s03_f03", "c03_t24_s03_f04", "c03_t24_s03_f04",]],
        [ 96, ["c03_t24_s04_f01", "c03_t24_s04_f01", "c03_t24_s04_f02", "c03_t24_s04_f02", "c03_t24_s04_f03", "c03_t24_s04_f03", "c03_t24_s04_f04", "c03_t24_s04_f04",]],

        ////////// lander //////////
        [ 97, ["c03_t25_s01_f01", "c03_t25_s01_f01", "c03_t25_s01_f02", "c03_t25_s01_f02", "c03_t25_s01_f03", "c03_t25_s01_f03", "c03_t25_s01_f04", "c03_t25_s01_f04",]],
        [ 98, ["c03_t25_s02_f01", "c03_t25_s02_f01", "c03_t25_s02_f02", "c03_t25_s02_f02", "c03_t25_s02_f03", "c03_t25_s02_f03", "c03_t25_s02_f04", "c03_t25_s02_f04",]],
        [ 99, ["c03_t25_s03_f01", "c03_t25_s03_f01", "c03_t25_s03_f02", "c03_t25_s03_f02", "c03_t25_s03_f03", "c03_t25_s03_f03", "c03_t25_s03_f04", "c03_t25_s03_f04",]],
        [100, ["c03_t25_s04_f01", "c03_t25_s04_f01", "c03_t25_s04_f02", "c03_t25_s04_f02", "c03_t25_s04_f03", "c03_t25_s04_f03", "c03_t25_s04_f04", "c03_t25_s04_f04",]],

        ////////// gunboat //////////
        [101, ["c03_t26_s01_f01", "c03_t26_s01_f01", "c03_t26_s01_f02", "c03_t26_s01_f02", "c03_t26_s01_f03", "c03_t26_s01_f03", "c03_t26_s01_f04", "c03_t26_s01_f04",]],
        [102, ["c03_t26_s02_f01", "c03_t26_s02_f01", "c03_t26_s02_f02", "c03_t26_s02_f02", "c03_t26_s02_f03", "c03_t26_s02_f03", "c03_t26_s02_f04", "c03_t26_s02_f04",]],
        [103, ["c03_t26_s03_f01", "c03_t26_s03_f01", "c03_t26_s03_f02", "c03_t26_s03_f02", "c03_t26_s03_f03", "c03_t26_s03_f03", "c03_t26_s03_f04", "c03_t26_s03_f04",]],
        [104, ["c03_t26_s04_f01", "c03_t26_s04_f01", "c03_t26_s04_f02", "c03_t26_s04_f02", "c03_t26_s04_f03", "c03_t26_s04_f03", "c03_t26_s04_f04", "c03_t26_s04_f04",]],
    ]);

    const UNIT_MOVING_IMAGE_SOURCES = new Map<number,string[]>([
        ////////// infantry //////////
        [  1, ["c03_t01_s01_f11", "c03_t01_s01_f12", "c03_t01_s01_f13", "c03_t01_s01_f14",]],
        [  2, ["c03_t01_s02_f11", "c03_t01_s02_f12", "c03_t01_s02_f13", "c03_t01_s02_f14",]],
        [  3, ["c03_t01_s03_f11", "c03_t01_s03_f12", "c03_t01_s03_f13", "c03_t01_s03_f14",]],
        [  4, ["c03_t01_s04_f11", "c03_t01_s04_f12", "c03_t01_s04_f13", "c03_t01_s04_f14",]],

        ////////// mech //////////
        [  5, ["c03_t02_s01_f11", "c03_t02_s01_f12", "c03_t02_s01_f13", "c03_t02_s01_f14",]],
        [  6, ["c03_t02_s02_f11", "c03_t02_s02_f12", "c03_t02_s02_f13", "c03_t02_s02_f14",]],
        [  7, ["c03_t02_s03_f11", "c03_t02_s03_f12", "c03_t02_s03_f13", "c03_t02_s03_f14",]],
        [  8, ["c03_t02_s04_f11", "c03_t02_s04_f12", "c03_t02_s04_f13", "c03_t02_s04_f14",]],

        ////////// bike //////////
        [  9, ["c03_t03_s01_f11", "c03_t03_s01_f12", "c03_t03_s01_f13",]],
        [ 10, ["c03_t03_s02_f11", "c03_t03_s02_f12", "c03_t03_s02_f13",]],
        [ 11, ["c03_t03_s03_f11", "c03_t03_s03_f12", "c03_t03_s03_f13",]],
        [ 12, ["c03_t03_s04_f11", "c03_t03_s04_f12", "c03_t03_s04_f13",]],

        ////////// recon //////////
        [ 13, ["c03_t04_s01_f11", "c03_t04_s01_f12", "c03_t04_s01_f13",]],
        [ 14, ["c03_t04_s02_f11", "c03_t04_s02_f12", "c03_t04_s02_f13",]],
        [ 15, ["c03_t04_s03_f11", "c03_t04_s03_f12", "c03_t04_s03_f13",]],
        [ 16, ["c03_t04_s04_f11", "c03_t04_s04_f12", "c03_t04_s04_f13",]],

        ////////// flare //////////
        [ 17, ["c03_t05_s01_f11", "c03_t05_s01_f12", "c03_t05_s01_f13",]],
        [ 18, ["c03_t05_s02_f11", "c03_t05_s02_f12", "c03_t05_s02_f13",]],
        [ 19, ["c03_t05_s03_f11", "c03_t05_s03_f12", "c03_t05_s03_f13",]],
        [ 20, ["c03_t05_s04_f11", "c03_t05_s04_f12", "c03_t05_s04_f13",]],

        ////////// antiair //////////
        [ 21, ["c03_t06_s01_f11", "c03_t06_s01_f12", "c03_t06_s01_f13",]],
        [ 22, ["c03_t06_s02_f11", "c03_t06_s02_f12", "c03_t06_s02_f13",]],
        [ 23, ["c03_t06_s03_f11", "c03_t06_s03_f12", "c03_t06_s03_f13",]],
        [ 24, ["c03_t06_s04_f11", "c03_t06_s04_f12", "c03_t06_s04_f13",]],

        ////////// tank //////////
        [ 25, ["c03_t07_s01_f11", "c03_t07_s01_f12", "c03_t07_s01_f13",]],
        [ 26, ["c03_t07_s02_f11", "c03_t07_s02_f12", "c03_t07_s02_f13",]],
        [ 27, ["c03_t07_s03_f11", "c03_t07_s03_f12", "c03_t07_s03_f13",]],
        [ 28, ["c03_t07_s04_f11", "c03_t07_s04_f12", "c03_t07_s04_f13",]],

        ////////// mediumtank //////////
        [ 29, ["c03_t08_s01_f11", "c03_t08_s01_f12", "c03_t08_s01_f13",]],
        [ 30, ["c03_t08_s02_f11", "c03_t08_s02_f12", "c03_t08_s02_f13",]],
        [ 31, ["c03_t08_s03_f11", "c03_t08_s03_f12", "c03_t08_s03_f13",]],
        [ 32, ["c03_t08_s04_f11", "c03_t08_s04_f12", "c03_t08_s04_f13",]],

        ////////// wartank //////////
        [ 33, ["c03_t09_s01_f11", "c03_t09_s01_f12", "c03_t09_s01_f13",]],
        [ 34, ["c03_t09_s02_f11", "c03_t09_s02_f12", "c03_t09_s02_f13",]],
        [ 35, ["c03_t09_s03_f11", "c03_t09_s03_f12", "c03_t09_s03_f13",]],
        [ 36, ["c03_t09_s04_f11", "c03_t09_s04_f12", "c03_t09_s04_f13",]],

        ////////// artillery //////////
        [ 37, ["c03_t10_s01_f11", "c03_t10_s01_f12", "c03_t10_s01_f13",]],
        [ 38, ["c03_t10_s02_f11", "c03_t10_s02_f12", "c03_t10_s02_f13",]],
        [ 39, ["c03_t10_s03_f11", "c03_t10_s03_f12", "c03_t10_s03_f13",]],
        [ 40, ["c03_t10_s04_f11", "c03_t10_s04_f12", "c03_t10_s04_f13",]],

        ////////// antitank //////////
        [ 41, ["c03_t11_s01_f11", "c03_t11_s01_f12", "c03_t11_s01_f13",]],
        [ 42, ["c03_t11_s02_f11", "c03_t11_s02_f12", "c03_t11_s02_f13",]],
        [ 43, ["c03_t11_s03_f11", "c03_t11_s03_f12", "c03_t11_s03_f13",]],
        [ 44, ["c03_t11_s04_f11", "c03_t11_s04_f12", "c03_t11_s04_f13",]],

        ////////// rockets //////////
        [ 45, ["c03_t12_s01_f11", "c03_t12_s01_f12", "c03_t12_s01_f13",]],
        [ 46, ["c03_t12_s02_f11", "c03_t12_s02_f12", "c03_t12_s02_f13",]],
        [ 47, ["c03_t12_s03_f11", "c03_t12_s03_f12", "c03_t12_s03_f13",]],
        [ 48, ["c03_t12_s04_f11", "c03_t12_s04_f12", "c03_t12_s04_f13",]],

        ////////// missiles //////////
        [ 49, ["c03_t13_s01_f11", "c03_t13_s01_f12", "c03_t13_s01_f13",]],
        [ 50, ["c03_t13_s02_f11", "c03_t13_s02_f12", "c03_t13_s02_f13",]],
        [ 51, ["c03_t13_s03_f11", "c03_t13_s03_f12", "c03_t13_s03_f13",]],
        [ 52, ["c03_t13_s04_f11", "c03_t13_s04_f12", "c03_t13_s04_f13",]],

        ////////// rig //////////
        [ 53, ["c03_t14_s01_f11", "c03_t14_s01_f12", "c03_t14_s01_f13",]],
        [ 54, ["c03_t14_s02_f11", "c03_t14_s02_f12", "c03_t14_s02_f13",]],
        [ 55, ["c03_t14_s03_f11", "c03_t14_s03_f12", "c03_t14_s03_f13",]],
        [ 56, ["c03_t14_s04_f11", "c03_t14_s04_f12", "c03_t14_s04_f13",]],

        ////////// fighter //////////
        [ 57, ["c03_t15_s01_f11", "c03_t15_s01_f12", "c03_t15_s01_f13",]],
        [ 58, ["c03_t15_s02_f11", "c03_t15_s02_f12", "c03_t15_s02_f13",]],
        [ 59, ["c03_t15_s03_f11", "c03_t15_s03_f12", "c03_t15_s03_f13",]],
        [ 60, ["c03_t15_s04_f11", "c03_t15_s04_f12", "c03_t15_s04_f13",]],

        ////////// bomber //////////
        [ 61, ["c03_t16_s01_f11", "c03_t16_s01_f12", "c03_t16_s01_f13",]],
        [ 62, ["c03_t16_s02_f11", "c03_t16_s02_f12", "c03_t16_s02_f13",]],
        [ 63, ["c03_t16_s03_f11", "c03_t16_s03_f12", "c03_t16_s03_f13",]],
        [ 64, ["c03_t16_s04_f11", "c03_t16_s04_f12", "c03_t16_s04_f13",]],

        ////////// duster //////////
        [ 65, ["c03_t17_s01_f11", "c03_t17_s01_f12", "c03_t17_s01_f13",]],
        [ 66, ["c03_t17_s02_f11", "c03_t17_s02_f12", "c03_t17_s02_f13",]],
        [ 67, ["c03_t17_s03_f11", "c03_t17_s03_f12", "c03_t17_s03_f13",]],
        [ 68, ["c03_t17_s04_f11", "c03_t17_s04_f12", "c03_t17_s04_f13",]],

        ////////// battlecopter //////////
        [ 69, ["c03_t18_s01_f11", "c03_t18_s01_f12", "c03_t18_s01_f13",]],
        [ 70, ["c03_t18_s02_f11", "c03_t18_s02_f12", "c03_t18_s02_f13",]],
        [ 71, ["c03_t18_s03_f11", "c03_t18_s03_f12", "c03_t18_s03_f13",]],
        [ 72, ["c03_t18_s04_f11", "c03_t18_s04_f12", "c03_t18_s04_f13",]],

        ////////// transportcopter //////////
        [ 73, ["c03_t19_s01_f11", "c03_t19_s01_f12", "c03_t19_s01_f13",]],
        [ 74, ["c03_t19_s02_f11", "c03_t19_s02_f12", "c03_t19_s02_f13",]],
        [ 75, ["c03_t19_s03_f11", "c03_t19_s03_f12", "c03_t19_s03_f13",]],
        [ 76, ["c03_t19_s04_f11", "c03_t19_s04_f12", "c03_t19_s04_f13",]],

        ////////// seaplane //////////
        [ 77, ["c03_t20_s01_f11", "c03_t20_s01_f12", "c03_t20_s01_f13",]],
        [ 78, ["c03_t20_s02_f11", "c03_t20_s02_f12", "c03_t20_s02_f13",]],
        [ 79, ["c03_t20_s03_f11", "c03_t20_s03_f12", "c03_t20_s03_f13",]],
        [ 80, ["c03_t20_s04_f11", "c03_t20_s04_f12", "c03_t20_s04_f13",]],

        ////////// battleship //////////
        [ 81, ["c03_t21_s01_f11", "c03_t21_s01_f12", "c03_t21_s01_f13",]],
        [ 82, ["c03_t21_s02_f11", "c03_t21_s02_f12", "c03_t21_s02_f13",]],
        [ 83, ["c03_t21_s03_f11", "c03_t21_s03_f12", "c03_t21_s03_f13",]],
        [ 84, ["c03_t21_s04_f11", "c03_t21_s04_f12", "c03_t21_s04_f13",]],

        ////////// carrier //////////
        [ 85, ["c03_t22_s01_f11", "c03_t22_s01_f12", "c03_t22_s01_f13",]],
        [ 86, ["c03_t22_s02_f11", "c03_t22_s02_f12", "c03_t22_s02_f13",]],
        [ 87, ["c03_t22_s03_f11", "c03_t22_s03_f12", "c03_t22_s03_f13",]],
        [ 88, ["c03_t22_s04_f11", "c03_t22_s04_f12", "c03_t22_s04_f13",]],

        ////////// submarine //////////
        [ 89, ["c03_t23_s01_f11", "c03_t23_s01_f12", "c03_t23_s01_f13",]],
        [ 90, ["c03_t23_s02_f11", "c03_t23_s02_f12", "c03_t23_s02_f13",]],
        [ 91, ["c03_t23_s03_f11", "c03_t23_s03_f12", "c03_t23_s03_f13",]],
        [ 92, ["c03_t23_s04_f11", "c03_t23_s04_f12", "c03_t23_s04_f13",]],

        ////////// cruiser //////////
        [ 93, ["c03_t24_s01_f11", "c03_t24_s01_f12", "c03_t24_s01_f13",]],
        [ 94, ["c03_t24_s02_f11", "c03_t24_s02_f12", "c03_t24_s02_f13",]],
        [ 95, ["c03_t24_s03_f11", "c03_t24_s03_f12", "c03_t24_s03_f13",]],
        [ 96, ["c03_t24_s04_f11", "c03_t24_s04_f12", "c03_t24_s04_f13",]],

        ////////// lander //////////
        [ 97, ["c03_t25_s01_f11", "c03_t25_s01_f12", "c03_t25_s01_f13",]],
        [ 98, ["c03_t25_s02_f11", "c03_t25_s02_f12", "c03_t25_s02_f13",]],
        [ 99, ["c03_t25_s03_f11", "c03_t25_s03_f12", "c03_t25_s03_f13",]],
        [100, ["c03_t25_s04_f11", "c03_t25_s04_f12", "c03_t25_s04_f13",]],

        ////////// gunboat //////////
        [101, ["c03_t26_s01_f11", "c03_t26_s01_f12", "c03_t26_s01_f13",]],
        [102, ["c03_t26_s02_f11", "c03_t26_s02_f12", "c03_t26_s02_f13",]],
        [103, ["c03_t26_s03_f11", "c03_t26_s03_f12", "c03_t26_s03_f13",]],
        [104, ["c03_t26_s04_f11", "c03_t26_s04_f12", "c03_t26_s04_f13",]],
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
    function _destructBuildableTileCfg(data: BuildableTileCfg[]): { [unitType: number]: { [srcTileType: number]: BuildableTileCfg } } {
        const dst: { [unitType: number]: { [srcTileType: number]: BuildableTileCfg } } = {};
        for (const d of data) {
            const unitType                  = d.unitType!;
            dst[unitType]                   = dst[unitType] || {};
            dst[unitType][d.srcTileType!]   = d;
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

    function _initTileObjectViewIds(): void {
        for (const [tileObjectViewId, tileObjectTypeAndPlayerIndex] of _TILE_OBJECT_TYPES_AND_PLAYER_INDEX) {
            const type = tileObjectTypeAndPlayerIndex.tileObjectType;
            if (_TILE_OBJECT_VIEW_IDS.has(type)) {
                _TILE_OBJECT_VIEW_IDS.get(type)!.set(tileObjectTypeAndPlayerIndex.playerIndex, tileObjectViewId);
            } else {
                _TILE_OBJECT_VIEW_IDS.set(type, new Map([[tileObjectTypeAndPlayerIndex.playerIndex, tileObjectViewId]]));
            }
        }

        Logger.log("[ConfigManager init] _initTileObjectViewIds() finished.");
    }

    function _initUnitViewIds(): void {
        for (const [unitViewId, unitTypeAndPlayerIndex] of _UNIT_TYPES_AND_PLAYER_INDEX) {
            const type = unitTypeAndPlayerIndex.unitType;
            if (_UNIT_VIEW_IDS.has(type)) {
                _UNIT_VIEW_IDS.get(type)!.set(unitTypeAndPlayerIndex.playerIndex, unitViewId);
            } else {
                _UNIT_VIEW_IDS.set(type, new Map([[unitTypeAndPlayerIndex.playerIndex, unitViewId]]));
            }
        }

        Logger.log("[ConfigManager init] _initUnitViewIds() finished.");
    }

    function _onSNewestConfigVersion(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_NewestConfigVersion;
        _newestConfigVersion = data.version;
        loadConfig(_newestConfigVersion);
    }

    const _ALL_CONFIGS          = new Map<number, FullConfig>();
    const _TILE_OBJECT_VIEW_IDS = new Map<TileObjectType, Map<number, number>>();
    const _UNIT_VIEW_IDS        = new Map<UnitType, Map<number, number>>();
    let _newestConfigVersion: number;

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export const MAX_UNIT_NORMALIZED_HP = 10;

    export function init(): void {
        NetManager.addListeners([
            { actionCode: ActionCode.S_NewestConfigVersion, callback: _onSNewestConfigVersion },
        ], ConfigManager);

        _initTileObjectViewIds();
        _initUnitViewIds();
    }

    export function getNewestConfigVersion(): number {
        return _newestConfigVersion;
    }

    export function checkIsConfigLoaded(version: number): boolean {
        return _ALL_CONFIGS.has(version);
    }

    export async function loadConfig(version: number): Promise<FullConfig> {
        if (!checkIsConfigLoaded(version)) {
            const data = Utility.ProtoManager.decodeAsFullConfig(await RES.getResByUrl(
                `resource/config/FullConfig${Utility.Helpers.getNumText(version, 4)}.bin`,
                undefined,
                undefined,
                RES.ResourceItem.TYPE_BIN
            ));
            const cfg: FullConfig = {
                TileCategory        : _destructTileCategoryCfg(data.TileCategory),
                UnitCategory        : _destructUnitCategoryCfg(data.UnitCategory),
                TileTemplate        : _destructTileTemplateCfg(data.TileTemplate),
                UnitTemplate        : _destructUnitTemplateCfg(data.UnitTemplate),
                DamageChart         : _destructDamageChartCfg(data.DamageChart),
                MoveCost            : _destructMoveCostCfg(data.MoveCost),
                UnitPromotion       : _destructUnitPromotionCfg(data.UnitPromotion),
                VisionBonus         : _destructVisionBonusCfg(data.VisionBonus),
                BuildableTile       : _destructBuildableTileCfg(data.BuildableTile),
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

    export function getTileTemplateCfg(version: number, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
        return _ALL_CONFIGS.get(version)!.TileTemplate[getTileType(baseType, objectType)];
    }

    export function getTileTypesByCategory(version: number, category: TileCategory): TileType[] | undefined | null {
        return _ALL_CONFIGS.get(version)!.TileCategory[category].tileTypes;
    }

    export function getUnitTemplateCfg(version: number, unitType: UnitType): UnitTemplateCfg {
        return _ALL_CONFIGS.get(version)!.UnitTemplate[unitType];
    }

    export function getUnitTypesByCategory(version: number, category: UnitCategory): UnitType[] | undefined | null {
        return _ALL_CONFIGS.get(version)!.UnitCategory[category].unitTypes;
    }

    export function checkIsUnitTypeInCategory(version: number, unitType: UnitType, category: UnitCategory): boolean {
        const types = getUnitTypesByCategory(version, category);
        return (types != null) && (types.indexOf(unitType) >= 0);
    }

    export function getUnitMaxPromotion(version: number): number {
        return _ALL_CONFIGS.get(version)!.maxUnitPromotion!;
    }

    export function checkHasSecondaryWeapon(version: number, unitType: UnitType): boolean {
        return _ALL_CONFIGS.get(version)!.secondaryWeaponFlag![unitType];
    }

    export function getUnitPromotionAttackBonus(version: number, promotion: number): number {
        return _ALL_CONFIGS.get(version)!.UnitPromotion![promotion].attackBonus!;
    }

    export function getUnitPromotionDefenseBonus(version: number, promotion: number): number {
        return _ALL_CONFIGS.get(version)!.UnitPromotion![promotion].defenseBonus!;
    }

    export function getDamageChartCfgs(version: number, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        return _ALL_CONFIGS.get(version)!.DamageChart[attackerType];
    }

    export function getBuildableTileCfgs(version: number, unitType: UnitType): { [srcTileType: number]: BuildableTileCfg } | undefined {
        return _ALL_CONFIGS.get(version)!.BuildableTile[unitType];
    }

    export function getVisionBonusCfg(version: number, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
        return _ALL_CONFIGS.get(version)!.VisionBonus[unitType];
    }

    export function getMoveCostCfg(version: number, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
        return _ALL_CONFIGS.get(version)!.MoveCost[getTileType(baseType, objectType)];
    }

    export function getTileBaseType(tileBaseViewId: number): TileBaseType {
        return _TILE_BASE_TYPES.get(tileBaseViewId)!;
    }

    export function getTileObjectTypeAndPlayerIndex(tileObjectViewId: number): TileObjectTypeAndPlayerIndex {
        return _TILE_OBJECT_TYPES_AND_PLAYER_INDEX.get(tileObjectViewId)!;
    }

    export function getUnitTypeAndPlayerIndex(unitViewId: number): UnitTypeAndPlayerIndex {
        return _UNIT_TYPES_AND_PLAYER_INDEX.get(unitViewId)!;
    }

    export function getTileObjectViewId(type: Types.TileObjectType, playerIndex: number): number | undefined {
        const mapping = _TILE_OBJECT_VIEW_IDS.get(type);
        return mapping ? mapping.get(playerIndex) : undefined;
    }

    export function getUnitViewId(type: Types.UnitType, playerIndex: number): number | undefined {
        const mapping = _UNIT_VIEW_IDS.get(type);
        return mapping ? mapping.get(playerIndex) : undefined;
    }

    export function getTileBaseImageSource(tileBaseViewId: number, tickCount: number): string {
        const sources = _TILE_BASE_IMAGE_SOURCES.get(tileBaseViewId)!;
        return sources[tickCount % sources.length];
    }

    export function getTileObjectImageSource(tileObjectViewId: number, tickCount: number): string {
        const sources = _TILE_OBJECT_IMAGE_SOURCES.get(tileObjectViewId)!;
        return sources[tickCount % sources.length];
    }

    export function getUnitIdleImageSource(viewId: number, tickCount: number): string {
        const sources = UNIT_IDLE_IMAGE_SOURCES.get(viewId);
        return sources[tickCount % sources.length];
    }

    export function getUnitMovingImageSource(viewId: number, tickCount: number): string {
        const sources = UNIT_MOVING_IMAGE_SOURCES.get(viewId);
        return sources[tickCount % sources.length];
    }
}
