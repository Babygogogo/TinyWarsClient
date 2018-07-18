
namespace Utility {
    export namespace Types {
        ////////////////////////////////////////////////////////////////////////////////
        // Types.
        ////////////////////////////////////////////////////////////////////////////////
        type ActionData = {
            [key: string]: ActionData | number | string;
        };

        export type Action = {
            actionCode   : number;
            [key: string]: ActionData | number | string;
        }

        export type TemplateTile = {
            defenseAmount        : number;
            defenseTargetCategory: UnitCategory;

            moveCosts: {[moveType: number]: number};

            maxBuildPoint    : number;

            hideTargetCategory: UnitCategory;

            visionRange          : number;
            isVisionEnabledForAll: boolean;

            maxHp           : number;
            armorType       : ArmorType;
            isAffectedByLuck: boolean;

            maxCapturePoint  : number;
            isDefeatOnCapture: boolean;

            repairAmount        : number;
            repairTargetCategory: UnitCategory;

            income: number;

            produceTargetCategory: UnitCategory;

            globalAttackBonus : number;
            globalDefenseBonus: number;
        }

        export type InstantialTile = {
            currentHp: number;

            currentBuildPoint: number;

            currentCapturePoint: number;

            gridX: number;
            gridY: number;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Enums.
        ////////////////////////////////////////////////////////////////////////////////
        export const enum LayerType {
            Top,
            Notify,
            Hud,
            Scene,
            Bottom,
        }

        export const enum ColorType {
            Origin,
            Gray,
            Red,
            Green,
            Blue,
            White,
        }

        export const enum LogoutType {
            SelfRequest,
            LoginCollision,
        }

        export const enum MoveType {
            Infantry,  /* 0 */            Mech,      /* 1 */            TireA,     /* 2 */            TireB,     /* 3 */
            Tank,      /* 4 */            Air,       /* 5 */            Ship,      /* 6 */            Transport, /* 7 */
        }

        export const enum TileType {
            Plain,        /* 0 */            River,        /* 1 */            Sea,          /* 2 */            Beach,        /* 3 */
            Road,         /* 4 */            Bridge,       /* 5 */            Wood,         /* 6 */            Mountain,     /* 7 */
            Wasteland,    /* 8 */            Ruins,        /* 9 */            Fire,         /* 10 */           Rough,        /* 11 */
            Mist,         /* 12 */           Reef,         /* 13 */           Plasma,       /* 14 */           Meteor,       /* 15 */
            Silo,         /* 16 */           EmptySilo,    /* 17 */           Headquarters, /* 18 */           City,         /* 19 */
            CommandTower, /* 20 */           Radar,        /* 21 */           Factory,      /* 22 */           Airport,      /* 23 */
            Seaport,      /* 24 */           TempAirport,  /* 25 */           TempSeaport,  /* 26 */           GreenPlasma,  /* 27 */
        }

        export const enum UnitType {
            Infantry,        /* 0 */            Mech,            /* 1 */            Bike,            /* 2 */            Recon,           /* 3 */
            Flare,           /* 4 */            AntiAir,         /* 5 */            Tank,            /* 6 */            MediumTank,      /* 7 */
            WarTank,         /* 8 */            Artillery,       /* 9 */            AntiTank,        /* 10 */           Rockets,         /* 11 */
            Missiles,        /* 12 */           Rig,             /* 13 */           Fighter,         /* 14 */           Bomber,          /* 15 */
            Duster,          /* 16 */           BattleCopter,    /* 17 */           TransportCopter, /* 18 */           Seaplane,        /* 19 */
            Battleship,      /* 20 */           Carrier,         /* 21 */           Submarine,       /* 22 */           Cruiser,         /* 23 */
            Lander,          /* 24 */           Gunboat,         /* 25 */
        }

        export const enum UnitCategory {
            None,          /* 0 */            All,           /* 1 */            Ground,        /* 2 */            Naval,         /* 3 */
            Air,           /* 4 */            GroundOrNaval, /* 5 */            GroundOrAir,   /* 6 */            Direct,        /* 7 */
            Indirect,      /* 8 */            Foot,          /* 9 */            Infantry,      /* 10 */           Vehicle,       /* 11 */
            DirectMachine, /* 12 */           Transport,     /* 13 */           LargeNavel,    /* 14 */           Copter,        /* 15 */
            Tank,          /* 16 */           CommonAir,     /* 17 */
        }

        export const enum ArmorType {
            Infantry,        /* 0 */            Mech,            /* 1 */            Bike,            /* 2 */            Recon,           /* 3 */
            Flare,           /* 4 */            AntiAir,         /* 5 */            Tank,            /* 6 */            MediumTank,      /* 7 */
            WarTank,         /* 8 */            Artillery,       /* 9 */            AntiTank,        /* 10 */           Rockets,         /* 11 */
            Missiles,        /* 12 */           Rig,             /* 13 */           Fighter,         /* 14 */           Bomber,          /* 15 */
            Duster,          /* 16 */           BattleCopter,    /* 17 */           TransportCopter, /* 18 */           Seaplane,        /* 19 */
            Battleship,      /* 20 */           Carrier,         /* 21 */           Submarine,       /* 22 */           Cruiser,         /* 23 */
            Lander,          /* 24 */           Gunboat,         /* 25 */           Meteor,          /* 26 */
        }
    }
}
