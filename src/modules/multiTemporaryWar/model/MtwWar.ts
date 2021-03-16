
namespace TinyWars.MultiTemporaryWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMtw  = ProtoTypes.WarSettings.ISettingsForMtw;

    export class MtwWar extends MultiPlayerWar.MpwWar {
        private _settingsForMtw?: ISettingsForMtw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMtw = data.settingsForMtw;
            if (settingsForMtw == null) {
                return ClientErrorCode.MtwWarInit00;
            }

            this._setSettingsForMtw(settingsForMtw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForMtw = this.getSettingsForMtw();
            if (settingsForMtw == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty settingsForMtw.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`MtwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMtw              : null,
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
                ? Types.WarType.MtwFog
                : Types.WarType.MtwStd;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            return undefined
        }

        private _setSettingsForMtw(settings: ISettingsForMtw): void {
            this._settingsForMtw = settings;
        }
        public getSettingsForMtw(): ISettingsForMtw | null | undefined {
            return this._settingsForMtw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMtw = this.getSettingsForMtw();
            if (settingsForMtw == null) {
                Logger.error(`MtwWar.getWarName() empty settingsForMtw.`);
                return undefined;
            }

            return settingsForMtw.warName;
        }
        public getWarPassword(): string {
            const settingsForMtw = this.getSettingsForMtw();
            if (settingsForMtw == null) {
                Logger.error(`MtwWar.getWarPassword() empty settingsForMtw.`);
                return undefined;
            }

            return settingsForMtw.warPassword;
        }
        public getWarComment(): string {
            const settingsForMtw = this.getSettingsForMtw();
            if (settingsForMtw == null) {
                Logger.error(`MtwWar.getWarComment() empty settingsForMtw.`);
                return undefined;
            }

            return settingsForMtw.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMtw = this.getSettingsForMtw();
            if (settingsForMtw == null) {
                Logger.error(`MtwWar.getSettingsBootTimerParams() empty settingsForMtw.`);
                return undefined;
            }

            return settingsForMtw.bootTimerParams;
        }
    }
}
