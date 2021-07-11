
import * as Types           from "./Types";
import * as ProtoTypes      from "./ProtoTypes";
import * as ProtoManager    from "./ProtoManager";
import * as Notify          from "./Notify";
import { NotifyType } from "./NotifyType";
import * as CommonConstants from "./CommonConstants";
import * as Helpers         from "./Helpers";
import * as Lang            from "./Lang";
import * as Logger          from "./Logger";
import TileBaseType         = Types.TileBaseType;
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
import ITileCategoryCfg     = ProtoTypes.Config.ITileCategoryCfg;
import UnitCategoryCfg      = ProtoTypes.Config.IUnitCategoryCfg;
import MoveCostCfg          = ProtoTypes.Config.IMoveCostCfg;
import UnitPromotionCfg     = ProtoTypes.Config.IUnitPromotionCfg;
import IPlayerRankCfg       = ProtoTypes.Config.IPlayerRankCfg;
import CoSkillCfg           = ProtoTypes.Config.ICoSkillCfg;

////////////////////////////////////////////////////////////////////////////////
// Internal types.
////////////////////////////////////////////////////////////////////////////////
type ExtendedFullConfig = {
    TileCategory            : { [category: number]: ITileCategoryCfg };
    UnitCategory            : { [category: number]: UnitCategoryCfg };
    TileTemplate            : { [tileType: number]: TileTemplateCfg };
    UnitTemplate            : { [unitType: number]: UnitTemplateCfg };
    DamageChart             : { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } };
    MoveCost                : { [tileType: number]: { [moveType: number]: MoveCostCfg } };
    UnitPromotion           : { [promotion: number]: UnitPromotionCfg };
    VisionBonus             : { [unitType: number]: { [tileType: number]: VisionBonusCfg } };
    BuildableTile           : { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } };
    PlayerRank              : { [minScore: number]: IPlayerRankCfg };
    CoBasic                 : { [coId: number]: CoBasicCfg };
    CoSkill                 : { [skillId: number]: CoSkillCfg };
    maxUnitPromotion?       : number;
    secondaryWeaponFlag?    : { [unitType: number]: boolean };
};

////////////////////////////////////////////////////////////////////////////////
// Initializers.
////////////////////////////////////////////////////////////////////////////////
function _destructTileCategoryCfg(data: ITileCategoryCfg[]): { [category: number]: ITileCategoryCfg } {
    const dst: { [category: number]: ITileCategoryCfg } = {};
    for (const d of data) {
        dst[d.category!] = d;
    }
    return dst;
}
function _destructUnitCategoryCfg(data: UnitCategoryCfg[]): { [category: number]: UnitCategoryCfg } {
    const dst: { [category: number]: UnitCategoryCfg } = {};
    for (const d of data) {
        dst[d.category!] = d;
    }
    return dst;
}
function _destructTileTemplateCfg(data: TileTemplateCfg[], version: string): { [tileType: number]: TileTemplateCfg } {
    const dst: { [category: number]: TileTemplateCfg } = {};
    for (const d of data) {
        d.version       = version;
        dst[d.type!]    = d;
    }
    return dst;
}
function _destructUnitTemplateCfg(data: UnitTemplateCfg[], version: string): { [unitType: number]: UnitTemplateCfg } {
    const dst: { [category: number]: UnitTemplateCfg } = {};
    for (const d of data) {
        d.version       = version;
        dst[d.type!]    = d;
    }
    return dst;
}
function _destructDamageChartCfg(data: DamageChartCfg[]): { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } {
    const dst: { [attackerType: number]: { [armorType: number]: { [weaponType: number]: DamageChartCfg } } } = {};
    for (const d of data) {
        const attackerType  = d.attackerType!;
        const armorType     = d.armorType!;
        dst[attackerType]                           = dst[attackerType] || {};
        dst[attackerType][armorType]                = dst[attackerType][armorType] || {};
        dst[attackerType][armorType][d.weaponType!] = d;
    }
    return dst;
}
function _destructMoveCostCfg(data: MoveCostCfg[]): { [tileType: number]: { [moveType: number]: MoveCostCfg } } {
    const dst: { [tileType: number]: { [moveType: number]: MoveCostCfg } } = {};
    for (const d of data) {
        const tileType              = d.tileType!;
        dst[tileType]               = dst[tileType] || {};
        dst[tileType][d.moveType!]  = d;
    }
    return dst;
}
function _destructUnitPromotionCfg(data: UnitPromotionCfg[]): { [promotion: number]: UnitPromotionCfg } {
    const dst: { [promotion: number]: UnitPromotionCfg } = {};
    for (const d of data) {
        dst[d.promotion!] = d;
    }
    return dst;
}
function _destructVisionBonusCfg(data: VisionBonusCfg[]): { [unitType: number]: { [tileType: number]: VisionBonusCfg } } {
    const dst: { [unitType: number]: { [tileType: number]: VisionBonusCfg } } = {};
    for (const d of data) {
        const unitType              = d.unitType!;
        dst[unitType]               = dst[unitType] || {};
        dst[unitType][d.tileType!]  = d;
    }
    return dst;
}
function _destructBuildableTileCfg(
    data: BuildableTileCfg[]
): { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } {
    const dst: { [unitType: number]: { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } } = {};
    for (const d of data) {
        const unitType                                  = d.unitType!;
        const srcBaseType                               = d.srcBaseType!;
        dst[unitType]                                   = dst[unitType] || {};
        dst[unitType][srcBaseType]                      = dst[unitType][srcBaseType] || {};
        dst[unitType][srcBaseType][d.srcObjectType!]    = d;
    }
    return dst;
}
function _destructPlayerRankCfg(data: IPlayerRankCfg[]): { [minScore: number]: IPlayerRankCfg } {
    const dst: { [minScore: number]: IPlayerRankCfg } = {};
    for (const d of data) {
        dst[d.minScore!] = d;
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

const _CACHED_CONFIGS       = new Map<string, ExtendedFullConfig>();
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
    let rawConfig: Types.FullConfig;
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
    return _CACHED_CONFIGS.get(version);
}
function setCachedConfig(version: string, config: ExtendedFullConfig) {
    _CACHED_CONFIGS.set(version, config);
}

export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
    return CommonConstants.TileTypeMapping.get(baseType)!.get(objectType)!;
}

export function getTileTemplateCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
    return _CACHED_CONFIGS.get(version)!.TileTemplate[getTileType(baseType, objectType)];
}
export function getTileTemplateCfgByType(version: string, tileType: TileType): TileTemplateCfg {
    return _CACHED_CONFIGS.get(version)!.TileTemplate[tileType];
}

export function getTileTypesByCategory(version: string, category: TileCategory): TileType[] | undefined | null {
    return _CACHED_CONFIGS.get(version)!.TileCategory[category].tileTypes;
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

export function getUnitTemplateCfg(version: string, unitType: UnitType): UnitTemplateCfg {
    return _CACHED_CONFIGS.get(version)!.UnitTemplate[unitType];
}

export function getUnitTypesByCategory(version: string, category: UnitCategory): UnitType[] | undefined | null {
    return _CACHED_CONFIGS.get(version)!.UnitCategory[category].unitTypes;
}

export function checkIsUnitTypeInCategory(version: string, unitType: UnitType, category: UnitCategory): boolean {
    const types = getUnitTypesByCategory(version, category);
    return (types != null) && (types.indexOf(unitType) >= 0);
}

export function checkIsTileTypeInCategory(version: string, tileType: TileType, category: TileCategory): boolean {
    const types = getTileTypesByCategory(version, category);
    return (types != null) && (types.indexOf(tileType) >= 0);
}

export function getUnitMaxPromotion(version: string): number {
    return _CACHED_CONFIGS.get(version)!.maxUnitPromotion!;
}

export function checkHasSecondaryWeapon(version: string, unitType: UnitType): boolean {
    return _CACHED_CONFIGS.get(version)!.secondaryWeaponFlag![unitType];
}

export function getUnitPromotionAttackBonus(version: string, promotion: number): number {
    return _CACHED_CONFIGS.get(version)!.UnitPromotion![promotion].attackBonus!;
}

export function getUnitPromotionDefenseBonus(version: string, promotion: number): number {
    return _CACHED_CONFIGS.get(version)!.UnitPromotion![promotion].defenseBonus!;
}

export function getDamageChartCfgs(version: string, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
    return _CACHED_CONFIGS.get(version)!.DamageChart[attackerType];
}

export function getBuildableTileCfgs(version: string, unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | undefined {
    return _CACHED_CONFIGS.get(version)!.BuildableTile[unitType];
}

export function getVisionBonusCfg(version: string, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | undefined {
    return _CACHED_CONFIGS.get(version)!.VisionBonus[unitType];
}

export function getMoveCostCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
    return _CACHED_CONFIGS.get(version)!.MoveCost[getTileType(baseType, objectType)];
}
export function getMoveCostCfgByTileType(version: string, tileType: TileType): { [moveType: number]: MoveCostCfg } {
    return _CACHED_CONFIGS.get(version)!.MoveCost[tileType];
}

export function getTileObjectTypeByTileType(type: TileType): TileObjectType {
    return CommonConstants.TileTypeToTileObjectType.get(type)!;
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
): string {
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
export function getTileObjectImageSource(
    params: {
        version     : Types.UnitAndTileTextureVersion;
        skinId      : number;
        objectType  : TileObjectType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    },
): string {
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

export function getRankName(version: string, rankScore: number): string {
    const cfg = getPlayerRankCfg(version, rankScore);
    return cfg ? Lang.getStringInCurrentLanguage(cfg.nameList) : undefined;
}
export function getPlayerRankCfg(version: string, rankScore: number): IPlayerRankCfg {
    const cfgs  = _CACHED_CONFIGS.get(version)!.PlayerRank;
    let maxRank = -1;
    let maxCfg  : IPlayerRankCfg;

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

export function getCoBasicCfg(version: string, coId: number): CoBasicCfg | null {
    return _CACHED_CONFIGS.get(version)!.CoBasic[coId];
}
export function getAllCoBasicCfgDict(version: string): { [coId: number]: CoBasicCfg } | null | undefined {
    return _CACHED_CONFIGS.get(version)!.CoBasic;
}
export function getCoNameAndTierText(version: string, coId: number | null): string {
    const coConfig = coId == null ? null : getCoBasicCfg(version, coId);
    return coConfig
        // ? `(${coConfig.name}(T${coConfig.tier}))`
        ? `${coConfig.name}`
        : undefined;
}

export function getCoSkillCfg(version: string, skillId: number): CoSkillCfg | null {
    return _CACHED_CONFIGS.get(version)!.CoSkill[skillId];
}
export function getCoSkillArray(version: string, coId: number, skillType: Types.CoSkillType): number[] | undefined {
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

export function getEnabledCoArray(version: string): CoBasicCfg[] {
    if (!_AVAILABLE_CO_LIST.has(version)) {
        const list: CoBasicCfg[] = [];
        const cfgs = _CACHED_CONFIGS.get(version)!.CoBasic;
        for (const k in cfgs || {}) {
            const cfg = cfgs[k];
            if (cfg.isEnabled) {
                list.push(cfg);
            }
        }

        list.sort((c1, c2) => {
            if (c1.name !== c2.name) {
                return c1.name < c2.name ? -1 : 1;
            } else {
                return c1.tier - c2.tier;
            }
        });
        _AVAILABLE_CO_LIST.set(version, list);
    }
    return _AVAILABLE_CO_LIST.get(version);
}

export function getCoTiers(version: string): number[] {
    if (!_CO_TIERS.has(version)) {
        const tiers = new Set<number>();
        for (const cfg of getEnabledCoArray(version)) {
            tiers.add(cfg.tier);
        }
        _CO_TIERS.set(version, Array.from(tiers).sort((v1, v2) => v1 - v2));
    }
    return _CO_TIERS.get(version);
}

export function getEnabledCoIdListInTier(version: string, tier: number): number[] {
    if (!_CO_ID_LIST_IN_TIER.has(version)) {
        _CO_ID_LIST_IN_TIER.set(version, new Map<number, number[]>());
    }

    const cfgs = _CO_ID_LIST_IN_TIER.get(version);
    if (!cfgs.get(tier)) {
        const idList: number[] = [];
        for (const cfg of getEnabledCoArray(version)) {
            if (cfg.tier === tier) {
                idList.push(cfg.coId);
            }
        }
        cfgs.set(tier, idList);
    }
    return cfgs.get(tier);
}
export function getEnabledCustomCoIdList(version: string): number[] {
    if (!_CUSTOM_CO_ID_LIST.has(version)) {
        const idList: number[] = [];
        for (const cfg of getEnabledCoArray(version)) {
            if (cfg.designer !== "Intelligent Systems") {
                idList.push(cfg.coId);
            }
        }
        _CUSTOM_CO_ID_LIST.set(version, idList);
    }
    return _CUSTOM_CO_ID_LIST.get(version);
}

export function getCoBustImageSource(coId: number): string {
    return coId == null
        ? null
        : `coBust${Helpers.getNumText(Math.floor(coId / 10000), 4)}`;
}
export function getCoHeadImageSource(coId: number): string {
    return coId == null
        ? null
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

export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: number): boolean {
    if (tileObjectType === TileObjectType.Empty) {
        return !shapeId;
    } else {
        const cfg = CommonConstants.TileObjectShapeConfigs.get(tileObjectType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
}
export function checkIsValidTileBaseShapeId(tileBaseType: TileBaseType, shapeId: number): boolean {
    const cfg = CommonConstants.TileBaseShapeConfigs.get(tileBaseType);
    return (!!cfg)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
}

export function getSymmetricalTileBaseShapeId(baseType: TileBaseType, shapeId: number, symmetryType: Types.SymmetryType): number | null {
    const cfg           = CommonConstants.TileBaseSymmetry.get(baseType);
    const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
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
export function checkIsTileObjectSymmetrical(params: {
    objectType  : TileObjectType;
    shapeId1    : number;
    shapeId2    : number;
    symmetryType: Types.SymmetryType;
}): boolean {
    return getSymmetricalTileObjectShapeId(params.objectType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
}
