
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Lang                 from "../lang/Lang";
// import TwnsLangTextType     from "../lang/LangTextType";
// import FloatText            from "./FloatText";
// import Helpers              from "./Helpers";
// import LocalStorage         from "./LocalStorage";
// import Logger               from "./Logger";
// import Types                from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SoundManager {
    import SoundType            = Types.SoundType;
    import ShortSfxCode         = Types.ShortSfxCode;
    import LongSfxCode          = Types.LongSfxCode;
    import UnitType             = Types.UnitType;
    import LangTextType         = Lang.LangTextType;

    export const DEFAULT_MUTE   = false;
    export const DEFAULT_VOLUME = 1;

    type LongSfxParams = {
        name    : string;
        start   : number;
        end     : number;
    };
    type ShortSfxParams = {
        name    : string;
    };

    const _SOUND_PATH       = "resource/assets/sound/";
    const _SHORT_SFX_PARAM  = new Map<ShortSfxCode, ShortSfxParams>([
        [ ShortSfxCode.ButtonNeutral01,     { name: "buttonNeutral01.mp3"   } ],
        [ ShortSfxCode.ButtonConfirm01,     { name: "buttonConfirm01.mp3"   } ],
        [ ShortSfxCode.ButtonCancel01,      { name: "buttonCancel01.mp3"    } ],
        [ ShortSfxCode.ButtonForbidden01,   { name: `buttonForbidden01.mp3` } ],
        [ ShortSfxCode.CursorConfirm01,     { name: "cursorConfirm01.mp3"   } ],
        [ ShortSfxCode.CursorMove01,        { name: "cursorMove01.mp3"      } ],
        [ ShortSfxCode.Explode,             { name: "explode.mp3"           } ],
    ]);
    const _LONG_SFX_PARAMS = new Map<LongSfxCode, LongSfxParams>([
        [ LongSfxCode.NavalMove,        { name: "navalMove.mp3",    start: 1.52,    end: 2.61                       } ], // 0.37
        [ LongSfxCode.CopterMove,       { name: "copterMove.mp3",   start: 0.06,    end: 0.06 + (0.351 - 0.047) * 4 } ],
        [ LongSfxCode.JetMove,          { name: "jetMove.mp3",      start: 1.518,   end: 1.518 + 0.192 * 1          } ],
        [ LongSfxCode.TireMove,         { name: "tireMove.mp3",     start: 0.62,    end: 0.62 + 0.266 * 1           } ],
        [ LongSfxCode.FootMove,         { name: "footMove.mp3",     start: 0.00,    end: 0.153                      } ],
        [ LongSfxCode.TankMove,         { name: "tankMove.mp3",     start: 0.15,    end: 0.25                       } ],
    ]);
    const _UNIT_MOVE_SFX_CODES = new Map<UnitType, LongSfxCode>([
        [ UnitType.Infantry,        LongSfxCode.FootMove    ],
        [ UnitType.Mech,            LongSfxCode.FootMove    ],
        [ UnitType.Bike,            LongSfxCode.TireMove    ],
        [ UnitType.Recon,           LongSfxCode.TireMove    ],
        [ UnitType.Flare,           LongSfxCode.TankMove    ],
        [ UnitType.AntiAir,         LongSfxCode.TankMove    ],
        [ UnitType.Tank,            LongSfxCode.TankMove    ],
        [ UnitType.MediumTank,      LongSfxCode.TankMove    ],
        [ UnitType.WarTank,         LongSfxCode.TankMove    ],
        [ UnitType.Artillery,       LongSfxCode.TankMove    ],
        [ UnitType.AntiTank,        LongSfxCode.TireMove    ],
        [ UnitType.Rockets,         LongSfxCode.TireMove    ],
        [ UnitType.Missiles,        LongSfxCode.TireMove    ],
        [ UnitType.Rig,             LongSfxCode.TankMove    ],
        [ UnitType.Fighter,         LongSfxCode.JetMove     ],
        [ UnitType.Bomber,          LongSfxCode.JetMove     ],
        [ UnitType.Duster,          LongSfxCode.CopterMove  ],
        [ UnitType.BattleCopter,    LongSfxCode.CopterMove  ],
        [ UnitType.TransportCopter, LongSfxCode.CopterMove  ],
        [ UnitType.Seaplane,        LongSfxCode.JetMove     ],
        [ UnitType.Battleship,      LongSfxCode.NavalMove   ],
        [ UnitType.Carrier,         LongSfxCode.NavalMove   ],
        [ UnitType.Submarine,       LongSfxCode.NavalMove   ],
        [ UnitType.Cruiser,         LongSfxCode.NavalMove   ],
        [ UnitType.Lander,          LongSfxCode.NavalMove   ],
        [ UnitType.Gunboat,         LongSfxCode.NavalMove   ],
    ]);
    const _UNIT_MOVE_FADEOUT_TIME   = 0.6;

    let _isInitialized              = false;
    let _audioContext               : AudioContext;

    let _bgmMute                    = DEFAULT_MUTE;
    let _bgmVolume                  = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
    let _playingBgmCode             = CommonConstants.BgmCode.None;

    const _bgmBufferCache           = new Map<number, AudioBuffer>();
    let _bgmGain                    : GainNode;
    let _bgmSourceNode              : AudioBufferSourceNode | null = null;

    let _sfxMute                    = DEFAULT_MUTE;
    let _sfxVolume                  = DEFAULT_VOLUME;
    let _playingLongSfxCode         = LongSfxCode.None;
    let _timeoutIdForStopLongSfx    : number | null = null;

    const _longSfxBufferCache       = new Map<LongSfxCode, AudioBuffer>();
    const _shortSfxBufferCache      = new Map<ShortSfxCode, AudioBuffer>();
    let _shortSfxGain               : GainNode;
    let _longSfxGain                : GainNode;
    let _longSfxSourceNode          : AudioBufferSourceNode | null = null;

    // const _shortSfxDict         : { [shortSfxCode: number]: egret.SoundChannel | null } = {};

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
            _shortSfxGain   = _audioContext.createGain();
            _longSfxGain    = _audioContext.createGain();

            const destination = _audioContext.destination;
            _bgmGain.connect(destination);
            _shortSfxGain.connect(destination);
            _longSfxGain.connect(destination);
        } catch (e) {
            FloatText.show(Lang.getText(LangTextType.A0196));
        }

        _initBgmMute();
        _initBgmVolume();
        _initEffectMute();
        _initEffectVolume();

        playBgm(CommonConstants.BgmCode.Lobby);
    }

    export function resume(): void {
        // playBgm(_getBgmPrevCode(), true);
        try {
            _audioContext.resume();
        } catch (e) {
            // throw Helpers.newError(`SoundManager.resume() error.`);
        }
    }
    export function pause(): void {
        // _stopBgm();
        // _stopAllEffects();
        try {
            _audioContext.suspend();
        } catch (e) {
            // throw Helpers.newError(`SoundManager.pause() error.`);
        }
        _stopAllShortSfx();
    }

    export async function playPreviousBgm(): Promise<void> {
        const bgmCodeArray  = (await Config.ConfigManager.getLatestGameConfig()).getAllBgmCodeArray();
        const index         = bgmCodeArray.indexOf(getPlayingBgmCode());
        if (index < 0) {
            playBgm(CommonConstants.BgmCode.Lobby);
        } else {
            const length = bgmCodeArray.length;
            playBgm(bgmCodeArray[(index + length - 1) % length]);
        }
    }
    export async function playNextBgm(): Promise<void> {
        const bgmCodeArray  = (await Config.ConfigManager.getLatestGameConfig()).getAllBgmCodeArray();
        const index         = bgmCodeArray.indexOf(getPlayingBgmCode());
        if (index < 0) {
            playBgm(CommonConstants.BgmCode.Lobby);
        } else {
            playBgm(bgmCodeArray[(index + 1) % bgmCodeArray.length]);
        }
    }
    export function playCoBgm(coId: number, gameConfig: Config.GameConfig): void {
        playBgm(gameConfig.getCoBasicCfg(coId)?.bgmCode ?? CommonConstants.BgmCode.CoEmpty);
    }
    export function playCoBgmWithWar(war: BaseWar.BwWar, force: boolean): void {
        const player = war.getPlayerInTurn();
        if ((player.checkIsNeutral()) && (!force)) {
            return;
        }

        if (player.checkCoIsUsingActiveSkill()) {
            playBgm(CommonConstants.BgmCode.CoPower);
        } else {
            playCoBgm(player.getCoId(), war.getGameConfig());
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
            gain.gain.setValueAtTime(_getRevisedBgmVolume(), _audioContext.currentTime);
        }
    }

    function _setPlayingBgmCode(bgmCode: number): void {
        _playingBgmCode = bgmCode;
    }
    export function getPlayingBgmCode(): number {
        return _playingBgmCode;
    }
    /** 播放背景音乐，同时只能有一个在播放 */
    export function playBgm(bgmCode: number, forcePlayFromBeginning = false): void {
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
    async function _playBgmForNormal(bgmCode: number): Promise<void> {
        const bgmCfg        = Helpers.getExisted((await Config.ConfigManager.getLatestGameConfig()).getBgmSfxCfg(bgmCode), ClientErrorCode.SoundManager_PlayBgmForNormal_00);
        const cacheDict     = _bgmBufferCache;
        const cachedBuffer  = cacheDict.get(bgmCode);
        if (cachedBuffer) {
            _doPlayBgmForNormal(cachedBuffer, bgmCfg);
        } else {
            const path          = getResourcePath(bgmCfg.filename, SoundType.Bgm);
            const audioBuffer   = await loadAudioBuffer(path).catch(err => {
                // CompatibilityHelpers.showError(err); throw err;
                Logger.error(`SoundManager._playBgmForNormal() loadAudioBuffer error: ${(err as Error).message}.`);
            });
            if (!audioBuffer) {
                // throw Helpers.newError(`SoundManager._playBgmForNormal() empty audioBuffer.`);
                Logger.error(`SoundManager._playBgmForNormal() empty audioBuffer.`);
                return;
            }

            cacheDict.set(bgmCode, audioBuffer);
            if (bgmCode === getPlayingBgmCode()) {
                _doPlayBgmForNormal(audioBuffer, bgmCfg);
            }
        }
    }
    function _doPlayBgmForNormal(buffer: AudioBuffer, params: Types.BgmSfxCfg): void {
        if (!buffer) {
            return;
        }

        _stopBgm();

        _bgmSourceNode              = _audioContext.createBufferSource();
        _bgmSourceNode.buffer       = buffer;
        _bgmSourceNode.loopStart    = Helpers.getExisted(params.loopStart) / 10000;
        _bgmSourceNode.loopEnd      = Helpers.getExisted(params.loopEnd) / 10000;
        _bgmSourceNode.loop         = true;
        _bgmSourceNode.connect(_bgmGain);
        _bgmSourceNode.start();
    }

    function _stopBgm(): void {
        _stopBgmForNormal();
    }
    function _stopBgmForNormal(): void {
        if (_bgmSourceNode) {
            _bgmSourceNode.stop();
            _bgmSourceNode.disconnect();
            _bgmSourceNode = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 音效音量控制
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _initEffectMute(): void {
        setIsEffectMute(LocalStorage.getIsSoundEffectMute());
    }
    export function setIsEffectMute(isMute: boolean): void {
        if (isMute === getIsEffectMute()) {
            return;
        }

        _sfxMute = isMute;
        _updateShortSfxVolume();
        _updateLongSfxVolume();
    }
    export function setIsEffectMuteToStore(): void {
        LocalStorage.setIsSoundEffectMute(getIsEffectMute());
    }
    export function getIsEffectMute(): boolean {
        return _sfxMute;
    }

    function _initEffectVolume(): void {
        setEffectVolume(LocalStorage.getSoundEffectVolume());
    }
    export function setEffectVolume(volume: number): void {
        volume = Math.min(1, Math.max(0, volume || 0));
        if (volume === getEffectVolume()) {
            return;
        }

        _sfxVolume = volume;
        _updateShortSfxVolume();
        _updateLongSfxVolume();
    }
    export function setEffectVolumeToStore(): void {
        LocalStorage.setSoundEffectVolume(getEffectVolume());
    }
    export function getEffectVolume(): number {
        return _sfxVolume;
    }
    function _getRevisedSfxVolume(): number {
        return getIsEffectMute() ? 0 : getEffectVolume();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 短音效，可以同时播放多个
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _updateShortSfxVolume(): void {
        const volume        = _getRevisedSfxVolume();
        const shortSfxGain  = _shortSfxGain;
        if (shortSfxGain) {
            shortSfxGain.gain.setValueAtTime(volume, _audioContext.currentTime);
        }
    }

    /** 技能或按钮的点击音效，可以同时播放多个 */
    export async function playShortSfx(shortSfxCode: ShortSfxCode): Promise<void> {
        if (!_isInitialized) {
            return;
        }

        if ((shortSfxCode == null) || (shortSfxCode === ShortSfxCode.None)) {
            return;
        }

        const params        = Helpers.getExisted(_SHORT_SFX_PARAM.get(shortSfxCode), ClientErrorCode.SoundManager_PlayShortSfx_00);
        const cacheDict     = _shortSfxBufferCache;
        const cachedBuffer  = cacheDict.get(shortSfxCode);
        if (cachedBuffer) {
            _doPlayShortSfx(cachedBuffer);
        } else {
            const path          = getResourcePath(params.name, SoundType.Sfx);
            const audioBuffer   = await loadAudioBuffer(path).catch(err => {
                // CompatibilityHelpers.showError(err); throw err;
                Logger.error(`SoundManager.playShortSfx() loadAudioBuffer error: ${(err as Error).message}`);
                return;
            });
            if (!audioBuffer) {
                // throw Helpers.newError(`SoundManager.playShortSfx() empty audioBuffer.`);
                Logger.error(`SoundManager.playShortSfx() empty audioBuffer.`);
                return;
            }

            cacheDict.set(shortSfxCode, audioBuffer);
            _doPlayShortSfx(audioBuffer);
        }
    }
    function _doPlayShortSfx(buffer: AudioBuffer): void {
        if (!buffer) {
            return;
        }

        // _stopShortSfx(buffer);

        const sourceNode    = _audioContext.createBufferSource();
        sourceNode.buffer   = buffer;
        sourceNode.connect(_shortSfxGain);
        sourceNode.start();
    }

    // function _stopShortSfx(shortSfxCode: ShortSfxCode): void {
    //     const effectDict    = _shortSfxDict;
    //     const eff           = effectDict[shortSfxCode];
    //     if (eff) {
    //         try {
    //             eff.stop();
    //         } catch (e) {
    //             throw Helpers.newError(`SoundManager._stopShortSfx() error.`);
    //         }
    //         effectDict[shortSfxCode] = null;
    //     }
    // }

    function _stopAllShortSfx(): void {
        // const dict = _shortSfxDict;
        // for (const name in dict) {
        //     const eff = dict[name];
        //     if (eff) {
        //         try {
        //             eff.stop();
        //         } catch (e) {
        //             throw Helpers.newError(`SoundManager._stopAllShortSfx() error.`);
        //         }
        //     }
        // }
        // _shortSfxDict = {};
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 长音效，同时只能有一个在播放
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function playLongSfxForMoveUnit(unitType: Types.UnitType): void {
        if (_timeoutIdForStopLongSfx != null) {
            egret.clearTimeout(_timeoutIdForStopLongSfx);
            _timeoutIdForStopLongSfx = null;
        }
        if (_longSfxGain) {
            _longSfxGain.gain.cancelScheduledValues(_audioContext.currentTime);
        }

        _updateLongSfxVolume();
        playLongSfx(Helpers.getExisted(_UNIT_MOVE_SFX_CODES.get(unitType), ClientErrorCode.SoundManager_PlayLongSfxForMoveUnit_00));
    }
    export function fadeoutLongSfxForMoveUnit(): void {
        const gain = _longSfxGain?.gain;
        if (gain == null) {
            return;
        }

        const volume        = _getRevisedSfxVolume();
        const currentTime   = _audioContext.currentTime;
        gain.cancelScheduledValues(currentTime);
        gain.setValueAtTime(volume, currentTime);
        if (volume <= 0) {
            playLongSfx(LongSfxCode.None);
        } else {
            gain.exponentialRampToValueAtTime(0.01, currentTime + _UNIT_MOVE_FADEOUT_TIME);
            _timeoutIdForStopLongSfx = egret.setTimeout(() => playLongSfx(LongSfxCode.None), null, _UNIT_MOVE_FADEOUT_TIME * 1000);
        }
    }

    function _updateLongSfxVolume(): void {
        const volume        = _getRevisedSfxVolume();
        const longSfxGain   = _longSfxGain;
        if (longSfxGain) {
            longSfxGain.gain.setValueAtTime(volume, _audioContext.currentTime);
        }
    }

    function _setPlayingLongSfxCode(longSfxCode: LongSfxCode): void {
        _playingLongSfxCode = longSfxCode;
    }
    export function getPlayingLongSfxCode(): LongSfxCode {
        return _playingLongSfxCode;
    }
    /** 播放长音效，同时只能有一个在播放 */
    function playLongSfx(longSfxCode: LongSfxCode, forcePlayFromBeginning = false): void {
        if (!_isInitialized) {
            return;
        }

        if (!longSfxCode) {
            _setPlayingLongSfxCode(longSfxCode);
            _stopLongSfx();
            return;
        }

        if ((getPlayingLongSfxCode() !== longSfxCode) || (forcePlayFromBeginning)) {
            _setPlayingLongSfxCode(longSfxCode);
            _playLongSfxForNormal(longSfxCode);
        }
    }
    async function _playLongSfxForNormal(longSfxCode: LongSfxCode): Promise<void> {
        const params        = Helpers.getExisted(_LONG_SFX_PARAMS.get(longSfxCode), ClientErrorCode.SoundManager_PlayLongSfxForNormal_00);
        const cacheDict     = _longSfxBufferCache;
        const cachedBuffer  = cacheDict.get(longSfxCode);
        if (cachedBuffer) {
            _doPlayLongSfxForNormal(cachedBuffer, params);
        } else {
            const path          = getResourcePath(params.name, SoundType.Sfx);
            const audioBuffer   = await loadAudioBuffer(path).catch(err => {
                // CompatibilityHelpers.showError(err); throw err;
                Logger.error(`SoundManager._playLongSfxForNormal() loadAudioBuffer error: ${(err as Error).message}.`);
                return;
            });
            if (!audioBuffer) {
                // throw Helpers.newError(`SoundManager._playLongSfxForNormal() empty audioBuffer.`);
                Logger.error(`SoundManager._playLongSfxForNormal() empty audioBuffer.`);
                return;
            }

            cacheDict.set(longSfxCode, audioBuffer);
            _doPlayLongSfxForNormal(audioBuffer, params);
        }
    }
    function _doPlayLongSfxForNormal(buffer: AudioBuffer, params: LongSfxParams): void {
        if (!buffer) {
            return;
        }

        _stopLongSfx();

        _longSfxSourceNode              = _audioContext.createBufferSource();
        _longSfxSourceNode.buffer       = buffer;
        _longSfxSourceNode.loopStart    = params.start;
        _longSfxSourceNode.loopEnd      = params.end;
        _longSfxSourceNode.loop         = true;
        _longSfxSourceNode.connect(_longSfxGain);
        _longSfxSourceNode.start();
    }

    function _stopLongSfx(): void {
        _stopLongSfxForNormal();
    }
    function _stopLongSfxForNormal(): void {
        if (_longSfxSourceNode) {
            _longSfxSourceNode.stop();
            _longSfxSourceNode.disconnect();
            _longSfxSourceNode = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 资源回收
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function dispose(): void {
        _disposeAllBgm();
        _disposeAllSfx();
    }
    function _disposeAllBgm(): void {
        _bgmBufferCache.clear();

        _stopBgm();
    }
    function _disposeAllSfx(): void {
        _shortSfxBufferCache.clear();

        _stopAllShortSfx();
    }

    function getResourcePath(musicName: string, soundType: SoundType): string {
        switch (soundType) {
            case SoundType.Bgm      : return _SOUND_PATH + "bgm/" + musicName;
            case SoundType.Sfx   : return _SOUND_PATH + "effect/" + musicName;
            default                 : throw Helpers.newError(`Invalid soundType: ${soundType}`, ClientErrorCode.SoundManager_GetResourcePath_00);
        }
    }

    async function loadAudioBuffer(fullName: string): Promise<AudioBuffer | null> {
        if (!_audioContext) {
            return null;
        }

        const arrayBuffer = await RES.getResByUrl(
            fullName,
            () => {
                // nothing to do.
            },
            null,
            RES.ResourceItem.TYPE_BIN
        );
        if (!arrayBuffer) {
            return null;
        }

        const buffer = await _audioContext.decodeAudioData(arrayBuffer).catch(err => {
            // CompatibilityHelpers.showError(err); throw err;
            Logger.error(`SoundManager.loadAudioBuffer() decodeAudioData error: ${(err as Error).message}`);
            return null;
        });
        return buffer;
    }
}

// export default SoundManager;
