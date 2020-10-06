
namespace TinyWars.SingleCustomRoom {
    import Types                    = Utility.Types;
    import Lang                     = Utility.Lang;
    import ProtoTypes               = Utility.ProtoTypes;
    import Notify                   = Utility.Notify;
    import ConfigManager            = Utility.ConfigManager;
    import Logger                   = Utility.Logger;
    import Helpers                  = Utility.Helpers;
    import WarMapModel              = WarMap.WarMapModel;
    import BwSettingsHelper         = BaseWar.BwSettingsHelper;
    import IC_ScrCreateWar          = ProtoTypes.NetMessage.IC_ScrCreateWar;
    import IDataForPlayerRule       = ProtoTypes.WarRule.IDataForPlayerRule;
    import IWarPlayerInitialInfo    = ProtoTypes.Structure.IWarPlayerInitialInfo;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

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

    export type DataForCreateWar  = IC_ScrCreateWar;

    export namespace ScrModel {
        const _dataForCreateWar: DataForCreateWar = {
            settingsForCommon: {
                mapId           : undefined,
                configVersion   : Utility.ConfigManager.getNewestConfigVersion(),
            },
            settingsForSinglePlayer: {
                saveSlotIndex   : 0,
            },

            playerInfoList  : [],
        };

        let _saveSlotInfoList   : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[];

        export function init(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getCreateWarMapExtraData(): Promise<ProtoTypes.Map.IMapExtraData> {
            return WarMapModel.getExtraData(getCreateWarData().settingsForCommon.mapId);
        }
        export function getCreateWarMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
            return WarMapModel.getRawData(getCreateWarData().settingsForCommon.mapId);
        }

        export function getCreateWarPlayerRule(playerIndex: number): IDataForPlayerRule {
            return BwSettingsHelper.getPlayerRule(getCreateWarData().settingsForCommon.warRule, playerIndex);
        }
        export function getCreateWarPlayerInfo(playerIndex: number): IWarPlayerInitialInfo {
            return getCreateWarData().playerInfoList.find(v => v.playerIndex === playerIndex);
        }

        export async function resetCreateWarDataByMapId(mapId: number): Promise<void> {
            getCreateWarData().settingsForCommon.mapId = mapId;
            setCreateWarConfigVersion(Utility.ConfigManager.getNewestConfigVersion());
            await resetCreateWarDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
            setCreateWarSaveSlotIndex(getAvailableSaveSlot(getSaveSlotInfoList()));
        }
        export function getCreateWarData(): DataForCreateWar {
            return _dataForCreateWar;
        }

        function setCreateWarConfigVersion(version: string): void {
            getCreateWarData().settingsForCommon.configVersion = version;
        }

        export async function resetCreateWarDataByPresetWarRuleId(ruleId: number): Promise<void> {
            const warRule = (await getCreateWarMapRawData()).warRuleList.find(warRule => warRule.ruleId === ruleId);
            if (warRule == null) {
                Logger.error(`ScwModel.setCreateWarPresetWarRuleId() empty warRule.`);
                return undefined;
            }

            getCreateWarData().settingsForCommon.warRule = Helpers.deepClone(warRule);
            setCreateWarPresetWarRuleId(ruleId);

            await resetCreateWarPlayerInfoList();
        }
        function setCreateWarPresetWarRuleId(ruleId: number | null | undefined): void {
            const settingsForCommon             = getCreateWarData().settingsForCommon;
            settingsForCommon.warRule.ruleId    = ruleId;
            settingsForCommon.presetWarRuleId   = ruleId;
        }
        export function getCreateWarPresetWarRuleId(): number | undefined {
            return getCreateWarData().settingsForCommon.presetWarRuleId;
        }
        export async function tickCreateWarPresetWarRuleId(): Promise<void> {
            const currWarRuleId = getCreateWarPresetWarRuleId();
            if (currWarRuleId == null) {
                await resetCreateWarDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
            } else {
                await resetCreateWarDataByPresetWarRuleId((currWarRuleId + 1) % (await getCreateWarMapRawData()).warRuleList.length);
            }
        }

        async function resetCreateWarPlayerInfoList(): Promise<void> {
            const playersCount      = (await getCreateWarMapRawData()).playersCount;
            const settingsForCommon = getCreateWarData().settingsForCommon;
            const list              : ProtoTypes.Structure.IWarPlayerInfo[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                list.push({
                    playerIndex,
                    userId      : playerIndex === 1 ? User.UserModel.getSelfUserId() : null,
                    coId        : BwSettingsHelper.getRandomCoId(settingsForCommon, playerIndex),
                });
            }

            getCreateWarData().playerInfoList = list;
        }

        export function setCreateWarSaveSlotIndex(slot: number): void {
            const settingsForSinglePlayer = getCreateWarData().settingsForSinglePlayer;
            if (settingsForSinglePlayer.saveSlotIndex !== slot) {
                settingsForSinglePlayer.saveSlotIndex = slot;
                Notify.dispatch(Notify.Type.ScrCreateWarSaveSlotChanged);
            }
        }
        export function getCreateWarSaveSlotIndex(): number {
            return getCreateWarData().settingsForSinglePlayer.saveSlotIndex;
        }

        export function tickCreateWarUserId(playerIndex: number): void {
            const playerInfo    = getCreateWarPlayerInfo(playerIndex);
            playerInfo.userId   = playerInfo.userId ? null : User.UserModel.getSelfUserId();
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function getCreateWarTeamIndex(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).teamIndex;
        }
        export function tickCreateWarTeamIndex(playerIndex: number): void {
            setCreateWarPresetWarRuleId(null);

            const playerRule        = getCreateWarPlayerRule(playerIndex);
            playerRule.teamIndex    = playerRule.teamIndex % (BwSettingsHelper.getPlayersCount(getCreateWarData().settingsForCommon.warRule)) + 1;

            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function setCreateWarCoId(playerIndex: number, coId: number): void {
            const availableCoIdList = getCreateWarPlayerRule(playerIndex).availableCoIdList;
            if (availableCoIdList.indexOf(coId) < 0) {
                setCreateWarPresetWarRuleId(null);
                availableCoIdList.push(coId);
            }

            getCreateWarPlayerInfo(playerIndex).coId = coId;
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function getCreateWarHasFog(): boolean {
            return getCreateWarData().settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
        }
        export function setCreateWarHasFog(hasFog: boolean): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarData().settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault = hasFog;
        }
        export function setCreateWarPrevHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function setCreateWarNextHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }

        export function setCreateWarInitialFund(playerIndex: number, initialFund: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).initialFund = initialFund;
        }
        export function getCreateWarInitialFund(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).initialFund;
        }

        export function setCreateWarIncomeMultiplier(playerIndex: number, multiplier: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).incomeMultiplier = multiplier;
        }
        export function getCreateWarIncomeMultiplier(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).incomeMultiplier;
        }

        export function setCreateWarInitialEnergyPercentage(playerIndex: number, percentage: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).initialEnergyPercentage = percentage;
        }
        export function getCreateWarInitialEnergyPercentage(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).initialEnergyPercentage;
        }

        export function setCreateWarEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).energyGrowthMultiplier = multiplier;
        }
        export function getCreateWarEnergyGrowthMultiplier(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).energyGrowthMultiplier;
        }

        export function setCreateWarMoveRangeModifier(playerIndex: number, modifier: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).moveRangeModifier = modifier;
        }
        export function getCreateWarMoveRangeModifier(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).moveRangeModifier;
        }

        export function setCreateWarAttackPowerModifier(playerIndex: number, modifier: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).attackPowerModifier = modifier;
        }
        export function getCreateWarAttackPowerModifier(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).attackPowerModifier;
        }

        export function setCreateWarVisionRangeModifier(playerIndex: number, modifier: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).visionRangeModifier = modifier;
        }
        export function getCreateWarVisionRangeModifier(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).visionRangeModifier;
        }

        export function setCreateWarLuckLowerLimit(playerIndex: number, limit: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).luckLowerLimit = limit;
        }
        export function getCreateWarLuckLowerLimit(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).luckLowerLimit;
        }

        export function setCreateWarLuckUpperLimit(playerIndex: number, limit: number): void {
            setCreateWarPresetWarRuleId(null);

            getCreateWarPlayerRule(playerIndex).luckUpperLimit = limit;
        }
        export function getCreateWarLuckUpperLimit(playerIndex: number): number {
            return getCreateWarPlayerRule(playerIndex).luckUpperLimit;
        }

        export function getCreateWarInvalidParamTips(): string | null{
            const teamSet = new Set<number>();
            for (const playerRule of getCreateWarData().settingsForCommon.warRule.ruleForPlayers.playerRuleDataList) {
                teamSet.add(playerRule.teamIndex);
            }
            if (teamSet.size <= 1) {
                return Lang.getText(Lang.Type.A0069);
            }

            return null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for save slots.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setSaveSlotInfoList(infoList: ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[]): void {
            _saveSlotInfoList = infoList;
        }
        export function getSaveSlotInfoList(): ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[] | null {
            return _saveSlotInfoList;
        }
        export function checkIsSaveSlotEmpty(slotIndex: number): boolean {
            if (!_saveSlotInfoList) {
                return true;
            } else {
                return _saveSlotInfoList.every(v => v.saveSlotIndex !== slotIndex);
            }
        }
    }

    function getAvailableSaveSlot(infoList: ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[] | null): number {
        if (!infoList) {
            return 0;
        } else {
            for (let i = 0; i < CommonConstants.ScwSaveSlotMaxCount; ++i) {
                if (infoList.every(info => info.saveSlotIndex !== i)) {
                    return i;
                }
            }
            return 0;
        }
    }
}
