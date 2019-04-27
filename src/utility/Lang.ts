
namespace TinyWars.Utility.Lang {
    import ErrorCode = Network.NetErrorCode;

    export const enum Language {
        Chinese,
        English,
    }
    export const enum Type {
        A0000, A0001, A0002, A0003, A0004, A0005, A0006, A0007, A0008, A0009,
        A0010, A0011, A0012, A0013, A0014, A0015, A0016, A0017, A0018, A0019,
        A0020, A0021, A0022, A0023, A0024, A0025, A0026, A0027, A0028, A0029,
        A0030, A0031, A0032, A0033, A0034, A0035, A0036, A0037, A0038, A0039,

        B0000, B0001, B0002, B0003, B0004, B0005, B0006, B0007, B0008, B0009,
        B0010, B0011, B0012, B0013, B0014, B0015, B0016, B0017, B0018, B0019,
        B0020, B0021, B0022, B0023, B0024, B0025, B0026, B0027, B0028, B0029,
        B0030, B0031, B0032, B0033, B0034, B0035, B0036, B0037, B0038, B0039,
        B0040, B0041, B0042, B0043, B0044, B0045, B0046, B0047, B0048, B0049,
        B0050, B0051, B0052, B0053, B0054, B0055, B0056, B0057, B0058, B0059,
        B0060, B0061, B0062, B0063, B0064, B0065, B0066, B0067, B0068, B0069,
        B0070, B0071, B0072, B0073, B0074, B0075, B0076, B0077, B0078, B0079,

        B1000, B1001, B1002, B1003, B1004, B1005, B1006, B1007, B1008, B1009,
        B1010, B1011, B1012, B1013, B1014, B1015, B1016, B1017, B1018, B1019,
        B1020, B1021, B1022, B1023, B1024, B1025, B1026, B1027, B1028, B1029,
        B1030, B1031, B1032, B1033, B1034, B1035, B1036, B1037, B1038, B1039,
        B1200, B1201, B1202, B1203, B1204, B1205, B1206, B1207, B1208, B1209,
        B1210, B1211, B1212, B1213, B1214, B1215, B1216, B1217, B1218, B1219,
        B1220, B1221, B1222, B1223, B1224, B1225, B1226, B1227, B1228, B1229,
        B1230, B1231, B1232, B1233, B1234, B1235, B1236, B1237, B1238, B1239,

        F0000, F0001, F0002, F0003, F0004, F0005, F0006, F0007, F0008, F0009,
        F0010, F0011, F0012, F0013, F0014, F0015, F0016, F0017, F0018, F0019,
    }
    export const enum RichType {
        R000, R001, R002, R003,
    }

    const _LANG_DATA = new Map<Type, string[]>([
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Long strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [Type.A0000, [
            "登陆成功，祝您游戏愉快！",
            "Logged in successfully!",
        ]],
        [Type.A0001, [
            "账号不符合要求，请检查后重试",
            "Invalid account.",
        ]],
        [Type.A0002, [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ]],
        [Type.A0003, [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
        ]],
        [Type.A0004, [
            "注册成功，正在自动登陆…",
            "Register successfully! Now logging in...",
        ]],
        [Type.A0005, [
            "您已成功退出登陆，欢迎再次进入游戏。",
            "Logout successfully.",
        ]],
        [Type.A0006, [
            "您的账号被异地登陆，您已自动下线。",
            "Someone logged in with your account!",
        ]],
        [Type.A0007, [
            "已成功连接服务器。",
            "Connected to server successfully.",
        ]],
        [Type.A0008, [
            "连接服务器失败，正在重新连接…",
            "Failed to connect to server. Now reconnecting...",
        ]],
        [Type.A0009, [
            "您的网络连接不稳定，请尝试改善",
            "The network connection is not stable.",
        ]],
        [Type.A0010, [
            "没有符合条件的地图，请更换条件再试",
            "No maps found.",
        ]],
        [Type.A0011, [
            "正在查找地图",
            "Searching for maps...",
        ]],
        [Type.A0012, [
            "已找到符合条件的地图",
            "Maps found.",
        ]],
        [Type.A0013, [
            "发生网络错误，请重新登陆。",
            "Network went wrong. Please re-login.",
        ]],
        [Type.A0014, [
            "发生网络错误，请稍后再试。",
            "Network went wrong. Please try again later.",
        ]],
        [Type.A0015, [
            "已成功创建战局，请等待其他玩家加入",
            "The war is created successfully.",
        ]],
        [Type.A0016, [
            "已成功退出房间",
            "Quit successfully.",
        ]],
        [Type.A0017, [
            "密码不正确，请检查后重试",
            "Invalid password.",
        ]],
        [Type.A0018, [
            "已成功加入房间。战局尚未开始，请继续耐心等候他人加入。",
            "Joined successfully.",
        ]],
        [Type.A0019, [
            "已成功加入房间。战局正式开始，请从“继续战斗”入口进入。",
            "Joined successfully.",
        ]],
        [Type.A0020, [
            `服务器维护中，请稍后登陆`,
            `The server is under maintainance. Please wait and login later.`,
        ]],
        [Type.A0021, [
            `正在读取战局数据，请稍候`,
            `Downloading the war data. Please wait.`,
        ]],
        [Type.A0022, [
            `恭喜您获得本局的胜利！\n即将回到大厅…`,
            `Congratulations!`,
        ]],
        [Type.A0023, [
            `很遗憾您已战败，请再接再厉！\n即将回到大厅…`,
            `Good luck next war!`,
        ]],
        [Type.A0024, [
            `您确定要结束回合吗？`,
            `Are you sure to end your turn?`,
        ]],
        [Type.A0025, [
            `您确定要返回大厅吗？`,
            `Are you sure to go to the lobby?`,
        ]],
        [Type.A0026, [
            `您确定要投降吗？`,
            `Are you sure to resign?`,
        ]],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Short strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [Type.B0000, [
            "创建房间",
            "Create Game",
        ]],
        [Type.B0001, [
            "无",
            "None",
        ]],
        [Type.B0002, [
            "基本设置",
            "Basic Settings",
        ]],
        [Type.B0003, [
            "高级设置",
            "Advanced Settings",
        ]],
        [Type.B0004, [
            "红方",
            "red",
        ]],
        [Type.B0005, [
            "蓝方",
            "blue",
        ]],
        [Type.B0006, [
            "黄方",
            "yellow",
        ]],
        [Type.B0007, [
            "黑方",
            "black",
        ]],
        [Type.B0008, [
            "A队",
            "A Team",
        ]],
        [Type.B0009, [
            "B队",
            "B Team",
        ]],
        [Type.B0010, [
            "C队",
            "C Team",
        ]],
        [Type.B0011, [
            "D队",
            "D Team",
        ]],
        [Type.B0012, [
            "是",
            "Yes",
        ]],
        [Type.B0013, [
            "否",
            "No",
        ]],
        [Type.B0014, [
            "天",
            "d",
        ]],
        [Type.B0015, [
            "时",
            "h",
        ]],
        [Type.B0016, [
            "分",
            "m",
        ]],
        [Type.B0017, [
            "秒",
            "s",
        ]],
        [Type.B0018, [
            "行动次序",
            "Force",
        ]],
        [Type.B0019, [
            "队伍",
            "Team",
        ]],
        [Type.B0020, [
            "战争迷雾",
            "Fog",
        ]],
        [Type.B0021, [
            "回合显示",
            "Time Limit",
        ]],
        [Type.B0022, [
            "退出房间",
            "Exit Game"
        ]],
        [Type.B0023, [
            "加入房间",
            "Join Game"
        ]],
        [Type.B0024, [
            "继续战斗",
            "Continue",
        ]],
        [Type.B0025, [
            `连接已断开`,
            `Disconnected`,
        ]],
        [Type.B0026, [
            `确定`,
            `Confirm`,
        ]],
        [Type.B0027, [
            `倒计时`,
            `Countdown`,
        ]],
        [Type.B0028, [
            `即将超时`,
            `Timeout soon`,
        ]],
        [Type.B0029, [
            `读取中`,
            `Now loading`,
        ]],
        [Type.B0030, [
            `中立`,
            `Neutral`,
        ]],
        [Type.B0031, [
            `玩家`,
            `Player`,
        ]],
        [Type.B0032, [
            `金钱`,
            `Fund`,
        ]],
        [Type.B0033, [
            `能量`,
            `Energy`,
        ]],
        [Type.B0034, [
            `胜利`,
            `Win`,
        ]],
        [Type.B0035, [
            `失败`,
            `Defeat`,
        ]],
        [Type.B0036, [
            `结束回合`,
            `End Turn`,
        ]],
        [Type.B0037, [
            `装载`,
            `load`,
        ]],
        [Type.B0038, [
            `合流`,
            `Join`,
        ]],
        [Type.B0039, [
            `攻击`,
            `Attack`,
        ]],
        [Type.B0040, [
            `占领`,
            `Capture`,
        ]],
        [Type.B0041, [
            `下潜`,
            `Dive`,
        ]],
        [Type.B0042, [
            `上浮`,
            `Surface`,
        ]],
        [Type.B0043, [
            `建造`,
            `Build`,
        ]],
        [Type.B0044, [
            `补给`,
            `Supply`,
        ]],
        [Type.B0045, [
            `发射`,
            `Launch`,
        ]],
        [Type.B0046, [
            `卸载`,
            `Drop`,
        ]],
        [Type.B0047, [
            `照明`,
            `Flare`,
        ]],
        [Type.B0048, [
            `发射导弹`,
            `Silo`,
        ]],
        [Type.B0049, [
            `制造`,
            `Produce`,
        ]],
        [Type.B0050, [
            `待机`,
            `Wait`,
        ]],
        [Type.B0051, [
            `生产材料已耗尽`,
            `No material`,
        ]],
        [Type.B0052, [
            `没有空闲的装载位置`,
            `No empty load slot`,
        ]],
        [Type.B0053, [
            `资金不足`,
            `Insufficient fund`,
        ]],
        [Type.B0054, [
            `返回大厅`,
            `Go to lobby`,
        ]],
        [Type.B0055, [
            `投降`,
            `Resign`,
        ]],
        [Type.B0056, [
            `已战败`,
            `Defeat`
        ]],
        [Type.B0057, [
            `日`,
            `Day`,
        ]],
        [Type.B0058, [
            `月`,
            `Month`,
        ]],
        [Type.B0059, [
            `年`,
            `Year`,
        ]],
        [Type.B0060, [
            `排位积分`,
            `RankScore`,
        ]],
        [Type.B0061, [
            `列兵`,
            `0`,
        ]],
        [Type.B0062, [
            `上等兵`,
            `1`,
        ]],
        [Type.B0063, [
            `下士`,
            `2`,
        ]],
        [Type.B0064, [
            `中士`,
            `3`,
        ]],
        [Type.B0065, [
            `上士`,
            `4`,
        ]],
        [Type.B0066, [
            `军士长`,
            `5`,
        ]],
        [Type.B0067, [
            `少尉`,
            `6`,
        ]],
        [Type.B0068, [
            `中尉`,
            `7`,
        ]],
        [Type.B0069, [
            `上尉`,
            `8`,
        ]],
        [Type.B0070, [
            `少校`,
            `9`,
        ]],
        [Type.B0071, [
            `中校`,
            `10`,
        ]],
        [Type.B0072, [
            `上校`,
            `11`,
        ]],
        [Type.B0073, [
            `大校`,
            `12`,
        ]],
        [Type.B0074, [
            `少将`,
            `13`,
        ]],
        [Type.B0075, [
            `中将`,
            `14`,
        ]],
        [Type.B0076, [
            `上将`,
            `15`,
        ]],

        [Type.B1000, [
            `平原`,
            `Plain`,
        ]],
        [Type.B1001, [
            `河流`,
            `River`,
        ]],
        [Type.B1002, [
            `海洋`,
            `Sea`,
        ]],
        [Type.B1003, [
            `沙滩`,
            `Beach`,
        ]],
        [Type.B1004, [
            `道路`,
            `Road`,
        ]],
        [Type.B1005, [
            `桥梁`,
            `BridgeOnPlain`,
        ]],
        [Type.B1006, [
            `桥梁`,
            `BridgeOnRiver`,
        ]],
        [Type.B1007, [
            `桥梁`,
            `BridgeOnBeach`,
        ]],
        [Type.B1008, [
            `桥梁`,
            `BridgeOnSea`,
        ]],
        [Type.B1009, [
            `森林`,
            `Wood`,
        ]],
        [Type.B1010, [
            `高山`,
            `Mountain`,
        ]],
        [Type.B1011, [
            `荒野`,
            `Wasteland`,
        ]],
        [Type.B1012, [
            `废墟`,
            `Ruins`,
        ]],
        [Type.B1013, [
            `火堆`,
            `Fire`,
        ]],
        [Type.B1014, [
            `巨浪`,
            `Rough`,
        ]],
        [Type.B1015, [
            `迷雾`,
            `MistOnSea`,
        ]],
        [Type.B1016, [
            `礁石`,
            `Reef`,
        ]],
        [Type.B1017, [
            `等离子`,
            `Plasma`,
        ]],
        [Type.B1018, [
            `超级等离子`,
            `GreenPlasma`,
        ]],
        [Type.B1019, [
            `陨石`,
            `Meteor`,
        ]],
        [Type.B1020, [
            `导弹井`,
            `Silo`,
        ]],
        [Type.B1021, [
            `空导弹井`,
            `EmptySilo`,
        ]],
        [Type.B1022, [
            `指挥部`,
            `Headquarters`,
        ]],
        [Type.B1023, [
            `城市`,
            `City`,
        ]],
        [Type.B1024, [
            `指挥塔`,
            `CommandTower`,
        ]],
        [Type.B1025, [
            `雷达`,
            `Radar`,
        ]],
        [Type.B1026, [
            `工厂`,
            `Factory`,
        ]],
        [Type.B1027, [
            `机场`,
            `Airport`,
        ]],
        [Type.B1028, [
            `海港`,
            `Seaport`,
        ]],
        [Type.B1029, [
            `临时机场`,
            `TempAirport`,
        ]],
        [Type.B1030, [
            `临时海港`,
            `TempSeaport`,
        ]],
        [Type.B1031, [
            `迷雾`,
            `MistOnPlain`,
        ]],
        [Type.B1032, [
            `迷雾`,
            `MistOnRiver`,
        ]],
        [Type.B1033, [
            `迷雾`,
            `MistOnBeach`,
        ]],

        [Type.B1200, [
            `步兵`,
            `Infantry`,
        ]],
        [Type.B1201, [
            `反坦克兵`,
            `Mech`,
        ]],
        [Type.B1202, [
            `摩托兵`,
            `Bike`,
        ]],
        [Type.B1203, [
            `侦察车`,
            `Recon`,
        ]],
        [Type.B1204, [
            `照明车`,
            `Flare`,
        ]],
        [Type.B1205, [
            `防空车`,
            `AntiAir`,
        ]],
        [Type.B1206, [
            `轻型坦克`,
            `Tank`,
        ]],
        [Type.B1207, [
            `中型坦克`,
            `MediumTank`,
        ]],
        [Type.B1208, [
            `弩级坦克`,
            `WarTank`,
        ]],
        [Type.B1209, [
            `自走炮`,
            `Artillery`,
        ]],
        [Type.B1210, [
            `反坦克炮`,
            `AntiTank`,
        ]],
        [Type.B1211, [
            `火箭炮`,
            `Rockets`,
        ]],
        [Type.B1212, [
            `防空导弹车`,
            `Missiles`,
        ]],
        [Type.B1213, [
            `工程车`,
            `Rig`,
        ]],
        [Type.B1214, [
            `战斗机`,
            `Fighter`,
        ]],
        [Type.B1215, [
            `轰炸机`,
            `Bomber`,
        ]],
        [Type.B1216, [
            `攻击机`,
            `Duster`,
        ]],
        [Type.B1217, [
            `武装直升机`,
            `BattleCopter`,
        ]],
        [Type.B1218, [
            `运输直升机`,
            `TransportCopter`,
        ]],
        [Type.B1219, [
            `舰载机`,
            `Seaplane`,
        ]],
        [Type.B1220, [
            `战列舰`,
            `Battleship`,
        ]],
        [Type.B1221, [
            `航母`,
            `Carrier`,
        ]],
        [Type.B1222, [
            `潜艇`,
            `Submarine`,
        ]],
        [Type.B1223, [
            `驱逐舰`,
            `Cruiser`,
        ]],
        [Type.B1224, [
            `登陆舰`,
            `Lander`,
        ]],
        [Type.B1225, [
            `炮舰`,
            `Gunboat`,
        ]],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Formater strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [Type.F0000, [
            "地图名称: %s",
            "Map name: %s",
        ]],
        [Type.F0001, [
            "作者: %s",
            "Designer: %s",
        ]],
        [Type.F0002, [
            "人数: %s",
            "Players: %s",
        ]],
        [Type.F0003, [
            "全服评分: %s",
            "Rating: %s",
        ]],
        [Type.F0004, [
            "全服游玩次数: %s",
            "Games played: %s",
        ]],
        [Type.F0005, [
            "战争迷雾: %s",
            "Fog: %s",
        ]],
        [Type.F0006, [
            `%d个部队尚未行动。`,
            `%d unit(s) have taken no action yet.`
        ]],
        [Type.F0007, [
            `%d个建筑尚未生产部队。`,
            `%d building(s) have built nothing yet.`
        ]],
        [Type.F0008, [
            `玩家[%s]已投降！`,
            `Player [%s] has resigned!`,
        ]],
        [Type.F0009, [
            `%s 的履历`,
            `%s's Profile`,
        ]],
        [Type.F0010, [
            `%d胜`,
            `Win: %d`,
        ]],
        [Type.F0011, [
            `%d负`,
            `Lose: %d`,
        ]],
        [Type.F0012, [
            `%d平`,
            `Draw: %d`,
        ]],
    ]);

    const NET_ERROR_TEXT = new Map<ErrorCode, string[]>([
        [ErrorCode.IllegalRequest, [
            "非法请求",
            "Illegal request.",
        ]],
        [ErrorCode.Login_InvalidAccountOrPassword, [
            "账号或密码不正确，请检查后重试",
            "Invalid account and/or password.",
        ]],
        [ErrorCode.Login_AlreadyLoggedIn, [
            "您已处于登陆状态，不可再次登陆",
            "You have logged in already.",
        ]],
        [ErrorCode.Register_InvalidAccount, [
            "账号不符合要求，请检查后重试",
            "Invalid account.",
        ]],
        [ErrorCode.Register_UsedAccount, [
            "该账号已被注册，请修改后再试",
            "The account has been registered.",
        ]],
        [ErrorCode.Register_AlreadyLoggedIn, [
            "您已处于登陆状态，不可注册账号",
            "You have logged in already.",
        ]],
        [ErrorCode.Register_InvalidPassword, [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
        ]],
        [ErrorCode.Register_InvalidNickname, [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ]],
        [ErrorCode.Register_UsedNickname, [
            "该昵称已被使用，请修改后再试",
            "The nickname has been used.",
        ]],
        [ErrorCode.CreateMultiCustomWar_TooManyJoinedWars, [
            "您已参与了许多未开始的战局，请退出部分后重试",
            "You have joined too many wars.",
        ]],
        [ErrorCode.CreateMultiCustomWar_InvalidParams, [
            "部分设定不符合规则，请检查后重试",
            "Invalid settings.",
        ]],
        [ErrorCode.ExitMultiCustomWar_WarInfoNotExist, [
            "战局不存在",
            "The game doesn't exist.",
        ]],
        [ErrorCode.ExitMultiCustomWar_NotJoined, [
            "您并未参加该战局",
            "You haven't joined the game.",
        ]],
        [ErrorCode.JoinMultiCustomWar_TooManyJoinedWars, [
            "您已参与了许多未开始的战局，请退出部分后重试",
            "You have joined too many wars.",
        ]],
        [ErrorCode.JoinMultiCustomWar_InvalidParams, [
            "部分设定不符合规则，请检查后重试",
            "Invalid settings.",
        ]],
        [ErrorCode.JoinMultiCustomWar_WarInfoNotExist, [
            "房间不存在",
            "The game doesn't exist.",
        ]],
        [ErrorCode.JoinMultiCustomWar_AlreadyJoined, [
            "您已加入了该房间。",
            "You have already joined the game.",
        ]],
        [ErrorCode.ServerDisconnect_ServerMaintainance, [
            `服务器维护中`,
            `The server is under maintainance.`,
        ]],
        [ErrorCode.McrContinueWar_NoSuchWar, [
            `战局不存在`,
            `The game doesn't exist.`,
        ]],
        [ErrorCode.McrContinueWar_DefeatedOrNotJoined, [
            `您未参与该战局，或已经被击败`,
            `You have not joined the game, or you have been defeated.`,
        ]],

        [ErrorCode.McwBeginTurn_InvalidActionId, [
            `战局数据不同步，请刷新`,
            `The local data is out of synchronization. Please refresh.`,
        ]],
        [ErrorCode.McwBeginTurn_NoSuchWar, [
            `战局不存在`,
            `The game doesn't exist.`,
        ]],
        [ErrorCode.McwBeginTurn_NotInTurn, [
            `当前无法开始您的回合`,
            `Unable to begin turn.`,
        ]],
        [ErrorCode.McwEndTurn_InvalidActionId, [
            `战局数据不同步，请刷新`,
            `The local data is out of synchronization. Please refresh.`,
        ]],
        [ErrorCode.McwEndTurn_NoSuchWar, [
            `战局不存在`,
            `The game doesn't exist.`,
        ]],
        [ErrorCode.McwEndTurn_NotInTurn, [
            `当前无法结束您的回合`,
            `Unable to begin turn.`,
        ]],
        [ErrorCode.McwEndTurn_NotVotedForDraw, [
            `您尚未完成关于和局的投票`,
            `You haven't voted for the draw of game.`,
        ]],
    ]);

    const RICH_DATA = new Map<RichType, string[]>([
        [RichType.R000, [
            [
                `本选项影响您在回合中的行动顺序。`,
                ``,
                `本游戏固定了每回合中的行动顺序为：`,
                `1 红方`,
                `2 蓝方`,
                `3 黄方`,
                `4 黑方`,
                `其中，2人局不存在黄方和黑方，3人局不存在黑方。`,
                `每个玩家只能选择其中一项，不能重复。`,
                ``,
                `默认为当前可用选项中最靠前的一项。`,
            ].join("\n"),

            `Untranslated...`,
        ]],

        [RichType.R001, [
            [
                `本选项规定您所属的队伍。`,
                ``,
                `战局中，属于同一队伍的玩家共享视野，部队能够相互穿越，不能相互攻击/装载/用后勤车补给。`,
                `此外，可以使用队友的建筑来维修/补给自己的部队（消耗自己的金钱），但不能占领队友的建筑。`,
                ``,
                `默认为当前未被其他玩家选用的队伍中最靠前的一项。`,
            ].join("\n"),

            `Untranslated...`,
        ]],

        [RichType.R002, [
            [
                `本选项影响战局是明战或雾战。`,
                ``,
                `明战下，您可以观察到整个战场的情况。雾战下，您只能看到自己军队的视野内的战场情况。`,
                `雾战难度相对较大。如果您是新手，建议先通过明战熟悉游戏系统，再尝试雾战模式。`,
                ``,
                `默认为“否”（即明战）。`,
            ].join("\n"),

            `Untranslated...`,
        ]],

        [RichType.R003, [
            [
                `本选项影响所有玩家的每回合的时限。`,
                ``,
                `如果某个玩家的回合时间超出了本限制，则服务器将自动为该玩家执行投降操作。`,
                `当战局满员，或某个玩家结束回合后，则服务器自动开始下个玩家回合的倒计时（无论该玩家是否在线）。`,
                `因此，请仅在已约好对手的情况下才选择“15分”，以免造成不必要的败绩。`,
                ``,
                `默认为“3天”。`,
            ].join("\n"),

            `Untranslated`,
        ]],
    ]);

    let language = Language.Chinese;

    export function getText(t: Type): string {
        return _LANG_DATA.get(t)[language];
    }

    export function getFormatedText(t: Type, ...params: any[]): string {
        return Helpers.formatString(getText(t), ...params);
    }

    export function getNetErrorText(code: ErrorCode): string {
        return NET_ERROR_TEXT.get(code)[language];
    }

    export function getRichText(richType: RichType): string {
        return RICH_DATA.get(richType)[language];
    }

    export function getTileName(tileType: Types.TileType): string {
        switch (tileType) {
            case Types.TileType.Plain           : return getText(Type.B1000);
            case Types.TileType.River           : return getText(Type.B1001);
            case Types.TileType.Sea             : return getText(Type.B1002);
            case Types.TileType.Beach           : return getText(Type.B1003);
            case Types.TileType.Road            : return getText(Type.B1004);
            case Types.TileType.BridgeOnPlain   : return getText(Type.B1005);
            case Types.TileType.BridgeOnRiver   : return getText(Type.B1006);
            case Types.TileType.BridgeOnBeach   : return getText(Type.B1007);
            case Types.TileType.BridgeOnSea     : return getText(Type.B1008);
            case Types.TileType.Wood            : return getText(Type.B1009);
            case Types.TileType.Mountain        : return getText(Type.B1010);
            case Types.TileType.Wasteland       : return getText(Type.B1011);
            case Types.TileType.Ruins           : return getText(Type.B1012);
            case Types.TileType.Fire            : return getText(Type.B1013);
            case Types.TileType.Rough           : return getText(Type.B1014);
            case Types.TileType.MistOnSea       : return getText(Type.B1015);
            case Types.TileType.Reef            : return getText(Type.B1016);
            case Types.TileType.Plasma          : return getText(Type.B1017);
            case Types.TileType.GreenPlasma     : return getText(Type.B1018);
            case Types.TileType.Meteor          : return getText(Type.B1019);
            case Types.TileType.Silo            : return getText(Type.B1020);
            case Types.TileType.EmptySilo       : return getText(Type.B1021);
            case Types.TileType.Headquarters    : return getText(Type.B1022);
            case Types.TileType.City            : return getText(Type.B1023);
            case Types.TileType.CommandTower    : return getText(Type.B1024);
            case Types.TileType.Radar           : return getText(Type.B1025);
            case Types.TileType.Factory         : return getText(Type.B1026);
            case Types.TileType.Airport         : return getText(Type.B1027);
            case Types.TileType.Seaport         : return getText(Type.B1028);
            case Types.TileType.TempAirport     : return getText(Type.B1029);
            case Types.TileType.TempSeaport     : return getText(Type.B1030);
            case Types.TileType.MistOnPlain     : return getText(Type.B1031);
            case Types.TileType.MistOnRiver     : return getText(Type.B1032);
            case Types.TileType.MistOnBeach     : return getText(Type.B1033);
            default                             : return undefined;
        }
    }

    export function getUnitName(unitType: Types.UnitType): string {
        switch (unitType) {
            case Types.UnitType.Infantry        : return getText(Type.B1200);
            case Types.UnitType.Mech            : return getText(Type.B1201);
            case Types.UnitType.Bike            : return getText(Type.B1202);
            case Types.UnitType.Recon           : return getText(Type.B1203);
            case Types.UnitType.Flare           : return getText(Type.B1204);
            case Types.UnitType.AntiAir         : return getText(Type.B1205);
            case Types.UnitType.Tank            : return getText(Type.B1206);
            case Types.UnitType.MediumTank      : return getText(Type.B1207);
            case Types.UnitType.WarTank         : return getText(Type.B1208);
            case Types.UnitType.Artillery       : return getText(Type.B1209);
            case Types.UnitType.AntiTank        : return getText(Type.B1210);
            case Types.UnitType.Rockets         : return getText(Type.B1211);
            case Types.UnitType.Missiles        : return getText(Type.B1212);
            case Types.UnitType.Rig             : return getText(Type.B1213);
            case Types.UnitType.Fighter         : return getText(Type.B1214);
            case Types.UnitType.Bomber          : return getText(Type.B1215);
            case Types.UnitType.Duster          : return getText(Type.B1216);
            case Types.UnitType.BattleCopter    : return getText(Type.B1217);
            case Types.UnitType.TransportCopter : return getText(Type.B1218);
            case Types.UnitType.Seaplane        : return getText(Type.B1219);
            case Types.UnitType.Battleship      : return getText(Type.B1220);
            case Types.UnitType.Carrier         : return getText(Type.B1221);
            case Types.UnitType.Submarine       : return getText(Type.B1222);
            case Types.UnitType.Cruiser         : return getText(Type.B1223);
            case Types.UnitType.Lander          : return getText(Type.B1224);
            case Types.UnitType.Gunboat         : return getText(Type.B1225);
            default                             : return undefined;
        }
    }

    export function getUnitActionName(actionType: Types.UnitActionType): string {
        switch (actionType) {
            case Types.UnitActionType.BeLoaded      : return getText(Type.B0037);
            case Types.UnitActionType.Join          : return getText(Type.B0038);
            case Types.UnitActionType.Attack        : return getText(Type.B0039);
            case Types.UnitActionType.Capture       : return getText(Type.B0040);
            case Types.UnitActionType.Dive          : return getText(Type.B0041);
            case Types.UnitActionType.Surface       : return getText(Type.B0042);
            case Types.UnitActionType.BuildTile     : return getText(Type.B0043);
            case Types.UnitActionType.Supply        : return getText(Type.B0044);
            case Types.UnitActionType.LaunchUnit    : return getText(Type.B0045);
            case Types.UnitActionType.DropUnit      : return getText(Type.B0046);
            case Types.UnitActionType.LaunchFlare   : return getText(Type.B0047);
            case Types.UnitActionType.LaunchSilo    : return getText(Type.B0048);
            case Types.UnitActionType.ProduceUnit   : return getText(Type.B0049);
            case Types.UnitActionType.Wait          : return getText(Type.B0050);
            default                                 : return undefined;
        }
    }

    export function getRankName(playerRank: number): string {
        switch (playerRank) {
            case 0  : return getText(Type.B0061);
            case 1  : return getText(Type.B0062);
            case 2  : return getText(Type.B0063);
            case 3  : return getText(Type.B0064);
            case 4  : return getText(Type.B0065);
            case 5  : return getText(Type.B0066);
            case 6  : return getText(Type.B0067);
            case 7  : return getText(Type.B0068);
            case 8  : return getText(Type.B0069);
            case 9  : return getText(Type.B0070);
            case 10 : return getText(Type.B0071);
            case 11 : return getText(Type.B0072);
            case 12 : return getText(Type.B0073);
            case 13 : return getText(Type.B0074);
            case 14 : return getText(Type.B0075);
            case 15 : return getText(Type.B0076);
            default : return undefined;
        }
    }
}
