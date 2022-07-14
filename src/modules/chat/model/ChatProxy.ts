
// import Helpers              from "../../tools/helpers/Helpers";
// import Timer                from "../../tools/helpers/Timer";
// import Types                from "../../tools/helpers/Types";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import ChatModel            from "./ChatModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Chat.ChatProxy {
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Twns.Net.NetMessageCodes;
    import NotifyType       = Twns.Notify.NotifyType;

    export function init(): void {
        Twns.Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgChatAddMessage,               callback: _onMsgChatAddMessage },
            { msgCode: NetMessageCodes.MsgChatGetAllMessages,           callback: _onMsgChatGetAllMessages },
            { msgCode: NetMessageCodes.MsgChatUpdateReadProgress,       callback: _onMsgChatUpdateReadProgress },
            { msgCode: NetMessageCodes.MsgChatGetAllReadProgressList,   callback: _onMsgChatGetAllReadProgressList },
            { msgCode: NetMessageCodes.MsgChatDeleteMessage,            callback: _onMsgChatDeleteMessage },
        ], null);
    }

    export function reqChatAddMessage(
        content     : string,
        toCategory  : Twns.Types.ChatMessageToCategory,
        toTarget    : number,
    ): void {
        Twns.Net.NetManager.send({ MsgChatAddMessage: { c: {
            toCategory,
            toTarget,
            content,
        }, } });
    }
    function _onMsgChatAddMessage(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatAddMessage.IS;
        if (!data.errorCode) {
            Twns.Chat.ChatModel.updateOnAddMessage(Twns.Helpers.getExisted(data.message), true);
            Twns.Notify.dispatch(NotifyType.MsgChatAddMessage, data);
        }
    }

    export function reqGetAllMessages(): void {
        Twns.Net.NetManager.send({ MsgChatGetAllMessages: { c: {} } });
    }
    function _onMsgChatGetAllMessages(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllMessages.IS;
        if (!data.errorCode) {
            Twns.Chat.ChatModel.setAllMessages(data.messageList || []);
            Twns.Notify.dispatch(NotifyType.MsgChatGetAllMessages, data);
        }
    }

    export function reqUpdateReadProgress(
        toCategory  : Twns.Types.ChatMessageToCategory,
        toTarget    : number,
        timestamp   = Twns.Timer.getServerTimestamp(),
    ): void {
        Twns.Net.NetManager.send({ MsgChatUpdateReadProgress: { c: {
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
            Twns.Chat.ChatModel.setReadProgress(Twns.Helpers.getExisted(data.progress));
            Twns.Notify.dispatch(NotifyType.MsgChatUpdateReadProgress, data);
        }
    }

    export function reqGetAllReadProgressList(): void {
        Twns.Net.NetManager.send({ MsgChatGetAllReadProgressList: { c: {} } });
    }
    function _onMsgChatGetAllReadProgressList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllReadProgressList.IS;
        if (!data.errorCode) {
            Twns.Chat.ChatModel.resetAllReadProgress(data.list || []);
            Twns.Notify.dispatch(NotifyType.MsgChatGetAllReadProgressList, data);
        }
    }

    export function reqChatDeleteMessage(messageId: number): void {
        Twns.Net.NetManager.send({ MsgChatDeleteMessage: { c: { messageId } } });
    }
    function _onMsgChatDeleteMessage(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatDeleteMessage.IS;
        if (!data.errorCode) {
            Twns.Chat.ChatModel.updateOnDeleteMessage(Twns.Helpers.getExisted(data.messageId));
            Twns.Notify.dispatch(NotifyType.MsgChatDeleteMessage, data);
        }
    }
}

// export default ChatProxy;
