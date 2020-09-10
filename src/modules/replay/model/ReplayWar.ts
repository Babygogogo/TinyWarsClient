
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import Helpers              = Utility.Helpers;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import IActionContainer     = ProtoTypes.WarAction.IActionContainer;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;

    export class ReplayWar extends BaseWar.BwWar {
        private _executedActions                : IActionContainer[];

        private _isAutoReplay                   = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDataListForCheckPointId     = new Map<number, ISerialWar>();

        public async init(data: ISerialWar): Promise<ReplayWar> {
            this._baseInit(data);

            const executedActions = data.executedActions;
            if (executedActions == null) {
                Logger.error(`ReplayWar.executedActions() empty executedActions.`);
                return undefined;
            }

            this._setAllExecutedActions(executedActions);
            this.setCheckPointId(0, 0);
            this.setWarData(0, data);

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`ReplayWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`ReplayWar.init() empty playerManager.`);
                return undefined;
            }

            await Helpers.checkAndCallLater();
            await this._initField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._initTurnManager(data.turn);

            this._setPlayerManager(playerManager);

            await Helpers.checkAndCallLater();
            this._initView();

            return this;
        }

        private _fastInitPlayerManager(data: Types.SerializedPlayer[]): void {
            this.getPlayerManager().fastInit(data);
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

        public serialize(): ISerialWar {
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._getAllExecutedActions(),
                nextActionId            : this.getExecutedActionsCount(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                bootTimerParams         : this.getSettingsBootTimerParams(),
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
                mapFileName             : this.getMapId(),
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
                nextActionId            : this.getExecutedActionsCount(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                bootTimerParams         : this.getSettingsBootTimerParams(),
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
                mapFileName             : this.getMapId(),
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

        public getWarData(checkPointId: number): ISerialWar {
            return this._warDataListForCheckPointId.get(checkPointId);
        }
        public setWarData(checkPointId: number, warData: ISerialWar): void {
            this._warDataListForCheckPointId.set(checkPointId, warData);
        }

        public checkIsInEnd(): boolean {
            return this.getExecutedActionsCount() >= this.getTotalActionsCount();
        }
        public async loadNextCheckPoint(): Promise<void> {
            const nextActionId      = this.getExecutedActionsCount();
            const isWaitBeginTurn   = this.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn;
            const checkPointId      = isWaitBeginTurn ? this.getCheckPointId(nextActionId) + 1 : this.getCheckPointId(nextActionId);

            if (this.getWarData(checkPointId)) {
                this.setIsAutoReplay(false);
                this.stopRunning();

                await Helpers.checkAndCallLater();
                await this._loadCheckPoint(checkPointId);
                await Helpers.checkAndCallLater();
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getExecutedActionsCount()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);

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
                    // await Helpers.checkAndCallLater();
                    await ReplayModel.executeNextAction(this, true);
                }

                this.stopRunning();
                await Helpers.checkAndCallLater();
                await this._loadCheckPoint(checkPointId);
                await Helpers.checkAndCallLater();
                this.startRunning().startRunningView();
                FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getExecutedActionsCount()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);
            }
        }
        public checkIsInBeginning(): boolean {
            return this.getExecutedActionsCount() <= 0;
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            this.setIsAutoReplay(false);
            this.stopRunning();

            await Helpers.checkAndCallLater();
            await this._loadCheckPoint(this.getCheckPointId(this.getExecutedActionsCount()) - 1);
            await Helpers.checkAndCallLater();
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getExecutedActionsCount()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex() + 1})`);
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const data = this.getWarData(checkPointId);
            this._setExecutedActionsCount(data.nextActionId || 0);

            this._fastInitPlayerManager(data.players);
            await Helpers.checkAndCallLater();
            await this._fastInitField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._fastInitTurnManager(data.turn);

            await Helpers.checkAndCallLater();
            this._fastInitView();
        }

        public getTotalActionsCount(): number {
            return this._getAllExecutedActions().length;
        }
        public getNextAction(): IActionContainer {
            return this._getAllExecutedActions()[this.getExecutedActionsCount()];
        }
        private _setAllExecutedActions(actions: IActionContainer[]): void {
            this._executedActions = actions;
        }
        private _getAllExecutedActions(): IActionContainer[] {
            return this._executedActions;
        }
    }
}
