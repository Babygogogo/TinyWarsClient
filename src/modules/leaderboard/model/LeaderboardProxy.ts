
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Leaderboard.LeaderboardProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetTopDataArray,  callback: _onMsgLbSpmOverallGetTopDataArray, },
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetRankIndex,     callback: _onMsgLbSpmOverallGetRankIndex, },
            { msgCode: NetMessageCodes.MsgLbMrwGetRankIndex,            callback: _onMsgLbMrwGetRankIndex },
        ]);
    }

    export function reqLbSpmOverallGetTopDataArray(): void {
        Net.NetManager.send({ MsgLbSpmOverallGetTopDataArray: { c: {
        } } });
    }
    function _onMsgLbSpmOverallGetTopDataArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetTopDataArray.IS;
        if (!data.errorCode) {
            Leaderboard.LeaderboardModel.setSpmOverallTopDataArray(data.dataArray ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetTopDataArray, data);
        }
    }

    export function reqLbSpmOverallGetRankIndex(userId: number): void {
        Net.NetManager.send({ MsgLbSpmOverallGetRankIndex: { c: {
            userId,
        } } });
    }
    function _onMsgLbSpmOverallGetRankIndex(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetRankIndex.IS;
        if (!data.errorCode) {
            Leaderboard.LeaderboardModel.setSpmOverallRankIndex(Helpers.getExisted(data.userId), data.rankIndex ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetRankIndex, data);
        }
    }

    export function reqLbMrwGetRankIndex(warType: Types.WarType, playersCountUnneutral: number, userId: number): void {
        Net.NetManager.send({ MsgLbMrwGetRankIndex: { c: {
            warType,
            playersCountUnneutral,
            userId,
        } } });
    }
    function _onMsgLbMrwGetRankIndex(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbMrwGetRankIndex.IS;
        if (!data.errorCode) {
            LeaderboardModel.updateOnMsgLbMrwGetRankIndex(data);
            Notify.dispatch(NotifyType.MsgLbMrwGetRankIndex, data);
        }
    }
}
