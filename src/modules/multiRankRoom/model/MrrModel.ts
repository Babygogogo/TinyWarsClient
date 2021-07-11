
import * as CommonConstants             from "../../../utility/CommonConstants";
import { Logger }                       from "../../../utility/Logger";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as BwWarRuleHelper             from "../../baseWar/model/BwWarRuleHelper";
import * as UserModel                   from "../../user/model/UserModel";
import * as MrrProxy                    from "./MrrProxy";
import NetMessage                       = ProtoTypes.NetMessage;
import IMrrRoomInfo                     = ProtoTypes.MultiRankRoom.IMrrRoomInfo;

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
    if (SelfSettings.getRoomId() === roomId) {
        await SelfSettings.resetData(roomId);
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

export namespace Joined {
    let _previewingRoomId   : number;

    export function getPreviewingRoomId(): number {
        return _previewingRoomId;
    }
    export function setPreviewingRoomId(roomId: number | null): void {
        if (getPreviewingRoomId() != roomId) {
            _previewingRoomId = roomId;
            Notify.dispatch(NotifyType.MrrJoinedPreviewingRoomIdChanged);
        }
    }
}

export namespace PreviewMap {
    let _previewingMapId: number;

    export function getPreviewingMapId(): number | null | undefined {
        return _previewingMapId;
    }
    export function setPreviewingMapId(mapId: number): void {
        if (getPreviewingMapId() != mapId) {
            _previewingMapId = mapId;
            Notify.dispatch(NotifyType.MrrPreviewingMapIdChanged);
        }
    }
}

export namespace SelfSettings {
    let _roomId             : number | null | undefined;
    let _coId               : number | null | undefined;
    let _unitAndTileSkinId  : number | null | undefined;
    let _availableCoIdArray : number[] | null | undefined;

    export async function resetData(roomId: number): Promise<void> {
        setRoomId(roomId);
        setCoId(null);
        setUnitAndTileSkinId(null);
        setAvailableCoIdArray(null);

        const roomInfo          = await getRoomInfo(roomId);
        const playerDataList    = roomInfo ? roomInfo.playerDataList || [] : [];
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        if ((roomInfo.timeForStartSetSelfSettings == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = selfPlayerData.playerIndex;
        const availableCoIdArray    = generateAvailableCoIdArray(roomInfo, selfPlayerIndex);
        if ((availableCoIdArray == null) || (!availableCoIdArray.length)) {
            Logger.error(`MrrModel.SelfSettings.resetData() empty availableCoIdArray.`);
            return undefined;
        }
        setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.isReady) {
            setCoId(selfPlayerData.coId);
            setUnitAndTileSkinId(selfPlayerData.unitAndTileSkinId);
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if ((availableSkinIdList == null) || (!availableSkinIdList.length)) {
                Logger.error(`MrrModel.SelfSettings.resetData() empty availableSkinIdList.`);
                return undefined;
            }

            setCoId(CommonConstants.CoEmptyId);
            setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }
    function setRoomId(roomId: number | null | undefined): void {
        _roomId = roomId;
    }
    export function getRoomId(): number | null | undefined {
        return _roomId;
    }

    export function setCoId(coId: number | null | undefined): void {
        if (_coId !== coId) {
            _coId = coId;
            Notify.dispatch(NotifyType.MrrSelfSettingsCoIdChanged);
        }
    }
    export function getCoId(): number | null | undefined {
        return _coId;
    }

    export function setUnitAndTileSkinId(skinId: number | null | undefined): void {
        if (_unitAndTileSkinId !== skinId) {
            _unitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.MrrSelfSettingsSkinIdChanged);
        }
    }
    export function getUnitAndTileSkinId(): number | null | undefined {
        return _unitAndTileSkinId;
    }

    function setAvailableCoIdArray(idArray: number[] | null | undefined): void {
        _availableCoIdArray = idArray;
    }
    export function getAvailableCoIdArray(): number[] | null | undefined {
        return _availableCoIdArray;
    }
    function generateAvailableCoIdArray(roomInfo: IMrrRoomInfo, playerIndex: number): number[] | undefined {
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

        const bannedCoIdSet = new Set<number>(playerRule.bannedCoIdArray);
        for (const data of dataArrayForBanCo) {
            for (const coId of data.bannedCoIdList || []) {
                bannedCoIdSet.add(coId);
            }
        }

        return BwWarRuleHelper.getAvailableCoIdArray(configVersion, bannedCoIdSet);
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
    const selfUserId = UserModel.getSelfUserId();
    return roomInfo.playerDataList.some(v => v.userId === selfUserId);
}
