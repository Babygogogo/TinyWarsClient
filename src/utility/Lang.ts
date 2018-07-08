
namespace Utility {
    export namespace Lang {
        export const enum Language {
            Chinese,
            English,
        }
        export const enum BigType {
            B00, // 各种提示
        }
        export const enum SubType {
            S00, S01, S02, S03, S04,
        }

        const Configs: string[][][] = [
            [
                [
                    "账号或密码不正确，请检查后重试",
                    "Invalid account and/or password.",
                ],
                [
                    "您已处于登陆状态，不可再次登陆",
                    "You have logged in already.",
                ],
                [
                    "登陆成功，祝您游戏愉快！",
                    "Logged in successfully!",
                ],
            ],
        ];

        let language = Language.Chinese;

        export function getText(bigType: BigType, subType: SubType, ...params: any[]): string {
            return Configs[bigType][subType][language];
        }
    }
}
