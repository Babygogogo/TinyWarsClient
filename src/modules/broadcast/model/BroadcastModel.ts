

import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as TimeModel           from "../../time/model/TimeModel";
import IBroadcastMessage        = ProtoTypes.Broadcast.IBroadcastMessage;

let _messageList    : IBroadcastMessage[] = [];

export function setAllMessageList(messageList: IBroadcastMessage[]): void {
    _messageList = messageList || [];
}
export function getAllMessageList(): IBroadcastMessage[] {
    return _messageList;
}
export function getOngoingMessageList(): IBroadcastMessage[] {
    const currTime = TimeModel.getServerTimestamp();
    return _messageList.filter(v => {
        return (v.startTime <= currTime)
            && (v.endTime >= currTime);
    });
}
