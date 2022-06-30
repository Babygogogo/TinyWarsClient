
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Notify {
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

        McrCreateBannedCoCategoryIdArrayChanged,
        McrCreateTeamIndexChanged,
        McrCreateSelfCoIdChanged,
        McrCreateSelfSkinIdChanged,
        McrCreateSelfPlayerIndexChanged,
        McrCreateTemplateWarRuleIdChanged,

        MfrCreateSelfCoIdChanged,
        MfrCreateTeamIndexChanged,
        MfrCreateSelfPlayerIndexChanged,
        MfrCreateSelfSkinIdChanged,

        CcrCreateBannedCoCategoryIdArrayChanged,
        CcrCreateTeamIndexChanged,
        CcrCreateAiCoIdChanged,
        CcrCreateSelfCoIdChanged,
        CcrCreateSelfSkinIdChanged,
        CcrCreateSelfPlayerIndexChanged,
        CcrCreateTemplateWarRuleIdChanged,

        MrrMyRoomAdded,
        MrrMyRoomDeleted,
        MrrJoinedPreviewingRoomIdChanged,
        MrrSelfSettingsCoIdChanged,
        MrrSelfSettingsSkinIdChanged,

        ScrCreateTemplateWarRuleIdChanged,
        ScrCreateBannedCoCategoryIdArrayChanged,
        ScrCreateWarSaveSlotChanged,
        ScrCreatePlayerInfoChanged,

        SrrCreateModelTemplateWarRuleIdChanged,
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
        BwPlayerMarkedGridIdAdded,
        BwPlayerMarkedGridIdDeleted,
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
        MeMapDescChanged,
        MeWarEventIdArrayChanged,

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
        MsgMapGetMapTag,
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
        MsgMmSetWarRuleName,
        MsgMmSetMapTagSingleData,

        MsgMmSetWarRuleAvailability,
        MsgMmReloadAllMaps,
        MsgMmSetMapEnabled,
        MsgMmGetReviewingMaps,
        MsgMmReviewMap,
        MsgMmSetMapTagIdFlags,
        MsgMmSetMapName,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcrCreateRoom,
        MsgMcrCreateRoomFailed,
        MsgMcrGetRoomStaticInfo,
        MsgMcrGetRoomStaticInfoFailed,
        MsgMcrGetRoomPlayerInfo,
        MsgMcrGetRoomPlayerInfoFailed,
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
        MsgMrrSetBannedCoCategoryIdArray,
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
        MsgMpwCommonMarkTile,
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
        MsgLbMrwGetRankIndex,
    }
}

// export default Twns.Notify;
