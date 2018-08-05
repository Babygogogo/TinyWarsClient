
namespace Utility {
    export namespace Notify {
        ////////////////////////////////////////////////////////////////////////////////
        // Notify types.
        ////////////////////////////////////////////////////////////////////////////////
        export const Type = {
            NetworkConnected   : "",
            NetworkDisconnected: "",
            TimeTick           : "",
            TileAnimationTick  : "",
            UnitAnimationTick  : "",

            MouseWheel: "",

            SLogin    : "",
            SRegister : "",
            SLogout   : "",
            SHeartbeat: "",

            TileModelUpdated: "",
        }
        for (const k in Type) {
            Type[k] = k;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Notify datas.
        ////////////////////////////////////////////////////////////////////////////////
        export namespace Data {
            export type TileModelUpdated = OnlineWar.TileModel;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Dispatcher functions.
        ////////////////////////////////////////////////////////////////////////////////
        const dispatcher = new egret.EventDispatcher();

        export type Listener = {
            name       : string,
            callback   : Function,
            thisObject?: any,
        };

        export function dispatch(name: string, data?: any): void {
            dispatcher.dispatchEventWith(name, false, data);
        }

        export function addEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                dispatcher.addEventListener(l.name, l.callback, l.thisObject || thisObject);
            }
        }

        export function removeEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                dispatcher.removeEventListener(l.name, l.callback, l.thisObject || thisObject);
            }
        }
    }
}
