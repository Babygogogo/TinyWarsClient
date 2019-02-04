
namespace TinyWars.Utility {
    export namespace Notify {
        ////////////////////////////////////////////////////////////////////////////////
        // Notify types.
        ////////////////////////////////////////////////////////////////////////////////
        export const enum Type {
            NetworkConnected,
            NetworkDisconnected,

            TimeTick,
            TileAnimationTick,
            UnitAnimationTick,

            MouseWheel,

            SNewestConfigVersion,
            SLogin,
            SRegister,
            SLogout,
            SHeartbeat,
            SGetNewestMapInfos,
            SMcrCreateWar,
            SMcrGetJoinedWaitingInfos,
            SMcrGetUnjoinedWaitingInfos,
            SMcrExitWar,
            SMcrJoinWar,

            ConfigLoaded,
            TileModelUpdated,
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Notify datas.
        ////////////////////////////////////////////////////////////////////////////////
        export namespace Data {
            export type ConfigLoaded    = number;
            export type McTileUpdated   = MultiCustomWar.McwTile;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Dispatcher functions.
        ////////////////////////////////////////////////////////////////////////////////
        const dispatcher = new egret.EventDispatcher();

        export type Listener = {
            type       : Type,
            callback   : Function,
            thisObject?: any,
        };

        export function dispatch(t: Type, data?: any): void {
            dispatcher.dispatchEventWith(getTypeName(t), false, data);
        }

        export function addEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                dispatcher.addEventListener(getTypeName(l.type), l.callback, l.thisObject || thisObject);
            }
        }

        export function removeEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                dispatcher.removeEventListener(getTypeName(l.type), l.callback, l.thisObject || thisObject);
            }
        }

        function getTypeName(t: Type): string {
            return "Notify" + t;
        }
    }
}
