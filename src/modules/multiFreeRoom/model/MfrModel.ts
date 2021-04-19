
namespace TinyWars.MultiFreeRoom.MfrModel {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
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

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMfrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMfrJoinRoom.IC;

    const _roomInfoDict         = new Map<number, IMfrRoomInfo>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMfrGetRoomInfo.IS | undefined | null) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<IMfrRoomInfo | undefined | null> {
        if (roomId == null) {
            return new Promise((resolve, reject) => resolve(null));
        }

        const localData = _roomInfoDict.get(roomId);
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
                const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

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
                    Notify.removeEventListener(Notify.Type.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(Notify.Type.MsgMfrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(Notify.Type.MsgMfrGetRoomInfoFailed,  callbackOnFailed);

            MfrProxy.reqMfrGetRoomInfo(roomId);
        });

        return new Promise((resolve, reject) => {
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
    export async function getUnjoinedRoomInfoList(): Promise<IMfrRoomInfo[]> {
        const infoList: IMfrRoomInfo[] = [];
        for (const roomId of _unjoinedRoomIdSet) {
            infoList.push(await getRoomInfo(roomId));
        }
        return infoList;
    }

    export function setJoinedRoomInfoList(infoList: IMfrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            _joinedRoomIdSet.add(roomInfo.roomId);
            setRoomInfo(roomInfo);
        }
    }
    export async function getJoinedRoomInfoList(): Promise<IMfrRoomInfo[]> {
        const infoList: IMfrRoomInfo[] = [];
        for (const roomId of _joinedRoomIdSet) {
            infoList.push(await getRoomInfo(roomId));
        }
        return infoList;
    }

    export function updateOnDeletePlayer(data: ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS): void {
        if (data.targetUserId === User.UserModel.getSelfUserId()) {
            const roomId = data.roomId;
            _unjoinedRoomIdSet.add(roomId);
            _joinedRoomIdSet.delete(roomId);
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
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === getNeededPlayersCount(roomInfo))     &&
                (playerDataList.every(v => (v.isReady) && (v.userId != null)))  &&
                (selfPlayerData)                                                &&
                (roomInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
            ) {
                return true;
            }
        }
        return false;
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
                return (v.aliveState !== Types.PlayerAliveState.Dead) && (v.playerIndex !== CommonConstants.WarNeutralPlayerIndex)
            }).playerIndex);
        }
        export function getData(): DataForCreateRoom {
            return _dataForCreateRoom;
        }
        export function getWarRule(): ProtoTypes.WarRule.IWarRule {
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
                Notify.dispatch(Notify.Type.MfrCreateSelfPlayerIndexChanged);
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

        export function setInitialFund(playerIndex, fund: number): void {
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

        export function setInitialEnergyPercentage(playerIndex: number, percentage: number): void {
            BwWarRuleHelper.setInitialEnergyPercentage(getWarRule(), playerIndex, percentage);
        }
        export function getInitialEnergyPercentage(playerIndex: number): number {
            return BwWarRuleHelper.getInitialEnergyPercentage(getWarRule(), playerIndex);
        }

        export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
            BwWarRuleHelper.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
        }
        export function getEnergyGrowthMultiplier(playerIndex: number): number {
            return BwWarRuleHelper.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
        }

        export function getAvailableCoIdList(playerIndex: number): number[] {
            return BwWarRuleHelper.getAvailableCoIdList(getWarRule(), playerIndex);
        }
        export function addAvailableCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.addAvailableCoId(getWarRule(), playerIndex, coId);
        }
        export function removeAvailableCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.removeAvailableCoId(getWarRule(), playerIndex, coId);
        }
        export function setAvailableCoIdList(playerIndex: number, coIdSet: Set<number>): void {
            BwWarRuleHelper.setAvailableCoIdList(getWarRule(), playerIndex, coIdSet);
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

        export function getRoomId(): number {
            return getData().roomId;
        }
        function setRoomId(roomId: number): void {
            getData().roomId = roomId;
        }

        export async function getRoomInfo(): Promise<IMfrRoomInfo | null> {
            return await MfrModel.getRoomInfo(getRoomId());
        }
        export async function getTeamIndex(): Promise<number> {
            return BwWarRuleHelper.getPlayerRule((await MfrModel.getRoomInfo(getRoomId())).settingsForMfw.initialWarData.settingsForCommon.warRule, getPlayerIndex()).teamIndex;
        }

        export function resetData(roomInfo: IMfrRoomInfo): void {
            const availablePlayerIndexList    = generateAvailablePlayerIndexArray(roomInfo);
            const playerIndex                 = availablePlayerIndexList[0];
            setRoomId(roomInfo.roomId);
            setAvailablePlayerIndexList(availablePlayerIndexList);
            setPlayerIndex(playerIndex);
            setIsReady(true);
        }
        export function clearData(): void {
            setIsReady(true);
            setPlayerIndex(null);
            setRoomId(null);
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

    export function getNeededPlayersCount(roomInfo: IMfrRoomInfo): number {
        let count = 0;
        for (const player of roomInfo.settingsForMfw.initialWarData.playerManager.players) {
            if ((player.aliveState !== Types.PlayerAliveState.Dead)             &&
                (player.playerIndex !== CommonConstants.WarNeutralPlayerIndex)
            ) {
                ++count;
            }
        }

        return count;
    }
}
