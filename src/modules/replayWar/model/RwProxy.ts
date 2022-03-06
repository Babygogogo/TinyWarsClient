
// import TwnsNetMessageCodes          from "../../tools/network/NetMessageCodes";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import RwModel                      from "./RwModel";
// import NetManager                   from "../../tools/network/NetManager";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace RwProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgReplayGetReplayIdArray,   callback: _onMsgReplayGetReplayIdArray },
            { msgCode: NetMessageCodes.MsgReplayGetData,            callback: _onMsgReplayGetData },
            { msgCode: NetMessageCodes.MsgReplayGetInfo,            callback: _onMsgReplayGetInfo },
            { msgCode: NetMessageCodes.MsgReplaySetRating,          callback: _onMsgReplaySetRating },
        ], null);
    }

    export function reqReplayGetReplayIdArray(replayFilter: ProtoTypes.Replay.IReplayFilter | null): void {
        NetManager.send({
            MsgReplayGetReplayIdArray: { c: {
                replayFilter,
            }, },
        });
    }
    function _onMsgReplayGetReplayIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetReplayIdArray.IS;
        if (!data.errorCode) {
            RwModel.setReplayIdArray(data.replayIdArray || []);
            Notify.dispatch(NotifyType.MsgReplayGetReplayIdArray, data);
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
        if (!data.errorCode) {
            RwModel.updateOnMsgReplayGetData(data);
            Notify.dispatch(NotifyType.MsgReplayGetData, data);
        }
    }

    export function reqReplayGetInfo(replayId: number): void {
        NetManager.send({
            MsgReplayGetInfo: { c: {
                replayId,
            }, },
        });
    }
    function _onMsgReplayGetInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetInfo.IS;
        if (!data.errorCode) {
            RwModel.setReplayInfo(Helpers.getExisted(data.replayId), data.replayInfo ?? null);
            Notify.dispatch(NotifyType.MsgReplayGetInfo, data);
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

// export default RwProxy;
