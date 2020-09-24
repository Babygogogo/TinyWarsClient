
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;
    import BootTimerType    = Types.BootTimerType;
    import IMcwWatchInfo    = ProtoTypes.MultiCustomWar.IMcwWatchInfo;
    import IMcrRoomInfo     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export const MAX_INITIAL_FUND     = 1000000;
    export const MIN_INITIAL_FUND     = 0;
    export const DEFAULT_INITIAL_FUND = 0;

    export const MAX_INCOME_MODIFIER     = 1000;
    export const MIN_INCOME_MODIFIER     = 0;
    export const DEFAULT_INCOME_MODIFIER = 0;

    export const MAX_INITIAL_ENERGY     = 100;
    export const MIN_INITIAL_ENERGY     = 0;
    export const DEFAULT_INITIAL_ENERGY = 0;

    export const MAX_ENERGY_MODIFIER     = 1000;
    export const MIN_ENERGY_MODIFIER     = 0;
    export const DEFAULT_ENERGY_MODIFIER = 0;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];
    const DEFAULT_TIME_LIMIT = REGULAR_TIME_LIMITS[2];

    const MOVE_RANGE_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_MOVE_RANGE_MODIFIER = 0;

    const ATTACK_MODIFIERS        = [-30, -20, -10, 0, 10, 20, 30];
    const DEFAULT_ATTACK_MODIFIER = 0;

    const VISION_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_VISION_MODIFIER = 0;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.IC_McrCreateRoom;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.IC_McrJoinRoom;

    export namespace McrModel {
        const _dataForCreateRoom: DataForCreateRoom = {
            mapFileName     : "",
            warName         : "",
            warPassword     : "",
            warComment      : "",
            configVersion   : Utility.ConfigManager.getNewestConfigVersion(),

            warRuleIndex    : null,
            playerIndex     : 0,
            teamIndex       : 0,
            coId            : null,

            hasFog              : 0,
            bootTimerParams     : [BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue],
            initialFund         : 0,
            incomeModifier      : 0,
            initialEnergy       : 0,
            energyGrowthModifier: 0,
            moveRangeModifier   : 0,
            attackPowerModifier : 0,
            visionRangeModifier : 0,
            bannedCoIdList      : [],
            luckLowerLimit      : CommonConstants.WarRuleLuckDefaultLowerLimit,
            luckUpperLimit      : CommonConstants.WarRuleLuckDefaultUpperLimit,
        };

        const _dataForJoinWar: DataForJoinRoom = {
            infoId      : null,
            playerIndex : null,
            teamIndex   : null,
            coId        : null,
        };
        let _joinWarAvailablePlayerIndexes  : number[];
        let _joinWarAvailableTeamIndexes    : number[];
        let _joinWarRoomInfo                : IMcrRoomInfo;

        let _unjoinedWaitingInfos   : IMcrRoomInfo[];
        let _joinedWaitingInfos     : IMcrRoomInfo[];
        let _joinedOngoingInfos     : ProtoTypes.IMcwOngoingDetail[];

        let _replayInfos: ProtoTypes.MultiCustomWar.IMcwReplayInfo[];
        let _replayData : ProtoTypes.S_McrGetReplayData;

        let _unwatchedWarInfos      : IMcwWatchInfo[];
        let _watchOngoingWarInfos   : IMcwWatchInfo[];
        let _watchRequestedWarInfos : IMcwWatchInfo[];
        let _watchedWarInfos        : IMcwWatchInfo[];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getCreateWarMapExtraData(): Promise<ProtoTypes.Map.IMapExtraData> {
            return WarMapModel.getExtraData(getCreateRoomMapId());
        }
        export function getCreateWarMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
            return WarMapModel.getRawData(getCreateRoomMapId());
        }
        export function getCreateRoomMapId(): number {
            return _dataForCreateRoom.settingsForCommon.mapId;
        }

        export async function resetCreateWarData(mapFileName: string): Promise<void> {
            const mapRawData                        = await WarMapModel.getRawData(mapFileName);
            _dataForCreateRoom.mapFileName           = mapFileName;
            _dataForCreateRoom.configVersion         = Utility.ConfigManager.getNewestConfigVersion();
            _dataForCreateRoom.bannedCoIdList.length = 0;
            setCreateWarName("");
            setCreateWarPassword("");
            setCreateWarComment("");
            setCreateWarWarRuleIndex(mapRawData.warRuleList ? 0 : null);
            await resetCreateWarDataForSelectedRule();
        }
        export function getCreateWarData(): DataForCreateRoom {
            return _dataForCreateRoom;
        }
        export async function resetCreateWarDataForSelectedRule(): Promise<void> {
            const warRuleIndex      = getCreateWarWarRuleIndex();
            const dataForCreateWar  = getCreateWarData();
            if (warRuleIndex == null) {
                setCreateWarBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
                setCreateWarPlayerIndex(1);
                setCreateWarTeamIndex(1);
                setCreateWarCoId(getRandomCoId(dataForCreateWar.configVersion, dataForCreateWar.bannedCoIdList));
                setCreateWarHasFog(false);

                setCreateWarInitialFund(0);
                setCreateWarIncomeMultiplier(100);
                setCreateWarInitialEnergy(0);
                setCreateWarEnergyGrowthMultiplier(100);
                setCreateWarLuckLowerLimit(CommonConstants.WarRuleLuckDefaultLowerLimit);
                setCreateWarLuckUpperLimit(CommonConstants.WarRuleLuckDefaultUpperLimit);
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const mapFileName   = getCreateRoomMapId();
                const playerIndex   = 1;
                const warRule       = (await WarMapModel.getRawData(mapFileName)).warRuleList[warRuleIndex];
                setCreateWarBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
                setCreateWarPlayerIndex(playerIndex);
                setCreateWarTeamIndex((await WarMapModel.getPlayerRule(mapFileName, warRuleIndex, playerIndex)).teamIndex);
                setCreateWarCoId(getRandomCoId(dataForCreateWar.configVersion, dataForCreateWar.bannedCoIdList));
                setCreateWarHasFog(!!warRule.hasFog);

                setCreateWarInitialFund(warRule.initialFund);
                setCreateWarIncomeMultiplier(warRule.incomeModifier);
                setCreateWarInitialEnergy(warRule.initialEnergy);
                setCreateWarEnergyGrowthMultiplier(warRule.energyGrowthModifier);
                setCreateWarLuckLowerLimit(warRule.luckLowerLimit);
                setCreateWarLuckUpperLimit(warRule.luckUpperLimit);
                setCreateWarMoveRangeModifier(warRule.moveRangeModifier);
                setCreateWarAttackPowerModifier(warRule.attackPowerModifier);
                setCreateWarVisionRangeModifier(warRule.visionRangeModifier);
            }
        }

        export function setCreateWarName(name: string): void {
            _dataForCreateRoom.warName = name;
        }
        export function getCreateWarName(): string {
            return _dataForCreateRoom.warName;
        }

        export function setCreateWarPassword(password: string): void {
            _dataForCreateRoom.warPassword = password;
        }
        export function getCreateWarPassword(): string {
            return _dataForCreateRoom.warPassword;
        }

        export function setCreateWarComment(comment: string): void {
            _dataForCreateRoom.warComment = comment;
        }
        export function getCreateWarComment(): string {
            return _dataForCreateRoom.warComment;
        }

        export function setCreateWarWarRuleIndex(index: number): void {
            _dataForCreateRoom.warRuleIndex = index;
        }
        export function getCreateWarWarRuleIndex(): number | null {
            return _dataForCreateRoom.warRuleIndex;
        }

        export function setCreateWarPlayerIndex(index: number): void {
            _dataForCreateRoom.playerIndex = index;
        }
        export async function setCreateWarPrevPlayerIndex(): Promise<void> {
            const mapInfo   = await getCreateWarMapExtraData();
            const index     = getCreateWarPlayerIndex() - 1;
            setCreateWarPlayerIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export async function setCreateWarNextPlayerIndex(): Promise<void> {
            const mapInfo   = await getCreateWarMapExtraData();
            const index     = getCreateWarPlayerIndex() + 1;
            setCreateWarPlayerIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getCreateWarPlayerIndex(): number {
            return _dataForCreateRoom.playerIndex;
        }

        export function setCreateWarTeamIndex(index: number): void {
            _dataForCreateRoom.teamIndex = index;
        }
        export async function setCreateWarPrevTeamIndex(): Promise<void> {
            const mapInfo   = await getCreateWarMapExtraData();
            const index     = getCreateWarTeamIndex() - 1;
            setCreateWarTeamIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export async function setCreateWarNextTeamIndex(): Promise<void> {
            const mapInfo   = await getCreateWarMapExtraData();
            const index     = getCreateWarTeamIndex() + 1;
            setCreateWarTeamIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getCreateWarTeamIndex(): number {
            return _dataForCreateRoom.teamIndex;
        }

        export function setCreateWarCoId(coId: number | null): void {
            _dataForCreateRoom.coId = coId;
        }
        export function getCreateWarCoId(): number | null {
            return _dataForCreateRoom.coId;
        }

        export function setCreateWarHasFog(has: boolean): void {
            _dataForCreateRoom.hasFog = has ? 1 : 0;
        }
        export function setCreateWarPrevHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function setCreateWarNextHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function getCreateWarHasFog(): boolean {
            return !!_dataForCreateRoom.hasFog;
        }

        export function setCreateWarBootTimerParams(params: number[]): void {
            _dataForCreateRoom.bootTimerParams = params;
        }
        export function getCreateWarBootTimerParams(): number[] {
            return _dataForCreateRoom.bootTimerParams;
        }
        export function setCreateWarNextBootTimerType(): void {
            const params = getCreateWarBootTimerParams();
            if ((params) && (params[0] === BootTimerType.Regular)) {
                setCreateWarBootTimerParams([BootTimerType.Incremental, 60 * 15, 15]);
            } else {
                setCreateWarBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
            }
        }
        export function setCreateWarNextTimerRegularTime(): void {
            const params = getCreateWarBootTimerParams();
            if (params[0] !== BootTimerType.Regular) {
                setCreateWarNextBootTimerType();
            } else {
                const index = REGULAR_TIME_LIMITS.indexOf(params[1]);
                if (index < 0) {
                    setCreateWarNextBootTimerType();
                } else {
                    const newIndex  = index + 1;
                    params[1]       = newIndex < REGULAR_TIME_LIMITS.length ? REGULAR_TIME_LIMITS[newIndex] : REGULAR_TIME_LIMITS[0];
                }
            }
        }
        export function setCreateWarTimerIncrementalInitialTime(seconds: number): void {
            _dataForCreateRoom.bootTimerParams[1] = seconds;
        }
        export function setCreateWarTimerIncrementalIncrementalValue(seconds: number): void {
            _dataForCreateRoom.bootTimerParams[2] = seconds;
        }

        export function setCreateWarInitialFund(fund: number): void {
            _dataForCreateRoom.initialFund = fund;
        }
        export function getCreateWarInitialFund(): number {
            return _dataForCreateRoom.initialFund;
        }

        export function setCreateWarIncomeMultiplier(multiplier: number): void {
            _dataForCreateRoom.incomeModifier = multiplier;
        }
        export function getCreateWarIncomeMultiplier(): number {
            return _dataForCreateRoom.incomeModifier;
        }

        export function setCreateWarInitialEnergy(energy: number): void {
            _dataForCreateRoom.initialEnergy = energy;
        }
        export function getCreateWarInitialEnergy(): number {
            return _dataForCreateRoom.initialEnergy;
        }

        export function setCreateWarEnergyGrowthMultiplier(multiplier: number): void {
            _dataForCreateRoom.energyGrowthModifier = multiplier;
        }
        export function getCreateWarEnergyGrowthMultiplier(): number {
            return _dataForCreateRoom.energyGrowthModifier;
        }

        export function getCreateWarBannedCoIdList(): number[] {
            return _dataForCreateRoom.bannedCoIdList;
        }
        export function addCreateWarBannedCoId(coId: number): void {
            const list = _dataForCreateRoom.bannedCoIdList;
            (list.indexOf(coId) < 0) && (list.push(coId));
        }
        export function removeCreateWarBannedCoId(coId: number): void {
            const set = new Set<number>(_dataForCreateRoom.bannedCoIdList);
            set.delete(coId);
            _dataForCreateRoom.bannedCoIdList = Array.from(set);
        }

        export function setCreateWarLuckLowerLimit(limit: number): void {
            _dataForCreateRoom.luckLowerLimit = limit;
        }
        export function getCreateWarLuckLowerLimit(): number {
            return _dataForCreateRoom.luckLowerLimit;
        }

        export function setCreateWarLuckUpperLimit(limit: number): void {
            _dataForCreateRoom.luckUpperLimit = limit;
        }
        export function getCreateWarLuckUpperLimit(): number {
            return _dataForCreateRoom.luckUpperLimit;
        }

        export function setCreateWarMoveRangeModifier(modifier: number): void {
            _dataForCreateRoom.moveRangeModifier = modifier;
        }
        export function setCreateWarPrevMoveRangeModifier(): void {
            const currModifier = getCreateWarMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarMoveRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setCreateWarNextMoveRangeModifier(): void {
            const currModifier = getCreateWarMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarMoveRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarMoveRangeModifier(): number {
            return _dataForCreateRoom.moveRangeModifier;
        }

        export function setCreateWarAttackPowerModifier(modifier: number): void {
            _dataForCreateRoom.attackPowerModifier = modifier;
        }
        export function setCreateWarPrevAttackPowerModifier(): void {
            const currModifier = getCreateWarAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarAttackPowerModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setCreateWarNextAttackPowerModifier(): void {
            const currModifier = getCreateWarAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarAttackPowerModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarAttackPowerModifier(): number {
            return _dataForCreateRoom.attackPowerModifier;
        }

        export function setCreateWarVisionRangeModifier(modifier: number): void {
            _dataForCreateRoom.visionRangeModifier = modifier;
        }
        export function setCreateWarPrevVisionRangeModifier(): void {
            const currModifier = getCreateWarVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarVisionRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setNextVisionRangeModifier(): void {
            const currModifier = getCreateWarVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarVisionRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarVisionRangeModifier(): number {
            return _dataForCreateRoom.visionRangeModifier;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for joining wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setUnjoinedRoomList(infos: IMcrRoomInfo[]): void {
            _unjoinedWaitingInfos = infos;
        }
        export function getUnjoinedWaitingInfos(): IMcrRoomInfo[] {
            return _unjoinedWaitingInfos;
        }

        export function getJoinWarRoomInfo(): IMcrRoomInfo {
            return _joinWarRoomInfo;
        }
        export function getJoinWarMapId(): number {
            return getJoinWarRoomInfo().mapFileName;
        }
        export function getJoinWarMapExtraData(): Promise<ProtoTypes.IMapExtraData> {
            return WarMapModel.getExtraData(getJoinWarMapId());
        }
        export function getJoinWarMapRawData(): Promise<ProtoTypes.IMapRawData> {
            return WarMapModel.getRawData(getJoinWarMapId());
        }
        export function getJoinWarWarRuleIndex(): number | null {
            return _joinWarRoomInfo.warRuleIndex;
        }

        export async function resetJoinWarData(info: IMcrRoomInfo): Promise<void> {
            _joinWarRoomInfo                = info;
            _joinWarAvailablePlayerIndexes  = await getAvailablePlayerIndexes(info);
            _joinWarAvailableTeamIndexes    = await getAvailableTeamIndexes(info);
            _dataForJoinWar.infoId          = info.infoId;
            setJoinWarPlayerIndex(_joinWarAvailablePlayerIndexes[0]);
            setJoinWarCoId(getRandomCoId(info.configVersion, info.bannedCoIdList));

            const warRuleIndex = getJoinWarWarRuleIndex();
            if (warRuleIndex == null) {
                setJoinWarTeamIndex(_joinWarAvailableTeamIndexes[0]);
            } else {
                setJoinWarTeamIndex((await WarMapModel.getPlayerRule(getJoinWarMapId(), warRuleIndex, getJoinWarPlayerIndex())).teamIndex);
            }
        }
        export function getJoinWarData(): DataForJoinRoom {
            return _dataForJoinWar;
        }

        function setJoinWarPlayerIndex(playerIndex: number): void {
            _dataForJoinWar.playerIndex = playerIndex;
        }
        export function setJoinWarNextPlayerIndex(): void {
            const list = _joinWarAvailablePlayerIndexes;
            setJoinWarPlayerIndex(list[(list.indexOf(getJoinWarPlayerIndex()) + 1) % list.length]);
        }
        export function setJoinWarPrevPlayerIndex(): void {
            const list  = _joinWarAvailablePlayerIndexes;
            const index = list.indexOf(getJoinWarPlayerIndex()) - 1;
            setJoinWarPlayerIndex(list[index >= 0 ? index : list.length - 1]);
        }
        export function getJoinWarPlayerIndex(): number {
            return _dataForJoinWar.playerIndex;
        }

        export function setJoinWarTeamIndex(teamIndex: number): void {
            _dataForJoinWar.teamIndex = teamIndex;
        }
        export function setJoinWarNextTeamIndex(): void {
            const list = _joinWarAvailableTeamIndexes;
            setJoinWarTeamIndex(list[(list.indexOf(getJoinWarTeamIndex()) + 1) % list.length]);
        }
        export function setJoinWarPrevTeamIndex(): void {
            const list  = _joinWarAvailableTeamIndexes;
            const index = list.indexOf(getJoinWarTeamIndex()) - 1;
            setJoinWarTeamIndex(list[index >= 0 ? index : list.length - 1]);
        }
        export function getJoinWarTeamIndex(): number {
            return _dataForJoinWar.teamIndex;
        }

        export function setJoinWarCoId(coId: number | null): void {
            _dataForJoinWar.coId = coId;
        }
        export function getJoinWarCoId(): number | null {
            return _dataForJoinWar.coId;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for exiting joined waiting wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setJoinedRoomInfoList(infos: IMcrRoomInfo[]): void {
            _joinedWaitingInfos = infos;
        }
        export function getJoinedWaitingInfos(): IMcrRoomInfo[] {
            return _joinedWaitingInfos;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for continuing joined ongoing wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setJoinedOngoingInfos(infos: ProtoTypes.IMcwOngoingDetail[]): void {
            _joinedOngoingInfos = infos;
        }
        export function getJoinedOngoingInfos(): ProtoTypes.IMcwOngoingDetail[] | undefined {
            return _joinedOngoingInfos;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for replays.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setReplayInfos(infos: ProtoTypes.IMcwReplayInfo[]): void {
            _replayInfos = infos;
        }
        export function getReplayInfos(): ProtoTypes.IMcwReplayInfo[] | undefined {
            return _replayInfos;
        }

        export function setReplayData(data: ProtoTypes.S_McrGetReplayData): void {
            _replayData = data;
        }
        export function getReplayData(): ProtoTypes.S_McrGetReplayData | undefined {
            return _replayData;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for watch.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setUnwatchedWarInfos(infos: IMcwWatchInfo[]): void {
            _unwatchedWarInfos = infos;
        }
        export function getUnwatchedWarInfos(): IMcwWatchInfo[] | null {
            return _unwatchedWarInfos;
        }

        export function setWatchOngoingWarInfos(infos: IMcwWatchInfo[]): void {
            _watchOngoingWarInfos = infos;
        }
        export function getWatchOngoingWarInfos(): IMcwWatchInfo[] | null {
            return _watchOngoingWarInfos;
        }

        export function setWatchRequestedWarInfos(infos: IMcwWatchInfo[]): void {
            _watchRequestedWarInfos = infos;
        }
        export function getWatchRequestedWarInfos(): IMcwWatchInfo[] | null {
            return _watchRequestedWarInfos;
        }

        export function setWatchedWarInfos(infos: IMcwWatchInfo[]): void {
            _watchedWarInfos = infos;
        }
        export function getWatchedWarInfos(): IMcwWatchInfo[] | null {
            return _watchedWarInfos;
        }
    }

    function getRandomCoId(configVersion: string, bannedCoIdList: number[] | null): number | undefined {
        let highestTier         : number = null;
        let candidateCoIdList   : number[] = [];
        for (const cfg of Utility.ConfigManager.getAvailableCoList(configVersion)) {
            const coId = cfg.coId;
            if ((!bannedCoIdList) || (bannedCoIdList.indexOf(coId) < 0)) {
                const tier = cfg ? cfg.tier : null;
                if (tier >= 1) {
                    if ((highestTier > tier) || (highestTier == null)) {
                        highestTier         = tier;
                        candidateCoIdList   = [coId];
                    } else if (highestTier === tier) {
                        candidateCoIdList.push(coId);
                    }
                }
            }
        }
        return Utility.Helpers.pickRandomElement(candidateCoIdList);
    }

    async function getAvailablePlayerIndexes(info: IMcrRoomInfo): Promise<number[]> {
        const playersCount      = (await WarMapModel.getExtraData(info.mapFileName)).playersCount;
        const playerInfoList    = info.playerInfoList;
        const indexes           : number[] = [];
        for (let i = 1; i <= playersCount; ++i) {
            if (playerInfoList.every(v => v.playerIndex !== i)) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    async function getAvailableTeamIndexes(info: IMcrRoomInfo): Promise<number[]> {
        const dict: {[index: number]: number} = {};
        for (const playerInfo of info.playerInfoList) {
            const teamIndex = playerInfo.teamIndex;
            dict[teamIndex] = (dict[teamIndex] || 0) + 1;
        }

        let teamsCount  = 0;
        let currPlayers = 0;
        for (let i = 1; i <= 4; ++i) {
            if (dict[i]) {
                ++teamsCount;
                currPlayers += dict[i];
            }
        }

        const totalPlayers = (await WarMapModel.getExtraData(info.mapFileName)).playersCount;
        if ((teamsCount > 1) || (currPlayers < totalPlayers - 1)) {
            const indexes: number[] = [];
            for (let i = 1; i <= totalPlayers; ++i) {
                indexes.push(i);
            }
            while (dict[indexes[0]]) {
                indexes.push(indexes.shift());
            }
            return indexes;
        } else {
            const indexes: number[] = [];
            for (let i = 1; i <= totalPlayers; ++i) {
                if (!dict[i]) {
                    indexes.push(i);
                }
            }
            return indexes;
        }
    }
}
