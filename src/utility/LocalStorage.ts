
namespace TinyWars.Utility {
    import localStorage = egret.localStorage;

    const KEY_ACCOUNT           = "account";
    const KEY_PASSWORD          = "password";
    const KEY_REMEMBER_PASSWORD = "rememberPassword";
    const VALUE_TRUE            = "1";
    const VALUE_FALSE           = "0";

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

        export function setMapData(url: string, data: string): void {
            localStorage.setItem(url, data);
        }
        export function getMapData(url: string): string {
            return localStorage.getItem(url);
        }
    }
}
