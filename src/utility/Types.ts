
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
            defenseAmount      : number;
            defenseUnitCategory: UnitCategory;

            moveCosts: { [moveType: number]: number | undefined };

            maxBuildPoint?: number;

            hideUnitCategory?: UnitCategory;

            visionRange          ?: number;
            isVisionEnabledForAll?: boolean;

            maxHp           ?: number;
            armorType       ?: ArmorType;
            isAffectedByLuck?: boolean;

            maxCapturePoint  ?: number;
            isDefeatOnCapture?: boolean;

            repairAmount      ?: number;
            repairUnitCategory?: UnitCategory;

            incomePerTurn?: number;

            produceUnitCategory?: UnitCategory;

            globalAttackBonus ?: number;
            globalDefenseBonus?: number;
        }

        export type InstantialTile = {
            currentHp: number;

            currentBuildPoint: number;

            currentCapturePoint: number;

            gridIndex: number;
        }

        export type TemplateUnit = {
            minAttackRange        : number;
            maxAttackRange        : number;
            canAttackAfterMove    : boolean;
            canAttackDivingUnits  : boolean;
            primaryWeaponMaxAmmo  : number;
            primaryWeaponDamages  : { [armorType: number]: number | undefined };
            secondaryWeaponDamages: { [armorType: number]: number | undefined };

            maxHp           : number;
            armorType       : ArmorType;
            isAffectedByLuck: boolean;

            moveType : MoveType;
            moveRange: number;

            maxFuel               : number;
            fuelConsumptionPerTurn: number;
            isDestroyedOnOutOfFuel: boolean;

            canLaunchSilo: boolean;

            productionCost: number;

            visionRange       : number;
            visionBonusOnTiles: { [tileType: number]: number };

            flareMaxAmmo : number;
            flareMaxRange: number;
            flareRadius  : number;

            canSupplyAdjacentUnits: boolean;

            buildTiles      : { [tileType: number]: TileType };
            maxBuildMaterial: number;

            maxLoadUnitsCount         : number;
            loadUnitCategory          : UnitCategory;
            loadableTileCategory      : TileCategory;
            canLaunchLoadedUnits      : boolean;
            canDropLoadedUnits        : boolean;
            canSupplyLoadedUnits      : boolean;
            repairAmountForLoadedUnits: number;

            produceUnitType   : UnitType;
            maxProduceMaterial: number;

            fuelConsumptionInDiving: number;
        }

        export type InstantialUnit = {
            primaryWeaponCurrentAmmo: number;

            currentHp: number;

            isCapturingTile: boolean;

            isDiving: boolean;

            flareCurrentAmmo: number;

            currentFuel: number;

            gridIndex: number;

            currentBuildMaterial: number;

            currentProduceMaterial: number;

            currentPromotion: number;

            isBuildingTile: number;

            loadedUnitIds: number[];
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

        export const enum TileBaseType {
            Plain,        /* 0 */       River,         /* 1 */      Sea,           /* 2 */      Beach,        /* 3 */
        }

        export const enum TileObjectType {
            Road,         /* 0 */       Bridge,        /* 1 */      Wood,          /* 2 */      Mountain,     /* 3 */
            Wasteland,    /* 4 */       Ruins,         /* 5 */      Fire,          /* 6 */      Rough,        /* 7 */
            Mist,         /* 8 */       Reef,          /* 9 */      Plasma,        /* 10 */     Meteor,       /* 11 */
            Silo,         /* 12 */      EmptySilo,     /* 13 */     Headquarters,  /* 14 */     City,         /* 15 */
            CommandTower, /* 16 */      Radar,         /* 17 */     Factory,       /* 18 */     Airport,      /* 19 */
            Seaport,      /* 20 */      TempAirport,   /* 21 */     TempSeaport,   /* 22 */     GreenPlasma,  /* 23 */
        }

        export const enum TileType {
            Plain,         /* 0 */      River,         /* 1 */      Sea,           /* 2 */      Beach,         /* 3 */
            Road,          /* 4 */      BridgeOnPlain, /* 5 */      BridgeOnRiver, /* 6 */      BridgeOnBeach, /* 7 */
            BridgeOnSea,   /* 8 */      Wood,          /* 9 */      Mountain,      /* 10 */     Wasteland,     /* 11 */
            Ruins,         /* 12 */     Fire,          /* 13 */     Rough,         /* 14 */     Mist,          /* 15 */
            Reef,          /* 16 */     Plasma,        /* 17 */     Meteor,        /* 18 */     Silo,          /* 19 */
            EmptySilo,     /* 20 */     Headquarters,  /* 21 */     City,          /* 22 */     CommandTower,  /* 23 */
            Radar,         /* 24 */     Factory,       /* 25 */     Airport,       /* 26 */     Seaport,       /* 27 */
            TempAirport,   /* 28 */     TempSeaport,   /* 29 */     GreenPlasma,   /* 30 */
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

        export const enum TileCategory {
            None,              /* 0 */            All,               /* 1 */            LoadableForSeaTransports, /* 2 */
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
