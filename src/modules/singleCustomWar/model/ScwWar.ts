
namespace TinyWars.SingleCustomWar {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import BwHelpers            = BaseWar.BwHelpers;
    import BwSettingsHelper     = BaseWar.BwSettingsHelper;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForScw      = ProtoTypes.WarSettings.ISettingsForScw;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;

    export class ScwWar extends SinglePlayerWar.SpwWar {
        private _settingsForSinglePlayer    : ISettingsForScw;
        private _executedActions            : IWarActionContainer[];
        private _saveSlotIndex              : number;
        private _saveSlotComment            : string;

        private _isEnded                    = false;

        public async init(data: ISerialWar): Promise<ScwWar | undefined> {
            if (!this._baseInit(data)) {
                Logger.error(`ScwWar.init() failed this._baseInit().`);
                return undefined;
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

            const executedActionsCount  = data.executedActionsCount;
            const executedActions       = data.executedActions || [];
            if ((!settingsForScw.isCheating) && (executedActionsCount !== executedActions.length)) {
                Logger.error(`ScwWar.init() nextActionId !== executedActions.length! nextActionId: ${executedActionsCount}`);
                return undefined;
            }

            const seedRandomInitialState = data.seedRandomInitialState;
            if ((!settingsForScw.isCheating) && (seedRandomInitialState == null)) {
                Logger.error(`ScwWar.init() empty seedRandomInitialState.`);
                return undefined;
            }

            const seedRandomCurrentState = executedActionsCount === 0 ? seedRandomInitialState : data.seedRandomCurrentState;
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

            this._setRandomNumberGenerator(new Math.seedrandom("", { state: seedRandomCurrentState }));
            this._setSeedRandomInitialState(seedRandomInitialState);
            this._setAllExecutedActions(executedActions);
            this._setSettingsForSinglePlayer(settingsForScw);
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

            const settingsForScw = this.getSettingsForScw();
            if (settingsForScw == null) {
                Logger.error(`ScwWar.serialize() empty settingsForScw.`);
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
                executedActions             : isCheating ? [] : this._getAllExecutedActions(),
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                warEventManager             : serialWarEventManager,
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

            const settingsForScw = this.getSettingsForScw();
            if (settingsForScw == null) {
                Logger.error(`ScwWar.serializeForSimulation() empty settingsForScw.`);
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
                settingsForRmw              : null,
                settingsForWrw              : null,

                warId                       : this.getWarId(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                executedActions             : [],
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                warEventManager             : serialWarEventManager,
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
        protected _getWarEventManagerClass(): new () => ScwWarEventManager {
            return ScwWarEventManager;
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
            return Types.WarType.Scw;
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

        public setSettingsIncomeMultiplier(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsIncomeMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setIncomeMultiplier(warRule, playerIndex, value);
        }
        public setSettingsEnergyGrowthMultiplier(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsEnergyGrowthMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setEnergyGrowthMultiplier(warRule, playerIndex, value);
        }
        public setSettingsAttackPowerModifier(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsAttackPowerModifier() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setAttackPowerModifier(warRule, playerIndex, value);
        }
        public setSettingsMoveRangeModifier(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsMoveRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setMoveRangeModifier(warRule, playerIndex, value);
        }
        public setSettingsVisionRangeModifier(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsVisionRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setVisionRangeModifier(warRule, playerIndex, value);
        }
        public setSettingsInitialFund(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsInitialFund() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setInitialFund(warRule, playerIndex, value);
        }
        public setSettingsInitialEnergyPercentage(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsInitialEnergyPercentage() empty settingsForCommon.`);
                return undefined;
            }

            BwSettingsHelper.setInitialEnergyPercentage(warRule, playerIndex, value);
        }
        public setSettingsLuckLowerLimit(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsLuckLowerLimit() empty warRule.`);
                return undefined;
            }

            BwSettingsHelper.setLuckLowerLimit(warRule, playerIndex, value);
        }
        public setSettingsLuckUpperLimit(playerIndex: number, value: number): void {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.setSettingsLuckUpperLimit() empty warRule.`);
                return undefined;
            }

            BwSettingsHelper.setLuckUpperLimit(warRule, playerIndex, value);
        }

        private _setAllExecutedActions(actions: IWarActionContainer[]): void {
            this._executedActions = actions;
        }
        private _getAllExecutedActions(): IWarActionContainer[] | null {
            return this._executedActions;
        }
        public addExecutedAction(action: IWarActionContainer): void {
            const executedActions = this._getAllExecutedActions();
            if (executedActions == null) {
                Logger.error(`ScwWar.addExecutedAction() empty executedActions.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount !== executedActions.length) {
                Logger.error(`ScwWar.addExecutedAction() invalid executedActionsCount!`);
                return undefined;
            }
            if (executedActionsCount !== action.actionId) {
                Logger.error(`ScwWar.addExecutedAction() invalid actionId!`);
                return undefined;
            }

            executedActions.push(Helpers.deepClone(action));
            this.setExecutedActionsCount(executedActionsCount + 1);
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
        public getHumanPlayers(): ScwPlayer[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
