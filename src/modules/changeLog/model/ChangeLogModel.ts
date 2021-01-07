
namespace TinyWars.ChangeLog.ChangeLogModel {
    import ProtoTypes           = Utility.ProtoTypes;
    import IChangeLogMessage    = ProtoTypes.ChangeLog.IChangeLogMessage;

    let _messageList: IChangeLogMessage[];

    export function setAllMessageList(messageList: IChangeLogMessage[]): void {
        _messageList = messageList || [];
    }
    export function getAllMessageList(): IChangeLogMessage[] | undefined {
        return _messageList;
    }
    export function getMessage(messageId: number): IChangeLogMessage | undefined {
        return (getAllMessageList() || []).find(v => v.messageId === messageId);
    }
}
