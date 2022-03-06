
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace.LeaderboardProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
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
            LeaderboardModel.setSpmOverallTopDataArray(data.dataArray ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetTopDataArray, data);
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
            LeaderboardModel.setSpmOverallRankIndex(Helpers.getExisted(data.userId), data.rankIndex ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetRankIndex, data);
        }
    }
}
