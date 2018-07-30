
namespace Config {
    import Types          = Utility.Types;
    import TemplateTile   = Types.TemplateTile;
    import TileBaseType   = Types.TileBaseType;
    import TileObjectType = Types.TileObjectType;
    import TileType       = Types.TileType;
    import TemplateUnit   = Types.TemplateUnit;
    import UnitType       = Types.UnitType;
    import UnitCategory   = Types.UnitCategory;
    import TileCategory   = Types.TileCategory;
    import MoveType       = Types.MoveType;
    import ArmorType      = Types.ArmorType;

    const TILE_TYPE_MAPPING: Readonly<{ [tileBaseType: number]: { [tileObjectType: number]: TileType } }> = {
        [TileBaseType.Beach]: {
            [TileObjectType.Empty]       : TileType.Beach,              [TileObjectType.Road]        : TileType.Road,
            [TileObjectType.Bridge]      : TileType.BridgeOnBeach,      [TileObjectType.Wood]        : TileType.Wood,
            [TileObjectType.Mountain]    : TileType.Mountain,           [TileObjectType.Wasteland]   : TileType.Wasteland,
            [TileObjectType.Ruins]       : TileType.Ruins,              [TileObjectType.Fire]        : TileType.Fire,
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.Mist,
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
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.Mist,
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
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.Mist,
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
            [TileObjectType.Rough]       : TileType.Rough,              [TileObjectType.Mist]        : TileType.Mist,
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

    type GameConfig = {
        gridSize      : Types.GridSize;
        maxPromotion  : number;
        promotionBonus: { attack: number, defense: number }[];
        unitCategories: { [unitCategory: number]: UnitType[] };
        tileCategories: { [tileCategory: number]: TileType[] };
        templateTile  : { [tileType: number]: TemplateTile };
        templateUnit  : { [unitType: number]: TemplateUnit };
    };

    const ORIGINAL_CONFIG: GameConfig = {
        gridSize: { width: 72, height: 72 },

        maxPromotion  : 3,
        promotionBonus: [
            {attack: 0,  defense: 0 },
            {attack: 5,  defense: 0 },
            {attack: 10, defense: 0 },
            {attack: 20, defense: 20},
        ],

        unitCategories: {
            [UnitCategory.None]: [
            ],
            [UnitCategory.All]: [
                UnitType.Infantry,   UnitType.Mech,         UnitType.Bike,            UnitType.Recon,
                UnitType.Flare,      UnitType.AntiAir,      UnitType.Tank,            UnitType.MediumTank,
                UnitType.WarTank,    UnitType.Artillery,    UnitType.AntiTank,        UnitType.Rockets,
                UnitType.Missiles,   UnitType.Rig,          UnitType.Fighter,         UnitType.Bomber,
                UnitType.Duster,     UnitType.BattleCopter, UnitType.TransportCopter, UnitType.Seaplane,
                UnitType.Battleship, UnitType.Carrier,      UnitType.Submarine,       UnitType.Cruiser,
                UnitType.Lander,     UnitType.Gunboat,
            ],
            [UnitCategory.Ground]: [
                UnitType.Infantry, UnitType.Mech,      UnitType.Bike,     UnitType.Recon,
                UnitType.Flare,    UnitType.AntiAir,   UnitType.Tank,     UnitType.MediumTank,
                UnitType.WarTank,  UnitType.Artillery, UnitType.AntiTank, UnitType.Rockets,
                UnitType.Missiles, UnitType.Rig,
            ],
            [UnitCategory.Naval]: [
                UnitType.Battleship, UnitType.Carrier, UnitType.Submarine, UnitType.Cruiser,
                UnitType.Lander,     UnitType.Gunboat,
            ],
            [UnitCategory.Air]: [
                UnitType.Fighter,         UnitType.Bomber,   UnitType.Duster, UnitType.BattleCopter,
                UnitType.TransportCopter, UnitType.Seaplane,
            ],
            [UnitCategory.GroundOrNaval]: [
                UnitType.Infantry,  UnitType.Mech,      UnitType.Bike,       UnitType.Recon,
                UnitType.Flare,     UnitType.AntiAir,   UnitType.Tank,       UnitType.MediumTank,
                UnitType.WarTank,   UnitType.Artillery, UnitType.AntiTank,   UnitType.Rockets,
                UnitType.Missiles,  UnitType.Rig,       UnitType.Battleship, UnitType.Carrier,
                UnitType.Submarine, UnitType.Cruiser,   UnitType.Lander,     UnitType.Gunboat,
            ],
            [UnitCategory.GroundOrAir]: [
                UnitType.Infantry, UnitType.Mech,         UnitType.Bike,            UnitType.Recon,
                UnitType.Flare,    UnitType.AntiAir,      UnitType.Tank,            UnitType.MediumTank,
                UnitType.WarTank,  UnitType.Artillery,    UnitType.AntiTank,        UnitType.Rockets,
                UnitType.Missiles, UnitType.Rig,          UnitType.Fighter,         UnitType.Bomber,
                UnitType.Duster,   UnitType.BattleCopter, UnitType.TransportCopter, UnitType.Seaplane,
            ],
            [UnitCategory.Direct]: [
                UnitType.Infantry,     UnitType.Mech,     UnitType.Bike,    UnitType.Recon,
                UnitType.Flare,        UnitType.AntiAir,  UnitType.Tank,    UnitType.MediumTank,
                UnitType.WarTank,      UnitType.Fighter,  UnitType.Bomber,  UnitType.Duster,
                UnitType.BattleCopter, UnitType.Seaplane, UnitType.Carrier, UnitType.Submarine,
                UnitType.Cruiser,      UnitType.Gunboat,
            ],
            [UnitCategory.Indirect]: [
                UnitType.Artillery, UnitType.AntiTank, UnitType.Rockets, UnitType.Missiles,
                UnitType.Battleship,
            ],
            [UnitCategory.Foot]: [
                UnitType.Infantry, UnitType.Mech,
            ],
            [UnitCategory.Infantry]: [
                UnitType.Infantry, UnitType.Mech, UnitType.Bike,
            ],
            [UnitCategory.Vehicle]: [
                UnitType.Recon,      UnitType.Flare,    UnitType.AntiAir,   UnitType.Tank,
                UnitType.MediumTank, UnitType.WarTank,  UnitType.Artillery, UnitType.AntiTank,
                UnitType.Rockets,    UnitType.Missiles, UnitType.Rig,
            ],
            [UnitCategory.DirectMachine]: [
                UnitType.Recon,      UnitType.Flare,        UnitType.AntiAir,  UnitType.Tank,
                UnitType.MediumTank, UnitType.WarTank,      UnitType.Fighter,  UnitType.Bomber,
                UnitType.Duster,     UnitType.BattleCopter, UnitType.Seaplane, UnitType.Carrier,
                UnitType.Submarine,  UnitType.Cruiser,      UnitType.Gunboat,
            ],
            [UnitCategory.Transport]: [
                UnitType.Rig, UnitType.TransportCopter, UnitType.Lander,
            ],
            [UnitCategory.LargeNavel]: [
                UnitType.Battleship, UnitType.Carrier, UnitType.Submarine, UnitType.Cruiser,
            ],
            [UnitCategory.Copter]: [
                UnitType.BattleCopter, UnitType.TransportCopter,
            ],
            [UnitCategory.Tank]: [
                UnitType.Tank, UnitType.MediumTank, UnitType.WarTank,
            ],
            [UnitCategory.AirExceptSeaplane]: [
                UnitType.Fighter,         UnitType.Bomber,  UnitType.Duster,    UnitType.BattleCopter,
                UnitType.TransportCopter,
            ],
        },

        tileCategories: {
            [TileCategory.None]: [
            ],
            [TileCategory.All]: [
                TileType.Plain,             TileType.River,             TileType.Sea,               TileType.Beach,
                TileType.Road,              TileType.BridgeOnPlain,     TileType.Wood,              TileType.Mountain,
                TileType.Wasteland,         TileType.Ruins,             TileType.Fire,              TileType.Rough,
                TileType.Mist,              TileType.Reef,              TileType.Plasma,            TileType.Meteor,
                TileType.Silo,              TileType.EmptySilo,         TileType.Headquarters,      TileType.City,
                TileType.CommandTower,      TileType.Radar,             TileType.Factory,           TileType.Airport,
                TileType.Seaport,           TileType.TempAirport,       TileType.TempSeaport,       TileType.GreenPlasma,
            ],
            [TileCategory.LoadableForSeaTransports]: [
                TileType.Beach,             TileType.Seaport,           TileType.TempSeaport,       TileType.BridgeOnBeach,
            ],
        },

        templateTile: {
            [TileType.Plain]: {
                defenseAmount      : 10,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 2,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxBuildPoint: 20,
            },
            [TileType.River]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 2,         [MoveType.Mech]: 1,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined, [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.Sea]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : 1,             [MoveType.Ship] : 1,            [MoveType.Transport]: 1,
                },
            },
            [TileType.Beach]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 2,            [MoveType.TireB]    : 2,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: 1,
                },

                maxBuildPoint: 20,
            },
            [TileType.Road]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.BridgeOnPlain]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.BridgeOnRiver]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.BridgeOnBeach]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: 1,
                },
            },
            [TileType.BridgeOnSea]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : 1,            [MoveType.Transport]: 1,
                },
            },
            [TileType.Wood]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 3,            [MoveType.TireB]    : 3,
                    [MoveType.Tank]    : 2,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                hideUnitCategory: UnitCategory.Ground,
            },
            [TileType.Mountain]: {
                defenseAmount      : 40,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 2,             [MoveType.Mech]: 1,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.Wasteland]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 3,            [MoveType.TireB]    : 3,
                    [MoveType.Tank]    : 2,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.Ruins]: {
                defenseAmount      : 10,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 2,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                hideUnitCategory: UnitCategory.Ground,
            },
            [TileType.Fire]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : undefined,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                visionRange                 : 5,
                isVisionEnabledForAllPlayers: true,
            },
            [TileType.Rough]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Naval,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : 1,             [MoveType.Ship] : 2,            [MoveType.Transport]: 2,
                },
            },
            [TileType.Mist]: {
                defenseAmount      : 10,
                defenseUnitCategory: UnitCategory.Naval,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : 1,             [MoveType.Ship] : 1,            [MoveType.Transport]: 1,
                },

                hideUnitCategory: UnitCategory.Naval,
            },
            [TileType.Reef]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Naval,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : 1,             [MoveType.Ship] : 2,            [MoveType.Transport]: 2,
                },

                hideUnitCategory: UnitCategory.Naval,
            },
            [TileType.Plasma]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : undefined,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                isDestroyedWithAdjacentMeteor: true,
            },
            [TileType.GreenPlasma]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : undefined,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.Meteor]: {
                defenseAmount      : 0,
                defenseUnitCategory: UnitCategory.None,

                moveCosts: {
                    [MoveType.Infantry]: undefined,     [MoveType.Mech]: undefined,     [MoveType.TireA]: undefined,    [MoveType.TireB]    : undefined,
                    [MoveType.Tank]    : undefined,     [MoveType.Air] : undefined,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxHp           : 99,
                armorType       : ArmorType.Meteor,
                isAffectedByLuck: false,
            },
            [TileType.Silo]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.EmptySilo]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },
            },
            [TileType.Headquarters]: {
                defenseAmount      : 40,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint  : 20,
                isDefeatOnCapture: true,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Ground,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.Ground,
            },
            [TileType.City]: {
                defenseAmount      : 20,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Ground,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.Ground,
            },
            [TileType.CommandTower]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.Ground,

                globalAttackBonus : 5,
                globalDefenseBonus: 5,
            },
            [TileType.Radar]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                incomePerTurn: 1000,

                visionRange                 : 5,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.Ground,
            },
            [TileType.Factory]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Ground,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.Ground,

                produceUnitCategory: UnitCategory.Ground,
            },
            [TileType.Airport]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Air,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.GroundOrAir,

                produceUnitCategory: UnitCategory.AirExceptSeaplane,
            },
            [TileType.Seaport]: {
                defenseAmount      : 30,
                defenseUnitCategory: UnitCategory.GroundOrNaval,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,    [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : 1,    [MoveType.Transport]: 1,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Naval,

                incomePerTurn: 1000,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.GroundOrNaval,

                produceUnitCategory: UnitCategory.Naval,
            },
            [TileType.TempAirport]: {
                defenseAmount      : 10,
                defenseUnitCategory: UnitCategory.Ground,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,            [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : undefined,    [MoveType.Transport]: undefined,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Air,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.GroundOrAir,
            },
            [TileType.TempSeaport]: {
                defenseAmount      : 10,
                defenseUnitCategory: UnitCategory.GroundOrNaval,

                moveCosts: {
                    [MoveType.Infantry]: 1,     [MoveType.Mech]: 1,     [MoveType.TireA]: 1,    [MoveType.TireB]    : 1,
                    [MoveType.Tank]    : 1,     [MoveType.Air] : 1,     [MoveType.Ship] : 1,    [MoveType.Transport]: 1,
                },

                maxCapturePoint: 20,

                repairAmount      : 2,
                repairUnitCategory: UnitCategory.Naval,

                visionRange                 : 2,
                isVisionEnabledForAllPlayers: false,

                hideUnitCategory: UnitCategory.GroundOrNaval,
            },
        },

        templateUnit: {
            [UnitType.Infantry]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 55,            [ArmorType.Mech]      : 45,             [ArmorType.Bike]        : 45,
                    [ArmorType.Recon]          : 12,            [ArmorType.Flare]     : 10,             [ArmorType.AntiAir]     : 3,
                    [ArmorType.Tank]           : 5,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 10,            [ArmorType.AntiTank]  : 30,             [ArmorType.Rockets]     : 20,
                    [ArmorType.Missiles]       : 20,            [ArmorType.Rig]       : 14,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 8,
                    [ArmorType.TransportCopter]: 30,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Infantry,
                isAffectedByLuck: true,

                moveRange: 3,
                moveType : MoveType.Infantry,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                canCaptureTile: true,

                canLaunchSilo: true,

                productionCost: 1500,

                visionRange: 2,
                visionBonusOnTiles: {
                    [TileType.Mountain]: 3,
                },
            },
            [UnitType.Mech]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 3,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : 85,            [ArmorType.Flare]     : 80,             [ArmorType.AntiAir]     : 55,
                    [ArmorType.Tank]           : 55,            [ArmorType.MediumTank]: 25,             [ArmorType.WarTank]     : 15,
                    [ArmorType.Artillery]      : 70,            [ArmorType.AntiTank]  : 55,             [ArmorType.Rockets]     : 85,
                    [ArmorType.Missiles]       : 85,            [ArmorType.Rig]       : 75,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 15,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 65,            [ArmorType.Mech]      : 55,             [ArmorType.Bike]        : 55,
                    [ArmorType.Recon]          : 18,            [ArmorType.Flare]     : 15,             [ArmorType.AntiAir]     : 5,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 15,            [ArmorType.AntiTank]  : 35,             [ArmorType.Rockets]     : 35,
                    [ArmorType.Missiles]       : 35,            [ArmorType.Rig]       : 20,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 12,
                    [ArmorType.TransportCopter]: 35,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Mech,
                isAffectedByLuck: true,

                moveRange: 2,
                moveType : MoveType.Mech,

                maxFuel               : 70,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                canCaptureTile: true,

                canLaunchSilo: true,

                productionCost: 2500,

                visionRange: 2,
                visionBonusOnTiles: {
                    [TileType.Mountain]: 3,
                },
            },
            [UnitType.Bike]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 65,            [ArmorType.Mech]      : 55,             [ArmorType.Bike]        : 55,
                    [ArmorType.Recon]          : 18,            [ArmorType.Flare]     : 15,             [ArmorType.AntiAir]     : 5,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 15,            [ArmorType.AntiTank]  : 35,             [ArmorType.Rockets]     : 35,
                    [ArmorType.Missiles]       : 35,            [ArmorType.Rig]       : 20,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 12,
                    [ArmorType.TransportCopter]: 35,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Bike,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.TireB,

                maxFuel               : 70,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                canCaptureTile: true,

                canLaunchSilo: true,

                productionCost: 2500,

                visionRange: 2,
            },
            [UnitType.Recon]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 75,            [ArmorType.Mech]      : 65,             [ArmorType.Bike]        : 65,
                    [ArmorType.Recon]          : 35,            [ArmorType.Flare]     : 30,             [ArmorType.AntiAir]     : 8,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 45,            [ArmorType.AntiTank]  : 25,             [ArmorType.Rockets]     : 55,
                    [ArmorType.Missiles]       : 55,            [ArmorType.Rig]       : 45,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 18,
                    [ArmorType.TransportCopter]: 35,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Recon,
                isAffectedByLuck: true,

                moveRange: 8,
                moveType : MoveType.TireA,

                maxFuel               : 80,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 4000,

                visionRange: 5,
            },
            [UnitType.Flare]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 80,            [ArmorType.Mech]      : 70,             [ArmorType.Bike]        : 70,
                    [ArmorType.Recon]          : 60,            [ArmorType.Flare]     : 50,             [ArmorType.AntiAir]     : 45,
                    [ArmorType.Tank]           : 10,            [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 45,            [ArmorType.AntiTank]  : 25,             [ArmorType.Rockets]     : 55,
                    [ArmorType.Missiles]       : 55,            [ArmorType.Rig]       : 45,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 18,
                    [ArmorType.TransportCopter]: 35,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 5,
                },

                maxHp           : 100,
                armorType       : ArmorType.Flare,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.Tank,

                maxFuel               : 60,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 5000,

                visionRange: 2,

                flareMaxAmmo : 3,
                flareMaxRange: 5,
                flareRadius  : 2,
            },
            [UnitType.AntiAir]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 105,           [ArmorType.Mech]      : 105,            [ArmorType.Bike]           : 105,
                    [ArmorType.Recon]          : 60,            [ArmorType.Flare]     : 50,             [ArmorType.AntiAir]        : 45,
                    [ArmorType.Tank]           : 15,            [ArmorType.MediumTank]: 10,             [ArmorType.WarTank]        : 5,
                    [ArmorType.Artillery]      : 50,            [ArmorType.AntiTank]  : 25,             [ArmorType.Rockets]        : 55,
                    [ArmorType.Missiles]       : 55,            [ArmorType.Rig]       : 50,             [ArmorType.Fighter]        : 70,
                    [ArmorType.Bomber]         : 70,            [ArmorType.Duster]    : 75,             [ArmorType.BattleCopter]   : 105,
                    [ArmorType.TransportCopter]: 120,           [ArmorType.Seaplane]  : 75,             [ArmorType.Battleship]     : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]        : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]         : 10,
                },

                maxHp           : 100,
                armorType       : ArmorType.AntiAir,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Tank,

                maxFuel               : 60,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 7000,

                visionRange: 2,
            },
            [UnitType.Tank]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                primaryWeaponMaxAmmo  : 6,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : 85,            [ArmorType.Flare]     : 80,             [ArmorType.AntiAir]     : 75,
                    [ArmorType.Tank]           : 55,            [ArmorType.MediumTank]: 35,             [ArmorType.WarTank]     : 20,
                    [ArmorType.Artillery]      : 70,            [ArmorType.AntiTank]  : 30,             [ArmorType.Rockets]     : 85,
                    [ArmorType.Missiles]       : 85,            [ArmorType.Rig]       : 75,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 8,
                    [ArmorType.Carrier]        : 8,             [ArmorType.Submarine] : 9,              [ArmorType.Cruiser]     : 9,
                    [ArmorType.Lander]         : 18,            [ArmorType.Gunboat]   : 55,             [ArmorType.Meteor]      : 20,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 75,            [ArmorType.Mech]      : 70,             [ArmorType.Bike]        : 70,
                    [ArmorType.Recon]          : 40,            [ArmorType.Flare]     : 35,             [ArmorType.AntiAir]     : 8,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 45,            [ArmorType.AntiTank]  : 1,              [ArmorType.Rockets]     : 55,
                    [ArmorType.Missiles]       : 55,            [ArmorType.Rig]       : 45,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 18,
                    [ArmorType.TransportCopter]: 35,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Tank,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Tank,

                maxFuel               : 70,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 7000,

                visionRange: 3,
            },
            [UnitType.MediumTank]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                primaryWeaponMaxAmmo  : 5,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : 95,            [ArmorType.Flare]     : 90,             [ArmorType.AntiAir]     : 90,
                    [ArmorType.Tank]           : 70,            [ArmorType.MediumTank]: 55,             [ArmorType.WarTank]     : 35,
                    [ArmorType.Artillery]      : 85,            [ArmorType.AntiTank]  : 35,             [ArmorType.Rockets]     : 90,
                    [ArmorType.Missiles]       : 90,            [ArmorType.Rig]       : 90,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 10,
                    [ArmorType.Carrier]        : 10,            [ArmorType.Submarine] : 12,             [ArmorType.Cruiser]     : 12,
                    [ArmorType.Lander]         : 22,            [ArmorType.Gunboat]   : 55,             [ArmorType.Meteor]      : 35,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 90,            [ArmorType.Mech]      : 80,             [ArmorType.Bike]        : 80,
                    [ArmorType.Recon]          : 40,            [ArmorType.Flare]     : 35,             [ArmorType.AntiAir]     : 8,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 45,            [ArmorType.AntiTank]  : 1,              [ArmorType.Rockets]     : 60,
                    [ArmorType.Missiles]       : 60,            [ArmorType.Rig]       : 45,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 24,
                    [ArmorType.TransportCopter]: 40,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.MediumTank,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.Tank,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 12000,

                visionRange: 2,
            },
            [UnitType.WarTank]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                primaryWeaponMaxAmmo  : 5,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : 105,           [ArmorType.Flare]     : 105,            [ArmorType.AntiAir]     : 105,
                    [ArmorType.Tank]           : 85,            [ArmorType.MediumTank]: 75,             [ArmorType.WarTank]     : 55,
                    [ArmorType.Artillery]      : 105,           [ArmorType.AntiTank]  : 40,             [ArmorType.Rockets]     : 105,
                    [ArmorType.Missiles]       : 105,           [ArmorType.Rig]       : 105,            [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 12,
                    [ArmorType.Carrier]        : 12,            [ArmorType.Submarine] : 14,             [ArmorType.Cruiser]     : 14,
                    [ArmorType.Lander]         : 28,            [ArmorType.Gunboat]   : 65,             [ArmorType.Meteor]      : 55,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 105,           [ArmorType.Mech]      : 95,             [ArmorType.Bike]        : 95,
                    [ArmorType.Recon]          : 45,            [ArmorType.Flare]     : 40,             [ArmorType.AntiAir]     : 10,
                    [ArmorType.Tank]           : 10,            [ArmorType.MediumTank]: 10,             [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 45,            [ArmorType.AntiTank]  : 1,              [ArmorType.Rockets]     : 65,
                    [ArmorType.Missiles]       : 65,            [ArmorType.Rig]       : 45,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 35,
                    [ArmorType.TransportCopter]: 45,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.WarTank,
                isAffectedByLuck: true,

                moveRange: 4,
                moveType : MoveType.Tank,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 16000,

                visionRange: 2,
            },
            [UnitType.Artillery]: {
                minAttackRange        : 2,
                maxAttackRange        : 3,
                canAttackAfterMove    : false,
                canAttackDivingUnits  : false,
                primaryWeaponMaxAmmo  : 6,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : 90,            [ArmorType.Mech]      : 85,             [ArmorType.Bike]        : 85,
                    [ArmorType.Recon]          : 80,            [ArmorType.Flare]     : 75,             [ArmorType.AntiAir]     : 65,
                    [ArmorType.Tank]           : 60,            [ArmorType.MediumTank]: 45,             [ArmorType.WarTank]     : 35,
                    [ArmorType.Artillery]      : 75,            [ArmorType.AntiTank]  : 55,             [ArmorType.Rockets]     : 80,
                    [ArmorType.Missiles]       : 80,            [ArmorType.Rig]       : 70,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 45,
                    [ArmorType.Carrier]        : 45,            [ArmorType.Submarine] : 55,             [ArmorType.Cruiser]     : 55,
                    [ArmorType.Lander]         : 65,            [ArmorType.Gunboat]   : 100,            [ArmorType.Meteor]      : 45,
                },

                maxHp           : 100,
                armorType       : ArmorType.Artillery,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.Tank,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 6000,

                visionRange: 3,
            },
            [UnitType.AntiTank]: {
                minAttackRange      : 1,
                maxAttackRange      : 3,
                canAttackAfterMove  : false,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 75,            [ArmorType.Mech]      : 65,             [ArmorType.Bike]        : 65,
                    [ArmorType.Recon]          : 75,            [ArmorType.Flare]     : 75,             [ArmorType.AntiAir]     : 75,
                    [ArmorType.Tank]           : 75,            [ArmorType.MediumTank]: 65,             [ArmorType.WarTank]     : 55,
                    [ArmorType.Artillery]      : 65,            [ArmorType.AntiTank]  : 55,             [ArmorType.Rockets]     : 70,
                    [ArmorType.Missiles]       : 70,            [ArmorType.Rig]       : 65,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 45,
                    [ArmorType.TransportCopter]: 55,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 55,
                },

                maxHp           : 100,
                armorType       : ArmorType.AntiTank,
                isAffectedByLuck: true,

                moveRange: 4,
                moveType : MoveType.TireB,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 11000,

                visionRange: 3,
            },
            [UnitType.Rockets]: {
                minAttackRange      : 3,
                maxAttackRange      : 5,
                canAttackAfterMove  : false,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 5,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 95,            [ArmorType.Mech]      : 90,             [ArmorType.Bike]        : 90,
                    [ArmorType.Recon]          : 90,            [ArmorType.Flare]     : 85,             [ArmorType.AntiAir]     : 75,
                    [ArmorType.Tank]           : 70,            [ArmorType.MediumTank]: 55,             [ArmorType.WarTank]     : 45,
                    [ArmorType.Artillery]      : 80,            [ArmorType.AntiTank]  : 65,             [ArmorType.Rockets]     : 85,
                    [ArmorType.Missiles]       : 85,            [ArmorType.Rig]       : 80,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 55,
                    [ArmorType.Carrier]        : 55,            [ArmorType.Submarine] : 65,             [ArmorType.Cruiser]     : 65,
                    [ArmorType.Lander]         : 75,            [ArmorType.Gunboat]   : 105,            [ArmorType.Meteor]      : 55,
                },

                maxHp           : 100,
                armorType       : ArmorType.Rockets,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.TireA,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 15000,

                visionRange: 3,
            },
            [UnitType.Missiles]: {
                minAttackRange      : 3,
                maxAttackRange      : 6,
                canAttackAfterMove  : false,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 5,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : 100,
                    [ArmorType.Bomber]         : 100,           [ArmorType.Duster]    : 100,            [ArmorType.BattleCopter]: 120,
                    [ArmorType.TransportCopter]: 120,           [ArmorType.Seaplane]  : 100,            [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Missiles,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.TireA,

                maxFuel               : 50,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                productionCost: 12000,

                visionRange: 5,
            },
            [UnitType.Rig]: {
                maxHp           : 100,
                armorType       : ArmorType.Rig,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Tank,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 0,
                isDestroyedOnOutOfFuel: false,

                maxLoadUnitsCount         : 1,
                loadUnitCategory          : UnitCategory.Foot,
                canLaunchLoadedUnits      : false,
                canDropLoadedUnits        : true,
                canSupplyLoadedUnits      : false,
                repairAmountForLoadedUnits: undefined,
                loadableTileCategory      : TileCategory.All,

                canSupplyAdjacentUnits: true,

                maxBuildMaterial: 1,
                buildTiles      : {
                    [TileType.Plain]: TileType.TempAirport,
                    [TileType.Beach]: TileType.TempSeaport,
                },

                productionCost: 5000,

                visionRange: 1,
            },
            [UnitType.Fighter]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : 55,
                    [ArmorType.Bomber]         : 65,            [ArmorType.Duster]    : 80,             [ArmorType.BattleCopter]: 120,
                    [ArmorType.TransportCopter]: 120,           [ArmorType.Seaplane]  : 65,             [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Fighter,
                isAffectedByLuck: true,

                moveRange: 9,
                moveType : MoveType.Air,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 5,
                isDestroyedOnOutOfFuel: true,

                productionCost: 20000,

                visionRange: 5,
            },
            [UnitType.Bomber]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 115,           [ArmorType.Mech]      : 110,            [ArmorType.Bike]        : 110,
                    [ArmorType.Recon]          : 105,           [ArmorType.Flare]     : 105,            [ArmorType.AntiAir]     : 85,
                    [ArmorType.Tank]           : 105,           [ArmorType.MediumTank]: 95,             [ArmorType.WarTank]     : 75,
                    [ArmorType.Artillery]      : 105,           [ArmorType.AntiTank]  : 80,             [ArmorType.Rockets]     : 105,
                    [ArmorType.Missiles]       : 95,            [ArmorType.Rig]       : 105,            [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 85,
                    [ArmorType.Carrier]        : 85,            [ArmorType.Submarine] : 95,             [ArmorType.Cruiser]     : 50,
                    [ArmorType.Lander]         : 95,            [ArmorType.Gunboat]   : 120,            [ArmorType.Meteor]      : 90,
                },

                maxHp           : 100,
                armorType       : ArmorType.Bomber,
                isAffectedByLuck: true,

                moveRange: 7,
                moveType : MoveType.Air,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 5,
                isDestroyedOnOutOfFuel: true,

                productionCost: 20000,

                visionRange: 3,
            },
            [UnitType.Duster]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 9,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 55,            [ArmorType.Mech]      : 45,             [ArmorType.Bike]        : 45,
                    [ArmorType.Recon]          : 18,            [ArmorType.Flare]     : 15,             [ArmorType.AntiAir]     : 5,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 5,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 15,            [ArmorType.AntiTank]  : 5,              [ArmorType.Rockets]     : 20,
                    [ArmorType.Missiles]       : 20,            [ArmorType.Rig]       : 15,             [ArmorType.Fighter]     : 40,
                    [ArmorType.Bomber]         : 45,            [ArmorType.Duster]    : 55,             [ArmorType.BattleCopter]: 75,
                    [ArmorType.TransportCopter]: 90,            [ArmorType.Seaplane]  : 45,             [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.Duster,
                isAffectedByLuck: true,

                moveRange: 8,
                moveType : MoveType.Air,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 5,
                isDestroyedOnOutOfFuel: true,

                productionCost: 13000,

                visionRange: 4,
            },
            [UnitType.BattleCopter]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                primaryWeaponMaxAmmo  : 6,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : 75,            [ArmorType.Flare]     : 75,             [ArmorType.AntiAir]     : 10,
                    [ArmorType.Tank]           : 70,            [ArmorType.MediumTank]: 45,             [ArmorType.WarTank]     : 35,
                    [ArmorType.Artillery]      : 65,            [ArmorType.AntiTank]  : 20,             [ArmorType.Rockets]     : 75,
                    [ArmorType.Missiles]       : 55,            [ArmorType.Rig]       : 70,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 25,
                    [ArmorType.Carrier]        : 25,            [ArmorType.Submarine] : 25,             [ArmorType.Cruiser]     : 5,
                    [ArmorType.Lander]         : 25,            [ArmorType.Gunboat]   : 85,             [ArmorType.Meteor]      : 20,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : 75,            [ArmorType.Mech]      : 65,             [ArmorType.Bike]        : 65,
                    [ArmorType.Recon]          : 30,            [ArmorType.Flare]     : 30,             [ArmorType.AntiAir]     : 1,
                    [ArmorType.Tank]           : 8,             [ArmorType.MediumTank]: 8,              [ArmorType.WarTank]     : 1,
                    [ArmorType.Artillery]      : 25,            [ArmorType.AntiTank]  : 1,              [ArmorType.Rockets]     : 35,
                    [ArmorType.Missiles]       : 25,            [ArmorType.Rig]       : 20,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: 65,
                    [ArmorType.TransportCopter]: 85,            [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : 1,
                },

                maxHp           : 100,
                armorType       : ArmorType.BattleCopter,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Air,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 2,
                isDestroyedOnOutOfFuel: true,

                productionCost: 9000,

                visionRange: 2,
            },
            [UnitType.TransportCopter]: {
                maxHp           : 100,
                armorType       : ArmorType.TransportCopter,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Air,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 2,
                isDestroyedOnOutOfFuel: true,

                maxLoadUnitsCount         : 1,
                loadUnitCategory          : UnitCategory.Foot,
                canLaunchLoadedUnits      : false,
                canDropLoadedUnits        : true,
                canSupplyLoadedUnits      : false,
                repairAmountForLoadedUnits: undefined,
                loadableTileCategory      : TileCategory.All,

                productionCost: 5000,

                visionRange: 1,
            },
            [UnitType.Seaplane]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 3,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 90,    [ArmorType.Mech]      : 85,     [ArmorType.Bike]        : 85,
                    [ArmorType.Recon]          : 80,    [ArmorType.Flare]     : 80,     [ArmorType.AntiAir]     : 45,
                    [ArmorType.Tank]           : 75,    [ArmorType.MediumTank]: 65,     [ArmorType.WarTank]     : 55,
                    [ArmorType.Artillery]      : 70,    [ArmorType.AntiTank]  : 50,     [ArmorType.Rockets]     : 80,
                    [ArmorType.Missiles]       : 70,    [ArmorType.Rig]       : 75,     [ArmorType.Fighter]     : 45,
                    [ArmorType.Bomber]         : 55,    [ArmorType.Duster]    : 65,     [ArmorType.BattleCopter]: 85,
                    [ArmorType.TransportCopter]: 95,    [ArmorType.Seaplane]  : 55,     [ArmorType.Battleship]  : 45,
                    [ArmorType.Carrier]        : 65,    [ArmorType.Submarine] : 55,     [ArmorType.Cruiser]     : 40,
                    [ArmorType.Lander]         : 85,    [ArmorType.Gunboat]   : 105,    [ArmorType.Meteor]      : 55,
                },

                maxHp           : 100,
                armorType       : ArmorType.Seaplane,
                isAffectedByLuck: true,

                moveRange: 7,
                moveType : MoveType.Air,

                maxFuel               : 40,
                fuelConsumptionPerTurn: 5,
                isDestroyedOnOutOfFuel: true,

                productionCost: 15000,

                visionRange: 4,
            },
            [UnitType.Battleship]: {
                minAttackRange      : 3,
                maxAttackRange      : 5,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : 75,            [ArmorType.Mech]      : 70,             [ArmorType.Bike]        : 70,
                    [ArmorType.Recon]          : 70,            [ArmorType.Flare]     : 70,             [ArmorType.AntiAir]     : 65,
                    [ArmorType.Tank]           : 65,            [ArmorType.MediumTank]: 50,             [ArmorType.WarTank]     : 40,
                    [ArmorType.Artillery]      : 70,            [ArmorType.AntiTank]  : 55,             [ArmorType.Rockets]     : 75,
                    [ArmorType.Missiles]       : 75,            [ArmorType.Rig]       : 65,             [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 45,
                    [ArmorType.Carrier]        : 50,            [ArmorType.Submarine] : 65,             [ArmorType.Cruiser]     : 65,
                    [ArmorType.Lander]         : 75,            [ArmorType.Gunboat]   : 95,             [ArmorType.Meteor]      : 55,
                },

                maxHp           : 100,
                armorType       : ArmorType.Battleship,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.Ship,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 1,
                isDestroyedOnOutOfFuel: true,

                productionCost: 25000,

                visionRange: 3,
            },
            [UnitType.Carrier]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : false,
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : 35,
                    [ArmorType.Bomber]         : 35,            [ArmorType.Duster]    : 40,             [ArmorType.BattleCopter]: 45,
                    [ArmorType.TransportCopter]: 55,            [ArmorType.Seaplane]  : 40,             [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Carrier,
                isAffectedByLuck: true,

                moveRange: 5,
                moveType : MoveType.Ship,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 1,
                isDestroyedOnOutOfFuel: true,

                maxLoadUnitsCount         : 2,
                loadUnitCategory          : UnitCategory.Air,
                canLaunchLoadedUnits      : true,
                canDropLoadedUnits        : false,
                canSupplyLoadedUnits      : true,
                repairAmountForLoadedUnits: 2,
                loadableTileCategory      : TileCategory.All,

                produceUnitType   : UnitType.Seaplane,
                maxProduceMaterial: 4,

                productionCost: 28000,

                visionRange: 4,
            },
            [UnitType.Submarine]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: true,
                primaryWeaponMaxAmmo: 6,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 80,
                    [ArmorType.Carrier]        : 110,           [ArmorType.Submarine] : 55,             [ArmorType.Cruiser]     : 20,
                    [ArmorType.Lander]         : 85,            [ArmorType.Gunboat]   : 120,            [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Submarine,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Ship,

                maxFuel                : 70,
                fuelConsumptionPerTurn : 1,
                fuelConsumptionInDiving: 5,
                isDestroyedOnOutOfFuel : true,

                productionCost: 20000,

                visionRange: 5,
            },
            [UnitType.Cruiser]: {
                minAttackRange        : 1,
                maxAttackRange        : 1,
                canAttackAfterMove    : true,
                canAttackDivingUnits  : true,
                primaryWeaponMaxAmmo  : 9,
                primaryWeaponDamages  : {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 38,
                    [ArmorType.Carrier]        : 38,            [ArmorType.Submarine] : 95,             [ArmorType.Cruiser]     : 28,
                    [ArmorType.Lander]         : 40,            [ArmorType.Gunboat]   : 85,             [ArmorType.Meteor]      : undefined,
                },
                secondaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : 105,
                    [ArmorType.Bomber]         : 105,           [ArmorType.Duster]    : 105,            [ArmorType.BattleCopter]: 120,
                    [ArmorType.TransportCopter]: 120,           [ArmorType.Seaplane]  : 105,            [ArmorType.Battleship]  : undefined,
                    [ArmorType.Carrier]        : undefined,     [ArmorType.Submarine] : undefined,      [ArmorType.Cruiser]     : undefined,
                    [ArmorType.Lander]         : undefined,     [ArmorType.Gunboat]   : undefined,      [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Cruiser,
                isAffectedByLuck: true,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 1,
                isDestroyedOnOutOfFuel: true,

                moveRange: 6,
                moveType : MoveType.Ship,

                maxLoadUnitsCount         : 2,
                loadUnitCategory          : UnitCategory.Copter,
                canLaunchLoadedUnits      : false,
                canDropLoadedUnits        : true,
                canSupplyLoadedUnits      : true,
                repairAmountForLoadedUnits: undefined,
                loadableTileCategory      : TileCategory.All,

                productionCost: 16000,

                visionRange: 5,
            },
            [UnitType.Lander]: {
                maxHp           : 100,
                armorType       : ArmorType.Lander,
                isAffectedByLuck: true,

                moveRange: 6,
                moveType : MoveType.Transport,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 1,
                isDestroyedOnOutOfFuel: true,

                maxLoadUnitsCount         : 2,
                loadUnitCategory          : UnitCategory.Ground,
                canLaunchLoadedUnits      : false,
                canDropLoadedUnits        : true,
                canSupplyLoadedUnits      : false,
                repairAmountForLoadedUnits: undefined,
                loadableTileCategory      : TileCategory.LoadableForSeaTransports,

                productionCost: 10000,

                visionRange: 1,
            },
            [UnitType.Gunboat]: {
                minAttackRange      : 1,
                maxAttackRange      : 1,
                canAttackAfterMove  : true,
                canAttackDivingUnits: false,
                primaryWeaponMaxAmmo: 1,
                primaryWeaponDamages: {
                    [ArmorType.Infantry]       : undefined,     [ArmorType.Mech]      : undefined,      [ArmorType.Bike]        : undefined,
                    [ArmorType.Recon]          : undefined,     [ArmorType.Flare]     : undefined,      [ArmorType.AntiAir]     : undefined,
                    [ArmorType.Tank]           : undefined,     [ArmorType.MediumTank]: undefined,      [ArmorType.WarTank]     : undefined,
                    [ArmorType.Artillery]      : undefined,     [ArmorType.AntiTank]  : undefined,      [ArmorType.Rockets]     : undefined,
                    [ArmorType.Missiles]       : undefined,     [ArmorType.Rig]       : undefined,      [ArmorType.Fighter]     : undefined,
                    [ArmorType.Bomber]         : undefined,     [ArmorType.Duster]    : undefined,      [ArmorType.BattleCopter]: undefined,
                    [ArmorType.TransportCopter]: undefined,     [ArmorType.Seaplane]  : undefined,      [ArmorType.Battleship]  : 40,
                    [ArmorType.Carrier]        : 40,            [ArmorType.Submarine] : 40,             [ArmorType.Cruiser]     : 40,
                    [ArmorType.Lander]         : 55,            [ArmorType.Gunboat]   : 75,             [ArmorType.Meteor]      : undefined,
                },

                maxHp           : 100,
                armorType       : ArmorType.Gunboat,
                isAffectedByLuck: true,

                moveRange: 7,
                moveType : MoveType.Transport,

                maxFuel               : 99,
                fuelConsumptionPerTurn: 1,
                isDestroyedOnOutOfFuel: true,

                maxLoadUnitsCount         : 1,
                loadUnitCategory          : UnitCategory.Foot,
                canLaunchLoadedUnits      : false,
                canDropLoadedUnits        : true,
                canSupplyLoadedUnits      : false,
                repairAmountForLoadedUnits: undefined,
                loadableTileCategory      : TileCategory.LoadableForSeaTransports,

                productionCost: 6000,

                visionRange: 2,
            },
        },
    };
    const CONFIG: Readonly<GameConfig> = ORIGINAL_CONFIG;

    export function getGridSize(): Types.GridSize {
        return CONFIG.gridSize;
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        return TILE_TYPE_MAPPING[baseType][objectType];
    }

    export function getTemplateTile(baseType: TileBaseType, objectType: TileObjectType): Readonly<TemplateTile> {
        return CONFIG.templateTile[getTileType(baseType, objectType)];
    }

    export function getTemplateUnit(unitType: UnitType): Readonly<TemplateUnit> {
        return CONFIG.templateUnit[unitType];
    }

    export function getUnitTypesByCategory(category: UnitCategory): UnitType[] {
        return CONFIG.unitCategories[category];
    }
}
