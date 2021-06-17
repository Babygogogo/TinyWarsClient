
namespace TinyWars.BaseWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import WarAction        = ProtoTypes.WarAction;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export abstract class BwWar {
        private readonly _executedActionManager = new BwExecutedActionManager();
        private readonly _randomNumberManager   = new BwRandomNumberManager();
        private readonly _drawVoteManager       = new BwDrawVoteManager();
        private readonly _view                  = new BwWarView();

        private _warId                  : number;
        private _isRunning              = false;
        private _isExecutingAction      = false;
        private _isEnded                = false;

        public abstract init(data: ISerialWar): Promise<ClientErrorCode>;
        public abstract getWarType(): Types.WarType;
        public abstract getMapId(): number | undefined;
        public abstract getIsNeedExecutedAction(): boolean;
        public abstract getIsNeedSeedRandom(): boolean;
        public abstract getIsWarMenuPanelOpening(): boolean;
        public abstract getCanCheat(): boolean;
        public abstract getPlayerManager(): BwPlayerManager;
        public abstract getTurnManager(): BwTurnManager;
        public abstract getField(): BwField;
        public abstract getCommonSettingManager(): BwCommonSettingManager;
        public abstract getWarEventManager(): BaseWar.BwWarEventManager;
        public abstract updateTilesAndUnitsOnVisibilityChanged(): void;
        public abstract getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | undefined>;
        public abstract getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | undefined>;
        public abstract getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | undefined>;
        public abstract getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | undefined>;
        public abstract getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | undefined>;
        public abstract getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | undefined>;
        public abstract getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | undefined>;
        public abstract getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | undefined>;
        public abstract getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | undefined>;
        public abstract getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | undefined>;
        public abstract getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | undefined>;
        public abstract getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | undefined>;
        public abstract getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | undefined>;
        public abstract getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | undefined>;
        public abstract getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | undefined>;
        public abstract getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | undefined>;
        public abstract getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | undefined>;
        public abstract getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | undefined>;
        public abstract getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | undefined>;
        public abstract getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | undefined>;
        public abstract getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | undefined>;
        public abstract getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | undefined>;
        public abstract getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | undefined>;
        public abstract getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | undefined>;
        public abstract getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | undefined>;

        protected async _baseInit(data: ISerialWar): Promise<ClientErrorCode> {
            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                return ClientErrorCode.BwWarBaseInit00;
            }

            const configVersion = settingsForCommon.configVersion;
            if ((configVersion == null) || (!await ConfigManager.checkIsVersionValid(configVersion))) {
                return ClientErrorCode.BwWarBaseInit01;
            }

            const drawVoteManagerError = this.getDrawVoteManager().init(data.playerManager, data.remainingVotesForDraw);
            if (drawVoteManagerError) {
                return drawVoteManagerError;
            }

            const dataForWarEventManager    = data.warEventManager;
            const commonSettingManagerError = await this.getCommonSettingManager().init({
                settings                : data.settingsForCommon,
                allWarEventIdArray      : WarEvent.WarEventHelper.getAllWarEventIdArray(dataForWarEventManager ? dataForWarEventManager.warEventFullData : undefined),
                playersCountUnneutral   : BwHelpers.getPlayersCountUnneutral(data.playerManager),
            });
            if (commonSettingManagerError) {
                return commonSettingManagerError;
            }

            const warEventManagerError = this.getWarEventManager().init(dataForWarEventManager);
            if (warEventManagerError) {
                return warEventManagerError;
            }

            const randomNumberManagerError  = this.getRandomNumberManager().init({
                isNeedSeedRandom: this.getIsNeedSeedRandom(),
                initialState    : data.seedRandomInitialState,
                currentState    : data.seedRandomCurrentState,
            });
            if (randomNumberManagerError) {
                return randomNumberManagerError;
            }

            const executedActionManagerError = this.getExecutedActionManager().init(this.getIsNeedExecutedAction(), data.executedActions || []);
            if (executedActionManagerError) {
                return executedActionManagerError;
            }

            const playerManager         = this.getPlayerManager();
            const playerManagerError    = playerManager.init(data.playerManager, configVersion);
            if (playerManagerError) {
                return playerManagerError;
            }

            const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
            const turnManagerError      = this.getTurnManager().init(data.turnManager, playersCountUnneutral);
            if (turnManagerError) {
                return turnManagerError;
            }

            const field         = this.getField();
            const fieldError    = field.init({
                data                : data.field,
                configVersion,
                playersCountUnneutral,
            });
            if (fieldError) {
                return fieldError;
            }

            this._setWarId(data.warId);

            return ClientErrorCode.NoError;
        }

        protected _initView(): void {
            this.getView().init(this);
        }
        protected _fastInitView(): void {
            this.getView().fastInit(this);
        }
        public getView(): BwWarView {
            return this._view;
        }

        public serializeForCreateSfw(): ISerialWar | undefined {
            const settingsForCommon = this.getCommonSettingManager().serializeForCreateSfw();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.serializeForCreateSfw() empty settingsForCommon.`);
                return undefined;
            }

            const serialWarEventManager = this.getWarEventManager().serializeForCreateSfw();
            if (serialWarEventManager == null) {
                Logger.error(`BwWar.serializeForCreateSfw() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = this.getPlayerManager().serializeForCreateSfw();
            if (serialPlayerManager == null) {
                Logger.error(`BwWar.serializeForCreateSfw() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = this.getTurnManager().serializeForCreateSfw();
            if (serialTurnManager == null) {
                Logger.error(`BwWar.serializeForCreateSfw() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = this.getField().serializeForCreateSfw();
            if (serialField == null) {
                Logger.error(`BwWar.serializeForCreateSfw() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForScw              : null,
                settingsForSfw              : null,

                warId                       : this.getWarId(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }
        public serializeForCreateMfr(): ISerialWar | undefined {
            const settingsForCommon = this.getCommonSettingManager().serializeForCreateMfr();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.serializeForCreateMfr() empty settingsForCommon.`);
                return undefined;
            }

            const serialWarEventManager = this.getWarEventManager().serializeForCreateMfr();
            if (serialWarEventManager == null) {
                Logger.error(`BwWar.serializeForCreateMfr() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = this.getPlayerManager().serializeForCreateMfr();
            if (serialPlayerManager == null) {
                Logger.error(`BwWar.serializeForCreateMfr() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = this.getTurnManager().serializeForCreateMfr();
            if (serialTurnManager == null) {
                Logger.error(`BwWar.serializeForCreateMfr() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = this.getField().serializeForCreateMfr();
            if (serialField == null) {
                Logger.error(`BwWar.serializeForCreateMfr() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForScw              : null,

                warId                       : this.getWarId(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public startRunning(): BwWar {
            this.getCommonSettingManager().startRunning(this);
            this.getWarEventManager().startRunning(this);
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._setIsRunning(true);

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

            this._setIsRunning(false);

            return this;
        }

        private _setIsRunning(isRunning: boolean): void {
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

        public checkCanEnd(): boolean | undefined {
            const aliveTeamsCount = this.getPlayerManager().getAliveOrDyingTeamsCount(false);
            if (aliveTeamsCount == null) {
                Logger.error(`BwWar.checkCanEnd() empty aliveTeamsCount.`);
                return undefined;
            }

            return (aliveTeamsCount <= 1)
                || (this.getDrawVoteManager().checkIsDraw());
        }
        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        private _setWarId(warId: number): void {
            this._warId = warId;
        }
        public getWarId(): number {
            return this._warId;
        }

        public getConfigVersion(): string {
            return this.getCommonSettingManager().getConfigVersion();
        }

        public getWarRule(): ProtoTypes.WarRule.IWarRule {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`BwWar.getWarRule() empty settingsForCommon.`);
                return undefined;
            }

            return settingsForCommon.warRule;
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
        public getGridVisionEffect(): BwGridVisualEffect {
            return this.getField().getGridVisualEffect();
        }
        public getCursor(): BwCursor {
            return this.getField().getCursor();
        }

        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
        }
        public getTurnPhaseCode(): Types.TurnPhaseCode | null | undefined {
            return this.getTurnManager().getPhaseCode();
        }

        public getWatcherTeamIndexes(watcherUserId: number): Set<number> {
            return this.getPlayerManager().getAliveWatcherTeamIndexes(watcherUserId);
        }

        public getDrawVoteManager(): BwDrawVoteManager {
            return this._drawVoteManager;
        }
        public getRandomNumberManager(): BwRandomNumberManager {
            return this._randomNumberManager;
        }
        public getExecutedActionManager(): BwExecutedActionManager {
            return this._executedActionManager;
        }
    }
}
