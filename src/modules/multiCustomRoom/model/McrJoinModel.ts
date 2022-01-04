
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
    import IMcrRoomInfo         = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMcrJoinRoom.IC;

    let _targetRoomId               : number | null = null;
    let _joinedPreviewingRoomId     : number | null = null;

    export function getFastJoinData(roomInfo: IMcrRoomInfo): DataForJoinRoom | null {
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

    export function updateOnMsgMcrGetJoinableRoomInfoList(): void {
        reviseTargetRoomId();
    }
    export function updateOnMsgMcrDeleteRoomByServer(): void {
        reviseTargetRoomId();
        reviseJoinedPreviewingRoomId();
    }
    export function updateOnMsgMcrGetJoinedRoomInfoList(): void {
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

    function generateAvailablePlayerIndexList(info: IMcrRoomInfo): number[] {
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

    function generateAvailableSkinIdList(roomInfo: IMcrRoomInfo): number[] {
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

// export default McrJoinModel;
