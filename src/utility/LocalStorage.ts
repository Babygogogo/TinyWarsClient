
namespace TinyWars.Utility {
    import localStorage = egret.localStorage;

    const KEY_PREFIX                    = "TinyWarsStorage_";
    const KEY_ACCOUNT                   = KEY_PREFIX + "Account";
    const KEY_PASSWORD                  = KEY_PREFIX + "Password";
    const KEY_REMEMBER_PASSWORD         = KEY_PREFIX + "RememberPassword";
    const KEY_LANGUAGE                  = KEY_PREFIX + "Language";
    const KEY_SHOW_TILE_ANIMATION       = KEY_PREFIX + "ShowTileAnimation";
    const KEY_MAP_RAW_DATA_PREFIX       = KEY_PREFIX + "MapRawData_";
    const VALUE_TRUE                    = "1";
    const VALUE_FALSE                   = "0";

    export namespace LocalStorage {
        export function setAccount(account: string): void {
            localStorage.setItem(KEY_ACCOUNT, account);
        }
        export function getAccount(): string {
            return localStorage.getItem(KEY_ACCOUNT);
        }

        export function setPassword(password: string): void {
            localStorage.setItem(KEY_PASSWORD, password);
        }
        export function getPassword(): string {
            return localStorage.getItem(KEY_PASSWORD);
        }

        export function setIsRememberPassword(remember: boolean): void {
            localStorage.setItem(KEY_REMEMBER_PASSWORD, remember ? VALUE_TRUE : VALUE_FALSE);
        }
        export function getIsRememberPassword(): boolean {
            const value = localStorage.getItem(KEY_REMEMBER_PASSWORD);
            return (value == null) || (value === VALUE_TRUE);
        }

        export function setMapRawData(mapId: number, data: ProtoTypes.Map.IMapRawData): void {
            localStorage.setItem(KEY_MAP_RAW_DATA_PREFIX + mapId, JSON.stringify(data));
        }
        export function getMapRawData(mapId: number): ProtoTypes.Map.IMapRawData | null {
            const data = localStorage.getItem(KEY_MAP_RAW_DATA_PREFIX + mapId);
            return data ? JSON.parse(data) : null;
        }

        export function setLanguageType(language: Types.LanguageType): void {
            localStorage.setItem(KEY_LANGUAGE, "" + language);
        }
        export function getLanguageType(): Types.LanguageType {
            const data = localStorage.getItem(KEY_LANGUAGE);
            return data ? parseInt(data) || Types.LanguageType.Chinese : Types.LanguageType.Chinese;
        }

        export function setShowTileAnimation(show: boolean): void {
            localStorage.setItem(KEY_SHOW_TILE_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
        }
        export function getShowTileAnimation(): boolean {
            const data = localStorage.getItem(KEY_SHOW_TILE_ANIMATION);
            return (data == null) || (data === VALUE_TRUE);
        }
    }
}
