
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Leaderboard.LeaderboardModel {
    import ISpmOverallSingleData    = CommonProto.Leaderboard.LeaderboardSpmOverall.ISingleData;

    const _spmOverallTopDataArrayAccessor = Twns.Helpers.createCachedDataAccessor<null, ISpmOverallSingleData[]>({
        reqData: () => Leaderboard.LeaderboardProxy.reqLbSpmOverallGetTopDataArray(),
    });
    const _spmOverallRankIndexAccessor = Twns.Helpers.createCachedDataAccessor<number, number>({
        reqData: (userId: number) => Leaderboard.LeaderboardProxy.reqLbSpmOverallGetRankIndex(userId),
    });

    export function getSpmOverallTopDataArray(): Promise<ISpmOverallSingleData[] | null> {
        return _spmOverallTopDataArrayAccessor.getData(null);
    }
    export function setSpmOverallTopDataArray(dataArray: ISpmOverallSingleData[] | null): void {
        _spmOverallTopDataArrayAccessor.setData(null, dataArray);
    }

    export function getSpmOverallRankIndex(userId: number): Promise<number | null> {
        return _spmOverallRankIndexAccessor.getData(userId);
    }
    export function setSpmOverallRankIndex(userId: number, data: number | null): void {
        _spmOverallRankIndexAccessor.setData(userId, data);
    }
}
