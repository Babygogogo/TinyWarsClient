
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Config {
    import TileType             = Types.TileType;
    import UnitType             = Types.UnitType;
    import WeatherType          = Types.WeatherType;
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
    import CoType               = Types.CoType;
    import UnitCategoryCfg      = Types.UnitCategoryCfg;
    import MoveCostCfg          = Types.MoveCostCfg;
    import UnitPromotionCfg     = Types.UnitPromotionCfg;
    import PlayerRankCfg        = Types.PlayerRankCfg;
    import CoSkillCfg           = Types.CoSkillCfg;
    import CoSkillType          = Types.CoSkillType;
    import WeatherCfg           = Types.WeatherCfg;
    import WeatherCategory      = Types.WeatherCategory;
    import WeatherCategoryCfg   = Types.WeatherCategoryCfg;
    import UserAvatarCfg        = Types.UserAvatarCfg;

    export class GameConfig {
        private readonly _version                   : string;
        private readonly _systemCfg                 : SystemCfg;
        private readonly _unitMaxPromotion          : number;
        private readonly _tileCategoryCfgDict       : Map<TileCategory, TileCategoryCfg>;
        private readonly _unitCategoryCfgDict       : Map<UnitCategory, UnitCategoryCfg>;
        private readonly _tileTemplateCfgDict       : Map<TileType, TileTemplateCfg>;
        private readonly _unitTemplateCfgDict       : Map<UnitType, UnitTemplateCfg>;
        private readonly _moveCostCfgDict           : Map<TileType, { [moveType: number]: MoveCostCfg }>;
        private readonly _visionBonusCfgDict        : Map<UnitType, { [tileType: number]: VisionBonusCfg }>;
        private readonly _buildableTileCfgDict      : Map<UnitType, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>;
        private readonly _playerRankCfgDict         : Map<number, PlayerRankCfg>;
        private readonly _coBasicCfgDict            : Map<number, CoBasicCfg>;
        private readonly _coSkillCfgDict            : Map<number, CoSkillCfg>;
        private readonly _weatherCfgDict            : Map<WeatherType, WeatherCfg>;
        private readonly _weatherCategoryCfgDict    : Map<WeatherCategory, WeatherCategoryCfg>;
        private readonly _userAvatarCfgDict         : Map<number, UserAvatarCfg>;
        private readonly _damageChartCfgDict        : Map<UnitType, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>;
        private readonly _unitPromotionCfgDict      : Map<number, UnitPromotionCfg>;
        private readonly _secondaryWeaponFlagDict   : Map<UnitType, boolean>;

        private _availableCoArray   : CoBasicCfg[] | null = null;
        private _coTierArray        : number[] | null = null;

        public constructor(version: string, rawConfig: Types.FullConfig) {
            const unitPromotionCfg          = _destructUnitPromotionCfg(rawConfig.UnitPromotion);
            const damageChartCfg            = _destructDamageChartCfg(rawConfig.DamageChart);

            this._version                   = version;
            this._systemCfg                 = _destructSystemCfg(rawConfig.System);
            this._unitMaxPromotion          = _getUnitMaxPromotion(unitPromotionCfg);
            this._tileCategoryCfgDict       = _destructTileCategoryCfg(rawConfig.TileCategory);
            this._unitCategoryCfgDict       = _destructUnitCategoryCfg(rawConfig.UnitCategory);
            this._tileTemplateCfgDict       = _destructTileTemplateCfg(rawConfig.TileTemplate);
            this._unitTemplateCfgDict       = _destructUnitTemplateCfg(rawConfig.UnitTemplate);
            this._moveCostCfgDict           = _destructMoveCostCfg(rawConfig.MoveCost);
            this._visionBonusCfgDict        = _destructVisionBonusCfg(rawConfig.VisionBonus);
            this._buildableTileCfgDict      = _destructBuildableTileCfg(rawConfig.BuildableTile);
            this._playerRankCfgDict         = _destructPlayerRankCfg(rawConfig.PlayerRank);
            this._coBasicCfgDict            = _destructCoBasicCfg(rawConfig.CoBasic);
            this._coSkillCfgDict            = _destructCoSkillCfg(rawConfig.CoSkill);
            this._weatherCfgDict            = _destructWeatherCfg(rawConfig.Weather);
            this._weatherCategoryCfgDict    = _destructWeatherCategoryCfg(rawConfig.WeatherCategory);
            this._userAvatarCfgDict         = _destructUserAvatarCfg(rawConfig.UserAvatar);
            this._damageChartCfgDict        = damageChartCfg;
            this._unitPromotionCfgDict      = unitPromotionCfg;
            this._secondaryWeaponFlagDict   = _getSecondaryWeaponFlags(damageChartCfg);
        }

        public getVersion(): string {
            return this._version;
        }

        public getSystemCfg(): SystemCfg {
            return this._systemCfg;
        }
        public getSystemEnergyGrowthMultiplierForAttacker(): number {
            return this.getSystemCfg().energyGrowthMultiplierArray[0];
        }
        public getSystemEnergyGrowthMultiplierForDefender(): number {
            return this.getSystemCfg().energyGrowthMultiplierArray[1];
        }

        public getTileTemplateCfg(tileType: TileType): TileTemplateCfg | null {
            return this._tileTemplateCfgDict.get(tileType) ?? null;
        }
        public checkIsValidTileType(tileType: TileType): boolean {
            return this._tileTemplateCfgDict.has(tileType);
        }

        public getTileCategoryCfg(category: TileCategory): TileCategoryCfg | null {
            return this._tileCategoryCfgDict.get(category) ?? null;
        }
        public getTileTypesByCategory(category: TileCategory): TileType[] | null {
            const cfg = this.getTileCategoryCfg(category);
            return cfg ? cfg.tileTypes ?? [] : null;
        }
        public checkIsTileTypeInCategory(tileType: TileType, category: TileCategory): boolean {
            const typeArray = this.getTileTypesByCategory(category);
            return typeArray ? typeArray.indexOf(tileType) >= 0 : false;
        }

        public getUnitTemplateCfg(unitType: UnitType): UnitTemplateCfg | null {
            return this._unitTemplateCfgDict.get(unitType) ?? null;
        }
        public checkIsValidUnitType(unitType: UnitType): boolean {
            return this._unitTemplateCfgDict.has(unitType);
        }

        public getUnitCategoryCfg(category: UnitCategory): UnitCategoryCfg | null {
            return this._unitCategoryCfgDict.get(category) ?? null;
        }
        public getUnitTypesByCategory(category: UnitCategory): UnitType[] | null {
            const cfg = this.getUnitCategoryCfg(category);
            return cfg ? cfg.unitTypes ?? [] : null;
        }
        public checkIsUnitTypeInCategory(unitType: UnitType, category: UnitCategory): boolean {
            const typeArray = this.getUnitTypesByCategory(category);
            return typeArray ? typeArray.indexOf(unitType) >= 0 : false;
        }
        public checkIsValidUnitTypeSubset(unitTypeArray: UnitType[]): boolean {
            if ((new Set(unitTypeArray)).size !== unitTypeArray.length) {
                return false;
            }

            return unitTypeArray.every(v => this.checkIsValidUnitType(v));
        }

        public getUnitMaxPromotion(): number {
            return this._unitMaxPromotion;
        }
        public getUnitPromotionAttackBonus(promotion: number): number {
            return this._unitPromotionCfgDict.get(promotion)?.attackBonus ?? 0;
        }
        public getUnitPromotionDefenseBonus(promotion: number): number {
            return this._unitPromotionCfgDict.get(promotion)?.defenseBonus ?? 0;
        }

        public getDamageChartCfgs(attackerType: UnitType): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } | null {
            return this._damageChartCfgDict.get(attackerType) ?? null;
        }
        public checkHasSecondaryWeapon(unitType: UnitType): boolean {
            return this._secondaryWeaponFlagDict.get(unitType) ?? false;
        }

        public checkIsValidWeatherType(weatherType: WeatherType): boolean {
            return this._weatherCfgDict.has(weatherType);
        }
        public getWeatherCfg(weatherType: WeatherType): WeatherCfg | null {
            return this._weatherCfgDict.get(weatherType) ?? null;
        }

        public getWeatherCategoryCfg(category: WeatherCategory): WeatherCategoryCfg | null {
            return this._weatherCategoryCfgDict.get(category) ?? null;
        }
        public getWeatherTypesByCategory(category: WeatherCategory): WeatherType[] | null {
            const cfg = this.getWeatherCategoryCfg(category);
            return cfg ? cfg.weatherTypes ?? [] : null;
        }
        public checkIsWeatherTypeInCategory(weatherType: WeatherType, category: WeatherCategory): boolean {
            const typeArray = this.getWeatherTypesByCategory(category);
            return typeArray ? typeArray.indexOf(weatherType) >= 0 : false;
        }
        public getAvailableWeatherTypes(): WeatherType[] {
            const typeArray: WeatherType[] = [];
            for (const [weatherType] of this._weatherCfgDict) {
                typeArray.push(weatherType);
            }
            return typeArray;
        }

        public getBuildableTileCfgs(unitType: UnitType): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | null {
            return this._buildableTileCfgDict.get(unitType) ?? null;
        }

        public getVisionBonusCfg(unitType: UnitType): { [tileType: number]: VisionBonusCfg } | null {
            return this._visionBonusCfgDict.get(unitType) ?? null;
        }

        public getMoveCostCfg(tileType: TileType): { [moveType: number]: MoveCostCfg } | null {
            return this._moveCostCfgDict.get(tileType) ?? null;
        }

        public getPlayerRankCfg(rankScore: number): PlayerRankCfg | null {
            let maxRank = -1;
            let maxCfg  : PlayerRankCfg | null = null;
            for (const [minScore, currCfg] of this._playerRankCfgDict) {
                const currRank = currCfg.rank;
                if ((rankScore >= minScore) && (currRank > maxRank)) {
                    maxRank = currRank;
                    maxCfg  = currCfg;
                }
            }

            return maxCfg;
        }

        public getAvailableUserAvatarIdArray(): number[] {
            const cfgArray: { avatarId: number, sortWeight: number }[] = [];
            for (const [avatarId, cfg] of this._userAvatarCfgDict) {
                cfgArray.push({
                    avatarId,
                    sortWeight  : cfg.sortWeight ?? Number.MAX_VALUE,
                });
            }

            return cfgArray.sort((v1, v2) => v1.sortWeight - v2.sortWeight).map(v => v.avatarId);
        }

        public checkHasCo(coId: number): boolean {
            return this._coBasicCfgDict.has(coId);
        }
        public getCoBasicCfg(coId: number): CoBasicCfg | null {
            return this._coBasicCfgDict.get(coId) ?? null;
        }
        public getCoNameAndTierText(coId: number): string | null {
            return this.getCoBasicCfg(coId)?.name ?? null;
        }
        public getCoType(coId: number): CoType | null {
            const cfg = this.getCoBasicCfg(coId);
            if (cfg == null) {
                return null;
            }

            const maxLoadCount = cfg.maxLoadCount;
            return maxLoadCount > 0 ? CoType.Zoned : CoType.Global;
        }
        public checkIsOriginCo(coId: number): boolean {
            return this.getCoBasicCfg(coId)?.dataDesigner === `Intelligent Systems`;
        }
        public getCoBustImageSource(coId: number): string | null {
            const imgNumber = this.getCoBasicCfg(coId)?.image;
            return (imgNumber != null) ? `coBust${Helpers.getNumText(imgNumber, 4)}` : null;
        }
        public getCoHeadImageSource(coId: number): string | null {
            const imgNumber = this.getCoBasicCfg(coId)?.image;
            return (imgNumber != null) ? `coHead${Helpers.getNumText(imgNumber, 4)}` : null;
        }
        public getCoEyeImageSource(coId: number, isAlive: boolean): string | null {
            const imgNumber = this.getCoBasicCfg(coId)?.image;
            return (imgNumber != null) ? `coEye${isAlive ? `Normal` : `Grey`}${Helpers.getNumText(imgNumber, 4)}` : null;
        }

        public getEnabledCoArray(): CoBasicCfg[] {
            if (this._availableCoArray) {
                return this._availableCoArray;
            } else {
                const coArray: CoBasicCfg[] = [];
                for (const [, cfg] of this._coBasicCfgDict) {
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

                this._availableCoArray = coArray;
                return coArray;
            }
        }
        public getCoIdArrayForDialogue(): number[] {
            const coCfgArray: CoBasicCfg[] = [];
            for (const [, cfg] of this._coBasicCfgDict) {
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

            return coCfgArray.map(v => v.coId);
        }
        public getCoTiers(): number[] {
            if (this._coTierArray) {
                return this._coTierArray;
            } else {
                const tierSet = new Set<number>();
                for (const cfg of this.getEnabledCoArray()) {
                    tierSet.add(cfg.tier);
                }

                const tierArray     = Array.from(tierSet).sort((v1, v2) => v1 - v2);
                this._coTierArray   = tierArray;

                return tierArray;
            }
        }
        public getEnabledCoIdListInTier(tier: number): number[] {
            return this.getEnabledCoArray().filter(v => v.tier === tier).map(v => v.coId);
        }
        public getEnabledCustomCoIdList(): number[] {
            return this.getEnabledCoArray().map(v => v.coId).filter(v => !this.checkIsOriginCo(v));
        }

        public getCoSkillCfg(skillId: number): CoSkillCfg | null {
            return this._coSkillCfgDict.get(skillId) ?? null;
        }
        public getCoSkillArray(coId: number, skillType: CoSkillType): number[] | null {
            const coConfig = this.getCoBasicCfg(coId);
            if (coConfig == null) {
                return null;
            }

            switch (skillType) {
                case CoSkillType.Passive    : return coConfig.passiveSkills ?? [];
                case CoSkillType.Power      : return coConfig.powerSkills ?? [];
                case CoSkillType.SuperPower : return coConfig.superPowerSkills ?? [];
                default                     : return null;
            }
        }
        public getCoSkillDescArray(coId: number, skillType: CoSkillType): string[] | null {
            const coConfig = this.getCoBasicCfg(coId);
            if (coConfig == null) {
                return null;
            }

            switch (skillType) {
                case CoSkillType.Passive    : return coConfig.passiveDesc || [];
                case CoSkillType.Power      : return coConfig.copDesc || [];
                case CoSkillType.SuperPower : return coConfig.scopDesc || [];
                default                     : return null;
            }
        }
    }

    function _destructSystemCfg(data: SystemCfg): SystemCfg {
        return Helpers.deepClone(data);
    }
    function _destructTileCategoryCfg(data: TileCategoryCfg[]): Map<TileCategory, TileCategoryCfg> {
        const dst = new Map<TileCategory, TileCategoryCfg>();
        for (const d of data) {
            dst.set(d.category, d);
        }
        return dst;
    }
    function _destructUnitCategoryCfg(data: UnitCategoryCfg[]): Map<UnitCategory, UnitCategoryCfg> {
        const dst = new Map<UnitCategory, UnitCategoryCfg>();
        for (const d of data) {
            dst.set(d.category, d);
        }
        return dst;
    }
    function _destructTileTemplateCfg(data: TileTemplateCfg[]): Map<TileType, TileTemplateCfg> {
        const dst = new Map<TileType, TileTemplateCfg>();
        for (const d of data) {
            dst.set(d.type, d);
        }
        return dst;
    }
    function _destructUnitTemplateCfg(data: UnitTemplateCfg[]): Map<UnitType, UnitTemplateCfg> {
        const dst = new Map<UnitType, UnitTemplateCfg>();
        for (const d of data) {
            dst.set(d.type, d);
        }
        return dst;
    }
    function _destructDamageChartCfg(data: DamageChartCfg[]): Map<UnitType, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }> {
        const dst = new Map<UnitType, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>();
        for (const d of data) {
            const attackerType                  = d.attackerType;
            const armorType                     = d.armorType;
            const subData                       = dst.get(attackerType) ?? {};
            subData[armorType]                  = subData[armorType] || {};
            subData[armorType][d.weaponType]    = d;
            dst.set(attackerType, subData);
        }
        return dst;
    }
    function _destructMoveCostCfg(data: MoveCostCfg[]): Map<TileType, { [moveType: number]: MoveCostCfg }> {
        const dst = new Map<TileType, { [moveType: number]: MoveCostCfg }>();
        for (const d of data) {
            const tileType      = d.tileType;
            const subData       = dst.get(tileType) ?? {};
            subData[d.moveType] = d;
            dst.set(tileType, subData);
        }
        return dst;
    }
    function _destructUnitPromotionCfg(data: UnitPromotionCfg[]): Map<number, UnitPromotionCfg> {
        const dst = new Map<number, UnitPromotionCfg>();
        for (const d of data) {
            dst.set(d.promotion, d);
        }
        return dst;
    }
    function _destructVisionBonusCfg(data: VisionBonusCfg[]): Map<UnitType, { [tileType: number]: VisionBonusCfg }> {
        const dst = new Map<UnitType, { [tileType: number]: VisionBonusCfg }>();
        for (const d of data) {
            const unitType      = d.unitType;
            const subData       = dst.get(unitType) ?? {};
            subData[d.tileType] = d;
            dst.set(unitType, subData);
        }
        return dst;
    }
    function _destructBuildableTileCfg(data: BuildableTileCfg[]): Map<UnitType, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }> {
        const dst = new Map<UnitType, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>();
        for (const d of data) {
            const unitType                          = d.unitType;
            const srcBaseType                       = d.srcBaseType;
            const subData                           = dst.get(unitType) ?? {};
            subData[srcBaseType]                    = subData[srcBaseType] || {};
            subData[srcBaseType][d.srcObjectType]   = d;
            dst.set(unitType, subData);
        }
        return dst;
    }
    function _destructPlayerRankCfg(data: PlayerRankCfg[]): Map<number, PlayerRankCfg> {
        const dst = new Map<number, PlayerRankCfg>();
        for (const d of data) {
            dst.set(d.minScore, d);
        }
        return dst;
    }
    function _destructCoBasicCfg(data: CoBasicCfg[]): Map<number, CoBasicCfg> {
        const dst = new Map<number, CoBasicCfg>();
        for (const d of data) {
            dst.set(d.coId, d);
        }
        return dst;
    }
    function _destructCoSkillCfg(data: CoSkillCfg[]): Map<number, CoSkillCfg> {
        const dst = new Map<number, CoSkillCfg>();
        for (const d of data) {
            dst.set(d.skillId, d);
        }
        return dst;
    }
    function _destructWeatherCfg(data: WeatherCfg[]): Map<WeatherType, WeatherCfg> {
        const dst = new Map<WeatherType, WeatherCfg>();
        for (const d of data) {
            dst.set(d.weatherType, d);
        }
        return dst;
    }
    function _destructWeatherCategoryCfg(data: WeatherCategoryCfg[]): Map<WeatherCategory, WeatherCategoryCfg> {
        const dst = new Map<WeatherCategory, WeatherCategoryCfg>();
        for (const d of data) {
            dst.set(d.category, d);
        }
        return dst;
    }
    function _destructUserAvatarCfg(data: UserAvatarCfg[]): Map<number, UserAvatarCfg> {
        const dst = new Map<number, UserAvatarCfg>();
        for (const d of data) {
            dst.set(d.avatarId, d);
        }
        return dst;
    }
    function _getUnitMaxPromotion(cfg: Map<number, UnitPromotionCfg>): number {
        let maxPromotion = 0;
        for (const [promotion] of cfg) {
            maxPromotion = Math.max(maxPromotion, promotion);
        }
        return maxPromotion;
    }
    function _getSecondaryWeaponFlags(chartCfgs: Map<UnitType, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>): Map<UnitType, boolean> {
        const flags = new Map<UnitType, boolean>();
        for (const [attackerType, cfgs] of chartCfgs) {
            let hasWeapon = false;
            for (const armorType in cfgs) {
                const cfg = cfgs[armorType][WeaponType.Secondary];
                if ((cfg) && (cfg.damage != null)) {
                    hasWeapon = true;
                    break;
                }
            }

            flags.set(attackerType, hasWeapon);
        }

        return flags;
    }
}
