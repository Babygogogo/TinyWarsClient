
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Notify           from "../../tools/notify/Notify";
// import TwnsNotifyType   from "../../tools/notify/NotifyType";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";

namespace CcrJoinModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ICcrRoomInfo     = ProtoTypes.CoopCustomRoom.ICcrRoomInfo;

    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgCcrJoinRoom.IC;

    let _targetRoomId           : number | null = null;
    let _joinedPreviewingRoomId : number | null = null;

    export function getFastJoinData(roomInfo: ICcrRoomInfo): DataForJoinRoom | null {
        const playerIndex       = generateAvailablePlayerIndexList(roomInfo)[0];
        const unitAndTileSkinId = generateAvailableSkinIdList(roomInfo)[0];
        if ((playerIndex == null) || (unitAndTileSkinId == null)) {
            return null;
        } else {
            return {
                roomId          : roomInfo.roomId,
                isReady         : false,
                coId            : WarRuleHelpers.getRandomCoIdWithSettingsForCommon(Helpers.getExisted(roomInfo.settingsForCommon), playerIndex),
                playerIndex,
                unitAndTileSkinId,
            };
        }
    }

    export function getTargetRoomId(): number | null {
        return _targetRoomId;
    }
    export function setTargetRoomId(roomId: number | null): void {
        if (getTargetRoomId() !== roomId) {
            _targetRoomId = roomId;
            Notify.dispatch(NotifyType.CcrJoinTargetRoomIdChanged);
        }
    }

    export function getJoinedPreviewingRoomId(): number | null {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.CcrJoinedPreviewingRoomIdChanged);
        }
    }

    function generateAvailablePlayerIndexList(info: ICcrRoomInfo): number[] {
        const playersCount      = WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(info.settingsForCommon?.warRule));
        const playerInfoList    = Helpers.getExisted(info.playerDataList);
        const indexes           : number[] = [];
        for (let i = 1; i <= playersCount; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function generateAvailableSkinIdList(roomInfo: ICcrRoomInfo): number[] {
        const playerDataList    = Helpers.getExisted(roomInfo.playerDataList);
        const idList            : number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}

// export default CcrJoinModel;
