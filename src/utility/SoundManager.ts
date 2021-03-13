
namespace TinyWars.Utility.SoundManager {
    import SoundType            = Types.SoundType;

    export const DEFAULT_MUTE   = false;
    export const DEFAULT_VOLUME = 1;
    export const enum BgmCode {
        None        = 0,
        Lobby01,
        MapEditor01,
        War01,
        War02,
        War03,
        War04,
        War05,
        War06,
    }
    const AllBgmMinCode = BgmCode.Lobby01;
    const AllBgmMaxCode = BgmCode.War06;
    const WarBgmMinCode = BgmCode.War01;
    const WarBgmMaxCode = BgmCode.War06;

    type BgmParams = {
        name    : string;
        start   : number;
        end     : number;
    };

    const _SOUND_PATH   = "resource/assets/sound/";
    const _BGM_PARAMS   = new Map<BgmCode, BgmParams>([
        [ BgmCode.Lobby01,      { name: "lobby01.mp3",      start: 16.07,   end: 58.07  } ],
        [ BgmCode.MapEditor01,  { name: "mapEditor01.mp3",  start: 0.7,     end: 36     } ],
        [ BgmCode.War01,        { name: "war01.mp3",        start: 1.75,    end: 56.75  } ],
        [ BgmCode.War02,        { name: "war02.mp3",        start: 1.15,    end: 60     } ],
        [ BgmCode.War03,        { name: "war03.mp3",        start: 1,       end: 65     } ],
        [ BgmCode.War04,        { name: "war04.mp3",        start: 1.92,    end: 63     } ],
        [ BgmCode.War05,        { name: "war05.mp3",        start: 8.5,     end: 72.5   } ],
        // [ BgmCode.War06,        { name: "war06.mp3",        start: 0.05,    end: 118.19 } ],
        [ BgmCode.War06,        { name: "war06.mp3",        start: 4.7,     end: 115.44 } ],
    ]);

    let _isInitialized          = false;
    let _audioContext           : AudioContext;

    let _bgmMute                = DEFAULT_MUTE;
    let _bgmVolume              = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
    let _bgmPrevCode            = BgmCode.None;

    const _bgmBufferCache       = new Map<BgmCode, AudioBuffer>();
    let _bgmGain                : GainNode;
    let _bgmSourceNode          : AudioBufferSourceNode;

    let _effectMute             = DEFAULT_MUTE;
    let _effectVolume           = DEFAULT_VOLUME;

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
        if (_isInitialized) {
            return;
        }
        _isInitialized = true;

        try {
            _audioContext   = new AudioContext();
            _bgmGain        = _audioContext.createGain();
            _bgmGain.connect(_audioContext.destination);
        } catch (e) {
            FloatText.show(Lang.getText(Lang.Type.A0196));
        }

        _initBgmMute();
        _initBgmVolume();
        _initEffectMute();
        _initEffectVolume();

        playBgm(BgmCode.Lobby01);
    }

    export function resume(): void {
        playBgm(_getBgmPrevCode(), true);
    }
    export function pause(): void {
        _stopBgm();
        _stopAllEffects();
    }

    export function playPreviousBgm(): void {
        const code = _getBgmPrevCode() - 1;
        playBgm(code >= AllBgmMinCode ? code : AllBgmMaxCode);
    }
    export function playNextBgm(): void {
        const code = _getBgmPrevCode() + 1;
        playBgm(code <= AllBgmMaxCode ? code : AllBgmMinCode);
    }
    export function playRandomWarBgm(): void {
        playBgm(Math.floor(Math.random() * (WarBgmMaxCode - WarBgmMinCode + 1)) + WarBgmMinCode);
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
        const gain = _bgmGain;
        if (gain) {
            gain.gain.value = _getRevisedBgmVolume();
        }
    }

    function _setBgmPrevCode(bgmCode: BgmCode): void {
        _bgmPrevCode = bgmCode;
    }
    function _getBgmPrevCode(): BgmCode {
        return _bgmPrevCode;
    }
    /** 播放背景音乐，同时只能有一个在播放 */
    export function playBgm(bgmCode: BgmCode, forcePlayFromBeginning = false): void {
        if (!_isInitialized) {
            return;
        }

        if (!bgmCode) {
            _stopBgm();
            return;
        }

        if ((_getBgmPrevCode() !== bgmCode) || (forcePlayFromBeginning)) {
            _setBgmPrevCode(bgmCode);
            _playBgmForNormal(bgmCode);
        }
    }
    async function _playBgmForNormal(bgmCode: BgmCode): Promise<void> {
        const cache     = _bgmBufferCache;
        const params    = _BGM_PARAMS.get(bgmCode);
        if (!cache.has(bgmCode)) {
            cache.set(bgmCode, await loadAudioBuffer(getResourcePath(params.name, SoundType.Bgm)));
        }

        _doPlayBgmForNormal(cache.get(bgmCode), params);
    }
    function _doPlayBgmForNormal(buffer: AudioBuffer, params: BgmParams): void {
        if (!buffer) {
            return;
        }

        _stopBgm();

        _bgmSourceNode              = _audioContext.createBufferSource();
        _bgmSourceNode.buffer       = buffer;
        _bgmSourceNode.loopStart    = params.start;
        _bgmSourceNode.loopEnd      = params.end;
        _bgmSourceNode.loop         = true;
        _bgmSourceNode.connect(_bgmGain);
        _bgmSourceNode.start();
    }

    function _stopBgm(): void {
        _stopBgmForNormal();
    }
    function _stopBgmForNormal(): void {
        if (_bgmSourceNode) {
            try {
                _bgmSourceNode.stop();
                _bgmSourceNode.disconnect();
            } catch (e) {};
            _bgmSourceNode = null;
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
        _bgmBufferCache.clear();

        if (_bgmSourceNode) {
            try {
                _bgmSourceNode.stop();
                _bgmSourceNode.disconnect();
            } catch (e) {};
            _bgmSourceNode = null;
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
