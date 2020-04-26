
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import SerializedBwWar  = Types.SerializedWar;

    export abstract class BwWar {
        private _warId                  : number;
        private _warName                : string;
        private _warPassword            : string;
        private _warComment             : string;
        private _configVersion          : string;
        private _mapFileName            : string;
        private _warRuleIndex           : number | null | undefined;
        private _timeLimit              : number;
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
        private _nextActionId           : number;
        private _isRunning              = false;
        private _isExecutingAction      = false;

        public async abstract init(data: SerializedBwWar): Promise<BwWar>;
        protected abstract _getPlayerManagerClass(): new () => BwPlayerManager;
        protected abstract _getTurnManagerClass(): new () => BwTurnManager;
        protected abstract _getFieldClass(): new () => BwField;
        protected abstract _getViewClass(): new () => BwWarView;

        protected _baseInit(data: SerializedBwWar): BwWar {
            this._setWarId(data.warId);
            this._setWarName(data.warName);
            this._setWarPassword(data.warPassword);
            this._setWarComment(data.warComment);
            this._setConfigVersion(data.configVersion);
            this.setMapFileName(data.mapFileName);
            this._setRandomNumberGenerator(new Math.seedrandom("", { state: data.seedRandomState || true }));
            this._setWarRuleIndex(data.warRuleIndex);
            this._setSettingsTimeLimit(data.timeLimit);
            this._setSettingsHasFog(data.hasFogByDefault);
            this.setSettingsIncomeModifier(data.incomeModifier);
            this.setSettingsEnergyGrowthMultiplier(data.energyGrowthModifier);
            this.setSettingsAttackPowerModifier(data.attackPowerModifier);
            this.setSettingsMoveRangeModifier(data.moveRangeModifier);
            this.setSettingsVisionRangeModifier(data.visionRangeModifier);
            this.setSettingsInitialFund(data.initialFund);
            this.setSettingsInitialEnergy(data.initialEnergy);
            this._setSettingsBannedCoIdList(data.bannedCoIdList);
            this.setSettingsLuckLowerLimit(data.luckLowerLimit);
            this.setSettingsLuckUpperLimit(data.luckUpperLimit);

            this.setRemainingVotesForDraw(data.remainingVotesForDraw);

            return this;
        }
        protected _initView(): void {
            this._view = this._view || new (this._getViewClass());
            this._view.init(this);
        }

        public getView(): BwWarView {
            return this._view;
        }

        public startRunning(): BwWar {
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._isRunning = true;

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

            this._isRunning = false;

            return this;
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

        public setMapFileName(mapFileName: string): void {
            this._mapFileName = mapFileName;
        }
        public getMapFileName(): string {
            return this._mapFileName;
        }

        private _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        public getRandomNumberGenerator(): seedrandom.prng {
            return this._randomNumberGenerator;
        }

        private _setSettingsTimeLimit(timeLimit: number): void {
            this._timeLimit = timeLimit;
        }
        public getSettingsTimeLimit(): number {
            return this._timeLimit;
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
            this._luckLowerLimit = limit == null ? ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit : limit;
        }
        public getSettingsLuckLowerLimit(): number {
            return this._luckLowerLimit;
        }

        public setSettingsLuckUpperLimit(limit: number | null): void {
            this._luckUpperLimit = limit == null ? ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit : limit;
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

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(actionId: number): void {
            this._nextActionId = actionId;
        }

        protected _initPlayerManager(data: Types.SerializedPlayer[]): void {
            const playerManager = this.getPlayerManager() || new (this._getPlayerManagerClass())();
            playerManager.init(data);
            this._setPlayerManager(playerManager);
        }
        private _setPlayerManager(manager: BwPlayerManager): void {
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

        protected async _initField(
            data                        : Types.SerializedField,
            configVersion               : string,
            mapFileName                 : string | null | undefined,
            mapSizeAndMaxPlayerIndex    : Types.MapSizeAndMaxPlayerIndex,
        ): Promise<void> {
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error("BwWar._initField() empty mapSizeAndMaxPlayerIndex!");
            }
            const field = this.getField() || new (this._getFieldClass())();
            await field.init(data, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
            this._setField(field);
        }
        private _setField(field: BwField): void {
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

        protected _initTurnManager(data: Types.SerializedTurn): void {
            const turnManager = this.getTurnManager() || new (this._getTurnManagerClass())();
            turnManager.init(data);
            this._setTurnManager(turnManager);
        }
        private _setTurnManager(manager: BwTurnManager): void {
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
