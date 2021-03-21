
namespace TinyWars.SingleCustomWar {
    import Types            = Utility.Types;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ProtoTypes       = Utility.ProtoTypes;
    import Logger           = Utility.Logger;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForScw  = ProtoTypes.WarSettings.ISettingsForScw;

    export class ScwWar extends SinglePlayerWar.SpwWar {
        private _settingsForSinglePlayer    : ISettingsForScw;
        private _saveSlotIndex              : number;
        private _saveSlotComment            : string;

        private _isEnded                    = false;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForScw = data.settingsForScw;
            if (settingsForScw == null) {
                return ClientErrorCode.ScwWarInit00;
            }

            this._setSettingsForScw(settingsForScw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serialize(): ISerialWar {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`ScwWar.serialize() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForScw = this.getSettingsForScw();
            if (settingsForScw == null) {
                Logger.error(`ScwWar.serialize() empty settingsForScw.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (!(playerManager instanceof ScwPlayerManager)) {
                Logger.error(`ScwWar.serialize() invalid playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (!(turnManager instanceof ScwTurnManager)) {
                Logger.error(`ScwWar.serialize() invalid turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (!(field instanceof ScwField)) {
                Logger.error(`ScwWar.serialize() empty field.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`ScwWar.serialize() empty warEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serialize();
            if (serialPlayerManager == null) {
                Logger.error(`ScwWar.serialize() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serialize();
            if (serialTurnManager == null) {
                Logger.error(`ScwWar.serialize() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serialize();
            if (serialField == null) {
                Logger.error(`ScwWar.serialize() empty serialField.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serialize();
            if (serialWarEventManager == null) {
                Logger.error(`ScwWar.serialize() empty serialWarEventManager.`);
                return undefined;
            }

            const randomNumberManager = this.getRandomNumberManager();
            return {
                settingsForCommon,
                settingsForScw,

                warId                       : this.getWarId(),
                seedRandomInitialState      : randomNumberManager.getSeedRandomInitialState(),
                seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentState(),
                executedActions             : this.getExecutedActionManager().getAllExecutedActions(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public getIsNeedReplay(): boolean {
            return false;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return ScwWarMenuPanel.getIsOpening();
        }
        protected _getFieldClass(): new () => ScwField {
            return ScwField;
        }
        protected _getPlayerManagerClass(): new () => ScwPlayerManager {
            return ScwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => ScwTurnManager {
            return ScwTurnManager;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public setSaveSlotIndex(slotIndex: number): void {
            this._saveSlotIndex = slotIndex;
        }
        public getSaveSlotIndex(): number {
            return this._saveSlotIndex;
        }

        public setSaveSlotComment(comment: string | null | undefined): void {
            this._saveSlotComment = comment;
        }
        public getSaveSlotComment(): string | null | undefined {
            return this._saveSlotComment;
        }

        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.ScwFog
                : Types.WarType.ScwStd;
        }

        public getMapId(): number | undefined {
            const settingsForScw = this.getSettingsForScw();
            return settingsForScw ? settingsForScw.mapId : undefined;
        }

        public setIsSinglePlayerCheating(isCheating: boolean): void {
            const settingsForSinglePlayer = this.getSettingsForScw();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.setIsSinglePlayerCheating() empty settingsForSinglePlayer.`);
                return undefined;
            }

            settingsForSinglePlayer.isCheating = isCheating;
        }
        public getIsSinglePlayerCheating(): boolean {
            const settingsForSinglePlayer = this.getSettingsForScw();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.getIsSinglePlayerCheating() empty settingsForSinglePlayer.`);
                return undefined;
            }

            return settingsForSinglePlayer.isCheating;
        }

        private _setSettingsForScw(settings: ISettingsForScw): void {
            this._settingsForSinglePlayer = settings;
        }
        public getSettingsForScw(): ISettingsForScw | null | undefined {
            return this._settingsForSinglePlayer;
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): BaseWar.BwPlayer[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
