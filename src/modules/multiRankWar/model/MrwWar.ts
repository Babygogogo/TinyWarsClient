
namespace TinyWars.MultiRankWar {
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ClientErrorCode  = Utility.ClientErrorCode;
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
            if (settingsForMrw == null) {
                return ClientErrorCode.MrwWarInit00;
            }

            this._setSettingsForMrw(settingsForMrw);

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
                seedRandomCurrentState      : null,
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
