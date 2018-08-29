
namespace Network {
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
        C_CreateCustomOnlineWar = 13,
        S_CreateCustomOnlineWar = 14,
        C_ExitCustomOnlineWar = 15,
        S_ExitCustomOnlineWar = 16,
        C_GetWaitingCustomOnlineWarInfos = 17,
        S_GetWaitingCustomOnlineWarInfos = 18,
    }
}
