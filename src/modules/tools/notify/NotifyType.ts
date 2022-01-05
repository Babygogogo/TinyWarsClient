
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsNotifyType {
    // eslint-disable-next-line no-shadow
    export const enum NotifyType {
        NetworkConnected,
        NetworkDisconnected,

        TimeTick,
        TileAnimationTick,
        UnitAnimationTick,
        UnitStateIndicatorTick,
        GridAnimationTick,
        UnitAndTileTextureVersionChanged,
        UserSettingsIsShowGridBorderChanged,
        UserSettingsUnitOpacityChanged,
        UserSettingsIsAutoScrollMapChanged,

        MouseWheel,
        GlobalTouchBegin,
        GlobalTouchMove,
        ZoomableContentsMoved,

        ConfigLoaded,
        TileModelUpdated,
        LanguageChanged,

        ChatPanelOpened,
        ChatPanelClosed,

        McrCreateBannedCoIdArrayChanged,
        McrCreateTeamIndexChanged,
        McrCreateSelfCoIdChanged,
        McrCreateSelfSkinIdChanged,
        McrCreateSelfPlayerIndexChanged,
        McrCreatePresetWarRuleIdChanged,

        McrJoinTargetRoomIdChanged,
        McrJoinedPreviewingRoomIdChanged,

        MfrCreateSelfCoIdChanged,
        MfrCreateTeamIndexChanged,
        MfrCreateSelfPlayerIndexChanged,
        MfrCreateSelfSkinIdChanged,

        MfrJoinTargetRoomIdChanged,
        MfrJoinedPreviewingRoomIdChanged,

        CcrCreateBannedCoIdArrayChanged,
        CcrCreateTeamIndexChanged,
        CcrCreateAiCoIdChanged,
        CcrCreateSelfCoIdChanged,
        CcrCreateSelfSkinIdChanged,
        CcrCreateSelfPlayerIndexChanged,
        CcrCreatePresetWarRuleIdChanged,

        CcrJoinTargetRoomIdChanged,
        CcrJoinedPreviewingRoomIdChanged,

        MrrMyRoomAdded,
        MrrMyRoomDeleted,
        MrrJoinedPreviewingRoomIdChanged,
        MrrSelfSettingsCoIdChanged,
        MrrSelfSettingsSkinIdChanged,

        ScrCreatePresetWarRuleIdChanged,
        ScrCreateBannedCoIdArrayChanged,
        ScrCreateWarSaveSlotChanged,
        ScrCreatePlayerInfoChanged,

        McwPreviewingWarIdChanged,
        MrwPreviewingWarIdChanged,
        MfwPreviewingWarIdChanged,
        CcwPreviewingWarIdChanged,
        RwPreviewingReplayIdChanged,
        SpmPreviewingWarSaveSlotChanged,

        BroadcastOngoingMessagesChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        RwNextActionIdChanged,
        BwTurnIndexChanged,
        BwTurnPhaseCodeChanged,
        BwPlayerIndexInTurnChanged,

        BwPlayerFundChanged,
        BwCoEnergyChanged,
        BwCoUsingSkillTypeChanged,
        BwCoIdChanged,
        BwForceWeatherTypeChanged,

        BwCursorTapped,
        BwCursorDragged,
        BwCursorDragEnded,
        BwCursorGridIndexChanged,

        BwFieldZoomed,
        BwFieldDragged,

        BwActionPlannerStateSet,
        BwActionPlannerStateChanged,
        BwActionPlannerMovePathChanged,

        BwProduceUnitPanelOpened,
        BwProduceUnitPanelClosed,

        BwUnitBeDestroyed,
        BwUnitBeAttacked,
        BwUnitBeSupplied,
        BwUnitBeRepaired,
        BwUnitChanged,

        BwTileBeDestroyed,
        BwTileBeAttacked,
        BwTileLocationFlagSet,

        BwTileMapLocationVisibleSet,

        WarActionNormalExecuted,

        BwSiloExploded,

        ReplayAutoReplayChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MeDrawerModeChanged,
        MeTileChanged,
        MeMapNameChanged,
        MeWarRuleNameChanged,
        MeWarEventIdArrayChanged,
        MeBannedCoIdArrayChanged,

        WarEventFullDataChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgCommonHeartbeat,
        MsgCommonLatestConfigVersion,
        MsgCommonGetServerStatus,
        MsgCommonGetRankList,

        MsgBroadcastGetMessageList,
        MsgBroadcastAddMessage,
        MsgBroadcastDeleteMessage,
        MsgBroadcastDoBroadcast,

        MsgChangeLogGetMessageList,
        MsgChangeLogAddMessage,
        MsgChangeLogModifyMessage,

        MsgUserLogin,
        MsgUserRegister,
        MsgUserLogout,

        MsgMapGetRawData,
        MsgMapGetRawDataFailed,
        MsgMapGetEnabledBriefDataList,
        MsgMapGetEnabledRawDataList,
        MsgMapGetBriefData,
        MsgMapGetBriefDataFailed,

        MsgChatGetAllMessages,
        MsgChatAddMessage,
        MsgChatUpdateReadProgress,
        MsgChatGetAllReadProgressList,

        MsgUserGetPublicInfo,
        MsgUserGetPublicInfoFailed,
        MsgUserGetOnlineState,
        MsgUserSetNickname,
        MsgUserSetNicknameFailed,
        MsgUserSetAvatarId,
        MsgUserSetAvatarIdFailed,
        MsgUserSetMapEditorAutoSaveTime,
        MsgUserSetMapEditorAutoSaveTimeFailed,
        MsgUserSetDiscordId,
        MsgUserSetDiscordIdFailed,
        MsgUserGetOnlineUsers,
        MsgUserSetPrivilege,
        MsgUserSetPassword,
        MsgUserGetSettings,
        MsgUserSetSettings,
        MsgUserSetMapRating,

        MsgMeGetDataList,
        MsgMeGetData,
        MsgMeSubmitMap,

        MsgMmSetMapAvailability,
        MsgMmReloadAllMaps,
        MsgMmSetMapEnabled,
        MsgMmGetReviewingMaps,
        MsgMmReviewMap,
        MsgMmSetMapTag,
        MsgMmSetMapName,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcrCreateRoom,
        MsgMcrGetRoomInfo,
        MsgMcrGetRoomInfoFailed,
        MsgMcrGetJoinedRoomInfoList,
        MsgMcrGetJoinableRoomInfoList,
        MsgMcrExitRoom,
        MsgMcrSetWarRule,
        MsgMcrJoinRoom,
        MsgMcrDeleteRoomByPlayer,
        MsgMcrDeleteRoomByServer,
        MsgMcrDeletePlayer,
        MsgMcrSetReady,
        MsgMcrSetSelfSettings,
        MsgMcrGetOwnerPlayerIndex,
        MsgMcrStartWar,

        MsgMfrCreateRoom,
        MsgMfrGetRoomInfo,
        MsgMfrGetRoomInfoFailed,
        MsgMfrGetJoinedRoomInfoList,
        MsgMfrGetJoinableRoomInfoList,
        MsgMfrExitRoom,
        MsgMfrJoinRoom,
        MsgMfrDeleteRoomByPlayer,
        MsgMfrDeleteRoomByServer,
        MsgMfrDeletePlayer,
        MsgMfrSetReady,
        MsgMfrSetSelfSettings,
        MsgMfrGetOwnerPlayerIndex,
        MsgMfrStartWar,

        MsgCcrCreateRoom,
        MsgCcrGetRoomInfo,
        MsgCcrGetRoomInfoFailed,
        MsgCcrGetJoinedRoomInfoList,
        MsgCcrGetJoinableRoomInfoList,
        MsgCcrExitRoom,
        MsgCcrJoinRoom,
        MsgCcrDeleteRoomByPlayer,
        MsgCcrDeleteRoomByServer,
        MsgCcrDeletePlayer,
        MsgCcrSetReady,
        MsgCcrSetSelfSettings,
        MsgCcrGetOwnerPlayerIndex,
        MsgCcrStartWar,

        MsgMrrGetMaxConcurrentCount,
        MsgMrrSetMaxConcurrentCount,
        MsgMrrGetRoomPublicInfo,
        MsgMrrGetRoomPublicInfoFailed,
        MsgMrrGetMyRoomPublicInfoList,
        MsgMrrSetBannedCoIdList,
        MsgMrrSetSelfSettings,
        MsgMrrDeleteRoomByServer,

        MsgReplayGetInfoList,
        MsgReplayGetData,
        MsgReplayGetDataFailed,
        MsgReplaySetRating,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMpwCommonGetMyWarInfoList,
        MsgMpwCommonContinueWarFailed,
        MsgMpwCommonContinueWar,
        MsgMpwCommonSyncWar,
        MsgMpwCommonHandleBoot,
        MsgMpwGetHalfwayReplayDataFailed,
        MsgMpwGetHalfwayReplayData,

        MsgMpwWatchGetUnwatchedWarInfos,
        MsgMpwWatchGetOngoingWarInfos,
        MsgMpwWatchGetRequestedWarInfos,
        MsgMpwWatchGetWatchedWarInfos,
        MsgMpwWatchMakeRequest,
        MsgMpwWatchHandleRequest,
        MsgMpwWatchDeleteWatcher,
        MsgMpwWatchContinueWar,
        MsgMpwWatchContinueWarFailed,

        MsgMpwActionSystemBeginTurn,
        MsgMpwActionSystemCallWarEvent,
        MsgMpwActionSystemDestroyPlayerForce,
        MsgMpwActionSystemEndWar,
        MsgMpwActionSystemEndTurn,
        MsgMpwActionSystemHandleBootPlayer,

        MsgMpwExecuteWarAction,
        MsgMpwActionPlayerEndTurn,
        MsgMpwActionPlayerProduceUnit,
        MsgMpwActionPlayerSurrender,
        MsgMpwActionPlayerVoteForDraw,
        MsgMpwActionUnitAttackUnit,
        MsgMpwActionUnitAttackTile,
        MsgMpwActionUnitBeLoaded,
        MsgMpwActionUnitBuildTile,
        MsgMpwActionUnitCaptureTile,
        MsgMpwActionUnitDive,
        MsgMpwActionUnitDropUnit,
        MsgMpwActionUnitJoinUnit,
        MsgMpwActionUnitLaunchFlare,
        MsgMpwActionUnitLaunchSilo,
        MsgMpwActionUnitLoadCo,
        MsgMpwActionUnitProduceUnit,
        MsgMpwActionUnitSupplyUnit,
        MsgMpwActionUnitSurface,
        MsgMpwActionUnitUseCoSkill,
        MsgMpwActionUnitWait,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgSpmCreateScw,
        MsgSpmCreateSfw,
        MsgSpmCreateSrw,
        MsgSpmGetWarSaveSlotFullDataArray,
        MsgSpmDeleteWarSaveSlot,
        MsgSpmSaveScw,
        MsgSpmSaveSfw,
        MsgSpmSaveSrw,
        MsgSpmGetSrwRankInfo,
        MsgSpmValidateSrw
    }
}

// export default TwnsNotifyType;
