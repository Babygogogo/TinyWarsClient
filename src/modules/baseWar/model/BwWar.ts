
namespace TinyWars.BaseWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export abstract class BwWar {
        private _warId                      : number;

        private _playerManager              : BwPlayerManager;
        private _field                      : BwField;
        private _turnManager                : BwTurnManager;
        private readonly _commonSettingManager  = new (this._getCommonSettingManagerClass())();
        private readonly _executedActionManager = new BwExecutedActionManager();
        private readonly _warEventManager       = new (this._getWarEventManagerClass())();
        private readonly _drawVoteManager       = new BwDrawVoteManager();
        private readonly _view                  = new BwWarView();

        private _isRunning              = false;
        private _isExecutingAction      = false;

        public abstract init(data: ISerialWar): Promise<BwWar>;
        public abstract serializeForSimulation(): ISerialWar | undefined;
        public abstract getWarType(): Types.WarType;
        public abstract getMapId(): number | undefined;
        public abstract getIsNeedReplay(): boolean;
        protected abstract _getPlayerManagerClass(): new () => BwPlayerManager;
        protected abstract _getTurnManagerClass(): new () => BwTurnManager;
        protected abstract _getFieldClass(): new () => BwField;

        protected async _baseInit(data: ISerialWar): Promise<ClientErrorCode> {
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

            if (dataForWarEventManager == null) {
                Logger.error(`BwWar._baseInit() empty dataForWarEventManager.`);
                return undefined;
            }

            const isNeedReplay      = this.getIsNeedReplay();
            const warEventManager   = this.getWarEventManager().init(dataForWarEventManager);
            if (warEventManager == null) {
                Logger.error(`BwWar._baseInit() empty warEventManager.`);
                return undefined;
            }

            this._setWarId(data.warId);
            this.getExecutedActionManager().init(isNeedReplay, data.executedActions || []);

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

        protected _getWarEventManagerClass(): new () => BwWarEventManager {
            return BwWarEventManager;
        }
        protected _getCommonSettingManagerClass(): new () => BwCommonSettingManager {
            return BwCommonSettingManager;
        }

        public startRunning(): BwWar {
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

        protected _setPlayerManager(manager: BwPlayerManager): void {
            this._playerManager = manager;
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

        protected _setField(field: BwField): void {
            this._field = field;
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

        protected _setTurnManager(manager: BwTurnManager): void {
            this._turnManager = manager;
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
        public getExecutedActionManager(): BwExecutedActionManager {
            return this._executedActionManager;
        }
        public getCommonSettingManager(): BwCommonSettingManager {
            return this._commonSettingManager;
        }
    }
}
