
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
            SGetMapDynamicInfo,
            SGetMapDynamicInfoFailed,
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
        const _DISPATCHER = new egret.EventDispatcher();

        export type Listener = {
            type       : Type,
            callback   : (e: egret.Event) => void,
            thisObject?: any,
        };

        export function dispatch(t: Type, data?: any): void {
            _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
        }

        export function addEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any): void {
            _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject);
        }
        export function addEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                addEventListener(l.type, l.callback, l.thisObject || thisObject);
            }
        }

        export function removeEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any): void {
            _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject);
        }
        export function removeEventListeners(listeners: Listener[], thisObject?: any): void {
            for (const l of listeners) {
                removeEventListener(l.type, l.callback, l.thisObject || thisObject);
            }
        }

        function getTypeName(t: Type): string {
            return "Notify" + t;
        }
    }
}
