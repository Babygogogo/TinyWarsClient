
// import Lang             from "../lang/Lang";
// import Notify           from "../notify/Notify";
// import TwnsNotifyType   from "../notify/NotifyType";
// import ProtoManager     from "../proto/ProtoManager";
// import CommonConstants  from "./CommonConstants";
// import Helpers          from "./Helpers";
// import Types            from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ConfigManager {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
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
    import SystemCfg            = Types.SystemCfg;
    import TileCategoryCfg      = Types.TileCategoryCfg;
    import UnitCategoryCfg      = Types.UnitCategoryCfg;
    import MoveCostCfg          = Types.MoveCostCfg;
    import UnitPromotionCfg     = Types.UnitPromotionCfg;
    import PlayerRankCfg        = Types.PlayerRankCfg;
    import CoSkillCfg           = Types.CoSkillCfg;
    import WeatherCfg           = Types.WeatherCfg;
    import WeatherCategoryCfg   = Types.WeatherCategoryCfg;
    import UserAvatarCfg        = Types.UserAvatarCfg;

    ////////////////////////////////////////////////////////////////////////////////
    // Internal types.
    ////////////////////////////////////////////////////////////////////////////////
    type ExtendedFullConfig = {
        System                  : SystemCfg;
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
        Weather                 : { [weatherType: number]: WeatherCfg };
        WeatherCategory         : { [category: number]: WeatherCategoryCfg };
        UserAvatar              : { [avatarId: number]: UserAvatarCfg };
        maxUnitPromotion?       : number;
        secondaryWeaponFlag?    : { [unitType: number]: boolean };
    };

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    function _destructSystemCfg(data: SystemCfg): SystemCfg {
        return Helpers.deepClone(data);
    }
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
    function _destructWeatherCfg(data: WeatherCfg[]): { [weatherType: number]: WeatherCfg } {
        const dst: { [weatherType: number]: WeatherCfg } = {};
        for (const d of data) {
            dst[d.weatherType] = d;
        }
        return dst;
    }
    function _destructWeatherCategoryCfg(data: WeatherCategoryCfg[]): { [category: number]: WeatherCategoryCfg } {
        const dst: { [category: number]: WeatherCategoryCfg } = {};
        for (const d of data) {
            dst[d.category] = d;
        }
        return dst;
    }
    function _destructUserAvatarCfg(data: UserAvatarCfg[]): { [avatarId: number]: UserAvatarCfg } {
        const dst: { [avatarId: number]: UserAvatarCfg } = {};
        for (const d of data) {
            dst[d.avatarId] = d;
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

    const _ALL_CONFIGS          = new Map<string, ExtendedFullConfig>();
    const _INVALID_CONFIGS      = new Set<string>();
    const _AVAILABLE_CO_LIST    = new Map<string, CoBasicCfg[]>();
    const _CO_TIERS             = new Map<string, number[]>();
    const _CO_ID_LIST_IN_TIER   = new Map<string, Map<number, number[]>>();
    const _CUSTOM_CO_ID_LIST    = new Map<string, number[]>();
    let _latestConfigVersion    : string | null = null;

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function init(): void {
        // nothing to do.
    }

    export function getLatestConfigVersion(): string | null {
        return _latestConfigVersion;
    }
    export function setLatestFormalVersion(version: string): void {
        _latestConfigVersion = version;
    }
    export async function checkIsVersionValid(version: string): Promise<boolean> {
        return (await loadConfig(version)) != null;
    }

    export async function loadConfig(version: string): Promise<ExtendedFullConfig | null> {
        const cachedConfig = getCachedConfig(version);
        if (cachedConfig) {
            return cachedConfig;
        }

        if (_INVALID_CONFIGS.has(version)) {
            return null;
        }

        let rawConfig   : Types.FullConfig | null = null;
        const configBin = await RES.getResByUrl(
            `resource/config/FullConfig${version}.bin`,
            void 0,
            null,
            RES.ResourceItem.TYPE_BIN
        );
        rawConfig = configBin ? ProtoManager.decodeAsFullConfig(configBin) as Types.FullConfig : null;

        if (rawConfig == null) {
            _INVALID_CONFIGS.add(version);
            return null;
        }

        const unitPromotionCfg  = _destructUnitPromotionCfg(rawConfig.UnitPromotion);
        const damageChartCfg    = _destructDamageChartCfg(rawConfig.DamageChart);
        const fullCfg           : ExtendedFullConfig = {
            System              : _destructSystemCfg(rawConfig.System),
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
            Weather             : _destructWeatherCfg(rawConfig.Weather),
            WeatherCategory     : _destructWeatherCategoryCfg(rawConfig.WeatherCategory),
            UserAvatar          : _destructUserAvatarCfg(rawConfig.UserAvatar),
            DamageChart         : damageChartCfg,
            UnitPromotion       : unitPromotionCfg,
            maxUnitPromotion    : _getMaxUnitPromotion(unitPromotionCfg),
            secondaryWeaponFlag : _getSecondaryWeaponFlags(damageChartCfg),
        };
        setCachedConfig(version, fullCfg);
        Notify.dispatch(NotifyType.ConfigLoaded);

        return fullCfg;
    }
    export function getCachedConfig(version: string): ExtendedFullConfig | null {
        return _ALL_CONFIGS.get(version) ?? null;
    }
    function setCachedConfig(version: string, config: ExtendedFullConfig) {
        _ALL_CONFIGS.set(version, config);
    }

    function getSystemCfg(version: string): SystemCfg {
        return Helpers.getExisted(_ALL_CONFIGS.get(version)?.System, ClientErrorCode.ConfigManager_GetSystemCfg_00);
    }
    export function getSystemEnergyGrowthMultiplierForAttacker(version: string): number {
        return Helpers.getExisted(getSystemCfg(version).energyGrowthMultiplierArray[0], ClientErrorCode.ConfigManager_GetSystemEnergyGrowthMultiplierForAttacker_00);
    }
    export function getSystemEnergyGrowthMultiplierForDefender(version: string): number {
        return Helpers.getExisted(getSystemCfg(version).energyGrowthMultiplierArray[1], ClientErrorCode.ConfigManager_GetSystemEnergyGrowthMultiplierForDefender_00);
    }

    export function getSystemMaxBanCoCount(version: string): number {
        return Helpers.getExisted(getSystemCfg(version).maxBanCount, ClientErrorCode.ConfigManager_GetSystemMaxBanCoCount_00);
    }
    export function getSystemDialogueBackgroundMaxId(version: string): number {
        return Helpers.getExisted(getSystemCfg(version).dialogueBackgroundMaxId, ClientErrorCode.ConfigManager_GetSystemDialogueBackgroundMaxId_00);
    }
    export function getSystemGlobalCoEnergyParameters(version: string): number[] {
        return Helpers.getExisted(getSystemCfg(version).globalCoEnergyParameters, ClientErrorCode.ConfigManager_GetSystemGlobalCoEnergyParameters_00);
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        const mapping = Helpers.getExisted(CommonConstants.TileTypeMapping.get(baseType), ClientErrorCode.ConfigManager_GetTileType_00);
        return Helpers.getExisted(mapping.get(objectType), ClientErrorCode.ConfigManager_GetTileType_01);
    }

    export function getTileTemplateCfgByType(version: string, tileType: TileType): TileTemplateCfg {
        const dict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.TileTemplate, ClientErrorCode.ConfigManager_GetTileTemplateCfgByType_00);
        return Helpers.getExisted(dict[tileType], ClientErrorCode.ConfigManager_GetTileTemplateCfgByType_01);
    }
    export function getTileTemplateCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): TileTemplateCfg {
        return getTileTemplateCfgByType(version, getTileType(baseType, objectType));
    }

    export function getTileTypesByCategory(version: string, category: TileCategory): TileType[] {
        const dict  = Helpers.getExisted(_ALL_CONFIGS.get(version)?.TileCategory, ClientErrorCode.ConfigManager_GetTileTypesByCategory_00);
        const cfg   = Helpers.getExisted(dict[category], ClientErrorCode.ConfigManager_GetTileTypesByCategory_01);
        return cfg.tileTypes ?? [];
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
        } else if (objectType === TileObjectType.Pipe) {
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
        } else if (objectType === TileObjectType.Crystal) {
            return true;
        } else if (objectType === TileObjectType.CustomCrystal) {
            return true;
        } else if (objectType === TileObjectType.CannonUp) {
            return true;
        } else if (objectType === TileObjectType.CannonDown) {
            return true;
        } else if (objectType === TileObjectType.CannonLeft) {
            return true;
        } else if (objectType === TileObjectType.CannonRight) {
            return true;
        } else if (objectType === TileObjectType.CustomCannon) {
            return true;
        } else if (objectType === TileObjectType.LaserTurret) {
            return true;
        } else if (objectType === TileObjectType.CustomLaserTurret) {
            return true;
        } else if (objectType === TileObjectType.PipeJoint) {
            return playerIndex === neutralPlayerIndex;
        } else {
            return false;
        }
    }

    export function checkIsValidTurnPhaseCode(turnPhaseCode: Types.TurnPhaseCode): boolean {
        return (turnPhaseCode === Types.TurnPhaseCode.Main)
            || (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn);
    }
    export function checkIsValidWeatherType(weatherType: Types.WeatherType): boolean {
        return _ALL_CONFIGS.get(Helpers.getExisted(getLatestConfigVersion()))?.Weather[weatherType] != null;
    }
    export function checkIsValidTileType(tileType: Types.TileType): boolean {
        return _ALL_CONFIGS.get(Helpers.getExisted(getLatestConfigVersion()))?.TileTemplate[tileType] != null;
    }
    export function checkIsValidUnitType(unitType: UnitType): boolean {
        return _ALL_CONFIGS.get(Helpers.getExisted(getLatestConfigVersion()))?.UnitTemplate[unitType] != null;
    }
    export function checkIsValidUnitTypeSubset(unitTypeArray: UnitType[]): boolean {
        return ((new Set(unitTypeArray)).size === unitTypeArray.length)
            && (unitTypeArray.every(v => checkIsValidUnitType(v)));
    }
    export function checkIsValidCustomCrystalData(data: ProtoTypes.WarSerialization.ITileCustomCrystalData): boolean {
        return (data.radius != null)
            && (data.priority != null)
            && ((data.canAffectAlly ?? data.canAffectEnemy ?? data.canAffectSelf) != null)
            && ((data.deltaFuelPercentage ?? data.deltaHp ?? data.deltaPrimaryAmmoPercentage ?? data.deltaFund ?? data.deltaEnergyPercentage) != null);
    }
    export function checkIsValidCustomCannonData(data: ProtoTypes.WarSerialization.ITileCustomCannonData): boolean {
        return (!!(data.rangeForDown ?? data.rangeForLeft ?? data.rangeForRight ?? data.rangeForUp))
            && (data.priority != null)
            && (!!data.maxTargetCount)
            && ((data.canAffectAlly ?? data.canAffectEnemy ?? data.canAffectSelf) != null)
            && ((data.deltaFuelPercentage ?? data.deltaHp ?? data.deltaPrimaryAmmoPercentage) != null);
    }
    export function checkIsValidCustomLaserTurretData(data: ProtoTypes.WarSerialization.ITileCustomLaserTurretData): boolean {
        return (!!(data.rangeForDown ?? data.rangeForLeft ?? data.rangeForRight ?? data.rangeForUp))
            && (data.priority != null)
            && ((data.canAffectAlly ?? data.canAffectEnemy ?? data.canAffectSelf) != null)
            && ((data.deltaFuelPercentage ?? data.deltaHp ?? data.deltaPrimaryAmmoPercentage) != null);
    }
    export function checkIsValidPlayerIndex(playerIndex: number, playersCountUnneutral: number): boolean {
        return (playerIndex >= CommonConstants.WarNeutralPlayerIndex)
            && (playerIndex <= playersCountUnneutral);
    }
    export function checkIsValidPlayerIndexSubset(playerIndexArray: number[], playersCountUnneutral: number): boolean {
        return ((new Set(playerIndexArray)).size === playerIndexArray.length)
            && (playerIndexArray.every(v => checkIsValidPlayerIndex(v, playersCountUnneutral)));
    }
    export function checkIsValidTeamIndex(teamIndex: number, playersCountUnneutral: number): boolean {
        return (teamIndex >= CommonConstants.WarNeutralTeamIndex)
            && (teamIndex <= playersCountUnneutral);
    }
    export function checkIsValidTeamIndexSubset(teamIndexArray: number[], playersCountUnneutral: number): boolean {
        return ((new Set(teamIndexArray)).size === teamIndexArray.length)
            && (teamIndexArray.every(v => checkIsValidTeamIndex(v, playersCountUnneutral)));
    }
    export function checkIsValidGridIndexSubset(gridIndexArray: ProtoTypes.Structure.IGridIndex[], mapSize: Types.MapSize): boolean {
        const gridIdSet = new Set<number>();
        for (const g of gridIndexArray) {
            const gridIndex = GridIndexHelpers.convertGridIndex(g);
            if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                return false;
            }

            const gridId = GridIndexHelpers.getGridId(gridIndex, mapSize);
            if (gridIdSet.has(gridId)) {
                return false;
            }
            gridIdSet.add(gridId);
        }

        return true;
    }
    export function checkIsValidLocationId(locationId: number): boolean {
        return (locationId >= CommonConstants.MapMinLocationId)
            && (locationId <= CommonConstants.MapMaxLocationId);
    }
    export function checkIsValidLocationIdSubset(locationIdArray: number[]): boolean {
        return ((new Set(locationIdArray)).size === locationIdArray.length)
            && (locationIdArray.every(v => checkIsValidLocationId(v)));
    }
    export function checkIsValidCustomCounterId(customCounterId: number): boolean {
        return (customCounterId >= CommonConstants.WarCustomCounterMinId)
            && (customCounterId <= CommonConstants.WarCustomCounterMaxId);
    }
    export function checkIsValidCustomCounterValue(customCounterValue: number): boolean {
        return (customCounterValue <= CommonConstants.WarCustomCounterMaxValue)
            && (customCounterValue >= -CommonConstants.WarCustomCounterMaxValue);
    }
    export function checkIsValidCustomCounterIdArray(idArray: number[]): boolean {
        return (idArray.every(v => checkIsValidCustomCounterId(v)))
            && (new Set(idArray).size === idArray.length);
    }
    export function checkIsValidCustomCounterArray(customCounterArray: ProtoTypes.WarSerialization.ICustomCounter[]): boolean {
        const counterIdSet = new Set<number>();
        for (const data of customCounterArray) {
            const counterId     = data.customCounterId;
            const counterValue  = data.customCounterValue;
            if ((counterId == null)                                 ||
                (!checkIsValidCustomCounterId(counterId))           ||
                (counterValue == null)                              ||
                (!checkIsValidCustomCounterValue(counterValue))     ||
                (counterIdSet.has(counterId))
            ) {
                return false;
            }

            counterIdSet.add(counterId);
        }

        return true;
    }
    export function checkIsValidUnitAiMode(mode: Types.UnitAiMode): boolean {
        return (mode === Types.UnitAiMode.NoMove)
            || (mode === Types.UnitAiMode.Normal)
            || (mode === Types.UnitAiMode.WaitUntilCanAttack);
    }
    export function checkIsValidValueComparator(comparator: Types.ValueComparator): boolean {
        return (comparator === Types.ValueComparator.EqualTo)
            || (comparator === Types.ValueComparator.NotEqualTo)
            || (comparator === Types.ValueComparator.GreaterThan)
            || (comparator === Types.ValueComparator.NotGreaterThan)
            || (comparator === Types.ValueComparator.LessThan)
            || (comparator === Types.ValueComparator.NotLessThan);
    }
    export function checkIsValidPlayerAliveState(aliveState: Types.PlayerAliveState): boolean {
        return (aliveState === Types.PlayerAliveState.Alive)
            || (aliveState === Types.PlayerAliveState.Dead)
            || (aliveState === Types.PlayerAliveState.Dying);
    }
    export function checkIsValidPlayerAliveStateSubset(aliveStateArray: Types.PlayerAliveState[]): boolean {
        return ((new Set(aliveStateArray)).size === aliveStateArray.length)
            && (aliveStateArray.every(v => checkIsValidPlayerAliveState(v)));
    }
    export function checkIsValidCoSkillType(skillType: Types.CoSkillType): boolean {
        return (skillType === Types.CoSkillType.Passive)
            || (skillType === Types.CoSkillType.Power)
            || (skillType === Types.CoSkillType.SuperPower);
    }
    export function checkIsValidCoSkillTypeSubset(skillTypeArray: Types.CoSkillType[]): boolean {
        return ((new Set(skillTypeArray)).size === skillTypeArray.length)
            && (skillTypeArray.every(v => checkIsValidCoSkillType(v)));
    }
    export function checkIsValidForceFogCode(forceFogCode: Types.ForceFogCode): boolean {
        return (forceFogCode === Types.ForceFogCode.None)
            || (forceFogCode === Types.ForceFogCode.Fog)
            || (forceFogCode === Types.ForceFogCode.Clear);
    }
    export function checkIsValidUnitActionState(actionState: Types.UnitActionState): boolean {
        return (actionState === Types.UnitActionState.Acted)
            || (actionState === Types.UnitActionState.Idle);
    }
    export function checkIsValidUnitActionStateSubset(actionStateArray: Types.UnitActionState[]): boolean {
        return ((new Set(actionStateArray)).size === actionStateArray.length)
            && (actionStateArray.every(v => checkIsValidUnitActionState(v)));
    }

    export function getUnitTemplateCfg(version: string, unitType: UnitType): UnitTemplateCfg {
        const templateCfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.UnitTemplate, ClientErrorCode.ConfigManager_GetUnitTemplateCfg_00);
        return Helpers.getExisted(templateCfgDict[unitType], ClientErrorCode.ConfigManager_GetUnitTemplateCfg_01);
    }

    export function getUnitTypesByCategory(version: string, category: UnitCategory): UnitType[] {
        const categoryDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.UnitCategory, ClientErrorCode.ConfigManager_GetUnitTypesByCategory_00);
        const categoryCfg  = Helpers.getExisted(categoryDict[category], ClientErrorCode.ConfigManager_GetUnitTypesByCategory_01);
        return categoryCfg.unitTypes || [];
    }

    export function checkIsUnitTypeInCategory(
        version : string,
        unitType: UnitType,
        category: UnitCategory
    ): boolean {
        return getUnitTypesByCategory(version, category).indexOf(unitType) >= 0;
    }

    export function checkIsTileTypeInCategory(
        version : string,
        tileType: TileType,
        category: TileCategory,
    ): boolean {
        return getTileTypesByCategory(version, category).indexOf(tileType) >= 0;
    }

    export function getUnitMaxPromotion(version: string): number {
        return Helpers.getExisted(_ALL_CONFIGS.get(version)?.maxUnitPromotion, ClientErrorCode.ConfigManager_GetUnitMaxPromotion_00);
    }

    export function checkHasSecondaryWeapon(version: string, unitType: UnitType): boolean {
        const cfg = _ALL_CONFIGS.get(version)?.secondaryWeaponFlag;
        return cfg ? cfg[unitType] : false;
    }

    export function getUnitPromotionAttackBonus(version: string, promotion: number): number {
        const dict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.UnitPromotion, ClientErrorCode.ConfigManager_GetUnitPromotionAttackBonus_00);
        return Helpers.getExisted(dict[promotion]?.attackBonus, ClientErrorCode.ConfigManager_GetUnitPromotionAttackBonus_01);
    }
    export function getUnitPromotionDefenseBonus(version: string, promotion: number): number {
        const dict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.UnitPromotion, ClientErrorCode.ConfigManager_GetUnitPromotionDefenseBonus_00);
        return Helpers.getExisted(dict[promotion]?.defenseBonus, ClientErrorCode.ConfigManager_GetUnitPromotionDefenseBonus_01);
    }

    export function getDamageChartCfgs(version: string, attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        const cfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.DamageChart, ClientErrorCode.ConfigManager_GetDamageChartCfgs_00);
        return Helpers.getExisted(cfgDict[attackerType], ClientErrorCode.ConfigManager_GetDamageChartCfgs_01);
    }

    export function getBuildableTileCfgs(version: string, unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | null {
        const cfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.BuildableTile, ClientErrorCode.ConfigManager_GetBuildableTileCfgs_00);
        return cfgDict[unitType] ?? null;
    }

    export function getVisionBonusCfg(version: string, unitType: UnitType): { [tileType: number]: VisionBonusCfg } | null {
        const cfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.VisionBonus, ClientErrorCode.ConfigManager_GetVisionBonusCfg_00);
        return cfgDict[unitType] ?? null;
    }

    export function getMoveCostCfg(version: string, baseType: TileBaseType, objectType: TileObjectType): { [moveType: number]: MoveCostCfg } {
        return getMoveCostCfgByTileType(version, getTileType(baseType, objectType));
    }
    export function getMoveCostCfgByTileType(version: string, tileType: TileType): { [moveType: number]: MoveCostCfg } {
        const cfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.MoveCost, ClientErrorCode.ConfigManager_GetMoveCostCfgByTileType_00);
        return Helpers.getExisted(cfgDict[tileType], ClientErrorCode.ConfigManager_GetMoveCostCfgByTileType_01);
    }

    export function getTileBaseTypeByTileType(type: TileType): TileBaseType {
        return Helpers.getExisted(CommonConstants.TileTypeToTileBaseType.get(type), ClientErrorCode.ConfigManager_GetTileObjectTypeByTileType_00);
    }
    export function getTileObjectTypeByTileType(type: TileType): TileObjectType {
        return Helpers.getExisted(CommonConstants.TileTypeToTileObjectType.get(type), ClientErrorCode.ConfigManager_GetTileObjectTypeByTileType_00);
    }

    export function getTileBaseImageSource({version, themeType, skinId, baseType, isDark, shapeId, tickCount}: {
        version     : Types.UnitAndTileTextureVersion;
        themeType   : Types.TileThemeType;
        skinId      : number;
        baseType    : TileBaseType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        if (baseType === TileBaseType.Empty) {
            return ``;
        }

        const cfgForFrame       = Helpers.getExisted(CommonConstants.TileBaseFrameConfigs.get(version)?.get(baseType), ClientErrorCode.ConfigManager_GetTileBaseImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
        const textForVersion    = `ver${Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
        const textForType       = `type${Helpers.getNumText(baseType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileBase_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }
    export function getTileDecoratorImageSource({version, themeType, skinId, decoratorType, isDark, shapeId, tickCount}: {
        version         : Types.UnitAndTileTextureVersion;
        themeType       : Types.TileThemeType;
        skinId          : number;
        decoratorType   : TileDecoratorType | null;
        isDark          : boolean;
        shapeId         : number | null;
        tickCount       : number;
    }): string {
        if ((decoratorType == null) || (decoratorType === TileDecoratorType.Empty)) {
            return ``;
        }

        const cfgForFrame       = Helpers.getExisted(CommonConstants.TileDecoratorFrameConfigs.get(version)?.get(decoratorType), ClientErrorCode.ConfigManager_GetTileDecoratorImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
        const textForVersion    = `ver${Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
        const textForType       = `type${Helpers.getNumText(decoratorType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileDecorator_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }
    export function getTileObjectImageSource({version, themeType, skinId, objectType, isDark, shapeId, tickCount}: {
        version     : Types.UnitAndTileTextureVersion;
        themeType   : Types.TileThemeType;
        skinId      : number;
        objectType  : TileObjectType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        const cfgForFrame       = Helpers.getExisted(CommonConstants.TileObjectFrameConfigs.get(version)?.get(objectType), ClientErrorCode.ConfigManager_GetTileObjectImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
        const textForVersion    = `ver${Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
        const textForType       = `type${Helpers.getNumText(objectType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileObject_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }

    export function getUnitAndTileDefaultSkinId(playerIndex: number): number {
        return playerIndex;
    }

    export function getUnitImageSource({ version, skinId, unitType, isDark, isMoving, tickCount }: {
        version     : Types.UnitAndTileTextureVersion;
        skinId      : number;
        unitType    : UnitType;
        isDark      : boolean;
        isMoving    : boolean;
        tickCount   : number;
    }): string {
        const cfgForUnit        = Helpers.getExisted(CommonConstants.UnitImageConfigs.get(version)?.get(unitType), ClientErrorCode.ConfigManager_GetUnitImageSource_00);
        const cfgForFrame       = isMoving ? cfgForUnit.moving : cfgForUnit.idle;
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForMoving     = isMoving ? `act01` : `act00`;
        const textForVersion    = `ver${Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
        const textForType       = `type${Helpers.getNumText(unitType)}`;
        const textForFrame      = `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`;
        return `unit_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
    }

    export function getRankName(version: string, rankScore: number): string {
        return Helpers.getExisted(Lang.getStringInCurrentLanguage(getPlayerRankCfg(version, rankScore).nameList), ClientErrorCode.ConfigManager_GetRankName_00);
    }
    export function getPlayerRankCfg(version: string, rankScore: number): PlayerRankCfg {
        const cfgDict   = Helpers.getExisted(_ALL_CONFIGS.get(version)?.PlayerRank, ClientErrorCode.ConfigManager_GetPlayerRankCfg_00);
        let maxRank     = -1;
        let maxCfg      : PlayerRankCfg | null = null;
        for (const i in cfgDict) {
            const currCfg   = cfgDict[i];
            const currRank  = currCfg.rank;
            if ((rankScore >= currCfg.minScore) && (currRank > maxRank)) {
                maxRank = currRank;
                maxCfg  = currCfg;
            }
        }

        return Helpers.getExisted(maxCfg, ClientErrorCode.ConfigManager_GetPlayerRankCfg_01);
    }

    export function getCoBasicCfg(version: string, coId: number): CoBasicCfg {
        return Helpers.getExisted(getAllCoBasicCfgDict(version)[coId], ClientErrorCode.ConfigManager_GetCoBasicCfg_00);
    }
    export function getAllCoBasicCfgDict(version: string): { [coId: number]: CoBasicCfg } {
        return Helpers.getExisted(_ALL_CONFIGS.get(version)?.CoBasic, ClientErrorCode.ConfigManager_GetAllCoBasicCfgDict_00);
    }
    export function getCoNameAndTierText(version: string, coId: number): string {
        // const coConfig = coId == null ? null : getCoBasicCfg(version, coId);
        // return coConfig
        //     // ? `(${coConfig.name}(T${coConfig.tier}))`
        //     ? `${coConfig.name}`
        //     : null;

        return Helpers.getExisted(getCoBasicCfg(version, coId).name, ClientErrorCode.ConfigManager_GetCoNameAndTierText_00);
    }
    export function getCoType(version: string, coId: number): Types.CoType {
        const maxLoadCount = Helpers.getExisted(getCoBasicCfg(version, coId).maxLoadCount, ClientErrorCode.ConfigManager_GetCoType_00);
        return maxLoadCount > 0 ? Types.CoType.Zoned : Types.CoType.Global;
    }

    export function getCoSkillCfg(version: string, skillId: number): CoSkillCfg {
        const cfgDict = Helpers.getExisted(_ALL_CONFIGS.get(version)?.CoSkill, ClientErrorCode.ConfigManager_GetCoSkillCfg_00);
        return Helpers.getExisted(cfgDict[skillId], ClientErrorCode.ConfigManager_GetCoSkillCfg_01);
    }
    export function getCoSkillArray(version: string, coId: number, skillType: Types.CoSkillType): number[] {
        const coConfig = getCoBasicCfg(version, coId);
        switch (skillType) {
            case Types.CoSkillType.Passive      : return coConfig.passiveSkills || [];
            case Types.CoSkillType.Power        : return coConfig.powerSkills || [];
            case Types.CoSkillType.SuperPower   : return coConfig.superPowerSkills || [];
            default                             : throw Helpers.newError(`Invalid skillType: ${skillType}.`, ClientErrorCode.ConfigManager_GetCoSkillArray_00);
        }
    }
    export function getCoSkillDescArray(version: string, coId: number, skillType: Types.CoSkillType): string[] {
        const coConfig = getCoBasicCfg(version, coId);
        switch (skillType) {
            case Types.CoSkillType.Passive      : return coConfig.passiveDesc || [];
            case Types.CoSkillType.Power        : return coConfig.copDesc || [];
            case Types.CoSkillType.SuperPower   : return coConfig.scopDesc || [];
            default                             : throw Helpers.newError(`Invalid skillType: ${skillType}.`, ClientErrorCode.ConfigManager_GetCoSkillDescArray_00);
        }
    }

    export function getWeatherCfg(version: string, weatherType: Types.WeatherType): WeatherCfg {
        return Helpers.getExisted(_ALL_CONFIGS.get(version)?.Weather[weatherType], ClientErrorCode.ConfigManager_GetWeatherCfg_00);
    }
    export function getWeatherTypesByCategory(version: string, category: Types.WeatherCategory): Types.WeatherType[] {
        return Helpers.getExisted(_ALL_CONFIGS.get(version)?.WeatherCategory[category], ClientErrorCode.ConfigManager_GetWeatherTypesByCategory_00).weatherTypes ?? [];
    }
    export function checkIsWeatherTypeInCategory(
        version     : string,
        weatherType : Types.WeatherType,
        category    : Types.WeatherCategory,
    ): boolean {
        return getWeatherTypesByCategory(version, category).indexOf(weatherType) >= 0;
    }
    export function getAvailableWeatherTypes(version: string): Types.WeatherType[] {
        const cfgDict   = Helpers.getExisted(_ALL_CONFIGS.get(version)?.Weather, ClientErrorCode.ConfigManager_GetAvailableWeatherTypes_00);
        const typeArray : Types.WeatherType[] = [];
        for (const i in cfgDict) {
            typeArray.push(cfgDict[i].weatherType);
        }
        return typeArray;
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
    export function getCoIdArrayForDialogue(version: string): number[] {
        const coCfgArray    : CoBasicCfg[] = [];
        const cfgs          = _ALL_CONFIGS.get(version)?.CoBasic;
        if (cfgs != null) {
            for (const k in cfgs || {}) {
                const cfg = cfgs[k];
                if (cfg.isEnabledForDialogue) {
                    coCfgArray.push(cfg);
                }
            }

            coCfgArray.sort((c1, c2) => {
                const name1 = c1.name;
                const name2 = c2.name;
                if (name1 !== name2) {
                    return name1.localeCompare(name2, "zh");
                } else {
                    return c1.tier - c2.tier;
                }
            });
        }

        return coCfgArray.map(v => v.coId);
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

        const cfgs              = Helpers.getExisted(_CO_ID_LIST_IN_TIER.get(version), ClientErrorCode.ConfigManager_GetEnabledCoIdListInTier_00);
        const currentIdArray    = cfgs.get(tier);
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
    export function checkIsOriginCo(version: string, coId: number): boolean {
        return getCoBasicCfg(version, coId).designer === `Intelligent Systems`;
    }

    export function getCoBustImageSource(version: string, coId: number): string {
        return `coBust${Helpers.getNumText(Helpers.getExisted(getCoBasicCfg(version, coId).image), 4)}`;
    }
    export function getCoHeadImageSource(version: string, coId: number): string {
        return `coHead${Helpers.getNumText(Helpers.getExisted(getCoBasicCfg(version, coId).image), 4)}`;
    }
    export function getCoEyeImageSource(version: string, coId: number, isAlive: boolean): string {
        return `coEye${isAlive ? `Normal` : `Grey`}${Helpers.getNumText(Helpers.getExisted(getCoBasicCfg(version, coId).image), 4)}`;
    }
    export function getDialogueBackgroundImage(backgroundId: number): string {
        return `resource/assets/texture/background/dialogueBackground${Helpers.getNumText(backgroundId, 4)}.jpg`;
    }

    export function getUserAvatarImageSource(avatarId: number): string {
        return `userAvatar${Helpers.getNumText(avatarId, 4)}`;
    }
    export function getAvailableUserAvatarIdArray(version: string): number[] {
        const cfgArray: { avatarId: number, sortWeight: number }[] = [];
        const cfgDict = _ALL_CONFIGS.get(version)?.UserAvatar;
        if (cfgDict) {
            for (const i in cfgDict) {
                const cfg = cfgDict[i];
                cfgArray.push({
                    avatarId    : cfg.avatarId,
                    sortWeight  : cfg.sortWeight ?? Number.MAX_VALUE,
                });
            }
        }

        return cfgArray.sort((v1, v2) => v1.sortWeight - v2.sortWeight).map(v => v.avatarId);
    }

    export function checkIsUnitDivingByDefault(version: string, unitType: UnitType): boolean {
        return checkIsUnitDivingByDefaultWithTemplateCfg(getUnitTemplateCfg(version, unitType));
    }
    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: Types.UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
    }

    export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: Types.Undefinable<number>): boolean {
        const cfg = CommonConstants.TileObjectShapeConfigs.get(tileObjectType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
    export function checkIsValidTileBaseShapeId(tileBaseType: TileBaseType, shapeId: Types.Undefinable<number>): boolean {
        const cfg = CommonConstants.TileBaseShapeConfigs.get(tileBaseType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
    export function checkIsValidTileDecoratorShapeId(type: Types.Undefinable<TileDecoratorType>, shapeId: Types.Undefinable<number>): boolean {
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
    export function checkIsTileDecoratorSymmetrical({ decoratorType, shapeId1, shapeId2, symmetryType }: {
        decoratorType   : TileDecoratorType | null;
        shapeId1        : Types.Undefinable<number>;
        shapeId2        : Types.Undefinable<number>;
        symmetryType    : Types.SymmetryType;
    }): boolean {
        if (decoratorType == null) {
            return (shapeId1 == null) && (shapeId2 == null);
        }

        if (shapeId1 == null) {
            return shapeId2 == null;
        } else if (shapeId2 == null) {
            return shapeId1 == null;
        } else {
            return getSymmetricalTileDecoratorShapeId(decoratorType, shapeId1, symmetryType) === shapeId2;
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

// export default ConfigManager;
