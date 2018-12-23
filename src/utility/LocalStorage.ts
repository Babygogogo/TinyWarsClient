
namespace TinyWars.Utility {
    import localStorage = egret.localStorage;

    export namespace LocalStorage {
        export function setAccount(account: string): void {
            localStorage.setItem("account", account);
        }
        export function getAccount(): string {
            return localStorage.getItem("account");
        }

        export function setMapData(url: string, data: string): void {
            localStorage.setItem(url, data);
        }
        export function getMapData(url: string): string {
            return localStorage.getItem(url);
        }
    }
}
