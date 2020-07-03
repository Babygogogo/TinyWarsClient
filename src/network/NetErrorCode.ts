
namespace TinyWars.Network {
export const enum NetErrorCode {
    NoError = 0,

    InternalError,

    IllegalRequest,

    Login_InvalidAccountOrPassword,
    Login_AlreadyLoggedIn,

    Register_InvalidAccount,
    Register_UsedAccount,
    Register_AlreadyLoggedIn,
    Register_InvalidPassword,
    Register_InvalidNickname,
    Register_UsedNickname,

    MmMergeMap_SameSrcAndDst,
    MmMergeMap_NoSrcStatisticsData,
    MmMergeMap_NoDstStatisticsData,

    CreateMultiCustomWar_TooManyJoinedWars,
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
