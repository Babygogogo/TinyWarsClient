
import TwnsBwWar        from "../../baseWar/model/BwWar";
import Lang             from "../lang/Lang";
import TwnsLangTextType from "../lang/LangTextType";
import FloatText        from "./FloatText";
import Helpers          from "./Helpers";
import LocalStorage     from "./LocalStorage";
import Logger           from "./Logger";
import Types            from "./Types";

namespace SoundManager {
    import SoundType            = Types.SoundType;
    import BgmCode              = Types.BgmCode;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export const DEFAULT_MUTE   = false;
    export const DEFAULT_VOLUME = 1;

    const AllBgmMinCode = BgmCode.Lobby01;
    const AllBgmMaxCode = BgmCode.Co9999;
    const CoBgmMinCode  = BgmCode.Co0001;
    const CoBgmMaxCode  = BgmCode.Co9999;

    type BgmParams = {
        name    : string;
        start   : number;
        end     : number;
    };

    const _SOUND_PATH   = "resource/assets/sound/";
    const _BGM_PARAMS   = new Map<BgmCode, BgmParams>([
        [ BgmCode.Lobby01,      { name: "lobby01.mp3",      start: 16.07,   end: 58.07  } ],
        [ BgmCode.MapEditor01,  { name: "mapEditor01.mp3",  start: 0.7,     end: 36     } ],
        [ BgmCode.Co0000,       { name: "co0000.mp3",       start: 8.5,     end: 72.5   } ],
        [ BgmCode.Co0001,       { name: "co0001.mp3",       start: 1.75,    end: 56.75  } ],
        [ BgmCode.Co0002,       { name: "co0002.mp3",       start: 1,       end: 65     } ],
        [ BgmCode.Co0003,       { name: "co0003.mp3",       start: 4.0,     end: 58.6   } ],
        [ BgmCode.Co0004,       { name: "co0004.mp3",       start: 3.25,    end: 61.35  } ],
        [ BgmCode.Co0005,       { name: "co0005.mp3",       start: 1.92,    end: 63     } ],
        [ BgmCode.Co0006,       { name: "co0006.mp3",       start: 0.7,     end: 66     } ],
        [ BgmCode.Co0007,       { name: "co0007.mp3",       start: 1.15,    end: 60     } ],
        [ BgmCode.Co0008,       { name: "co0008.mp3",       start: 3.83,    end: 65     } ],
        [ BgmCode.Co0009,       { name: "co0009.mp3",       start: 0.7,     end: 72     } ],
        [ BgmCode.Co0010,       { name: "co0010.mp3",       start: 4.95,    end: 62     } ],
        [ BgmCode.Co0011,       { name: "co0011.mp3",       start: 7.45,    end: 61.2   } ],
        [ BgmCode.Co9999,       { name: "co9999.mp3",       start: 4.7,     end: 115.44 } ],
        // [ BgmCode.War06,        { name: "war06.mp3",        start: 0.05,    end: 118.19 } ],
    ]);

    let _isInitialized          = false;
    let _audioContext           : AudioContext;

    let _bgmMute                = DEFAULT_MUTE;
    let _bgmVolume              = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
    let _playingBgmCode         = BgmCode.None;

    const _bgmBufferCache       = new Map<BgmCode, AudioBuffer>();
    let _bgmGain                : GainNode;
    let _bgmSourceNode          : AudioBufferSourceNode | undefined;

    let _effectMute             = DEFAULT_MUTE;
    let _effectVolume           = DEFAULT_VOLUME;

    let _effectCacheForNormal   : { [name: string]: egret.Sound } = {};
    let _effectsForNormal       : { [name: string]: egret.SoundChannel | undefined } = {};

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
            FloatText.show(Lang.getText(LangTextType.A0196));
        }

        _initBgmMute();
        _initBgmVolume();
        _initEffectMute();
        _initEffectVolume();

        playBgm(BgmCode.Lobby01);
    }

    export function resume(): void {
        // playBgm(_getBgmPrevCode(), true);
        try {
            _audioContext.resume();
        } catch (e) {
            // Logger.error(`SoundManager.resume() error.`);
        }
    }
    export function pause(): void {
        // _stopBgm();
        // _stopAllEffects();
        try {
            _audioContext.suspend();
        } catch (e) {
            // Logger.error(`SoundManager.pause() error.`);
        }
        _stopAllEffects();
    }

    export function playPreviousBgm(): void {
        const code = getPlayingBgmCode() - 1;
        playBgm(code >= AllBgmMinCode ? code : AllBgmMaxCode);
    }
    export function playNextBgm(): void {
        const code = getPlayingBgmCode() + 1;
        playBgm(code <= AllBgmMaxCode ? code : AllBgmMinCode);
    }
    export function playRandomCoBgm(): void {
        playBgm(Math.floor(Math.random() * (CoBgmMaxCode - CoBgmMinCode + 1)) + CoBgmMinCode);
    }
    export function playCoBgm(coId: number): void {
        const bgmFileName = `co${Helpers.getNumText(Math.floor(coId / 10000), 4)}.mp3`;
        for (const [bgmCode, param] of _BGM_PARAMS) {
            if (param.name === bgmFileName) {
                playBgm(bgmCode);
                return;
            }
        }

        playRandomCoBgm();
    }
    export function playCoBgmWithWar(war: TwnsBwWar.BwWar, force: boolean): void {
        const player = war.getPlayerInTurn();
        if (player == null) {
            Logger.error(`SoundManager.playCoBgmWithWar() empty player.`);
            return;
        }

        if ((!player.checkIsNeutral()) || (force)) {
            playCoBgm(war.getPlayerInTurn().getCoId());
        }
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
        LocalStorage.setIsSoundBgmMute(getIsBgmMute());
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

    function _setPlayingBgmCode(bgmCode: BgmCode): void {
        _playingBgmCode = bgmCode;
    }
    export function getPlayingBgmCode(): BgmCode {
        return _playingBgmCode;
    }
    /** 播放背景音乐，同时只能有一个在播放 */
    export function playBgm(bgmCode: BgmCode, forcePlayFromBeginning = false): void {
        if (!_isInitialized) {
            return;
        }

        if (!bgmCode) {
            _setPlayingBgmCode(bgmCode);
            _stopBgm();
            return;
        }

        if ((getPlayingBgmCode() !== bgmCode) || (forcePlayFromBeginning)) {
            _setPlayingBgmCode(bgmCode);
            _playBgmForNormal(bgmCode);
        }
    }
    async function _playBgmForNormal(bgmCode: BgmCode): Promise<void> {
        const params = _BGM_PARAMS.get(bgmCode);
        if (params == null) {
            Logger.error(`SoundManager._playBgmForNormal() empty params.`);
            return;
        }

        const cache         = _bgmBufferCache;
        const cachedBuffer  = cache.get(bgmCode);
        if (cachedBuffer) {
            _doPlayBgmForNormal(cachedBuffer, params);
        } else {
            const path = getResourcePath(params.name, SoundType.Bgm);
            if (path == null) {
                Logger.error(`SoundManager._playBgmForNormal() empty path.`);
                return;
            }

            const audioBuffer = await loadAudioBuffer(path);
            if (audioBuffer == null) {
                Logger.error(`SoundManager._playBgmForNormal() empty audioBuffer.`);
                return;
            }

            cache.set(bgmCode, audioBuffer);
            _doPlayBgmForNormal(audioBuffer, params);
        }
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
            } catch (e) {
                Logger.error(`SoundManager._stopBgmForNormal() error.`);
            }
            _bgmSourceNode = undefined;
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
                try {
                    eff.volume = volume;
                } catch (e) {
                    // Logger.error(`SoundManager._updateEffectVolumeForNormal() error.`);
                }
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
            const path = getResourcePath(musicName, SoundType.Effect);
            if (path == null) {
                Logger.error(`SoundManager._playEffectForNormal() empty path.`);
                return;
            }
            RES.getResByUrl(
                path,
                (sound: egret.Sound) => {
                    cache[musicName] = sound;
                    _doPlayEffectForNormal(musicName, sound);
                },
                undefined,
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
            try {
                eff.stop();
            } catch (e) {
                Logger.error(`SoundManager._stopEffectForNormal() error.`);
            }
            effects[musicName] = undefined;
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
                try {
                    eff.stop();
                } catch (e) {
                    Logger.error(`SoundManager._stopAllEffectsForNormal() error.`);
                }
            }
        }
        _effectsForNormal = {};
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 资源回收
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function dispose(): void {
        _disposeAllBgm();
        _disposeAllEffects();
    }
    function _disposeAllBgm(): void {
        _bgmBufferCache.clear();

        if (_bgmSourceNode) {
            try {
                _bgmSourceNode.stop();
                _bgmSourceNode.disconnect();
            } catch (e) {
                Logger.error(`SoundManager._disposeAllBgm() error.`);
            }
            _bgmSourceNode = undefined;
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
                try {
                    eff.stop();
                } catch (e) {
                    Logger.error(`SoundManager._disposeAllEffects() error.`);
                }
            }
        }
        _effectsForNormal = {};
    }

    function getResourcePath(musicName: string, soundType: SoundType): string | undefined {
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
            () => {
                // nothing to do.
            },
            undefined,
            RES.ResourceItem.TYPE_BIN
        );
        if (!arrayBuffer) {
            return undefined;
        }

        return await _audioContext.decodeAudioData(arrayBuffer);
    }
}

export default SoundManager;
