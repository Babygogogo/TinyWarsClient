
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as Helpers             from "../../../utility/Helpers";
import { Notify }               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import { Types }                from "../../../utility/Types";
import * as BwWarRuleHelper     from "../../baseWar/model/BwWarRuleHelper";
import * as MfrModel            from "../../multiFreeRoom/model/MfrModel";
import * as MfrProxy            from "../../multiFreeRoom/model/MfrProxy";
import * as UserModel           from "../../user/model/UserModel";
import BootTimerType    = Types.BootTimerType;
import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;
import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
import NetMessage       = ProtoTypes.NetMessage;

const REGULAR_TIME_LIMITS = [
    60 * 60 * 24 * 1,   // 1 day
    60 * 60 * 24 * 2,   // 2 days
    60 * 60 * 24 * 3,   // 3 days
    60 * 60 * 24 * 7,   // 7 days
];

export type DataForJoinRoom = ProtoTypes.NetMessage.MsgMfrJoinRoom.IC;
type DataForCreateRoom      = {
    settingsForMfw  : ProtoTypes.WarSettings.ISettingsForMfw;
    selfPlayerIndex : number | null;
};

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

        if ((playerDataList.length === BwWarRuleHelper.getPlayersCount(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule))   &&
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
        && (playerDataList.length === BwWarRuleHelper.getPlayersCount(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule))
        && (playerDataList.every(v => v.isReady));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for creating rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace Create {
    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForMfw          : {},

        selfPlayerIndex         : null,
    };

    export async function resetDataByInitialWarData(warData: ISerialWar): Promise<void> {
        setInitialWarData(warData);
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setSelfPlayerIndex(warData.playerManager.players.find(v => {
            return (v.aliveState !== Types.PlayerAliveState.Dead)
                && (v.playerIndex !== CommonConstants.WarNeutralPlayerIndex)
                && (v.userId != null);
        }).playerIndex);
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule | null | undefined {
        return getSettingsForMfw().initialWarData.settingsForCommon.warRule;
    }
    function getSettingsForMfw(): ProtoTypes.WarSettings.ISettingsForMfw {
        return getData().settingsForMfw;
    }

    export function getInitialWarData(): ISerialWar {
        return getSettingsForMfw().initialWarData;
    }
    function setInitialWarData(warData: ISerialWar): void {
        getSettingsForMfw().initialWarData = warData;
    }

    export function setWarName(name: string): void {
        getSettingsForMfw().warName = name;
    }
    export function getWarName(): string {
        return getSettingsForMfw().warName;
    }

    export function setWarPassword(password: string): void {
        getSettingsForMfw().warPassword = password;
    }
    export function getWarPassword(): string {
        return getSettingsForMfw().warPassword;
    }

    export function setWarComment(comment: string): void {
        getSettingsForMfw().warComment = comment;
    }
    export function getWarComment(): string {
        return getSettingsForMfw().warComment;
    }

    export function setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== getSelfPlayerIndex()) {
            getData().selfPlayerIndex = playerIndex;
            Notify.dispatch(NotifyType.MfrCreateSelfPlayerIndexChanged);
        }
    }
    export function tickSelfPlayerIndex(): void {
        setSelfPlayerIndex(getSelfPlayerIndex() % BwWarRuleHelper.getPlayersCount(getWarRule()) + 1);
    }
    export function getSelfPlayerIndex(): number {
        return getData().selfPlayerIndex;
    }
    export function getSelfPlayerData(): ProtoTypes.WarSerialization.ISerialPlayer {
        const playerIndex = getSelfPlayerIndex();
        return getInitialWarData().playerManager.players.find(v => v.playerIndex === playerIndex);
    }

    export function setHasFog(hasFog: boolean): void {
        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }

    export function setBootTimerParams(params: number[]): void {
        getSettingsForMfw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return getSettingsForMfw().bootTimerParams;
    }
    export function tickBootTimerType(): void {
        const params = getBootTimerParams();
        if ((params) && (params[0] === BootTimerType.Regular)) {
            setBootTimerParams([BootTimerType.Incremental, 60 * 15, 15]);
        } else {
            setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        }
    }
    export function tickTimerRegularTime(): void {
        const params = getBootTimerParams();
        if (params[0] !== BootTimerType.Regular) {
            tickBootTimerType();
        } else {
            const index = REGULAR_TIME_LIMITS.indexOf(params[1]);
            if (index < 0) {
                tickBootTimerType();
            } else {
                const newIndex  = index + 1;
                params[1]       = newIndex < REGULAR_TIME_LIMITS.length ? REGULAR_TIME_LIMITS[newIndex] : REGULAR_TIME_LIMITS[0];
            }
        }
    }
    export function setTimerIncrementalInitialTime(seconds: number): void {
        getBootTimerParams()[1] = seconds;
    }
    export function setTimerIncrementalIncrementalValue(seconds: number): void {
        getBootTimerParams()[2] = seconds;
    }

    export function tickTeamIndex(playerIndex: number): void {
        BwWarRuleHelper.tickTeamIndex(getWarRule(), playerIndex);
    }
    export function getTeamIndex(playerIndex: number): number {
        return BwWarRuleHelper.getTeamIndex(getWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        BwWarRuleHelper.setInitialFund(getWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return BwWarRuleHelper.getInitialFund(getWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        BwWarRuleHelper.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return BwWarRuleHelper.getIncomeMultiplier(getWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        BwWarRuleHelper.setEnergyAddPctOnLoadCo(getWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return BwWarRuleHelper.getEnergyAddPctOnLoadCo(getWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        BwWarRuleHelper.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return BwWarRuleHelper.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        BwWarRuleHelper.setLuckLowerLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return BwWarRuleHelper.getLuckLowerLimit(getWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        BwWarRuleHelper.setLuckUpperLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return BwWarRuleHelper.getLuckUpperLimit(getWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelper.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return BwWarRuleHelper.getMoveRangeModifier(getWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelper.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return BwWarRuleHelper.getAttackPowerModifier(getWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        BwWarRuleHelper.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return BwWarRuleHelper.getVisionRangeModifier(getWarRule(), playerIndex);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for joining room.
////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace Join {
    const _dataForJoinRoom: DataForJoinRoom = {
        roomId              : null,
        playerIndex         : null,
        isReady             : true,
    };
    const _availablePlayerIndexList : number[] = [];

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
        return BwWarRuleHelper.getPlayerRule((await MfrModel.getRoomInfo(getTargetRoomId())).settingsForMfw.initialWarData.settingsForCommon.warRule, getPlayerIndex()).teamIndex;
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
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for joined rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace Joined {
    let _previewingRoomId   : number;

    export function getPreviewingRoomId(): number {
        return _previewingRoomId;
    }
    export function setPreviewingRoomId(roomId: number | null): void {
        if (getPreviewingRoomId() != roomId) {
            _previewingRoomId = roomId;
            Notify.dispatch(NotifyType.MfrJoinedPreviewingRoomIdChanged);
        }
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
