
namespace TinyWars.Chat.ChatProxy {
    import Notify       = Utility.Notify;
    import NotifyType   = Utility.Notify.Type;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_ChatAddMessage,             callback: _onSChatAddMessage, },
            { msgCode: ActionCode.S_ChatGetAllMessages,         callback: _onSChatGetAllMessages },
            { msgCode: ActionCode.S_ChatUpdateReadProgress,     callback: _onSChatUpdateReadProgress },
            { msgCode: ActionCode.S_ChatGetAllReadProgressList, callback: _onSChatGetAllReadProgressList },
        ], ChatProxy);
    }

    export function reqChatAddMessage(
        content     : string,
        toCategory  : number,
        toTarget    : number,
    ): void {
        NetManager.send({ C_ChatAddMessage: {
            toCategory,
            toTarget,
            content,
        }, });
    }
    function _onSChatAddMessage(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ChatAddMessage;
        if (!data.errorCode) {
            ChatModel.updateOnAddMessage(data.message, true);
            Notify.dispatch(NotifyType.SChatAddMessage, data);
        }
    }

    export function reqGetAllMessages(): void {
        NetManager.send({ C_ChatGetAllMessages: {} });
    }
    function _onSChatGetAllMessages(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ChatGetAllMessages;
        if (!data.errorCode) {
            ChatModel.setAllMessages(data.messageList);
            Notify.dispatch(NotifyType.SChatGetAllMessages, data);
        }
    }

    export function reqUpdateReadProgress(
        toCategory  : Types.ChatMessageToCategory,
        toTarget    : number,
        timestamp   = Time.TimeModel.getServerTimestamp(),
    ): void {
        NetManager.send({ C_ChatUpdateReadProgress: {
            progress: {
                toCategory,
                toTarget,
                timestamp,
            },
        } });
    }
    function _onSChatUpdateReadProgress(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ChatUpdateReadProgress;
        if (!data.errorCode) {
            ChatModel.setReadProgress(data.progress);
            Notify.dispatch(NotifyType.SChatUpdateReadProgress, data);
        }
    }

    export function reqGetAllReadProgressList(): void {
        NetManager.send({ C_ChatGetAllReadProgressList: {} });
    }
    function _onSChatGetAllReadProgressList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ChatGetAllReadProgressList;
        if (!data.errorCode) {
            ChatModel.resetAllReadProgress(data.list);
            Notify.dispatch(NotifyType.SChatGetAllReadProgressList, data);
        }
    }
}
