
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Helpers                      from "../../tools/helpers/Helpers";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import McrProxy                     from "../../multiCustomRoom/model/McrProxy";
import UserModel                    from "../../user/model/UserModel";
import { McrModel }                     from "./McrModel";
import BwWarRuleHelpers              from "../../baseWar/model/BwWarRuleHelpers";

export namespace McrJoinModel {
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import NetMessage                       = ProtoTypes.NetMessage;
    import IMcrRoomInfo                     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMcrJoinRoom.IC;

    let _targetRoomId               : number;
    let _joinedPreviewingRoomId     : number;

    export function getFastJoinData(roomInfo: IMcrRoomInfo): DataForJoinRoom | null {
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
            Notify.dispatch(NotifyType.McrJoinTargetRoomIdChanged);
        }
    }
    export async function getTargetRoomInfo(): Promise<IMcrRoomInfo | null> {
        const roomId = getTargetRoomId();
        return roomId == null ? null : await McrModel.getRoomInfo(roomId);
    }

    export function getJoinedPreviewingRoomId(): number {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.McrJoinedPreviewingRoomIdChanged);
        }
    }

    function generateAvailablePlayerIndexList(info: IMcrRoomInfo): number[] {
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

    function generateAvailableSkinIdList(roomInfo: IMcrRoomInfo): number[] {
        const idList: number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (roomInfo.playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}
