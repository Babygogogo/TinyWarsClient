
// import Lang             from "../lang/Lang";
// import Notify           from "../notify/Notify";
// import Notify   from "../notify/NotifyType";
// import ProtoManager     from "../proto/ProtoManager";
// import CommonConstants  from "./CommonConstants";
// import Helpers          from "./Helpers";
// import Types            from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Config.ConfigManager {
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;

    ////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////
    const _latestVersionAccessor    = Helpers.createCachedDataAccessor<null, string>({
        reqData : () => Common.CommonProxy.reqCommonLatestConfigVersion(),
    });
    const _gameConfigAccessor       = Helpers.createCachedDataAccessor<string, GameConfig>({
        reqData : async (version: string) => {
            let rawConfig   : Types.FullConfig | null = null;
            const configBin = await RES.getResByUrl(
                `resource/config/FullConfig${version}.bin`,
                void 0,
                null,
                RES.ResourceItem.TYPE_BIN
            );
            rawConfig = configBin ? ProtoManager.decodeAsFullConfig(configBin) as Types.FullConfig : null;

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

    export async function getLatestConfigVersion(): Promise<string> {
        return Helpers.getExisted(await _latestVersionAccessor.getData(null));
    }
    export function setLatestConfigVersion(version: string): void {
        _latestVersionAccessor.setData(null, version);
    }
    export async function getGameConfig(version: string): Promise<GameConfig> {
        return Helpers.getExisted(await _gameConfigAccessor.getData(version));
    }
    export async function getLatestGameConfig(): Promise<GameConfig> {
        return await getGameConfig(await getLatestConfigVersion());
    }

    export function checkIsValidTurnPhaseCode(turnPhaseCode: Types.TurnPhaseCode): boolean {
        return (turnPhaseCode === Types.TurnPhaseCode.Main)
            || (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn);
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
    export function checkIsValidGridIndexSubset(gridIndexArray: CommonProto.Structure.IGridIndex[], mapSize: Types.MapSize): boolean {
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
    export function checkIsValidWarEventActionIdSubset(actionIdArray: number[]): boolean {
        return (actionIdArray.length <= CommonConstants.WarEventMaxActionsPerMap)
            && (actionIdArray.length === new Set(actionIdArray).size)
            && (actionIdArray.every(v => checkIsValidWarEventActionId(v)));
    }
    export function checkIsValidWarEventActionId(actionId: number): boolean {
        return (actionId > 0) && (actionId <= CommonConstants.WarEventMaxActionsPerMap);
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

    export function getUnitAndTileDefaultSkinId(playerIndex: number): number {
        return playerIndex;
    }

    export function getWeatherImageSource(weatherType: Types.WeatherType): string {
        switch (weatherType) {
            case Types.WeatherType.Clear        : return `commonIcon0026`;
            case Types.WeatherType.Rainy        : return `commonIcon0027`;
            case Types.WeatherType.Sandstorm    : return `commonIcon0028`;
            case Types.WeatherType.Snowy        : return `commonIcon0022`;
            default                             : throw Helpers.newError(`ConfigManager.getWeatherImageSource() invalid weatherType: ${weatherType}`);
        }
    }

    export function getDialogueBackgroundImage(backgroundId: number): string {
        return `resource/assets/texture/background/dialogueBackground${Helpers.getNumText(backgroundId, 4)}.jpg`;
    }

    export function getUserAvatarImageSource(avatarId: number): string {
        return `userAvatar${Helpers.getNumText(avatarId, 4)}`;
    }

    export function checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg: Types.UnitTemplateCfg): boolean {
        const diveCfgs = templateCfg.diveCfgs;
        return (diveCfgs != null) && (!!diveCfgs[1]);
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
}

// export default ConfigManager;
