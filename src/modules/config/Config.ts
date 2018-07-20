
namespace Config {
    import Types        = Utility.Types;
    import TileType     = Types.TileType;
    import UnitType     = Types.UnitType;
    import UnitCategory = Types.UnitCategory;
    import TileCategory = Types.TileCategory;
    import MoveType     = Types.MoveType;
    import ArmorType    = Types.ArmorType;

    type GameConfig = {
        maxPromotion  : number;
        promotionBonus: { attack: number, defense: number }[];
        unitCategories: { [unitCategory: number]: UnitType[] };
        tileCategories: { [tileCategory: number]: TileType[] };
        templateTile  : { [tileType: number]: Types.TemplateTile };
    }

    const ORIGINAL_CONFIG: GameConfig = {
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
    };
    const CONFIG: Readonly<GameConfig> = ORIGINAL_CONFIG;

}
