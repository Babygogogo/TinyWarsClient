
namespace TinyWars.SingleCustomRoom.ScrModel {
    import Lang                 = Utility.Lang;
    import ProtoTypes           = Utility.ProtoTypes;
    import Notify               = Utility.Notify;
    import ConfigManager        = Utility.ConfigManager;
    import CommonConstants      = Utility.CommonConstants;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import WarMapModel          = WarMap.WarMapModel;
    import BwWarRuleHelper      = BaseWar.BwWarRuleHelper;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;
    import IDataForPlayerInRoom = ProtoTypes.Structure.IDataForPlayerInRoom;

    export type DataForCreateWar = ProtoTypes.NetMessage.MsgScrCreateWar.IC;

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for creating wars.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export namespace Create {
        const _dataForCreateWar: DataForCreateWar = {
            slotIndex           : 0,
            settingsForCommon   : {
                configVersion   : Utility.ConfigManager.getLatestFormalVersion(),
            },
            settingsForScw: {
                mapId           : undefined,
            },

            playerInfoList  : [],
        };

        export function getMapBriefData(): Promise<ProtoTypes.Map.IMapBriefData> {
            return WarMapModel.getBriefData(getData().settingsForScw.mapId);
        }
        export function getMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
            return WarMapModel.getRawData(getData().settingsForScw.mapId);
        }

        export function getPlayerRule(playerIndex: number): IDataForPlayerRule {
            return BwWarRuleHelper.getPlayerRule(getData().settingsForCommon.warRule, playerIndex);
        }
        export function getPlayerInfo(playerIndex: number): IDataForPlayerInRoom {
            return getData().playerInfoList.find(v => v.playerIndex === playerIndex);
        }

        export async function resetDataByMapId(mapId: number): Promise<void> {
            getData().settingsForScw.mapId = mapId;
            setConfigVersion(Utility.ConfigManager.getLatestFormalVersion());
            await resetDataByPresetWarRuleId(CommonConstants.WarRuleFirstId);
            setSaveSlotIndex(SaveSlot.getAvailableIndex());
        }
        export function getData(): DataForCreateWar {
            return _dataForCreateWar;
        }

        function setConfigVersion(version: string): void {
            getData().settingsForCommon.configVersion = version;
        }

        export async function resetDataByPresetWarRuleId(ruleId: number): Promise<void> {
            const warRule = (await getMapRawData()).warRuleArray.find(warRule => warRule.ruleId === ruleId);
            if (warRule == null) {
                Logger.error(`ScwModel.resetDataByPresetWarRuleId() empty warRule.`);
                return undefined;
            }

            getData().settingsForCommon.warRule = Helpers.deepClone(warRule);
            setPresetWarRuleId(ruleId);

            await resetPlayerInfoList();
        }
        function setPresetWarRuleId(ruleId: number | null | undefined): void {
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
                await resetDataByPresetWarRuleId((currWarRuleId + 1) % (await getMapRawData()).warRuleArray.length);
            }
        }

        async function resetPlayerInfoList(): Promise<void> {
            const playersCount      = (await getMapRawData()).playersCountUnneutral;
            const settingsForCommon = getData().settingsForCommon;
            const list              : ProtoTypes.Structure.IWarPlayerInfo[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                list.push({
                    playerIndex,
                    userId      : playerIndex === 1 ? User.UserModel.getSelfUserId() : null,
                    coId        : BwWarRuleHelper.getRandomCoIdWithSettingsForCommon(settingsForCommon, playerIndex),
                });
            }

            getData().playerInfoList = list;
        }

        export function setSaveSlotIndex(slotIndex: number): void {
            const data = getData();
            if (data.slotIndex !== slotIndex) {
                data.slotIndex = slotIndex;
                Notify.dispatch(Notify.Type.ScrCreateWarSaveSlotChanged);
            }
        }
        export function getSaveSlotIndex(): number {
            return getData().slotIndex;
        }

        export function tickUserId(playerIndex: number): void {
            const playerInfo    = getPlayerInfo(playerIndex);
            playerInfo.userId   = playerInfo.userId ? null : User.UserModel.getSelfUserId();
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function getTeamIndex(playerIndex: number): number {
            return getPlayerRule(playerIndex).teamIndex;
        }
        export function tickTeamIndex(playerIndex: number): void {
            setPresetWarRuleId(null);

            const playerRule        = getPlayerRule(playerIndex);
            playerRule.teamIndex    = playerRule.teamIndex % (BwWarRuleHelper.getPlayersCount(getData().settingsForCommon.warRule)) + 1;

            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function setCoId(playerIndex: number, coId: number): void {
            const bannedCoIdArray = getPlayerRule(playerIndex).bannedCoIdArray;
            if ((bannedCoIdArray) && (bannedCoIdArray.indexOf(coId) >= 0)) {
                setPresetWarRuleId(null);
                Helpers.deleteElementFromArray(bannedCoIdArray, coId);
            }

            getPlayerInfo(playerIndex).coId = coId;
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function getHasFog(): boolean {
            return getData().settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
        }
        export function setHasFog(hasFog: boolean): void {
            setPresetWarRuleId(null);

            getData().settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault = hasFog;
        }
        export function setPrevHasFog(): void {
            setHasFog(!getHasFog());
        }
        export function setNextHasFog(): void {
            setHasFog(!getHasFog());
        }

        export function setInitialFund(playerIndex: number, initialFund: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).initialFund = initialFund;
        }
        export function getInitialFund(playerIndex: number): number {
            return getPlayerRule(playerIndex).initialFund;
        }

        export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).incomeMultiplier = multiplier;
        }
        export function getIncomeMultiplier(playerIndex: number): number {
            return getPlayerRule(playerIndex).incomeMultiplier;
        }

        export function setInitialEnergyPercentage(playerIndex: number, percentage: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).initialEnergyPercentage = percentage;
        }
        export function getInitialEnergyPercentage(playerIndex: number): number {
            return getPlayerRule(playerIndex).initialEnergyPercentage;
        }

        export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).energyGrowthMultiplier = multiplier;
        }
        export function getEnergyGrowthMultiplier(playerIndex: number): number {
            return getPlayerRule(playerIndex).energyGrowthMultiplier;
        }

        export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).moveRangeModifier = modifier;
        }
        export function getMoveRangeModifier(playerIndex: number): number {
            return getPlayerRule(playerIndex).moveRangeModifier;
        }

        export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).attackPowerModifier = modifier;
        }
        export function getAttackPowerModifier(playerIndex: number): number {
            return getPlayerRule(playerIndex).attackPowerModifier;
        }

        export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).visionRangeModifier = modifier;
        }
        export function getVisionRangeModifier(playerIndex: number): number {
            return getPlayerRule(playerIndex).visionRangeModifier;
        }

        export function setLuckLowerLimit(playerIndex: number, limit: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).luckLowerLimit = limit;
        }
        export function getLuckLowerLimit(playerIndex: number): number {
            return getPlayerRule(playerIndex).luckLowerLimit;
        }

        export function setLuckUpperLimit(playerIndex: number, limit: number): void {
            setPresetWarRuleId(null);

            getPlayerRule(playerIndex).luckUpperLimit = limit;
        }
        export function getLuckUpperLimit(playerIndex: number): number {
            return getPlayerRule(playerIndex).luckUpperLimit;
        }

        export function getInvalidParamTips(): string | null{
            const teamSet = new Set<number>();
            for (const playerRule of getData().settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray) {
                teamSet.add(playerRule.teamIndex);
            }
            if (teamSet.size <= 1) {
                return Lang.getText(Lang.Type.A0069);
            }

            return null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for save slots.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export namespace SaveSlot {
        let _infoArray  : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[];

        export function setInfoArray(infoArray: ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[]): void {
            _infoArray = infoArray;
        }
        export function getInfoArray(): ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[] | null {
            return _infoArray;
        }
        export function deleteInfo(slotIndex: number): void {
            const infoArray = getInfoArray();
            if (infoArray) {
                for (let i = 0; i < infoArray.length; ++i) {
                    if (infoArray[i].slotIndex === slotIndex) {
                        infoArray.splice(i, 1);
                        return;
                    }
                }
            }
        }
        export function checkIsEmpty(slotIndex: number): boolean {
            const infoArray = getInfoArray();
            if (!infoArray) {
                return true;
            } else {
                return infoArray.every(v => v.slotIndex !== slotIndex);
            }
        }

        export function getAvailableIndex(): number {
            for (let index = 0; index < CommonConstants.ScwSaveSlotMaxCount; ++index) {
                if (checkIsEmpty(index)) {
                    return index;
                }
            }
            return 0;
        }
    }
}
