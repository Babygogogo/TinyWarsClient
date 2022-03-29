
// import TwnsNetMessageCodes          from "../../tools/network/NetMessageCodes";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import RwModel                      from "./RwModel";
// import NetManager                   from "../../tools/network/NetManager";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace RwProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgReplayGetReplayIdArray,   callback: _onMsgReplayGetReplayIdArray },
            { msgCode: NetMessageCodes.MsgReplayGetData,            callback: _onMsgReplayGetData },
            { msgCode: NetMessageCodes.MsgReplayGetReplayInfo,      callback: _onMsgReplayGetReplayInfo },
            { msgCode: NetMessageCodes.MsgReplayGetSelfRating,      callback: _onMsgReplayGetSelfRating },
            { msgCode: NetMessageCodes.MsgReplaySetSelfRating,      callback: _onMsgReplaySetSelfRating },
        ], null);
    }

    export function reqReplayGetReplayIdArray(replayFilter: CommonProto.Replay.IReplayFilter | null): void {
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

    export function reqReplayGetReplayInfo(replayId: number): void {
        NetManager.send({
            MsgReplayGetReplayInfo: { c: {
                replayId,
            }, },
        });
    }
    function _onMsgReplayGetReplayInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetReplayInfo.IS;
        if (!data.errorCode) {
            RwModel.setReplayInfo(Helpers.getExisted(data.replayId), data.replayInfo ?? null);
            Notify.dispatch(NotifyType.MsgReplayGetBriefInfo, data);
        }
    }

    export function reqReplayGetSelfRating(replayId: number): void {
        NetManager.send({
            MsgReplayGetSelfRating: { c: {
                replayId,
            }, },
        });
    }
    function _onMsgReplayGetSelfRating(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplayGetSelfRating.IS;
        if (!data.errorCode) {
            RwModel.setReplaySelfRating(Helpers.getExisted(data.replayId), data.rating ?? null);
            Notify.dispatch(NotifyType.MsgReplayGetSelfRating, data);
        }
    }

    export function reqReplaySetSelfRating(replayId: number, rating: number): void {
        NetManager.send({
            MsgReplaySetSelfRating: { c: {
                replayId,
                rating,
            }, },
        });
    }
    function _onMsgReplaySetSelfRating(e: egret.Event): void {
        const data = e.data as NetMessage.MsgReplaySetSelfRating.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgReplaySetSelfRating, data);
        }
    }
}

// export default RwProxy;
