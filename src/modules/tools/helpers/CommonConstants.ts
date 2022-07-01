
// import Types    from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CommonConstants {
    export const DiscordUrl                             = `https://discord.gg/jdtRpY9`;
    export const GithubUrl                              = `https://github.com/Babygogogo/TinyWarsClient`;
    export const LegacyVersionUrl                       = `https://tinywars.online/game/legacy`;
    export const TestVersionUrl                         = `https://tinywars.online/game/test`;

    export const ErrorTextForLang                       = `LangErr`;
    export const ErrorTextForUndefined                  = `UndefErr`;
    export const GameVersion                            = Types.GameVersion.Legacy;
    export const AdminUserId                            = 1000001;
    export const NameListMaxLength                      = 5;

    export const BroadcastTextMaxLength                 = 150;
    export const ChangeLogTextMaxLength                 = 200;
    export const ChangeLogTextListMaxLength             = 2;
    export const ChangeLogMessageListMaxLength          = 100;

    export const BgmSfxCode = {
        None        : 0,
        CoEmpty     : 9999,
        Lobby       : 10000,
        MapEditor   : 10100,
        CoPower     : 10200,
    };

    export const UnitDisplayLayer = {
        Air         : 3,
        Ground      : 2,
        Sea         : 1,
    };

    export const MapMaxGridsCount                       = 1000;
    export const MapMaxNameLength                       = 30;
    export const MapMaxDesignerLength                   = 30;
    export const MapMaxRating                           = 10;
    export const MapMinRating                           = 0;
    export const MapMaxFileSize                         = 50000;
    export const MapMinLocationId                       = 1;
    export const MapMaxLocationId                       = 30;
    export const MapDescriptionMaxLength                = 1000;

    export const Map = {
        MapTag      : {
            MinId           : 1,
            MaxId           : 30,
            NameMinLength   : 1,
            NameMaxLength   : 10,
        },
    };

    export const WarEventNameMaxLength                                  = 150;
    export const WarEventMaxEventsPerMap                                = 100;
    export const WarEventMaxConditionNodesPerMap                        = 100;
    export const WarEventMaxConditionsPerMap                            = 200;
    export const WarEventMaxActionsPerMap                               = 200;
    export const WarEventMaxActionsPerEvent                             = 10;
    export const WarEventMaxCallCountTotal                              = 1000;
    export const WarEventMaxCallCountInPlayerTurn                       = 10;
    export const WarEventActionAddUnitMaxCount                          = 50;
    export const WarEventActionDialogueTextMaxLength                    = 300;
    export const WarEventActionDialogueMaxCount                         = 100;
    export const WarEventActionDialogueNameMaxLength                    = 30;
    export const WarEventActionPersistentShowTextMaxLength              = 100;
    export const WarEventActionSetCustomCounterMaxDeltaValue            = 10000000;
    export const WarEventActionSetCustomCounterMaxMultiplierPercentage  = 10000;
    export const WarEventActionSetPlayerFundMaxDeltaValue               = 10000000;
    export const WarEventActionSetPlayerFundMaxMultiplierPercentage     = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxMultiplierPercentage = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxDeltaPercentage      = 100;

    export const MapEditorSlotMaxCountForNormal         = 10;
    export const MapEditorSlotMaxCountForCommittee      = 100;
    export const MapEditorAutoSaveMinTime               = 180;
    export const MapEditorAutoSaveMaxTime               = 1800;
    export const MapReviewCommentMaxLength              = 5000;
    export const SpwSaveSlotMaxCount                    = 10;
    export const SpmSaveSlotCommentMaxLength            = 15;

    export const RankInitialScore                       = 1200;
    export const RankMaxConcurrentCount                 = 10;
    export const RankMinConcurrentCount                 = 0;
    export const RankRoomPhaseTime                      = 3600 * 24;

    export const ChatMessageMaxLength                   = 200;
    export const ChatErrorMaxLength                     = 2000;
    export const ChatTeamDivider                        = 100;

    export const UnitHpNormalizer                       = 10;
    export const UnitMaxHp                              = 100;
    export const UnitAndTileMinSkinId                   = 1;
    export const UnitAndTileMaxSkinId                   = 5;
    export const UnitAndTileNeutralSkinId               = 0;

    export const CoId = {
        Empty   : 0,
    };
    export const CoCategoryId = {
        Empty   : 0,
    };
    export const TileBaseType = {
        Sea             : 3,
        Beach           : 4,
    };
    export const TileObjectType = {
        Empty           : 0,
        Road            : 1,
        Bridge          : 2,
        Plasma          : 11,
        Meteor          : 12,
        Pipe            : 24,
        PipeJoint       : 34,
    };
    export const TileDecorationType = {
        Shore           : 1,
    };
    export const TileType = {
        City            : 23,
        CommandTower    : 24,
    };
    export const WeatherAnimationType = {
        Sandstorm       : 2,
        Snowy           : 3,
        Rainy           : 4,
    };
    export const MapWeaponType = {
        Crystal             : 1,
        CustomCrystal       : 2,
        CannonUp            : 3,
        CannonDown          : 4,
        CannonLeft          : 5,
        CannonRight         : 6,
        CustomCannon        : 7,
        LaserTurret         : 8,
        CustomLaserTurret   : 9,
    };
    export const PlayerIndex = {
        Neutral : 0,
        First   : 1,
        Max     : 5,
    };
    export const TeamIndex = {
        Neutral : 0,
        First   : 1,
    };

    export const WarFirstTurnIndex                      = 1;
    export const WarPlayerMaxFund                       = 1_000_000_000;
    export const WarCustomCounterMaxValue               = 1_000_000_000;

    export const ReplayMaxRating                        = 10;
    export const ReplayMinRating                        = 0;

    export const WarNameMaxLength                       = 20;
    export const WarCommentMaxLength                    = 50;
    export const WarPasswordMaxLength                   = 4;
    export const WarCustomCounterMinId                  = 1;
    export const WarCustomCounterMaxId                  = 30;
    export const WarBootTimerRegularMaxLimit            = 3600 * 24 * 7;
    export const WarBootTimerRegularDefaultValue        = 3600 * 24 * 3;
    export const WarBootTimerIncrementalMaxLimit        = 3600 * 24;
    export const WarBootTimerDefaultParams              = [Types.BootTimerType.Regular, WarBootTimerRegularDefaultValue];
    export const WarMaxTurnsLimit                       = 80;
    export const WarMinTurnsLimit                       = 20;

    export const WarRuleFirstId                             = 0;
    export const WarRuleNameMaxLength                       = 15;
    export const WarRuleOffenseBonusMinLimit                = -100;
    export const WarRuleOffenseBonusMaxLimit                = 10000;
    export const WarRuleOffenseBonusDefault                 = 0;
    export const WarRuleEnergyGrowthMultiplierMinLimit      = 0;
    export const WarRuleEnergyGrowthMultiplierMaxLimit      = 10000;
    export const WarRuleEnergyGrowthMultiplierDefault       = 100;
    export const WarRuleIncomeMultiplierMinLimit            = 0;
    export const WarRuleIncomeMultiplierMaxLimit            = 10000;
    export const WarRuleIncomeMultiplierDefault             = 100;
    export const WarRuleEnergyAddPctOnLoadCoMinLimit        = 0;
    export const WarRuleEnergyAddPctOnLoadCoMaxLimit        = 100;
    export const WarRuleEnergyAddPctOnLoadCoDefault         = 0;
    export const WarRuleInitialFundMinLimit                 = 0;
    export const WarRuleInitialFundMaxLimit                 = 1000000;
    export const WarRuleInitialFundDefault                  = 0;
    export const WarRuleBannedUnitTypeCountDefault          = 0;
    export const WarRuleLuckMinLimit                        = -100;
    export const WarRuleLuckMaxLimit                        = 100;
    export const WarRuleLuckDefaultLowerLimit               = 0;
    export const WarRuleLuckDefaultUpperLimit               = 10;
    export const WarRuleMoveRangeModifierMinLimit           = -10;
    export const WarRuleMoveRangeModifierMaxLimit           = 10;
    export const WarRuleMoveRangeModifierDefault            = 0;
    export const WarRuleVisionRangeModifierMinLimit         = -10;
    export const WarRuleVisionRangeModifierMaxLimit         = 10;
    export const WarRuleVisionRangeModifierDefault          = 0;
    export const WarRuleMaxCount                            = 5;

    export const GridSize: Types.Size = {
        width   : 24,
        height  : 24,
    };
    export const StageMinScale      = 100;
    export const StageMaxScale      = 300;
    export const DefaultTweenTime   = 200;

    export const TileDefaultCrystalData: CommonProto.WarSerialization.ITileCustomCrystalData = {
        radius                      : 2,
        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : false,

        deltaFund                   : 0,
        deltaEnergyPercentage       : 0,

        deltaHp                     : 2,
        deltaFuelPercentage         : 100,
        deltaPrimaryAmmoPercentage  : 100,
    };
    export const TileDefaultCannonUpData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonDownData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonLeftData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 4,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonRightData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 4,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomCannonData: CommonProto.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 4,
        rangeForRight               : 4,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomLaserTurretData: CommonProto.WarSerialization.ITileCustomLaserTurretData = {
        rangeForDown                : 9999,
        rangeForLeft                : 9999,
        rangeForRight               : 9999,
        rangeForUp                  : 9999,

        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : true,

        deltaHp                     : -5,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
}

// export default CommonConstants;
