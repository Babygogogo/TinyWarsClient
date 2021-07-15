
import Logger                       from "../../tools/helpers/Logger";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import UserModel                    from "../../user/model/UserModel";
import MrrProxy                     from "./MrrProxy";
import { MrrSelfSettingsModel }         from "./MrrSelfSettingsModel";

namespace MrrModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import IMrrRoomInfo     = ProtoTypes.MultiRankRoom.IMrrRoomInfo;

    let _previewingRoomId           : number;
    let _previewingMapId            : number;
    let _maxConcurrentCountForStd   = 0;
    let _maxConcurrentCountForFog   = 0;
    const _allRoomDict              = new Map<number, IMrrRoomInfo>();
    const _roomInfoRequests         = new Map<number, ((info: NetMessage.MsgMrrGetRoomPublicInfo.IS | undefined | null) => void)[]>();

    export function setMaxConcurrentCount(hasFog: boolean, count: number): void {
        if (hasFog) {
            _maxConcurrentCountForFog = count;
        } else {
            _maxConcurrentCountForStd = count;
        }
    }
    export function getMaxConcurrentCount(hasFog: boolean): number {
        return hasFog ? _maxConcurrentCountForFog : _maxConcurrentCountForStd;
    }

    export function setRoomInfo(roomInfo: IMrrRoomInfo): void {
        _allRoomDict.set(roomInfo.roomId, roomInfo);
    }
    export function getRoomInfo(roomId: number): Promise<IMrrRoomInfo | undefined | null> {
        if (roomId == null) {
            return new Promise((resolve, reject) => resolve(null));
        }

        const localData = _allRoomDict.get(roomId);
        if (localData) {
            return new Promise(resolve => resolve(localData));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve, reject) => {
                _roomInfoRequests.get(roomId).push(info => resolve(info.roomInfo));
            });
        }

        new Promise<void>((resolve, reject) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,  callbackOnFailed);

            MrrProxy.reqMrrGetRoomPublicInfo(roomId);
        });

        return new Promise((resolve, reject) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }
    export function deleteRoomInfo(roomId: number): void {
        const roomInfo = _allRoomDict.get(roomId);
        _allRoomDict.delete(roomId);

        if ((roomInfo) && (checkIsMyRoom(roomInfo))) {
            Notify.dispatch(NotifyType.MrrMyRoomDeleted);
        }
    }

    export function updateWithMyRoomInfoList(roomList: IMrrRoomInfo[]): void {
        for (const roomInfo of roomList || []) {
            setRoomInfo(roomInfo);
        }
    }
    export function getMyRoomIdArray(): number[] {
        const idArray: number[] = [];
        for (const [roomId, roomInfo] of _allRoomDict) {
            if (checkIsMyRoom(roomInfo)) {
                idArray.push(roomId);
            }
        }
        return idArray;
    }

    export async function updateOnMsgMrrGetRoomPublicInfo(data: ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS): Promise<void> {
        const roomInfo = data.roomInfo;
        setRoomInfo(data.roomInfo);

        const roomId = roomInfo.roomId;
        if (MrrSelfSettingsModel.getRoomId() === roomId) {
            await MrrSelfSettingsModel.resetData(roomId);
        }
    }
    export async function updateOnMsgMrrSetBannedCoIdList(data: ProtoTypes.NetMessage.MsgMrrSetBannedCoIdList.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (!roomInfo) {
            return;
        }

        const settingsForMrw    = roomInfo.settingsForMrw;
        const srcPlayerIndex    = data.playerIndex;
        const bannedCoIdList    = data.bannedCoIdList;
        if (settingsForMrw.dataArrayForBanCo == null) {
            settingsForMrw.dataArrayForBanCo = [{
                srcPlayerIndex,
                bannedCoIdList,
            }];
        } else {
            const dataArray     = settingsForMrw.dataArrayForBanCo;
            const playerData    = dataArray.find(v => v.srcPlayerIndex === data.playerIndex);
            if (playerData) {
                playerData.bannedCoIdList = data.bannedCoIdList;
            } else {
                dataArray.push({
                    srcPlayerIndex,
                    bannedCoIdList,
                });
            }
        }
    }
    export async function updateOnMsgMrrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (!roomInfo) {
            return;
        }

        const playerIndex       = data.playerIndex;
        const coId              = data.coId;
        const unitAndTileSkinId = data.unitAndTileSkinId;
        if (roomInfo.playerDataList == null) {
            Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() roomInfo.playerDataList == null.`);
            roomInfo.playerDataList = [{
                playerIndex,
                userId              : null,
                coId,
                unitAndTileSkinId,
                isReady             : true,
            }];
        } else {
            const dataArray     = roomInfo.playerDataList;
            const playerData    = dataArray.find(v => v.playerIndex === playerIndex);
            if (playerData) {
                playerData.coId                 = coId;
                playerData.isReady              = true;
                playerData.unitAndTileSkinId    = unitAndTileSkinId;
            } else {
                Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() playerData == null.`);
                dataArray.push({
                    playerIndex,
                    userId              : null,
                    coId,
                    unitAndTileSkinId,
                    isReady             : true,
                });
            }
        }
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of getMyRoomIdArray()) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return false;
        }

        const selfUserId = UserModel.getSelfUserId();
        const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
        if (playerData == null) {
            return false;
        }

        if (roomInfo.timeForStartSetSelfSettings != null) {
            return !playerData.isReady;
        } else {
            const arr = roomInfo.settingsForMrw.dataArrayForBanCo;
            if ((arr == null) || (arr.every(v => v.srcPlayerIndex !== playerData.playerIndex))) {
                return true;
            }
        }
    }

    export function getPreviewingRoomId(): number {
        return _previewingRoomId;
    }
    export function setPreviewingRoomId(roomId: number | null): void {
        if (getPreviewingRoomId() != roomId) {
            _previewingRoomId = roomId;
            Notify.dispatch(NotifyType.MrrJoinedPreviewingRoomIdChanged);
        }
    }

    export function getPreviewingMapId(): number | null | undefined {
        return _previewingMapId;
    }
    export function setPreviewingMapId(mapId: number): void {
        if (getPreviewingMapId() != mapId) {
            _previewingMapId = mapId;
            Notify.dispatch(NotifyType.MrrPreviewingMapIdChanged);
        }
    }

    function checkIsMyRoom(roomInfo: IMrrRoomInfo): boolean {
        const selfUserId = UserModel.getSelfUserId();
        return roomInfo.playerDataList.some(v => v.userId === selfUserId);
    }
}

export default MrrModel;
