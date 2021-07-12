
import { CommonConstants }      from "../../../utility/CommonConstants";
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { BwWarRuleHelpers }     from "../../baseWar/model/BwWarRuleHelpers";
import { MfrModel }             from "./MfrModel";

export namespace MfrJoinModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;

    export type DataForJoinRoom = ProtoTypes.NetMessage.MsgMfrJoinRoom.IC;

    const _dataForJoinRoom: DataForJoinRoom = {
        roomId              : null,
        playerIndex         : null,
        isReady             : true,
    };
    const _availablePlayerIndexList : number[] = [];
    let _joinedPreviewingRoomId     : number;

    export function getData(): DataForJoinRoom {
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

    export function getTargetRoomId(): number {
        return getData().roomId;
    }
    export function setTargetRoomId(roomId: number): void {
        if (getTargetRoomId() !== roomId) {
            getData().roomId = roomId;
            Notify.dispatch(NotifyType.MfrJoinTargetRoomIdChanged);
        }
    }

    export async function getRoomInfo(): Promise<IMfrRoomInfo | null> {
        return await MfrModel.getRoomInfo(getTargetRoomId());
    }
    export async function getTeamIndex(): Promise<number> {
        return BwWarRuleHelpers.getPlayerRule((await MfrModel.getRoomInfo(getTargetRoomId())).settingsForMfw.initialWarData.settingsForCommon.warRule, getPlayerIndex()).teamIndex;
    }

    export function resetData(roomInfo: IMfrRoomInfo): void {
        const availablePlayerIndexList    = generateAvailablePlayerIndexArray(roomInfo);
        const playerIndex                 = availablePlayerIndexList[0];
        setTargetRoomId(roomInfo.roomId);
        setAvailablePlayerIndexList(availablePlayerIndexList);
        setPlayerIndex(playerIndex);
        setIsReady(true);
    }
    export function clearData(): void {
        setIsReady(true);
        setPlayerIndex(null);
        setTargetRoomId(null);
        setAvailablePlayerIndexList(null);
    }

    export function checkCanJoin(): boolean {
        const availablePlayerIndexList = getAvailablePlayerIndexList();
        return (availablePlayerIndexList != null) && (availablePlayerIndexList.length > 0);
    }

    function setPlayerIndex(playerIndex: number): void {
        getData().playerIndex = playerIndex;
    }
    export async function tickPlayerIndex(): Promise<void> {
        const list = getAvailablePlayerIndexList();
        if (list.length > 1) {
            setPlayerIndex(list[(list.indexOf(getPlayerIndex()) + 1) % list.length]);
        }
    }
    export function getPlayerIndex(): number {
        return getData().playerIndex;
    }

    export function setIsReady(isReady: boolean): void {
        getData().isReady = isReady;
    }
    export function getIsReady(): boolean {
        return getData().isReady;
    }

    function setAvailablePlayerIndexList(list: number[]): void {
        _availablePlayerIndexList.length = 0;
        for (const playerIndex of list || []) {
            _availablePlayerIndexList.push(playerIndex);
        }
    }
    export function getAvailablePlayerIndexList(): number[] {
        return _availablePlayerIndexList;
    }

    export function getJoinedPreviewingRoomId(): number {
        return _joinedPreviewingRoomId;
    }
    export function setJoinedPreviewingRoomId(roomId: number | null): void {
        if (getJoinedPreviewingRoomId() != roomId) {
            _joinedPreviewingRoomId = roomId;
            Notify.dispatch(NotifyType.MfrJoinedPreviewingRoomIdChanged);
        }
    }

    function generateAvailablePlayerIndexArray(roomInfo: IMfrRoomInfo): number[] {
        const playerDataArray   = roomInfo.playerDataList;
        const indexArray        : number[] = [];
        for (const player of roomInfo.settingsForMfw.initialWarData.playerManager.players) {
            const playerIndex = player.playerIndex;
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
