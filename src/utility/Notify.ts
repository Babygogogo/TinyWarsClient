
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
        UnitAndTileTextureVersionChanged,

        MouseWheel,
        GlobalTouchBegin,
        GlobalTouchMove,

        ConfigLoaded,
        TileModelUpdated,
        LanguageChanged,

        ChatPanelOpened,
        ChatPanelClosed,

        McrCreateAvailableCoIdListChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        BwExecutedActionsCountChanged,
        BwTurnIndexChanged,
        BwTurnPhaseCodeChanged,
        BwPlayerIndexInTurnChanged,

        BwPlayerFundChanged,
        BwCoEnergyChanged,
        BwCoUsingSkillTypeChanged,

        BwCursorTapped,
        BwCursorDragged,
        BwCursorGridIndexChanged,

        BwFieldZoomed,
        BwFieldDragged,

        BwActionPlannerStateChanged,

        McwWarMenuPanelOpened,
        McwWarMenuPanelClosed,
        McwProduceUnitPanelOpened,
        McwProduceUnitPanelClosed,
        BwCoListPanelOpened,
        BwCoListPanelClosed,

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
        MeDrawerModeChanged,
        MeUnitChanged,
        MeTileChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgCommonHeartbeat,
        MsgCommonLatestConfigVersion,
        MsgCommonGetServerStatus,
        MsgReplaySetRating,

        MsgUserLogin,
        MsgUserRegister,
        MsgUserLogout,

        MsgMapGetRawData,
        MsgMapGetRawDataFailed,
        MsgMapGetEnabledExtraDataList,
        MsgMapGetExtraData,
        MsgMapGetExtraDataFailed,

        MsgChatGetAllMessages,
        MsgChatAddMessage,
        MsgChatUpdateReadProgress,
        MsgChatGetAllReadProgressList,

        MsgUserGetPublicInfo,
        MsgUserGetPublicInfoFailed,
        MsgUserSetNickname,
        MsgUserSetNicknameFailed,
        MsgUserSetDiscordId,
        MsgUserSetDiscordIdFailed,
        MsgUserGetOnlineUsers,

        MsgMeGetDataList,
        MsgMeGetData,
        MsgMeSubmitMap,

        MsgMmSetMapAvailability,
        MsgMmReloadAllMaps,
        MsgMmDeleteMap,
        MsgMmGetReviewingMaps,
        MsgMmReviewMap,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcrCreateRoom,
        MsgMcrGetRoomInfo,
        MsgMcrGetRoomInfoFailed,
        MsgMcrGetJoinedRoomInfoList,
        MsgMcrGetUnjoinedRoomInfoList,
        MsgMcrExitRoom,
        MsgMcrSetWarRule,
        MsgMcrJoinRoom,
        MsgMcrDeleteRoom,
        MsgMcrDeletePlayer,
        MsgMcrSetReady,
        MsgMcrSetSelfSettings,
        MsgMcrStartWar,
        MsgReplayGetInfoList,
        MsgReplayGetData,
        MsgReplayGetDataFailed,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcwCommonGetWarInfoList,
        MsgMcwCommonContinueWarFailed,
        MsgMcwCommonContinueWar,
        MsgMcwCommonSyncWar,
        MsgMcwCommonHandleBoot,

        MsgMcwWatchGetUnwatchedWarInfos,
        MsgMcwWatchGetOngoingWarInfos,
        MsgMcwWatchGetRequestedWarInfos,
        MsgMcwWatchGetWatchedWarInfos,
        MsgMcwWatchMakeRequest,
        MsgMcwWatchHandleRequest,
        MsgMcwWatchDeleteWatcher,
        MsgMcwWatchContinueWar,
        MsgMcwWatchContinueWarFailed,

        MsgMcwActionPlayerBeginTurn,
        MsgMcwActionPlayerDeleteUnit,
        MsgMcwActionPlayerEndTurn,
        MsgMcwActionPlayerProduceUnit,
        MsgMcwActionPlayerSurrender,
        MsgMcwActionPlayerVoteForDraw,
        MsgMcwActionUnitAttackUnit,
        MsgMcwActionUnitAttackTile,
        MsgMcwActionUnitBeLoaded,
        MsgMcwActionUnitBuildTile,
        MsgMcwActionUnitCaptureTile,
        MsgMcwActionUnitDive,
        MsgMcwActionUnitDropUnit,
        MsgMcwActionUnitJoinUnit,
        MsgMcwActionUnitLaunchFlare,
        MsgMcwActionUnitLaunchSilo,
        MsgMcwActionUnitLoadCo,
        MsgMcwActionUnitProduceUnit,
        MsgMcwActionUnitSupplyUnit,
        MsgMcwActionUnitSurface,
        MsgMcwActionUnitUseCoSkill,
        MsgMcwActionUnitWait,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ScrCreateWarSaveSlotChanged,
        ScrCreateWarPlayerInfoListChanged,

        MsgScrCreateWar,
        MsgScrGetSaveInfoList,
        MsgScrContinueWarFailed,
        MsgScrContinueWar,
        MsgScrSaveWar,
        MsgScrCreateCustomWar,
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Notify datas.
    ////////////////////////////////////////////////////////////////////////////////
    export namespace Data {
        export type ConfigLoaded                = number;
        export type McwPlayerIndexInTurnChanged = number;
        export type McwPlayerFundChanged        = MultiCustomWar.McwPlayer;
        export type McwPlayerEnergyChanged      = MultiCustomWar.McwPlayer;
        export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
        export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
        export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
        export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
        export type MeUnitChanged               = { gridIndex: GridIndex };
        export type MeTileChanged               = { gridIndex: GridIndex };
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
