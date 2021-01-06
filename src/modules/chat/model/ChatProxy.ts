
namespace TinyWars.Chat.ChatProxy {
    import Notify       = Utility.Notify;
    import NotifyType   = Utility.Notify.Type;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgChatAddMessage,                callback: _onMsgChatAddMessage,             },
            { msgCode: ActionCode.MsgChatGetAllMessages,            callback: _onMsgChatGetAllMessages          },
            { msgCode: ActionCode.MsgChatUpdateReadProgress,        callback: _onMsgChatUpdateReadProgress      },
            { msgCode: ActionCode.MsgChatGetAllReadProgressList,    callback: _onMsgChatGetAllReadProgressList  },
        ], ChatProxy);
    }

    export function reqChatAddMessage(
        content     : string,
        toCategory  : Types.ChatMessageToCategory,
        toTarget    : number,
    ): void {
        NetManager.send({ MsgChatAddMessage: { c: {
            toCategory,
            toTarget,
            content,
        }, } });
    }
    function _onMsgChatAddMessage(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatAddMessage.IS;
        if (!data.errorCode) {
            ChatModel.updateOnAddMessage(data.message, true);
            Notify.dispatch(NotifyType.MsgChatAddMessage, data);
        }
    }

    export function reqGetAllMessages(): void {
        NetManager.send({ MsgChatGetAllMessages: { c: {} } });
    }
    function _onMsgChatGetAllMessages(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllMessages.IS;
        if (!data.errorCode) {
            ChatModel.setAllMessages(data.messageList);
            Notify.dispatch(NotifyType.MsgChatGetAllMessages, data);
        }
    }

    export function reqUpdateReadProgress(
        toCategory  : Types.ChatMessageToCategory,
        toTarget    : number,
        timestamp   = Time.TimeModel.getServerTimestamp(),
    ): void {
        NetManager.send({ MsgChatUpdateReadProgress: { c: {
            progress: {
                toCategory,
                toTarget,
                timestamp,
            }, }
        } });
    }
    function _onMsgChatUpdateReadProgress(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatUpdateReadProgress.IS;
        if (!data.errorCode) {
            ChatModel.setReadProgress(data.progress);
            Notify.dispatch(NotifyType.MsgChatUpdateReadProgress, data);
        }
    }

    export function reqGetAllReadProgressList(): void {
        NetManager.send({ MsgChatGetAllReadProgressList: { c: {} } });
    }
    function _onMsgChatGetAllReadProgressList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllReadProgressList.IS;
        if (!data.errorCode) {
            ChatModel.resetAllReadProgress(data.list);
            Notify.dispatch(NotifyType.MsgChatGetAllReadProgressList, data);
        }
    }
}
