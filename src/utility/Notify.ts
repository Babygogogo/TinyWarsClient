
namespace TinyWars.Utility.Notify {
    import GridIndex    = Types.GridIndex;
    import TouchPoints  = Types.TouchPoints;

    ////////////////////////////////////////////////////////////////////////////////
    // Notify types.
    ////////////////////////////////////////////////////////////////////////////////
    export const enum Type {
        NetworkConnected,
        NetworkDisconnected,

        TimeTick,
        TileAnimationTick,
        UnitAnimationTick,
        GridAnimationTick,

        MouseWheel,
        GlobalTouchBegin,
        GlobalTouchMove,

        ConfigLoaded,
        TileModelUpdated,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        BwTurnIndexChanged,
        BwTurnPhaseCodeChanged,
        BwPlayerIndexInTurnChanged,

        BaseWarPlayerFundChanged,
        McwPlayerEnergyChanged,

        McwCursorTapped,
        McwCursorDragged,
        McwCursorGridIndexChanged,

        McwFieldZoomed,
        McwFieldDragged,

        McwActionPlannerStateChanged,

        McwWarMenuPanelOpened,
        McwWarMenuPanelClosed,
        McwProduceUnitPanelOpened,
        McwProduceUnitPanelClosed,

        BwUnitBeDestroyed,
        BwUnitBeAttacked,
        BwUnitBeSupplied,
        BwUnitBeRepaired,

        BwTileBeDestroyed,
        BwTileBeAttacked,

        BwSiloExploded,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ReplayAutoReplayChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        SNewestConfigVersion,
        SLogin,
        SRegister,
        SLogout,
        SHeartbeat,
        SGetNewestMapInfos,
        SGetMapDynamicInfo,
        SGetMapDynamicInfoFailed,
        SGetUserPublicInfo,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        SMcrCreateWar,
        SMcrGetJoinedWaitingInfos,
        SMcrGetUnjoinedWaitingInfos,
        SMcrGetJoinedOngoingInfos,
        SMcrExitWar,
        SMcrJoinWar,
        SMcrContinueWarFailed,
        SMcrContinueWar,
        SMcrGetReplayInfos,
        SMcrGetReplayData,
        SMcrGetReplayDataFailed,
        SMcrSyncWar,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        SMcwPlayerSyncWar,
        SMcwPlayerBeginTurn,
        SMcwPlayerDeleteUnit,
        SMcwPlayerEndTurn,
        SMcwPlayerProduceUnit,
        SMcwPlayerSurrender,
        SMcwPlayerVoteForDraw,
        SMcwUnitAttack,
        SMcwUnitBeLoaded,
        SMcwUnitBuildTile,
        SMcwUnitCaptureTile,
        SMcwUnitDive,
        SMcwUnitDrop,
        SMcwUnitJoin,
        SMcwUnitLaunchFlare,
        SMcwUnitLaunchSilo,
        SMcwUnitProduceUnit,
        SMcwUnitSupply,
        SMcwUnitSurface,
        SMcwUnitWait,
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Notify datas.
    ////////////////////////////////////////////////////////////////////////////////
    export namespace Data {
        export type ConfigLoaded                = number;
        export type McwPlayerIndexInTurnChanged = number;
        export type McwPlayerFundChanged        = MultiCustomWar.McwPlayer;
        export type McwPlayerEnergyChanged      = MultiCustomWar.McwPlayer;
        export type McwCursorTapped             = { current: GridIndex, tappedOn: GridIndex };
        export type McwCursorDragged            = { current: GridIndex, draggedTo: GridIndex };
        export type McwFieldZoomed              = { previous: TouchPoints, current: TouchPoints };
        export type McwFieldDragged             = { previous: Types.Point, current: Types.Point };
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Dispatcher functions.
    ////////////////////////////////////////////////////////////////////////////////
    const _DISPATCHER = new egret.EventDispatcher();

    export type Listener = {
        type        : Type,
        callback    : (e: egret.Event) => void,
        thisObject? : any,
        useCapture? : boolean,
        priority?   : number;
    };

    export function dispatch(t: Type, data?: any): void {
        _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
    }

    export function addEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
        _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject, useCapture, priority);
    }
    export function addEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean, priority?: number): void {
        for (const l of listeners) {
            addEventListener(
                l.type,
                l.callback,
                l.thisObject != null ? l.thisObject : thisObject,
                l.useCapture != null ? l.useCapture : useCapture,
                l.priority   != null ? l.priority   : priority
            );
        }
    }

    export function removeEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean): void {
        _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject, useCapture);
    }
    export function removeEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean): void {
        for (const l of listeners) {
            removeEventListener(
                l.type,
                l.callback,
                l.thisObject != null ? l.thisObject : thisObject,
                l.useCapture != null ? l.useCapture : useCapture
            );
        }
    }

    function getTypeName(t: Type): string {
        return "Notify" + t;
    }
}
