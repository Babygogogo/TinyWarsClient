
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Helpers              from "../../tools/helpers/Helpers";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwCommonSettingManager {
    import ISettingsForCommon   = ProtoTypes.WarSettings.ISettingsForCommon;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    export class BwCommonSettingManager {
        private _war?               : TwnsBwWar.BwWar;
        private _settingsForCommon? : ISettingsForCommon;

        public async init({ settings, allWarEventIdArray, playersCountUnneutral }: {
            settings                : ISettingsForCommon;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
        }): Promise<void> {
            const configVersion = settings.configVersion;
            if ((configVersion == null)                                                                                                     ||
                (!await ConfigManager.checkIsVersionValid(configVersion))
            ) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwCommonSettingManager_Init_00);
            }

            const warRule = settings.warRule;
            if (warRule == null) {
                throw Helpers.newError(`Empty warRule.`, ClientErrorCode.BwCommonSettingManager_Init_01);
            }

            const errorCodeForWarRule = WarRuleHelpers.getErrorCodeForWarRule({
                rule                : warRule,
                allWarEventIdArray,
                configVersion,
                playersCountUnneutral,
            });
            if (errorCodeForWarRule) {
                throw Helpers.newError(`Invalid warRule.`, errorCodeForWarRule);
            }

            this._setSettingsForCommon(settings);
        }

        public serializeForCreateSfw(): ISettingsForCommon {
            return Helpers.deepClone(this.getSettingsForCommon());
        }
        public serializeForCreateMfr(): ISettingsForCommon {
            return this.serializeForCreateSfw();
        }

        public startRunning(war: TwnsBwWar.BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: TwnsBwWar.BwWar): void {
            this._war = war;
        }
        protected _getWar(): TwnsBwWar.BwWar {
            return Helpers.getExisted(this._war);
        }

        protected _setSettingsForCommon(settings: ISettingsForCommon): void {
            this._settingsForCommon = settings;
        }
        public getSettingsForCommon(): ISettingsForCommon {
            return Helpers.getExisted(this._settingsForCommon, ClientErrorCode.BwCommonSettingManager_GetSettingsForCommon_00);
        }
        public getWarRule(): ProtoTypes.WarRule.IWarRule {
            return Helpers.getExisted(this.getSettingsForCommon().warRule);
        }
        public getConfigVersion(): string {
            return Helpers.getExisted(this.getSettingsForCommon().configVersion);
        }

        public getSettingsHasFogByDefault(): boolean {
            return WarRuleHelpers.getHasFogByDefault(this.getWarRule());
        }
        public getSettingsIncomeMultiplier(playerIndex: number): number {
            return WarRuleHelpers.getIncomeMultiplier(this.getWarRule(), playerIndex);
        }
        public getSettingsEnergyGrowthMultiplier(playerIndex: number): number {
            return WarRuleHelpers.getEnergyGrowthMultiplier(this.getWarRule(), playerIndex);
        }
        public getSettingsAttackPowerModifier(playerIndex: number): number {
            return WarRuleHelpers.getAttackPowerModifier(this.getWarRule(), playerIndex);
        }
        public getSettingsMoveRangeModifier(playerIndex: number): number {
            return WarRuleHelpers.getMoveRangeModifier(this.getWarRule(), playerIndex);
        }
        public getSettingsVisionRangeModifier(playerIndex: number): number {
            return WarRuleHelpers.getVisionRangeModifier(this.getWarRule(), playerIndex);
        }
        public getSettingsInitialFund(playerIndex: number): number {
            return WarRuleHelpers.getInitialFund(this.getWarRule(), playerIndex);
        }
        public getSettingsEnergyAddPctOnLoadCo(playerIndex: number): number {
            return WarRuleHelpers.getEnergyAddPctOnLoadCo(this.getWarRule(), playerIndex);
        }
        public getSettingsLuckLowerLimit(playerIndex: number): number {
            return WarRuleHelpers.getLuckLowerLimit(this.getWarRule(), playerIndex);
        }
        public getSettingsLuckUpperLimit(playerIndex: number): number {
            return WarRuleHelpers.getLuckUpperLimit(this.getWarRule(), playerIndex);
        }
        public getTeamIndex(playerIndex: number): number {
            return WarRuleHelpers.getTeamIndex(Helpers.getExisted(this.getSettingsForCommon().warRule), playerIndex);
        }
    }
}

export default TwnsBwCommonSettingManager;
