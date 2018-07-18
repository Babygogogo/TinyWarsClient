
namespace Config {
    import TileType     = Utility.Types.TileType;
    import UnitType     = Utility.Types.UnitType;
    import UnitCategory = Utility.Types.UnitCategory;
    import TileCategory = Utility.Types.TileCategory;

    const ORIGINAL_CONFIG = {
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
                TileType.Plain,        TileType.River,       TileType.Sea,          TileType.Beach,
                TileType.Road,         TileType.Bridge,      TileType.Wood,         TileType.Mountain,
                TileType.Wasteland,    TileType.Ruins,       TileType.Fire,         TileType.Rough,
                TileType.Mist,         TileType.Reef,        TileType.Plasma,       TileType.Meteor,
                TileType.Silo,         TileType.EmptySilo,   TileType.Headquarters, TileType.City,
                TileType.CommandTower, TileType.Radar,       TileType.Factory,      TileType.Airport,
                TileType.Seaport,      TileType.TempAirport, TileType.TempSeaport,  TileType.GreenPlasma,
            ],
            [TileCategory.LoadableForSeaTransports]: [
                TileType.Beach, TileType.Seaport, TileType.TempSeaport,
            ],
        },

        tileTemplate: {
        },
    };
    const CONFIG: Readonly<typeof ORIGINAL_CONFIG> = ORIGINAL_CONFIG;

}
