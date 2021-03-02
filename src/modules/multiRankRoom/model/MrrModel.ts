
namespace TinyWars.MultiRankRoom.MrrModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Logger           = Utility.Logger;
    import ConfigManager    = Utility.ConfigManager;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import NetMessage       = ProtoTypes.NetMessage;
    import IMrrRoomInfo     = ProtoTypes.MultiRankRoom.IMrrRoomInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

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

    export function setRoomInfo(roomInfo: IMrrRoomInfo, needNotify: boolean): void {
        const roomId        = roomInfo.roomId;
        const oldRoomInfo   = _allRoomDict.get(roomId);
        _allRoomDict.set(roomId, roomInfo);

        if (needNotify) {
            const isMyOldRoom = (oldRoomInfo != null) && (checkIsMyRoom(oldRoomInfo));
            const isMyNewRoom = checkIsMyRoom(roomInfo);
            if ((!isMyOldRoom) && (isMyNewRoom)) {
                Notify.dispatch(Notify.Type.MrrMyRoomAdded);
            }
            if ((isMyOldRoom) && (!isMyNewRoom)) {
                Notify.dispatch(Notify.Type.MrrMyRoomDeleted);
            }
        }
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
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

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
                    Notify.removeEventListener(Notify.Type.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(Notify.Type.MsgMrrGetRoomPublicInfo,        callbackOnSucceed);
            Notify.addEventListener(Notify.Type.MsgMrrGetRoomPublicInfoFailed,  callbackOnFailed);

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
            Notify.dispatch(Notify.Type.MrrMyRoomDeleted);
        }
    }

    export function updateWithMyRoomInfoList(roomList: IMrrRoomInfo[]): void {
        for (const roomInfo of roomList || []) {
            setRoomInfo(roomInfo, false);
        }
    }
    export function getAllRoomInfoDict(): Map<number, IMrrRoomInfo> {
        return _allRoomDict;
    }
    export function getMyRoomInfoList(): IMrrRoomInfo[] {
        const list: IMrrRoomInfo[] = [];
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
            const arr = roomInfo.settingsForMrw.dataArrayForBanCo;
            if ((arr == null) || (arr.every(v => v.srcPlayerIndex !== playerData.playerIndex))) {
                return true;
            }
        }
    }

    export namespace SelfSettings {
        let _coId               : number | null | undefined;
        let _unitAndTileSkinId  : number | null | undefined;

        export function resetData(roomInfo: IMrrRoomInfo): void {
            if (roomInfo.timeForStartSetSelfSettings == null) {
                setCoId(null);
                setUnitAndTileSkinId(null);
                return;
            }

            const playerDataList    = roomInfo.playerDataList;
            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                setCoId(null);
                setUnitAndTileSkinId(null);
            } else {
                if (selfPlayerData.isReady) {
                    setCoId(selfPlayerData.coId);
                    setUnitAndTileSkinId(selfPlayerData.unitAndTileSkinId);
                } else {
                    const selfPlayerIndex   = selfPlayerData.playerIndex;
                    const availableCoIdList = generateAvailableCoIdList(roomInfo, selfPlayerIndex);
                    if ((availableCoIdList == null) || (!availableCoIdList.length)) {
                        Logger.error(`MrrModel.SelfSettings.resetData() empty availableCoIdList.`);
                        return undefined;
                    }

                    const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
                    if ((availableSkinIdList == null) || (!availableSkinIdList.length)) {
                        Logger.error(`MrrModel.SelfSettings.resetData() empty availableSkinIdList.`);
                        return undefined;
                    }

                    setCoId(BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdList));
                    setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
                }
            }
        }

        export function setCoId(coId: number | null | undefined): void {
            _coId = coId;
        }
        export function getCoId(): number | null | undefined {
            return _coId;
        }

        function setUnitAndTileSkinId(skinId: number | null | undefined): void {
            _unitAndTileSkinId = skinId;
        }
        export function getUnitAndTileSkinId(): number | null | undefined {
            return _unitAndTileSkinId;
        }
        export function tickUnitAndTileSkinId(roomInfo: IMrrRoomInfo): void {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if ((availableSkinIdList == null) || (!availableSkinIdList.length)) {
                Logger.error(`MrrModel.SelfSettings.tickUnitAndTileSkinId() empty availableSkinIdList.`);
                return;
            }

            const index = availableSkinIdList.indexOf(getUnitAndTileSkinId());
            setUnitAndTileSkinId(availableSkinIdList[(index + 1) % availableSkinIdList.length]);
        }

        export function generateAvailableCoIdList(roomInfo: IMrrRoomInfo, playerIndex: number): number[] | undefined {
            const settingsForCommon = roomInfo.settingsForCommon;
            if (settingsForCommon == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty settingsForCommon.`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty configVersion.`);
                return undefined;
            }

            const settingsForMrw = roomInfo.settingsForMrw;
            if (settingsForMrw == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty settingsForMrw.`);
                return undefined;
            }

            const dataArrayForBanCo = settingsForMrw.dataArrayForBanCo;
            if (dataArrayForBanCo == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty dataArrayForBanCo.`);
                return undefined;
            }

            const playerRule = BwWarRuleHelper.getPlayerRule(settingsForCommon.warRule, playerIndex);
            if (playerRule == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty playerRule.`);
                return undefined;
            }

            const rawAvailableCoIdList = playerRule.availableCoIdArray;
            if (rawAvailableCoIdList == null) {
                Logger.error(`MrrModel.generateAvailableCoIdList() empty rawAvailableCoIdList.`);
                return undefined;
            }

            const bannedCoIds = new Set<number>();
            for (const data of dataArrayForBanCo) {
                for (const coId of data.bannedCoIdList || []) {
                    bannedCoIds.add(coId);
                }
            }

            const availableCoIdList: number[] = [];
            for (const coId of rawAvailableCoIdList) {
                const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
                if ((cfg) && (cfg.isEnabled) &&(!bannedCoIds.has(coId))) {
                    availableCoIdList.push(coId);
                }
            }
            return availableCoIdList;
        }
        function generateAvailableSkinIdList(roomInfo: IMrrRoomInfo): number[] | undefined {
            const playerDataList = roomInfo.playerDataList;
            if (playerDataList == null) {
                Logger.error(`MrrModel.SelfSettings.generateAvailableSkinIdList() empty playerDataList.`);
                return undefined;
            }

            const usedSkinIds = new Set<number>();
            for (const playerData of playerDataList) {
                if (playerData.isReady) {
                    const skinId = playerData.unitAndTileSkinId;
                    if (usedSkinIds.has(skinId)) {
                        Logger.error(`MrrModel.SelfSettings.generateAvailableSkinIdList() duplicated skinId!`);
                        return undefined;
                    }

                    usedSkinIds.add(skinId);
                }
            }

            const availableSkinIdList: number[] = [];
            for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
                if (!usedSkinIds.has(skinId)) {
                    availableSkinIdList.push(skinId);
                }
            }
            return availableSkinIdList;
        }
    }

    function checkIsMyRoom(roomInfo: IMrrRoomInfo): boolean {
        const selfUserId = User.UserModel.getSelfUserId();
        return roomInfo.playerDataList.some(v => v.userId === selfUserId);
    }
}
