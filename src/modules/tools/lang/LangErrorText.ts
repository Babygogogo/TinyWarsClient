
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import TwnsServerErrorCode  from "../helpers/ServerErrorCode";

namespace TwnsLangErrorText {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import ServerErrorCode      = TwnsServerErrorCode.ServerErrorCode;

    export const LangErrorText: { [errorCode: number]: string[] } = {
        [ServerErrorCode.NoError]: [
            "",
            "",
        ],
        [ServerErrorCode.IllegalRequest0000]: [
            "非法请求",
            "Illegal request.",
        ],
        [ServerErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_0022]: [
            `合作模式下，至少要有一个势力由AI控制`,
            `There must be at least 1 A.I. player in the Coop Mode.`,
        ],
        [ServerErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_0023]: [
            `合作模式下，至少要有两个势力由真人玩家控制`,
            `There must be at least 2 human players in the Coop Mode.`,
        ],
        [ServerErrorCode.MsgUserLogin0001]: [
            "账号不合法，请检查后重试",
            "Invalid account.",
        ],
        [ServerErrorCode.MsgUserLogin0002]: [
            "您已处于登陆状态，不可再次登陆",
            "You have logged in already.",
        ],
        [ServerErrorCode.MsgUserLogin0003]: [
            "密码不合法，请检查后重试",
            "Invalid password.",
        ],
        [ServerErrorCode.MsgUserLogin0005]: [
            "账号不存在，请检查后重试",
            "The account doesn't exist.",
        ],
        [ServerErrorCode.MsgUserLogin0006]: [
            "账号或密码不正确，请检查后重试",
            "Incorrect account and/or password.",
        ],
        [ServerErrorCode.MsgUserRegister0000]: [
            "账号不符合要求，请检查后重试",
            "Invalid account.",
        ],
        [ServerErrorCode.MsgUserRegister0001]: [
            "该账号已被注册，请修改后再试",
            "The account has been registered.",
        ],
        [ServerErrorCode.MsgUserRegister0002]: [
            "您已处于登陆状态，不可注册账号",
            "You have logged in already.",
        ],
        [ServerErrorCode.MsgUserRegister0003]: [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
        ],
        [ServerErrorCode.MsgUserRegister0004]: [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ],
        [ServerErrorCode.MsgUserRegister0005]: [
            "该昵称已被使用，请修改后再试",
            "The nickname has been used.",
        ],
        [ServerErrorCode.MsgUserSetNickname0000]: [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ],
        [ServerErrorCode.MsgUserSetNickname0001]: [
            "该昵称已被使用，请修改后再试",
            "The nickname has been used.",
        ],
        [ServerErrorCode.ExeMcrCreateRoom_DoExecute_0007]: [
            "您已加入了许多未开战的房间，请退出部分后重试",
            "You have joined too many rooms.",
        ],
        [ServerErrorCode.ExeMcrCreateRoom_DoExecute_0008]: [
            "您已创建了许多未开始的房间，请退出部分后重试",
            "You have created too many rooms simultaneously.",
        ],
        [ServerErrorCode.ExeMcrExitRoom_DoExecute_0001]: [
            "房间不存在",
            "The room doesn't exist.",
        ],
        [ServerErrorCode.ExeMcrExitRoom_DoExecute_0003]: [
            "您并未参加该战局",
            "You haven't joined the game.",
        ],
        [ServerErrorCode.ExeMcrJoinRoom_DoExecute_0003]: [
            "您已参与了许多未开始的战局，请退出部分后重试",
            "You have joined too many wars.",
        ],
        [ServerErrorCode.ExeMcrJoinRoom_DoExecute_0005]: [
            "房间不存在",
            "The room doesn't exist.",
        ],
        [ServerErrorCode.ExeMcrJoinRoom_DoExecute_0011]: [
            "您已加入了该房间。",
            "You have already joined the room.",
        ],
        [ServerErrorCode.ExeMcrStartWar_DoExecute_0006]: [
            `房间未满员`,
            `There not enough players in the room.`,
        ],
        [ServerErrorCode.ExeMcrStartWar_DoExecute_0007]: [
            `还有玩家未准备就绪`,
            `Some players are not ready yet.`,
        ],
        [ServerErrorCode.MsgMapGetRawData0001]: [
            "地图不存在，获取raw data失败。",
            "The map doesn't exist thus fail to get its raw data.",
        ],
        [ServerErrorCode.MsgUserGetPublicInfo0001]: [
            "用户不存在，获取user public info失败。",
            "The user doesn't exist thus fail to get its public info.",
        ],
        [ServerErrorCode.MsgMpwCommonContinueWar0001]: [
            `战局不存在`,
            `The game doesn't exist.`,
        ],
        [ServerErrorCode.MsgMpwCommonContinueWar0003]: [
            `您未参与该战局，或已经被击败`,
            `You have not joined the game, or you have been defeated.`,
        ],
        [ServerErrorCode.ExeCcrCreateRoom_DoExecute_0019]: [
            `AI玩家的颜色设置不合法`,
            `The colors of the A.I. players are invalid.`,
        ],
        [ServerErrorCode.ExeCcrCreateRoom_DoExecute_0022]: [
            `AI玩家的颜色与您自己的势力颜色冲突`,
            `The colors of you and the A.I. players are invalid.`,
        ],
        [ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0001]: [
            `战局不存在`,
            `The game doesn't exist.`,
        ],
        [ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0002]: [
            `战局数据不同步，请刷新`,
            `The local data is out of synchronization. Please refresh.`,
        ],
        [ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0005]: [
            `当前无法结束您的回合`,
            `Unable to end turn.`,
        ],
        [ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0008]: [
            `您尚未完成关于和局的投票`,
            `You haven't voted for the draw of game.`,
        ],
        [ServerErrorCode.MsgMpwWatchMakeRequest0005]: [
            `该玩家已战败，无法观战`,
            `The target player has been defeated in the game.`
        ],
        [ServerErrorCode.MsgMpwWatchMakeRequest0006]: [
            `已请求观战该玩家`,
            `You have already requested to watch the player.`,
        ],
        [ServerErrorCode.MsgMpwWatchMakeRequest0007]: [
            `观战请求已被接受`,
            `The request has already been accepted.`,
        ],
        [ServerErrorCode.MsgMfrCreateRoom0016]: [
            `您已创建了许多未开始的房间，请删除部分后重试`,
            `You have created too many rooms simultaneously.`,
        ],
        [ServerErrorCode.ExeMfrStartWar_DoExecute_0005]: [
            `玩家数量不足，请等待更多玩家进入房间。`,
            `There not enough players in the room. Please wait until more players join.`,
        ],
        [ServerErrorCode.ServerDisconnect0001]: [
            `服务器维护中`,
            `The server is under maintenance.`,
        ],

        [ClientErrorCode.MapRawDataValidation04]: [
            `势力数量不合法`,
            `The number of the forces is not valid.`,
        ],
        [ClientErrorCode.MapRawDataValidation07]: [
            `势力颜色不合法`,
            `The colors of the forces are invalid.`,
        ],
        [ClientErrorCode.WarEventFullDataValidation09]: [
            `存在未被引用的事件动作`,
            `There is a redundant event action.`,
        ],
        [ClientErrorCode.WarEventFullDataValidation12]: [
            `存在未被引用的事件`,
            `There is a redundant event.`,
        ],
        [ClientErrorCode.WarRuleValidation02]: [
            `尚未设置预设规则的可用性`,
            `The availability of the preset rule has not been set.`,
        ],
        [ClientErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_02]: [
            `势力的队伍设置不合法`,
            `The team settings is invalid.`,
        ],
        [ClientErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_22]: [
            `合作模式下，至少要有一个势力由AI控制`,
            `There must be at least 1 A.I. player in the Coop Mode.`,
        ],
        [ClientErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_23]: [
            `合作模式下，至少要有两个势力由真人玩家控制`,
            `There must be at least 2 human players in the Coop Mode.`,
        ],
    };
}

export default TwnsLangErrorText;
