
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsBwWar            from "./BwWar";
import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";

namespace TwnsBwCommonSettingManager {
    import ISettingsForCommon   = ProtoTypes.WarSettings.ISettingsForCommon;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                = TwnsBwWar.BwWar;

    export class BwCommonSettingManager {
        private _war?               : BwWar;
        private _settingsForCommon? : ISettingsForCommon;

        public async init({ settings, allWarEventIdArray, playersCountUnneutral }: {
            settings                : ISettingsForCommon | null | undefined;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
        }): Promise<ClientErrorCode> {
            if (settings == null) {
                return ClientErrorCode.BwCommonSettingManagerInit00;
            }

            const configVersion = settings.configVersion;
            if ((configVersion == null) || (!await ConfigManager.checkIsVersionValid(configVersion))) {
                return ClientErrorCode.BwCommonSettingManagerInit01;
            }

            const warRule = settings.warRule;
            if (warRule == null) {
                return ClientErrorCode.BwCommonSettingManagerInit02;
            }

            const errorCodeForWarRule = WarRuleHelpers.getErrorCodeForWarRule({
                rule                : warRule,
                allWarEventIdArray,
                configVersion,
                playersCountUnneutral,
            });
            if (errorCodeForWarRule) {
                return errorCodeForWarRule;
            }

            this._setSettingsForCommon(settings);

            return ClientErrorCode.NoError;
        }

        public serializeForCreateSfw(): ISettingsForCommon | undefined {
            return Helpers.deepClone(this.getSettingsForCommon());
        }
        public serializeForCreateMfr(): ISettingsForCommon | undefined {
            return this.serializeForCreateSfw();
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        protected _getWar(): BwWar | undefined {
            return this._war;
        }

        protected _setSettingsForCommon(settings: ISettingsForCommon): void {
            this._settingsForCommon = settings;
        }
        public getSettingsForCommon(): ISettingsForCommon {
            return Helpers.getDefined(this._settingsForCommon);
        }

        public getConfigVersion(): string {
            return Helpers.getExisted(this.getSettingsForCommon().configVersion);
        }
        public getSettingsHasFogByDefault(): boolean | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsHasFogByDefault() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsHasFogByDefault() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getHasFogByDefault(warRule);
        }
        public getSettingsIncomeMultiplier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsIncomeMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsIncomeMultiplier() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getIncomeMultiplier(warRule, playerIndex);
        }
        public getSettingsEnergyGrowthMultiplier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsEnergyGrowthMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsEnergyGrowthMultiplier() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getEnergyGrowthMultiplier(warRule, playerIndex);
        }
        public getSettingsAttackPowerModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsAttackPowerModifier() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsAttackPowerModifier() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getAttackPowerModifier(warRule, playerIndex);
        }
        public getSettingsMoveRangeModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsMoveRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsMoveRangeModifier() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getMoveRangeModifier(warRule, playerIndex);
        }
        public getSettingsVisionRangeModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsVisionRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsVisionRangeModifier() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getVisionRangeModifier(warRule, playerIndex);
        }
        public getSettingsInitialFund(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsInitialFund() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsInitialFund() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getInitialFund(warRule, playerIndex);
        }
        public getSettingsEnergyAddPctOnLoadCo(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsEnergyAddPctOnLoadCo() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsEnergyAddPctOnLoadCo() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getEnergyAddPctOnLoadCo(warRule, playerIndex);
        }
        public getSettingsLuckLowerLimit(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsLuckLowerLimit() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsLuckLowerLimit() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getLuckLowerLimit(warRule, playerIndex);
        }
        public getSettingsLuckUpperLimit(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getSettingsLuckUpperLimit() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getSettingsLuckUpperLimit() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getLuckUpperLimit(warRule, playerIndex);
        }
        public getTeamIndex(playerIndex: number): number | undefined | null {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwCommonSettingManager.getTeamIndex() empty settingsForCommon.`);
                return undefined;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                Logger.error(`BwCommonSettingManager.getTeamIndex() empty warRule.`);
                return undefined;
            }

            return WarRuleHelpers.getTeamIndex(warRule, playerIndex);
        }
    }
}

export default TwnsBwCommonSettingManager;
