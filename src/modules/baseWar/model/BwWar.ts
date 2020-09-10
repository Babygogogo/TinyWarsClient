
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import Notify                   = Utility.Notify;
    import ConfigManager            = Utility.ConfigManager;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import IWarSettingsForCommon    = ProtoTypes.WarSettings.ISettingsForCommon;
    import ISeedRandomState         = ProtoTypes.Structure.ISeedRandomState;

    export abstract class BwWar {
        private _warId                  : number;
        private _settingsForCommon      : IWarSettingsForCommon;
        private _seedRandomInitialState : ISeedRandomState;

        private _warName                : string;
        private _warPassword            : string;
        private _warComment             : string;
        private _configVersion          : string;
        private _warRuleIndex           : number | null | undefined;
        private _bootTimerParams        : number[];
        private _hasFogByDefault        : boolean;
        private _incomeModifier         : number;
        private _energyGrowthModifier   : number;
        private _attackPowerModifier    : number;
        private _moveRangeModifier      : number;
        private _visionRangeModifier    : number;
        private _initialFund            : number;
        private _initialEnergy          : number;
        private _bannedCoIdList         : number[];
        private _luckLowerLimit         : number;
        private _luckUpperLimit         : number;

        private _view                   : BwWarView;
        private _field                  : BwField;
        private _playerManager          : BwPlayerManager;
        private _turnManager            : BwTurnManager;
        private _randomNumberGenerator  : seedrandom.prng;
        private _remainingVotesForDraw  : number;
        private _executedActionsCount   : number;
        private _isRunning              = false;
        private _isExecutingAction      = false;

        public async abstract init(data: ISerialWar): Promise<BwWar>;
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
            this._setExecutedActionsCount(executedActionsCount);
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

        private _setWarName(warName: string): void {
            this._warName = warName;
        }
        public getWarName(): string {
            return this._warName;
        }

        private _setWarPassword(warPassword: string): void {
            this._warPassword = warPassword;
        }
        public getWarPassword(): string {
            return this._warPassword;
        }

        private _setWarComment(warComment: string): void {
            this._warComment = warComment;
        }
        public getWarComment(): string {
            return this._warComment;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }
        public getConfigVersion(): string {
            return this._configVersion;
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

        private _setRandomNumberGenerator(generator: seedrandom.prng): void {
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

        private _setSettingsBootTimerParams(params: number[]): void {
            this._bootTimerParams = params;
        }
        public getSettingsBootTimerParams(): number[] {
            return this._bootTimerParams;
        }
        public getBootRestTime(): number | null {
            const player = this.getPlayerInTurn();
            if (player.getPlayerIndex() === 0) {
                return null;
            } else {
                return (this.getEnterTurnTime() + player.getRestTimeToBoot() - Time.TimeModel.getServerTimestamp()) || null;
            }
        }

        private _setWarRuleIndex(index: number | null | undefined): void {
            this._warRuleIndex = index;
        }
        public getWarRuleIndex(): number | null | undefined {
            return this._warRuleIndex;
        }

        private _setSettingsHasFog(hasFog: boolean): void {
            this._hasFogByDefault = hasFog;
        }
        public getSettingsHasFog(): boolean {
            return this._hasFogByDefault;
        }

        public setSettingsIncomeModifier(incomeModifier: number): void {
            this._incomeModifier = incomeModifier;
        }
        public getSettingsIncomeModifier(): number {
            return this._incomeModifier;
        }

        public setSettingsEnergyGrowthMultiplier(energyGrowthModifier: number): void {
            this._energyGrowthModifier = energyGrowthModifier;
        }
        public getSettingsEnergyGrowthMultiplier(): number {
            return this._energyGrowthModifier;
        }

        public setSettingsAttackPowerModifier(attackPowerModifier: number): void {
            this._attackPowerModifier = attackPowerModifier;
        }
        public getSettingsAttackPowerModifier(): number {
            return this._attackPowerModifier;
        }

        public setSettingsMoveRangeModifier(moveRangeModifier: number): void {
            this._moveRangeModifier = moveRangeModifier;
        }
        public getSettingsMoveRangeModifier(): number {
            return this._moveRangeModifier;
        }

        public setSettingsVisionRangeModifier(visionRangeModifier: number): void {
            this._visionRangeModifier = visionRangeModifier;
        }
        public getSettingsVisionRangeModifier(): number {
            return this._visionRangeModifier;
        }

        public setSettingsInitialFund(initialFund: number): void {
            this._initialFund = initialFund;
        }
        public getSettingsInitialFund(): number {
            return this._initialFund;
        }

        public setSettingsInitialEnergy(initialEnergy: number): void {
            this._initialEnergy = initialEnergy;
        }
        public getSettingsInitialEnergy(): number {
            return this._initialEnergy;
        }

        private _setSettingsBannedCoIdList(list: number[] | null): void {
            this._bannedCoIdList = list || [];
        }
        public getSettingsBannedCoIdList(): number[] {
            return this._bannedCoIdList;
        }

        public setSettingsLuckLowerLimit(limit: number | null): void {
            this._luckLowerLimit = limit == null ? Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit : limit;
        }
        public getSettingsLuckLowerLimit(): number {
            return this._luckLowerLimit;
        }

        public setSettingsLuckUpperLimit(limit: number | null): void {
            this._luckUpperLimit = limit == null ? Utility.ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit : limit;
        }
        public getSettingsLuckUpperLimit(): number {
            return this._luckUpperLimit;
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
        protected _setExecutedActionsCount(count: number): void {
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

        protected async _fastInitField(
            data                        : Types.SerializedField,
            configVersion               : string,
            mapFileName                 : string | null | undefined,
            mapSizeAndMaxPlayerIndex    : Types.MapSizeAndMaxPlayerIndex,
        ): Promise<void> {
            await this.getField().fastInit(data, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
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

        protected _fastInitTurnManager(data: Types.SerializedTurn): void {
            this.getTurnManager().fastInit(data);
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
            return this.getPlayerManager().getWatcherTeamIndexes(watcherUserId);
        }
        public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
            return this.getPlayerManager().checkHasAliveWatcherTeam(watcherUserId);
        }
    }
}
