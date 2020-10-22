
namespace TinyWars.RankMatchRoom.RmrModel {
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;
    import IRmrRoomInfo = ProtoTypes.RankMatchRoom.IRmrRoomInfo;

    let _maxConcurrentCountForStd   = 0;
    let _maxConcurrentCountForFog   = 0;
    const _allRoomDict              = new Map<number, IRmrRoomInfo>();
    const _roomInfoRequests         = new Map<number, ((info: NetMessage.MsgRmrGetRoomPublicInfo.IS | undefined | null) => void)[]>();

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

    export function setRoomInfo(roomInfo: IRmrRoomInfo, needNotify: boolean): void {
        const roomId        = roomInfo.roomId;
        const oldRoomInfo   = _allRoomDict.get(roomId);
        _allRoomDict.set(roomId, roomInfo);

        if (needNotify) {
            const isMyOldRoom = (oldRoomInfo != null) && (checkIsMyRoom(oldRoomInfo));
            const isMyNewRoom = checkIsMyRoom(roomInfo);
            if ((!isMyOldRoom) && (isMyNewRoom)) {
                Notify.dispatch(Notify.Type.RmrMyRoomAdded);
            }
            if ((isMyOldRoom) && (!isMyNewRoom)) {
                Notify.dispatch(Notify.Type.RmrMyRoomDeleted);
            }
        }
    }
    export function getRoomInfo(roomId: number): Promise<IRmrRoomInfo | undefined | null> {
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

        new Promise((resolve, reject) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgRmrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgRmrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgRmrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgRmrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(Notify.Type.MsgRmrGetRoomPublicInfo,        callbackOnSucceed);
            Notify.addEventListener(Notify.Type.MsgRmrGetRoomPublicInfoFailed,  callbackOnFailed);

            RmrProxy.reqRmrGetRoomPublicInfo(roomId);
        });

        return new Promise((resolve, reject) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }
    export function deleteRoomInfo(roomId: number): void {
        const roomInfo = _allRoomDict.get(roomId);
        _allRoomDict.delete(roomId);

        if ((roomInfo) && (checkIsMyRoom(roomInfo))) {
            Notify.dispatch(Notify.Type.RmrMyRoomDeleted);
        }
    }

    export function updateWithMyRoomInfoList(roomList: IRmrRoomInfo[]): void {
        for (const roomInfo of roomList || []) {
            setRoomInfo(roomInfo, false);
        }
    }
    export function getAllRoomInfoDict(): Map<number, IRmrRoomInfo> {
        return _allRoomDict;
    }
    export function getMyRoomInfoList(): IRmrRoomInfo[] {
        const list: IRmrRoomInfo[] = [];
        for (const [, roomInfo] of _allRoomDict) {
            if (checkIsMyRoom(roomInfo)) {
                list.push(roomInfo);
            }
        }
        return list;
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomInfo of getMyRoomInfoList()) {
            if (await checkIsRedForRoom(roomInfo.roomId)) {
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

        const selfUserId = User.UserModel.getSelfUserId();
        const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
        if (playerData == null) {
            return false;
        }

        if (roomInfo.timeForStartSetSelfSettings != null) {
            return !playerData.isReady;
        } else {
            const list = roomInfo.settingsForRmw.dataListForBanCo;
            if ((list == null) || (list.every(v => v.srcPlayerIndex !== playerData.playerIndex))) {
                return true;
            }
        }
    }

    function checkIsMyRoom(roomInfo: IRmrRoomInfo): boolean {
        const selfUserId = User.UserModel.getSelfUserId();
        return roomInfo.playerDataList.some(v => v.userId === selfUserId);
    }
}
