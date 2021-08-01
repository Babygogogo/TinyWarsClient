
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import CommonConstants      from "../helpers/CommonConstants";
import ConfigManager        from "../helpers/ConfigManager";
import GridIndexHelpers     from "../helpers/GridIndexHelpers";
import Helpers              from "../helpers/Helpers";
import Types                from "../helpers/Types";
import ProtoTypes           from "../proto/ProtoTypes";
import WarDamageCalculator  from "./WarDamageCalculator";
import WarCommonHelpers     from "./WarCommonHelpers";
import TwnsBwTile           from "../../baseWar/model/BwTile";
import TwnsBwUnit           from "../../baseWar/model/BwUnit";
import WarVisibilityHelpers from "./WarVisibilityHelpers";
import TwnsBwWar            from "../../baseWar/model/BwWar";

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
    import checkAndCallLater    = Helpers.checkAndCallLater;

    type AttackInfo = {
        baseDamage      : number | null | undefined;
        normalizedHp    : number;
        fuel            : number;
        luckValue       : number;
    };
    type ErrorCodeAndScore = {
        errorCode   : ClientErrorCode;
        score?      : number;
    };
    type ErrorCodeAndScoreAndAction = {
        errorCode       : ClientErrorCode;
        scoreAndAction? : ScoreAndAction;
    };
    type ErrorCodeAndAction = {
        errorCode   : ClientErrorCode;
        action?     : IWarActionContainer;
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
    async function getCommonParams(war: BwWar): Promise<{ errorCode: ClientErrorCode, commonParams?: CommonParams }> {
        await checkAndCallLater();

        const playerIndexInTurn = war.getPlayerIndexInTurn();
        if (playerIndexInTurn == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_00 };
        }

        const mapSize = war.getTileMap().getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_01 };
        }

        const { errorCode: errorCodeForUnitValues, unitValues } = await getUnitValues(war);
        if (errorCodeForUnitValues) {
            return { errorCode: errorCodeForUnitValues };
        } else if (unitValues == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_02 };
        }

        const { errorCode: errorCodeForUnitValueRatio, unitValueRatio } = await getUnitValueRatio(war, unitValues, playerIndexInTurn);
        if (errorCodeForUnitValueRatio) {
            return { errorCode: errorCodeForUnitValueRatio };
        } else if (unitValueRatio == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_03 };
        }

        const playerInTurn  = war.getPlayer(playerIndexInTurn);
        const teamIndex     = playerInTurn ? playerInTurn.getTeamIndex() : null;
        if (teamIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_04 };
        }

        const visibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndex]));
        if (visibleUnits == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_05 };
        }

        const { errorCode: errorCodeForGlobalOffenseBonuses, globalOffenseBonuses } = await getGlobalOffenseBonuses(war);
        if (errorCodeForGlobalOffenseBonuses) {
            return { errorCode: errorCodeForGlobalOffenseBonuses };
        } else if (globalOffenseBonuses == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_06 };
        }

        const { errorCode: errorCodeForGlobalDefenseBonuses, globalDefenseBonuses } = await getGlobalDefenseBonuses(war);
        if (errorCodeForGlobalDefenseBonuses) {
            return { errorCode: errorCodeForGlobalDefenseBonuses };
        } else if (globalDefenseBonuses == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_07 };
        }

        const { errorCode: errorCodeForLuckValues, luckValues } = await getLuckValues(war);
        if (errorCodeForLuckValues) {
            return { errorCode: errorCodeForLuckValues };
        } else if (luckValues == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetCommonParams_08 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            commonParams: {
                war,
                playerIndexInTurn,
                mapSize,
                unitValues,
                unitValueRatio,
                visibleUnits,
                globalOffenseBonuses,
                globalDefenseBonuses,
                luckValues,
            },
        };
    }

    async function getUnitValues(war: BwWar): Promise<{ errorCode: ClientErrorCode, unitValues?: Map<number, number> }> {
        await checkAndCallLater();

        const unitValues = new Map<number, number>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const playerIndex = unit.getPlayerIndex();
            if (playerIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetUnitValues_00 };
            }

            const productionCost = unit.getProductionCfgCost();
            if (productionCost == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetUnitValues_01 };
            }

            const normalizedCurrentHp = unit.getNormalizedCurrentHp();
            if (normalizedCurrentHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetUnitValues_02 };
            }

            const normalizedMaxHp = unit.getNormalizedMaxHp();
            if (normalizedMaxHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetUnitValues_03 };
            }

            unitValues.set(playerIndex, (unitValues.get(playerIndex) || 0) + productionCost * normalizedCurrentHp / normalizedMaxHp);
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            unitValues,
        };
    }

    async function getUnitValueRatio(war: BwWar, unitValues: Map<number, number>, playerIndexInTurn: number): Promise<{ errorCode: ClientErrorCode, unitValueRatio?: number }> {
        await checkAndCallLater();

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayer(playerIndexInTurn);
        if (playerInTurn == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetUnitValueRatio_00 };
        }

        const selfTeamIndex = playerInTurn.getTeamIndex();
        if (selfTeamIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetUnitValueRatio_01 };
        }

        let selfValue   = 0;
        let enemyValue  = 0;
        for (const [playerIndex, value] of unitValues) {
            const player    = playerManager.getPlayer(playerIndex);
            const teamIndex = player ? player.getTeamIndex() : null;
            if (teamIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetUnitValueRatio_02 };
            }

            if (teamIndex === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return {
            errorCode       : ClientErrorCode.NoError,
            unitValueRatio  : enemyValue > 0 ? selfValue / enemyValue : 1,
        };
    }

    async function getGlobalOffenseBonuses(war: BwWar): Promise<{ errorCode: ClientErrorCode, globalOffenseBonuses?: Map<number, number> }> {
        await checkAndCallLater();

        const globalOffenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_00 };
            }
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const modifier = commonSettingManager.getSettingsAttackPowerModifier(playerIndex);
            if (modifier == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_01 };
            }
            globalOffenseBonuses.set(playerIndex, modifier);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_02 };
            }
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const bonus = tile.getGlobalAttackBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = globalOffenseBonuses.get(playerIndex);
            if (currentBonus == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_03 };
            }

            globalOffenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return {
            errorCode           : ClientErrorCode.NoError,
            globalOffenseBonuses,
        };
    }

    async function getGlobalDefenseBonuses(war: BwWar): Promise<{ errorCode: ClientErrorCode, globalDefenseBonuses?: Map<number, number> }> {
        await checkAndCallLater();

        const globalDefenseBonuses = new Map<number, number>();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.WarNeutralPlayerIndex; --playerIndex) {
            globalDefenseBonuses.set(playerIndex, 0);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_00 };
            }
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                continue;
            }

            const bonus = tile.getGlobalDefenseBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = globalDefenseBonuses.get(playerIndex);
            if (currentBonus == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_01 };
            }

            globalDefenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return {
            errorCode           : ClientErrorCode.NoError,
            globalDefenseBonuses,
        };
    }

    async function getLuckValues(war: BwWar): Promise<{ errorCode: ClientErrorCode, luckValues?: Map<number, number> }> {
        await checkAndCallLater();

        const luckValues            = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.WarNeutralPlayerIndex; --playerIndex) {
            const upperLimit = commonSettingManager.getSettingsLuckUpperLimit(playerIndex);
            if (upperLimit == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetLuckValue_00 };
            }

            const lowerLimit = commonSettingManager.getSettingsLuckLowerLimit(playerIndex);
            if (lowerLimit == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetLuckValue_01 };
            }

            luckValues.set(playerIndex, (upperLimit + lowerLimit) / 2);
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            luckValues,
        };
    }

    async function checkCanUnitWaitOnGrid(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<{ errorCode: ClientErrorCode, canWait?: boolean }> {
        await checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_CheckCanUnitWaitOnGrid_00 };
        } else {
            return {
                errorCode   : ClientErrorCode.NoError,
                canWait     : (GridIndexHelpers.checkIsEqual(unitGridIndex, gridIndex))
                    ? (unit.getLoaderUnitId() == null)
                    : (!commonParams.war.getUnitMap().getUnitOnMap(gridIndex)),
            };
        }
    }

    function getBetterScoreAndAction(data1: ScoreAndAction | null | undefined, data2: ScoreAndAction): ScoreAndAction {
        if (data1 == null) {
            return data2;
        } else {
            return data1.score >= data2.score ? data1 : data2;
        }
    }

    async function getReachableArea({ commonParams, unit, passableGridIndex, blockedGridIndex }: {
        commonParams        : CommonParams;
        unit                : BwUnit;
        passableGridIndex   : GridIndex | null;
        blockedGridIndex    : GridIndex | null;
    }): Promise<{ errorCode: ClientErrorCode, reachableArea?: MovableArea }> {
        await checkAndCallLater();

        const moveRange = unit.getFinalMoveRange();
        if (moveRange == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetReachableArea_00 };
        }

        const currentFuel = unit.getCurrentFuel();
        if (currentFuel == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetReachableArea_01 };
        }

        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetReachableArea_02 };
        }

        const { war, mapSize }  = commonParams;
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        return {
            errorCode       : ClientErrorCode.NoError,
            reachableArea   : WarCommonHelpers.createMovableArea({
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
            }),
        };
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
    async function getAttackInfo(commonParams: CommonParams, attacker: BwUnit, targetUnit: BwUnit): Promise<{ errorCode: ClientErrorCode, attackInfo?: AttackInfo }> {
        await checkAndCallLater();

        const attackerGridIndex = attacker.getGridIndex();
        if (attackerGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_00 };
        }

        const attackerPlayerIndex = attacker.getPlayerIndex();
        if (attackerPlayerIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_01 };
        }

        const luckValue = commonParams.luckValues.get(attackerPlayerIndex);
        if (luckValue == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_02 };
        }

        const targetArmorType = targetUnit.getArmorType();
        if (targetArmorType == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_03 };
        }

        const attackerCurrentHp = attacker.getCurrentHp();
        if (attackerCurrentHp == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_04 };
        }

        const attackerMaxFuel = attacker.getMaxFuel();
        if (attackerMaxFuel == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_05 };
        }

        const attackerCurrentFuel = attacker.getCurrentFuel();
        if (attackerCurrentFuel == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_06 };
        }

        const { war, mapSize }              = commonParams;
        const unitMap                       = war.getUnitMap();
        const attackerNormalizedCurrentHp   = WarCommonHelpers.getNormalizedHp(attackerCurrentHp);
        const baseDamageWithAmmo            = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? WeaponType.Primary : WeaponType.Secondary);
        const baseDamageForCurrentAmmo      = attacker.getBaseDamage(targetArmorType);
        const loaderUnitId                  = attacker.getLoaderUnitId();

        if (loaderUnitId == null) {
            const tile = war.getTileMap().getTile(attackerGridIndex);
            if (tile == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_07 };
            }

            const repairInfo = tile.getRepairHpAndCostForUnit(attacker);
            if (repairInfo) {
                return {
                    errorCode   : ClientErrorCode.NoError,
                    attackInfo  : {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                        fuel        : attackerMaxFuel,
                        luckValue,
                    },
                };
            } else {
                if ((tile.checkCanSupplyUnit(attacker))                                             ||
                    (GridIndexHelpers.getAdjacentGrids(attackerGridIndex, mapSize).some(g => {
                        const supplier = unitMap.getUnitOnMap(g);
                        return (!!supplier) && (supplier.checkCanSupplyAdjacentUnit(attacker));
                    }))
                ) {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        attackInfo  : {
                            baseDamage  : baseDamageWithAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerMaxFuel,
                            luckValue,
                        },
                    };
                } else {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        attackInfo  : {
                            baseDamage  : baseDamageForCurrentAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerCurrentFuel,
                            luckValue,
                        },
                    };
                }
            }

        } else {
            const loaderUnit = unitMap.getUnitOnMap(attackerGridIndex);
            if ((loaderUnit == null) || (loaderUnit === attacker)) {
                return { errorCode: ClientErrorCode.SpwRobot_GetAttackInfo_08 };
            }

            if ((!attacker.checkCanAttackAfterMove())       ||
                (loaderUnit.getUnitId() !== loaderUnitId)   ||
                (!loaderUnit.checkCanLaunchLoadedUnit())
            ) {
                return {
                    errorCode   : ClientErrorCode.NoError,
                    attackInfo  : {
                        baseDamage  : null,
                        normalizedHp: attackerNormalizedCurrentHp,
                        fuel        : attackerCurrentFuel,
                        luckValue,
                    },
                };
            } else {
                const repairInfo = loaderUnit.getRepairHpAndCostForLoadedUnit(attacker);
                if (repairInfo) {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        attackInfo  : {
                            baseDamage  : baseDamageWithAmmo,
                            normalizedHp: WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                            fuel        : attackerMaxFuel,
                            luckValue,
                        }
                    };
                } else {
                    if (loaderUnit.checkCanSupplyLoadedUnit()) {
                        return {
                            errorCode   : ClientErrorCode.NoError,
                            attackInfo  : {
                                baseDamage  : baseDamageWithAmmo,
                                normalizedHp: attackerNormalizedCurrentHp,
                                fuel        : attackerMaxFuel,
                                luckValue,
                            },
                        };
                    } else {
                        return {
                            errorCode   : ClientErrorCode.NoError,
                            attackInfo  : {
                                baseDamage  : baseDamageForCurrentAmmo,
                                normalizedHp: attackerNormalizedCurrentHp,
                                fuel        : attackerCurrentFuel,
                                luckValue,
                            },
                        };
                    }
                }
            }
        }
    }

    async function createDamageMap(commonParams: CommonParams, targetUnit: BwUnit, isDiving: boolean): Promise<{ errorCode: ClientErrorCode, damageMap?: DamageMapData[][] }> {
        await checkAndCallLater();

        const targetPlayerIndex = targetUnit.getPlayerIndex();
        if (targetPlayerIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_00 };
        }

        const globalDefenseBonus = commonParams.globalDefenseBonuses.get(targetPlayerIndex);
        if (globalDefenseBonus == null) {
            return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_01 };
        }

        const { war, mapSize, globalOffenseBonuses }    = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const unitMap                                   = war.getUnitMap();
        const tileMap                                   = war.getTileMap();
        const damageMap                                 = Helpers.createEmptyMap<DamageMapData>(mapWidth);
        const targetTeamIndex                           = targetUnit.getTeamIndex();

        for (const attacker of unitMap.getAllUnits()) {
            await checkAndCallLater();

            const beginningGridIndex = attacker.getGridIndex();
            if (beginningGridIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_02 };
            }

            const attackerPlayerIndex = attacker.getPlayerIndex();
            if (attackerPlayerIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_03 };
            }

            const globalOffenseBonus = globalOffenseBonuses.get(attackerPlayerIndex);
            if (globalOffenseBonus == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_04 };
            }

            const promotionAttackBonus = attacker.getPromotionAttackBonus();
            if (promotionAttackBonus == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_05 };
            }

            const attackerFinalMoveRange = attacker.getFinalMoveRange();
            if (attackerFinalMoveRange == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_06 };
            }

            const minAttackRange    = attacker.getMinAttackRange();
            const maxAttackRange    = attacker.getFinalMaxAttackRange();
            const attackerTeamIndex = attacker.getTeamIndex();
            if ((minAttackRange == null)                                ||
                (maxAttackRange == null)                                ||
                (attackerTeamIndex === targetTeamIndex)                 ||
                ((isDiving) && (!attacker.checkCanAttackDivingUnits()))
            ) {
                continue;
            }

            const { errorCode: errorCodeForAttackInfo, attackInfo } = await getAttackInfo(commonParams, attacker, targetUnit);
            if (errorCodeForAttackInfo) {
                return { errorCode: errorCodeForAttackInfo };
            } else if (attackInfo == null) {
                return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_07 };
            }

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

                    const tile = tileMap.getTile({ x, y });
                    if (tile == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_08 };
                    }

                    const tileDefenseAmount = tile.getDefenseAmountForUnit(targetUnit);
                    if (tileDefenseAmount == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_CreateDamageMap_09 };
                    }

                    const damage = Math.floor(
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

        return {
            errorCode   : ClientErrorCode.NoError,
            damageMap,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getCandidateUnitsForPhase1(commonParams: CommonParams): Promise<BwUnit[]> {
        await checkAndCallLater();

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
    //     await checkAndCallLater();

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
        await checkAndCallLater();

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
        // await checkAndCallLater();

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

        await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    async function getScoreForThreat(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][] | null | undefined): Promise<ErrorCodeAndScore> {
        // const hp            = unit.getCurrentHp();
        // const data          = damageMap[gridIndex.x][gridIndex.y];
        // const maxDamage     = Math.min(data ? data.max : 0, hp);
        // // const totalDamage   = Math.min(data ? data.total : 0, hp);
        // return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
        //     * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
        //     * (unit.getHasLoadedCo() ? 2 : 1);

        await checkAndCallLater();

        const data = damageMap ? damageMap[gridIndex.x][gridIndex.y] : undefined;
        if (data) {
            const productionCost = unit.getProductionCfgCost();
            if (productionCost == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForThreat_00 };
            }

            return {
                errorCode   : ClientErrorCode.NoError,
                score       : - data.total * productionCost / 3000 / Math.max(1, commonParams.unitValueRatio) * (unit.getHasLoadedCo() ? 2 : 1) * 0.05,
            };
        } else {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : 0,
            };
        }
    }

    async function getScoreForDistanceToCapturableBuildings(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

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

                const tile = tileMap.getTile({ x, y });
                if (tile == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToCapturableBuildings_00 };
                }

                const tileType = tile.getType();
                if (tileType == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToCapturableBuildings_01 };
                }

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
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : 0,
            };
        } else {
            const productionCost = unit.getProductionCfgCost();
            if (productionCost == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToCapturableBuildings_02 };
            }

            const currentHp = unit.getCurrentHp();
            if (currentHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToCapturableBuildings_03 };
            }

            const maxHp = unit.getMaxHp();
            if (maxHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToCapturableBuildings_04 };
            }

            let score       = 0;
            let maxDistance = 0;
            for (const distanceInfo of distanceInfoArray) {
                const distance  = distanceInfo.distance;
                maxDistance     = Math.max(maxDistance, distance);
                score           += - Math.pow(distance, 2) * distanceInfo.scaler;
            }
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : score / tilesCount / (maxDistance || 1) * 2 * productionCost / maxHp * currentHp / 3000,
            };
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

    async function getScoreForDistanceToOtherUnits(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const productionCost = unit.getProductionCfgCost();
        if (productionCost == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToOtherUnits_00 };
        }

        const maxHp = unit.getMaxHp();
        if (maxHp == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToOtherUnits_01 };
        }

        const currentHp = unit.getCurrentHp();
        if (currentHp == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForDistanceToOtherUnits_02 };
        }

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

        return {
            errorCode   : ClientErrorCode.NoError,
            score       : (scoreForAllies + scoreForEnemies) * productionCost / maxHp * currentHp / 3000,
        };

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
    }): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const {
            errorCode   : errorCodeForScoreForThreat,
            score       : scoreForThreat
        } = await getScoreForThreat(commonParams, unit, gridIndex, damageMap);
        if (errorCodeForScoreForThreat) {
            return { errorCode: errorCodeForScoreForThreat };
        } else if (scoreForThreat == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_00 };
        }

        let totalScore = scoreForThreat;

        const { war, mapSize }  = commonParams;
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_01 };
        }

        if (tile.checkCanRepairUnit(unit)) {
            const normalizedMaxHp = unit.getNormalizedMaxHp();
            if (normalizedMaxHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_02 };
            }

            const normalizedCurrentHp = unit.getNormalizedCurrentHp();
            if (normalizedCurrentHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_03 };
            }

            totalScore += (normalizedMaxHp - normalizedCurrentHp) * 15;
        }

        if (tile.checkCanSupplyUnit(unit)) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo) {
                const primaryWeaponCurrentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                if (primaryWeaponCurrentAmmo == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_04 };
                }

                totalScore += (maxAmmo - primaryWeaponCurrentAmmo) / maxAmmo * 55;
            }

            const maxFuel = unit.getMaxFuel();
            if (maxFuel) {
                const currentFuel = unit.getCurrentFuel();
                if (currentFuel == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_05 };
                }

                totalScore += (maxFuel - currentFuel) / maxFuel * 50 * (unit.checkIsDestroyedOnOutOfFuel() ? 2 : 1);
            }

            const maxFlareAmmo = unit.getFlareMaxAmmo();
            if ((maxFlareAmmo) && (_IS_NEED_VISIBILITY) && (war.getFogMap().checkHasFogCurrently())) {
                const flareCurrentAmmo = unit.getFlareCurrentAmmo();
                if (flareCurrentAmmo == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_06 };
                }

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

        const moveType = unit.getMoveType();
        if (moveType == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_07 };
        }

        const movableArea = WarCommonHelpers.createMovableArea({
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

        const {
            errorCode   : errorCodeForScoreForDistanceToCapturableBuildings,
            score       : scoreForDistanceToCapturableBuildings,
        } = await getScoreForDistanceToCapturableBuildings(commonParams, unit, movableArea);
        if (errorCodeForScoreForDistanceToCapturableBuildings) {
            return { errorCode: errorCodeForScoreForDistanceToCapturableBuildings };
        } else if (scoreForDistanceToCapturableBuildings == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_08 };
        }
        totalScore += scoreForDistanceToCapturableBuildings;

        const {
            errorCode   : errorCodeForScoreForDistanceToOtherUnits,
            score       : scoreForDistanceToOtherUnits,
        } = await getScoreForDistanceToOtherUnits(commonParams, unit, movableArea);
        if (errorCodeForScoreForDistanceToOtherUnits) {
            return { errorCode: errorCodeForScoreForDistanceToOtherUnits };
        } else if (scoreForDistanceToOtherUnits == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForPosition_09 };
        }
        totalScore += scoreForDistanceToOtherUnits;

        return {
            errorCode   : ClientErrorCode.NoError,
            score       : totalScore,
        };
    }

    async function getScoreForMovePath(commonParams: CommonParams, movingUnit: BwUnit, movePath: MovePathNode[]): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        if (!_IS_NEED_VISIBILITY) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : 0,
            };
        } else {
            const {
                errorCode       : errorCodeForDiscoveredUnits,
                discoveredUnits,
            } = WarVisibilityHelpers.getDiscoveredUnitsByPath({
                war             : commonParams.war,
                path            : movePath,
                movingUnit,
                isUnitDestroyed : false,
                visibleUnits    : commonParams.visibleUnits,
            });
            if (errorCodeForDiscoveredUnits) {
                return { errorCode: errorCodeForDiscoveredUnits };
            } else if (discoveredUnits == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForMovePath_00 };
            }

            let scoreForMovePath = 0;
            for (const unit of discoveredUnits) {
                const productionCost = unit.getProductionCfgCost();
                if (productionCost == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForMovePath_01 };
                }

                const currentHp = unit.getCurrentHp();
                if (currentHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForMovePath_02 };
                }

                const maxHp = unit.getMaxHp();
                if (maxHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForMovePath_03 };
                }

                scoreForMovePath += 0.3 + productionCost * currentHp / maxHp / 3000 * (unit.getHasLoadedCo() ? 2 : 1) * 0.2;
            }

            return {
                errorCode   : ClientErrorCode.NoError,
                score       : scoreForMovePath,
            };
        }
    }

    async function getScoreForActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const { war }   = commonParams;
        const loader    = war.getUnitMap().getUnitOnMap(gridIndex);
        if (loader == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00 };
        }
        if (!loader.checkCanLoadUnit(unit)) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01 };
        }


        if (!loader.checkCanLaunchLoadedUnit()) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : -1000,
            };
        } else {
            if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
                const normalizedMaxHp = unit.getNormalizedMaxHp();
                if (normalizedMaxHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_02 };
                }

                const normalizedCurrentHp = unit.getNormalizedCurrentHp();
                if (normalizedCurrentHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_03 };
                }

                return {
                    errorCode   : ClientErrorCode.NoError,
                    score       : (normalizedMaxHp - normalizedCurrentHp) * 10,
                };
            } else {
                return {
                    errorCode   : ClientErrorCode.NoError,
                    score       : 0,
                };
            }
        }
    }

    async function getScoreForActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const { war }       = commonParams;
        const targetUnit    = war.getUnitMap().getUnitOnMap(gridIndex);
        if (targetUnit == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00 };
        }

        if (targetUnit.getActionState() === UnitActionState.Idle) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : -9999,
            };
        } else {
            const normalizedCurrentHp1 = unit.getNormalizedCurrentHp();
            if (normalizedCurrentHp1 == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_01 };
            }

            const normalizedCurrentHp2 = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp2 == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_02 };
            }

            const normalizedMaxHp = unit.getNormalizedMaxHp();
            if (normalizedMaxHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_03 };
            }

            const newHp = normalizedCurrentHp1 + normalizedCurrentHp2;
            if (!targetUnit.getIsCapturingTile()) {
                return {
                    errorCode   : ClientErrorCode.NoError,
                    score       : newHp > normalizedMaxHp
                        ? ((newHp - normalizedMaxHp) * (-50))
                        : ((normalizedMaxHp - newHp) * 5),
                };
            } else {
                const tile                  = war.getTileMap().getTile(gridIndex);
                const currentCapturePoint   = tile ? tile.getCurrentCapturePoint() : null;
                if (currentCapturePoint == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_04 };
                }

                const captureAmount = targetUnit.getCaptureAmount(gridIndex);
                if (captureAmount == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_05 };
                }

                if (captureAmount >= currentCapturePoint) {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        score       : (newHp > normalizedMaxHp)
                            ? ((newHp - normalizedMaxHp) * (-50))
                            : ((normalizedMaxHp - newHp) * 5)
                    };
                } else {
                    return {
                        errorCode   : ClientErrorCode.NoError,
                        score       : (Math.min(normalizedMaxHp, newHp) >= currentCapturePoint) ? 60 : 30,
                    };
                }
            }
        }
    }

    async function getScoreForActionUnitAttack({ commonParams, focusUnit, focusUnitGridIndex, battleDamageInfoArray }: {
        commonParams            : CommonParams;
        focusUnit               : BwUnit;
        focusUnitGridIndex      : GridIndex;
        battleDamageInfoArray   : ProtoTypes.Structure.IBattleDamageInfo[];
    }): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const focusTeamIndex = focusUnit.getTeamIndex();
        if (focusTeamIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_00 };
        }

        const { war, unitValueRatio }   = commonParams;
        const unitMap                   = war.getUnitMap();
        const tileMap                   = war.getTileMap();
        const unitHpDict                = new Map<BwUnit, number>();
        const tileHpDict                = new Map<BwTile, number>();

        let totalScore = 0;
        for (const battleDamageInfo of battleDamageInfoArray) {
            const damage = battleDamageInfo.damage;
            if (damage == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_01 };
            }

            const tileGridIndex = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
            if (tileGridIndex != null) {
                const tile2 = tileMap.getTile(tileGridIndex);
                if (tile2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_02 };
                }

                if (!tileHpDict.has(tile2)) {
                    const tileHp2 = tile2.getCurrentHp();
                    if (tileHp2 == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_03 };
                    }
                    tileHpDict.set(tile2, tileHp2);
                }

                const tileHp2 = tileHpDict.get(tile2);
                if (tileHp2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_04 };
                }

                const tileTeamIndex2 = tile2.getTeamIndex();
                if (tileTeamIndex2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_05 };
                }

                const actualDamage = Math.min(tileHp2, damage);
                tileHpDict.set(tile2, tileHp2 - actualDamage);

                totalScore += actualDamage * (tileTeamIndex2 === focusTeamIndex ? -1 : 1);
                continue;
            }

            const unitId2 = battleDamageInfo.targetUnitId;
            if (unitId2 != null) {
                const unit2 = unitMap.getUnitById(unitId2);
                if (unit2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_06 };
                }

                if (!unitHpDict.has(unit2)) {
                    const unitHp2 = unit2.getCurrentHp();
                    if (unitHp2 == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_07 };
                    }
                    unitHpDict.set(unit2, unitHp2);
                }

                const unitHp2 = unitHpDict.get(unit2);
                if (unitHp2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_08 };
                }

                const unitTeamIndex2 = unit2.getTeamIndex();
                if (unitTeamIndex2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_09 };
                }

                const unitId1 = battleDamageInfo.attackerUnitId;
                if (unitId1 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_10 };
                }

                const unit1 = unitMap.getUnitById(unitId1);
                if (unit1 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_11 };
                }

                const unitType1 = unit1.getUnitType();
                if (unitType1 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_12 };
                }

                const unitProductionCost2 = unit2.getProductionCfgCost();
                if (unitProductionCost2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_13 };
                }

                const unitType2 = unit2.getUnitType();
                if (unitType2 == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_14 };
                }

                const actualDamage = Math.min(unitHp2, damage);
                unitHpDict.set(unit2, unitHp2 - actualDamage);

                const isUnitDestroyed   = (actualDamage >= unitHp2) && (actualDamage > 0);
                const isSelfDamaged     = unitTeamIndex2 === focusTeamIndex;
                let score               = (actualDamage + (isUnitDestroyed ? 20 : 0))
                    * unitProductionCost2 / 3000
                    * (isSelfDamaged ? 1 / Math.max(1, unitValueRatio) : Math.max(1, unitValueRatio))
                    * (unit2.getHasLoadedCo() ? 2 : 1)
                    * (_DAMAGE_SCORE_SCALERS[unitType1][unitType2] || 1);

                if (unit2.getIsCapturingTile()) {
                    const unitOriginGridIndex2 = unit2.getGridIndex();
                    if (unitOriginGridIndex2 == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_15 };
                    }

                    const gridIndex2 = (unit2 === focusUnit) ? focusUnitGridIndex : unitOriginGridIndex2;
                    if (GridIndexHelpers.checkIsEqual(gridIndex2, unitOriginGridIndex2)) {
                        const captureAmount = unit2.getCaptureAmount(gridIndex2);
                        if (captureAmount == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_16 };
                        }

                        const tile2 = tileMap.getTile(gridIndex2);
                        if (tile2 == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_17 };
                        }

                        const capturePoint = tile2.getCurrentCapturePoint();
                        if (capturePoint == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_18 };
                        }

                        const tileType2 = tile2.getType();
                        if (tileType2 == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_19 };
                        }

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
                        const loadedUnitHp = loadedUnit.getCurrentHp();
                        if (loadedUnitHp == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_20 };
                        }

                        const loadedUnitProductionCost = loadedUnit.getProductionCfgCost();
                        if (loadedUnitProductionCost == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_21 };
                        }

                        score += (loadedUnitHp + 20)
                            * loadedUnitProductionCost / 3000
                            * (isSelfDamaged ? 1 / Math.max(1, unitValueRatio) : Math.max(1, unitValueRatio))
                            * (loadedUnit.getHasLoadedCo() ? 2 : 1);
                    }
                }

                totalScore += score * (isSelfDamaged ? -1 : 1);
                continue;
            }

            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_22 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            score       : totalScore,
        };
    }

    async function getScoreForActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const tile = commonParams.war.getTileMap().getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00 };
        }

        const currentCapturePoint = tile.getCurrentCapturePoint();
        if (currentCapturePoint == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_01 };
        }

        const captureAmount = unit.getCaptureAmount(gridIndex);
        if (captureAmount == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_02 };
        }

        if (captureAmount >= currentCapturePoint) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : 10000 ,
            };
        } else if (captureAmount < currentCapturePoint / 3) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : 1,
            };
        } else {
            const tileType = tile.getType();
            if (tileType == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_03 };
            }

            const value = _TILE_VALUE[tileType] || 0;
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : captureAmount >= currentCapturePoint / 2 ? value : value / 2,
            };
        }
    }

    async function getScoreForActionUnitDive(unit: BwUnit): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const fuel = unit.getCurrentFuel();
        if (fuel == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitDive_00 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            score       : fuel <= 35 ? -10 : 10,
        };
    }

    async function getScoreForActionUnitLaunchSilo(commonParams: CommonParams, unitValueMap: number[][], targetGridIndex: GridIndex): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        let score = 10000;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, CommonConstants.SiloRadius, commonParams.mapSize)) {
            score += unitValueMap[gridIndex.x][gridIndex.y] || 0;
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            score,
        };
    }

    async function getScoreForActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, targetGridIndex: GridIndex): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const flareRadius = unit.getFlareRadius();
        if (flareRadius == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00 };
        }

        const { war, mapSize, visibleUnits }    = commonParams;
        const unitMap                           = war.getUnitMap();
        let score                               = 0;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, mapSize)) {
            const u = unitMap.getUnitOnMap(gridIndex);
            if ((u) && (!u.getIsDiving()) && (!visibleUnits.has(u))) {
                const productionCost = u.getProductionCfgCost();
                if (productionCost == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_01 };
                }

                const currentHp = u.getCurrentHp();
                if (currentHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_02 };
                }

                const maxHp = u.getMaxHp();
                if (maxHp == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_03 };
                }

                score += 3 + productionCost * currentHp / maxHp / 3000 * (u.getHasLoadedCo() ? 2 : 1) * 2;
            }
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            score,
        };
    }

    async function getScoreForActionUnitSurface(unit: BwUnit): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const fuel = unit.getCurrentFuel();
        if (fuel == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionUnitSurface_00 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            score       : (fuel <= 35) ? 10 : -10,
        };
    }

    async function getScoreForActionUnitWait(): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        // const tile = war.getTileMap().getTile(gridIndex);
        // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
        //     return -20;
        // } else {
        //     return 0;
        // }
        return {
            errorCode   : ClientErrorCode.NoError,
            score       : -10,
        };
    }

    async function getScoreForActionPlayerProduceUnit(commonParams: CommonParams, gridIndex: GridIndex, unitType: UnitType, idleFactoriesCount: number): Promise<ErrorCodeAndScore> {
        await checkAndCallLater();

        const { war, playerIndexInTurn, unitValueRatio }    = commonParams;
        const tile                                          = war.getTileMap().getTile(gridIndex);
        const tileType                                      = tile ? tile.getType() : null;
        if (tileType == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_00 };
        }

        let score = _PRODUCTION_CANDIDATES[tileType][unitType];
        if (score == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_01 };
        }

        if ((_IS_NEED_VISIBILITY)                                           &&
            (war.getFogMap().checkHasFogCurrently())                        &&
            ((unitType === UnitType.Flare) || (unitType === UnitType.Recon))
        ) {
            score += 100;
        }

        const configVersion = war.getConfigVersion();
        if (configVersion == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_02 };
        }

        const player    = war.getPlayerManager().getPlayer(playerIndexInTurn);
        const fund      = player ? player.getFund() : null;
        if (fund == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_03 };
        }

        const targetUnit = new BwUnit();
        targetUnit.init({
            unitId      : 0,
            unitType,
            gridIndex,
            playerIndex : playerIndexInTurn,
        }, configVersion);
        targetUnit.startRunning(war);

        const productionCost = targetUnit.getProductionFinalCost();
        if (productionCost == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_04 };
        }

        const restFund = fund - productionCost;
        if (restFund < 0) {
            return {
                errorCode   : ClientErrorCode.NoError,
                score       : undefined,
            };
        }

        if (unitType !== UnitType.Infantry) {
            const unitCfg = ConfigManager.getUnitTemplateCfg(configVersion, UnitType.Infantry);
            if (unitCfg == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_05 };
            }

            const restFactoriesCount = tileType === TileType.Factory ? idleFactoriesCount - 1 : idleFactoriesCount;
            if (restFactoriesCount * unitCfg.productionCost > restFund) {
                score += -999999;
            }
        }

        const teamIndex = targetUnit.getTeamIndex();
        let canAttack   = false;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitCurrentHp = unit.getCurrentHp();
            if (unitCurrentHp == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_06 };
            }

            if (unit.getTeamIndex() === teamIndex) {
                if (unit.getUnitType() === unitType) {
                    score += - unitCurrentHp * productionCost / 3000 / 1.5;
                }
            } else {
                if (targetUnit.getMinAttackRange()) {
                    const unitArmorType = unit.getArmorType();
                    if (unitArmorType == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_07 };
                    }

                    const baseDamage = targetUnit.getBaseDamage(unitArmorType);
                    if (baseDamage != null) {

                        const unitProductionCost = unit.getProductionCfgCost();
                        if (unitProductionCost == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_08 };
                        }

                        const damage    = Math.min(baseDamage, unitCurrentHp);
                        canAttack       = true;
                        score           += damage * unitProductionCost / 3000 * Math.max(1, unitValueRatio);
                    }
                }
                if (unit.getMinAttackRange()) {
                    const targetUnitArmorType = targetUnit.getArmorType();
                    if (targetUnitArmorType == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_09 };
                    }

                    const baseDamage = unit.getBaseDamage(targetUnitArmorType);
                    if (baseDamage != null) {
                        const unitNormalizedMaxHp = unit.getNormalizedMaxHp();
                        if (unitNormalizedMaxHp == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_10 };
                        }

                        const targetUnitCurrentHp = targetUnit.getCurrentHp();
                        if (targetUnitCurrentHp == null) {
                            return { errorCode: ClientErrorCode.SpwRobot_GetScoreForActionPlayerProduceUnit_11 };
                        }

                        const damage    = Math.min(baseDamage * WarCommonHelpers.getNormalizedHp(unitCurrentHp) / unitNormalizedMaxHp, targetUnitCurrentHp);
                        score           += - damage * productionCost / 3000 / Math.max(1, unitValueRatio);
                    }
                }
            }
        }

        if (!canAttack) {
            score += -999999;
        }
        return {
            errorCode   : ClientErrorCode.NoError,
            score,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getScoreAndActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitBeLoaded_00 };
        }

        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const loader = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const { errorCode, score } = await getScoreForActionUnitBeLoaded(commonParams, unit, gridIndex);
        if (errorCode) {
            return { errorCode };
        } else if (score == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitBeLoaded_01 };
        }

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : {
                score,
                action  : { WarActionUnitBeLoaded: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            },
        };
    }

    async function getScoreAndActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitJoin_00 };
        }

        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const existingUnit = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const { errorCode, score } = await getScoreForActionUnitJoin(commonParams, unit, gridIndex);
        if (errorCode) {
            return { errorCode };
        } else if (score == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitJoin_01 };
        }

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : {
                score,
                action  : { WarActionUnitJoinUnit: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            },
        };
    }

    async function getScoreAndActionUnitAttack(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitAttack_00 };
        }

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getFinalMaxAttackRange();
        if ((minRange == null)                                                                              ||
            (maxRange == null)                                                                              ||
            ((!unit.checkCanAttackAfterMove()) && (!GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)))
        ) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const { war, visibleUnits, mapSize }    = commonParams;
        const launchUnitId                      = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
        const unitMap                           = war.getUnitMap();
        let bestScoreAndAction                  : ScoreAndAction | null | undefined = null;
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, minRange, maxRange, mapSize)) {
            const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
            if ((_IS_NEED_VISIBILITY) && (targetUnit != null) && (!visibleUnits.has(targetUnit))) {
                continue;
            }

            const { errorCode: errorCodeForDamage, battleDamageInfoArray } = WarDamageCalculator.getEstimatedBattleDamage({ war, attackerMovePath: pathNodes, launchUnitId, targetGridIndex });
            if (errorCodeForDamage) {
                continue;
            } else if (battleDamageInfoArray == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitAttack_01 };
            }

            const { errorCode, score } = await getScoreForActionUnitAttack({
                commonParams,
                focusUnit           : unit,
                focusUnitGridIndex  : gridIndex,
                battleDamageInfoArray,
            });
            if (errorCode) {
                return { errorCode };
            } else if (score == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitAttack_02 };
            }

            bestScoreAndAction = getBetterScoreAndAction(
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

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : bestScoreAndAction || undefined,
        };
    }

    async function getScoreAndActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const tile = commonParams.war.getTileMap().getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_00 };
        }

        if (!unit.checkCanCaptureTile(tile)) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        } else {
            const { errorCode, score } = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
            if (errorCode) {
                return { errorCode };
            } else if (score == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01 };
            }

            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : {
                    score,
                    action  : { WarActionUnitCaptureTile: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    } },
                },
            };
        }
    }

    async function getScoreAndActionUnitDive(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        if (!unit.checkCanDive()) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        } else {
            const { errorCode, score } = await getScoreForActionUnitDive(unit);
            if (errorCode) {
                return { errorCode };
            } else if (score == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitDive_00 };
            }

            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : {
                    score,
                    action  : { WarActionUnitDive: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    } },
                },
            };
        }
    }

    async function getScoreAndActionUnitLaunchSilo(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const { war }   = commonParams;
        const tile      = war.getTileMap().getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_00 };
        }

        if (!unit.checkCanLaunchSiloOnTile(tile)) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
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
                    const targetUnitCurrentHp = targetUnit.getCurrentHp();
                    if (targetUnitCurrentHp == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_01 };
                    }

                    const targetUnitProductionCost = targetUnit.getProductionCfgCost();
                    if (targetUnitProductionCost == null) {
                        return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_02 };
                    }

                    const value         = Math.min(30, targetUnitCurrentHp - 1) * targetUnitProductionCost / 10;
                    unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;
                }
            }
        }

        const unitCurrentHp = unit.getCurrentHp();
        if (unitCurrentHp == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_03 };
        }

        const unitProductionCost = unit.getProductionCfgCost();
        if (unitProductionCost == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_04 };
        }
        unitValueMap[gridIndex.x][gridIndex.y] = -Math.min(30, unitCurrentHp - 1) * unitProductionCost / 10;

        let scoreAndGridIndex: { score: number, gridIndex: GridIndex } | null = null;
        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const newTargetGridIndex                : GridIndex = { x, y };
                const { errorCode, score: newMaxScore } = await getScoreForActionUnitLaunchSilo(commonParams, unitValueMap, newTargetGridIndex);
                if (errorCode) {
                    return { errorCode };
                } else if (newMaxScore == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_05 };
                }

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

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : scoreAndGridIndex
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
                : undefined,
        };
    }

    async function getScoreAndActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const { war, mapSize } = commonParams;
        if ((!_IS_NEED_VISIBILITY)                      ||
            (!war.getFogMap().checkHasFogCurrently())   ||
            (!unit.getFlareCurrentAmmo())               ||
            (pathNodes.length !== 1)
        ) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        } else {
            const flareMaxRange = unit.getFlareMaxRange();
            if (flareMaxRange == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00 };
            }

            let bestScoreAndAction: ScoreAndAction | null | undefined = null;
            for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, 0, flareMaxRange, mapSize)) {
                const { errorCode, score } = await getScoreForActionUnitLaunchFlare(commonParams, unit, targetGridIndex);
                if (errorCode) {
                    return { errorCode };
                } else if (score == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_01 };
                }

                bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, {
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
                });
            }

            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : bestScoreAndAction || undefined,
            };
        }
    }

    async function getScoreAndActionUnitSurface(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        if (!unit.checkCanSurface()) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        } else {
            const { errorCode, score } = await getScoreForActionUnitSurface(unit);
            if (errorCode) {
                return { errorCode };
            } else if (score == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitSurface_00 };
            }

            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : {
                    score,
                    action  : { WarActionUnitSurface: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    } },
                },
            };
        }
    }

    async function getScoreAndActionUnitWait(unit: BwUnit, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const { errorCode, score } = await getScoreForActionUnitWait();
        if (errorCode) {
            return { errorCode };
        } else if (score == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetScoreAndActionUnitWait_00 };
        }

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : {
                score,
                action  : { WarActionUnitWait: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            },
        };
    }

    async function getBestScoreAndActionForUnitAndPath(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const {
            errorCode       : errorCodeForUnitBeLoaded,
            scoreAndAction  : scoreAndActionForUnitBeLoaded,
        } = await getScoreAndActionUnitBeLoaded(commonParams, unit, gridIndex, pathNodes);
        if (errorCodeForUnitBeLoaded) {
            return { errorCode: errorCodeForUnitBeLoaded };
        } else if (scoreAndActionForUnitBeLoaded) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : scoreAndActionForUnitBeLoaded,
            };
        }

        const {
            errorCode       : errorCodeForUnitJoin,
            scoreAndAction  : scoreAndActionForUnitJoin,
        } = await getScoreAndActionUnitJoin(commonParams, unit, gridIndex, pathNodes);
        if (errorCodeForUnitJoin) {
            return { errorCode: errorCodeForUnitJoin };
        } else if (scoreAndActionForUnitJoin) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : scoreAndActionForUnitJoin,
            };
        }

        const { errorCode: errorCodeForCheckCanUnitWaitOnGrid, canWait } = await checkCanUnitWaitOnGrid(commonParams, unit, gridIndex);
        if (errorCodeForCheckCanUnitWaitOnGrid) {
            return { errorCode: errorCodeForCheckCanUnitWaitOnGrid };
        } else if (canWait == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForUnitAndPath_00 };
        }
        if (!canWait) {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        }

        const resultArray = await Promise.all([
            getScoreAndActionUnitAttack(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitCaptureTile(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitDive(unit, gridIndex, pathNodes),
            getScoreAndActionUnitLaunchSilo(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitLaunchFlare(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitSurface(unit, gridIndex, pathNodes),
            getScoreAndActionUnitWait(unit, pathNodes),
        ]);

        let bestScoreAndAction: ScoreAndAction | null | undefined = null;
        for (const data of resultArray) {
            const { errorCode, scoreAndAction } = data;
            if (errorCode) {
                return { errorCode };
            } else if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, scoreAndAction);
        }

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : bestScoreAndAction || undefined,
        };
    }

    async function getBestScoreAndActionForCandidateUnit(commonParams: CommonParams, candidateUnit: BwUnit): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const {
            errorCode   : errorCodeForReachableArea,
            reachableArea,
        } = await getReachableArea({ commonParams, unit: candidateUnit, passableGridIndex: null, blockedGridIndex: null });
        if (errorCodeForReachableArea) {
            return { errorCode: errorCodeForReachableArea };
        } else if (reachableArea == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_00 };
        }

        const {
            errorCode: errorCodeForDamageMapForSurface,
            damageMap: damageMapForSurface,
        } = await createDamageMap(commonParams, candidateUnit, false);
        if (errorCodeForDamageMapForSurface) {
            return { errorCode: errorCodeForDamageMapForSurface };
        } else if (damageMapForSurface == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_01 };
        }

        const resultForDamageMapForDive     = candidateUnit.checkIsDiver() ? await createDamageMap(commonParams, candidateUnit, true) : null;
        const errorCodeForDamageMapForDive  = resultForDamageMapForDive ? resultForDamageMapForDive.errorCode : null;
        const damageMapForDive              = resultForDamageMapForDive ? resultForDamageMapForDive.damageMap : null;
        if (errorCodeForDamageMapForDive) {
            return { errorCode: errorCodeForDamageMapForDive };
        } else if ((errorCodeForDamageMapForDive != null) && (damageMapForDive == null)) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_02 };
        }

        const originGridIndex = candidateUnit.getGridIndex();
        if (originGridIndex == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_03 };
        }

        // const scoreMapForDistance   = await _createScoreMapForDistance(candidateUnit);
        const { width: mapWidth, height: mapHeight }    = commonParams.mapSize;
        let bestScoreAndAction                          : ScoreAndAction | null | undefined = null;
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

                const pathNodes = WarCommonHelpers.createShortestMovePath(reachableArea, gridIndex);
                const {
                    errorCode       : errorCodeForScoreAndAction,
                    scoreAndAction,
                } = await getBestScoreAndActionForUnitAndPath(commonParams, candidateUnit, gridIndex, pathNodes);
                if (errorCodeForScoreAndAction) {
                    return { errorCode: errorCodeForScoreAndAction };
                } else if (scoreAndAction == null) {
                    continue;
                }

                const score = scoreAndAction.score;
                if (score == null) {
                    continue;
                }

                const {
                    errorCode   : errorCodeForScoreForMovePath,
                    score       : scoreForMovePath,
                } = await getScoreForMovePath(commonParams, candidateUnit, pathNodes);
                if (errorCodeForScoreForMovePath) {
                    return { errorCode: errorCodeForScoreForMovePath };
                } else if (scoreForMovePath == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_04 };
                }

                const action    = scoreAndAction.action;
                const {
                    errorCode   : errorCodeForScoreForPosition,
                    score       : scoreForPosition,
                } = await getScoreForPosition({
                    commonParams,
                    unit        : candidateUnit,
                    gridIndex,
                    damageMap   : ((action.WarActionUnitDive) || ((candidateUnit.getIsDiving()) && (!action.WarActionUnitSurface))) ? damageMapForDive : damageMapForSurface,
                });
                if (errorCodeForScoreForPosition) {
                    return { errorCode: errorCodeForScoreForPosition };
                } else if (scoreForPosition == null) {
                    return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionForCandidateUnit_05 };
                }

                bestScoreAndAction  = getBetterScoreAndAction(
                    bestScoreAndAction,
                    {
                        action,
                        score   : score + scoreForMovePath + scoreForPosition,
                    },
                );
            }
        }

        return {
            errorCode       : ClientErrorCode.NoError,
            scoreAndAction  : bestScoreAndAction || undefined,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for production.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getBestScoreAndActionPlayerProduceUnitWithGridIndex(commonParams: CommonParams, gridIndex: GridIndex, idleFactoriesCount: number): Promise<ErrorCodeAndScoreAndAction> {
        await checkAndCallLater();

        const tile      = commonParams.war.getTileMap().getTile(gridIndex);
        const tileType  = tile ? tile.getType() : null;
        if (tileType == null) {
            return { errorCode: ClientErrorCode.SpwRobot_GetBestScoreAndActionPlayerProduceUnitWithGridIndex_00 };
        }

        let bestScoreAndUnitType: { score: number, unitType: UnitType } | null = null;
        for (const t in _PRODUCTION_CANDIDATES[tileType]) {
            const unitType              = Number(t) as UnitType;
            const { errorCode, score }  = await getScoreForActionPlayerProduceUnit(commonParams, gridIndex, unitType, idleFactoriesCount);
            if (errorCode) {
                return { errorCode };
            } else if (score == null) {
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
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : undefined,
            };
        } else {
            return {
                errorCode       : ClientErrorCode.NoError,
                scoreAndAction  : {
                    score   : bestScoreAndUnitType.score,
                    action  : { WarActionPlayerProduceUnit: {
                        unitType    : bestScoreAndUnitType.unitType,
                        unitHp      : CommonConstants.UnitMaxHp,
                        gridIndex,
                    } },
                },
            };
        }
    }

    async function getBestActionPlayerProduceUnit(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        const { war, playerIndexInTurn } = commonParams;
        if (playerIndexInTurn === CommonConstants.WarNeutralPlayerIndex) {
            return {
                errorCode   : ClientErrorCode.NoError,
                action      : undefined,
            };
        }

        const idleBuildingPosList   : GridIndex[] = [];
        const unitMap               = war.getUnitMap();
        let idleFactoriesCount      = 0;

        for (const tile of war.getTileMap().getAllTiles()) {
            const gridIndex = tile.getGridIndex();
            if (gridIndex == null) {
                return { errorCode: ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_00 };
            }

            if ((!unitMap.getUnitOnMap(gridIndex))                  &&
                (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))
            ) {
                idleBuildingPosList.push(gridIndex);
                if (tile.getType() === TileType.Factory) {
                    ++idleFactoriesCount;
                }
            }
        }

        let bestScoreAndAction: ScoreAndAction | null | undefined = null;
        for (const gridIndex of idleBuildingPosList) {
            const {
                errorCode,
                scoreAndAction,
            } = await getBestScoreAndActionPlayerProduceUnitWithGridIndex(commonParams, gridIndex, idleFactoriesCount);
            if (errorCode) {
                return { errorCode };
            } else if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, scoreAndAction);
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : bestScoreAndAction ? bestScoreAndAction.action : undefined,
        };
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
    async function getActionForPhase1(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        let bestScoreAndAction: ScoreAndAction | null | undefined = null;
        for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
            const {
                errorCode,
                scoreAndAction,
            } = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (errorCode) {
                return { errorCode };
            } else if (scoreAndAction == null) {
                continue;
            }

            const action = scoreAndAction.action;
            if ((action.WarActionUnitAttackUnit) || (action.WarActionUnitAttackTile)) {
                bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, scoreAndAction);
            }
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : bestScoreAndAction ? bestScoreAndAction.action : undefined,
        };
    }

    // Phase 2: move the infantries, mech and bikes that are capturing buildings.
    async function getActionForPhase2(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        let bestScoreAndAction: ScoreAndAction | null | undefined = null;
        for (const unit of await getCandidateUnitsForPhase2(commonParams)) {
            const {
                errorCode,
                scoreAndAction,
            } = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (errorCode) {
                return { errorCode };
            } else if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, scoreAndAction);
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : bestScoreAndAction ? bestScoreAndAction.action : undefined,
        };
    }

    //  Phase 3: move the other infantries, mech and bikes.
    async function getActionForPhase3(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        let bestScoreAndAction: ScoreAndAction | null | undefined = null;
        for (const unit of await getCandidateUnitsForPhase3(commonParams)) {
            const {
                errorCode,
                scoreAndAction,
            } = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (errorCode) {
                return { errorCode };
            } else if (scoreAndAction == null) {
                continue;
            }

            bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, scoreAndAction);
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : bestScoreAndAction ? bestScoreAndAction.action : undefined,
        };
    }

    // Phase 4: move the air combat units.
    // async function _getActionForPhase4(): Promise<WarAction | null> {
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    //     await checkAndCallLater();

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
    async function getActionForPhase8(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        const {
            errorCode,
            action,
        } = await getBestActionPlayerProduceUnit(commonParams);
        if (errorCode) {
            return { errorCode };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action,
        };
    }

    // Phase 9: vote for draw.
    async function getActionForPhase9(commonParams: CommonParams): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        if (commonParams.war.getDrawVoteManager().getRemainingVotes() == null) {
            return {
                errorCode   : ClientErrorCode.NoError,
                action      : undefined,
            };
        } else {
            return {
                errorCode   : ClientErrorCode.NoError,
                action      : {
                    WarActionPlayerVoteForDraw: {
                        isAgree : false,
                    },
                },
            };
        }
    }

    // Phase 10: end turn.
    async function getActionForPhase10(): Promise<ErrorCodeAndAction> {
        await checkAndCallLater();

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerEndTurn: {},
            },
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
    async function doGetNextAction(war: BwWar): Promise<ErrorCodeAndAction> {
        const { errorCode: errorCodeForCommonParams, commonParams } = await getCommonParams(war);
        if (errorCodeForCommonParams) {
            return { errorCode: errorCodeForCommonParams };
        } else if (commonParams == null) {
            return { errorCode: ClientErrorCode.SpwRobot_DoGetNextAction_00 };
        }

        if (war.getPlayerIndexInTurn() === CommonConstants.WarNeutralPlayerIndex) {
            return { errorCode: ClientErrorCode.SpwRobot_DoGetNextAction_01 };
        }

        for (const func of funcArray) {
            const { errorCode: errorCodeForPhase, action: actionForPhase } = await func(commonParams);
            if (errorCodeForPhase) {
                return { errorCode: errorCodeForPhase };
            } else if (actionForPhase) {
                return {
                    errorCode   : ClientErrorCode.NoError,
                    action      : actionForPhase,
                };
            }
        }

        return {
            errorCode   : ClientErrorCode.SpwRobot_DoGetNextAction_02,
            action      : undefined,
        };
    }

    export async function getNextAction(war: BwWar): Promise< { errorCode: ClientErrorCode, action?: IWarActionContainer}> {
        if (_calculatingWars.has(war)) {
            return { errorCode: ClientErrorCode.SpwRobot_GetNextAction_00 };
        }

        _calculatingWars.add(war);
        const { errorCode, action } = await doGetNextAction(war);
        if (action) {
            action.actionId = war.getExecutedActionManager().getExecutedActionsCount();
        }
        _calculatingWars.delete(war);

        return {
            errorCode,
            action,
        };
    }
}

export default WarRobot;
