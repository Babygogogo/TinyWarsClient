
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ISettingsForCommon = CommonProto.WarSettings.ISettingsForCommon;

    export class BwCommonSettingManager {
        private _war?               : BwWar;
        private _settingsForCommon? : ISettingsForCommon;

        public init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
            settings                : ISettingsForCommon;
            warType                 : Types.WarType;
            playersCountUnneutral   : number;
            gameConfig              : Config.GameConfig;
            mapSize                 : Types.MapSize;
        }): void {
            const configVersion = settings.configVersion;
            if (configVersion !== gameConfig.getVersion()) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwCommonSettingManager_Init_00);
            }

            const errorCodeForWarRule = WarHelpers.WarRuleHelpers.getErrorCodeForInstanceWarRule({
                instanceWarRule     : Helpers.getExisted(settings.instanceWarRule, ClientErrorCode.BwCommonSettingManager_Init_01),
                gameConfig,
                playersCountUnneutral,
                warType,
                mapSize,
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
        public getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
            return Helpers.getExisted(this.getSettingsForCommon().instanceWarRule);
        }

        public getSettingsHasFogByDefault(): boolean {
            return WarHelpers.WarRuleHelpers.getHasFogByDefault(this.getInstanceWarRule());
        }
        public getSettingsDefaultWeatherType(): Types.WeatherType {
            return WarHelpers.WarRuleHelpers.getDefaultWeatherType(this.getInstanceWarRule());
        }

        public getSettingsIncomeMultiplier(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getIncomeMultiplier(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsEnergyGrowthMultiplier(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getEnergyGrowthMultiplier(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsAttackPowerModifier(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getAttackPowerModifier(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsMoveRangeModifier(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getMoveRangeModifier(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsVisionRangeModifier(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getVisionRangeModifier(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsInitialFund(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getInitialFund(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsEnergyAddPctOnLoadCo(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getEnergyAddPctOnLoadCo(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsLuckLowerLimit(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getLuckLowerLimit(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsLuckUpperLimit(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getLuckUpperLimit(this.getInstanceWarRule(), playerIndex);
        }
        public getSettingsBannedUnitTypeArray(playerIndex: number): Types.UnitType[] | null {
            return WarHelpers.WarRuleHelpers.getBannedUnitTypeArray(this.getInstanceWarRule(), playerIndex);
        }
        public getTeamIndex(playerIndex: number): number {
            return WarHelpers.WarRuleHelpers.getTeamIndex(Helpers.getExisted(this.getSettingsForCommon().instanceWarRule), playerIndex);
        }
    }
}

// export default TwnsBwCommonSettingManager;
