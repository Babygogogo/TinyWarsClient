
import ProtoTypes       from "../../tools/proto/ProtoTypes";

namespace ChangeLogModel {
    import IChangeLogMessage    = ProtoTypes.ChangeLog.IChangeLogMessage;

    let _messageList: IChangeLogMessage[];

    export function setAllMessageList(messageList: IChangeLogMessage[]): void {
        _messageList = (messageList || []).sort((v1, v2) => {
            const id1 = v1.messageId;
            const id2 = v2.messageId;
            if (id1 == null) {
                return 1;
            } else if (id2 == null) {
                return -1;
            } else {
                return id2 - id1;
            }
        });
    }
    export function getAllMessageList(): IChangeLogMessage[] | undefined {
        return _messageList;
    }
    export function getMessage(messageId: number): IChangeLogMessage | undefined {
        return (getAllMessageList() || []).find(v => v.messageId === messageId);
    }
}

export default ChangeLogModel;
