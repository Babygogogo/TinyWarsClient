
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
    import IActionContainer     = ProtoTypes.WarAction.IActionContainer;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;

    export class RwWar extends BaseWar.BwWar {
        private _executedActions                : IActionContainer[];
        private _settingsForMcw                 : ProtoTypes.WarSettings.ISettingsForMcw;
        private _settingsForScw                 : ProtoTypes.WarSettings.ISettingsForScw;
        private _settingsForRmw                 : ProtoTypes.WarSettings.ISettingsForRmw;
        private _settingsForWrw                 : ProtoTypes.WarSettings.ISettingsForWrw;

        private _isAutoReplay                   = false;
        private _checkPointIdsForNextActionId   = new Map<number, number>();
        private _warDataListForCheckPointId     = new Map<number, ISerialWar>();

        public async init(data: ISerialWar): Promise<RwWar> {
            if (!this._baseInit(data)) {
                Logger.error(`ReplayWar.init() failed this._baseInit().`);
                return undefined;
            }

            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`ReplayWar.init() empty settingsForCommon! ${JSON.stringify(data)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`ReplayWar.init() empty configVersion.`);
                return undefined;
            }

            const executedActions = data.executedActions;
            if (executedActions == null) {
                Logger.error(`ReplayWar.executedActions() empty executedActions.`);
                return undefined;
            }

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`ReplayWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = data.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`ReplayWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = data.field;
            if (dataForField == null) {
                Logger.error(`ReplayWar.init() empty dataForField.`);
                return undefined;
            }

            const mapSizeAndMaxPlayerIndex = await BwHelpers.getMapSizeAndMaxPlayerIndex(data);
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error(`ReplayWar.init() invalid war data! ${JSON.stringify(data)}`);
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

            this._settingsForMcw = data.settingsForMcw;
            this._settingsForScw = data.settingsForScw;
            this._settingsForWrw = data.settingsForMcw;
            this._settingsForRmw = data.settingsForRmw;
            this._setAllExecutedActions(executedActions);
            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);
            this._setField(field);

            this.setCheckPointId(0, 0);
            this.setWarData(0, data);

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

        public serializeForCheckPoint(): ISerialWar {
            const seedRandomCurrentState = this._getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty seedRandomCurrentState.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty executedActionsCount`);
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
                settingsForCommon           : null,
                settingsForMcw              : null,
                settingsForScw              : null,

                warId                       : null,
                seedRandomInitialState      : null,
                seedRandomCurrentState,
                executedActions             : null,
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
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
                settingsForScw              : null,

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
                    await RwActionExecutor.executeNextAction(this, true);
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

            const mapSize = this.getTileMap().getMapSize();
            this.setExecutedActionsCount(data.executedActionsCount);
            this.getPlayerManager().fastInit(data.playerManager);
            this.getTurnManager().fastInit(data.turnManager);
            await this.getField().fastInit(
                data.field,
                this.getConfigVersion(),
                {
                    mapHeight       : mapSize.height,
                    mapWidth        : mapSize.width,
                    maxPlayerIndex  : this.getPlayerManager().getTotalPlayersCount(false),
                }
            );
            this.setRemainingVotesForDraw(data.remainingVotesForDraw);
            this._setRandomNumberGenerator(new Math.seedrandom("", { state: data.seedRandomCurrentState }));

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
