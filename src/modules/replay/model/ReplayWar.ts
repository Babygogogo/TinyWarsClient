
namespace TinyWars.Replay {
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import MapIndexKey      = Types.MapIndexKey;
    import Action           = Types.SerializedMcwAction;
    import SerializedMcwWar = Types.SerializedBwWar;

    export class ReplayWar extends BaseWar.BwWar {
        private _nextActionId           : number;
        private _executedActions        : Action[];

        private _playerManager  : ReplayPlayerManager;
        private _field          : ReplayField;
        private _turnManager    : ReplayTurnManager;

        private _view                           : ReplayWarView;
        private _isExecutingAction              = false;
        private _isRunningWar                   = false;
        private _isAutoReplay                   = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDatasForCheckPointId        = new Map<number, SerializedMcwWar>();

        public async init(data: SerializedMcwWar): Promise<ReplayWar> {
            await super.init(data);

            this._executedActions       = data.executedActions;

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

                if ((isAuto) && (!this.getIsExecutingAction()) && (!this.checkIsInEnd())) {
                    ReplayModel.executeNextAction(this, false);
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
        public async loadNextCheckPoint(): Promise<void> {
            const nextActionId      = this.getNextActionId();
            const isWaitBeginTurn   = this.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn;
            const checkPointId      = isWaitBeginTurn ? this.getCheckPointId(nextActionId) + 1 : this.getCheckPointId(nextActionId);

            if (this.getWarData(checkPointId)) {
                this.setIsAutoReplay(false);
                this.stopRunning();

                await this._loadCheckPoint(checkPointId);
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()})`);

            } else {
                this.setIsAutoReplay(false);

                if (!isWaitBeginTurn) {
                    this.stopRunning();
                    await this._loadCheckPoint(checkPointId - 1);
                    this.startRunning();
                }
                while (!this.getWarData(checkPointId)) {
                    await ReplayModel.executeNextAction(this, true);
                }

                this.stopRunning();
                await this._loadCheckPoint(checkPointId);
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()})`);
            }
        }
        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            this.setIsAutoReplay(false);
            this.stopRunning();

            await this._loadCheckPoint(this.getCheckPointId(this.getNextActionId()) - 1);
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()})`);
            this.startRunning().startRunningView();
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const data = this.getWarData(checkPointId);
            this.setNextActionId(data.nextActionId || 0);

            this._setPlayerManager((this.getPlayerManager() || new ReplayPlayerManager()).init(data.players));
            this._setField(await (this.getField() || new ReplayField()).init(data.field, this.getConfigVersion(), this.getMapIndexKey()));
            this._setTurnManager((this.getTurnManager() ||new ReplayTurnManager()).init(data.turn));

            this._view = this._view || new ReplayWarView();
            this._view.init(this);
        }

        public getIsRunning(): boolean {
            return this._isRunningWar;
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
