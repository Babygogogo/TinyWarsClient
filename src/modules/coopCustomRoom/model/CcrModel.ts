
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomRoom.CcrModel {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import BootTimerType    = Types.BootTimerType;
    import ICcrRoomInfo     = ProtoTypes.CoopCustomRoom.ICcrRoomInfo;
    import NetMessage       = ProtoTypes.NetMessage;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgCcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgCcrJoinRoom.IC;

    const _roomInfoDict         = new Map<number, ICcrRoomInfo>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgCcrGetRoomInfo.IS | undefined | null) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<ICcrRoomInfo | undefined | null> {
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
                const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgCcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgCcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(Notify.Type.MsgCcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(Notify.Type.MsgCcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(Notify.Type.MsgCcrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(Notify.Type.MsgCcrGetRoomInfoFailed,  callbackOnFailed);

            CcrProxy.reqCcrGetRoomInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }
    export function setRoomInfo(info: ICcrRoomInfo): void {
        _roomInfoDict.set(info.roomId, info);
    }
    export function deleteRoomInfo(roomId: number): void {
        _roomInfoDict.delete(roomId);
        _unjoinedRoomIdSet.delete(roomId);
        _joinedRoomIdSet.delete(roomId);
    }

    export function setJoinableRoomInfoList(infoList: ICcrRoomInfo[]): void {
        _unjoinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            _unjoinedRoomIdSet.add(roomInfo.roomId);
            setRoomInfo(roomInfo);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _unjoinedRoomIdSet;
    }

    export function setJoinedRoomInfoList(infoList: ICcrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            _joinedRoomIdSet.add(roomInfo.roomId);
            setRoomInfo(roomInfo);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export async function updateOnMsgCcrDeletePlayer(data: ProtoTypes.NetMessage.MsgCcrDeletePlayer.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.targetPlayerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === User.UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export async function updateOnMsgCcrSetReady(data: ProtoTypes.NetMessage.MsgCcrSetReady.IS): Promise<void> {
        const roomInfo      = await getRoomInfo(data.roomId);
        const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.playerIndex === data.playerIndex) : null;
        if (playerData) {
            playerData.isReady = data.isReady;
        }
    }
    export async function updateOnMsgCcrSetSelfSettings(data: ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS): Promise<void> {
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
    export async function updateOnMsgCcrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgCcrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgCcrJoinRoom(data: ProtoTypes.NetMessage.MsgCcrJoinRoom.IS): Promise<void> {
        const roomInfo      = await getRoomInfo(data.roomId);
        const playerIndex   = data.playerIndex;
        if (!roomInfo.playerDataList) {
            roomInfo.playerDataList = [{
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : data.coId,
                unitAndTileSkinId   : data.unitAndTileSkinId,
            }];
        } else {
            const playerDataList = roomInfo.playerDataList;
            Helpers.deleteElementFromArray(playerDataList, playerDataList.find(v => v.playerIndex === playerIndex));
            playerDataList.push({
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : data.coId,
                unitAndTileSkinId   : data.unitAndTileSkinId,
            });
        }
    }
    export async function updateOnMsgCcrExitRoom(data: ProtoTypes.NetMessage.MsgCcrExitRoom.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.playerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === User.UserModel.getSelfUserId())) {
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
            settingsForCcw          : {},

            selfCoId                : null,
            selfPlayerIndex         : null,
            selfUnitAndTileSkinId   : CommonConstants.UnitAndTileMinSkinId,
            aiSkinInfoArray         : [],
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

            const warRule = (await getMapRawData()).warRuleArray.find(v => v.ruleAvailability.canCcw);
            if (warRule == null) {
                Logger.error(`CcrModel.resetDataByMapId() empty warRule.`);
            } else {
                await resetDataByWarRuleId(warRule.ruleId);
            }
        }
        export function getData(): DataForCreateRoom {
            return _dataForCreateRoom;
        }
        export function getWarRule(): ProtoTypes.WarRule.IWarRule {
            return getData().settingsForCommon.warRule;
        }

        export function getMapId(): number {
            return getData().settingsForCcw.mapId;
        }
        function setMapId(mapId: number): void {
            getData().settingsForCcw.mapId = mapId;
        }

        function setConfigVersion(version: string): void {
            getData().settingsForCommon.configVersion = version;
        }

        export async function resetDataByWarRuleId(ruleId: number): Promise<void> {
            if (ruleId == null) {
                Logger.error(`CcwModel.resetDataByPresetWarRuleId() empty ruleId.`);
                return undefined;
            }

            const warRule = (await getMapRawData()).warRuleArray.find(r => r.ruleId === ruleId);
            if (warRule == null) {
                Logger.error(`CcwModel.resetDataByPresetWarRuleId() empty warRule.`);
                return undefined;
            }

            const ruleForPlayers    = warRule.ruleForPlayers;
            const playerRuleArray   = ruleForPlayers ? ruleForPlayers.playerRuleDataArray : null;
            if (playerRuleArray == null) {
                Logger.error(`CcwModel.resetDataByPresetWarRuleId() empty playerRuleArray.`);
                return undefined;
            }

            const humanPlayerIndexArray: number[] = [];
            const robotPlayerIndexArray: number[] = [];
            for (const playerRule of playerRuleArray) {
                const playerIndex = playerRule.playerIndex;
                if (playerIndex == null) {
                    Logger.error(`CcwModel.resetDataByPresetWarRuleId() empty playerIndex.`);
                    return undefined;
                }

                if (playerRule.fixedCoIdInCcw == null) {
                    humanPlayerIndexArray.push(playerIndex);
                } else {
                    robotPlayerIndexArray.push(playerIndex);
                }
            }

            const selfPlayerIndex       = Math.min(...humanPlayerIndexArray);
            const settingsForCommon     = getData().settingsForCommon;
            settingsForCommon.warRule   = Helpers.deepClone(warRule);
            setPresetWarRuleId(ruleId);
            setSelfPlayerIndex(selfPlayerIndex);
            setSelfUnitAndTileSkinId(selfPlayerIndex);
            resetAiSkinInfoArray(robotPlayerIndexArray);

            const availableCoIdArray = BwWarRuleHelper.getAvailableCoIdArrayForPlayer(warRule, selfPlayerIndex, settingsForCommon.configVersion);
            if (availableCoIdArray.indexOf(getSelfCoId()) < 0) {
                setSelfCoId(BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdArray));
            }

            Notify.dispatch(Notify.Type.CcrCreateTeamIndexChanged);
        }
        function setPresetWarRuleId(ruleId: number | null | undefined): void {
            const settingsForCommon             = getData().settingsForCommon;
            settingsForCommon.warRule.ruleId    = ruleId;
            settingsForCommon.presetWarRuleId   = ruleId;
            Notify.dispatch(Notify.Type.CcrCreatePresetWarRuleIdChanged);
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
                const warRule = warRuleArray.find(v => v.ruleAvailability.canCcw);
                if (warRule == null) {
                    Logger.error(`CcrModel.tickPresetWarRuleId() empty warRule.`);
                } else {
                    await resetDataByWarRuleId(warRule.ruleId);
                }
            } else {
                const warRuleIdList: number[] = [];
                for (let ruleId = currWarRuleId + 1; ruleId < warRuleArray.length; ++ruleId) {
                    warRuleIdList.push(ruleId);
                }
                for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                    warRuleIdList.push(ruleId);
                }
                for (const ruleId of warRuleIdList) {
                    if (warRuleArray.find(v => v.ruleId === ruleId).ruleAvailability.canCcw) {
                        await resetDataByWarRuleId(ruleId);
                        return;
                    }
                }
            }
        }

        export function setWarName(name: string): void {
            getData().settingsForCcw.warName = name;
        }
        export function getWarName(): string {
            return getData().settingsForCcw.warName;
        }

        export function setWarPassword(password: string): void {
            getData().settingsForCcw.warPassword = password;
        }
        export function getWarPassword(): string {
            return getData().settingsForCcw.warPassword;
        }

        export function setWarComment(comment: string): void {
            getData().settingsForCcw.warComment = comment;
        }
        export function getWarComment(): string {
            return getData().settingsForCcw.warComment;
        }

        export function setSelfPlayerIndex(playerIndex: number): void {
            if (playerIndex !== getSelfPlayerIndex()) {
                getData().selfPlayerIndex = playerIndex;
                Notify.dispatch(Notify.Type.CcrCreateSelfPlayerIndexChanged);
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
                Notify.dispatch(Notify.Type.CcrCreateSelfCoIdChanged);
            }
        }
        export function getSelfCoId(): number | null {
            return getData().selfCoId;
        }

        export function setSelfUnitAndTileSkinId(skinId: number): void {
            if (skinId !== getSelfUnitAndTileSkinId()) {
                getData().selfUnitAndTileSkinId = skinId;
                Notify.dispatch(Notify.Type.CcrCreateSelfSkinIdChanged);
            }
        }
        export function tickSelfUnitAndTileSkinId(): void {
            setSelfUnitAndTileSkinId(getSelfUnitAndTileSkinId() % CommonConstants.UnitAndTileMaxSkinId + 1);
        }
        export function getSelfUnitAndTileSkinId(): number {
            return getData().selfUnitAndTileSkinId;
        }

        function resetAiSkinInfoArray(robotPlayerIndexArray: number[]): void {
            const infoArray = getAiSkinInfoArray();
            if (infoArray == null) {
                Logger.error(`CcrModel.resetAiSkinInfoArray() empty infoArray.`);
                return;
            }

            infoArray.length = 0;
            for (const playerIndex of robotPlayerIndexArray) {
                infoArray.push({
                    playerIndex,
                    unitAndTileSkinId   : playerIndex,
                });
            }
        }
        export function getAiSkinInfoArray(): ProtoTypes.NetMessage.MsgCcrCreateRoom.IAiSkinInfo[] {
            return getData().aiSkinInfoArray;
        }

        export function setHasFog(hasFog: boolean): void {
            getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
        }
        export function getHasFog(): boolean {
            return getWarRule().ruleForGlobalParams.hasFogByDefault;
        }

        export function setBootTimerParams(params: number[]): void {
            getData().settingsForCcw.bootTimerParams = params;
        }
        export function getBootTimerParams(): number[] {
            return getData().settingsForCcw.bootTimerParams;
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
            Notify.dispatch(Notify.Type.CcrCreateTeamIndexChanged);
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

        export function getBannedCoIdArray(playerIndex: number): number[] {
            return BwWarRuleHelper.getBannedCoIdArray(getWarRule(), playerIndex);
        }
        export function addBannedCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.addBannedCoId(getWarRule(), playerIndex, coId);
        }
        export function deleteBannedCoId(playerIndex: number, coId: number): void {
            BwWarRuleHelper.deleteBannedCoId(getWarRule(), playerIndex, coId);
        }
        export function setBannedCoIdArray(playerIndex: number, coIdSet: Set<number>): void {
            BwWarRuleHelper.setBannedCoIdArray(getWarRule(), playerIndex, coIdSet);
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
    // Functions for joining rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export namespace Join {
        let _targetRoomId: number;

        export function getFastJoinData(roomInfo: ICcrRoomInfo): DataForJoinRoom | null {
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
                Notify.dispatch(Notify.Type.CcrJoinTargetRoomIdChanged);
            }
        }
        export async function getTargetRoomInfo(): Promise<ICcrRoomInfo | null> {
            const roomId = getTargetRoomId();
            return roomId == null ? null : await getRoomInfo(roomId);
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
                Notify.dispatch(Notify.Type.CcrJoinedPreviewingRoomIdChanged);
            }
        }
    }

    function generateAvailablePlayerIndexList(info: ICcrRoomInfo): number[] {
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

    function generateAvailableSkinIdList(roomInfo: ICcrRoomInfo): number[] {
        const idList: number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (roomInfo.playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}
