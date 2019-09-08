
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import WarActionContainer   = Types.WarActionContainer;
    import SerializedWar        = Types.SerializedBwWar;

    export class ReplayWar extends BaseWar.BwWar {
        private _executedActions        : WarActionContainer[];

        private _isAutoReplay                   = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDataListForCheckPointId     = new Map<number, SerializedWar>();

        public async init(data: SerializedWar): Promise<ReplayWar> {
            await super.init(data);

            this._executedActions       = data.executedActions;

            this.setCheckPointId(0, 0);
            this.setWarData(0, data);
            await this._loadCheckPoint(0);

            return this;
        }

        protected _getViewClass(): new () => ReplayWarView {
            return ReplayWarView;
        }

        public serialize(): SerializedWar {
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
                bannedCoIdList          : this.getSettingsBannedCoIdList(),
                luckLowerLimit          : this.getSettingsLuckLowerLimit(),
                luckUpperLimit          : this.getSettingsLuckUpperLimit(),
                mapName                 : mapIndexKey.mapName,
                mapDesigner             : mapIndexKey.mapDesigner,
                mapVersion              : mapIndexKey.mapVersion,
                players                 : (this.getPlayerManager() as ReplayPlayerManager).serialize(),
                field                   : (this.getField() as ReplayField).serialize(),
                turn                    : (this.getTurnManager() as ReplayTurnManager).serialize(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
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

        public getWarData(checkPointId: number): SerializedWar {
            return this._warDataListForCheckPointId.get(checkPointId);
        }
        public setWarData(checkPointId: number, warData: SerializedWar): void {
            this._warDataListForCheckPointId.set(checkPointId, warData);
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
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex()})`);

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
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
            }
        }
        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            this.setIsAutoReplay(false);
            this.stopRunning();

            await this._loadCheckPoint(this.getCheckPointId(this.getNextActionId()) - 1);
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
            this.startRunning().startRunningView();
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const data = this.getWarData(checkPointId);
            this.setNextActionId(data.nextActionId || 0);

            this._setPlayerManager((this.getPlayerManager() || new ReplayPlayerManager()).init(data.players));
            this._setField(await (this.getField() || new ReplayField()).init(data.field, this.getConfigVersion(), this.getMapIndexKey()));
            this._setTurnManager((this.getTurnManager() ||new ReplayTurnManager()).init(data.turn));

            this._initView();
        }

        public getTotalActionsCount(): number {
            return this._executedActions.length;
        }
        public getNextAction(): WarActionContainer {
            return this._executedActions[this.getNextActionId()];
        }
    }
}
