
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import Helpers              = Utility.Helpers;
    import WarActionContainer   = Types.WarActionContainer;
    import SerializedWar        = Types.SerializedWar;

    export class ReplayWar extends BaseWar.BwWar {
        private _executedActions                : WarActionContainer[];

        private _isAutoReplay                   = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDataListForCheckPointId     = new Map<number, SerializedWar>();

        public async init(data: SerializedWar): Promise<ReplayWar> {
            this._baseInit(data);

            this._executedActions = data.executedActions;

            this.setCheckPointId(0, 0);
            this.setWarData(0, data);
            await this._loadCheckPoint(0);

            return this;
        }

        protected _getViewClass(): new () => ReplayWarView {
            return ReplayWarView;
        }
        protected _getFieldClass(): new () => ReplayField {
            return ReplayField;
        }
        protected _getPlayerManagerClass(): new () => ReplayPlayerManager {
            return ReplayPlayerManager;
        }
        protected _getTurnManagerClass(): new () => ReplayTurnManager {
            return ReplayTurnManager;
        }

        public serialize(): SerializedWar {
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._executedActions,
                nextActionId            : this.getNextActionId(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthMultiplier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                bannedCoIdList          : this.getSettingsBannedCoIdList(),
                luckLowerLimit          : this.getSettingsLuckLowerLimit(),
                luckUpperLimit          : this.getSettingsLuckUpperLimit(),
                mapFileName             : this.getMapFileName(),
                players                 : (this.getPlayerManager() as ReplayPlayerManager).serialize(),
                field                   : (this.getField() as ReplayField).serialize(),
                turn                    : (this.getTurnManager() as ReplayTurnManager).serialize(),
            };
        }

        public serializeForSimulation(): Types.SerializedWar {
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : [],
                nextActionId            : this.getNextActionId(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthMultiplier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                bannedCoIdList          : this.getSettingsBannedCoIdList(),
                luckLowerLimit          : this.getSettingsLuckLowerLimit(),
                luckUpperLimit          : this.getSettingsLuckUpperLimit(),
                singlePlayerWarType     : Types.SinglePlayerWarType.Custom,
                isSinglePlayerCheating  : true,
                mapFileName             : this.getMapFileName(),
                players                 : (this.getPlayerManager() as ReplayPlayerManager).serializeForSimulation(),
                field                   : (this.getField() as ReplayField).serializeForSimulation(),
                turn                    : (this.getTurnManager() as ReplayTurnManager).serializeForSimulation(),
                seedRandomState         : null,
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

                await Helpers.checkAndCallLater();
                await this._loadCheckPoint(checkPointId);
                await Helpers.checkAndCallLater();
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);

            } else {
                this.setIsAutoReplay(false);

                if (!isWaitBeginTurn) {
                    this.stopRunning();
                    await Helpers.checkAndCallLater();
                    await this._loadCheckPoint(checkPointId - 1);
                    await Helpers.checkAndCallLater();
                    this.startRunning();
                }
                while (!this.getWarData(checkPointId)) {
                    await Helpers.checkAndCallLater();
                    await ReplayModel.executeNextAction(this, true);
                }

                this.stopRunning();
                await Helpers.checkAndCallLater();
                await this._loadCheckPoint(checkPointId);
                await Helpers.checkAndCallLater();
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);
            }
        }
        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            this.setIsAutoReplay(false);
            this.stopRunning();

            await Helpers.checkAndCallLater();
            await this._loadCheckPoint(this.getCheckPointId(this.getNextActionId()) - 1);
            await Helpers.checkAndCallLater();
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const data = this.getWarData(checkPointId);
            this.setNextActionId(data.nextActionId || 0);

            this._initPlayerManager(data.players);
            await Helpers.checkAndCallLater();
            await this._initField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._initTurnManager(data.turn);

            await Helpers.checkAndCallLater();
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
