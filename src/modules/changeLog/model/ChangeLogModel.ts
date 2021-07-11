
import * as ProtoTypes      from "../../../utility/ProtoTypes";
import IChangeLogMessage    = ProtoTypes.ChangeLog.IChangeLogMessage;

let _messageList: IChangeLogMessage[];

export function setAllMessageList(messageList: IChangeLogMessage[]): void {
    _messageList = (messageList || []).sort((v1, v2) => v2.messageId - v1.messageId);
}
export function getAllMessageList(): IChangeLogMessage[] | undefined {
    return _messageList;
}
export function getMessage(messageId: number): IChangeLogMessage | undefined {
    return (getAllMessageList() || []).find(v => v.messageId === messageId);
}
