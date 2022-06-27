
// import Types            from "./Types";
// import ProtoTypes       from "../proto/ProtoTypes";
// import CommonConstants  from "./CommonConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.LocalStorage {
    import storage                      = egret.localStorage;

    const KEY_PREFIX                    = "TinyWarsStorage_";
    const KEY_ACCOUNT                   = KEY_PREFIX + "Account";
    const KEY_PASSWORD                  = KEY_PREFIX + "Password";
    const KEY_REMEMBER_PASSWORD         = KEY_PREFIX + "RememberPassword";
    const KEY_LANGUAGE                  = KEY_PREFIX + "Language";
    const KEY_SHOW_TILE_ANIMATION       = KEY_PREFIX + "ShowTileAnimation";
    const KEY_SHOW_UNIT_ANIMATION       = KEY_PREFIX + "ShowUnitAnimation";
    const KEY_MAP_RAW_DATA_PREFIX       = KEY_PREFIX + "MapRawData_";
    const KEY_SOUND_BGM_MUTE            = KEY_PREFIX + "SoundBgmMute";
    const KEY_SOUND_BGM_VOLUME          = KEY_PREFIX + "SoundBgmVolume";
    const KEY_SOUND_EFFECT_MUTE         = KEY_PREFIX + "SoundEffectMute";
    const KEY_SOUND_EFFECT_VOLUME       = KEY_PREFIX + "SoundEffectVolume";
    const KEY_STAGE_SCALE               = KEY_PREFIX + "StageScale";
    const VALUE_TRUE                    = "1";
    const VALUE_FALSE                   = "0";

    export function setAccount(account: string): void {
        setValue(KEY_ACCOUNT, account);
    }
    export function getAccount(): string {
        return getString(KEY_ACCOUNT) ?? ``;
    }

    export function setPassword(password: string): void {
        setValue(KEY_PASSWORD, password);
    }
    export function getPassword(): string {
        return getString(KEY_PASSWORD) ?? ``;
    }

    export function setIsRememberPassword(remember: boolean): void {
        setValue(KEY_REMEMBER_PASSWORD, remember ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsRememberPassword(): boolean {
        const value = getString(KEY_REMEMBER_PASSWORD);
        return (value == null) || (value === VALUE_TRUE);
    }

    // export function setMapRawData(mapId: number, data: CommonProto.Map.IMapRawData): void {
    //     setValue(KEY_MAP_RAW_DATA_PREFIX + mapId, JSON.stringify(data));
    // }
    // export function getMapRawData(mapId: number): CommonProto.Map.IMapRawData | null {
    //     const data = storage.getItem(KEY_MAP_RAW_DATA_PREFIX + mapId);
    //     return data ? JSON.parse(data) : null;
    // }

    export function setLanguageType(language: Types.LanguageType): void {
        setValue(KEY_LANGUAGE, "" + language);
    }
    export function getLanguageType(): Types.LanguageType {
        const t = getInt(KEY_LANGUAGE);
        if ((t === Types.LanguageType.English) || (t === Types.LanguageType.Chinese)) {
            return t;
        } else {
            return Types.LanguageType.English;
        }
    }

    export function setShowTileAnimation(show: boolean): void {
        setValue(KEY_SHOW_TILE_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getShowTileAnimation(): boolean {
        const data = getString(KEY_SHOW_TILE_ANIMATION);
        return (data == null) || (data === VALUE_TRUE);
    }

    export function setShowUnitAnimation(show: boolean): void {
        setValue(KEY_SHOW_UNIT_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getShowUnitAnimation(): boolean {
        const data = getString(KEY_SHOW_UNIT_ANIMATION);
        return (data == null) || (data === VALUE_TRUE);
    }

    export function setIsSoundBgmMute(isMute: boolean): void {
        setValue(KEY_SOUND_BGM_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsSoundBgmMute(): boolean {
        return getString(KEY_SOUND_BGM_MUTE) == VALUE_TRUE;
    }

    export function setSoundBgmVolume(volume: number): void {
        setValue(KEY_SOUND_BGM_VOLUME, `${volume}`);
    }
    export function getSoundBgmVolume(): number {
        const volume = getFloat(KEY_SOUND_BGM_VOLUME);
        return (volume != null) && (volume >= 0) && (volume <= 1) ? volume : 1;
    }

    export function setIsSoundEffectMute(isMute: boolean): void {
        setValue(KEY_SOUND_EFFECT_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsSoundEffectMute(): boolean {
        return getString(KEY_SOUND_EFFECT_MUTE) == VALUE_TRUE;
    }

    export function setSoundEffectVolume(volume: number): void {
        setValue(KEY_SOUND_EFFECT_VOLUME, `${volume}`);
    }
    export function getSoundEffectVolume(): number {
        const volume = getFloat(KEY_SOUND_EFFECT_VOLUME);
        return (volume != null) && (volume >= 0) && (volume <= 1) ? volume : 1;
    }

    export function setStageScale(scale: number): void {
        setValue(KEY_STAGE_SCALE, `${scale}`);
    }
    export function getStageScale(): number {
        return getInt(KEY_STAGE_SCALE) || CommonConstants.StageMinScale;
    }

    function setValue(key: string, value: string): void {
        try {
            storage.setItem(key, value);
        } catch {
            Cookies.setValue(key, value);
        }
    }
    function getInt(key: string): number | null {
        try {
            const i = parseInt(storage.getItem(key));
            return isNaN(i) ? null : i;
        } catch {
            return Cookies.getInt(key);
        }
    }
    function getFloat(key: string): number | null {
        try {
            const f = parseFloat(storage.getItem(key));
            return isNaN(f) ? null : f;
        } catch {
            return Cookies.getInt(key);
        }
    }
    function getString(key: string): string | null {
        try {
            return storage.getItem(key);
        } catch {
            return Cookies.getString(key);
        }
    }
}

// export default LocalStorage;
