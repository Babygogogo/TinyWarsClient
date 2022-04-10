
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ISettingsForCommon   = CommonProto.WarSettings.ISettingsForCommon;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import GameConfig           = Config.GameConfig;

    export class BwCommonSettingManager {
        private _war?               : BwWar;
        private _settingsForCommon? : ISettingsForCommon;

        public init({ settings, allWarEventIdArray, playersCountUnneutral, gameConfig }: {
            settings                : ISettingsForCommon;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
            gameConfig              : GameConfig;
        }): void {
            const configVersion = settings.configVersion;
            if (configVersion !== gameConfig.getVersion()) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwCommonSettingManager_Init_00);
            }

            const errorCodeForWarRule = WarRuleHelpers.getErrorCodeForWarRule({
                rule                : Helpers.getExisted(settings.warRule, ClientErrorCode.BwCommonSettingManager_Init_01),
                allWarEventIdArray,
                gameConfig,
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

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        protected _getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }

        protected _setSettingsForCommon(settings: ISettingsForCommon): void {
            this._settingsForCommon = settings;
        }
        public getSettingsForCommon(): ISettingsForCommon {
            return Helpers.getExisted(this._settingsForCommon, ClientErrorCode.BwCommonSettingManager_GetSettingsForCommon_00);
        }
        public getTurnsLimit(): number {
            return this.getSettingsForCommon().turnsLimit ?? CommonConstants.WarMaxTurnsLimit;
        }
        public getWarRule(): CommonProto.WarRule.IWarRule {
            return Helpers.getExisted(this.getSettingsForCommon().warRule);
        }

        public getSettingsHasFogByDefault(): boolean {
            return WarRuleHelpers.getHasFogByDefault(this.getWarRule());
        }
        public getSettingsDefaultWeatherType(): Types.WeatherType {
            return WarRuleHelpers.getDefaultWeatherType(this.getWarRule());
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

// export default TwnsBwCommonSettingManager;
