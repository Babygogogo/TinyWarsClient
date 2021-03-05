
namespace TinyWars.MultiRankWar {
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import BwHelpers        = BaseWar.BwHelpers;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMrw  = ProtoTypes.WarSettings.ISettingsForMrw;
    import CommonConstants  = Utility.CommonConstants;

    export class MrwWar extends MultiPlayerWar.MpwWar {
        private _settingsForMrw?: ISettingsForMrw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMrw = data.settingsForMrw;
            if (!settingsForMrw) {
                Logger.error(`MrwWar.init() invalid settingsForMrw! ${JSON.stringify(data)}`);
                return undefined;
            }

            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`MrwWar.init() empty settingsForCommon! ${JSON.stringify(data)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`MrwWar.init() empty configVersion.`);
                return undefined;
            }

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`MrwWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = data.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`MrwWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = data.field;
            if (dataForField == null) {
                Logger.error(`MrwWar.init() empty dataForField.`);
                return undefined;
            }

            const playersCountUnneutral = BwHelpers.getPlayersCountUnneutral(dataForPlayerManager);
            const playerManager = this.getPlayerManager().init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`MrwWar.init() empty playerManager.`);
                return undefined;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`MrwWar.init() empty turnManager.`);
                return undefined;
            }

            const fieldError = await this.getField().init({
                data                : dataForField,
                configVersion,
                playersCountUnneutral
            });
            if (fieldError) {
                return fieldError;
            }

            this._setSettingsForMrw(settingsForMrw);
            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForMrw = this.getSettingsForMrw();
            if (settingsForMrw == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty settingsForMrw.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager  == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`MrwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMrw              : null,
                settingsForMcw              : null,
                settingsForScw              : { isCheating: true },

                warId,
                seedRandomInitialState      : null,
                seedRandomCurrentState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.MrwFog
                : Types.WarType.MrwStd;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            const settingsForMrw = this.getSettingsForMrw();
            return settingsForMrw ? settingsForMrw.mapId : undefined;
        }

        private _setSettingsForMrw(settings: ISettingsForMrw): void {
            this._settingsForMrw = settings;
        }
        public getSettingsForMrw(): ISettingsForMrw | null | undefined {
            return this._settingsForMrw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue];
        }
    }
}
