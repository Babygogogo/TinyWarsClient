
import { Types }            from "./Types";
import { ProtoTypes }       from "./proto/ProtoTypes";
import { CommonConstants }  from "./CommonConstants";

export namespace LocalStorage {
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
        storage.setItem(KEY_ACCOUNT, account);
    }
    export function getAccount(): string {
        return storage.getItem(KEY_ACCOUNT);
    }

    export function setPassword(password: string): void {
        storage.setItem(KEY_PASSWORD, password);
    }
    export function getPassword(): string {
        return storage.getItem(KEY_PASSWORD);
    }

    export function setIsRememberPassword(remember: boolean): void {
        storage.setItem(KEY_REMEMBER_PASSWORD, remember ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsRememberPassword(): boolean {
        const value = storage.getItem(KEY_REMEMBER_PASSWORD);
        return (value == null) || (value === VALUE_TRUE);
    }

    export function setMapRawData(mapId: number, data: ProtoTypes.Map.IMapRawData): void {
        storage.setItem(KEY_MAP_RAW_DATA_PREFIX + mapId, JSON.stringify(data));
    }
    export function getMapRawData(mapId: number): ProtoTypes.Map.IMapRawData | null {
        const data = storage.getItem(KEY_MAP_RAW_DATA_PREFIX + mapId);
        return data ? JSON.parse(data) : null;
    }

    export function setLanguageType(language: Types.LanguageType): void {
        storage.setItem(KEY_LANGUAGE, "" + language);
    }
    export function getLanguageType(): Types.LanguageType {
        const data = storage.getItem(KEY_LANGUAGE);
        return data ? parseInt(data) || Types.LanguageType.Chinese : Types.LanguageType.Chinese;
    }

    export function setShowTileAnimation(show: boolean): void {
        storage.setItem(KEY_SHOW_TILE_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getShowTileAnimation(): boolean {
        const data = storage.getItem(KEY_SHOW_TILE_ANIMATION);
        return (data == null) || (data === VALUE_TRUE);
    }

    export function setShowUnitAnimation(show: boolean): void {
        storage.setItem(KEY_SHOW_UNIT_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getShowUnitAnimation(): boolean {
        const data = storage.getItem(KEY_SHOW_UNIT_ANIMATION);
        return (data == null) || (data === VALUE_TRUE);
    }

    export function setIsSoundBgmMute(isMute: boolean): void {
        storage.setItem(KEY_SOUND_BGM_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsSoundBgmMute(): boolean {
        return storage.getItem(KEY_SOUND_BGM_MUTE) == VALUE_TRUE;
    }

    export function setSoundBgmVolume(volume: number): void {
        storage.setItem(KEY_SOUND_BGM_VOLUME, `${volume}`);
    }
    export function getSoundBgmVolume(): number {
        return parseFloat(storage.getItem(KEY_SOUND_BGM_VOLUME)) || 1;
    }

    export function setIsSoundEffectMute(isMute: boolean): void {
        storage.setItem(KEY_SOUND_EFFECT_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
    }
    export function getIsSoundEffectMute(): boolean {
        return storage.getItem(KEY_SOUND_EFFECT_MUTE) == VALUE_TRUE;
    }

    export function setSoundEffectVolume(volume: number): void {
        storage.setItem(KEY_SOUND_EFFECT_VOLUME, `${volume}`);
    }
    export function getSoundEffectVolume(): number {
        return parseFloat(storage.getItem(KEY_SOUND_EFFECT_VOLUME)) || 1;
    }

    export function setStageScale(scale: number): void {
        storage.setItem(KEY_STAGE_SCALE, `${scale}`);
    }
    export function getStageScale(): number {
        return parseInt(storage.getItem(KEY_STAGE_SCALE)) || CommonConstants.StageMinScale;
    }
}
