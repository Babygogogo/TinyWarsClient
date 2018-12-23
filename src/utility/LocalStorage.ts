
namespace TinyWars.Utility {
    export namespace LocalStorage {
        export function setAccount(account: string): void {
            egret.localStorage.setItem("account", account);
        }

        export function getAccount(): string {
            return egret.localStorage.getItem("account");
        }
    }
}
