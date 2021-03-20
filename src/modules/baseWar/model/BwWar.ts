
namespace TinyWars.BaseWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export abstract class BwWar {
        private _warId                      : number;

        private readonly _playerManager         = new (this._getPlayerManagerClass())();
        private readonly _turnManager           = new (this._getTurnManagerClass());
        private readonly _field                 = new (this._getFieldClass())();
        private readonly _commonSettingManager  = new (this._getCommonSettingManagerClass())();
        private readonly _warEventManager       = new (this._getWarEventManagerClass())();
        private readonly _executedActionManager = new BwExecutedActionManager();
        private readonly _randomNumberManager   = new BwRandomNumberManager();
        private readonly _drawVoteManager       = new BwDrawVoteManager();
        private readonly _view                  = new BwWarView();

        private _isRunning              = false;
        private _isExecutingAction      = false;

        public abstract init(data: ISerialWar): Promise<ClientErrorCode>;
        public abstract getWarType(): Types.WarType;
        public abstract getMapId(): number | undefined;
        public abstract getIsNeedReplay(): boolean;
        public abstract getIsWarMenuPanelOpening(): boolean;
        protected abstract _getPlayerManagerClass(): new () => BwPlayerManager;
        protected abstract _getTurnManagerClass(): new () => BwTurnManager;
        protected abstract _getFieldClass(): new () => BwField;

        protected async _baseInit(data: ISerialWar): Promise<ClientErrorCode> {
            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                return ClientErrorCode.BwWarBaseInit00;
            }

            const configVersion = settingsForCommon.configVersion;
            if ((configVersion == null) || (!await ConfigManager.checkIsVersionValid(configVersion))) {
                return ClientErrorCode.BwWarBaseInit01;
            }

            const drawVoteManagerError = this.getDrawVoteManager().init(data.playerManager, data.remainingVotesForDraw);
            if (drawVoteManagerError) {
                return drawVoteManagerError;
            }

            const dataForWarEventManager    = data.warEventManager;
            const commonSettingManagerError = await this.getCommonSettingManager().init({
                settings                : data.settingsForCommon,
                allWarEventIdArray      : WarEvent.WarEventHelper.getAllWarEventIdArray(dataForWarEventManager ? dataForWarEventManager.warEventFullData : undefined),
                playersCountUnneutral   : BwHelpers.getPlayersCountUnneutral(data.playerManager),
            });
            if (commonSettingManagerError) {
                return commonSettingManagerError;
            }

            const warEventManagerError = this.getWarEventManager().init(dataForWarEventManager);
            if (warEventManagerError) {
                return warEventManagerError;
            }

            const isNeedReplay              = this.getIsNeedReplay();
            const randomNumberManagerError  = this.getRandomNumberManager().init({
                isNeedReplay,
                initialState: data.seedRandomInitialState,
                currentState: data.seedRandomCurrentState,
            });
            if (randomNumberManagerError) {
                return randomNumberManagerError;
            }

            const executedActionManagerError = this.getExecutedActionManager().init(isNeedReplay, data.executedActions || []);
            if (executedActionManagerError) {
                return executedActionManagerError;
            }

            const playerManager         = this.getPlayerManager();
            const playerManagerError    = playerManager.init(data.playerManager, configVersion);
            if (playerManagerError) {
                return playerManagerError;
            }

            const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
            const turnManagerError      = this.getTurnManager().init(data.turnManager, playersCountUnneutral);
            if (turnManagerError) {
                return turnManagerError;
            }

            const field         = this.getField();
            const fieldError    = field.init({
                data                : data.field,
                configVersion,
                playersCountUnneutral,
            });
            if (fieldError) {
                return fieldError;
            }

            this._setWarId(data.warId);

            return ClientErrorCode.NoError;
        }

        protected _initView(): void {
            this.getView().init(this);
        }
        protected _fastInitView(): void {
            this.getView().fastInit(this);
        }
        public getView(): BwWarView {
            return this._view;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const settingsForCommon = this.getCommonSettingManager().serializeForSimulation();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const serialWarEventManager = this.getWarEventManager().serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`BwWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = this.getPlayerManager().serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`BwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = this.getTurnManager().serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`BwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = this.getField().serializeForSimulation();
            if (serialField == null) {
                Logger.error(`BwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForScw              : { isCheating: true },

                warId                       : this.getWarId(),
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
        public serializeForCreateMfw(): ISerialWar | undefined {
            const settingsForCommon = this.getCommonSettingManager().serializeForCreateMfw();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.serializeForCreateMfw() empty settingsForCommon.`);
                return undefined;
            }

            const serialWarEventManager = this.getWarEventManager().serializeForCreateMfw();
            if (serialWarEventManager == null) {
                Logger.error(`BwWar.serializeForCreateMfw() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = this.getPlayerManager().serializeForCreateMfw();
            if (serialPlayerManager == null) {
                Logger.error(`BwWar.serializeForCreateMfw() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = this.getTurnManager().serializeForCreateMfw();
            if (serialTurnManager == null) {
                Logger.error(`BwWar.serializeForCreateMfw() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = this.getField().serializeForCreateMfw();
            if (serialField == null) {
                Logger.error(`BwWar.serializeForCreateMfw() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForScw              : null,

                warId                       : this.getWarId(),
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

        protected _getWarEventManagerClass(): new () => BwWarEventManager {
            return BwWarEventManager;
        }
        protected _getCommonSettingManagerClass(): new () => BwCommonSettingManager {
            return BwCommonSettingManager;
        }

        public startRunning(): BwWar {
            this.getCommonSettingManager().startRunning(this);
            this.getWarEventManager().startRunning(this);
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._setIsRunning(true);

            return this;
        }
        public startRunningView(): BwWar {
            this.getView().startRunningView();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): BwWar {
            this.getField().stopRunning();
            this.getView().stopRunning();

            this._setIsRunning(false);

            return this;
        }

        private _setIsRunning(isRunning: boolean): void {
            this._isRunning = isRunning;
        }
        public getIsRunning(): boolean {
            return this._isRunning;
        }
        public getIsExecutingAction(): boolean {
            return this._isExecutingAction;
        }
        public setIsExecutingAction(isExecuting: boolean): void {
            this._isExecutingAction = isExecuting;
        }

        private _setWarId(warId: number): void {
            this._warId = warId;
        }
        public getWarId(): number {
            return this._warId;
        }

        public getConfigVersion(): string {
            return this.getCommonSettingManager().getConfigVersion();
        }

        public getWarRule(): ProtoTypes.WarRule.IWarRule {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getWarRule() empty settingsForCommon.`);
                return undefined;
            }

            return settingsForCommon.warRule;
        }

        public getPlayerManager(): BwPlayerManager {
            return this._playerManager;
        }
        public getPlayer(playerIndex: number): BwPlayer | undefined {
            return this.getPlayerManager().getPlayer(playerIndex);
        }
        public getPlayerInTurn(): BwPlayer {
            return this.getPlayerManager().getPlayerInTurn();
        }
        public getPlayerIndexInTurn(): number {
            return this.getTurnManager().getPlayerIndexInTurn();
        }

        public getField(): BwField {
            return this._field;
        }
        public getFogMap(): BwFogMap {
            return this.getField().getFogMap();
        }
        public getUnitMap(): BwUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): BwTileMap {
            return this.getField().getTileMap();
        }
        public getActionPlanner(): BwActionPlanner {
            return this.getField().getActionPlanner();
        }
        public getGridVisionEffect(): BwGridVisualEffect {
            return this.getField().getGridVisualEffect();
        }
        public getCursor(): BwCursor {
            return this.getField().getCursor();
        }

        public getTurnManager(): BwTurnManager {
            return this._turnManager;
        }
        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
        }

        public getWatcherTeamIndexes(watcherUserId: number): Set<number> {
            return this.getPlayerManager().getAliveWatcherTeamIndexes(watcherUserId);
        }

        public getWarEventManager(): BwWarEventManager {
            return this._warEventManager;
        }
        public getDrawVoteManager(): BwDrawVoteManager {
            return this._drawVoteManager;
        }
        public getRandomNumberManager(): BwRandomNumberManager {
            return this._randomNumberManager;
        }
        public getExecutedActionManager(): BwExecutedActionManager {
            return this._executedActionManager;
        }
        public getCommonSettingManager(): BwCommonSettingManager {
            return this._commonSettingManager;
        }
    }
}
