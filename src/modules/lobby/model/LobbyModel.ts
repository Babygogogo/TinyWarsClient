
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsLobbyModel {
    export async function checkIsRedForMultiPlayer(): Promise<boolean> {
        return checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMcwWars(),
            MpwModel.checkIsRedForMyMfwWars(),
            MpwModel.checkIsRedForMyCcwWars(),
            McrModel.checkIsRed(),
            MfrModel.checkIsRed(),
            CcrModel.checkIsRed(),
            WwModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForRanking(): Promise<boolean> {
        return checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMrwWars(),
            MrrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
        return checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMcwWars(),
            McrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
        return checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMfwWars(),
            MfrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
        return checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyCcwWars(),
            CcrModel.checkIsRed(),
        ]);
    }

    async function checkIsAnyPromiseTrue(promiseArray: (Promise<boolean> | boolean)[]): Promise<boolean> {
        for (const promise of promiseArray) {
            if (await promise) {
                return true;
            }
        }
        return false;
    }
}
