
namespace Config {
    import Types        = Utility.Types;
    import TileType     = Types.TileType;
    import UnitType     = Types.UnitType;
    import UnitCategory = Types.UnitCategory;
    import TileCategory = Types.TileCategory;
    import MoveType     = Types.MoveType;

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
            [UnitCategory.CommonAir]: [
                UnitType.Fighter,         UnitType.Bomber, UnitType.Duster, UnitType.BattleCopter,
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
        },
    };
    const CONFIG: Readonly<GameConfig> = ORIGINAL_CONFIG;

}
