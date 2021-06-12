
namespace TinyWars.ReplayWar {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import Helpers              = Utility.Helpers;
    import Logger               = Utility.Logger;
    import ClientErrorCode      = Utility.ClientErrorCode;
    import ProtoTypes           = Utility.ProtoTypes;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import WarType              = Types.WarType;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;

    type CheckPointData = {
        warData     : ISerialWar;
        nextActionId: number;
    }

    export class RwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new RwPlayerManager();
        private readonly _turnManager           = new RwTurnManager();
        private readonly _field                 = new RwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        private _settingsForMcw: ProtoTypes.WarSettings.ISettingsForMcw;
        private _settingsForScw: ProtoTypes.WarSettings.ISettingsForScw;
        private _settingsForMrw: ProtoTypes.WarSettings.ISettingsForMrw;

        private _replayId                           : number;
        private _isAutoReplay                       = false;
        private _nextActionId                       = 0;
        private _checkPointIdsForNextActionId       = new Map<number, number>();
        private _checkPointDataListForCheckPointId  = new Map<number, CheckPointData>();

        public async init(warData: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(warData);
            if (baseInitError) {
                return baseInitError;
            }

            this._setSettingsForMcw(warData.settingsForMcw);
            this._setSettingsForScw(warData.settingsForScw);
            this._setSettingsForMrw(warData.settingsForMrw);
            this.setNextActionId(0);

            this.setCheckPointId(0, 0);
            this.setCheckPointData(0, {
                nextActionId    : 0,
                warData         : Helpers.deepClone(warData),
            });

            // await Helpers.checkAndCallLater();

            this._initView();

            return ClientErrorCode.NoError;
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getField(): RwField {
            return this._field;
        }
        public getPlayerManager(): RwPlayerManager {
            return this._playerManager;
        }
        public getTurnManager(): RwTurnManager {
            return this._turnManager;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // No need to update units.

            const tileMap       = this.getTileMap();
            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeam(this, this.getPlayerInTurn().getTeamIndex());
            tileMap.forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            });
            tileMap.getView().updateCoZone();
        }

        public serializeForCheckPoint(): CheckPointData {
            const randomNumberManager       = this.getRandomNumberManager();
            const seedRandomCurrentState    = randomNumberManager.getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty seedRandomCurrentState.`);
                return undefined;
            }

            const seedRandomInitialState = randomNumberManager.getSeedRandomInitialState();
            if (seedRandomInitialState == null) {
                Logger.error(`ReplayWar.serializeForCheckPoint() empty seedRandomInitialState.`);
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

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`RwWar.serializeForCheckPoint() empty warEventManager.`);
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

            const serialWarEventManager = warEventManager.serialize();
            if (serialWarEventManager == null) {
                Logger.error(`RwWar.serializeForCheckPoint() empty serialWarEventManager.`);
                return undefined;
            }

            return {
                nextActionId    : this.getNextActionId(),
                warData         : {
                    settingsForCommon           : null,
                    settingsForMcw              : null,
                    settingsForScw              : null,

                    warId                       : null,
                    seedRandomInitialState,
                    seedRandomCurrentState,
                    executedActions             : null,
                    remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                    warEventManager             : Helpers.deepClone(serialWarEventManager),
                    playerManager               : serialPlayerManager,
                    turnManager                 : serialTurnManager,
                    field                       : serialField,
                },
            };
        }

        public getWarType(): WarType {
            const hasFog = this.getCommonSettingManager().getSettingsHasFogByDefault();
            if (this._getSettingsForMcw()) {
                return hasFog ? WarType.McwFog : WarType.McwStd;
            } else if (this._getSettingsForMrw()) {
                return hasFog ? WarType.MrwFog : WarType.MrwStd;
            } else if (this._getSettingsForScw()) {
                return hasFog ? WarType.ScwFog : WarType.ScwStd;
            } else {
                Logger.error(`RwWar.getWarType() unknown warType.`);
                return undefined;
            }
        }
        public getIsNeedReplay(): boolean {
            return true;
        }
        public getMapId(): number | undefined {
            const settingsForMcw = this._getSettingsForMcw();
            if (settingsForMcw) {
                return settingsForMcw.mapId;
            }

            const settingsForMrw = this._getSettingsForMrw();
            if (settingsForMrw) {
                return settingsForMrw.mapId;
            }

            const settingsForScw = this._getSettingsForScw();
            if (settingsForScw) {
                return settingsForScw.mapId;
            }

            return undefined;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return RwWarMenuPanel.getIsOpening();
        }

        private _getSettingsForMcw(): ProtoTypes.WarSettings.ISettingsForMcw {
            return this._settingsForMcw;
        }
        private _setSettingsForMcw(value: ProtoTypes.WarSettings.ISettingsForMcw) {
            this._settingsForMcw = value;
        }
        private _getSettingsForScw(): ProtoTypes.WarSettings.ISettingsForScw {
            return this._settingsForScw;
        }
        private _setSettingsForScw(value: ProtoTypes.WarSettings.ISettingsForScw) {
            this._settingsForScw = value;
        }
        private _getSettingsForMrw(): ProtoTypes.WarSettings.ISettingsForMrw {
            return this._settingsForMrw;
        }
        private _setSettingsForMrw(value: ProtoTypes.WarSettings.ISettingsForMrw) {
            this._settingsForMrw = value;
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

        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public checkIsInEnd(): boolean {
            return this.getNextActionId() >= this.getTotalActionsCount();
        }

        public async loadNextCheckPoint(): Promise<void> {
            if (this.checkIsInEnd()) {
                return;
            }

            const checkPointId = this.getCheckPointId(this.getNextActionId()) + 1;
            this.setIsAutoReplay(false);

            while (!this.getCheckPointData(checkPointId)) {
                await Helpers.checkAndCallLater();
                await RwActionExecutor.executeNextAction(this, true);
            }
            this.stopRunning();
            await Helpers.checkAndCallLater();
            await this._loadCheckPoint(checkPointId);
            await Helpers.checkAndCallLater();
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            if (this.checkIsInBeginning()) {
                return;
            }

            const nextActionId = this.getNextActionId();
            const checkPointId = Math.min(this.getCheckPointId(nextActionId), this.getCheckPointId(nextActionId - 1));
            this.setIsAutoReplay(false);

            this.stopRunning();
            await Helpers.checkAndCallLater();
            await this._loadCheckPoint(checkPointId);
            await Helpers.checkAndCallLater();
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(Lang.Type.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const checkPointData        = this.getCheckPointData(checkPointId);
            const warData               = checkPointData.warData;
            const configVersion         = this.getConfigVersion();
            const playersCountUnneutral = this.getPlayerManager().getTotalPlayersCount(false);

            this.setNextActionId(checkPointData.nextActionId);
            this.getPlayerManager().fastInit(warData.playerManager, configVersion);
            this.getTurnManager().fastInit(warData.turnManager, playersCountUnneutral);
            this.getWarEventManager().fastInit(warData.warEventManager);
            this.getField().fastInit({
                data                    : warData.field,
                configVersion,
                playersCountUnneutral,
            });
            this.getDrawVoteManager().setRemainingVotes(warData.remainingVotesForDraw);
            this.getRandomNumberManager().init({
                isNeedReplay    : this.getIsNeedReplay(),
                initialState    : warData.seedRandomInitialState,
                currentState    : warData.seedRandomCurrentState,
            });

            await Helpers.checkAndCallLater();
            this._fastInitView();
        }

        public getTotalActionsCount(): number {
            return this.getExecutedActionManager().getExecutedActionsCount();
        }
        public getNextAction(): IWarActionContainer {
            return this.getExecutedActionManager().getExecutedAction(this.getNextActionId());
        }
    }
}
