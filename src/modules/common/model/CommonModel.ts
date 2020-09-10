
namespace TinyWars.Common.CommonModel {
    import Types                        = Utility.Types;
    import LocalStorage                 = Utility.LocalStorage;
    import ConfigManager                = Utility.ConfigManager;
    import Notify                       = Utility.Notify;
    import Helpers                      = Utility.Helpers;
    import UnitType                     = Types.UnitType;
    import UnitAndTileTextureVersion    = Types.UnitAndTileTextureVersion;

    type FrameCfg = {
        source  : string;
        tick    : number;
    }

    let _unitAndTileTextureVersion      = UnitAndTileTextureVersion.V1;
    let _unitAndTileTexturePrefix       = `v01_`;
    const _tileBaseNormalImageSources   = new Map<number, string>();
    const _tileBaseFogImageSources      = new Map<number, string>();
    const _tileObjectNormalImageSources = new Map<number, string>();
    const _tileObjectFogImageSources    = new Map<number, string>();

    const _unitImageSourceDict          = new Map<UnitAndTileTextureVersion, Map<boolean, Map<boolean, Map<number, Map<UnitType, FrameCfg>>>>>();

    export function init(): void {
        setUnitAndTileTextureVersion(LocalStorage.getUnitAndTileTextureVersion());
    }

    export function setUnitAndTileTextureVersion(version: Types.UnitAndTileTextureVersion): void {
        _unitAndTileTextureVersion = version;
        updateUnitAndTileTexturePrefix();
        LocalStorage.setUnitAndTileTextureVersion(version);

        tickTileImageSources(Time.TimeModel.getTileAnimationTickCount());
        tickUnitImageSources(Time.TimeModel.getUnitAnimationTickCount());
        Notify.dispatch(Notify.Type.UnitAndTileTextureVersionChanged);
    }
    export function getUnitAndTileTextureVersion(): Types.UnitAndTileTextureVersion {
        return _unitAndTileTextureVersion;
    }

    export function getUnitAndTileTexturePrefix(): string {
        return _unitAndTileTexturePrefix;
    }
    function updateUnitAndTileTexturePrefix(): void {
        _unitAndTileTexturePrefix = `v${Helpers.getNumText(getUnitAndTileTextureVersion())}_`;
    }

    export function tickTileImageSources(tickCount: number): void {
        const version = getUnitAndTileTextureVersion();
        ConfigManager.forEachTileBaseType((tileBaseType, tileBaseViewId) => {
            if (tileBaseType !== Types.TileBaseType.Empty) {
                _tileBaseNormalImageSources.set(
                    tileBaseViewId,
                    ConfigManager.getTileBaseImageSource(version, tileBaseViewId, tickCount, false)
                );
                _tileBaseFogImageSources.set(
                    tileBaseViewId,
                    ConfigManager.getTileBaseImageSource(version, tileBaseViewId, tickCount, true),
                );
            }
        });
        ConfigManager.forEachTileObjectTypeAndPlayerIndex((v, tileObjectViewId) => {
            if (v.tileObjectType !== Types.TileObjectType.Empty) {
                _tileObjectNormalImageSources.set(
                    tileObjectViewId,
                    ConfigManager.getTileObjectImageSource(version, tileObjectViewId, tickCount, false),
                );
                _tileObjectFogImageSources.set(
                    tileObjectViewId,
                    ConfigManager.getTileObjectImageSource(version, tileObjectViewId, tickCount, true),
                );
            }
        });
    }

    export function tickUnitImageSources(tickCount: number): void {
        // const version = getUnitAndTileTextureVersion();
        // ConfigManager.forEachUnitTypeAndPlayerIndex((v, unitViewId) => {
        //     _unitIdleNormalImageSources.set(
        //         unitViewId,
        //         ConfigManager.getUnitIdleImageSource(version, unitViewId, tickCount, false)
        //     );
        //     _unitIdleDarkImageSources.set(
        //         unitViewId,
        //         ConfigManager.getUnitIdleImageSource(version, unitViewId, tickCount, true)
        //     );
        //     _unitMovingNormalImageSources.set(
        //         unitViewId,
        //         ConfigManager.getUnitMovingImageSource(version, unitViewId, tickCount, false)
        //     );
        //     _unitMovingDarkImageSources.set(
        //         unitViewId,
        //         ConfigManager.getUnitMovingImageSource(version, unitViewId, tickCount, true)
        //     );
        // });
    }

    export function getTileBaseImageSource(tileBaseViewId: number, isDark: boolean): string {
        return isDark
            ? _tileBaseFogImageSources.get(tileBaseViewId)
            : _tileBaseNormalImageSources.get(tileBaseViewId);
    }
    export function getTileObjectImageSource(tileObjectViewId: number, isDark: boolean): string {
        return isDark
            ? _tileObjectFogImageSources.get(tileObjectViewId)
            : _tileObjectNormalImageSources.get(tileObjectViewId);
    }

    export function getCachedUnitImageSource(
        params: {
            version     : Types.UnitAndTileTextureVersion;
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
}
