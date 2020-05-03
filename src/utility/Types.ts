
namespace TinyWars.Utility.Types {
    import Codes = Network.Codes;

    ////////////////////////////////////////////////////////////////////////////////
    // Config types.
    ////////////////////////////////////////////////////////////////////////////////
    export interface FullConfig extends ProtoTypes.IFullConfig {
        TileCategory    : TileCategoryCfg[];
        UnitCategory    : UnitCategoryCfg[];
        TileTemplate    : TileTemplateCfg[];
        UnitTemplate    : UnitTemplateCfg[];
        DamageChart     : DamageChartCfg[];
        MoveCost        : MoveCostCfg[];
        UnitPromotion   : UnitPromotionCfg[];
        VisionBonus     : VisionBonusCfg[];
        BuildableTile   : BuildableTileCfg[];
        PlayerRank      : PlayerRankCfg[];
        CoBasic         : CoBasicCfg[];
        CoSkill         : CoSkillCfg[];
    }
    export interface TileCategoryCfg extends ProtoTypes.ITileCategoryCfg {
        category: TileCategory;
    }
    export interface UnitCategoryCfg extends ProtoTypes.IUnitCategoryCfg {
        category: UnitCategory;
    }
    export interface TileTemplateCfg extends ProtoTypes.ITileTemplateCfg {
        type                : TileType;
        defenseAmount       : number;
        defenseUnitCategory : UnitCategory;
        hideUnitCategory?   : UnitCategory;
    }
    export interface UnitTemplateCfg extends ProtoTypes.IUnitTemplateCfg {
        type                    : UnitType;
        maxHp                   : number;
        armorType               : ArmorType;
        isAffectedByLuck        : number;
        moveRange               : number;
        moveType                : MoveType;
        maxFuel                 : number;
        fuelConsumptionPerTurn  : number;
        productionCost          : number;
        visionRange             : number;
    }
    export interface DamageChartCfg extends ProtoTypes.IDamageChartCfg {
        attackerType: UnitType;
        armorType   : ArmorType;
        weaponType  : WeaponType;
    }
    export interface MoveCostCfg extends ProtoTypes.IMoveCostCfg {
        tileType    : TileType;
        moveType    : MoveType;
    }
    export interface UnitPromotionCfg extends ProtoTypes.IUnitPromotionCfg {
        promotion   : number;
        attackBonus : number;
        defenseBonus: number;
    }
    export interface VisionBonusCfg extends ProtoTypes.IVisionBonusCfg {
        unitType    : UnitType;
        tileType    : TileType;
        visionBonus : number;
    }
    export interface BuildableTileCfg extends ProtoTypes.IBuildableTileCfg {
        unitType    : UnitType;
        srcTileType : TileType;
        dstTileType : TileType;
    }
    export interface PlayerRankCfg extends ProtoTypes.IPlayerRankCfg {
        minScore: number;
        rank    : number;
    }
    export interface CoBasicCfg extends ProtoTypes.ICoBasicCfg {
        coId                : number;
        name                : string;
        zoneRadius          : number;
        boardCostPercentage : number;
    }
    export interface CoSkillCfg extends ProtoTypes.ICoSkillCfg {
        skillId     : number;
        name        : string;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Serialization data types.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export interface WarActionContainer extends ProtoTypes.IWarActionContainer {
    }
    export interface SerializedTile extends ProtoTypes.ISerializedWarTile {
        gridX           : number;
        gridY           : number;
        baseViewId      : number;
        objectViewId    : number;
    };
    export interface SerializedUnit extends ProtoTypes.ISerializedWarUnit {
        gridX   : number;
        gridY   : number;
        unitId  : number;
        viewId  : number;
    }
    export interface SerializedTileMap extends ProtoTypes.ISerializedWarTileMap {
        tiles?: SerializedTile[];
    }
    export interface SerializedUnitMap extends ProtoTypes.ISerializedWarUnitMap {
        units?      : SerializedUnit[];
        nextUnitId  : number;
    }
    export interface SerializedPlayer extends ProtoTypes.ISerializedWarPlayer {
        fund            : number;
        hasVotedForDraw : boolean;
        isAlive         : boolean;
        playerIndex     : number;
        teamIndex       : number;
        userId?         : number;
        coCurrentEnergy : number;
        coUsingSkillType: CoSkillType;
    }
    export interface SerializedFogMap extends ProtoTypes.ISerializedWarFogMap {
        mapsForPath?: SerializedBwFogMapForPath[];
    }
    export interface SerializedBwFogMapForPath extends ProtoTypes.ISerializedWarFogMapForPath {
        playerIndex : number;
        encodedMap  : string;
    }
    export interface SerializedField extends ProtoTypes.ISerializedWarField {
        fogMap  : SerializedFogMap;
        unitMap?: SerializedUnitMap;
        tileMap?: SerializedTileMap;
    }
    export interface SerializedTurn extends ProtoTypes.ISerializedWarTurn {
        turnIndex       : number;
        playerIndex     : number;
        turnPhaseCode   : TurnPhaseCode;
        enterTurnTime   : number;
    }
    export interface SerializedWar extends ProtoTypes.ISerializedWar {
        warId           : number;
        configVersion   : string;
        mapFileName     : string;
        warName         : string;
        warPassword     : string;
        warComment      : string;

        hasFogByDefault     : boolean;
        initialFund         : number;
        incomeModifier      : number;
        initialEnergy       : number;
        energyGrowthModifier: number;
        moveRangeModifier   : number;
        attackPowerModifier : number;
        visionRangeModifier : number;

        remainingVotesForDraw?  : number;
        executedActions         : WarActionContainer[];
        players                 : SerializedPlayer[];
        turn                    : SerializedTurn;
        field                   : SerializedField;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Raw war action types.
    ////////////////////////////////////////////////////////////////////////////////
    export type RawWarActionContainer = {
        actionId?           : number;
        PlayerBeginTurn?    : RawWarActionPlayerBeginTurn;
        PlayerDeleteUnit?   : RawWarActionPlayerDeleteUnit;
        PlayerEndTurn?      : RawWarActionPlayerEndTurn;
        PlayerProduceUnit?  : RawWarActionPlayerProduceUnit;
        UnitAttack?         : RawWarActionUnitAttack;
        UnitBeLoaded?       : RawWarActionUnitBeLoaded;
        UnitBuildTile?      : RawWarActionUnitBuildTile;
        UnitCaptureTile?    : RawWarActionUnitCaptureTile;
        UnitDive?           : RawWarActionUnitDive;
        UnitDrop?           : RawWarActionUnitDrop;
        UnitJoin?           : RawWarActionUnitJoin;
        UnitLaunchFlare?    : RawWarActionUnitLaunchFlare;
        UnitLaunchSilo?     : RawWarActionUnitLaunchSilo;
        UnitLoadCo?         : RawWarActionUnitLoadCo;
        UnitProduceUnit?    : RawWarActionUnitProduceUnit;
        UnitSupply?         : RawWarActionUnitSupply;
        UnitSurface?        : RawWarActionUnitSurface;
        UnitUseCoSkill?     : RawWarActionUnitUseCoSkill;
        UnitWait?           : RawWarActionUnitWait;
    }
    export type RawWarActionPlayerBeginTurn = {
    }
    export type RawWarActionPlayerDeleteUnit = {
        gridIndex: GridIndex;
    }
    export type RawWarActionPlayerEndTurn = {
    }
    export type RawWarActionPlayerProduceUnit = {
        gridIndex   : GridIndex;
        unitType    : UnitType;
        unitHp      : number;
    }
    export type RawWarActionUnitAttack = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }
    export type RawWarActionUnitBeLoaded = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitBuildTile = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitCaptureTile = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitDive = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitDrop = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        dropDestinations: DropDestination[];
    }
    export type RawWarActionUnitJoin = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitLaunchFlare = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }
    export type RawWarActionUnitLaunchSilo = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }
    export type RawWarActionUnitLoadCo = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitProduceUnit = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitSupply = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitSurface = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export type RawWarActionUnitUseCoSkill = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        skillType       : CoSkillType;
    }
    export type RawWarActionUnitWait = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Other types.
    ////////////////////////////////////////////////////////////////////////////////
    export type Size = {
        width : number;
        height: number;
    }

    export type GridIndex = {
        x: number;
        y: number;
    }

    export type MapSize = {
        width   : number;
        height  : number;
    }

    export type Point = {
        x: number;
        y: number;
    }

    export type TouchEvents = {
        [touchId: number]: egret.TouchEvent;
    }

    export type TouchPoints = Map<number, Point>;

    export type MoveCosts = {
        [moveType: number]: number | undefined;
    }

    export type MovePath = {
        nodes           : GridIndex[];
        fuelConsumption : number;
        isBlocked       : boolean;
    }

    export type MovePathNode = {
        x               : number;
        y               : number;
        totalMoveCost   : number;
    }

    export type RepairHpAndCost = {
        hp  : number;
        cost: number;
    }

    export type DropDestination = {
        unitId      : number;
        gridIndex   : GridIndex;
    }

    export const enum Visibility {
        OutsideVision   = 0,
        InsideVision    = 1,
        TrueVision      = 2,
    }

    export interface MapRawData extends ProtoTypes.IMapRawData {
        mapDesigner     : string;
        mapName         : string;
        mapNameEnglish  : string;
        mapWidth        : number;
        mapHeight       : number;
        isMultiPlayer   : boolean;
        isSinglePlayer  : boolean;
        playersCount    : number;
        tileBases       : number[];
        tileObjects     : number[];
        units           : number[];
        unitDataList    : SerializedUnit[];
        tileDataList    : SerializedTile[];
    }

    export type MapAvailability = {
        canMcw : boolean;
        canWr  : boolean;
        canScw : boolean;
    }

    export type UnitViewData = {
        configVersion: string;

        gridX: number;
        gridY: number;

        viewId: number;
    }

    export type MovableArea = {
        prevGridIndex   : GridIndex | undefined;
        totalMoveCost   : number;
    }[][];

    export type AttackableArea = {
        movePathDestination: GridIndex;
    }[][];

    export type UnitAttributes = {
        hp          : number;
        fuel        : number;
        primaryAmmo : number | null;
        flareAmmo   : number | null;
    }

    export interface MeMapData extends ProtoTypes.IMapEditorData {
        slotIndex   : number;
        reviewStatus: MapReviewStatus;
        mapRawData  : ProtoTypes.IMapRawData | null | undefined;
    }

    export type MapSizeAndMaxPlayerIndex = {
        mapWidth        : number;
        mapHeight       : number;
        maxPlayerIndex  : number;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Enums.
    ////////////////////////////////////////////////////////////////////////////////
    export const enum LayerType {
        Top,
        Notify,
        Hud3,
        Hud2,
        Hud1,
        Hud0,
        Scene,
        Bottom,
    }

    export const enum ColorType {
        Origin,
        Gray,
        Dark,
        Red,
        Green,
        Blue,
        White,
    }

    export const UiState = {
        Up  : "up",
        Down: "down",
    }

    export const enum LogoutType {
        SelfRequest,
        LoginCollision,
        NetworkFailure,
    }

    export const enum SyncWarRequestType {
        PlayerRequest,
        PlayerForce,
        ReconnectionRequest,
    }

    export const enum SyncWarStatus {
        NoError,
        NotJoined,
        Synchronized,
        Defeated,
        EndedOrNotExists,
    }

    export const enum MoveType {
        Infantry,  /* 0 */            Mech,      /* 1 */            TireA,     /* 2 */            TireB,     /* 3 */
        Tank,      /* 4 */            Air,       /* 5 */            Ship,      /* 6 */            Transport, /* 7 */
    }

    export const enum TileBaseType {
        Empty,  /* 0 */            Plain,  /* 1 */            River,  /* 2 */            Sea,    /* 3 */
        Beach,  /* 4 */
    }

    export const enum TileObjectType {
        Empty,        /* 0 */             Road,         /* 1 */             Bridge,       /* 2 */             Wood,         /* 3 */
        Mountain,     /* 4 */             Wasteland,    /* 5 */             Ruins,        /* 6 */             Fire,         /* 7 */
        Rough,        /* 8 */             Mist,         /* 9 */             Reef,         /* 10 */            Plasma,       /* 11 */
        Meteor,       /* 12 */            Silo,         /* 13 */            EmptySilo,    /* 14 */            Headquarters, /* 15 */
        City,         /* 16 */            CommandTower, /* 17 */            Radar,        /* 18 */            Factory,      /* 19 */
        Airport,      /* 20 */            Seaport,      /* 21 */            TempAirport,  /* 22 */            TempSeaport,  /* 23 */
        GreenPlasma,  /* 24 */
    }

    export const enum TileType {
        Plain,         /* 0 */      River,         /* 1 */      Sea,           /* 2 */      Beach,         /* 3 */
        Road,          /* 4 */      BridgeOnPlain, /* 5 */      BridgeOnRiver, /* 6 */      BridgeOnBeach, /* 7 */
        BridgeOnSea,   /* 8 */      Wood,          /* 9 */      Mountain,      /* 10 */     Wasteland,     /* 11 */
        Ruins,         /* 12 */     Fire,          /* 13 */     Rough,         /* 14 */     MistOnSea,     /* 15 */
        Reef,          /* 16 */     Plasma,        /* 17 */     GreenPlasma,   /* 18 */     Meteor,        /* 19 */
        Silo,          /* 20 */     EmptySilo,     /* 21 */     Headquarters,  /* 22 */     City,          /* 23 */
        CommandTower,  /* 24 */     Radar,         /* 25 */     Factory,       /* 26 */     Airport,       /* 27 */
        Seaport,       /* 28 */     TempAirport,   /* 29 */     TempSeaport,   /* 30 */     MistOnPlain,   /* 31 */
        MistOnRiver,   /* 32 */     MistOnBeach,   /* 33 */
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
        None,          /* 0 */            All,               /* 1 */            Ground,        /* 2 */            Naval,         /* 3 */
        Air,           /* 4 */            GroundOrNaval,     /* 5 */            GroundOrAir,   /* 6 */            Direct,        /* 7 */
        Indirect,      /* 8 */            Foot,              /* 9 */            Infantry,      /* 10 */           Vehicle,       /* 11 */
        DirectMachine, /* 12 */           Transport,         /* 13 */           LargeNaval,    /* 14 */           Copter,        /* 15 */
        Tank,          /* 16 */           AirExceptSeaplane, /* 17 */
    }

    export const enum TileCategory {
        None,          /* 0 */              All,               /* 1 */          LoadableForSeaTransports, /* 2 */   Destroyable,    /* 3 */
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

    export const enum UnitActionState {
        Idle,   /* 0 */         Acted,  /* 1 */
    }

    export const enum UnitAnimationType {
        Stand,
        Move,
    }

    export const enum WeaponType {
        Primary     = 0,
        Secondary   = 1,
    }

    export const enum ForceFogCode {
        None,
        Clear,
        Fog,
    }

    export const enum Direction {
        Undefined,
        Left,
        Right,
        Up,
        Down,
    }

    export const enum TurnPhaseCode {
        WaitBeginTurn,
        GetFund,
        ConsumeFuel,
        RepairUnitByTile,
        DestroyUnitsOutOfFuel,
        RepairUnitByUnit,
        ActivateMapWeapon,
        Main,
        ResetUnitState,
        ResetVisionForCurrentPlayer,
        TickTurnAndPlayerIndex,
        ResetSkillState,
        ResetVisionForNextPlayer,
        ResetVotesForDraw,
    }

    export const enum ActionPlannerState {
        Idle,
        ExecutingAction,
        MakingMovePath,
        ChoosingAction,
        ChoosingAttackTarget,
        ChoosingDropDestination,
        ChoosingFlareDestination,
        ChoosingSiloDestination,
        ChoosingProductionTarget,
        PreviewingAttackableArea,
        PreviewingMovableArea,

        RequestingPlayerActivateSkill,
        RequestingPlayerBeginTurn,
        RequestingPlayerDeleteUnit,
        RequestingPlayerEndTurn,
        RequestingPlayerSurrender,
        RequestingPlayerVoteForDraw,
        RequestingPlayerProduceUnit,
        RequestingUnitAttack,
        RequestingUnitBeLoaded,
        RequestingUnitBuildTile,
        RequestingUnitCaptureTile,
        RequestingUnitDive,
        RequestingUnitDrop,
        RequestingUnitJoin,
        RequestingUnitLaunchFlare,
        RequestingUnitLaunchSilo,
        RequestingUnitLoadCo,
        RequestingUnitProduceUnit,
        RequestingUnitSupply,
        RequestingUnitSurface,
        RequestingUnitUseCoPower,
        RequestingUnitUseCoSuperPower,
        RequestingUnitWait,
    }

    export const enum UnitActionType {
        BeLoaded,
        Join,
        UseCoPower,
        UseCoSuperPower,
        LoadCo,
        Attack,
        Capture,
        Dive,
        Surface,
        BuildTile,
        Supply,
        LaunchUnit,
        DropUnit,
        LaunchFlare,
        LaunchSilo,
        ProduceUnit,
        Wait,
    }

    export const enum CoSkillType {
        Passive     = 0,
        Power       = 1,
        SuperPower  = 2,
    }

    export const enum LanguageType {
        Chinese = 0,
        English = 1,
    }

    export const enum CoSkillAreaType {
        Zone    = 0,
        OnMap   = 1,
        Halo    = 2,
    }

    export const enum McwWatchRequestWatcherStatus {
        Succeed,
        TargetPlayerLost,
        AlreadyRequested,
        AlreadyAccepted,
    }

    export const enum SinglePlayerWarType {
        Custom  = 0,
        WarRoom = 1,
    }

    export const enum MapReviewStatus {
        None        = 0,
        Reviewing   = 1,
        Rejected    = 2,
        Accepted    = 3,
    }

    export const enum MapEditorDrawerMode {
        Preview,
        DrawUnit,
        DrawTileBase,
        DrawTileObject,
        DeleteUnit,
        DeleteTileObject,
    }

    export const enum SymmetryType {
        None                = -1,
        UpToDown            = 0,
        UpRightToDownLeft   = 1,
        LeftToRight         = 2,
        UpLeftToDownRight   = 3,
        Rotation            = 4,
    }

    export const enum ChatChannel {
        System      = 1,
        PublicEn    = 2,
        PublicCn    = 3,
    }
}
