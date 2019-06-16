
namespace TinyWars.Replay {
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import MapIndexKey      = Types.MapIndexKey;
    import Action           = Types.SerializedMcwAction;
    import SerializedMcwWar = Types.SerializedMcwWar;

    export class ReplayWar {
        private _warId                  : number;
        private _warName                : string;
        private _warPassword            : string;
        private _warComment             : string;
        private _configVersion          : number;
        private _mapIndexKey            : MapIndexKey;
        private _nextActionId           : number;
        private _executedActions        : Action[];
        private _remainingVotesForDraw  : number;
        private _timeLimit              : number;
        private _hasFogByDefault        : boolean;
        private _incomeModifier         : number;
        private _energyGrowthModifier   : number;
        private _attackPowerModifier    : number;
        private _moveRangeModifier      : number;
        private _visionRangeModifier    : number;
        private _initialFund            : number;
        private _initialEnergy          : number;

        private _isEnded        = false;

        private _playerManager  : ReplayPlayerManager;
        private _field          : ReplayField;
        private _turnManager    : ReplayTurnManager;

        private _view                           : ReplayWarView;
        private _isExecutingAction              = false;
        private _isRunningWar                   = false;
        private _isAutoReplay                   = false;
        private _isFastExecute                  = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDatasForCheckPointId        = new Map<number, SerializedMcwWar>();

        public constructor() {
        }

        public async init(data: SerializedMcwWar): Promise<ReplayWar> {
            this._warId                 = data.warId;
            this._warName               = data.warName;
            this._warPassword           = data.warPassword;
            this._warComment            = data.warComment;
            this._configVersion         = data.configVersion;
            this._executedActions       = data.executedActions;
            this._remainingVotesForDraw = data.remainingVotesForDraw;
            this._timeLimit             = data.timeLimit;
            this._hasFogByDefault       = data.hasFogByDefault;
            this._incomeModifier        = data.incomeModifier;
            this._energyGrowthModifier  = data.energyGrowthModifier;
            this._attackPowerModifier   = data.attackPowerModifier;
            this._moveRangeModifier     = data.moveRangeModifier;
            this._visionRangeModifier   = data.visionRangeModifier;
            this._initialFund           = data.initialFund;
            this._initialEnergy         = data.initialEnergy;
            this._setMapIndexKey(data);

            this.setCheckPointId(0, 0);
            this.setWarData(0, data);
            await this._loadCheckPoint(0);

            return this;
        }

        public startRunning(): ReplayWar {
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._isRunningWar = true;

            return this;
        }
        public startRunningView(): ReplayWar {
            this.getView().startRunning();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): ReplayWar {
            this.getField().stopRunning();
            this.getView().stopRunning();

            this._isRunningWar = false;

            return this;
        }

        public serialize(): SerializedMcwWar {
            const mapIndexKey = this.getMapIndexKey();
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._executedActions,
                nextActionId            : this.getNextActionId(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthModifier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                mapName                 : mapIndexKey.mapName,
                mapDesigner             : mapIndexKey.mapDesigner,
                mapVersion              : mapIndexKey.mapVersion,
                players                 : this.getPlayerManager().serialize(),
                field                   : this.getField().serialize(),
                turn                    : this.getTurnManager().serialize(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): ReplayWarView {
            return this._view;
        }

        public getIsExecutingAction(): boolean {
            return this._isExecutingAction;
        }
        public setIsExecutingAction(isExecuting: boolean): void {
            this._isExecutingAction = isExecuting;
        }

        public getIsAutoReplay(): boolean {
            return this._isAutoReplay;
        }
        public setIsAutoReplay(isAuto: boolean): void {
            if (this.getIsAutoReplay() !== isAuto) {
                this._isAutoReplay = isAuto;
                Notify.dispatch(Notify.Type.ReplayAutoReplayChanged);

                if ((isAuto) && (!this.getIsExecutingAction()) && (!this.getIsEnded())) {
                    ReplayModel.executeNextAction(this);
                }
            }
        }

        public getCheckPointId(nextActionId: number): number {
            return this._checkPointIdsForNextActionId.get(nextActionId);
        }
        public setCheckPointId(nextActionId: number, checkPointId: number): void {
            this._checkPointIdsForNextActionId.set(nextActionId, checkPointId);
        }

        public getWarData(checkPointId: number): SerializedMcwWar {
            return this._warDatasForCheckPointId.get(checkPointId);
        }
        public setWarData(checkPointId: number, warData: SerializedMcwWar): void {
            this._warDatasForCheckPointId.set(checkPointId, warData);
        }

        public checkIsInEnd(): boolean {
            return this.getNextActionId() >= this.getTotalActionsCount();
        }
        public loadNextCheckPoint(): void {

            // const actionId          = this.getCurrentActionId();
            // const currentCheckPoint = ;
            // const nextCheckPoint    = actionId >= 0 ? this._checkPointIdsForActionId.get(actionId) + 1 : undefined;

        }
        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            this.setIsAutoReplay(false);
            this.stopRunning();

            await this._loadCheckPoint(this.getCheckPointId(this.getNextActionId()) - 1);

            this.startRunning().startRunningView();
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const data = this.getWarData(checkPointId);
            this.setNextActionId(data.nextActionId || 0);

            this._setPlayerManager((this.getPlayerManager() || new ReplayPlayerManager()).init(data.players));
            this._setField(await (this.getField() || new ReplayField()).init(data.field, this._configVersion, this.getMapIndexKey()));
            this._setTurnManager((this.getTurnManager() ||new ReplayTurnManager()).init(data.turn));

            this._view = this._view || new ReplayWarView();
            this._view.init(this);
        }

        public getIsRunning(): boolean {
            return this._isRunningWar;
        }

        public getWarId(): number {
            return this._warId;
        }
        public getWarName(): string {
            return this._warName;
        }
        public getWarPassword(): string {
            return this._warPassword;
        }
        public getWarComment(): string {
            return this._warComment;
        }
        public getConfigVersion(): number {
            return this._configVersion;
        }

        public getSettingsTimeLimit(): number {
            return this._timeLimit;
        }
        public getSettingsHasFog(): boolean {
            return this._hasFogByDefault;
        }
        public getSettingsIncomeModifier(): number {
            return this._incomeModifier;
        }
        public getSettingsEnergyGrowthModifier(): number {
            return this._energyGrowthModifier;
        }
        public getSettingsAttackPowerModifier(): number {
            return this._attackPowerModifier;
        }
        public getSettingsMoveRangeModifier(): number {
            return this._moveRangeModifier;
        }
        public getSettingsVisionRangeModifier(): number {
            return this._visionRangeModifier;
        }
        public getSettingsInitialFund(): number {
            return this._initialFund;
        }
        public getSettingsInitialEnergy(): number {
            return this._initialEnergy;
        }

        private _setMapIndexKey(key: MapIndexKey): void {
            this._mapIndexKey = {
                mapName     : key.mapName,
                mapDesigner : key.mapDesigner,
                mapVersion  : key.mapVersion,
            };
        }
        public getMapIndexKey(): MapIndexKey {
            return this._mapIndexKey;
        }

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(actionId: number): void {
            this._nextActionId = actionId;
        }
        public getTotalActionsCount(): number {
            return this._executedActions.length;
        }
        public getNextAction(): Action {
            return this._executedActions[this.getNextActionId()];
        }

        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
        }

        public setRemainingVotesForDraw(votes: number | undefined): void {
            this._remainingVotesForDraw = votes;
        }
        public getRemainingVotesForDraw(): number | undefined {
            return this._remainingVotesForDraw;
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        private _setPlayerManager(manager: ReplayPlayerManager): void {
            this._playerManager = manager;
        }
        public getPlayerManager(): ReplayPlayerManager {
            return this._playerManager;
        }
        public getPlayer(playerIndex: number): ReplayPlayer | undefined {
            return this.getPlayerManager().getPlayer(playerIndex);
        }
        public getPlayerInTurn(): ReplayPlayer {
            return this.getPlayerManager().getPlayerInTurn();
        }

        private _setField(field: ReplayField): void {
            this._field = field;
        }
        public getField(): ReplayField {
            return this._field;
        }
        public getUnitMap(): ReplayUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): ReplayTileMap {
            return this.getField().getTileMap();
        }
        public getFogMap(): ReplayFogMap {
            return this.getField().getFogMap();
        }

        public getActionPlanner(): ReplayActionPlanner {
            return this.getField().getActionPlanner();
        }

        public getGridVisionEffect(): ReplayGridVisionEffect {
            return this.getField().getGridVisionEffect();
        }

        private _setTurnManager(manager: ReplayTurnManager): void {
            this._turnManager = manager;
        }
        public getTurnManager(): ReplayTurnManager {
            return this._turnManager;
        }
    }
}
