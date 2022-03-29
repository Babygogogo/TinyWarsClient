
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MfrJoinModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IMfrRoomStaticInfo   = CommonProto.MultiFreeRoom.IMfrRoomStaticInfo;
    import IMfrRoomPlayerInfo   = CommonProto.MultiFreeRoom.IMfrRoomPlayerInfo;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    type DataForJoinRoom    = CommonProto.NetMessage.MsgMfrJoinRoom.IC;

    const _dataForJoinRoom: DataForJoinRoom = {
        roomId              : null,
        playerIndex         : null,
        isReady             : true,
    };
    let _joinedPreviewingRoomId     : number | null = null;

    function getData(): DataForJoinRoom {
        return _dataForJoinRoom;
    }
    export function getFastJoinData(roomStaticInfo: IMfrRoomStaticInfo, roomPlayerInfo: IMfrRoomPlayerInfo): DataForJoinRoom | null {
        const playerIndex = generateAvailablePlayerIndexArray(roomStaticInfo, roomPlayerInfo)[0];
        if (playerIndex == null) {
            return null;
        } else {
            return {
                roomId          : roomStaticInfo.roomId,
                isReady         : false,
                playerIndex,
            };
        }
    }

    export function getTargetRoomId(): number | null {
        return Helpers.getDefined(getData().roomId, ClientErrorCode.MfrJoinModel_GetTargetRoomId_00);
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

    function generateAvailablePlayerIndexArray(roomStaticInfo: IMfrRoomStaticInfo, roomPlayerInfo: IMfrRoomPlayerInfo): number[] {
        const playerDataArray   = Helpers.getExisted(roomPlayerInfo.playerDataList);
        const indexArray        : number[] = [];
        for (const player of Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.playerManager?.players)) {
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

// export default MfrJoinModel;
