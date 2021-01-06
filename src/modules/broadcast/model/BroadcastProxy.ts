
namespace TinyWars.Broadcast.BroadcastProxy {
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetManager       = Network.NetManager;
    import NetworkCodes     = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetworkCodes.MsgBroadcastAddMessage,         callback: _onMsgBroadcastAddMessage },
            { msgCode: NetworkCodes.MsgBroadcastDeleteMessage,      callback: _onMsgBroadcastDeleteMessage, },
            { msgCode: NetworkCodes.MsgBroadcastDoBroadcast,        callback: _onMsgBroadcastDoBroadcast },
            { msgCode: NetworkCodes.MsgBroadcastGetMessageList,     callback: _onMsgBroadcastGetMessageList, },
        ], BroadcastProxy);
    }

    export function reqBroadcastAddMessage(textList: string[], startTime: number, endTime: number): void {
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
            Notify.dispatch(Notify.Type.MsgBroadcastAddMessage, data);
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
            Notify.dispatch(Notify.Type.MsgBroadcastDeleteMessage, data);
        }
    }

    export function reqBroadcastDoBroadcast(): void {
        NetManager.send({
            MsgBroadcastDoBroadcast: { c: {
            } },
        })
    }
    function _onMsgBroadcastDoBroadcast(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgBroadcastDoBroadcast.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgBroadcastDoBroadcast, data);
        }
    }

    export function reqBroadcastGetMessageList(): void {
        NetManager.send({ MsgBroadcastGetMessageList: { c: {
        } }, });
    }
    function _onMsgBroadcastGetMessageList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgBroadcastGetMessageList.IS;
        if (!data.errorCode) {
            BroadcastModel.setAllMessageList(data.messageList);
            Notify.dispatch(Notify.Type.MsgBroadcastGetMessageList, data);
        }
    }
}
