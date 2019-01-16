
namespace TinyWars.Utility.IdConverter {
    import TileBaseType   = Types.TileBaseType;
    import TileObjectType = Types.TileObjectType;
    import UnitType       = Types.UnitType;

    type TileObjectTypeAndPlayerIndex = {
        tileObjectType: TileObjectType;
        playerIndex   : number;
    }

    type UnitTypeAndPlayerIndex = {
        unitType   : UnitType;
        playerIndex: number;
    }

    const TILE_BASE_IMAGE_SOURCES: Readonly<string[]>[] = [
        /*   0 */ [],

        ////////// plain * 1 //////////
        /*   1 */ ["c01_t01_s01_f01",],

        ////////// river * 16 //////////
        /*   2 */ ["c01_t02_s01_f01",],
        /*   3 */ ["c01_t02_s02_f01",],
        /*   4 */ ["c01_t02_s03_f01",],
        /*   5 */ ["c01_t02_s04_f01",],
        /*   6 */ ["c01_t02_s05_f01",],
        /*   7 */ ["c01_t02_s06_f01",],
        /*   8 */ ["c01_t02_s07_f01",],
        /*   9 */ ["c01_t02_s08_f01",],
        /*  10 */ ["c01_t02_s09_f01",],
        /*  11 */ ["c01_t02_s10_f01",],
        /*  12 */ ["c01_t02_s11_f01",],
        /*  13 */ ["c01_t02_s12_f01",],
        /*  14 */ ["c01_t02_s13_f01",],
        /*  15 */ ["c01_t02_s14_f01",],
        /*  16 */ ["c01_t02_s15_f01",],
        /*  17 */ ["c01_t02_s16_f01",],

        ////////// sea * 47 //////////
        /*  18 */ ["c01_t03_s01_f01", "c01_t03_s01_f01", "c01_t03_s01_f02", "c01_t03_s01_f02", "c01_t03_s01_f03", "c01_t03_s01_f03", "c01_t03_s01_f04", "c01_t03_s01_f04", "c01_t03_s01_f03", "c01_t03_s01_f03", "c01_t03_s01_f02", "c01_t03_s01_f02",],
        /*  19 */ ["c01_t03_s02_f01", "c01_t03_s02_f01", "c01_t03_s02_f02", "c01_t03_s02_f02", "c01_t03_s02_f03", "c01_t03_s02_f03", "c01_t03_s02_f04", "c01_t03_s02_f04", "c01_t03_s02_f03", "c01_t03_s02_f03", "c01_t03_s02_f02", "c01_t03_s02_f02",],
        /*  20 */ ["c01_t03_s03_f01", "c01_t03_s03_f01", "c01_t03_s03_f02", "c01_t03_s03_f02", "c01_t03_s03_f03", "c01_t03_s03_f03", "c01_t03_s03_f04", "c01_t03_s03_f04", "c01_t03_s03_f03", "c01_t03_s03_f03", "c01_t03_s03_f02", "c01_t03_s03_f02",],
        /*  21 */ ["c01_t03_s04_f01", "c01_t03_s04_f01", "c01_t03_s04_f02", "c01_t03_s04_f02", "c01_t03_s04_f03", "c01_t03_s04_f03", "c01_t03_s04_f04", "c01_t03_s04_f04", "c01_t03_s04_f03", "c01_t03_s04_f03", "c01_t03_s04_f02", "c01_t03_s04_f02",],
        /*  22 */ ["c01_t03_s05_f01", "c01_t03_s05_f01", "c01_t03_s05_f02", "c01_t03_s05_f02", "c01_t03_s05_f03", "c01_t03_s05_f03", "c01_t03_s05_f04", "c01_t03_s05_f04", "c01_t03_s05_f03", "c01_t03_s05_f03", "c01_t03_s05_f02", "c01_t03_s05_f02",],
        /*  23 */ ["c01_t03_s06_f01", "c01_t03_s06_f01", "c01_t03_s06_f02", "c01_t03_s06_f02", "c01_t03_s06_f03", "c01_t03_s06_f03", "c01_t03_s06_f04", "c01_t03_s06_f04", "c01_t03_s06_f03", "c01_t03_s06_f03", "c01_t03_s06_f02", "c01_t03_s06_f02",],
        /*  24 */ ["c01_t03_s07_f01", "c01_t03_s07_f01", "c01_t03_s07_f02", "c01_t03_s07_f02", "c01_t03_s07_f03", "c01_t03_s07_f03", "c01_t03_s07_f04", "c01_t03_s07_f04", "c01_t03_s07_f03", "c01_t03_s07_f03", "c01_t03_s07_f02", "c01_t03_s07_f02",],
        /*  25 */ ["c01_t03_s08_f01", "c01_t03_s08_f01", "c01_t03_s08_f02", "c01_t03_s08_f02", "c01_t03_s08_f03", "c01_t03_s08_f03", "c01_t03_s08_f04", "c01_t03_s08_f04", "c01_t03_s08_f03", "c01_t03_s08_f03", "c01_t03_s08_f02", "c01_t03_s08_f02",],
        /*  26 */ ["c01_t03_s09_f01", "c01_t03_s09_f01", "c01_t03_s09_f02", "c01_t03_s09_f02", "c01_t03_s09_f03", "c01_t03_s09_f03", "c01_t03_s09_f04", "c01_t03_s09_f04", "c01_t03_s09_f03", "c01_t03_s09_f03", "c01_t03_s09_f02", "c01_t03_s09_f02",],
        /*  27 */ ["c01_t03_s10_f01", "c01_t03_s10_f01", "c01_t03_s10_f02", "c01_t03_s10_f02", "c01_t03_s10_f03", "c01_t03_s10_f03", "c01_t03_s10_f04", "c01_t03_s10_f04", "c01_t03_s10_f03", "c01_t03_s10_f03", "c01_t03_s10_f02", "c01_t03_s10_f02",],
        /*  28 */ ["c01_t03_s11_f01", "c01_t03_s11_f01", "c01_t03_s11_f02", "c01_t03_s11_f02", "c01_t03_s11_f03", "c01_t03_s11_f03", "c01_t03_s11_f04", "c01_t03_s11_f04", "c01_t03_s11_f03", "c01_t03_s11_f03", "c01_t03_s11_f02", "c01_t03_s11_f02",],
        /*  29 */ ["c01_t03_s12_f01", "c01_t03_s12_f01", "c01_t03_s12_f02", "c01_t03_s12_f02", "c01_t03_s12_f03", "c01_t03_s12_f03", "c01_t03_s12_f04", "c01_t03_s12_f04", "c01_t03_s12_f03", "c01_t03_s12_f03", "c01_t03_s12_f02", "c01_t03_s12_f02",],
        /*  30 */ ["c01_t03_s13_f01", "c01_t03_s13_f01", "c01_t03_s13_f02", "c01_t03_s13_f02", "c01_t03_s13_f03", "c01_t03_s13_f03", "c01_t03_s13_f04", "c01_t03_s13_f04", "c01_t03_s13_f03", "c01_t03_s13_f03", "c01_t03_s13_f02", "c01_t03_s13_f02",],
        /*  31 */ ["c01_t03_s14_f01", "c01_t03_s14_f01", "c01_t03_s14_f02", "c01_t03_s14_f02", "c01_t03_s14_f03", "c01_t03_s14_f03", "c01_t03_s14_f04", "c01_t03_s14_f04", "c01_t03_s14_f03", "c01_t03_s14_f03", "c01_t03_s14_f02", "c01_t03_s14_f02",],
        /*  32 */ ["c01_t03_s15_f01", "c01_t03_s15_f01", "c01_t03_s15_f02", "c01_t03_s15_f02", "c01_t03_s15_f03", "c01_t03_s15_f03", "c01_t03_s15_f04", "c01_t03_s15_f04", "c01_t03_s15_f03", "c01_t03_s15_f03", "c01_t03_s15_f02", "c01_t03_s15_f02",],
        /*  33 */ ["c01_t03_s16_f01", "c01_t03_s16_f01", "c01_t03_s16_f02", "c01_t03_s16_f02", "c01_t03_s16_f03", "c01_t03_s16_f03", "c01_t03_s16_f04", "c01_t03_s16_f04", "c01_t03_s16_f03", "c01_t03_s16_f03", "c01_t03_s16_f02", "c01_t03_s16_f02",],
        /*  34 */ ["c01_t03_s17_f01", "c01_t03_s17_f01", "c01_t03_s17_f02", "c01_t03_s17_f02", "c01_t03_s17_f03", "c01_t03_s17_f03", "c01_t03_s17_f04", "c01_t03_s17_f04", "c01_t03_s17_f03", "c01_t03_s17_f03", "c01_t03_s17_f02", "c01_t03_s17_f02",],
        /*  35 */ ["c01_t03_s18_f01", "c01_t03_s18_f01", "c01_t03_s18_f02", "c01_t03_s18_f02", "c01_t03_s18_f03", "c01_t03_s18_f03", "c01_t03_s18_f04", "c01_t03_s18_f04", "c01_t03_s18_f03", "c01_t03_s18_f03", "c01_t03_s18_f02", "c01_t03_s18_f02",],
        /*  36 */ ["c01_t03_s19_f01", "c01_t03_s19_f01", "c01_t03_s19_f02", "c01_t03_s19_f02", "c01_t03_s19_f03", "c01_t03_s19_f03", "c01_t03_s19_f04", "c01_t03_s19_f04", "c01_t03_s19_f03", "c01_t03_s19_f03", "c01_t03_s19_f02", "c01_t03_s19_f02",],
        /*  37 */ ["c01_t03_s20_f01", "c01_t03_s20_f01", "c01_t03_s20_f02", "c01_t03_s20_f02", "c01_t03_s20_f03", "c01_t03_s20_f03", "c01_t03_s20_f04", "c01_t03_s20_f04", "c01_t03_s20_f03", "c01_t03_s20_f03", "c01_t03_s20_f02", "c01_t03_s20_f02",],
        /*  38 */ ["c01_t03_s21_f01", "c01_t03_s21_f01", "c01_t03_s21_f02", "c01_t03_s21_f02", "c01_t03_s21_f03", "c01_t03_s21_f03", "c01_t03_s21_f04", "c01_t03_s21_f04", "c01_t03_s21_f03", "c01_t03_s21_f03", "c01_t03_s21_f02", "c01_t03_s21_f02",],
        /*  39 */ ["c01_t03_s22_f01", "c01_t03_s22_f01", "c01_t03_s22_f02", "c01_t03_s22_f02", "c01_t03_s22_f03", "c01_t03_s22_f03", "c01_t03_s22_f04", "c01_t03_s22_f04", "c01_t03_s22_f03", "c01_t03_s22_f03", "c01_t03_s22_f02", "c01_t03_s22_f02",],
        /*  40 */ ["c01_t03_s23_f01", "c01_t03_s23_f01", "c01_t03_s23_f02", "c01_t03_s23_f02", "c01_t03_s23_f03", "c01_t03_s23_f03", "c01_t03_s23_f04", "c01_t03_s23_f04", "c01_t03_s23_f03", "c01_t03_s23_f03", "c01_t03_s23_f02", "c01_t03_s23_f02",],
        /*  41 */ ["c01_t03_s24_f01", "c01_t03_s24_f01", "c01_t03_s24_f02", "c01_t03_s24_f02", "c01_t03_s24_f03", "c01_t03_s24_f03", "c01_t03_s24_f04", "c01_t03_s24_f04", "c01_t03_s24_f03", "c01_t03_s24_f03", "c01_t03_s24_f02", "c01_t03_s24_f02",],
        /*  42 */ ["c01_t03_s25_f01", "c01_t03_s25_f01", "c01_t03_s25_f02", "c01_t03_s25_f02", "c01_t03_s25_f03", "c01_t03_s25_f03", "c01_t03_s25_f04", "c01_t03_s25_f04", "c01_t03_s25_f03", "c01_t03_s25_f03", "c01_t03_s25_f02", "c01_t03_s25_f02",],
        /*  43 */ ["c01_t03_s26_f01", "c01_t03_s26_f01", "c01_t03_s26_f02", "c01_t03_s26_f02", "c01_t03_s26_f03", "c01_t03_s26_f03", "c01_t03_s26_f04", "c01_t03_s26_f04", "c01_t03_s26_f03", "c01_t03_s26_f03", "c01_t03_s26_f02", "c01_t03_s26_f02",],
        /*  44 */ ["c01_t03_s27_f01", "c01_t03_s27_f01", "c01_t03_s27_f02", "c01_t03_s27_f02", "c01_t03_s27_f03", "c01_t03_s27_f03", "c01_t03_s27_f04", "c01_t03_s27_f04", "c01_t03_s27_f03", "c01_t03_s27_f03", "c01_t03_s27_f02", "c01_t03_s27_f02",],
        /*  45 */ ["c01_t03_s28_f01", "c01_t03_s28_f01", "c01_t03_s28_f02", "c01_t03_s28_f02", "c01_t03_s28_f03", "c01_t03_s28_f03", "c01_t03_s28_f04", "c01_t03_s28_f04", "c01_t03_s28_f03", "c01_t03_s28_f03", "c01_t03_s28_f02", "c01_t03_s28_f02",],
        /*  46 */ ["c01_t03_s29_f01", "c01_t03_s29_f01", "c01_t03_s29_f02", "c01_t03_s29_f02", "c01_t03_s29_f03", "c01_t03_s29_f03", "c01_t03_s29_f04", "c01_t03_s29_f04", "c01_t03_s29_f03", "c01_t03_s29_f03", "c01_t03_s29_f02", "c01_t03_s29_f02",],
        /*  47 */ ["c01_t03_s30_f01", "c01_t03_s30_f01", "c01_t03_s30_f02", "c01_t03_s30_f02", "c01_t03_s30_f03", "c01_t03_s30_f03", "c01_t03_s30_f04", "c01_t03_s30_f04", "c01_t03_s30_f03", "c01_t03_s30_f03", "c01_t03_s30_f02", "c01_t03_s30_f02",],
        /*  48 */ ["c01_t03_s31_f01", "c01_t03_s31_f01", "c01_t03_s31_f02", "c01_t03_s31_f02", "c01_t03_s31_f03", "c01_t03_s31_f03", "c01_t03_s31_f04", "c01_t03_s31_f04", "c01_t03_s31_f03", "c01_t03_s31_f03", "c01_t03_s31_f02", "c01_t03_s31_f02",],
        /*  49 */ ["c01_t03_s32_f01", "c01_t03_s32_f01", "c01_t03_s32_f02", "c01_t03_s32_f02", "c01_t03_s32_f03", "c01_t03_s32_f03", "c01_t03_s32_f04", "c01_t03_s32_f04", "c01_t03_s32_f03", "c01_t03_s32_f03", "c01_t03_s32_f02", "c01_t03_s32_f02",],
        /*  50 */ ["c01_t03_s33_f01", "c01_t03_s33_f01", "c01_t03_s33_f02", "c01_t03_s33_f02", "c01_t03_s33_f03", "c01_t03_s33_f03", "c01_t03_s33_f04", "c01_t03_s33_f04", "c01_t03_s33_f03", "c01_t03_s33_f03", "c01_t03_s33_f02", "c01_t03_s33_f02",],
        /*  51 */ ["c01_t03_s34_f01", "c01_t03_s34_f01", "c01_t03_s34_f02", "c01_t03_s34_f02", "c01_t03_s34_f03", "c01_t03_s34_f03", "c01_t03_s34_f04", "c01_t03_s34_f04", "c01_t03_s34_f03", "c01_t03_s34_f03", "c01_t03_s34_f02", "c01_t03_s34_f02",],
        /*  52 */ ["c01_t03_s35_f01", "c01_t03_s35_f01", "c01_t03_s35_f02", "c01_t03_s35_f02", "c01_t03_s35_f03", "c01_t03_s35_f03", "c01_t03_s35_f04", "c01_t03_s35_f04", "c01_t03_s35_f03", "c01_t03_s35_f03", "c01_t03_s35_f02", "c01_t03_s35_f02",],
        /*  53 */ ["c01_t03_s36_f01", "c01_t03_s36_f01", "c01_t03_s36_f02", "c01_t03_s36_f02", "c01_t03_s36_f03", "c01_t03_s36_f03", "c01_t03_s36_f04", "c01_t03_s36_f04", "c01_t03_s36_f03", "c01_t03_s36_f03", "c01_t03_s36_f02", "c01_t03_s36_f02",],
        /*  54 */ ["c01_t03_s37_f01", "c01_t03_s37_f01", "c01_t03_s37_f02", "c01_t03_s37_f02", "c01_t03_s37_f03", "c01_t03_s37_f03", "c01_t03_s37_f04", "c01_t03_s37_f04", "c01_t03_s37_f03", "c01_t03_s37_f03", "c01_t03_s37_f02", "c01_t03_s37_f02",],
        /*  55 */ ["c01_t03_s38_f01", "c01_t03_s38_f01", "c01_t03_s38_f02", "c01_t03_s38_f02", "c01_t03_s38_f03", "c01_t03_s38_f03", "c01_t03_s38_f04", "c01_t03_s38_f04", "c01_t03_s38_f03", "c01_t03_s38_f03", "c01_t03_s38_f02", "c01_t03_s38_f02",],
        /*  56 */ ["c01_t03_s39_f01", "c01_t03_s39_f01", "c01_t03_s39_f02", "c01_t03_s39_f02", "c01_t03_s39_f03", "c01_t03_s39_f03", "c01_t03_s39_f04", "c01_t03_s39_f04", "c01_t03_s39_f03", "c01_t03_s39_f03", "c01_t03_s39_f02", "c01_t03_s39_f02",],
        /*  57 */ ["c01_t03_s40_f01", "c01_t03_s40_f01", "c01_t03_s40_f02", "c01_t03_s40_f02", "c01_t03_s40_f03", "c01_t03_s40_f03", "c01_t03_s40_f04", "c01_t03_s40_f04", "c01_t03_s40_f03", "c01_t03_s40_f03", "c01_t03_s40_f02", "c01_t03_s40_f02",],
        /*  58 */ ["c01_t03_s41_f01", "c01_t03_s41_f01", "c01_t03_s41_f02", "c01_t03_s41_f02", "c01_t03_s41_f03", "c01_t03_s41_f03", "c01_t03_s41_f04", "c01_t03_s41_f04", "c01_t03_s41_f03", "c01_t03_s41_f03", "c01_t03_s41_f02", "c01_t03_s41_f02",],
        /*  59 */ ["c01_t03_s42_f01", "c01_t03_s42_f01", "c01_t03_s42_f02", "c01_t03_s42_f02", "c01_t03_s42_f03", "c01_t03_s42_f03", "c01_t03_s42_f04", "c01_t03_s42_f04", "c01_t03_s42_f03", "c01_t03_s42_f03", "c01_t03_s42_f02", "c01_t03_s42_f02",],
        /*  60 */ ["c01_t03_s43_f01", "c01_t03_s43_f01", "c01_t03_s43_f02", "c01_t03_s43_f02", "c01_t03_s43_f03", "c01_t03_s43_f03", "c01_t03_s43_f04", "c01_t03_s43_f04", "c01_t03_s43_f03", "c01_t03_s43_f03", "c01_t03_s43_f02", "c01_t03_s43_f02",],
        /*  61 */ ["c01_t03_s44_f01", "c01_t03_s44_f01", "c01_t03_s44_f02", "c01_t03_s44_f02", "c01_t03_s44_f03", "c01_t03_s44_f03", "c01_t03_s44_f04", "c01_t03_s44_f04", "c01_t03_s44_f03", "c01_t03_s44_f03", "c01_t03_s44_f02", "c01_t03_s44_f02",],
        /*  62 */ ["c01_t03_s45_f01", "c01_t03_s45_f01", "c01_t03_s45_f02", "c01_t03_s45_f02", "c01_t03_s45_f03", "c01_t03_s45_f03", "c01_t03_s45_f04", "c01_t03_s45_f04", "c01_t03_s45_f03", "c01_t03_s45_f03", "c01_t03_s45_f02", "c01_t03_s45_f02",],
        /*  63 */ ["c01_t03_s46_f01", "c01_t03_s46_f01", "c01_t03_s46_f02", "c01_t03_s46_f02", "c01_t03_s46_f03", "c01_t03_s46_f03", "c01_t03_s46_f04", "c01_t03_s46_f04", "c01_t03_s46_f03", "c01_t03_s46_f03", "c01_t03_s46_f02", "c01_t03_s46_f02",],
        /*  64 */ ["c01_t03_s47_f01", "c01_t03_s47_f01", "c01_t03_s47_f02", "c01_t03_s47_f02", "c01_t03_s47_f03", "c01_t03_s47_f03", "c01_t03_s47_f04", "c01_t03_s47_f04", "c01_t03_s47_f03", "c01_t03_s47_f03", "c01_t03_s47_f02", "c01_t03_s47_f02",],

        ////////// beach * 36 //////////
        /*  65 */ ["c01_t04_s01_f01", "c01_t04_s01_f01", "c01_t04_s01_f02", "c01_t04_s01_f02", "c01_t04_s01_f03", "c01_t04_s01_f03", "c01_t04_s01_f04", "c01_t04_s01_f04", "c01_t04_s01_f03", "c01_t04_s01_f03", "c01_t04_s01_f02", "c01_t04_s01_f02",],
        /*  66 */ ["c01_t04_s02_f01", "c01_t04_s02_f01", "c01_t04_s02_f02", "c01_t04_s02_f02", "c01_t04_s02_f03", "c01_t04_s02_f03", "c01_t04_s02_f04", "c01_t04_s02_f04", "c01_t04_s02_f03", "c01_t04_s02_f03", "c01_t04_s02_f02", "c01_t04_s02_f02",],
        /*  67 */ ["c01_t04_s03_f01", "c01_t04_s03_f01", "c01_t04_s03_f02", "c01_t04_s03_f02", "c01_t04_s03_f03", "c01_t04_s03_f03", "c01_t04_s03_f04", "c01_t04_s03_f04", "c01_t04_s03_f03", "c01_t04_s03_f03", "c01_t04_s03_f02", "c01_t04_s03_f02",],
        /*  68 */ ["c01_t04_s04_f01", "c01_t04_s04_f01", "c01_t04_s04_f02", "c01_t04_s04_f02", "c01_t04_s04_f03", "c01_t04_s04_f03", "c01_t04_s04_f04", "c01_t04_s04_f04", "c01_t04_s04_f03", "c01_t04_s04_f03", "c01_t04_s04_f02", "c01_t04_s04_f02",],
        /*  69 */ ["c01_t04_s05_f01", "c01_t04_s05_f01", "c01_t04_s05_f02", "c01_t04_s05_f02", "c01_t04_s05_f03", "c01_t04_s05_f03", "c01_t04_s05_f04", "c01_t04_s05_f04", "c01_t04_s05_f03", "c01_t04_s05_f03", "c01_t04_s05_f02", "c01_t04_s05_f02",],
        /*  70 */ ["c01_t04_s06_f01", "c01_t04_s06_f01", "c01_t04_s06_f02", "c01_t04_s06_f02", "c01_t04_s06_f03", "c01_t04_s06_f03", "c01_t04_s06_f04", "c01_t04_s06_f04", "c01_t04_s06_f03", "c01_t04_s06_f03", "c01_t04_s06_f02", "c01_t04_s06_f02",],
        /*  71 */ ["c01_t04_s07_f01", "c01_t04_s07_f01", "c01_t04_s07_f02", "c01_t04_s07_f02", "c01_t04_s07_f03", "c01_t04_s07_f03", "c01_t04_s07_f04", "c01_t04_s07_f04", "c01_t04_s07_f03", "c01_t04_s07_f03", "c01_t04_s07_f02", "c01_t04_s07_f02",],
        /*  72 */ ["c01_t04_s08_f01", "c01_t04_s08_f01", "c01_t04_s08_f02", "c01_t04_s08_f02", "c01_t04_s08_f03", "c01_t04_s08_f03", "c01_t04_s08_f04", "c01_t04_s08_f04", "c01_t04_s08_f03", "c01_t04_s08_f03", "c01_t04_s08_f02", "c01_t04_s08_f02",],
        /*  73 */ ["c01_t04_s09_f01", "c01_t04_s09_f01", "c01_t04_s09_f02", "c01_t04_s09_f02", "c01_t04_s09_f03", "c01_t04_s09_f03", "c01_t04_s09_f04", "c01_t04_s09_f04", "c01_t04_s09_f03", "c01_t04_s09_f03", "c01_t04_s09_f02", "c01_t04_s09_f02",],
        /*  74 */ ["c01_t04_s10_f01", "c01_t04_s10_f01", "c01_t04_s10_f02", "c01_t04_s10_f02", "c01_t04_s10_f03", "c01_t04_s10_f03", "c01_t04_s10_f04", "c01_t04_s10_f04", "c01_t04_s10_f03", "c01_t04_s10_f03", "c01_t04_s10_f02", "c01_t04_s10_f02",],
        /*  75 */ ["c01_t04_s11_f01", "c01_t04_s11_f01", "c01_t04_s11_f02", "c01_t04_s11_f02", "c01_t04_s11_f03", "c01_t04_s11_f03", "c01_t04_s11_f04", "c01_t04_s11_f04", "c01_t04_s11_f03", "c01_t04_s11_f03", "c01_t04_s11_f02", "c01_t04_s11_f02",],
        /*  76 */ ["c01_t04_s12_f01", "c01_t04_s12_f01", "c01_t04_s12_f02", "c01_t04_s12_f02", "c01_t04_s12_f03", "c01_t04_s12_f03", "c01_t04_s12_f04", "c01_t04_s12_f04", "c01_t04_s12_f03", "c01_t04_s12_f03", "c01_t04_s12_f02", "c01_t04_s12_f02",],
        /*  77 */ ["c01_t04_s13_f01", "c01_t04_s13_f01", "c01_t04_s13_f02", "c01_t04_s13_f02", "c01_t04_s13_f03", "c01_t04_s13_f03", "c01_t04_s13_f04", "c01_t04_s13_f04", "c01_t04_s13_f03", "c01_t04_s13_f03", "c01_t04_s13_f02", "c01_t04_s13_f02",],
        /*  78 */ ["c01_t04_s14_f01", "c01_t04_s14_f01", "c01_t04_s14_f02", "c01_t04_s14_f02", "c01_t04_s14_f03", "c01_t04_s14_f03", "c01_t04_s14_f04", "c01_t04_s14_f04", "c01_t04_s14_f03", "c01_t04_s14_f03", "c01_t04_s14_f02", "c01_t04_s14_f02",],
        /*  79 */ ["c01_t04_s15_f01", "c01_t04_s15_f01", "c01_t04_s15_f02", "c01_t04_s15_f02", "c01_t04_s15_f03", "c01_t04_s15_f03", "c01_t04_s15_f04", "c01_t04_s15_f04", "c01_t04_s15_f03", "c01_t04_s15_f03", "c01_t04_s15_f02", "c01_t04_s15_f02",],
        /*  80 */ ["c01_t04_s16_f01", "c01_t04_s16_f01", "c01_t04_s16_f02", "c01_t04_s16_f02", "c01_t04_s16_f03", "c01_t04_s16_f03", "c01_t04_s16_f04", "c01_t04_s16_f04", "c01_t04_s16_f03", "c01_t04_s16_f03", "c01_t04_s16_f02", "c01_t04_s16_f02",],
        /*  81 */ ["c01_t04_s17_f01", "c01_t04_s17_f01", "c01_t04_s17_f02", "c01_t04_s17_f02", "c01_t04_s17_f03", "c01_t04_s17_f03", "c01_t04_s17_f04", "c01_t04_s17_f04", "c01_t04_s17_f03", "c01_t04_s17_f03", "c01_t04_s17_f02", "c01_t04_s17_f02",],
        /*  82 */ ["c01_t04_s18_f01", "c01_t04_s18_f01", "c01_t04_s18_f02", "c01_t04_s18_f02", "c01_t04_s18_f03", "c01_t04_s18_f03", "c01_t04_s18_f04", "c01_t04_s18_f04", "c01_t04_s18_f03", "c01_t04_s18_f03", "c01_t04_s18_f02", "c01_t04_s18_f02",],
        /*  83 */ ["c01_t04_s19_f01", "c01_t04_s19_f01", "c01_t04_s19_f02", "c01_t04_s19_f02", "c01_t04_s19_f03", "c01_t04_s19_f03", "c01_t04_s19_f04", "c01_t04_s19_f04", "c01_t04_s19_f03", "c01_t04_s19_f03", "c01_t04_s19_f02", "c01_t04_s19_f02",],
        /*  84 */ ["c01_t04_s20_f01", "c01_t04_s20_f01", "c01_t04_s20_f02", "c01_t04_s20_f02", "c01_t04_s20_f03", "c01_t04_s20_f03", "c01_t04_s20_f04", "c01_t04_s20_f04", "c01_t04_s20_f03", "c01_t04_s20_f03", "c01_t04_s20_f02", "c01_t04_s20_f02",],
        /*  85 */ ["c01_t04_s21_f01", "c01_t04_s21_f01", "c01_t04_s21_f02", "c01_t04_s21_f02", "c01_t04_s21_f03", "c01_t04_s21_f03", "c01_t04_s21_f04", "c01_t04_s21_f04", "c01_t04_s21_f03", "c01_t04_s21_f03", "c01_t04_s21_f02", "c01_t04_s21_f02",],
        /*  86 */ ["c01_t04_s22_f01", "c01_t04_s22_f01", "c01_t04_s22_f02", "c01_t04_s22_f02", "c01_t04_s22_f03", "c01_t04_s22_f03", "c01_t04_s22_f04", "c01_t04_s22_f04", "c01_t04_s22_f03", "c01_t04_s22_f03", "c01_t04_s22_f02", "c01_t04_s22_f02",],
        /*  87 */ ["c01_t04_s23_f01", "c01_t04_s23_f01", "c01_t04_s23_f02", "c01_t04_s23_f02", "c01_t04_s23_f03", "c01_t04_s23_f03", "c01_t04_s23_f04", "c01_t04_s23_f04", "c01_t04_s23_f03", "c01_t04_s23_f03", "c01_t04_s23_f02", "c01_t04_s23_f02",],
        /*  88 */ ["c01_t04_s24_f01", "c01_t04_s24_f01", "c01_t04_s24_f02", "c01_t04_s24_f02", "c01_t04_s24_f03", "c01_t04_s24_f03", "c01_t04_s24_f04", "c01_t04_s24_f04", "c01_t04_s24_f03", "c01_t04_s24_f03", "c01_t04_s24_f02", "c01_t04_s24_f02",],
        /*  89 */ ["c01_t04_s25_f01", "c01_t04_s25_f01", "c01_t04_s25_f02", "c01_t04_s25_f02", "c01_t04_s25_f03", "c01_t04_s25_f03", "c01_t04_s25_f04", "c01_t04_s25_f04", "c01_t04_s25_f03", "c01_t04_s25_f03", "c01_t04_s25_f02", "c01_t04_s25_f02",],
        /*  90 */ ["c01_t04_s26_f01", "c01_t04_s26_f01", "c01_t04_s26_f02", "c01_t04_s26_f02", "c01_t04_s26_f03", "c01_t04_s26_f03", "c01_t04_s26_f04", "c01_t04_s26_f04", "c01_t04_s26_f03", "c01_t04_s26_f03", "c01_t04_s26_f02", "c01_t04_s26_f02",],
        /*  91 */ ["c01_t04_s27_f01", "c01_t04_s27_f01", "c01_t04_s27_f02", "c01_t04_s27_f02", "c01_t04_s27_f03", "c01_t04_s27_f03", "c01_t04_s27_f04", "c01_t04_s27_f04", "c01_t04_s27_f03", "c01_t04_s27_f03", "c01_t04_s27_f02", "c01_t04_s27_f02",],
        /*  92 */ ["c01_t04_s28_f01", "c01_t04_s28_f01", "c01_t04_s28_f02", "c01_t04_s28_f02", "c01_t04_s28_f03", "c01_t04_s28_f03", "c01_t04_s28_f04", "c01_t04_s28_f04", "c01_t04_s28_f03", "c01_t04_s28_f03", "c01_t04_s28_f02", "c01_t04_s28_f02",],
        /*  93 */ ["c01_t04_s29_f01", "c01_t04_s29_f01", "c01_t04_s29_f02", "c01_t04_s29_f02", "c01_t04_s29_f03", "c01_t04_s29_f03", "c01_t04_s29_f04", "c01_t04_s29_f04", "c01_t04_s29_f03", "c01_t04_s29_f03", "c01_t04_s29_f02", "c01_t04_s29_f02",],
        /*  94 */ ["c01_t04_s30_f01", "c01_t04_s30_f01", "c01_t04_s30_f02", "c01_t04_s30_f02", "c01_t04_s30_f03", "c01_t04_s30_f03", "c01_t04_s30_f04", "c01_t04_s30_f04", "c01_t04_s30_f03", "c01_t04_s30_f03", "c01_t04_s30_f02", "c01_t04_s30_f02",],
        /*  95 */ ["c01_t04_s31_f01", "c01_t04_s31_f01", "c01_t04_s31_f02", "c01_t04_s31_f02", "c01_t04_s31_f03", "c01_t04_s31_f03", "c01_t04_s31_f04", "c01_t04_s31_f04", "c01_t04_s31_f03", "c01_t04_s31_f03", "c01_t04_s31_f02", "c01_t04_s31_f02",],
        /*  96 */ ["c01_t04_s32_f01", "c01_t04_s32_f01", "c01_t04_s32_f02", "c01_t04_s32_f02", "c01_t04_s32_f03", "c01_t04_s32_f03", "c01_t04_s32_f04", "c01_t04_s32_f04", "c01_t04_s32_f03", "c01_t04_s32_f03", "c01_t04_s32_f02", "c01_t04_s32_f02",],
        /*  97 */ ["c01_t04_s33_f01", "c01_t04_s33_f01", "c01_t04_s33_f02", "c01_t04_s33_f02", "c01_t04_s33_f03", "c01_t04_s33_f03", "c01_t04_s33_f04", "c01_t04_s33_f04", "c01_t04_s33_f03", "c01_t04_s33_f03", "c01_t04_s33_f02", "c01_t04_s33_f02",],
        /*  98 */ ["c01_t04_s34_f01", "c01_t04_s34_f01", "c01_t04_s34_f02", "c01_t04_s34_f02", "c01_t04_s34_f03", "c01_t04_s34_f03", "c01_t04_s34_f04", "c01_t04_s34_f04", "c01_t04_s34_f03", "c01_t04_s34_f03", "c01_t04_s34_f02", "c01_t04_s34_f02",],
        /*  99 */ ["c01_t04_s35_f01", "c01_t04_s35_f01", "c01_t04_s35_f02", "c01_t04_s35_f02", "c01_t04_s35_f03", "c01_t04_s35_f03", "c01_t04_s35_f04", "c01_t04_s35_f04", "c01_t04_s35_f03", "c01_t04_s35_f03", "c01_t04_s35_f02", "c01_t04_s35_f02",],
        /* 100 */ ["c01_t04_s36_f01", "c01_t04_s36_f01", "c01_t04_s36_f02", "c01_t04_s36_f02", "c01_t04_s36_f03", "c01_t04_s36_f03", "c01_t04_s36_f04", "c01_t04_s36_f04", "c01_t04_s36_f03", "c01_t04_s36_f03", "c01_t04_s36_f02", "c01_t04_s36_f02",],
    ];

    const TILE_OBJECT_IMAGE_SOURCES: Readonly<string[]>[] = [
        /*   0 */ [],

        ////////// road * 11 //////////
        /*   1 */ ["c02_t001_s01_f01",],
        /*   2 */ ["c02_t001_s02_f01",],
        /*   3 */ ["c02_t001_s03_f01",],
        /*   4 */ ["c02_t001_s04_f01",],
        /*   5 */ ["c02_t001_s05_f01",],
        /*   6 */ ["c02_t001_s06_f01",],
        /*   7 */ ["c02_t001_s07_f01",],
        /*   8 */ ["c02_t001_s08_f01",],
        /*   9 */ ["c02_t001_s09_f01",],
        /*  10 */ ["c02_t001_s10_f01",],
        /*  11 */ ["c02_t001_s11_f01",],

        ////////// bridge * 11 //////////
        /*  12 */ ["c02_t002_s01_f01",],
        /*  13 */ ["c02_t002_s02_f01",],
        /*  14 */ ["c02_t002_s03_f01",],
        /*  15 */ ["c02_t002_s04_f01",],
        /*  16 */ ["c02_t002_s05_f01",],
        /*  17 */ ["c02_t002_s06_f01",],
        /*  18 */ ["c02_t002_s07_f01",],
        /*  19 */ ["c02_t002_s08_f01",],
        /*  20 */ ["c02_t002_s09_f01",],
        /*  21 */ ["c02_t002_s10_f01",],
        /*  22 */ ["c02_t002_s11_f01",],

        ////////// wood * 1 //////////
        /*  23 */ ["c02_t003_s01_f01",],

        ////////// mountain * 1 //////////
        /*  24 */ ["c02_t004_s01_f01",],

        ////////// wasteland * 1 //////////
        /*  25 */ ["c02_t005_s01_f01",],

        ////////// ruin * 1 //////////
        /*  26 */ ["c02_t006_s01_f01",],

        ////////// fire * 1 //////////
        /*  27 */ ["c02_t007_s01_f01", "c02_t007_s01_f02", "c02_t007_s01_f03", "c02_t007_s01_f04", "c02_t007_s01_f05",],

        ////////// rough * 1 //////////
        /*  28 */ ["c02_t008_s01_f01", "c02_t008_s01_f01", "c02_t008_s01_f02", "c02_t008_s01_f02", "c02_t008_s01_f03", "c02_t008_s01_f03", "c02_t008_s01_f04", "c02_t008_s01_f04", "c02_t008_s01_f03", "c02_t008_s01_f03", "c02_t008_s01_f02", "c02_t008_s01_f02",],

        ////////// mist * 1 //////////
        /*  29 */ ["c02_t009_s01_f01",],

        ////////// reef * 1 //////////
        /*  30 */ ["c02_t010_s01_f01", "c02_t010_s01_f01", "c02_t010_s01_f02", "c02_t010_s01_f02", "c02_t010_s01_f03", "c02_t010_s01_f03", "c02_t010_s01_f04", "c02_t010_s01_f04", "c02_t010_s01_f03", "c02_t010_s01_f03", "c02_t010_s01_f02", "c02_t010_s01_f02",],

        ////////// plasma * 16 //////////
        /*  31 */ ["c02_t011_s01_f01", "c02_t011_s01_f02", "c02_t011_s01_f03",],
        /*  32 */ ["c02_t011_s02_f01", "c02_t011_s02_f02", "c02_t011_s02_f03",],
        /*  33 */ ["c02_t011_s03_f01", "c02_t011_s03_f02", "c02_t011_s03_f03",],
        /*  34 */ ["c02_t011_s04_f01", "c02_t011_s04_f02", "c02_t011_s04_f03",],
        /*  35 */ ["c02_t011_s05_f01", "c02_t011_s05_f02", "c02_t011_s05_f03",],
        /*  36 */ ["c02_t011_s06_f01", "c02_t011_s06_f02", "c02_t011_s06_f03",],
        /*  37 */ ["c02_t011_s07_f01", "c02_t011_s07_f02", "c02_t011_s07_f03",],
        /*  38 */ ["c02_t011_s08_f01", "c02_t011_s08_f02", "c02_t011_s08_f03",],
        /*  39 */ ["c02_t011_s09_f01", "c02_t011_s09_f02", "c02_t011_s09_f03",],
        /*  40 */ ["c02_t011_s10_f01", "c02_t011_s10_f02", "c02_t011_s10_f03",],
        /*  41 */ ["c02_t011_s11_f01", "c02_t011_s11_f02", "c02_t011_s11_f03",],
        /*  42 */ ["c02_t011_s12_f01", "c02_t011_s12_f02", "c02_t011_s12_f03",],
        /*  43 */ ["c02_t011_s13_f01", "c02_t011_s13_f02", "c02_t011_s13_f03",],
        /*  44 */ ["c02_t011_s14_f01", "c02_t011_s14_f02", "c02_t011_s14_f03",],
        /*  45 */ ["c02_t011_s15_f01", "c02_t011_s15_f02", "c02_t011_s15_f03",],
        /*  46 */ ["c02_t011_s16_f01", "c02_t011_s16_f02", "c02_t011_s16_f03",],

        ////////// meteor * 1 //////////
        /*  47 */ ["c02_t012_s01_f01",],

        ////////// silo * 1 //////////
        /*  48 */ ["c02_t013_s01_f01",],

        ////////// emptysilo * 1 //////////
        /*  49 */ ["c02_t014_s01_f01",],

        ////////// headquaters * 4 //////////
        /*  50 */ ["c02_t015_s01_f01", "c02_t015_s01_f01", "c02_t015_s01_f01", "c02_t015_s01_f02", "c02_t015_s01_f02", "c02_t015_s01_f02",],
        /*  51 */ ["c02_t015_s02_f01", "c02_t015_s02_f01", "c02_t015_s02_f01", "c02_t015_s02_f02", "c02_t015_s02_f02", "c02_t015_s02_f02",],
        /*  52 */ ["c02_t015_s03_f01", "c02_t015_s03_f01", "c02_t015_s03_f01", "c02_t015_s03_f02", "c02_t015_s03_f02", "c02_t015_s03_f02",],
        /*  53 */ ["c02_t015_s04_f01", "c02_t015_s04_f01", "c02_t015_s04_f01", "c02_t015_s04_f02", "c02_t015_s04_f02", "c02_t015_s04_f02",],

        ////////// city * 5 //////////
        /*  54 */ ["c02_t016_s01_f01", "c02_t016_s01_f01", "c02_t016_s01_f01", "c02_t016_s01_f02", "c02_t016_s01_f02", "c02_t016_s01_f02",],
        /*  55 */ ["c02_t016_s02_f01", "c02_t016_s02_f01", "c02_t016_s02_f01", "c02_t016_s02_f02", "c02_t016_s02_f02", "c02_t016_s02_f02",],
        /*  56 */ ["c02_t016_s03_f01", "c02_t016_s03_f01", "c02_t016_s03_f01", "c02_t016_s03_f02", "c02_t016_s03_f02", "c02_t016_s03_f02",],
        /*  57 */ ["c02_t016_s04_f01", "c02_t016_s04_f01", "c02_t016_s04_f01", "c02_t016_s04_f02", "c02_t016_s04_f02", "c02_t016_s04_f02",],
        /*  58 */ ["c02_t016_s05_f01", "c02_t016_s05_f01", "c02_t016_s05_f01", "c02_t016_s05_f02", "c02_t016_s05_f02", "c02_t016_s05_f02",],

        ////////// commandtower * 5 //////////
        /*  59 */ ["c02_t017_s01_f01", "c02_t017_s01_f01", "c02_t017_s01_f01", "c02_t017_s01_f02", "c02_t017_s01_f02", "c02_t017_s01_f02",],
        /*  60 */ ["c02_t017_s02_f01", "c02_t017_s02_f01", "c02_t017_s02_f01", "c02_t017_s02_f02", "c02_t017_s02_f02", "c02_t017_s02_f02",],
        /*  61 */ ["c02_t017_s03_f01", "c02_t017_s03_f01", "c02_t017_s03_f01", "c02_t017_s03_f02", "c02_t017_s03_f02", "c02_t017_s03_f02",],
        /*  62 */ ["c02_t017_s04_f01", "c02_t017_s04_f01", "c02_t017_s04_f01", "c02_t017_s04_f02", "c02_t017_s04_f02", "c02_t017_s04_f02",],
        /*  63 */ ["c02_t017_s05_f01", "c02_t017_s05_f01", "c02_t017_s05_f01", "c02_t017_s05_f02", "c02_t017_s05_f02", "c02_t017_s05_f02",],

        ////////// radar * 5 //////////
        /*  64 */ ["c02_t018_s01_f01", "c02_t018_s01_f01", "c02_t018_s01_f01", "c02_t018_s01_f02", "c02_t018_s01_f02", "c02_t018_s01_f02",],
        /*  65 */ ["c02_t018_s02_f01", "c02_t018_s02_f01", "c02_t018_s02_f01", "c02_t018_s02_f02", "c02_t018_s02_f02", "c02_t018_s02_f02",],
        /*  66 */ ["c02_t018_s03_f01", "c02_t018_s03_f01", "c02_t018_s03_f01", "c02_t018_s03_f02", "c02_t018_s03_f02", "c02_t018_s03_f02",],
        /*  67 */ ["c02_t018_s04_f01", "c02_t018_s04_f01", "c02_t018_s04_f01", "c02_t018_s04_f02", "c02_t018_s04_f02", "c02_t018_s04_f02",],
        /*  68 */ ["c02_t018_s05_f01", "c02_t018_s05_f01", "c02_t018_s05_f01", "c02_t018_s05_f02", "c02_t018_s05_f02", "c02_t018_s05_f02",],

        ////////// factory * 5 //////////
        /*  69 */ ["c02_t019_s01_f01", "c02_t019_s01_f01", "c02_t019_s01_f01", "c02_t019_s01_f02", "c02_t019_s01_f02", "c02_t019_s01_f02",],
        /*  70 */ ["c02_t019_s02_f01", "c02_t019_s02_f01", "c02_t019_s02_f01", "c02_t019_s02_f02", "c02_t019_s02_f02", "c02_t019_s02_f02",],
        /*  71 */ ["c02_t019_s03_f01", "c02_t019_s03_f01", "c02_t019_s03_f01", "c02_t019_s03_f02", "c02_t019_s03_f02", "c02_t019_s03_f02",],
        /*  72 */ ["c02_t019_s04_f01", "c02_t019_s04_f01", "c02_t019_s04_f01", "c02_t019_s04_f02", "c02_t019_s04_f02", "c02_t019_s04_f02",],
        /*  73 */ ["c02_t019_s05_f01", "c02_t019_s05_f01", "c02_t019_s05_f01", "c02_t019_s05_f02", "c02_t019_s05_f02", "c02_t019_s05_f02",],

        ////////// airport * 5 //////////
        /*  74 */ ["c02_t020_s01_f01", "c02_t020_s01_f01", "c02_t020_s01_f01", "c02_t020_s01_f02", "c02_t020_s01_f02", "c02_t020_s01_f02",],
        /*  75 */ ["c02_t020_s02_f01", "c02_t020_s02_f01", "c02_t020_s02_f01", "c02_t020_s02_f02", "c02_t020_s02_f02", "c02_t020_s02_f02",],
        /*  76 */ ["c02_t020_s03_f01", "c02_t020_s03_f01", "c02_t020_s03_f01", "c02_t020_s03_f02", "c02_t020_s03_f02", "c02_t020_s03_f02",],
        /*  77 */ ["c02_t020_s04_f01", "c02_t020_s04_f01", "c02_t020_s04_f01", "c02_t020_s04_f02", "c02_t020_s04_f02", "c02_t020_s04_f02",],
        /*  78 */ ["c02_t020_s05_f01", "c02_t020_s05_f01", "c02_t020_s05_f01", "c02_t020_s05_f02", "c02_t020_s05_f02", "c02_t020_s05_f02",],

        ////////// seaport * 5 //////////
        /*  79 */ ["c02_t021_s01_f01", "c02_t021_s01_f01", "c02_t021_s01_f01", "c02_t021_s01_f02", "c02_t021_s01_f02", "c02_t021_s01_f02",],
        /*  80 */ ["c02_t021_s02_f01", "c02_t021_s02_f01", "c02_t021_s02_f01", "c02_t021_s02_f02", "c02_t021_s02_f02", "c02_t021_s02_f02",],
        /*  81 */ ["c02_t021_s03_f01", "c02_t021_s03_f01", "c02_t021_s03_f01", "c02_t021_s03_f02", "c02_t021_s03_f02", "c02_t021_s03_f02",],
        /*  82 */ ["c02_t021_s04_f01", "c02_t021_s04_f01", "c02_t021_s04_f01", "c02_t021_s04_f02", "c02_t021_s04_f02", "c02_t021_s04_f02",],
        /*  83 */ ["c02_t021_s05_f01", "c02_t021_s05_f01", "c02_t021_s05_f01", "c02_t021_s05_f02", "c02_t021_s05_f02", "c02_t021_s05_f02",],

        ////////// tempairport * 5 //////////
        /*  84 */ ["c02_t022_s01_f01",],
        /*  85 */ ["c02_t022_s02_f01",],
        /*  86 */ ["c02_t022_s03_f01",],
        /*  87 */ ["c02_t022_s04_f01",],
        /*  88 */ ["c02_t022_s05_f01",],

        ////////// tempseaport * 5 //////////
        /*  89 */ ["c02_t023_s01_f01",],
        /*  90 */ ["c02_t023_s02_f01",],
        /*  91 */ ["c02_t023_s03_f01",],
        /*  92 */ ["c02_t023_s04_f01",],
        /*  93 */ ["c02_t023_s05_f01",],

        ////////// greenplasma * 16 //////////
        /*  94 */ ["c02_t024_s01_f01", "c02_t024_s01_f02", "c02_t024_s01_f03",],
        /*  95 */ ["c02_t024_s02_f01", "c02_t024_s02_f02", "c02_t024_s02_f03",],
        /*  96 */ ["c02_t024_s03_f01", "c02_t024_s03_f02", "c02_t024_s03_f03",],
        /*  97 */ ["c02_t024_s04_f01", "c02_t024_s04_f02", "c02_t024_s04_f03",],
        /*  98 */ ["c02_t024_s05_f01", "c02_t024_s05_f02", "c02_t024_s05_f03",],
        /*  99 */ ["c02_t024_s06_f01", "c02_t024_s06_f02", "c02_t024_s06_f03",],
        /* 100 */ ["c02_t024_s07_f01", "c02_t024_s07_f02", "c02_t024_s07_f03",],
        /* 101 */ ["c02_t024_s08_f01", "c02_t024_s08_f02", "c02_t024_s08_f03",],
        /* 102 */ ["c02_t024_s09_f01", "c02_t024_s09_f02", "c02_t024_s09_f03",],
        /* 103 */ ["c02_t024_s10_f01", "c02_t024_s10_f02", "c02_t024_s10_f03",],
        /* 104 */ ["c02_t024_s11_f01", "c02_t024_s11_f02", "c02_t024_s11_f03",],
        /* 105 */ ["c02_t024_s12_f01", "c02_t024_s12_f02", "c02_t024_s12_f03",],
        /* 106 */ ["c02_t024_s13_f01", "c02_t024_s13_f02", "c02_t024_s13_f03",],
        /* 107 */ ["c02_t024_s14_f01", "c02_t024_s14_f02", "c02_t024_s14_f03",],
        /* 108 */ ["c02_t024_s15_f01", "c02_t024_s15_f02", "c02_t024_s15_f03",],
        /* 109 */ ["c02_t024_s16_f01", "c02_t024_s16_f02", "c02_t024_s16_f03",],
    ];

    const TILE_BASE_TYPES: Readonly<TileBaseType[]> = [
        ////////// empty: 0 (1 total) //////////
        TileBaseType.Empty,

        ////////// plain: 1 (1 total) //////////
        TileBaseType.Plain,

        ////////// river: 2 - 17 (16 total) //////////
        TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River,
        TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River,
        TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River, TileBaseType.River,
        TileBaseType.River,

        ////////// sea: 18 - 64 (47 total) //////////
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,   TileBaseType.Sea,
        TileBaseType.Sea,   TileBaseType.Sea,

        ////////// beach: 65 - 100 (36 total) //////////
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach, TileBaseType.Beach,
        TileBaseType.Beach,
    ];

    const TILE_OBJECT_TYPES_AND_PLAYER_INDEX: Readonly<TileObjectTypeAndPlayerIndex[]> = [
        ////////// empty //////////
        /*   0 */ { tileObjectType: TileObjectType.Empty, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// road //////////
        /*   1 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   2 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   3 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   4 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   5 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   6 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   7 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   8 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*   9 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  10 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  11 */ { tileObjectType: TileObjectType.Road, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// bridge //////////
        /*  12 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  13 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  14 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  15 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  16 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  17 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  18 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  19 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  20 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  21 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  22 */ { tileObjectType: TileObjectType.Bridge, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// wood //////////
        /*  23 */ { tileObjectType: TileObjectType.Wood, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// mountain //////////
        /*  24 */ { tileObjectType: TileObjectType.Mountain, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// wasteland //////////
        /*  25 */ { tileObjectType: TileObjectType.Wasteland, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// ruins //////////
        /*  26 */ { tileObjectType: TileObjectType.Ruins, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// fire //////////
        /*  27 */ { tileObjectType: TileObjectType.Fire, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// rough //////////
        /*  28 */ { tileObjectType: TileObjectType.Rough, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// mist //////////
        /*  29 */ { tileObjectType: TileObjectType.Mist, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// reef //////////
        /*  30 */ { tileObjectType: TileObjectType.Reef, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// plasma //////////
        /*  31 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  32 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  33 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  34 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  35 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  36 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  37 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  38 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  39 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  40 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  41 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  42 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  43 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  44 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  45 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  46 */ { tileObjectType: TileObjectType.Plasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// meteor //////////
        /*  47 */ { tileObjectType: TileObjectType.Meteor, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// silo //////////
        /*  48 */ { tileObjectType: TileObjectType.Silo, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// emptysilo //////////
        /*  49 */ { tileObjectType: TileObjectType.EmptySilo, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,

        ////////// headquaters //////////
        /*  50 */ { tileObjectType: TileObjectType.Headquarters, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  51 */ { tileObjectType: TileObjectType.Headquarters, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  52 */ { tileObjectType: TileObjectType.Headquarters, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  53 */ { tileObjectType: TileObjectType.Headquarters, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// city //////////
        /*  54 */ { tileObjectType: TileObjectType.City, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  55 */ { tileObjectType: TileObjectType.City, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  56 */ { tileObjectType: TileObjectType.City, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  57 */ { tileObjectType: TileObjectType.City, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  58 */ { tileObjectType: TileObjectType.City, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// commandtower //////////
        /*  59 */ { tileObjectType: TileObjectType.CommandTower, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  60 */ { tileObjectType: TileObjectType.CommandTower, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  61 */ { tileObjectType: TileObjectType.CommandTower, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  62 */ { tileObjectType: TileObjectType.CommandTower, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  63 */ { tileObjectType: TileObjectType.CommandTower, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// radar //////////
        /*  64 */ { tileObjectType: TileObjectType.Radar, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  65 */ { tileObjectType: TileObjectType.Radar, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  66 */ { tileObjectType: TileObjectType.Radar, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  67 */ { tileObjectType: TileObjectType.Radar, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  68 */ { tileObjectType: TileObjectType.Radar, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// factory //////////
        /*  69 */ { tileObjectType: TileObjectType.Factory, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  70 */ { tileObjectType: TileObjectType.Factory, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  71 */ { tileObjectType: TileObjectType.Factory, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  72 */ { tileObjectType: TileObjectType.Factory, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  73 */ { tileObjectType: TileObjectType.Factory, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// airport //////////
        /*  74 */ { tileObjectType: TileObjectType.Airport, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  75 */ { tileObjectType: TileObjectType.Airport, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  76 */ { tileObjectType: TileObjectType.Airport, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  77 */ { tileObjectType: TileObjectType.Airport, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  78 */ { tileObjectType: TileObjectType.Airport, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// seaport //////////
        /*  79 */ { tileObjectType: TileObjectType.Seaport, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  80 */ { tileObjectType: TileObjectType.Seaport, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  81 */ { tileObjectType: TileObjectType.Seaport, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  82 */ { tileObjectType: TileObjectType.Seaport, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  83 */ { tileObjectType: TileObjectType.Seaport, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// tempairport //////////
        /*  84 */ { tileObjectType: TileObjectType.TempAirport, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  85 */ { tileObjectType: TileObjectType.TempAirport, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  86 */ { tileObjectType: TileObjectType.TempAirport, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  87 */ { tileObjectType: TileObjectType.TempAirport, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  88 */ { tileObjectType: TileObjectType.TempAirport, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// tempseaport //////////
        /*  89 */ { tileObjectType: TileObjectType.TempSeaport, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  90 */ { tileObjectType: TileObjectType.TempSeaport, playerIndex: 1 } as TileObjectTypeAndPlayerIndex,
        /*  91 */ { tileObjectType: TileObjectType.TempSeaport, playerIndex: 2 } as TileObjectTypeAndPlayerIndex,
        /*  92 */ { tileObjectType: TileObjectType.TempSeaport, playerIndex: 3 } as TileObjectTypeAndPlayerIndex,
        /*  93 */ { tileObjectType: TileObjectType.TempSeaport, playerIndex: 4 } as TileObjectTypeAndPlayerIndex,

        ////////// greenplasma //////////
        /*  94 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  95 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  96 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  97 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  98 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /*  99 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 100 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 101 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 102 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 103 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 104 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 105 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 106 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 107 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 108 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
        /* 109 */ { tileObjectType: TileObjectType.GreenPlasma, playerIndex: 0 } as TileObjectTypeAndPlayerIndex,
    ];

    const UNIT_TYPES_AND_PLAYER_INDEX: Readonly<UnitTypeAndPlayerIndex[]> = [
        ////////// empty //////////
        /*   0 */ undefined,

        ////////// infantry //////////
        /*   1 */ { unitType: UnitType.Infantry, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*   2 */ { unitType: UnitType.Infantry, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*   3 */ { unitType: UnitType.Infantry, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*   4 */ { unitType: UnitType.Infantry, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// mech //////////
        /*   5 */ { unitType: UnitType.Mech, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*   6 */ { unitType: UnitType.Mech, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*   7 */ { unitType: UnitType.Mech, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*   8 */ { unitType: UnitType.Mech, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// bike //////////
        /*   9 */ { unitType: UnitType.Bike, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  10 */ { unitType: UnitType.Bike, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  11 */ { unitType: UnitType.Bike, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  12 */ { unitType: UnitType.Bike, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// recon //////////
        /*  13 */ { unitType: UnitType.Recon, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  14 */ { unitType: UnitType.Recon, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  15 */ { unitType: UnitType.Recon, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  16 */ { unitType: UnitType.Recon, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// flare //////////
        /*  17 */ { unitType: UnitType.Flare, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  18 */ { unitType: UnitType.Flare, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  19 */ { unitType: UnitType.Flare, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  20 */ { unitType: UnitType.Flare, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// antiair //////////
        /*  21 */ { unitType: UnitType.AntiAir, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  22 */ { unitType: UnitType.AntiAir, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  23 */ { unitType: UnitType.AntiAir, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  24 */ { unitType: UnitType.AntiAir, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// tank //////////
        /*  25 */ { unitType: UnitType.Tank, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  26 */ { unitType: UnitType.Tank, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  27 */ { unitType: UnitType.Tank, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  28 */ { unitType: UnitType.Tank, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// mediumtank //////////
        /*  29 */ { unitType: UnitType.MediumTank, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  30 */ { unitType: UnitType.MediumTank, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  31 */ { unitType: UnitType.MediumTank, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  32 */ { unitType: UnitType.MediumTank, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// wartank //////////
        /*  33 */ { unitType: UnitType.WarTank, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  34 */ { unitType: UnitType.WarTank, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  35 */ { unitType: UnitType.WarTank, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  36 */ { unitType: UnitType.WarTank, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// artillery //////////
        /*  37 */ { unitType: UnitType.Artillery, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  38 */ { unitType: UnitType.Artillery, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  39 */ { unitType: UnitType.Artillery, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  40 */ { unitType: UnitType.Artillery, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// antitank //////////
        /*  41 */ { unitType: UnitType.AntiTank, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  42 */ { unitType: UnitType.AntiTank, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  43 */ { unitType: UnitType.AntiTank, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  44 */ { unitType: UnitType.AntiTank, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// rockets //////////
        /*  45 */ { unitType: UnitType.Rockets, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  46 */ { unitType: UnitType.Rockets, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  47 */ { unitType: UnitType.Rockets, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  48 */ { unitType: UnitType.Rockets, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// missiles //////////
        /*  49 */ { unitType: UnitType.Missiles, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  50 */ { unitType: UnitType.Missiles, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  51 */ { unitType: UnitType.Missiles, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  52 */ { unitType: UnitType.Missiles, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// rig //////////
        /*  53 */ { unitType: UnitType.Rig, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  54 */ { unitType: UnitType.Rig, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  55 */ { unitType: UnitType.Rig, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  56 */ { unitType: UnitType.Rig, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// fighter //////////
        /*  57 */ { unitType: UnitType.Fighter, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  58 */ { unitType: UnitType.Fighter, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  59 */ { unitType: UnitType.Fighter, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  60 */ { unitType: UnitType.Fighter, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// bomber //////////
        /*  61 */ { unitType: UnitType.Bomber, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  62 */ { unitType: UnitType.Bomber, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  63 */ { unitType: UnitType.Bomber, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  64 */ { unitType: UnitType.Bomber, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// duster //////////
        /*  65 */ { unitType: UnitType.Duster, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  66 */ { unitType: UnitType.Duster, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  67 */ { unitType: UnitType.Duster, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  68 */ { unitType: UnitType.Duster, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// battlecopter //////////
        /*  69 */ { unitType: UnitType.BattleCopter, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  70 */ { unitType: UnitType.BattleCopter, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  71 */ { unitType: UnitType.BattleCopter, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  72 */ { unitType: UnitType.BattleCopter, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// transportcopter //////////
        /*  73 */ { unitType: UnitType.TransportCopter, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  74 */ { unitType: UnitType.TransportCopter, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  75 */ { unitType: UnitType.TransportCopter, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  76 */ { unitType: UnitType.TransportCopter, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// seaplane //////////
        /*  77 */ { unitType: UnitType.Seaplane, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  78 */ { unitType: UnitType.Seaplane, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  79 */ { unitType: UnitType.Seaplane, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  80 */ { unitType: UnitType.Seaplane, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// battleship //////////
        /*  81 */ { unitType: UnitType.Battleship, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  82 */ { unitType: UnitType.Battleship, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  83 */ { unitType: UnitType.Battleship, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  84 */ { unitType: UnitType.Battleship, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// carrier //////////
        /*  85 */ { unitType: UnitType.Carrier, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  86 */ { unitType: UnitType.Carrier, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  87 */ { unitType: UnitType.Carrier, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  88 */ { unitType: UnitType.Carrier, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// submarine //////////
        /*  89 */ { unitType: UnitType.Submarine, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  90 */ { unitType: UnitType.Submarine, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  91 */ { unitType: UnitType.Submarine, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  92 */ { unitType: UnitType.Submarine, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// cruiser //////////
        /*  93 */ { unitType: UnitType.Cruiser, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  94 */ { unitType: UnitType.Cruiser, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  95 */ { unitType: UnitType.Cruiser, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /*  96 */ { unitType: UnitType.Cruiser, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// lander //////////
        /*  97 */ { unitType: UnitType.Lander, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /*  98 */ { unitType: UnitType.Lander, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /*  99 */ { unitType: UnitType.Lander, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /* 100 */ { unitType: UnitType.Lander, playerIndex: 4 } as UnitTypeAndPlayerIndex,

        ////////// gunboat //////////
        /* 101 */ { unitType: UnitType.Gunboat, playerIndex: 1 } as UnitTypeAndPlayerIndex,
        /* 102 */ { unitType: UnitType.Gunboat, playerIndex: 2 } as UnitTypeAndPlayerIndex,
        /* 103 */ { unitType: UnitType.Gunboat, playerIndex: 3 } as UnitTypeAndPlayerIndex,
        /* 104 */ { unitType: UnitType.Gunboat, playerIndex: 4 } as UnitTypeAndPlayerIndex,
    ];

    const UNIT_IDLE_IMAGE_SOURCES: Readonly<string[]>[] = [
        /*   0 */ [],

        ////////// infantry //////////
        /*   1 */ ["c03_t01_s01_f01", "c03_t01_s01_f01", "c03_t01_s01_f02", "c03_t01_s01_f02", "c03_t01_s01_f03", "c03_t01_s01_f03", "c03_t01_s01_f04", "c03_t01_s01_f04",],
        /*   2 */ ["c03_t01_s02_f01", "c03_t01_s02_f01", "c03_t01_s02_f02", "c03_t01_s02_f02", "c03_t01_s02_f03", "c03_t01_s02_f03", "c03_t01_s02_f04", "c03_t01_s02_f04",],
        /*   3 */ ["c03_t01_s03_f01", "c03_t01_s03_f01", "c03_t01_s03_f02", "c03_t01_s03_f02", "c03_t01_s03_f03", "c03_t01_s03_f03", "c03_t01_s03_f04", "c03_t01_s03_f04",],
        /*   4 */ ["c03_t01_s04_f01", "c03_t01_s04_f01", "c03_t01_s04_f02", "c03_t01_s04_f02", "c03_t01_s04_f03", "c03_t01_s04_f03", "c03_t01_s04_f04", "c03_t01_s04_f04",],

        ////////// mech //////////
        /*   5 */ ["c03_t02_s01_f01", "c03_t02_s01_f01", "c03_t02_s01_f02", "c03_t02_s01_f02", "c03_t02_s01_f03", "c03_t02_s01_f03", "c03_t02_s01_f04", "c03_t02_s01_f04",],
        /*   6 */ ["c03_t02_s02_f01", "c03_t02_s02_f01", "c03_t02_s02_f02", "c03_t02_s02_f02", "c03_t02_s02_f03", "c03_t02_s02_f03", "c03_t02_s02_f04", "c03_t02_s02_f04",],
        /*   7 */ ["c03_t02_s03_f01", "c03_t02_s03_f01", "c03_t02_s03_f02", "c03_t02_s03_f02", "c03_t02_s03_f03", "c03_t02_s03_f03", "c03_t02_s03_f04", "c03_t02_s03_f04",],
        /*   8 */ ["c03_t02_s04_f01", "c03_t02_s04_f01", "c03_t02_s04_f02", "c03_t02_s04_f02", "c03_t02_s04_f03", "c03_t02_s04_f03", "c03_t02_s04_f04", "c03_t02_s04_f04",],

        ////////// bike //////////
        /*   9 */ ["c03_t03_s01_f01", "c03_t03_s01_f01", "c03_t03_s01_f02", "c03_t03_s01_f02", "c03_t03_s01_f03", "c03_t03_s01_f03", "c03_t03_s01_f04", "c03_t03_s01_f04",],
        /*  10 */ ["c03_t03_s02_f01", "c03_t03_s02_f01", "c03_t03_s02_f02", "c03_t03_s02_f02", "c03_t03_s02_f03", "c03_t03_s02_f03", "c03_t03_s02_f04", "c03_t03_s02_f04",],
        /*  11 */ ["c03_t03_s03_f01", "c03_t03_s03_f01", "c03_t03_s03_f02", "c03_t03_s03_f02", "c03_t03_s03_f03", "c03_t03_s03_f03", "c03_t03_s03_f04", "c03_t03_s03_f04",],
        /*  12 */ ["c03_t03_s04_f01", "c03_t03_s04_f01", "c03_t03_s04_f02", "c03_t03_s04_f02", "c03_t03_s04_f03", "c03_t03_s04_f03", "c03_t03_s04_f04", "c03_t03_s04_f04",],

        ////////// recon //////////
        /*  13 */ ["c03_t04_s01_f01", "c03_t04_s01_f01", "c03_t04_s01_f02", "c03_t04_s01_f02", "c03_t04_s01_f03", "c03_t04_s01_f03", "c03_t04_s01_f04", "c03_t04_s01_f04",],
        /*  14 */ ["c03_t04_s02_f01", "c03_t04_s02_f01", "c03_t04_s02_f02", "c03_t04_s02_f02", "c03_t04_s02_f03", "c03_t04_s02_f03", "c03_t04_s02_f04", "c03_t04_s02_f04",],
        /*  15 */ ["c03_t04_s03_f01", "c03_t04_s03_f01", "c03_t04_s03_f02", "c03_t04_s03_f02", "c03_t04_s03_f03", "c03_t04_s03_f03", "c03_t04_s03_f04", "c03_t04_s03_f04",],
        /*  16 */ ["c03_t04_s04_f01", "c03_t04_s04_f01", "c03_t04_s04_f02", "c03_t04_s04_f02", "c03_t04_s04_f03", "c03_t04_s04_f03", "c03_t04_s04_f04", "c03_t04_s04_f04",],

        ////////// flare //////////
        /*  17 */ ["c03_t05_s01_f01", "c03_t05_s01_f01", "c03_t05_s01_f02", "c03_t05_s01_f02", "c03_t05_s01_f03", "c03_t05_s01_f03", "c03_t05_s01_f04", "c03_t05_s01_f04",],
        /*  18 */ ["c03_t05_s02_f01", "c03_t05_s02_f01", "c03_t05_s02_f02", "c03_t05_s02_f02", "c03_t05_s02_f03", "c03_t05_s02_f03", "c03_t05_s02_f04", "c03_t05_s02_f04",],
        /*  19 */ ["c03_t05_s03_f01", "c03_t05_s03_f01", "c03_t05_s03_f02", "c03_t05_s03_f02", "c03_t05_s03_f03", "c03_t05_s03_f03", "c03_t05_s03_f04", "c03_t05_s03_f04",],
        /*  20 */ ["c03_t05_s04_f01", "c03_t05_s04_f01", "c03_t05_s04_f02", "c03_t05_s04_f02", "c03_t05_s04_f03", "c03_t05_s04_f03", "c03_t05_s04_f04", "c03_t05_s04_f04",],

        ////////// antiair //////////
        /*  21 */ ["c03_t06_s01_f01", "c03_t06_s01_f01", "c03_t06_s01_f02", "c03_t06_s01_f02", "c03_t06_s01_f03", "c03_t06_s01_f03", "c03_t06_s01_f04", "c03_t06_s01_f04",],
        /*  22 */ ["c03_t06_s02_f01", "c03_t06_s02_f01", "c03_t06_s02_f02", "c03_t06_s02_f02", "c03_t06_s02_f03", "c03_t06_s02_f03", "c03_t06_s02_f04", "c03_t06_s02_f04",],
        /*  23 */ ["c03_t06_s03_f01", "c03_t06_s03_f01", "c03_t06_s03_f02", "c03_t06_s03_f02", "c03_t06_s03_f03", "c03_t06_s03_f03", "c03_t06_s03_f04", "c03_t06_s03_f04",],
        /*  24 */ ["c03_t06_s04_f01", "c03_t06_s04_f01", "c03_t06_s04_f02", "c03_t06_s04_f02", "c03_t06_s04_f03", "c03_t06_s04_f03", "c03_t06_s04_f04", "c03_t06_s04_f04",],

        ////////// tank //////////
        /*  25 */ ["c03_t07_s01_f01", "c03_t07_s01_f01", "c03_t07_s01_f02", "c03_t07_s01_f02", "c03_t07_s01_f03", "c03_t07_s01_f03", "c03_t07_s01_f04", "c03_t07_s01_f04",],
        /*  26 */ ["c03_t07_s02_f01", "c03_t07_s02_f01", "c03_t07_s02_f02", "c03_t07_s02_f02", "c03_t07_s02_f03", "c03_t07_s02_f03", "c03_t07_s02_f04", "c03_t07_s02_f04",],
        /*  27 */ ["c03_t07_s03_f01", "c03_t07_s03_f01", "c03_t07_s03_f02", "c03_t07_s03_f02", "c03_t07_s03_f03", "c03_t07_s03_f03", "c03_t07_s03_f04", "c03_t07_s03_f04",],
        /*  28 */ ["c03_t07_s04_f01", "c03_t07_s04_f01", "c03_t07_s04_f02", "c03_t07_s04_f02", "c03_t07_s04_f03", "c03_t07_s04_f03", "c03_t07_s04_f04", "c03_t07_s04_f04",],

        ////////// mediumtank //////////
        /*  29 */ ["c03_t08_s01_f01", "c03_t08_s01_f01", "c03_t08_s01_f02", "c03_t08_s01_f02", "c03_t08_s01_f03", "c03_t08_s01_f03", "c03_t08_s01_f04", "c03_t08_s01_f04",],
        /*  30 */ ["c03_t08_s02_f01", "c03_t08_s02_f01", "c03_t08_s02_f02", "c03_t08_s02_f02", "c03_t08_s02_f03", "c03_t08_s02_f03", "c03_t08_s02_f04", "c03_t08_s02_f04",],
        /*  31 */ ["c03_t08_s03_f01", "c03_t08_s03_f01", "c03_t08_s03_f02", "c03_t08_s03_f02", "c03_t08_s03_f03", "c03_t08_s03_f03", "c03_t08_s03_f04", "c03_t08_s03_f04",],
        /*  32 */ ["c03_t08_s04_f01", "c03_t08_s04_f01", "c03_t08_s04_f02", "c03_t08_s04_f02", "c03_t08_s04_f03", "c03_t08_s04_f03", "c03_t08_s04_f04", "c03_t08_s04_f04",],

        ////////// wartank //////////
        /*  33 */ ["c03_t09_s01_f01", "c03_t09_s01_f01", "c03_t09_s01_f02", "c03_t09_s01_f02", "c03_t09_s01_f03", "c03_t09_s01_f03", "c03_t09_s01_f04", "c03_t09_s01_f04",],
        /*  34 */ ["c03_t09_s02_f01", "c03_t09_s02_f01", "c03_t09_s02_f02", "c03_t09_s02_f02", "c03_t09_s02_f03", "c03_t09_s02_f03", "c03_t09_s02_f04", "c03_t09_s02_f04",],
        /*  35 */ ["c03_t09_s03_f01", "c03_t09_s03_f01", "c03_t09_s03_f02", "c03_t09_s03_f02", "c03_t09_s03_f03", "c03_t09_s03_f03", "c03_t09_s03_f04", "c03_t09_s03_f04",],
        /*  36 */ ["c03_t09_s04_f01", "c03_t09_s04_f01", "c03_t09_s04_f02", "c03_t09_s04_f02", "c03_t09_s04_f03", "c03_t09_s04_f03", "c03_t09_s04_f04", "c03_t09_s04_f04",],

        ////////// artillery //////////
        /*  37 */ ["c03_t10_s01_f01", "c03_t10_s01_f01", "c03_t10_s01_f02", "c03_t10_s01_f02", "c03_t10_s01_f03", "c03_t10_s01_f03", "c03_t10_s01_f04", "c03_t10_s01_f04",],
        /*  38 */ ["c03_t10_s02_f01", "c03_t10_s02_f01", "c03_t10_s02_f02", "c03_t10_s02_f02", "c03_t10_s02_f03", "c03_t10_s02_f03", "c03_t10_s02_f04", "c03_t10_s02_f04",],
        /*  39 */ ["c03_t10_s03_f01", "c03_t10_s03_f01", "c03_t10_s03_f02", "c03_t10_s03_f02", "c03_t10_s03_f03", "c03_t10_s03_f03", "c03_t10_s03_f04", "c03_t10_s03_f04",],
        /*  40 */ ["c03_t10_s04_f01", "c03_t10_s04_f01", "c03_t10_s04_f02", "c03_t10_s04_f02", "c03_t10_s04_f03", "c03_t10_s04_f03", "c03_t10_s04_f04", "c03_t10_s04_f04",],

        ////////// antitank //////////
        /*  41 */ ["c03_t11_s01_f01", "c03_t11_s01_f01", "c03_t11_s01_f02", "c03_t11_s01_f02", "c03_t11_s01_f03", "c03_t11_s01_f03", "c03_t11_s01_f04", "c03_t11_s01_f04",],
        /*  42 */ ["c03_t11_s02_f01", "c03_t11_s02_f01", "c03_t11_s02_f02", "c03_t11_s02_f02", "c03_t11_s02_f03", "c03_t11_s02_f03", "c03_t11_s02_f04", "c03_t11_s02_f04",],
        /*  43 */ ["c03_t11_s03_f01", "c03_t11_s03_f01", "c03_t11_s03_f02", "c03_t11_s03_f02", "c03_t11_s03_f03", "c03_t11_s03_f03", "c03_t11_s03_f04", "c03_t11_s03_f04",],
        /*  44 */ ["c03_t11_s04_f01", "c03_t11_s04_f01", "c03_t11_s04_f02", "c03_t11_s04_f02", "c03_t11_s04_f03", "c03_t11_s04_f03", "c03_t11_s04_f04", "c03_t11_s04_f04",],

        ////////// rockets //////////
        /*  45 */ ["c03_t12_s01_f01", "c03_t12_s01_f01", "c03_t12_s01_f02", "c03_t12_s01_f02", "c03_t12_s01_f03", "c03_t12_s01_f03", "c03_t12_s01_f04", "c03_t12_s01_f04",],
        /*  46 */ ["c03_t12_s02_f01", "c03_t12_s02_f01", "c03_t12_s02_f02", "c03_t12_s02_f02", "c03_t12_s02_f03", "c03_t12_s02_f03", "c03_t12_s02_f04", "c03_t12_s02_f04",],
        /*  47 */ ["c03_t12_s03_f01", "c03_t12_s03_f01", "c03_t12_s03_f02", "c03_t12_s03_f02", "c03_t12_s03_f03", "c03_t12_s03_f03", "c03_t12_s03_f04", "c03_t12_s03_f04",],
        /*  48 */ ["c03_t12_s04_f01", "c03_t12_s04_f01", "c03_t12_s04_f02", "c03_t12_s04_f02", "c03_t12_s04_f03", "c03_t12_s04_f03", "c03_t12_s04_f04", "c03_t12_s04_f04",],

        ////////// missiles //////////
        /*  49 */ ["c03_t13_s01_f01", "c03_t13_s01_f01", "c03_t13_s01_f02", "c03_t13_s01_f02", "c03_t13_s01_f03", "c03_t13_s01_f03", "c03_t13_s01_f04", "c03_t13_s01_f04",],
        /*  50 */ ["c03_t13_s02_f01", "c03_t13_s02_f01", "c03_t13_s02_f02", "c03_t13_s02_f02", "c03_t13_s02_f03", "c03_t13_s02_f03", "c03_t13_s02_f04", "c03_t13_s02_f04",],
        /*  51 */ ["c03_t13_s03_f01", "c03_t13_s03_f01", "c03_t13_s03_f02", "c03_t13_s03_f02", "c03_t13_s03_f03", "c03_t13_s03_f03", "c03_t13_s03_f04", "c03_t13_s03_f04",],
        /*  52 */ ["c03_t13_s04_f01", "c03_t13_s04_f01", "c03_t13_s04_f02", "c03_t13_s04_f02", "c03_t13_s04_f03", "c03_t13_s04_f03", "c03_t13_s04_f04", "c03_t13_s04_f04",],

        ////////// rig //////////
        /*  53 */ ["c03_t14_s01_f01", "c03_t14_s01_f01", "c03_t14_s01_f02", "c03_t14_s01_f02", "c03_t14_s01_f03", "c03_t14_s01_f03", "c03_t14_s01_f04", "c03_t14_s01_f04",],
        /*  54 */ ["c03_t14_s02_f01", "c03_t14_s02_f01", "c03_t14_s02_f02", "c03_t14_s02_f02", "c03_t14_s02_f03", "c03_t14_s02_f03", "c03_t14_s02_f04", "c03_t14_s02_f04",],
        /*  55 */ ["c03_t14_s03_f01", "c03_t14_s03_f01", "c03_t14_s03_f02", "c03_t14_s03_f02", "c03_t14_s03_f03", "c03_t14_s03_f03", "c03_t14_s03_f04", "c03_t14_s03_f04",],
        /*  56 */ ["c03_t14_s04_f01", "c03_t14_s04_f01", "c03_t14_s04_f02", "c03_t14_s04_f02", "c03_t14_s04_f03", "c03_t14_s04_f03", "c03_t14_s04_f04", "c03_t14_s04_f04",],

        ////////// fighter //////////
        /*  57 */ ["c03_t15_s01_f01", "c03_t15_s01_f01", "c03_t15_s01_f02", "c03_t15_s01_f02", "c03_t15_s01_f03", "c03_t15_s01_f03", "c03_t15_s01_f04", "c03_t15_s01_f04",],
        /*  58 */ ["c03_t15_s02_f01", "c03_t15_s02_f01", "c03_t15_s02_f02", "c03_t15_s02_f02", "c03_t15_s02_f03", "c03_t15_s02_f03", "c03_t15_s02_f04", "c03_t15_s02_f04",],
        /*  59 */ ["c03_t15_s03_f01", "c03_t15_s03_f01", "c03_t15_s03_f02", "c03_t15_s03_f02", "c03_t15_s03_f03", "c03_t15_s03_f03", "c03_t15_s03_f04", "c03_t15_s03_f04",],
        /*  60 */ ["c03_t15_s04_f01", "c03_t15_s04_f01", "c03_t15_s04_f02", "c03_t15_s04_f02", "c03_t15_s04_f03", "c03_t15_s04_f03", "c03_t15_s04_f04", "c03_t15_s04_f04",],

        ////////// bomber //////////
        /*  61 */ ["c03_t16_s01_f01", "c03_t16_s01_f01", "c03_t16_s01_f02", "c03_t16_s01_f02", "c03_t16_s01_f03", "c03_t16_s01_f03", "c03_t16_s01_f04", "c03_t16_s01_f04",],
        /*  62 */ ["c03_t16_s02_f01", "c03_t16_s02_f01", "c03_t16_s02_f02", "c03_t16_s02_f02", "c03_t16_s02_f03", "c03_t16_s02_f03", "c03_t16_s02_f04", "c03_t16_s02_f04",],
        /*  63 */ ["c03_t16_s03_f01", "c03_t16_s03_f01", "c03_t16_s03_f02", "c03_t16_s03_f02", "c03_t16_s03_f03", "c03_t16_s03_f03", "c03_t16_s03_f04", "c03_t16_s03_f04",],
        /*  64 */ ["c03_t16_s04_f01", "c03_t16_s04_f01", "c03_t16_s04_f02", "c03_t16_s04_f02", "c03_t16_s04_f03", "c03_t16_s04_f03", "c03_t16_s04_f04", "c03_t16_s04_f04",],

        ////////// duster //////////
        /*  65 */ ["c03_t17_s01_f01", "c03_t17_s01_f01", "c03_t17_s01_f02", "c03_t17_s01_f02", "c03_t17_s01_f03", "c03_t17_s01_f03", "c03_t17_s01_f04", "c03_t17_s01_f04",],
        /*  66 */ ["c03_t17_s02_f01", "c03_t17_s02_f01", "c03_t17_s02_f02", "c03_t17_s02_f02", "c03_t17_s02_f03", "c03_t17_s02_f03", "c03_t17_s02_f04", "c03_t17_s02_f04",],
        /*  67 */ ["c03_t17_s03_f01", "c03_t17_s03_f01", "c03_t17_s03_f02", "c03_t17_s03_f02", "c03_t17_s03_f03", "c03_t17_s03_f03", "c03_t17_s03_f04", "c03_t17_s03_f04",],
        /*  68 */ ["c03_t17_s04_f01", "c03_t17_s04_f01", "c03_t17_s04_f02", "c03_t17_s04_f02", "c03_t17_s04_f03", "c03_t17_s04_f03", "c03_t17_s04_f04", "c03_t17_s04_f04",],

        ////////// battlecopter //////////
        /*  69 */ ["c03_t18_s01_f01", "c03_t18_s01_f01", "c03_t18_s01_f02", "c03_t18_s01_f02", "c03_t18_s01_f03", "c03_t18_s01_f03", "c03_t18_s01_f04", "c03_t18_s01_f04",],
        /*  70 */ ["c03_t18_s02_f01", "c03_t18_s02_f01", "c03_t18_s02_f02", "c03_t18_s02_f02", "c03_t18_s02_f03", "c03_t18_s02_f03", "c03_t18_s02_f04", "c03_t18_s02_f04",],
        /*  71 */ ["c03_t18_s03_f01", "c03_t18_s03_f01", "c03_t18_s03_f02", "c03_t18_s03_f02", "c03_t18_s03_f03", "c03_t18_s03_f03", "c03_t18_s03_f04", "c03_t18_s03_f04",],
        /*  72 */ ["c03_t18_s04_f01", "c03_t18_s04_f01", "c03_t18_s04_f02", "c03_t18_s04_f02", "c03_t18_s04_f03", "c03_t18_s04_f03", "c03_t18_s04_f04", "c03_t18_s04_f04",],

        ////////// transportcopter //////////
        /*  73 */ ["c03_t19_s01_f01", "c03_t19_s01_f01", "c03_t19_s01_f02", "c03_t19_s01_f02", "c03_t19_s01_f03", "c03_t19_s01_f03", "c03_t19_s01_f04", "c03_t19_s01_f04",],
        /*  74 */ ["c03_t19_s02_f01", "c03_t19_s02_f01", "c03_t19_s02_f02", "c03_t19_s02_f02", "c03_t19_s02_f03", "c03_t19_s02_f03", "c03_t19_s02_f04", "c03_t19_s02_f04",],
        /*  75 */ ["c03_t19_s03_f01", "c03_t19_s03_f01", "c03_t19_s03_f02", "c03_t19_s03_f02", "c03_t19_s03_f03", "c03_t19_s03_f03", "c03_t19_s03_f04", "c03_t19_s03_f04",],
        /*  76 */ ["c03_t19_s04_f01", "c03_t19_s04_f01", "c03_t19_s04_f02", "c03_t19_s04_f02", "c03_t19_s04_f03", "c03_t19_s04_f03", "c03_t19_s04_f04", "c03_t19_s04_f04",],

        ////////// seaplane //////////
        /*  77 */ ["c03_t20_s01_f01", "c03_t20_s01_f01", "c03_t20_s01_f02", "c03_t20_s01_f02", "c03_t20_s01_f03", "c03_t20_s01_f03", "c03_t20_s01_f04", "c03_t20_s01_f04",],
        /*  78 */ ["c03_t20_s02_f01", "c03_t20_s02_f01", "c03_t20_s02_f02", "c03_t20_s02_f02", "c03_t20_s02_f03", "c03_t20_s02_f03", "c03_t20_s02_f04", "c03_t20_s02_f04",],
        /*  79 */ ["c03_t20_s03_f01", "c03_t20_s03_f01", "c03_t20_s03_f02", "c03_t20_s03_f02", "c03_t20_s03_f03", "c03_t20_s03_f03", "c03_t20_s03_f04", "c03_t20_s03_f04",],
        /*  80 */ ["c03_t20_s04_f01", "c03_t20_s04_f01", "c03_t20_s04_f02", "c03_t20_s04_f02", "c03_t20_s04_f03", "c03_t20_s04_f03", "c03_t20_s04_f04", "c03_t20_s04_f04",],

        ////////// battleship //////////
        /*  81 */ ["c03_t21_s01_f01", "c03_t21_s01_f01", "c03_t21_s01_f02", "c03_t21_s01_f02", "c03_t21_s01_f03", "c03_t21_s01_f03", "c03_t21_s01_f04", "c03_t21_s01_f04",],
        /*  82 */ ["c03_t21_s02_f01", "c03_t21_s02_f01", "c03_t21_s02_f02", "c03_t21_s02_f02", "c03_t21_s02_f03", "c03_t21_s02_f03", "c03_t21_s02_f04", "c03_t21_s02_f04",],
        /*  83 */ ["c03_t21_s03_f01", "c03_t21_s03_f01", "c03_t21_s03_f02", "c03_t21_s03_f02", "c03_t21_s03_f03", "c03_t21_s03_f03", "c03_t21_s03_f04", "c03_t21_s03_f04",],
        /*  84 */ ["c03_t21_s04_f01", "c03_t21_s04_f01", "c03_t21_s04_f02", "c03_t21_s04_f02", "c03_t21_s04_f03", "c03_t21_s04_f03", "c03_t21_s04_f04", "c03_t21_s04_f04",],

        ////////// carrier //////////
        /*  85 */ ["c03_t22_s01_f01", "c03_t22_s01_f01", "c03_t22_s01_f02", "c03_t22_s01_f02", "c03_t22_s01_f03", "c03_t22_s01_f03", "c03_t22_s01_f04", "c03_t22_s01_f04",],
        /*  86 */ ["c03_t22_s02_f01", "c03_t22_s02_f01", "c03_t22_s02_f02", "c03_t22_s02_f02", "c03_t22_s02_f03", "c03_t22_s02_f03", "c03_t22_s02_f04", "c03_t22_s02_f04",],
        /*  87 */ ["c03_t22_s03_f01", "c03_t22_s03_f01", "c03_t22_s03_f02", "c03_t22_s03_f02", "c03_t22_s03_f03", "c03_t22_s03_f03", "c03_t22_s03_f04", "c03_t22_s03_f04",],
        /*  88 */ ["c03_t22_s04_f01", "c03_t22_s04_f01", "c03_t22_s04_f02", "c03_t22_s04_f02", "c03_t22_s04_f03", "c03_t22_s04_f03", "c03_t22_s04_f04", "c03_t22_s04_f04",],

        ////////// submarine //////////
        /*  89 */ ["c03_t23_s01_f01", "c03_t23_s01_f01", "c03_t23_s01_f02", "c03_t23_s01_f02", "c03_t23_s01_f03", "c03_t23_s01_f03", "c03_t23_s01_f04", "c03_t23_s01_f04",],
        /*  90 */ ["c03_t23_s02_f01", "c03_t23_s02_f01", "c03_t23_s02_f02", "c03_t23_s02_f02", "c03_t23_s02_f03", "c03_t23_s02_f03", "c03_t23_s02_f04", "c03_t23_s02_f04",],
        /*  91 */ ["c03_t23_s03_f01", "c03_t23_s03_f01", "c03_t23_s03_f02", "c03_t23_s03_f02", "c03_t23_s03_f03", "c03_t23_s03_f03", "c03_t23_s03_f04", "c03_t23_s03_f04",],
        /*  92 */ ["c03_t23_s04_f01", "c03_t23_s04_f01", "c03_t23_s04_f02", "c03_t23_s04_f02", "c03_t23_s04_f03", "c03_t23_s04_f03", "c03_t23_s04_f04", "c03_t23_s04_f04",],

        ////////// cruiser //////////
        /*  93 */ ["c03_t24_s01_f01", "c03_t24_s01_f01", "c03_t24_s01_f02", "c03_t24_s01_f02", "c03_t24_s01_f03", "c03_t24_s01_f03", "c03_t24_s01_f04", "c03_t24_s01_f04",],
        /*  94 */ ["c03_t24_s02_f01", "c03_t24_s02_f01", "c03_t24_s02_f02", "c03_t24_s02_f02", "c03_t24_s02_f03", "c03_t24_s02_f03", "c03_t24_s02_f04", "c03_t24_s02_f04",],
        /*  95 */ ["c03_t24_s03_f01", "c03_t24_s03_f01", "c03_t24_s03_f02", "c03_t24_s03_f02", "c03_t24_s03_f03", "c03_t24_s03_f03", "c03_t24_s03_f04", "c03_t24_s03_f04",],
        /*  96 */ ["c03_t24_s04_f01", "c03_t24_s04_f01", "c03_t24_s04_f02", "c03_t24_s04_f02", "c03_t24_s04_f03", "c03_t24_s04_f03", "c03_t24_s04_f04", "c03_t24_s04_f04",],

        ////////// lander //////////
        /*  97 */ ["c03_t25_s01_f01", "c03_t25_s01_f01", "c03_t25_s01_f02", "c03_t25_s01_f02", "c03_t25_s01_f03", "c03_t25_s01_f03", "c03_t25_s01_f04", "c03_t25_s01_f04",],
        /*  98 */ ["c03_t25_s02_f01", "c03_t25_s02_f01", "c03_t25_s02_f02", "c03_t25_s02_f02", "c03_t25_s02_f03", "c03_t25_s02_f03", "c03_t25_s02_f04", "c03_t25_s02_f04",],
        /*  99 */ ["c03_t25_s03_f01", "c03_t25_s03_f01", "c03_t25_s03_f02", "c03_t25_s03_f02", "c03_t25_s03_f03", "c03_t25_s03_f03", "c03_t25_s03_f04", "c03_t25_s03_f04",],
        /* 100 */ ["c03_t25_s04_f01", "c03_t25_s04_f01", "c03_t25_s04_f02", "c03_t25_s04_f02", "c03_t25_s04_f03", "c03_t25_s04_f03", "c03_t25_s04_f04", "c03_t25_s04_f04",],

        ////////// gunboat //////////
        /* 101 */ ["c03_t26_s01_f01", "c03_t26_s01_f01", "c03_t26_s01_f02", "c03_t26_s01_f02", "c03_t26_s01_f03", "c03_t26_s01_f03", "c03_t26_s01_f04", "c03_t26_s01_f04",],
        /* 102 */ ["c03_t26_s02_f01", "c03_t26_s02_f01", "c03_t26_s02_f02", "c03_t26_s02_f02", "c03_t26_s02_f03", "c03_t26_s02_f03", "c03_t26_s02_f04", "c03_t26_s02_f04",],
        /* 103 */ ["c03_t26_s03_f01", "c03_t26_s03_f01", "c03_t26_s03_f02", "c03_t26_s03_f02", "c03_t26_s03_f03", "c03_t26_s03_f03", "c03_t26_s03_f04", "c03_t26_s03_f04",],
        /* 104 */ ["c03_t26_s04_f01", "c03_t26_s04_f01", "c03_t26_s04_f02", "c03_t26_s04_f02", "c03_t26_s04_f03", "c03_t26_s04_f03", "c03_t26_s04_f04", "c03_t26_s04_f04",],
    ];

    const UNIT_MOVING_IMAGE_SOURCES: Readonly<string[]>[] = [
        /*   0 */ [],

        ////////// infantry //////////
        /*   1 */ ["c03_t01_s01_f11", "c03_t01_s01_f12", "c03_t01_s01_f13", "c03_t01_s01_f14",],
        /*   2 */ ["c03_t01_s02_f11", "c03_t01_s02_f12", "c03_t01_s02_f13", "c03_t01_s02_f14",],
        /*   3 */ ["c03_t01_s03_f11", "c03_t01_s03_f12", "c03_t01_s03_f13", "c03_t01_s03_f14",],
        /*   4 */ ["c03_t01_s04_f11", "c03_t01_s04_f12", "c03_t01_s04_f13", "c03_t01_s04_f14",],

        ////////// mech //////////
        /*   5 */ ["c03_t02_s01_f11", "c03_t02_s01_f12", "c03_t02_s01_f13", "c03_t02_s01_f14",],
        /*   6 */ ["c03_t02_s02_f11", "c03_t02_s02_f12", "c03_t02_s02_f13", "c03_t02_s02_f14",],
        /*   7 */ ["c03_t02_s03_f11", "c03_t02_s03_f12", "c03_t02_s03_f13", "c03_t02_s03_f14",],
        /*   8 */ ["c03_t02_s04_f11", "c03_t02_s04_f12", "c03_t02_s04_f13", "c03_t02_s04_f14",],

        ////////// bike //////////
        /*   9 */ ["c03_t03_s01_f11", "c03_t03_s01_f12", "c03_t03_s01_f13",],
        /*  10 */ ["c03_t03_s02_f11", "c03_t03_s02_f12", "c03_t03_s02_f13",],
        /*  11 */ ["c03_t03_s03_f11", "c03_t03_s03_f12", "c03_t03_s03_f13",],
        /*  12 */ ["c03_t03_s04_f11", "c03_t03_s04_f12", "c03_t03_s04_f13",],

        ////////// recon //////////
        /*  13 */ ["c03_t04_s01_f11", "c03_t04_s01_f12", "c03_t04_s01_f13",],
        /*  14 */ ["c03_t04_s02_f11", "c03_t04_s02_f12", "c03_t04_s02_f13",],
        /*  15 */ ["c03_t04_s03_f11", "c03_t04_s03_f12", "c03_t04_s03_f13",],
        /*  16 */ ["c03_t04_s04_f11", "c03_t04_s04_f12", "c03_t04_s04_f13",],

        ////////// flare //////////
        /*  17 */ ["c03_t05_s01_f11", "c03_t05_s01_f12", "c03_t05_s01_f13",],
        /*  18 */ ["c03_t05_s02_f11", "c03_t05_s02_f12", "c03_t05_s02_f13",],
        /*  19 */ ["c03_t05_s03_f11", "c03_t05_s03_f12", "c03_t05_s03_f13",],
        /*  20 */ ["c03_t05_s04_f11", "c03_t05_s04_f12", "c03_t05_s04_f13",],

        ////////// antiair //////////
        /*  21 */ ["c03_t06_s01_f11", "c03_t06_s01_f12", "c03_t06_s01_f13",],
        /*  22 */ ["c03_t06_s02_f11", "c03_t06_s02_f12", "c03_t06_s02_f13",],
        /*  23 */ ["c03_t06_s03_f11", "c03_t06_s03_f12", "c03_t06_s03_f13",],
        /*  24 */ ["c03_t06_s04_f11", "c03_t06_s04_f12", "c03_t06_s04_f13",],

        ////////// tank //////////
        /*  25 */ ["c03_t07_s01_f11", "c03_t07_s01_f12", "c03_t07_s01_f13",],
        /*  26 */ ["c03_t07_s02_f11", "c03_t07_s02_f12", "c03_t07_s02_f13",],
        /*  27 */ ["c03_t07_s03_f11", "c03_t07_s03_f12", "c03_t07_s03_f13",],
        /*  28 */ ["c03_t07_s04_f11", "c03_t07_s04_f12", "c03_t07_s04_f13",],

        ////////// mediumtank //////////
        /*  29 */ ["c03_t08_s01_f11", "c03_t08_s01_f12", "c03_t08_s01_f13",],
        /*  30 */ ["c03_t08_s02_f11", "c03_t08_s02_f12", "c03_t08_s02_f13",],
        /*  31 */ ["c03_t08_s03_f11", "c03_t08_s03_f12", "c03_t08_s03_f13",],
        /*  32 */ ["c03_t08_s04_f11", "c03_t08_s04_f12", "c03_t08_s04_f13",],

        ////////// wartank //////////
        /*  33 */ ["c03_t09_s01_f11", "c03_t09_s01_f12", "c03_t09_s01_f13",],
        /*  34 */ ["c03_t09_s02_f11", "c03_t09_s02_f12", "c03_t09_s02_f13",],
        /*  35 */ ["c03_t09_s03_f11", "c03_t09_s03_f12", "c03_t09_s03_f13",],
        /*  36 */ ["c03_t09_s04_f11", "c03_t09_s04_f12", "c03_t09_s04_f13",],

        ////////// artillery //////////
        /*  37 */ ["c03_t10_s01_f11", "c03_t10_s01_f12", "c03_t10_s01_f13",],
        /*  38 */ ["c03_t10_s02_f11", "c03_t10_s02_f12", "c03_t10_s02_f13",],
        /*  39 */ ["c03_t10_s03_f11", "c03_t10_s03_f12", "c03_t10_s03_f13",],
        /*  40 */ ["c03_t10_s04_f11", "c03_t10_s04_f12", "c03_t10_s04_f13",],

        ////////// antitank //////////
        /*  41 */ ["c03_t11_s01_f11", "c03_t11_s01_f12", "c03_t11_s01_f13",],
        /*  42 */ ["c03_t11_s02_f11", "c03_t11_s02_f12", "c03_t11_s02_f13",],
        /*  43 */ ["c03_t11_s03_f11", "c03_t11_s03_f12", "c03_t11_s03_f13",],
        /*  44 */ ["c03_t11_s04_f11", "c03_t11_s04_f12", "c03_t11_s04_f13",],

        ////////// rockets //////////
        /*  45 */ ["c03_t12_s01_f11", "c03_t12_s01_f12", "c03_t12_s01_f13",],
        /*  46 */ ["c03_t12_s02_f11", "c03_t12_s02_f12", "c03_t12_s02_f13",],
        /*  47 */ ["c03_t12_s03_f11", "c03_t12_s03_f12", "c03_t12_s03_f13",],
        /*  48 */ ["c03_t12_s04_f11", "c03_t12_s04_f12", "c03_t12_s04_f13",],

        ////////// missiles //////////
        /*  49 */ ["c03_t13_s01_f11", "c03_t13_s01_f12", "c03_t13_s01_f13",],
        /*  50 */ ["c03_t13_s02_f11", "c03_t13_s02_f12", "c03_t13_s02_f13",],
        /*  51 */ ["c03_t13_s03_f11", "c03_t13_s03_f12", "c03_t13_s03_f13",],
        /*  52 */ ["c03_t13_s04_f11", "c03_t13_s04_f12", "c03_t13_s04_f13",],

        ////////// rig //////////
        /*  53 */ ["c03_t14_s01_f11", "c03_t14_s01_f12", "c03_t14_s01_f13",],
        /*  54 */ ["c03_t14_s02_f11", "c03_t14_s02_f12", "c03_t14_s02_f13",],
        /*  55 */ ["c03_t14_s03_f11", "c03_t14_s03_f12", "c03_t14_s03_f13",],
        /*  56 */ ["c03_t14_s04_f11", "c03_t14_s04_f12", "c03_t14_s04_f13",],

        ////////// fighter //////////
        /*  57 */ ["c03_t15_s01_f11", "c03_t15_s01_f12", "c03_t15_s01_f13",],
        /*  58 */ ["c03_t15_s02_f11", "c03_t15_s02_f12", "c03_t15_s02_f13",],
        /*  59 */ ["c03_t15_s03_f11", "c03_t15_s03_f12", "c03_t15_s03_f13",],
        /*  60 */ ["c03_t15_s04_f11", "c03_t15_s04_f12", "c03_t15_s04_f13",],

        ////////// bomber //////////
        /*  61 */ ["c03_t16_s01_f11", "c03_t16_s01_f12", "c03_t16_s01_f13",],
        /*  62 */ ["c03_t16_s02_f11", "c03_t16_s02_f12", "c03_t16_s02_f13",],
        /*  63 */ ["c03_t16_s03_f11", "c03_t16_s03_f12", "c03_t16_s03_f13",],
        /*  64 */ ["c03_t16_s04_f11", "c03_t16_s04_f12", "c03_t16_s04_f13",],

        ////////// duster //////////
        /*  65 */ ["c03_t17_s01_f11", "c03_t17_s01_f12", "c03_t17_s01_f13",],
        /*  66 */ ["c03_t17_s02_f11", "c03_t17_s02_f12", "c03_t17_s02_f13",],
        /*  67 */ ["c03_t17_s03_f11", "c03_t17_s03_f12", "c03_t17_s03_f13",],
        /*  68 */ ["c03_t17_s04_f11", "c03_t17_s04_f12", "c03_t17_s04_f13",],

        ////////// battlecopter //////////
        /*  69 */ ["c03_t18_s01_f11", "c03_t18_s01_f12", "c03_t18_s01_f13",],
        /*  70 */ ["c03_t18_s02_f11", "c03_t18_s02_f12", "c03_t18_s02_f13",],
        /*  71 */ ["c03_t18_s03_f11", "c03_t18_s03_f12", "c03_t18_s03_f13",],
        /*  72 */ ["c03_t18_s04_f11", "c03_t18_s04_f12", "c03_t18_s04_f13",],

        ////////// transportcopter //////////
        /*  73 */ ["c03_t19_s01_f11", "c03_t19_s01_f12", "c03_t19_s01_f13",],
        /*  74 */ ["c03_t19_s02_f11", "c03_t19_s02_f12", "c03_t19_s02_f13",],
        /*  75 */ ["c03_t19_s03_f11", "c03_t19_s03_f12", "c03_t19_s03_f13",],
        /*  76 */ ["c03_t19_s04_f11", "c03_t19_s04_f12", "c03_t19_s04_f13",],

        ////////// seaplane //////////
        /*  77 */ ["c03_t20_s01_f11", "c03_t20_s01_f12", "c03_t20_s01_f13",],
        /*  78 */ ["c03_t20_s02_f11", "c03_t20_s02_f12", "c03_t20_s02_f13",],
        /*  79 */ ["c03_t20_s03_f11", "c03_t20_s03_f12", "c03_t20_s03_f13",],
        /*  80 */ ["c03_t20_s04_f11", "c03_t20_s04_f12", "c03_t20_s04_f13",],

        ////////// battleship //////////
        /*  81 */ ["c03_t21_s01_f11", "c03_t21_s01_f12", "c03_t21_s01_f13",],
        /*  82 */ ["c03_t21_s02_f11", "c03_t21_s02_f12", "c03_t21_s02_f13",],
        /*  83 */ ["c03_t21_s03_f11", "c03_t21_s03_f12", "c03_t21_s03_f13",],
        /*  84 */ ["c03_t21_s04_f11", "c03_t21_s04_f12", "c03_t21_s04_f13",],

        ////////// carrier //////////
        /*  85 */ ["c03_t22_s01_f11", "c03_t22_s01_f12", "c03_t22_s01_f13",],
        /*  86 */ ["c03_t22_s02_f11", "c03_t22_s02_f12", "c03_t22_s02_f13",],
        /*  87 */ ["c03_t22_s03_f11", "c03_t22_s03_f12", "c03_t22_s03_f13",],
        /*  88 */ ["c03_t22_s04_f11", "c03_t22_s04_f12", "c03_t22_s04_f13",],

        ////////// submarine //////////
        /*  89 */ ["c03_t23_s01_f11", "c03_t23_s01_f12", "c03_t23_s01_f13",],
        /*  90 */ ["c03_t23_s02_f11", "c03_t23_s02_f12", "c03_t23_s02_f13",],
        /*  91 */ ["c03_t23_s03_f11", "c03_t23_s03_f12", "c03_t23_s03_f13",],
        /*  92 */ ["c03_t23_s04_f11", "c03_t23_s04_f12", "c03_t23_s04_f13",],

        ////////// cruiser //////////
        /*  93 */ ["c03_t24_s01_f11", "c03_t24_s01_f12", "c03_t24_s01_f13",],
        /*  94 */ ["c03_t24_s02_f11", "c03_t24_s02_f12", "c03_t24_s02_f13",],
        /*  95 */ ["c03_t24_s03_f11", "c03_t24_s03_f12", "c03_t24_s03_f13",],
        /*  96 */ ["c03_t24_s04_f11", "c03_t24_s04_f12", "c03_t24_s04_f13",],

        ////////// lander //////////
        /*  97 */ ["c03_t25_s01_f11", "c03_t25_s01_f12", "c03_t25_s01_f13",],
        /*  98 */ ["c03_t25_s02_f11", "c03_t25_s02_f12", "c03_t25_s02_f13",],
        /*  99 */ ["c03_t25_s03_f11", "c03_t25_s03_f12", "c03_t25_s03_f13",],
        /* 100 */ ["c03_t25_s04_f11", "c03_t25_s04_f12", "c03_t25_s04_f13",],

        ////////// gunboat //////////
        /* 101 */ ["c03_t26_s01_f11", "c03_t26_s01_f12", "c03_t26_s01_f13",],
        /* 102 */ ["c03_t26_s02_f11", "c03_t26_s02_f12", "c03_t26_s02_f13",],
        /* 103 */ ["c03_t26_s03_f11", "c03_t26_s03_f12", "c03_t26_s03_f13",],
        /* 104 */ ["c03_t26_s04_f11", "c03_t26_s04_f12", "c03_t26_s04_f13",],
    ];

    const TILE_OBJECT_VIEW_IDS = new Map<TileObjectType, Map<number, number | undefined>>();

    export function getTileBaseType(tileBaseViewId: number): TileBaseType {
        return TILE_BASE_TYPES[tileBaseViewId];
    }

    export function getTileObjectTypeAndPlayerIndex(tileObjectViewId: number): TileObjectTypeAndPlayerIndex {
        return TILE_OBJECT_TYPES_AND_PLAYER_INDEX[tileObjectViewId];
    }

    export function getUnitTypeAndPlayerIndex(unitViewId: number): UnitTypeAndPlayerIndex {
        return UNIT_TYPES_AND_PLAYER_INDEX[unitViewId];
    }

    export function getTileObjectViewId(type: Types.TileObjectType, playerIndex: number): number | undefined {
        if (!TILE_OBJECT_VIEW_IDS.has(type)) {
            TILE_OBJECT_VIEW_IDS.set(type, new Map());
        }
        const idMap = TILE_OBJECT_VIEW_IDS.get(type)!;
        if (!idMap.has(playerIndex)) {
            idMap.set(playerIndex, undefined);
            for (let id = 0; id < TILE_OBJECT_TYPES_AND_PLAYER_INDEX.length; ++id) {
                const data = TILE_OBJECT_TYPES_AND_PLAYER_INDEX[id];
                if ((data) && (data.playerIndex === playerIndex) && (data.tileObjectType === type)) {
                    idMap.set(playerIndex, id);
                    break;
                }
            }
        }
        return idMap.get(playerIndex);
    }

    export function getUnitViewId(type: Types.UnitType, playerIndex: number): number | undefined {
        for (let id = 0; id < UNIT_TYPES_AND_PLAYER_INDEX.length; ++id) {
            const data = UNIT_TYPES_AND_PLAYER_INDEX[id];
            if ((data) && (data.unitType === type) && (data.playerIndex === playerIndex)) {
                return id;
            }
        }
        return undefined;
    }

    export function getTileBaseImageSource(tileBaseViewId: number, tickCount: number): string {
        const sources = TILE_BASE_IMAGE_SOURCES[tileBaseViewId];
        return sources[tickCount % sources.length];
    }

    export function getTileObjectImageSource(tileObjectViewId: number, tickCount: number): string {
        const sources = TILE_OBJECT_IMAGE_SOURCES[tileObjectViewId];
        return sources[tickCount % sources.length];
    }

    export function getUnitIdleImageSource(viewId: number, tickCount: number): string {
        const sources = UNIT_IDLE_IMAGE_SOURCES[viewId];
        return sources[tickCount % sources.length];
    }

    export function getUnitMovingImageSource(viewId: number, tickCount: number): string {
        const sources = UNIT_MOVING_IMAGE_SOURCES[viewId];
        return sources[tickCount % sources.length];
    }
}
