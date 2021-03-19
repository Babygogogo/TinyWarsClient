
namespace TinyWars.MultiFreeWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMfw  = ProtoTypes.WarSettings.ISettingsForMfw;

    export class MfwWar extends MultiPlayerWar.MpwWar {
        private _settingsForMfw?: ISettingsForMfw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMfw = data.settingsForMfw;
            if (settingsForMfw == null) {
                return ClientErrorCode.MfwWarInit00;
            }

            this._setSettingsForMfw(settingsForMfw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty settingsForMfw.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`MfwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
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
                ? Types.WarType.MfwFog
                : Types.WarType.MfwStd;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            return undefined
        }

        private _setSettingsForMfw(settings: ISettingsForMfw): void {
            this._settingsForMfw = settings;
        }
        public getSettingsForMfw(): ISettingsForMfw | null | undefined {
            return this._settingsForMfw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarName() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warName;
        }
        public getWarPassword(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarPassword() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warPassword;
        }
        public getWarComment(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarComment() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getSettingsBootTimerParams() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.bootTimerParams;
        }
    }
}
