
namespace TinyWars.Utility.Lang {
    import ErrCode = Network.NetErrorCode;

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

        B1000, B1001, B1002, B1003, B1004, B1005, B1006, B1007, B1008, B1009,
        B1010, B1011, B1012, B1013, B1014, B1015, B1016, B1017, B1018, B1019,
        B1020, B1021, B1022, B1023, B1024, B1025, B1026, B1027, B1028, B1029,
        B1030, B1031, B1032, B1033, B1034, B1035, B1036, B1037, B1038, B1039,

        F0000, F0001, F0002, F0003, F0004, F0005, F0006, F0007, F0008, F0009,
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
    ]);

    const NET_ERROR_TEXT = new Map<ErrCode, string[]>([
        [ErrCode.IllegalRequest, [
            "非法请求",
            "Illegal request.",
        ]],
        [ErrCode.Login_InvalidAccountOrPassword, [
            "账号或密码不正确，请检查后重试",
            "Invalid account and/or password.",
        ]],
        [ErrCode.Login_AlreadyLoggedIn, [
            "您已处于登陆状态，不可再次登陆",
            "You have logged in already.",
        ]],
        [ErrCode.Register_InvalidAccount, [
            "账号不符合要求，请检查后重试",
            "Invalid account.",
        ]],
        [ErrCode.Register_UsedAccount, [
            "该账号已被注册，请修改后再试",
            "The account has been registered.",
        ]],
        [ErrCode.Register_AlreadyLoggedIn, [
            "您已处于登陆状态，不可注册账号",
            "You have logged in already.",
        ]],
        [ErrCode.Register_InvalidPassword, [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
        ]],
        [ErrCode.Register_InvalidNickname, [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ]],
        [ErrCode.Register_UsedNickname, [
            "该昵称已被使用，请修改后再试",
            "The nickname has been used.",
        ]],
        [ErrCode.CreateMultiCustomWar_TooManyJoinedWars, [
            "您已参与了许多未开始的战局，请退出部分后重试",
            "You have joined too many wars.",
        ]],
        [ErrCode.CreateMultiCustomWar_InvalidParams, [
            "部分设定不符合规则，请检查后重试",
            "Invalid settings.",
        ]],
        [ErrCode.ExitMultiCustomWar_WarInfoNotExist, [
            "战局不存在",
            "The game doesn't exist.",
        ]],
        [ErrCode.ExitMultiCustomWar_NotJoined, [
            "您并未参加该战局",
            "You haven't joined the game.",
        ]],
        [ErrCode.JoinMultiCustomWar_TooManyJoinedWars, [
            "您已参与了许多未开始的战局，请退出部分后重试",
            "You have joined too many wars.",
        ]],
        [ErrCode.JoinMultiCustomWar_InvalidParams, [
            "部分设定不符合规则，请检查后重试",
            "Invalid settings.",
        ]],
        [ErrCode.JoinMultiCustomWar_WarInfoNotExist, [
            "房间不存在",
            "The game doesn't exist.",
        ]],
        [ErrCode.JoinMultiCustomWar_AlreadyJoined, [
            "您已加入了该房间。",
            "You have already joined the game.",
        ]],
        [ErrCode.ServerDisconnect_ServerMaintainance, [
            `服务器维护中`,
            `The server is under maintainance.`,
        ]],
        [ErrCode.McrContinueWar_NoSuchWar, [
            `战局不存在`,
            `The game doesn't exist.`,
        ]],
        [ErrCode.McrContinueWar_DefeatedOrNotJoined, [
            `您未参与该战局，或已经被击败`,
            `You have not joined the game, or you have been defeated.`,
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

    export function getNetErrorText(code: ErrCode): string {
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
}
