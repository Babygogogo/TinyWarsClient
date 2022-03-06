
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace.LeaderboardModel {
    import ISpmOverallSingleData            = ProtoTypes.Leaderboard.LeaderboardSpmOverall.ISingleData;
    import ISpmOverallSingleDataWithRank    = ProtoTypes.NetMessage.MsgLbSpmOverallGetSingleData.IData;

    const _spmOverallTopDataArrayAccessor = Helpers.createCachedDataAccessor<null, ISpmOverallSingleData[]>({
        reqData: () => LeaderboardProxy.reqLbSpmOverallGetTopDataArray(),
    });
    const _spmOverallSingleDataAccessor = Helpers.createCachedDataAccessor<number, ISpmOverallSingleDataWithRank>({
        reqData: (userId: number) => LeaderboardProxy.reqLbSpmOverallGetSingleData(userId),
    });

    export function getSpmOverallTopDataArray(): Promise<ISpmOverallSingleData[] | null> {
        return _spmOverallTopDataArrayAccessor.getData(null);
    }
    export function setSpmOverallTopDataArray(dataArray: ISpmOverallSingleData[] | null): void {
        _spmOverallTopDataArrayAccessor.setData(null, dataArray);
    }

    export function getSpmOverallSingleData(userId: number): Promise<ISpmOverallSingleDataWithRank | null> {
        return _spmOverallSingleDataAccessor.getData(userId);
    }
    export function setSpmOverallSingleData(userId: number, data: ISpmOverallSingleDataWithRank | null): void {
        _spmOverallSingleDataAccessor.setData(userId, data);
    }
}
