
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Helpers          from "../../tools/helpers/Helpers";
import Types            from "../../tools/helpers/Types";
import Notify           from "../../tools/notify/Notify";
import TwnsNotifyType   from "../../tools/notify/NotifyType";
import ProtoTypes       from "../../tools/proto/ProtoTypes";

namespace MfrJoinModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;

    export type DataForJoinRoom = ProtoTypes.NetMessage.MsgMfrJoinRoom.IC;

    const _dataForJoinRoom: DataForJoinRoom = {
        roomId              : null,
        playerIndex         : null,
        isReady             : true,
    };
    let _joinedPreviewingRoomId     : number | null = null;

    function getData(): DataForJoinRoom {
        return _dataForJoinRoom;
    }
    export function getFastJoinData(roomInfo: IMfrRoomInfo): DataForJoinRoom | null {
        const playerIndex = generateAvailablePlayerIndexArray(roomInfo)[0];
        if (playerIndex == null) {
            return null;
        } else {
            return {
                roomId          : roomInfo.roomId,
                isReady         : false,
                playerIndex,
            };
        }
    }

    export function getTargetRoomId(): number | null {
        return Helpers.getDefined(getData().roomId);
    }
    export function setTargetRoomId(roomId: number): void {
        if (getTargetRoomId() !== roomId) {
            getData().roomId = roomId;
            Notify.dispatch(NotifyType.MfrJoinTargetRoomIdChanged);
        }
    }

    export function getJoinedPreviewingRoomId(): number | null {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.MfrJoinedPreviewingRoomIdChanged);
        }
    }

    function generateAvailablePlayerIndexArray(roomInfo: IMfrRoomInfo): number[] {
        const playerDataArray   = Helpers.getExisted(roomInfo.playerDataList);
        const indexArray        : number[] = [];
        for (const player of Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.playerManager?.players)) {
            const playerIndex = Helpers.getExisted(player.playerIndex);
            if ((player.aliveState !== Types.PlayerAliveState.Dead)         &&
                (playerIndex !== CommonConstants.WarNeutralPlayerIndex)     &&
                (playerDataArray.every(v => v.playerIndex !== playerIndex))
            ) {
                indexArray.push(playerIndex);
            }
        }

        return indexArray;
    }
}

export default MfrJoinModel;
