
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsPanelConfig {
    import LayerType    = Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel2.UiPanel2<T>;
        skinName        : string;
        layer           : LayerType;
        isExclusive?    : boolean;
        needCache?      : boolean;
    };

    export let Dict: {
        BwBackgroundPanel               : PanelConfig<TwnsBwBackgroundPanel.OpenData>;
        BwBeginTurnPanel                : PanelConfig<TwnsBwBeginTurnPanel.OpenData>;
        BwCaptureProgressPanel          : PanelConfig<TwnsBwCaptureProgressPanel.OpenData>;
        BwDamagePreviewPanel            : PanelConfig<TwnsBwDamagePreviewPanel.OpenData>;
        BwDialoguePanel                 : PanelConfig<TwnsBwDialoguePanel.OpenData>;
        BwProduceUnitPanel              : PanelConfig<TwnsBwProduceUnitPanel.OpenData>;
        BwSimpleDialoguePanel           : PanelConfig<TwnsBwSimpleDialoguePanel.OpenData>;
        BwTileBriefPanel                : PanelConfig<TwnsBwTileBriefPanel.OpenData>;
        BwTileDetailPanel               : PanelConfig<TwnsBwTileDetailPanel.OpenData>;
        BwUnitActionsPanel              : PanelConfig<TwnsBwUnitActionsPanel.OpenData>;
        BwUnitBriefPanel                : PanelConfig<TwnsBwUnitBriefPanel.OpenData>;
        BwUnitDetailPanel               : PanelConfig<TwnsBwUnitDetailPanel.OpenData>;
        BwUnitListPanel                 : PanelConfig<TwnsBwUnitListPanel.OpenData>;
        BwWarInfoPanel                  : PanelConfig<TwnsBwWarInfoPanel.OpenData>;
        BwWarPanel                      : PanelConfig<TwnsBwWarPanel.OpenData>;

        BroadcastPanel                  : PanelConfig<TwnsBroadcastPanel.OpenData>;

        ChatPanel                       : PanelConfig<TwnsChatPanel.OpenData>;

        LobbyBackgroundPanel            : PanelConfig<TwnsLobbyBackgroundPanel.OpenData>;
        LobbyBottomPanel                : PanelConfig<TwnsLobbyBottomPanel.OpenData>;
        LobbyPanel                      : PanelConfig<TwnsLobbyPanel.OpenData>;
        LobbyTopPanel                   : PanelConfig<TwnsLobbyTopPanel.OpenData>;
        LobbyTopRightPanel              : PanelConfig<TwnsLobbyTopRightPanel.OpenData>;

        MfrCreateSettingsPanel          : PanelConfig<TwnsMfrCreateSettingsPanel.OpenData>;
        MfrJoinRoomListPanel            : PanelConfig<TwnsMfrJoinRoomListPanel.OpenData>;
        MfrMainMenuPanel                : PanelConfig<TwnsMfrMainMenuPanel.OpenData>;
        MfrMyRoomListPanel              : PanelConfig<TwnsMfrMyRoomListPanel.OpenData>;
        MfrRoomInfoPanel                : PanelConfig<TwnsMfrRoomInfoPanel.OpenData>;

        MfwMyWarListPanel               : PanelConfig<TwnsMfwMyWarListPanel.OpenData>;

        MpwSidePanel                    : PanelConfig<TwnsMpwSidePanel.OpenData>;
        MpwTopPanel                     : PanelConfig<TwnsMpwTopPanel.OpenData>;
        MpwWarMenuPanel                 : PanelConfig<TwnsMpwWarMenuPanel.OpenData>;

        MrrMainMenuPanel                : PanelConfig<TwnsMrrMainMenuPanel.OpenData>;
        MrrMyRoomListPanel              : PanelConfig<TwnsMrrMyRoomListPanel.OpenData>;
        MrrPreviewMapListPanel          : PanelConfig<TwnsMrrPreviewMapListPanel.OpenData>;
        MrrRoomInfoPanel                : PanelConfig<TwnsMrrRoomInfoPanel.OpenData>;
        MrrSetMaxConcurrentCountPanel   : PanelConfig<TwnsMrrSetMaxConcurrentCountPanel.OpenData>;

        MrwMyWarListPanel               : PanelConfig<TwnsMrwMyWarListPanel.OpenData>;

        RwReplayListPanel               : PanelConfig<TwnsRwReplayListPanel.OpenData>;
        RwReplayProgressPanel           : PanelConfig<TwnsRwReplayProgressPanel.OpenData>;
        RwSearchReplayPanel             : PanelConfig<TwnsRwSearchReplayPanel.OpenData>;
        RwTopPanel                      : PanelConfig<TwnsRwTopPanel.OpenData>;
        RwWarMenuPanel                  : PanelConfig<TwnsRwWarMenuPanel.OpenData>;

        ScrCreateMapListPanel           : PanelConfig<TwnsScrCreateMapListPanel.OpenData>;
        ScrCreateSaveSlotsPanel         : PanelConfig<TwnsScrCreateSaveSlotsPanel.OpenData>;
        ScrCreateSearchMapPanel         : PanelConfig<TwnsScrCreateSearchMapPanel.OpenData>;
        ScrCreateSettingsPanel          : PanelConfig<TwnsScrCreateSettingsPanel.OpenData>;

        SpmCreateSfwSaveSlotsPanel      : PanelConfig<TwnsSpmCreateSfwSaveSlotsPanel.OpenData>;
        SpmMainMenuPanel                : PanelConfig<TwnsSpmMainMenuPanel.OpenData>;
        SpmWarListPanel                 : PanelConfig<TwnsSpmWarListPanel.OpenData>;

        SpwLoadWarPanel                 : PanelConfig<TwnsSpwLoadWarPanel.OpenData>;
        SpwSidePanel                    : PanelConfig<TwnsSpwSidePanel.OpenData>;
        SpwTopPanel                     : PanelConfig<TwnsSpwTopPanel.OpenData>;
        SpwWarMenuPanel                 : PanelConfig<TwnsSpwWarMenuPanel.OpenData>;

        UserChangeDiscordIdPanel        : PanelConfig<TwnsUserChangeDiscordIdPanel.OpenData>;
        UserChangeNicknamePanel         : PanelConfig<TwnsUserChangeNicknamePanel.OpenData>;
        UserLoginBackgroundPanel        : PanelConfig<TwnsUserLoginBackgroundPanel.OpenData>;
        UserLoginPanel                  : PanelConfig<TwnsUserLoginPanel.OpenData>;
        UserOnlineUsersPanel            : PanelConfig<TwnsUserOnlineUsersPanel.OpenData>;
        UserPanel                       : PanelConfig<TwnsUserPanel.OpenData>;
        UserRegisterPanel               : PanelConfig<TwnsUserRegisterPanel.OpenData>;
        UserSetAvatarPanel              : PanelConfig<TwnsUserSetAvatarPanel.OpenData>;
        UserSetPasswordPanel            : PanelConfig<TwnsUserSetPasswordPanel.OpenData>;
        UserSetPrivilegePanel           : PanelConfig<TwnsUserSetPrivilegePanel.OpenData>;
        UserSetSoundPanel               : PanelConfig<TwnsUserSetSoundPanel.OpenData>;
        UserSetStageScalePanel          : PanelConfig<TwnsUserSetStageScalePanel.OpenData>;
        UserSettingsPanel               : PanelConfig<TwnsUserSettingsPanel.OpenData>;

        WeActionAddUnitListPanel        : PanelConfig<TwnsWeActionAddUnitListPanel.OpenData>;
        WeActionModifyPanel1            : PanelConfig<TwnsWeActionModifyPanel1.OpenData>;
        WeActionModifyPanel2            : PanelConfig<TwnsWeActionModifyPanel2.OpenData>;
        WeActionModifyPanel3            : PanelConfig<TwnsWeActionModifyPanel3.OpenData>;
        WeActionModifyPanel4            : PanelConfig<TwnsWeActionModifyPanel4.OpenData>;
        WeActionModifyPanel5            : PanelConfig<TwnsWeActionModifyPanel5.OpenData>;
        WeActionModifyPanel6            : PanelConfig<TwnsWeActionModifyPanel6.OpenData>;
        WeActionReplacePanel            : PanelConfig<TwnsWeActionReplacePanel.OpenData>;
        WeActionTypeListPanel           : PanelConfig<TwnsWeActionTypeListPanel.OpenData>;
        WeCommandPanel                  : PanelConfig<TwnsWeCommandPanel.OpenData>;
        WeConditionModifyPanel1         : PanelConfig<TwnsWeConditionModifyPanel1.OpenData>;
        WeConditionModifyPanel2         : PanelConfig<TwnsWeConditionModifyPanel2.OpenData>;
        WeConditionModifyPanel3         : PanelConfig<TwnsWeConditionModifyPanel3.OpenData>;
        WeConditionModifyPanel4         : PanelConfig<TwnsWeConditionModifyPanel4.OpenData>;
        WeConditionModifyPanel5         : PanelConfig<TwnsWeConditionModifyPanel5.OpenData>;
        WeConditionModifyPanel6         : PanelConfig<TwnsWeConditionModifyPanel6.OpenData>;
        WeConditionModifyPanel7         : PanelConfig<TwnsWeConditionModifyPanel7.OpenData>;
        WeConditionModifyPanel8         : PanelConfig<TwnsWeConditionModifyPanel8.OpenData>;
        WeConditionModifyPanel9         : PanelConfig<TwnsWeConditionModifyPanel9.OpenData>;
        WeConditionModifyPanel10        : PanelConfig<TwnsWeConditionModifyPanel10.OpenData>;
        WeConditionModifyPanel11        : PanelConfig<TwnsWeConditionModifyPanel11.OpenData>;
        WeConditionModifyPanel12        : PanelConfig<TwnsWeConditionModifyPanel12.OpenData>;
        WeConditionModifyPanel13        : PanelConfig<TwnsWeConditionModifyPanel13.OpenData>;
        WeConditionModifyPanel14        : PanelConfig<TwnsWeConditionModifyPanel14.OpenData>;
        WeConditionReplacePanel         : PanelConfig<TwnsWeConditionReplacePanel.OpenData>;
        WeConditionTypeListPanel        : PanelConfig<TwnsWeConditionTypeListPanel.OpenData>;
        WeDialogueBackgroundPanel       : PanelConfig<TwnsWeDialogueBackgroundPanel.OpenData>;
        WeEventListPanel                : PanelConfig<TwnsWeEventListPanel.OpenData>;
        WeEventRenamePanel              : PanelConfig<TwnsWeEventRenamePanel.OpenData>;
        WeNodeReplacePanel              : PanelConfig<TwnsWeNodeReplacePanel.OpenData>;

        WarMapBuildingListPanel         : PanelConfig<TwnsWarMapBuildingListPanel.OpenData>;

        WwDeleteWatcherDetailPanel      : PanelConfig<TwnsWwDeleteWatcherDetailPanel.OpenData>;
        WwDeleteWatcherWarsPanel        : PanelConfig<TwnsWwDeleteWatcherWarsPanel.OpenData>;
        WwHandleRequestDetailPanel      : PanelConfig<TwnsWwHandleRequestDetailPanel.OpenData>;
        WwHandleRequestWarsPanel        : PanelConfig<TwnsWwHandleRequestWarsPanel.OpenData>;
        WwMainMenuPanel                 : PanelConfig<TwnsWwMainMenuPanel.OpenData>;
        WwMakeRequestDetailPanel        : PanelConfig<TwnsWwMakeRequestDetailPanel.OpenData>;
        WwMakeRequestWarsPanel          : PanelConfig<TwnsWwMakeRequestWarsPanel.OpenData>;
        WwOngoingWarsPanel              : PanelConfig<TwnsWwOngoingWarsPanel.OpenData>;
        WwSearchWarPanel                : PanelConfig<TwnsWwSearchWarPanel.OpenData>;
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
            ChatPanel: {
                cls         : TwnsChatPanel?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
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

            WeConditionModifyPanel7: {
                cls         : TwnsWeConditionModifyPanel7?.WeConditionModifyPanel7,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel7.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel8: {
                cls         : TwnsWeConditionModifyPanel8?.WeConditionModifyPanel8,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel8.exml`,
                layer       : LayerType.Hud0,
            },

            WeConditionModifyPanel9: {
                cls         : TwnsWeConditionModifyPanel9?.WeConditionModifyPanel9,
                skinName    : `resource/skins/warEvent/WeConditionModifyPanel9.exml`,
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
