
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import Notify               from "../../tools/notify/Notify";
// import NetManager           from "../../tools/network/NetManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import BroadcastModel       from "./BroadcastModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Broadcast.BroadcastProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import ILanguageText    = CommonProto.Structure.ILanguageText;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgBroadcastAddMessage,              callback: _onMsgBroadcastAddMessage },
            { msgCode: NetMessageCodes.MsgBroadcastDeleteMessage,           callback: _onMsgBroadcastDeleteMessage, },
            { msgCode: NetMessageCodes.MsgBroadcastDoBroadcast,             callback: _onMsgBroadcastDoBroadcast },
            { msgCode: NetMessageCodes.MsgBroadcastGetAllMessageIdArray,    callback: _onMsgBroadcastGetAllMessageIdArray, },
            { msgCode: NetMessageCodes.MsgBroadcastGetMessageData,          callback: _onMsgBroadcastGetMessageData },
        ], null);
    }

    export function reqBroadcastAddMessage(textList: ILanguageText[], startTime: number, endTime: number): void {
        NetManager.send({
            MsgBroadcastAddMessage: { c: {
                textList,
                startTime,
                endTime,
            } },
        });
    }
    function _onMsgBroadcastAddMessage(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgBroadcastAddMessage.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgBroadcastAddMessage, data);
        }
    }

    export function reqBroadcastDeleteMessage(messageId: number): void {
        NetManager.send({
            MsgBroadcastDeleteMessage: { c: {
                messageId,
            } },
        });
    }
    function _onMsgBroadcastDeleteMessage(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgBroadcastDeleteMessage.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgBroadcastDeleteMessage, data);
        }
    }

    export function reqBroadcastDoBroadcast(): void {
        NetManager.send({
            MsgBroadcastDoBroadcast: { c: {
            } },
        });
    }
    function _onMsgBroadcastDoBroadcast(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgBroadcastDoBroadcast.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgBroadcastDoBroadcast, data);
        }
    }

    export function reqBroadcastGetAllMessageIdArray(): void {
        NetManager.send({ MsgBroadcastGetAllMessageIdArray: { c: {
        } }, });
    }
    function _onMsgBroadcastGetAllMessageIdArray(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgBroadcastGetAllMessageIdArray.IS;
        if (!data.errorCode) {
            Twns.Broadcast.BroadcastModel.setAllMessageIdArray(data.messageIdArray || []);
            Twns.Notify.dispatch(NotifyType.MsgBroadcastGetAllMessageIdArray, data);
        }
    }

    export function reqBroadcastGetMessageData(messageId: number): void {
        NetManager.send({ MsgBroadcastGetMessageData: { c: {
            messageId,
        } } });
    }
    function _onMsgBroadcastGetMessageData(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgBroadcastGetMessageData.IS;
        if (!data.errorCode) {
            Twns.Broadcast.BroadcastModel.setMessageData(Helpers.getExisted(data.messageId), data.messageData ?? null);
            Twns.Notify.dispatch(NotifyType.MsgBroadcastGetMessageData, data);
        }
    }
}

// export default BroadcastProxy;
