
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import TwnsServerErrorCode  from "../helpers/ServerErrorCode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        [ServerErrorCode.ExeChatAddMessage_ExeWithSocket_0005]: [
            `您说话太频繁了，请稍后再试`,
            `Please wait a moment before sending another message.`,
        ],
        [ServerErrorCode.MsgMapGetRawData0001]: [
            "地图不存在，获取raw data失败。",
            "The map doesn't exist thus fail to get its raw data.",
        ],
        [ServerErrorCode.MsgUserGetPublicInfo0001]: [
            "用户不存在，获取user public info失败。",
            "The user doesn't exist thus fail to get its public info.",
        ],
        [ServerErrorCode.ExeMpwCommonContinueWar_ExeWithSocket_0001]: [
            `战局不存在`,
            `The game doesn't exist.`,
        ],
        [ServerErrorCode.ExeMpwCommonContinueWar_ExeWithSocket_0002]: [
            `您未参与该战局`,
            `You have not joined the game.`,
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
        [ServerErrorCode.MsgMpwWatchMakeRequest_ExeWithSocket_0004]: [
            `已请求观战该玩家`,
            `You have already requested to watch the player.`,
        ],
        [ServerErrorCode.MsgMpwWatchMakeRequest_ExeWithSocket_0005]: [
            `观战请求已被接受`,
            `The request has already been accepted.`,
        ],
        [ServerErrorCode.MsgMpwWatchHandleRequest_ExeWithSocket_0006]: [
            `该观战请求不存在或已经失效`,
            `The request doesn't exist or has expired.`,
        ],
        [ServerErrorCode.ExeMfrCreateRoom_DoExecute_0018]: [
            `您已创建了许多未开始的房间，请删除部分后重试`,
            `You have created too many rooms simultaneously.`,
        ],
        [ServerErrorCode.ExeMfrStartWar_DoExecute_0005]: [
            `玩家数量不足，请等待更多玩家进入房间。`,
            `There not enough players in the room. Please wait until more players join.`,
        ],
        [ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0001]: [
            `战局已结束，无法即时回放`,
            `Failed to replay this war because the war is over.`
        ],
        [ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0002]: [
            `您无权观看此战局的即时回放，请先申请观战`,
            `You don't have the permission to view the in-game replay of this war.`,
        ],
        [ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0003]: [
            `此战局未有回放步骤数据（或数据已丢失），无法即时回放`,
            `Failed to replay this war because there is no data or some of the data has been lost.`,
        ],
        [ServerErrorCode.ExeSpmCreateSrw_ExeWithSocket_0018]: [
            `各个玩家使用的势力颜色必须互不相同`,
            `Players can't use the same color.`,
        ],
        [ServerErrorCode.ActorMcrRoom_McrStartCreateWar_0006]: [
            `尚有玩家未准备就绪`,
            `Some players are not ready.`,
        ],
        [ServerErrorCode.ActorMcrRoom_McrStartExitRoom_0004]: [
            `您是房间里的最后一位玩家，不能直接退出房间`,
            `You are the last player in the room. You can't exit the room directly.`,
        ],
        [ServerErrorCode.ActorMcrRoomCreator_McrStartCheckAndCreateRoom_0000]: [
            `您已加入了许多未开战的房间，请退出部分房间后重试`,
            `You have joined too many rooms, please exit some of them.`,
        ],
        [ServerErrorCode.ActorMcrRoomManager_McrStartSendJoinedRoomIdArray_0000]: [
            `您的请求过于频繁，请稍后重试`,
            `Your query requests are too frequent. Please retry later.`,
        ],
        [ServerErrorCode.ActorMcrRoomManager_McrStartSendJoinableRoomIdArray_0000]: [
            `您的请求过于频繁，请稍后重试`,
            `Your query requests are too frequent. Please retry later.`,
        ],
        [ServerErrorCode.ActorCcrRoomCreator_CcrStartCheckAndCreateRoom_0000]: [
            `您已加入了许多未开战的房间，请退出部分房间后重试`,
            `You have joined too many rooms, please exit some of them.`,
        ],
        [ServerErrorCode.ActorMfrRoomCreator_MfrStartCheckAndCreateRoom_0000]: [
            `您已加入了许多未开战的房间，请退出部分房间后重试`,
            `You have joined too many rooms, please exit some of them.`,
        ],
        [ServerErrorCode.ActorReplayManager_ReplayManagerSendFilteredReplayIdArray_0000]: [
            `您的请求过于频繁，请稍后重试`,
            `Your query requests are too frequent. Please retry later.`,
        ],
        [ServerErrorCode.ServerDisconnect0001]: [
            `服务器维护中`,
            `The server is under maintenance.`,
        ],

        [ClientErrorCode.BwPlayerManager_Init_03]: [
            `势力颜色不合法`,
            `The colors of the forces are invalid.`,
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
            `There is a redundant event action. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
        ],
        [ClientErrorCode.WarEventFullDataValidation10]: [
            `存在未被引用的事件条件`,
            `There is a redundant event condition. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
        ],
        [ClientErrorCode.WarEventFullDataValidation11]: [
            `存在未被引用的事件条件节点`,
            `There is a redundant event condition node. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
        ],
        [ClientErrorCode.WarEventFullDataValidation12]: [
            `存在未被任何规则使用的事件`,
            `There is a redundant event that is not used in any rules.`,
        ],
        [ClientErrorCode.WarRuleValidation02]: [
            `尚未设置预设规则的可用性`,
            `The availability of the preset rule has not been set.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_00]: [
            `势力规则的数量与实际存在的势力数量不相同，请检查预设规则`,
            `The number of force rules is not the same as the number of forces. Please check the preset rules.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_02]: [
            `势力的队伍设置不合法`,
            `The team settings are invalid.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_12]: [
            `不能禁用“无CO”`,
            `You can't ban "No CO".`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_13]: [
            `您禁用了不存在的CO`,
            `You can't ban a non-existing CO.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_20]: [
            `挑战模式下，至少要有一个势力由AI控制`,
            `There must be at least 1 A.I. player in the War Room Mode.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_21]: [
            `挑战模式下，必须有且只有一个队伍的势力由玩家控制`,
            `There must be one team that controlled by human player in the War Room Mode.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_22]: [
            `合作模式下，至少要有一个势力由AI控制`,
            `There must be at least 1 A.I. player in the Coop Mode.`,
        ],
        [ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForPlayers_23]: [
            `合作模式下，至少要有两个势力由真人玩家控制`,
            `There must be at least 2 human players in the Coop Mode.`,
        ],
        [ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_00]: [
            `地图文件体积太大，无法保存`,
            `This map is too large to be saved.`,
        ],
    };
}

// export default TwnsLangErrorText;
