
namespace TinyWars.ReplayWar.RwProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import NetMessage       = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgReplayGetInfoList,    callback: _onMsgReplayGetInfoList },
            { msgCode: NetMessageCodes.MsgReplayGetData,        callback: _onMsgReplayGetData },
            { msgCode: NetMessageCodes.MsgReplaySetRating,      callback: _onMsgReplaySetRating },
        ], RwProxy);
    }

    export function reqReplayInfos(replayFilter: ProtoTypes.Replay.IReplayFilter | null): void {
        NetManager.send({
            MsgReplayGetInfoList: { c: {
                replayFilter,
            }, },
        });
    }
    function _onMsgReplayGetInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetInfoList.IS;
        if (!data.errorCode) {
            RwModel.setReplayInfoList(data.infos);
            Notify.dispatch(Notify.Type.MsgReplayGetInfoList, data);
        }
    }

    export function reqReplayGetData(replayId: number): void {
        NetManager.send({
            MsgReplayGetData: { c: {
                replayId,
            }, },
        });
    }
    function _onMsgReplayGetData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetData.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgReplayGetDataFailed);
        } else {
            RwModel.setReplayData(data);
            Notify.dispatch(Notify.Type.MsgReplayGetData, data);
        }
    }

    export function reqReplaySetRating(replayId: number, rating: number): void {
        NetManager.send({
            MsgReplaySetRating: { c: {
                replayId,
                rating,
            }, },
        });
    }
    function _onMsgReplaySetRating(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplaySetRating.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgReplaySetRating, data);
        }
    }
}
