
namespace TinyWars.Utility.SoundManager {
    import SoundType    = Types.SoundType;
    const _SOUND_PATH   = "resource/assets/sound/";

    let _bgmMute                = false;
    let _bgmVolume              = 1;    // 音量范围是0～1，1为最大音量
    let _bgmPrevName            : string;

    let _effectMute             = false;
    let _effectVolume           = 1;

    let _bgmCacheForNormal      : { [name: string]: egret.Sound } = {};
    let _bgmForNormal           : egret.SoundChannel;

    let _effectCacheForNormal   : { [name: string]: egret.Sound } = {};
    let _effectsForNormal       : { [name: string]: egret.SoundChannel } = {};

    export function init() {
        _initBgmMute();
        _initBgmVolume();
        _initEffectMute();
        _initEffectVolume();
    }

    export function resume(): void {
        playBgm(_getBgmPrevName());
    }
    export function pause(): void {
        _stopBgm();
        _stopAllEffects();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // bgm(背景音乐)
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _initBgmMute(): void {
        setIsBgmMute(LocalStorage.getIsSoundBgmMute(), false);
    }
    export function setIsBgmMute(isMute: boolean, setStore = true): void {
        if (isMute == _bgmMute) {
            return;
        }

        _bgmMute = isMute;
        if (setStore) {
            LocalStorage.setIsSoundBgmMute(isMute);
        }

        _updateBgmVolumeForNormal();
    }
    export function getIsBgmMute(): boolean {
        return _bgmMute;
    }

    function _initBgmVolume(): void {
        setBgmVolume(LocalStorage.getSoundBgmVolume(), false);
    }
    export function setBgmVolume(volume: number, setStore = true): void {
        volume          = Math.min(1, Math.max(0, volume || 0));
        _bgmVolume = volume;
        if (setStore) {
            LocalStorage.setSoundBgmVolume(volume);
        }

        _updateBgmVolumeForNormal();
    }
    export function getBgmVolume(): number {
        return _bgmVolume;
    }
    function _getRevisedBgmVolume(): number {
        return getIsBgmMute() ? 0 : getBgmVolume();
    }
    function _updateBgmVolumeForNormal(): void {
        const channel = _bgmForNormal;
        if (channel) {
            channel.volume = _getRevisedBgmVolume();
        }
    }

    function _setBgmPrevName(musicName: string): void {
        _bgmPrevName = musicName;
    }
    function _getBgmPrevName(): string {
        return _bgmPrevName;
    }
    /** 播放背景音乐，同时只能有一个在播放 */
    export function playBgm(musicName: string): void {
        if (musicName) {
            _setBgmPrevName(musicName);
            _playBgmForNormal(musicName);
        }
    }
    function _playBgmForNormal(musicName: string): void {
        const cache = _bgmCacheForNormal;
        if (cache[musicName]) {
            _doPlayBgmForNormal(cache[musicName]);
        } else {
            // _disposeAllBgm();
            RES.getResByUrl(
                getResourcePath(musicName, SoundType.Bgm),
                (sound: egret.Sound) => {
                    cache[musicName] = sound;
                    _doPlayBgmForNormal(sound);
                },
                SoundManager,
                RES.ResourceItem.TYPE_SOUND
            );
        }
    }
    function _doPlayBgmForNormal(sound: egret.Sound): void {
        if (!sound) {
            return;
        }

        _stopBgm();

        const channel               = sound.play(0, -1);
        channel.volume              = _getRevisedBgmVolume();
        _bgmForNormal  = channel;
    }

    function _stopBgm(): void {
        _stopBgmForNormal();
    }
    function _stopBgmForNormal(): void {
        if (_bgmForNormal) {
            _bgmForNormal.stop();
            _bgmForNormal = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // effect(各种音效)
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _initEffectMute(): void {
        setIsEffectMute(LocalStorage.getIsSoundEffectMute(), false);
    }
    export function setIsEffectMute(isMute: boolean, setStore = true): void {
        if (isMute == _effectMute) {
            return;
        }

        _effectMute = isMute;
        if (setStore) {
            LocalStorage.setIsSoundEffectMute(isMute);
        }

        _updateEffectVolumeForNormal();
    }
    export function getIsEffectMute(): boolean {
        return _effectMute;
    }

    function _initEffectVolume(): void {
        setEffectVolume(LocalStorage.getSoundEffectVolume());
    }
    export function setEffectVolume(volume: number, setStore = true): void {
        volume              = Math.min(1, Math.max(0, volume || 0));
        _effectVolume  = volume;
        if (setStore) {
            LocalStorage.setSoundEffectVolume(volume);
        }

        _updateEffectVolumeForNormal();
    }
    export function getEffectVolume(): number {
        return _effectVolume;
    }
    function _getRevisedEffectVolume(): number {
        return getIsEffectMute() ? 0 : getEffectVolume();
    }
    function _updateEffectVolumeForNormal(): void {
        const effects   = _effectsForNormal;
        const volume    = _getRevisedEffectVolume();
        for (const name in effects) {
            const eff = effects[name];
            (eff) && (eff.volume = volume);
        }
    }

    /** 技能或按钮的点击音效，可以同时播放多个 */
    export function playEffect(musicName: string): void {
        if (musicName) {
            _playEffectForNormal(musicName);
        }
    }
    function _playEffectForNormal(musicName: string): void {
        const cache = _effectCacheForNormal;
        if (cache[musicName]) {
            _doPlayEffectForNormal(musicName, cache[musicName]);
        } else {
            RES.getResByUrl(
                getResourcePath(musicName, SoundType.Effect),
                (sound: egret.Sound) => {
                    cache[musicName] = sound;
                    _doPlayEffectForNormal(musicName, sound);
                },
                SoundManager,
                RES.ResourceItem.TYPE_SOUND
            );
        }
    }
    function _doPlayEffectForNormal(musicName: string, sound: egret.Sound): void {
        if (!sound) {
            return;
        }

        _stopEffect(musicName);

        const channel                       = sound.play(0, 1);
        channel.volume                      = _getRevisedEffectVolume();
        _effectsForNormal[musicName]   = channel;
    }

    function _stopEffect(musicName: string): void {
        _stopEffectForNormal(musicName);
    }
    function _stopEffectForNormal(musicName: string): void {
        const effects   = _effectsForNormal;
        const eff       = effects[musicName];
        if (eff) {
            eff.stop();
            effects[musicName] = null;
        }
    }

    function _stopAllEffects(): void {
        _stopAllEffectsForNormal();
    }
    function _stopAllEffectsForNormal(): void {
        const effects = _effectsForNormal;
        for (const name in effects) {
            const eff = effects[name];
            (eff) && (eff.stop());
        }
        _effectsForNormal = {};
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 资源回收
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function dispose() {
        _disposeAllBgm();
        _disposeAllEffects();
    }
    function _disposeAllBgm(): void {
        const cache = _bgmCacheForNormal;
        for (const name in cache) {
            cache[name].close();
        }
        _bgmCacheForNormal = {};

        if (_bgmForNormal) {
            _bgmForNormal.stop();
            _bgmForNormal = null;
        }
    }
    function _disposeAllEffects(): void {
        const cache = _effectCacheForNormal;
        for (const name in cache) {
            const eff = cache[name];
            (eff) && (eff.close());
        }
        _effectCacheForNormal = {};

        const effects = _effectsForNormal;
        for (const name in effects) {
            const eff = effects[name];
            (eff) && (eff.stop());
        }
        _effectsForNormal = {};
    }

    function getResourcePath(musicName: string, soundType: SoundType): string {
        switch (soundType) {
            case SoundType.Bgm      : return _SOUND_PATH + "bgm/" + musicName;
            case SoundType.Effect   : return _SOUND_PATH + "effect/" + musicName;
            default                 : return undefined;
        }
    }
}
