
namespace TinyWars.Chat.ChatModel {
    import Notify       = Utility.Notify;
    import NotifyType   = Utility.Notify.Type;
    import ProtoTypes   = Utility.ProtoTypes;
    import Logger       = Utility.Logger;
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ChatMessage  = ProtoTypes.IChatMessage;

    type MessageDict        = Map<number, ChatMessage[]>;
    const _channelMessages  = new Map<number, ChatMessage[]>();
    const _warMessages      = new Map<number, ChatMessage[]>();
    const _privateMessages  = new Map<number, ChatMessage[]>();

    export function setAllMessages(msgList: ChatMessage[]): void {
        _channelMessages.clear();
        _warMessages.clear();
        _privateMessages.clear();

        for (const msg of msgList) {
           updateOnAddMessage(msg);
        }
    }

    export function updateOnAddMessage(msg: ChatMessage): void {
        const selfUserId = User.UserModel.getSelfUserId();
        const toChannelId = msg.toChannelId;
        if (toChannelId != null) {
            addMessage(_channelMessages, msg, toChannelId);
        } else {
            const toWarAndTeam = msg.toWarAndTeam;
            if (toWarAndTeam != null) {
                addMessage(_warMessages, msg, toWarAndTeam);
            } else {
                const userId = msg.fromUserId !== selfUserId ? msg.fromUserId : msg.toUserId;
                if (userId != null) {
                    addMessage(_privateMessages, msg, userId);
                } else {
                    Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
                }
            }
        }
    }

    function addMessage(dict: MessageDict, msg: ChatMessage, key: number): void {
        if (dict.has(key)) {
            dict.get(key).push(msg);
        } else {
            dict.set(key, [msg]);
        }
    }

    export function getAllChannelMessages(): MessageDict {
        return _channelMessages;
    }
    export function getAllWarMessages(): MessageDict {
        return _warMessages;
    }
    export function getAllPrivateMessages(): MessageDict {
        return _privateMessages;
    }
}
