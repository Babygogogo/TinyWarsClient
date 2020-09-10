
namespace TinyWars.SingleCustomWar {
    import Types                    = Utility.Types;
    import ProtoTypes               = Utility.ProtoTypes;
    import Logger                   = Utility.Logger;
    import BwHelpers                = BaseWar.BwHelpers;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForSinglePlayer = ProtoTypes.WarSettings.ISettingsForSinglePlayer;
    import IActionContainer         = ProtoTypes.WarAction.IActionContainer;
    import ISeedRandomState         = ProtoTypes.Structure.ISeedRandomState;

    export class ScwWar extends BaseWar.BwWar {
        private _settingsForSinglePlayer    : ISettingsForSinglePlayer;
        private _executedActions            : IActionContainer[];

        private _isEnded                    = false;

        public async init(data: ISerialWar): Promise<ScwWar | undefined> {
            if (!this._baseInit(data)) {
                Logger.error(`ScwWar.init() failed this._baseInit().`);
                return undefined;
            }

            const settingsForSinglePlayer = data.settingsForSinglePlayer;
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.init() empty settingsForSinglePlayer.`);
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

            const executedActionsCount  = data.executedActionsCount;
            const executedActions       = data.executedActions || [];
            if ((!settingsForSinglePlayer.isCheating) && (executedActionsCount !== executedActions.length)) {
                Logger.error(`ScwWar.init() nextActionId !== executedActions.length! nextActionId: ${executedActionsCount}`);
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

            const mapSizeAndMaxPlayerIndex = await BwHelpers.getMapSizeAndMaxPlayerIndex(data);
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error(`ScwWar.init() invalid war data! ${JSON.stringify(data)}`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`ScwWar.init() empty playerManager.`);
                return undefined;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`ScwWar.init() empty turnManager.`);
                return undefined;
            }

            const field = await (this.getField() || new (this._getFieldClass())()).init(dataForField, configVersion, mapSizeAndMaxPlayerIndex);
            if (field == null) {
                Logger.error(`ScwWar.init() empty field.`);
                return undefined;
            }

            this._setAllExecutedActions(executedActions);
            this._setSettingsForSinglePlayer(settingsForSinglePlayer);
            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);
            this._setField(field);

            this._initView();

            return this;
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

            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`ScwWar.serialize() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.serialize() empty settingsForSinglePlayer.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`ScwWar.serialize() empty executedActionsCount.`);
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

            return {
                settingsForCommon,
                settingsForSinglePlayer,

                warId                       : this.getWarId(),
                seedRandomInitialState,
                seedRandomCurrentState,
                executedActions             : isCheating ? [] : this._getAllExecutedActions(),
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public serializeForSimulation(): ISerialWar {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty settingsForSinglePlayer.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty executedActionsCount.`);
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

            return {
                settingsForCommon,
                settingsForSinglePlayer,

                warId                       : this.getWarId(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                executedActions             : [],
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        protected _getViewClass(): new () => ScwWarView {
            return ScwWarView;
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

        public setSaveSlotIndex(index: number): void {
            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar._setSaveSlotIndex() empty settingsForSinglePlayer.`);
                return undefined;
            }

            settingsForSinglePlayer.saveSlotIndex = index;
        }
        public getSaveSlotIndex(): number {
            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.getSaveSlotIndex() empty settingsForSinglePlayer.`);
                return undefined;
            }

            return settingsForSinglePlayer.saveSlotIndex;
        }

        public getWarType(): Types.SinglePlayerWarType {
            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.getWarType() empty settingsForSinglePlayer.`);
                return undefined;
            }

            return settingsForSinglePlayer.warType;
        }

        public setIsSinglePlayerCheating(isCheating: boolean): void {
            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.setIsSinglePlayerCheating() empty settingsForSinglePlayer.`);
                return undefined;
            }

            settingsForSinglePlayer.isCheating = isCheating;
        }
        public getIsSinglePlayerCheating(): boolean {
            const settingsForSinglePlayer = this.getSettingsForSinglePlayer();
            if (settingsForSinglePlayer == null) {
                Logger.error(`ScwWar.getIsSinglePlayerCheating() empty settingsForSinglePlayer.`);
                return undefined;
            }

            return settingsForSinglePlayer.isCheating;
        }

        private _setAllExecutedActions(actions: IActionContainer[]): void {
            this._executedActions = actions;
        }
        private _getAllExecutedActions(): IActionContainer[] | null {
            return this._executedActions;
        }
        public pushExecutedAction(action: IActionContainer): void {
            this._executedActions.push(action);
        }

        private _setSettingsForSinglePlayer(settings: ISettingsForSinglePlayer): void {
            this._settingsForSinglePlayer = settings;
        }
        public getSettingsForSinglePlayer(): ISettingsForSinglePlayer | null | undefined {
            return this._settingsForSinglePlayer;
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): ScwPlayer[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
