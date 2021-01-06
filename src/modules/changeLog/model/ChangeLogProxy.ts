
namespace TinyWars.ChangeLog.ChangeLogProxy {
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import NetMessage   = ProtoTypes.NetMessage;
    import NetManager   = Network.NetManager;
    import NetworkCodes = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetworkCodes.MsgChangeLogAddMessage,         callback: _onMsgChangeLogAddMessage },
            { msgCode: NetworkCodes.MsgChangeLogModifyMessage,      callback: _onMsgChangeLogModifyMessage },
            { msgCode: NetworkCodes.MsgChangeLogGetMessageList,     callback: _onMsgChangeLogGetMessageList, },
        ], ChangeLogProxy);
    }

    export function reqChangeLogAddMessage(textList: string[]): void {
        NetManager.send({
            MsgChangeLogAddMessage: { c: {
                textList,
            } },
        });
    }
    function _onMsgChangeLogAddMessage(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgChangeLogAddMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgChangeLogAddMessage, data);
        }
    }

    export function reqChangeLogModifyMessage(messageId: number, textList: string[]): void {
        NetManager.send({
            MsgChangeLogModifyMessage: { c: {
                messageId,
                textList,
            } },
        })
    }
    function _onMsgChangeLogModifyMessage(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgChangeLogModifyMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgChangeLogModifyMessage, data);
        }
    }

    export function reqChangeLogGetMessageList(): void {
        NetManager.send({ MsgChangeLogGetMessageList: { c: {
        } }, });
    }
    function _onMsgChangeLogGetMessageList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChangeLogGetMessageList.IS;
        if (!data.errorCode) {
            ChangeLogModel.setAllMessageList(data.messageList);
            Notify.dispatch(Notify.Type.MsgChangeLogGetMessageList, data);
        }
    }
}
