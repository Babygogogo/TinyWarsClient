
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
