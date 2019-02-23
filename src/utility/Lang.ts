
namespace TinyWars.Utility.Lang {
    import ErrCode = Network.NetErrorCode;

    export const enum Language {
        Chinese,
        English,
    }
    export const enum BigType {
        B00, // 各种提示
        B01, // 常用短语
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
    }
    export const enum FormatType {
        F000, F001, F002, F003, F004, F005,
    }
    export const enum RichType {
        R000, R001, R002, R003,
    }

    const _LANG_DATA = new Map<Type, string[]>([
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
    ]);

    const FORMAT_DATA = new Map<FormatType, string[]>([
        [FormatType.F000, [
            "地图名称: %s",
            "Map name: %s",
        ]],
        [FormatType.F001, [
            "作者: %s",
            "Designer: %s",
        ]],
        [FormatType.F002, [
            "人数: %s",
            "Players: %s",
        ]],
        [FormatType.F003, [
            "全服评分: %s",
            "Rating: %s",
        ]],
        [FormatType.F004, [
            "全服游玩次数: %s",
            "Games played: %s",
        ]],
        [FormatType.F005, [
            "战争迷雾: %s",
            "Fog: %s",
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

    export function getFormatedText(formatType: FormatType, ...params: any[]): string {
        return Helpers.formatString(FORMAT_DATA.get(formatType)[language], ...params);
    }

    export function getNetErrorText(code: ErrCode): string {
        return NET_ERROR_TEXT.get(code)[language];
    }

    export function getRichText(richType: RichType): string {
        return RICH_DATA.get(richType)[language];
    }
}
