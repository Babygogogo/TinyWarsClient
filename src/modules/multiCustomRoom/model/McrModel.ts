
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
                        Notify.removeEventListener(Notify.Type.SMcrGetRoomInfo,         callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMcrGetRoomInfoFailed,   callbackOnFailed);

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
                        Notify.removeEventListener(Notify.Type.SMcrGetRoomInfo,         callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMcrGetRoomInfoFailed,   callbackOnFailed);

                        for (const cb of _roomInfoRequests.get(roomId)) {
                            cb(data);
                        }
                        _roomInfoRequests.delete(roomId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.SMcrGetRoomInfo,        callbackOnSucceed);
                Notify.addEventListener(Notify.Type.SMcrGetRoomInfoFailed,  callbackOnFailed);

                McrProxy.reqMcrGetRoomInfo(roomId);
            });

            return new Promise((resolve, reject) => {
                _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
            });
        }
        export function setRoomInfo(info: IMcrRoomInfo): void {
            _roomInfoDict.set(info.roomId, info);
        }
        export function removeRoomInfo(roomId: number): void {
            _roomInfoDict.delete(roomId);
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }

        export function setUnjoinedRoomInfoList(infoList: IMcrRoomInfo[]): void {
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating rooms.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export namespace Create {
            const _dataForCreateRoom: DataForCreateRoom = {
                settingsForCommon: {},
                settingsForMultiPlayer: {},

                selfCoId                : null,
                selfPlayerIndex         : null,
                selfUnitAndTileSkinId   : null,
            };

            export function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
                return WarMapModel.getRawData(getMapId());
            }

            export async function resetDataByMapId(mapId: number): Promise<void> {
                setMapId(mapId);
                setConfigVersion(Utility.ConfigManager.getLatestConfigVersion());
                setWarName("");
                setWarPassword("");
                setWarComment("");
                setSelfPlayerIndex(CommonConstants.WarFirstPlayerIndex);
                await resetDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
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

            export async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
                const warRule = (await getMapRawData()).warRuleList.find(warRule => warRule.ruleId === ruleId);
                if (warRule == null) {
                    Logger.error(`McwModel.resetDataByPresetWarRuleId() empty warRule.`);
                    return undefined;
                }

                const settingsForCommon     = getData().settingsForCommon;
                settingsForCommon.warRule   = Helpers.deepClone(warRule);
                setPresetWarRuleId(ruleId);
                setSelfCoId(BwSettingsHelper.getRandomCoId(settingsForCommon, getSelfPlayerIndex()));
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
                if (currWarRuleId == null) {
                    await resetDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
                } else {
                    await resetDataByPresetWarRuleId((currWarRuleId + 1) % (await getMapRawData()).warRuleList.length);
                }
            }

            export function setWarName(name: string): void {
                getData().settingsForMultiPlayer.warName = name;
            }
            export function getWarName(): string {
                return getData().settingsForMultiPlayer.warName;
            }

            export function setWarPassword(password: string): void {
                getData().settingsForMultiPlayer.warPassword = password;
            }
            export function getWarPassword(): string {
                return getData().settingsForMultiPlayer.warPassword;
            }

            export function setWarComment(comment: string): void {
                getData().settingsForMultiPlayer.warComment = comment;
            }
            export function getWarComment(): string {
                return getData().settingsForMultiPlayer.warComment;
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
                getData().settingsForMultiPlayer.bootTimerParams = params;
            }
            export function getBootTimerParams(): number[] {
                return getData().settingsForMultiPlayer.bootTimerParams;
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
            let _joinWarAvailablePlayerIndexList: number[];
            let _joinWarAvailableSkinIdList     : number[];

            export function getData(): DataForJoinRoom {
                return _dataForJoinRoom;
            }
            export async function getRoomInfo(): Promise<IMcrRoomInfo | null> {
                return await McrModel.getRoomInfo(getData().roomId);
            }
            export async function getMapId(): Promise<number> {
                const info = await getRoomInfo();
                return info ? info.settingsForCommon.mapId : null;
            }
            export async function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
                return await WarMapModel.getRawData(await getMapId());
            }
            export async function getTeamIndex(): Promise<number> {
                const data = getData();
                return BwSettingsHelper.getPlayerRule((await McrModel.getRoomInfo(data.roomId)).settingsForCommon.warRule, data.playerIndex).teamIndex;
            }

            export async function resetData(roomInfo: IMcrRoomInfo): Promise<void> {
                getData().roomId                    = roomInfo.roomId;
                _joinWarAvailablePlayerIndexList    = getAvailablePlayerIndexList(roomInfo);
                _joinWarAvailableSkinIdList         = getAvailableSkinIdList(roomInfo);
                const playerIndex                   = _joinWarAvailablePlayerIndexList[0];
                setPlayerIndex(playerIndex);
                setUnitAndTileSkinId(_joinWarAvailableSkinIdList[0]);
                setCoId(BwSettingsHelper.getRandomCoId(roomInfo.settingsForCommon, playerIndex));
                setIsReady(true);
            }

            function setPlayerIndex(playerIndex: number): void {
                getData().playerIndex = playerIndex;
            }
            export async function tickPlayerIndex(): Promise<void> {
                const list = _joinWarAvailablePlayerIndexList;
                if (list.length > 1) {
                    const playerIndex = list[(list.indexOf(getPlayerIndex()) + 1) % list.length];
                    setPlayerIndex(playerIndex);
                    setCoId(BwSettingsHelper.getRandomCoId((await getRoomInfo()).settingsForCommon, playerIndex));
                }
            }
            export function getPlayerIndex(): number {
                return _dataForJoinRoom.playerIndex;
            }

            function setUnitAndTileSkinId(skinId: number): void {
                getData().unitAndTileSkinId = skinId;
            }
            export function tickUnitAndTileSkinId(): void {
                const list = _joinWarAvailableSkinIdList;
                setUnitAndTileSkinId(list[(list.indexOf(getUnitAndTileSkinId()) + 1) % list.length]);
            }
            export function getUnitAndTileSkinId(): number {
                return getData().unitAndTileSkinId;
            }

            export function setCoId(coId: number | null): void {
                _dataForJoinRoom.coId = coId;
            }
            export function getCoId(): number | null {
                return _dataForJoinRoom.coId;
            }

            export function setIsReady(isReady: boolean): void {
                getData().isReady = isReady;
            }
            export function getIsReady(): boolean {
                return getData().isReady;
            }
        }
    }

    function getAvailablePlayerIndexList(info: IMcrRoomInfo): number[] {
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

    function getAvailableSkinIdList(roomInfo: IMcrRoomInfo): number[] {
        const idList: number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (roomInfo.playerDataList.every(v => v.unitAndTileSkinId !== skinId)) {
                idList.push(skinId);
            }
        }
        return idList;
    }
}
