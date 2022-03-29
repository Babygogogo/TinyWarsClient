
// import Types            from "../../tools/helpers/Types";
// import ConfigManager    from "../../tools/helpers/ConfigManager";
// import Helpers          from "../../tools/helpers/Helpers";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CommonModel {
    import UnitType                 = Types.UnitType;
    import TileThemeType            = Types.TileThemeType;
    import TileBaseType             = Types.TileBaseType;
    import TileDecoratorType        = Types.TileDecoratorType;
    import TileObjectType           = Types.TileObjectType;
    import TextureVersion           = Types.UnitAndTileTextureVersion;
    import IDataForMrwPlayerRank    = CommonProto.Structure.IDataForMrwPlayerRank;

    type FrameCfg = {
        source  : string | null;
        tick    : number | null;
    };

    let _unitAndTileTexturePrefix       = `v01_`;
    const _unitImageSourceDict          = new Map<TextureVersion, Map<boolean, Map<boolean, Map<number, Map<UnitType, FrameCfg>>>>>();
    const _tileBaseImageSourceDict      = new Map<TextureVersion, Map<TileThemeType, Map<number, Map<TileBaseType, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
    const _tileDecoratorImageSourceDict = new Map<TextureVersion, Map<TileThemeType, Map<number, Map<TileDecoratorType, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
    const _tileObjectImageSourceDict    = new Map<TextureVersion, Map<TileThemeType, Map<number, Map<TileObjectType, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();

    let _mrwRankArray: IDataForMrwPlayerRank[] | null = null;

    export function init(): void {
        updateOnUnitAndTileTextureVersionChanged();
    }

    export function updateOnUnitAndTileTextureVersionChanged(): void {
        updateUnitAndTileTexturePrefix();

        tickTileImageSources();
        tickUnitImageSources();
    }

    export function getUnitAndTileTexturePrefix(): string {
        return _unitAndTileTexturePrefix;
    }
    function updateUnitAndTileTexturePrefix(): void {
        _unitAndTileTexturePrefix = `v${Helpers.getNumText(UserModel.getSelfSettingsTextureVersion())}_`;
    }

    export function tickTileImageSources(): void {
        _tileBaseImageSourceDict.clear();
        _tileDecoratorImageSourceDict.clear();
        _tileObjectImageSourceDict.clear();
    }

    export function tickUnitImageSources(): void {
        _unitImageSourceDict.clear();
    }

    export function getCachedUnitImageSource(
        params: {
            version     : TextureVersion;
            skinId      : number;
            unitType    : UnitType;
            isDark      : boolean;
            isMoving    : boolean;
            tickCount   : number;
        },
    ): string {
        const { version, skinId, unitType, isDark, isMoving, tickCount } = params;
        if (!_unitImageSourceDict.has(version)) {
            _unitImageSourceDict.set(version, new Map());
        }

        const dict1 = Helpers.getExisted(_unitImageSourceDict.get(version));
        if (!dict1.has(isDark)) {
            dict1.set(isDark, new Map());
        }

        const dict2 = Helpers.getExisted(dict1.get(isDark));
        if (!dict2.has(isMoving)) {
            dict2.set(isMoving, new Map());
        }

        const dict3 = Helpers.getExisted(dict2.get(isMoving));
        if (!dict3.has(skinId)) {
            dict3.set(skinId, new Map());
        }

        const dict4 = Helpers.getExisted(dict3.get(skinId));
        if (!dict4.has(unitType)) {
            dict4.set(unitType, { source: null, tick: null });
        }

        const cfg = Helpers.getExisted(dict4.get(unitType));
        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getUnitImageSource(params);
        }

        return Helpers.getExisted(cfg.source);
    }

    export function getCachedTileBaseImageSource(params: {
        version     : TextureVersion;
        themeType   : TileThemeType;
        skinId      : number;
        baseType    : TileBaseType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        const { version, themeType, skinId, baseType, isDark, shapeId, tickCount } = params;
        if (!_tileBaseImageSourceDict.has(version)) {
            _tileBaseImageSourceDict.set(version, new Map());
        }

        const dict1 = Helpers.getExisted(_tileBaseImageSourceDict.get(version));
        if (!dict1.has(themeType)) {
            dict1.set(themeType, new Map());
        }

        const dict2 = Helpers.getExisted(dict1.get(themeType));
        if (!dict2.has(skinId)) {
            dict2.set(skinId, new Map());
        }

        const dict3 = Helpers.getExisted(dict2.get(skinId));
        if (!dict3.has(baseType)) {
            dict3.set(baseType, new Map());
        }

        const dict4 = Helpers.getExisted(dict3.get(baseType));
        if (!dict4.has(isDark)) {
            dict4.set(isDark, new Map());
        }

        const dict5 = Helpers.getExisted(dict4.get(isDark));
        if (!dict5.has(shapeId)) {
            dict5.set(shapeId, new Map());
        }

        const dict6 = Helpers.getExisted(dict5.get(shapeId));
        if (!dict6.has(tickCount)) {
            dict6.set(tickCount, { source: null, tick: null });
        }

        const cfg = Helpers.getExisted(dict6.get(tickCount));
        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getTileBaseImageSource(params);
        }

        return Helpers.getExisted(cfg.source);
    }

    export function getCachedTileDecoratorImageSource(params: {
        version         : TextureVersion;
        themeType       : TileThemeType;
        skinId          : number;
        decoratorType   : TileDecoratorType | null;
        isDark          : boolean;
        shapeId         : number | null;
        tickCount       : number;
    }): string {
        const { version, themeType, skinId, decoratorType, isDark, shapeId, tickCount } = params;
        if ((decoratorType == null)                     ||
            (decoratorType === TileDecoratorType.Empty) ||
            (shapeId == null)
        ) {
            return "";
        }

        if (!_tileDecoratorImageSourceDict.has(version)) {
            _tileDecoratorImageSourceDict.set(version, new Map());
        }

        const dict1 = Helpers.getExisted(_tileDecoratorImageSourceDict.get(version));
        if (!dict1.has(themeType)) {
            dict1.set(themeType, new Map());
        }

        const dict2 = Helpers.getExisted(dict1.get(themeType));
        if (!dict2.has(skinId)) {
            dict2.set(skinId, new Map());
        }

        const dict3 = Helpers.getExisted(dict2.get(skinId));
        if (!dict3.has(decoratorType)) {
            dict3.set(decoratorType, new Map());
        }

        const dict4 = Helpers.getExisted(dict3.get(decoratorType));
        if (!dict4.has(isDark)) {
            dict4.set(isDark, new Map());
        }

        const dict5 = Helpers.getExisted(dict4.get(isDark));
        if (!dict5.has(shapeId)) {
            dict5.set(shapeId, new Map());
        }

        const dict6 = Helpers.getExisted(dict5.get(shapeId));
        if (!dict6.has(tickCount)) {
            dict6.set(tickCount, { source: null, tick: null });
        }

        const cfg = Helpers.getExisted(dict6.get(tickCount));
        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getTileDecoratorImageSource(params);
        }

        return Helpers.getExisted(cfg.source);
    }

    export function getCachedTileObjectImageSource(params: {
        version     : TextureVersion;
        themeType   : TileThemeType;
        skinId      : number;
        objectType  : TileObjectType;
        isDark      : boolean;
        shapeId     : number;
        tickCount   : number;
    }): string {
        const { version, themeType, skinId, objectType, isDark, shapeId, tickCount } = params;
        if (!_tileObjectImageSourceDict.has(version)) {
            _tileObjectImageSourceDict.set(version, new Map());
        }

        const dict1 = Helpers.getExisted(_tileObjectImageSourceDict.get(version));
        if (!dict1.has(themeType)) {
            dict1.set(themeType, new Map());
        }

        const dict2 = Helpers.getExisted(dict1.get(themeType));
        if (!dict2.has(skinId)) {
            dict2.set(skinId, new Map());
        }

        const dict3 = Helpers.getExisted(dict2.get(skinId));
        if (!dict3.has(objectType)) {
            dict3.set(objectType, new Map());
        }

        const dict4 = Helpers.getExisted(dict3.get(objectType));
        if (!dict4.has(isDark)) {
            dict4.set(isDark, new Map());
        }

        const dict5 = Helpers.getExisted(dict4.get(isDark));
        if (!dict5.has(shapeId)) {
            dict5.set(shapeId, new Map());
        }

        const dict6 = Helpers.getExisted(dict5.get(shapeId));
        if (!dict6.has(tickCount)) {
            dict6.set(tickCount, { source: null, tick: null });
        }

        const cfg = Helpers.getExisted(dict6.get(tickCount));
        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getTileObjectImageSource(params);
        }

        return Helpers.getExisted(cfg.source);
    }

    export function setMrwRankArray(rankList: IDataForMrwPlayerRank[]): void {
        _mrwRankArray = rankList;
    }
    export function getMrwRankList(): IDataForMrwPlayerRank[] | null {
        return _mrwRankArray;
    }
}

// export default CommonModel;
