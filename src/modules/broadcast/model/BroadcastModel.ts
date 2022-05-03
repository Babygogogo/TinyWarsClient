

// import Helpers      from "../../tools/helpers/Helpers";
// import Timer        from "../../tools/helpers/Timer";
// import ProtoTypes   from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Broadcast.BroadcastModel {
    import IBroadcastMessage    = CommonProto.Broadcast.IBroadcastMessage;

    const _allMessageIdArray    : number[] = [];
    const _messageDataAccessor  = Helpers.createCachedDataAccessor<number, IBroadcastMessage>({
        reqData : (messageId: number) => Twns.Broadcast.BroadcastProxy.reqBroadcastGetMessageData(messageId),
    });

    export function setAllMessageIdArray(messageIdArray: number[]): void {
        _allMessageIdArray.length = 0;
        _allMessageIdArray.push(...messageIdArray);
    }
    export function getAllMessageIdArray(): number[] {
        return _allMessageIdArray;
    }

    export function getMessageData(messageId: number): Promise<IBroadcastMessage | null> {
        return _messageDataAccessor.getData(messageId);
    }
    export function setMessageData(messageId: number, messageData: IBroadcastMessage | null): void {
        _messageDataAccessor.setData(messageId, messageData);
    }

    export async function getOngoingMessageIdArray(): Promise<number[]> {
        const currTime      = Timer.getServerTimestamp();
        const promiseArray  : Promise<number | null>[] = [];
        for (const messageId of getAllMessageIdArray()) {
            promiseArray.push((async () => {
                const messageData = await getMessageData(messageId);
                if ((messageData)                                           &&
                    (Helpers.getExisted(messageData.startTime) <= currTime) &&
                    (Helpers.getExisted(messageData.endTime) >= currTime)
                ) {
                    return messageId;
                } else {
                    return null;
                }
            })());
        }
        return Helpers.getNonNullElements(await Promise.all(promiseArray));
    }
}

// export default BroadcastModel;
