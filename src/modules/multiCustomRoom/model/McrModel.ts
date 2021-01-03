
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import BootTimerType    = Types.BootTimerType;
    import IMcrRoomInfo     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    import NetMessage       = ProtoTypes.NetMessage;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

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

            new Promise((resolve, reject) => {
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

        export function updateOnDeletePlayer(data: ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS): void {
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

                if ((playerDataList.length === BwSettingsHelper.getPlayersCount(roomInfo.settingsForCommon.warRule))    &&
                    (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                      &&
                    (selfPlayerData)                                                                                    &&
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

                const warRule = (await getMapRawData()).warRuleList.find(v => v.ruleAvailability.canMcw);
                await resetDataByPresetWarRuleId(warRule ? warRule.ruleId : null);
            }
            export function getData(): DataForCreateRoom {
                return _dataForCreateRoom;
            }
            export function getWarRule(): ProtoTypes.WarRule.IWarRule {
                return getData().settingsForCommon.warRule;
            }

            export function getMapId(): number {
                return getData().settingsForCommon.mapId;
            }
            function setMapId(mapId: number): void {
                getData().settingsForCommon.mapId = mapId;
            }

            function setConfigVersion(version: string): void {
                getData().settingsForCommon.configVersion = version;
            }

            async function resetDataByPresetWarRuleId(ruleId: number | null): Promise<void> {
                const mapRawData        = await getMapRawData();
                const settingsForCommon = getData().settingsForCommon;
                if (ruleId == null) {
                    settingsForCommon.warRule = BwSettingsHelper.createDefaultWarRule(ruleId, mapRawData.playersCountUnneutral);
                    setPresetWarRuleId(ruleId);
                    setSelfCoId(BwSettingsHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, getSelfPlayerIndex()));

                } else {
                    const warRule = mapRawData.warRuleList.find(warRule => warRule.ruleId === ruleId);
                    if (warRule == null) {
                        Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                        return undefined;
                    }

                    settingsForCommon.warRule = Helpers.deepClone(warRule);
                    setPresetWarRuleId(ruleId);
                    setSelfCoId(BwSettingsHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, getSelfPlayerIndex()));
                }
            }
            export function setPresetWarRuleId(ruleId: number | null | undefined): void {
                const settingsForCommon             = getData().settingsForCommon;
                settingsForCommon.warRule.ruleId    = ruleId;
                settingsForCommon.presetWarRuleId   = ruleId;
            }
            export function getPresetWarRuleId(): number | undefined {
                return getData().settingsForCommon.presetWarRuleId;
            }
            export async function tickPresetWarRuleId(): Promise<void> {
                const currWarRuleId = getPresetWarRuleId();
                const warRuleList   = (await getMapRawData()).warRuleList;
                if (currWarRuleId == null) {
                    const warRule = warRuleList.find(v => v.ruleAvailability.canMcw);
                    await resetDataByPresetWarRuleId(warRule ? warRule.ruleId : null);
                } else {
                    const warRuleIdList: number[] = [];
                    for (let ruleId = currWarRuleId + 1; ruleId < warRuleList.length; ++ ruleId) {
                        warRuleIdList.push(ruleId);
                    }
                    for (let ruleId = 0; ruleId < currWarRuleId; ++ruleId) {
                        warRuleIdList.push(ruleId);
                    }
                    for (const ruleId of warRuleIdList) {
                        if (warRuleList.find(v => v.ruleId === ruleId).ruleAvailability.canMcw) {
                            await resetDataByPresetWarRuleId(ruleId);
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

            function setSelfPlayerIndex(playerIndex: number): void {
                getData().selfPlayerIndex = playerIndex;
            }
            export async function tickSelfPlayerIndex(): Promise<void> {
                setSelfPlayerIndex(getSelfPlayerIndex() % BwSettingsHelper.getPlayersCount(getWarRule()) + 1);
            }
            export function getSelfPlayerIndex(): number {
                return getData().selfPlayerIndex;
            }

            export function setSelfCoId(coId: number): void {
                getData().selfCoId = coId;
            }
            export function getSelfCoId(): number | null {
                return getData().selfCoId;
            }

            function setSelfUnitAndTileSkinId(skinId: number): void {
                getData().selfUnitAndTileSkinId = skinId;
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
                BwSettingsHelper.tickTeamIndex(getWarRule(), playerIndex);
            }
            export function getTeamIndex(playerIndex: number): number {
                return BwSettingsHelper.getTeamIndex(getWarRule(), playerIndex);
            }

            export function setInitialFund(playerIndex, fund: number): void {
                BwSettingsHelper.setInitialFund(getWarRule(), playerIndex, fund);
            }
            export function getInitialFund(playerIndex: number): number {
                return BwSettingsHelper.getInitialFund(getWarRule(), playerIndex);
            }

            export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
                BwSettingsHelper.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
            }
            export function getIncomeMultiplier(playerIndex: number): number {
                return BwSettingsHelper.getIncomeMultiplier(getWarRule(), playerIndex);
            }

            export function setInitialEnergyPercentage(playerIndex: number, percentage: number): void {
                BwSettingsHelper.setInitialEnergyPercentage(getWarRule(), playerIndex, percentage);
            }
            export function getInitialEnergyPercentage(playerIndex: number): number {
                return BwSettingsHelper.getInitialEnergyPercentage(getWarRule(), playerIndex);
            }

            export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
                BwSettingsHelper.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
            }
            export function getEnergyGrowthMultiplier(playerIndex: number): number {
                return BwSettingsHelper.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
            }

            export function getAvailableCoIdList(playerIndex: number): number[] {
                return BwSettingsHelper.getAvailableCoIdList(getWarRule(), playerIndex);
            }
            export function addAvailableCoId(playerIndex: number, coId: number): void {
                BwSettingsHelper.addAvailableCoId(getWarRule(), playerIndex, coId);
            }
            export function removeAvailableCoId(playerIndex: number, coId: number): void {
                BwSettingsHelper.removeAvailableCoId(getWarRule(), playerIndex, coId);
            }
            export function setAvailableCoIdList(playerIndex: number, coIdSet: Set<number>): void {
                BwSettingsHelper.setAvailableCoIdList(getWarRule(), playerIndex, coIdSet);
            }

            export function setLuckLowerLimit(playerIndex: number, limit: number): void {
                BwSettingsHelper.setLuckLowerLimit(getWarRule(), playerIndex, limit);
            }
            export function getLuckLowerLimit(playerIndex: number): number {
                return BwSettingsHelper.getLuckLowerLimit(getWarRule(), playerIndex);
            }

            export function setLuckUpperLimit(playerIndex: number, limit: number): void {
                BwSettingsHelper.setLuckUpperLimit(getWarRule(), playerIndex, limit);
            }
            export function getLuckUpperLimit(playerIndex: number): number {
                return BwSettingsHelper.getLuckUpperLimit(getWarRule(), playerIndex);
            }

            export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
                BwSettingsHelper.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
            }
            export function getMoveRangeModifier(playerIndex: number): number {
                return BwSettingsHelper.getMoveRangeModifier(getWarRule(), playerIndex);
            }

            export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
                BwSettingsHelper.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
            }
            export function getAttackPowerModifier(playerIndex: number): number {
                return BwSettingsHelper.getAttackPowerModifier(getWarRule(), playerIndex);
            }

            export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
                BwSettingsHelper.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
            }
            export function getVisionRangeModifier(playerIndex: number): number {
                return BwSettingsHelper.getVisionRangeModifier(getWarRule(), playerIndex);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for joining room.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export namespace Join {
            const _dataForJoinRoom: DataForJoinRoom = {
                roomId              : null,
                playerIndex         : null,
                coId                : null,
                isReady             : true,
                unitAndTileSkinId   : null,
            };
            const _availablePlayerIndexList : number[] = [];
            const _availableSkinIdList      : number[] = [];

            export function getData(): DataForJoinRoom {
                return _dataForJoinRoom;
            }
            export function getFastJoinData(roomInfo: IMcrRoomInfo): DataForJoinRoom | null {
                const playerIndex       = generateAvailablePlayerIndexList(roomInfo)[0];
                const unitAndTileSkinId = generateAvailableSkinIdList(roomInfo)[0];
                if ((playerIndex == null) || (unitAndTileSkinId == null)) {
                    return null;
                } else {
                    return {
                        roomId          : roomInfo.roomId,
                        isReady         : false,
                        coId            : BwSettingsHelper.getRandomCoIdWithSettingsForCommon(roomInfo.settingsForCommon, playerIndex),
                        playerIndex,
                        unitAndTileSkinId,
                    };
                }
            }

            export function getRoomId(): number {
                return getData().roomId;
            }
            function setRoomId(roomId: number): void {
                getData().roomId = roomId;
            }

            export async function getRoomInfo(): Promise<IMcrRoomInfo | null> {
                return await McrModel.getRoomInfo(getRoomId());
            }
            export async function getMapId(): Promise<number> {
                const info = await getRoomInfo();
                return info ? info.settingsForCommon.mapId : null;
            }
            export async function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
                return await WarMapModel.getRawData(await getMapId());
            }
            export async function getTeamIndex(): Promise<number> {
                return BwSettingsHelper.getPlayerRule((await McrModel.getRoomInfo(getRoomId())).settingsForCommon.warRule, getPlayerIndex()).teamIndex;
            }

            export function resetData(roomInfo: IMcrRoomInfo): void {
                const availablePlayerIndexList    = generateAvailablePlayerIndexList(roomInfo);
                const availableSkinIdList         = generateAvailableSkinIdList(roomInfo);
                const playerIndex                 = availablePlayerIndexList[0];
                setRoomId(roomInfo.roomId);
                setAvailablePlayerIndexList(availablePlayerIndexList);
                setAvailableSkinIdList(availableSkinIdList);
                setPlayerIndex(playerIndex);
                setUnitAndTileSkinId(availableSkinIdList[0]);
                setIsReady(true);
                setCoId(playerIndex == null
                    ? CommonConstants.CoEmptyId
                    : BwSettingsHelper.getRandomCoIdWithSettingsForCommon(roomInfo.settingsForCommon, playerIndex)
                );
            }
            export function clearData(): void {
                setCoId(null);
                setIsReady(true);
                setPlayerIndex(null);
                setRoomId(null);
                setUnitAndTileSkinId(null);
                setAvailablePlayerIndexList(null);
                setAvailableSkinIdList(null);
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
                    const playerIndex = list[(list.indexOf(getPlayerIndex()) + 1) % list.length];
                    setPlayerIndex(playerIndex);
                    setCoId(BwSettingsHelper.getRandomCoIdWithSettingsForCommon((await getRoomInfo()).settingsForCommon, playerIndex));
                }
            }
            export function getPlayerIndex(): number {
                return getData().playerIndex;
            }

            function setUnitAndTileSkinId(skinId: number): void {
                getData().unitAndTileSkinId = skinId;
            }
            export function tickUnitAndTileSkinId(): void {
                const list = getAvailableSkinIdList();
                setUnitAndTileSkinId(list[(list.indexOf(getUnitAndTileSkinId()) + 1) % list.length]);
            }
            export function getUnitAndTileSkinId(): number {
                return getData().unitAndTileSkinId;
            }

            export function setCoId(coId: number | null): void {
                getData().coId = coId;
            }
            export function getCoId(): number | null {
                return getData().coId;
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

            function setAvailableSkinIdList(list: number[]): void {
                _availableSkinIdList.length = 0;
                for (const skinId of list || []) {
                    _availableSkinIdList.push(skinId);
                }
            }
            export function getAvailableSkinIdList(): number[] {
                return _availableSkinIdList;
            }
        }
    }

    function generateAvailablePlayerIndexList(info: IMcrRoomInfo): number[] {
        const playersCount      = BwSettingsHelper.getPlayersCount(info.settingsForCommon.warRule);
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
