
import TwnsNetMessageCodes          from "../../tools/network/NetMessageCodes";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import RwModel                      from "./RwModel";
import NetManager                   from "../../tools/network/NetManager";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";

namespace RwProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgReplayGetInfoList,    callback: _onMsgReplayGetInfoList },
            { msgCode: NetMessageCodes.MsgReplayGetData,        callback: _onMsgReplayGetData },
            { msgCode: NetMessageCodes.MsgReplaySetRating,      callback: _onMsgReplaySetRating },
        ], null);
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
            RwModel.setReplayInfoList(data.infos || []);
            Notify.dispatch(NotifyType.MsgReplayGetInfoList, data);
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
            Notify.dispatch(NotifyType.MsgReplayGetDataFailed);
        } else {
            RwModel.setReplayData(data);
            Notify.dispatch(NotifyType.MsgReplayGetData, data);
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
            Notify.dispatch(NotifyType.MsgReplaySetRating, data);
        }
    }
}

export default RwProxy;
