
namespace TinyWars.ConfigManager {
    import Types            = Utility.Types;
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
    // Configurations and initialization.
    ////////////////////////////////////////////////////////////////////////////////
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
        maxUnitPromotion       ?: number;
        secondaryWeaponFlag     : { [unitType: number]: boolean };
    }

    const TILE_TYPE_MAPPING: Readonly<{ [tileBaseType: number]: { [tileObjectType: number]: TileType } }> = {
        [TileBaseType.Beach]: {
            [TileObjectType.Empty]       : TileType.Beach,              [TileObjectType.Road]        : TileType.Road,
            [TileObjectType.Bridge]      : TileType.BridgeOnBeach,      [TileObjectType.Wood]        : TileType.Wood,
            [TileObjectType.Mountain]    : TileType.Mountain,           [TileObjectType.Wasteland]   : TileType.Wasteland,
            [TileObjectType.Ruins]       : TileType.Ruins,              [TileObjectType.Fire]        : TileType.Fire,
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.MistOnBeach,
            [TileObjectType.Reef]        : TileType.Reef,               [TileObjectType.Plasma]      : TileType.Plasma,
            [TileObjectType.Meteor]      : TileType.Meteor,             [TileObjectType.Silo]        : TileType.Silo,
            [TileObjectType.EmptySilo]   : TileType.EmptySilo,          [TileObjectType.Headquarters]: TileType.Headquarters,
            [TileObjectType.City]        : TileType.City,               [TileObjectType.CommandTower]: TileType.CommandTower,
            [TileObjectType.Radar]       : TileType.Radar,              [TileObjectType.Factory]     : TileType.Factory,
            [TileObjectType.Airport]     : TileType.Airport,            [TileObjectType.Seaport]     : TileType.Seaport,
            [TileObjectType.TempAirport] : TileType.TempAirport,        [TileObjectType.TempSeaport] : TileType.TempSeaport,
            [TileObjectType.GreenPlasma] : TileType.GreenPlasma,
        },
        [TileBaseType.Plain]: {
            [TileObjectType.Empty]       : TileType.Beach,              [TileObjectType.Road]        : TileType.Road,
            [TileObjectType.Bridge]      : TileType.BridgeOnPlain,      [TileObjectType.Wood]        : TileType.Wood,
            [TileObjectType.Mountain]    : TileType.Mountain,           [TileObjectType.Wasteland]   : TileType.Wasteland,
            [TileObjectType.Ruins]       : TileType.Ruins,              [TileObjectType.Fire]        : TileType.Fire,
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.MistOnPlain,
            [TileObjectType.Reef]        : TileType.Reef,               [TileObjectType.Plasma]      : TileType.Plasma,
            [TileObjectType.Meteor]      : TileType.Meteor,             [TileObjectType.Silo]        : TileType.Silo,
            [TileObjectType.EmptySilo]   : TileType.EmptySilo,          [TileObjectType.Headquarters]: TileType.Headquarters,
            [TileObjectType.City]        : TileType.City,               [TileObjectType.CommandTower]: TileType.CommandTower,
            [TileObjectType.Radar]       : TileType.Radar,              [TileObjectType.Factory]     : TileType.Factory,
            [TileObjectType.Airport]     : TileType.Airport,            [TileObjectType.Seaport]     : TileType.Seaport,
            [TileObjectType.TempAirport] : TileType.TempAirport,        [TileObjectType.TempSeaport] : TileType.TempSeaport,
            [TileObjectType.GreenPlasma] : TileType.GreenPlasma,
        },
        [TileBaseType.River]: {
            [TileObjectType.Empty]       : TileType.Beach,              [TileObjectType.Road]        : TileType.Road,
            [TileObjectType.Bridge]      : TileType.BridgeOnRiver,      [TileObjectType.Wood]        : TileType.Wood,
            [TileObjectType.Mountain]    : TileType.Mountain,           [TileObjectType.Wasteland]   : TileType.Wasteland,
            [TileObjectType.Ruins]       : TileType.Ruins,              [TileObjectType.Fire]        : TileType.Fire,
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.MistOnRiver,
            [TileObjectType.Reef]        : TileType.Reef,               [TileObjectType.Plasma]      : TileType.Plasma,
            [TileObjectType.Meteor]      : TileType.Meteor,             [TileObjectType.Silo]        : TileType.Silo,
            [TileObjectType.EmptySilo]   : TileType.EmptySilo,          [TileObjectType.Headquarters]: TileType.Headquarters,
            [TileObjectType.City]        : TileType.City,               [TileObjectType.CommandTower]: TileType.CommandTower,
            [TileObjectType.Radar]       : TileType.Radar,              [TileObjectType.Factory]     : TileType.Factory,
            [TileObjectType.Airport]     : TileType.Airport,            [TileObjectType.Seaport]     : TileType.Seaport,
            [TileObjectType.TempAirport] : TileType.TempAirport,        [TileObjectType.TempSeaport] : TileType.TempSeaport,
            [TileObjectType.GreenPlasma] : TileType.GreenPlasma,
        },
        [TileBaseType.Sea]: {
            [TileObjectType.Empty]       : TileType.Beach,              [TileObjectType.Road]        : TileType.Road,
            [TileObjectType.Bridge]      : TileType.BridgeOnSea,        [TileObjectType.Wood]        : TileType.Wood,
            [TileObjectType.Mountain]    : TileType.Mountain,           [TileObjectType.Wasteland]   : TileType.Wasteland,
            [TileObjectType.Ruins]       : TileType.Ruins,              [TileObjectType.Fire]        : TileType.Fire,
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.MistOnSea,
            [TileObjectType.Reef]        : TileType.Reef,               [TileObjectType.Plasma]      : TileType.Plasma,
            [TileObjectType.Meteor]      : TileType.Meteor,             [TileObjectType.Silo]        : TileType.Silo,
            [TileObjectType.EmptySilo]   : TileType.EmptySilo,          [TileObjectType.Headquarters]: TileType.Headquarters,
            [TileObjectType.City]        : TileType.City,               [TileObjectType.CommandTower]: TileType.CommandTower,
            [TileObjectType.Radar]       : TileType.Radar,              [TileObjectType.Factory]     : TileType.Factory,
            [TileObjectType.Airport]     : TileType.Airport,            [TileObjectType.Seaport]     : TileType.Seaport,
            [TileObjectType.TempAirport] : TileType.TempAirport,        [TileObjectType.TempSeaport] : TileType.TempSeaport,
            [TileObjectType.GreenPlasma] : TileType.GreenPlasma,
        },
    };

    const GRID_SIZE: GridSize = {
        width: 72,
        height: 72
    };

    const ALL_CONFIGS: { [version: number]: FullConfig } = {};

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function getGridSize(): GridSize {
        return GRID_SIZE;
    }

    export function getLatestConfigVersion(): number {
        // TODO
        return 0;
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        return TILE_TYPE_MAPPING[baseType][objectType];
    }

    export function getTileTemplateCfg(version: number, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
        return ALL_CONFIGS[version].TileTemplate[getTileType(baseType, objectType)];
    }

    export function getTileTypesByCategory(version: number, category: TileCategory): TileType[] | undefined | null {
        return ALL_CONFIGS[version].TileCategory[category].tileTypes;
    }

    export function getUnitTemplateCfg(version: number, unitType: UnitType): UnitTemplateCfg {
        return ALL_CONFIGS[version].UnitTemplate[unitType];
    }

    export function getUnitTypesByCategory(version: number, category: UnitCategory): UnitType[] | undefined | null {
        return ALL_CONFIGS[version].UnitCategory[category].unitTypes;
    }

    export function checkIsInUnitCategory(version: number, unitType: UnitType, category: UnitCategory): boolean {
        const types = getUnitTypesByCategory(version, category);
        return (types != null) && (types.indexOf(unitType) >= 0);
    }

    export function getUnitMaxPromotion(version: number): number {
        const cfg = ALL_CONFIGS[version];
        if (cfg.maxUnitPromotion == null) {
            cfg.maxUnitPromotion = 0;
            for (const k in cfg.UnitPromotion) {
                cfg.maxUnitPromotion = Math.max(cfg.maxUnitPromotion, cfg.UnitPromotion[k].promotion!);
            }
        }
        return ALL_CONFIGS[version].maxUnitPromotion!;
    }

    export function checkHasSecondaryWeapon(version: number, unitType: UnitType): boolean {
        const cfg = ALL_CONFIGS[version].secondaryWeaponFlag;
        if (cfg[unitType] == null) {
            cfg[unitType]   = false;
            const chartCfg  = ALL_CONFIGS[version].DamageChart[unitType];
            for (const k in chartCfg) {
                if (chartCfg[k][WeaponType.Secondary].damage != null) {
                    cfg[unitType] = true;
                    break;
                }
            }
        }
        return cfg[unitType];
    }

    export function getUnitPromotionAttackBonus(version: number, promotion: number): number {
        return ALL_CONFIGS[version].UnitPromotion![promotion].attackBonus!;
    }

    export function getUnitPromotionDefenseBonus(version: number, promotion: number): number {
        return ALL_CONFIGS[version].UnitPromotion![promotion].defenseBonus!;
    }

    export function getDamageChartCfgs(version: number, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        return ALL_CONFIGS[version].DamageChart[attackerType];
    }

    export function getBuildableTileCfgs(version: number, unitType: UnitType): { [srcTileType: number]: BuildableTileCfg } | undefined {
        return ALL_CONFIGS[version].BuildableTile[unitType];
    }

    export function getVisionBonusCfg(version: number, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
        return ALL_CONFIGS[version].VisionBonus[unitType];
    }

    export function getMoveCostCfg(version: number, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
        return ALL_CONFIGS[version].MoveCost[getTileType(baseType, objectType)];
    }
}
