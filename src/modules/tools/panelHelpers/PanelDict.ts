
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.PanelHelpers {
    import LayerType    = Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel.UiPanel<T>;
        skinName        : string;
        layer           : LayerType;
        isExclusive?    : boolean;
        needCache?      : boolean;
    };

    export let PanelDict: {
        BwBackgroundPanel                   : PanelConfig<BaseWar.OpenDataForBwBackgroundPanel>;
        BwBeginTurnPanel                    : PanelConfig<BaseWar.OpenDataForBwBeginTurnPanel>;
        BwCaptureProgressPanel              : PanelConfig<BaseWar.OpenDataForBwCaptureProgressPanel>;
        BwDamagePreviewPanel                : PanelConfig<BaseWar.OpenDataForBwDamagePreviewPanel>;
        BwDialoguePanel                     : PanelConfig<BaseWar.OpenDataForBwDialoguePanel>;
        BwProduceUnitPanel                  : PanelConfig<BaseWar.OpenDataForBwProduceUnitPanel>;
        BwSimpleDialoguePanel               : PanelConfig<BaseWar.OpenDataForBwSimpleDialoguePanel>;
        BwTileBriefPanel                    : PanelConfig<BaseWar.OpenDataForBwTileBriefPanel>;
        BwTileDetailPanel                   : PanelConfig<BaseWar.OpenDataForBwTileDetailPanel>;
        BwUnitActionsPanel                  : PanelConfig<BaseWar.OpenDataForBwUnitActionsPanel>;
        BwUnitBriefPanel                    : PanelConfig<BaseWar.OpenDataForBwUnitBriefPanel>;
        BwUnitDetailPanel                   : PanelConfig<BaseWar.OpenDataForBwUnitDetailPanel>;
        BwUnitListPanel                     : PanelConfig<BaseWar.OpenDataForBwUnitListPanel>;
        BwWarInfoPanel                      : PanelConfig<BaseWar.OpenDataForBwWarInfoPanel>;
        BwWarPanel                          : PanelConfig<BaseWar.OpenDataForBwWarPanel>;

        BroadcastAddMessagePanel            : PanelConfig<Broadcast.OpenDataForBroadcastAddMessagePanel>;
        BroadcastMessageListPanel           : PanelConfig<Broadcast.OpenDataForBroadcastMessageListPanel>;
        BroadcastPanel                      : PanelConfig<Broadcast.OpenDataForBroadcastPanel>;

        ChangeLogAddPanel                   : PanelConfig<ChangeLog.OpenDataForChangeLogAddPanel>;
        ChangeLogModifyPanel                : PanelConfig<ChangeLog.OpenDataForChangeLogModifyPanel>;
        ChangeLogPanel                      : PanelConfig<ChangeLog.OpenDataForChangeLogPanel>;

        CcrCreateMapListPanel               : PanelConfig<CoopCustomRoom.OpenDataForCcrCreateMapListPanel>;
        CcrCreateSettingsPanel              : PanelConfig<CoopCustomRoom.OpenDataForCcrCreateSettingsPanel>;
        CcrJoinRoomListPanel                : PanelConfig<CoopCustomRoom.OpenDataForCcrJoinRoomListPanel>;
        CcrMainMenuPanel                    : PanelConfig<CoopCustomRoom.OpenDataForCcrMainMenuPanel>;
        CcrMyRoomListPanel                  : PanelConfig<CoopCustomRoom.OpenDataForCcrMyRoomListPanel>;
        CcrRoomInfoPanel                    : PanelConfig<CoopCustomRoom.OpenDataForCcrRoomInfoPanel>;
        CcrSearchRoomPanel                  : PanelConfig<CoopCustomRoom.OpenDataForCcrSearchRoomPanel>;

        CcwMyWarListPanel                   : PanelConfig<CoopCustomWar.OpenDataForCcwMyWarListPanel>;

        ChatCommandPanel                    : PanelConfig<Chat.OpenDataForChatCommandPanel>;
        ChatPanel                           : PanelConfig<Chat.OpenDataForChatPanel>;

        CommonAddLoadedUnitPanel            : PanelConfig<Common.OpenDataForCommonAddLoadedUnitPanel>;
        CommonAlertPanel                    : PanelConfig<Common.OpenDataForCommonAlertPanel>;
        CommonBanCoCategoryIdPanel          : PanelConfig<Common.OpenDataForCommonBanCoCategoryIdPanel>;
        CommonBlockPanel                    : PanelConfig<Common.OpenDataForCommonBlockPanel>;
        CommonChangeVersionPanel            : PanelConfig<Common.OpenDataForCommonChangeVersionPanel>;
        CommonChooseCoCategoryIdPanel       : PanelConfig<Common.OpenDataForCommonChooseCoCategoryIdPanel>;
        CommonChooseCoPanel                 : PanelConfig<Common.OpenDataForCommonChooseCoPanel>;
        CommonChooseCoSkillTypePanel        : PanelConfig<Common.OpenDataForCommonChooseCoSkillTypePanel>;
        CommonChooseCustomCounterIdPanel    : PanelConfig<Common.OpenDataForCommonChooseCustomCounterIdPanel>;
        CommonChooseGridIndexPanel          : PanelConfig<Common.OpenDataForCommonChooseGridIndexPanel>;
        CommonChooseLocationPanel           : PanelConfig<Common.OpenDataForCommonChooseLocationPanel>;
        CommonChooseMapTagIdPanel           : PanelConfig<Common.OpenDataForCommonChooseMapTagIdPanel>;
        CommonChoosePlayerAliveStatePanel   : PanelConfig<Common.OpenDataForCommonChoosePlayerAliveStatePanel>;
        CommonChoosePlayerIndexPanel        : PanelConfig<Common.OpenDataForCommonChoosePlayerIndexPanel>;
        CommonChooseSingleCoPanel           : PanelConfig<Common.OpenDataForCommonChooseSingleCoPanel>;
        CommonChooseSingleTileTypePanel     : PanelConfig<Common.OpenDataForCommonChooseSingleTileTypePanel>;
        CommonChooseSingleUnitTypePanel     : PanelConfig<Common.OpenDataForCommonChooseSingleUnitTypePanel>;
        CommonChooseTeamIndexPanel          : PanelConfig<Common.OpenDataForCommonChooseTeamIndexPanel>;
        CommonChooseTileBasePanel           : PanelConfig<Common.OpenDataForCommonChooseTileBasePanel>;
        CommonChooseTileDecorationPanel     : PanelConfig<Common.OpenDataForCommonChooseTileDecorationPanel>;
        CommonChooseTileObjectPanel         : PanelConfig<Common.OpenDataForCommonChooseTileObjectPanel>;
        CommonChooseTileTypePanel           : PanelConfig<Common.OpenDataForCommonChooseTileTypePanel>;
        CommonChooseUnitActionStatePanel    : PanelConfig<Common.OpenDataForCommonChooseUnitActionStatePanel>;
        CommonChooseUnitAndSkinPanel        : PanelConfig<Common.OpenDataForCommonChooseUnitAndSkinPanel>;
        CommonChooseUnitTypePanel           : PanelConfig<Common.OpenDataForCommonChooseUnitTypePanel>;
        CommonChooseWarEventActionIdPanel   : PanelConfig<Common.OpenDataForCommonChooseWarEventActionIdPanel>;
        CommonChooseWarEventIdPanel         : PanelConfig<Common.OpenDataForCommonChooseWarEventIdPanel>;
        CommonChooseWeatherTypePanel        : PanelConfig<Common.OpenDataForCommonChooseWeatherTypePanel>;
        CommonCoInfoPanel                   : PanelConfig<Common.OpenDataForCommonCoInfoPanel>;
        CommonCoListPanel                   : PanelConfig<Common.OpenDataForCommonCoListPanel>;
        CommonConfirmPanel                  : PanelConfig<Common.OpenDataForCommonConfirmPanel>;
        CommonDamageCalculatorPanel         : PanelConfig<Common.OpenDataForCommonDamageCalculatorPanel>;
        CommonDamageChartPanel              : PanelConfig<Common.OpenDataForCommonDamageChartPanel>;
        CommonDeletePlayerPanel             : PanelConfig<Common.OpenDataForCommonDeletePlayerPanel>;
        CommonErrorPanel                    : PanelConfig<Common.OpenDataForCommonErrorPanel>;
        CommonGameChartPanel                : PanelConfig<Common.OpenDataForCommonGameChartPanel>;
        CommonHelpPanel                     : PanelConfig<Common.OpenDataForCommonHelpPanel>;
        CommonInputPanel                    : PanelConfig<Common.OpenDataForCommonInputPanel>;
        CommonInputIntegerPanel             : PanelConfig<Common.OpenDataForCommonInputIntegerPanel>;
        CommonInputLanguageTextPanel        : PanelConfig<Common.OpenDataForCommonInputLanguageTextPanel>;
        CommonJoinRoomPasswordPanel         : PanelConfig<Common.OpenDataForCommonJoinRoomPasswordPanel>;
        CommonMapFilterPanel                : PanelConfig<Common.OpenDataForCommonMapFilterPanel>;
        CommonMapWarStatisticsPanel         : PanelConfig<Common.OpenDataForCommonMapWarStatisticsPanel>;
        CommonModifyWarRuleNamePanel        : PanelConfig<Common.OpenDataForCommonModifyWarRuleNamePanel>;
        CommonRankListPanel                 : PanelConfig<Common.OpenDataForCommonRankListPanel>;
        CommonServerStatusPanel             : PanelConfig<Common.OpenDataForCommonServerStatusPanel>;
        CommonTileChartPanel                : PanelConfig<Common.OpenDataForCommonTileChartPanel>;
        CommonWarEventListPanel             : PanelConfig<Common.OpenDataForCommonWarEventListPanel>;

        LobbyBackgroundPanel                : PanelConfig<Lobby.OpenDataForLobbyBackgroundPanel>;
        LobbyBottomPanel                    : PanelConfig<Lobby.OpenDataForLobbyBottomPanel>;
        LobbyPanel                          : PanelConfig<Lobby.OpenDataForLobbyPanel>;
        LobbyTopPanel                       : PanelConfig<Lobby.OpenDataForLobbyTopPanel>;
        LobbyTopRightPanel                  : PanelConfig<Lobby.OpenDataForLobbyTopRightPanel>;

        McrCreateMapListPanel               : PanelConfig<MultiCustomRoom.OpenDataForMcrCreateMapListPanel>;
        McrCreateSettingsPanel              : PanelConfig<MultiCustomRoom.OpenDataForMcrCreateSettingsPanel>;
        McrJoinRoomListPanel                : PanelConfig<MultiCustomRoom.OpenDataForMcrJoinRoomListPanel>;
        McrMainMenuPanel                    : PanelConfig<MultiCustomRoom.OpenDataForMcrMainMenuPanel>;
        McrMyRoomListPanel                  : PanelConfig<MultiCustomRoom.OpenDataForMcrMyRoomListPanel>;
        McrRoomInfoPanel                    : PanelConfig<MultiCustomRoom.OpenDataForMcrRoomInfoPanel>;
        McrSearchRoomPanel                  : PanelConfig<MultiCustomRoom.OpenDataForMcrSearchRoomPanel>;

        McwMyWarListPanel                   : PanelConfig<MultiCustomWar.OpenDataForMcwMyWarListPanel>;

        MeAddWarEventToRulePanel            : PanelConfig<MapEditor.OpenDataForMeAddWarEventToRulePanel>;
        MeChooseTileBasePanel               : PanelConfig<MapEditor.OpenDataForMeChooseTileBasePanel>;
        MeChooseTileDecorationPanel         : PanelConfig<MapEditor.OpenDataForMeChooseTileDecorationPanel>;
        MeChooseTileObjectPanel             : PanelConfig<MapEditor.OpenDataForMeChooseTileObjectPanel>;
        MeChooseUnitPanel                   : PanelConfig<MapEditor.OpenDataForMeChooseUnitPanel>;
        MeClearPanel                        : PanelConfig<MapEditor.OpenDataForMeClearPanel>;
        MeConfirmSaveMapPanel               : PanelConfig<MapEditor.OpenDataForMeConfirmSaveMapPanel>;
        MeImportPanel                       : PanelConfig<MapEditor.OpenDataForMeImportPanel>;
        MeMapListPanel                      : PanelConfig<MapEditor.OpenDataForMeMapListPanel>;
        MeMfwSettingsPanel                  : PanelConfig<MapEditor.OpenDataForMeMfwSettingsPanel>;
        MeModifyMapDescPanel                : PanelConfig<MapEditor.OpenDataForMeModifyMapDescPanel>;
        MeResizePanel                       : PanelConfig<MapEditor.OpenDataForMeResizePanel>;
        MeSimSettingsPanel                  : PanelConfig<MapEditor.OpenDataForMeSimSettingsPanel>;
        MeSymmetryPanel                     : PanelConfig<MapEditor.OpenDataForMeSymmetryPanel>;
        MeTopPanel                          : PanelConfig<MapEditor.OpenDataForMeTopPanel>;
        MeVisibilityPanel                   : PanelConfig<MapEditor.OpenDataForMeVisibilityPanel>;
        MeWarMenuPanel                      : PanelConfig<MapEditor.OpenDataForMeWarMenuPanel>;
        MeWarRulePanel                      : PanelConfig<MapEditor.OpenDataForMeWarRulePanel>;
        MeChooseLocationPanel               : PanelConfig<MapEditor.OpenDataForMeChooseLocationPanel>;

        MfrCreateSettingsPanel              : PanelConfig<MultiFreeRoom.OpenDataForMfrCreateSettingsPanel>;
        MfrJoinRoomListPanel                : PanelConfig<MultiFreeRoom.OpenDataForMfrJoinRoomListPanel>;
        MfrMainMenuPanel                    : PanelConfig<MultiFreeRoom.OpenDataForMfrMainMenuPanel>;
        MfrMyRoomListPanel                  : PanelConfig<MultiFreeRoom.OpenDataForMfrMyRoomListPanel>;
        MfrRoomInfoPanel                    : PanelConfig<MultiFreeRoom.OpenDataForMfrRoomInfoPanel>;
        MfrSearchRoomPanel                  : PanelConfig<MultiFreeRoom.OpenDataForMfrSearchRoomPanel>;

        MfwMyWarListPanel                   : PanelConfig<MultiFreeWar.OpenDataForMfwMyWarListPanel>;

        MmAcceptMapPanel                    : PanelConfig<MapManagement.OpenDataForMmAcceptMapPanel>;
        MmAvailabilitySearchPanel           : PanelConfig<MapManagement.OpenDataForMmAvailabilitySearchPanel>;
        MmCommandPanel                      : PanelConfig<MapManagement.OpenDataForMmCommandPanel>;
        MmMainMenuPanel                     : PanelConfig<MapManagement.OpenDataForMmMainMenuPanel>;
        MmMapRenamePanel                    : PanelConfig<MapManagement.OpenDataForMmMapRenamePanel>;
        MmMapTagListPanel                   : PanelConfig<MapManagement.OpenDataForMmMapTagListPanel>;
        MmModifyMapListPanel                : PanelConfig<MapManagement.OpenDataForMmModifyMapListPanel>;
        MmRejectMapPanel                    : PanelConfig<MapManagement.OpenDataForMmRejectMapPanel>;
        MmReviewListPanel                   : PanelConfig<MapManagement.OpenDataForMmReviewListPanel>;
        MmSetWarRuleAvailabilityPanel       : PanelConfig<MapManagement.OpenDataForMmSetWarRuleAvailabilityPanel>;
        MmWarRulePanel                      : PanelConfig<MapManagement.OpenDataForMmWarRulePanel>;

        MpwSpectatePanel                    : PanelConfig<MultiPlayerWar.OpenDataForMpwSpectatePanel>;
        MpwSidePanel                        : PanelConfig<MultiPlayerWar.OpenDataForMpwSidePanel>;
        MpwTopPanel                         : PanelConfig<MultiPlayerWar.OpenDataForMpwTopPanel>;
        MpwWarMenuPanel                     : PanelConfig<MultiPlayerWar.OpenDataForMpwWarMenuPanel>;

        MrrMainMenuPanel                    : PanelConfig<MultiRankRoom.OpenDataForMrrMainMenuPanel>;
        MrrMyRoomListPanel                  : PanelConfig<MultiRankRoom.OpenDataForMrrMyRoomListPanel>;
        MrrPreviewMapListPanel              : PanelConfig<MultiRankRoom.OpenDataForMrrPreviewMapListPanel>;
        MrrRoomInfoPanel                    : PanelConfig<MultiRankRoom.OpenDataForMrrRoomInfoPanel>;
        MrrSetMaxConcurrentCountPanel       : PanelConfig<MultiRankRoom.OpenDataForMrrSetMaxConcurrentCountPanel>;

        MrwMyWarListPanel                   : PanelConfig<MultiRankWar.OpenDataForMrwMyWarListPanel>;

        RwReplayListPanel                   : PanelConfig<ReplayWar.OpenDataForRwReplayListPanel>;
        RwReplayProgressPanel               : PanelConfig<ReplayWar.OpenDataForRwReplayProgressPanel>;
        RwSearchReplayPanel                 : PanelConfig<ReplayWar.OpenDataForRwSearchReplayPanel>;
        RwTopPanel                          : PanelConfig<ReplayWar.OpenDataForRwTopPanel>;
        RwWarMenuPanel                      : PanelConfig<ReplayWar.OpenDataForRwWarMenuPanel>;

        ScrCreateMapListPanel               : PanelConfig<SingleCustomRoom.OpenDataForScrCreateMapListPanel>;
        ScrCreateSettingsPanel              : PanelConfig<SingleCustomRoom.OpenDataForScrCreateSettingsPanel>;

        SpmCreateSaveSlotsPanel             : PanelConfig<SinglePlayerMode.OpenDataForSpmCreateSaveSlotsPanel>;
        SpmCreateSfwSaveSlotsPanel          : PanelConfig<SinglePlayerMode.OpenDataForSpmCreateSfwSaveSlotsPanel>;
        SpmMainMenuPanel                    : PanelConfig<SinglePlayerMode.OpenDataForSpmMainMenuPanel>;
        SpmWarListPanel                     : PanelConfig<SinglePlayerMode.OpenDataForSpmWarListPanel>;
        SpmMyWarRoomRecordPanel             : PanelConfig<SinglePlayerMode.OpenDataForSpmMyWarRoomRecordPanel>;

        SpwLoadWarPanel                     : PanelConfig<SinglePlayerWar.OpenDataForSpwLoadWarPanel>;
        SpwSidePanel                        : PanelConfig<SinglePlayerWar.OpenDataForSpwSidePanel>;
        SpwTopPanel                         : PanelConfig<SinglePlayerWar.OpenDataForSpwTopPanel>;
        SpwWarMenuPanel                     : PanelConfig<SinglePlayerWar.OpenDataForSpwWarMenuPanel>;

        SrrCreateMapListPanel               : PanelConfig<SingleRankRoom.OpenDataForSrrCreateMapListPanel>;
        SrrCreateQuickSettingsPanel         : PanelConfig<SingleRankRoom.OpenDataForSrrCreateQuickSettingsPanel>;
        SrrCreateSettingsPanel              : PanelConfig<SingleRankRoom.OpenDataForSrrCreateSettingsPanel>;

        UserChangeNicknamePanel             : PanelConfig<User.OpenDataForUserChangeNicknamePanel>;
        UserGameManagementPanel             : PanelConfig<User.OpenDataForUserGameManagementPanel>;
        UserLoginBackgroundPanel            : PanelConfig<User.OpenDataForUserLoginBackgroundPanel>;
        UserLoginPanel                      : PanelConfig<User.OpenDataForUserLoginPanel>;
        UserOnlineUsersPanel                : PanelConfig<User.OpenDataForUserOnlineUsersPanel>;
        UserPanel                           : PanelConfig<User.OpenDataForUserPanel>;
        UserProfileSettingsPanel            : PanelConfig<User.OpenDataForUserProfileSettingsPanel>;
        UserRegisterPanel                   : PanelConfig<User.OpenDataForUserRegisterPanel>;
        UserSetAvatarPanel                  : PanelConfig<User.OpenDataForUserSetAvatarPanel>;
        UserSetDiscordInfoPanel             : PanelConfig<User.OpenDataForUserSetDiscordInfoPanel>;
        UserSetOpacityPanel                 : PanelConfig<User.OpenDataForUserSetOpacityPanel>;
        UserSetPasswordPanel                : PanelConfig<User.OpenDataForUserSetPasswordPanel>;
        UserSetPrivilegePanel               : PanelConfig<User.OpenDataForUserSetPrivilegePanel>;
        UserSetSoundPanel                   : PanelConfig<User.OpenDataForUserSetSoundPanel>;
        UserSetStageScalePanel              : PanelConfig<User.OpenDataForUserSetStageScalePanel>;
        UserSettingsPanel                   : PanelConfig<User.OpenDataForUserSettingsPanel>;
        UserWarHistoryPanel                 : PanelConfig<User.OpenDataForUserWarHistoryPanel>;

        WeActionAddUnitListPanel            : PanelConfig<WarEvent.OpenDataForWeActionAddUnitListPanel>;
        WeActionModifyPanel1                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel1>;
        WeActionModifyPanel2                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel2>;
        WeActionModifyPanel3                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel3>;
        WeActionModifyPanel4                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel4>;
        WeActionModifyPanel5                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel5>;
        WeActionModifyPanel6                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel6>;
        WeActionModifyPanel7                : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel7>;
        WeActionModifyPanel10               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel10>;
        WeActionModifyPanel11               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel11>;
        WeActionModifyPanel24               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel24>;
        WeActionModifyPanel30               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel30>;
        WeActionModifyPanel40               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel40>;
        WeActionModifyPanel41               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel41>;
        WeActionModifyPanel50               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel50>;
        WeActionModifyPanel51               : PanelConfig<WarEvent.OpenDataForWeActionModifyPanel51>;
        WeActionReplacePanel                : PanelConfig<WarEvent.OpenDataForWeActionReplacePanel>;
        WeActionTypeListPanel               : PanelConfig<WarEvent.OpenDataForWeActionTypeListPanel>;
        WeCommandPanel                      : PanelConfig<WarEvent.OpenDataForWeCommandPanel>;
        WeConditionModifyPanel6             : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel6>;
        WeConditionModifyPanel14            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel14>;
        WeConditionModifyPanel23            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel23>;
        WeConditionModifyPanel32            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel32>;
        WeConditionModifyPanel40            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel40>;
        WeConditionModifyPanel50            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel50>;
        WeConditionModifyPanel60            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel60>;
        WeConditionModifyPanel70            : PanelConfig<WarEvent.OpenDataForWeConditionModifyPanel70>;
        WeConditionReplacePanel             : PanelConfig<WarEvent.OpenDataForWeConditionReplacePanel>;
        WeConditionTypeListPanel            : PanelConfig<WarEvent.OpenDataForWeConditionTypeListPanel>;
        WeDialogueBackgroundPanel           : PanelConfig<WarEvent.OpenDataForWeDialogueBackgroundPanel>;
        WeEventListPanel                    : PanelConfig<WarEvent.OpenDataForWeEventListPanel>;
        WeEventRenamePanel                  : PanelConfig<WarEvent.OpenDataForWeEventRenamePanel>;
        WeNodeReplacePanel                  : PanelConfig<WarEvent.OpenDataForWeNodeReplacePanel>;

        WarMapBuildingListPanel             : PanelConfig<WarMap.OpenDataForWarMapBuildingListPanel>;

        WwDeleteWatcherDetailPanel          : PanelConfig<WatchWar.OpenDataForWwDeleteWatcherDetailPanel>;
        WwDeleteWatcherWarsPanel            : PanelConfig<WatchWar.OpenDataForWwDeleteWatcherWarsPanel>;
        WwHandleRequestDetailPanel          : PanelConfig<WatchWar.OpenDataForWwHandleRequestDetailPanel>;
        WwHandleRequestWarsPanel            : PanelConfig<WatchWar.OpenDataForWwHandleRequestWarsPanel>;
        WwMainMenuPanel                     : PanelConfig<WatchWar.OpenDataForWatchWarMainMenuPanel>;
        WwMakeRequestDetailPanel            : PanelConfig<WatchWar.OpenDataForWwMakeRequestDetailPanel>;
        WwMakeRequestWarsPanel              : PanelConfig<WatchWar.OpenDataForWwMakeRequestWarsPanel>;
        WwOngoingWarsPanel                  : PanelConfig<WatchWar.OpenDataForWwOngoingWarsPanel>;
        WwSearchWarPanel                    : PanelConfig<WatchWar.OpenDataForWwSearchWarPanel>;
    };

    export function initPanelDict(): void {
        PanelDict = {
            BwBackgroundPanel: {
                cls         : BaseWar?.BwBackgroundPanel,
                skinName    : `resource/skins/baseWar/BwBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
                needCache   : true,
            },

            BwBeginTurnPanel: {
                cls         : BaseWar?.BwBeginTurnPanel,
                skinName    : `resource/skins/baseWar/BwBeginTurnPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            BwCaptureProgressPanel: {
                cls         : BaseWar?.BwCaptureProgressPanel,
                skinName    : `resource/skins/baseWar/BwCaptureProgressPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            BwDamagePreviewPanel: {
                cls         : BaseWar?.BwDamagePreviewPanel,
                skinName    : `resource/skins/baseWar/BwDamagePreviewPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwDialoguePanel: {
                cls         : BaseWar?.BwDialoguePanel,
                skinName    : `resource/skins/baseWar/BwDialoguePanel.exml`,
                layer       : LayerType.Hud1,
            },

            BwProduceUnitPanel: {
                cls         : BaseWar?.BwProduceUnitPanel,
                skinName    : `resource/skins/baseWar/BwProduceUnitPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwSimpleDialoguePanel: {
                cls         : BaseWar?.BwSimpleDialoguePanel,
                skinName    : `resource/skins/baseWar/BwSimpleDialoguePanel.exml`,
                layer       : LayerType.Hud1,
            },

            BwTileBriefPanel: {
                cls         : BaseWar?.BwTileBriefPanel,
                skinName    : `resource/skins/baseWar/BwTileBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwTileDetailPanel: {
                cls         : BaseWar?.BwTileDetailPanel,
                skinName    : `resource/skins/baseWar/BwTileDetailPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitActionsPanel: {
                cls         : BaseWar?.BwUnitActionsPanel,
                skinName    : `resource/skins/baseWar/BwUnitActionsPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitBriefPanel: {
                cls         : BaseWar?.BwUnitBriefPanel,
                skinName    : `resource/skins/baseWar/BwUnitBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitDetailPanel: {
                cls         : BaseWar?.BwUnitDetailPanel,
                skinName    : `resource/skins/baseWar/BwUnitDetailPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitListPanel: {
                cls         : BaseWar?.BwUnitListPanel,
                skinName    : `resource/skins/baseWar/BwUnitListPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwWarInfoPanel: {
                cls         : BaseWar?.BwWarInfoPanel,
                skinName    : `resource/skins/baseWar/BwWarInfoPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwWarPanel: {
                cls         : BaseWar?.BwWarPanel,
                skinName    : `resource/skins/baseWar/BwWarPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            BroadcastAddMessagePanel: {
                cls         : Broadcast?.BroadcastAddMessagePanel,
                skinName    : `resource/skins/broadcast/BroadcastAddMessagePanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastMessageListPanel: {
                cls         : Broadcast?.BroadcastMessageListPanel,
                skinName    : `resource/skins/broadcast/BroadcastMessageListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastPanel: {
                cls         : Broadcast?.BroadcastPanel,
                skinName    : `resource/skins/broadcast/BroadcastPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChangeLogAddPanel: {
                cls         : ChangeLog?.ChangeLogAddPanel,
                skinName    : `resource/skins/changeLog/ChangeLogAddPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogModifyPanel: {
                cls         : ChangeLog?.ChangeLogModifyPanel,
                skinName    : `resource/skins/changeLog/ChangeLogModifyPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogPanel: {
                cls         : ChangeLog?.ChangeLogPanel,
                skinName    : `resource/skins/changeLog/ChangeLogPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcrCreateMapListPanel: {
                cls         : CoopCustomRoom?.CcrCreateMapListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrCreateSettingsPanel: {
                cls         : CoopCustomRoom?.CcrCreateSettingsPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrJoinRoomListPanel: {
                cls         : CoopCustomRoom?.CcrJoinRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMainMenuPanel: {
                cls         : CoopCustomRoom?.CcrMainMenuPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMyRoomListPanel: {
                cls         : CoopCustomRoom?.CcrMyRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrRoomInfoPanel: {
                cls         : CoopCustomRoom?.CcrRoomInfoPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrSearchRoomPanel: {
                cls         : CoopCustomRoom?.CcrSearchRoomPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcwMyWarListPanel: {
                cls         : CoopCustomWar?.CcwMyWarListPanel,
                skinName    : `resource/skins/coopCustomWar/CcwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChatCommandPanel: {
                cls         : Chat?.ChatCommandPanel,
                skinName    : `resource/skins/chat/ChatCommandPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : false,
            },
            ChatPanel: {
                cls         : Chat?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CommonAddLoadedUnitPanel: {
                cls         : Common?.CommonAddLoadedUnitPanel,
                skinName    : `resource/skins/common/CommonAddLoadedUnitPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonAlertPanel: {
                cls         : Common?.CommonAlertPanel,
                skinName    : `resource/skins/common/CommonAlertPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonBanCoCategoryIdPanel: {
                cls         : Common?.CommonBanCoCategoryIdPanel,
                skinName    : `resource/skins/common/CommonBanCoCategoryIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonBlockPanel: {
                cls         : Common?.CommonBlockPanel,
                skinName    : `resource/skins/common/CommonBlockPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonChangeVersionPanel: {
                cls         : Common?.CommonChangeVersionPanel,
                skinName    : `resource/skins/common/CommonChangeVersionPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoCategoryIdPanel: {
                cls         : Common?.CommonChooseCoCategoryIdPanel,
                skinName    : `resource/skins/common/CommonChooseCoCategoryIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoPanel: {
                cls         : Common?.CommonChooseCoPanel,
                skinName    : `resource/skins/common/CommonChooseCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoSkillTypePanel: {
                cls         : Common?.CommonChooseCoSkillTypePanel,
                skinName    : `resource/skins/common/CommonChooseCoSkillTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCustomCounterIdPanel: {
                cls         : Common?.CommonChooseCustomCounterIdPanel,
                skinName    : `resource/skins/common/CommonChooseCustomCounterIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseGridIndexPanel: {
                cls         : Common?.CommonChooseGridIndexPanel,
                skinName    : `resource/skins/common/CommonChooseGridIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseLocationPanel: {
                cls         : Common?.CommonChooseLocationPanel,
                skinName    : `resource/skins/common/CommonChooseLocationPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseMapTagIdPanel: {
                cls         : Common?.CommonChooseMapTagIdPanel,
                skinName    : `resource/skins/common/CommonChooseMapTagIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerAliveStatePanel: {
                cls         : Common?.CommonChoosePlayerAliveStatePanel,
                skinName    : `resource/skins/common/CommonChoosePlayerAliveStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerIndexPanel: {
                cls         : Common?.CommonChoosePlayerIndexPanel,
                skinName    : `resource/skins/common/CommonChoosePlayerIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleCoPanel: {
                cls         : Common?.CommonChooseSingleCoPanel,
                skinName    : `resource/skins/common/CommonChooseSingleCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleTileTypePanel: {
                cls         : Common?.CommonChooseSingleTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleUnitTypePanel: {
                cls         : Common?.CommonChooseSingleUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTeamIndexPanel: {
                cls         : Common?.CommonChooseTeamIndexPanel,
                skinName    : `resource/skins/common/CommonChooseTeamIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileBasePanel: {
                cls         : Common?.CommonChooseTileBasePanel,
                skinName    : `resource/skins/common/CommonChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileDecorationPanel: {
                cls         : Common?.CommonChooseTileDecorationPanel,
                skinName    : `resource/skins/common/CommonChooseTileDecoratorPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileObjectPanel: {
                cls         : Common?.CommonChooseTileObjectPanel,
                skinName    : `resource/skins/common/CommonChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileTypePanel: {
                cls         : Common?.CommonChooseTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitActionStatePanel: {
                cls         : Common?.CommonChooseUnitActionStatePanel,
                skinName    : `resource/skins/common/CommonChooseUnitActionStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitAndSkinPanel: {
                cls         : Common?.CommonChooseUnitAndSkinPanel,
                skinName    : `resource/skins/common/CommonChooseUnitAndSkinPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitTypePanel: {
                cls         : Common?.CommonChooseUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventActionIdPanel: {
                cls         : Common?.CommonChooseWarEventActionIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventActionIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventIdPanel: {
                cls         : Common?.CommonChooseWarEventIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWeatherTypePanel: {
                cls         : Common?.CommonChooseWeatherTypePanel,
                skinName    : `resource/skins/common/CommonChooseWeatherTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoInfoPanel: {
                cls         : Common?.CommonCoInfoPanel,
                skinName    : `resource/skins/common/CommonCoInfoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoListPanel: {
                cls         : Common?.CommonCoListPanel,
                skinName    : `resource/skins/common/CommonCoListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonConfirmPanel: {
                cls         : Common?.CommonConfirmPanel,
                skinName    : `resource/skins/common/CommonConfirmPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonDamageCalculatorPanel: {
                cls         : Common?.CommonDamageCalculatorPanel,
                skinName    : `resource/skins/common/CommonDamageCalculatorPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonDamageChartPanel: {
                cls         : Common?.CommonDamageChartPanel,
                skinName    : `resource/skins/common/CommonDamageChartPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonDeletePlayerPanel: {
                cls         : Common?.CommonDeletePlayerPanel,
                skinName    : `resource/skins/common/CommonDeletePlayerPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonErrorPanel: {
                cls         : Common?.CommonErrorPanel,
                skinName    : `resource/skins/common/CommonErrorPanel.exml`,
                layer       : LayerType.Top,
            },

            CommonGameChartPanel: {
                cls         : Common?.CommonGameChartPanel,
                skinName    : `resource/skins/common/CommonGameChartPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonHelpPanel: {
                cls         : Common?.CommonHelpPanel,
                skinName    : `resource/skins/common/CommonHelpPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonInputPanel: {
                cls         : Common?.CommonInputPanel,
                skinName    : `resource/skins/common/CommonInputPanel.exml`,
                layer       : LayerType.Hud1,
            },

            CommonInputIntegerPanel: {
                cls         : Common?.CommonInputIntegerPanel,
                skinName    : `resource/skins/common/CommonInputIntegerPanel.exml`,
                layer       : LayerType.Hud1,
            },

            CommonInputLanguageTextPanel: {
                cls         : Common?.CommonInputLanguageTextPanel,
                skinName    : `resource/skins/common/CommonInputLanguageTextPanel.exml`,
                layer       : LayerType.Hud1,
            },

            CommonJoinRoomPasswordPanel: {
                cls         : Common?.CommonJoinRoomPasswordPanel,
                skinName    : `resource/skins/common/CommonJoinRoomPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonMapFilterPanel: {
                cls         : Common?.CommonMapFilterPanel,
                skinName    : `resource/skins/common/CommonMapFilterPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonMapWarStatisticsPanel: {
                cls         : Common?.CommonMapWarStatisticsPanel,
                skinName    : `resource/skins/common/CommonMapWarStatisticsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonModifyWarRuleNamePanel: {
                cls         : Common?.CommonModifyWarRuleNamePanel,
                skinName    : `resource/skins/common/CommonModifyWarRuleNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonRankListPanel: {
                cls         : Common?.CommonRankListPanel,
                skinName    : `resource/skins/common/CommonRankListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonServerStatusPanel: {
                cls         : Common?.CommonServerStatusPanel,
                skinName    : `resource/skins/common/CommonServerStatusPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonTileChartPanel: {
                cls         : Common?.CommonTileChartPanel,
                skinName    : `resource/skins/common/CommonTileChartPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonWarEventListPanel: {
                cls         : Common?.CommonWarEventListPanel,
                skinName    : `resource/skins/common/CommonWarEventListPanel.exml`,
                layer       : LayerType.Hud1,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            LobbyBackgroundPanel: {
                cls         : Lobby?.LobbyBackgroundPanel,
                skinName    : `resource/skins/lobby/LobbyBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                needCache   : true,
            },

            LobbyBottomPanel: {
                cls         : Lobby?.LobbyBottomPanel,
                skinName    : `resource/skins/lobby/LobbyBottomPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            LobbyPanel: {
                cls         : Lobby?.LobbyPanel,
                skinName    : `resource/skins/lobby/LobbyPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
                needCache   : true,
            },

            LobbyTopPanel: {
                cls         : Lobby?.LobbyTopPanel,
                skinName    : `resource/skins/lobby/LobbyTopPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            LobbyTopRightPanel: {
                cls         : Lobby?.LobbyTopRightPanel,
                skinName    : `resource/skins/lobby/LobbyTopRightPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            McrCreateMapListPanel: {
                cls         : MultiCustomRoom?.McrCreateMapListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrCreateSettingsPanel: {
                cls         : MultiCustomRoom?.McrCreateSettingsPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrJoinRoomListPanel: {
                cls         : MultiCustomRoom?.McrJoinRoomListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMainMenuPanel: {
                cls         : MultiCustomRoom?.McrMainMenuPanel,
                skinName    : `resource/skins/multiCustomRoom/McrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMyRoomListPanel: {
                cls         : MultiCustomRoom?.McrMyRoomListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrRoomInfoPanel: {
                cls         : MultiCustomRoom?.McrRoomInfoPanel,
                skinName    : `resource/skins/multiCustomRoom/McrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrSearchRoomPanel: {
                cls         : MultiCustomRoom?.McrSearchRoomPanel,
                skinName    : `resource/skins/multiCustomRoom/McrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            McwMyWarListPanel: {
                cls         : MultiCustomWar?.McwMyWarListPanel,
                skinName    : `resource/skins/multiCustomWar/McwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MeAddWarEventToRulePanel: {
                cls         : MapEditor?.MeAddWarEventToRulePanel,
                skinName    : `resource/skins/mapEditor/MeAddWarEventToRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseTileBasePanel: {
                cls         : MapEditor?.MeChooseTileBasePanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileDecorationPanel: {
                cls         : MapEditor?.MeChooseTileDecorationPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileDecorationPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileObjectPanel: {
                cls         : MapEditor?.MeChooseTileObjectPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseUnitPanel: {
                cls         : MapEditor?.MeChooseUnitPanel,
                skinName    : `resource/skins/mapEditor/MeChooseUnitPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeClearPanel: {
                cls         : MapEditor?.MeClearPanel,
                skinName    : `resource/skins/mapEditor/MeClearPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeConfirmSaveMapPanel: {
                cls         : MapEditor?.MeConfirmSaveMapPanel,
                skinName    : `resource/skins/mapEditor/MeConfirmSaveMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeImportPanel: {
                cls         : MapEditor?.MeImportPanel,
                skinName    : `resource/skins/mapEditor/MeImportPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeMapListPanel: {
                cls         : MapEditor?.MeMapListPanel,
                skinName    : `resource/skins/mapEditor/MeMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MeMfwSettingsPanel: {
                cls         : MapEditor?.MeMfwSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeMfwSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyMapDescPanel: {
                cls         : MapEditor?.MeModifyMapDescPanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapDescPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeResizePanel: {
                cls         : MapEditor?.MeResizePanel,
                skinName    : `resource/skins/mapEditor/MeResizePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSimSettingsPanel: {
                cls         : MapEditor?.MeSimSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeSimSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSymmetryPanel: {
                cls         : MapEditor?.MeSymmetryPanel,
                skinName    : `resource/skins/mapEditor/MeSymmetryPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeTopPanel: {
                cls         : MapEditor?.MeTopPanel,
                skinName    : `resource/skins/mapEditor/MeTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeVisibilityPanel: {
                cls         : MapEditor?.MeVisibilityPanel,
                skinName    : `resource/skins/mapEditor/MeVisibilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarMenuPanel: {
                cls         : MapEditor?.MeWarMenuPanel,
                skinName    : `resource/skins/mapEditor/MeWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarRulePanel: {
                cls         : MapEditor?.MeWarRulePanel,
                skinName    : `resource/skins/mapEditor/MeWarRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseLocationPanel: {
                cls         : MapEditor?.MeChooseLocationPanel,
                skinName    : `resource/skins/mapEditor/MeChooseLocationPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MfrCreateSettingsPanel: {
                cls         : MultiFreeRoom?.MfrCreateSettingsPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrJoinRoomListPanel: {
                cls         : MultiFreeRoom?.MfrJoinRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMainMenuPanel: {
                cls         : MultiFreeRoom?.MfrMainMenuPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMyRoomListPanel: {
                cls         : MultiFreeRoom?.MfrMyRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrRoomInfoPanel: {
                cls         : MultiFreeRoom?.MfrRoomInfoPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrSearchRoomPanel: {
                cls         : MultiFreeRoom?.MfrSearchRoomPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MfwMyWarListPanel: {
                cls         : MultiFreeWar?.MfwMyWarListPanel,
                skinName    : `resource/skins/multiFreeWar/MfwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MmAcceptMapPanel: {
                cls         : MapManagement?.MmAcceptMapPanel,
                skinName    : `resource/skins/mapManagement/MmAcceptMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmAvailabilitySearchPanel: {
                cls         : MapManagement?.MmAvailabilitySearchPanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilitySearchPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmCommandPanel: {
                cls         : MapManagement?.MmCommandPanel,
                skinName    : `resource/skins/mapManagement/MmCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmMainMenuPanel: {
                cls         : MapManagement?.MmMainMenuPanel,
                skinName    : `resource/skins/mapManagement/MmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmMapRenamePanel: {
                cls         : MapManagement?.MmMapRenamePanel,
                skinName    : `resource/skins/mapManagement/MmMapRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmMapTagListPanel: {
                cls         : MapManagement?.MmMapTagListPanel,
                skinName    : `resource/skins/mapManagement/MmMapTagListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmModifyMapListPanel: {
                cls         : MapManagement?.MmModifyMapListPanel,
                skinName    : `resource/skins/mapManagement/MmModifyMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmRejectMapPanel: {
                cls         : MapManagement?.MmRejectMapPanel,
                skinName    : `resource/skins/mapManagement/MmRejectMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmReviewListPanel: {
                cls         : MapManagement?.MmReviewListPanel,
                skinName    : `resource/skins/mapManagement/MmReviewListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmSetWarRuleAvailabilityPanel: {
                cls         : MapManagement?.MmSetWarRuleAvailabilityPanel,
                skinName    : `resource/skins/mapManagement/MmSetWarRuleAvailabilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmWarRulePanel: {
                cls         : MapManagement?.MmWarRulePanel,
                skinName    : `resource/skins/mapManagement/MmWarRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MpwSpectatePanel: {
                cls         : MultiPlayerWar?.MpwSpectatePanel,
                skinName    : `resource/skins/multiPlayerWar/MpwSpectatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwSidePanel: {
                cls         : MultiPlayerWar?.MpwSidePanel,
                skinName    : `resource/skins/multiPlayerWar/MpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwTopPanel: {
                cls         : MultiPlayerWar?.MpwTopPanel,
                skinName    : `resource/skins/multiPlayerWar/MpwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwWarMenuPanel: {
                cls         : MultiPlayerWar?.MpwWarMenuPanel,
                skinName    : `resource/skins/multiPlayerWar/MpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MrrMainMenuPanel: {
                cls         : MultiRankRoom?.MrrMainMenuPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrMyRoomListPanel: {
                cls         : MultiRankRoom?.MrrMyRoomListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrPreviewMapListPanel: {
                cls         : MultiRankRoom?.MrrPreviewMapListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrRoomInfoPanel: {
                cls         : MultiRankRoom?.MrrRoomInfoPanel,
                skinName    : `resource/skins/multiRankRoom/MrrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrSetMaxConcurrentCountPanel: {
                cls         : MultiRankRoom?.MrrSetMaxConcurrentCountPanel,
                skinName    : `resource/skins/multiRankRoom/MrrSetMaxConcurrentCountPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MrwMyWarListPanel: {
                cls         : MultiRankWar?.MrwMyWarListPanel,
                skinName    : `resource/skins/multiRankWar/MrwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            RwReplayListPanel: {
                cls         : ReplayWar?.RwReplayListPanel,
                skinName    : `resource/skins/replayWar/RwReplayListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            RwReplayProgressPanel: {
                cls         : ReplayWar?.RwReplayProgressPanel,
                skinName    : `resource/skins/replayWar/RwReplayProgressPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwSearchReplayPanel: {
                cls         : ReplayWar?.RwSearchReplayPanel,
                skinName    : `resource/skins/replayWar/RwSearchReplayPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwTopPanel: {
                cls         : ReplayWar?.RwTopPanel,
                skinName    : `resource/skins/replayWar/RwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwWarMenuPanel: {
                cls         : ReplayWar?.RwWarMenuPanel,
                skinName    : `resource/skins/replayWar/RwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ScrCreateMapListPanel: {
                cls         : SingleCustomRoom?.ScrCreateMapListPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ScrCreateSettingsPanel: {
                cls         : SingleCustomRoom?.ScrCreateSettingsPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SpmCreateSaveSlotsPanel: {
                cls         : SinglePlayerMode?.SpmCreateSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmCreateSfwSaveSlotsPanel: {
                cls         : SinglePlayerMode?.SpmCreateSfwSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSfwSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmMainMenuPanel: {
                cls         : SinglePlayerMode?.SpmMainMenuPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SpmWarListPanel: {
                cls         : SinglePlayerMode?.SpmWarListPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SpmMyWarRoomRecordPanel: {
                cls         : SinglePlayerMode?.SpmMyWarRoomRecordPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmMyWarRoomRecordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SpwLoadWarPanel: {
                cls         : SinglePlayerWar?.SpwLoadWarPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwLoadWarPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwSidePanel: {
                cls         : SinglePlayerWar?.SpwSidePanel,
                skinName    : `resource/skins/singlePlayerWar/SpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwTopPanel: {
                cls         : SinglePlayerWar?.SpwTopPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwWarMenuPanel: {
                cls         : SinglePlayerWar?.SpwWarMenuPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SrrCreateMapListPanel: {
                cls         : SingleRankRoom?.SrrCreateMapListPanel,
                skinName    : `resource/skins/singleRankRoom/SrrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SrrCreateQuickSettingsPanel: {
                cls         : SingleRankRoom?.SrrCreateQuickSettingsPanel,
                skinName    : `resource/skins/singleRankRoom/SrrCreateQuickSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SrrCreateSettingsPanel: {
                cls         : SingleRankRoom?.SrrCreateSettingsPanel,
                skinName    : `resource/skins/singleRankRoom/SrrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            UserChangeNicknamePanel: {
                cls         : User?.UserChangeNicknamePanel,
                skinName    : `resource/skins/user/UserChangeNicknamePanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserGameManagementPanel: {
                cls         : User?.UserGameManagementPanel,
                skinName    : `resource/skins/user/UserGameManagementPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserLoginBackgroundPanel: {
                cls         : User?.UserLoginBackgroundPanel,
                skinName    : `resource/skins/user/UserLoginBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
            },

            UserLoginPanel: {
                cls         : User?.UserLoginPanel,
                skinName    : `resource/skins/user/UserLoginPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserOnlineUsersPanel: {
                cls         : User?.UserOnlineUsersPanel,
                skinName    : `resource/skins/user/UserOnlineUsersPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserPanel: {
                cls         : User?.UserPanel,
                skinName    : `resource/skins/user/UserPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserProfileSettingsPanel: {
                cls         : User?.UserProfileSettingsPanel,
                skinName    : `resource/skins/user/UserProfileSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserRegisterPanel: {
                cls         : User?.UserRegisterPanel,
                skinName    : `resource/skins/user/UserRegisterPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetAvatarPanel: {
                cls         : User?.UserSetAvatarPanel,
                skinName    : `resource/skins/user/UserSetAvatarPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetDiscordInfoPanel: {
                cls         : User?.UserSetDiscordInfoPanel,
                skinName    : `resource/skins/user/UserSetDiscordInfoPanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserSetPasswordPanel: {
                cls         : User?.UserSetPasswordPanel,
                skinName    : `resource/skins/user/UserSetPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetPrivilegePanel: {
                cls         : User?.UserSetPrivilegePanel,
                skinName    : `resource/skins/user/UserSetPrivilegePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetSoundPanel: {
                cls         : User?.UserSetSoundPanel,
                skinName    : `resource/skins/user/UserSetSoundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetOpacityPanel: {
                cls         : User?.UserSetOpacityPanel,
                skinName    : `resource/skins/user/UserSetOpacityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetStageScalePanel: {
                cls         : User?.UserSetStageScalePanel,
                skinName    : `resource/skins/user/UserSetStageScalePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSettingsPanel: {
                cls         : User?.UserSettingsPanel,
                skinName    : `resource/skins/user/UserSettingsPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserWarHistoryPanel: {
                cls         : User?.UserWarHistoryPanel,
                skinName    : `resource/skins/user/UserWarHistoryPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WeActionAddUnitListPanel: {
                cls         : WarEvent?.WeActionAddUnitListPanel,
                skinName    : `resource/skins/warEvent/WeActionAddUnitListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel1: {
                cls         : WarEvent?.WeActionModifyPanel1,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel1.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel2: {
                cls         : WarEvent?.WeActionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel3: {
                cls         : WarEvent?.WeActionModifyPanel3,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel3.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel4: {
                cls         : WarEvent?.WeActionModifyPanel4,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel4.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel5: {
                cls         : WarEvent?.WeActionModifyPanel5,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel5.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel6: {
                cls         : WarEvent?.WeActionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel7: {
                cls         : WarEvent?.WeActionModifyPanel7,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel7.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel10: {
                cls         : WarEvent?.WeActionModifyPanel10,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel10.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel11: {
                cls         : WarEvent?.WeActionModifyPanel11,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel11.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel24: {
                cls         : WarEvent?.WeActionModifyPanel24,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel24.exml`,
                layer       : LayerType.Hud0,
            },


            WeActionModifyPanel30: {
                cls         : WarEvent?.WeActionModifyPanel30,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel30.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel40: {
                cls         : WarEvent?.WeActionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel41: {
                cls         : WarEvent?.WeActionModifyPanel41,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel41.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel50: {
                cls         : WarEvent?.WeActionModifyPanel50,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel50.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel51: {
                cls         : WarEvent?.WeActionModifyPanel51,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel51.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionReplacePanel: {
                cls         : WarEvent?.WeActionReplacePanel,
                skinName    : `resource/skins/warEvent/WeActionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionTypeListPanel: {
                cls         : WarEvent?.WeActionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeActionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeCommandPanel: {
                cls         : WarEvent?.WeCommandPanel,
                skinName    : `resource/skins/warEvent/WeCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel6: {
                cls         : WarEvent?.WeConditionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel14: {
                cls         : WarEvent?.WeConditionModifyPanel14,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel14.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel23: {
                cls         : WarEvent?.WeConditionModifyPanel23,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel23.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel32: {
                cls         : WarEvent?.WeConditionModifyPanel32,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel32.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel40: {
                cls         : WarEvent?.WeConditionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel50: {
                cls         : WarEvent?.WeConditionModifyPanel50,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel50.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel60: {
                cls         : WarEvent?.WeConditionModifyPanel60,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel60.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel70: {
                cls         : WarEvent?.WeConditionModifyPanel70,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel70.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionReplacePanel: {
                cls         : WarEvent?.WeConditionReplacePanel,
                skinName    : `resource/skins/warEvent/WeConditionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionTypeListPanel: {
                cls         : WarEvent?.WeConditionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeConditionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeDialogueBackgroundPanel: {
                cls         : WarEvent?.WeDialogueBackgroundPanel,
                skinName    : `resource/skins/warEvent/WeDialogueBackgroundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeEventListPanel: {
                cls         : WarEvent?.WeEventListPanel,
                skinName    : `resource/skins/warEvent/WeEventListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeEventRenamePanel: {
                cls         : WarEvent?.WeEventRenamePanel,
                skinName    : `resource/skins/warEvent/WeEventRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeNodeReplacePanel: {
                cls         : WarEvent?.WeNodeReplacePanel,
                skinName    : `resource/skins/warEvent/WeNodeReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WarMapBuildingListPanel: {
                cls         : WarMap?.WarMapBuildingListPanel,
                skinName    : `resource/skins/warMap/WarMapBuildingListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WwDeleteWatcherDetailPanel: {
                cls         : WatchWar?.WwDeleteWatcherDetailPanel,
                skinName    : `resource/skins/watchWar/WwDeleteWatcherDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwDeleteWatcherWarsPanel: {
                cls         : WatchWar?.WwDeleteWatcherWarsPanel,
                skinName    : `resource/skins/watchWar/WwDeleteWatcherWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwHandleRequestDetailPanel: {
                cls         : WatchWar?.WwHandleRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwHandleRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwHandleRequestWarsPanel: {
                cls         : WatchWar?.WwHandleRequestWarsPanel,
                skinName    : `resource/skins/watchWar/WwHandleRequestWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwMainMenuPanel: {
                cls         : WatchWar?.WwMainMenuPanel,
                skinName    : `resource/skins/watchWar/WwMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwMakeRequestDetailPanel: {
                cls         : WatchWar?.WwMakeRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwMakeRequestWarsPanel: {
                cls         : WatchWar?.WwMakeRequestWarsPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwOngoingWarsPanel: {
                cls         : WatchWar?.WwOngoingWarsPanel,
                skinName    : `resource/skins/watchWar/WwOngoingWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwSearchWarPanel: {
                cls         : WatchWar?.WwSearchWarPanel,
                skinName    : `resource/skins/watchWar/WwSearchWarPanel.exml`,
                layer       : LayerType.Hud0,
            },
        };
    }
}
