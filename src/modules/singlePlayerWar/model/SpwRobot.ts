
namespace TinyWars.SinglePlayerWar.SpwRobot {
    import Types            = Utility.Types;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Helpers          = Utility.Helpers;
    import DamageCalculator = Utility.DamageCalculator;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import Logger           = Utility.Logger;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarAction        = Types.RawWarActionContainer;
    import WeaponType       = Types.WeaponType;
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import MovePathNode     = Types.MovePathNode;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import UnitActionState  = Types.UnitActionState;

    type AttackInfo = {
        baseDamage      : number;
        normalizedHp    : number;
        fuel            : number;
        luckValue       : number;
    }
    type ScoreAndAction = {
        score   : number;
        action  : WarAction;
    }
    type DamageMapData = {
        max     : number;
        total   : number;
    }
    const _TILE_VALUE: { [tileType: number]: number } = {           // ADJUSTABLE
        [TileType.Headquarters] : 20, //50,
        [TileType.Factory]      : 30, //75,
        [TileType.Airport]      : 25, //60,
        [TileType.Seaport]      : 25, //60,
        [TileType.City]         : 20, //50,
        [TileType.CommandTower] : 30, //75,
        [TileType.Radar]        : 20, //50,
        [TileType.TempSeaport]  : 10,
        [TileType.TempAirport]  : 10,
    };
    const _PRODUCTION_CANDIDATES: { [tileType: number]: { [unitType: number]: number } } = {    // ADJUSTABLE
        [TileType.Factory]: {
            [UnitType.Infantry]     : 500,
            [UnitType.Mech]         : 0,
            [UnitType.Bike]         : 520,
            [UnitType.Recon]        : 0,
            [UnitType.Flare]        : null,
            [UnitType.AntiAir]      : 450,
            [UnitType.Tank]         : 650,
            [UnitType.MediumTank]   : 600,
            [UnitType.WarTank]      : 550,
            [UnitType.Artillery]    : 450,
            [UnitType.AntiTank]     : 400,
            [UnitType.Rockets]      : 300,
            [UnitType.Missiles]     : null,
            [UnitType.Rig]          : null,
        },
        [TileType.Airport]: {
            [UnitType.Fighter]          : 200,
            [UnitType.Bomber]           : 200,
            [UnitType.Duster]           : 400,
            [UnitType.BattleCopter]     : 600,
            [UnitType.TransportCopter]  : null,
        },
        [TileType.Seaport]: {
            [UnitType.Battleship]   : 300,
            [UnitType.Carrier]      : null,
            [UnitType.Submarine]    : 300,
            [UnitType.Cruiser]      : 300,
            [UnitType.Lander]       : null,
            [UnitType.Gunboat]      : 0,
        },
    };
    const _DAMAGE_SCORE_SCALERS: { [attackerType: number]: { [defenderType: number]: number } } = {
        [UnitType.Infantry]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Mech]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Bike]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Recon]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Flare]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.AntiAir]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Tank]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.MediumTank]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.WarTank]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Artillery]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.AntiTank]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Rockets]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Missiles]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Rig]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Fighter]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Bomber]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Duster]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.BattleCopter]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.TransportCopter]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Seaplane]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Battleship]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Carrier]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Submarine]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Cruiser]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Lander]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
        [UnitType.Gunboat]: {
            [UnitType.Infantry]:    1,      [UnitType.Mech]:            1,      [UnitType.Bike]:            1,      [UnitType.Recon]:       1,
            [UnitType.Flare]:       1,      [UnitType.AntiAir]:         1,      [UnitType.Tank]:            1,      [UnitType.MediumTank]:  1,
            [UnitType.WarTank]:     1,      [UnitType.Artillery]:       1,      [UnitType.AntiTank]:        1,      [UnitType.Rockets]:     1,
            [UnitType.Missiles]:    1,      [UnitType.Rig]:             1,      [UnitType.Fighter]:         1,      [UnitType.Bomber]:      1,
            [UnitType.Duster]:      1,      [UnitType.BattleCopter]:    1,      [UnitType.TransportCopter]: 1,      [UnitType.Seaplane]:    1,
            [UnitType.Battleship]:  1,      [UnitType.Carrier]:         1,      [UnitType.Submarine]:       1,      [UnitType.Cruiser]:     1,
            [UnitType.Lander]:      1,      [UnitType.Gunboat]:         1,
        },
    };
    const _DISTANCE_SCORE_SCALERS: { [tileType: number]: number } = {
        [TileType.Airport]      : 1.2,
        [TileType.City]         : 1.1,
        [TileType.CommandTower] : 1.25,
        [TileType.Factory]      : 1.3,
        [TileType.Headquarters] : 1.35,
        [TileType.Radar]        : 1.1,
        [TileType.Seaport]      : 1.15,
    };

    let _frameBeginTime         : number;
    let _war                    : SpwWar;
    let _unitValues             : Map<number, number>;
    let _unitValueRatio         : number;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _initVariables(war: SpwWar): void {
        _frameBeginTime = Date.now();
        _war            = war;
        _unitValues     = _getUnitValues();
        _unitValueRatio = _getUnitValueRatio();
    }

    function _clearVariables(): void {
        _frameBeginTime = null;
        _war            = null;
        _unitValues     = null;
        _unitValueRatio = null;
    }

    function _checkAndCallLater(): Promise<void> {  // DONE
        if (Date.now() - _frameBeginTime <= 13) {
            return;
        } else {
            return new Promise<void>((resolve, reject) => {
                egret.callLater(() => {
                    _frameBeginTime = Date.now();
                    resolve();
                }, null);
            });
        }
    }

    function _getUnitValues(): Map<number, number> {    // DONE
        const values = new Map<number, number>();
        _war.getUnitMap().forEachUnit(unit => {
            const playerIndex = unit.getPlayerIndex();
            values.set(playerIndex, (values.get(playerIndex) || 0) + unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());
        });
        return values;
    }

    function _getUnitValueRatio(): number { // DONE
        let selfValue       = 0;
        let enemyValue      = 0;
        const playerManager = _war.getPlayerManager();
        const selfTeamIndex = playerManager.getPlayerInTurn().getTeamIndex();
        for (const [playerIndex, value] of _unitValues) {
            if (playerManager.getPlayer(playerIndex).getTeamIndex() === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return enemyValue > 0 ? selfValue / enemyValue : 1;
    }

    function _checkCanUnitWaitOnGrid(unit: BaseWar.BwUnit, gridIndex: GridIndex): boolean {    // DONE
        if (GridIndexHelpers.checkIsEqual(unit.getGridIndex(), gridIndex)) {
            return unit.getLoaderUnitId() == null;
        } else {
            return !_war.getUnitMap().getUnitOnMap(gridIndex);
        }
    }

    function _getBetterScoreAndAction(data1: ScoreAndAction | null, data2: ScoreAndAction | null): ScoreAndAction | null {  // DONE
        if (!data1) {
            return data2;
        } else if (!data2) {
            return data1;
        } else {
            return data1.score >= data2.score ? data1 : data2;
        }
    }

    function _popRandomElement<T>(arr: T[]): T {    // DONE
        const length = arr.length;
        if (!length) {
            return null;
        } else {
            return arr.splice(Math.floor(_war.getRandomNumberManager().getRandomNumber() * length), 1)[0];
        }
    }

    function _popRandomCandidateUnit(candidateUnits: BaseWar.BwUnit[]): BaseWar.BwUnit | null {
        const unit = _popRandomElement(candidateUnits);
        if (!unit) {
            return null;
        } else {
            const unitMap = _war.getUnitMap();
            if ((unitMap.getUnitOnMap(unit.getGridIndex()) === unit) ||
                (unitMap.getUnitLoadedById(unit.getUnitId()) === unit)
            ) {
                return unit;
            } else {
                return _popRandomCandidateUnit(candidateUnits);
            }
        }
    }

    function _getReachableArea(unit: BaseWar.BwUnit, passableGridIndex: GridIndex | null, blockedGridIndex: GridIndex | null): MovableArea {
        const unitMap = _war.getUnitMap();
        const tileMap = _war.getTileMap();
        const mapSize = tileMap.getMapSize();
        return BwHelpers.createMovableArea(
            unit.getGridIndex(),
            Math.min(unit.getFinalMoveRange(), unit.getCurrentFuel()),
            (gridIndex: GridIndex) => {
                if ((!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                            ||
                    ((blockedGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, blockedGridIndex)))
                ) {
                    return null;
                } else {
                    if ((passableGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, passableGridIndex))) {
                        return tileMap.getTile(gridIndex).getMoveCostByUnit(unit);
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != unit.getTeamIndex())) {
                            return null;
                        } else {
                            return tileMap.getTile(gridIndex).getMoveCostByUnit(unit);
                        }
                    }
                }
            }
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Generators for score map for distance to the nearest capturable tile.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _createScoreMapForDistance(unit: BaseWar.BwUnit): Promise<number[][] | null> {
        await _checkAndCallLater();

        const tileMap = _war.getTileMap();
        const nearestCapturableTile = BwHelpers.findNearestCapturableTile(tileMap, _war.getUnitMap(), unit);
        if (!nearestCapturableTile) {
            return null;
        }

        const { distanceMap, maxDistance }  = BwHelpers.createDistanceMap(tileMap, unit, nearestCapturableTile.getGridIndex());
        const mapSize                       = tileMap.getMapSize();
        const scoreForUnmovableGrid         = -10 * (maxDistance + 1);                                              // ADJUSTABLE
        for (let x = 0; x < mapSize.width; ++x) {
            for (let y = 0; y < mapSize.height; ++y) {
                distanceMap[x][y] = distanceMap[x][y] != null ? distanceMap[x][y] * -10 : scoreForUnmovableGrid;    // ADJUSTABLE
            }
        }

        return distanceMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Damage map generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getAttackBonusForAllPlayers(): Map<number, number> {  // DONE
        const bonuses               = new Map<number, number>();
        const commonSettingManager  = _war.getCommonSettingManager();
        _war.getPlayerManager().forEachPlayer(false, player => {
            const playerIndex = player.getPlayerIndex();
            bonuses.set(playerIndex, commonSettingManager.getSettingsAttackPowerModifier(playerIndex));
        });

        _war.getTileMap().forEachTile(tile => {
            const bonus = tile.getGlobalAttackBonus();
            if (bonus) {
                const playerIndex = tile.getPlayerIndex();
                bonuses.set(playerIndex, (bonuses.get(playerIndex) || 0) + bonus);
            }
        });

        return bonuses;
    }

    function _getDefenseBonusForTargetUnit(unit: BaseWar.BwUnit): number { // DONE
        let bonus           = unit.getPromotionDefenseBonus();
        const playerIndex   = unit.getPlayerIndex();
        _war.getTileMap().forEachTile(tile => {
            if (tile.getPlayerIndex() === playerIndex) {
                bonus += (tile.getGlobalDefenseBonus() || 0);
            }
        });

        return bonus;
    }

    function _getAttackInfo(attacker: BaseWar.BwUnit, target: BaseWar.BwUnit): AttackInfo {   // DONE
        const gridIndex             = attacker.getGridIndex();
        const attackerPlayerIndex   = attacker.getPlayerIndex();
        const commonSettingManager  = _war.getCommonSettingManager();
        const unitMap               = _war.getUnitMap();
        const tileMap               = _war.getTileMap();
        const luckValue             = (commonSettingManager.getSettingsLuckLowerLimit(attackerPlayerIndex) + commonSettingManager.getSettingsLuckUpperLimit(attackerPlayerIndex)) / 2;
        const targetArmorType       = target.getArmorType();
        const baseDamageWithAmmo    = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? WeaponType.Primary : WeaponType.Secondary);

        if (attacker.getLoaderUnitId() == null) {
            const tile          = tileMap.getTile(gridIndex);
            const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage  : baseDamageWithAmmo,
                    normalizedHp: Math.floor((attacker.getCurrentHp() + repairInfo.hp) / CommonConstants.UnitHpNormalizer),
                    fuel        : attacker.getMaxFuel(),
                    luckValue,
                };
            } else {
                if ((tile.checkCanSupplyUnit(attacker))                                             ||
                    (GridIndexHelpers.getAdjacentGrids(gridIndex, tileMap.getMapSize()).some(g => {
                        const supplier = unitMap.getUnitOnMap(g);
                        return (!!supplier) && (supplier.checkCanSupplyAdjacentUnit(attacker))
                    }))
                ) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: attacker.getNormalizedCurrentHp(),
                        fuel        : attacker.getMaxFuel(),
                        luckValue,
                    };
                } else {
                    return {
                        baseDamage  : attacker.getBaseDamage(targetArmorType),
                        normalizedHp: attacker.getNormalizedCurrentHp(),
                        fuel        : attacker.getCurrentFuel(),
                        luckValue,
                    };
                }
            }

        } else {
            const loader = unitMap.getUnitOnMap(gridIndex);
            if ((!attacker.checkCanAttackAfterMove())               ||
                (loader.getUnitId() !== attacker.getLoaderUnitId()) ||
                (!loader.checkCanLaunchLoadedUnit())
            ) {
                return {
                    baseDamage  : null,
                    normalizedHp: attacker.getNormalizedCurrentHp(),
                    fuel        : attacker.getCurrentFuel(),
                    luckValue,
                };
            } else {
                const repairInfo = loader.getRepairHpAndCostForLoadedUnit(attacker);
                if (repairInfo) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: Math.floor((attacker.getCurrentHp() + repairInfo.hp) / CommonConstants.UnitHpNormalizer),
                        fuel        : attacker.getMaxFuel(),
                        luckValue,
                    };
                } else {
                    if (loader.checkCanSupplyLoadedUnit()) {
                        return {
                            baseDamage  : baseDamageWithAmmo,
                            normalizedHp: attacker.getNormalizedCurrentHp(),
                            fuel        : attacker.getMaxFuel(),
                            luckValue,
                        };
                    } else {
                        return {
                            baseDamage  : attacker.getBaseDamage(targetArmorType),
                            normalizedHp: attacker.getNormalizedCurrentHp(),
                            fuel        : attacker.getCurrentFuel(),
                            luckValue,
                        }
                    }
                }
            }
        }
    }

    function _getDefenseMultiplierWithBonus(bonus: number): number {    // DONE
        return (bonus >= 0)
            ? 1 / (1 + bonus / 100)
            : 1 - bonus / 100;
    }

    async function _createDamageMap(targetUnit: BaseWar.BwUnit, isDiving: boolean): Promise<DamageMapData[][]> { // DONE
        await _checkAndCallLater();

        const unitMap           = _war.getUnitMap();
        const tileMap           = _war.getTileMap();
        const mapSize           = tileMap.getMapSize();
        const map               = Helpers.createEmptyMap<DamageMapData>(mapSize.width);
        const attackBonuses     = _getAttackBonusForAllPlayers();
        const defenseBonus      = _getDefenseBonusForTargetUnit(targetUnit);
        const targetTeamIndex   = targetUnit.getTeamIndex();
        unitMap.forEachUnit(async (attacker: BaseWar.BwUnit) => {
            await _checkAndCallLater();

            const minAttackRange    = attacker.getMinAttackRange();
            const maxAttackRange    = attacker.getFinalMaxAttackRange();
            if ((!minAttackRange)                                       ||
                (!maxAttackRange)                                       ||
                (attacker.getTeamIndex() === targetTeamIndex)           ||
                ((isDiving) && (!attacker.checkCanAttackDivingUnits()))
            ) {
                return;
            }

            const { baseDamage, normalizedHp, fuel, luckValue } = _getAttackInfo(attacker, targetUnit);
            if (baseDamage == null) {
                return;
            }

            const beginningGridIndex    = attacker.getGridIndex();
            const attackBonus           = (attackBonuses.get(attacker.getPlayerIndex()) || 0) + attacker.getPromotionAttackBonus();
            const movableArea           = BwHelpers.createMovableArea(
                beginningGridIndex,
                Math.min(attacker.getFinalMoveRange(), fuel),
                gridIndex => {
                    if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                        return null;
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != attacker.getTeamIndex())) {
                            return null;
                        } else {
                            return tileMap.getTile(gridIndex).getMoveCostByUnit(attacker);
                        }
                    }
                }
            );
            const attackableArea = BwHelpers.createAttackableArea(
                movableArea,
                mapSize,
                minAttackRange,
                maxAttackRange,
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                    return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                        && ((attacker.checkCanAttackAfterMove()) || (!hasMoved));
                }
            );
            for (let x = 0; x < mapSize.width; ++x) {
                const column = attackableArea[x];
                if (column) {
                    for (let y = 0; y < mapSize.height; ++y) {
                        if (column[y]) {
                            const damage = Math.floor(
                                (baseDamage * Math.max(0, 1 + attackBonus / 100) + luckValue)
                                * normalizedHp
                                * _getDefenseMultiplierWithBonus(defenseBonus + tileMap.getTile({ x, y }).getDefenseAmountForUnit(targetUnit))
                                / CommonConstants.UnitHpNormalizer
                            );
                            if (!map[x][y]) {
                                map[x][y] = {
                                    max     : damage,
                                    total   : damage,
                                };
                            } else {
                                map[x][y].max   = Math.max(map[x][y].max, damage);
                                map[x][y].total += damage;
                            }
                        }
                    }
                }
            }
        });
        return map;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getCandidateUnitsForPhase1(): Promise<BaseWar.BwUnit[]> { // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getActionState() === UnitActionState.Idle)            &&
                (unit.getFinalMaxAttackRange() > 1)
            ) {
                units.push(unit);
            }
        });
        return units;
    }
    async function _getCandidateUnitsForPhase1a(): Promise<BaseWar.BwUnit[]> { // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnit((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getActionState() === UnitActionState.Idle)
            ) {
                units.push(unit);
            }
        });
        return units;
    }

    async function _getCandidateUnitsForPhase2(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getActionState() === UnitActionState.Idle)            &&
                (unit.getIsCapturingTile())
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase3(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getActionState() === UnitActionState.Idle)            &&
                (unit.checkIsCapturer())
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase4(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        const configVersion     = _war.getConfigVersion();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)                                                   &&
                (unit.getActionState() === UnitActionState.Idle)                                                &&
                (unit.getMinAttackRange())                                                                      &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), Types.UnitCategory.Air))
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase5(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getActionState() === UnitActionState.Idle)            &&
                (unit.getFinalMaxAttackRange() === 1)
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase6(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getActionState() === UnitActionState.Idle)) {
                const maxRange = unit.getFinalMaxAttackRange();
                if ((!maxRange) || (maxRange === 1)) {
                    units.push(unit);
                }
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase7(): Promise<BaseWar.BwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : BaseWar.BwUnit[] = [];
        const playerIndexInturn = _war.getTurnManager().getPlayerIndexInTurn();
        _war.getUnitMap().forEachUnitOnMap((unit: BaseWar.BwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getActionState() === UnitActionState.Idle)) {
                units.push(unit);
            }
        });

        return units;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Score calculators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getScoreForThreat(unit: BaseWar.BwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][]): number {   // DONE
        const hp            = unit.getCurrentHp();
        const data          = damageMap[gridIndex.x][gridIndex.y];
        const maxDamage     = Math.min(data ? data.max : 0, hp);
        // const totalDamage   = Math.min(data ? data.total : 0, hp);
        return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
            * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
            * (unit.getHasLoadedCo() ? 2 : 1); // ADJUSTABLE
    }

    async function _getScoreForDistanceToCapturableBuildings(unit: BaseWar.BwUnit, movableArea: MovableArea): Promise<number> {
        await _checkAndCallLater();

        const tileMap                                   = _war.getTileMap();
        const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
        const teamIndex                                 = unit.getTeamIndex();
        const distanceInfoArray                         : { distance: number, scaler: number }[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (movableArea[x]) {
                for (let y = 0; y < mapHeight; ++y) {
                    const info = movableArea[x][y];
                    if (info) {
                        const tile = tileMap.getTile({ x, y });
                        if ((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex)) {
                            distanceInfoArray.push({
                                distance: info.totalMoveCost,
                                scaler  : _DISTANCE_SCORE_SCALERS[tile.getType()] || 1,
                            });
                        }
                    }
                }
            }
        }

        const tilesCount = distanceInfoArray.length;
        if (tilesCount <= 0) {
            return 0;
        } else {
            let score = 0;
            for (const distanceInfo of distanceInfoArray) {
                const distance  = distanceInfo.distance;
                score           += - Math.pow(distance, 2) * distanceInfo.scaler;
            }
            return score / tilesCount / tilesCount * 0.7;
        }
    }

    async function _getScoreForDistanceToOtherUnits(unit: BaseWar.BwUnit, movableArea: MovableArea): Promise<number> {
        await _checkAndCallLater();

        const unitMap                                   = _war.getUnitMap();
        const { width: mapWidth, height: mapHeight }    = unitMap.getMapSize();
        const teamIndex                                 = unit.getTeamIndex();
        const distanceArrayToEnemies                    : number[] = [];
        const distanceArrayToAllies                     : number[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (movableArea[x]) {
                for (let y = 0; y < mapHeight; ++y) {
                    const info = movableArea[x][y];
                    if (info == null) {
                        continue;
                    }

                    const otherUnit = unitMap.getUnitOnMap({ x, y });
                    if ((otherUnit == null) || (otherUnit === unit)) {
                        continue;
                    }

                    const distance = info.totalMoveCost * (otherUnit.getHasLoadedCo() ? 2 : 1);
                    if (otherUnit.getTeamIndex() !== teamIndex) {
                        distanceArrayToEnemies.push(distance);
                    } else {
                        distanceArrayToAllies.push(distance);
                    }
                }
            }
        }

        let totalScore      = 0;
        const enemiesCount  = distanceArrayToEnemies.length;
        if (enemiesCount > 0) {
            let scoreForEnemies = 0;
            for (const distance of distanceArrayToEnemies) {
                scoreForEnemies += - Math.pow(distance, 2);
            }
            totalScore += scoreForEnemies / enemiesCount / enemiesCount * 0.2;
        }

        const alliesCount = distanceArrayToAllies.length;
        if (alliesCount > 0) {
            let scoreForAllies      = 0;
            for (const distance of distanceArrayToAllies) {
                scoreForAllies += - Math.pow(distance, 2);
            }
            totalScore += scoreForAllies / alliesCount / alliesCount * 0.1;
        }

        return totalScore;
    }

    async function _getScoreForPosition(unit: BaseWar.BwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][]): Promise<number> {  // DONE
        await _checkAndCallLater();

        let score = _getScoreForThreat(unit, gridIndex, damageMap);
        // if (scoreMapForDistance) {
        //     score += scoreMapForDistance[gridIndex.x][gridIndex.y];                     // ADJUSTABLE
        // }

        const tileMap   = _war.getTileMap();
        const tile      = tileMap.getTile(gridIndex);
        if (tile.checkCanRepairUnit(unit)) {
            score += (unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp()) * 15;  // ADJUSTABLE
        }
        if (tile.checkCanSupplyUnit(unit)) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo) {
                score += (maxAmmo - unit.getPrimaryWeaponCurrentAmmo()) / maxAmmo * 55;         // ADJUSTABLE
            }

            const maxFuel = unit.getMaxFuel();
            if (maxFuel) {
                score += (maxFuel - unit.getCurrentFuel()) / maxFuel * 50 * (unit.checkIsDestroyedOnOutOfFuel() ? 2 : 1);   // ADJUSTABLE
            }
        }

        const teamIndex = unit.getTeamIndex();
        if (tile.getTeamIndex() === teamIndex) {
            switch (tile.getType()) {
                case TileType.Factory : score += -500; break;                                                               // ADJUSTABLE
                case TileType.Airport : score += -200; break;                                                               // ADJUSTABLE
                case TileType.Seaport : score += -150; break;                                                               // ADJUSTABLE
                default                     : break;
            }
        } else if (tile.getTeamIndex() !== 0) {
            switch (tile.getType()) {
                case TileType.Factory : score += 50; break;                                                                 // ADJUSTABLE
                case TileType.Airport : score += 20; break;                                                                 // ADJUSTABLE
                case TileType.Seaport : score += 15; break;                                                                 // ADJUSTABLE
                default                     : break;
            }
        }

        await _checkAndCallLater();
        const mapSize       = tileMap.getMapSize();
        const moveType      = unit.getMoveType();
        const movableArea   = BwHelpers.createMovableArea(
            gridIndex,
            Number.MAX_SAFE_INTEGER,
            gridIndex => {
                if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                    return null;
                } else {
                    return tileMap.getTile(gridIndex).getMoveCostByMoveType(moveType);
                }
            }
        );
        score += await _getScoreForDistanceToCapturableBuildings(unit, movableArea);
        score += await _getScoreForDistanceToOtherUnits(unit, movableArea);

        return score;
    }

    async function _getScoreForActionUnitBeLoaded(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        await _checkAndCallLater();

        const loader = _war.getUnitMap().getUnitOnMap(gridIndex);
        if (!loader.checkCanLaunchLoadedUnit()) {
            return -1000;                                                                   // ADJUSTABLE
        } else {
            if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
                return (unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp()) * 10;    // ADJUSTABLE
            } else {
                return 0;
            }
        }
    }

    async function _getScoreForActionUnitJoin(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        await _checkAndCallLater();

        const targetUnit = _war.getUnitMap().getUnitOnMap(gridIndex);
        if (targetUnit.getActionState() === UnitActionState.Idle) {
            return -9999;                                                                       // ADJUSTABLE
        } else {
            if (!targetUnit.getIsCapturingTile()) {
                const newHp = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
                const maxHp = unit.getNormalizedMaxHp();
                return newHp > maxHp ? ((newHp - maxHp) * (-50)) : ((maxHp - newHp) * 5);       // ADJUSTABLE
            } else {
                const currentCapturePoint   = _war.getTileMap().getTile(gridIndex).getCurrentCapturePoint();
                const newHp                 = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
                const maxHp                 = unit.getNormalizedMaxHp();
                if (targetUnit.getCaptureAmount() >= currentCapturePoint) {
                    return (newHp > maxHp) ? ((newHp - maxHp) * (-50)) : ((maxHp - newHp) * 5); // ADJUSTABLE
                } else {
                    return (Math.min(maxHp, newHp) >= currentCapturePoint) ? 60 : 30;           // ADJUSTABLE
                }
            }
        }
    }

    async function _getScoreForActionUnitAttack(    // DONE
        unit            : BaseWar.BwUnit,
        gridIndex       : GridIndex,
        targetGridIndex : GridIndex,
        pathNodes       : MovePathNode[],
        attackDamage    : number | null,
        counterDamage   : number | null,
    ): Promise<number | null> {
        await _checkAndCallLater();

        if (attackDamage == null) {
            return null;
        }

        const targetTile    = _war.getTileMap().getTile(targetGridIndex);
        const tileType      = targetTile.getType();
        if (tileType === TileType.Meteor) {
            return Math.min(attackDamage, targetTile.getCurrentHp());                                   // ADJUSTABLE
        }

        const attackerType  = unit.getUnitType();
        const targetUnit    = _war.getUnitMap().getUnitOnMap(targetGridIndex);
        const targetHp      = targetUnit.getCurrentHp();
        const targetType    = targetUnit.getUnitType();
        attackDamage        = Math.min(attackDamage, targetHp);
        let score           = (attackDamage + (attackDamage >= targetHp ? 20 : 0))
            * targetUnit.getProductionFinalCost() / 3000 * Math.max(1, _unitValueRatio)
            * (targetUnit.getHasLoadedCo() ? 2 : 1)
            * (_DAMAGE_SCORE_SCALERS[attackerType][targetType] || 1);                                   // ADJUSTABLE

        if (targetUnit.getIsCapturingTile()) {
            score += targetTile.getCurrentCapturePoint() > targetUnit.getCaptureAmount() ? 20 : 200;    // ADJUSTABLE
            if ((tileType === TileType.Headquarters)    ||
                (tileType === TileType.Factory)         ||
                (tileType === TileType.Airport)         ||
                (tileType === TileType.Seaport)
            ) {
                score += 99999;                                                                         // ADJUSTABLE
            }
        }

        if (counterDamage) {
            const attackerHp    = unit.getCurrentHp();
            counterDamage       = Math.min(counterDamage, attackerHp);
            score               += - (counterDamage + (counterDamage >= attackerHp ? 20 : 0))
                * unit.getProductionFinalCost() / 3000 / Math.max(1, _unitValueRatio)
                * (unit.getHasLoadedCo() ? 2 : 1)
                * (_DAMAGE_SCORE_SCALERS[targetType][attackerType] || 1);                               // ADJUSTABLE
        }

        return score;
    }

    async function _getScoreForActionUnitCaptureTile(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        const tile                  = _war.getTileMap().getTile(gridIndex);
        const currentCapturePoint   = tile.getCurrentCapturePoint();
        const captureAmount         = unit.getCaptureAmount();
        if (captureAmount >= currentCapturePoint) {
            return 10000;                                                                       // ADJUSTABLE
        } else if (captureAmount < currentCapturePoint / 3) {
            return 1;                                                                           // ADJUSTABLE
        } else {
            const value = _TILE_VALUE[tile.getType()] || 0;                                     // ADJUSTABLE
            return captureAmount >= currentCapturePoint / 2 ? value : value / 2;                // ADJUSTABLE
        }
    }

    async function _getScoreForActionUnitDive(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> {   // DONE
        await _checkAndCallLater();

        return unit.getCurrentFuel() <= 35 ? -10 : 10;
    }

    async function _getScoreForActionUnitLaunchSilo(unitValueMap: number[][], targetGridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        let score = 10000;                                                                                                          // ADJUSTABLE
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, CommonConstants.SiloRadius, _war.getTileMap().getMapSize())) {
            score += unitValueMap[gridIndex.x][gridIndex.y] || 0;                                                                   // ADJUSTABLE
        }
        return score;
    }

    async function _getScoreForActionUnitSurface(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        return (unit.getCurrentFuel() <= 35) ? 10 : -10;
    }

    async function _getScoreForActionUnitWait(unit: BaseWar.BwUnit, gridIndex: GridIndex): Promise<number> {   // DONE
        await _checkAndCallLater();

        // const tile = _war.getTileMap().getTile(gridIndex);
        // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
        //     return -20;                                                                     // ADJUSTABLE
        // } else {
        //     return 0;                                                                       // ADJUSTABLE
        // }
        return -10;
    }

    async function _getScoreForActionPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, idleFactoriesCount: number): Promise<number | null> { // DONE
        await _checkAndCallLater();

        const tileType  = _war.getTileMap().getTile(gridIndex).getType();
        let score       = _PRODUCTION_CANDIDATES[tileType][unitType];
        if (score == null) {
            return null;
        }

        const configVersion     = _war.getConfigVersion();
        const playerIndexInTurn = _war.getTurnManager().getPlayerIndexInTurn();
        const targetUnit        = new BaseWar.BwUnit();
        targetUnit.init({
            unitId      : 0,
            unitType,
            gridIndex,
            playerIndex : playerIndexInTurn,
        }, configVersion);
        targetUnit.startRunning(_war);

        const productionCost    = targetUnit.getProductionFinalCost();
        const restFund          = _war.getPlayerManager().getPlayer(playerIndexInTurn).getFund() - productionCost;
        if (restFund < 0) {
            return null;
        }

        if (unitType !== UnitType.Infantry) {
            const restFactoriesCount = tileType === TileType.Factory ? idleFactoriesCount - 1 : idleFactoriesCount;
            if (restFactoriesCount * ConfigManager.getUnitTemplateCfg(configVersion, UnitType.Infantry).productionCost > restFund) {
                score += -999999;                                                                                                       // ADJUSTABLE
            }
        }

        const teamIndex = targetUnit.getTeamIndex();
        let canAttack   = false;
        _war.getUnitMap().forEachUnit(unit => {
            if (unit.getTeamIndex() === teamIndex) {
                if (unit.getUnitType() === unitType) {
                    score += -unit.getCurrentHp() * productionCost / 3000 / 1.5;                                                        // ADJUSTABLE
                }
            } else {
                if (targetUnit.getMinAttackRange()) {
                    const baseDamage = targetUnit.getBaseDamage(unit.getArmorType());
                    if (baseDamage != null) {
                        const damage    = Math.min(baseDamage, unit.getCurrentHp());
                        canAttack       = true;
                        score           += damage * unit.getProductionFinalCost() / 3000 * Math.max(1, _unitValueRatio);                                                        // ADJUSTABLE
                    }
                }
                if (unit.getMinAttackRange()) {
                    const baseDamage = unit.getBaseDamage(targetUnit.getArmorType());
                    if (baseDamage != null) {
                        const damage    = Math.min(baseDamage * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp(), targetUnit.getCurrentHp());    // ADJUSTABLE
                        score           += -damage * productionCost / 3000 / Math.max(1, _unitValueRatio);                                                                           // ADJUSTABLE
                    }
                }
            }
        });

        if (!canAttack) {
            score += -999999;
        }
        return score;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getScoreAndActionUnitBeLoaded(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const loader = _war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return null;
        }

        return {
            score   : await _getScoreForActionUnitBeLoaded(unit, gridIndex),
            action  : { UnitBeLoaded: {
                path        : pathNodes,
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getScoreAndActionUnitJoin(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const existingUnit = _war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return null;
        }

        return {
            score   : await _getScoreForActionUnitJoin(unit, gridIndex),
            action  : { UnitJoin: {
                path        : pathNodes,
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getScoreAndActionUnitAttack(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {   // DONE
        await _checkAndCallLater();

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getFinalMaxAttackRange();
        if ((minRange == null) ||
            (maxRange == null) ||
            ((!unit.checkCanAttackAfterMove()) && (!GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())))
        ) {
            return null;
        }

        const launchUnitId  = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
        const unitMap       = _war.getUnitMap();
        let data            : ScoreAndAction;
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, minRange, maxRange, unitMap.getMapSize())) {
            const damages = DamageCalculator.getEstimatedBattleDamage(_war, pathNodes, launchUnitId, targetGridIndex);
            if (damages[0] != null) {
                const isAttackUnit = unitMap.getUnitOnMap(targetGridIndex) != null;
                data = _getBetterScoreAndAction(
                    data,
                    {
                        score   : await _getScoreForActionUnitAttack(unit, gridIndex, targetGridIndex, pathNodes, damages[0], damages[1]),
                        action  : isAttackUnit
                            ? { UnitAttackUnit: {
                                path    : pathNodes,
                                targetGridIndex,
                                launchUnitId,
                            } }
                            : { UnitAttackTile: {
                                path    : pathNodes,
                                targetGridIndex,
                                launchUnitId,
                            }, },
                    }
                );
            }
        }

        return data;
    }

    async function _getScoreAndActionUnitCaptureTile(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        const tile = _war.getTileMap().getTile(gridIndex);
        if (!unit.checkCanCaptureTile(tile)) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitCaptureTile(unit, gridIndex),
                action  : { UnitCaptureTile: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitDive(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (!unit.checkCanDive()) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitDive(unit, gridIndex),
                action  : { UnitDive: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitLaunchSilo(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {   // DONE
        await _checkAndCallLater();

        const tileMap = _war.getTileMap();
        if (!unit.checkCanLaunchSiloOnTile(tileMap.getTile(gridIndex))) {
            return null;
        }

        const { width, height } = tileMap.getMapSize();
        const unitValueMap      = Helpers.createEmptyMap<number>(width, height);
        const teamIndex         = unit.getTeamIndex();
        const unitMap           = _war.getUnitMap();
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const targetUnit = unitMap.getUnitOnMap({ x, y });
                if ((!targetUnit) || (targetUnit === unit)) {
                    unitValueMap[x][y] = 0;
                } else {
                    const value         = Math.min(30, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionFinalCost() / 10;
                    unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;                                 // ADJUSTABLE
                }
            }
        }
        unitValueMap[gridIndex.x][gridIndex.y] = -Math.min(30, unit.getCurrentHp() - 1) * unit.getProductionFinalCost() / 10;       // ADJUSTABLE

        let maxScore        : number;
        let targetGridIndex : GridIndex;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const newTargetGridIndex    = { x, y };
                const newMaxScore           = await _getScoreForActionUnitLaunchSilo(unitValueMap, newTargetGridIndex);
                if ((maxScore == null) || (newMaxScore > maxScore)) {
                    maxScore        = newMaxScore;
                    targetGridIndex = newTargetGridIndex;
                }
            }
        }

        return {
            score   : maxScore,
            action  : { UnitLaunchSilo: {
                path            : pathNodes,
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                targetGridIndex,
            } },
        };
    }

    async function _getScoreAndActionUnitSurface(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        if (!unit.checkCanSurface()) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitSurface(unit, gridIndex),
                action  : { UnitSurface: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitWait(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        return {
            score   : await _getScoreForActionUnitWait(unit, gridIndex),
            action  : { UnitWait: {
                path            : pathNodes,
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        }
    }

    async function _getMaxScoreAndAction(unit: BaseWar.BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        const dataForUnitBeLoaded = await _getScoreAndActionUnitBeLoaded(unit, gridIndex, pathNodes);
        if (dataForUnitBeLoaded) {
            return dataForUnitBeLoaded;
        }

        const dataForUnitJoin = await _getScoreAndActionUnitJoin(unit, gridIndex, pathNodes);
        if (dataForUnitJoin) {
            return dataForUnitJoin;
        }

        if (!_checkCanUnitWaitOnGrid(unit, gridIndex)) {
            return null;
        }

        let data: ScoreAndAction;
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitAttack(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitCaptureTile(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitDive(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitLaunchSilo(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitSurface(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitWait(unit, gridIndex, pathNodes));

        return data;
    }

    async function _getActionForMaxScoreWithCandidateUnit(candidateUnit: BaseWar.BwUnit): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        const reachableArea         = _getReachableArea(candidateUnit, null, null);
        const damageMapForSurface   = await _createDamageMap(candidateUnit, false);
        const damageMapForDive      = candidateUnit.checkIsDiver() ? await _createDamageMap(candidateUnit, true) : null;
        // const scoreMapForDistance   = await _createScoreMapForDistance(candidateUnit);
        const mapSize               = _war.getTileMap().getMapSize();
        let bestScoreAndAction      : ScoreAndAction;

        for (let x = 0; x < mapSize.width; ++x) {
            if (reachableArea[x]) {
                for (let y = 0; y < mapSize.height; ++y) {
                    if (reachableArea[x][y]) {
                        const gridIndex     = { x, y };
                        const pathNodes     = BwHelpers.createShortestMovePath(reachableArea, gridIndex);
                        let scoreAndAction  = await _getMaxScoreAndAction(candidateUnit, gridIndex, pathNodes);

                        if (scoreAndAction) {
                            const action        = scoreAndAction.action;
                            const baseScore     = scoreAndAction.score;
                            bestScoreAndAction  = _getBetterScoreAndAction(
                                bestScoreAndAction,
                                {
                                    action  : scoreAndAction.action,
                                    score   : (action.UnitDive) || ((candidateUnit.getIsDiving()) && (!action.UnitSurface))
                                        ? baseScore + await _getScoreForPosition(candidateUnit, gridIndex, damageMapForDive)
                                        : baseScore + await _getScoreForPosition(candidateUnit, gridIndex, damageMapForSurface)
                                },
                            );
                        }
                    }
                }
            }
        }

        return bestScoreAndAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for production.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getMaxScoreAndActionPlayerProduceUnitWithGridIndex(gridIndex: GridIndex, idleFactoriesCount: number): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        let maxScore        : number;
        let targetUnitType  : number;
        for (const t in _PRODUCTION_CANDIDATES[_war.getTileMap().getTile(gridIndex).getType()]) {
            const unitType  = Number(t);
            const score     = await _getScoreForActionPlayerProduceUnit(gridIndex, unitType, idleFactoriesCount);
            if ((maxScore == null) || (score > maxScore)) {
                maxScore        = score;
                targetUnitType  = unitType;
            }
        }

        if (maxScore == null) {
            return null;
        } else {
            return {
                score   : maxScore,
                action  : { PlayerProduceUnit: {
                    unitType    : targetUnitType,
                    unitHp      : CommonConstants.UnitMaxHp,
                    gridIndex,
                } },
            }
        }
    }

    async function _getActionPlayerProduceUnitForMaxScore(): Promise<WarAction | null> {    // DONE
        await _checkAndCallLater();

        const playerIndexInTurn = _war.getTurnManager().getPlayerIndexInTurn();
        if (playerIndexInTurn === 0) {
            return null;
        }

        const idleBuildingPosList   : GridIndex[] = [];
        const unitMap               = _war.getUnitMap();
        let idleFactoriesCount      = 0;

        _war.getTileMap().forEachTile(tile => {
            const gridIndex = tile.getGridIndex();
            if ((!unitMap.getUnitOnMap(gridIndex)) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                idleBuildingPosList.push(gridIndex);
                if (tile.getType() === TileType.Factory) {
                    ++idleFactoriesCount;
                }
            }
        });

        let data: ScoreAndAction;
        for (const gridIndex of idleBuildingPosList) {
            data = _getBetterScoreAndAction(data, await _getMaxScoreAndActionPlayerProduceUnitWithGridIndex(gridIndex, idleFactoriesCount));
        }

        return data ? data.action : null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phases.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phase 1a: search for the best action for all units.
    // async function _getActionForPhase1a(): Promise<WarAction | null> {   // DONE
    //     await _checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase1a()) {
    //         scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit1(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 1: make the ranged units to attack enemies.
    async function _getActionForPhase1(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase1()) {
            const candidate = await _getActionForMaxScoreWithCandidateUnit(unit);
            const action    = candidate ? candidate.action : null;
            if ((action)                                            &&
                ((action.UnitAttackUnit) || (action.UnitAttackTile))
            ) {
                scoreAndAction = _getBetterScoreAndAction(scoreAndAction, candidate);
            }
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 2: move the infantries, mech and bikes that are capturing buildings.
    async function _getActionForPhase2(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase2()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    //  Phase 3: move the other infantries, mech and bikes.
    async function _getActionForPhase3(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase7()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 4: move the air combat units.
    async function _getActionForPhase4(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase4()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 5: move the remaining direct units.
    async function _getActionForPhase5(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase5()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 6: move the other units except the remaining ranged units.
    async function _getActionForPhase6(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase6()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 7: move the remaining units.
    async function _getActionForPhase7(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        let scoreAndAction : ScoreAndAction;
        for (const unit of await _getCandidateUnitsForPhase7()) {
            scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit(unit));
        }
        if (scoreAndAction) {
            return scoreAndAction.action;
        } else {
            return null;
        }
    }

    // Phase 8: build units.
    async function _getActionForPhase8(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        const action = await _getActionPlayerProduceUnitForMaxScore();
        if (!action) {
            return null;
        }

        return action;
    }

    // Phase 9: end turn.
    async function _getActionForPhase9(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        return { PlayerEndTurn: {} };
    }

    export async function getNextAction(war: SpwWar): Promise<WarAction> {
        if (war == null) {
            Logger.error(`SpwRobot.getNextAction() empty war.`);
            return undefined;
        }
        if (_war != null) {
            Logger.error(`SpwRobot.getNextAction() _war is not null!`);
            return undefined;
        }

        const startTime = Date.now();
        _initVariables(war);

        let action: Types.RawWarActionContainer;
        // (!action) && (action = await _getActionForPhase1a());
        (!action) && (action = await _getActionForPhase1());
        (!action) && (action = await _getActionForPhase2());
        (!action) && (action = await _getActionForPhase3());
        (!action) && (action = await _getActionForPhase4());
        (!action) && (action = await _getActionForPhase5());
        (!action) && (action = await _getActionForPhase6());
        (!action) && (action = await _getActionForPhase7());
        (!action) && (action = await _getActionForPhase8());
        (!action) && (action = await _getActionForPhase9());
        action.actionId = war.getExecutedActionManager().getExecutedActionsCount();

        _clearVariables();

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 500) {
            await new Promise<void>(resolve => egret.setTimeout(() => resolve(), null, 500 - elapsedTime));
        }

        return action;
    }
}
