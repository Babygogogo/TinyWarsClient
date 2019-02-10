
namespace TinyWars.Network {
    export const enum NetErrorCode {
        NoError = 0,

        IllegalRequest,

        Login_InvalidAccountOrPassword,
        Login_AlreadyLoggedIn,

        Register_InvalidAccount,
        Register_UsedAccount,
        Register_AlreadyLoggedIn,
        Register_InvalidPassword,
        Register_InvalidNickname,
        Register_UsedNickname,

        CreateMultiCustomWar_TooManyJoinedWars,
        CreateMultiCustomWar_InvalidParams,

        ExitMultiCustomWar_WarInfoNotExist,
        ExitMultiCustomWar_NotJoined,

        JoinMultiCustomWar_TooManyJoinedWars,
        JoinMultiCustomWar_InvalidParams,
        JoinMultiCustomWar_WarInfoNotExist,
        JoinMultiCustomWar_AlreadyJoined,

        GetMapDynamicInfo_NoSuchMap,

        ServerDisconnect_ServerMaintainance,
    }
}
