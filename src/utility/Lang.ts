
namespace Utility {
    export namespace Lang {
        import ErrCode = Network.NetErrorCode;

        export const enum Language {
            Chinese,
            English,
        }
        export const enum BigType {
            B00, // 各种提示
        }
        export const enum SubType {
            S00, S01, S02, S03, S04, S05, S06, S07, S08, S09,
        }

        const LangData: string[][][] = [
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
            ],
        ];

        const NetErrorText: {[code: number]: string[]} = {
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
        };

        let language = Language.Chinese;

        export function getText(bigType: BigType, subType: SubType, ...params: any[]): string {
            return LangData[bigType][subType][language];
        }

        export function getNetErrorText(code: ErrCode): string {
            return NetErrorText[code][language];
        }
    }
}
