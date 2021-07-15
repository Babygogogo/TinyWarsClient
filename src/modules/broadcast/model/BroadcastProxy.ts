
import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import Notify               from "../../tools/notify/Notify";
import NetManager           from "../../tools/network/NetManager";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import BroadcastModel       from "./BroadcastModel";

namespace BroadcastProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgBroadcastAddMessage,         callback: _onMsgBroadcastAddMessage },
            { msgCode: NetMessageCodes.MsgBroadcastDeleteMessage,      callback: _onMsgBroadcastDeleteMessage, },
            { msgCode: NetMessageCodes.MsgBroadcastDoBroadcast,        callback: _onMsgBroadcastDoBroadcast },
            { msgCode: NetMessageCodes.MsgBroadcastGetMessageList,     callback: _onMsgBroadcastGetMessageList, },
        ], undefined);
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
        const data = e.data as ProtoTypes.NetMessage.MsgBroadcastAddMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgBroadcastAddMessage, data);
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
        const data = e.data as ProtoTypes.NetMessage.MsgBroadcastDeleteMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgBroadcastDeleteMessage, data);
        }
    }

    export function reqBroadcastDoBroadcast(): void {
        NetManager.send({
            MsgBroadcastDoBroadcast: { c: {
            } },
        });
    }
    function _onMsgBroadcastDoBroadcast(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgBroadcastDoBroadcast.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgBroadcastDoBroadcast, data);
        }
    }

    export function reqBroadcastGetMessageList(): void {
        NetManager.send({ MsgBroadcastGetMessageList: { c: {
        } }, });
    }
    function _onMsgBroadcastGetMessageList(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgBroadcastGetMessageList.IS;
        if (!data.errorCode) {
            BroadcastModel.setAllMessageList(data.messageList);
            Notify.dispatch(NotifyType.MsgBroadcastGetMessageList, data);
        }
    }
}

export default BroadcastProxy;
