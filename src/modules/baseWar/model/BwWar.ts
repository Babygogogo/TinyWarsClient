
namespace TinyWars.BaseWar {
    import Logger                   = Utility.Logger;
    import Types                    = Utility.Types;
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import IWarSettingsForCommon    = ProtoTypes.WarSettings.ISettingsForCommon;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;

    export abstract class BwWar {
        private _settingsForCommon          : IWarSettingsForCommon;

        private _warId                      : number;
        private _remainingVotesForDraw      : number | null | undefined;
        private _executedActions            : IWarActionContainer[];

        private _playerManager              : BwPlayerManager;
        private _field                      : BwField;
        private _turnManager                : BwTurnManager;
        private _warEventManager            : BwWarEventManager;

        private _view                   : BwWarView;
        private _isRunning              = false;
        private _isExecutingAction      = false;

        public abstract init(data: ISerialWar): Promise<BwWar>;
        public abstract serializeForSimulation(): ISerialWar | undefined;
        public abstract getWarType(): Types.WarType;
        public abstract getMapId(): number | undefined;
        protected abstract _getPlayerManagerClass(): new () => BwPlayerManager;
        protected abstract _getTurnManagerClass(): new () => BwTurnManager;
        protected abstract _getFieldClass(): new () => BwField;
        protected abstract _getViewClass(): new () => BwWarView;
        protected abstract _getWarEventManagerClass(): new () => BwWarEventManager;

        protected _baseInit(data: ISerialWar): BwWar {
            const settingsForCommon = data.settingsForCommon;
            if (settingsForCommon == null) {
                Logger.error(`BwWar._baseInit() empty settingsForCommon.`);
                return undefined;
            }

            const dataForWarEventManager = data.warEventManager;
            if (dataForWarEventManager == null) {
                Logger.error(`BwWar._baseInit() empty dataForWarEventManager.`);
                return undefined;
            }

            const warEventManager = (this.getWarEventManager() || new (this._getWarEventManagerClass())()).init(dataForWarEventManager);
            if (warEventManager == null) {
                Logger.error(`BwWar._baseInit() empty warEventManager.`);
                return undefined;
            }

            this._setWarId(data.warId);
            this._setSettingsForCommon(settingsForCommon);
            this._setAllExecutedActions(data.executedActions || []);
            this._setWarEventManager(warEventManager);
            this.setRemainingVotesForDraw(data.remainingVotesForDraw);

            return this;
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

        public setRemainingVotesForDraw(votes: number | undefined): void {
            this._remainingVotesForDraw = votes;
        }
        public getRemainingVotesForDraw(): number | undefined {
            return this._remainingVotesForDraw;
        }

        public getExecutedActionsCount(): number {
            return this._getAllExecutedActions().length;
        }
        private _setAllExecutedActions(actions: IWarActionContainer[]): void {
            this._executedActions = actions;
        }
        protected _getAllExecutedActions(): IWarActionContainer[] | null {
            return this._executedActions;
        }
        public addExecutedAction(action: IWarActionContainer): void {
            if (this.getExecutedActionsCount() !== action.actionId) {
                Logger.error(`BwWar.addExecutedAction() invalid actionId.`);
                return;
            }

            this._getAllExecutedActions().push(Helpers.deepClone(action));
        }
        public addEmptyExecutedAction(): void {
            this._getAllExecutedActions().push({});
        }
        public getExecutedAction(actionId: number): IWarActionContainer | undefined {
            return this._getAllExecutedActions()[actionId];
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

        private _setWarEventManager(manager: BwWarEventManager): void {
            this._warEventManager = manager;
        }
        public getWarEventManager(): BwWarEventManager | undefined {
            return this._warEventManager;
        }

        public getWatcherTeamIndexes(watcherUserId: number): Set<number> {
            return this.getPlayerManager().getAliveWatcherTeamIndexes(watcherUserId);
        }
    }
}
