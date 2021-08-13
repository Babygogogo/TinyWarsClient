
import Lang             from "../lang/Lang";
import Notify           from "../notify/Notify";
import TwnsNotifyType   from "../notify/NotifyType";
import ProtoManager     from "../proto/ProtoManager";
import CommonConstants  from "./CommonConstants";
import Helpers          from "./Helpers";
import Logger           from "./Logger";
import Types            from "./Types";

namespace ConfigManager {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;
    import TileObjectType       = Types.TileObjectType;
    import TileType             = Types.TileType;
    import UnitType             = Types.UnitType;
    import UnitCategory         = Types.UnitCategory;
    import TileCategory         = Types.TileCategory;
    import WeaponType           = Types.WeaponType;
    import UnitTemplateCfg      = Types.UnitTemplateCfg;
    import TileTemplateCfg      = Types.TileTemplateCfg;
    import DamageChartCfg       = Types.DamageChartCfg;
    import BuildableTileCfg     = Types.BuildableTileCfg;
    import VisionBonusCfg       = Types.VisionBonusCfg;
    import CoBasicCfg           = Types.CoBasicCfg;
    import TileCategoryCfg      = Types.TileCategoryCfg;
    import UnitCategoryCfg      = Types.UnitCategoryCfg;
    import MoveCostCfg          = Types.MoveCostCfg;
    import UnitPromotionCfg     = Types.UnitPromotionCfg;
    import PlayerRankCfg        = Types.PlayerRankCfg;
    import CoSkillCfg           = Types.CoSkillCfg;

    ////////////////////////////////////////////////////////////////////////////////
    // Internal types.
    ////////////////////////////////////////////////////////////////////////////////
    type ExtendedFullConfig = {
        TileCategory            : { [category: number]: TileCategoryCfg };
        UnitCategory            : { [category: number]: UnitCategoryCfg };
        TileTemplate            : { [tileType: number]: TileTemplateCfg };
        UnitTemplate            : { [unitType: number]: UnitTemplateCfg };
        DamageChart             : { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } };
        MoveCost                : { [tileType: number]: { [moveType: number]: MoveCostCfg } };
        UnitPromotion           : { [promotion: number]: UnitPromotionCfg };
        VisionBonus             : { [unitType: number]: { [tileType: number]: VisionBonusCfg } };
        BuildableTile           : { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } };
        PlayerRank              : { [minScore: number]: PlayerRankCfg };
        CoBasic                 : { [coId: number]: CoBasicCfg };
        CoSkill                 : { [skillId: number]: CoSkillCfg };
        maxUnitPromotion?       : number;
        secondaryWeaponFlag?    : { [unitType: number]: boolean };
    };

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    function _destructTileCategoryCfg(data: TileCategoryCfg[]): { [category: number]: TileCategoryCfg } {
        const dst: { [category: number]: TileCategoryCfg } = {};
        for (const d of data) {
            dst[d.category] = d;
        }
        return dst;
    }
    function _destructUnitCategoryCfg(data: UnitCategoryCfg[]): { [category: number]: UnitCategoryCfg } {
        const dst: { [category: number]: UnitCategoryCfg } = {};
        for (const d of data) {
            dst[d.category] = d;
        }
        return dst;
    }
    function _destructTileTemplateCfg(data: TileTemplateCfg[], version: string): { [tileType: number]: TileTemplateCfg } {
        const dst: { [category: number]: TileTemplateCfg } = {};
        for (const d of data) {
            d.version   = version;
            dst[d.type] = d;
        }
        return dst;
    }
    function _destructUnitTemplateCfg(data: UnitTemplateCfg[], version: string): { [unitType: number]: UnitTemplateCfg } {
        const dst: { [category: number]: UnitTemplateCfg } = {};
        for (const d of data) {
            d.version   = version;
            dst[d.type] = d;
        }
        return dst;
    }
    function _destructDamageChartCfg(data: DamageChartCfg[]): { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } {
        const dst: { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } = {};
        for (const d of data) {
            const attackerType  = d.attackerType;
            const armorType     = d.armorType;
            dst[attackerType]                           = dst[attackerType] || {};
            dst[attackerType][armorType]                = dst[attackerType][armorType] || {};
            dst[attackerType][armorType][d.weaponType]  = d;
        }
        return dst;
    }
    function _destructMoveCostCfg(data: MoveCostCfg[]): { [tileType: number]: { [moveType: number]: MoveCostCfg } } {
        const dst: { [tileType: number]: { [moveType: number]: MoveCostCfg } } = {};
        for (const d of data) {
            const tileType              = d.tileType;
            dst[tileType]               = dst[tileType] || {};
            dst[tileType][d.moveType]   = d;
        }
        return dst;
    }
    function _destructUnitPromotionCfg(data: UnitPromotionCfg[]): { [promotion: number]: UnitPromotionCfg } {
        const dst: { [promotion: number]: UnitPromotionCfg } = {};
        for (const d of data) {
            dst[d.promotion] = d;
        }
        return dst;
    }
    function _destructVisionBonusCfg(data: VisionBonusCfg[]): { [unitType: number]: { [tileType: number]: VisionBonusCfg } } {
        const dst: { [unitType: number]: { [tileType: number]: VisionBonusCfg } } = {};
        for (const d of data) {
            const unitType              = d.unitType;
            dst[unitType]               = dst[unitType] || {};
            dst[unitType][d.tileType]   = d;
        }
        return dst;
    }
    function _destructBuildableTileCfg(
        data: BuildableTileCfg[]
    ): { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } {
        const dst: { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } = {};
        for (const d of data) {
            const unitType                              = d.unitType;
            const srcBaseType                           = d.srcBaseType;
            dst[unitType]                               = dst[unitType] || {};
            dst[unitType][srcBaseType]                  = dst[unitType][srcBaseType] || {};
            dst[unitType][srcBaseType][d.srcObjectType] = d;
        }
        return dst;
    }
    function _destructPlayerRankCfg(data: PlayerRankCfg[]): { [minScore: number]: PlayerRankCfg } {
        const dst: { [minScore: number]: PlayerRankCfg } = {};
        for (const d of data) {
            dst[d.minScore] = d;
        }
        return dst;
    }
    function _destructCoBasicCfg(data: CoBasicCfg[]): { [coId: number]: CoBasicCfg } {
        const dst: { [coId: number]: CoBasicCfg } = {};
        for (const d of data) {
            dst[d.coId] = d;
        }
        return dst;
    }
    function _destructCoSkillCfg(data: CoSkillCfg[]): { [skillId: number]: CoSkillCfg } {
        const dst: { [skillId: number]: CoSkillCfg } = {};
        for (const d of data) {
            dst[d.skillId] = d;
        }
        return dst;
    }
    function _getMaxUnitPromotion(cfg: { [promotion: number]: UnitPromotionCfg }): number {
        let maxPromotion = 0;
        for (const p in cfg) {
            maxPromotion = Math.max(cfg[p].promotion, maxPromotion);
        }
        return maxPromotion;
    }
    function _getSecondaryWeaponFlags(chartCfgs: { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } }): { [unitType: number]: boolean } {
        const flags: { [unitType: number]: boolean } = {};
        for (const attackerType in chartCfgs) {
            flags[attackerType] = false;

            const cfgs = chartCfgs[attackerType];
            for (const armorType in cfgs) {
                const cfg = cfgs[armorType][WeaponType.Secondary];
                if ((cfg) && (cfg.damage != null)) {
                    flags[attackerType] = true;
                    break;
                }
            }
        }

        return flags;
    }

    const _ALL_CONFIGS       = new Map<string, ExtendedFullConfig>();
    const _INVALID_CONFIGS      = new Set<string>();
    const _AVAILABLE_CO_LIST    = new Map<string, CoBasicCfg[]>();
    const _CO_TIERS             = new Map<string, number[]>();
    const _CO_ID_LIST_IN_TIER   = new Map<string, Map<number, number[]>>();
    const _CUSTOM_CO_ID_LIST    = new Map<string, number[]>();
    let _latestFormalVersion    : string;

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function init(): void {
        // nothing to do.
    }

    export function getLatestFormalVersion(): string {
        return _latestFormalVersion;
    }
    export function setLatestFormalVersion(version: string): void {
        _latestFormalVersion = version;
    }
    export async function checkIsVersionValid(version: string): Promise<boolean> {
        return (await loadConfig(version)) != null;
    }

    export async function loadConfig(version: string): Promise<ExtendedFullConfig | undefined> {
        const cachedConfig = getCachedConfig(version);
        if (cachedConfig) {
            return cachedConfig;
        }

        if (_INVALID_CONFIGS.has(version)) {
            return undefined;
        }

        let configBin: any;
        let rawConfig: Types.FullConfig | undefined;
        try {
            configBin = await RES.getResByUrl(
                `resource/config/FullConfig${version}.bin`,
                undefined,
                undefined,
                RES.ResourceItem.TYPE_BIN
            );
            rawConfig = configBin ? ProtoManager.decodeAsFullConfig(configBin) as Types.FullConfig : undefined;
        } catch (e) {
            // nothing to do for now
        }

        if (rawConfig == null) {
            _INVALID_CONFIGS.add(version);
            return undefined;
        }

        const unitPromotionCfg  = _destructUnitPromotionCfg(rawConfig.UnitPromotion);
        const damageChartCfg    = _destructDamageChartCfg(rawConfig.DamageChart);
        const fullCfg           : ExtendedFullConfig = {
            TileCategory        : _destructTileCategoryCfg(rawConfig.TileCategory),
            UnitCategory        : _destructUnitCategoryCfg(rawConfig.UnitCategory),
            TileTemplate        : _destructTileTemplateCfg(rawConfig.TileTemplate, version),
            UnitTemplate        : _destructUnitTemplateCfg(rawConfig.UnitTemplate, version),
            MoveCost            : _destructMoveCostCfg(rawConfig.MoveCost),
            VisionBonus         : _destructVisionBonusCfg(rawConfig.VisionBonus),
            BuildableTile       : _destructBuildableTileCfg(rawConfig.BuildableTile),
            PlayerRank          : _destructPlayerRankCfg(rawConfig.PlayerRank),
            CoBasic             : _destructCoBasicCfg(rawConfig.CoBasic),
            CoSkill             : _destructCoSkillCfg(rawConfig.CoSkill),
            DamageChart         : damageChartCfg,
            UnitPromotion       : unitPromotionCfg,
            maxUnitPromotion    : _getMaxUnitPromotion(unitPromotionCfg),
            secondaryWeaponFlag : _getSecondaryWeaponFlags(damageChartCfg),
        };
        setCachedConfig(version, fullCfg);
        Notify.dispatch(NotifyType.ConfigLoaded);

        return fullCfg;
    }
    export function getCachedConfig(version: string): ExtendedFullConfig | undefined {
        return _ALL_CONFIGS.get(version);
    }
    function setCachedConfig(version: string, config: ExtendedFullConfig) {
        _ALL_CONFIGS.set(version, config);
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType | undefined {
        return CommonConstants.TileTypeMapping.get(baseType)?.get(objectType);
    }

    export function getTileTemplateCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg | undefined {
        const tileType = getTileType(baseType, objectType);
        return tileType == null ? undefined : getTileTemplateCfgByType(version, tileType);
    }
    export function getTileTemplateCfgByType(version: string, tileType: TileType): TileTemplateCfg | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.TileTemplate;
        return cfgDict ? cfgDict[tileType] : undefined;
    }

    export function getTileTypesByCategory(version: string, category: TileCategory): TileType[] | undefined | null {
        const cfgDict = _ALL_CONFIGS.get(version)?.TileCategory;
        return cfgDict ? cfgDict[category]?.tileTypes : undefined;
    }

    export function checkIsValidPlayerIndexForTile(playerIndex: number, baseType: TileBaseType, objectType: TileObjectType): boolean {
        const neutralPlayerIndex = CommonConstants.WarNeutralPlayerIndex;
        if ((playerIndex < neutralPlayerIndex) || (playerIndex > CommonConstants.WarMaxPlayerIndex)) {
            return false;
        }

        if (objectType === TileObjectType.Airport) {
            return true;
        } else if (objectType === TileObjectType.Bridge) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.City) {
            return true;
        } else if (objectType === TileObjectType.CommandTower) {
            return true;
        } else if (objectType === TileObjectType.Empty) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.EmptySilo) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Factory) {
            return true;
        } else if (objectType === TileObjectType.Fire) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.GreenPlasma) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Headquarters) {
            return playerIndex !== neutralPlayerIndex;
        } else if (objectType === TileObjectType.Meteor) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Mist) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Mountain) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Plasma) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Radar) {
            return true;
        } else if (objectType === TileObjectType.Reef) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Road) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Rough) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Ruins) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Seaport) {
            return true;
        } else if (objectType === TileObjectType.Silo) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.TempAirport) {
            return true;
        } else if (objectType === TileObjectType.TempSeaport) {
            return true;
        } else if (objectType === TileObjectType.Wasteland) {
            return playerIndex === neutralPlayerIndex;
        } else if (objectType === TileObjectType.Wood) {
            return playerIndex === neutralPlayerIndex;
        } else {
            return false;
        }
    }

    export function getUnitTemplateCfg(version: string, unitType: UnitType): UnitTemplateCfg | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.UnitTemplate;
        return cfgDict ? cfgDict[unitType] : undefined;
    }

    export function getUnitTypesByCategory(version: string, category: UnitCategory): UnitType[] | undefined | null {
        const cfgDict = _ALL_CONFIGS.get(version)?.UnitCategory;
        return cfgDict ? cfgDict[category]?.unitTypes : undefined;
    }

    export function checkIsUnitTypeInCategory(version: string, unitType: UnitType, category: UnitCategory): boolean {
        const types = getUnitTypesByCategory(version, category);
        return (types != null) && (types.indexOf(unitType) >= 0);
    }

    export function checkIsTileTypeInCategory(version: string, tileType: TileType, category: TileCategory): boolean {
        const types = getTileTypesByCategory(version, category);
        return (types != null) && (types.indexOf(tileType) >= 0);
    }

    export function getUnitMaxPromotion(version: string): number | undefined {
        return _ALL_CONFIGS.get(version)?.maxUnitPromotion;
    }

    export function checkHasSecondaryWeapon(version: string, unitType: UnitType): boolean {
        const cfg = _ALL_CONFIGS.get(version)?.secondaryWeaponFlag;
        return cfg ? cfg[unitType] : false;
    }

    export function getUnitPromotionAttackBonus(version: string, promotion: number): number | undefined {
        const cfg = _ALL_CONFIGS.get(version)?.UnitPromotion;
        return cfg ? cfg[promotion]?.attackBonus : undefined;
    }
    export function getUnitPromotionDefenseBonus(version: string, promotion: number): number | undefined {
        const cfg = _ALL_CONFIGS.get(version)?.UnitPromotion;
        return cfg ? cfg[promotion]?.defenseBonus : undefined;
    }

    export function getDamageChartCfgs(version: string, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.DamageChart;
        return cfgDict ? cfgDict[attackerType] : undefined;
    }

    export function getBuildableTileCfgs(version: string, unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.BuildableTile;
        return cfgDict ? cfgDict[unitType] : undefined;
    }

    export function getVisionBonusCfg(version: string, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.VisionBonus;
        return cfgDict ? cfgDict[unitType] : undefined;
    }

    export function getMoveCostCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } | undefined {
        const tileType = getTileType(baseType, objectType);
        return tileType == null ? undefined : getMoveCostCfgByTileType(version, tileType);
    }
    export function getMoveCostCfgByTileType(version: string, tileType: TileType): { [moveType: number]: MoveCostCfg } | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.MoveCost;
        return cfgDict ? cfgDict[tileType] : undefined;
    }

    export function getTileObjectTypeByTileType(type: TileType): TileObjectType | undefined {
        return CommonConstants.TileTypeToTileObjectType.get(type);
    }

    export function getTileBaseImageSource(
        params: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            baseType    : TileBaseType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string | undefined {
        const { version, skinId, baseType, isDark, shapeId, tickCount } = params;
        if (baseType === TileBaseType.Empty) {
            return undefined;
        }

        const cfgForVersion = CommonConstants.TileBaseFrameConfigs.get(version);
        const cfgForFrame   = cfgForVersion ? cfgForVersion.get(baseType) : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(baseType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileBase_${textForVersion}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }
    }
    export function getTileDecoratorImageSource(
        params: {
            version         : Types.UnitAndTileTextureVersion;
            skinId          : number;
            decoratorType   : TileDecoratorType;
            isDark          : boolean;
            shapeId         : number;
            tickCount       : number;
        },
    ): string | undefined {
        const { version, skinId, decoratorType, isDark, shapeId, tickCount } = params;
        if (decoratorType === TileDecoratorType.Empty) {
            return undefined;
        }

        const cfgForVersion = CommonConstants.TileDecoratorFrameConfigs.get(version);
        const cfgForFrame   = cfgForVersion ? cfgForVersion.get(decoratorType) : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(decoratorType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileDecorator_${textForVersion}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }
    }
    export function getTileObjectImageSource(
        params: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            objectType  : TileObjectType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string | undefined {
        const { version, skinId, objectType, isDark, shapeId, tickCount } = params;
        if (objectType === TileObjectType.Empty) {
            return undefined;
        }

        const cfgForVersion = CommonConstants.TileObjectFrameConfigs.get(version);
        const cfgForFrame   = cfgForVersion ? cfgForVersion.get(objectType) : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(objectType)}`;
            const textForFrame      = ticksPerFrame < Number.MAX_VALUE
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileObject_${textForVersion}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }
    }

    export function getUnitAndTileDefaultSkinId(playerIndex: number): number {
        return playerIndex;
    }

    export function getUnitImageSource(
        { version, skinId, unitType, isDark, isMoving, tickCount }: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            unitType    : UnitType;
            isDark      : boolean;
            isMoving    : boolean;
            tickCount   : number;
        },
    ): string | undefined {
        const cfgForVersion = CommonConstants.UnitImageConfigs.get(version);
        const cfgForUnit    = cfgForVersion ? cfgForVersion.get(unitType) : undefined;
        const cfgForFrame   = cfgForUnit
            ? (isMoving ? cfgForUnit.moving : cfgForUnit.idle)
            : undefined;
        if (cfgForFrame == null) {
            return undefined;
        } else {
            const ticksPerFrame     = cfgForFrame.ticksPerFrame;
            const textForDark       = isDark ? `state01` : `state00`;
            const textForMoving     = isMoving ? `act01` : `act00`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(unitType)}`;
            const textForFrame      = `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`;
            return `unit_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
        }
    }

    export function getRankName(version: string, rankScore: number): string | undefined {
        const cfg = getPlayerRankCfg(version, rankScore);
        return cfg ? Lang.getStringInCurrentLanguage(cfg.nameList) : undefined;
    }
    export function getPlayerRankCfg(version: string, rankScore: number): PlayerRankCfg | undefined {
        const cfgs = _ALL_CONFIGS.get(version)?.PlayerRank;
        if (cfgs == null) {
            return undefined;
        }

        let maxRank = -1;
        let maxCfg  : PlayerRankCfg | undefined;
        for (const i in cfgs) {
            const currCfg   = cfgs[i];
            const currRank  = currCfg.rank;
            if ((rankScore >= currCfg.minScore) && (currRank > maxRank)) {
                maxRank = currRank;
                maxCfg  = currCfg;
            }
        }
        return maxCfg;
    }

    export function getCoBasicCfg(version: string, coId: number): CoBasicCfg | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.CoBasic;
        return cfgDict ? cfgDict[coId] : undefined;
    }
    export function getAllCoBasicCfgDict(version: string): { [coId: number]: CoBasicCfg } | null | undefined {
        return _ALL_CONFIGS.get(version)?.CoBasic;
    }
    export function getCoNameAndTierText(version: string, coId: number | null | undefined): string | undefined {
        const coConfig = coId == null ? null : getCoBasicCfg(version, coId);
        return coConfig
            // ? `(${coConfig.name}(T${coConfig.tier}))`
            ? `${coConfig.name}`
            : undefined;
    }
    export function getCoType(version: string, coId: number): Types.CoType {
        const maxLoadCount = getCoBasicCfg(version, coId)?.maxLoadCount;
        if (maxLoadCount == null) {
            return Types.CoType.Undefined;
        } else {
            return maxLoadCount > 0 ? Types.CoType.Zoned : Types.CoType.Global;
        }
    }

    export function getCoSkillCfg(version: string, skillId: number): CoSkillCfg | undefined {
        const cfgDict = _ALL_CONFIGS.get(version)?.CoSkill;
        return cfgDict ? cfgDict[skillId] : undefined;
    }
    export function getCoSkillArray(version: string, coId: number, skillType: Types.CoSkillType): number[] | null | undefined {
        const coConfig = getCoBasicCfg(version, coId);
        if (coConfig == null) {
            return undefined;
        } else {
            switch (skillType) {
                case Types.CoSkillType.Passive      : return coConfig.passiveSkills;
                case Types.CoSkillType.Power        : return coConfig.powerSkills;
                case Types.CoSkillType.SuperPower   : return coConfig.superPowerSkills;
                default                             : return undefined;
            }
        }
    }
    export function getCoSkillDescArray(version: string, coId: number, skillType: Types.CoSkillType): string[] | null | undefined {
        const coConfig = getCoBasicCfg(version, coId);
        if (coConfig == null) {
            return undefined;
        } else {
            switch (skillType) {
                case Types.CoSkillType.Passive      : return coConfig.passiveDesc;
                case Types.CoSkillType.Power        : return coConfig.copDesc;
                case Types.CoSkillType.SuperPower   : return coConfig.scopDesc;
                default                             : return undefined;
            }
        }
    }

    export function getEnabledCoArray(version: string): CoBasicCfg[] {
        const currentArray = _AVAILABLE_CO_LIST.get(version);
        if (currentArray) {
            return currentArray;
        } else {
            const coArray   : CoBasicCfg[] = [];
            const cfgs      = _ALL_CONFIGS.get(version)?.CoBasic;
            if (cfgs != null) {
                for (const k in cfgs || {}) {
                    const cfg = cfgs[k];
                    if (cfg.isEnabled) {
                        coArray.push(cfg);
                    }
                }

                coArray.sort((c1, c2) => {
                    const name1 = c1.name;
                    const name2 = c2.name;
                    if (name1 !== name2) {
                        return name1.localeCompare(name2, "zh");
                    } else {
                        return c1.tier - c2.tier;
                    }
                });
            }

            _AVAILABLE_CO_LIST.set(version, coArray);
            return coArray;
        }
    }

    export function getCoTiers(version: string): number[] {
        const currentArray = _CO_TIERS.get(version);
        if (currentArray) {
            return currentArray;
        } else {
            const tierSet = new Set<number>();
            for (const cfg of getEnabledCoArray(version)) {
                tierSet.add(cfg.tier);
            }

            const tierArray = Array.from(tierSet).sort((v1, v2) => v1 - v2);
            _CO_TIERS.set(version, tierArray);
            return tierArray;
        }
    }

    export function getEnabledCoIdListInTier(version: string, tier: number): number[] {
        if (!_CO_ID_LIST_IN_TIER.has(version)) {
            _CO_ID_LIST_IN_TIER.set(version, new Map<number, number[]>());
        }

        const cfgs = _CO_ID_LIST_IN_TIER.get(version);
        if (cfgs == null) {
            Logger.error(`ConfigManager.getEnabledCoIdListInTier() empty cfgs.`);
            return [];
        }

        const currentIdArray = cfgs.get(tier);
        if (currentIdArray) {
            return currentIdArray;
        } else {
            const idArray: number[] = [];
            for (const cfg of getEnabledCoArray(version)) {
                if (cfg.tier === tier) {
                    idArray.push(cfg.coId);
                }
            }
            cfgs.set(tier, idArray);
            return idArray;
        }
    }
    export function getEnabledCustomCoIdList(version: string): number[] {
        const currentIdArray = _CUSTOM_CO_ID_LIST.get(version);
        if (currentIdArray) {
            return currentIdArray;
        } else {
            const idArray: number[] = [];
            for (const cfg of getEnabledCoArray(version)) {
                if (cfg.designer !== "Intelligent Systems") {
                    idArray.push(cfg.coId);
                }
            }
            _CUSTOM_CO_ID_LIST.set(version, idArray);
            return idArray;
        }
    }

    export function getCoBustImageSource(coId: number): string | undefined {
        return coId == null
            ? undefined
            : `coBust${Helpers.getNumText(Math.floor(coId / 10000), 4)}`;
    }
    export function getCoHeadImageSource(coId: number): string | undefined {
        return coId == null
            ? undefined
            : `coHead${Helpers.getNumText(Math.floor(coId / 10000), 4)}`;
    }

    export function checkIsUnitDivingByDefault(version: string, unitType: UnitType): boolean | undefined {
        const templateCfg = getUnitTemplateCfg(version, unitType);
        if (templateCfg == null) {
            Logger.error(`ConfigManager.checkIsUnitDivingByDefault() empty templateCfg.`);
            return undefined;
        }
        return checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg);
    }
    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
    }

    export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: number | null | undefined): boolean {
        if (tileObjectType === TileObjectType.Empty) {
            return !shapeId;
        } else {
            const cfg = CommonConstants.TileObjectShapeConfigs.get(tileObjectType);
            return (!!cfg)
                && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
        }
    }
    export function checkIsValidTileBaseShapeId(tileBaseType: TileBaseType, shapeId: number | null | undefined): boolean {
        const cfg = CommonConstants.TileBaseShapeConfigs.get(tileBaseType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
    export function checkIsValidTileDecoratorShapeId(type: TileDecoratorType | null | undefined, shapeId: number | null | undefined): boolean {
        if (type == null) {
            return shapeId == null;
        }

        const cfg = CommonConstants.TileDecoratorShapeConfigs.get(type);
        return (cfg != null)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }

    export function getSymmetricalTileBaseShapeId(baseType: TileBaseType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileBaseSymmetry.get(baseType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function getSymmetricalTileDecoratorShapeId(decoratorType: TileDecoratorType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileDecoratorSymmetry.get(decoratorType);
        const shapeIdList   = cfg ? cfg.get(shapeId) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function getSymmetricalTileObjectShapeId(objectType: TileObjectType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileObjectSymmetry.get(objectType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function checkIsTileBaseSymmetrical(params: {
        baseType    : TileBaseType;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileBaseShapeId(params.baseType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
    export function checkIsTileDecoratorSymmetrical(params: {
        decoratorType   : TileDecoratorType;
        shapeId1        : number | null | undefined;
        shapeId2        : number | null | undefined;
        symmetryType    : Types.SymmetryType;
    }): boolean {
        const { shapeId1, shapeId2 } = params;
        if (shapeId1 == null) {
            return shapeId2 == null;
        } else if (shapeId2 == null) {
            return shapeId1 == null;
        } else {
            return getSymmetricalTileDecoratorShapeId(params.decoratorType, shapeId1, params.symmetryType) === shapeId2;
        }
    }
    export function checkIsTileObjectSymmetrical(params: {
        objectType  : TileObjectType;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileObjectShapeId(params.objectType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
}

export default ConfigManager;
