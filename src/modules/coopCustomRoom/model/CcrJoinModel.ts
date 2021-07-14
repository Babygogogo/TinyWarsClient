
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import { CcrModel }                     from "./CcrModel";
import BwWarRuleHelpers              from "../../baseWar/model/BwWarRuleHelpers";

export namespace CcrJoinModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ICcrRoomInfo     = ProtoTypes.CoopCustomRoom.ICcrRoomInfo;

    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgCcrJoinRoom.IC;

    let _targetRoomId           : number;
    let _joinedPreviewingRoomId : number;

    export function getFastJoinData(roomInfo: ICcrRoomInfo): DataForJoinRoom | null {
        const playerIndex       = generateAvailablePlayerIndexList(roomInfo)[0];
        const unitAndTileSkinId = generateAvailableSkinIdList(roomInfo)[0];
        if ((playerIndex == null) || (unitAndTileSkinId == null)) {
            return null;
        } else {
            return {
                roomId          : roomInfo.roomId,
                isReady         : false,
                coId            : BwWarRuleHelpers.getRandomCoIdWithSettingsForCommon(roomInfo.settingsForCommon, playerIndex),
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
    export async function getTargetRoomInfo(): Promise<ICcrRoomInfo | null> {
        const roomId = getTargetRoomId();
        return roomId == null ? null : await CcrModel.getRoomInfo(roomId);
    }

    export function getJoinedPreviewingRoomId(): number {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.CcrJoinedPreviewingRoomIdChanged);
        }
    }

    function generateAvailablePlayerIndexList(info: ICcrRoomInfo): number[] {
        const playersCount      = BwWarRuleHelpers.getPlayersCount(info.settingsForCommon.warRule);
        const playerInfoList    = info.playerDataList;
        const indexes           : number[] = [];
        for (let i = 1; i <= playersCount; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function generateAvailableSkinIdList(roomInfo: ICcrRoomInfo): number[] {
        const idList: number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (roomInfo.playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}
