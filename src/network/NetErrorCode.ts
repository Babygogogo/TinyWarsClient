
namespace TinyWars.Network {
export const enum NetErrorCode {
    NoError = 0,

    InternalError,

    IllegalRequest,

    User0000 = 10000,               // 玩家登录-socket已有user id
    User0001,                       // 玩家登录-账号或密码错误
    User0002,                       // 玩家登录-已处于已登录的状态
    User0003,                       // 服务端内部错误
    User0004,                       // 服务端内部错误

    Register_InvalidAccount,
    Register_UsedAccount,
    Register_AlreadyLoggedIn,
    Register_InvalidPassword,
    Register_InvalidNickname,
    Register_UsedNickname,

    MmMergeMap_SameSrcAndDst,
    MmMergeMap_NoSrcStatisticsData,
    MmMergeMap_NoDstStatisticsData,

    Mcr0000 = 20000,                // 自定义多人房间-已加入太多房间
    CreateMultiCustomWar_TooManyCreatedRooms,
    CreateMultiCustomWar_InvalidParams,

    ExitMultiCustomWar_WarInfoNotExist,
    ExitMultiCustomWar_NotJoined,

    JoinMultiCustomWar_TooManyJoinedWars,
    JoinMultiCustomWar_InvalidParams,
    JoinMultiCustomWar_WarInfoNotExist,
    JoinMultiCustomWar_AlreadyJoined,

    GetMapDynamicInfo_NoSuchMap,

    GetMapRawData_NoSuchMap,

    GetUserPublicInfo_NoSuchUser,

    McrContinueWar_NoSuchWar,
    McrContinueWar_DefeatedOrNotJoined,

    McwBeginTurn_NoSuchWar,
    McwBeginTurn_InvalidActionId,
    McwBeginTurn_NotInTurn,
    McwEndTurn_NoSuchWar,
    McwEndTurn_InvalidActionId,
    McwEndTurn_NotInTurn,
    McwEndTurn_NotVotedForDraw,

    McwWatchRequestWatcher_TargetPlayerLost,
    McwWatchRequestWatcher_AlreadyRequested,
    McwWatchRequestWatcher_AlreadyAccepted,

    ServerDisconnect_ServerMaintenance,
}
}
