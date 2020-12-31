
namespace TinyWars.ReplayWar {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import Helpers              = Utility.Helpers;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import BwHelpers            = BaseWar.BwHelpers;
    import WarType              = Types.WarType;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;

    type CheckPointData = {
        warData     : ISerialWar;
        nextActionId: number;
    }

    export class RwWar extends SinglePlayerWar.SpwWar {
        private _executedActions                : IWarActionContainer[];
        private _settingsForMcw                 : ProtoTypes.WarSettings.ISettingsForMcw;
        private _settingsForScw                 : ProtoTypes.WarSettings.ISettingsForScw;
        private _settingsForRmw                 : ProtoTypes.WarSettings.ISettingsForRmw;
        private _settingsForWrw                 : ProtoTypes.WarSettings.ISettingsForWrw;

        private _replayId                           : number;
        private _isAutoReplay                       = false;
        private _nextActionId                       = 0;
        private _checkPointIdsForNextActionId       = new Map<number, number>();
        private _checkPointDataListForCheckPointId  = new Map<number, CheckPointData>();

        public async init(warData: ISerialWar): Promise<RwWar> {
            if (!this._baseInit(warData)) {
                Logger.error(`ReplayWar.init() failed this._baseInit().`);
                return undefined;
            }

            const settingsForCommon = warData.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`ReplayWar.init() empty settingsForCommon! ${JSON.stringify(warData)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`ReplayWar.init() empty configVersion.`);
                return undefined;
            }

            const executedActions = warData.executedActions;
            if (executedActions == null) {
                Logger.error(`ReplayWar.executedActions() empty executedActions.`);
                return undefined;
            }

            const seedRandomInitialState = warData.seedRandomInitialState;
            if (seedRandomInitialState == null) {
                Logger.error(`RwWar.init() empty seedRandomInitialState.`);
                return undefined;
            }

            const seedRandomCurrentState = seedRandomInitialState;
            if (seedRandomCurrentState == null) {
                Logger.error(`RwWar.init() empty seedRandomCurrentState.`);
                return undefined;
            }

            const dataForPlayerManager = warData.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`ReplayWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = warData.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`ReplayWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = warData.field;
            if (dataForField == null) {
                Logger.error(`ReplayWar.init() empty dataForField.`);
                return undefined;
            }

            const mapSizeAndMaxPlayerIndex = await BwHelpers.getMapSizeAndMaxPlayerIndex(warData);
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error(`ReplayWar.init() invalid war data! ${JSON.stringify(warData)}`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`ReplayWar.init() empty playerManager.`);
                return undefined;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`ReplayWar.init() empty turnManager.`);
                return undefined;
            }

            const field = await (this.getField() || new (this._getFieldClass())()).init(dataForField, configVersion, mapSizeAndMaxPlayerIndex);
            if (field == null) {
                Logger.error(`ReplayWar.init() empty field.`);
                return undefined;
            }

            this._settingsForMcw = warData.settingsForMcw;
            this._settingsForScw = warData.settingsForScw;
            this._settingsForWrw = warData.settingsForMcw;
            this._settingsForRmw = warData.settingsForRmw;
            this._setRandomNumberGenerator(new Math.seedrandom("", { state: seedRandomCurrentState }));
            this._setSeedRandomInitialState(seedRandomInitialState);
            this._setAllExecutedActions(executedActions);
            this.setNextActionId(0);
            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);
            this._setField(field);

            const warDataForCheckPoint                  = Helpers.deepClone(warData);
            warDataForCheckPoint.seedRandomCurrentState = warDataForCheckPoint.seedRandomInitialState;
            this.setCheckPointId(0, 0);
            this.setCheckPointData(0, {
                nextActionId    : 0,
                warData         : warDataForCheckPoint,
            });

            // await Helpers.checkAndCallLater();

            this._initView();

            return this;
        }

        protected _getViewClass(): new () => RwWarView {
            return RwWarView;
        }
        protected _getFieldClass(): new () => RwField {
            return RwField;
        }
        protected _getPlayerManagerClass(): new () => RwPlayerManager {
            return RwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => RwTurnManager {
            return RwTurnManager;
        }

        public serializeForCheckPoint(): CheckPointData {
            const seedRandomCurrentState = this._getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty seedRandomCurrentState.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty field.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serialize();
            if (serialPlayerManager == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serialize();
            if (serialTurnManager == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serialize();
            if (serialField == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty serialField.`);
                return undefined;
            }

            return {
                nextActionId    : this.getNextActionId(),
                warData         : {
                    settingsForCommon           : null,
                    settingsForMcw              : null,
                    settingsForScw              : null,

                    warId                       : null,
                    seedRandomInitialState      : null,
                    seedRandomCurrentState,
                    executedActions             : null,
                    executedActionsCount        : null,
                    remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                    playerManager               : serialPlayerManager,
                    turnManager                 : serialTurnManager,
                    field                       : serialField,
                },
            };
        }

        public serializeForSimulation(): ISerialWar {
            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`Replay.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const seedRandomCurrentState = this._getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty seedRandomCurrentState.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty executedActionsCount`);
                return undefined;
            }

            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`ReplayWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForScw              : { isCheating: true },
                settingsForRmw              : null,
                settingsForWrw              : null,

                warId,
                seedRandomInitialState      : null,
                seedRandomCurrentState,
                executedActions             : [],
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public getWarType(): WarType {
            const hasFog = this.getSettingsHasFogByDefault();
            if (this._settingsForMcw) {
                return hasFog ? WarType.McwFog : WarType.McwStd;
            } else if (this._settingsForRmw) {
                return hasFog ? WarType.RmwFog : WarType.RmwStd;
            } else if (this._settingsForScw) {
                return WarType.Scw;
            } else if (this._settingsForWrw) {
                return WarType.Wrw;
            } else {
                Logger.error(`RwWar.getWarType() unknown warType.`);
                return undefined;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getReplayId(): number {
            return this._replayId;
        }
        public setReplayId(replayId: number): void {
            this._replayId = replayId;
        }

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(nextActionId: number): void {
            this._nextActionId = nextActionId;
            Notify.dispatch(Notify.Type.RwNextActionIdChanged);
        }

        public getIsAutoReplay(): boolean {
            return this._isAutoReplay;
        }
        public setIsAutoReplay(isAuto: boolean): void {
            if (this.getIsAutoReplay() !== isAuto) {
                this._isAutoReplay = isAuto;
                Notify.dispatch(Notify.Type.ReplayAutoReplayChanged);

                if ((isAuto) && (!this.getIsExecutingAction()) && (!this.checkIsInEnd())) {
                    RwActionExecutor.executeNextAction(this, false);
                }
            }
        }

        public getCheckPointId(nextActionId: number): number {
            return this._checkPointIdsForNextActionId.get(nextActionId);
        }
        public setCheckPointId(nextActionId: number, checkPointId: number): void {
            this._checkPointIdsForNextActionId.set(nextActionId, checkPointId);
        }

        public getCheckPointData(checkPointId: number): CheckPointData {
            return this._checkPointDataListForCheckPointId.get(checkPointId);
        }
        public setCheckPointData(checkPointId: number, data: CheckPointData): void {
            this._checkPointDataListForCheckPointId.set(checkPointId, data);
        }

        public checkIsInEnd(): boolean {
            return this.getNextActionId() >= this.getTotalActionsCount();
        }
        public async loadNextCheckPoint(): Promise<void> {
            const nextActionId      = this.getNextActionId();
            const isWaitBeginTurn   = this.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn;
            const checkPointId      = isWaitBeginTurn ? this.getCheckPointId(nextActionId) + 1 : this.getCheckPointId(nextActionId);

            if (this.getCheckPointData(checkPointId)) {
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
                while (!this.getCheckPointData(checkPointId)) {
                    // await Helpers.checkAndCallLater();
                    await RwActionExecutor.executeNextAction(this, true);
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
            const checkPointData    = this.getCheckPointData(checkPointId);
            const warData           = checkPointData.warData;
            const mapSize           = this.getTileMap().getMapSize();
            this.setNextActionId(checkPointData.nextActionId);
            this.getPlayerManager().fastInit(warData.playerManager);
            this.getTurnManager().fastInit(warData.turnManager);
            await this.getField().fastInit(
                warData.field,
                this.getConfigVersion(),
                {
                    mapHeight       : mapSize.height,
                    mapWidth        : mapSize.width,
                    maxPlayerIndex  : this.getPlayerManager().getTotalPlayersCount(false),
                }
            );
            this.setRemainingVotesForDraw(warData.remainingVotesForDraw);
            this._setRandomNumberGenerator(new Math.seedrandom("", { state: warData.seedRandomCurrentState }));

            await Helpers.checkAndCallLater();
            this._fastInitView();
        }

        public getTotalActionsCount(): number {
            return this._getAllExecutedActions().length;
        }
        public getNextAction(): IWarActionContainer {
            return this._getAllExecutedActions()[this.getNextActionId()];
        }
        private _setAllExecutedActions(actions: IWarActionContainer[]): void {
            this._executedActions = actions;
        }
        private _getAllExecutedActions(): IWarActionContainer[] {
            return this._executedActions;
        }

        public getRandomNumber(): number | undefined {
            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`RwWar.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator();
        }
    }
}
