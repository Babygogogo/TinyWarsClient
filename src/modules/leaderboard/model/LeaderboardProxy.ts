
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Leaderboard.LeaderboardProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetTopDataArray,  callback: _onMsgLbSpmOverallGetTopDataArray, },
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetRankIndex,     callback: _onMsgLbSpmOverallGetRankIndex, },
        ]);
    }

    export function reqLbSpmOverallGetTopDataArray(): void {
        NetManager.send({ MsgLbSpmOverallGetTopDataArray: { c: {
        } } });
    }
    function _onMsgLbSpmOverallGetTopDataArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetTopDataArray.IS;
        if (!data.errorCode) {
            Leaderboard.LeaderboardModel.setSpmOverallTopDataArray(data.dataArray ?? null);
            Twns.Notify.dispatch(NotifyType.MsgLbSpmOverallGetTopDataArray, data);
        }
    }

    export function reqLbSpmOverallGetRankIndex(userId: number): void {
        NetManager.send({ MsgLbSpmOverallGetRankIndex: { c: {
            userId,
        } } });
    }
    function _onMsgLbSpmOverallGetRankIndex(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetRankIndex.IS;
        if (!data.errorCode) {
            Leaderboard.LeaderboardModel.setSpmOverallRankIndex(Helpers.getExisted(data.userId), data.rankIndex ?? null);
            Twns.Notify.dispatch(NotifyType.MsgLbSpmOverallGetRankIndex, data);
        }
    }
}
