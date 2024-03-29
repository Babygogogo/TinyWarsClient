
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Leaderboard.LeaderboardModel {
    import WarType                  = Types.WarType;
    import ISpmOverallSingleData    = CommonProto.Leaderboard.LeaderboardSpmOverall.ISingleData;

    const _spmOverallTopDataArrayAccessor = Helpers.createCachedDataAccessor<null, ISpmOverallSingleData[]>({
        reqData: () => Leaderboard.LeaderboardProxy.reqLbSpmOverallGetTopDataArray(),
    });
    const _spmOverallRankIndexAccessor = Helpers.createCachedDataAccessor<number, number>({
        reqData: (userId: number) => Leaderboard.LeaderboardProxy.reqLbSpmOverallGetRankIndex(userId),
    });
    const _mrwStdRankIndexAccessor = Helpers.createCachedDataAccessor<number, number>({
        reqData: (userId: number) => LeaderboardProxy.reqLbMrwGetRankIndex(WarType.MrwStd, 2, userId),
    });
    const _mrwFogRankIndexAccessor = Helpers.createCachedDataAccessor<number, number>({
        reqData: (userId: number) => LeaderboardProxy.reqLbMrwGetRankIndex(WarType.MrwFog, 2, userId),
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

    export function getMrwRankIndex(warType: WarType, userId: number): Promise<number | null> {
        if (warType === WarType.MrwStd) {
            return _mrwStdRankIndexAccessor.getData(userId);
        } else if (warType === WarType.MrwFog) {
            return _mrwFogRankIndexAccessor.getData(userId);
        } else {
            throw Helpers.newError(`Invalid warType: ${warType}`);
        }
    }
    export function updateOnMsgLbMrwGetRankIndex(data: CommonProto.NetMessage.MsgLbMrwGetRankIndex.IS): void {
        const userId    = Helpers.getExisted(data.userId);
        const warType   = data.warType;
        const rankIndex = data.rankIndex ?? null;
        if (warType === WarType.MrwStd) {
            _mrwStdRankIndexAccessor.setData(userId, rankIndex);
        } else if (warType === WarType.MrwFog) {
            _mrwFogRankIndexAccessor.setData(userId, rankIndex);
        } else {
            throw Helpers.newError(`Invalid warType: ${warType}`);
        }
    }
}
