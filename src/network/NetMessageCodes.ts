
namespace TinyWars.Network {
    export enum Codes {
        actionCode = 0,
        C_Heartbeat = 1,
        S_Heartbeat = 2,
        C_Register = 3,
        S_Register = 4,
        C_Login = 5,
        S_Login = 6,
        C_Logout = 7,
        S_Logout = 8,
        S_Error = 10,
        C_GetNewestMapInfos = 11,
        S_GetNewestMapInfos = 12,
        C_CreateMultiCustomWar = 13,
        S_CreateMultiCustomWar = 14,
        C_ExitMultiCustomWar = 15,
        S_ExitMultiCustomWar = 16,
        C_GetJoinedWaitingMultiCustomWarInfos = 17,
        S_GetJoinedWaitingMultiCustomWarInfos = 18,
        C_GetUnjoinedWaitingMultiCustomWarInfos = 19,
        S_GetUnjoinedWaitingMultiCustomWarInfos = 20,
        C_JoinMultiCustomWar = 21,
        S_JoinMultiCustomWar = 22,
        S_NewestConfigVersion = 24,
    }
}
