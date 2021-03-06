
namespace TinyWars.SingleCustomWar {
    import Types            = Utility.Types;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ProtoTypes       = Utility.ProtoTypes;
    import Logger           = Utility.Logger;
    import BwHelpers        = BaseWar.BwHelpers;
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
                Logger.error(`ScwWar.init() empty settingsForScw.`);
                return undefined;
            }

            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`ScwWar.init() empty settingsForCommon! ${JSON.stringify(data)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`ScwWar.init() empty configVersion.`);
                return undefined;
            }

            const seedRandomInitialState = data.seedRandomInitialState;
            if ((!settingsForScw.isCheating) && (seedRandomInitialState == null)) {
                Logger.error(`ScwWar.init() empty seedRandomInitialState.`);
                return undefined;
            }

            const seedRandomCurrentState = data.seedRandomCurrentState || seedRandomInitialState;
            if (seedRandomCurrentState == null) {
                Logger.error(`ScwWar.init() empty seedRandomCurrentState.`);
                return undefined;
            }

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`ScwWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = data.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`ScwWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = data.field;
            if (dataForField == null) {
                Logger.error(`ScwWar.init() empty dataForField.`);
                return undefined;
            }

            const playerManagerError = this.getPlayerManager().init(dataForPlayerManager, configVersion);
            if (playerManagerError) {
                return playerManagerError;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`ScwWar.init() empty turnManager.`);
                return undefined;
            }

            const playersCountUnneutral = BwHelpers.getPlayersCountUnneutral(dataForPlayerManager);
            const fieldError = this.getField().init({
                data                : dataForField,
                configVersion,
                playersCountUnneutral,
            });
            if (fieldError) {
                return fieldError;
            }

            this._setRandomNumberGenerator(new Math.seedrandom("", { state: seedRandomCurrentState }));
            this._setSeedRandomInitialState(seedRandomInitialState);
            this._setSettingsForSinglePlayer(settingsForScw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serialize(): ISerialWar {
            const isCheating                = this.getIsSinglePlayerCheating();
            const seedRandomCurrentState    = this._getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`ScwWar.serialize() empty seedRandomCurrentState.`);
                return undefined;
            }

            const seedRandomInitialState = this._getSeedRandomInitialState();
            if ((!isCheating) && (seedRandomInitialState == null)) {
                Logger.error(`ScwWar.serialize() empty seedRandomInitialState.`);
                return undefined;
            }

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
                Logger.error(`ScwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serialize();
            if (serialWarEventManager == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForScw,

                warId                       : this.getWarId(),
                seedRandomInitialState,
                seedRandomCurrentState,
                executedActions             : this.getExecutedActionManager().getAllExecutedActions(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public serializeForSimulation(): ISerialWar {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForScw = this.getSettingsForScw();
            if (settingsForScw == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty settingsForScw.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (!(playerManager instanceof ScwPlayerManager)) {
                Logger.error(`ScwWar.serializeForSimulation() invalid playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (!(turnManager instanceof ScwTurnManager)) {
                Logger.error(`ScwWar.serializeForSimulation() invalid turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (!(field instanceof ScwField)) {
                Logger.error(`ScwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForScw,
                settingsForMcw              : null,
                settingsForMrw              : null,

                warId                       : this.getWarId(),
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

        public getIsNeedReplay(): boolean {
            return false;
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

        private _setSettingsForSinglePlayer(settings: ISettingsForScw): void {
            this._settingsForSinglePlayer = settings;
        }
        public getSettingsForScw(): ISettingsForScw | null | undefined {
            return this._settingsForSinglePlayer;
        }

        public getRandomNumber(): number | undefined {
            if (this.getIsSinglePlayerCheating()) {
                return Math.random();
            } else {
                const generator = this._getRandomNumberGenerator();
                if (generator == null) {
                    Logger.error(`ScwWar.getRandomNumber() empty generator.`);
                    return undefined;
                }
                return generator();
            }
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
