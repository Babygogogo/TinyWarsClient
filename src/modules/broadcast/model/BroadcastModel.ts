

import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { TimeModel }            from "../../time/model/TimeModel";

export namespace BroadcastModel {
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
}
