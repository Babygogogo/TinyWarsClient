
namespace TinyWars.BaseWar {
    import Logger                   = Utility.Logger;
    import Types                    = Utility.Types;
    import ProtoTypes               = Utility.ProtoTypes;
    import ClientErrorCode          = Utility.ClientErrorCode;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import IWarSettingsForCommon    = ProtoTypes.WarSettings.ISettingsForCommon;

    export abstract class BwWar {
        private _settingsForCommon          : IWarSettingsForCommon;

        private _warId                      : number;

        private _playerManager              : BwPlayerManager;
        private _field                      : BwField;
        private _turnManager                : BwTurnManager;
        private readonly _executedActionManager = new BwExecutedActionManager();
        private readonly _warEventManager       = new (this._getWarEventManagerClass())();
        private readonly _drawVoteManager       = new BwDrawVoteManager();

        private _view                   : BwWarView;
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
        protected abstract _getViewClass(): new () => BwWarView;

        protected _baseInit(data: ISerialWar): ClientErrorCode {
            const settingsForCommon = data.settingsForCommon;
            if (settingsForCommon == null) {
                Logger.error(`BwWar._baseInit() empty settingsForCommon.`);
                return undefined;
            }

            const drawVoteManagerError = this.getDrawVoteManager().init(data.playerManager, data.remainingVotesForDraw);
            if (drawVoteManagerError) {
                return drawVoteManagerError;
            }

            const dataForWarEventManager = data.warEventManager;
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
            this._setSettingsForCommon(settingsForCommon);
            this.getExecutedActionManager().init(isNeedReplay, data.executedActions || []);

            return ClientErrorCode.NoError;
        }

        protected _initView(): void {
            this._view = this._view || new (this._getViewClass());
            this._view.init(this);
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
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getConfigVersion() empty settingsForCommon.`);
                return undefined;
            }

            return settingsForCommon.configVersion;
        }

        private _setSettingsForCommon(settings: IWarSettingsForCommon): void {
            this._settingsForCommon = settings;
        }
        public getSettingsForCommon(): IWarSettingsForCommon | undefined {
            return this._settingsForCommon;
        }

        public getWarRule(): ProtoTypes.WarRule.IWarRule {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getWarRule() empty settingsForCommon.`);
                return undefined;
            }

            return settingsForCommon.warRule;
        }

        public getSettingsHasFogByDefault(): boolean | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsHasFogByDefault() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getHasFogByDefault(warRule);
        }
        public getSettingsIncomeMultiplier(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsIncomeMultiplier() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getIncomeMultiplier(warRule, playerIndex);
        }
        public getSettingsEnergyGrowthMultiplier(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsEnergyGrowthMultiplier() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getEnergyGrowthMultiplier(warRule, playerIndex);
        }
        public getSettingsAttackPowerModifier(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsAttackPowerModifier() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getAttackPowerModifier(warRule, playerIndex);
        }
        public getSettingsMoveRangeModifier(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsMoveRangeModifier() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getMoveRangeModifier(warRule, playerIndex);
        }
        public getSettingsVisionRangeModifier(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsVisionRangeModifier() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getVisionRangeModifier(warRule, playerIndex);
        }
        public getSettingsInitialFund(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsInitialFund() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getInitialFund(warRule, playerIndex);
        }
        public getSettingsInitialEnergyPercentage(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsInitialEnergyPercentage() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getInitialEnergyPercentage(warRule, playerIndex);
        }
        public getSettingsLuckLowerLimit(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsLuckLowerLimit() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getLuckLowerLimit(warRule, playerIndex);
        }
        public getSettingsLuckUpperLimit(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsLuckUpperLimit() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getLuckUpperLimit(warRule, playerIndex);
        }
        public getSettingsTeamIndex(playerIndex: number): number | null | undefined {
            const warRule = this.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWar.getSettingsTeamIndex() empty warRule.`);
                return undefined;
            }

            return BwSettingsHelper.getTeamIndex(warRule, playerIndex);
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
        public getGridVisionEffect(): BwGridVisionEffect {
            return this.getField().getGridVisionEffect();
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
    }
}
