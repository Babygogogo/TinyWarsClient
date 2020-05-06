
namespace TinyWars.Common.CommonModel {
    import Types            = Utility.Types;
    import LocalStorage     = Utility.LocalStorage;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;

    let _unitAndTileTextureVersion      = Types.UnitAndTileTextureVersion.V1;
    let _unitAndTileTexturePrefix       = `v01_`;
    const _tileBaseNormalImageSources   = new Map<number, string>();
    const _tileBaseFogImageSources      = new Map<number, string>();
    const _tileObjectNormalImageSources = new Map<number, string>();
    const _tileObjectFogImageSources    = new Map<number, string>();
    const _unitIdleNormalImageSources   = new Map<number, string>();
    const _unitIdleDarkImageSources     = new Map<number, string>();
    const _unitMovingNormalImageSources = new Map<number, string>();
    const _unitMovingDarkImageSources   = new Map<number, string>();

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
        const version = _unitAndTileTextureVersion;
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
        const version = _unitAndTileTextureVersion;
        ConfigManager.forEachUnitTypeAndPlayerIndex((v, unitViewId) => {
            _unitIdleNormalImageSources.set(
                unitViewId,
                ConfigManager.getUnitIdleImageSource(version, unitViewId, tickCount, false)
            );
            _unitIdleDarkImageSources.set(
                unitViewId,
                ConfigManager.getUnitIdleImageSource(version, unitViewId, tickCount, true)
            );
            _unitMovingNormalImageSources.set(
                unitViewId,
                ConfigManager.getUnitMovingImageSource(version, unitViewId, tickCount, false)
            );
            _unitMovingDarkImageSources.set(
                unitViewId,
                ConfigManager.getUnitMovingImageSource(version, unitViewId, tickCount, true)
            );
        });
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

    export function getUnitIdleImageSource(unitViewId: number, isDark: boolean): string {
        return isDark
            ? _unitIdleDarkImageSources.get(unitViewId)
            : _unitIdleNormalImageSources.get(unitViewId);
    }
    export function getUnitMovingImageSource(unitViewId: number, isDark: boolean): string {
        return isDark
            ? _unitMovingDarkImageSources.get(unitViewId)
            : _unitMovingNormalImageSources.get(unitViewId);
    }
}
