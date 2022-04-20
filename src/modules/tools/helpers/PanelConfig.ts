
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsPanelConfig {
    import LayerType    = Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel.UiPanel<T>;
        skinName        : string;
        layer           : LayerType;
        isExclusive?    : boolean;
        needCache?      : boolean;
    };

    export let Dict: {
        BwBackgroundPanel                   : PanelConfig<TwnsBwBackgroundPanel.OpenData>;
        BwBeginTurnPanel                    : PanelConfig<TwnsBwBeginTurnPanel.OpenData>;
        BwCaptureProgressPanel              : PanelConfig<TwnsBwCaptureProgressPanel.OpenData>;
        BwDamagePreviewPanel                : PanelConfig<Twns.BaseWar.OpenDataForBwDamagePreviewPanel>;
        BwDialoguePanel                     : PanelConfig<TwnsBwDialoguePanel.OpenData>;
        BwProduceUnitPanel                  : PanelConfig<Twns.BaseWar.OpenDataForBwProduceUnitPanel>;
        BwSimpleDialoguePanel               : PanelConfig<TwnsBwSimpleDialoguePanel.OpenData>;
        BwTileBriefPanel                    : PanelConfig<TwnsBwTileBriefPanel.OpenData>;
        BwTileDetailPanel                   : PanelConfig<TwnsBwTileDetailPanel.OpenData>;
        BwUnitActionsPanel                  : PanelConfig<Twns.BaseWar.OpenDataForBwUnitActionsPanel>;
        BwUnitBriefPanel                    : PanelConfig<Twns.BaseWar.OpenDataForBwUnitBriefPanel>;
        BwUnitDetailPanel                   : PanelConfig<Twns.BaseWar.OpenDataForBwUnitDetailPanel>;
        BwUnitListPanel                     : PanelConfig<Twns.BaseWar.OpenDataForBwUnitListPanel>;
        BwWarInfoPanel                      : PanelConfig<Twns.BaseWar.OpenDataForBwWarInfoPanel>;
        BwWarPanel                          : PanelConfig<TwnsBwWarPanel.OpenData>;

        BroadcastAddMessagePanel            : PanelConfig<TwnsBroadcastAddMessagePanel.OpenData>;
        BroadcastMessageListPanel           : PanelConfig<TwnsBroadcastMessageListPanel.OpenData>;
        BroadcastPanel                      : PanelConfig<TwnsBroadcastPanel.OpenData>;

        ChangeLogAddPanel                   : PanelConfig<TwnsChangeLogAddPanel.OpenData>;
        ChangeLogModifyPanel                : PanelConfig<TwnsChangeLogModifyPanel.OpenData>;
        ChangeLogPanel                      : PanelConfig<TwnsChangeLogPanel.OpenData>;

        CcrCreateMapListPanel               : PanelConfig<TwnsCcrCreateMapListPanel.OpenData>;
        CcrCreateSearchMapPanel             : PanelConfig<TwnsCcrCreateSearchMapPanel.OpenData>;
        CcrCreateSettingsPanel              : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrCreateSettingsPanel>;
        CcrJoinRoomListPanel                : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrJoinRoomListPanel>;
        CcrMainMenuPanel                    : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrMainMenuPanel>;
        CcrMyRoomListPanel                  : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrMyRoomListPanel>;
        CcrRoomInfoPanel                    : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrRoomInfoPanel>;
        CcrSearchRoomPanel                  : PanelConfig<Twns.CoopCustomRoom.OpenDataForCcrSearchRoomPanel>;

        CcwMyWarListPanel                   : PanelConfig<Twns.CoopCustomWar.OpenDataForCcwMyWarListPanel>;

        ChatCommandPanel                    : PanelConfig<TwnsChatCommandPanel.OpenData>;
        ChatPanel                           : PanelConfig<Twns.Chat.OpenDataForChatPanel>;

        CommonAddLoadedUnitPanel            : PanelConfig<TwnsCommonAddLoadedUnitPanel.OpenData>;
        CommonAlertPanel                    : PanelConfig<TwnsCommonAlertPanel.OpenData>;
        CommonBanCoPanel                    : PanelConfig<TwnsCommonBanCoPanel.OpenData>;
        CommonBlockPanel                    : PanelConfig<TwnsCommonBlockPanel.OpenData>;
        CommonChangeVersionPanel            : PanelConfig<TwnsCommonChangeVersionPanel.OpenData>;
        CommonChooseCoCategoryIdPanel       : PanelConfig<TwnsCommonChooseCoCategoryIdPanel.OpenDataForCommonChooseCoCategoryIdPanel>;
        CommonChooseCoPanel                 : PanelConfig<TwnsCommonChooseCoPanel.OpenData>;
        CommonChooseCoSkillTypePanel        : PanelConfig<TwnsCommonChooseCoSkillTypePanel.OpenData>;
        CommonChooseCustomCounterIdPanel    : PanelConfig<TwnsCommonChooseCustomCounterIdPanel.OpenData>;
        CommonChooseGridIndexPanel          : PanelConfig<TwnsCommonChooseGridIndexPanel.OpenData>;
        CommonChooseLocationPanel           : PanelConfig<TwnsCommonChooseLocationPanel.OpenData>;
        CommonChoosePlayerAliveStatePanel   : PanelConfig<TwnsCommonChoosePlayerAliveStatePanel.OpenData>;
        CommonChoosePlayerIndexPanel        : PanelConfig<TwnsCommonChoosePlayerIndexPanel.OpenData>;
        CommonChooseSingleTileTypePanel     : PanelConfig<TwnsCommonChooseSingleTileTypePanel.OpenData>;
        CommonChooseSingleUnitTypePanel     : PanelConfig<TwnsCommonChooseSingleUnitTypePanel.OpenData>;
        CommonChooseTeamIndexPanel          : PanelConfig<TwnsCommonChooseTeamIndexPanel.OpenData>;
        CommonChooseTileBasePanel           : PanelConfig<TwnsCommonChooseTileBasePanel.OpenData>;
        CommonChooseTileDecoratorPanel      : PanelConfig<TwnsCommonChooseTileDecoratorPanel.OpenData>;
        CommonChooseTileObjectPanel         : PanelConfig<TwnsCommonChooseTileObjectPanel.OpenData>;
        CommonChooseTileTypePanel           : PanelConfig<TwnsCommonChooseTileTypePanel.OpenData>;
        CommonChooseUnitActionStatePanel    : PanelConfig<TwnsCommonChooseUnitActionStatePanel.OpenData>;
        CommonChooseUnitTypePanel           : PanelConfig<TwnsCommonChooseUnitTypePanel.OpenData>;
        CommonChooseWarEventActionIdPanel   : PanelConfig<TwnsCommonChooseWarEventActionIdPanel.OpenData>;
        CommonChooseWarEventIdPanel         : PanelConfig<TwnsCommonChooseWarEventIdPanel.OpenData>;
        CommonChooseWeatherTypePanel        : PanelConfig<TwnsCommonChooseWeatherTypePanel.OpenData>;
        CommonCoInfoPanel                   : PanelConfig<TwnsCommonCoInfoPanel.OpenData>;
        CommonCoListPanel                   : PanelConfig<TwnsCommonCoListPanel.OpenData>;
        CommonConfirmPanel                  : PanelConfig<TwnsCommonConfirmPanel.OpenData>;
        CommonDamageCalculatorPanel         : PanelConfig<TwnsCommonDamageCalculatorPanel.OpenData>;
        CommonDamageChartPanel              : PanelConfig<TwnsCommonDamageChartPanel.OpenData>;
        CommonErrorPanel                    : PanelConfig<TwnsCommonErrorPanel.OpenData>;
        CommonHelpPanel                     : PanelConfig<TwnsCommonHelpPanel.OpenData>;
        CommonInputPanel                    : PanelConfig<TwnsCommonInputPanel.OpenData>;
        CommonInputIntegerPanel             : PanelConfig<TwnsCommonInputIntegerPanel.OpenData>;
        CommonJoinRoomPasswordPanel         : PanelConfig<TwnsCommonJoinRoomPasswordPanel.OpenData>;
        CommonMapWarStatisticsPanel         : PanelConfig<TwnsCommonMapWarStatisticsPanel.OpenData>;
        CommonModifyWarRuleNamePanel        : PanelConfig<TwnsCommonModifyWarRuleNamePanel.OpenData>;
        CommonRankListPanel                 : PanelConfig<TwnsCommonRankListPanel.OpenData>;
        CommonServerStatusPanel             : PanelConfig<TwnsCommonServerStatusPanel.OpenData>;

        HrwReplayProgressPanel              : PanelConfig<TwnsHrwReplayProgressPanel.OpenData>;
        HrwTopPanel                         : PanelConfig<Twns.HalfwayReplayWar.OpenDataForHrwTopPanel>;
        HrwWarMenuPanel                     : PanelConfig<TwnsHrwWarMenuPanel.OpenData>;

        LobbyBackgroundPanel                : PanelConfig<TwnsLobbyBackgroundPanel.OpenData>;
        LobbyBottomPanel                    : PanelConfig<TwnsLobbyBottomPanel.OpenData>;
        LobbyPanel                          : PanelConfig<Twns.Lobby.OpenDataForLobbyPanel>;
        LobbyTopPanel                       : PanelConfig<TwnsLobbyTopPanel.OpenData>;
        LobbyTopRightPanel                  : PanelConfig<TwnsLobbyTopRightPanel.OpenData>;

        McrCreateMapListPanel               : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrCreateMapListPanel>;
        McrCreateSearchMapPanel             : PanelConfig<TwnsMcrCreateSearchMapPanel.OpenData>;
        McrCreateSettingsPanel              : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrCreateSettingsPanel>;
        McrJoinRoomListPanel                : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrJoinRoomListPanel>;
        McrMainMenuPanel                    : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrMainMenuPanel>;
        McrMyRoomListPanel                  : PanelConfig<Twns.MultiCustomRoom.OpenDataForMcrMyRoomListPanel>;
        McrRoomInfoPanel                    : PanelConfig<TwnsMcrRoomInfoPanel.OpenData>;
        McrSearchRoomPanel                  : PanelConfig<TwnsMcrSearchRoomPanel.OpenData>;

        McwMyWarListPanel                   : PanelConfig<Twns.MultiCustomWar.OpenDataForMcwMyWarListPanel>;

        MeAddWarEventToRulePanel            : PanelConfig<TwnsMeAddWarEventToRulePanel.OpenData>;
        MeAvailableCoPanel                  : PanelConfig<TwnsMeAvailableCoPanel.OpenData>;
        MeChooseTileBasePanel               : PanelConfig<TwnsMeChooseTileBasePanel.OpenData>;
        MeChooseTileDecoratorPanel          : PanelConfig<TwnsMeChooseTileDecoratorPanel.OpenData>;
        MeChooseTileObjectPanel             : PanelConfig<TwnsMeChooseTileObjectPanel.OpenData>;
        MeChooseUnitPanel                   : PanelConfig<TwnsMeChooseUnitPanel.OpenData>;
        MeClearPanel                        : PanelConfig<TwnsMeClearPanel.OpenData>;
        MeConfirmSaveMapPanel               : PanelConfig<Twns.MapEditor.OpenDataForMeConfirmSaveMapPanel>;
        MeImportPanel                       : PanelConfig<TwnsMeImportPanel.OpenData>;
        MeMapListPanel                      : PanelConfig<TwnsMeMapListPanel.OpenData>;
        MeMapTagPanel                       : PanelConfig<TwnsMeMapTagPanel.OpenData>;
        MeMfwSettingsPanel                  : PanelConfig<TwnsMeMfwSettingsPanel.OpenData>;
        MeModifyMapDescPanel                : PanelConfig<Twns.MapEditor.OpenDataForMeModifyMapDescPanel>;
        MeModifyMapNamePanel                : PanelConfig<TwnsMeModifyMapNamePanel.OpenData>;
        MeResizePanel                       : PanelConfig<TwnsMeResizePanel.OpenData>;
        MeSimSettingsPanel                  : PanelConfig<TwnsMeSimSettingsPanel.OpenData>;
        MeSymmetryPanel                     : PanelConfig<TwnsMeSymmetryPanel.OpenData>;
        MeTopPanel                          : PanelConfig<Twns.MapEditor.OpenDataForMeTopPanel>;
        MeVisibilityPanel                   : PanelConfig<TwnsMeVisibilityPanel.OpenData>;
        MeWarMenuPanel                      : PanelConfig<Twns.MapEditor.OpenDataForMeWarMenuPanel>;
        MeWarRulePanel                      : PanelConfig<TwnsMeWarRulePanel.OpenData>;
        MeChooseLocationPanel               : PanelConfig<TwnsMeChooseLocationPanel.OpenData>;

        MfrCreateSettingsPanel              : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrCreateSettingsPanel>;
        MfrJoinRoomListPanel                : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrJoinRoomListPanel>;
        MfrMainMenuPanel                    : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrMainMenuPanel>;
        MfrMyRoomListPanel                  : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrMyRoomListPanel>;
        MfrRoomInfoPanel                    : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrRoomInfoPanel>;
        MfrSearchRoomPanel                  : PanelConfig<Twns.MultiFreeRoom.OpenDataForMfrSearchRoomPanel>;

        MfwMyWarListPanel                   : PanelConfig<Twns.MultiFreeWar.OpenDataForMfwMyWarListPanel>;

        MmAcceptMapPanel                    : PanelConfig<TwnsMmAcceptMapPanel.OpenData>;
        MmAvailabilityListPanel             : PanelConfig<TwnsMmAvailabilityListPanel.OpenData>;
        MmAvailabilitySearchPanel           : PanelConfig<TwnsMmAvailabilitySearchPanel.OpenData>;
        MmCommandPanel                      : PanelConfig<TwnsMmCommandPanel.OpenData>;
        MmMainMenuPanel                     : PanelConfig<TwnsMmMainMenuPanel.OpenData>;
        MmMapRenamePanel                    : PanelConfig<TwnsMmMapRenamePanel.OpenData>;
        MmRejectMapPanel                    : PanelConfig<TwnsMmRejectMapPanel.OpenData>;
        MmReviewListPanel                   : PanelConfig<TwnsMmReviewListPanel.OpenData>;
        MmSetWarRuleAvailabilityPanel       : PanelConfig<TwnsMmSetWarRuleAvailabilityPanel.OpenData>;
        MmTagChangePanel                    : PanelConfig<TwnsMmTagChangePanel.OpenData>;
        MmTagListPanel                      : PanelConfig<TwnsMmTagListPanel.OpenData>;
        MmTagSearchPanel                    : PanelConfig<TwnsMmTagSearchPanel.OpenData>;
        MmWarRuleAvailableCoPanel           : PanelConfig<TwnsMmWarRuleAvailableCoPanel.OpenData>;
        MmWarRulePanel                      : PanelConfig<TwnsMmWarRulePanel.OpenData>;

        MpwSpectatePanel                    : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwSpectatePanel>;
        MpwSidePanel                        : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwSidePanel>;
        MpwTopPanel                         : PanelConfig<Twns.MultiPlayerWar.OpenDataForMpwTopPanel>;
        MpwWarMenuPanel                     : PanelConfig<TwnsMpwWarMenuPanel.OpenData>;

        MrrMainMenuPanel                    : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrMainMenuPanel>;
        MrrMyRoomListPanel                  : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrMyRoomListPanel>;
        MrrPreviewMapListPanel              : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrPreviewMapListPanel>;
        MrrRoomInfoPanel                    : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrRoomInfoPanel>;
        MrrSetMaxConcurrentCountPanel       : PanelConfig<Twns.MultiRankRoom.OpenDataForMrrSetMaxConcurrentCountPanel>;

        MrwMyWarListPanel                   : PanelConfig<Twns.MultiRankWar.OpenDataForMrwMyWarListPanel>;

        RwReplayListPanel                   : PanelConfig<TwnsRwReplayListPanel.OpenData>;
        RwReplayProgressPanel               : PanelConfig<TwnsRwReplayProgressPanel.OpenData>;
        RwSearchReplayPanel                 : PanelConfig<TwnsRwSearchReplayPanel.OpenData>;
        RwTopPanel                          : PanelConfig<Twns.ReplayWar.OpenDataForRwTopPanel>;
        RwWarMenuPanel                      : PanelConfig<Twns.ReplayWar.OpenDataForRwWarMenuPanel>;

        ScrCreateMapListPanel               : PanelConfig<TwnsScrCreateMapListPanel.OpenData>;
        ScrCreateSearchMapPanel             : PanelConfig<TwnsScrCreateSearchMapPanel.OpenData>;
        ScrCreateSettingsPanel              : PanelConfig<Twns.SingleCustomRoom.OpenDataForScrCreateSettingsPanel>;

        SpmCreateSaveSlotsPanel             : PanelConfig<TwnsSpmCreateSaveSlotsPanel.OpenData>;
        SpmCreateSfwSaveSlotsPanel          : PanelConfig<TwnsSpmCreateSfwSaveSlotsPanel.OpenData>;
        SpmMainMenuPanel                    : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmMainMenuPanel>;
        SpmWarListPanel                     : PanelConfig<Twns.SinglePlayerMode.OpenDataForSpmWarListPanel>;

        SpwLoadWarPanel                     : PanelConfig<TwnsSpwLoadWarPanel.OpenData>;
        SpwSidePanel                        : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwSidePanel>;
        SpwTopPanel                         : PanelConfig<Twns.SinglePlayerWar.OpenDataForSpwTopPanel>;
        SpwWarMenuPanel                     : PanelConfig<TwnsSpwWarMenuPanel.OpenData>;

        SrrCreateMapListPanel               : PanelConfig<TwnsSrrCreateMapListPanel.OpenData>;
        SrrCreateSettingsPanel              : PanelConfig<Twns.SingleRankRoom.OpenDataForSrrCreateSettingsPanel>;

        UserChangeDiscordIdPanel            : PanelConfig<TwnsUserChangeDiscordIdPanel.OpenData>;
        UserChangeNicknamePanel             : PanelConfig<TwnsUserChangeNicknamePanel.OpenData>;
        UserGameManagementPanel             : PanelConfig<TwnsUserGameManagementPanel.OpenData>;
        UserLoginBackgroundPanel            : PanelConfig<TwnsUserLoginBackgroundPanel.OpenData>;
        UserLoginPanel                      : PanelConfig<TwnsUserLoginPanel.OpenData>;
        UserOnlineUsersPanel                : PanelConfig<TwnsUserOnlineUsersPanel.OpenData>;
        UserPanel                           : PanelConfig<TwnsUserPanel.OpenData>;
        UserRegisterPanel                   : PanelConfig<TwnsUserRegisterPanel.OpenData>;
        UserSetAvatarPanel                  : PanelConfig<Twns.User.OpenDataForUserSetAvatarPanel>;
        UserSetOpacityPanel                 : PanelConfig<TwnsUserSetOpacityPanel.OpenData>;
        UserSetPasswordPanel                : PanelConfig<TwnsUserSetPasswordPanel.OpenData>;
        UserSetPrivilegePanel               : PanelConfig<TwnsUserSetPrivilegePanel.OpenData>;
        UserSetSoundPanel                   : PanelConfig<TwnsUserSetSoundPanel.OpenData>;
        UserSetStageScalePanel              : PanelConfig<TwnsUserSetStageScalePanel.OpenData>;
        UserSettingsPanel                   : PanelConfig<TwnsUserSettingsPanel.OpenData>;

        WeActionAddUnitListPanel            : PanelConfig<Twns.WarEvent.OpenDataForWeActionAddUnitListPanel>;
        WeActionModifyPanel1                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel1>;
        WeActionModifyPanel2                : PanelConfig<TwnsWeActionModifyPanel2.OpenData>;
        WeActionModifyPanel3                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel3>;
        WeActionModifyPanel4                : PanelConfig<TwnsWeActionModifyPanel4.OpenData>;
        WeActionModifyPanel5                : PanelConfig<TwnsWeActionModifyPanel5.OpenData>;
        WeActionModifyPanel6                : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel6>;
        WeActionModifyPanel7                : PanelConfig<TwnsWeActionModifyPanel7.OpenData>;
        WeActionModifyPanel10               : PanelConfig<TwnsWeActionModifyPanel10.OpenData>;
        WeActionModifyPanel11               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel11>;
        WeActionModifyPanel20               : PanelConfig<TwnsWeActionModifyPanel20.OpenData>;
        WeActionModifyPanel21               : PanelConfig<TwnsWeActionModifyPanel21.OpenData>;
        WeActionModifyPanel22               : PanelConfig<TwnsWeActionModifyPanel22.OpenData>;
        WeActionModifyPanel23               : PanelConfig<TwnsWeActionModifyPanel23.OpenData>;
        WeActionModifyPanel24               : PanelConfig<TwnsWeActionModifyPanel24.OpenData>;
        WeActionModifyPanel25               : PanelConfig<TwnsWeActionModifyPanel25.OpenData>;
        WeActionModifyPanel30               : PanelConfig<TwnsWeActionModifyPanel30.OpenData>;
        WeActionModifyPanel40               : PanelConfig<TwnsWeActionModifyPanel40.OpenData>;
        WeActionModifyPanel41               : PanelConfig<TwnsWeActionModifyPanel41.OpenData>;
        WeActionModifyPanel50               : PanelConfig<Twns.WarEvent.OpenDataForWeActionModifyPanel50>;
        WeActionReplacePanel                : PanelConfig<Twns.WarEvent.OpenDataForWeActionReplacePanel>;
        WeActionTypeListPanel               : PanelConfig<TwnsWeActionTypeListPanel.OpenData>;
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
        WeConditionTypeListPanel            : PanelConfig<TwnsWeConditionTypeListPanel.OpenData>;
        WeDialogueBackgroundPanel           : PanelConfig<Twns.WarEvent.OpenDataForWeDialogueBackgroundPanel>;
        WeEventListPanel                    : PanelConfig<Twns.WarEvent.OpenDataForWeEventListPanel>;
        WeEventRenamePanel                  : PanelConfig<TwnsWeEventRenamePanel.OpenData>;
        WeNodeReplacePanel                  : PanelConfig<TwnsWeNodeReplacePanel.OpenData>;

        WarMapBuildingListPanel             : PanelConfig<Twns.WarMap.OpenDataForWarMapBuildingListPanel>;

        WwDeleteWatcherDetailPanel          : PanelConfig<TwnsWwDeleteWatcherDetailPanel.OpenData>;
        WwDeleteWatcherWarsPanel            : PanelConfig<Twns.WatchWar.OpenDataForWwDeleteWatcherWarsPanel>;
        WwHandleRequestDetailPanel          : PanelConfig<TwnsWwHandleRequestDetailPanel.OpenData>;
        WwHandleRequestWarsPanel            : PanelConfig<TwnsWwHandleRequestWarsPanel.OpenData>;
        WwMainMenuPanel                     : PanelConfig<Twns.WatchWar.OpenDataForWatchWarMainMenuPanel>;
        WwMakeRequestDetailPanel            : PanelConfig<TwnsWwMakeRequestDetailPanel.OpenData>;
        WwMakeRequestWarsPanel              : PanelConfig<TwnsWwMakeRequestWarsPanel.OpenData>;
        WwOngoingWarsPanel                  : PanelConfig<TwnsWwOngoingWarsPanel.OpenData>;
        WwSearchWarPanel                    : PanelConfig<TwnsWwSearchWarPanel.OpenData>;
    };

    export function init(): void {
        Dict = {
            BwBackgroundPanel: {
                cls         : TwnsBwBackgroundPanel?.BwBackgroundPanel,
                skinName    : `resource/skins/baseWar/BwBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
                needCache   : true,
            },

            BwBeginTurnPanel: {
                cls         : TwnsBwBeginTurnPanel?.BwBeginTurnPanel,
                skinName    : `resource/skins/baseWar/BwBeginTurnPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            BwCaptureProgressPanel: {
                cls         : TwnsBwCaptureProgressPanel?.BwCaptureProgressPanel,
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
                cls         : TwnsBwDialoguePanel?.BwDialoguePanel,
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
                cls         : TwnsBwSimpleDialoguePanel?.BwSimpleDialoguePanel,
                skinName    : `resource/skins/baseWar/BwSimpleDialoguePanel.exml`,
                layer       : LayerType.Hud1,
            },

            BwTileBriefPanel: {
                cls         : TwnsBwTileBriefPanel?.BwTileBriefPanel,
                skinName    : `resource/skins/baseWar/BwTileBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwTileDetailPanel: {
                cls         : TwnsBwTileDetailPanel?.BwTileDetailPanel,
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
                cls         : TwnsBwWarPanel?.BwWarPanel,
                skinName    : `resource/skins/baseWar/BwWarPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            BroadcastAddMessagePanel: {
                cls         : TwnsBroadcastAddMessagePanel?.BroadcastAddMessagePanel,
                skinName    : `resource/skins/broadcast/BroadcastAddMessagePanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastMessageListPanel: {
                cls         : TwnsBroadcastMessageListPanel?.BroadcastMessageListPanel,
                skinName    : `resource/skins/broadcast/BroadcastMessageListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            BroadcastPanel: {
                cls         : TwnsBroadcastPanel?.BroadcastPanel,
                skinName    : `resource/skins/broadcast/BroadcastPanel.exml`,
                layer       : LayerType.Notify0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChangeLogAddPanel: {
                cls         : TwnsChangeLogAddPanel?.ChangeLogAddPanel,
                skinName    : `resource/skins/changeLog/ChangeLogAddPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogModifyPanel: {
                cls         : TwnsChangeLogModifyPanel?.ChangeLogModifyPanel,
                skinName    : `resource/skins/changeLog/ChangeLogModifyPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ChangeLogPanel: {
                cls         : TwnsChangeLogPanel?.ChangeLogPanel,
                skinName    : `resource/skins/changeLog/ChangeLogPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcrCreateMapListPanel: {
                cls         : TwnsCcrCreateMapListPanel?.CcrCreateMapListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrCreateSearchMapPanel: {
                cls         : TwnsCcrCreateSearchMapPanel?.CcrCreateSearchMapPanel,
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
                cls         : TwnsChatCommandPanel?.ChatCommandPanel,
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
                cls         : TwnsCommonAddLoadedUnitPanel?.CommonAddLoadedUnitPanel,
                skinName    : `resource/skins/common/CommonAddLoadedUnitPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonAlertPanel: {
                cls         : TwnsCommonAlertPanel?.CommonAlertPanel,
                skinName    : `resource/skins/common/CommonAlertPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonBanCoPanel: {
                cls         : TwnsCommonBanCoPanel?.CommonBanCoPanel,
                skinName    : `resource/skins/common/CommonBanCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonBlockPanel: {
                cls         : TwnsCommonBlockPanel?.CommonBlockPanel,
                skinName    : `resource/skins/common/CommonBlockPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonChangeVersionPanel: {
                cls         : TwnsCommonChangeVersionPanel?.CommonChangeVersionPanel,
                skinName    : `resource/skins/common/CommonChangeVersionPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoCategoryIdPanel: {
                cls         : TwnsCommonChooseCoCategoryIdPanel?.CommonChooseCoCategoryIdPanel,
                skinName    : `resource/skins/common/CommonChooseCoCategoryIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoPanel: {
                cls         : TwnsCommonChooseCoPanel?.CommonChooseCoPanel,
                skinName    : `resource/skins/common/CommonChooseCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCoSkillTypePanel: {
                cls         : TwnsCommonChooseCoSkillTypePanel?.CommonChooseCoSkillTypePanel,
                skinName    : `resource/skins/common/CommonChooseCoSkillTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseCustomCounterIdPanel: {
                cls         : TwnsCommonChooseCustomCounterIdPanel?.CommonChooseCustomCounterIdPanel,
                skinName    : `resource/skins/common/CommonChooseCustomCounterIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseGridIndexPanel: {
                cls         : TwnsCommonChooseGridIndexPanel?.CommonChooseGridIndexPanel,
                skinName    : `resource/skins/common/CommonChooseGridIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseLocationPanel: {
                cls         : TwnsCommonChooseLocationPanel?.CommonChooseLocationPanel,
                skinName    : `resource/skins/common/CommonChooseLocationPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerAliveStatePanel: {
                cls         : TwnsCommonChoosePlayerAliveStatePanel?.CommonChoosePlayerAliveStatePanel,
                skinName    : `resource/skins/common/CommonChoosePlayerAliveStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChoosePlayerIndexPanel: {
                cls         : TwnsCommonChoosePlayerIndexPanel?.CommonChoosePlayerIndexPanel,
                skinName    : `resource/skins/common/CommonChoosePlayerIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleTileTypePanel: {
                cls         : TwnsCommonChooseSingleTileTypePanel?.CommonChooseSingleTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseSingleUnitTypePanel: {
                cls         : TwnsCommonChooseSingleUnitTypePanel?.CommonChooseSingleUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseSingleUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTeamIndexPanel: {
                cls         : TwnsCommonChooseTeamIndexPanel?.CommonChooseTeamIndexPanel,
                skinName    : `resource/skins/common/CommonChooseTeamIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileBasePanel: {
                cls         : TwnsCommonChooseTileBasePanel?.CommonChooseTileBasePanel,
                skinName    : `resource/skins/common/CommonChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileDecoratorPanel: {
                cls         : TwnsCommonChooseTileDecoratorPanel?.CommonChooseTileDecoratorPanel,
                skinName    : `resource/skins/common/CommonChooseTileDecoratorPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileObjectPanel: {
                cls         : TwnsCommonChooseTileObjectPanel?.CommonChooseTileObjectPanel,
                skinName    : `resource/skins/common/CommonChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileTypePanel: {
                cls         : TwnsCommonChooseTileTypePanel?.CommonChooseTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitActionStatePanel: {
                cls         : TwnsCommonChooseUnitActionStatePanel?.CommonChooseUnitActionStatePanel,
                skinName    : `resource/skins/common/CommonChooseUnitActionStatePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitTypePanel: {
                cls         : TwnsCommonChooseUnitTypePanel?.CommonChooseUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseUnitTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventActionIdPanel: {
                cls         : TwnsCommonChooseWarEventActionIdPanel?.CommonChooseWarEventActionIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventActionIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWarEventIdPanel: {
                cls         : TwnsCommonChooseWarEventIdPanel?.CommonChooseWarEventIdPanel,
                skinName    : `resource/skins/common/CommonChooseWarEventIdPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseWeatherTypePanel: {
                cls         : TwnsCommonChooseWeatherTypePanel?.CommonChooseWeatherTypePanel,
                skinName    : `resource/skins/common/CommonChooseWeatherTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoInfoPanel: {
                cls         : TwnsCommonCoInfoPanel?.CommonCoInfoPanel,
                skinName    : `resource/skins/common/CommonCoInfoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonCoListPanel: {
                cls         : TwnsCommonCoListPanel?.CommonCoListPanel,
                skinName    : `resource/skins/common/CommonCoListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonConfirmPanel: {
                cls         : TwnsCommonConfirmPanel?.CommonConfirmPanel,
                skinName    : `resource/skins/common/CommonConfirmPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonDamageCalculatorPanel: {
                cls         : TwnsCommonDamageCalculatorPanel?.CommonDamageCalculatorPanel,
                skinName    : `resource/skins/common/CommonDamageCalculatorPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonDamageChartPanel: {
                cls         : TwnsCommonDamageChartPanel?.CommonDamageChartPanel,
                skinName    : `resource/skins/common/CommonDamageChartPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            CommonErrorPanel: {
                cls         : TwnsCommonErrorPanel?.CommonErrorPanel,
                skinName    : `resource/skins/common/CommonErrorPanel.exml`,
                layer       : LayerType.Top,
            },

            CommonHelpPanel: {
                cls         : TwnsCommonHelpPanel?.CommonHelpPanel,
                skinName    : `resource/skins/common/CommonHelpPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonInputPanel: {
                cls         : TwnsCommonInputPanel?.CommonInputPanel,
                skinName    : `resource/skins/common/CommonInputPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonInputIntegerPanel: {
                cls         : TwnsCommonInputIntegerPanel?.CommonInputIntegerPanel,
                skinName    : `resource/skins/common/CommonInputIntegerPanel.exml`,
                layer       : LayerType.Notify0,
            },

            CommonJoinRoomPasswordPanel: {
                cls         : TwnsCommonJoinRoomPasswordPanel?.CommonJoinRoomPasswordPanel,
                skinName    : `resource/skins/common/CommonJoinRoomPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonMapWarStatisticsPanel: {
                cls         : TwnsCommonMapWarStatisticsPanel?.CommonMapWarStatisticsPanel,
                skinName    : `resource/skins/common/CommonMapWarStatisticsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonModifyWarRuleNamePanel: {
                cls         : TwnsCommonModifyWarRuleNamePanel?.CommonModifyWarRuleNamePanel,
                skinName    : `resource/skins/common/CommonModifyWarRuleNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonRankListPanel: {
                cls         : TwnsCommonRankListPanel?.CommonRankListPanel,
                skinName    : `resource/skins/common/CommonRankListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonServerStatusPanel: {
                cls         : TwnsCommonServerStatusPanel?.CommonServerStatusPanel,
                skinName    : `resource/skins/common/CommonServerStatusPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            HrwReplayProgressPanel: {
                cls         : TwnsHrwReplayProgressPanel?.HrwReplayProgressPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwReplayProgressPanel.exml`,
                layer       : LayerType.Hud0,
            },

            HrwTopPanel: {
                cls         : Twns.HalfwayReplayWar?.HrwTopPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            HrwWarMenuPanel: {
                cls         : TwnsHrwWarMenuPanel?.HrwWarMenuPanel,
                skinName    : `resource/skins/halfwayReplayWar/HrwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            LobbyBackgroundPanel: {
                cls         : TwnsLobbyBackgroundPanel?.LobbyBackgroundPanel,
                skinName    : `resource/skins/lobby/LobbyBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                needCache   : true,
            },

            LobbyBottomPanel: {
                cls         : TwnsLobbyBottomPanel?.LobbyBottomPanel,
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
                cls         : TwnsLobbyTopPanel?.LobbyTopPanel,
                skinName    : `resource/skins/lobby/LobbyTopPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            LobbyTopRightPanel: {
                cls         : TwnsLobbyTopRightPanel?.LobbyTopRightPanel,
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
                cls         : TwnsMcrCreateSearchMapPanel?.McrCreateSearchMapPanel,
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
                cls         : TwnsMcrRoomInfoPanel?.McrRoomInfoPanel,
                skinName    : `resource/skins/multiCustomRoom/McrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrSearchRoomPanel: {
                cls         : TwnsMcrSearchRoomPanel?.McrSearchRoomPanel,
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
                cls         : TwnsMeAddWarEventToRulePanel?.MeAddWarEventToRulePanel,
                skinName    : `resource/skins/mapEditor/MeAddWarEventToRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeAvailableCoPanel: {
                cls         : TwnsMeAvailableCoPanel?.MeAvailableCoPanel,
                skinName    : `resource/skins/mapEditor/MeAvailableCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseTileBasePanel: {
                cls         : TwnsMeChooseTileBasePanel?.MeChooseTileBasePanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileBasePanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileDecoratorPanel: {
                cls         : TwnsMeChooseTileDecoratorPanel?.MeChooseTileDecoratorPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileDecoratorPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseTileObjectPanel: {
                cls         : TwnsMeChooseTileObjectPanel?.MeChooseTileObjectPanel,
                skinName    : `resource/skins/mapEditor/MeChooseTileObjectPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeChooseUnitPanel: {
                cls         : TwnsMeChooseUnitPanel?.MeChooseUnitPanel,
                skinName    : `resource/skins/mapEditor/MeChooseUnitPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            MeClearPanel: {
                cls         : TwnsMeClearPanel?.MeClearPanel,
                skinName    : `resource/skins/mapEditor/MeClearPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeConfirmSaveMapPanel: {
                cls         : Twns.MapEditor?.MeConfirmSaveMapPanel,
                skinName    : `resource/skins/mapEditor/MeConfirmSaveMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeImportPanel: {
                cls         : TwnsMeImportPanel?.MeImportPanel,
                skinName    : `resource/skins/mapEditor/MeImportPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeMapListPanel: {
                cls         : TwnsMeMapListPanel?.MeMapListPanel,
                skinName    : `resource/skins/mapEditor/MeMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MeMapTagPanel: {
                cls         : TwnsMeMapTagPanel?.MeMapTagPanel,
                skinName    : `resource/skins/mapEditor/MeMapTagPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeMfwSettingsPanel: {
                cls         : TwnsMeMfwSettingsPanel?.MeMfwSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeMfwSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyMapDescPanel: {
                cls         : Twns.MapEditor?.MeModifyMapDescPanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapDescPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyMapNamePanel: {
                cls         : TwnsMeModifyMapNamePanel?.MeModifyMapNamePanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeResizePanel: {
                cls         : TwnsMeResizePanel?.MeResizePanel,
                skinName    : `resource/skins/mapEditor/MeResizePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSimSettingsPanel: {
                cls         : TwnsMeSimSettingsPanel?.MeSimSettingsPanel,
                skinName    : `resource/skins/mapEditor/MeSimSettingsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeSymmetryPanel: {
                cls         : TwnsMeSymmetryPanel?.MeSymmetryPanel,
                skinName    : `resource/skins/mapEditor/MeSymmetryPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeTopPanel: {
                cls         : Twns.MapEditor?.MeTopPanel,
                skinName    : `resource/skins/mapEditor/MeTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeVisibilityPanel: {
                cls         : TwnsMeVisibilityPanel?.MeVisibilityPanel,
                skinName    : `resource/skins/mapEditor/MeVisibilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarMenuPanel: {
                cls         : Twns.MapEditor?.MeWarMenuPanel,
                skinName    : `resource/skins/mapEditor/MeWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarRulePanel: {
                cls         : TwnsMeWarRulePanel?.MeWarRulePanel,
                skinName    : `resource/skins/mapEditor/MeWarRulePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeChooseLocationPanel: {
                cls         : TwnsMeChooseLocationPanel?.MeChooseLocationPanel,
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
                cls         : TwnsMmAcceptMapPanel?.MmAcceptMapPanel,
                skinName    : `resource/skins/mapManagement/MmAcceptMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmAvailabilityListPanel: {
                cls         : TwnsMmAvailabilityListPanel?.MmAvailabilityListPanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilityListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmAvailabilitySearchPanel: {
                cls         : TwnsMmAvailabilitySearchPanel?.MmAvailabilitySearchPanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilitySearchPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmCommandPanel: {
                cls         : TwnsMmCommandPanel?.MmCommandPanel,
                skinName    : `resource/skins/mapManagement/MmCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmMainMenuPanel: {
                cls         : TwnsMmMainMenuPanel?.MmMainMenuPanel,
                skinName    : `resource/skins/mapManagement/MmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmMapRenamePanel: {
                cls         : TwnsMmMapRenamePanel?.MmMapRenamePanel,
                skinName    : `resource/skins/mapManagement/MmMapRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmRejectMapPanel: {
                cls         : TwnsMmRejectMapPanel?.MmRejectMapPanel,
                skinName    : `resource/skins/mapManagement/MmRejectMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmReviewListPanel: {
                cls         : TwnsMmReviewListPanel?.MmReviewListPanel,
                skinName    : `resource/skins/mapManagement/MmReviewListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmSetWarRuleAvailabilityPanel: {
                cls         : TwnsMmSetWarRuleAvailabilityPanel?.MmSetWarRuleAvailabilityPanel,
                skinName    : `resource/skins/mapManagement/MmSetWarRuleAvailabilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmTagChangePanel: {
                cls         : TwnsMmTagChangePanel?.MmTagChangePanel,
                skinName    : `resource/skins/mapManagement/MmTagChangePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmTagListPanel: {
                cls         : TwnsMmTagListPanel?.MmTagListPanel,
                skinName    : `resource/skins/mapManagement/MmTagListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MmTagSearchPanel: {
                cls         : TwnsMmTagSearchPanel?.MmTagSearchPanel,
                skinName    : `resource/skins/mapManagement/MmTagSearchPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmWarRuleAvailableCoPanel: {
                cls         : TwnsMmWarRuleAvailableCoPanel?.MmWarRuleAvailableCoPanel,
                skinName    : `resource/skins/mapManagement/MmWarRuleAvailableCoPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MmWarRulePanel: {
                cls         : TwnsMmWarRulePanel?.MmWarRulePanel,
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
                cls         : TwnsMpwWarMenuPanel?.MpwWarMenuPanel,
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
                cls         : TwnsRwReplayListPanel?.RwReplayListPanel,
                skinName    : `resource/skins/replayWar/RwReplayListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            RwReplayProgressPanel: {
                cls         : TwnsRwReplayProgressPanel?.RwReplayProgressPanel,
                skinName    : `resource/skins/replayWar/RwReplayProgressPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwSearchReplayPanel: {
                cls         : TwnsRwSearchReplayPanel?.RwSearchReplayPanel,
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
                cls         : TwnsScrCreateMapListPanel?.ScrCreateMapListPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ScrCreateSearchMapPanel: {
                cls         : TwnsScrCreateSearchMapPanel?.ScrCreateSearchMapPanel,
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
                cls         : TwnsSpmCreateSaveSlotsPanel?.SpmCreateSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmCreateSfwSaveSlotsPanel: {
                cls         : TwnsSpmCreateSfwSaveSlotsPanel?.SpmCreateSfwSaveSlotsPanel,
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
                cls         : TwnsSpwLoadWarPanel?.SpwLoadWarPanel,
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
                cls         : TwnsSpwWarMenuPanel?.SpwWarMenuPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SrrCreateMapListPanel: {
                cls         : TwnsSrrCreateMapListPanel?.SrrCreateMapListPanel,
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
                cls         : TwnsUserChangeDiscordIdPanel?.UserChangeDiscordIdPanel,
                skinName    : `resource/skins/user/UserChangeDiscordIdPanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserChangeNicknamePanel: {
                cls         : TwnsUserChangeNicknamePanel?.UserChangeNicknamePanel,
                skinName    : `resource/skins/user/UserChangeNicknamePanel.exml`,
                layer       : LayerType.Hud1,
            },

            UserGameManagementPanel: {
                cls         : TwnsUserGameManagementPanel?.UserGameManagementPanel,
                skinName    : `resource/skins/user/UserGameManagementPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserLoginBackgroundPanel: {
                cls         : TwnsUserLoginBackgroundPanel?.UserLoginBackgroundPanel,
                skinName    : `resource/skins/user/UserLoginBackgroundPanel.exml`,
                layer       : LayerType.Bottom,
                isExclusive : true,
            },

            UserLoginPanel: {
                cls         : TwnsUserLoginPanel?.UserLoginPanel,
                skinName    : `resource/skins/user/UserLoginPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserOnlineUsersPanel: {
                cls         : TwnsUserOnlineUsersPanel?.UserOnlineUsersPanel,
                skinName    : `resource/skins/user/UserOnlineUsersPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserPanel: {
                cls         : TwnsUserPanel?.UserPanel,
                skinName    : `resource/skins/user/UserPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            UserRegisterPanel: {
                cls         : TwnsUserRegisterPanel?.UserRegisterPanel,
                skinName    : `resource/skins/user/UserRegisterPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetAvatarPanel: {
                cls         : Twns.User?.UserSetAvatarPanel,
                skinName    : `resource/skins/user/UserSetAvatarPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetPasswordPanel: {
                cls         : TwnsUserSetPasswordPanel?.UserSetPasswordPanel,
                skinName    : `resource/skins/user/UserSetPasswordPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetPrivilegePanel: {
                cls         : TwnsUserSetPrivilegePanel?.UserSetPrivilegePanel,
                skinName    : `resource/skins/user/UserSetPrivilegePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetSoundPanel: {
                cls         : TwnsUserSetSoundPanel?.UserSetSoundPanel,
                skinName    : `resource/skins/user/UserSetSoundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetOpacityPanel: {
                cls         : TwnsUserSetOpacityPanel?.UserSetOpacityPanel,
                skinName    : `resource/skins/user/UserSetOpacityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSetStageScalePanel: {
                cls         : TwnsUserSetStageScalePanel?.UserSetStageScalePanel,
                skinName    : `resource/skins/user/UserSetStageScalePanel.exml`,
                layer       : LayerType.Hud0,
            },

            UserSettingsPanel: {
                cls         : TwnsUserSettingsPanel?.UserSettingsPanel,
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
                cls         : TwnsWeActionModifyPanel2?.WeActionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel3: {
                cls         : Twns.WarEvent?.WeActionModifyPanel3,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel3.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel4: {
                cls         : TwnsWeActionModifyPanel4?.WeActionModifyPanel4,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel4.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel5: {
                cls         : TwnsWeActionModifyPanel5?.WeActionModifyPanel5,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel5.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel6: {
                cls         : Twns.WarEvent?.WeActionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel7: {
                cls         : TwnsWeActionModifyPanel7?.WeActionModifyPanel7,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel7.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel10: {
                cls         : TwnsWeActionModifyPanel10?.WeActionModifyPanel10,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel10.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel11: {
                cls         : Twns.WarEvent?.WeActionModifyPanel11,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel11.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel20: {
                cls         : TwnsWeActionModifyPanel20?.WeActionModifyPanel20,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel20.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel21: {
                cls         : TwnsWeActionModifyPanel21?.WeActionModifyPanel21,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel21.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel22: {
                cls         : TwnsWeActionModifyPanel22?.WeActionModifyPanel22,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel22.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel23: {
                cls         : TwnsWeActionModifyPanel23?.WeActionModifyPanel23,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel23.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel24: {
                cls         : TwnsWeActionModifyPanel24?.WeActionModifyPanel24,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel24.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel25: {
                cls         : TwnsWeActionModifyPanel25?.WeActionModifyPanel25,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel25.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel30: {
                cls         : TwnsWeActionModifyPanel30?.WeActionModifyPanel30,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel30.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel40: {
                cls         : TwnsWeActionModifyPanel40?.WeActionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel41: {
                cls         : TwnsWeActionModifyPanel41?.WeActionModifyPanel41,
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
                cls         : TwnsWeActionTypeListPanel?.WeActionTypeListPanel,
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
                cls         : TwnsWeConditionTypeListPanel?.WeConditionTypeListPanel,
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
                cls         : TwnsWeEventRenamePanel?.WeEventRenamePanel,
                skinName    : `resource/skins/warEvent/WeEventRenamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeNodeReplacePanel: {
                cls         : TwnsWeNodeReplacePanel?.WeNodeReplacePanel,
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
                cls         : TwnsWwDeleteWatcherDetailPanel?.WwDeleteWatcherDetailPanel,
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
                cls         : TwnsWwHandleRequestDetailPanel?.WwHandleRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwHandleRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwHandleRequestWarsPanel: {
                cls         : TwnsWwHandleRequestWarsPanel?.WwHandleRequestWarsPanel,
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
                cls         : TwnsWwMakeRequestDetailPanel?.WwMakeRequestDetailPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestDetailPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WwMakeRequestWarsPanel: {
                cls         : TwnsWwMakeRequestWarsPanel?.WwMakeRequestWarsPanel,
                skinName    : `resource/skins/watchWar/WwMakeRequestWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwOngoingWarsPanel: {
                cls         : TwnsWwOngoingWarsPanel?.WwOngoingWarsPanel,
                skinName    : `resource/skins/watchWar/WwOngoingWarsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            WwSearchWarPanel: {
                cls         : TwnsWwSearchWarPanel?.WwSearchWarPanel,
                skinName    : `resource/skins/watchWar/WwSearchWarPanel.exml`,
                layer       : LayerType.Hud0,
            },
        };
    }
}
