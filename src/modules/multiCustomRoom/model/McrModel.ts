
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import BootTimerType    = Types.BootTimerType;
    import IMcrRoomInfo     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    import NetMessage       = ProtoTypes.NetMessage;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMcrJoinRoom.IC;

    export namespace McrModel {
        const _roomInfoDict         = new Map<number, IMcrRoomInfo>();
        const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMcrGetRoomInfo.IS | undefined | null) => void)[]>();

        const _unjoinedRoomIdSet    = new Set<number>();
        const _joinedRoomIdSet      = new Set<number>();

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for rooms.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getRoomInfo(roomId: number): Promise<IMcrRoomInfo | undefined | null> {
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
                    const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                    if (data.roomId === roomId) {
                        Notify.removeEventListener(Notify.Type.MsgMcrGetRoomInfo,         callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMcrGetRoomInfoFailed,   callbackOnFailed);

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
                        Notify.removeEventListener(Notify.Type.MsgMcrGetRoomInfo,         callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMcrGetRoomInfoFailed,   callbackOnFailed);

                        for (const cb of _roomInfoRequests.get(roomId)) {
                            cb(data);
                        }
                        _roomInfoRequests.delete(roomId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.MsgMcrGetRoomInfo,        callbackOnSucceed);
                Notify.addEventListener(Notify.Type.MsgMcrGetRoomInfoFailed,  callbackOnFailed);

                McrProxy.reqMcrGetRoomInfo(roomId);
            });

            return new Promise((resolve, reject) => {
                _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
            });
        }
        export function setRoomInfo(info: IMcrRoomInfo): void {
            _roomInfoDict.set(info.roomId, info);
        }
        export function deleteRoomInfo(roomId: number): void {
            _roomInfoDict.delete(roomId);
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }

        export function setJoinableRoomInfoList(infoList: IMcrRoomInfo[]): void {
            _unjoinedRoomIdSet.clear();
            for (const roomInfo of infoList || []) {
                _unjoinedRoomIdSet.add(roomInfo.roomId);
                setRoomInfo(roomInfo);
            }
        }
        export async function getUnjoinedRoomInfoList(): Promise<IMcrRoomInfo[]> {
            const infoList: IMcrRoomInfo[] = [];
            for (const roomId of _unjoinedRoomIdSet) {
                infoList.push(await getRoomInfo(roomId));
            }
            return infoList;
        }

        export function setJoinedRoomInfoList(infoList: IMcrRoomInfo[]): void {
            _joinedRoomIdSet.clear();
            for (const roomInfo of infoList || []) {
                _joinedRoomIdSet.add(roomInfo.roomId);
                setRoomInfo(roomInfo);
            }
        }
        export async function getJoinedRoomInfoList(): Promise<IMcrRoomInfo[]> {
            const infoList: IMcrRoomInfo[] = [];
            for (const roomId of _joinedRoomIdSet) {
                infoList.push(await getRoomInfo(roomId));
            }
            return infoList;
        }

        export function updateOnMsgMcrDeletePlayer(data: ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS): void {
            if (data.targetUserId === User.UserModel.getSelfUserId()) {
                const roomId = data.roomId;
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
        export async function updateOnMsgMcrSetReady(data: ProtoTypes.NetMessage.MsgMcrSetReady.IS): Promise<void> {
            const roomInfo      = await getRoomInfo(data.roomId);
            const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.playerIndex === data.playerIndex) : null;
            if (playerData) {
                playerData.isReady = data.isReady;
            }
        }
        export async function updateOnMsgMcrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS): Promise<void> {
            const roomInfo = await getRoomInfo(data.roomId);
            if (roomInfo) {
                const oldPlayerIndex            = data.oldPlayerIndex;
                const newPlayerIndex            = data.newPlayerIndex;
                const playerData                = roomInfo.playerDataList.find(v => v.playerIndex === oldPlayerIndex);
                playerData.coId                 = data.coId;
                playerData.unitAndTileSkinId    = data.unitAndTileSkinId;
                playerData.playerIndex          = newPlayerIndex;
                if ((oldPlayerIndex !== newPlayerIndex) && (roomInfo.ownerPlayerIndex === oldPlayerIndex)) {
                    roomInfo.ownerPlayerIndex = newPlayerIndex;
                }
            }
        }
        export async function updateOnMsgMcrExitRoom(data: ProtoTypes.NetMessage.MsgMcrExitRoom.IS): Promise<void> {
            const roomId    = data.roomId;
            const roomInfo  = await getRoomInfo(roomId);
            if (roomInfo) {
                roomInfo.ownerPlayerIndex = data.roomOwnerPlayerIndex;

                const playerDataList = roomInfo.playerDataList;
                Helpers.deleteElementFromArray(playerDataList, playerDataList.find(v => v.playerIndex === data.playerIndex));
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

                if ((playerDataList.length === BwWarRuleHelper.getPlayersCount(roomInfo.settingsForCommon.warRule))    &&
                    (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                      &&
                    (selfPlayerData)                                                                                    &&
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

            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            return (selfPlayerData != null)
                && (selfPlayerData.playerIndex === roomInfo.ownerPlayerIndex)
                && (playerDataList.length == BwWarRuleHelper.getPlayersCount(roomInfo.settingsForCommon.warRule))
                && (playerDataList.every(v => (v.isReady) && (v.userId != null)));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating rooms.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export namespace Create {
            const _dataForCreateRoom: DataForCreateRoom = {
                settingsForCommon       : {},
                settingsForMcw          : {},

                selfCoId                : null,
                selfPlayerIndex         : null,
                selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
            };

            export function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
                return WarMapModel.getRawData(getMapId());
            }

            export async function resetDataByMapId(mapId: number): Promise<void> {
                setMapId(mapId);
                setConfigVersion(Utility.ConfigManager.getLatestFormalVersion());
                setWarName("");
                setWarPassword("");
                setWarComment("");
                setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
                setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);

                const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleAvailability.canMcw);
                await resetDataByWarRuleId(warRule ? warRule.ruleId : null);
            }
            export function getData(): DataForCreateRoom {
                return _dataForCreateRoom;
            }
            export function getWarRule(): ProtoTypes.WarRule.IWarRule {
                return getData().settingsForCommon.warRule;
            }

            export function getMapId(): number {
                return getData().settingsForMcw.mapId;
            }
            function setMapId(mapId: number): void {
                getData().settingsForMcw.mapId = mapId;
            }

            function setConfigVersion(version: string): void {
                getData().settingsForCommon.configVersion = version;
            }

            export async function resetDataByWarRuleId(ruleId: number | null): Promise<void> {
                if (ruleId == null) {
                    await resetDataByCustomWarRuleId();
                } else {
                    await resetDataByPresetWarRuleId(ruleId);
                }
            }
            async function resetDataByCustomWarRuleId(): Promise<void> {
                const settingsForCommon     = getData().settingsForCommon;
                const warRule               = BwWarRuleHelper.createDefaultWarRule(null, (await getMapRawData()).playersCountUnneutral);
                settingsForCommon.warRule   = warRule;
                setCustomWarRuleId();

                const availableCoIdArray = BwWarRuleHelper.getAvailableCoIdArrayFilteredByConfig(warRule, getSelfPlayerIndex(), settingsForCommon.configVersion);
                if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
                    setSelfCoId(BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdArray));
                }

                Notify.dispatch(Notify.Type.McrCreateTeamIndexChanged);
            }
            async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
                if (ruleId == null) {
                    Logger.error(`McwModel.resetDataByPresetWarRuleId() empty ruleId.`);
                    return undefined;
                }

                const warRule = (await getMapRawData()).warRuleArray.find(warRule => warRule.ruleId === ruleId);
                if (warRule == null) {
                    Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                    return undefined;
                }

                const settingsForCommon     = getData().settingsForCommon;
                settingsForCommon.warRule   = Helpers.deepClone(warRule);
                setPresetWarRuleId(ruleId);

                const availableCoIdArray = BwWarRuleHelper.getAvailableCoIdArrayFilteredByConfig(warRule, getSelfPlayerIndex(), settingsForCommon.configVersion);
                if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
                    setSelfCoId(BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdArray));
                }

                Notify.dispatch(Notify.Type.McrCreateTeamIndexChanged);
            }
            function setPresetWarRuleId(ruleId: number | null | undefined): void {
                const settingsForCommon             = getData().settingsForCommon;
                settingsForCommon.warRule.ruleId    = ruleId;
                settingsForCommon.presetWarRuleId   = ruleId;
                Notify.dispatch(Notify.Type.McrCreatePresetWarRuleIdChanged);
            }
            export function setCustomWarRuleId(): void {
                setPresetWarRuleId(null);
            }
            export function getPresetWarRuleId(): number | undefined {
                return getData().settingsForCommon.presetWarRuleId;
            }
            export async function tickPresetWarRuleId(): Promise<void> {
                const currWarRuleId = getPresetWarRuleId();
                const warRuleArray  = (await getMapRawData()).warRuleArray;
                if (currWarRuleId == null) {
                    const warRule = warRuleArray.find(v => v.ruleAvailability.canMcw);
                    await resetDataByWarRuleId(warRule ? warRule.ruleId : null);
                } else {
                    const warRuleIdList: number[] = [];
                    for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                        warRuleIdList.push(ruleId);
                    }
                    for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                        warRuleIdList.push(ruleId);
                    }
                    for (const ruleId of warRuleIdList) {
                        if (warRuleArray.find(v => v.ruleId === ruleId).ruleAvailability.canMcw) {
                            await resetDataByWarRuleId(ruleId);
                            return;
                        }
                    }
                }
            }

            export function setWarName(name: string): void {
                getData().settingsForMcw.warName = name;
            }
            export function getWarName(): string {
                return getData().settingsForMcw.warName;
            }

            export function setWarPassword(password: string): void {
                getData().settingsForMcw.warPassword = password;
            }
            export function getWarPassword(): string {
                return getData().settingsForMcw.warPassword;
            }

            export function setWarComment(comment: string): void {
                getData().settingsForMcw.warComment = comment;
            }
            export function getWarComment(): string {
                return getData().settingsForMcw.warComment;
            }

            export function setSelfPlayerIndex(playerIndex: number): void {
                if (playerIndex !== getSelfPlayerIndex()) {
                    getData().selfPlayerIndex = playerIndex;
                    Notify.dispatch(Notify.Type.McrCreateSelfPlayerIndexChanged);
                }
            }
            // export async function tickSelfPlayerIndex(): Promise<void> {
            //     setSelfPlayerIndex(getSelfPlayerIndex() % BwWarRuleHelper.getPlayersCount(getWarRule()) + 1);
            // }
            export function getSelfPlayerIndex(): number {
                return getData().selfPlayerIndex;
            }

            export function setSelfCoId(coId: number): void {
                if (getSelfCoId() !== coId) {
                    getData().selfCoId = coId;
                    Notify.dispatch(Notify.Type.McrCreateSelfCoIdChanged);
                }
            }
            export function getSelfCoId(): number | null {
                return getData().selfCoId;
            }

            export function setSelfUnitAndTileSkinId(skinId: number): void {
                if (skinId !== getSelfUnitAndTileSkinId()) {
                    getData().selfUnitAndTileSkinId = skinId;
                    Notify.dispatch(Notify.Type.McrCreateSelfSkinIdChanged);
                }
            }
            export function tickSelfUnitAndTileSkinId(): void {
                setSelfUnitAndTileSkinId(getSelfUnitAndTileSkinId() % CommonConstants.UnitAndTileMaxSkinId + 1);
            }
            export function getSelfUnitAndTileSkinId(): number {
                return getData().selfUnitAndTileSkinId;
            }

            export function setHasFog(hasFog: boolean): void {
                getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
            }
            export function getHasFog(): boolean {
                return getWarRule().ruleForGlobalParams.hasFogByDefault;
            }

            export function setBootTimerParams(params: number[]): void {
                getData().settingsForMcw.bootTimerParams = params;
            }
            export function getBootTimerParams(): number[] {
                return getData().settingsForMcw.bootTimerParams;
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
                Notify.dispatch(Notify.Type.McrCreateTeamIndexChanged);
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

        export namespace Join {
            let _targetRoomId: number;

            export function getFastJoinData(roomInfo: IMcrRoomInfo): DataForJoinRoom | null {
                const playerIndex       = generateAvailablePlayerIndexList(roomInfo)[0];
                const unitAndTileSkinId = generateAvailableSkinIdList(roomInfo)[0];
                if ((playerIndex == null) || (unitAndTileSkinId == null)) {
                    return null;
                } else {
                    return {
                        roomId          : roomInfo.roomId,
                        isReady         : false,
                        coId            : BwWarRuleHelper.getRandomCoIdWithSettingsForCommon(roomInfo.settingsForCommon, playerIndex),
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
                    Notify.dispatch(Notify.Type.McrJoinTargetRoomIdChanged);
                }
            }
            export async function getTargetRoomInfo(): Promise<IMcrRoomInfo | null> {
                const roomId = getTargetRoomId();
                return roomId == null ? null : await getRoomInfo(roomId);
            }
        }
    }

    function generateAvailablePlayerIndexList(info: IMcrRoomInfo): number[] {
        const playersCount      = BwWarRuleHelper.getPlayersCount(info.settingsForCommon.warRule);
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
