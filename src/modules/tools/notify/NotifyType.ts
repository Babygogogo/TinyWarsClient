
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
        UserSettingsOpacitySettingsChanged,
        UserSettingsIsAutoScrollMapChanged,

        MouseWheel,
        GlobalTouchBegin,
        GlobalTouchMove,
        ZoomableContentsMoved,

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

        SrrCreatePresetWarRuleIdChanged,
        SrrCreateBannedCoIdArrayChanged,
        SrrCreateWarSaveSlotChanged,
        SrrCreatePlayerInfoChanged,

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
        BwTileIsHighlightedChanged,

        BwTileMapLocationVisibleSet,

        WarActionNormalExecuted,

        BwSiloExploded,

        ReplayAutoReplayChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MeDrawerModeChanged,
        MeTileChanged,
        MeMapNameChanged,
        MeWarEventIdArrayChanged,
        MeBannedCoIdArrayChanged,

        WarEventFullDataChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgCommonHeartbeat,
        MsgCommonLatestConfigVersion,
        MsgCommonGetServerStatus,
        MsgCommonGetRankList,

        MsgBroadcastGetAllMessageIdArray,
        MsgBroadcastGetMessageData,
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
        MsgMapGetEnabledMapIdArray,
        MsgMapGetEnabledRawDataList,
        MsgMapGetBriefData,
        MsgMapGetBriefDataFailed,

        MsgChatGetAllMessages,
        MsgChatAddMessage,
        MsgChatUpdateReadProgress,
        MsgChatGetAllReadProgressList,
        MsgChatDeleteMessage,

        MsgUserGetPublicInfo,
        MsgUserGetBriefInfo,
        MsgUserGetOnlineState,
        MsgUserSetNickname,
        MsgUserSetNicknameFailed,
        MsgUserSetAvatarId,
        MsgUserSetAvatarIdFailed,
        MsgUserSetMapEditorAutoSaveTime,
        MsgUserSetMapEditorAutoSaveTimeFailed,
        MsgUserSetDiscordId,
        MsgUserSetDiscordIdFailed,
        MsgUserGetOnlineUserIdArray,
        MsgUserSetPrivilege,
        MsgUserSetPassword,
        MsgUserGetSettings,
        MsgUserSetSettings,
        MsgUserSetMapRating,

        MsgMeGetDataList,
        MsgMeGetData,
        MsgMeSubmitMap,
        MsgMmAddWarRule,
        MsgMmDeleteWarRule,

        MsgMmSetWarRuleAvailability,
        MsgMmReloadAllMaps,
        MsgMmSetMapEnabled,
        MsgMmGetReviewingMaps,
        MsgMmReviewMap,
        MsgMmSetMapTag,
        MsgMmSetMapName,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcrCreateRoom,
        MsgMcrCreateRoomFailed,
        MsgMcrGetRoomStaticInfo,
        MsgMcrGetRoomStaticInfoFailed,
        MsgMcrGetRoomPlayerInfo,
        MsgMcrGetRoomPlayerInfoFailed,
        MsgMcrGetJoinedRoomIdArray,
        MsgMcrGetJoinableRoomIdArray,
        MsgMcrExitRoom,
        MsgMcrJoinRoom,
        MsgMcrDeleteRoom,
        MsgMcrDeletePlayer,
        MsgMcrSetReady,
        MsgMcrSetSelfSettings,
        MsgMcrStartWar,

        MsgMfrCreateRoom,
        MsgMfrGetRoomStaticInfo,
        MsgMfrGetRoomPlayerInfo,
        MsgMfrGetJoinedRoomIdArray,
        MsgMfrGetJoinableRoomIdArray,
        MsgMfrExitRoom,
        MsgMfrJoinRoom,
        MsgMfrDeleteRoom,
        MsgMfrDeletePlayer,
        MsgMfrSetReady,
        MsgMfrSetSelfSettings,
        MsgMfrStartWar,

        MsgCcrCreateRoom,
        MsgCcrGetRoomStaticInfo,
        MsgCcrGetRoomPlayerInfo,
        MsgCcrGetJoinedRoomIdArray,
        MsgCcrGetJoinableRoomIdArray,
        MsgCcrExitRoom,
        MsgCcrJoinRoom,
        MsgCcrDeleteRoom,
        MsgCcrDeletePlayer,
        MsgCcrSetReady,
        MsgCcrSetSelfSettings,
        MsgCcrStartWar,

        MsgMrrGetMaxConcurrentCount,
        MsgMrrSetMaxConcurrentCount,
        MsgMrrGetRoomPublicInfo,
        MsgMrrGetRoomPublicInfoFailed,
        MsgMrrGetJoinedRoomIdArray,
        MsgMrrSetBannedCoIdList,
        MsgMrrSetSelfSettings,
        MsgMrrDeleteRoomByServer,

        MsgReplayGetReplayIdArray,
        MsgReplayGetBriefInfo,
        MsgReplayGetData,
        MsgReplayGetDataFailed,
        MsgReplayGetSelfRating,
        MsgReplaySetSelfRating,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMpwCommonContinueWarFailed,
        MsgMpwCommonContinueWar,
        MsgMpwCommonSyncWar,
        MsgMpwCommonHandleBoot,
        MsgMpwCommonGetWarSettings,
        MsgMpwCommonGetWarSettingsFailed,
        MsgMpwCommonGetWarProgressInfo,
        MsgMpwWatchGetIncomingInfo,
        MsgMpwWatchGetIncomingInfoFailed,
        MsgMpwWatchGetOutgoingInfo,
        MsgMpwWatchGetOutgoingInfoFailed,
        MsgMpwGetHalfwayReplayData,
        MsgMpwGetHalfwayReplayDataFailed,

        MsgMpwWatchGetUnwatchedWarInfos,
        MsgMpwWatchGetOngoingWarInfos,
        MsgMpwWatchGetRequestedWarIdArray,
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
        MsgSpmGetWarSaveSlotIndexArray,
        MsgSpmGetWarSaveFullData,
        MsgSpmDeleteWarSaveSlot,
        MsgSpmSaveScw,
        MsgSpmSaveSfw,
        MsgSpmSaveSrw,
        MsgSpmGetRankList,
        MsgSpmGetRankListFailed,
        MsgSpmValidateSrw,
        MsgSpmGetReplayData,
        MsgSpmGetReplayDataFailed,
        MsgSpmDeleteAllScoreAndReplay,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgLbSpmOverallGetTopDataArray,
        MsgLbSpmOverallGetRankIndex,
    }
}

// export default TwnsNotifyType;
