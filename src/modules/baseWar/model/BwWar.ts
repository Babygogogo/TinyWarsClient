
namespace TinyWars.BaseWar {
    import Logger                   = Utility.Logger;
    import Notify                   = Utility.Notify;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import IWarSettingsForCommon    = ProtoTypes.WarSettings.ISettingsForCommon;
    import ISeedRandomState         = ProtoTypes.Structure.ISeedRandomState;

    export abstract class BwWar {
        private _settingsForCommon          : IWarSettingsForCommon;

        private _warId                      : number;
        private _executedActionsCount       : number;
        private _remainingVotesForDraw      : number | null | undefined;
        private _seedRandomInitialState     : ProtoTypes.Structure.ISeedRandomState;

        private _playerManager              : BwPlayerManager;
        private _field                      : BwField;
        private _turnManager                : BwTurnManager;
        private _randomNumberGenerator      : seedrandom.prng;

        private _view                   : BwWarView;
        private _isRunning              = false;
        private _isExecutingAction      = false;

        public async abstract init(data: ISerialWar): Promise<BwWar>;
        public abstract serializeForSimulation(): ISerialWar | undefined;
        protected abstract _getPlayerManagerClass(): new () => BwPlayerManager;
        protected abstract _getTurnManagerClass(): new () => BwTurnManager;
        protected abstract _getFieldClass(): new () => BwField;
        protected abstract _getViewClass(): new () => BwWarView;

        protected _baseInit(data: ISerialWar): BwWar {
            const settingsForCommon = data.settingsForCommon;
            if (settingsForCommon == null) {
                Logger.error(`BwWar._baseInit() empty settingsForCommon.`);
                return undefined;
            }

            const executedActionsCount = data.executedActionsCount;
            if (executedActionsCount == null) {
                Logger.error(`BwWar._baseInit() empty executedActionsCount.`);
                return undefined;
            }

            const seedRandomInitialState    = data.seedRandomInitialState;
            const seedRandomCurrentState    = executedActionsCount === 0 ? seedRandomInitialState : data.seedRandomCurrentState;
            if (seedRandomCurrentState == null) {
                Logger.error(`BwWar._baseInit() empty seedRandomCurrentState.`);
                return undefined;
            }

            this._setWarId(data.warId);
            this._setSettingsForCommon(settingsForCommon);
            this.setExecutedActionsCount(executedActionsCount);
            this._setRandomNumberGenerator(new Math.seedrandom("", { state: seedRandomCurrentState }));
            this._setSeedRandomInitialState(seedRandomInitialState);
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
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this.setIsRunning(true);

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

            this.setIsRunning(false);

            return this;
        }

        public setIsRunning(isRunning: boolean): void {
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

        public getMapId(): number {
            const settingsForCommon = this.getSettingsForCommon();
            return settingsForCommon ? settingsForCommon.mapId : undefined;
        }

        public getSettingsHasFogByDefault(): boolean | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsHasFogByDefault() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getHasFogByDefault(settingsForCommon);
        }
        public getSettingsIncomeMultiplier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsIncomeMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getIncomeMultiplier(settingsForCommon, playerIndex);
        }
        public getSettingsEnergyGrowthMultiplier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsEnergyGrowthMultiplier() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getEnergyGrowthMultiplier(settingsForCommon, playerIndex);
        }
        public getSettingsAttackPowerModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsAttackPowerModifier() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getAttackPowerModifier(settingsForCommon, playerIndex);
        }
        public getSettingsMoveRangeModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsMoveRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getMoveRangeModifier(settingsForCommon, playerIndex);
        }
        public getSettingsVisionRangeModifier(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsVisionRangeModifier() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getVisionRangeModifier(settingsForCommon, playerIndex);
        }
        public getSettingsInitialFund(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsInitialFund() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getInitialFund(settingsForCommon, playerIndex);
        }
        public getSettingsInitialEnergyPercentage(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsInitialEnergyPercentage() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getInitialEnergyPercentage(settingsForCommon, playerIndex);
        }
        public getSettingsLuckLowerLimit(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsLuckLowerLimit() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getLuckLowerLimit(settingsForCommon, playerIndex);
        }
        public getSettingsLuckUpperLimit(playerIndex: number): number | null | undefined {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getSettingsLuckUpperLimit() empty settingsForCommon.`);
                return undefined;
            }

            return BwSettingsHelper.getLuckUpperLimit(settingsForCommon, playerIndex);
        }

        protected _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        private _getRandomNumberGenerator(): seedrandom.prng {
            return this._randomNumberGenerator;
        }
        public getRandomNumber(): number | undefined {
            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwWar.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator();
        }
        protected _getSeedRandomCurrentState(): ISeedRandomState | undefined {
            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwWar.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator.state();
        }

        public setRemainingVotesForDraw(votes: number | undefined): void {
            this._remainingVotesForDraw = votes;
        }
        public getRemainingVotesForDraw(): number | undefined {
            return this._remainingVotesForDraw;
        }

        public getExecutedActionsCount(): number {
            return this._executedActionsCount;
        }
        public setExecutedActionsCount(count: number): void {
            this._executedActionsCount = count;
            Notify.dispatch(Notify.Type.BwExecutedActionsCountChanged);
        }

        private _setSeedRandomInitialState(state: ISeedRandomState): void {
            this._seedRandomInitialState = state;
        }
        protected _getSeedRandomInitialState(): ISeedRandomState | undefined {
            return this._seedRandomInitialState;
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
    }
}
