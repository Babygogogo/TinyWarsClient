
namespace TinyWars.Network {
export const enum NetErrorCode {
    NoError = 0,

    InternalError,

    IllegalRequest,

    MsgUserLogin0000        = 100,  // socket已有user id
    MsgUserLogin0001,               // 账号不合法
    MsgUserLogin0002,               // 已处于已登录的状态
    MsgUserLogin0003,               // 密码不合法
    MsgUserLogin0004,
    MsgUserLogin0005,               // 账号不存在
    MsgUserLogin0006,               // 账号或密码不正确

    MsgUserRegister0000     = 200,  // 账号不合法
    MsgUserRegister0001,            // 账号已存在
    MsgUserRegister0002,            // 已处于已登录的状态
    MsgUserRegister0003,            // 密码不合法
    MsgUserRegister0004,            // 昵称不合法
    MsgUserRegister0005,            // 昵称已被使用

    MsgUserSetNickname0000  = 300,  // 昵称不合法
    MsgUserSetNickname0001,         // 昵称已被使用

    MsgMcrCreateRoom0000    = 400,  // 已加入太多房间
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
