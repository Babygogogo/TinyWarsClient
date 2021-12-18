
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
        BwDamagePreviewPanel                : PanelConfig<TwnsBwDamagePreviewPanel.OpenData>;
        BwDialoguePanel                     : PanelConfig<TwnsBwDialoguePanel.OpenData>;
        BwProduceUnitPanel                  : PanelConfig<TwnsBwProduceUnitPanel.OpenData>;
        BwSimpleDialoguePanel               : PanelConfig<TwnsBwSimpleDialoguePanel.OpenData>;
        BwTileBriefPanel                    : PanelConfig<TwnsBwTileBriefPanel.OpenData>;
        BwTileDetailPanel                   : PanelConfig<TwnsBwTileDetailPanel.OpenData>;
        BwUnitActionsPanel                  : PanelConfig<TwnsBwUnitActionsPanel.OpenData>;
        BwUnitBriefPanel                    : PanelConfig<TwnsBwUnitBriefPanel.OpenData>;
        BwUnitDetailPanel                   : PanelConfig<TwnsBwUnitDetailPanel.OpenData>;
        BwUnitListPanel                     : PanelConfig<TwnsBwUnitListPanel.OpenData>;
        BwWarInfoPanel                      : PanelConfig<TwnsBwWarInfoPanel.OpenData>;
        BwWarPanel                          : PanelConfig<TwnsBwWarPanel.OpenData>;

        BroadcastPanel                      : PanelConfig<TwnsBroadcastPanel.OpenData>;

        ChangeLogAddPanel                   : PanelConfig<TwnsChangeLogAddPanel.OpenData>;
        ChangeLogModifyPanel                : PanelConfig<TwnsChangeLogModifyPanel.OpenData>;
        ChangeLogPanel                      : PanelConfig<TwnsChangeLogPanel.OpenData>;

        CcrCreateMapListPanel               : PanelConfig<TwnsCcrCreateMapListPanel.OpenData>;
        CcrCreateSearchMapPanel             : PanelConfig<TwnsCcrCreateSearchMapPanel.OpenData>;
        CcrCreateSettingsPanel              : PanelConfig<TwnsCcrCreateSettingsPanel.OpenData>;
        CcrJoinRoomListPanel                : PanelConfig<TwnsCcrJoinRoomListPanel.OpenData>;
        CcrMainMenuPanel                    : PanelConfig<TwnsCcrMainMenuPanel.OpenData>;
        CcrMyRoomListPanel                  : PanelConfig<TwnsCcrMyRoomListPanel.OpenData>;
        CcrRoomInfoPanel                    : PanelConfig<TwnsCcrRoomInfoPanel.OpenData>;

        CcwMyWarListPanel                   : PanelConfig<TwnsCcwMyWarListPanel.OpenData>;

        ChatPanel                           : PanelConfig<TwnsChatPanel.OpenData>;

        CommonAlertPanel                    : PanelConfig<TwnsCommonAlertPanel.OpenData>;
        CommonBanCoPanel                    : PanelConfig<TwnsCommonBanCoPanel.OpenData>;
        CommonBlockPanel                    : PanelConfig<TwnsCommonBlockPanel.OpenData>;
        CommonChangeVersionPanel            : PanelConfig<TwnsCommonChangeVersionPanel.OpenData>;
        CommonChooseCoPanel                 : PanelConfig<TwnsCommonChooseCoPanel.OpenData>;
        CommonChooseCoSkillTypePanel        : PanelConfig<TwnsCommonChooseCoSkillTypePanel.OpenData>;
        CommonChooseCustomCounterIdPanel    : PanelConfig<TwnsCommonChooseCustomCounterIdPanel.OpenData>;
        CommonChooseGridIndexPanel          : PanelConfig<TwnsCommonChooseGridIndexPanel.OpenData>;
        CommonChooseLocationPanel           : PanelConfig<TwnsCommonChooseLocationPanel.OpenData>;
        CommonChoosePlayerAliveStatePanel   : PanelConfig<TwnsCommonChoosePlayerAliveStatePanel.OpenData>;
        CommonChoosePlayerIndexPanel        : PanelConfig<TwnsCommonChoosePlayerIndexPanel.OpenData>;
        CommonChooseTeamIndexPanel          : PanelConfig<TwnsCommonChooseTeamIndexPanel.OpenData>;
        CommonChooseTileTypePanel           : PanelConfig<TwnsCommonChooseTileTypePanel.OpenData>;
        CommonChooseUnitTypePanel           : PanelConfig<TwnsCommonChooseUnitTypePanel.OpenData>;
        CommonChooseWarEventIdPanel         : PanelConfig<TwnsCommonChooseWarEventIdPanel.OpenData>;
        CommonChooseWeatherTypePanel        : PanelConfig<TwnsCommonChooseWeatherTypePanel.OpenData>;
        CommonCoInfoPanel                   : PanelConfig<TwnsCommonCoInfoPanel.OpenData>;
        CommonCoListPanel                   : PanelConfig<TwnsCommonCoListPanel.OpenData>;
        CommonConfirmPanel                  : PanelConfig<TwnsCommonConfirmPanel.OpenData>;
        CommonDamageChartPanel              : PanelConfig<TwnsCommonDamageChartPanel.OpenData>;
        CommonErrorPanel                    : PanelConfig<TwnsCommonErrorPanel.OpenData>;
        CommonHelpPanel                     : PanelConfig<TwnsCommonHelpPanel.OpenData>;
        CommonInputPanel                    : PanelConfig<TwnsCommonInputPanel.OpenData>;
        CommonJoinRoomPasswordPanel         : PanelConfig<TwnsCommonJoinRoomPasswordPanel.OpenData>;
        CommonRankListPanel                 : PanelConfig<TwnsCommonRankListPanel.OpenData>;
        CommonServerStatusPanel             : PanelConfig<TwnsCommonServerStatusPanel.OpenData>;

        HrwReplayProgressPanel              : PanelConfig<TwnsHrwReplayProgressPanel.OpenData>;
        HrwTopPanel                         : PanelConfig<TwnsHrwTopPanel.OpenData>;
        HrwWarMenuPanel                     : PanelConfig<TwnsHrwWarMenuPanel.OpenData>;

        LobbyBackgroundPanel                : PanelConfig<TwnsLobbyBackgroundPanel.OpenData>;
        LobbyBottomPanel                    : PanelConfig<TwnsLobbyBottomPanel.OpenData>;
        LobbyPanel                          : PanelConfig<TwnsLobbyPanel.OpenData>;
        LobbyTopPanel                       : PanelConfig<TwnsLobbyTopPanel.OpenData>;
        LobbyTopRightPanel                  : PanelConfig<TwnsLobbyTopRightPanel.OpenData>;

        McrCreateMapListPanel               : PanelConfig<TwnsMcrCreateMapListPanel.OpenData>;
        McrCreateSearchMapPanel             : PanelConfig<TwnsMcrCreateSearchMapPanel.OpenData>;
        McrCreateSettingsPanel              : PanelConfig<TwnsMcrCreateSettingsPanel.OpenData>;
        McrJoinRoomListPanel                : PanelConfig<TwnsMcrJoinRoomListPanel.OpenData>;
        McrMainMenuPanel                    : PanelConfig<TwnsMcrMainMenuPanel.OpenData>;
        McrMyRoomListPanel                  : PanelConfig<TwnsMcrMyRoomListPanel.OpenData>;
        McrRoomInfoPanel                    : PanelConfig<TwnsMcrRoomInfoPanel.OpenData>;

        McwMyWarListPanel                   : PanelConfig<TwnsMcwMyWarListPanel.OpenData>;

        MeAddWarEventToRulePanel            : PanelConfig<TwnsMeAddWarEventToRulePanel.OpenData>;
        MeAvailableCoPanel                  : PanelConfig<TwnsMeAvailableCoPanel.OpenData>;
        MeChooseTileBasePanel               : PanelConfig<TwnsMeChooseTileBasePanel.OpenData>;
        MeChooseTileDecoratorPanel          : PanelConfig<TwnsMeChooseTileDecoratorPanel.OpenData>;
        MeChooseTileObjectPanel             : PanelConfig<TwnsMeChooseTileObjectPanel.OpenData>;
        MeChooseUnitPanel                   : PanelConfig<TwnsMeChooseUnitPanel.OpenData>;
        MeClearPanel                        : PanelConfig<TwnsMeClearPanel.OpenData>;
        MeConfirmSaveMapPanel               : PanelConfig<TwnsMeConfirmSaveMapPanel.OpenData>;
        MeImportPanel                       : PanelConfig<TwnsMeImportPanel.OpenData>;
        MeMapListPanel                      : PanelConfig<TwnsMeMapListPanel.OpenData>;
        MeMapTagPanel                       : PanelConfig<TwnsMeMapTagPanel.OpenData>;
        MeMfwSettingsPanel                  : PanelConfig<TwnsMeMfwSettingsPanel.OpenData>;
        MeModifyMapNamePanel                : PanelConfig<TwnsMeModifyMapNamePanel.OpenData>;
        MeModifyRuleNamePanel               : PanelConfig<TwnsMeModifyRuleNamePanel.OpenData>;
        MeOffsetPanel                       : PanelConfig<TwnsMeOffsetPanel.OpenData>;
        MeResizePanel                       : PanelConfig<TwnsMeResizePanel.OpenData>;
        MeSimSettingsPanel                  : PanelConfig<TwnsMeSimSettingsPanel.OpenData>;
        MeSymmetryPanel                     : PanelConfig<TwnsMeSymmetryPanel.OpenData>;
        MeTopPanel                          : PanelConfig<TwnsMeTopPanel.OpenData>;
        MeVisibilityPanel                   : PanelConfig<TwnsMeVisibilityPanel.OpenData>;
        MeWarMenuPanel                      : PanelConfig<TwnsMeWarMenuPanel.OpenData>;
        MeWarRulePanel                      : PanelConfig<TwnsMeWarRulePanel.OpenData>;
        MeChooseLocationPanel               : PanelConfig<TwnsMeChooseLocationPanel.OpenData>;

        MfrCreateSettingsPanel              : PanelConfig<TwnsMfrCreateSettingsPanel.OpenData>;
        MfrJoinRoomListPanel                : PanelConfig<TwnsMfrJoinRoomListPanel.OpenData>;
        MfrMainMenuPanel                    : PanelConfig<TwnsMfrMainMenuPanel.OpenData>;
        MfrMyRoomListPanel                  : PanelConfig<TwnsMfrMyRoomListPanel.OpenData>;
        MfrRoomInfoPanel                    : PanelConfig<TwnsMfrRoomInfoPanel.OpenData>;

        MfwMyWarListPanel                   : PanelConfig<TwnsMfwMyWarListPanel.OpenData>;

        MmAcceptMapPanel                    : PanelConfig<TwnsMmAcceptMapPanel.OpenData>;
        MmAvailabilityChangePanel           : PanelConfig<TwnsMmAvailabilityChangePanel.OpenData>;
        MmAvailabilityListPanel             : PanelConfig<TwnsMmAvailabilityListPanel.OpenData>;
        MmAvailabilitySearchPanel           : PanelConfig<TwnsMmAvailabilitySearchPanel.OpenData>;
        MmMainMenuPanel                     : PanelConfig<TwnsMmMainMenuPanel.OpenData>;
        MmMapRenamePanel                    : PanelConfig<TwnsMmMapRenamePanel.OpenData>;
        MmRejectMapPanel                    : PanelConfig<TwnsMmRejectMapPanel.OpenData>;
        MmReviewListPanel                   : PanelConfig<TwnsMmReviewListPanel.OpenData>;
        MmTagChangePanel                    : PanelConfig<TwnsMmTagChangePanel.OpenData>;
        MmTagListPanel                      : PanelConfig<TwnsMmTagListPanel.OpenData>;
        MmTagSearchPanel                    : PanelConfig<TwnsMmTagSearchPanel.OpenData>;
        MmWarRuleAvailableCoPanel           : PanelConfig<TwnsMmWarRuleAvailableCoPanel.OpenData>;
        MmWarRulePanel                      : PanelConfig<TwnsMmWarRulePanel.OpenData>;

        MpwSidePanel                        : PanelConfig<TwnsMpwSidePanel.OpenData>;
        MpwTopPanel                         : PanelConfig<TwnsMpwTopPanel.OpenData>;
        MpwWarMenuPanel                     : PanelConfig<TwnsMpwWarMenuPanel.OpenData>;

        MrrMainMenuPanel                    : PanelConfig<TwnsMrrMainMenuPanel.OpenData>;
        MrrMyRoomListPanel                  : PanelConfig<TwnsMrrMyRoomListPanel.OpenData>;
        MrrPreviewMapListPanel              : PanelConfig<TwnsMrrPreviewMapListPanel.OpenData>;
        MrrRoomInfoPanel                    : PanelConfig<TwnsMrrRoomInfoPanel.OpenData>;
        MrrSetMaxConcurrentCountPanel       : PanelConfig<TwnsMrrSetMaxConcurrentCountPanel.OpenData>;

        MrwMyWarListPanel                   : PanelConfig<TwnsMrwMyWarListPanel.OpenData>;

        RwReplayListPanel                   : PanelConfig<TwnsRwReplayListPanel.OpenData>;
        RwReplayProgressPanel               : PanelConfig<TwnsRwReplayProgressPanel.OpenData>;
        RwSearchReplayPanel                 : PanelConfig<TwnsRwSearchReplayPanel.OpenData>;
        RwTopPanel                          : PanelConfig<TwnsRwTopPanel.OpenData>;
        RwWarMenuPanel                      : PanelConfig<TwnsRwWarMenuPanel.OpenData>;

        ScrCreateMapListPanel               : PanelConfig<TwnsScrCreateMapListPanel.OpenData>;
        ScrCreateSaveSlotsPanel             : PanelConfig<TwnsScrCreateSaveSlotsPanel.OpenData>;
        ScrCreateSearchMapPanel             : PanelConfig<TwnsScrCreateSearchMapPanel.OpenData>;
        ScrCreateSettingsPanel              : PanelConfig<TwnsScrCreateSettingsPanel.OpenData>;

        SpmCreateSfwSaveSlotsPanel          : PanelConfig<TwnsSpmCreateSfwSaveSlotsPanel.OpenData>;
        SpmMainMenuPanel                    : PanelConfig<TwnsSpmMainMenuPanel.OpenData>;
        SpmWarListPanel                     : PanelConfig<TwnsSpmWarListPanel.OpenData>;

        SpwLoadWarPanel                     : PanelConfig<TwnsSpwLoadWarPanel.OpenData>;
        SpwSidePanel                        : PanelConfig<TwnsSpwSidePanel.OpenData>;
        SpwTopPanel                         : PanelConfig<TwnsSpwTopPanel.OpenData>;
        SpwWarMenuPanel                     : PanelConfig<TwnsSpwWarMenuPanel.OpenData>;

        UserChangeDiscordIdPanel            : PanelConfig<TwnsUserChangeDiscordIdPanel.OpenData>;
        UserChangeNicknamePanel             : PanelConfig<TwnsUserChangeNicknamePanel.OpenData>;
        UserLoginBackgroundPanel            : PanelConfig<TwnsUserLoginBackgroundPanel.OpenData>;
        UserLoginPanel                      : PanelConfig<TwnsUserLoginPanel.OpenData>;
        UserOnlineUsersPanel                : PanelConfig<TwnsUserOnlineUsersPanel.OpenData>;
        UserPanel                           : PanelConfig<TwnsUserPanel.OpenData>;
        UserRegisterPanel                   : PanelConfig<TwnsUserRegisterPanel.OpenData>;
        UserSetAvatarPanel                  : PanelConfig<TwnsUserSetAvatarPanel.OpenData>;
        UserSetPasswordPanel                : PanelConfig<TwnsUserSetPasswordPanel.OpenData>;
        UserSetPrivilegePanel               : PanelConfig<TwnsUserSetPrivilegePanel.OpenData>;
        UserSetSoundPanel                   : PanelConfig<TwnsUserSetSoundPanel.OpenData>;
        UserSetStageScalePanel              : PanelConfig<TwnsUserSetStageScalePanel.OpenData>;
        UserSettingsPanel                   : PanelConfig<TwnsUserSettingsPanel.OpenData>;

        WeActionAddUnitListPanel            : PanelConfig<TwnsWeActionAddUnitListPanel.OpenData>;
        WeActionModifyPanel1                : PanelConfig<TwnsWeActionModifyPanel1.OpenData>;
        WeActionModifyPanel2                : PanelConfig<TwnsWeActionModifyPanel2.OpenData>;
        WeActionModifyPanel3                : PanelConfig<TwnsWeActionModifyPanel3.OpenData>;
        WeActionModifyPanel4                : PanelConfig<TwnsWeActionModifyPanel4.OpenData>;
        WeActionModifyPanel5                : PanelConfig<TwnsWeActionModifyPanel5.OpenData>;
        WeActionModifyPanel6                : PanelConfig<TwnsWeActionModifyPanel6.OpenData>;
        WeActionModifyPanel7                : PanelConfig<TwnsWeActionModifyPanel7.OpenData>;
        WeActionModifyPanel10               : PanelConfig<TwnsWeActionModifyPanel10.OpenData>;
        WeActionModifyPanel20               : PanelConfig<TwnsWeActionModifyPanel20.OpenData>;
        WeActionModifyPanel21               : PanelConfig<TwnsWeActionModifyPanel21.OpenData>;
        WeActionModifyPanel22               : PanelConfig<TwnsWeActionModifyPanel22.OpenData>;
        WeActionModifyPanel23               : PanelConfig<TwnsWeActionModifyPanel23.OpenData>;
        WeActionModifyPanel24               : PanelConfig<TwnsWeActionModifyPanel24.OpenData>;
        WeActionModifyPanel25               : PanelConfig<TwnsWeActionModifyPanel25.OpenData>;
        WeActionModifyPanel30               : PanelConfig<TwnsWeActionModifyPanel30.OpenData>;
        WeActionReplacePanel                : PanelConfig<TwnsWeActionReplacePanel.OpenData>;
        WeActionTypeListPanel               : PanelConfig<TwnsWeActionTypeListPanel.OpenData>;
        WeCommandPanel                      : PanelConfig<TwnsWeCommandPanel.OpenData>;
        WeConditionModifyPanel1             : PanelConfig<TwnsWeConditionModifyPanel1.OpenData>;
        WeConditionModifyPanel2             : PanelConfig<TwnsWeConditionModifyPanel2.OpenData>;
        WeConditionModifyPanel3             : PanelConfig<TwnsWeConditionModifyPanel3.OpenData>;
        WeConditionModifyPanel4             : PanelConfig<TwnsWeConditionModifyPanel4.OpenData>;
        WeConditionModifyPanel5             : PanelConfig<TwnsWeConditionModifyPanel5.OpenData>;
        WeConditionModifyPanel6             : PanelConfig<TwnsWeConditionModifyPanel6.OpenData>;
        WeConditionModifyPanel10            : PanelConfig<TwnsWeConditionModifyPanel10.OpenData>;
        WeConditionModifyPanel11            : PanelConfig<TwnsWeConditionModifyPanel11.OpenData>;
        WeConditionModifyPanel12            : PanelConfig<TwnsWeConditionModifyPanel12.OpenData>;
        WeConditionModifyPanel13            : PanelConfig<TwnsWeConditionModifyPanel13.OpenData>;
        WeConditionModifyPanel14            : PanelConfig<TwnsWeConditionModifyPanel14.OpenData>;
        WeConditionModifyPanel20            : PanelConfig<TwnsWeConditionModifyPanel20.OpenData>;
        WeConditionModifyPanel21            : PanelConfig<TwnsWeConditionModifyPanel21.OpenData>;
        WeConditionModifyPanel22            : PanelConfig<TwnsWeConditionModifyPanel22.OpenData>;
        WeConditionModifyPanel23            : PanelConfig<TwnsWeConditionModifyPanel23.OpenData>;
        WeConditionModifyPanel30            : PanelConfig<TwnsWeConditionModifyPanel30.OpenData>;
        WeConditionModifyPanel31            : PanelConfig<TwnsWeConditionModifyPanel31.OpenData>;
        WeConditionModifyPanel32            : PanelConfig<TwnsWeConditionModifyPanel32.OpenData>;
        WeConditionModifyPanel40            : PanelConfig<TwnsWeConditionModifyPanel40.OpenData>;
        WeConditionModifyPanel50            : PanelConfig<TwnsWeConditionModifyPanel50.OpenData>;
        WeConditionModifyPanel60            : PanelConfig<TwnsWeConditionModifyPanel60.OpenData>;
        WeConditionReplacePanel             : PanelConfig<TwnsWeConditionReplacePanel.OpenData>;
        WeConditionTypeListPanel            : PanelConfig<TwnsWeConditionTypeListPanel.OpenData>;
        WeDialogueBackgroundPanel           : PanelConfig<TwnsWeDialogueBackgroundPanel.OpenData>;
        WeEventListPanel                    : PanelConfig<TwnsWeEventListPanel.OpenData>;
        WeEventRenamePanel                  : PanelConfig<TwnsWeEventRenamePanel.OpenData>;
        WeNodeReplacePanel                  : PanelConfig<TwnsWeNodeReplacePanel.OpenData>;

        WarMapBuildingListPanel             : PanelConfig<TwnsWarMapBuildingListPanel.OpenData>;

        WwDeleteWatcherDetailPanel          : PanelConfig<TwnsWwDeleteWatcherDetailPanel.OpenData>;
        WwDeleteWatcherWarsPanel            : PanelConfig<TwnsWwDeleteWatcherWarsPanel.OpenData>;
        WwHandleRequestDetailPanel          : PanelConfig<TwnsWwHandleRequestDetailPanel.OpenData>;
        WwHandleRequestWarsPanel            : PanelConfig<TwnsWwHandleRequestWarsPanel.OpenData>;
        WwMainMenuPanel                     : PanelConfig<TwnsWwMainMenuPanel.OpenData>;
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
                cls         : TwnsBwDamagePreviewPanel?.BwDamagePreviewPanel,
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
                cls         : TwnsBwProduceUnitPanel?.BwProduceUnitPanel,
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
                cls         : TwnsBwUnitActionsPanel?.BwUnitActionsPanel,
                skinName    : `resource/skins/baseWar/BwUnitActionsPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitBriefPanel: {
                cls         : TwnsBwUnitBriefPanel?.BwUnitBriefPanel,
                skinName    : `resource/skins/baseWar/BwUnitBriefPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitDetailPanel: {
                cls         : TwnsBwUnitDetailPanel?.BwUnitDetailPanel,
                skinName    : `resource/skins/baseWar/BwUnitDetailPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwUnitListPanel: {
                cls         : TwnsBwUnitListPanel?.BwUnitListPanel,
                skinName    : `resource/skins/baseWar/BwUnitListPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            BwWarInfoPanel: {
                cls         : TwnsBwWarInfoPanel?.BwWarInfoPanel,
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
                cls         : TwnsCcrCreateSettingsPanel?.CcrCreateSettingsPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrJoinRoomListPanel: {
                cls         : TwnsCcrJoinRoomListPanel?.CcrJoinRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMainMenuPanel: {
                cls         : TwnsCcrMainMenuPanel?.CcrMainMenuPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrMyRoomListPanel: {
                cls         : TwnsCcrMyRoomListPanel?.CcrMyRoomListPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            CcrRoomInfoPanel: {
                cls         : TwnsCcrRoomInfoPanel?.CcrRoomInfoPanel,
                skinName    : `resource/skins/coopCustomRoom/CcrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            CcwMyWarListPanel: {
                cls         : TwnsCcwMyWarListPanel?.CcwMyWarListPanel,
                skinName    : `resource/skins/coopCustomWar/CcwMyWarListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ChatPanel: {
                cls         : TwnsChatPanel?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
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

            CommonChooseTeamIndexPanel: {
                cls         : TwnsCommonChooseTeamIndexPanel?.CommonChooseTeamIndexPanel,
                skinName    : `resource/skins/common/CommonChooseTeamIndexPanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseTileTypePanel: {
                cls         : TwnsCommonChooseTileTypePanel?.CommonChooseTileTypePanel,
                skinName    : `resource/skins/common/CommonChooseTileTypePanel.exml`,
                layer       : LayerType.Hud0,
            },

            CommonChooseUnitTypePanel: {
                cls         : TwnsCommonChooseUnitTypePanel?.CommonChooseUnitTypePanel,
                skinName    : `resource/skins/common/CommonChooseUnitTypePanel.exml`,
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

            CommonJoinRoomPasswordPanel: {
                cls         : TwnsCommonJoinRoomPasswordPanel?.CommonJoinRoomPasswordPanel,
                skinName    : `resource/skins/common/CommonJoinRoomPasswordPanel.exml`,
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
                cls         : TwnsHrwTopPanel?.HrwTopPanel,
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
                cls         : TwnsLobbyPanel?.LobbyPanel,
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
                cls         : TwnsMcrCreateMapListPanel?.McrCreateMapListPanel,
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
                cls         : TwnsMcrCreateSettingsPanel?.McrCreateSettingsPanel,
                skinName    : `resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrJoinRoomListPanel: {
                cls         : TwnsMcrJoinRoomListPanel?.McrJoinRoomListPanel,
                skinName    : `resource/skins/multiCustomRoom/McrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMainMenuPanel: {
                cls         : TwnsMcrMainMenuPanel?.McrMainMenuPanel,
                skinName    : `resource/skins/multiCustomRoom/McrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            McrMyRoomListPanel: {
                cls         : TwnsMcrMyRoomListPanel?.McrMyRoomListPanel,
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

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            McwMyWarListPanel: {
                cls         : TwnsMcwMyWarListPanel?.McwMyWarListPanel,
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
                cls         : TwnsMeConfirmSaveMapPanel?.MeConfirmSaveMapPanel,
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

            MeModifyMapNamePanel: {
                cls         : TwnsMeModifyMapNamePanel?.MeModifyMapNamePanel,
                skinName    : `resource/skins/mapEditor/MeModifyMapNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeModifyRuleNamePanel: {
                cls         : TwnsMeModifyRuleNamePanel?.MeModifyRuleNamePanel,
                skinName    : `resource/skins/mapEditor/MeModifyRuleNamePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeOffsetPanel: {
                cls         : TwnsMeOffsetPanel?.MeOffsetPanel,
                skinName    : `resource/skins/mapEditor/MeOffsetPanel.exml`,
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
                cls         : TwnsMeTopPanel?.MeTopPanel,
                skinName    : `resource/skins/mapEditor/MeTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeVisibilityPanel: {
                cls         : TwnsMeVisibilityPanel?.MeVisibilityPanel,
                skinName    : `resource/skins/mapEditor/MeVisibilityPanel.exml`,
                layer       : LayerType.Hud0,
            },

            MeWarMenuPanel: {
                cls         : TwnsMeWarMenuPanel?.MeWarMenuPanel,
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
                cls         : TwnsMfrCreateSettingsPanel?.MfrCreateSettingsPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrJoinRoomListPanel: {
                cls         : TwnsMfrJoinRoomListPanel?.MfrJoinRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrJoinRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMainMenuPanel: {
                cls         : TwnsMfrMainMenuPanel?.MfrMainMenuPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrMyRoomListPanel: {
                cls         : TwnsMfrMyRoomListPanel?.MfrMyRoomListPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MfrRoomInfoPanel: {
                cls         : TwnsMfrRoomInfoPanel?.MfrRoomInfoPanel,
                skinName    : `resource/skins/multiFreeRoom/MfrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MfwMyWarListPanel: {
                cls         : TwnsMfwMyWarListPanel?.MfwMyWarListPanel,
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

            MmAvailabilityChangePanel: {
                cls         : TwnsMmAvailabilityChangePanel?.MmAvailabilityChangePanel,
                skinName    : `resource/skins/mapManagement/MmAvailabilityChangePanel.exml`,
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
            MpwSidePanel: {
                cls         : TwnsMpwSidePanel?.MpwSidePanel,
                skinName    : `resource/skins/multiPlayerWar/MpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            MpwTopPanel: {
                cls         : TwnsMpwTopPanel?.MpwTopPanel,
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
                cls         : TwnsMrrMainMenuPanel?.MrrMainMenuPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrMyRoomListPanel: {
                cls         : TwnsMrrMyRoomListPanel?.MrrMyRoomListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrMyRoomListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrPreviewMapListPanel: {
                cls         : TwnsMrrPreviewMapListPanel?.MrrPreviewMapListPanel,
                skinName    : `resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrRoomInfoPanel: {
                cls         : TwnsMrrRoomInfoPanel?.MrrRoomInfoPanel,
                skinName    : `resource/skins/multiRankRoom/MrrRoomInfoPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            MrrSetMaxConcurrentCountPanel: {
                cls         : TwnsMrrSetMaxConcurrentCountPanel?.MrrSetMaxConcurrentCountPanel,
                skinName    : `resource/skins/multiRankRoom/MrrSetMaxConcurrentCountPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            MrwMyWarListPanel: {
                cls         : TwnsMrwMyWarListPanel?.MrwMyWarListPanel,
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
                cls         : TwnsRwTopPanel?.RwTopPanel,
                skinName    : `resource/skins/replayWar/RwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            RwWarMenuPanel: {
                cls         : TwnsRwWarMenuPanel?.RwWarMenuPanel,
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

            ScrCreateSaveSlotsPanel: {
                cls         : TwnsScrCreateSaveSlotsPanel?.ScrCreateSaveSlotsPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ScrCreateSearchMapPanel: {
                cls         : TwnsScrCreateSearchMapPanel?.ScrCreateSearchMapPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSearchMapPanel.exml`,
                layer       : LayerType.Hud0,
            },

            ScrCreateSettingsPanel: {
                cls         : TwnsScrCreateSettingsPanel?.ScrCreateSettingsPanel,
                skinName    : `resource/skins/singleCustomRoom/ScrCreateSettingsPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            SpmCreateSfwSaveSlotsPanel: {
                cls         : TwnsSpmCreateSfwSaveSlotsPanel?.SpmCreateSfwSaveSlotsPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmCreateSfwSaveSlotsPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpmMainMenuPanel: {
                cls         : TwnsSpmMainMenuPanel?.SpmMainMenuPanel,
                skinName    : `resource/skins/singlePlayerMode/SpmMainMenuPanel.exml`,
                layer       : LayerType.Scene,
                isExclusive : true,
            },

            SpmWarListPanel: {
                cls         : TwnsSpmWarListPanel?.SpmWarListPanel,
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
                cls         : TwnsSpwSidePanel?.SpwSidePanel,
                skinName    : `resource/skins/singlePlayerWar/SpwSidePanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwTopPanel: {
                cls         : TwnsSpwTopPanel?.SpwTopPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwTopPanel.exml`,
                layer       : LayerType.Hud0,
            },

            SpwWarMenuPanel: {
                cls         : TwnsSpwWarMenuPanel?.SpwWarMenuPanel,
                skinName    : `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`,
                layer       : LayerType.Hud0,
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
                cls         : TwnsUserSetAvatarPanel?.UserSetAvatarPanel,
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
                cls         : TwnsWeActionAddUnitListPanel?.WeActionAddUnitListPanel,
                skinName    : `resource/skins/warEvent/WeActionAddUnitListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel1: {
                cls         : TwnsWeActionModifyPanel1?.WeActionModifyPanel1,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel1.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel2: {
                cls         : TwnsWeActionModifyPanel2?.WeActionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeActionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionModifyPanel3: {
                cls         : TwnsWeActionModifyPanel3?.WeActionModifyPanel3,
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
                cls         : TwnsWeActionModifyPanel6?.WeActionModifyPanel6,
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

            WeActionReplacePanel: {
                cls         : TwnsWeActionReplacePanel?.WeActionReplacePanel,
                skinName    : `resource/skins/warEvent/WeActionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeActionTypeListPanel: {
                cls         : TwnsWeActionTypeListPanel?.WeActionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeActionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeCommandPanel: {
                cls         : TwnsWeCommandPanel?.WeCommandPanel,
                skinName    : `resource/skins/warEvent/WeCommandPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel1: {
                cls         : TwnsWeConditionModifyPanel1?.WeConditionModifyPanel1,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel1.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel2: {
                cls         : TwnsWeConditionModifyPanel2?.WeConditionModifyPanel2,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel2.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel3: {
                cls         : TwnsWeConditionModifyPanel3?.WeConditionModifyPanel3,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel3.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel4: {
                cls         : TwnsWeConditionModifyPanel4?.WeConditionModifyPanel4,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel4.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel5: {
                cls         : TwnsWeConditionModifyPanel5?.WeConditionModifyPanel5,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel5.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel6: {
                cls         : TwnsWeConditionModifyPanel6?.WeConditionModifyPanel6,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel6.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel10: {
                cls         : TwnsWeConditionModifyPanel10?.WeConditionModifyPanel10,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel10.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel11: {
                cls         : TwnsWeConditionModifyPanel11?.WeConditionModifyPanel11,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel11.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel12: {
                cls         : TwnsWeConditionModifyPanel12?.WeConditionModifyPanel12,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel12.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel13: {
                cls         : TwnsWeConditionModifyPanel13?.WeConditionModifyPanel13,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel13.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel14: {
                cls         : TwnsWeConditionModifyPanel14?.WeConditionModifyPanel14,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel14.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel20: {
                cls         : TwnsWeConditionModifyPanel20?.WeConditionModifyPanel20,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel20.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel21: {
                cls         : TwnsWeConditionModifyPanel21?.WeConditionModifyPanel21,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel21.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel22: {
                cls         : TwnsWeConditionModifyPanel22?.WeConditionModifyPanel22,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel22.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel23: {
                cls         : TwnsWeConditionModifyPanel23?.WeConditionModifyPanel23,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel23.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel30: {
                cls         : TwnsWeConditionModifyPanel30?.WeConditionModifyPanel30,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel30.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel31: {
                cls         : TwnsWeConditionModifyPanel31?.WeConditionModifyPanel31,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel31.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel32: {
                cls         : TwnsWeConditionModifyPanel32?.WeConditionModifyPanel32,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel32.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel40: {
                cls         : TwnsWeConditionModifyPanel40?.WeConditionModifyPanel40,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel40.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel50: {
                cls         : TwnsWeConditionModifyPanel50?.WeConditionModifyPanel50,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel50.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel60: {
                cls         : TwnsWeConditionModifyPanel60?.WeConditionModifyPanel60,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel60.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionReplacePanel: {
                cls         : TwnsWeConditionReplacePanel?.WeConditionReplacePanel,
                skinName    : `resource/skins/warEvent/WeConditionReplacePanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionTypeListPanel: {
                cls         : TwnsWeConditionTypeListPanel?.WeConditionTypeListPanel,
                skinName    : `resource/skins/warEvent/WeConditionTypeListPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeDialogueBackgroundPanel: {
                cls         : TwnsWeDialogueBackgroundPanel?.WeDialogueBackgroundPanel,
                skinName    : `resource/skins/warEvent/WeDialogueBackgroundPanel.exml`,
                layer       : LayerType.Hud0,
            },

            WeEventListPanel: {
                cls         : TwnsWeEventListPanel?.WeEventListPanel,
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
                cls         : TwnsWarMapBuildingListPanel?.WarMapBuildingListPanel,
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
                cls         : TwnsWwDeleteWatcherWarsPanel?.WwDeleteWatcherWarsPanel,
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
                cls         : TwnsWwMainMenuPanel?.WwMainMenuPanel,
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
