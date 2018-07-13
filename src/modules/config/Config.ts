
namespace Config {
    import TileType     = Utility.Types.TileType;
    import UnitType     = Utility.Types.UnitType;
    import UnitCategory = Utility.Types.UnitCategory;

    const raw = {
        maxCapturePoint           : 20,
        maxBuildPoint             : 20,
        unitMaxHP                 : 100,
        tileMaxHP                 : 99,
        incomePerTurn             : 1000,
        commandTowerAttackBonus   : 5,
        commandTowerDefenseBonus  : 5,
        baseNormalizedRepairAmount: 2,

        maxPromotion  : 3,
        promotionBonus: [
            {attack: 0,  defense: 0 },
            {attack: 5,  defense: 0 },
            {attack: 10, defense: 0 },
            {attack: 20, defense: 20},
        ],

        categories: {
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
        },

        tileTemplate: {
            [TileType.Plain]: {

            }
        },
    };
    const config: Readonly<typeof raw> = raw;

}
