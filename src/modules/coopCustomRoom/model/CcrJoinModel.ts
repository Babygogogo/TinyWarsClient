
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Notify           from "../../tools/notify/Notify";
// import Twns.Notify   from "../../tools/notify/NotifyType";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomRoom.CcrJoinModel {
    import ICcrRoomStaticInfo   = CommonProto.CoopCustomRoom.ICcrRoomStaticInfo;
    import ICcrRoomPlayerInfo   = CommonProto.CoopCustomRoom.ICcrRoomPlayerInfo;

    export type DataForJoinRoom     = CommonProto.NetMessage.MsgCcrJoinRoom.IC;

    export async function getFastJoinData(roomStaticInfo: ICcrRoomStaticInfo, roomPlayerInfo: ICcrRoomPlayerInfo): Promise<DataForJoinRoom | null> {
        const playerIndex       = generateAvailablePlayerIndexList(roomStaticInfo, roomPlayerInfo)[0];
        const unitAndTileSkinId = generateAvailableSkinIdList(roomPlayerInfo)[0];
        if ((playerIndex == null) || (unitAndTileSkinId == null)) {
            return null;
        } else {
            const settingsForCommon = Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon);
            return {
                roomId          : roomStaticInfo.roomId,
                isReady         : false,
                coId            : WarHelpers.WarRuleHelpers.getRandomCoIdWithSettingsForCommon(
                    Twns.Helpers.getExisted(settingsForCommon.instanceWarRule),
                    playerIndex,
                    await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion))
                ),
                playerIndex,
                unitAndTileSkinId,
            };
        }
    }

    function generateAvailablePlayerIndexList(roomStaticInfo: ICcrRoomStaticInfo, roomPlayerInfo: ICcrRoomPlayerInfo): number[] {
        const playersCountUnneutral = WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule));
        const playerInfoList        = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
        const indexes               : number[] = [];
        for (let i = 1; i <= playersCountUnneutral; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function generateAvailableSkinIdList(roomPlayerInfo: ICcrRoomPlayerInfo): number[] {
        const playerDataList    = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
        const idList            : number[] = [];
        for (let skinId = Twns.CommonConstants.UnitAndTileMinSkinId; skinId <= Twns.CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}

// export default CcrJoinModel;
