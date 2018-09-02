
namespace Utility {
    import ErrCode = Network.NetErrorCode;

    export namespace Lang {
        export const enum Language {
            Chinese,
            English,
        }
        export const enum BigType {
            B00, // 各种提示
            B01, // 常用短语
        }
        export const enum SubType {
            S00, S01, S02, S03, S04, S05, S06, S07, S08, S09,
            S10, S11, S12, S13, S14, S15, S16, S17, S18, S19,
            S20, S21, S22, S23,
        }
        export const enum FormatType {
            F000, F001, F002, F003, F004, F005,
        }
        export const enum RichType {
            R000, R001, R002, R003,
        }

        const LANG_DATA: string[][][] = [
            [
                [ // 00-00
                    "登陆成功，祝您游戏愉快！",
                    "Logged in successfully!",
                ],
                [ // 00-01
                    "账号不符合要求，请检查后重试",
                    "Invalid account.",
                ],
                [ // 00-02
                    "昵称不符合要求，请检查后重试",
                    "Invalid nickname.",
                ],
                [ // 00-03
                    "密码不符合要求，请检查后重试",
                    "Invalid password.",
                ],
                [ // 00-04
                    "注册成功，正在自动登陆…",
                    "Register successfully! Now logging in...",
                ],
                [ // 00-05
                    "您已成功退出登陆，欢迎再次进入游戏。",
                    "Logout successfully.",
                ],
                [ // 00-06
                    "您的账号被异地登陆，您已自动下线。",
                    "Someone logged in with your account!",
                ],
                [ // 00-07
                    "已成功连接服务器。",
                    "Connected to server successfully.",
                ],
                [ // 00-08
                    "连接服务器失败，正在重新连接…",
                    "Failed to connect to server. Now reconnecting...",
                ],
                [ // 00-09
                    "您的网络连接不稳定，请尝试改善",
                    "The network connection is not stable.",
                ],
                [ // 00-10
                    "没有符合条件的地图，请更换条件再试",
                    "No maps found.",
                ],
                [ // 00-11
                    "正在查找地图",
                    "Searching for maps...",
                ],
                [ // 00-12
                    "已找到符合条件的地图",
                    "Maps found.",
                ],
                [ // 00-13
                    "发生网络错误，请重新登陆。",
                    "Network went wrong. Please re-login.",
                ],
                [ // 00-14
                    "发生网络错误，请稍后再试。",
                    "Network went wrong. Please try again later.",
                ],
                [ // 00-15
                    "已成功创建战局，请等待其他玩家加入",
                    "The war is created successfully.",
                ],
                [ // 00-16
                    "已成功退出房间",
                    "Quit successfully.",
                ],
                [ // 00-17
                    "密码不正确，请检查后重试",
                    "Invalid password.",
                ],
            ],
            [
                [ // 01-00
                    "创建房间",
                    "Create Game",
                ],
                [ // 01-01
                    "无",
                    "None",
                ],
                [ // 01-02
                    "基本设置",
                    "Basic Settings",
                ],
                [ // 01-03
                    "高级设置",
                    "Advanced Settings",
                ],
                [ // 01-04
                    "红方",
                    "red",
                ],
                [ // 01-05
                    "蓝方",
                    "blue",
                ],
                [ // 01-06
                    "黄方",
                    "yellow",
                ],
                [ // 01-07
                    "黑方",
                    "black",
                ],
                [ // 01-08
                    "A队",
                    "A Team",
                ],
                [ // 01-09
                    "B队",
                    "B Team",
                ],
                [ // 01-10
                    "C队",
                    "C Team",
                ],
                [ // 01-11
                    "D队",
                    "D Team",
                ],
                [ // 01-12
                    "是",
                    "Yes",
                ],
                [ // 01-13
                    "否",
                    "No",
                ],
                [ // 01-14
                    "天",
                    "d",
                ],
                [ // 01-15
                    "时",
                    "h",
                ],
                [ // 01-16
                    "分",
                    "m",
                ],
                [ // 01-17
                    "秒",
                    "s",
                ],
                [ // 01-18
                    "行动次序",
                    "Force",
                ],
                [ // 01-19
                    "队伍",
                    "Team",
                ],
                [ // 01-20
                    "战争迷雾",
                    "Fog",
                ],
                [ // 01-21
                    "回合显示",
                    "Time Limit",
                ],
                [ // 01-22
                    "退出房间",
                    "Exit Game"
                ],
                [ // 01-23
                    "加入房间",
                    "Join Game"
                ],
            ],
        ];

        const FORMAT_DATA: string[][] = [
            [ // 000
                "地图名称: %s",
                "Map name: %s",
            ],
            [ // 001
                "作者: %s",
                "Designer: %s",
            ],
            [ // 002
                "人数: %s",
                "Players: %s",
            ],
            [ // 003
                "全服评分: %s",
                "Rating: %s",
            ],
            [ // 004
                "全服游玩次数: %s",
                "Games played: %s",
            ],
            [ // 005
                "战争迷雾: %s",
                "Fog: %s",
            ],
        ];

        const NET_ERROR_TEXT: {[code: number]: string[]} = {
            [ErrCode.IllegalRequest]: [
                "非法请求",
                "Illegal request.",
            ],
            [ErrCode.Login_AlreadyLoggedIn]: [
                "您已处于登陆状态，不可再次登陆",
                "You have logged in already.",
            ],
            [ErrCode.Login_InvalidAccountOrPassword]: [
                "账号或密码不正确，请检查后重试",
                "Invalid account and/or password.",
            ],
            [ErrCode.Register_AlreadyLoggedIn]: [
                "您已处于登陆状态，不可注册账号",
                "You have logged in already.",
            ],
            [ErrCode.Register_InvalidAccount]: [
                "账号不符合要求，请检查后重试",
                "Invalid account.",
            ],
            [ErrCode.Register_InvalidNickname]: [
                "昵称不符合要求，请检查后重试",
                "Invalid nickname.",
            ],
            [ErrCode.Register_InvalidPassword]: [
                "密码不符合要求，请检查后重试",
                "Invalid password.",
            ],
            [ErrCode.Register_UsedAccount]: [
                "该账号已被注册，请修改后再试",
                "The account has been registered.",
            ],
            [ErrCode.Register_UsedNickname]: [
                "该昵称已被使用，请修改后再试",
                "The nickname has been used.",
            ],
            [ErrCode.CreateCustomOnlineWar_TooManyJoinedWars]: [
                "您已参与了许多未开始的战局，请退出部分后重试",
                "You have joined too many wars.",
            ],
            [ErrCode.CreateCustomOnlineWar_InvalidParams]: [
                "部分设定不符合规则，请检查后重试",
                "Invalid settings.",
            ],
            [ErrCode.ExitCustomOnlineWar_NotJoined]: [
                "您并未参加该战局",
                "You haven't joined the game.",
            ],
            [ErrCode.ExitCustomOnlineWar_WarInfoNotExist]: [
                "战局不存在",
                "The game doesn't exist.",
            ],
        };

const RICH_DATA: string[][] = [
[ // R000
`本选项影响您在回合中的行动顺序。

本游戏固定了每回合中的行动顺序为：
1 红方
2 蓝方
3 黄方
4 黑方
其中，2人局不存在黄方和黑方，3人局不存在黑方。
每个玩家只能选择其中一项，不能重复。

默认为当前可用选项中最靠前的一项。`,

`Untranslated...`,
],

[ // R001
`本选项规定您所属的队伍。

战局中，属于同一队伍的玩家共享视野，部队能够相互穿越，不能相互攻击/装载/用后勤车补给。
此外，可以使用队友的建筑来维修/补给自己的部队（消耗自己的金钱），但不能占领队友的建筑。

默认为当前未被其他玩家选用的队伍中最靠前的一项。`,

`Untranslated...`,
],

[ // R002
`本选项影响战局是明战或雾战。

明战下，您可以观察到整个战场的情况。雾战下，您只能看到自己军队的视野内的战场情况。
雾战难度相对较大。如果您是新手，建议先通过明战熟悉游戏系统，再尝试雾战模式。

默认为“否”（即明战）。`,

`Untranslated...`,
],

[ // R003
`本选项影响所有玩家的每回合的时限。

如果某个玩家的回合时间超出了本限制，则服务器将自动为该玩家执行投降操作。
当战局满员，或某个玩家结束回合后，则服务器自动开始下个玩家回合的倒计时（无论该玩家是否在线）。
因此，请仅在已约好对手的情况下才选择“15分”，以免造成不必要的败绩。

默认为“3天”。`,

`Untranslated`,
]

];

        let language = Language.Chinese;

        export function getText(bigType: BigType, subType: SubType): string {
            return LANG_DATA[bigType][subType][language];
        }

        export function getFormatedText(formatType: FormatType, ...params: any[]): string {
            return Helpers.formatString(FORMAT_DATA[formatType][language], ...params);
        }

        export function getNetErrorText(code: ErrCode): string {
            return NET_ERROR_TEXT[code][language];
        }

        export function getRichText(richType: RichType): string {
            return RICH_DATA[richType][language];
        }
    }
}
