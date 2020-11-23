
namespace TinyWars.Broadcast.BroadcastModel {
    import ProtoTypes           = Utility.ProtoTypes;
    import IBroadcastMessage    = ProtoTypes.Broadcast.IBroadcastMessage;

    let _messageList    : IBroadcastMessage[] = [];

    export function setAllMessageList(messageList: IBroadcastMessage[]): void {
        _messageList = messageList || [];
    }
    export function getAllMessageList(): IBroadcastMessage[] {
        return _messageList;
    }
    export function getOngoingMessageList(): IBroadcastMessage[] {
        const currTime = Time.TimeModel.getServerTimestamp();
        return _messageList.filter(v => {
            return (v.startTime <= currTime)
                && (v.endTime >= currTime);
        });
    }
}
