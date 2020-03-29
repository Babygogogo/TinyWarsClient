
namespace TinyWars.MultiCustomRoom {
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import WarMapModel  = WarMap.WarMapModel;

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

    const TIME_LIMITS = [
        60 * 15,            // 15 min
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];
    const DEFAULT_TIME_LIMIT = TIME_LIMITS[3];

    const MOVE_RANGE_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_MOVE_RANGE_MODIFIER = 0;

    const ATTACK_MODIFIERS        = [-30, -20, -10, 0, 10, 20, 30];
    const DEFAULT_ATTACK_MODIFIER = 0;

    const VISION_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_VISION_MODIFIER = 0;

    export type DataForCreateWar    = ProtoTypes.IC_McrCreateWar;
    export type DataForJoinWar      = ProtoTypes.IC_McrJoinWar;

    export namespace McrModel {
        const _dataForCreateWar: DataForCreateWar = {
            mapFileName     : "",
            warName         : "",
            warPassword     : "",
            warComment      : "",
            configVersion   : ConfigManager.getNewestConfigVersion(),

            warRuleIndex    : null,
            playerIndex     : 0,
            teamIndex       : 0,
            coId            : null,

            hasFog              : 0,
            timeLimit           : 0,
            initialFund         : 0,
            incomeModifier      : 0,
            initialEnergy       : 0,
            energyGrowthModifier: 0,
            moveRangeModifier   : 0,
            attackPowerModifier : 0,
            visionRangeModifier : 0,
            bannedCoIdList      : [],
            luckLowerLimit      : ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit,
            luckUpperLimit      : ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit,
        };

        const _dataForJoinWar: DataForJoinWar = {
            infoId      : null,
            playerIndex : null,
            teamIndex   : null,
            coId        : null,
        };
        let _joinWarAvailablePlayerIndexes  : number[];
        let _joinWarAvailableTeamIndexes    : number[];
        let _joinWarRoomInfo                : ProtoTypes.IMcrWaitingInfo;

        let _unjoinedWaitingInfos   : ProtoTypes.IMcrWaitingInfo[];
        let _joinedWaitingInfos     : ProtoTypes.IMcrWaitingInfo[];
        let _joinedOngoingInfos     : ProtoTypes.IMcwOngoingDetail[];

        let _replayInfos: ProtoTypes.IMcwReplayInfo[];
        let _replayData : ProtoTypes.S_McrGetReplayData;

        let _unwatchedWarInfos      : ProtoTypes.IMcwWatchInfo[];
        let _watchOngoingWarInfos   : ProtoTypes.IMcwWatchInfo[];
        let _watchRequestedWarInfos : ProtoTypes.IMcwWatchInfo[];
        let _watchedWarInfos        : ProtoTypes.IMcwWatchInfo[];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getCreateWarMapExtraData(): Promise<ProtoTypes.IMapExtraData> {
            return WarMapModel.getExtraData(getCreateWarMapFileName());
        }
        export function getCreateWarMapRawData(): Promise<ProtoTypes.IMapRawData> {
            return WarMapModel.getMapRawData(getCreateWarMapFileName());
        }
        export function getCreateWarMapFileName(): string {
            return _dataForCreateWar.mapFileName;
        }

        export async function resetCreateWarData(mapFileName: string): Promise<void> {
            const mapRawData                        = await WarMapModel.getMapRawData(mapFileName);
            _dataForCreateWar.mapFileName           = mapFileName;
            _dataForCreateWar.configVersion         = ConfigManager.getNewestConfigVersion();
            _dataForCreateWar.bannedCoIdList.length = 0;
            setCreateWarName("");
            setCreateWarPassword("");
            setCreateWarComment("");
            setCreateWarWarRuleIndex(mapRawData.warRuleList ? 0 : null);
            await resetCreateWarDataForSelectedRule();
        }
        export function getCreateWarData(): DataForCreateWar {
            return _dataForCreateWar;
        }
        export async function resetCreateWarDataForSelectedRule(): Promise<void> {
            const warRuleIndex      = getCreateWarWarRuleIndex();
            const dataForCreateWar  = getCreateWarData();
            if (warRuleIndex == null) {
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
                setCreateWarPlayerIndex(1);
                setCreateWarTeamIndex(1);
                setCreateWarCoId(getRandomCoId(dataForCreateWar.configVersion, dataForCreateWar.bannedCoIdList));
                setCreateWarHasFog(false);

                setCreateWarInitialFund(0);
                setCreateWarIncomeMultiplier(100);
                setCreateWarInitialEnergy(0);
                setCreateWarEnergyGrowthMultiplier(100);
                setCreateWarLuckLowerLimit(ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit);
                setCreateWarLuckUpperLimit(ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit);
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const mapFileName   = getCreateWarMapFileName();
                const playerIndex   = 1;
                const warRule       = (await WarMapModel.getMapRawData(mapFileName)).warRuleList[warRuleIndex];
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
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
            _dataForCreateWar.warName = name;
        }
        export function getCreateWarName(): string {
            return _dataForCreateWar.warName;
        }

        export function setCreateWarPassword(password: string): void {
            _dataForCreateWar.warPassword = password;
        }
        export function getCreateWarPassword(): string {
            return _dataForCreateWar.warPassword;
        }

        export function setCreateWarComment(comment: string): void {
            _dataForCreateWar.warComment = comment;
        }
        export function getCreateWarComment(): string {
            return _dataForCreateWar.warComment;
        }

        export function setCreateWarWarRuleIndex(index: number): void {
            _dataForCreateWar.warRuleIndex = index;
        }
        export function getCreateWarWarRuleIndex(): number | null {
            return _dataForCreateWar.warRuleIndex;
        }

        export function setCreateWarPlayerIndex(index: number): void {
            _dataForCreateWar.playerIndex = index;
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
            return _dataForCreateWar.playerIndex;
        }

        export function setCreateWarTeamIndex(index: number): void {
            _dataForCreateWar.teamIndex = index;
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
            return _dataForCreateWar.teamIndex;
        }

        export function setCreateWarCoId(coId: number | null): void {
            _dataForCreateWar.coId = coId;
        }
        export function getCreateWarCoId(): number | null {
            return _dataForCreateWar.coId;
        }

        export function setCreateWarHasFog(has: boolean): void {
            _dataForCreateWar.hasFog = has ? 1 : 0;
        }
        export function setCreateWarPrevHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function setCreateWarNextHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function getCreateWarHasFog(): boolean {
            return !!_dataForCreateWar.hasFog;
        }

        export function setCreateWarTimeLimit(limit: number): void {
            _dataForCreateWar.timeLimit = limit;
        }
        export function setCreateWarPrevTimeLimit(): void {
            const currLimit = getCreateWarTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index - 1;
                setCreateWarTimeLimit(newIndex >= 0 ? TIME_LIMITS[newIndex] : TIME_LIMITS[TIME_LIMITS.length - 1]);
            }
        }
        export function setCreateWarNextTimeLimit(): void {
            const currLimit = getCreateWarTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index + 1;
                setCreateWarTimeLimit(newIndex < TIME_LIMITS.length ? TIME_LIMITS[newIndex] : TIME_LIMITS[0]);
            }
        }
        export function getCreateWarTimeLimit(): number {
            return _dataForCreateWar.timeLimit;
        }

        export function setCreateWarInitialFund(fund: number): void {
            _dataForCreateWar.initialFund = fund;
        }
        export function getCreateWarInitialFund(): number {
            return _dataForCreateWar.initialFund;
        }

        export function setCreateWarIncomeMultiplier(multiplier: number): void {
            _dataForCreateWar.incomeModifier = multiplier;
        }
        export function getCreateWarIncomeMultiplier(): number {
            return _dataForCreateWar.incomeModifier;
        }

        export function setCreateWarInitialEnergy(energy: number): void {
            _dataForCreateWar.initialEnergy = energy;
        }
        export function getCreateWarInitialEnergy(): number {
            return _dataForCreateWar.initialEnergy;
        }

        export function setCreateWarEnergyGrowthMultiplier(multiplier: number): void {
            _dataForCreateWar.energyGrowthModifier = multiplier;
        }
        export function getCreateWarEnergyGrowthMultiplier(): number {
            return _dataForCreateWar.energyGrowthModifier;
        }

        export function getCreateWarBannedCoIdList(): number[] {
            return _dataForCreateWar.bannedCoIdList;
        }
        export function addCreateWarBannedCoId(coId: number): void {
            const list = _dataForCreateWar.bannedCoIdList;
            (list.indexOf(coId) < 0) && (list.push(coId));
        }
        export function removeCreateWarBannedCoId(coId: number): void {
            const set = new Set<number>(_dataForCreateWar.bannedCoIdList);
            set.delete(coId);
            _dataForCreateWar.bannedCoIdList = Array.from(set);
        }

        export function setCreateWarLuckLowerLimit(limit: number): void {
            _dataForCreateWar.luckLowerLimit = limit;
        }
        export function getCreateWarLuckLowerLimit(): number {
            return _dataForCreateWar.luckLowerLimit;
        }

        export function setCreateWarLuckUpperLimit(limit: number): void {
            _dataForCreateWar.luckUpperLimit = limit;
        }
        export function getCreateWarLuckUpperLimit(): number {
            return _dataForCreateWar.luckUpperLimit;
        }

        export function setCreateWarMoveRangeModifier(modifier: number): void {
            _dataForCreateWar.moveRangeModifier = modifier;
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
            return _dataForCreateWar.moveRangeModifier;
        }

        export function setCreateWarAttackPowerModifier(modifier: number): void {
            _dataForCreateWar.attackPowerModifier = modifier;
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
            return _dataForCreateWar.attackPowerModifier;
        }

        export function setCreateWarVisionRangeModifier(modifier: number): void {
            _dataForCreateWar.visionRangeModifier = modifier;
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
            return _dataForCreateWar.visionRangeModifier;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for joining wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setUnjoinedWaitingInfos(infos: ProtoTypes.IMcrWaitingInfo[]): void {
            _unjoinedWaitingInfos = infos;
        }
        export function getUnjoinedWaitingInfos(): ProtoTypes.IMcrWaitingInfo[] {
            return _unjoinedWaitingInfos;
        }

        export function getJoinWarRoomInfo(): ProtoTypes.IMcrWaitingInfo {
            return _joinWarRoomInfo;
        }
        export function getJoinWarMapFileName(): string {
            return getJoinWarRoomInfo().mapFileName;
        }
        export function getJoinWarMapExtraData(): Promise<ProtoTypes.IMapExtraData> {
            return WarMapModel.getExtraData(getJoinWarMapFileName());
        }
        export function getJoinWarMapRawData(): Promise<ProtoTypes.IMapRawData> {
            return WarMapModel.getMapRawData(getJoinWarMapFileName());
        }
        export function getJoinWarWarRuleIndex(): number | null {
            return _joinWarRoomInfo.warRuleIndex;
        }

        export async function resetJoinWarData(info: ProtoTypes.IMcrWaitingInfo): Promise<void> {
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
                setJoinWarTeamIndex((await WarMapModel.getPlayerRule(getJoinWarMapFileName(), warRuleIndex, getJoinWarPlayerIndex())).teamIndex);
            }
        }
        export function getJoinWarData(): DataForJoinWar {
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
        export function setJoinedWaitingInfos(infos: ProtoTypes.IMcrWaitingInfo[]): void {
            _joinedWaitingInfos = infos;
        }
        export function getJoinedWaitingInfos(): ProtoTypes.IMcrWaitingInfo[] {
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
        export function setUnwatchedWarInfos(infos: ProtoTypes.IMcwWatchInfo[]): void {
            _unwatchedWarInfos = infos;
        }
        export function getUnwatchedWarInfos(): ProtoTypes.IMcwWatchInfo[] | null {
            return _unwatchedWarInfos;
        }

        export function setWatchOngoingWarInfos(infos: ProtoTypes.IMcwWatchInfo[]): void {
            _watchOngoingWarInfos = infos;
        }
        export function getWatchOngoingWarInfos(): ProtoTypes.IMcwWatchInfo[] | null {
            return _watchOngoingWarInfos;
        }

        export function setWatchRequestedWarInfos(infos: ProtoTypes.IMcwWatchInfo[]): void {
            _watchRequestedWarInfos = infos;
        }
        export function getWatchRequestedWarInfos(): ProtoTypes.IMcwWatchInfo[] | null {
            return _watchRequestedWarInfos;
        }

        export function setWatchedWarInfos(infos: ProtoTypes.IMcwWatchInfo[]): void {
            _watchedWarInfos = infos;
        }
        export function getWatchedWarInfos(): ProtoTypes.IMcwWatchInfo[] | null {
            return _watchedWarInfos;
        }
    }

    function getRandomCoId(configVersion: string, bannedCoIdList: number[] | null): number | undefined {
        let highestTier         : number = null;
        let candidateCoIdList   : number[] = [];
        for (const cfg of ConfigManager.getAvailableCoList(configVersion)) {
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

    async function getAvailablePlayerIndexes(info: ProtoTypes.IMcrWaitingInfo): Promise<number[]> {
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

    async function getAvailableTeamIndexes(info: ProtoTypes.IMcrWaitingInfo): Promise<number[]> {
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
