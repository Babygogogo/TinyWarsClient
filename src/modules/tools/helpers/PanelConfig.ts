
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
        BwBackgroundPanel           : PanelConfig<TwnsBwBackgroundPanel.OpenData>;
        BwBeginTurnPanel            : PanelConfig<TwnsBwBeginTurnPanel.OpenData>;
        BwCaptureProgressPanel      : PanelConfig<TwnsBwCaptureProgressPanel.OpenData>;
        BwDamagePreviewPanel        : PanelConfig<TwnsBwDamagePreviewPanel.OpenData>;
        BwDialoguePanel             : PanelConfig<TwnsBwDialoguePanel.OpenData>;
        BwProduceUnitPanel          : PanelConfig<TwnsBwProduceUnitPanel.OpenData>;
        BwSimpleDialoguePanel       : PanelConfig<TwnsBwSimpleDialoguePanel.OpenData>;
        BwTileBriefPanel            : PanelConfig<TwnsBwTileBriefPanel.OpenData>;
        BwTileDetailPanel           : PanelConfig<TwnsBwTileDetailPanel.OpenData>;
        BwUnitActionsPanel          : PanelConfig<TwnsBwUnitActionsPanel.OpenData>;
        BwUnitBriefPanel            : PanelConfig<TwnsBwUnitBriefPanel.OpenData>;
        BwUnitDetailPanel           : PanelConfig<TwnsBwUnitDetailPanel.OpenData>;
        BwUnitListPanel             : PanelConfig<TwnsBwUnitListPanel.OpenData>;
        BwWarInfoPanel              : PanelConfig<TwnsBwWarInfoPanel.OpenData>;
        BwWarPanel                  : PanelConfig<TwnsBwWarPanel.OpenData>

        ChatPanel                   : PanelConfig<TwnsChatPanel.OpenData>;

        UserChangeDiscordIdPanel    : PanelConfig<TwnsUserChangeDiscordIdPanel.OpenData>;
        UserChangeNicknamePanel     : PanelConfig<TwnsUserChangeNicknamePanel.OpenData>;
        UserLoginBackgroundPanel    : PanelConfig<TwnsUserLoginBackgroundPanel.OpenData>;
        UserLoginPanel              : PanelConfig<TwnsUserLoginPanel.OpenData>;
        UserOnlineUsersPanel        : PanelConfig<TwnsUserOnlineUsersPanel.OpenData>;
        UserPanel                   : PanelConfig<TwnsUserPanel.OpenData>;
        UserRegisterPanel           : PanelConfig<TwnsUserRegisterPanel.OpenData>;
        UserSetAvatarPanel          : PanelConfig<TwnsUserSetAvatarPanel.OpenData>;
        UserSetPasswordPanel        : PanelConfig<TwnsUserSetPasswordPanel.OpenData>;
        UserSetPrivilegePanel       : PanelConfig<TwnsUserSetPrivilegePanel.OpenData>;
        UserSetSoundPanel           : PanelConfig<TwnsUserSetSoundPanel.OpenData>;
        UserSetStageScalePanel      : PanelConfig<TwnsUserSetStageScalePanel.OpenData>;
        UserSettingsPanel           : PanelConfig<TwnsUserSettingsPanel.OpenData>;
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
            ChatPanel: {
                cls         : TwnsChatPanel?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
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
        };
    }
}
