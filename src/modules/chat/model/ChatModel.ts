
namespace TinyWars.Chat.ChatModel {
    import ProtoTypes   = Utility.ProtoTypes;
    import Logger       = Utility.Logger;
    import FloatText    = Utility.FloatText;
    import Types        = Utility.Types;
    import ChatCategory = Types.ChatMessageToCategory;
    import ChatMessage  = ProtoTypes.IChatMessage;

    type MessageDict                = Map<number, ChatMessage[]>;
    const _publicChannelMessages    = new Map<number, ChatMessage[]>();
    const _warMessages              = new Map<number, ChatMessage[]>();
    const _privateMessages          = new Map<number, ChatMessage[]>();

    export function setAllMessages(msgList: ChatMessage[]): void {
        _publicChannelMessages.clear();
        _warMessages.clear();
        _privateMessages.clear();

        for (const msg of msgList || []) {
           updateOnAddMessage(msg, false);
        }
    }

    export function updateOnAddMessage(msg: ChatMessage, showFloatText: boolean): void {
        const fromUserId = msg.fromUserId;
        if (fromUserId == null) {
            Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
        } else {
            const msgToCategory = msg.toCategory;
            const msgToTarget   = msg.toTarget;
            const msgContent    = msg.content;
            const isSentBySelf  = User.UserModel.getSelfUserId() === fromUserId;

            if (msgToCategory === ChatCategory.PublicChannel) {
                addMessage(_publicChannelMessages, msg, msgToTarget);

            } else if (msgToCategory === ChatCategory.WarAndTeam) {
                addMessage(_warMessages, msg, msgToTarget);
                if ((!isSentBySelf) && (showFloatText) && (!ChatPanel.getIsOpening())) {
                    User.UserModel.getUserNickname(fromUserId).then(name => FloatText.show(`<font color=0x00FF00>${name}</font>: ${msgContent}`));
                }

            } else if (msgToCategory === ChatCategory.Private) {
                if (isSentBySelf) {
                    addMessage(_privateMessages, msg, msgToTarget);
                } else {
                    addMessage(_privateMessages, msg, fromUserId);
                    if ((showFloatText) && (!ChatPanel.getIsOpening())) {
                        User.UserModel.getUserNickname(fromUserId).then(name => FloatText.show(`<font color=0x00FF00>${name}</font>: ${msgContent}`));
                    }
                }

            } else {
                Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
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

    export function getAllPublicChannelMessages(): MessageDict {
        return _publicChannelMessages;
    }
    export function getAllWarMessages(): MessageDict {
        return _warMessages;
    }
    export function getAllPrivateMessages(): MessageDict {
        return _privateMessages;
    }
}
