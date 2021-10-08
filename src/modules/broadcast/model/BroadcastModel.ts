

import Helpers      from "../../tools/helpers/Helpers";
import Timer        from "../../tools/helpers/Timer";
import ProtoTypes   from "../../tools/proto/ProtoTypes";

namespace BroadcastModel {
    import IBroadcastMessage    = ProtoTypes.Broadcast.IBroadcastMessage;

    let _messageList    : IBroadcastMessage[] = [];

    export function setAllMessageList(messageList: IBroadcastMessage[]): void {
        _messageList = messageList || [];
    }
    export function getAllMessageList(): IBroadcastMessage[] {
        return _messageList;
    }
    export function getOngoingMessageList(): IBroadcastMessage[] {
        const currTime = Timer.getServerTimestamp();
        return _messageList.filter(v => {
            return (Helpers.getExisted(v.startTime) <= currTime)
                && (Helpers.getExisted(v.endTime) >= currTime);
        });
    }
}

export default BroadcastModel;
