
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import McrModel                 from "./McrModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace McrJoinModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IMcrRoomStaticInfo   = CommonProto.MultiCustomRoom.IMcrRoomStaticInfo;
    import IMcrRoomPlayerInfo   = CommonProto.MultiCustomRoom.IMcrRoomPlayerInfo;

    export type DataForCreateRoom   = CommonProto.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = CommonProto.NetMessage.MsgMcrJoinRoom.IC;

    let _targetRoomId               : number | null = null;
    let _joinedPreviewingRoomId     : number | null = null;

    export async function getFastJoinData(roomStaticInfo: IMcrRoomStaticInfo, roomPlayerInfo: IMcrRoomPlayerInfo): Promise<DataForJoinRoom | null> {
        const playerIndex       = generateAvailablePlayerIndexList(roomStaticInfo, roomPlayerInfo)[0];
        const unitAndTileSkinId = generateAvailableSkinIdList(roomPlayerInfo)[0];
        if ((playerIndex == null) || (unitAndTileSkinId == null)) {
            return null;
        } else {
            const settingsForCommon = Helpers.getExisted(roomStaticInfo.settingsForCommon);
            return {
                roomId          : roomStaticInfo.roomId,
                isReady         : false,
                coId            : WarRuleHelpers.getRandomCoIdWithSettingsForCommon(Helpers.getExisted(settingsForCommon.warRule), playerIndex, await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion))),
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
            Notify.dispatch(NotifyType.McrJoinTargetRoomIdChanged);
        }
    }

    export function getJoinedPreviewingRoomId(): number | null {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.McrJoinedPreviewingRoomIdChanged);
        }
    }

    export function updateOnMsgMcrGetJoinableRoomIdArray(): void {
        reviseTargetRoomId();
    }
    export function updateOnMsgMcrGetJoinedRoomIdArray(): void {
        reviseJoinedPreviewingRoomId();
    }

    function reviseTargetRoomId(): void {
        const roomIdSet = McrModel.getUnjoinedRoomIdSet();
        if (roomIdSet.size <= 0) {
            setTargetRoomId(null);
        } else {
            const roomId = getTargetRoomId();
            if ((roomId == null) || (!roomIdSet.has(roomId))) {
                setTargetRoomId(roomIdSet.values().next().value);
            }
        }
    }
    function reviseJoinedPreviewingRoomId(): void {
        const roomIdSet = McrModel.getJoinedRoomIdSet();
        if (roomIdSet.size <= 0) {
            setJoinedPreviewingRoomId(null);
        } else {
            const roomId = getJoinedPreviewingRoomId();
            if ((roomId == null) || (!roomIdSet.has(roomId))) {
                setJoinedPreviewingRoomId(roomIdSet.values().next().value);
            }
        }
    }

    function generateAvailablePlayerIndexList(roomStaticInfo: IMcrRoomStaticInfo, roomPlayerInfo: IMcrRoomPlayerInfo): number[] {
        const playersCount      = WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForCommon?.warRule));
        const playerInfoList    = Helpers.getExisted(roomPlayerInfo.playerDataList);
        const indexes           : number[] = [];
        for (let i = 1; i <= playersCount; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function generateAvailableSkinIdList(roomPlayerInfo: IMcrRoomPlayerInfo): number[] {
        const playerDataList    = Helpers.getExisted(roomPlayerInfo.playerDataList);
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
