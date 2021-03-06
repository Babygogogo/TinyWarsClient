
namespace TinyWars.MultiCustomWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMcw  = ProtoTypes.WarSettings.ISettingsForMcw;

    export class McwWar extends MultiPlayerWar.MpwWar {
        private _settingsForMcw?: ISettingsForMcw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMcw = data.settingsForMcw;
            if (settingsForMcw == null) {
                return ClientErrorCode.McwWarInit00;
            }

            this._setSettingsForMcw(settingsForMcw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`McwWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`McwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.serializeForSimulation() empty settingsForMcw.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`McwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
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
                ? Types.WarType.McwFog
                : Types.WarType.McwStd;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            const settingsForMcw = this.getSettingsForMcw();
            return settingsForMcw ? settingsForMcw.mapId : undefined;
        }

        private _setSettingsForMcw(settings: ISettingsForMcw): void {
            this._settingsForMcw = settings;
        }
        public getSettingsForMcw(): ISettingsForMcw | null | undefined {
            return this._settingsForMcw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarName() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warName;
        }
        public getWarPassword(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarPassword() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warPassword;
        }
        public getWarComment(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarComment() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getSettingsBootTimerParams() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.bootTimerParams;
        }
    }
}
