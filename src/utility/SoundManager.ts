
namespace TinyWars.Utility.SoundManager {
    import SoundType            = Types.SoundType;

    export const DEFAULT_MUTE   = false;
    export const DEFAULT_VOLUME = 1;

    const _SOUND_PATH           = "resource/assets/sound/";

    let _audioGain              : GainNode;
    let _audioContext           : AudioContext;
    let _audioSource            : AudioBufferSourceNode;
    const _audioBuffers         = new Map<string, AudioBuffer>();

    let _bgmMute                = DEFAULT_MUTE;
    let _bgmVolume              = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
    let _bgmPrevName            : string;

    let _effectMute             = DEFAULT_MUTE;
    let _effectVolume           = DEFAULT_VOLUME;

    let _bgmCacheForNormal      : { [name: string]: egret.Sound } = {};
    let _bgmForNormal           : egret.SoundChannel;

    let _effectCacheForNormal   : { [name: string]: egret.Sound } = {};
    let _effectsForNormal       : { [name: string]: egret.SoundChannel } = {};

    // const audio = new Audio(getResourcePath("war01.mp3", SoundType.Bgm));
    // audio.play();
    // audio.addEventListener(
    //     'timeupdate',
    //     () => {
    //         if (audio.currentTime > audio.duration - 0.77) {
    //             audio.currentTime = 1.75;
    //             audio.play();
    //         }
    //     },
    //     false
    // );

    export async function init(): Promise<void> {
        _initBgmMute();
        _initBgmVolume();
        _initEffectMute();
        _initEffectVolume();

        try {
            _audioContext   = new AudioContext();
            _audioGain      = _audioContext.createGain();
            _audioSource    = _audioContext.createBufferSource();
            _audioSource.connect(_audioGain);
            _audioGain.connect(_audioContext.destination);

            const buffer = await loadAudioBuffer(getResourcePath("war01.mp3", SoundType.Bgm));
            const source = _audioSource;
            source.buffer       = buffer;
            source.loopStart    = 1.75;
            source.loopEnd      = 56.75;
            source.loop         = true;
            source.start();

        } catch (e) {
            FloatText.show(Lang.getText(Lang.Type.A0196));
        }
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
        setIsBgmMute(LocalStorage.getIsSoundBgmMute());
    }
    export function setIsBgmMute(isMute: boolean): void {
        if (isMute == getIsBgmMute()) {
            return;
        }

        _bgmMute = isMute;
        _updateBgmVolumeForNormal();
    }
    export function setIsBgmMuteToStore(): void {
        LocalStorage.setIsSoundBgmMute(this.getIsBgmMute());
    }
    export function getIsBgmMute(): boolean {
        return _bgmMute;
    }

    function _initBgmVolume(): void {
        setBgmVolume(LocalStorage.getSoundBgmVolume());
    }
    export function setBgmVolume(volume: number): void {
        volume = Math.min(1, Math.max(0, volume || 0));
        if (volume === getBgmVolume()) {
            return;
        }

        _bgmVolume = volume;
        _updateBgmVolumeForNormal();
    }
    export function setBgmVolumeToStore(): void {
        LocalStorage.setSoundBgmVolume(getBgmVolume());
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
            try { channel.volume = _getRevisedBgmVolume(); } catch (e) {}
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

        const channel   = sound.play(0, -1);
        channel.volume  = _getRevisedBgmVolume();
        _bgmForNormal   = channel;
    }

    function _stopBgm(): void {
        _stopBgmForNormal();
    }
    function _stopBgmForNormal(): void {
        if (_bgmForNormal) {
            try { _bgmForNormal.stop(); } catch (e) {};
            _bgmForNormal = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // effect(各种音效)
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _initEffectMute(): void {
        setIsEffectMute(LocalStorage.getIsSoundEffectMute());
    }
    export function setIsEffectMute(isMute: boolean): void {
        if (isMute === getIsEffectMute()) {
            return;
        }

        _effectMute = isMute;
        _updateEffectVolumeForNormal();
    }
    export function setIsEffectMuteToStore(): void {
        LocalStorage.setIsSoundEffectMute(getIsEffectMute());
    }
    export function getIsEffectMute(): boolean {
        return _effectMute;
    }

    function _initEffectVolume(): void {
        setEffectVolume(LocalStorage.getSoundEffectVolume());
    }
    export function setEffectVolume(volume: number): void {
        volume = Math.min(1, Math.max(0, volume || 0));
        if (volume === getEffectVolume()) {
            return;
        }

        _effectVolume = volume;
        _updateEffectVolumeForNormal();
    }
    export function setEffectVolumeToStore(): void {
        LocalStorage.setSoundEffectVolume(getEffectVolume());
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
            if (eff) {
                try { eff.volume = volume; } catch (e) {};
            }
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

        const channel                   = sound.play(0, 1);
        channel.volume                  = _getRevisedEffectVolume();
        _effectsForNormal[musicName]    = channel;
    }

    function _stopEffect(musicName: string): void {
        _stopEffectForNormal(musicName);
    }
    function _stopEffectForNormal(musicName: string): void {
        const effects   = _effectsForNormal;
        const eff       = effects[musicName];
        if (eff) {
            try { eff.stop(); } catch (e) {};
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
            if (eff) {
                try { eff.stop(); } catch (e) {};
            }
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
            try { _bgmForNormal.stop(); } catch (e) {};
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
            if (eff) {
                try { eff.stop(); } catch (e) {};
            }
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

    async function loadAudioBuffer(fullName: string): Promise<AudioBuffer | undefined> {
        if (!_audioContext) {
            return undefined;
        }

        const arrayBuffer = await RES.getResByUrl(
            fullName,
            () => {},
            SoundManager,
            RES.ResourceItem.TYPE_BIN
        );
        if (!arrayBuffer) {
            return undefined;
        }

        return await _audioContext.decodeAudioData(arrayBuffer);
    }
}
