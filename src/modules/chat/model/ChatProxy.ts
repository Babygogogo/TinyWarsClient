
namespace TinyWars.Chat.ChatProxy {
    import Notify     = Utility.Notify;
    import NotifyType = Utility.Notify.Type;
    import ProtoTypes = Utility.ProtoTypes;
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_ChatAddMessage,         callback: _onSChatAddMessage, },
            { msgCode: ActionCode.S_ChatGetAllMessages,     callback: _onSChatGetAllMessages },
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

    function _onSChatGetAllMessages(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ChatGetAllMessages;
        if (!data.errorCode) {
            ChatModel.setAllMessages(data.messageList);
            Notify.dispatch(NotifyType.SChatGetAllMessages, data);
        }
    }
}
