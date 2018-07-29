
namespace Utility {
    import TileBaseType   = Types.TileBaseType;
    import TileObjectType = Types.TileObjectType;

    type TileObjectTypeAndPlayerIndex = {
        tileObjectType: TileObjectType;
        playerIndex   : number;
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
        /*  18 */ ["c01_t03_s01_f01", "c01_t03_s01_f02", "c01_t03_s01_f03", "c01_t03_s01_f04", "c01_t03_s01_f03", "c01_t03_s01_f02",],
        /*  19 */ ["c01_t03_s02_f01", "c01_t03_s02_f02", "c01_t03_s02_f03", "c01_t03_s02_f04", "c01_t03_s02_f03", "c01_t03_s02_f02",],
        /*  20 */ ["c01_t03_s03_f01", "c01_t03_s03_f02", "c01_t03_s03_f03", "c01_t03_s03_f04", "c01_t03_s03_f03", "c01_t03_s03_f02",],
        /*  21 */ ["c01_t03_s04_f01", "c01_t03_s04_f02", "c01_t03_s04_f03", "c01_t03_s04_f04", "c01_t03_s04_f03", "c01_t03_s04_f02",],
        /*  22 */ ["c01_t03_s05_f01", "c01_t03_s05_f02", "c01_t03_s05_f03", "c01_t03_s05_f04", "c01_t03_s05_f03", "c01_t03_s05_f02",],
        /*  23 */ ["c01_t03_s06_f01", "c01_t03_s06_f02", "c01_t03_s06_f03", "c01_t03_s06_f04", "c01_t03_s06_f03", "c01_t03_s06_f02",],
        /*  24 */ ["c01_t03_s07_f01", "c01_t03_s07_f02", "c01_t03_s07_f03", "c01_t03_s07_f04", "c01_t03_s07_f03", "c01_t03_s07_f02",],
        /*  25 */ ["c01_t03_s08_f01", "c01_t03_s08_f02", "c01_t03_s08_f03", "c01_t03_s08_f04", "c01_t03_s08_f03", "c01_t03_s08_f02",],
        /*  26 */ ["c01_t03_s09_f01", "c01_t03_s09_f02", "c01_t03_s09_f03", "c01_t03_s09_f04", "c01_t03_s09_f03", "c01_t03_s09_f02",],
        /*  27 */ ["c01_t03_s10_f01", "c01_t03_s10_f02", "c01_t03_s10_f03", "c01_t03_s10_f04", "c01_t03_s10_f03", "c01_t03_s10_f02",],
        /*  28 */ ["c01_t03_s11_f01", "c01_t03_s11_f02", "c01_t03_s11_f03", "c01_t03_s11_f04", "c01_t03_s11_f03", "c01_t03_s11_f02",],
        /*  29 */ ["c01_t03_s12_f01", "c01_t03_s12_f02", "c01_t03_s12_f03", "c01_t03_s12_f04", "c01_t03_s12_f03", "c01_t03_s12_f02",],
        /*  30 */ ["c01_t03_s13_f01", "c01_t03_s13_f02", "c01_t03_s13_f03", "c01_t03_s13_f04", "c01_t03_s13_f03", "c01_t03_s13_f02",],
        /*  31 */ ["c01_t03_s14_f01", "c01_t03_s14_f02", "c01_t03_s14_f03", "c01_t03_s14_f04", "c01_t03_s14_f03", "c01_t03_s14_f02",],
        /*  32 */ ["c01_t03_s15_f01", "c01_t03_s15_f02", "c01_t03_s15_f03", "c01_t03_s15_f04", "c01_t03_s15_f03", "c01_t03_s15_f02",],
        /*  33 */ ["c01_t03_s16_f01", "c01_t03_s16_f02", "c01_t03_s16_f03", "c01_t03_s16_f04", "c01_t03_s16_f03", "c01_t03_s16_f02",],
        /*  34 */ ["c01_t03_s17_f01", "c01_t03_s17_f02", "c01_t03_s17_f03", "c01_t03_s17_f04", "c01_t03_s17_f03", "c01_t03_s17_f02",],
        /*  35 */ ["c01_t03_s18_f01", "c01_t03_s18_f02", "c01_t03_s18_f03", "c01_t03_s18_f04", "c01_t03_s18_f03", "c01_t03_s18_f02",],
        /*  36 */ ["c01_t03_s19_f01", "c01_t03_s19_f02", "c01_t03_s19_f03", "c01_t03_s19_f04", "c01_t03_s19_f03", "c01_t03_s19_f02",],
        /*  37 */ ["c01_t03_s20_f01", "c01_t03_s20_f02", "c01_t03_s20_f03", "c01_t03_s20_f04", "c01_t03_s20_f03", "c01_t03_s20_f02",],
        /*  38 */ ["c01_t03_s21_f01", "c01_t03_s21_f02", "c01_t03_s21_f03", "c01_t03_s21_f04", "c01_t03_s21_f03", "c01_t03_s21_f02",],
        /*  39 */ ["c01_t03_s22_f01", "c01_t03_s22_f02", "c01_t03_s22_f03", "c01_t03_s22_f04", "c01_t03_s22_f03", "c01_t03_s22_f02",],
        /*  40 */ ["c01_t03_s23_f01", "c01_t03_s23_f02", "c01_t03_s23_f03", "c01_t03_s23_f04", "c01_t03_s23_f03", "c01_t03_s23_f02",],
        /*  41 */ ["c01_t03_s24_f01", "c01_t03_s24_f02", "c01_t03_s24_f03", "c01_t03_s24_f04", "c01_t03_s24_f03", "c01_t03_s24_f02",],
        /*  42 */ ["c01_t03_s25_f01", "c01_t03_s25_f02", "c01_t03_s25_f03", "c01_t03_s25_f04", "c01_t03_s25_f03", "c01_t03_s25_f02",],
        /*  43 */ ["c01_t03_s26_f01", "c01_t03_s26_f02", "c01_t03_s26_f03", "c01_t03_s26_f04", "c01_t03_s26_f03", "c01_t03_s26_f02",],
        /*  44 */ ["c01_t03_s27_f01", "c01_t03_s27_f02", "c01_t03_s27_f03", "c01_t03_s27_f04", "c01_t03_s27_f03", "c01_t03_s27_f02",],
        /*  45 */ ["c01_t03_s28_f01", "c01_t03_s28_f02", "c01_t03_s28_f03", "c01_t03_s28_f04", "c01_t03_s28_f03", "c01_t03_s28_f02",],
        /*  46 */ ["c01_t03_s29_f01", "c01_t03_s29_f02", "c01_t03_s29_f03", "c01_t03_s29_f04", "c01_t03_s29_f03", "c01_t03_s29_f02",],
        /*  47 */ ["c01_t03_s30_f01", "c01_t03_s30_f02", "c01_t03_s30_f03", "c01_t03_s30_f04", "c01_t03_s30_f03", "c01_t03_s30_f02",],
        /*  48 */ ["c01_t03_s31_f01", "c01_t03_s31_f02", "c01_t03_s31_f03", "c01_t03_s31_f04", "c01_t03_s31_f03", "c01_t03_s31_f02",],
        /*  49 */ ["c01_t03_s32_f01", "c01_t03_s32_f02", "c01_t03_s32_f03", "c01_t03_s32_f04", "c01_t03_s32_f03", "c01_t03_s32_f02",],
        /*  50 */ ["c01_t03_s33_f01", "c01_t03_s33_f02", "c01_t03_s33_f03", "c01_t03_s33_f04", "c01_t03_s33_f03", "c01_t03_s33_f02",],
        /*  51 */ ["c01_t03_s34_f01", "c01_t03_s34_f02", "c01_t03_s34_f03", "c01_t03_s34_f04", "c01_t03_s34_f03", "c01_t03_s34_f02",],
        /*  52 */ ["c01_t03_s35_f01", "c01_t03_s35_f02", "c01_t03_s35_f03", "c01_t03_s35_f04", "c01_t03_s35_f03", "c01_t03_s35_f02",],
        /*  53 */ ["c01_t03_s36_f01", "c01_t03_s36_f02", "c01_t03_s36_f03", "c01_t03_s36_f04", "c01_t03_s36_f03", "c01_t03_s36_f02",],
        /*  54 */ ["c01_t03_s37_f01", "c01_t03_s37_f02", "c01_t03_s37_f03", "c01_t03_s37_f04", "c01_t03_s37_f03", "c01_t03_s37_f02",],
        /*  55 */ ["c01_t03_s38_f01", "c01_t03_s38_f02", "c01_t03_s38_f03", "c01_t03_s38_f04", "c01_t03_s38_f03", "c01_t03_s38_f02",],
        /*  56 */ ["c01_t03_s39_f01", "c01_t03_s39_f02", "c01_t03_s39_f03", "c01_t03_s39_f04", "c01_t03_s39_f03", "c01_t03_s39_f02",],
        /*  57 */ ["c01_t03_s40_f01", "c01_t03_s40_f02", "c01_t03_s40_f03", "c01_t03_s40_f04", "c01_t03_s40_f03", "c01_t03_s40_f02",],
        /*  58 */ ["c01_t03_s41_f01", "c01_t03_s41_f02", "c01_t03_s41_f03", "c01_t03_s41_f04", "c01_t03_s41_f03", "c01_t03_s41_f02",],
        /*  59 */ ["c01_t03_s42_f01", "c01_t03_s42_f02", "c01_t03_s42_f03", "c01_t03_s42_f04", "c01_t03_s42_f03", "c01_t03_s42_f02",],
        /*  60 */ ["c01_t03_s43_f01", "c01_t03_s43_f02", "c01_t03_s43_f03", "c01_t03_s43_f04", "c01_t03_s43_f03", "c01_t03_s43_f02",],
        /*  61 */ ["c01_t03_s44_f01", "c01_t03_s44_f02", "c01_t03_s44_f03", "c01_t03_s44_f04", "c01_t03_s44_f03", "c01_t03_s44_f02",],
        /*  62 */ ["c01_t03_s45_f01", "c01_t03_s45_f02", "c01_t03_s45_f03", "c01_t03_s45_f04", "c01_t03_s45_f03", "c01_t03_s45_f02",],
        /*  63 */ ["c01_t03_s46_f01", "c01_t03_s46_f02", "c01_t03_s46_f03", "c01_t03_s46_f04", "c01_t03_s46_f03", "c01_t03_s46_f02",],
        /*  64 */ ["c01_t03_s47_f01", "c01_t03_s47_f02", "c01_t03_s47_f03", "c01_t03_s47_f04", "c01_t03_s47_f03", "c01_t03_s47_f02",],

        ////////// beach * 36 //////////
        /*  65 */ ["c01_t04_s01_f01", "c01_t04_s01_f02", "c01_t04_s01_f03", "c01_t04_s01_f04", "c01_t04_s01_f03", "c01_t04_s01_f02",],
        /*  66 */ ["c01_t04_s02_f01", "c01_t04_s02_f02", "c01_t04_s02_f03", "c01_t04_s02_f04", "c01_t04_s02_f03", "c01_t04_s02_f02",],
        /*  67 */ ["c01_t04_s03_f01", "c01_t04_s03_f02", "c01_t04_s03_f03", "c01_t04_s03_f04", "c01_t04_s03_f03", "c01_t04_s03_f02",],
        /*  68 */ ["c01_t04_s04_f01", "c01_t04_s04_f02", "c01_t04_s04_f03", "c01_t04_s04_f04", "c01_t04_s04_f03", "c01_t04_s04_f02",],
        /*  69 */ ["c01_t04_s05_f01", "c01_t04_s05_f02", "c01_t04_s05_f03", "c01_t04_s05_f04", "c01_t04_s05_f03", "c01_t04_s05_f02",],
        /*  70 */ ["c01_t04_s06_f01", "c01_t04_s06_f02", "c01_t04_s06_f03", "c01_t04_s06_f04", "c01_t04_s06_f03", "c01_t04_s06_f02",],
        /*  71 */ ["c01_t04_s07_f01", "c01_t04_s07_f02", "c01_t04_s07_f03", "c01_t04_s07_f04", "c01_t04_s07_f03", "c01_t04_s07_f02",],
        /*  72 */ ["c01_t04_s08_f01", "c01_t04_s08_f02", "c01_t04_s08_f03", "c01_t04_s08_f04", "c01_t04_s08_f03", "c01_t04_s08_f02",],
        /*  73 */ ["c01_t04_s09_f01", "c01_t04_s09_f02", "c01_t04_s09_f03", "c01_t04_s09_f04", "c01_t04_s09_f03", "c01_t04_s09_f02",],
        /*  74 */ ["c01_t04_s10_f01", "c01_t04_s10_f02", "c01_t04_s10_f03", "c01_t04_s10_f04", "c01_t04_s10_f03", "c01_t04_s10_f02",],
        /*  75 */ ["c01_t04_s11_f01", "c01_t04_s11_f02", "c01_t04_s11_f03", "c01_t04_s11_f04", "c01_t04_s11_f03", "c01_t04_s11_f02",],
        /*  76 */ ["c01_t04_s12_f01", "c01_t04_s12_f02", "c01_t04_s12_f03", "c01_t04_s12_f04", "c01_t04_s12_f03", "c01_t04_s12_f02",],
        /*  77 */ ["c01_t04_s13_f01", "c01_t04_s13_f02", "c01_t04_s13_f03", "c01_t04_s13_f04", "c01_t04_s13_f03", "c01_t04_s13_f02",],
        /*  78 */ ["c01_t04_s14_f01", "c01_t04_s14_f02", "c01_t04_s14_f03", "c01_t04_s14_f04", "c01_t04_s14_f03", "c01_t04_s14_f02",],
        /*  79 */ ["c01_t04_s15_f01", "c01_t04_s15_f02", "c01_t04_s15_f03", "c01_t04_s15_f04", "c01_t04_s15_f03", "c01_t04_s15_f02",],
        /*  80 */ ["c01_t04_s16_f01", "c01_t04_s16_f02", "c01_t04_s16_f03", "c01_t04_s16_f04", "c01_t04_s16_f03", "c01_t04_s16_f02",],
        /*  81 */ ["c01_t04_s17_f01", "c01_t04_s17_f02", "c01_t04_s17_f03", "c01_t04_s17_f04", "c01_t04_s17_f03", "c01_t04_s17_f02",],
        /*  82 */ ["c01_t04_s18_f01", "c01_t04_s18_f02", "c01_t04_s18_f03", "c01_t04_s18_f04", "c01_t04_s18_f03", "c01_t04_s18_f02",],
        /*  83 */ ["c01_t04_s19_f01", "c01_t04_s19_f02", "c01_t04_s19_f03", "c01_t04_s19_f04", "c01_t04_s19_f03", "c01_t04_s19_f02",],
        /*  84 */ ["c01_t04_s20_f01", "c01_t04_s20_f02", "c01_t04_s20_f03", "c01_t04_s20_f04", "c01_t04_s20_f03", "c01_t04_s20_f02",],
        /*  85 */ ["c01_t04_s21_f01", "c01_t04_s21_f02", "c01_t04_s21_f03", "c01_t04_s21_f04", "c01_t04_s21_f03", "c01_t04_s21_f02",],
        /*  86 */ ["c01_t04_s22_f01", "c01_t04_s22_f02", "c01_t04_s22_f03", "c01_t04_s22_f04", "c01_t04_s22_f03", "c01_t04_s22_f02",],
        /*  87 */ ["c01_t04_s23_f01", "c01_t04_s23_f02", "c01_t04_s23_f03", "c01_t04_s23_f04", "c01_t04_s23_f03", "c01_t04_s23_f02",],
        /*  88 */ ["c01_t04_s24_f01", "c01_t04_s24_f02", "c01_t04_s24_f03", "c01_t04_s24_f04", "c01_t04_s24_f03", "c01_t04_s24_f02",],
        /*  89 */ ["c01_t04_s25_f01", "c01_t04_s25_f02", "c01_t04_s25_f03", "c01_t04_s25_f04", "c01_t04_s25_f03", "c01_t04_s25_f02",],
        /*  90 */ ["c01_t04_s26_f01", "c01_t04_s26_f02", "c01_t04_s26_f03", "c01_t04_s26_f04", "c01_t04_s26_f03", "c01_t04_s26_f02",],
        /*  91 */ ["c01_t04_s27_f01", "c01_t04_s27_f02", "c01_t04_s27_f03", "c01_t04_s27_f04", "c01_t04_s27_f03", "c01_t04_s27_f02",],
        /*  92 */ ["c01_t04_s28_f01", "c01_t04_s28_f02", "c01_t04_s28_f03", "c01_t04_s28_f04", "c01_t04_s28_f03", "c01_t04_s28_f02",],
        /*  93 */ ["c01_t04_s29_f01", "c01_t04_s29_f02", "c01_t04_s29_f03", "c01_t04_s29_f04", "c01_t04_s29_f03", "c01_t04_s29_f02",],
        /*  94 */ ["c01_t04_s30_f01", "c01_t04_s30_f02", "c01_t04_s30_f03", "c01_t04_s30_f04", "c01_t04_s30_f03", "c01_t04_s30_f02",],
        /*  95 */ ["c01_t04_s31_f01", "c01_t04_s31_f02", "c01_t04_s31_f03", "c01_t04_s31_f04", "c01_t04_s31_f03", "c01_t04_s31_f02",],
        /*  96 */ ["c01_t04_s32_f01", "c01_t04_s32_f02", "c01_t04_s32_f03", "c01_t04_s32_f04", "c01_t04_s32_f03", "c01_t04_s32_f02",],
        /*  97 */ ["c01_t04_s33_f01", "c01_t04_s33_f02", "c01_t04_s33_f03", "c01_t04_s33_f04", "c01_t04_s33_f03", "c01_t04_s33_f02",],
        /*  98 */ ["c01_t04_s34_f01", "c01_t04_s34_f02", "c01_t04_s34_f03", "c01_t04_s34_f04", "c01_t04_s34_f03", "c01_t04_s34_f02",],
        /*  99 */ ["c01_t04_s35_f01", "c01_t04_s35_f02", "c01_t04_s35_f03", "c01_t04_s35_f04", "c01_t04_s35_f03", "c01_t04_s35_f02",],
        /* 100 */ ["c01_t04_s36_f01", "c01_t04_s36_f02", "c01_t04_s36_f03", "c01_t04_s36_f04", "c01_t04_s36_f03", "c01_t04_s36_f02",],
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
        /*  28 */ ["c02_t008_s01_f01", "c02_t008_s01_f02", "c02_t008_s01_f03", "c02_t008_s01_f04", "c02_t008_s01_f03", "c02_t008_s01_f02",],

        ////////// mist * 1 //////////
        /*  29 */ ["c02_t009_s01_f01",],

        ////////// reef * 1 //////////
        /*  30 */ ["c02_t010_s01_f01", "c02_t010_s01_f02", "c02_t010_s01_f03", "c02_t010_s01_f04", "c02_t010_s01_f03", "c02_t010_s01_f02",],

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
        /*  50 */ ["c02_t015_s01_f01", "c02_t015_s01_f02",],
        /*  51 */ ["c02_t015_s02_f01", "c02_t015_s02_f02",],
        /*  52 */ ["c02_t015_s03_f01", "c02_t015_s03_f02",],
        /*  53 */ ["c02_t015_s04_f01", "c02_t015_s04_f02",],

        ////////// city * 5 //////////
        /*  54 */ ["c02_t016_s01_f01", "c02_t016_s01_f02",],
        /*  55 */ ["c02_t016_s02_f01", "c02_t016_s02_f02",],
        /*  56 */ ["c02_t016_s03_f01", "c02_t016_s03_f02",],
        /*  57 */ ["c02_t016_s04_f01", "c02_t016_s04_f02",],
        /*  58 */ ["c02_t016_s05_f01", "c02_t016_s05_f02",],

        ////////// commandtower * 5 //////////
        /*  59 */ ["c02_t017_s01_f01", "c02_t017_s01_f02",],
        /*  60 */ ["c02_t017_s02_f01", "c02_t017_s02_f02",],
        /*  61 */ ["c02_t017_s03_f01", "c02_t017_s03_f02",],
        /*  62 */ ["c02_t017_s04_f01", "c02_t017_s04_f02",],
        /*  63 */ ["c02_t017_s05_f01", "c02_t017_s05_f02",],

        ////////// radar * 5 //////////
        /*  64 */ ["c02_t018_s01_f01", "c02_t018_s01_f02",],
        /*  65 */ ["c02_t018_s02_f01", "c02_t018_s02_f02",],
        /*  66 */ ["c02_t018_s03_f01", "c02_t018_s03_f02",],
        /*  67 */ ["c02_t018_s04_f01", "c02_t018_s04_f02",],
        /*  68 */ ["c02_t018_s05_f01", "c02_t018_s05_f02",],

        ////////// factory * 5 //////////
        /*  69 */ ["c02_t019_s01_f01", "c02_t019_s01_f02",],
        /*  70 */ ["c02_t019_s02_f01", "c02_t019_s02_f02",],
        /*  71 */ ["c02_t019_s03_f01", "c02_t019_s03_f02",],
        /*  72 */ ["c02_t019_s04_f01", "c02_t019_s04_f02",],
        /*  73 */ ["c02_t019_s05_f01", "c02_t019_s05_f02",],

        ////////// airport * 5 //////////
        /*  74 */ ["c02_t020_s01_f01", "c02_t020_s01_f02",],
        /*  75 */ ["c02_t020_s02_f01", "c02_t020_s02_f02",],
        /*  76 */ ["c02_t020_s03_f01", "c02_t020_s03_f02",],
        /*  77 */ ["c02_t020_s04_f01", "c02_t020_s04_f02",],
        /*  78 */ ["c02_t020_s05_f01", "c02_t020_s05_f02",],

        ////////// seaport * 5 //////////
        /*  79 */ ["c02_t021_s01_f01", "c02_t021_s01_f02",],
        /*  80 */ ["c02_t021_s02_f01", "c02_t021_s02_f02",],
        /*  81 */ ["c02_t021_s03_f01", "c02_t021_s03_f02",],
        /*  82 */ ["c02_t021_s04_f01", "c02_t021_s04_f02",],
        /*  83 */ ["c02_t021_s05_f01", "c02_t021_s05_f02",],

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

    export namespace IdConverter {
        export function getTileBaseType(tileBaseViewId: number): TileBaseType {
            return TILE_BASE_TYPES[tileBaseViewId];
        }

        export function getTileObjectTypeAndPlayerIndex(tileObjectViewId: number): TileObjectTypeAndPlayerIndex {
            return TILE_OBJECT_TYPES_AND_PLAYER_INDEX[tileObjectViewId];
        }

        export function getTileBaseImageSource(tileBaseViewId: number, tickCount: number): string {
            const sources = TILE_BASE_IMAGE_SOURCES[tileBaseViewId];
            return sources[tickCount % sources.length];
        }

        export function getTileObjectImageSource(tileObjectViewId: number, tickCount: number): string {
            const sources = TILE_OBJECT_IMAGE_SOURCES[tileObjectViewId];
            return sources[tickCount % sources.length];
        }
    }
}
