
namespace TinyWars.SingleCustomRoom {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;
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

    const MOVE_RANGE_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_MOVE_RANGE_MODIFIER = 0;

    const ATTACK_MODIFIERS        = [-30, -20, -10, 0, 10, 20, 30];
    const DEFAULT_ATTACK_MODIFIER = 0;

    const VISION_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_VISION_MODIFIER = 0;

    export type DataForCreateWar    = ProtoTypes.NetMessage.IC_ScrCreateWar;

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

            hasFog              : 0,
            initialFund         : 0,
            incomeModifier      : 0,
            initialEnergy       : 0,
            energyGrowthModifier: 0,
            moveRangeModifier   : 0,
            attackPowerModifier : 0,
            visionRangeModifier : 0,
            luckLowerLimit      : Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit,
            luckUpperLimit      : Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit,
        };

        let _saveSlotInfoList   : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[];

        export function init(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getCreateWarMapExtraData(): Promise<ProtoTypes.Map.IMapExtraData> {
            return WarMapModel.getExtraData(_dataForCreateWar.settingsForCommon.mapId);
        }
        export function getCreateWarMapRawData(): Promise<ProtoTypes.Map.IMapRawData> {
            return WarMapModel.getRawData(_dataForCreateWar.settingsForCommon.mapId);
        }

        export async function resetCreateWarData(mapId: number): Promise<void> {
            _dataForCreateWar.mapFileName       = mapId;
            _dataForCreateWar.configVersion     = Utility.ConfigManager.getNewestConfigVersion();
            _dataForCreateWar.playerInfoList    = await generateCreateWarPlayerInfoList(mapId);
            setCreateWarSaveSlotIndex(getAvailableSaveSlot(this.getSaveSlotInfoList()));
            setCreateWarHasFog(false);

            setCreateWarInitialFund(0);
            setCreateWarIncomeMultiplier(100);
            setCreateWarInitialEnergy(0);
            setCreateWarEnergyGrowthMultiplier(100);
            setCreateWarLuckLowerLimit(Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit);
            setCreateWarLuckUpperLimit(Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit);
            setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
        }
        export function getCreateWarData(): DataForCreateWar {
            return _dataForCreateWar;
        }

        export function setCreateWarSaveSlotIndex(slot: number): void {
            const settingsForSinglePlayer = _dataForCreateWar.settingsForSinglePlayer;
            if (settingsForSinglePlayer.saveSlotIndex !== slot) {
                settingsForSinglePlayer.saveSlotIndex = slot;
                Notify.dispatch(Notify.Type.ScrCreateWarSaveSlotChanged);
            }
        }
        export function getCreateWarSaveSlotIndex(): number {
            return _dataForCreateWar.settingsForSinglePlayer.saveSlotIndex;
        }

        export function tickCreateWarUserId(dataIndex: number): void {
            const data          = _dataForCreateWar.playerInfoList[dataIndex];
            const currUserId    = data.userId;
            data.userId         = currUserId ? null : User.UserModel.getSelfUserId();
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }
        export async function tickCreateWarTeamIndex(dataIndex: number): Promise<void> {
            const data          = _dataForCreateWar.playerInfoList[dataIndex];
            const currTeamIndex = data.teamIndex;
            data.teamIndex      = currTeamIndex < (await getCreateWarMapRawData()).playersCount ? currTeamIndex + 1 : 1;
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }
        export function setCreateWarCoId(dataIndex: number, coId: number | null): void {
            _dataForCreateWar.playerInfoList[dataIndex].coId = coId;
            Notify.dispatch(Notify.Type.ScrCreateWarPlayerInfoListChanged);
        }

        export function setCreateWarHasFog(hasFog: boolean): void {
            _dataForCreateWar.hasFog = hasFog ? 1 : 0;
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

        export function setCreateWarInitialFund(fund: number): void {
            _dataForCreateWar.initialFund = fund;
        }
        export function getCreateWarInitialFund(): number {
            return _dataForCreateWar.initialFund;
        }

        export function setCreateWarIncomeMultiplier(modifier: number): void {
            _dataForCreateWar.incomeModifier = modifier;
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

        export function setCreateWarEnergyGrowthMultiplier(modifier: number): void {
            _dataForCreateWar.energyGrowthModifier = modifier;
        }
        export function getCreateWarEnergyGrowthMultiplier(): number {
            return _dataForCreateWar.energyGrowthModifier;
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

        export function getCreateWarInvalidParamTips(): string | null{
            const warData           = getCreateWarData();
            const teamSet           = new Set<number>();
            for (const playerInfo of warData.playerInfoList) {
                teamSet.add(playerInfo.teamIndex);
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

    async function generateCreateWarPlayerInfoList(mapId: number): Promise<ProtoTypes.Structure.IWarPlayerInfo[]> {
        const playersCount  = (await WarMapModel.getRawData(mapId)).playersCount;
        const list          : ProtoTypes.Structure.IWarPlayerInfo[] = [{
            playerIndex : 1,
            userId      : User.UserModel.getSelfUserId(),
            teamIndex   : 1,
            coId        : null,
        }];
        for (let i = 2; i <= playersCount; ++i) {
            list.push({
                playerIndex : i,
                userId      : null,
                teamIndex   : i,
                coId        : null,
            });
        }
        return list;
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
