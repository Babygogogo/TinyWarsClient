
namespace TinyWars.Common.CommonModel {
    import Types            = Utility.Types;
    import LocalStorage     = Utility.LocalStorage;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import UnitType         = Types.UnitType;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import TextureVersion   = Types.UnitAndTileTextureVersion;

    type FrameCfg = {
        source  : string;
        tick    : number;
    }

    let _unitAndTileTextureVersion      = TextureVersion.V1;
    let _unitAndTileTexturePrefix       = `v01_`;
    const _unitImageSourceDict          = new Map<TextureVersion, Map<boolean, Map<boolean, Map<number, Map<UnitType, FrameCfg>>>>>();
    const _tileBaseImageSourceDict      = new Map<TextureVersion, Map<number, Map<TileBaseType, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>();
    const _tileObjectImageSourceDict    = new Map<TextureVersion, Map<number, Map<TileObjectType, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>();

    export function init(): void {
        setUnitAndTileTextureVersion(LocalStorage.getUnitAndTileTextureVersion());
    }

    export function setUnitAndTileTextureVersion(version: TextureVersion): void {
        _unitAndTileTextureVersion = version;
        updateUnitAndTileTexturePrefix();
        LocalStorage.setUnitAndTileTextureVersion(version);

        tickTileImageSources();
        tickUnitImageSources();
        Notify.dispatch(Notify.Type.UnitAndTileTextureVersionChanged);
    }
    export function getUnitAndTileTextureVersion(): TextureVersion {
        return _unitAndTileTextureVersion;
    }

    export function getUnitAndTileTexturePrefix(): string {
        return _unitAndTileTexturePrefix;
    }
    function updateUnitAndTileTexturePrefix(): void {
        _unitAndTileTexturePrefix = `v${Helpers.getNumText(getUnitAndTileTextureVersion())}_`;
    }

    export function tickTileImageSources(): void {
        _tileBaseImageSourceDict.clear();
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
    ): string | undefined {
        const { version, skinId, unitType, isDark, isMoving, tickCount } = params;

        if (!_unitImageSourceDict.has(version)) {
            _unitImageSourceDict.set(version, new Map());
        }
        const dict1 = _unitImageSourceDict.get(version);

        if (!dict1.has(isDark)) {
            dict1.set(isDark, new Map());
        }
        const dict2 = dict1.get(isDark);

        if (!dict2.has(isMoving)) {
            dict2.set(isMoving, new Map());
        }
        const dict3 = dict2.get(isMoving);

        if (!dict3.has(skinId)) {
            dict3.set(skinId, new Map());
        }
        const dict4 = dict3.get(skinId);

        if (!dict4.has(unitType)) {
            dict4.set(unitType, { source: undefined, tick: undefined });
        }
        const cfg = dict4.get(unitType);

        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getUnitImageSource(params);
        }
        return cfg.source;
    }

    export function getCachedTileBaseImageSource(
        params: {
            version     : TextureVersion;
            skinId      : number;
            baseType    : TileBaseType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string | undefined {
        const { version, skinId, baseType, isDark, shapeId, tickCount } = params;

        if (!_tileBaseImageSourceDict.has(version)) {
            _tileBaseImageSourceDict.set(version, new Map());
        }
        const dict1 = _tileBaseImageSourceDict.get(version);

        if (!dict1.has(skinId)) {
            dict1.set(skinId, new Map());
        }
        const dict2 = dict1.get(skinId);

        if (!dict2.has(baseType)) {
            dict2.set(baseType, new Map());
        }
        const dict3 = dict2.get(baseType);

        if (!dict3.has(isDark)) {
            dict3.set(isDark, new Map());
        }
        const dict4 = dict3.get(isDark);

        if (!dict4.has(shapeId)) {
            dict4.set(shapeId, new Map());
        }
        const dict5 = dict4.get(shapeId);

        if (!dict5.has(tickCount)) {
            dict5.set(tickCount, { source: undefined, tick: undefined });
        }
        const cfg = dict5.get(baseType);

        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getTileBaseImageSource(params);
        }
        return cfg.source;
    }

    export function getCachedTileObjectImageSource(
        params: {
            version     : TextureVersion;
            skinId      : number;
            objectType  : TileObjectType;
            isDark      : boolean;
            shapeId     : number;
            tickCount   : number;
        },
    ): string | undefined {
        const { version, skinId, objectType, isDark, shapeId, tickCount } = params;

        if (!_tileObjectImageSourceDict.has(version)) {
            _tileObjectImageSourceDict.set(version, new Map());
        }
        const dict1 = _tileObjectImageSourceDict.get(version);

        if (!dict1.has(skinId)) {
            dict1.set(skinId, new Map());
        }
        const dict2 = dict1.get(skinId);

        if (!dict2.has(objectType)) {
            dict2.set(objectType, new Map());
        }
        const dict3 = dict2.get(objectType);

        if (!dict3.has(isDark)) {
            dict3.set(isDark, new Map());
        }
        const dict4 = dict3.get(isDark);

        if (!dict4.has(shapeId)) {
            dict4.set(shapeId, new Map());
        }
        const dict5 = dict4.get(shapeId);

        if (!dict5.has(tickCount)) {
            dict5.set(tickCount, { source: undefined, tick: undefined });
        }
        const cfg = dict5.get(objectType);

        if (cfg.tick !== tickCount) {
            cfg.tick    = tickCount;
            cfg.source  = ConfigManager.getTileObjectImageSource(params);
        }
        return cfg.source;
    }
}
