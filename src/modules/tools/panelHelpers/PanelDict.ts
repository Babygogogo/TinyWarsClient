
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.PanelHelpers {
    import LayerType    = Twns.Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel.UiPanel<T>;
        skinName        : string;
        layer           : LayerType;
        isExclusive?    : boolean;
        needCache?      : boolean;
    };

    export let PanelDict: {
        BwBackgroundPanel                   : PanelConfig<Twns.BaseWar.OpenDataForBwBackgroundPanel>;
        BwBeginTurnPanel                    : PanelConfig<Twns.BaseWar.OpenDataForBwBeginTurnPanel>;
        BwCaptureProgressPanel              : PanelConfig<Twns.BaseWar.OpenDataForBwCaptureProgressPanel>;
        BwDamagePreviewPanel                : PanelConfig<Twns.BaseWar.OpenDataForBwDamagePreviewPanel>;
        BwDialoguePanel                     : PanelConfig<Twns.BaseWar.OpenDataForBwDialoguePanel>;
        BwProduceUnitPanel                  : PanelConfig<Twns.BaseWar.OpenDataForBwProduceUnitPanel>;
        BwSimpleDialoguePanel               : PanelConfig<Twns.BaseWar.OpenDataForBwSimpleDialoguePanel>;
        BwTileBriefPanel                    : PanelConfig<Twns.BaseWar.OpenDataForBwTileBriefPanel>;
        BwTileDetailPanel                   : PanelConfig<Twns.BaseWar.OpenDataForBwTileDetailPanel>;
        BwUnitActionsPanel                  : PanelConfig<Twns.BaseWar.OpenDataForBwUnitActionsPanel>;
        BwUnitBriefPanel                    : PanelConfig<Twns.BaseWar.OpenDataForBwUnitBriefPanel>;
        BwUnitDetailPanel                   : PanelConfig<Twns.BaseWar.OpenDataForBwUnitDetailPanel>;
        BwUnitListPanel                     : PanelConfig<Twns.BaseWar.OpenDataForBwUnitListPanel>;
        BwWarInfoPanel                      : PanelConfig<Twns.BaseWar.OpenDataForBwWarInfoPanel>;
        BwWarPanel                          : PanelConfig<Twns.BaseWar.OpenDataForBwWarPanel>;

        BroadcastAddMessagePanel            : PanelConfig<Twns.Broadcast.OpenDataForBroadcastAddMessagePanel>;
        BroadcastMessageListPanel           : PanelConfig<Twns.Broadcast.OpenDataForBroadcastMessageListPanel>;
        BroadcastPanel                      : PanelConfig<Twns.Broadcast.OpenDataForBroadcastPanel>;

        ChangeLogAddPanel                   : PanelConfig<Twns.ChangeLog.OpenDataForChangeLogAddPanel>;
        ChangeLogModifyPanel                : PanelConfig<Twns.ChangeLog.OpenDataForChangeLogModifyPanel>;
        ChangeLogPanel                      : PanelConfig<Twns.ChangeLog.OpenDataForChangeLogPanel>;

        CcrCreateMapListPanel               : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrCreateMapListPanel>;
        CcrCreateSearchMapPanel             : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrCreateSearchMapPanel>;
        CcrCreateSettingsPanel              : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrCreateSettingsPanel>;
        CcrJoinRoomListPanel                : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrJoinRoomListPanel>;
        CcrMainMenuPanel                    : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrMainMenuPanel>;
        CcrMyRoomListPanel                  : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrMyRoomListPanel>;
        CcrRoomInfoPanel                    : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrRoomInfoPanel>;
        CcrSearchRoomPanel                  : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrSearchRoomPanel>;

        CcwMyWarListPanel                   : PanelConfig<Twns.CoopCustomWar.OpenDataForCcwMyWarListPanel>;

        ChatCommandPanel                    : PanelConfig<Twns.Chat.OpenDataForChatCommandPanel>;
        ChatPanel                           : PanelConfig<Twns.Chat.OpenDataForChatPanel>;

        CommonAddLoadedUnitPanel            : PanelConfig<Twns.Common.OpenDataForCommonAddLoadedUnitPanel>;
        CommonAlertPanel                    : PanelConfig<Twns.Common.OpenDataForCommonAlertPanel>;
        CommonBanCoPanel                    : PanelConfig<Twns.Common.OpenDataForCommonBanCoPanel>;
        CommonBlockPanel                    : PanelConfig<Twns.Common.OpenDataForCommonBlockPanel>;
        CommonChangeVersionPanel            : PanelConfig<Twns.Common.OpenDataForCommonChangeVersionPanel>;
        CommonChooseCoCategoryIdPanel       : PanelConfig<Twns.Common.OpenDataForCommonChooseCoCategoryIdPanel>;
        CommonChooseCoPanel                 : PanelConfig<Twns.Common.OpenDataForCommonChooseCoPanel>;
        CommonChooseCoSkillTypePanel        : PanelConfig<Twns.Common.OpenDataForCommonChooseCoSkillTypePanel>;
        CommonChooseCustomCounterIdPanel    : PanelConfig<Twns.Common.OpenDataForCommonChooseCustomCounterIdPanel>;
        CommonChooseGridIndexPanel          : PanelConfig<Twns.Common.OpenDataForCommonChooseGridIndexPanel>;
        CommonChooseLocationPanel           : PanelConfig<Twns.Common.OpenDataForCommonChooseLocationPanel>;
        CommonChoosePlayerAliveStatePanel   : PanelConfig<Twns.Common.OpenDataForCommonChoosePlayerAliveStatePanel>;
        CommonChoosePlayerIndexPanel        : PanelConfig<Twns.Common.OpenDataForCommonChoosePlayerIndexPanel>;
        CommonChooseSingleTileTypePanel     : PanelConfig<Twns.Common.OpenDataForCommonChooseSingleTileTypePanel>;
        CommonChooseSingleUnitTypePanel     : PanelConfig<Twns.Common.OpenDataForCommonChooseSingleUnitTypePanel>;
        CommonChooseTeamIndexPanel          : PanelConfig<Twns.Common.OpenDataForCommonChooseTeamIndexPanel>;
        CommonChooseTileBasePanel           : PanelConfig<Twns.Common.OpenDataForCommonChooseTileBasePanel>;
        CommonChooseTileDecoratorPanel      : PanelConfig<Twns.Common.OpenDataForCommonChooseTileDecoratorPanel>;
        CommonChooseTileObjectPanel         : PanelConfig<Twns.Common.OpenDataForCommonChooseTileObjectPanel>;
        CommonChooseTileTypePanel           : PanelConfig<Twns.Common.OpenDataForCommonChooseTileTypePanel>;
        CommonChooseUnitActionStatePanel    : PanelConfig<Twns.Common.OpenDataForCommonChooseUnitActionStatePanel>;
        CommonChooseUnitTypePanel           : PanelConfig<Twns.Common.OpenDataForCommonChooseUnitTypePanel>;
        CommonChooseWarEventActionIdPanel   : PanelConfig<Twns.Common.OpenDataForCommonChooseWarEventActionIdPanel>;
        CommonChooseWarEventIdPanel         : PanelConfig<Twns.Common.OpenDataForCommonChooseWarEventIdPanel>;
        CommonChooseWeatherTypePanel        : PanelConfig<Twns.Common.OpenDataForCommonChooseWeatherTypePanel>;
        CommonCoInfoPanel                   : PanelConfig<Twns.Common.OpenDataForCommonCoInfoPanel>;
        CommonCoListPanel                   : PanelConfig<Twns.Common.OpenDataForCommonCoListPanel>;
        CommonConfirmPanel                  : PanelConfig<Twns.Common.OpenDataForCommonConfirmPanel>;
        CommonDamageCalculatorPanel         : PanelConfig<Twns.Common.OpenDataForCommonDamageCalculatorPanel>;
        CommonDamageChartPanel              : PanelConfig<Twns.Common.OpenDataForCommonDamageChartPanel>;
        CommonErrorPanel                    : PanelConfig<Twns.Common.OpenDataForCommonErrorPanel>;
        CommonHelpPanel                     : PanelConfig<Twns.Common.OpenDataForCommonHelpPanel>;
        CommonInputPanel                    : PanelConfig<Twns.Common.OpenDataForCommonInputPanel>;
        CommonInputIntegerPanel             : PanelConfig<Twns.Common.OpenDataForCommonInputIntegerPanel>;
        CommonJoinRoomPasswordPanel         : PanelConfig<Twns.Common.OpenDataForCommonJoinRoomPasswordPanel>;
        CommonMapWarStatisticsPanel         : PanelConfig<Twns.Common.OpenDataForCommonMapWarStatisticsPanel>;
        CommonModifyWarRuleNamePanel        : PanelConfig<Twns.Common.OpenDataForCommonModifyWarRuleNamePanel>;
        CommonRankListPanel                 : PanelConfig<Twns.Common.OpenDataForCommonRankListPanel>;
        CommonServerStatusPanel             : PanelConfig<Twns.Common.OpenDataForCommonServerStatusPanel>;
        CommonWarEventListPanel             : PanelConfig<Twns.Common.OpenDataForCommonWarEventListPanel>;

        HrwReplayProgressPanel              : PanelConfig<Twns.HalfwayReplayWar.OpenDataForHrwReplayProgressPanel>;
        HrwTopPanel                         : PanelConfig<Twns.HalfwayReplayWar.OpenDataForHrwTopPanel>;
        HrwWarMenuPanel                     : PanelConfig<Twns.HalfwayReplayWar.OpenDataForHrwWarMenuPanel>;

        LobbyBackgroundPanel                : PanelConfig<Twns.Lobby.OpenDataForLobbyBackgroundPanel>;
        LobbyBottomPanel                    : PanelConfig<Twns.Lobby.OpenDataForLobbyBottomPanel>;
        LobbyPanel                          : PanelConfig<Twns.Lobby.OpenDataForLobbyPanel>;
        LobbyTopPanel                       : PanelConfig<Twns.Lobby.OpenDataForLobbyTopPanel>;
        LobbyTopRightPanel                  : PanelConfig<Twns.Lobby.OpenDataForLobbyTopRightPanel>;

        McrCreateMapListPanel               : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrCreateMapListPanel>;
        McrCreateSearchMapPanel             : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrCreateSearchMapPanel>;
        McrCreateSettingsPanel              : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrCreateSettingsPanel>;
        McrJoinRoomListPanel                : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrJoinRoomListPanel>;
        McrMainMenuPanel                    : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrMainMenuPanel>;
        McrMyRoomListPanel                  : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrMyRoomListPanel>;
        McrRoomInfoPanel                    : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrRoomInfoPanel>;
        McrSearchRoomPanel                  : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrSearchRoomPanel>;

        McwMyWarListPanel                   : PanelConfig<Twns.MultiCustomWar.OpenDataForMcwMyWarListPanel>;

        MeAddWarEventToRulePanel            : PanelConfig<Twns.MapEditor.OpenDataForMeAddWarEventToRulePanel>;
        MeAvailableCoPanel                  : PanelConfig<Twns.MapEditor.OpenDataForMeAvailableCoPanel>;
        MeChooseTileBasePanel               : PanelConfig<Twns.MapEditor.OpenDataForMeChooseTileBasePanel>;
        MeChooseTileDecoratorPanel          : PanelConfig<Twns.MapEditor.OpenDataForMeChooseTileDecoratorPanel>;
        MeChooseTileObjectPanel             : PanelConfig<Twns.MapEditor.OpenDataForMeChooseTileObjectPanel>;
        MeChooseUnitPanel                   : PanelConfig<Twns.MapEditor.OpenDataForMeChooseUnitPanel>;
        MeClearPanel                        : PanelConfig<Twns.MapEditor.OpenDataForMeClearPanel>;
        MeConfirmSaveMapPanel               : PanelConfig<Twns.MapEditor.OpenDataForMeConfirmSaveMapPanel>;
        MeImportPanel                       : PanelConfig<Twns.MapEditor.OpenDataForMeImportPanel>;
        MeMapListPanel                      : PanelConfig<Twns.MapEditor.OpenDataForMeMapListPanel>;
        MeMapTagPanel                       : PanelConfig<Twns.MapEditor.OpenDataForMeMapTagPanel>;
        MeMfwSettingsPanel                  : PanelConfig<Twns.MapEditor.OpenDataForMeMfwSettingsPanel>;
        MeModifyMapDescPanel                : PanelConfig<Twns.MapEditor.OpenDataForMeModifyMapDescPanel>;
        MeModifyMapNamePanel                : PanelConfig<Twns.MapEditor.OpenDataForMeModifyMapNamePanel>;
        MeResizePanel                       : PanelConfig<Twns.MapEditor.OpenDataForMeResizePanel>;
        MeSimSettingsPanel                  : PanelConfig<Twns.MapEditor.OpenDataForMeSimSettingsPanel>;
        MeSymmetryPanel                     : PanelConfig<Twns.MapEditor.OpenDataForMeSymmetryPanel>;
        MeTopPanel                          : PanelConfig<Twns.MapEditor.OpenDataForMeTopPanel>;
        MeVisibilityPanel                   : PanelConfig<Twns.MapEditor.OpenDataForMeVisibilityPanel>;
        MeWarMenuPanel                      : PanelConfig<Twns.MapEditor.OpenDataForMeWarMenuPanel>;
        MeWarRulePanel                      : PanelConfig<Twns.MapEditor.OpenDataForMeWarRulePanel>;
        MeChooseLocationPanel               : PanelConfig<Twns.MapEditor.OpenDataForMeChooseLocationPanel>;

        MfrCreateSettingsPanel              : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrCreateSettingsPanel>;
        MfrJoinRoomListPanel                : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrJoinRoomListPanel>;
        MfrMainMenuPanel                    : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrMainMenuPanel>;
        MfrMyRoomListPanel                  : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrMyRoomListPanel>;
        MfrRoomInfoPanel                    : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrRoomInfoPanel>;
        MfrSearchRoomPanel                  : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrSearchRoomPanel>;

        MfwMyWarListPanel                   : PanelConfig<Twns.MultiFreeWar.OpenDataForMfwMyWarListPanel>;

        MmAcceptMapPanel                    : PanelConfig<Twns.MapManagement.OpenDataForMmAcceptMapPanel>;
        MmAvailabilityListPanel             : PanelConfig<Twns.MapManagement.OpenDataForMmAvailabilityListPanel>;
        MmAvailabilitySearchPanel           : PanelConfig<Twns.MapManagement.OpenDataForMmAvailabilitySearchPanel>;
        MmCommandPanel                      : PanelConfig<Twns.MapManagement.OpenDataForMmCommandPanel>;
        MmMainMenuPanel                     : PanelConfig<Twns.MapManagement.OpenDataForMmMainMenuPanel>;
        MmMapRenamePanel                    : PanelConfig<Twns.MapManagement.OpenDataForMmMapRenamePanel>;
        MmRejectMapPanel                    : PanelConfig<Twns.MapManagement.OpenDataForMmRejectMapPanel>;
        MmReviewListPanel                   : PanelConfig<Twns.MapManagement.OpenDataForMmReviewListPanel>;
        MmSetWarRuleAvailabilityPanel       : PanelConfig<Twns.MapManagement.OpenDataForMmSetWarRuleAvailabilityPanel>;
        MmTagChangePanel                    : PanelConfig<Twns.MapManagement.OpenDataForMmTagChangePanel>;
        MmTagListPanel                      : PanelConfig<Twns.MapManagement.OpenDataForMmTagListPanel>;
        MmTagSearchPanel                    : PanelConfig<Twns.MapManagement.OpenDataForMmTagSearchPanel>;
        MmWarRuleAvailableCoPanel           : PanelConfig<Twns.MapManagement.OpenDataForMmWarRuleAvailableCoPanel>;
        MmWarRulePanel                      : PanelConfig<Twns.MapManagement.OpenDataForMmWarRulePanel>;

        MpwSpectatePanel                    : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwSpectatePanel>;
        MpwSidePanel                        : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwSidePanel>;
        MpwTopPanel                         : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwTopPanel>;
        MpwWarMenuPanel                     : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwWarMenuPanel>;

        MrrMainMenuPanel                    : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrMainMenuPanel>;
        MrrMyRoomListPanel                  : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrMyRoomListPanel>;
        MrrPreviewMapListPanel              : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrPreviewMapListPanel>;
        MrrRoomInfoPanel                    : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrRoomInfoPanel>;
        MrrSetMaxConcurrentCountPanel       : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrSetMaxConcurrentCountPanel>;

        MrwMyWarListPanel                   : PanelConfig<Twns.MultiRankWar.OpenDataForMrwMyWarListPanel>;

        RwReplayListPanel                   : PanelConfig<Twns.ReplayWar.OpenDataForRwReplayListPanel>;
        RwReplayProgressPanel               : PanelConfig<Twns.ReplayWar.OpenDataForRwReplayProgressPanel>;
        RwSearchReplayPanel                 : PanelConfig<Twns.ReplayWar.OpenDataForRwSearchReplayPanel>;
        RwTopPanel                          : PanelConfig<Twns.ReplayWar.OpenDataForRwTopPanel>;
        RwWarMenuPanel                      : PanelConfig<Twns.ReplayWar.OpenDataForRwWarMenuPanel>;

        ScrCreateMapListPanel               : PanelConfig<Twns.SingleCustomRoom.OpenDataForScrCreateMapListPanel>;
        ScrCreateSearchMapPanel             : PanelConfig<Twns.SingleCustomRoom.OpenDataForScrCreateSearchMapPanel>;
        ScrCreateSettingsPanel              : PanelConfig<Twns.SingleCustomRoom.OpenDataForScrCreateSettingsPanel>;

        SpmCreateSaveSlotsPanel             : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmCreateSaveSlotsPanel>;
        SpmCreateSfwSaveSlotsPanel          : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmCreateSfwSaveSlotsPanel>;
        SpmMainMenuPanel                    : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmMainMenuPanel>;
        SpmWarListPanel                     : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmWarListPanel>;

        SpwLoadWarPanel                     : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwLoadWarPanel>;
        SpwSidePanel                        : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwSidePanel>;
        SpwTopPanel                         : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwTopPanel>;
        SpwWarMenuPanel                     : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwWarMenuPanel>;

        SrrCreateMapListPanel               : PanelConfig<Twns.SingleRankRoom.OpenDataForSrrCreateMapListPanel>;
        SrrCreateSettingsPanel              : PanelConfig<Twns.SingleRankRoom.OpenDataForSrrCreateSettingsPanel>;

        UserChangeDiscordIdPanel            : PanelConfig<Twns.User.OpenDataForUserChangeDiscordIdPanel>;
        UserChangeNicknamePanel             : PanelConfig<Twns.User.OpenDataForUserChangeNicknamePanel>;
        UserGameManagementPanel             : PanelConfig<Twns.User.OpenDataForUserGameManagementPanel>;
        UserLoginBackgroundPanel            : PanelConfig<Twns.User.OpenDataForUserLoginBackgroundPanel>;
        UserLoginPanel                      : PanelConfig<Twns.User.OpenDataForUserLoginPanel>;
        UserOnlineUsersPanel                : PanelConfig<Twns.User.OpenDataForUserOnlineUsersPanel>;
        UserPanel                           : PanelConfig<Twns.User.OpenDataForUserPanel>;
        UserRegisterPanel                   : PanelConfig<Twns.User.OpenDataForUserRegisterPanel>;
        UserSetAvatarPanel                  : PanelConfig<Twns.User.OpenDataForUserSetAvatarPanel>;
        UserSetOpacityPanel                 : PanelConfig<Twns.User.OpenDataForUserSetOpacityPanel>;
        UserSetPasswordPanel                : PanelConfig<Twns.User.OpenDataForUserSetPasswordPanel>;
        UserSetPrivilegePanel               : PanelConfig<Twns.User.OpenDataForUserSetPrivilegePanel>;
        UserSetSoundPanel                   : PanelConfig<Twns.User.OpenDataForUserSetSoundPanel>;
        UserSetStageScalePanel              : PanelConfig<Twns.User.OpenDataForUserSetStageScalePanel>;
        UserSettingsPanel                   : PanelConfig<Twns.User.OpenDataForUserSettingsPanel>;

        WeActionAddUnitListPanel            : PanelConfig<Twns.WarEvent.OpenDataForWeActionAddUnitListPanel>;
        WeActionModifyPanel1                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel1>;
        WeActionModifyPanel2                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel2>;
        WeActionModifyPanel3                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel3>;
        WeActionModifyPanel4                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel4>;
        WeActionModifyPanel5                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel5>;
        WeActionModifyPanel6                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel6>;
        WeActionModifyPanel7                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel7>;
        WeActionModifyPanel10               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel10>;
        WeActionModifyPanel11               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel11>;
        WeActionModifyPanel20               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel20>;
        WeActionModifyPanel21               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel21>;
        WeActionModifyPanel22               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel22>;
        WeActionModifyPanel23               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel23>;
        WeActionModifyPanel24               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel24>;
        WeActionModifyPanel25               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel25>;
        WeActionModifyPanel30               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel30>;
        WeActionModifyPanel40               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel40>;
        WeActionModifyPanel41               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel41>;
        WeActionModifyPanel50               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel50>;
        WeActionReplacePanel                : PanelConfig<Twns.WarEvent.OpenDataForWeActionReplacePanel>;
        WeActionTypeListPanel               : PanelConfig<Twns.WarEvent.OpenDataForWeActionTypeListPanel>;
        WeCommandPanel                      : PanelConfig<Twns.WarEvent.OpenDataForWeCommandPanel>;
        WeConditionModifyPanel1             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel1>;
        WeConditionModifyPanel2             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel2>;
        WeConditionModifyPanel3             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel3>;
        WeConditionModifyPanel4             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel4>;
        WeConditionModifyPanel5             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel5>;
        WeConditionModifyPanel6             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel6>;
        WeConditionModifyPanel10            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel10>;
        WeConditionModifyPanel11            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel11>;
        WeConditionModifyPanel12            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel12>;
        WeConditionModifyPanel13            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel13>;
        WeConditionModifyPanel14            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel14>;
        WeConditionModifyPanel20            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel20>;
        WeConditionModifyPanel21            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel21>;
        WeConditionModifyPanel22            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel22>;
        WeConditionModifyPanel23            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel23>;
        WeConditionModifyPanel30            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel30>;
        WeConditionModifyPanel31            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel31>;
        WeConditionModifyPanel32            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel32>;
        WeConditionModifyPanel40            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel40>;
        WeConditionModifyPanel50            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel50>;
        WeConditionModifyPanel60            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionModifyPanel60>;
        WeConditionReplacePanel             : PanelConfig<Twns.WarEvent.OpenDataForWeConditionReplacePanel>;
        WeConditionTypeListPanel            : PanelConfig<Twns.WarEvent.OpenDataForWeConditionTypeListPanel>;
        WeDialogueBackgroundPanel           : PanelConfig<Twns.WarEvent.OpenDataForWeDialogueBackgroundPanel>;
        WeEventListPanel                    : PanelConfig<Twns.WarEvent.OpenDataForWeEventListPanel>;
        WeEventRenamePanel                  : PanelConfig<Twns.WarEvent.OpenDataForWeEventRenamePanel>;
        WeNodeReplacePanel                  : PanelConfig<Twns.WarEvent.OpenDataForWeNodeReplacePanel>;

        WarMapBuildingListPanel             : PanelConfig<Twns.WarMap.OpenDataForWarMapBuildingListPanel>;

        WwDeleteWatcherDetailPanel          : PanelConfig<Twns.WatchWar.OpenDataForWwDeleteWatcherDetailPanel>;
        WwDeleteWatcherWarsPanel            : PanelConfig<Twns.WatchWar.OpenDataForWwDeleteWatcherWarsPanel>;
        WwHandleRequestDetailPanel          : PanelConfig<Twns.WatchWar.OpenDataForWwHandleRequestDetailPanel>;
        WwHandleRequestWarsPanel            : PanelConfig<Twns.WatchWar.OpenDataForWwHandleRequestWarsPanel>;
        WwMainMenuPanel                     : PanelConfig<Twns.WatchWar.OpenDataForWatchWarMainMenuPanel>;
        WwMakeRequestDetailPanel            : PanelConfig<Twns.WatchWar.OpenDataForWwMakeRequestDetailPanel>;
        WwMakeRequestWarsPanel              : PanelConfig<Twns.WatchWar.OpenDataForWwMakeRequestWarsPanel>;
        WwOngoingWarsPanel                  : PanelConfig<Twns.WatchWar.OpenDataForWwOngoingWarsPanel>;
        WwSearchWarPanel                    : PanelConfig<Twns.WatchWar.OpenDataForWwSearchWarPanel>;
    };

    export function initPanelDict(): void {
        PanelDict = {
            BwBackgroundPanel: {
                cls         : Twns.BaseWar?.BwBackgroundPanel,
                skinName    : `resource/skins/baseWar/BwBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
                needCache   : true,
            },

            BwBeginTurnPanel: {
                cls         : Twns.BaseWar?.BwBeginTurnPanel,
                skinName    : `resource/skins/baseWar/BwBeginTurnPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            BwCaptureProgressPanel: {
                cls         : Twns.BaseWar?.BwCaptureProgressPanel,
                skinName    : `resource/skins/baseWar/BwCaptureProgressPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            BwDamagePreviewPanel: {
                cls         : Twns.BaseWar?.BwDamagePreviewPanel,
                skinName    : `resource/skins/baseWar/BwDamagePreviewPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwDialoguePanel: {
                cls         : Twns.BaseWar?.BwDialoguePanel,
                skinName    : `resource/skins/baseWar/BwDialoguePanel.exml`,
                layer       : LayerType.Hud1,
            },

            BwProduceUnitPanel: {
                cls         : Twns.BaseWar?.BwProduceUnitPanel,
                skinName    : `resource/skins/baseWar/BwProduceUnitPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwSimpleDialoguePanel: {
                cls         : Twns.BaseWar?.BwSimpleDialoguePanel,
                skinName    : `resource/skins/baseWar/BwSimpleDialoguePanel.exml`,
                layer       : LayerType.Hud1,
            },

            BwTileBriefPanel: {
                cls         : Twns.BaseWar?.BwTileBriefPanel,
                skinName    : `resource/skins/baseWar/BwTileBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwTileDetailPanel: {
                cls         : Twns.BaseWar?.BwTileDetailPanel,
                skinName    : `resource/skins/baseWar/BwTileDetailPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitActionsPanel: {
                cls         : Twns.BaseWar?.BwUnitActionsPanel,
                skinName    : `resource/skins/baseWar/BwUnitActionsPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitBriefPanel: {
                cls         : Twns.BaseWar?.BwUnitBriefPanel,
                skinName    : `resource/skins/baseWar/BwUnitBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitDetailPanel: {
                cls         : Twns.BaseWar?.BwUnitDetailPanel,
                skinName    : `resource/skins/baseWar/BwUnitDetailPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitListPanel: {
                cls         : Twns.BaseWar?.BwUnitListPanel,
                skinName    : `resource/skins/baseWar/BwUnitListPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwWarInfoPanel: {
                cls         : Twns.BaseWar?.BwWarInfoPanel,
                skinName    : `resource/skins/baseWar/BwWarInfoPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwWarPanel: {
                cls         : Twns.BaseWar?.BwWarPanel,
                skinName    : `resource/skins/baseWar/BwWarPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            BroadcastAddMessagePanel: {
                cls         : Twns.Broadcast?.BroadcastAddMessagePanel,
                skinName    : `resource/skins/broadcast/BroadcastAddMessagePanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastMessageListPanel: {
                cls         : Twns.Broadcast?.BroadcastMessageListPanel,
                skinName    : `resource/skins/broadcast/BroadcastMessageListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastPanel: {
                cls         : Twns.Broadcast?.BroadcastPanel,
                skinName    : `resource/skins/broadcast/BroadcastPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChangeLogAddPanel: {
                cls         : Twns.ChangeLog?.ChangeLogAddPanel,
                skinName    : `resource/skins/changeLog/ChangeLogAddPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogModifyPanel: {
                cls         : Twns.ChangeLog?.ChangeLogModifyPanel,
                skinName    : `resource/skins/changeLog/ChangeLogModifyPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogPanel: {
                cls         : Twns.ChangeLog?.ChangeLogPanel,
                skinName    : `resource/skins/changeLog/ChangeLogPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcrCreateMapListPanel: {
                cls         : Twns.CoopCustomRoom?.CcrCreateMapListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrCreateSearchMapPanel: {
                cls         : Twns.CoopCustomRoom?.CcrCreateSearchMapPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateSearchMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CcrCreateSettingsPanel: {
                cls         : Twns.CoopCustomRoom?.CcrCreateSettingsPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrJoinRoomListPanel: {
                cls         : Twns.CoopCustomRoom?.CcrJoinRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMainMenuPanel: {
                cls         : Twns.CoopCustomRoom?.CcrMainMenuPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMyRoomListPanel: {
                cls         : Twns.CoopCustomRoom?.CcrMyRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrRoomInfoPanel: {
                cls         : Twns.CoopCustomRoom?.CcrRoomInfoPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrSearchRoomPanel: {
                cls         : Twns.CoopCustomRoom?.CcrSearchRoomPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcwMyWarListPanel: {
                cls         : Twns.CoopCustomWar?.CcwMyWarListPanel,
                skinName    : `resource/skins/coopCustomWar/CcwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChatCommandPanel: {
                cls         : Twns.Chat?.ChatCommandPanel,
                skinName    : `resource/skins/chat/ChatCommandPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : false,
            },
            ChatPanel: {
                cls         : Twns.Chat?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CommonAddLoadedUnitPanel: {
                cls         : Twns.Common?.CommonAddLoadedUnitPanel,
                skinName    : `resource/skins/common/CommonAddLoadedUnitPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonAlertPanel: {
                cls         : Twns.Common?.CommonAlertPanel,
                skinName    : `resource/skins/common/CommonAlertPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonBanCoPanel: {
                cls         : Twns.Common?.CommonBanCoPanel,
                skinName    : `resource/skins/common/CommonBanCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonBlockPanel: {
                cls         : Twns.Common?.CommonBlockPanel,
                skinName    : `resource/skins/common/CommonBlockPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonChangeVersionPanel: {
                cls         : Twns.Common?.CommonChangeVersionPanel,
                skinName    : `resource/skins/common/CommonChangeVersionPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoCategoryIdPanel: {
                cls         : Twns.Common?.CommonChooseCoCategoryIdPanel,
                skinName    : `resource/skins/common/CommonChooseCoCategoryIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoPanel: {
                cls         : Twns.Common?.CommonChooseCoPanel,
                skinName    : `resource/skins/common/CommonChooseCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoSkillTypePanel: {
                cls         : Twns.Common?.CommonChooseCoSkillTypePanel,
                skinName    : `resource/skins/common/CommonChooseCoSkillTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCustomCounterIdPanel: {
                cls         : Twns.Common?.CommonChooseCustomCounterIdPanel,
                skinName    : `resource/skins/common/CommonChooseCustomCounterIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseGridIndexPanel: {
                cls         : Twns.Common?.CommonChooseGridIndexPanel,
                skinName    : `resource/skins/common/CommonChooseGridIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseLocationPanel: {
                cls         : Twns.Common?.CommonChooseLocationPanel,
                skinName    : `resource/skins/common/CommonChooseLocationPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerAliveStatePanel: {
                cls         : Twns.Common?.CommonChoosePlayerAliveStatePanel,
                skinName    : `resource/skins/common/CommonChoosePlayerAliveStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerIndexPanel: {
                cls         : Twns.Common?.CommonChoosePlayerIndexPanel,
                skinName    : `resource/skins/common/CommonChoosePlayerIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleTileTypePanel: {
                cls         : Twns.Common?.CommonChooseSingleTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleUnitTypePanel: {
                cls         : Twns.Common?.CommonChooseSingleUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTeamIndexPanel: {
                cls         : Twns.Common?.CommonChooseTeamIndexPanel,
                skinName    : `resource/skins/common/CommonChooseTeamIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileBasePanel: {
                cls         : Twns.Common?.CommonChooseTileBasePanel,
                skinName    : `resource/skins/common/CommonChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileDecoratorPanel: {
                cls         : Twns.Common?.CommonChooseTileDecoratorPanel,
                skinName    : `resource/skins/common/CommonChooseTileDecoratorPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileObjectPanel: {
                cls         : Twns.Common?.CommonChooseTileObjectPanel,
                skinName    : `resource/skins/common/CommonChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileTypePanel: {
                cls         : Twns.Common?.CommonChooseTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitActionStatePanel: {
                cls         : Twns.Common?.CommonChooseUnitActionStatePanel,
                skinName    : `resource/skins/common/CommonChooseUnitActionStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitTypePanel: {
                cls         : Twns.Common?.CommonChooseUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventActionIdPanel: {
                cls         : Twns.Common?.CommonChooseWarEventActionIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventActionIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventIdPanel: {
                cls         : Twns.Common?.CommonChooseWarEventIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWeatherTypePanel: {
                cls         : Twns.Common?.CommonChooseWeatherTypePanel,
                skinName    : `resource/skins/common/CommonChooseWeatherTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoInfoPanel: {
                cls         : Twns.Common?.CommonCoInfoPanel,
                skinName    : `resource/skins/common/CommonCoInfoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoListPanel: {
                cls         : Twns.Common?.CommonCoListPanel,
                skinName    : `resource/skins/common/CommonCoListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonConfirmPanel: {
                cls         : Twns.Common?.CommonConfirmPanel,
                skinName    : `resource/skins/common/CommonConfirmPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonDamageCalculatorPanel: {
                cls         : Twns.Common?.CommonDamageCalculatorPanel,
                skinName    : `resource/skins/common/CommonDamageCalculatorPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonDamageChartPanel: {
                cls         : Twns.Common?.CommonDamageChartPanel,
                skinName    : `resource/skins/common/CommonDamageChartPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonErrorPanel: {
                cls         : Twns.Common?.CommonErrorPanel,
                skinName    : `resource/skins/common/CommonErrorPanel.exml`,
                layer       : LayerType.Top,
            },

            CommonHelpPanel: {
                cls         : Twns.Common?.CommonHelpPanel,
                skinName    : `resource/skins/common/CommonHelpPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonInputPanel: {
                cls         : Twns.Common?.CommonInputPanel,
                skinName    : `resource/skins/common/CommonInputPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonInputIntegerPanel: {
                cls         : Twns.Common?.CommonInputIntegerPanel,
                skinName    : `resource/skins/common/CommonInputIntegerPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonJoinRoomPasswordPanel: {
                cls         : Twns.Common?.CommonJoinRoomPasswordPanel,
                skinName    : `resource/skins/common/CommonJoinRoomPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonMapWarStatisticsPanel: {
                cls         : Twns.Common?.CommonMapWarStatisticsPanel,
                skinName    : `resource/skins/common/CommonMapWarStatisticsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonModifyWarRuleNamePanel: {
                cls         : Twns.Common?.CommonModifyWarRuleNamePanel,
                skinName    : `resource/skins/common/CommonModifyWarRuleNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonRankListPanel: {
                cls         : Twns.Common?.CommonRankListPanel,
                skinName    : `resource/skins/common/CommonRankListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonServerStatusPanel: {
                cls         : Twns.Common?.CommonServerStatusPanel,
                skinName    : `resource/skins/common/CommonServerStatusPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonWarEventListPanel: {
                cls         : Twns.Common?.CommonWarEventListPanel,
                skinName    : `resource/skins/common/CommonWarEventListPanel.exml`,
                layer       : LayerType.Hud1,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            HrwReplayProgressPanel: {
                cls         : Twns.HalfwayReplayWar?.HrwReplayProgressPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwReplayProgressPanel.exml`,
                layer       : LayerType.Hud0,
            },

            HrwTopPanel: {
                cls         : Twns.HalfwayReplayWar?.HrwTopPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            HrwWarMenuPanel: {
                cls         : Twns.HalfwayReplayWar?.HrwWarMenuPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            LobbyBackgroundPanel: {
                cls         : Twns.Lobby?.LobbyBackgroundPanel,
                skinName    : `resource/skins/lobby/LobbyBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                needCache   : true,
            },

            LobbyBottomPanel: {
                cls         : Twns.Lobby?.LobbyBottomPanel,
                skinName    : `resource/skins/lobby/LobbyBottomPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            LobbyPanel: {
                cls         : Twns.Lobby?.LobbyPanel,
                skinName    : `resource/skins/lobby/LobbyPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
                needCache   : true,
            },

            LobbyTopPanel: {
                cls         : Twns.Lobby?.LobbyTopPanel,
                skinName    : `resource/skins/lobby/LobbyTopPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            LobbyTopRightPanel: {
                cls         : Twns.Lobby?.LobbyTopRightPanel,
                skinName    : `resource/skins/lobby/LobbyTopRightPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            McrCreateMapListPanel: {
                cls         : Twns.MultiCustomRoom?.McrCreateMapListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrCreateSearchMapPanel: {
                cls         : Twns.MultiCustomRoom?.McrCreateSearchMapPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateSearchMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            McrCreateSettingsPanel: {
                cls         : Twns.MultiCustomRoom?.McrCreateSettingsPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrJoinRoomListPanel: {
                cls         : Twns.MultiCustomRoom?.McrJoinRoomListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMainMenuPanel: {
                cls         : Twns.MultiCustomRoom?.McrMainMenuPanel,
                skinName    : `resource/skins/multiCustomRoom/McrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMyRoomListPanel: {
                cls         : Twns.MultiCustomRoom?.McrMyRoomListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrRoomInfoPanel: {
                cls         : Twns.MultiCustomRoom?.McrRoomInfoPanel,
                skinName    : `resource/skins/multiCustomRoom/McrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrSearchRoomPanel: {
                cls         : Twns.MultiCustomRoom?.McrSearchRoomPanel,
                skinName    : `resource/skins/multiCustomRoom/McrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            McwMyWarListPanel: {
                cls         : Twns.MultiCustomWar?.McwMyWarListPanel,
                skinName    : `resource/skins/multiCustomWar/McwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MeAddWarEventToRulePanel: {
                cls         : Twns.MapEditor?.MeAddWarEventToRulePanel,
                skinName    : `resource/skins/mapEditor/MeAddWarEventToRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeAvailableCoPanel: {
                cls         : Twns.MapEditor?.MeAvailableCoPanel,
                skinName    : `resource/skins/mapEditor/MeAvailableCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseTileBasePanel: {
                cls         : Twns.MapEditor?.MeChooseTileBasePanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileDecoratorPanel: {
                cls         : Twns.MapEditor?.MeChooseTileDecoratorPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileDecoratorPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileObjectPanel: {
                cls         : Twns.MapEditor?.MeChooseTileObjectPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseUnitPanel: {
                cls         : Twns.MapEditor?.MeChooseUnitPanel,
                skinName    : `resource/skins/mapEditor/MeChooseUnitPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeClearPanel: {
                cls         : Twns.MapEditor?.MeClearPanel,
                skinName    : `resource/skins/mapEditor/MeClearPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeConfirmSaveMapPanel: {
                cls         : Twns.MapEditor?.MeConfirmSaveMapPanel,
                skinName    : `resource/skins/mapEditor/MeConfirmSaveMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeImportPanel: {
                cls         : Twns.MapEditor?.MeImportPanel,
                skinName    : `resource/skins/mapEditor/MeImportPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeMapListPanel: {
                cls         : Twns.MapEditor?.MeMapListPanel,
                skinName    : `resource/skins/mapEditor/MeMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MeMapTagPanel: {
                cls         : Twns.MapEditor?.MeMapTagPanel,
                skinName    : `resource/skins/mapEditor/MeMapTagPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeMfwSettingsPanel: {
                cls         : Twns.MapEditor?.MeMfwSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeMfwSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyMapDescPanel: {
                cls         : Twns.MapEditor?.MeModifyMapDescPanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapDescPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyMapNamePanel: {
                cls         : Twns.MapEditor?.MeModifyMapNamePanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeResizePanel: {
                cls         : Twns.MapEditor?.MeResizePanel,
                skinName    : `resource/skins/mapEditor/MeResizePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSimSettingsPanel: {
                cls         : Twns.MapEditor?.MeSimSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeSimSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSymmetryPanel: {
                cls         : Twns.MapEditor?.MeSymmetryPanel,
                skinName    : `resource/skins/mapEditor/MeSymmetryPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeTopPanel: {
                cls         : Twns.MapEditor?.MeTopPanel,
                skinName    : `resource/skins/mapEditor/MeTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeVisibilityPanel: {
                cls         : Twns.MapEditor?.MeVisibilityPanel,
                skinName    : `resource/skins/mapEditor/MeVisibilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarMenuPanel: {
                cls         : Twns.MapEditor?.MeWarMenuPanel,
                skinName    : `resource/skins/mapEditor/MeWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarRulePanel: {
                cls         : Twns.MapEditor?.MeWarRulePanel,
                skinName    : `resource/skins/mapEditor/MeWarRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseLocationPanel: {
                cls         : Twns.MapEditor?.MeChooseLocationPanel,
                skinName    : `resource/skins/mapEditor/MeChooseLocationPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MfrCreateSettingsPanel: {
                cls         : Twns.MultiFreeRoom?.MfrCreateSettingsPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrJoinRoomListPanel: {
                cls         : Twns.MultiFreeRoom?.MfrJoinRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMainMenuPanel: {
                cls         : Twns.MultiFreeRoom?.MfrMainMenuPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMyRoomListPanel: {
                cls         : Twns.MultiFreeRoom?.MfrMyRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrRoomInfoPanel: {
                cls         : Twns.MultiFreeRoom?.MfrRoomInfoPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrSearchRoomPanel: {
                cls         : Twns.MultiFreeRoom?.MfrSearchRoomPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrSearchRoomPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MfwMyWarListPanel: {
                cls         : Twns.MultiFreeWar?.MfwMyWarListPanel,
                skinName    : `resource/skins/multiFreeWar/MfwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MmAcceptMapPanel: {
                cls         : Twns.MapManagement?.MmAcceptMapPanel,
                skinName    : `resource/skins/mapManagement/MmAcceptMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmAvailabilityListPanel: {
                cls         : Twns.MapManagement?.MmAvailabilityListPanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilityListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmAvailabilitySearchPanel: {
                cls         : Twns.MapManagement?.MmAvailabilitySearchPanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilitySearchPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmCommandPanel: {
                cls         : Twns.MapManagement?.MmCommandPanel,
                skinName    : `resource/skins/mapManagement/MmCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmMainMenuPanel: {
                cls         : Twns.MapManagement?.MmMainMenuPanel,
                skinName    : `resource/skins/mapManagement/MmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmMapRenamePanel: {
                cls         : Twns.MapManagement?.MmMapRenamePanel,
                skinName    : `resource/skins/mapManagement/MmMapRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmRejectMapPanel: {
                cls         : Twns.MapManagement?.MmRejectMapPanel,
                skinName    : `resource/skins/mapManagement/MmRejectMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmReviewListPanel: {
                cls         : Twns.MapManagement?.MmReviewListPanel,
                skinName    : `resource/skins/mapManagement/MmReviewListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmSetWarRuleAvailabilityPanel: {
                cls         : Twns.MapManagement?.MmSetWarRuleAvailabilityPanel,
                skinName    : `resource/skins/mapManagement/MmSetWarRuleAvailabilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmTagChangePanel: {
                cls         : Twns.MapManagement?.MmTagChangePanel,
                skinName    : `resource/skins/mapManagement/MmTagChangePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmTagListPanel: {
                cls         : Twns.MapManagement?.MmTagListPanel,
                skinName    : `resource/skins/mapManagement/MmTagListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmTagSearchPanel: {
                cls         : Twns.MapManagement?.MmTagSearchPanel,
                skinName    : `resource/skins/mapManagement/MmTagSearchPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmWarRuleAvailableCoPanel: {
                cls         : Twns.MapManagement?.MmWarRuleAvailableCoPanel,
                skinName    : `resource/skins/mapManagement/MmWarRuleAvailableCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmWarRulePanel: {
                cls         : Twns.MapManagement?.MmWarRulePanel,
                skinName    : `resource/skins/mapManagement/MmWarRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MpwSpectatePanel: {
                cls         : Twns.MultiPlayerWar?.MpwSpectatePanel,
                skinName    : `resource/skins/multiPlayerWar/MpwSpectatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwSidePanel: {
                cls         : Twns.MultiPlayerWar?.MpwSidePanel,
                skinName    : `resource/skins/multiPlayerWar/MpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwTopPanel: {
                cls         : Twns.MultiPlayerWar?.MpwTopPanel,
                skinName    : `resource/skins/multiPlayerWar/MpwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwWarMenuPanel: {
                cls         : Twns.MultiPlayerWar?.MpwWarMenuPanel,
                skinName    : `resource/skins/multiPlayerWar/MpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MrrMainMenuPanel: {
                cls         : Twns.MultiRankRoom?.MrrMainMenuPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrMyRoomListPanel: {
                cls         : Twns.MultiRankRoom?.MrrMyRoomListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrPreviewMapListPanel: {
                cls         : Twns.MultiRankRoom?.MrrPreviewMapListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrRoomInfoPanel: {
                cls         : Twns.MultiRankRoom?.MrrRoomInfoPanel,
                skinName    : `resource/skins/multiRankRoom/MrrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrSetMaxConcurrentCountPanel: {
                cls         : Twns.MultiRankRoom?.MrrSetMaxConcurrentCountPanel,
                skinName    : `resource/skins/multiRankRoom/MrrSetMaxConcurrentCountPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MrwMyWarListPanel: {
                cls         : Twns.MultiRankWar?.MrwMyWarListPanel,
                skinName    : `resource/skins/multiRankWar/MrwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            RwReplayListPanel: {
                cls         : Twns.ReplayWar?.RwReplayListPanel,
                skinName    : `resource/skins/replayWar/RwReplayListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            RwReplayProgressPanel: {
                cls         : Twns.ReplayWar?.RwReplayProgressPanel,
                skinName    : `resource/skins/replayWar/RwReplayProgressPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwSearchReplayPanel: {
                cls         : Twns.ReplayWar?.RwSearchReplayPanel,
                skinName    : `resource/skins/replayWar/RwSearchReplayPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwTopPanel: {
                cls         : Twns.ReplayWar?.RwTopPanel,
                skinName    : `resource/skins/replayWar/RwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwWarMenuPanel: {
                cls         : Twns.ReplayWar?.RwWarMenuPanel,
                skinName    : `resource/skins/replayWar/RwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ScrCreateMapListPanel: {
                cls         : Twns.SingleCustomRoom?.ScrCreateMapListPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ScrCreateSearchMapPanel: {
                cls         : Twns.SingleCustomRoom?.ScrCreateSearchMapPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSearchMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ScrCreateSettingsPanel: {
                cls         : Twns.SingleCustomRoom?.ScrCreateSettingsPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SpmCreateSaveSlotsPanel: {
                cls         : Twns.SinglePlayerMode?.SpmCreateSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmCreateSfwSaveSlotsPanel: {
                cls         : Twns.SinglePlayerMode?.SpmCreateSfwSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSfwSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmMainMenuPanel: {
                cls         : Twns.SinglePlayerMode?.SpmMainMenuPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SpmWarListPanel: {
                cls         : Twns.SinglePlayerMode?.SpmWarListPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SpwLoadWarPanel: {
                cls         : Twns.SinglePlayerWar?.SpwLoadWarPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwLoadWarPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwSidePanel: {
                cls         : Twns.SinglePlayerWar?.SpwSidePanel,
                skinName    : `resource/skins/singlePlayerWar/SpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwTopPanel: {
                cls         : Twns.SinglePlayerWar?.SpwTopPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwWarMenuPanel: {
                cls         : Twns.SinglePlayerWar?.SpwWarMenuPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SrrCreateMapListPanel: {
                cls         : Twns.SingleRankRoom?.SrrCreateMapListPanel,
                skinName    : `resource/skins/singleRankRoom/SrrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SrrCreateSettingsPanel: {
                cls         : Twns.SingleRankRoom?.SrrCreateSettingsPanel,
                skinName    : `resource/skins/singleRankRoom/SrrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            UserChangeDiscordIdPanel: {
                cls         : Twns.User?.UserChangeDiscordIdPanel,
                skinName    : `resource/skins/user/UserChangeDiscordIdPanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserChangeNicknamePanel: {
                cls         : Twns.User?.UserChangeNicknamePanel,
                skinName    : `resource/skins/user/UserChangeNicknamePanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserGameManagementPanel: {
                cls         : Twns.User?.UserGameManagementPanel,
                skinName    : `resource/skins/user/UserGameManagementPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserLoginBackgroundPanel: {
                cls         : Twns.User?.UserLoginBackgroundPanel,
                skinName    : `resource/skins/user/UserLoginBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
            },

            UserLoginPanel: {
                cls         : Twns.User?.UserLoginPanel,
                skinName    : `resource/skins/user/UserLoginPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserOnlineUsersPanel: {
                cls         : Twns.User?.UserOnlineUsersPanel,
                skinName    : `resource/skins/user/UserOnlineUsersPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserPanel: {
                cls         : Twns.User?.UserPanel,
                skinName    : `resource/skins/user/UserPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserRegisterPanel: {
                cls         : Twns.User?.UserRegisterPanel,
                skinName    : `resource/skins/user/UserRegisterPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetAvatarPanel: {
                cls         : Twns.User?.UserSetAvatarPanel,
                skinName    : `resource/skins/user/UserSetAvatarPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetPasswordPanel: {
                cls         : Twns.User?.UserSetPasswordPanel,
                skinName    : `resource/skins/user/UserSetPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetPrivilegePanel: {
                cls         : Twns.User?.UserSetPrivilegePanel,
                skinName    : `resource/skins/user/UserSetPrivilegePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetSoundPanel: {
                cls         : Twns.User?.UserSetSoundPanel,
                skinName    : `resource/skins/user/UserSetSoundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetOpacityPanel: {
                cls         : Twns.User?.UserSetOpacityPanel,
                skinName    : `resource/skins/user/UserSetOpacityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetStageScalePanel: {
                cls         : Twns.User?.UserSetStageScalePanel,
                skinName    : `resource/skins/user/UserSetStageScalePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSettingsPanel: {
                cls         : Twns.User?.UserSettingsPanel,
                skinName    : `resource/skins/user/UserSettingsPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WeActionAddUnitListPanel: {
                cls         : Twns.WarEvent?.WeActionAddUnitListPanel,
                skinName    : `resource/skins/warEvent/WeActionAddUnitListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel1: {
                cls         : Twns.WarEvent?.WeActionModifyPanel1,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel1.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel2: {
                cls         : Twns.WarEvent?.WeActionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel3: {
                cls         : Twns.WarEvent?.WeActionModifyPanel3,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel3.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel4: {
                cls         : Twns.WarEvent?.WeActionModifyPanel4,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel4.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel5: {
                cls         : Twns.WarEvent?.WeActionModifyPanel5,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel5.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel6: {
                cls         : Twns.WarEvent?.WeActionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel7: {
                cls         : Twns.WarEvent?.WeActionModifyPanel7,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel7.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel10: {
                cls         : Twns.WarEvent?.WeActionModifyPanel10,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel10.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel11: {
                cls         : Twns.WarEvent?.WeActionModifyPanel11,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel11.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel20: {
                cls         : Twns.WarEvent?.WeActionModifyPanel20,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel20.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel21: {
                cls         : Twns.WarEvent?.WeActionModifyPanel21,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel21.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel22: {
                cls         : Twns.WarEvent?.WeActionModifyPanel22,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel22.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel23: {
                cls         : Twns.WarEvent?.WeActionModifyPanel23,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel23.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel24: {
                cls         : Twns.WarEvent?.WeActionModifyPanel24,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel24.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel25: {
                cls         : Twns.WarEvent?.WeActionModifyPanel25,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel25.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel30: {
                cls         : Twns.WarEvent?.WeActionModifyPanel30,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel30.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel40: {
                cls         : Twns.WarEvent?.WeActionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel41: {
                cls         : Twns.WarEvent?.WeActionModifyPanel41,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel41.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel50: {
                cls         : Twns.WarEvent?.WeActionModifyPanel50,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel50.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionReplacePanel: {
                cls         : Twns.WarEvent?.WeActionReplacePanel,
                skinName    : `resource/skins/warEvent/WeActionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionTypeListPanel: {
                cls         : Twns.WarEvent?.WeActionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeActionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeCommandPanel: {
                cls         : Twns.WarEvent?.WeCommandPanel,
                skinName    : `resource/skins/warEvent/WeCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel1: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel1,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel1.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel2: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel3: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel3,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel3.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel4: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel4,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel4.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel5: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel5,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel5.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel6: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel10: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel10,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel10.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel11: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel11,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel11.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel12: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel12,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel12.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel13: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel13,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel13.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel14: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel14,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel14.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel20: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel20,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel20.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel21: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel21,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel21.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel22: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel22,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel22.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel23: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel23,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel23.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel30: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel30,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel30.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel31: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel31,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel31.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel32: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel32,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel32.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel40: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel50: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel50,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel50.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel60: {
                cls         : Twns.WarEvent?.WeConditionModifyPanel60,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel60.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionReplacePanel: {
                cls         : Twns.WarEvent?.WeConditionReplacePanel,
                skinName    : `resource/skins/warEvent/WeConditionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionTypeListPanel: {
                cls         : Twns.WarEvent?.WeConditionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeConditionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeDialogueBackgroundPanel: {
                cls         : Twns.WarEvent?.WeDialogueBackgroundPanel,
                skinName    : `resource/skins/warEvent/WeDialogueBackgroundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeEventListPanel: {
                cls         : Twns.WarEvent?.WeEventListPanel,
                skinName    : `resource/skins/warEvent/WeEventListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeEventRenamePanel: {
                cls         : Twns.WarEvent?.WeEventRenamePanel,
                skinName    : `resource/skins/warEvent/WeEventRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeNodeReplacePanel: {
                cls         : Twns.WarEvent?.WeNodeReplacePanel,
                skinName    : `resource/skins/warEvent/WeNodeReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WarMapBuildingListPanel: {
                cls         : Twns.WarMap?.WarMapBuildingListPanel,
                skinName    : `resource/skins/warMap/WarMapBuildingListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            WwDeleteWatcherDetailPanel: {
                cls         : Twns.WatchWar?.WwDeleteWatcherDetailPanel,
                skinName    : `resource/skins/watchWar/WwDeleteWatcherDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwDeleteWatcherWarsPanel: {
                cls         : Twns.WatchWar?.WwDeleteWatcherWarsPanel,
                skinName    : `resource/skins/watchWar/WwDeleteWatcherWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwHandleRequestDetailPanel: {
                cls         : Twns.WatchWar?.WwHandleRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwHandleRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwHandleRequestWarsPanel: {
                cls         : Twns.WatchWar?.WwHandleRequestWarsPanel,
                skinName    : `resource/skins/watchWar/WwHandleRequestWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwMainMenuPanel: {
                cls         : Twns.WatchWar?.WwMainMenuPanel,
                skinName    : `resource/skins/watchWar/WwMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwMakeRequestDetailPanel: {
                cls         : Twns.WatchWar?.WwMakeRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwMakeRequestWarsPanel: {
                cls         : Twns.WatchWar?.WwMakeRequestWarsPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwOngoingWarsPanel: {
                cls         : Twns.WatchWar?.WwOngoingWarsPanel,
                skinName    : `resource/skins/watchWar/WwOngoingWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwSearchWarPanel: {
                cls         : Twns.WatchWar?.WwSearchWarPanel,
                skinName    : `resource/skins/watchWar/WwSearchWarPanel.exml`,
                layer       : LayerType.Hud0,
            },
        };
    }
}
