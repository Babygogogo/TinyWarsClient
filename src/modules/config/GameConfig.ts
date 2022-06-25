
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Config {
    import WeaponType                   = Types.WeaponType;
    import UnitTemplateCfg              = Types.UnitTemplateCfg;
    import TileTemplateCfg              = Types.TileTemplateCfg;
    import TileBaseCfg                  = Types.TileBaseCfg;
    import TileBaseSymmetryCfg          = Types.TileBaseSymmetryCfg;
    import TileObjectCfg                = Types.TileObjectCfg;
    import TileObjectSymmetryCfg        = Types.TileObjectSymmetryCfg;
    import TileDecorationCfg            = Types.TileDecorationCfg;
    import TileDecorationSymmetryCfg    = Types.TileDecorationSymmetryCfg;
    import TileTypeMappingCfg           = Types.TileTypeMappingCfg;
    import DamageChartCfg               = Types.DamageChartCfg;
    import BuildableTileCfg             = Types.BuildableTileCfg;
    import VisionBonusCfg               = Types.VisionBonusCfg;
    import CoBasicCfg                   = Types.CoBasicCfg;
    import SystemCfg                    = Types.SystemCfg;
    import TileCategoryCfg              = Types.TileCategoryCfg;
    import CoType                       = Types.CoType;
    import UnitCategoryCfg              = Types.UnitCategoryCfg;
    import MoveCostCfg                  = Types.MoveCostCfg;
    import UnitPromotionCfg             = Types.UnitPromotionCfg;
    import PlayerRankCfg                = Types.PlayerRankCfg;
    import CoCategoryCfg                = Types.CoCategoryCfg;
    import CoSkillCfg                   = Types.CoSkillCfg;
    import CoSkillType                  = Types.CoSkillType;
    import WeatherCfg                   = Types.WeatherCfg;
    import WeatherCategoryCfg           = Types.WeatherCategoryCfg;
    import UserAvatarCfg                = Types.UserAvatarCfg;
    import BgmSfxCfg                    = Types.BgmSfxCfg;
    import MoveTypeCfg                  = Types.MoveTypeCfg;
    import MapWeaponCfg                 = Types.MapWeaponCfg;

    export class GameConfig {
        private readonly _version                       : string;
        private readonly _systemCfg                     : SystemCfg;
        private readonly _unitMaxPromotion              : number;
        private readonly _tileCategoryCfgDict           : Map<number, TileCategoryCfg>;
        private readonly _unitCategoryCfgDict           : Map<number, UnitCategoryCfg>;
        private readonly _tileTemplateCfgDict           : Map<number, TileTemplateCfg>;
        private readonly _tileBaseCfgDict               : Map<number, TileBaseCfg>;
        private readonly _tileBaseSymmetryCfgDict       : Map<number, Map<number, TileBaseSymmetryCfg>>;
        private readonly _tileObjectCfgDict             : Map<number, TileObjectCfg>;
        private readonly _tileObjectSymmetryCfgDict     : Map<number, Map<number, TileObjectSymmetryCfg>>;
        private readonly _tileDecorationCfgDict         : Map<number, TileDecorationCfg>;
        private readonly _tileDecorationSymmetryCfgDict : Map<number, Map<number, TileDecorationSymmetryCfg>>;
        private readonly _tileTypeMappingCfgDict        : Map<number, Map<number, TileTypeMappingCfg>>;
        private readonly _unitTemplateCfgDict           : Map<number, UnitTemplateCfg>;
        private readonly _moveCostCfgDict               : Map<number, { [moveType: number]: MoveCostCfg }>;
        private readonly _visionBonusCfgDict            : Map<number, { [tileType: number]: VisionBonusCfg }>;
        private readonly _buildableTileCfgDict          : Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>;
        private readonly _playerRankCfgDict             : Map<number, PlayerRankCfg>;
        private readonly _coCategoryCfgDict             : Map<number, CoCategoryCfg>;
        private readonly _coBasicCfgDict                : Map<number, CoBasicCfg>;
        private readonly _coSkillCfgDict                : Map<number, CoSkillCfg>;
        private readonly _weatherCfgDict                : Map<number, WeatherCfg>;
        private readonly _weatherCategoryCfgDict        : Map<number, WeatherCategoryCfg>;
        private readonly _userAvatarCfgDict             : Map<number, UserAvatarCfg>;
        private readonly _damageChartCfgDict            : Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>;
        private readonly _unitPromotionCfgDict          : Map<number, UnitPromotionCfg>;
        private readonly _secondaryWeaponFlagDict       : Map<number, boolean>;
        private readonly _bgmSfxCfgDict                 : Map<number, BgmSfxCfg>;
        private readonly _moveTypeCfgDict               : Map<number, MoveTypeCfg>;
        private readonly _mapWeaponCfgDict              : Map<number, MapWeaponCfg>;

        private _availableCoArray   : CoBasicCfg[] | null = null;
        private _allUnitTypeArray   : number[] | null = null;
        private _coTierArray        : number[] | null = null;
        private _allBgmCodeArray    : number[] | null = null;

        public constructor(version: string, rawConfig: Types.FullConfig) {
            const unitPromotionCfg              = _destructUnitPromotionCfg(rawConfig.UnitPromotion);
            const damageChartCfg                = _destructDamageChartCfg(rawConfig.DamageChart);

            this._version                       = version;
            this._systemCfg                     = _destructSystemCfg(rawConfig.System);
            this._tileCategoryCfgDict           = _destructTileCategoryCfg(rawConfig.TileCategory);
            this._unitCategoryCfgDict           = _destructUnitCategoryCfg(rawConfig.UnitCategory);
            this._tileTemplateCfgDict           = _destructTileTemplateCfg(rawConfig.TileTemplate);
            this._tileBaseCfgDict               = _destructTileBaseCfg(rawConfig.TileBase);
            this._tileBaseSymmetryCfgDict       = _destructTileBaseSymmetryCfg(rawConfig.TileBaseSymmetry);
            this._tileObjectCfgDict             = _destructTileObjectCfg(rawConfig.TileObject);
            this._tileObjectSymmetryCfgDict     = _destructTileObjectSymmetryCfg(rawConfig.TileObjectSymmetry);
            this._tileDecorationCfgDict         = _destructTileDecorationCfg(rawConfig.TileDecoration);
            this._tileDecorationSymmetryCfgDict = _destructTileDecorationSymmetryCfg(rawConfig.TileDecorationSymmetry);
            this._tileTypeMappingCfgDict        = _destructTileTypeMappingCfg(rawConfig.TileTypeMapping);
            this._unitTemplateCfgDict           = _destructUnitTemplateCfg(rawConfig.UnitTemplate);
            this._moveCostCfgDict               = _destructMoveCostCfg(rawConfig.MoveCost);
            this._visionBonusCfgDict            = _destructVisionBonusCfg(rawConfig.VisionBonus);
            this._buildableTileCfgDict          = _destructBuildableTileCfg(rawConfig.BuildableTile);
            this._playerRankCfgDict             = _destructPlayerRankCfg(rawConfig.PlayerRank);
            this._coCategoryCfgDict             = _destructCoCategoryCfg(rawConfig.CoCategory);
            this._coBasicCfgDict                = _destructCoBasicCfg(rawConfig.CoBasic);
            this._coSkillCfgDict                = _destructCoSkillCfg(rawConfig.CoSkill);
            this._weatherCfgDict                = _destructWeatherCfg(rawConfig.Weather);
            this._weatherCategoryCfgDict        = _destructWeatherCategoryCfg(rawConfig.WeatherCategory);
            this._userAvatarCfgDict             = _destructUserAvatarCfg(rawConfig.UserAvatar);
            this._bgmSfxCfgDict                 = _destructBgmSfxCfg(rawConfig.BgmSfx);
            this._moveTypeCfgDict               = _destructMoveTypeCfg(rawConfig.MoveType);
            this._mapWeaponCfgDict              = _destructMapWeaponCfg(rawConfig.MapWeapon);
            this._damageChartCfgDict            = damageChartCfg;
            this._unitPromotionCfgDict          = unitPromotionCfg;
            this._unitMaxPromotion              = _getUnitMaxPromotion(unitPromotionCfg);
            this._secondaryWeaponFlagDict       = _getSecondaryWeaponFlags(damageChartCfg);
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
        public checkIsLoadedUnitVisibleInFog(): boolean {
            return this.getSystemCfg().isLoadedUnitVisibleInFog > 0;
        }
        public checkCanDroppedUnitGetVisionOnStart(): boolean {
            return this.getSystemCfg().canDroppedUnitGetVisionOnStart > 0;
        }

        public getTileTemplateCfg(tileType: number): TileTemplateCfg | null {
            return this._tileTemplateCfgDict.get(tileType) ?? null;
        }
        public getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType: number, tileObjectType: number): TileTemplateCfg | null {
            const tileType = this.getTileType(tileBaseType, tileObjectType);
            return tileType == null ? null : this.getTileTemplateCfg(tileType);
        }
        public getTileBaseTypeByTileType(tileType: number): number | null {
            return this.getTileTemplateCfg(tileType)?.toTileBaseType ?? null;
        }
        public getTileObjectTypeByTileType(tileType: number): number | null {
            return this.getTileTemplateCfg(tileType)?.toTileObjectType ?? null;
        }
        public checkIsValidTileType(tileType: number): boolean {
            return this._tileTemplateCfgDict.has(tileType);
        }
        public getAllTileTypeArray(): number[] {
            return [...this._tileTemplateCfgDict].map(v => v[0]);
        }
        public getTileTypeArrayForTileChart(): number[] {
            return [...this._tileTemplateCfgDict]
                .filter(v => v[1].sortWeightForTileChart != null)
                .sort((v1, v2) => Helpers.getExisted(v1[1].sortWeightForTileChart) - Helpers.getExisted(v2[1].sortWeightForTileChart))
                .map(v => v[0]);
        }
        public getTileTypeArrayForDamageChart(): number[] {
            return [...this._tileTemplateCfgDict]
                .filter(v => v[1].sortWeightForDamageChart != null)
                .sort((v1, v2) => Helpers.getExisted(v1[1].sortWeightForDamageChart) - Helpers.getExisted(v2[1].sortWeightForDamageChart))
                .map(v => v[0]);
        }
        public getTileTypeArrayForMapInfo(): number[] {
            return [...this._tileTemplateCfgDict]
                .filter(v => v[1].sortWeightForMapInfo != null)
                .sort((v1, v2) => Helpers.getExisted(v1[1].sortWeightForMapInfo) - Helpers.getExisted(v2[1].sortWeightForMapInfo))
                .map(v => v[0]);
        }
        public getTileTypeArrayForUnattackable(): number[] {
            return [...this._tileTemplateCfgDict]
                .filter(v => v[1].maxHp == null)
                .map(v => v[0]);
        }

        public getTileBaseCfg(tileBaseType: number): TileBaseCfg | null {
            return this._tileBaseCfgDict.get(tileBaseType) ?? null;
        }
        public getAllEnabledTileBaseCfgArray(): TileBaseCfg[] {
            return [...this._tileBaseCfgDict].filter(v => v[1].isEnabled).map(v => v[1]).sort((v1, v2) => v1.tileBaseType - v2.tileBaseType);
        }
        public getDefaultTileBaseType(): number {
            for (const [tileBaseType, cfg] of this._tileBaseCfgDict) {
                if (cfg.isDefault) {
                    return tileBaseType;
                }
            }
            throw Helpers.newError(`No default tile base type.`);
        }
        public checkIsValidTileBaseShapeId(tileBaseType: number, shapeId: Types.Undefinable<number>): boolean {
            const cfg = this.getTileBaseCfg(tileBaseType);
            return (!!cfg?.isEnabled)
                && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
        }
        public getTileBaseImageSource({ version, themeType, skinId, baseType, isDark, shapeId, tickCount }: {
            version     : Types.UnitAndTileTextureVersion;
            themeType   : Types.TileThemeType;
            skinId      : number;
            baseType    : number;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        }): string {
            const cfg               = Helpers.getExisted(this.getTileBaseCfg(baseType));
            const cfgForFrame       = Helpers.getExisted(version === Types.UnitAndTileTextureVersion.V0 ? cfg.animParamsForV0 : cfg.animParams);
            const ticksPerFrame     = cfgForFrame[1];
            const textForDark       = isDark ? `state01` : `state00`;
            const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId || 0)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(baseType)}`;
            const textForFrame      = ticksPerFrame < 999999
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileBase_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSymmetricalTileBaseShapeId(tileBaseType: number, shapeId: number, symmetryType: Types.SymmetryType): number | null {
            const shapeIdList = this._tileBaseSymmetryCfgDict.get(tileBaseType)?.get(shapeId)?.symmetryShapeIds;
            return shapeIdList ? shapeIdList[symmetryType] : null;
        }
        public checkIsTileBaseSymmetrical({ baseType, shapeId1, shapeId2, symmetryType }: {
            baseType    : number;
            shapeId1    : number;
            shapeId2    : number;
            symmetryType: Types.SymmetryType;
        }): boolean {
            return this.getSymmetricalTileBaseShapeId(baseType, shapeId1, symmetryType) === (shapeId2 || 0);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTileObjectCfg(tileObjectType: number): TileObjectCfg | null {
            return this._tileObjectCfgDict.get(tileObjectType) ?? null;
        }
        public getAllTileObjectCfgArray(): TileObjectCfg[] {
            return [...this._tileObjectCfgDict]
                .sort((v1, v2) => (v1[1].sortWeight ?? 0) - (v2[1].sortWeight ?? 0))
                .map(v => v[1]);
        }
        public checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType }: {
            playerIndex     : number;
            tileObjectType  : number;
        }): boolean {
            const playerIndexRange = this.getTileObjectCfg(tileObjectType)?.playerIndexRange;
            return (playerIndexRange != null)
                && (playerIndex >= playerIndexRange[0])
                && (playerIndex <= playerIndexRange[1]);
        }
        public checkIsValidTileObjectShapeId(tileObjectType: number, shapeId: Types.Undefinable<number>): boolean {
            const shapesCount = this.getTileObjectCfg(tileObjectType)?.shapesCount;
            return (shapesCount != null)
                && ((shapeId == null) || ((shapeId >= 0) && (shapeId < shapesCount)));
        }
        public getSymmetricalTileObjectType(tileObjectType: number, symmetryType: Types.SymmetryType): number {
            return Helpers.getExisted(this.getTileObjectCfg(tileObjectType)?.symmetryTypes)[symmetryType];
        }
        public getTileObjectImageSource({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
            version     : Types.UnitAndTileTextureVersion;
            themeType   : Types.TileThemeType;
            skinId      : number;
            objectType  : number;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        }): string {
            const cfg               = Helpers.getExisted(this.getTileObjectCfg(objectType));
            const cfgForFrame       = Helpers.getExisted(version === Types.UnitAndTileTextureVersion.V0 ? cfg.animParamsForV0 : cfg.animParams);
            const ticksPerFrame     = cfgForFrame[1];
            const textForDark       = isDark ? `state01` : `state00`;
            const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(objectType)}`;
            const textForFrame      = ticksPerFrame < 999999
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileObject_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSymmetricalTileObjectShapeId(tileObjectType: number, shapeId: number, symmetryType: Types.SymmetryType): number | null {
            const shapeIdArray = this._tileObjectSymmetryCfgDict.get(tileObjectType)?.get(shapeId)?.symmetryShapeIds;
            return shapeIdArray ? shapeIdArray[symmetryType] : null;
        }
        public checkIsTileObjectSymmetrical({ objectType, shapeId1, shapeId2, symmetryType }: {
            objectType      : number;
            shapeId1        : number;
            shapeId2        : number;
            symmetryType    : Types.SymmetryType;
        }): boolean {
            return this.getSymmetricalTileObjectShapeId(objectType, shapeId1, symmetryType) === (shapeId2 || 0);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTileDecorationCfg(tileDecorationType: number): TileDecorationCfg | null {
            return this._tileDecorationCfgDict.get(tileDecorationType) ?? null;
        }
        public getAllTileDecorationCfgArray(): TileDecorationCfg[] {
            return [...this._tileDecorationCfgDict].sort((v1, v2) => v1[0] - v2[0]).map(v => v[1]);
        }
        public checkIsValidTileDecoratorShapeId(tileDecorationType: Types.Undefinable<number>, shapeId: Types.Undefinable<number>): boolean {
            if (tileDecorationType == null) {
                return shapeId == null;
            }

            const cfg = this.getTileDecorationCfg(tileDecorationType);
            return (cfg != null)
                && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
        }
        public getTileDecorationImageSource({version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount}: {
            version             : Types.UnitAndTileTextureVersion;
            themeType           : Types.TileThemeType;
            skinId              : number;
            tileDecorationType  : number | null;
            isDark              : boolean;
            shapeId             : number;
            tickCount           : number;
        }): string {
            if (tileDecorationType == null) {
                return ``;
            }

            const cfg               = Helpers.getExisted(this.getTileDecorationCfg(tileDecorationType));
            const cfgForFrame       = Helpers.getExisted(version === Types.UnitAndTileTextureVersion.V0 ? cfg.animParamsForV0 : cfg.animParams);
            const ticksPerFrame     = cfgForFrame[1];
            const textForDark       = isDark ? `state01` : `state00`;
            const textForTheme      = `theme${Helpers.getNumText(themeType)}`;
            const textForShapeId    = `shape${Helpers.getNumText(shapeId)}`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(tileDecorationType)}`;
            const textForFrame      = ticksPerFrame < 999999
                ? `frame${Helpers.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
                : `frame00`;
            return `tileDecorator_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSymmetricalTileDecoratorShapeId(tileDecorationType: number, shapeId: number, symmetryType: Types.SymmetryType): number | null {
            const shapeIdArray = this._tileDecorationSymmetryCfgDict.get(tileDecorationType)?.get(shapeId)?.symmetryShapeIds;
            return shapeIdArray ? shapeIdArray[symmetryType] : null;
        }
        public checkIsTileDecoratorSymmetrical({ tileDecorationType, shapeId1, shapeId2, symmetryType }: {
            tileDecorationType  : number | null;
            shapeId1            : Types.Undefinable<number>;
            shapeId2            : Types.Undefinable<number>;
            symmetryType        : Types.SymmetryType;
        }): boolean {
            if (tileDecorationType == null) {
                return (shapeId1 == null) && (shapeId2 == null);
            }

            if (shapeId1 == null) {
                return shapeId2 == null;
            } else if (shapeId2 == null) {
                return shapeId1 == null;
            } else {
                return this.getSymmetricalTileDecoratorShapeId(tileDecorationType, shapeId1, symmetryType) === shapeId2;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTileType(tileBaseType: number, tileObjectType: number): number | null {
            return this._tileTypeMappingCfgDict.get(tileBaseType)?.get(tileObjectType)?.tileType ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getTileCategoryCfg(tileCategory: number): TileCategoryCfg | null {
            return this._tileCategoryCfgDict.get(tileCategory) ?? null;
        }
        public getTileTypesByCategory(tileCategory: number): number[] | null {
            const cfg = this.getTileCategoryCfg(tileCategory);
            return cfg ? cfg.tileTypes ?? [] : null;
        }
        public checkIsTileTypeInCategory(tileType: number, tileCategory: number): boolean {
            const typeArray = this.getTileTypesByCategory(tileCategory);
            return typeArray ? typeArray.indexOf(tileType) >= 0 : false;
        }

        public getUnitTemplateCfg(unitType: number): UnitTemplateCfg | null {
            return this._unitTemplateCfgDict.get(unitType) ?? null;
        }
        public checkIsValidUnitType(unitType: number): boolean {
            return this._unitTemplateCfgDict.has(unitType);
        }
        public getFirstUnitType(): number {
            return this.getAllUnitTypeArray()[0];
        }
        public getAllUnitTypeArray(): number[] {
            if (this._allUnitTypeArray == null) {
                this._allUnitTypeArray = [...this._unitTemplateCfgDict].map(v => v[0]).sort((v1, v2) => v1 - v2);
            }
            return this._allUnitTypeArray;
        }
        public getUnitImageSource({ version, skinId, unitType, isDark, isMoving, tickCount }: {
            version     : Types.UnitAndTileTextureVersion;
            skinId      : number;
            unitType    : number;
            isDark      : boolean;
            isMoving    : boolean;
            tickCount   : number;
        }): string {
            const cfg               = Helpers.getExisted(this.getUnitTemplateCfg(unitType)?.animParams);
            const index             = version * 4 + (isMoving ? 2 : 0);
            const ticksPerFrame     = cfg[index + 1];
            const textForDark       = isDark ? `state01` : `state00`;
            const textForMoving     = isMoving ? `act01` : `act00`;
            const textForVersion    = `ver${Helpers.getNumText(version)}`;
            const textForSkin       = `skin${Helpers.getNumText(skinId)}`;
            const textForType       = `type${Helpers.getNumText(unitType)}`;
            const textForFrame      = `frame${Helpers.getNumText(Math.floor((tickCount % (cfg[index] * ticksPerFrame)) / ticksPerFrame))}`;
            return `unit_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
        }

        public getUnitCategoryCfg(unitCategory: number): UnitCategoryCfg | null {
            return this._unitCategoryCfgDict.get(unitCategory) ?? null;
        }
        public getUnitTypesByCategory(unitCategory: number): number[] | null {
            const cfg = this.getUnitCategoryCfg(unitCategory);
            return cfg ? cfg.unitTypes ?? [] : null;
        }
        public checkIsUnitTypeInCategory(unitType: number, unitCategory: number): boolean {
            const typeArray = this.getUnitTypesByCategory(unitCategory);
            return typeArray ? typeArray.indexOf(unitType) >= 0 : false;
        }
        public checkIsValidUnitTypeSubset(unitTypeArray: number[]): boolean {
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

        public getDamageChartCfgs(attackerType: number): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } | null {
            return this._damageChartCfgDict.get(attackerType) ?? null;
        }
        public checkHasSecondaryWeapon(unitType: number): boolean {
            return this._secondaryWeaponFlagDict.get(unitType) ?? false;
        }

        public checkIsValidWeatherType(weatherType: number): boolean {
            return this._weatherCfgDict.has(weatherType);
        }
        public getWeatherCfg(weatherType: number): WeatherCfg | null {
            return this._weatherCfgDict.get(weatherType) ?? null;
        }
        public getDefaultWeatherType(): number {
            for (const [weatherType, cfg] of this._weatherCfgDict) {
                if (cfg.isDefault) {
                    return weatherType;
                }
            }
            throw Helpers.newError(`No default weather type.`);
        }
        public getNextWeatherType(weatherType: Types.Undefinable<number>): number {
            const weatherTypeArray = this.getAvailableWeatherTypes();
            return weatherType == null
                ? weatherTypeArray[0]
                : weatherTypeArray[(weatherTypeArray.indexOf(weatherType) + 1) % weatherTypeArray.length];
        }
        public getAvailableWeatherTypes(): number[] {
            const typeArray: number[] = [];
            for (const [weatherType] of this._weatherCfgDict) {
                typeArray.push(weatherType);
            }
            return typeArray;
        }

        public getWeatherCategoryCfg(category: number): WeatherCategoryCfg | null {
            return this._weatherCategoryCfgDict.get(category) ?? null;
        }
        public getWeatherTypesByCategory(category: number): number[] | null {
            const cfg = this.getWeatherCategoryCfg(category);
            return cfg ? cfg.weatherTypes ?? [] : null;
        }
        public checkIsWeatherTypeInCategory(weatherType: number, category: number): boolean {
            const typeArray = this.getWeatherTypesByCategory(category);
            return typeArray ? typeArray.indexOf(weatherType) >= 0 : false;
        }

        public getBuildableTileCfgs(unitType: number): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | null {
            return this._buildableTileCfgDict.get(unitType) ?? null;
        }

        public getVisionBonusCfg(unitType: number): { [tileType: number]: VisionBonusCfg } | null {
            return this._visionBonusCfgDict.get(unitType) ?? null;
        }

        public getMoveCostCfg(tileType: number): { [moveType: number]: MoveCostCfg } | null {
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
        public getRankName(rankScore: number): string | null {
            const cfg = this.getPlayerRankCfg(rankScore);
            return cfg ? Helpers.getExisted(Lang.getStringInCurrentLanguage(cfg.nameList)) : null;
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

        public getCoCategoryCfg(categoryId: number): CoCategoryCfg | null {
            return this._coCategoryCfgDict.get(categoryId) ?? null;
        }
        public getEnabledCoCategoryIdArray(): number[] {
            const coCategoryIdSet = new Set<number>();
            for (const [, coBasicCfg] of this._coBasicCfgDict) {
                const coCategoryId = coBasicCfg.categoryId;
                if ((coCategoryId != null) && (coBasicCfg.isEnabled)) {
                    coCategoryIdSet.add(coCategoryId);
                }
            }
            return [...coCategoryIdSet].sort((v1, v2) => Helpers.getExisted(this.getCoCategoryCfg(v1)?.name).localeCompare(Helpers.getExisted(this.getCoCategoryCfg(v2)?.name), "zh"));
        }
        public checkIsValidCoCategoryIdSubset(coCategoryIdArray: number[]): boolean {
            return (coCategoryIdArray.length === new Set(coCategoryIdArray).size)
                && (coCategoryIdArray.every(v => this.getCoCategoryCfg(v) != null));
        }

        public checkHasCo(coId: number): boolean {
            return this._coBasicCfgDict.has(coId);
        }
        public getCoBasicCfg(coId: number): CoBasicCfg | null {
            return this._coBasicCfgDict.get(coId) ?? null;
        }
        public getCoIdArrayByCategoryIdSet(coCategoryIdSet: Set<number>): number[] {
            const coIdArray: number[] = [];
            for (const [coId, { categoryId }] of this._coBasicCfgDict) {
                if ((categoryId != null) && (coCategoryIdSet.has(categoryId))) {
                    coIdArray.push(coId);
                }
            }
            return coIdArray;
        }
        public getEnabledCoIdByCategoryId(coCategoryId: number): number | null {
            for (const [coId, { isEnabled, categoryId }] of this._coBasicCfgDict) {
                if ((categoryId == coCategoryId) && (isEnabled)) {
                    return coId;
                }
            }
            return null;
        }
        public getCoIdByCategoryId(coCategoryId: number): number {
            for (const [coId, { categoryId }] of this._coBasicCfgDict) {
                if (categoryId == coCategoryId) {
                    return coId;
                }
            }
            throw Helpers.newError(`No available CO ID for coCategoryId: ${coCategoryId}.`);
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
        public checkIsOriginCoByCategoryId(coCategoryId: number): boolean {
            return this.checkIsOriginCo(this.getEnabledCoIdByCategoryId(coCategoryId) ?? this.getCoIdByCategoryId(coCategoryId));
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

        public getBgmSfxCfg(code: number): BgmSfxCfg | null {
            return this._bgmSfxCfgDict.get(code) ?? null;
        }
        public checkIsBgm(code: number): boolean {
            return !!this.getBgmSfxCfg(code)?.isBgm;
        }
        public getAllBgmCodeArray(): number[] {
            if (this._allBgmCodeArray) {
                return this._allBgmCodeArray;
            } else {
                const cfgArray: BgmSfxCfg[] = [];
                for (const [, cfg] of this._bgmSfxCfgDict) {
                    if (cfg.isBgm) {
                        cfgArray.push(cfg);
                    }
                }

                const bgmCodeArray      = cfgArray.sort((v1, v2) => (v1.sortWeight ?? Number.MAX_SAFE_INTEGER) - (v2.sortWeight ?? Number.MAX_SAFE_INTEGER)).map(v => v.code);
                this._allBgmCodeArray   = bgmCodeArray;

                return bgmCodeArray;
            }
        }

        public getMoveTypeCfg(moveType: number): MoveTypeCfg | null {
            return this._moveTypeCfgDict.get(moveType) ?? null;
        }

        public getMapWeaponCfg(mapWeaponType: number): MapWeaponCfg {
            return Helpers.getExisted(this._mapWeaponCfgDict.get(mapWeaponType));
        }
    }

    function _destructSystemCfg(data: SystemCfg): SystemCfg {
        return Helpers.deepClone(data);
    }
    function _destructTileCategoryCfg(data: TileCategoryCfg[]): Map<number, TileCategoryCfg> {
        const dst = new Map<number, TileCategoryCfg>();
        for (const d of data) {
            dst.set(d.category, d);
        }
        return dst;
    }
    function _destructUnitCategoryCfg(data: UnitCategoryCfg[]): Map<number, UnitCategoryCfg> {
        const dst = new Map<number, UnitCategoryCfg>();
        for (const d of data) {
            dst.set(d.category, d);
        }
        return dst;
    }
    function _destructTileTemplateCfg(data: TileTemplateCfg[]): Map<number, TileTemplateCfg> {
        const dst = new Map<number, TileTemplateCfg>();
        for (const d of data) {
            dst.set(d.type, d);
        }
        return dst;
    }
    function _destructTileBaseCfg(data: TileBaseCfg[]): Map<number, TileBaseCfg> {
        const dst = new Map<number, TileBaseCfg>();
        for (const d of data) {
            dst.set(d.tileBaseType, d);
        }
        return dst;
    }
    function _destructTileBaseSymmetryCfg(data: TileBaseSymmetryCfg[]): Map<number, Map<number, TileBaseSymmetryCfg>> {
        const dst = new Map<number, Map<number, TileBaseSymmetryCfg>>();
        for (const d of data) {
            const tileBaseType    = d.tileBaseType;
            const subData           = dst.get(tileBaseType) ?? new Map<number, TileBaseSymmetryCfg>();
            subData.set(d.shapeId, d);
            dst.set(tileBaseType, subData);
        }
        return dst;
    }
    function _destructTileObjectCfg(data: TileObjectCfg[]): Map<number, TileObjectCfg> {
        const dst = new Map<number, TileObjectCfg>();
        for (const d of data) {
            dst.set(d.tileObjectType, d);
        }
        return dst;
    }
    function _destructTileObjectSymmetryCfg(data: TileObjectSymmetryCfg[]): Map<number, Map<number, TileObjectSymmetryCfg>> {
        const dst = new Map<number, Map<number, TileObjectSymmetryCfg>>();
        for (const d of data) {
            const tileObjectType    = d.tileObjectType;
            const subData           = dst.get(tileObjectType) ?? new Map<number, TileObjectSymmetryCfg>();
            subData.set(d.shapeId, d);
            dst.set(tileObjectType, subData);
        }
        return dst;
    }
    function _destructTileDecorationCfg(data: TileDecorationCfg[]): Map<number, TileDecorationCfg> {
        const dst = new Map<number, TileDecorationCfg>();
        for (const d of data) {
            dst.set(d.tileDecorationType, d);
        }
        return dst;
    }
    function _destructTileDecorationSymmetryCfg(data: TileDecorationSymmetryCfg[]): Map<number, Map<number, TileDecorationSymmetryCfg>> {
        const dst = new Map<number, Map<number, TileDecorationSymmetryCfg>>();
        for (const d of data) {
            const tileDecorationType    = d.tileDecorationType;
            const subData           = dst.get(tileDecorationType) ?? new Map<number, TileDecorationSymmetryCfg>();
            subData.set(d.shapeId, d);
            dst.set(tileDecorationType, subData);
        }
        return dst;
    }
    function _destructTileTypeMappingCfg(data: TileTypeMappingCfg[]): Map<number, Map<number, TileTypeMappingCfg>> {
        const dst = new Map<number, Map<number, TileTypeMappingCfg>>();
        for (const d of data) {
            const tileBaseType          = d.tileBaseType;
            const subData               = dst.get(tileBaseType) ?? new Map<number, TileTypeMappingCfg>();
            subData.set(d.tileObjectType, d);
            dst.set(tileBaseType, subData);
        }
        return dst;
    }
    function _destructUnitTemplateCfg(data: UnitTemplateCfg[]): Map<number, UnitTemplateCfg> {
        const dst = new Map<number, UnitTemplateCfg>();
        for (const d of data) {
            dst.set(d.type, d);
        }
        return dst;
    }
    function _destructDamageChartCfg(data: DamageChartCfg[]): Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }> {
        const dst = new Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>();
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
    function _destructMoveCostCfg(data: MoveCostCfg[]): Map<number, { [moveType: number]: MoveCostCfg }> {
        const dst = new Map<number, { [moveType: number]: MoveCostCfg }>();
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
    function _destructVisionBonusCfg(data: VisionBonusCfg[]): Map<number, { [tileType: number]: VisionBonusCfg }> {
        const dst = new Map<number, { [tileType: number]: VisionBonusCfg }>();
        for (const d of data) {
            const unitType      = d.unitType;
            const subData       = dst.get(unitType) ?? {};
            subData[d.tileType] = d;
            dst.set(unitType, subData);
        }
        return dst;
    }
    function _destructBuildableTileCfg(data: BuildableTileCfg[]): Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }> {
        const dst = new Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>();
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
    function _destructCoCategoryCfg(data: CoCategoryCfg[]): Map<number, CoCategoryCfg> {
        const dst = new Map<number, CoCategoryCfg>();
        for (const d of data) {
            dst.set(d.categoryId, d);
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
    function _destructWeatherCfg(data: WeatherCfg[]): Map<number, WeatherCfg> {
        const dst = new Map<number, WeatherCfg>();
        for (const d of data) {
            dst.set(d.weatherType, d);
        }
        return dst;
    }
    function _destructWeatherCategoryCfg(data: WeatherCategoryCfg[]): Map<number, WeatherCategoryCfg> {
        const dst = new Map<number, WeatherCategoryCfg>();
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
    function _destructBgmSfxCfg(data: BgmSfxCfg[]): Map<number, BgmSfxCfg> {
        const dst = new Map<number, BgmSfxCfg>();
        for (const d of data) {
            dst.set(d.code, d);
        }
        return dst;
    }
    function _destructMoveTypeCfg(data: MoveTypeCfg[]): Map<number, MoveTypeCfg> {
        const dst = new Map<number, MoveTypeCfg>();
        for (const d of data) {
            dst.set(d.moveType, d);
        }
        return dst;
    }
    function _destructMapWeaponCfg(data: MapWeaponCfg[]): Map<number, MapWeaponCfg> {
        const dst = new Map<number, MapWeaponCfg>();
        for (const d of data) {
            dst.set(d.mapWeaponType, d);
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
    function _getSecondaryWeaponFlags(chartCfgs: Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>): Map<number, boolean> {
        const flags = new Map<number, boolean>();
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
