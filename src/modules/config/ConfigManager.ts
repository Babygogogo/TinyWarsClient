
// import Lang             from "../lang/Lang";
// import Notify           from "../notify/Notify";
// import Twns.Notify   from "../notify/NotifyType";
// import ProtoManager     from "../proto/ProtoManager";
// import CommonConstants  from "./CommonConstants";
// import Helpers          from "./Helpers";
// import Types            from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Config.ConfigManager {
    import ClientErrorCode      = Twns.ClientErrorCode;
    import TileBaseType         = Twns.Types.TileBaseType;
    import TileDecoratorType    = Twns.Types.TileDecoratorType;
    import TileObjectType       = Twns.Types.TileObjectType;
    import TileType             = Twns.Types.TileType;
    import UnitType             = Twns.Types.UnitType;

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    let _latestConfigVersion    : string | null = null;
    const _gameConfigAccessor   = Twns.Helpers.createCachedDataAccessor<string, GameConfig>({
        reqData : async (version: string) => {
            let rawConfig   : Twns.Types.FullConfig | null = null;
            const configBin = await RES.getResByUrl(
                `resource/config/FullConfig${version}.bin`,
                void 0,
                null,
                RES.ResourceItem.TYPE_BIN
            );
            rawConfig = configBin ? ProtoManager.decodeAsFullConfig(configBin) as Twns.Types.FullConfig : null;

            if (rawConfig == null) {
                _gameConfigAccessor.setData(version, null);
            } else {
                _gameConfigAccessor.setData(version, new GameConfig(version, rawConfig));
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function init(): void {
        // nothing to do.
    }

    export function getLatestConfigVersion(): string | null {
        return _latestConfigVersion;
    }
    export function setLatestConfigVersion(version: string): void {
        _latestConfigVersion = version;
    }
    export async function getGameConfig(version: string): Promise<GameConfig> {
        return Twns.Helpers.getExisted(await _gameConfigAccessor.getData(version));
    }
    export async function getLatestGameConfig(): Promise<GameConfig> {
        return await getGameConfig(Twns.Helpers.getExisted(getLatestConfigVersion()));
    }

    export function getTileType(baseType: TileBaseType, objectType: TileObjectType): TileType {
        const mapping = Twns.Helpers.getExisted(CommonConstants.TileTypeMapping.get(baseType), ClientErrorCode.ConfigManager_GetTileType_00);
        return Twns.Helpers.getExisted(mapping.get(objectType), ClientErrorCode.ConfigManager_GetTileType_01);
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

    export function checkIsValidTurnPhaseCode(turnPhaseCode: Twns.Types.TurnPhaseCode): boolean {
        return (turnPhaseCode === Twns.Types.TurnPhaseCode.Main)
            || (turnPhaseCode === Twns.Types.TurnPhaseCode.WaitBeginTurn);
    }
    export function checkIsValidCustomCrystalData(data: CommonProto.WarSerialization.ITileCustomCrystalData): boolean {
        return (data.radius != null)
            && (data.priority != null)
            && ((data.canAffectAlly ?? data.canAffectEnemy ?? data.canAffectSelf) != null)
            && ((data.deltaFuelPercentage ?? data.deltaHp ?? data.deltaPrimaryAmmoPercentage ?? data.deltaFund ?? data.deltaEnergyPercentage) != null);
    }
    export function checkIsValidCustomCannonData(data: CommonProto.WarSerialization.ITileCustomCannonData): boolean {
        return (!!(data.rangeForDown ?? data.rangeForLeft ?? data.rangeForRight ?? data.rangeForUp))
            && (data.priority != null)
            && (!!data.maxTargetCount)
            && ((data.canAffectAlly ?? data.canAffectEnemy ?? data.canAffectSelf) != null)
            && ((data.deltaFuelPercentage ?? data.deltaHp ?? data.deltaPrimaryAmmoPercentage) != null);
    }
    export function checkIsValidCustomLaserTurretData(data: CommonProto.WarSerialization.ITileCustomLaserTurretData): boolean {
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
    export function checkIsValidGridIndexSubset(gridIndexArray: CommonProto.Structure.IGridIndex[], mapSize: Twns.Types.MapSize): boolean {
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
    export function checkIsValidCustomCounterArray(customCounterArray: CommonProto.WarSerialization.ICustomCounter[]): boolean {
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
    export function checkIsValidUnitAiMode(mode: Twns.Types.UnitAiMode): boolean {
        return (mode === Twns.Types.UnitAiMode.NoMove)
            || (mode === Twns.Types.UnitAiMode.Normal)
            || (mode === Twns.Types.UnitAiMode.WaitUntilCanAttack);
    }
    export function checkIsValidValueComparator(comparator: Twns.Types.ValueComparator): boolean {
        return (comparator === Twns.Types.ValueComparator.EqualTo)
            || (comparator === Twns.Types.ValueComparator.NotEqualTo)
            || (comparator === Twns.Types.ValueComparator.GreaterThan)
            || (comparator === Twns.Types.ValueComparator.NotGreaterThan)
            || (comparator === Twns.Types.ValueComparator.LessThan)
            || (comparator === Twns.Types.ValueComparator.NotLessThan);
    }
    export function checkIsValidPlayerAliveState(aliveState: Twns.Types.PlayerAliveState): boolean {
        return (aliveState === Twns.Types.PlayerAliveState.Alive)
            || (aliveState === Twns.Types.PlayerAliveState.Dead)
            || (aliveState === Twns.Types.PlayerAliveState.Dying);
    }
    export function checkIsValidPlayerAliveStateSubset(aliveStateArray: Twns.Types.PlayerAliveState[]): boolean {
        return ((new Set(aliveStateArray)).size === aliveStateArray.length)
            && (aliveStateArray.every(v => checkIsValidPlayerAliveState(v)));
    }
    export function checkIsValidCoSkillType(skillType: Twns.Types.CoSkillType): boolean {
        return (skillType === Twns.Types.CoSkillType.Passive)
            || (skillType === Twns.Types.CoSkillType.Power)
            || (skillType === Twns.Types.CoSkillType.SuperPower);
    }
    export function checkIsValidCoSkillTypeSubset(skillTypeArray: Twns.Types.CoSkillType[]): boolean {
        return ((new Set(skillTypeArray)).size === skillTypeArray.length)
            && (skillTypeArray.every(v => checkIsValidCoSkillType(v)));
    }
    export function checkIsValidForceFogCode(forceFogCode: Twns.Types.ForceFogCode): boolean {
        return (forceFogCode === Twns.Types.ForceFogCode.None)
            || (forceFogCode === Twns.Types.ForceFogCode.Fog)
            || (forceFogCode === Twns.Types.ForceFogCode.Clear);
    }
    export function checkIsValidUnitActionState(actionState: Twns.Types.UnitActionState): boolean {
        return (actionState === Twns.Types.UnitActionState.Acted)
            || (actionState === Twns.Types.UnitActionState.Idle);
    }
    export function checkIsValidUnitActionStateSubset(actionStateArray: Twns.Types.UnitActionState[]): boolean {
        return ((new Set(actionStateArray)).size === actionStateArray.length)
            && (actionStateArray.every(v => checkIsValidUnitActionState(v)));
    }

    export function getTileBaseTypeByTileType(type: TileType): TileBaseType {
        return Twns.Helpers.getExisted(CommonConstants.TileTypeToTileBaseType.get(type), ClientErrorCode.ConfigManager_GetTileObjectTypeByTileType_00);
    }
    export function getTileObjectTypeByTileType(type: TileType): TileObjectType {
        return Twns.Helpers.getExisted(CommonConstants.TileTypeToTileObjectType.get(type), ClientErrorCode.ConfigManager_GetTileObjectTypeByTileType_00);
    }

    export function getTileBaseImageSource({version, themeType, skinId, baseType, isDark, shapeId, tickCount}: {
        version     : Twns.Types.UnitAndTileTextureVersion;
        themeType   : Twns.Types.TileThemeType;
        skinId      : number;
        baseType    : TileBaseType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        if (baseType === TileBaseType.Empty) {
            return ``;
        }

        const cfgForFrame       = Twns.Helpers.getExisted(CommonConstants.TileBaseFrameConfigs.get(version)?.get(baseType), ClientErrorCode.ConfigManager_GetTileBaseImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Twns.Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Twns.Helpers.getNumText(shapeId || 0)}`;
        const textForVersion    = `ver${Twns.Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Twns.Helpers.getNumText(skinId)}`;
        const textForType       = `type${Twns.Helpers.getNumText(baseType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Twns.Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileBase_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }
    export function getTileDecoratorImageSource({version, themeType, skinId, decoratorType, isDark, shapeId, tickCount}: {
        version         : Twns.Types.UnitAndTileTextureVersion;
        themeType       : Twns.Types.TileThemeType;
        skinId          : number;
        decoratorType   : TileDecoratorType | null;
        isDark          : boolean;
        shapeId         : number | null;
        tickCount       : number;
    }): string {
        if ((decoratorType == null) || (decoratorType === TileDecoratorType.Empty)) {
            return ``;
        }

        const cfgForFrame       = Twns.Helpers.getExisted(CommonConstants.TileDecoratorFrameConfigs.get(version)?.get(decoratorType), ClientErrorCode.ConfigManager_GetTileDecoratorImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Twns.Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Twns.Helpers.getNumText(shapeId || 0)}`;
        const textForVersion    = `ver${Twns.Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Twns.Helpers.getNumText(skinId)}`;
        const textForType       = `type${Twns.Helpers.getNumText(decoratorType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Twns.Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileDecorator_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }
    export function getTileObjectImageSource({version, themeType, skinId, objectType, isDark, shapeId, tickCount}: {
        version     : Twns.Types.UnitAndTileTextureVersion;
        themeType   : Twns.Types.TileThemeType;
        skinId      : number;
        objectType  : TileObjectType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        const cfgForFrame       = Twns.Helpers.getExisted(CommonConstants.TileObjectFrameConfigs.get(version)?.get(objectType), ClientErrorCode.ConfigManager_GetTileObjectImageSource_00);
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForTheme      = `theme${Twns.Helpers.getNumText(themeType)}`;
        const textForShapeId    = `shape${Twns.Helpers.getNumText(shapeId)}`;
        const textForVersion    = `ver${Twns.Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Twns.Helpers.getNumText(skinId)}`;
        const textForType       = `type${Twns.Helpers.getNumText(objectType)}`;
        const textForFrame      = ticksPerFrame < Number.MAX_VALUE
            ? `frame${Twns.Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`
            : `frame00`;
        return `tileObject_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
    }

    export function getUnitAndTileDefaultSkinId(playerIndex: number): number {
        return playerIndex;
    }

    export function getUnitImageSource({ version, skinId, unitType, isDark, isMoving, tickCount }: {
        version     : Twns.Types.UnitAndTileTextureVersion;
        skinId      : number;
        unitType    : UnitType;
        isDark      : boolean;
        isMoving    : boolean;
        tickCount   : number;
    }): string {
        const cfgForUnit        = Twns.Helpers.getExisted(CommonConstants.UnitImageConfigs.get(version)?.get(unitType), ClientErrorCode.ConfigManager_GetUnitImageSource_00);
        const cfgForFrame       = isMoving ? cfgForUnit.moving : cfgForUnit.idle;
        const ticksPerFrame     = cfgForFrame.ticksPerFrame;
        const textForDark       = isDark ? `state01` : `state00`;
        const textForMoving     = isMoving ? `act01` : `act00`;
        const textForVersion    = `ver${Twns.Helpers.getNumText(version)}`;
        const textForSkin       = `skin${Twns.Helpers.getNumText(skinId)}`;
        const textForType       = `type${Twns.Helpers.getNumText(unitType)}`;
        const textForFrame      = `frame${Twns.Helpers.getNumText(Math.floor((tickCount % (cfgForFrame.framesCount * ticksPerFrame)) / ticksPerFrame))}`;
        return `unit_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
    }

    export function getWeatherImageSource(weatherType: Twns.Types.WeatherType): string {
        switch (weatherType) {
            case Twns.Types.WeatherType.Clear        : return `commonIcon0026`;
            case Twns.Types.WeatherType.Rainy        : return `commonIcon0027`;
            case Twns.Types.WeatherType.Sandstorm    : return `commonIcon0028`;
            case Twns.Types.WeatherType.Snowy        : return `commonIcon0022`;
            default                             : throw Twns.Helpers.newError(`ConfigManager.getWeatherImageSource() invalid weatherType: ${weatherType}`);
        }
    }

    export function getDialogueBackgroundImage(backgroundId: number): string {
        return `resource/assets/texture/background/dialogueBackground${Twns.Helpers.getNumText(backgroundId, 4)}.jpg`;
    }

    export function getUserAvatarImageSource(avatarId: number): string {
        return `userAvatar${Twns.Helpers.getNumText(avatarId, 4)}`;
    }

    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: Twns.Types.UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
    }

    export function checkIsValidTileObjectShapeId(tileObjectType: TileObjectType, shapeId: Twns.Types.Undefinable<number>): boolean {
        const cfg = CommonConstants.TileObjectShapeConfigs.get(tileObjectType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
    export function checkIsValidTileBaseShapeId(tileBaseType: TileBaseType, shapeId: Twns.Types.Undefinable<number>): boolean {
        const cfg = CommonConstants.TileBaseShapeConfigs.get(tileBaseType);
        return (!!cfg)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }
    export function checkIsValidTileDecoratorShapeId(type: Twns.Types.Undefinable<TileDecoratorType>, shapeId: Twns.Types.Undefinable<number>): boolean {
        if (type == null) {
            return shapeId == null;
        }

        const cfg = CommonConstants.TileDecoratorShapeConfigs.get(type);
        return (cfg != null)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }

    export function getSymmetricalTileBaseShapeId(baseType: TileBaseType, shapeId: number, symmetryType: Twns.Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileBaseSymmetry.get(baseType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function getSymmetricalTileDecoratorShapeId(decoratorType: TileDecoratorType, shapeId: number, symmetryType: Twns.Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileDecoratorSymmetry.get(decoratorType);
        const shapeIdList   = cfg ? cfg.get(shapeId) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function getSymmetricalTileObjectType(objectType: TileObjectType, symmetryType: Twns.Types.SymmetryType): TileObjectType {
        return Twns.Helpers.getExisted(CommonConstants.TileObjectTypeSymmetry.get(objectType))[symmetryType];
    }
    export function getSymmetricalTileObjectShapeId(objectType: TileObjectType, shapeId: number, symmetryType: Twns.Types.SymmetryType): number | null {
        const cfg           = CommonConstants.TileObjectShapeSymmetry.get(objectType);
        const shapeIdList   = cfg ? cfg.get(shapeId || 0) : null;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    export function checkIsTileBaseSymmetrical(params: {
        baseType    : TileBaseType;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: Twns.Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileBaseShapeId(params.baseType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
    export function checkIsTileDecoratorSymmetrical({ decoratorType, shapeId1, shapeId2, symmetryType }: {
        decoratorType   : TileDecoratorType | null;
        shapeId1        : Twns.Types.Undefinable<number>;
        shapeId2        : Twns.Types.Undefinable<number>;
        symmetryType    : Twns.Types.SymmetryType;
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
        symmetryType: Twns.Types.SymmetryType;
    }): boolean {
        return getSymmetricalTileObjectShapeId(params.objectType, params.shapeId1, params.symmetryType) === (params.shapeId2 || 0);
    }
}

// export default ConfigManager;
