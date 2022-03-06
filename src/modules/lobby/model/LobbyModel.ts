
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsLobbyModel {
    export async function checkIsRedForMultiPlayer(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
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
        return Helpers.checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMrwWars(),
            MrrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMcwWars(),
            McrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyMfwWars(),
            MfrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MpwModel.checkIsRedForMyCcwWars(),
            CcrModel.checkIsRed(),
        ]);
    }
}
