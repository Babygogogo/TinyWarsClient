
namespace TinyWars.Chat.ChatModel {
    import ProtoTypes   = Utility.ProtoTypes;
    import Logger       = Utility.Logger;
    import FloatText    = Utility.FloatText;
    import Types        = Utility.Types;
    import ChatCategory = Types.ChatMessageToCategory;
    import NetMessage   = ProtoTypes.NetMessage;
    import IChatMessage = ProtoTypes.Chat.IChatMessage;

    type MessageDict                    = Map<number, IChatMessage[]>;
    const _allMessageDict               = new Map<ChatCategory, MessageDict>();
    const _allProgressDict              = new Map<ChatCategory, Map<number, number>>();
    let _timestampForNextSetAllMessages = 0;

    export function setAllMessages(msgList: IChatMessage[]): void {
        _allMessageDict.clear();

        for (const msg of msgList || []) {
           updateOnAddMessage(msg, false);
        }
    }

    export function setTimestampForNextReqAllMessages(timestamp: number): void {
        _timestampForNextSetAllMessages = timestamp;
    }
    export function getTimestampForNextReqAllMessages(): number {
        return _timestampForNextSetAllMessages;
    }

    export function updateOnAddMessage(msg: IChatMessage, showFloatText: boolean): void {
        const fromUserId = msg.fromUserId;
        if (fromUserId == null) {
            Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
        } else {
            const msgToCategory = msg.toCategory;
            const msgToTarget   = msg.toTarget;
            const msgContent    = msg.content;
            const isSentBySelf  = User.UserModel.getSelfUserId() === fromUserId;

            if (msgToCategory === ChatCategory.PublicChannel) {
                addMessage(ChatCategory.PublicChannel, msg, msgToTarget);

            } else if (msgToCategory === ChatCategory.WarAndTeam) {
                addMessage(ChatCategory.WarAndTeam, msg, msgToTarget);
                if ((!isSentBySelf) && (showFloatText) && (!ChatPanel.getIsOpening())) {
                    User.UserModel.getUserNickname(fromUserId).then(name => FloatText.show(`<font color=0x00FF00>${name}</font>: ${msgContent}`));
                }

            } else if (msgToCategory === ChatCategory.Private) {
                if (isSentBySelf) {
                    addMessage(ChatCategory.Private, msg, msgToTarget);
                } else {
                    addMessage(ChatCategory.Private, msg, fromUserId);
                    if ((showFloatText) && (!ChatPanel.getIsOpening())) {
                        User.UserModel.getUserNickname(fromUserId).then(name => FloatText.show(`<font color=0x00FF00>${name}</font>: ${msgContent}`));
                    }
                }

            } else {
                Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
            }
        }
    }

    export function getMessagesForCategory(toCategory: ChatCategory): MessageDict {
        if (!_allMessageDict.has(toCategory)) {
            _allMessageDict.set(toCategory, new Map());
        }
        return _allMessageDict.get(toCategory);
    }
    export function getLatestMessageTimestamp(toCategory: ChatCategory, toTarget: number): number {
        const messageList   = getMessagesForCategory(toCategory).get(toTarget) || [];
        const message       = messageList[messageList.length - 1];
        return message ? message.timestamp || 0 : 0;
    }

    export function resetAllReadProgress(list: ProtoTypes.Chat.IChatReadProgress[]): void {
        _allProgressDict.clear();
        for (const p of list || []) {
            setReadProgress(p);
        }
    }
    export function setReadProgress(progress: ProtoTypes.Chat.IChatReadProgress): void {
        const toCategory    = progress.toCategory;
        const toTarget      = progress.toTarget;
        const timestamp     = progress.timestamp;
        const subDict       = _allProgressDict.get(toCategory);
        if (subDict) {
            subDict.set(toTarget, timestamp);
        } else {
            _allProgressDict.set(toCategory, new Map<number, number>([[toTarget, timestamp]]));
        }
    }
    export function getReadProgressTimestamp(toCategory: ChatCategory, toTarget: number): number {
        const subDict = _allProgressDict.get(toCategory);
        return subDict
            ? subDict.get(toTarget) || 0
            : 0;
    }

    export function checkHasUnreadMessage(): boolean {
        for (const [toCategory, dict] of _allMessageDict) {
            for (const [toTarget, _] of dict) {
                if (checkHasUnreadMessageForTarget(toCategory, toTarget)) {
                    return true;
                }
            }
        }
        return false;
    }
    export function checkHasUnreadMessageForTarget(toCategory: ChatCategory, toTarget: number): boolean {
        const messages  = getMessagesForCategory(toCategory).get(toTarget) || [];
        const length    = messages.length;
        if (!length) {
            return false;
        } else {
            return getReadProgressTimestamp(toCategory, toTarget) < messages[length - 1].timestamp;
        }
    }

    function addMessage(toCategory: ChatCategory, msg: IChatMessage, toTarget: number): void {
        const dict = _allMessageDict.get(toCategory);
        if (!dict) {
            _allMessageDict.set(toCategory, new Map<number, IChatMessage[]>([[toTarget, [msg]]]));
        } else {
            if (dict.has(toTarget)) {
                dict.get(toTarget).push(msg);
            } else {
                dict.set(toTarget, [msg]);
            }
        }
    }
}
