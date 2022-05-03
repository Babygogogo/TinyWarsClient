
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom.MfrJoinModel {
    import IMfrRoomStaticInfo   = CommonProto.MultiFreeRoom.IMfrRoomStaticInfo;
    import IMfrRoomPlayerInfo   = CommonProto.MultiFreeRoom.IMfrRoomPlayerInfo;

    type DataForJoinRoom    = CommonProto.NetMessage.MsgMfrJoinRoom.IC;

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
