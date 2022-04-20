
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lobby.LobbyModel {
    export async function checkIsRedForMultiPlayer(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars(),
            MultiPlayerWar.MpwModel.checkIsRedForMyMfwWars(),
            MultiPlayerWar.MpwModel.checkIsRedForMyCcwWars(),
            MultiCustomRoom.McrModel.checkIsRed(),
            MultiFreeRoom.MfrModel.checkIsRed(),
            CoopCustomRoom.CcrModel.checkIsRed(),
            Twns.WatchWar.WwModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForRanking(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars(),
            Twns.MultiRankRoom.MrrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCustomMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars(),
            MultiCustomRoom.McrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiFreeMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MultiPlayerWar.MpwModel.checkIsRedForMyMfwWars(),
            MultiFreeRoom.MfrModel.checkIsRed(),
        ]);
    }

    export async function checkIsRedForMultiCoopMode(): Promise<boolean> {
        return Helpers.checkIsAnyPromiseTrue([
            MultiPlayerWar.MpwModel.checkIsRedForMyCcwWars(),
            CoopCustomRoom.CcrModel.checkIsRed(),
        ]);
    }
}
