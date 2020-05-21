
namespace TinyWars.Chat.ChatModel {
    import ProtoTypes   = Utility.ProtoTypes;
    import Logger       = Utility.Logger;
    import FloatText    = Utility.FloatText;
    import ChatMessage  = ProtoTypes.IChatMessage;

    type MessageDict        = Map<number, ChatMessage[]>;
    const _channelMessages  = new Map<number, ChatMessage[]>();
    const _warMessages      = new Map<number, ChatMessage[]>();
    const _privateMessages  = new Map<number, ChatMessage[]>();

    export function setAllMessages(msgList: ChatMessage[]): void {
        _channelMessages.clear();
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
            const toChannelId = msg.toChannelId;
            if (toChannelId != null) {
                addMessage(_channelMessages, msg, toChannelId);
            } else {
                const toWarAndTeam  = msg.toWarAndTeam;
                const isSentBySelf  = User.UserModel.getSelfUserId() === fromUserId;
                const content       = msg.content;
                if (toWarAndTeam != null) {
                    addMessage(_warMessages, msg, toWarAndTeam);
                    if ((!isSentBySelf) && (showFloatText) && (!ChatPanel.getIsOpening())) {
                        User.UserModel.getUserPublicInfo(fromUserId).then(info => FloatText.show(`<font color=0x00FF00>${info.nickname}</font>: ${content}`));
                    }
                } else {
                    const toUserId = msg.toUserId;
                    if (toUserId == null) {
                        Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
                    } else {
                        if (isSentBySelf) {
                            addMessage(_privateMessages, msg, toUserId);
                        } else {
                            addMessage(_privateMessages, msg, fromUserId);
                            if ((showFloatText) && (!ChatPanel.getIsOpening())) {
                                User.UserModel.getUserPublicInfo(fromUserId).then(info => FloatText.show(`<font color=0x00FF00>${info.nickname}</font>: ${content}`));
                            }
                        }
                    }
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
