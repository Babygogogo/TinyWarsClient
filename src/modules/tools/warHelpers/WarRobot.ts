
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import ConfigManager        from "../helpers/ConfigManager";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarDamageCalculator  from "./WarDamageCalculator";
// import WarCommonHelpers     from "./WarCommonHelpers";
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import WarVisibilityHelpers from "./WarVisibilityHelpers";
// import TwnsBwWar            from "../../baseWar/model/BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarRobot {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import WeaponType           = Types.WeaponType;
    import GridIndex            = Types.GridIndex;
    import MovableArea          = Types.MovableArea;
    import MovePathNode         = Types.MovePathNode;
    import TileType             = Types.TileType;
    import UnitType             = Types.UnitType;
    import UnitActionState      = Types.UnitActionState;
    import BwUnit               = TwnsBwUnit.BwUnit;
    import BwTile               = TwnsBwTile.BwTile;
    import BwWar                = TwnsBwWar.BwWar;

    type AttackInfo = {
        baseDamage      : number | null | undefined;
        normalizedHp    : number;
        fuel            : number;
        luckValue       : number;
    };
    type ScoreAndAction = {
        score   : number;
        action  : IWarActionContainer;
    };
    type DamageMapData = {
        max     : number;
        total   : number;
    };
    type CommonParams = {
        war                     : BwWar;
        playerIndexInTurn       : number;
        mapSize                 : Types.MapSize;
        unitValues              : Map<number, number>;
        unitValueRatio          : number;
        visibleUnits            : Set<BwUnit>;
        globalOffenseBonuses    : Map<number, number>;
        globalDefenseBonuses    : Map<number, number>;
        luckValues              : Map<number, number>;
    };

    const _IS_NEED_VISIBILITY = true;
    const _TILE_VALUE: { [tileType: number]: number } = {
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
    const _PRODUCTION_CANDIDATES: { [tileType: number]: { [unitType: number]: number } } = {
        [TileType.Factory]: {
            [UnitType.Infantry]     : 500,
            [UnitType.Mech]         : 0,
            [UnitType.Bike]         : 520,
            [UnitType.Recon]        : 0,
            [UnitType.Flare]        : 0,
            [UnitType.AntiAir]      : 400,
            [UnitType.Tank]         : 650,
            [UnitType.MediumTank]   : 600,
            [UnitType.WarTank]      : 550,
            [UnitType.Artillery]    : 450,
            [UnitType.AntiTank]     : 400,
            [UnitType.Rockets]      : 300,
            [UnitType.Missiles]     : -9999,
            [UnitType.Rig]          : -9999,
        },
        [TileType.Airport]: {
            [UnitType.Fighter]          : 200,
            [UnitType.Bomber]           : 200,
            [UnitType.Duster]           : 400,
            [UnitType.BattleCopter]     : 600,
            [UnitType.TransportCopter]  : -9999,
        },
        [TileType.Seaport]: {
            [UnitType.Battleship]   : 300,
            [UnitType.Carrier]      : -9999,
            [UnitType.Submarine]    : 300,
            [UnitType.Cruiser]      : 300,
            [UnitType.Lander]       : -9999,
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

    const _calculatingWars = new Set<BwWar>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getCommonParams(war: BwWar): Promise<CommonParams> {
        await Helpers.checkAndCallLater();

        const playerIndexInTurn     = war.getPlayerIndexInTurn();
        const unitValues            = await getUnitValues(war);
        return {
            war,
            playerIndexInTurn,
            mapSize                 : war.getTileMap().getMapSize(),
            unitValues,
            unitValueRatio          : await getUnitValueRatio(war, unitValues, playerIndexInTurn),
            visibleUnits            : WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, new Set([war.getPlayer(playerIndexInTurn).getTeamIndex()])),
            globalOffenseBonuses    : await getGlobalOffenseBonuses(war),
            globalDefenseBonuses    : await getGlobalDefenseBonuses(war),
            luckValues              : await getLuckValues(war),
        };
    }

    async function getUnitValues(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const unitValues = new Map<number, number>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const playerIndex           = unit.getPlayerIndex();
            const productionCost        = unit.getProductionCfgCost();
            const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            unitValues.set(playerIndex, (unitValues.get(playerIndex) || 0) + productionCost * normalizedCurrentHp / normalizedMaxHp);
        }

        return unitValues;
    }

    async function getUnitValueRatio(war: BwWar, unitValues: Map<number, number>, playerIndexInTurn: number): Promise<number> {
        await Helpers.checkAndCallLater();

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayer(playerIndexInTurn);
        const selfTeamIndex = playerInTurn.getTeamIndex();
        let selfValue       = 0;
        let enemyValue      = 0;
        for (const [playerIndex, value] of unitValues) {
            const player    = playerManager.getPlayer(playerIndex);
            const teamIndex = player.getTeamIndex();
            if (teamIndex === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return enemyValue > 0 ? selfValue / enemyValue : 1;
    }

    async function getGlobalOffenseBonuses(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const globalOffenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const modifier = commonSettingManager.getSettingsAttackPowerModifier(playerIndex);
            globalOffenseBonuses.set(playerIndex, modifier);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const bonus = tile.getGlobalAttackBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = Helpers.getExisted(globalOffenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_00);
            globalOffenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return globalOffenseBonuses;
    }

    async function getGlobalDefenseBonuses(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const globalDefenseBonuses = new Map<number, number>();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.WarNeutralPlayerIndex; --playerIndex) {
            globalDefenseBonuses.set(playerIndex, 0);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const bonus = tile.getGlobalDefenseBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = Helpers.getExisted(globalDefenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_00);
            globalDefenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return globalDefenseBonuses;
    }

    async function getLuckValues(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const luckValues            = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.WarNeutralPlayerIndex; --playerIndex) {
            const upperLimit = commonSettingManager.getSettingsLuckUpperLimit(playerIndex);
            const lowerLimit = commonSettingManager.getSettingsLuckLowerLimit(playerIndex);
            luckValues.set(playerIndex, (upperLimit + lowerLimit) / 2);
        }

        return luckValues;
    }

    async function checkCanUnitWaitOnGrid(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<boolean> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        return (GridIndexHelpers.checkIsEqual(unitGridIndex, gridIndex))
            ? (unit.getLoaderUnitId() == null)
            : (!commonParams.war.getUnitMap().getUnitOnMap(gridIndex));
    }

    function getBetterScoreAndAction(war: BwWar, data1: ScoreAndAction | null | undefined, data2: ScoreAndAction): ScoreAndAction {
        if (data1 == null) {
            return data2;
        } else {
            const score1 = data1.score;
            const score2 = data2.score;
            if (score1 === score2) {
                // TODO: 此算法改变了war，理想算法下不应该改变war
                return war.getRandomNumberManager().getRandomNumber() > 0.5 ? data1 : data2;
            } else {
                return score1 > score2 ? data1 : data2;
            }
        }
    }

    async function getReachableArea({ commonParams, unit, passableGridIndex, blockedGridIndex }: {
        commonParams        : CommonParams;
        unit                : BwUnit;
        passableGridIndex   : GridIndex | null;
        blockedGridIndex    : GridIndex | null;
    }): Promise<MovableArea> {
        await Helpers.checkAndCallLater();

        const moveRange         = unit.getFinalMoveRange();
        const currentFuel       = unit.getCurrentFuel();
        const unitGridIndex     = unit.getGridIndex();
        const { war, mapSize }  = commonParams;
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        return WarCommonHelpers.createMovableArea({
            origin          : unitGridIndex,
            maxMoveCost     : Math.min(moveRange, currentFuel),
            mapSize,
            moveCostGetter  : (gridIndex: GridIndex) => {
                const tile = tileMap.getTile(gridIndex);
                if ((!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                            ||
                    ((blockedGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, blockedGridIndex)))
                ) {
                    return null;
                } else {
                    if ((passableGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, passableGridIndex))) {
                        return tile ? tile.getMoveCostByUnit(unit) : null;
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != unit.getTeamIndex())) {
                            return null;
                        } else {
                            return tile ? tile.getMoveCostByUnit(unit) : null;
                        }
                    }
                }
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Generators for score map for distance to the nearest capturable tile.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // async function _createScoreMapForDistance(unit: BwUnit): Promise<number[][] | null> {
    //     await _checkAndCallLater();

    //     const tileMap = war.getTileMap();
    //     const nearestCapturableTile = BwHelpers.findNearestCapturableTile(tileMap, war.getUnitMap(), unit);
    //     if (!nearestCapturableTile) {
    //         return null;
    //     }

    //     const { distanceMap, maxDistance }  = BwHelpers.createDistanceMap(tileMap, unit, nearestCapturableTile.getGridIndex());
    //     const mapSize                       = tileMap.getMapSize();
    //     const scoreForUnmovableGrid         = -10 * (maxDistance + 1);
    //     for (let x = 0; x < mapSize.width; ++x) {
    //         for (let y = 0; y < mapSize.height; ++y) {
    //             distanceMap[x][y] = distanceMap[x][y] != null ? distanceMap[x][y] * -10 : scoreForUnmovableGrid;
    //         }
    //     }

    //     return distanceMap;
    // }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Damage map generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getAttackInfo(commonParams: CommonParams, attacker: BwUnit, targetUnit: BwUnit): Promise<AttackInfo> {
        await Helpers.checkAndCallLater();

        const attackerGridIndex             = attacker.getGridIndex();
        const attackerPlayerIndex           = attacker.getPlayerIndex();
        const luckValue                     = Helpers.getExisted(commonParams.luckValues.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetAttackInfo_00);
        const targetArmorType               = targetUnit.getArmorType();
        const attackerCurrentHp             = attacker.getCurrentHp();
        const attackerMaxFuel               = attacker.getMaxFuel();
        const attackerCurrentFuel           = attacker.getCurrentFuel();
        const { war, mapSize }              = commonParams;
        const unitMap                       = war.getUnitMap();
        const attackerNormalizedCurrentHp   = WarCommonHelpers.getNormalizedHp(attackerCurrentHp);
        const baseDamageWithAmmo            = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? WeaponType.Primary : WeaponType.Secondary);
        const baseDamageForCurrentAmmo      = attacker.getBaseDamage(targetArmorType);
        const loaderUnitId                  = attacker.getLoaderUnitId();

        if (loaderUnitId == null) {
            const tile          = war.getTileMap().getTile(attackerGridIndex);
            const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage  : baseDamageWithAmmo,
                    normalizedHp: WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                    fuel        : attackerMaxFuel,
                    luckValue,
                };
            } else {
                if ((tile.checkCanSupplyUnit(attacker))                                             ||
                    (GridIndexHelpers.getAdjacentGrids(attackerGridIndex, mapSize).some(g => {
                        const supplier = unitMap.getUnitOnMap(g);
                        return (!!supplier) && (supplier.checkCanSupplyAdjacentUnit(attacker));
                    }))
                ) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: attackerNormalizedCurrentHp,
                        fuel        : attackerMaxFuel,
                        luckValue,
                    };
                } else {
                    return {
                        baseDamage  : baseDamageForCurrentAmmo,
                        normalizedHp: attackerNormalizedCurrentHp,
                        fuel        : attackerCurrentFuel,
                        luckValue,
                    };
                }
            }

        } else {
            const loaderUnit = unitMap.getUnitOnMap(attackerGridIndex);
            if ((loaderUnit == null) || (loaderUnit === attacker)) {
                throw Helpers.newError(`Invalid loaderUnit.`, ClientErrorCode.SpwRobot_GetAttackInfo_01);
            }

            if ((!attacker.checkCanAttackAfterMove())       ||
                (loaderUnit.getUnitId() !== loaderUnitId)   ||
                (!loaderUnit.checkCanLaunchLoadedUnit())
            ) {
                return {
                    baseDamage  : null,
                    normalizedHp: attackerNormalizedCurrentHp,
                    fuel        : attackerCurrentFuel,
                    luckValue,
                };
            } else {
                const repairInfo = loaderUnit.getRepairHpAndCostForLoadedUnit(attacker);
                if (repairInfo) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                        fuel        : attackerMaxFuel,
                        luckValue,
                    };
                } else {
                    if (loaderUnit.checkCanSupplyLoadedUnit()) {
                        return {
                            baseDamage  : baseDamageWithAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerMaxFuel,
                            luckValue,
                        };
                    } else {
                        return {
                            baseDamage  : baseDamageForCurrentAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerCurrentFuel,
                            luckValue,
                        };
                    }
                }
            }
        }
    }

    async function createDamageMap(commonParams: CommonParams, targetUnit: BwUnit, isDiving: boolean): Promise<DamageMapData[][]> {
        await Helpers.checkAndCallLater();

        const targetPlayerIndex                         = targetUnit.getPlayerIndex();
        const globalDefenseBonus                        = Helpers.getExisted(commonParams.globalDefenseBonuses.get(targetPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_00);
        const { war, mapSize, globalOffenseBonuses }    = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const unitMap                                   = war.getUnitMap();
        const tileMap                                   = war.getTileMap();
        const damageMap                                 = Helpers.createEmptyMap<DamageMapData>(mapWidth);
        const targetTeamIndex                           = targetUnit.getTeamIndex();

        for (const attacker of unitMap.getAllUnits()) {
            await Helpers.checkAndCallLater();

            const beginningGridIndex        = attacker.getGridIndex();
            const attackerPlayerIndex       = attacker.getPlayerIndex();
            const globalOffenseBonus        = Helpers.getExisted(globalOffenseBonuses.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_01);
            const promotionAttackBonus      = attacker.getPromotionAttackBonus();
            const attackerFinalMoveRange    = attacker.getFinalMoveRange();
            const minAttackRange            = attacker.getMinAttackRange();
            const maxAttackRange            = attacker.getFinalMaxAttackRange();
            const attackerTeamIndex         = attacker.getTeamIndex();
            if ((minAttackRange == null)                                ||
                (maxAttackRange == null)                                ||
                (attackerTeamIndex === targetTeamIndex)                 ||
                ((isDiving) && (!attacker.checkCanAttackDivingUnits()))
            ) {
                continue;
            }

            const attackInfo                                    = await getAttackInfo(commonParams, attacker, targetUnit);
            const { baseDamage, fuel, normalizedHp, luckValue } = attackInfo;
            if (baseDamage == null) {
                continue;
            }

            const attackBonus   = globalOffenseBonus + promotionAttackBonus;
            const movableArea   = WarCommonHelpers.createMovableArea({
                origin          : beginningGridIndex,
                maxMoveCost     : Math.min(attackerFinalMoveRange, fuel),
                mapSize,
                moveCostGetter  : gridIndex => {
                    if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                        return null;
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != attackerTeamIndex)) {
                            return null;
                        } else {
                            const tile = tileMap.getTile(gridIndex);
                            return tile ? tile.getMoveCostByUnit(attacker) : null;
                        }
                    }
                },
            });
            const attackableArea = WarCommonHelpers.createAttackableArea({
                movableArea,
                mapSize,
                minAttackRange,
                maxAttackRange,
                checkCanAttack: (moveGridIndex: GridIndex): boolean => {
                    const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                    return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                        && ((attacker.checkCanAttackAfterMove()) || (!hasMoved));
                }
            });

            for (let x = 0; x < mapWidth; ++x) {
                const column = attackableArea[x];
                if (column == null) {
                    continue;
                }

                for (let y = 0; y < mapHeight; ++y) {
                    if (column[y] == null) {
                        continue;
                    }

                    const tile              = tileMap.getTile({ x, y });
                    const tileDefenseAmount = tile.getDefenseAmountForUnit(targetUnit);
                    const damage            = Math.floor(
                        (baseDamage * Math.max(0, 1 + attackBonus / 100) + luckValue)
                        * normalizedHp
                        * WarDamageCalculator.getDamageMultiplierForDefenseBonus(globalDefenseBonus + tileDefenseAmount)
                        / CommonConstants.UnitHpNormalizer
                    );
                    if (!damageMap[x][y]) {
                        damageMap[x][y] = {
                            max     : damage,
                            total   : damage,
                        };
                    } else {
                        const grid  = damageMap[x][y];
                        grid.max    = Math.max(grid.max, damage);
                        grid.total  += damage;
                    }
                }
            }
        }

        return damageMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getCandidateUnitsForPhase1(commonParams: CommonParams): Promise<BwUnit[]> {
        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn }    = commonParams;
        const units                         : BwUnit[] = [];
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn) &&
                (unit.getActionState() === UnitActionState.Idle)
            ) {
                const maxAttackRange = unit.getFinalMaxAttackRange();
                if ((maxAttackRange != null) && (maxAttackRange > 1)) {
                    units.push(unit);
                }
            }
        }
        return units;
    }
    // async function _getCandidateUnitsForPhase1a(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     war.getUnitMap().forEachUnit((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)   &&
    //             (unit.getActionState() === UnitActionState.Idle)
    //         ) {
    //             units.push(unit);
    //         }
    //     });
    //     return units;
    // }

    async function getCandidateUnitsForPhase2(commonParams: CommonParams): Promise<BwUnit[]> {
        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn }    = commonParams;
        const units                         : BwUnit[] = [];
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
                (unit.getActionState() === UnitActionState.Idle)    &&
                (unit.getIsCapturingTile())
            ) {
                units.push(unit);
            }
        }

        return units;
    }

    async function getCandidateUnitsForPhase3(commonParams: CommonParams): Promise<BwUnit[]> {
        // await Helpers.checkAndCallLater();

        // const { war, playerIndexInTurn }    = commonParams;
        // const units                         : BwUnit[] = [];
        // war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
        //     if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
        //         (unit.getActionState() === UnitActionState.Idle)    &&
        //         (unit.checkIsCapturer())
        //     ) {
        //         units.push(unit);
        //     }
        // });

        // return units;

        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn }    = commonParams;
        const units                         : BwUnit[] = [];
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)   &&
                (unit.getActionState() === UnitActionState.Idle)
            ) {
                units.push(unit);

                if (unit.checkCanLaunchLoadedUnit()) {
                    for (const loadedUnit of unit.getLoadedUnits()) {
                        if (loadedUnit.getActionState() === UnitActionState.Idle) {
                            units.push(loadedUnit);
                        }
                    }
                }
            }
        }

        return units;
    }

    // async function _getCandidateUnitsForPhase4(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     const configVersion                 = war.getConfigVersion();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)                                                   &&
    //             (unit.getActionState() === UnitActionState.Idle)                                                &&
    //             (unit.getMinAttackRange())                                                                      &&
    //             (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), Types.UnitCategory.Air))
    //         ) {
    //             units.push(unit);
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase5(): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const units             : BwUnit[] = [];
    //     const playerIndexInturn = war.getTurnManager().getPlayerIndexInTurn();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInturn)   &&
    //             (unit.getActionState() === UnitActionState.Idle)            &&
    //             (unit.getFinalMaxAttackRange() === 1)
    //         ) {
    //             units.push(unit);
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase6(): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const units             : BwUnit[] = [];
    //     const playerIndexInturn = war.getTurnManager().getPlayerIndexInTurn();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getActionState() === UnitActionState.Idle)) {
    //             const maxRange = unit.getFinalMaxAttackRange();
    //             if ((!maxRange) || (maxRange === 1)) {
    //                 units.push(unit);
    //             }
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase7(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn) && (unit.getActionState() === UnitActionState.Idle)) {
    //             units.push(unit);

    //             if (unit.checkCanLaunchLoadedUnit()) {
    //                 for (const loadedUnit of unit.getLoadedUnits()) {
    //                     if (loadedUnit.getActionState() === UnitActionState.Idle) {
    //                         units.push(loadedUnit);
    //                     }
    //                 }
    //             }
    //         }
    //     });

    //     return units;
    // }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Score calculators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getScoreForThreat(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][] | null | undefined): Promise<number> {
        // const hp            = unit.getCurrentHp();
        // const data          = damageMap[gridIndex.x][gridIndex.y];
        // const maxDamage     = Math.min(data ? data.max : 0, hp);
        // // const totalDamage   = Math.min(data ? data.total : 0, hp);
        // return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
        //     * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
        //     * (unit.getHasLoadedCo() ? 2 : 1);

        await Helpers.checkAndCallLater();

        const data = damageMap ? damageMap[gridIndex.x][gridIndex.y] : undefined;
        if (data) {
            const productionCost = unit.getProductionCfgCost();
            return - data.total * productionCost / 3000 / Math.max(1, commonParams.unitValueRatio) * (unit.getHasLoadedCo() ? 2 : 1) * 0.05;
        } else {
            return 0;
        }
    }

    async function getScoreForDistanceToCapturableBuildings(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war, mapSize }                          = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const tileMap                                   = war.getTileMap();
        const teamIndex                                 = unit.getTeamIndex();
        const distanceInfoArray                         : { distance: number, scaler: number }[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (movableArea[x] == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                const info = movableArea[x][y];
                if (info == null) {
                    continue;
                }

                const tile          = tileMap.getTile({ x, y });
                const tileType      = tile.getType();
                const tileTeamIndex = tile.getTeamIndex();
                if ((tile.getMaxCapturePoint() != null) &&
                    (tileTeamIndex !== teamIndex)
                ) {
                    distanceInfoArray.push({
                        distance: info.totalMoveCost,
                        scaler  : (_DISTANCE_SCORE_SCALERS[tileType] || 1) * (tileTeamIndex === CommonConstants.WarNeutralTeamIndex ? 1.2 : 1),
                    });
                }
            }
        }

        const tilesCount = distanceInfoArray.length;
        if (tilesCount <= 0) {
            return 0;
        } else {
            const productionCost    = unit.getProductionCfgCost();
            const currentHp         = unit.getCurrentHp();
            const maxHp             = unit.getMaxHp();
            let score               = 0;
            let maxDistance         = 0;
            for (const distanceInfo of distanceInfoArray) {
                const distance  = distanceInfo.distance;
                maxDistance     = Math.max(maxDistance, distance);
                score           += - Math.pow(distance, 2) * distanceInfo.scaler;
            }
            return score / tilesCount / (maxDistance || 1) * 2 * productionCost / maxHp * currentHp / 3000;
        }

        // const tileMap                                   = war.getTileMap();
        // const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
        // const teamIndex                                 = unit.getTeamIndex();
        // let maxScore                                    = Number.MIN_VALUE;
        // for (let x = 0; x < mapWidth; ++x) {
        //     if (movableArea[x]) {
        //         for (let y = 0; y < mapHeight; ++y) {
        //             const info = movableArea[x][y];
        //             if (info) {
        //                 const tile = tileMap.getTile({ x, y });
        //                 if ((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex)) {
        //                     maxScore = Math.max(maxScore, - info.totalMoveCost * (_DISTANCE_SCORE_SCALERS[tile.getType()] || 1) * 10);
        //                 }
        //             }
        //         }
        //     }
        // }
        // return maxScore > Number.MIN_VALUE ? maxScore : 0;
    }

    async function getScoreForDistanceToOtherUnits(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<number> {
        await Helpers.checkAndCallLater();

        const productionCost                            = unit.getProductionCfgCost();
        const maxHp                                     = unit.getMaxHp();
        const currentHp                                 = unit.getCurrentHp();
        const { war, mapSize }                          = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const unitMap                                   = war.getUnitMap();
        const teamIndex                                 = unit.getTeamIndex();
        const distanceArrayForEnemies                   : number[] = [];
        const distanceArrayForAllies                    : number[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (movableArea[x] == null) {
                continue;
            }

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
                    distanceArrayForEnemies.push(distance);
                } else {
                    distanceArrayForAllies.push(distance);
                }
            }
        }

        const enemiesCount      = distanceArrayForEnemies.length;
        let scoreForEnemies     = 0;
        if (enemiesCount > 0) {
            let maxDistance     = 0;
            let totalDistance1  = 0;
            let totalDistance2  = 0;
            for (const distance of distanceArrayForEnemies) {
                maxDistance     = Math.max(maxDistance, distance);
                totalDistance1  += distance;
                totalDistance2  += Math.pow(distance, 2);
            }
            scoreForEnemies = - totalDistance1 * 0.05 - totalDistance2 / enemiesCount / (maxDistance || 1) * 0.2;
        }

        const alliesCount   = distanceArrayForAllies.length;
        let scoreForAllies  = 0;
        if (alliesCount > 0) {
            let maxDistance     = 0;
            let totalDistance1  = 0;
            let totalDistance2  = 0;
            for (const distance of distanceArrayForAllies) {
                maxDistance     = Math.max(maxDistance, distance);
                totalDistance1  += distance;
                totalDistance2  += Math.pow(distance, 2);
            }
            scoreForAllies = - totalDistance1 * 0.025 - totalDistance2 / alliesCount / (maxDistance || 1) * 0.1;
        }

        return (scoreForAllies + scoreForEnemies) * productionCost / maxHp * currentHp / 3000;

        // const unitMap                                   = war.getUnitMap();
        // const { width: mapWidth, height: mapHeight }    = unitMap.getMapSize();
        // const teamIndex                                 = unit.getTeamIndex();
        // let maxScoreForEnemies                          = Number.MIN_VALUE;
        // let maxScoreForAllies                           = Number.MIN_VALUE;
        // for (let x = 0; x < mapWidth; ++x) {
        //     if (movableArea[x]) {
        //         for (let y = 0; y < mapHeight; ++y) {
        //             const info = movableArea[x][y];
        //             if (info == null) {
        //                 continue;
        //             }

        //             const otherUnit = unitMap.getUnitOnMap({ x, y });
        //             if ((otherUnit == null) || (otherUnit === unit)) {
        //                 continue;
        //             }

        //             const score = - info.totalMoveCost * (otherUnit.getHasLoadedCo() ? 2 : 1);
        //             if (otherUnit.getTeamIndex() !== teamIndex) {
        //                 maxScoreForEnemies = Math.max(maxScoreForEnemies, score * 0);
        //             } else {
        //                 maxScoreForAllies = Math.max(maxScoreForAllies, score * 0);
        //             }
        //         }
        //     }
        // }
        // return (maxScoreForEnemies > Number.MIN_VALUE ? maxScoreForEnemies : 0)
        //     + (maxScoreForAllies > Number.MIN_VALUE ? maxScoreForAllies : 0);
    }

    async function getScoreForPosition({ commonParams, unit, gridIndex, damageMap }: {
        commonParams: CommonParams;
        unit        : BwUnit;
        gridIndex   : GridIndex;
        damageMap   : DamageMapData[][] | null | undefined;
    }): Promise<number> {
        await Helpers.checkAndCallLater();

        let totalScore          = await getScoreForThreat(commonParams, unit, gridIndex, damageMap);
        const { war, mapSize }  = commonParams;
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        if (tile.checkCanRepairUnit(unit)) {
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
            totalScore += (normalizedMaxHp - normalizedCurrentHp) * 15;
        }

        if (tile.checkCanSupplyUnit(unit)) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo) {
                const primaryWeaponCurrentAmmo = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_00);
                totalScore += (maxAmmo - primaryWeaponCurrentAmmo) / maxAmmo * 55;
            }

            const maxFuel       = unit.getMaxFuel();
            const currentFuel   = unit.getCurrentFuel();
            totalScore          += (maxFuel - currentFuel) / maxFuel * 50 * (unit.checkIsDestroyedOnOutOfFuel() ? 2 : 1);

            const maxFlareAmmo = unit.getFlareMaxAmmo();
            if ((maxFlareAmmo) && (_IS_NEED_VISIBILITY) && (war.getFogMap().checkHasFogCurrently())) {
                const flareCurrentAmmo = Helpers.getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_01);
                totalScore += (maxFlareAmmo - flareCurrentAmmo) / maxFlareAmmo * 55;
            }
        }

        const teamIndex = unit.getTeamIndex();
        if (tile.getTeamIndex() === teamIndex) {
            switch (tile.getType()) {
                case TileType.Factory   : totalScore += -500; break;
                case TileType.Airport   : totalScore += -200; break;
                case TileType.Seaport   : totalScore += -150; break;
                default                 : break;
            }
        } else if (tile.getTeamIndex() !== CommonConstants.WarNeutralTeamIndex) {
            switch (tile.getType()) {
                case TileType.Factory   : totalScore += 50; break;
                case TileType.Airport   : totalScore += 20; break;
                case TileType.Seaport   : totalScore += 15; break;
                default                 : break;
            }
        }

        const moveType      = unit.getMoveType();
        const movableArea   = WarCommonHelpers.createMovableArea({
            origin          : gridIndex,
            maxMoveCost     : Number.MAX_SAFE_INTEGER,
            mapSize,
            moveCostGetter  : g => {
                if (!GridIndexHelpers.checkIsInsideMap(g, mapSize)) {
                    return null;
                } else {
                    const t = tileMap.getTile(g);
                    return t ? t.getMoveCostByMoveType(moveType) : null;
                }
            }
        });

        totalScore += await getScoreForDistanceToCapturableBuildings(commonParams, unit, movableArea);
        totalScore += await getScoreForDistanceToOtherUnits(commonParams, unit, movableArea);

        return totalScore;
    }

    async function getScoreForMovePath(commonParams: CommonParams, movingUnit: BwUnit, movePath: MovePathNode[]): Promise<number> {
        await Helpers.checkAndCallLater();

        if (!_IS_NEED_VISIBILITY) {
            return 0;
        } else {
            const discoveredUnits = WarVisibilityHelpers.getDiscoveredUnitsByPath({
                war             : commonParams.war,
                path            : movePath,
                movingUnit,
                isUnitDestroyed : false,
                visibleUnits    : commonParams.visibleUnits,
            });
            let scoreForMovePath = 0;
            for (const unit of discoveredUnits) {
                const productionCost    = unit.getProductionCfgCost();
                const currentHp         = unit.getCurrentHp();
                const maxHp             = unit.getMaxHp();
                scoreForMovePath += 0.3 + productionCost * currentHp / maxHp / 3000 * (unit.getHasLoadedCo() ? 2 : 1) * 0.2;
            }

            return scoreForMovePath;
        }
    }

    async function getScoreForActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war }   = commonParams;
        const loader    = Helpers.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00);
        if (!loader.checkCanLoadUnit(unit)) {
            throw Helpers.newError(`Can't load the unit.`, ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01);
        }

        if (!loader.checkCanLaunchLoadedUnit()) {
            return -1000;
        } else {
            if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
                const normalizedMaxHp = unit.getNormalizedMaxHp();
                const normalizedCurrentHp = unit.getNormalizedCurrentHp();
                return (normalizedMaxHp - normalizedCurrentHp) * 10;
            } else {
                return 0;
            }
        }
    }

    async function getScoreForActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war }       = commonParams;
        const targetUnit    = Helpers.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00);
        if (targetUnit.getActionState() === UnitActionState.Idle) {
            return -9999;
        } else {
            const normalizedCurrentHp1  = unit.getNormalizedCurrentHp();
            const normalizedCurrentHp2  = targetUnit.getNormalizedCurrentHp();
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const newHp                 = normalizedCurrentHp1 + normalizedCurrentHp2;
            if (!targetUnit.getIsCapturingTile()) {
                return newHp > normalizedMaxHp
                    ? ((newHp - normalizedMaxHp) * (-50))
                    : ((normalizedMaxHp - newHp) * 5);
            } else {
                const tile                  = war.getTileMap().getTile(gridIndex);
                const currentCapturePoint   = Helpers.getExisted(tile.getCurrentCapturePoint(), ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_01);
                const captureAmount         = Helpers.getExisted(targetUnit.getCaptureAmount(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_02);
                if (captureAmount >= currentCapturePoint) {
                    return (newHp > normalizedMaxHp)
                        ? ((newHp - normalizedMaxHp) * (-50))
                        : ((normalizedMaxHp - newHp) * 5);
                } else {
                    return (Math.min(normalizedMaxHp, newHp) >= currentCapturePoint) ? 60 : 30;
                }
            }
        }
    }

    async function getScoreForActionUnitAttack({ commonParams, focusUnit, focusUnitGridIndex, battleDamageInfoArray }: {
        commonParams            : CommonParams;
        focusUnit               : BwUnit;
        focusUnitGridIndex      : GridIndex;
        battleDamageInfoArray   : ProtoTypes.Structure.IBattleDamageInfo[];
    }): Promise<number> {
        await Helpers.checkAndCallLater();

        const focusTeamIndex            = focusUnit.getTeamIndex();
        const { war, unitValueRatio }   = commonParams;
        const unitMap                   = war.getUnitMap();
        const tileMap                   = war.getTileMap();
        const unitHpDict                = new Map<BwUnit, number>();
        const tileHpDict                = new Map<BwTile, number>();

        let totalScore = 0;
        for (const battleDamageInfo of battleDamageInfoArray) {
            const damage        = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_00);
            const tileGridIndex = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
            if (tileGridIndex != null) {
                const tile2 = tileMap.getTile(tileGridIndex);
                if (!tileHpDict.has(tile2)) {
                    const tileHp2 = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_01);
                    tileHpDict.set(tile2, tileHp2);
                }

                const tileHp2           = Helpers.getExisted(tileHpDict.get(tile2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_02);
                const tileTeamIndex2    = tile2.getTeamIndex();
                const actualDamage      = Math.min(tileHp2, damage);
                tileHpDict.set(tile2, tileHp2 - actualDamage);

                totalScore += actualDamage * (tileTeamIndex2 === focusTeamIndex ? -1 : 1);
                continue;
            }

            const unitId2 = battleDamageInfo.targetUnitId;
            if (unitId2 != null) {
                const unit2 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_03);
                if (!unitHpDict.has(unit2)) {
                    const unitHp2 = unit2.getCurrentHp();
                    unitHpDict.set(unit2, unitHp2);
                }

                const unitHp2               = Helpers.getExisted(unitHpDict.get(unit2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_04);
                const unitTeamIndex2        = unit2.getTeamIndex();
                const unitId1               = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_05);
                const unit1                 = Helpers.getExisted(unitMap.getUnitById(unitId1), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_06);
                const unitType1             = unit1.getUnitType();
                const unitProductionCost2   = unit2.getProductionCfgCost();
                const unitType2             = unit2.getUnitType();
                const actualDamage          = Math.min(unitHp2, damage);
                unitHpDict.set(unit2, unitHp2 - actualDamage);

                const isUnitDestroyed   = (actualDamage >= unitHp2) && (actualDamage > 0);
                const isSelfDamaged     = unitTeamIndex2 === focusTeamIndex;
                let score               = (actualDamage + (isUnitDestroyed ? 20 : 0))
                    * unitProductionCost2 / 3000
                    * (isSelfDamaged ? 1 / Math.max(1, unitValueRatio) : Math.max(1, unitValueRatio))
                    * (unit2.getHasLoadedCo() ? 2 : 1)
                    * (_DAMAGE_SCORE_SCALERS[unitType1][unitType2] || 1);

                if (unit2.getIsCapturingTile()) {
                    const unitOriginGridIndex2  = unit2.getGridIndex();
                    const gridIndex2            = (unit2 === focusUnit) ? focusUnitGridIndex : unitOriginGridIndex2;
                    if (GridIndexHelpers.checkIsEqual(gridIndex2, unitOriginGridIndex2)) {
                        const captureAmount = Helpers.getExisted(unit2.getCaptureAmount(gridIndex2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_07);
                        const tile2         = tileMap.getTile(gridIndex2);
                        const capturePoint  = Helpers.getExisted(tile2.getCurrentCapturePoint(), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_08);
                        const tileType2     = tile2.getType();
                        score *= captureAmount >= capturePoint ? 2 : 1.1;
                        if ((tileType2 === TileType.Headquarters)    ||
                            (tileType2 === TileType.Factory)         ||
                            (tileType2 === TileType.Airport)         ||
                            (tileType2 === TileType.Seaport)
                        ) {
                            score *= 5;
                        }
                    }
                }

                if (isUnitDestroyed) {
                    for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit2, true)) {
                        const loadedUnitHp              = loadedUnit.getCurrentHp();
                        const loadedUnitProductionCost  = loadedUnit.getProductionCfgCost();
                        score += (loadedUnitHp + 20)
                            * loadedUnitProductionCost / 3000
                            * (isSelfDamaged ? 1 / Math.max(1, unitValueRatio) : Math.max(1, unitValueRatio))
                            * (loadedUnit.getHasLoadedCo() ? 2 : 1);
                    }
                }

                totalScore += score * (isSelfDamaged ? -1 : 1);
                continue;
            }

            throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_09);
        }

        return totalScore;
    }

    async function getScoreForActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const tile                  = commonParams.war.getTileMap().getTile(gridIndex);
        const currentCapturePoint   = Helpers.getExisted(tile.getCurrentCapturePoint(), ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00 );
        const captureAmount         = Helpers.getExisted(unit.getCaptureAmount(gridIndex), ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01);
        if (captureAmount >= currentCapturePoint) {
            return 10000;
        } else if (captureAmount < currentCapturePoint / 3) {
            return 1;
        } else {
            const tileType  = tile.getType();
            const value     = _TILE_VALUE[tileType] || 0;
            return captureAmount >= currentCapturePoint / 2 ? value : value / 2;
        }
    }

    async function getScoreForActionUnitDive(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        const fuel = unit.getCurrentFuel();
        return fuel <= 35 ? -10 : 10;
    }

    async function getScoreForActionUnitLaunchSilo(commonParams: CommonParams, unitValueMap: number[][], targetGridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        let score = 10000;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, CommonConstants.SiloRadius, commonParams.mapSize)) {
            score += unitValueMap[gridIndex.x][gridIndex.y] || 0;
        }

        return score;
    }

    async function getScoreForActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, targetGridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const flareRadius                       = Helpers.getExisted(unit.getFlareRadius(), ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00);
        const { war, mapSize, visibleUnits }    = commonParams;
        const unitMap                           = war.getUnitMap();
        let score                               = 0;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, mapSize)) {
            const u = unitMap.getUnitOnMap(gridIndex);
            if ((u) && (!u.getIsDiving()) && (!visibleUnits.has(u))) {
                const productionCost    = u.getProductionCfgCost();
                const currentHp         = u.getCurrentHp();
                const maxHp             = u.getMaxHp();
                score                   += 3 + productionCost * currentHp / maxHp / 3000 * (u.getHasLoadedCo() ? 2 : 1) * 2;
            }
        }

        return score;
    }

    async function getScoreForActionUnitSurface(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        const fuel = unit.getCurrentFuel();
        return (fuel <= 35) ? 10 : -10;
    }

    async function getScoreForActionUnitWait(): Promise<number> {
        await Helpers.checkAndCallLater();

        // const tile = war.getTileMap().getTile(gridIndex);
        // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
        //     return -20;
        // } else {
        //     return 0;
        // }
        return -10;
    }

    async function getScoreForActionUnitLoadCo(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        if (unit.getUnitType() !== Types.UnitType.Tank) {
            return -9999;
        } else {
            return unit.getCurrentHp() * 10;
        }
    }

    async function getScoreForActionPlayerProduceUnit(commonParams: CommonParams, gridIndex: GridIndex, unitType: UnitType, idleFactoriesCount: number): Promise<number | null> {
        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn, unitValueRatio }    = commonParams;
        const tile                                          = war.getTileMap().getTile(gridIndex);
        const tileType                                      = tile.getType();
        let score                                           = Helpers.getExisted(_PRODUCTION_CANDIDATES[tileType][unitType], ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_00);
        if ((_IS_NEED_VISIBILITY)                                           &&
            (war.getFogMap().checkHasFogCurrently())                        &&
            ((unitType === UnitType.Flare) || (unitType === UnitType.Recon))
        ) {
            score += 100;
        }

        const configVersion = war.getConfigVersion();
        const player        = war.getPlayerManager().getPlayer(playerIndexInTurn);
        const fund          = player.getFund();
        const targetUnit    = new BwUnit();
        targetUnit.init({
            unitId      : 0,
            unitType,
            gridIndex,
            playerIndex : playerIndexInTurn,
        }, configVersion);
        targetUnit.startRunning(war);

        const productionCost    = targetUnit.getProductionFinalCost();
        const restFund          = fund - productionCost;
        if (restFund < 0) {
            return null;
        }

        if (unitType !== UnitType.Infantry) {
            const unitCfg               = ConfigManager.getUnitTemplateCfg(configVersion, UnitType.Infantry);
            const restFactoriesCount    = tileType === TileType.Factory ? idleFactoriesCount - 1 : idleFactoriesCount;
            if (restFactoriesCount * unitCfg.productionCost > restFund) {
                score += -999999;
            }
        }

        const teamIndex = targetUnit.getTeamIndex();
        let canAttack   = false;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitCurrentHp = unit.getCurrentHp();
            if (unit.getTeamIndex() === teamIndex) {
                if (unit.getUnitType() === unitType) {
                    score += - unitCurrentHp * productionCost / 3000 / 1.5;
                }
            } else {
                if (targetUnit.getMinAttackRange()) {
                    const unitArmorType = unit.getArmorType();
                    const baseDamage    = targetUnit.getBaseDamage(unitArmorType);
                    if (baseDamage != null) {
                        const unitProductionCost    = unit.getProductionCfgCost();
                        const damage                = Math.min(baseDamage, unitCurrentHp);
                        canAttack                   = true;
                        score                       += damage * unitProductionCost / 3000 * Math.max(1, unitValueRatio);
                    }
                }
                if (unit.getMinAttackRange()) {
                    const targetUnitArmorType   = targetUnit.getArmorType();
                    const baseDamage            = unit.getBaseDamage(targetUnitArmorType);
                    if (baseDamage != null) {
                        const unitNormalizedMaxHp   = unit.getNormalizedMaxHp();
                        const targetUnitCurrentHp   = targetUnit.getCurrentHp();
                        const damage                = Math.min(baseDamage * WarCommonHelpers.getNormalizedHp(unitCurrentHp) / unitNormalizedMaxHp, targetUnitCurrentHp);
                        score                       += - damage * productionCost / 3000 / Math.max(1, unitValueRatio);
                    }
                }
            }
        }

        if (!canAttack) {
            score += -999999;
        }
        return score;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getScoreAndActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return null;
        }

        const loader = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return null;
        }

        const score = await getScoreForActionUnitBeLoaded(commonParams, unit, gridIndex);
        return {
            score,
            action  : { WarActionUnitBeLoaded: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return null;
        }

        const existingUnit = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return null;
        }

        const score = await getScoreForActionUnitJoin(commonParams, unit, gridIndex);
        return {
            score,
            action  : { WarActionUnitJoinUnit: {
                path        : {
                nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitAttack(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        const minRange      = unit.getMinAttackRange();
        const maxRange      = unit.getFinalMaxAttackRange();
        if ((minRange == null)                                                                              ||
            (maxRange == null)                                                                              ||
            ((!unit.checkCanAttackAfterMove()) && (!GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)))
        ) {
            return null;
        }

        const { war, visibleUnits, mapSize }    = commonParams;
        const launchUnitId                      = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
        const unitMap                           = war.getUnitMap();
        let bestScoreAndAction                  : ScoreAndAction | null = null;
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, minRange, maxRange, mapSize)) {
            const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
            if ((_IS_NEED_VISIBILITY) && (targetUnit != null) && (!visibleUnits.has(targetUnit))) {
                continue;
            }
            if (!unit.checkCanAttackTargetAfterMovePath(pathNodes, targetGridIndex)) {
                continue;
            }

            const battleDamageInfoArray = WarDamageCalculator.getEstimatedBattleDamage({ war, attackerMovePath: pathNodes, launchUnitId, targetGridIndex });
            const score                 = await getScoreForActionUnitAttack({
                commonParams,
                focusUnit           : unit,
                focusUnitGridIndex  : gridIndex,
                battleDamageInfoArray,
            });

            bestScoreAndAction = getBetterScoreAndAction(
                war,
                bestScoreAndAction,
                {
                    score,
                    action  : unitMap.getUnitOnMap(targetGridIndex) != null
                        ? { WarActionUnitAttackUnit: {
                            path        : {
                                nodes           : pathNodes,
                                fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                                isBlocked       : false,
                            },
                            targetGridIndex,
                            launchUnitId,
                        } }
                        : { WarActionUnitAttackTile: {
                            path        : {
                                nodes           : pathNodes,
                                fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                                isBlocked       : false,
                            },
                            targetGridIndex,
                            launchUnitId,
                        }, },
                }
            );
        }

        return bestScoreAndAction;
    }

    async function getScoreAndActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const tile = commonParams.war.getTileMap().getTile(gridIndex);
        if (!unit.checkCanCaptureTile(tile)) {
            return null;
        } else {
            const score = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
            return {
                score,
                action  : { WarActionUnitCaptureTile: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitDive(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanDive()) {
            return null;
        } else {
            const score = await getScoreForActionUnitDive(unit);
            return {
                score,
                action  : { WarActionUnitDive: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitLaunchSilo(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const { war }   = commonParams;
        const tile      = war.getTileMap().getTile(gridIndex);
        if (!unit.checkCanLaunchSiloOnTile(tile)) {
            return null;
        }

        const { width: mapWidth, height: mapHeight }    = commonParams.mapSize;
        const unitValueMap                              = Helpers.createEmptyMap<number>(mapWidth, mapHeight);
        const teamIndex                                 = unit.getTeamIndex();
        const unitMap                                   = war.getUnitMap();
        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const targetUnit = unitMap.getUnitOnMap({ x, y });
                if ((!targetUnit) || (targetUnit === unit)) {
                    unitValueMap[x][y] = 0;
                } else {
                    const targetUnitCurrentHp       = targetUnit.getCurrentHp();
                    const targetUnitProductionCost  = targetUnit.getProductionCfgCost();
                    const value                     = Math.min(30, targetUnitCurrentHp - 1) * targetUnitProductionCost / 10;
                    unitValueMap[x][y]              = targetUnit.getTeamIndex() === teamIndex ? -value : value;
                }
            }
        }

        const unitCurrentHp                     = unit.getCurrentHp();
        const unitProductionCost                = unit.getProductionCfgCost();
        unitValueMap[gridIndex.x][gridIndex.y]  = -Math.min(30, unitCurrentHp - 1) * unitProductionCost / 10;

        let scoreAndGridIndex: { score: number, gridIndex: GridIndex } | null = null;
        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const newTargetGridIndex    : GridIndex = { x, y };
                const newMaxScore           = await getScoreForActionUnitLaunchSilo(commonParams, unitValueMap, newTargetGridIndex);
                if (scoreAndGridIndex == null) {
                    scoreAndGridIndex = {
                        score       : newMaxScore,
                        gridIndex   : newTargetGridIndex,
                    };
                } else if (newMaxScore > scoreAndGridIndex.score) {
                    scoreAndGridIndex.score     = newMaxScore;
                    scoreAndGridIndex.gridIndex = newTargetGridIndex;
                }
            }
        }

        return scoreAndGridIndex
            ? {
                score   : scoreAndGridIndex.score,
                action  : {
                    WarActionUnitLaunchSilo: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                        targetGridIndex : scoreAndGridIndex.gridIndex,
                    }
                },
            }
            : null;
    }

    async function getScoreAndActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const { war, mapSize } = commonParams;
        if ((!_IS_NEED_VISIBILITY)                      ||
            (!war.getFogMap().checkHasFogCurrently())   ||
            (!unit.getFlareCurrentAmmo())               ||
            (pathNodes.length !== 1)
        ) {
            return null;
        } else {
            const flareMaxRange     = Helpers.getExisted(unit.getFlareMaxRange(), ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00);
            let bestScoreAndAction  : ScoreAndAction | null = null;
            for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, 0, flareMaxRange, mapSize)) {
                const score         = await getScoreForActionUnitLaunchFlare(commonParams, unit, targetGridIndex);
                bestScoreAndAction  = getBetterScoreAndAction(
                    war,
                    bestScoreAndAction,
                    {
                        score,
                        action  : { WarActionUnitLaunchFlare: {
                            path        : {
                                nodes           : pathNodes,
                                fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                                isBlocked       : false,
                            },
                            launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                            targetGridIndex,
                        } },
                    }
                );
            }

            return bestScoreAndAction;
        }
    }

    async function getScoreAndActionUnitSurface(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanSurface()) {
            return null;
        } else {
            const score = await getScoreForActionUnitSurface(unit);
            return {
                score,
                action  : { WarActionUnitSurface: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitWait(unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction> {
        await Helpers.checkAndCallLater();

        const score = await getScoreForActionUnitWait();
        return {
            score,
            action  : { WarActionUnitWait: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitLoadCo(unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanLoadCoAfterMovePath(pathNodes)) {
            return null;
        }

        return {
            score   : await getScoreForActionUnitLoadCo(unit),
            action  : { WarActionUnitLoadCo: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getBestScoreAndActionForUnitAndPath(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const scoreAndActionForUnitBeLoaded = await getScoreAndActionUnitBeLoaded(commonParams, unit, gridIndex, pathNodes);
        if (scoreAndActionForUnitBeLoaded) {
            return scoreAndActionForUnitBeLoaded;
        }

        const scoreAndActionForUnitJoin = await getScoreAndActionUnitJoin(commonParams, unit, gridIndex, pathNodes);
        if (scoreAndActionForUnitJoin) {
            return scoreAndActionForUnitJoin;
        }

        if (!await checkCanUnitWaitOnGrid(commonParams, unit, gridIndex)) {
            return null;
        }

        const resultArray = await Promise.all([
            getScoreAndActionUnitAttack(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitCaptureTile(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitDive(unit, gridIndex, pathNodes),
            getScoreAndActionUnitLaunchSilo(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitLaunchFlare(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitSurface(unit, gridIndex, pathNodes),
            getScoreAndActionUnitWait(unit, pathNodes),
            getScoreAndActionUnitLoadCo(unit, pathNodes),
        ]);

        const war               = commonParams.war;
        let bestScoreAndAction  : ScoreAndAction | null = null;
        for (const scoreAndAction of resultArray) {
            if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(war, bestScoreAndAction, scoreAndAction);
        }

        return bestScoreAndAction;
    }

    async function getBestScoreAndActionForCandidateUnit(commonParams: CommonParams, candidateUnit: BwUnit): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const reachableArea         = await getReachableArea({ commonParams, unit: candidateUnit, passableGridIndex: null, blockedGridIndex: null });
        const damageMapForSurface   = await createDamageMap(commonParams, candidateUnit, false);
        const damageMapForDive      = candidateUnit.checkIsDiver() ? await createDamageMap(commonParams, candidateUnit, true) : null;
        const originGridIndex       = candidateUnit.getGridIndex();
        // const scoreMapForDistance   = await _createScoreMapForDistance(candidateUnit);
        const { width: mapWidth, height: mapHeight }    = commonParams.mapSize;
        const war                                       = commonParams.war;
        let bestScoreAndAction                          : ScoreAndAction | null = null;
        for (let x = 0; x < mapWidth; ++x) {
            if (reachableArea[x] == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                if (reachableArea[x][y] == null) {
                    continue;
                }

                const gridIndex: GridIndex = { x, y };
                if ((candidateUnit.getLoaderUnitId() != null)                   &&
                    (GridIndexHelpers.checkIsEqual(gridIndex, originGridIndex))
                ) {
                    continue;
                }

                const pathNodes         = WarCommonHelpers.createShortestMovePath(reachableArea, gridIndex);
                const scoreAndAction    = await getBestScoreAndActionForUnitAndPath(commonParams, candidateUnit, gridIndex, pathNodes);
                if (scoreAndAction == null) {
                    continue;
                }

                const score = scoreAndAction.score;
                if (score == null) {
                    continue;
                }

                const scoreForMovePath  = await getScoreForMovePath(commonParams, candidateUnit, pathNodes);
                const action            = scoreAndAction.action;
                const scoreForPosition  = await getScoreForPosition({
                    commonParams,
                    unit        : candidateUnit,
                    gridIndex,
                    damageMap   : ((action.WarActionUnitDive) || ((candidateUnit.getIsDiving()) && (!action.WarActionUnitSurface))) ? damageMapForDive : damageMapForSurface,
                });
                bestScoreAndAction  = getBetterScoreAndAction(
                    war,
                    bestScoreAndAction,
                    {
                        action,
                        score   : score + scoreForMovePath + scoreForPosition,
                    },
                );
            }
        }

        return bestScoreAndAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for production.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getBestScoreAndActionPlayerProduceUnitWithGridIndex(commonParams: CommonParams, gridIndex: GridIndex, idleFactoriesCount: number): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const tile      = commonParams.war.getTileMap().getTile(gridIndex);
        const tileType  = tile.getType();
        let bestScoreAndUnitType: { score: number, unitType: UnitType } | null = null;
        for (const t in _PRODUCTION_CANDIDATES[tileType]) {
            const unitType  = Number(t) as UnitType;
            const score     = await getScoreForActionPlayerProduceUnit(commonParams, gridIndex, unitType, idleFactoriesCount);
            if (score == null) {
                continue;
            }

            if (bestScoreAndUnitType == null) {
                bestScoreAndUnitType = {
                    score,
                    unitType,
                };
            } else if (score > bestScoreAndUnitType.score) {
                bestScoreAndUnitType.score       = score;
                bestScoreAndUnitType.unitType    = unitType;
            }
        }

        if (bestScoreAndUnitType == null) {
            return null;
        } else {
            return {
                score   : bestScoreAndUnitType.score,
                action  : { WarActionPlayerProduceUnit: {
                    unitType    : bestScoreAndUnitType.unitType,
                    unitHp      : CommonConstants.UnitMaxHp,
                    gridIndex,
                } },
            };
        }
    }

    async function getBestActionPlayerProduceUnit(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn } = commonParams;
        if (playerIndexInTurn === CommonConstants.WarNeutralPlayerIndex) {
            return null;
        }

        const idleBuildingPosList   : GridIndex[] = [];
        const unitMap               = war.getUnitMap();
        let idleFactoriesCount      = 0;

        for (const tile of war.getTileMap().getAllTiles()) {
            const gridIndex = tile.getGridIndex();
            if ((!unitMap.getUnitOnMap(gridIndex))                  &&
                (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))
            ) {
                idleBuildingPosList.push(gridIndex);
                if (tile.getType() === TileType.Factory) {
                    ++idleFactoriesCount;
                }
            }
        }

        let bestScoreAndAction: ScoreAndAction | null = null;
        for (const gridIndex of idleBuildingPosList) {
            const scoreAndAction = await getBestScoreAndActionPlayerProduceUnitWithGridIndex(commonParams, gridIndex, idleFactoriesCount);
            if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(war, bestScoreAndAction, scoreAndAction);
        }

        return bestScoreAndAction ? bestScoreAndAction.action : null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phases.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phase 1a: search for the best action for all units.
    // async function _getActionForPhase1a(): Promise<WarAction | null> {
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
    async function getActionForPhase1(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const war               = commonParams.war;
        let bestScoreAndAction  : ScoreAndAction | null = null;
        for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
            const scoreAndAction = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (scoreAndAction == null) {
                continue;
            }

            const action = scoreAndAction.action;
            if ((action.WarActionUnitAttackUnit) || (action.WarActionUnitAttackTile)) {
                bestScoreAndAction = getBetterScoreAndAction(war, bestScoreAndAction, scoreAndAction);
            }
        }

        return bestScoreAndAction ? bestScoreAndAction.action : null;
    }

    // Phase 2: move the infantries, mech and bikes that are capturing buildings.
    async function getActionForPhase2(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const war               = commonParams.war;
        let bestScoreAndAction  : ScoreAndAction | null = null;
        for (const unit of await getCandidateUnitsForPhase2(commonParams)) {
            const scoreAndAction = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(war, bestScoreAndAction, scoreAndAction);
        }

        return bestScoreAndAction ? bestScoreAndAction.action : null;
    }

    //  Phase 3: move the other infantries, mech and bikes.
    async function getActionForPhase3(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const war               = commonParams.war;
        let bestScoreAndAction  : ScoreAndAction | null | undefined = null;
        for (const unit of await getCandidateUnitsForPhase3(commonParams)) {
            const scoreAndAction = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(war, bestScoreAndAction, scoreAndAction);
        }

        return  bestScoreAndAction ? bestScoreAndAction.action : null;
    }

    // Phase 4: move the air combat units.
    // async function _getActionForPhase4(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase4()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 5: move the remaining direct units.
    // async function _getActionForPhase5(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase5()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 6: move the other units except the remaining ranged units.
    // async function _getActionForPhase6(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase6()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 7: move the remaining units.
    // async function _getActionForPhase7(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase7()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 8: build units.
    async function getActionForPhase8(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        return await getBestActionPlayerProduceUnit(commonParams);
    }

    // Phase 9: vote for draw.
    async function getActionForPhase9(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        if (commonParams.war.getDrawVoteManager().getRemainingVotes() == null) {
            return null;
        } else {
            return {
                WarActionPlayerVoteForDraw: {
                    isAgree : false,
                },
            };
        }
    }

    // Phase 10: end turn.
    async function getActionForPhase10(): Promise<IWarActionContainer> {
        await Helpers.checkAndCallLater();

        return {
            WarActionPlayerEndTurn: {},
        };
    }

    const funcArray = [
        getActionForPhase1,
        getActionForPhase2,
        getActionForPhase3,
        getActionForPhase8,
        getActionForPhase9,
        getActionForPhase10,
    ];
    async function doGetNextAction(war: BwWar): Promise<IWarActionContainer> {
        const commonParams = await getCommonParams(war);
        if (war.getPlayerIndexInTurn() === CommonConstants.WarNeutralPlayerIndex) {
            throw Helpers.newError(`Invalid playerIndexInTurn.`, ClientErrorCode.SpwRobot_DoGetNextAction_00);
        }

        for (const func of funcArray) {
            const actionForPhase = await func(commonParams);
            if (actionForPhase) {
                return actionForPhase;
            }
        }

        throw Helpers.newError(`No available action?!`, ClientErrorCode.SpwRobot_DoGetNextAction_01);
    }

    export async function getNextAction(war: BwWar): Promise<IWarActionContainer> {
        if (_calculatingWars.has(war)) {
            throw Helpers.newError(`Calculating.`, ClientErrorCode.SpwRobot_GetNextAction_00);
        }

        _calculatingWars.add(war);
        const action = await doGetNextAction(war);
        action.actionId = war.getExecutedActionManager().getExecutedActionsCount();
        _calculatingWars.delete(war);

        return action;
    }
}

// export default WarRobot;
