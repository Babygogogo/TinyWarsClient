
// import ProtoTypes           from "../proto/ProtoTypes";
// import TwnsClientErrorCode  from "./ClientErrorCode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Types {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Config types.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export interface SystemCfg extends CommonProto.Config.ISystemCfg {
        energyGrowthMultiplierArray : number[];
        dialogueBackgroundMaxId     : number;
        maxBanCount                 : number;
    }
    export interface TileCategoryCfg extends CommonProto.Config.ITileCategoryCfg {
        category    : number;
    }
    export interface UnitCategoryCfg extends CommonProto.Config.IUnitCategoryCfg {
        category    : number;
    }
    export interface TileTemplateCfg extends CommonProto.Config.ITileTemplateCfg {
        type                : TileType;
        defenseAmount       : number;
        defenseUnitCategory : number;
        visionRange         : number;
        lang                : number;
    }
    export interface TileBaseCfg extends CommonProto.Config.ITileBaseCfg {
        tileBaseType    : number;
        shapesCount     : number;
    }
    export interface TileBaseSymmetryCfg extends CommonProto.Config.ITileBaseSymmetryCfg {
        tileBaseType            : number;
        shapeId                 : number;
        symmetryShapeIds        : number[];
    }
    export interface TileObjectCfg extends CommonProto.Config.ITileObjectCfg {
        tileObjectType          : number;
        shapeIdAfterDestruction : number[];
    }
    export interface TileObjectSymmetryCfg extends CommonProto.Config.ITileObjectSymmetryCfg {
        tileObjectType          : number;
        shapeId                 : number;
        symmetryShapeIds        : number[];
    }
    export interface TileDecorationCfg extends CommonProto.Config.ITileDecorationCfg {
        tileDecorationType      : number;
        shapesCount             : number;
    }
    export interface TileDecorationSymmetryCfg extends CommonProto.Config.ITileDecorationSymmetryCfg {
        tileDecorationType      : number;
        shapeId                 : number;
        symmetryShapeIds        : number[];
    }
    export interface TileTypeMappingCfg extends CommonProto.Config.ITileTypeMappingCfg {
        tileBaseType            : number;
        tileObjectType          : number;
        tileType                : number;
    }
    export interface UnitTemplateCfg extends CommonProto.Config.IUnitTemplateCfg {
        type                    : number;
        maxHp                   : number;
        armorType               : number;
        isAffectedByLuck        : number;
        moveRange               : number;
        moveType                : number;
        maxFuel                 : number;
        fuelConsumptionPerTurn  : number;
        productionCost          : number;
        visionRange             : number;
        lang                    : number;
        animParams              : number[];
    }
    export interface DamageChartCfg extends CommonProto.Config.IDamageChartCfg {
        attackerType: number;
        armorType   : number;
        weaponType  : WeaponType;
    }
    export interface MoveCostCfg extends CommonProto.Config.IMoveCostCfg {
        tileType    : TileType;
        moveType    : number;
    }
    export interface UnitPromotionCfg extends CommonProto.Config.IUnitPromotionCfg {
        promotion   : number;
        attackBonus : number;
        defenseBonus: number;
    }
    export interface VisionBonusCfg extends CommonProto.Config.IVisionBonusCfg {
        unitType    : number;
        tileType    : TileType;
        visionBonus : number;
    }
    export interface BuildableTileCfg extends CommonProto.Config.IBuildableTileCfg {
        unitType        : number;
        srcBaseType     : TileBaseType;
        srcObjectType   : TileObjectType;
        dstBaseType     : TileBaseType;
        dstObjectType   : TileObjectType;
    }
    export interface PlayerRankCfg extends CommonProto.Config.PlayerRankCfg {
        minScore    : number;
        rank        : number;
    }
    export interface CoCategoryCfg extends CommonProto.Config.ICoCategoryCfg {
        categoryId          : number;
        name                : string;
    }
    export interface CoBasicCfg extends CommonProto.Config.ICoBasicCfg {
        coId                : number;
        name                : string;
        tier                : number;
        zoneRadius          : number;
        boardCostPercentage : number;
        maxLoadCount        : number;
    }
    export interface CoSkillCfg extends CommonProto.Config.ICoSkillCfg {
        skillId     : number;
        name        : string;
    }
    export interface WeatherCfg extends CommonProto.Config.IWeatherCfg {
        weatherType : number;
    }
    export interface WeatherCategoryCfg extends CommonProto.Config.IWeatherCategoryCfg {
        category    : number;
    }
    export interface UserAvatarCfg extends CommonProto.Config.IUserAvatarCfg {
        avatarId    : number;
    }
    export interface BgmSfxCfg extends CommonProto.Config.IBgmSfxCfg {
        code        : number;
        filename    : string;
    }
    export interface MoveTypeCfg extends CommonProto.Config.IMoveTypeCfg {
        moveType    : number;
        lang        : number;
    }
    export interface FullConfig extends CommonProto.Config.FullConfig {
        System                  : SystemCfg;
        TileCategory            : TileCategoryCfg[];
        UnitCategory            : UnitCategoryCfg[];
        TileTemplate            : TileTemplateCfg[];
        TileBase                : TileBaseCfg[];
        TileBaseSymmetry        : TileBaseSymmetryCfg[];
        TileObject              : TileObjectCfg[];
        TileObjectSymmetry      : TileObjectSymmetryCfg[];
        TileDecoration          : TileDecorationCfg[];
        TileDecorationSymmetry  : TileDecorationSymmetryCfg[];
        TileTypeMapping         : TileTypeMappingCfg[];
        UnitTemplate            : UnitTemplateCfg[];
        DamageChart             : DamageChartCfg[];
        MoveCost                : MoveCostCfg[];
        UnitPromotion           : UnitPromotionCfg[];
        VisionBonus             : VisionBonusCfg[];
        BuildableTile           : BuildableTileCfg[];
        PlayerRank              : PlayerRankCfg[];
        CoCategory              : CoCategoryCfg[];
        CoBasic                 : CoBasicCfg[];
        CoSkill                 : CoSkillCfg[];
        Weather                 : WeatherCfg[];
        WeatherCategory         : WeatherCategoryCfg[];
        UserAvatar              : UserAvatarCfg[];
        BgmSfx                  : BgmSfxCfg[];
        MoveType                : MoveTypeCfg[];
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Other types.
    ////////////////////////////////////////////////////////////////////////////////
    export type UiListener = {
        ui          : egret.DisplayObject,
        callback    : (e: egret.Event) => void,
        eventType?  : string,
        thisObject? : any,
    };

    export type Size = {
        width : number;
        height: number;
    };

    export type GridIndex = {
        x: number;
        y: number;
    };

    export type MapSize = {
        width   : number;
        height  : number;
    };

    export type Point = {
        x: number;
        y: number;
    };

    export type TouchEvents = {
        [touchId: number]: egret.TouchEvent;
    };

    export type TouchPoints = Map<number, Point>;

    export type MoveCosts = {
        [moveType: number]: number | null;
    };

    export type MovePath = {
        nodes           : GridIndex[];
        fuelConsumption : number;
        isBlocked       : boolean;
    };

    export type MovePathNode = {
        x               : number;
        y               : number;
        totalMoveCost   : number;
    };

    export type RepairHpAndCost = {
        hp  : number;
        cost: number;
    };

    export type DamageInfo = {
        attackerUnitId      : number;
        targetUnitId        : number | null;
        targetTileGridIndex : GridIndex | null;
        damage              : number;
    };

    export type DropDestination = {
        unitId      : number;
        gridIndex   : GridIndex;
    };

    export type TurnAndPlayerIndex = {
        turnIndex   : number;
        playerIndex : number;
    };

    // eslint-disable-next-line no-shadow
    export enum Visibility {
        OutsideVision   = 0,
        InsideVision    = 1,
        TrueVision      = 2,
    }

    export interface WarMapUnitViewData extends CommonProto.WarSerialization.ISerialUnit {
        skinId?             : number;
        hasLoadedUnit?      : boolean;
        coUsingSkillType?   : CoSkillType;
        gameConfig          : Config.GameConfig;
    }

    export interface WarMapTileViewData extends CommonProto.WarSerialization.ISerialTile {
        skinId  : number | null;
    }

    export type MovableArea = {
        prevGridIndex   : GridIndex | null;
        totalMoveCost   : number;
    }[][];

    export type AttackableArea = {
        movePathDestination: GridIndex;
    }[][];

    export type SpmWarSaveSlotData = {
        slotIndex   : number;
        extraData   : CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData     : CommonProto.WarSerialization.ISerialWar;
    };

    export type BaseWarRule = CommonProto.WarRule.IInstanceWarRule | CommonProto.WarRule.ITemplateWarRule;

    export type ReplayCheckpointInfo = {
        checkpointId: number;
        nextActionId: number;
        turnIndex   : number;
        playerIndex : number;
    };

    export type McrRoomFilter = {
        roomId?             : number | null;
        mapName?            : string | null;
        userNickname?       : string | null;
        coName?             : string | null;
        hasFog?             : boolean | null;
        userIdInRoom?       : number | null;
        userIdNotInRoom?    : number | null;
    };
    export type MfrRoomFilter = {
        roomId?             : number | null;
        userNickname?       : string | null;
        coName?             : string | null;
        hasFog?             : boolean | null;
        userIdInRoom?       : number | null;
        userIdNotInRoom?    : number | null;
    };
    export type CcrRoomFilter = {
        roomId?             : number | null;
        mapName?            : string | null;
        userNickname?       : string | null;
        coName?             : string | null;
        hasFog?             : boolean | null;
        userIdInRoom?       : number | null;
        userIdNotInRoom?    : number | null;
    };

    export type Undefinable<T> = T | null | undefined;

    export interface CustomError extends Error {
        isShown?    : boolean;
        errorCode?  : ClientErrorCode;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Enums.
    ////////////////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line no-shadow
    export enum LayerType {
        Top,
        Notify2,    // FloatText
        Notify1,    // CommonAlertPanel, ...
        Notify0,    // CommonBroadcastPanel
        Hud3,
        Hud2,
        Hud1,
        Hud0,
        Scene,
        Bottom,
    }

    // eslint-disable-next-line no-shadow
    export enum ColorType {
        Origin,
        Gray,
        Dark,
        Red,
        Green,
        Blue,
        White,
        Yellow,
    }
    // eslint-disable-next-line no-shadow
    export enum ColorValue {
        Red     = 0xFF0000,
        White   = 0xFFFFFF,
        Yellow  = 0xFFFF00,
        Green   = 0x00FF00,
    }

    // eslint-disable-next-line no-shadow
    export enum SoundType {
        Bgm,
        Sfx,
    }

    // eslint-disable-next-line no-shadow
    export enum ShortSfxCode {
        None,
        ButtonNeutral01,
        ButtonConfirm01,
        ButtonCancel01,
        ButtonForbidden01,
        CursorConfirm01,
        CursorMove01,
        Explode,
    }

    export const UiState = {
        Up  : "up",
        Down: "down",
    };

    // eslint-disable-next-line no-shadow
    export enum LogoutType {
        SelfRequest,
        LoginCollision,
        NetworkFailure,
    }

    // eslint-disable-next-line no-shadow
    export enum SyncWarRequestType {
        PlayerRequest,
        PlayerForce,
        ReconnectionRequest,
    }

    // eslint-disable-next-line no-shadow
    export enum SyncWarStatus {
        NoError,
        NotJoined,
        Synchronized,
        Defeated,
        EndedOrNotExists,
    }

    // eslint-disable-next-line no-shadow
    export enum TileThemeType {
        Clear,
        Sandstorm,
        Snowy,
        Rainy,
    }

    // eslint-disable-next-line no-shadow
    export enum TileBaseType {
        Empty,  /* 0 */            Plain,  /* 1 */            River,  /* 2 */            Sea,    /* 3 */
        Beach,  /* 4 */
    }

    // eslint-disable-next-line no-shadow
    export enum TileDecoratorType {
        Empty,  /* 0 */             Shore,  /* 1 */
    }

    // eslint-disable-next-line no-shadow
    export const enum TileObjectType {
        Empty,          /* 0 */         Road,               /* 1 */         Bridge,         /* 2 */         Wood,           /* 3 */
        Mountain,       /* 4 */         Wasteland,          /* 5 */         Ruins,          /* 6 */         Fire,           /* 7 */
        Rough,          /* 8 */         Mist,               /* 9 */         Reef,           /* 10 */        Plasma,         /* 11 */
        Meteor,         /* 12 */        Silo,               /* 13 */        EmptySilo,      /* 14 */        Headquarters,   /* 15 */
        City,           /* 16 */        CommandTower,       /* 17 */        Radar,          /* 18 */        Factory,        /* 19 */
        Airport,        /* 20 */        Seaport,            /* 21 */        TempAirport,    /* 22 */        TempSeaport,    /* 23 */
        Pipe,           /* 24 */        Crystal,            /* 25 */        CustomCrystal,  /* 26 */        CannonUp,       /* 27 */
        CannonDown,     /* 28 */        CannonLeft,         /* 29 */        CannonRight,    /* 30 */        CustomCannon,   /* 31 */
        LaserTurret,    /* 32 */        CustomLaserTurret,  /* 33 */        PipeJoint,      /* 34 */
    }

    // eslint-disable-next-line no-shadow
    export const enum TileType {
        Plain,          /* 0 */         River,          /* 1 */         Sea,                /* 2 */         Beach,          /* 3 */
        Road,           /* 4 */         BridgeOnPlain,  /* 5 */         BridgeOnRiver,      /* 6 */         BridgeOnBeach,  /* 7 */
        BridgeOnSea,    /* 8 */         Wood,           /* 9 */         Mountain,           /* 10 */        Wasteland,      /* 11 */
        Ruins,          /* 12 */        Fire,           /* 13 */        Rough,              /* 14 */        MistOnSea,      /* 15 */
        Reef,           /* 16 */        Plasma,         /* 17 */        Pipe,               /* 18 */        Meteor,         /* 19 */
        Silo,           /* 20 */        EmptySilo,      /* 21 */        Headquarters,       /* 22 */        City,           /* 23 */
        CommandTower,   /* 24 */        Radar,          /* 25 */        Factory,            /* 26 */        Airport,        /* 27 */
        Seaport,        /* 28 */        TempAirport,    /* 29 */        TempSeaport,        /* 30 */        MistOnPlain,    /* 31 */
        MistOnRiver,    /* 32 */        MistOnBeach,    /* 33 */        Crystal,            /* 34 */        CustomCrystal,  /* 35 */
        CannonUp,       /* 36 */        CannonDown,     /* 37 */        CannonLeft,         /* 38 */        CannonRight,    /* 39 */
        CustomCannon,   /* 40 */        LaserTurret,    /* 41 */        CustomLaserTurret,  /* 42 */        PipeJoint,      /* 43 */
    }

    // eslint-disable-next-line no-shadow
    export enum UnitActionState {
        Idle,   /* 0 */         Acted,  /* 1 */
    }

    // eslint-disable-next-line no-shadow
    export const enum UnitAiMode {
        Normal              = 0,
        WaitUntilCanAttack  = 1,
        NoMove              = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum PlayerAliveState {
        Alive   = 0,
        Dying   = 1,
        Dead    = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum UnitAnimationType {
        Stand,
        Move,
    }

    // eslint-disable-next-line no-shadow
    export enum WeaponType {
        Primary     = 0,
        Secondary   = 1,
    }

    // eslint-disable-next-line no-shadow
    export enum ForceFogCode {
        None,
        Clear,
        Fog,
    }

    // eslint-disable-next-line no-shadow
    export enum WeatherFogType {
        Fog         = 1,
        NoFog       = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum WeatherType {
        Clear       = 1,
        Sandstorm   = 2,
        Snowy       = 3,
        Rainy       = 4,
    }

    // eslint-disable-next-line no-shadow
    export enum Direction {
        Undefined,
        Left,
        Right,
        Up,
        Down,
    }

    // eslint-disable-next-line no-shadow
    export enum TurnPhaseCode {
        WaitBeginTurn       = 0,
        Main                = 1,
        // GetFund,
        // ConsumeFuel,
        // RepairUnitByTile,
        // DestroyUnitsOutOfFuel,
        // RepairUnitByUnit,
        // ActivateMapWeapon,
        // ResetUnitState,
        // ResetVisionForCurrentPlayer,
        // TickTurnAndPlayerIndex,
        // ResetSkillState,
        // ResetVisionForNextPlayer,
        // ResetVotesForDraw,
    }

    // eslint-disable-next-line no-shadow
    export enum ActionPlannerState {
        Undefined,

        Idle,
        ExecutingAction,
        MakingMovePath,
        ChoosingAction,
        ChoosingAttackTarget,
        ChoosingDropDestination,
        ChoosingFlareDestination,
        ChoosingSiloDestination,
        ChoosingProductionTarget,
        PreviewingUnitAttackableArea,
        PreviewingUnitMovableArea,
        PreviewingUnitVisibleArea,
        PreviewingTileAttackableArea,

        RequestingPlayerActivateSkill,
        RequestingPlayerBeginTurn,
        RequestingPlayerDeleteUnit,
        RequestingPlayerEndTurn,
        RequestingPlayerSurrender,
        RequestingPlayerVoteForDraw,
        RequestingPlayerProduceUnit,
        RequestingPlayerUseCoSkill,
        RequestingUnitAttackUnit,
        RequestingUnitAttackTile,
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

    // eslint-disable-next-line no-shadow
    export enum UnitActionType {
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

    // eslint-disable-next-line no-shadow
    export const enum TileInfoType {
        DefenseBonus,
        Income,
        Vision,
        HideUnitCategory,
        IsDefeatedOnCapture,
        ProduceUnitCategory,
        GlobalBonus,
        RepairUnitCategory,
        Hp,
        CapturePoint,
        BuildPoint,
        IsHighlighted,

        CrystalRadius,
        CrystalPriority,
        CrystalCanAffectSelf,
        CrystalCanAffectAlly,
        CrystalCanAffectEnemy,
        CrystalDeltaFund,
        CrystalDeltaEnergyPercentage,
        CrystalDeltaHp,
        CrystalDeltaFuelPercentage,
        CrystalDeltaPrimaryAmmoPercentage,

        CannonRangeForLeft,
        CannonRangeForRight,
        CannonRangeForUp,
        CannonRangeForDown,
        CannonPriority,
        CannonMaxTargetCount,
        CannonCanAffectSelf,
        CannonCanAffectAlly,
        CannonCanAffectEnemy,
        CannonDeltaHp,
        CannonDeltaFuelPercentage,
        CannonDeltaPrimaryAmmoPercentage,

        LaserTurretRangeForLeft,
        LaserTurretRangeForRight,
        LaserTurretRangeForUp,
        LaserTurretRangeForDown,
        LaserTurretPriority,
        LaserTurretCanAffectSelf,
        LaserTurretCanAffectAlly,
        LaserTurretCanAffectEnemy,
        LaserTurretDeltaHp,
        LaserTurretDeltaFuelPercentage,
        LaserTurretDeltaPrimaryAmmoPercentage,
    }

    // eslint-disable-next-line no-shadow
    export enum CoSkillType {
        Passive     = 0,
        Power       = 1,
        SuperPower  = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum LanguageType {
        Chinese = 0,
        English = 1,
    }

    // eslint-disable-next-line no-shadow
    export enum CoSkillAreaType {
        Zone    = 0,
        OnMap   = 1,
        Halo    = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum McwWatchRequestWatcherStatus {
        Succeed,
        TargetPlayerLost,
        AlreadyRequested,
        AlreadyAccepted,
    }

    // eslint-disable-next-line no-shadow
    export enum WarType {
        Undefined   = 0,
        McwStd      = 1,
        McwFog      = 2,
        MrwStd      = 3,
        MrwFog      = 4,
        ScwStd      = 5,
        ScwFog      = 6,
        Me          = 7,
        Test        = 8,
        MfwStd      = 9,
        MfwFog      = 10,
        SfwStd      = 11,
        SfwFog      = 12,
        SrwStd      = 13,
        SrwFog      = 14,
        CcwStd      = 15,
        CcwFog      = 16,
    }

    // eslint-disable-next-line no-shadow
    export enum MapReviewStatus {
        None        = 0,
        Reviewing   = 1,
        Rejected    = 2,
        Accepted    = 3,
    }

    // eslint-disable-next-line no-shadow
    export enum MapEditorDrawerMode {
        Preview,
        DrawUnit,
        DrawTileBase,
        DrawTileDecorator,
        DrawTileObject,
        DeleteUnit,
        DeleteTileDecorator,
        DeleteTileObject,
        AddTileToLocation,
        DeleteTileFromLocation,
    }

    // eslint-disable-next-line no-shadow
    export enum SymmetryType {
        None                = -1,
        UpToDown            = 0,
        UpRightToDownLeft   = 1,
        LeftToRight         = 2,
        UpLeftToDownRight   = 3,
        Rotation            = 4,
    }

    // eslint-disable-next-line no-shadow
    export enum ChatChannel {
        System      = 1,
        PublicEn    = 2,
        PublicCn    = 3,
    }

    // eslint-disable-next-line no-shadow
    export enum ChatMessageToCategory {
        Private         = 1,
        WarAndTeam      = 2,
        PublicChannel   = 3,
        McrRoom         = 4,
        MfrRoom         = 5,
        CcrRoom         = 6,
        MapReview       = 7,
    }

    // eslint-disable-next-line no-shadow
    export enum UnitAndTileTextureVersion {
        V0  = 0,
        V1  = 1,
    }

    // eslint-disable-next-line no-shadow
    export enum BootTimerType {
        NoBoot      = 0,
        Regular     = 1,
        Incremental = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum PlayerRuleType {
        TeamIndex,
        BannedCoIdArray,
        BannedUnitTypeArray,
        CanActivateCoSkill,
        InitialFund,
        IncomeMultiplier,
        EnergyAddPctOnLoadCo,
        EnergyGrowthMultiplier,
        MoveRangeModifier,
        AttackPowerModifier,
        VisionRangeModifier,
        LuckLowerLimit,
        LuckUpperLimit,
        AiControlInCcw,
        AiCoIdInCcw,
    }

    // eslint-disable-next-line no-shadow
    export enum WarEventDescType {
        EventName,
        EventMaxCallCountInPlayerTurn,
        EventMaxCallCountTotal,
        ConditionNode,
        Condition,
        Action,
    }

    // eslint-disable-next-line no-shadow
    export enum WarEventConditionType {
        WecTurnIndexEqualTo,
        WecTurnIndexGreaterThan,
        WecTurnIndexLessThan,
        WecTurnIndexRemainderEqualTo,
        WecTurnAndPlayer,

        WecTurnPhaseEqualTo,

        WecPlayerIndexInTurnEqualTo,
        WecPlayerIndexInTurnGreaterThan,
        WecPlayerIndexInTurnLessThan,

        WecWeatherAndFog,

        WecEventCalledCountTotalEqualTo,
        WecEventCalledCountTotalGreaterThan,
        WecEventCalledCountTotalLessThan,
        WecEventCalledCount,

        WecPlayerAliveStateEqualTo,
        WecPlayerPresence,

        WecTilePlayerIndexEqualTo,
        WecTileTypeEqualTo,
        WecTilePresence,

        WecUnitPresence,

        WecCustomCounter,

        WecOngoingPersistentActionPresence,
    }

    // eslint-disable-next-line no-shadow
    export enum WarEventActionType {
        AddUnit,
        Dialogue,
        SetViewpoint,
        SetWeather,
        SimpleDialogue,
        PlayBgm,
        SetForceFogCode,
        SetCustomCounter,
        StopPersistentAction,

        DeprecatedSetPlayerAliveState,
        DeprecatedSetPlayerFund,
        DeprecatedSetPlayerCoEnergy,
        SetPlayerAliveState,
        SetPlayerState,
        SetPlayerCoEnergy,

        SetUnitState,

        SetTileType,
        SetTileState,

        PersistentShowText,
        PersistentModifyPlayerAttribute,
    }

    // eslint-disable-next-line no-shadow
    export enum GameVersion {
        Legacy,
        Test,
        Awbw,
    }

    // eslint-disable-next-line no-shadow
    export enum LogLevel {
        All   = 0,
        Trace = 1,
        Debug = 2,
        Log   = 3,
        Info  = 4,
        Warn  = 5,
        Error = 6,
        Off   = 0xFFFFFFFF,
    }

    // eslint-disable-next-line no-shadow
    export enum WarBasicSettingsType {
        MapId,
        WarName,
        WarPassword,
        WarComment,
        WarRuleTitle,
        HasFog,
        Weather,
        WarEvent,
        TimerType,
        TimerRegularParam,
        TimerIncrementalParam1,
        TimerIncrementalParam2,
        TurnsLimit,
        SpmSaveSlotIndex,
        SpmSaveSlotComment,
    }

    // eslint-disable-next-line no-shadow
    export enum CoType {
        Undefined   = 0,
        Zoned       = 1,
        Global      = 2,
    }

    // eslint-disable-next-line no-shadow
    export const enum CoEnergyType {
        Dor         = 1,
        Trilogy     = 2,
    }

    // eslint-disable-next-line no-shadow
    export enum WarEventActionDialogueSide {
        Left    = 1,
        Right   = 2,
    }
    // eslint-disable-next-line no-shadow
    export enum WarEventActionSimpleDialogueSide {
        Bottom  = 1,
        Top     = 2,
    }

    // eslint-disable-next-line no-shadow
    export const enum ValueComparator {
        EqualTo           = 1,
        NotEqualTo,
        GreaterThan,
        NotGreaterThan,
        LessThan,
        NotLessThan,
    }

    // eslint-disable-next-line no-shadow
    export const enum SpmValidateSrwStatus {
        Succeed,
        ConfigVersionNotLatest,
        ScoreNotHighest,
        ScoreTooLow,
    }

    // eslint-disable-next-line no-shadow
    export const enum ExitRoomType {
        SelfExit            = 1,
        DeletedByRoomOwner  = 2,
    }
}

// export default Types;
