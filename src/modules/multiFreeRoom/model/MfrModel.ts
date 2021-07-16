
import Helpers              from "../../tools/helpers/Helpers";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
import MfrProxy             from "../../multiFreeRoom/model/MfrProxy";
import UserModel            from "../../user/model/UserModel";

namespace MfrModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;
    import NetMessage       = ProtoTypes.NetMessage;

    const _roomInfoDict         = new Map<number, IMfrRoomInfo>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMfrGetRoomInfo.IS | undefined | null) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<IMfrRoomInfo | undefined | null> {
        if (roomId == null) {
            return new Promise((resolve) => resolve(null));
        }

        const localData = _roomInfoDict.get(roomId);
        if (localData) {
            return new Promise(resolve => resolve(localData));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                _roomInfoRequests.get(roomId).push(info => resolve(info.roomInfo));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMfrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMfrGetRoomInfoFailed,  callbackOnFailed);

            MfrProxy.reqMfrGetRoomInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }
    export function setRoomInfo(info: IMfrRoomInfo): void {
        _roomInfoDict.set(info.roomId, info);
    }
    export function deleteRoomInfo(roomId: number): void {
        _roomInfoDict.delete(roomId);
        _unjoinedRoomIdSet.delete(roomId);
        _joinedRoomIdSet.delete(roomId);
    }

    export function setJoinableRoomInfoList(infoList: IMfrRoomInfo[]): void {
        _unjoinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            _unjoinedRoomIdSet.add(roomInfo.roomId);
            setRoomInfo(roomInfo);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _unjoinedRoomIdSet;
    }

    export function setJoinedRoomInfoList(infoList: IMfrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            _joinedRoomIdSet.add(roomInfo.roomId);
            setRoomInfo(roomInfo);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export async function updateOnMsgMfrDeletePlayer(data: ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.targetPlayerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export async function updateOnMsgMfrSetReady(data: ProtoTypes.NetMessage.MsgMfrSetReady.IS): Promise<void> {
        const roomInfo      = await getRoomInfo(data.roomId);
        const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.playerIndex === data.playerIndex) : null;
        if (playerData) {
            playerData.isReady = data.isReady;
        }
    }
    export async function updateOnMsgMfrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMfrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (roomInfo) {
            const oldPlayerIndex                = data.oldPlayerIndex;
            const newPlayerIndex                = data.newPlayerIndex;
            const playerDataInRoom              = roomInfo.playerDataList.find(v => v.playerIndex === oldPlayerIndex);
            const playerDataInWar               = roomInfo.settingsForMfw.initialWarData.playerManager.players.find(v => v.playerIndex === newPlayerIndex);
            playerDataInRoom.coId               = playerDataInWar.coId;
            playerDataInRoom.unitAndTileSkinId  = playerDataInWar.unitAndTileSkinId;
            playerDataInRoom.playerIndex        = newPlayerIndex;
            if ((oldPlayerIndex !== newPlayerIndex) && (roomInfo.ownerPlayerIndex === oldPlayerIndex)) {
                roomInfo.ownerPlayerIndex = newPlayerIndex;
            }
        }
    }
    export async function updateOnMsgMfrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgMfrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgMfrJoinRoom(data: ProtoTypes.NetMessage.MsgMfrJoinRoom.IS): Promise<void> {
        const roomInfo          = await getRoomInfo(data.roomId);
        const playerIndex       = data.playerIndex;
        const playerDataInWar   = roomInfo.settingsForMfw.initialWarData.playerManager.players.find(v => v.playerIndex === playerIndex);
        if (!roomInfo.playerDataList) {
            roomInfo.playerDataList = [{
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : playerDataInWar.coId,
                unitAndTileSkinId   : playerDataInWar.unitAndTileSkinId,
            }];
        } else {
            const playerDataArrayInRoom = roomInfo.playerDataList;
            Helpers.deleteElementFromArray(playerDataArrayInRoom, playerDataArrayInRoom.find(v => v.playerIndex === playerIndex));
            playerDataArrayInRoom.push({
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : playerDataInWar.coId,
                unitAndTileSkinId   : playerDataInWar.unitAndTileSkinId,
            });
        }
    }
    export async function updateOnMsgMfrExitRoom(data: ProtoTypes.NetMessage.MsgMfrExitRoom.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.playerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of _joinedRoomIdSet) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo) {
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === WarRuleHelpers.getPlayersCount(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule))   &&
                (playerDataList.every(v => v.isReady))                                                                                          &&
                (selfPlayerData)                                                                                                                &&
                (roomInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
            ) {
                return true;
            }
        }
        return false;
    }
    export async function checkCanStartGame(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (!roomInfo) {
            return false;
        }

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomInfo.ownerPlayerIndex)
            && (playerDataList.length === WarRuleHelpers.getPlayersCount(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule))
            && (playerDataList.every(v => v.isReady));
    }
}

export default MfrModel;
