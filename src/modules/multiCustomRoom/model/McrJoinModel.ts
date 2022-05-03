
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import McrModel                 from "./McrModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom.McrJoinModel {
    import IMcrRoomStaticInfo   = CommonProto.MultiCustomRoom.IMcrRoomStaticInfo;
    import IMcrRoomPlayerInfo   = CommonProto.MultiCustomRoom.IMcrRoomPlayerInfo;

    export type DataForCreateRoom   = CommonProto.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = CommonProto.NetMessage.MsgMcrJoinRoom.IC;

    export async function getFastJoinData(roomStaticInfo: IMcrRoomStaticInfo, roomPlayerInfo: IMcrRoomPlayerInfo): Promise<DataForJoinRoom | null> {
        const playerIndex       = generateAvailablePlayerIndexList(roomStaticInfo, roomPlayerInfo)[0];
        const unitAndTileSkinId = generateAvailableSkinIdList(roomPlayerInfo)[0];
        if ((playerIndex == null) || (unitAndTileSkinId == null)) {
            return null;
        } else {
            const settingsForCommon = Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon);
            return {
                roomId          : roomStaticInfo.roomId,
                isReady         : false,
                coId            : WarHelpers.WarRuleHelpers.getRandomCoIdWithSettingsForCommon(Twns.Helpers.getExisted(settingsForCommon.instanceWarRule), playerIndex, await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion))),
                playerIndex,
                unitAndTileSkinId,
            };
        }
    }

    function generateAvailablePlayerIndexList(roomStaticInfo: IMcrRoomStaticInfo, roomPlayerInfo: IMcrRoomPlayerInfo): number[] {
        const playersCount      = WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule));
        const playerInfoList    = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
        const indexes           : number[] = [];
        for (let i = 1; i <= playersCount; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function generateAvailableSkinIdList(roomPlayerInfo: IMcrRoomPlayerInfo): number[] {
        const playerDataList    = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
        const idList            : number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}

// export default McrJoinModel;
